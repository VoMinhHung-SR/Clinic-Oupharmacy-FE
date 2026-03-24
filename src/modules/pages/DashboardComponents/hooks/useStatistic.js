import { useContext, useEffect, useState } from "react"
import UserContext from "../../../../lib/context/UserContext"
import { fetchListPatients, fetchListUsers, fetchListMedicinesUnit, fetchStoreProductSummaryCounts } from "../services"

const useStatistic = () => {
    const {user} = useContext(UserContext)
    const [totalPatients, setTotalPatients] = useState(0) 
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalMedicineUnit, setTotalMedicineUnit] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalVariants, setTotalVariants] = useState(0)
    const [totalVariantUnits, setTotalVariantUnits] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=> {

        const getTotalPatients = async () => {
            const res = await fetchListPatients()
            if (res.status === 200)
                setTotalPatients(res.data.count)
        }

        const getTotalUsers = async () => {
            const res = await fetchListUsers()
            if (res.status === 200)
                setTotalUsers(res.data.length)
        }

        const getTotalMedicinesUnit = async () => {
            const res = await fetchListMedicinesUnit()
            if (res.status === 200)
                setTotalMedicineUnit(res.data.count)
        }

        const getStoreSummaryCounts = async () => {
            const res = await fetchStoreProductSummaryCounts()
            if (res.status === 200) {
                setTotalProducts(res.data.products ?? 0)
                setTotalVariants(res.data.variants ?? 0)
                setTotalVariantUnits(res.data.variant_units ?? 0)
            }
        }

        const loadStatistic = () => {
            try{
                getTotalPatients()
                getTotalUsers()
                getTotalMedicinesUnit()
                getStoreSummaryCounts()
            }catch(err){
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        }

        if (user){
            loadStatistic()
        }
    }, [user])

    return {    
        totalPatients, totalUsers, isLoading,
        totalMedicineUnit,
        totalProducts,
        totalVariants,
        totalVariantUnits
    }
}

export default useStatistic