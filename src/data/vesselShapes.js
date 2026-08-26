// 재료 실루엣(Vessel Shape) 매핑 (docs/03_냉장고_디자인_스펙.md 4장)
// IngredientCard의 기존 ICON_RULES를 대체·확장 — 아이콘 + 실루엣 + 사이즈를 함께 관리한다.
// 매칭 실패 시 Package 아이콘 + box 실루엣(sm)으로 폴백한다(4장 원칙과 동일).
import { Egg, Milk, Leaf, Square, UtensilsCrossed, Droplet, Package } from 'lucide-react'

// 채소 서랍(펜트리 바구니 계승, v3.1) 전용 판별 키워드 — room 카테고리일 때만 검사한다.
// 이름 키워드 기반 파생 로직이며 category 필드 자체는 건드리지 않는다(storageGuide.js와 동일 원칙).
const TUBER_KEYWORDS = ['감자', '고구마', '양파']

const VESSEL_RULES = [
  { keywords: ['계란'], icon: Egg, shape: 'egg', size: 'sm' },
  { keywords: ['우유'], icon: Milk, shape: 'carton', size: 'md' },
  { keywords: ['대파', '마늘', '양파', '파'], icon: Leaf, shape: 'bundle', size: 'sm' },
  { keywords: ['두부'], icon: Square, shape: 'box', size: 'md' },
  { keywords: ['밥'], icon: UtensilsCrossed, shape: 'dome', size: 'sm' },
  { keywords: ['만두'], icon: Package, shape: 'pouch', size: 'sm' },
  { keywords: ['식용유'], icon: Droplet, shape: 'bottle', size: 'sm' },
  // 문 도어 포켓 전용(신규, docs 4장) — 고추장/된장류는 jar, 케찹/마요네즈/간장류는 기존 bottle 재사용
  { keywords: ['고추장', '된장', '쌈장', '춘장'], icon: Package, shape: 'jar', size: 'sm' },
  { keywords: ['케찹', '마요네즈', '간장'], icon: Droplet, shape: 'bottle', size: 'sm' },
]

const DEFAULT_VESSEL = { icon: Package, shape: 'box', size: 'sm' }

export function getVesselConfig(name, category) {
  // room(실온) 재료 중 뿌리채소류는 아이콘 없는 tuber 실루엣으로 우선 분기한다(4장).
  // category가 room이 아니면(예: frozen 다진마늘) 이 분기를 타지 않고 아래 일반 규칙으로 그대로 넘어간다.
  if (category === 'room' && TUBER_KEYWORDS.some((keyword) => name.includes(keyword))) {
    return { Icon: null, shape: 'tuber', size: 'sm' }
  }
  const rule = VESSEL_RULES.find((r) => r.keywords.some((keyword) => name.includes(keyword)))
  return rule
    ? { Icon: rule.icon, shape: rule.shape, size: rule.size }
    : { Icon: DEFAULT_VESSEL.icon, shape: DEFAULT_VESSEL.shape, size: DEFAULT_VESSEL.size }
}

// 실루엣별 geometry(clip-path/border-radius) — 순수 CSS만 사용(8장: 래스터 에셋 미사용 원칙)
export const SHAPE_GEOMETRY = {
  egg: { borderRadius: '50% 50% 16% 16% / 60% 60% 22% 22%' },
  carton: { clipPath: 'polygon(12% 100%, 12% 30%, 50% 6%, 88% 30%, 88% 100%)' },
  bundle: { borderRadius: '46% 54% 52% 48% / 58% 54% 46% 42%' },
  box: { borderRadius: '10px' },
  dome: { borderRadius: '50% 50% 14% 14%' },
  pouch: {
    clipPath:
      'polygon(0% 20%, 12% 8%, 24% 20%, 36% 8%, 50% 20%, 64% 8%, 76% 20%, 88% 8%, 100% 20%, 100% 100%, 0% 100%)',
  },
  bottle: {
    clipPath: 'polygon(38% 0%, 62% 0%, 62% 16%, 84% 30%, 84% 100%, 16% 100%, 16% 30%)',
  },
  // 문 도어 포켓 전용(신규) — 넓은 통 + 뚜껑 느낌만 border-radius로 절제해서 표현(4장, 8장: 래스터 미사용)
  jar: { borderRadius: '4px 4px 12px 12px' },
  // tuber는 geometry 테이블에 없다 — IngredientVessel에서 아이콘 없는 유기적 블롭으로 완전히 커스텀 렌더링한다.
}

// id 기반 결정론적 개별 회전(3-4) — Math.random() 금지, 재렌더/재정렬 시 값이 흔들리면 안 됨
export const ROTATE_STEPS = [-3, 2, -2, 3, 0]

// 채소 서랍(tuber) 알맹이 고유색 (docs/03_냉장고_디자인_스펙.md 1-6)
export const TUBER_COLOR = {
  감자: { light: '#C9A063', dark: '#B08A55' },
  고구마: { light: '#8B4A3C', dark: '#7A4034' },
  양파: { light: '#EDE1C0', dark: '#C9BE97' },
}
