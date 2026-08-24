import { ZONE_STYLE, ALL_TAB_STYLE } from '../data/fridgeTheme'

// 온도 다이얼 탭 (docs/03_냉장고_디자인_스펙.md 3-2)
// tabs/value/onChange는 기존 Fridge.jsx의 TABS/tab/setTab 그대로 전달받는다. 스타일 전용 컴포넌트.
export default function TemperatureTabs({ tabs, value, onChange }) {
  return (
    <div className="flex h-9 gap-1 rounded-full bg-black/5 p-1 dark:bg-white/5 md:h-10" data-testid="fridge-tabs">
      {tabs.map((t) => {
        const active = value === t.key
        const zone = ZONE_STYLE[t.key]
        const activeClass = zone ? `${zone.bg} ${zone.text}` : ALL_TAB_STYLE
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            data-testid={`fridge-tab-${t.key}`}
            className={`flex-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              active
                ? `${activeClass} shadow-sm`
                : 'text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
