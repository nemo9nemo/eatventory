import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { initialIngredients } from '../src/data/mock.js'
import { rankRecipes } from '../src/utils/match.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const recipes = JSON.parse(readFileSync(path.join(__dirname, '../src/data/recipes.json'), 'utf-8'))
const ingredientNames = initialIngredients.map((i) => i.name)
// 즐겨찾기 토글은 /recipes 목록(보유 재료 매칭순 상위 노출)에서 클릭하므로,
// 목록에 실제로 보이는 레시피를 대상으로 삼아야 한다.
const [first, second] = rankRecipes(recipes, ingredientNames, 'all')

test.describe('즐겨찾기', () => {
  test('즐겨찾기가 없으면 빈 상태와 이동 버튼을 보여준다', async ({ page }) => {
    await page.goto('/favorites')
    await expect(page.getByText('즐겨찾기한 레시피가 없어요')).toBeVisible()
    await page.getByRole('button', { name: '레시피 보러 가기' }).click()
    await expect(page).toHaveURL('/recipes')
  })

  test('레시피를 즐겨찾기하면 즐겨찾기 탭에 반영된다', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByTestId(`favorite-toggle-${first.id}`).click()

    await page.locator('nav a[href="/favorites"]').click()
    await expect(page).toHaveURL('/favorites')
    await expect(page.getByTestId(`recipe-card-${first.id}`)).toBeVisible()
    await expect(page.getByText(first.name)).toBeVisible()
  })

  test('즐겨찾기를 해제하면 목록에서 사라진다', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByTestId(`favorite-toggle-${first.id}`).click()
    await page.locator('nav a[href="/favorites"]').click()
    await expect(page.getByTestId(`recipe-card-${first.id}`)).toBeVisible()

    await page.getByTestId(`favorite-toggle-${first.id}`).click()
    await expect(page.getByTestId(`recipe-card-${first.id}`)).toHaveCount(0)
    await expect(page.getByText('즐겨찾기한 레시피가 없어요')).toBeVisible()
  })

  test('레시피 상세에서 즐겨찾기한 것도 즐겨찾기 탭에 반영된다', async ({ page }) => {
    await page.goto(`/recipes/${second.id}`)
    await page.getByRole('button', { name: '즐겨찾기 토글' }).click()
    await page.locator('nav a[href="/favorites"]').click()
    await expect(page.getByText(second.name)).toBeVisible()
  })
})
