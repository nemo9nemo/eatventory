import { test, expect } from '@playwright/test'

test.describe('바코드로 재료 추가', () => {
  test('신규 등록 모달에는 바코드 스캔 버튼이 있고, 수정 모달에는 없다', async ({ page }) => {
    await page.goto('/fridge')

    await page.getByRole('button', { name: '재료 추가' }).click()
    await expect(page.getByTestId('scan-barcode')).toBeVisible()
    await page.getByRole('button', { name: '닫기' }).click()

    await page.getByTestId('ingredient-card-1').click()
    await expect(page.getByRole('heading', { name: '재료 수정' })).toBeVisible()
    await expect(page.getByTestId('scan-barcode')).toHaveCount(0)
  })

  test('카메라를 쓸 수 없는 환경에서는 폴백 안내와 직접 입력하기 버튼을 보여준다', async ({ page }) => {
    await page.goto('/fridge')
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByTestId('scan-barcode').click()

    await expect(page.getByTestId('barcode-scanner')).toBeVisible()
    // 이 테스트 환경엔 실제 카메라 장치가 없으므로 getUserMedia가 실패하고
    // useBarcodeScanner가 'error'/'denied' 상태로 전환되어 폴백 UI가 뜬다.
    await expect(page.getByText('카메라를 사용할 수 없어요')).toBeVisible()
    await expect(page.getByTestId('manual-fallback')).toBeVisible()

    await page.getByTestId('manual-fallback').click()
    await expect(page.getByTestId('barcode-scanner')).toHaveCount(0)
    await expect(page.getByPlaceholder('예: 계란')).toBeVisible()
  })

  test('스캔 화면에서 언제든 "직접 입력으로 전환"으로 폼 모드로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/fridge')
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByTestId('scan-barcode').click()
    await expect(page.getByTestId('barcode-scanner')).toBeVisible()

    await page.getByTestId('switch-to-manual').click()
    await expect(page.getByTestId('barcode-scanner')).toHaveCount(0)
    await expect(page.getByTestId('scan-barcode')).toBeVisible()
  })

  test('스캔 화면에서 나가도 저장/검증 로직은 그대로 동작한다', async ({ page }) => {
    await page.goto('/fridge')
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.getByTestId('scan-barcode').click()
    await page.getByTestId('switch-to-manual').click()

    await page.getByTestId('save-ingredient').click()
    await expect(page.getByText('재료 이름을 입력해주세요.')).toBeVisible()

    await page.getByPlaceholder('예: 계란').fill('바코드테스트재료')
    await page.getByTestId('save-ingredient').click()
    await expect(page.getByTestId('ingredient-modal')).toHaveCount(0)
    await expect(page.getByText('바코드테스트재료')).toBeVisible()
  })
})

test.describe('lookupProductByBarcode (Open Food Facts 연동)', () => {
  // Vite dev 서버는 ES 모듈을 그대로 서빙하므로, 브라우저에서 동적 import로
  // 유틸 함수를 직접 불러와 네트워크 계층만 모킹해 실제 통합 로직을 검증한다.
  test('제품을 찾으면 한글명을 우선해 이름을 반환한다', async ({ page }) => {
    await page.route('https://world.openfoodfacts.org/api/v2/product/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 1,
          product: { product_name: 'Milk 1L', product_name_ko: '우유 1L' },
        }),
      })
    )
    await page.goto('/')
    const result = await page.evaluate(async () => {
      const mod = await import('/src/utils/barcodeLookup.js')
      return mod.lookupProductByBarcode('8801234567890')
    })
    expect(result).toEqual({ name: '우유 1L' })
  })

  test('한글명이 없으면 기본 제품명을 사용한다', async ({ page }) => {
    await page.route('https://world.openfoodfacts.org/api/v2/product/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 1, product: { product_name: 'Milk 1L' } }),
      })
    )
    await page.goto('/')
    const result = await page.evaluate(async () => {
      const mod = await import('/src/utils/barcodeLookup.js')
      return mod.lookupProductByBarcode('8801234567890')
    })
    expect(result).toEqual({ name: 'Milk 1L' })
  })

  test('제품을 찾지 못하면(status 0) null을 반환한다', async ({ page }) => {
    await page.route('https://world.openfoodfacts.org/api/v2/product/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 0 }) })
    )
    await page.goto('/')
    const result = await page.evaluate(async () => {
      const mod = await import('/src/utils/barcodeLookup.js')
      return mod.lookupProductByBarcode('0000000000000')
    })
    expect(result).toBeNull()
  })

  test('네트워크 요청이 실패해도 예외 없이 null을 반환한다', async ({ page }) => {
    await page.route('https://world.openfoodfacts.org/api/v2/product/**', (route) => route.abort())
    await page.goto('/')
    const result = await page.evaluate(async () => {
      const mod = await import('/src/utils/barcodeLookup.js')
      return mod.lookupProductByBarcode('0000000000000')
    })
    expect(result).toBeNull()
  })
})
