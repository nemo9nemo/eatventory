// 냉장고 화면 전용 시각 팔레트 (docs/03_냉장고_디자인_스펙.md 1장, 4장 기준)
// FridgeFrame / TemperatureTabs / ShelfSection / IngredientVessel이 공유한다.

export const ZONE_STYLE = {
  room: {
    bg: 'bg-[linear-gradient(#F1E6D2,#E8DAC0)] dark:bg-[linear-gradient(#3A3226,#2E281F)]',
    border: 'border-[#D9C9A3] dark:border-[#3A3226]',
    barBg: 'bg-[#D9C9A3] dark:bg-[#3A3226]',
    // 선반 3D 바(신규, 3-3) — 위는 빛나고 아래는 그림자 지는 두께 표현
    shelfBarBg:
      'bg-[linear-gradient(180deg,rgba(255,255,255,.95),#D9C9A3)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,.2),#3A3226)]',
    // 용기(Vessel) 배경(신규, 3-4) — linear-gradient(155deg, #fff, fill2 75%)
    vesselBg:
      'bg-[linear-gradient(155deg,#fff_0%,#E8DAC0_75%)] dark:bg-[linear-gradient(155deg,#2E281F_0%,#3A3226_75%)]',
    fill2: '#E8DAC0',
    text: 'text-[#8A6D3B] dark:text-[#D4B87A]',
    dashed: false,
  },
  fridge: {
    bg: 'bg-[linear-gradient(#F7FBFF,#E9F2FC)] dark:bg-[linear-gradient(#1B2A3D,#16222F)]',
    border: 'border-[#BFDCF7] dark:border-[#1B2A3D]',
    barBg: 'bg-[#BFDCF7] dark:bg-[#1B2A3D]',
    shelfBarBg:
      'bg-[linear-gradient(180deg,rgba(255,255,255,.95),#BFDCF7)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,.25),#1B2A3D)]',
    vesselBg:
      'bg-[linear-gradient(155deg,#fff_0%,#E9F2FC_75%)] dark:bg-[linear-gradient(155deg,#16222F_0%,#1B2A3D_75%)]',
    fill2: '#E9F2FC',
    text: 'text-[#1D5A96] dark:text-[#8FC2F2]',
    dashed: false,
  },
  frozen: {
    bg: 'bg-[linear-gradient(#EDF2FF,#E4E9FB)] dark:bg-[linear-gradient(#232A45,#1B2036)]',
    border: 'border-[#C9D3F5] dark:border-[#232A45]',
    barBg: 'bg-[#C9D3F5] dark:bg-[#232A45]',
    shelfBarBg:
      'bg-[linear-gradient(180deg,rgba(255,255,255,.95),#C9D3F5)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,.2),#232A45)]',
    vesselBg:
      'bg-[linear-gradient(155deg,#fff_0%,#E4E9FB_75%)] dark:bg-[linear-gradient(155deg,#1B2036_0%,#232A45_75%)]',
    fill2: '#E4E9FB',
    text: 'text-[#4A4FA0] dark:text-[#AEB6F5]',
    dashed: true,
  },
}

// '전체' 탭이 활성화됐을 때(구역이 아니므로 팔레트가 없음) 사용하는 중립 스타일
export const ALL_TAB_STYLE = 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100'

// 냉장고 문 · 도어 포켓 전용 색(docs/03 1-6) — 냉장(fridge)과 같은 파랑 계열이되 한 톤 짙은 변형.
// 별도 카드가 아니라 인테리어 패널 안의 옅은 톤 로우이므로 무게감을 무겁게 주지 않는다(v3.1).
export const DOOR_STYLE = {
  bg: 'bg-[linear-gradient(#E3ECF7,#C9D9EC)] dark:bg-[linear-gradient(#213347,#182432)]',
  border: 'border-[#9FBEDD] dark:border-[#33475F]',
  text: 'text-[#1D5A96] dark:text-[#8FC2F2]',
}

// D-day 배지(자석 스티커) — docs/03 1-3, 변경 없음
export const URGENCY_STYLE = {
  urgent: { badge: 'bg-[#FEE2E2] text-[#B91C1C] border-[#F5A3A3]', rotate: '-rotate-[8deg]' },
  soon: { badge: 'bg-[#FEF3C7] text-[#92400E] border-[#F2CB7A]', rotate: 'rotate-[6deg]' },
  normal: { badge: 'bg-[#F3F4F6] text-[#6B7280] border-[#E2E4E9]', rotate: '' },
}
