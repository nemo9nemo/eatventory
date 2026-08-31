const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 지원해요.' })
    return
  }

  const { ingredients } = req.body ?? {}
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400).json({ error: '재료 목록이 비어 있어요.' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: '서버에 ANTHROPIC_API_KEY가 설정되어 있지 않아요.' })
    return
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildPrompt(ingredients) }],
      }),
    })

    if (!response.ok) {
      res.status(502).json({ error: `AI 서버 호출에 실패했어요. (${response.status})` })
      return
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text ?? ''
    const parsed = parseRecipeResponse(text)

    if (!parsed) {
      res.status(502).json({ error: 'AI 응답을 해석하지 못했어요.' })
      return
    }

    const recipes = parsed.recipes.map((recipe, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      ...recipe,
    }))

    res.status(200).json({ recipes })
  } catch (err) {
    res.status(500).json({ error: '레시피 생성 중 오류가 발생했어요.' })
  }
}

function buildPrompt(ingredients) {
  return `당신은 한국 가정식 레시피를 추천하는 요리 도우미입니다.
아래 재료 목록을 최대한 활용해서 만들 수 있는 요리를 추천해주세요.

보유 재료: ${ingredients.join(', ')}

규칙:
- 소금, 후추, 설탕, 식용유, 물, 간장처럼 흔한 조미료는 없어도 있다고 가정해도 되지만, 실제로 사용했다면 missingIngredients에 적어주세요.
- 위에 나열된 보유 재료를 가능한 한 많이 사용하는 요리를 우선하세요. 보유 재료만으로 완성되는 요리가 있다면 그것부터 제안하세요.
- 좋은 요리 하나만 떠오르면 1개만, 여러 방향이 있으면 최대 3개까지 제안하세요.
- 각 요리의 조리 순서는 한국어로 4~7단계 정도로 간결하게 작성하세요.
- 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명, 마크다운, 코드블록 없이 순수 JSON만 출력하세요.

{
  "recipes": [
    {
      "name": "요리 이름",
      "time": "예상 조리 시간 (예: 15분)",
      "difficulty": "쉬움 | 보통 | 어려움 중 하나",
      "usedIngredients": ["보유 재료 중 이 요리에 실제로 사용하는 것들"],
      "missingIngredients": ["추가로 필요한 재료 (없으면 빈 배열)"],
      "steps": ["조리 순서 1", "조리 순서 2"]
    }
  ]
}`
}

function parseRecipeResponse(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')

  try {
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed.recipes)) return null
    return parsed
  } catch {
    return null
  }
}
