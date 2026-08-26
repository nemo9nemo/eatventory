import { test, expect } from '@playwright/test'

test.describe('재료별 보유 수량 입력', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fridge')
  })

  test('수량을 입력해 재료를 추가하면 카테고리 라벨 옆에 수량이 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByPlaceholder('예: 계란').fill('김치')
    await page.getByPlaceholder('예: 2개, 500ml, 1단').fill('1포기')
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)

    const card = page.locator('button', { hasText: '김치' })
    await expect(card).toBeVisible()
    // 김치는 storageGuide의 fridge 키워드 목록에 있으므로 냉장으로 자동 분류된다.
    await expect(card.locator('span', { hasText: '1포기' })).toHaveText('냉장 · 1포기')
  })

  test('수량 없이 재료를 추가하면 카테고리 라벨만 표시되고 "· " 조각이 남지 않는다', async ({ page }) => {
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByPlaceholder('예: 계란').fill('브로콜리')
    // 수량은 비워둔다.
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)

    const card = page.locator('button', { hasText: '브로콜리' })
    await expect(card).toBeVisible()
    // 브로콜리는 storageGuide 키워드 목록에 없으므로 기본값(냉장)을 유지한다.
    const label = card.locator('p + span')
    await expect(label).toHaveText('냉장')
    await expect(label).not.toContainText('·')
  })

  test('기존 재료를 수정할 때 저장된 수량이 미리 채워지고, 수정하면 표시가 갱신된다', async ({ page }) => {
    await page.getByTestId('ingredient-card-1').click() // 계란, quantity: '6개'
    await expect(page.getByRole('heading', { name: '재료 수정' })).toBeVisible()

    const quantityInput = page.getByPlaceholder('예: 2개, 500ml, 1단')
    await expect(quantityInput).toHaveValue('6개')

    await quantityInput.fill('10개')
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)

    const card = page.getByTestId('ingredient-card-1')
    await expect(card.locator('span', { hasText: '10개' })).toHaveText('냉장 · 10개')
  })
})
