// 냉장고 도어 프레임 (docs/03_냉장고_디자인_스펙.md 3-1)
// 순수 프레젠테이션 래퍼 — 상태 없음. Fridge.jsx에서만 사용한다.
export default function FridgeFrame({ children }) {
  return (
    <div className="relative rounded-[28px] border-[1.5px] border-[#E2E4E9] bg-[#F3F4F6] p-4 pb-24 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] dark:border-[#333944] dark:bg-[#20242B] md:rounded-[32px] md:p-6 md:pb-20">
      {/* 손잡이 — 장식 요소, 비인터랙션 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#C7CDD6] to-[#A7AFBC] dark:from-[#5B6270] dark:to-[#454B57] md:h-32"
      />
      <div className="pr-6">{children}</div>
    </div>
  )
}
