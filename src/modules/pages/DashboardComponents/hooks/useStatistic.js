import { useContext, useEffect, useState } from "react"
import UserContext from "../../../../lib/context/UserContext"
import { fetchListPatients, fetchListUsers } from "../services"
import { fetchMedicinesUnit } from "../../../common/components/card/PrescriptionDetailCard/services"

const useStatistic = () => {
    const {user} = useContext(UserContext)
    const [totalPatients, setTotalPatients] = useState(0) 
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalMedicineUnit, setTotalMedicineUnit] = useState(0)
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
            const res = await fetchMedicinesUnit()
            if (res.status === 200)
                setTotalMedicineUnit(res.data.count)
        }

        const loadStatistic = () => {
            try{
                getTotalPatients()
                getTotalUsers()
                getTotalMedicinesUnit()
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
        totalMedicineUnit
    }
}

export default useStatistic