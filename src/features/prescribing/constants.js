/** Catalog page size on prescribing workspace (plan3 — was PAGE_SIZE 12). */
export const PRESCRIBING_PAGE_SIZE = 20

/** Min keyword length before switching to search API (UI-2). */
export const PRESCRIBING_MIN_SEARCH_LEN = 2

export const PRESCRIBING_SEARCH_DEBOUNCE_MS = 300

export const PRESCRIBING_DEFAULT_FILTER = {
  kw: "",
  rootCate: 0,
  cate: 0,
  price: "all",
}

export const mapPriceFilterToSearchSort = (price, keywordActive) => {
  if (price === "asc") return "price_asc"
  if (price === "desc") return "price_desc"
  return keywordActive ? "relevance" : "popular"
}
