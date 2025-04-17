import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { APP_ENV, TOAST_ERROR, TOAST_SUCCESS } from '../../lib/constants';
import { db } from '../../config/firebase';
import createToastMessage from '../../lib/utils/createToastMessage';
import { useTranslation } from 'react-i18next';

// date format: YYYYMMDD
// Example: "20231225" where 20231225 is the date and 1 is the slot ID
const useAppointment = (date, slotId) => {
    const [appointmentData, setAppointmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {t} = useTranslation(['modal'])

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!date || !slotId) {
                setLoading(false);
                return;
            }

            try {
                const dateDoc = await getDoc(doc(db, `${APP_ENV}_doctor_schedule`, date));
                
                if (dateDoc.exists()) {
                    const data = dateDoc.data();
                    
                    // Find the schedule containing the time slot
                    let foundAppointment = null;
                    
                    for (const schedule of data.schedules || []) {
                        const timeSlot = schedule.time_slots?.find(slot => slot.id.toString() === slotId.toString());
                        if (timeSlot) {
                            foundAppointment = {
                                date: data.date,
                                doctor: {
                                    id: schedule.doctor_id,
                                    email: schedule.doctor_email,
                                    name: schedule.doctor_name
                                },
                                session: schedule.session,
                                timeSlot: {
                                    id: timeSlot.id,
                                    startTime: timeSlot.start_time,
                                    endTime: timeSlot.end_time,
                                    isAvailable: timeSlot.is_available,
                                    status: timeSlot.status,
                                    patientInfo: timeSlot.patient_info || null
                                }
                            };
                            break;
                        }
                    }
                    
                    setAppointmentData(foundAppointment);
                } else {
                    setAppointmentData(null);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [date, slotId]);

    const updateAppointmentStatus = async (status) => {
        if (!date || !slotId) {
            return;
        }

        try {
            const dateDoc = await getDoc(doc(db, `${APP_ENV}_doctor_schedule`, date));
            if (!dateDoc.exists()) {
                console.error('No schedule found for this date:', date);
                return;
            }

            const data = dateDoc.data();

            let found = false;
            const updatedSchedules = data.schedules.map(schedule => {
                const updatedTimeSlots = schedule.time_slots.map(slot => {
                    if (slot.id.toString() === slotId.toString()) {
                        found = true;
                        return { ...slot, status };
                    }
                    return slot;
                });
                return { ...schedule, time_slots: updatedTimeSlots };
            });

            if (!found) {
                return;
            }

            await updateDoc(doc(db, `${APP_ENV}_doctor_schedule`, date), {
                schedules: updatedSchedules
            });

            setAppointmentData(prevData => {
                if (!prevData) {
                    return null;
                }
                return {
                    ...prevData,
                    timeSlot: { ...prevData.timeSlot, status }
                };
            });
            createToastMessage({message: t('modal:updateSuccess'), type: TOAST_SUCCESS})
        } catch (err) {
            setError(err.message);
            createToastMessage({message: t('modal:updateFailed'), type: TOAST_ERROR})
        }
    };

    return { appointmentData, loading, error, updateAppointmentStatus };
};

export default useAppointment;