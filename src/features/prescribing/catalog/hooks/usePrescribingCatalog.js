import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { fetchStoreProductVariants } from "../../api/storeCatalog"
import {
  PRESCRIBING_DEFAULT_FILTER,
  PRESCRIBING_PAGE_SIZE,
} from "../../constants"
import { goToTop } from "../../../../lib/utils/helper"

const countActiveFilters = (filter) =>
  Object.values(filter).filter((v) => v !== 0 && v !== "" && v !== "all").length

/**
 * Store catalog for the prescribing workspace.
 * Uses correct BE query params: `category`, `price_sort` (not legacy `cate` / `price`).
 */
const usePrescribingCatalog = ({ enabled = true } = {}) => {
  const [searchParams] = useSearchParams()
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(Boolean(enabled))
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 })
  const [paramsFilter, setParamsFilter] = useState(PRESCRIBING_DEFAULT_FILTER)
  const [filterCount, setFilterCount] = useState(0)
  const [reloadToken, setReloadToken] = useState(0)

  const catalogQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(page))
    params.set("page_size", String(PRESCRIBING_PAGE_SIZE))

    const kw = (paramsFilter.kw || "").trim()
    if (kw) params.set("kw", kw)
    else params.delete("kw")

    if (paramsFilter.cate && paramsFilter.cate !== 0) {
      params.set("category", String(paramsFilter.cate))
    } else {
      params.delete("category")
    }

    if (paramsFilter.price && paramsFilter.price !== "all") {
      params.set("price_sort", paramsFilter.price)
    } else {
      params.delete("price_sort")
    }

    params.delete("cate")
    params.delete("price")

    const qs = params.toString()
    return qs ? `?${qs}` : ""
  }, [searchParams, page, paramsFilter])

  const handleChangePage = useCallback((_event, value) => {
    setPage((prev) => {
      if (prev === value) return prev
      goToTop()
      setLoading(true)
      setVariants([])
      return value
    })
  }, [])

  const handleOnSubmitFilter = useCallback((value) => {
    setLoading(true)
    setParamsFilter(value)
    setFilterCount(countActiveFilters(value))
    setPage(1)
    setReloadToken((t) => t + 1)
  }, [])

  const refresh = useCallback(() => {
    setReloadToken((t) => t + 1)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchStoreProductVariants(catalogQuery)
        if (cancelled) return
        if (res.status === 200) {
          const data = res.data
          const results = Array.isArray(data?.results) ? data.results : []
          const total = data.count ?? 0
          setVariants(results)
          setPagination({
            count: total,
            sizeNumber: Math.ceil(total / PRESCRIBING_PAGE_SIZE),
          })
        } else {
          setVariants([])
          setPagination({ count: 0, sizeNumber: 0 })
        }
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
  }, [catalogQuery, enabled, reloadToken])

  return {
    variants,
    /** @deprecated use `variants` — alias for legacy components */
    medicineUnits: variants,
    loading,
    medicineLoading: loading,
    page,
    pagination,
    paramsFilter,
    filterCount,
    handleOnSubmitFilter,
    handleChangePage,
    refresh,
    pageSize: PRESCRIBING_PAGE_SIZE,
  }
}

export default usePrescribingCatalog
