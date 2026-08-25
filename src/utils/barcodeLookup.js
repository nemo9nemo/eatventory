const OPEN_FOOD_FACTS_PRODUCT_URL = 'https://world.openfoodfacts.org/api/v2/product'

/**
 * Looks up a product name from a barcode using the Open Food Facts public API.
 * Never throws — any network/parsing failure resolves to null so callers can
 * fall back to manual name entry.
 *
 * @param {string} barcode
 * @returns {Promise<{ name: string } | null>}
 */
export async function lookupProductByBarcode(barcode) {
  if (!barcode) return null

  try {
    const url = `${OPEN_FOOD_FACTS_PRODUCT_URL}/${encodeURIComponent(
      barcode
    )}.json?fields=product_name,product_name_ko`
    const response = await fetch(url)
    if (!response.ok) return null

    const data = await response.json()
    if (!data || data.status === 0) return null

    const product = data.product
    const name = product?.product_name_ko || product?.product_name
    if (!name) return null

    return { name }
  } catch {
    return null
  }
}
