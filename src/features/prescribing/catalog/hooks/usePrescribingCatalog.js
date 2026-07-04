import { useCallback, useEffect, useMemo, useState } from "react"
import useDebounce from "../../../../lib/hooks/useDebounce"
import { fetchStoreProductVariants, fetchStoreSearch } from "../../api/storeCatalog"
import {
  PRESCRIBING_DEFAULT_FILTER,
  PRESCRIBING_MIN_SEARCH_LEN,
  PRESCRIBING_PAGE_SIZE,
  PRESCRIBING_SEARCH_DEBOUNCE_MS,
} from "../../constants"
import { goToTop } from "../../../../lib/utils/helper"

const countActiveFilters = (filter) => {
  let n = 0
  if ((filter.kw || "").trim()) n += 1
  if (filter.cate && filter.cate !== 0) n += 1
  return n
}

const buildProductsQuery = ({ page, filter }) => {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("page_size", String(PRESCRIBING_PAGE_SIZE))

  const kw = (filter.kw || "").trim()
  if (kw) params.set("kw", kw)

  if (filter.cate && filter.cate !== 0) {
    params.set("category", String(filter.cate))
  }

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
  const [filterCount, setFilterCount] = useState(0)
  const [reloadToken, setReloadToken] = useState(0)

  const kwTrimmed = useMemo(() => (paramsFilter.kw || "").trim(), [paramsFilter.kw])
  const debouncedKw = useDebounce(kwTrimmed, PRESCRIBING_SEARCH_DEBOUNCE_MS)

  const hasBrowseIntent = useMemo(
    () => Boolean(paramsFilter.cate && paramsFilter.cate !== 0),
    [paramsFilter.cate]
  )

  const hasKeywordWithCategory = useMemo(
    () => kwTrimmed.length >= PRESCRIBING_MIN_SEARCH_LEN && hasBrowseIntent,
    [kwTrimmed, hasBrowseIntent]
  )

  const hasKeywordOnly = useMemo(
    () => kwTrimmed.length >= PRESCRIBING_MIN_SEARCH_LEN && !hasBrowseIntent,
    [kwTrimmed, hasBrowseIntent]
  )

  const hasCategoryOnlyBrowse = useMemo(
    () => hasBrowseIntent && kwTrimmed.length < PRESCRIBING_MIN_SEARCH_LEN,
    [hasBrowseIntent, kwTrimmed]
  )

  /** Keyword search, category browse, or keyword + category (faceted search). */
  const hasSearchIntent = hasCategoryOnlyBrowse || hasKeywordWithCategory || hasKeywordOnly

  const isKeywordDebouncing = useMemo(
    () => kwTrimmed.length >= PRESCRIBING_MIN_SEARCH_LEN && debouncedKw !== kwTrimmed,
    [kwTrimmed, debouncedKw]
  )

  const isIdle = useMemo(
    () => kwTrimmed.length < PRESCRIBING_MIN_SEARCH_LEN && !hasBrowseIntent,
    [kwTrimmed, hasBrowseIntent]
  )

  const bumpReload = useCallback(() => {
    setReloadToken((t) => t + 1)
  }, [])

  useEffect(() => {
    setFilterCount(countActiveFilters(paramsFilter))
  }, [paramsFilter])

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
    setPage(1)
    bumpReload()
  }, [bumpReload])

  const handleOnSubmitFilter = useCallback((value) => {
    applyFilter(value)
  }, [applyFilter])

  const handleKeywordChange = useCallback((kw) => {
    setParamsFilter((prev) => ({ ...prev, kw }))
    setPage(1)
    if ((kw || "").trim().length >= PRESCRIBING_MIN_SEARCH_LEN) {
      setLoading(true)
    }
  }, [])

  const handleRootCategoryChange = useCallback((rootCate, options = {}) => {
    setParamsFilter((prev) => ({ ...prev, rootCate, cate: 0 }))
    setPage(1)
    setVariants([])
    if (!options.silent) {
      setLoading(false)
      setPagination({ count: 0, sizeNumber: 0 })
    }
  }, [])

  const handleCategoryChange = useCallback((cate) => {
    setParamsFilter((prev) => ({ ...prev, cate }))
    setPage(1)
    setLoading(true)
    bumpReload()
  }, [bumpReload])

  const handleClearCategories = useCallback(() => {
    setParamsFilter((prev) => ({ ...prev, rootCate: 0, cate: 0 }))
    setPage(1)
    setVariants([])
    setPagination({ count: 0, sizeNumber: 0 })
    setLoading(false)
    bumpReload()
  }, [bumpReload])

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

    const keywordActive = kwTrimmed.length >= PRESCRIBING_MIN_SEARCH_LEN
    if (keywordActive && debouncedKw !== kwTrimmed) {
      setLoading(true)
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        let results = []
        let total = 0

        if (hasKeywordWithCategory || hasKeywordOnly) {
          const res = await fetchStoreSearch({
            q: debouncedKw,
            page,
            page_size: PRESCRIBING_PAGE_SIZE,
            sort: "relevance",
            category: hasKeywordWithCategory ? paramsFilter.cate : undefined,
          })
          if (cancelled) return
          if (res.status === 200) {
            results = Array.isArray(res.data?.items)
              ? res.data.items
              : Array.isArray(res.data?.results)
                ? res.data.results
                : []
            total = res.data?.meta?.total ?? res.data?.count ?? results.length
          }
        } else {
          const res = await fetchStoreProductVariants(
            buildProductsQuery({ page, filter: { ...paramsFilter, kw: debouncedKw } })
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
    hasKeywordWithCategory,
    hasKeywordOnly,
    kwTrimmed,
    debouncedKw,
    page,
    paramsFilter,
    reloadToken,
  ])

  const catalogLoading = loading || isKeywordDebouncing

  return {
    variants,
    medicineUnits: variants,
    loading: catalogLoading,
    medicineLoading: catalogLoading,
    page,
    pagination,
    paramsFilter,
    filterCount,
    isIdle,
    hasSearchIntent,
    hasBrowseIntent,
    handleOnSubmitFilter,
    handleKeywordChange,
    handleRootCategoryChange,
    handleCategoryChange,
    handleClearCategories,
    handleChangePage,
    refresh,
    pageSize: PRESCRIBING_PAGE_SIZE,
  }
}

export default usePrescribingCatalog
