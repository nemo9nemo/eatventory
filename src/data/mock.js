export const CATEGORY_LABEL = { room: '실온', fridge: '냉장', frozen: '냉동' }

export const initialIngredients = [
  { id: 1, name: '계란', category: 'fridge', expiresInDays: 1 },
  { id: 2, name: '대파', category: 'fridge', expiresInDays: 3 },
  { id: 3, name: '두부', category: 'fridge', expiresInDays: 6 },
  { id: 4, name: '우유', category: 'fridge', expiresInDays: 9 },
  { id: 5, name: '밥', category: 'fridge', expiresInDays: 2 },
  { id: 6, name: '만두', category: 'frozen', expiresInDays: null },
  { id: 7, name: '다진마늘', category: 'frozen', expiresInDays: null },
  { id: 8, name: '식용유', category: 'room', expiresInDays: null },
  { id: 9, name: '양파', category: 'room', expiresInDays: 10 },
  { id: 10, name: '감자', category: 'room', expiresInDays: 14 },
]

export const recipes = [
  {
    id: 1,
    name: '계란볶음밥',
    time: '15분',
    difficulty: '쉬움',
    ingredients: ['밥', '계란', '대파', '식용유', '소금'],
    steps: [
      '대파를 잘게 썬다.',
      '팬에 식용유를 두르고 대파를 볶아 파기름을 낸다.',
      '밥을 넣고 골고루 볶는다.',
      '계란을 풀어 넣고 빠르게 섞는다.',
      '소금으로 간을 맞춰 마무리한다.',
    ],
  },
  {
    id: 2,
    name: '두부계란찜',
    time: '20분',
    difficulty: '쉬움',
    ingredients: ['두부', '계란', '대파', '소금'],
    steps: [
      '두부를 으깨거나 깍둑썰기 한다.',
      '계란을 풀고 두부, 다진 대파, 소금을 섞는다.',
      '찜기 또는 전자레인지에 8~10분간 익힌다.',
      '한 번 저어준 뒤 다시 2~3분 더 익힌다.',
    ],
  },
  {
    id: 3,
    name: '감자채볶음',
    time: '15분',
    difficulty: '쉬움',
    ingredients: ['감자', '양파', '식용유', '소금'],
    steps: [
      '감자와 양파를 채 썬다.',
      '찬물에 감자를 담가 전분기를 뺀다.',
      '팬에 식용유를 두르고 양파를 먼저 볶는다.',
      '감자를 넣고 투명해질 때까지 볶은 뒤 소금으로 간한다.',
    ],
  },
  {
    id: 4,
    name: '만두전골',
    time: '25분',
    difficulty: '보통',
    ingredients: ['만두', '대파', '양파', '다진마늘', '육수'],
    steps: [
      '냄비에 육수를 붓고 끓인다.',
      '양파와 대파를 넣고 한소끔 끓인다.',
      '다진마늘을 넣어 향을 낸다.',
      '만두를 넣고 익을 때까지 끓인다.',
    ],
  },
  {
    id: 5,
    name: '우유토스트',
    time: '10분',
    difficulty: '쉬움',
    ingredients: ['식빵', '우유', '계란', '설탕'],
    steps: [
      '계란과 우유, 설탕을 섞어 반죽물을 만든다.',
      '식빵을 반죽물에 앞뒤로 적신다.',
      '팬에 약불로 앞뒤를 노릇하게 굽는다.',
    ],
  },
  {
    id: 6,
    name: '감자수프',
    time: '30분',
    difficulty: '보통',
    ingredients: ['감자', '양파', '우유', '버터'],
    steps: [
      '감자와 양파를 잘게 썬다.',
      '버터를 녹인 팬에 양파를 볶는다.',
      '감자를 넣고 물을 부어 부드러워질 때까지 끓인다.',
      '믹서로 곱게 간 뒤 우유를 넣고 다시 끓인다.',
    ],
  },
]
