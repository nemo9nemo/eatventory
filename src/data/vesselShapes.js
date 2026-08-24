// 재료 실루엣(Vessel Shape) 매핑 (docs/03_냉장고_디자인_스펙.md 4장)
// IngredientCard의 기존 ICON_RULES를 대체·확장 — 아이콘 + 실루엣 + 사이즈를 함께 관리한다.
// 매칭 실패 시 Package 아이콘 + box 실루엣(sm)으로 폴백한다(4장 원칙과 동일).
import { Egg, Milk, Leaf, Square, UtensilsCrossed, Droplet, Package } from 'lucide-react'

const VESSEL_RULES = [
  { keywords: ['계란'], icon: Egg, shape: 'egg', size: 'sm' },
  { keywords: ['우유'], icon: Milk, shape: 'carton', size: 'md' },
  { keywords: ['대파', '마늘', '양파', '파'], icon: Leaf, shape: 'bundle', size: 'sm' },
  { keywords: ['두부'], icon: Square, shape: 'box', size: 'md' },
  { keywords: ['밥'], icon: UtensilsCrossed, shape: 'dome', size: 'sm' },
  { keywords: ['만두'], icon: Package, shape: 'pouch', size: 'sm' },
  { keywords: ['식용유'], icon: Droplet, shape: 'bottle', size: 'sm' },
]

const DEFAULT_VESSEL = { icon: Package, shape: 'box', size: 'sm' }

export function getVesselConfig(name) {
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
}

// id 기반 결정론적 개별 회전(3-4) — Math.random() 금지, 재렌더/재정렬 시 값이 흔들리면 안 됨
export const ROTATE_STEPS = [-3, 2, -2, 3, 0]
