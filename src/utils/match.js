// 공공 레시피 데이터는 "다진 대파"처럼 재료명에 수식어·띄어쓰기가 섞여 있어
// 완전 일치 대신 공백 제거 후 포함 관계로 비교한다(예: 냉장고의 "다진마늘" ↔ 레시피의 "다진 마늘").
function normalize(name) {
  return name.replace(/\s+/g, '')
}

export function getRecipeMatch(recipe, ingredientNames) {
  const normalizedOwned = ingredientNames.map(normalize)
  const owned = recipe.ingredients.filter((ing) => {
    const n = normalize(ing)
    return normalizedOwned.some((owned) => n.includes(owned) || owned.includes(n))
  })
  const missing = recipe.ingredients.filter((ing) => !owned.includes(ing))
  return { ownedCount: owned.length, total: recipe.ingredients.length, missing }
}

// 공공 데이터 레시피는 대부분 재료가 5개 이상이라 "부족 재료 0개"는 거의 나오지 않는다.
// ready(바로 만들 수 있어요)는 0~1개, almost(조금만 더 있으면 돼요)는 2~4개로 완화한다.
export const RECIPE_LIST_LIMIT = 50

export function rankRecipes(recipes, ingredientNames, filter = 'all') {
  return recipes
    .map((recipe) => ({ recipe, match: getRecipeMatch(recipe, ingredientNames) }))
    .filter(({ match }) => {
      if (filter === 'ready') return match.missing.length <= 1
      if (filter === 'almost') return match.missing.length >= 2 && match.missing.length <= 4
      return true
    })
    .sort((a, b) => b.match.ownedCount / b.match.total - a.match.ownedCount / a.match.total)
    .slice(0, RECIPE_LIST_LIMIT)
    .map(({ recipe }) => recipe)
}
