import { authApi, endpoints } from "../../../config/APIs"
import { normalizeStoreVariantResponse } from "../model/mapStoreVariant"

/**
 * @param {string} queryString - e.g. "?page=1&category=3"
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchStoreProductVariants = async (queryString = "") => {
  const qs = queryString.startsWith("?") || queryString === "" ? queryString : `?${queryString}`
  const res = await authApi().get(`${endpoints["product-variants"]}${qs}`)
  if (res?.data) {
    res.data = normalizeStoreVariantResponse(res.data)
  }
  return res
}

/**
 * Faceted store search (plan3 UI-2+).
 * @param {Record<string, string|number|boolean|undefined>} params
 */
export const fetchStoreSearch = async (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value))
    }
  })
  const qs = search.toString()
  const res = await authApi().get(`${endpoints["store-search"]}${qs ? `?${qs}` : ""}`)
  if (res?.data?.items) {
    const normalized = normalizeStoreVariantResponse(res.data.items)
    res.data = {
      ...res.data,
      items: normalized,
      results: normalized,
      count: res.data.meta?.total ?? normalized.length,
    }
  }
  return res
}

/**
 * @param {string} q
 */
export const fetchStoreSearchSuggest = async (q) => {
  const params = new URLSearchParams({ q: q || "" })
  return authApi().get(`${endpoints["store-search-suggest"]}?${params.toString()}`)
}

/** All published variants for one store product (no search dedupe). */
export const fetchVariantsByProductId = async (productId, { pageSize = 20 } = {}) => {
  const params = new URLSearchParams({
    product: String(productId),
    page_size: String(pageSize),
  })
  const res = await authApi().get(`${endpoints["product-variants"]}?${params.toString()}`)
  if (res?.data) {
    res.data = normalizeStoreVariantResponse(res.data)
  }
  return res
}

/** Nested store categories (level0 → level1 → level2), source of truth for prescribing nav. */
export const fetchStoreCategories = async () => authApi().get(endpoints["store-categories"])
