import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { APP_ENV, CURRENT_DATE, TOAST_SUCCESS, TOAST_ERROR } from '../../../../lib/constants';
import { ConfirmAlert } from '../../../../config/sweetAlert2';
import createToastMessage from '../../../../lib/utils/createToastMessage';
import { useTranslation } from 'react-i18next';

/**
 * Hook to get real-time online waiting room data
 * @param {Date} date - Date to fetch data for, defaults to current date
 * @returns {Object} - Appointment data, loading state and error
 */
const useOnlineWaitingRoom = (date = CURRENT_DATE) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {t} = useTranslation(['waiting-room', 'modal'])

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
                setSchedules([]);
                setLoading(false);
            }
        );
        // Cleanup function
        return () => {
            unsubscribe();
        };
    }, [date]);

    const updateTimeSlot = async (appointmentId, newStartTime, newEndTime, doctorId, oldSession, newSession) => {
        const handleUpdate = async () => {
            try {
                const formattedDate = date.toISOString().split('T')[0];
                const docRef = doc(db, `${APP_ENV}_doctor_schedule`, formattedDate);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // 1. Tìm schedule cũ (old session)
                    const oldSchedule = data.schedules.find(
                        sch => sch.doctor_id == doctorId && sch.session === oldSession && sch.is_off === false
                    );
                    // 2. Tìm schedule mới (new session)
                    const newSchedule = data.schedules.find(
                        sch => sch.doctor_id == doctorId && sch.session === newSession && sch.is_off === false
                    );

                    if (!oldSchedule || !newSchedule) {
                        createToastMessage({message: t('waiting-room:noSessionFound'), type: TOAST_ERROR});
                        return false;
                    }

                    // 3. Tìm slot trong ca cũ
                    const slotIndex = oldSchedule.time_slots.findIndex(
                        slot => slot.appointment_info && slot.appointment_info.id == appointmentId
                    );
                    if (slotIndex === -1) {
                        createToastMessage({message: t('waiting-room:appointmentNotFound'), type: TOAST_ERROR});
                        return false;
                    }

                    // 4. Lấy slot, cập nhật giờ mới, xóa khỏi ca cũ
                    const slot = oldSchedule.time_slots[slotIndex];
                    slot.start_time = newStartTime + ':00';
                    slot.end_time = newEndTime + ':00';
                    oldSchedule.time_slots.splice(slotIndex, 1);

                    // 5. Thêm slot vào ca mới
                    newSchedule.time_slots.push(slot);

                    await updateDoc(docRef, { schedules: data.schedules });
                    createToastMessage({message: t('modal:updateSuccess'), type: TOAST_SUCCESS});
                    return true;
                } else {
                    createToastMessage({message: t('waiting-room:docNotFound'), type: TOAST_ERROR});
                    return false;
                }
            } catch (err) {
                createToastMessage({message: t('modal:updateFailed'), type: TOAST_ERROR});
                return false;
            }
        };

        return ConfirmAlert(
            t('waiting-room:confirmUpdateTimeSlot'),
            t('modal:noThrowBack'), t('modal:yes'), t('modal:cancel'),
            async () => {
                const result = await handleUpdate();
                return result;
            },
            () => { return false; }
        );
    };

    return {
        schedules,
        loading,
        error,
        updateTimeSlot
    };
};

export default useOnlineWaitingRoom;