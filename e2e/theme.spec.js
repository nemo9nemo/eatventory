import { test, expect } from '@playwright/test'

// 각 테스트는 Playwright가 새로 발급하는 격리된 브라우저 컨텍스트에서 실행되므로
// localStorage는 테스트마다 이미 비어 있다. addInitScript로 별도 초기화하면 안 된다 —
// 그 스크립트는 테스트 중의 모든 navigation/reload마다 다시 실행되어, 테스트 도중
// 명시적으로 설정한 localStorage 값까지 reload 시점에 지워버린다.
test.describe('다크모드 토글', () => {
  test('토글 클릭 시 html에 dark 클래스가 추가/제거되고 localStorage에 저장된다', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByTestId('theme-toggle')
    const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))

    await toggle.click()
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
      .toBe(!wasDark)
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('eatventory-theme')))
      .toBe(wasDark ? 'light' : 'dark')

    await toggle.click()
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
      .toBe(wasDark)
  })

  test('다크 모드 선택은 새로고침 후에도 유지된다', async ({ page }) => {
    await page.goto('/')
    // 라이트로 명시적으로 고정한 뒤 다크로 전환해 상태를 확정시킨다
    await page.evaluate(() => window.localStorage.setItem('eatventory-theme', 'light'))
    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.getByTestId('theme-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(await page.evaluate(() => window.localStorage.getItem('eatventory-theme'))).toBe('dark')
  })

  test('다크 모드에서 홈 화면 배경/텍스트가 라이트 모드와 다른 색으로 렌더링된다', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.setItem('eatventory-theme', 'light'))
    await page.reload()
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

    await page.getByTestId('theme-toggle').click()
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

    expect(darkBg).not.toBe(lightBg)
  })

  test('냉장고 화면에서도 토글 상태가 유지된 채로 다크 스타일이 적용된다', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.setItem('eatventory-theme', 'dark'))
    await page.reload()

    await page.locator('nav a[href="/fridge"]').click()
    await expect(page).toHaveURL('/fridge')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByTestId('ingredient-card-1')).toBeVisible()
  })

  test('모바일/데스크톱 양쪽에서 토글 버튼이 노출된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByTestId('theme-toggle')).toBeVisible()

    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.getByTestId('theme-toggle')).toBeVisible()
  })
})
