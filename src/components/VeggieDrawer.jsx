import { ZONE_STYLE } from '../data/fridgeTheme'
import IngredientVessel from './IngredientVessel'

// 채소 서랍 (docs/03_냉장고_디자인_스펙.md 3-3 "펜트리 바구니"의 v3.1 계승)
// v3 문서는 뿌리채소류를 재료별 바구니 여러 개로 나눠 담는 PantrySection을 제안했지만, 최종 방향은
// 참고 사진처럼 하단에 넓은 철망(crosshatch) 서랍 하나를 두고 감자/고구마/양파를 함께 담는 것이다
// — 문서 끝 "v3.1" 절 참고. items는 category==='room'이면서 getVesselConfig(name,'room').shape
// === 'tuber'인 재료들(Fridge.jsx가 분류해 전달). 비어 있으면 블록 자체를 생략한다(5장).
export default function VeggieDrawer({ items, onItemClick, selectMode = false, selectedIds }) {
  if (items.length === 0) return null

  return (
    <section>
      <p className={`mb-2 text-xs font-medium ${ZONE_STYLE.room.text}`}>채소 서랍 · 실온</p>
      <div
        className="relative flex flex-wrap items-end justify-center gap-4 rounded-b-2xl border border-black/10 p-4 dark:border-white/10 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,.08)_0_1.5px,transparent_1.5px_9px),repeating-linear-gradient(-45deg,rgba(0,0,0,.08)_0_1.5px,transparent_1.5px_9px),linear-gradient(180deg,#d7dade,#c3c8ce)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.06)_0_1.5px,transparent_1.5px_9px),repeating-linear-gradient(-45deg,rgba(255,255,255,.06)_0_1.5px,transparent_1.5px_9px),linear-gradient(180deg,#3a3f46,#2a2e34)]"
      >
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
