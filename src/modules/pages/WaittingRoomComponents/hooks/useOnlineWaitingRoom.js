import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
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

    const updateTimeSlot = async (appointmentId, newStartTime, newEndTime) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const docRef = doc(db, `${APP_ENV}_doctor_schedule`, formattedDate);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                let updated = false;
                console.log('Looking for appointmentId:', appointmentId);
                console.log('All slot ids:', data.schedules.flatMap(sch => sch.time_slots.map(slot => slot.appointment_info.id)));
                data.schedules.forEach(schedule => {
                    schedule.time_slots.forEach(slot => {
                        if (slot.appointment_info && slot.appointment_info.id == appointmentId) {
                            slot.start_time = newStartTime + ':00';
                            slot.end_time = newEndTime + ':00';
                            updated = true;
                        }
                    });
                });
                if (updated) {
                    await updateDoc(docRef, { schedules: data.schedules });
                } else {
                    throw new Error('Appointment not found');
                }
            } else {
                throw new Error('Document not found');
            }
        } catch (err) {
            console.error('Error updating time slot:', err);
            throw err;
        }
    };

    return {
        schedules,
        loading,
        error,
        updateTimeSlot
    };
};

export default useOnlineWaitingRoom;