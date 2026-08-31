// 식품안전나라(식약처) "조리식품의 레시피 DB" 오픈 API에서 레시피를 받아와
// src/data/recipes.json으로 저장하는 1회성 스크립트.
//
// 사용법:
//   FOOD_SAFETY_API_KEY=발급받은키 node scripts/fetch-recipes.mjs
//
// 키가 없으면 공개 샘플 키("sample")로 동작하지만, 샘플 키는 5건만 반환한다.
// 정식 키는 https://www.foodsafetykorea.go.kr 회원가입 후 "COOKRCP01" 서비스
// 활용신청으로 발급받는다 (무료).

import { writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.join(__dirname, '../src/data/recipes.json')
const PAGE_SIZE = 1000

const apiKey = process.env.FOOD_SAFETY_API_KEY || 'sample'
if (apiKey === 'sample') {
  console.warn('[fetch-recipes] FOOD_SAFETY_API_KEY가 없어 샘플 키로 실행합니다 (최대 5건만 반환됨).')
}

async function fetchPage(start, end) {
  const url = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/COOKRCP01/json/${start}/${end}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API 호출 실패 (${res.status})`)
  const data = await res.json()
  const body = data?.COOKRCP01
  if (!body) throw new Error(`예상치 못한 응답: ${JSON.stringify(data).slice(0, 300)}`)
  if (body.RESULT && body.RESULT.CODE !== 'INFO-000') {
    throw new Error(`API 오류: ${body.RESULT.CODE} ${body.RESULT.MSG}`)
  }
  return { rows: body.row ?? [], total: Number(body.total_count ?? 0) }
}

async function fetchAll() {
  const all = []
  let start = 1
  let total = Infinity

  while (start <= total) {
    const end = start + PAGE_SIZE - 1
    const { rows, total: totalCount } = await fetchPage(start, end)
    total = totalCount
    all.push(...rows)
    console.log(`[fetch-recipes] ${start}-${end} → ${rows.length}건 (누적 ${all.length}/${total})`)
    if (rows.length === 0 || rows.length < PAGE_SIZE) break
    start += PAGE_SIZE
  }

  return all
}

const QUANTITY_WORDS = ['약간', '조금', '적당량', '적당히', '톡톡', '한줌', '한 줌', '소량']

function stopIndex(token) {
  let idx = -1
  const digitMatch = token.match(/[0-9]/)
  if (digitMatch) idx = digitMatch.index
  for (const w of QUANTITY_WORDS) {
    const i = token.indexOf(w)
    if (i !== -1 && (idx === -1 || i < idx)) idx = i
  }
  return idx
}

function parseIngredients(raw) {
  if (!raw) return []
  const names = []
  const seen = new Set()
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  for (const line of lines) {
    const cleaned = line.replace(/^\[[^\]]*\]/, '')
    const tokens = cleaned.split(',')
    for (let token of tokens) {
      token = token.trim()
      if (!token) continue
      const colonIdx = token.indexOf(':')
      if (colonIdx !== -1 && colonIdx < token.length - 1) {
        token = token.slice(colonIdx + 1).trim()
      }
      token = token.replace(/^[●·\-•\s]+/, '')
      if (!token) continue
      const idx = stopIndex(token)
      if (idx === -1) continue
      let name = token.slice(0, idx).trim()
      name = name.replace(/[·:()\s]+$/, '').trim()
      if (name && name.length >= 1 && name.length <= 12 && !seen.has(name)) {
        seen.add(name)
        names.push(name)
      }
    }
  }
  return names
}

function parseSteps(row) {
  const steps = []
  for (let i = 1; i <= 20; i++) {
    const key = 'MANUAL' + String(i).padStart(2, '0')
    let text = row[key]
    if (!text) continue
    text = text.trim()
    text = text.replace(/^\d+\.\s*/, '')
    text = text.replace(/([.!?])[a-z]$/i, '$1')
    if (text) steps.push(text)
  }
  return steps
}

function transform(row) {
  const ingredients = parseIngredients(row.RCP_PARTS_DTLS)
  const steps = parseSteps(row)
  if (ingredients.length === 0 || steps.length === 0) return null

  return {
    id: Number(row.RCP_SEQ),
    name: row.RCP_NM.replace(/\s+/g, ' ').trim(),
    category: row.RCP_PAT2 || null,
    method: row.RCP_WAY2 || null,
    ingredients,
    steps,
    image: row.ATT_FILE_NO_MAIN || row.MANUAL_IMG01 || null,
  }
}

const rawRows = await fetchAll()
const recipes = rawRows.map(transform).filter(Boolean)

await writeFile(OUT_PATH, JSON.stringify(recipes, null, 2) + '\n', 'utf-8')
console.log(`[fetch-recipes] ${recipes.length}개 레시피를 ${OUT_PATH}에 저장했습니다.`)
