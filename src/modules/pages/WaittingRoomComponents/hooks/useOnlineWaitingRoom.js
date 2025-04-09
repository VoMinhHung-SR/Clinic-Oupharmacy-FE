import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

const useOnlineWaitingRoom = (date) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                setError(null);

                // Format date to ISO string to match backend format
                const formattedDate = date.toISOString().split('T')[0];
                
                // Get the document from Firestore
                const docRef = doc(db, 'doctor_schedule', formattedDate);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSchedules(data.schedules || []);
                } else {
                    setSchedules([]);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching schedules:', err);
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