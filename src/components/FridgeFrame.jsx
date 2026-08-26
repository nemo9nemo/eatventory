// 냉장고 도어 프레임 (docs/03_냉장고_디자인_스펙.md 3-1)
// 순수 프레젠테이션 래퍼 — 상태 없음. Fridge.jsx에서만 사용한다.
// v2: 문 개스킷(이중 inset 박스섀도우), 명판 엠보싱, 손잡이 하이라이트 스트릭, 앰비언트 드롭섀도우 추가.
// v3.1: 참고 사진에 가깝게 상단 양쪽 환기구(vent), 하단 발(feet)을 추가(순수 장식, 레이아웃 영향 없음).
export default function FridgeFrame({ children }) {
  return (
    <div
      className="relative rounded-[28px] border-[1.5px] border-[#E2E4E9] bg-[#F3F4F6] p-4 pb-24 shadow-[0_22px_44px_-20px_rgba(15,15,25,0.32),inset_0_0_0_6px_rgba(255,255,255,0.55),inset_0_0_0_7px_rgba(20,20,30,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-[#333944] dark:bg-[#20242B] dark:shadow-[0_22px_44px_-20px_rgba(0,0,0,0.55),inset_0_0_0_6px_rgba(255,255,255,0.06),inset_0_0_0_7px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] md:rounded-[32px] md:p-6 md:pb-20"
    >
      {/* 환기구 — 순수 장식, 참고 사진의 상단 양쪽 원형 통풍구 은유 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-2 h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_34%_28%,#fff,#F3F4F6_55%,#AEB6C2_100%)] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(0,0,0,0.12)] ring-1 ring-[#C7CDD6] dark:bg-[radial-gradient(circle_at_34%_28%,#4A505B,#33383F_55%,#1B1E23_100%)] dark:ring-[#454B57]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-2 h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_34%_28%,#fff,#F3F4F6_55%,#AEB6C2_100%)] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(0,0,0,0.12)] ring-1 ring-[#C7CDD6] dark:bg-[radial-gradient(circle_at_34%_28%,#4A505B,#33383F_55%,#1B1E23_100%)] dark:ring-[#454B57]"
      />

      {/* 명판 엠보싱 — 순수 장식, 정보 구조에 영향 없음 */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1.5 -translate-x-1/2 select-none text-[9px] tracking-[0.2em] text-[#9AA1AC] [text-shadow:0_1px_0_rgba(255,255,255,.8)] dark:text-[#5B6270] dark:[text-shadow:0_1px_0_rgba(0,0,0,.4)]"
      >
        EATVENTORY
      </p>

      {/* 손잡이 — 장식 요소, 비인터랙션. 하이라이트 스트릭이 지나가는 원통형 반사 표현 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#AEB6C2,#F0F2F5_45%,#AEB6C2_58%,#8C93A1)] shadow-[0_3px_6px_rgba(0,0,0,0.25)] dark:bg-[linear-gradient(90deg,#454B57,#6B7280_45%,#454B57_58%,#33383F)] md:h-32"
      />
      <div className="pr-6">{children}</div>

      {/* 발(다리) — 순수 장식, 하단 패딩 밖에 얹혀 내부 레이아웃에는 영향 없음 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center gap-24">
        <span className="h-2 w-5 rounded-b-md bg-[linear-gradient(180deg,#D5D8DD,#AEB4BE)] dark:bg-[linear-gradient(180deg,#454B57,#33383F)]" />
        <span className="h-2 w-5 rounded-b-md bg-[linear-gradient(180deg,#D5D8DD,#AEB4BE)] dark:bg-[linear-gradient(180deg,#454B57,#33383F)]" />
      </div>
    </div>
  )
}
