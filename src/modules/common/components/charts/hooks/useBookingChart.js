import { useEffect, useState } from "react";
import { fetchBookingStats } from "../../../../../lib/services";
import useDebounce from "../../../../../lib/hooks/useDebounce";
import { CURRENT_DATE } from "../../../../../lib/constants";

const useBookingChart = () => {

    const [bookingChartData, setBookingChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(parseInt(CURRENT_DATE.getFullYear()));

    const debouncedYear = useDebounce(selectedYear, 500);

    useEffect(() => {
        const fetchStats = async () => {
        try {
            const res = await fetchBookingStats(0, selectedYear)
            if(res.status === 200)
                setBookingChartData(res.data.data_examination)
        } catch (error) {
            console.error('Error fetching booking stats:', error.response?.data || error.message);
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
        loading, bookingChartData,
        handleYearChange, selectedYear
    }
}

export default useBookingChart