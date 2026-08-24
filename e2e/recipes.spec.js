import { test, expect } from '@playwright/test'

test.describe('레시피 추천 리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes')
  })

  test('전체 레시피 목록을 보여준다', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '레시피 추천' })).toBeVisible()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(6)
  })

  test('바로 만들 수 있어요 필터 - 기본 mock 재료로는 완전 매칭 레시피가 없어 빈 상태를 보여준다', async ({ page }) => {
    // 기본 mock 재료(계란/대파/두부/우유/밥/만두/다진마늘/식용유/양파/감자)에는
    // 소금/육수/버터/식빵/설탕이 없어 6개 레시피 모두 최소 1개씩 부족 재료가 있다.
    await page.getByRole('button', { name: '바로 만들 수 있어요' }).click()
    await expect(page.getByText('조건에 맞는 레시피가 없어요')).toBeVisible()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(0)
  })

  test('조금만 더 있으면 돼요 필터는 부족 재료가 1~2개인 레시피를 보여준다', async ({ page }) => {
    await page.getByRole('button', { name: '조금만 더 있으면 돼요' }).click()
    await expect(page.locator('[data-testid^="recipe-card-"]')).toHaveCount(6)
  })
})

test.describe('레시피 상세', () => {
  test('보유 재료와 부족한 재료를 구분해서 보여주고 조리 순서를 표시한다', async ({ page }) => {
    await page.goto('/recipes/1') // 계란볶음밥: 밥,계란,대파,식용유(보유) / 소금(부족)
    await expect(page.getByRole('heading', { name: '계란볶음밥' })).toBeVisible()
    await expect(page.getByText('조리 순서')).toBeVisible()
    await expect(page.getByText('소금', { exact: true })).toBeVisible()
    const steps = page.locator('ol li')
    await expect(steps).toHaveCount(5)
  })

  test('즐겨찾기 토글이 상세 화면에서 동작한다', async ({ page }) => {
    await page.goto('/recipes/1')
    const toggle = page.getByRole('button', { name: '즐겨찾기 토글' })
    await toggle.click()
    await expect(page.getByRole('button', { name: '즐겨찾기 토글' })).toBeVisible()
  })

  test('뒤로가기 버튼을 누르면 이전 화면으로 돌아간다', async ({ page }) => {
    await page.goto('/recipes')
    await page.locator('[data-testid="recipe-card-1"]').getByRole('link').click()
    await expect(page).toHaveURL('/recipes/1')
    await page.getByRole('button', { name: '뒤로가기' }).click()
    await expect(page).toHaveURL('/recipes')
  })
})
