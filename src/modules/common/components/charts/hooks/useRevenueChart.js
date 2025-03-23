import { useEffect, useState } from "react";
import { fetchRevenueStats } from "../../../../../lib/services";
import { CURRENT_DATE } from "../../../../../lib/constants";
import useDebounce from "../../../../../lib/hooks/useDebounce";

const useRevenueChart = () => {
    const [revenueData, setRevenueData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(parseInt(CURRENT_DATE.getFullYear()));

    const debouncedYear = useDebounce(selectedYear, 500);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetchRevenueStats(0, selectedYear)
                if(res.status === 200){
                    setRevenueData(res.data.data_revenue)
                }
            } catch (error) {
                console.error('Error fetching revenue stats:', error.response?.data || error.message);
            }finally{
                setLoading(false)
            }
        };
        if (debouncedYear) {
            fetchStats();
        }

    }, [debouncedYear]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value)
    }

    return{
        loading, revenueData, selectedYear,
        handleYearChange
    }
}

export default useRevenueChart