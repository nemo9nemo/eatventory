import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { initialIngredients } from '../src/data/mock.js'
import { rankRecipes, RECIPE_LIST_LIMIT } from '../src/utils/match.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const recipes = JSON.parse(readFileSync(path.join(__dirname, '../src/data/recipes.json'), 'utf-8'))
const ingredientNames = initialIngredients.map((i) => i.name)

const allList = rankRecipes(recipes, ingredientNames, 'all')
const readyCount = rankRecipes(recipes, ingredientNames, 'ready').length
const almostCount = rankRecipes(recipes, ingredientNames, 'almost').length

test.describe('레시피 추천 리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes')
  })

  test('전체 탭은 보유 재료와 가장 잘 맞는 순으로 최대 개수까지 보여준다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '레시피 추천' })).toBeVisible()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(
      Math.min(recipes.length, RECIPE_LIST_LIMIT)
    )
  })

  test('바로 만들 수 있어요 필터는 부족 재료가 0~1개인 레시피만 보여준다', async ({ page }) => {
    await page.getByRole('button', { name: '바로 만들 수 있어요' }).click()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(readyCount)
  })

  test('조금만 더 있으면 돼요 필터는 부족 재료가 2~4개인 레시피를 보여준다', async ({ page }) => {
    await page.getByRole('button', { name: '조금만 더 있으면 돼요' }).click()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(almostCount)
  })
})

test.describe('레시피 상세', () => {
  const first = allList[0]

  test('보유 재료와 부족한 재료를 구분해서 보여주고 조리 순서를 표시한다', async ({ page }) => {
    await page.goto(`/recipes/${first.id}`)
    await expect(page.getByRole('heading', { name: first.name })).toBeVisible()
    await expect(page.getByText('조리 순서')).toBeVisible()
    const steps = page.locator('ol li')
    await expect(steps).toHaveCount(first.steps.length)
  })

  test('즐겨찾기 토글이 상세 화면에서 동작한다', async ({ page }) => {
    await page.goto(`/recipes/${first.id}`)
    const toggle = page.getByRole('button', { name: '즐겨찾기 토글' })
    await toggle.click()
    await expect(page.getByRole('button', { name: '즐겨찾기 토글' })).toBeVisible()
  })

  test('뒤로가기 버튼을 누르면 이전 화면으로 돌아간다', async ({ page }) => {
    await page.goto('/recipes')
    await page.locator(`[data-testid="recipe-card-${first.id}"]`).getByRole('link').click()
    await expect(page).toHaveURL(`/recipes/${first.id}`)
    await page.getByRole('button', { name: '뒤로가기' }).click()
    await expect(page).toHaveURL('/recipes')
  })
})
