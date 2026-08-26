import { test, expect } from '@playwright/test'

test.describe('홈 화면', () => {
  test('재료 요약과 추천 레시피를 보여준다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: '잇벤토리' })).toBeVisible()
    await expect(page.getByText('보유 재료')).toBeVisible()
    await expect(page.getByText('14개')).toBeVisible()
    await expect(page.getByText(/유통기한 임박/)).toBeVisible()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(4)
  })

  test('추천 레시피 카드를 클릭하면 상세 화면으로 이동한다', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-testid^="recipe-card-"]').first().getByRole('link').click()
    await expect(page).toHaveURL(/\/recipes\/\d+/)
    await expect(page.getByText('조리 순서')).toBeVisible()
  })

  test('더 보기 버튼으로 레시피 추천 리스트로 이동한다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /더 보기/ }).click()
    await expect(page).toHaveURL('/recipes')
    await expect(page.getByRole('heading', { name: '레시피 추천' })).toBeVisible()
  })

  test('보유 재료 카드를 클릭하면 냉장고 화면으로 이동한다', async ({ page }) => {
    await page.goto('/')
    await page.getByText('보유 재료').click()
    await expect(page).toHaveURL('/fridge')
  })
})
