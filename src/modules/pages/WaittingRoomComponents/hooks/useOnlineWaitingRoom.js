import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { APP_ENV, CURRENT_DATE } from '../../../../lib/constants';

/**
 * Hook to get real-time online waiting room data
 * @param {Date} date - Date to fetch data for, defaults to current date
 * @returns {Object} - Appointment data, loading state and error
 */
const useOnlineWaitingRoom = (date = CURRENT_DATE) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const formattedDate = date.toISOString().split('T')[0];
        const docRef = doc(db, `${APP_ENV}_doctor_schedule`, formattedDate);
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data && data.schedules && Array.isArray(data.schedules)) {
                        setSchedules(data.schedules);
                    } else {
                        console.log("Document exists but no valid schedules array found:", data);
                        setSchedules([]);
                    }
                } else {
                    console.log("No document found for date:", formattedDate);
                    setSchedules([]);
                }
                setLoading(false);
            }, (err) => {
                setError(err.message);
                console.error('Error fetching schedules:', err);
                setSchedules([]);
                setLoading(false);
            }
        );
        
        // Cleanup function
        return () => {
            unsubscribe();
        };
    }, [date]);

    return {
        schedules,
        loading,
        error
    };
};

export default useOnlineWaitingRoom;