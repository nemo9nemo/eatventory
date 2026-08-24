import { test, expect } from '@playwright/test'

test.describe('즐겨찾기', () => {
  test('즐겨찾기가 없으면 빈 상태와 이동 버튼을 보여준다', async ({ page }) => {
    await page.goto('/favorites')
    await expect(page.getByText('즐겨찾기한 레시피가 없어요')).toBeVisible()
    await page.getByRole('button', { name: '레시피 보러 가기' }).click()
    await expect(page).toHaveURL('/recipes')
  })

  test('레시피를 즐겨찾기하면 즐겨찾기 탭에 반영된다', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByTestId('favorite-toggle-1').click()

    await page.locator('nav a[href="/favorites"]').click()
    await expect(page).toHaveURL('/favorites')
    await expect(page.getByTestId('recipe-card-1')).toBeVisible()
    await expect(page.getByText('계란볶음밥')).toBeVisible()
  })

  test('즐겨찾기를 해제하면 목록에서 사라진다', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByTestId('favorite-toggle-1').click()
    await page.locator('nav a[href="/favorites"]').click()
    await expect(page.getByTestId('recipe-card-1')).toBeVisible()

    await page.getByTestId('favorite-toggle-1').click()
    await expect(page.getByTestId('recipe-card-1')).toHaveCount(0)
    await expect(page.getByText('즐겨찾기한 레시피가 없어요')).toBeVisible()
  })

  test('레시피 상세에서 즐겨찾기한 것도 즐겨찾기 탭에 반영된다', async ({ page }) => {
    await page.goto('/recipes/2')
    await page.getByRole('button', { name: '즐겨찾기 토글' }).click()
    await page.locator('nav a[href="/favorites"]').click()
    await expect(page.getByText('두부계란찜')).toBeVisible()
  })
})
