import { useCallback, useEffect, useMemo, useState } from "react"
import useDebounce from "../../../../lib/hooks/useDebounce"
import { fetchStoreProductVariants, fetchStoreSearch } from "../../api/storeCatalog"
import {
  mapPriceFilterToSearchSort,
  PRESCRIBING_DEFAULT_FILTER,
  PRESCRIBING_MIN_SEARCH_LEN,
  PRESCRIBING_PAGE_SIZE,
  PRESCRIBING_SEARCH_DEBOUNCE_MS,
} from "../../constants"
import { goToTop } from "../../../../lib/utils/helper"

const countActiveFilters = (filter, inStockOnly) => {
  let n = 0
  if ((filter.kw || "").trim()) n += 1
  if (filter.cate && filter.cate !== 0) n += 1
  if (filter.price && filter.price !== "all") n += 1
  if (!inStockOnly) n += 1
  return n
}

const buildProductsQuery = ({ page, filter, inStockOnly }) => {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("page_size", String(PRESCRIBING_PAGE_SIZE))

  const kw = (filter.kw || "").trim()
  if (kw) params.set("kw", kw)

  if (filter.cate && filter.cate !== 0) {
    params.set("category", String(filter.cate))
  }

  if (filter.price && filter.price !== "all") {
    params.set("price_sort", filter.price)
  }

  if (inStockOnly) params.set("in_stock", "true")

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

/**
 * Store catalog for prescribing — search-first; category filter uses leaf/mid store IDs.
 */
const usePrescribingCatalog = ({ enabled = true } = {}) => {
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 })
  const [paramsFilter, setParamsFilter] = useState(PRESCRIBING_DEFAULT_FILTER)
  const [inStockOnly, setInStockOnly] = useState(true)
  const [filterCount, setFilterCount] = useState(0)
  const [reloadToken, setReloadToken] = useState(0)

  const debouncedKw = useDebounce((paramsFilter.kw || "").trim(), PRESCRIBING_SEARCH_DEBOUNCE_MS)

  const hasSearchIntent = useMemo(
    () =>
      debouncedKw.length >= PRESCRIBING_MIN_SEARCH_LEN ||
      (paramsFilter.cate && paramsFilter.cate !== 0),
    [debouncedKw, paramsFilter.cate]
  )

  const useSearchApi = debouncedKw.length >= PRESCRIBING_MIN_SEARCH_LEN

  const bumpReload = useCallback(() => {
    setReloadToken((t) => t + 1)
  }, [])

  const handleChangePage = useCallback((_event, value) => {
    setPage((prev) => {
      if (prev === value) return prev
      goToTop()
      setLoading(true)
      setVariants([])
      return value
    })
  }, [])

  const applyFilter = useCallback((nextFilter, options = {}) => {
    const merged = { ...PRESCRIBING_DEFAULT_FILTER, ...nextFilter }
    setLoading(true)
    setParamsFilter(merged)
    setFilterCount(countActiveFilters(merged, options.inStockOnly ?? inStockOnly))
    setPage(1)
    bumpReload()
  }, [inStockOnly, bumpReload])

  const handleOnSubmitFilter = useCallback((value) => {
    applyFilter(value)
  }, [applyFilter])

  const handleKeywordChange = useCallback((kw) => {
    setParamsFilter((prev) => ({ ...prev, kw }))
    setPage(1)
  }, [])

  const handleRootCategoryChange = useCallback((rootCate, options = {}) => {
    setParamsFilter((prev) => {
      const merged = { ...prev, rootCate, cate: 0 }
      setFilterCount(countActiveFilters(merged, inStockOnly))
      return merged
    })
    setPage(1)
    setVariants([])
    if (!options.silent) {
      setLoading(false)
      setPagination({ count: 0, sizeNumber: 0 })
    }
  }, [inStockOnly])

  const handleCategoryChange = useCallback((cate) => {
    setParamsFilter((prev) => {
      const merged = { ...prev, cate }
      setFilterCount(countActiveFilters(merged, inStockOnly))
      return merged
    })
    setPage(1)
    setLoading(true)
    bumpReload()
  }, [inStockOnly, bumpReload])

  const handleClearCategories = useCallback(() => {
    setParamsFilter((prev) => {
      const merged = { ...prev, rootCate: 0, cate: 0 }
      setFilterCount(countActiveFilters(merged, inStockOnly))
      return merged
    })
    setPage(1)
    setVariants([])
    setPagination({ count: 0, sizeNumber: 0 })
    setLoading(false)
    bumpReload()
  }, [inStockOnly, bumpReload])

  const handleInStockOnlyChange = useCallback((checked) => {
    setInStockOnly(checked)
    setFilterCount(countActiveFilters(paramsFilter, checked))
    setPage(1)
    bumpReload()
  }, [paramsFilter, bumpReload])

  const refresh = useCallback(() => {
    bumpReload()
  }, [bumpReload])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    if (!hasSearchIntent) {
      setVariants([])
      setPagination({ count: 0, sizeNumber: 0 })
      setLoading(false)
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        let results = []
        let total = 0

        if (useSearchApi) {
          const res = await fetchStoreSearch({
            q: debouncedKw,
            page,
            page_size: PRESCRIBING_PAGE_SIZE,
            category: paramsFilter.cate && paramsFilter.cate !== 0 ? paramsFilter.cate : undefined,
            in_stock: inStockOnly ? true : undefined,
            sort: mapPriceFilterToSearchSort(paramsFilter.price, true),
          })
          if (cancelled) return
          if (res.status === 200) {
            results = Array.isArray(res.data?.results) ? res.data.results : []
            total = res.data?.count ?? res.data?.meta?.total ?? results.length
          }
        } else {
          const res = await fetchStoreProductVariants(
            buildProductsQuery({ page, filter: paramsFilter, inStockOnly })
          )
          if (cancelled) return
          if (res.status === 200) {
            results = Array.isArray(res.data?.results) ? res.data.results : []
            total = res.data?.count ?? 0
          }
        }

        setVariants(results)
        setPagination({
          count: total,
          sizeNumber: Math.ceil(total / PRESCRIBING_PAGE_SIZE),
        })
      } catch {
        if (!cancelled) {
          setVariants([])
          setPagination({ count: 0, sizeNumber: 0 })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [
    enabled,
    hasSearchIntent,
    useSearchApi,
    debouncedKw,
    page,
    paramsFilter,
    inStockOnly,
    reloadToken,
  ])

  return {
    variants,
    medicineUnits: variants,
    loading,
    medicineLoading: loading,
    page,
    pagination,
    paramsFilter,
    filterCount,
    inStockOnly,
    isIdle: !hasSearchIntent,
    hasSearchIntent,
    handleOnSubmitFilter,
    handleKeywordChange,
    handleRootCategoryChange,
    handleCategoryChange,
    handleClearCategories,
    handleInStockOnlyChange,
    setInStockOnly: handleInStockOnlyChange,
    handleChangePage,
    refresh,
    pageSize: PRESCRIBING_PAGE_SIZE,
  }
}

export default usePrescribingCatalog
