import { useEffect, useState } from "react";
import { fetchMedicineStats } from "../../../../../lib/services";

const useMedicineChart = () => {
    const [medicineLabelChartData, setMedicineLabelChartData] = useState({});
    const [medicineData, setMedicineData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
        try {
            const res = await fetchMedicineStats(0, 2024)
            if(res.status === 200){
                setMedicineData(res.data.data_medicine_quantity)
                setMedicineLabelChartData(res.data.data_medicine_labels)
            }
        } catch (error) {
            console.error('Error fetching medicines stats:', error.response?.data || error.message);
        }finally{
            setLoading(false)
        }
        };
        fetchStats();
    }, []);
    return{
        loading, medicineLabelChartData, medicineData
    }
}

export default useMedicineChart