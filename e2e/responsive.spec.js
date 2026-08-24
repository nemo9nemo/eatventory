import { test, expect } from '@playwright/test'

test.describe('반응형 레이아웃', () => {
  test('모바일 너비에서는 하단 고정 네비게이션으로 표시된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toHaveCSS('position', 'fixed')
    await expect(nav).toHaveCSS('flex-direction', 'row')
  })

  test('데스크톱 너비에서는 좌측 사이드바 네비게이션으로 전환된다', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toHaveCSS('position', 'static')
    await expect(nav).toHaveCSS('flex-direction', 'column')
  })

  test('모바일 너비에서 가로 스크롤이 발생하지 않는다 (홈/냉장고/레시피 목록)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    for (const path of ['/', '/fridge', '/recipes', '/favorites']) {
      await page.goto(path)
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      expect(hasHorizontalScroll, `${path} 에서 가로 스크롤 발생`).toBe(false)
    }
  })
})
