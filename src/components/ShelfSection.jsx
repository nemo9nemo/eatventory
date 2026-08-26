import { ZONE_STYLE } from '../data/fridgeTheme'

// 선반 섹션 (docs/03_냉장고_디자인_스펙.md 3-3, v3.1로 개정)
// category/label/children만 받는 순수 프레젠테이션 컴포넌트 — props 형태는 이전과 동일하게 유지한다.
// v3.1: 구역별 색깔 카드(zone.bg 배경, 테두리, 조명 워시/서리 오버레이)를 전부 걷어내고, 하나로 이어진
// FridgeInterior 패널 안에서 라벨 + 용기 로우만 담당하는 얇은 섹션으로 단순화했다(문서 끝 "v3.1" 절 참고).
// 구역 색 정체성은 라벨 텍스트 색(zone.text)에만 남는다 — 실온/냉장/냉동을 여전히 색으로 구분할 수 있게.
export default function ShelfSection({ category, label, children }) {
  const zone = ZONE_STYLE[category]

  return (
    <section>
      <p className={`mb-2 text-xs font-medium ${zone.text}`}>{label}</p>
      <div>{children}</div>
    </section>
  )
}
