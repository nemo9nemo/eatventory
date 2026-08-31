import { DOOR_STYLE } from '../data/fridgeTheme'
import IngredientVessel from './IngredientVessel'

// 냉장고 문 · 도어 포켓 (docs/03_냉장고_디자인_스펙.md 3-4, v3.1로 개정)
// v3 문서는 이 구역을 별도 카드(DoorPocketSection)로 제안했지만, 최종 방향은 하나로 이어진
// 인테리어 패널(FridgeInterior) 안의 옅은 톤 로우다 — 문서 끝 "v3.1" 절 참고.
// items는 category==='fridge'이면서 doorGuide.isDoorItem(name)이 true인 재료들(Fridge.jsx가 분류해 전달).
// 소스류가 하나도 없으면 빈 상태 안내조차 띄우지 않고 블록 자체를 생략한다(5장).
export default function DoorPocketRow({ items, onItemClick, selectMode = false, selectedIds }) {
  if (items.length === 0) return null

  return (
    <section>
      <p className={`mb-2 text-xs font-medium ${DOOR_STYLE.text}`}>냉장고 문 · 도어 포켓 · {items.length}개</p>
      <div className={`flex flex-wrap gap-3 rounded-xl border p-2.5 ${DOOR_STYLE.bg} ${DOOR_STYLE.border}`}>
        {items.map((item) => (
          <IngredientVessel
            key={item.id}
            ingredient={item}
            onClick={() => onItemClick(item)}
            selectable={selectMode}
            selected={selectedIds?.has(item.id)}
          />
        ))}
      </div>
    </section>
  )
}
