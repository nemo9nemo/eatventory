import { test, expect } from '@playwright/test'

test.describe('보관 구분 자동 추천', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fridge')
    await page.getByRole('button', { name: '재료 추가' }).click()
  })

  test('실온 재료명을 입력하면 실온이 자동 선택된다', async ({ page }) => {
    await page.getByPlaceholder('예: 계란').fill('감자')
    await expect(page.getByTestId('category-auto-hint')).toBeVisible()
    await expect(page.getByTestId('category-room')).toHaveClass(/bg-emerald-600/)
  })

  test('냉동 재료명을 입력하면 냉동이 자동 선택된다', async ({ page }) => {
    await page.getByPlaceholder('예: 계란').fill('새우')
    await expect(page.getByTestId('category-frozen')).toHaveClass(/bg-emerald-600/)
  })

  test('매칭되는 재료명이 없으면 자동 추천 문구가 뜨지 않고 기본값(냉장)을 유지한다', async ({ page }) => {
    await page.getByPlaceholder('예: 계란').fill('희귀재료XYZ')
    await expect(page.getByTestId('category-auto-hint')).toHaveCount(0)
    await expect(page.getByTestId('category-fridge')).toHaveClass(/bg-emerald-600/)
  })

  test('사용자가 보관 구분을 직접 선택하면, 그 뒤 이름을 바꿔도 자동 추천이 덮어쓰지 않는다', async ({ page }) => {
    const nameInput = page.getByPlaceholder('예: 계란')
    await nameInput.fill('감자')
    await expect(page.getByTestId('category-room')).toHaveClass(/bg-emerald-600/)

    await page.getByTestId('category-frozen').click()
    await expect(page.getByTestId('category-auto-hint')).toHaveCount(0)

    await nameInput.fill('감자칩')
    await expect(page.getByTestId('category-frozen')).toHaveClass(/bg-emerald-600/)
    await expect(page.getByTestId('category-auto-hint')).toHaveCount(0)
  })

  test('재료 수정 모달에서는 자동 추천이 동작하지 않는다', async ({ page }) => {
    await page.getByRole('button', { name: '닫기' }).click()
    await page.getByTestId('ingredient-card-9').click() // 양파, room
    await expect(page.getByRole('heading', { name: '재료 수정' })).toBeVisible()
    await expect(page.getByTestId('category-auto-hint')).toHaveCount(0)
    await expect(page.getByTestId('category-room')).toHaveClass(/bg-emerald-600/)
  })

  test('실제로 저장하면 자동 추천된 구분으로 등록된다', async ({ page }) => {
    await page.getByPlaceholder('예: 계란').fill('고구마')
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)
    await expect(page.getByText('실온 선반 · 4개')).toBeVisible()
    await expect(page.getByText('고구마')).toBeVisible()
  })
})
