import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { APP_ENV, TOAST_ERROR, TOAST_SUCCESS } from '../../lib/constants';
import { db } from '../../config/firebase';
import createToastMessage from '../../lib/utils/createToastMessage';
import { useTranslation } from 'react-i18next';

const useAppointment = (timeSlotId) => {
    const [appointmentData, setAppointmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {t} = useTranslation(['modal'])
    useEffect(() => {
        const fetchAppointment = async () => {
            if (!timeSlotId) {
                setLoading(false);
                return;
            }

            try {
                const dateDoc = await getDoc(doc(db, `${APP_ENV}_doctor_schedule`, timeSlotId.split('_')[0]));
                
                if (dateDoc.exists()) {
                    const data = dateDoc.data();
                    // Find the schedule containing the time slot
                    let foundAppointment = null;
                    
                    for (const schedule of data.schedules || []) {
                        const timeSlot = schedule.time_slots?.find(slot => slot.id.toString() === timeSlotId.split('_')[1]);
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
    }, [timeSlotId]);

    const updateAppointmentStatus = async (status) => {
        if (!timeSlotId) {
            return;
        }

        try {
            const dateDoc = await getDoc(doc(db, `${APP_ENV}_doctor_schedule`, 
                timeSlotId.split('_')[0]));
            if (!dateDoc.exists()) {
                console.error('No schedule found for this date');
                return;
            }

            const data = dateDoc.data();
            const updatedSchedules = data.schedules.map(schedule => {
                const updatedTimeSlots = schedule.time_slots.map(slot => {
                    if (slot.id.toString() === timeSlotId.split('_')[1]) {
                        return { ...slot, status };
                    }
                    return slot;
                });
                return { ...schedule, time_slots: updatedTimeSlots };
            });

            await updateDoc(doc(db, `${APP_ENV}_doctor_schedule`, timeSlotId.split('_')[0]), {
                schedules: updatedSchedules
            });

            setAppointmentData(prevData => ({
                ...prevData,
                timeSlot: { ...prevData.timeSlot, status }
            }));
            createToastMessage({message: t('modal:updateSuccess'), type: TOAST_SUCCESS})
        } catch (err) {
            setError(err.message);
            createToastMessage({message: t('modal:updateFailed'), type: TOAST_ERROR})
        }
    };

    return { appointmentData, loading, error, updateAppointmentStatus };
};

export default useAppointment;

