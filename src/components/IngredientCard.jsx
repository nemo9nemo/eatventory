import { Egg, Milk, Leaf, Square, UtensilsCrossed, Droplet, Package } from 'lucide-react'
import { CATEGORY_LABEL } from '../data/mock'
import { ZONE_STYLE, URGENCY_STYLE } from '../data/fridgeTheme'

// 재료 아이콘 매핑 (docs/03_냉장고_디자인_스펙.md 4장, 선택 구현) — 못 찾으면 기본 Package
const ICON_RULES = [
  { keywords: ['계란'], icon: Egg },
  { keywords: ['우유'], icon: Milk },
  { keywords: ['대파', '마늘', '양파', '파'], icon: Leaf },
  { keywords: ['두부'], icon: Square },
  { keywords: ['밥'], icon: UtensilsCrossed },
  { keywords: ['식용유'], icon: Droplet },
  { keywords: ['만두'], icon: Package },
]

function getIngredientIcon(name) {
  const rule = ICON_RULES.find((r) => r.keywords.some((keyword) => name.includes(keyword)))
  return rule ? rule.icon : Package
}

export default function IngredientCard({ ingredient, onClick }) {
  const expiring = typeof ingredient.expiresInDays === 'number'
  const urgent = expiring && ingredient.expiresInDays <= 2
  const soon = expiring && ingredient.expiresInDays > 2 && ingredient.expiresInDays <= 5
  const urgency = urgent ? 'urgent' : soon ? 'soon' : 'normal'

  const zone = ZONE_STYLE[ingredient.category]
  const badge = URGENCY_STYLE[urgency]
  const Icon = getIngredientIcon(ingredient.name)

  return (
    <button
      onClick={onClick}
      data-testid={`ingredient-card-${ingredient.id}`}
      className={`relative aspect-square rounded-2xl border p-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.97] ${zone.bg} ${zone.border} ${
        zone.dashed ? 'border-dashed' : ''
      }`}
    >
      {expiring && (
        <span
          className={`absolute -right-1.5 -top-2 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${badge.badge} ${badge.rotate}`}
        >
          D-{ingredient.expiresInDays}
        </span>
      )}
      <div className="flex h-full flex-col justify-between">
        <Icon size={18} className={zone.text} aria-hidden="true" />
        <div>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{ingredient.name}</p>
          <span className={`text-[10px] opacity-70 ${zone.text}`}>{CATEGORY_LABEL[ingredient.category]}</span>
        </div>
      </div>
    </button>
  )
}
