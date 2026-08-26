// 냉장고 내부 — 단일 인테리어 패널 (docs/03_냉장고_디자인_스펙.md v3.1)
// 실온/냉장/냉동을 각각 색깔 있는 카드로 나눠 쌓던 구조를 버리고, 참고 사진처럼 하나로 이어진
// 냉장고 내부 패널 하나를 두고 그 안에서 선반 로우들(ShelfSection/DoorPocketRow/VeggieDrawer)을
// ShelfDivider로만 구분한다. 순수 프레젠테이션 래퍼 — 상태 없음. children만 받는다.
export default function FridgeInterior({ children }) {
  return (
    <div className="relative rounded-2xl bg-[linear-gradient(180deg,#fbfdff,#f3f6f9)] p-3 shadow-[inset_0_3px_6px_rgba(0,0,0,0.08)] dark:bg-[linear-gradient(180deg,#141a22,#10151b)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  )
}
