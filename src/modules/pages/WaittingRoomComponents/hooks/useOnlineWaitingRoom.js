import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { APP_ENV, CURRENT_DATE } from '../../../../lib/constants';

const useOnlineWaitingRoom = (date  = CURRENT_DATE) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                setError(null);

                const formattedDate = date.toISOString().split('T')[0];
                const docRef = doc(db, `${APP_ENV}_doctor_schedule`, formattedDate);
                const docSnap = await getDoc(docRef);
    
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
            } catch (err) {
                setError(err.message);
                console.error('Error fetching schedules:', err);
                setSchedules([]);
            } finally {
                setLoading(false);
            }
        };
    
        if (date) {
            fetchSchedules();
        }
    }, [date]);

    return {
        schedules,
        loading,
        error
    };
};

export default useOnlineWaitingRoom;