import { ZONE_STYLE } from '../data/fridgeTheme'

// 선반 섹션 (docs/03_냉장고_디자인_스펙.md 3-3)
// category/label/children만 받는 순수 프레젠테이션 컴포넌트. 데이터 흐름(grouped)은 Fridge.jsx가 그대로 소유한다.
export default function ShelfSection({ category, label, children }) {
  const zone = ZONE_STYLE[category]
  const isRoom = category === 'room'
  const isFrozen = category === 'frozen'

  return (
    <section>
      {isFrozen ? (
        <div className={`border-t-2 border-dashed ${zone.border}`} aria-hidden="true" />
      ) : (
        <div className={`h-[6px] rounded-full ${zone.barBg}`} aria-hidden="true" />
      )}
      <div
        className={`mt-2 p-3 ${zone.bg} ${
          isRoom ? `rounded-b-2xl border-t-4 ${zone.border}` : 'rounded-2xl'
        }`}
      >
        <p className={`mb-2 text-xs font-medium ${zone.text}`}>{label}</p>
        {children}
      </div>
    </section>
  )
}
