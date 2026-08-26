// 냉장고 문 · 도어 포켓 판별 (docs/03_냉장고_디자인_스펙.md 7-1 "경로 A")
// storageGuide.js와 완전히 같은 패턴 — 이름 키워드만으로 위치(문/선반)를 추정하는 순수 함수.
// ingredient.category(온도 구분)는 절대 건드리지 않는다. 소스류는 여전히 category: 'fridge'이며,
// 이 함수는 그중에서 "문에 꽂혀 있어야 할 것"만 별도로 골라내는 시각적 분류용 파생 로직이다.
const DOOR_KEYWORDS = [
  '케찹',
  '마요네즈',
  '고추장',
  '된장',
  '쌈장',
  '춘장',
  '간장',
  '굴소스',
  '머스타드',
  '드레싱',
  '잼',
  '올리고당',
  '물엿',
  '소스',
]

/**
 * 재료명으로 도어 포켓(문) 소속 여부를 판별한다.
 * @param {string} name
 * @returns {boolean}
 */
export function isDoorItem(name) {
  return DOOR_KEYWORDS.some((k) => name.includes(k))
}
