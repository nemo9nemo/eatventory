import { test, expect } from '@playwright/test'

// docs/03_냉장고_디자인_스펙.md 에 정의된 시각 규칙이 실제로 렌더링되는지 회귀 검증한다.
test.describe('냉장고 디자인 스펙 준수', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fridge')
  })

  // v2(docs/03 3-4): 구역 배경 그라데이션은 카드 루트(vwrap, 클릭 타깃)가 아니라
  // 내부 실루엣(`shape`, 카드의 첫 번째 div 자식)에 적용된다. 색상도 v1의 상하 그라데이션
  // (#F7FBFF → #E9F2FC)에서 v2의 대각선 광택 그라데이션(155deg, #fff → zone fill2 75%)으로 바뀌었다.
  test('구역별 용기 실루엣 배경이 스펙 색상 그라데이션을 사용한다', async ({ page }) => {
    const fridgeShape = page.getByTestId('ingredient-card-1').locator('div').first() // 계란, 냉장
    await expect(fridgeShape).toHaveCSS('background-image', /linear-gradient/)
    const bg = await fridgeShape.evaluate((el) => getComputedStyle(el).backgroundImage)
    expect(bg).toContain('255, 255, 255') // #fff
    expect(bg).toContain('233, 242, 252') // #E9F2FC (fridge fill2)
  })

  // v2: 테두리 스타일도 vwrap이 아니라 내부 `shape`에 적용된다.
  test('냉동 선반 용기는 점선 테두리를 사용한다', async ({ page }) => {
    const frozenShape = page.getByTestId('ingredient-card-6').locator('div').first() // 만두, 냉동
    await expect(frozenShape).toHaveCSS('border-style', 'dashed')
  })

  test('유통기한 임박(D-2 이하) 배지는 빨강, 곧 임박(D-3~5)은 주황으로 표시된다', async ({ page }) => {
    const urgentBadge = page.getByTestId('ingredient-card-1').locator('span', { hasText: 'D-1' })
    await expect(urgentBadge).toHaveCSS('background-color', 'rgb(254, 226, 226)')

    const soonBadge = page.getByTestId('ingredient-card-2').locator('span', { hasText: 'D-3' })
    await expect(soonBadge).toHaveCSS('background-color', 'rgb(254, 243, 199)')
  })

  test('유통기한 미입력 재료는 D-day 배지가 없다', async ({ page }) => {
    const noExpiry = page.getByTestId('ingredient-card-8') // 식용유
    await expect(noExpiry.locator('span')).toHaveCount(1) // 카테고리 라벨(실온)만 존재
  })

  test('데스크톱 너비에서 냉장고 프레임 최대폭이 720px로 제한된다', async ({ page, isMobile }) => {
    test.skip(isMobile, '데스크톱 전용 검증')
    const frame = page.locator('div.rounded-\\[28px\\], div.md\\:rounded-\\[32px\\]').first()
    const box = await frame.boundingBox()
    expect(box.width).toBeLessThanOrEqual(720)
  })

  test('가로 스크롤이 발생하지 않는다', async ({ page }) => {
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(hasHorizontalScroll).toBe(false)
  })
})
