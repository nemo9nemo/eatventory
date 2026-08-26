// 재료명 키워드 → 권장 보관 구분(실온/냉장/냉동) 매핑
// 재료 추가 시 이름을 기준으로 보관 구분을 자동 추천하는 데 사용한다.
// 순서가 중요하다: 더 구체적인 키워드(예: '다진마늘')가 일반 키워드('마늘')보다
// 먼저 검사되어야 한다 — find()가 배열 순서대로 첫 매칭에서 멈추기 때문이다.
const STORAGE_RULES = [
  { category: 'frozen', keywords: ['다진마늘', '냉동만두', '만두', '새우', '아이스크림', '생선'] },
  { category: 'fridge', keywords: ['계란', '대파', '두부', '우유', '밥', '버터', '치즈', '요거트', '김치', '상추', '당근', '베이컨'] },
  { category: 'room', keywords: ['식용유', '양파', '감자', '고구마', '마늘', '바나나', '설탕', '소금', '밀가루', '참기름'] },
]

/**
 * 재료명으로 보관 구분을 추천한다. 매칭되는 규칙이 없으면 null을 반환한다.
 * @param {string} name
 * @returns {'room' | 'fridge' | 'frozen' | null}
 */
export function guessStorageCategory(name) {
  const trimmed = name.trim()
  if (!trimmed) return null
  const rule = STORAGE_RULES.find((r) => r.keywords.some((keyword) => trimmed.includes(keyword)))
  return rule ? rule.category : null
}
