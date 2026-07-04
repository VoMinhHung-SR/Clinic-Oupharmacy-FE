import { useEffect, useState } from "react"
import { fetchMedicinesUnit } from "../../modules/common/components/card/PrescriptionDetailCard/services"
import { useSearchParams } from "react-router-dom"
import { PAGE_SIZE } from "../constants"
import { goToTop } from "../utils/helper"
import { normalizeStoreVariantResponse } from "../adapters/storeProduct"

/** Paginated store product browse for `/products` (MedicinesHome). */
const useMedicine = ({ enabled = true } = {}) => {
    const [medicineUnits, setMedicineUnits] = useState([])
    const [medicineLoading, setMedicineLoading] = useState(Boolean(enabled))
    const [q] = useSearchParams()
    const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 })
    const [page, setPage] = useState(1)

    const handleChangePage = (event, value) => {
        if (page === value) return
        goToTop()
        setMedicineLoading(true)
        setMedicineUnits([])
        setPage(value)
    }

    useEffect(() => {
        if (!enabled) {
            setMedicineLoading(false)
            return undefined
        }
        const loadMedicines = async () => {
            try {
                let querySample = q.toString()
                const params = new URLSearchParams(
                    querySample.startsWith("?") ? querySample.slice(1) : querySample
                )
                params.set("page", String(page))
                params.set("page_size", String(PAGE_SIZE))

                if (params.has("cate") && !params.has("category")) {
                    params.set("category", params.get("cate"))
                    params.delete("cate")
                }
                if (params.has("price") && !params.has("price_sort")) {
                    const price = params.get("price")
                    if (price && price !== "all") params.set("price_sort", price)
                    params.delete("price")
                }

                const queryString = params.toString()
                querySample = queryString ? `?${queryString}` : ""

                const res = await fetchMedicinesUnit(querySample)
                if (res.status === 200) {
                    const data = normalizeStoreVariantResponse(res.data)
                    setMedicineUnits(Array.isArray(data?.results) ? data.results : [])
                    setPagination({
                        count: data.count ?? 0,
                        sizeNumber: Math.ceil((data.count ?? 0) / PAGE_SIZE),
                    })
                }
            } catch {
                setMedicineUnits([])
            } finally {
                setMedicineLoading(false)
            }
        }
        loadMedicines()
    }, [page, enabled, q])

    return {
        page,
        medicineUnits,
        pagination,
        medicineLoading,
        handleChangePage,
    }
}

export default useMedicine
