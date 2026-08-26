// 선반 구분 바 (docs/03_냉장고_디자인_스펙.md v3.1)
// FridgeInterior 안에서 로우 그룹(선반/도어 포켓/채소 서랍) 사이를 나누는 순수 장식 요소.
// 정보를 담지 않으므로 aria-hidden. 위는 빛나고 아래는 그림자 지는 두께 표현(구 ShelfSection의
// shelfBarBg 3D 바 원칙을 계승하되, 이제는 구역 색이 아니라 인테리어 패널 전체에서 중립적으로 쓰인다).
export default function ShelfDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-[6px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.95),rgba(20,40,70,0.18))] shadow-[0_3px_5px_-3px_rgba(20,30,45,0.3)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,.15),rgba(0,0,0,0.4))]"
    />
  )
}
