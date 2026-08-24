import { ZONE_STYLE } from '../data/fridgeTheme'

// 선반 섹션 (docs/03_냉장고_디자인_스펙.md 3-3)
// category/label/children만 받는 순수 프레젠테이션 컴포넌트. 데이터 흐름(grouped)은 Fridge.jsx가 그대로 소유한다.
// v2: 선반 3D 두께감(유리 선반 바), 냉장 구역 조명 워시, 냉동 구역 서리(도트+스크래치) 결 추가.
export default function ShelfSection({ category, label, children }) {
  const zone = ZONE_STYLE[category]
  const isRoom = category === 'room'
  const isFrozen = category === 'frozen'
  const isFridge = category === 'fridge'

  return (
    <section>
      {isFrozen ? (
        <div className={`border-t-[2.5px] border-dashed ${zone.border}`} aria-hidden="true" />
      ) : (
        <div
          aria-hidden="true"
          className={`h-[9px] rounded-md shadow-[0_3px_5px_-2px_rgba(20,40,70,0.25)] ${zone.shelfBarBg}`}
        />
      )}
      <div
        className={`relative overflow-hidden mt-2 p-3 ${zone.bg} ${
          isRoom ? `rounded-b-2xl border-t-4 ${zone.border}` : 'rounded-2xl'
        }`}
      >
        {isFridge && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-9 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,.85),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,.12),transparent_70%)]"
          />
        )}
        {isFrozen && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:6px_6px] opacity-[0.07]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.25)_0px,rgba(255,255,255,.25)_2px,transparent_2px,transparent_7px)] opacity-[0.12]"
            />
          </>
        )}
        <p className={`relative mb-2 text-xs font-medium ${zone.text}`}>{label}</p>
        <div className="relative">{children}</div>
      </div>
    </section>
  )
}
