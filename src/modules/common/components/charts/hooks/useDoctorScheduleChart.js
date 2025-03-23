import moment from "moment";
import { useEffect, useState } from "react";
import { fetchGetDoctorScheduleByWeek } from "../../../../pages/DoctorScheduleComponents/services";
import { useSearchParams } from "react-router-dom";

const useDoctorScheduleChart = () => {
    const [dataChart, setDataChart] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const now = moment();
    const [selectedWeek, setSelectedWeek] = useState(now.isoWeek());
    const [weeksOfYear, setWeeksOfYear] = useState([]);
    
    const [q] = useSearchParams();

    const generateWeeksOfYear = (year) => {
        let totalWeeks = moment(`${year}-12-31`, "YYYY-MM-DD").isoWeeksInYear();
        return Array.from({ length: totalWeeks }, (_, i) => i + 1);
    };

    useEffect(() => {
        setWeeksOfYear(generateWeeksOfYear(selectedYear));
    }, [selectedYear]);

    useEffect(() => {
        const getScheduleWeekly = async () => {
            try {
                let query = q.toString();
                
                let querySample = query 
                    ? `${query}&week=${selectedYear}-W${selectedWeek.toString().padStart(2, '0')}`
                    : `week=${selectedYear}-W${selectedWeek.toString().padStart(2, '0')}`;
            
                const res = await fetchGetDoctorScheduleByWeek(querySample);
                if (res.status === 200) {
                    setDataChart(res.data);
                }
            } catch (err) {
                console.log(err);
                setDataChart([]);
            }
        };
        getScheduleWeekly();
    }, [selectedYear, selectedWeek]);

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleChangeWeek = (e) => {   
        setSelectedWeek(Number(e.target.value));
    };

    return {
        dataChart, selectedWeek, selectedYear, weeksOfYear,
        handleChangeWeek, handleYearChange
    };
};

export default useDoctorScheduleChart;
