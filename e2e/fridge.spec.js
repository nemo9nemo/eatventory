import { test, expect } from '@playwright/test'

test.describe('냉장고 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fridge')
  })

  test('초기 상태에서 실온/냉장/냉동 선반이 모두 표시된다', async ({ page }) => {
    await expect(page.getByText('실온 선반 · 3개')).toBeVisible()
    await expect(page.getByText('냉장 선반 · 5개')).toBeVisible()
    await expect(page.getByText('냉동 선반 · 2개')).toBeVisible()
  })

  test('탭 전환 시 선택한 구역의 재료만 보여준다', async ({ page }) => {
    await page.getByTestId('fridge-tab-frozen').click()
    await expect(page.getByText('냉동 선반 · 2개')).toBeVisible()
    await expect(page.getByText('냉장 선반')).toHaveCount(0)
    await expect(page.getByText('실온 선반')).toHaveCount(0)
  })

  test('검색어로 재료를 필터링한다', async ({ page }) => {
    await page.getByPlaceholder('재료 이름으로 검색').fill('계란')
    await expect(page.getByText('냉장 선반 · 1개')).toBeVisible()
    await expect(page.getByText('실온 선반')).toHaveCount(0)
  })

  test('검색 결과가 없으면 빈 상태 안내를 보여준다', async ({ page }) => {
    await page.getByPlaceholder('재료 이름으로 검색').fill('존재하지않는재료')
    await expect(page.getByText('아직 등록된 재료가 없어요')).toBeVisible()
  })

  test('재료 이름 없이 저장하면 에러 메시지를 보여주고 닫히지 않는다', async ({ page }) => {
    await page.getByRole('button', { name: '재료 추가' }).click()
    await expect(page.getByTestId('ingredient-modal')).toBeVisible()
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByText('재료 이름을 입력해주세요.')).toBeVisible()
    await expect(page.getByTestId('ingredient-modal')).toBeVisible()
  })

  test('재료를 추가하면 해당 선반에 즉시 반영된다', async ({ page }) => {
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByPlaceholder('예: 계란').fill('당근')
    await page.getByTestId('category-frozen').click()
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)
    await expect(page.getByText('냉동 선반 · 3개')).toBeVisible()
    await expect(page.getByText('당근')).toBeVisible()
  })

  test('재료 카드를 클릭하면 기존 값이 채워진 수정 모달이 열린다', async ({ page }) => {
    await page.getByTestId('ingredient-card-1').click()
    await expect(page.getByRole('heading', { name: '재료 수정' })).toBeVisible()
    await expect(page.getByPlaceholder('예: 계란')).toHaveValue('계란')
    await expect(page.getByTestId('delete-ingredient')).toBeVisible()
  })

  test('삭제 버튼을 누르면 재료가 목록에서 사라진다', async ({ page }) => {
    await page.getByTestId('ingredient-card-1').click()
    await page.getByTestId('delete-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)
    await expect(page.getByTestId('ingredient-card-1')).toHaveCount(0)
    await expect(page.getByText('냉장 선반 · 4개')).toBeVisible()
  })

  test('재료가 있으면 레시피 추천받기 버튼이 노출된다', async ({ page }) => {
    const cta = page.getByRole('button', { name: '이 재료로 레시피 추천받기' })
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL('/recipes')
  })
})
