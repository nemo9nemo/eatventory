export function getRecipeMatch(recipe, ingredientNames) {
  const owned = recipe.ingredients.filter((ing) => ingredientNames.includes(ing))
  const missing = recipe.ingredients.filter((ing) => !ingredientNames.includes(ing))
  return { ownedCount: owned.length, total: recipe.ingredients.length, missing }
}
