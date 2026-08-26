import { CATEGORY_LABEL } from '../data/mock'
import { ZONE_STYLE, URGENCY_STYLE } from '../data/fridgeTheme'
import { getVesselConfig, SHAPE_GEOMETRY, ROTATE_STEPS, TUBER_COLOR } from '../data/vesselShapes'

// 재료 표현 — 카드 → 용기(Vessel) (docs/03_냉장고_디자인_스펙.md 3-4)
// IngredientCard를 대체한다. props(ingredient, onClick)와 클릭 인터랙션은 100% 동일하게 유지한다.
export default function IngredientVessel({ ingredient, onClick }) {
  const expiring = typeof ingredient.expiresInDays === 'number'
  const urgent = expiring && ingredient.expiresInDays <= 2
  const soon = expiring && ingredient.expiresInDays > 2 && ingredient.expiresInDays <= 5
  const urgency = urgent ? 'urgent' : soon ? 'soon' : 'normal'

  const zone = ZONE_STYLE[ingredient.category]
  const badge = URGENCY_STYLE[urgency]
  const { Icon, shape, size } = getVesselConfig(ingredient.name, ingredient.category)
  const isMd = size === 'md'
  // tuber(채소 서랍 알맹이) — 포장재가 아니라 재료 자체의 색을 은유하는 유일한 예외 실루엣(4장).
  // 아이콘/구역 배경·테두리를 쓰지 않고 재료 고유색 블롭으로 대체한다.
  const isTuber = shape === 'tuber'
  const tuberColor = isTuber ? TUBER_COLOR[ingredient.name] : null

  // id 기반 결정론적 회전 — Math.random() 금지(3-4)
  const rotate = ROTATE_STEPS[ingredient.id % ROTATE_STEPS.length]

  return (
    <button
      onClick={onClick}
      data-testid={`ingredient-card-${ingredient.id}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative flex min-h-11 flex-col items-center ${isMd ? 'w-16 md:w-[72px]' : 'w-12 md:w-14'}`}
    >
      {expiring && (
        <span
          className={`absolute -right-2 -top-2.5 z-10 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${badge.badge} ${badge.rotate}`}
        >
          D-{ingredient.expiresInDays}
        </span>
      )}

      {/* shape — 실루엣 본체. 재료 종류별 clip-path/border-radius로 다른 용기 형태를 표현한다(4장) */}
      {isTuber ? (
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden shadow-sm transition hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.97] dark:brightness-90 dark:contrast-110 h-11`}
          style={{
            borderRadius: '48% 52% 55% 45% / 55% 48% 52% 45%',
            background: `radial-gradient(circle at 32% 26%, color-mix(in srgb, ${tuberColor.light} 35%, white 65%), ${tuberColor.light} 58%, color-mix(in srgb, ${tuberColor.light} 72%, black 28%) 100%)`,
          }}
        />
      ) : (
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden border shadow-sm transition hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.97] ${
            isMd ? 'h-[58px]' : 'h-11'
          } ${zone.vesselBg} ${zone.border} ${zone.dashed ? 'border-dashed' : ''}`}
          style={SHAPE_GEOMETRY[shape]}
        >
          {shape === 'box' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,.55)_48%,transparent_56%)]"
            />
          )}
          <Icon size={isMd ? 18 : 16} className={`relative ${zone.text}`} aria-hidden="true" />
        </div>
      )}

      {/* ground — 접지 그림자. 용기가 선반에 닿는 지점(2장, 3-4) */}
      <div
        aria-hidden="true"
        className={`-mt-1 rounded-full opacity-45 blur-[1.5px] ${zone.barBg} ${
          isMd ? 'h-[7px] w-[85%]' : 'h-1.5 w-[70%]'
        }`}
      />

      <p className="mt-1 w-full truncate text-center text-[11px] font-medium text-gray-900 dark:text-gray-100">
        {ingredient.name}
      </p>
      <span className={`text-[10px] opacity-70 ${zone.text}`}>
        {CATEGORY_LABEL[ingredient.category]}
        {ingredient.quantity ? ` · ${ingredient.quantity}` : ''}
      </span>
    </button>
  )
}
