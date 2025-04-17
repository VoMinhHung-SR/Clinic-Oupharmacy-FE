import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config';
import { APP_ENV } from '../../lib/constants';

/**
 * Updates the status of a specific time slot in a doctor's schedule
 * @param {string} date - The date in format 'YYYY-MM-DD'
 * @param {number} timeSlotId - The ID of the time slot to update
 * @param {string} status - The new status ('processing', 'done', 'undone')
 * @returns {Promise<boolean>} - Returns true if update was successful
 */
export const updateTimeSlotStatus = async (date, timeSlotId, status) => {
    try {
        // Get the document reference
        const docRef = doc(db, `${APP_ENV}_doctor_schedule`, date);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.error('No schedule found for this date');
            return false;
        }

        const data = docSnap.data();
        let updated = false;

        // Update the status in the nested structure
        const updatedSchedules = data.schedules.map(schedule => {
            const updatedTimeSlots = schedule.time_slots.map(slot => {
                if (slot.id === timeSlotId) {
                    updated = true;
                    return { ...slot, status };
                }
                return slot;
            });
            return { ...schedule, time_slots: updatedTimeSlots };
        });

        if (!updated) {
            console.error('Time slot not found');
            return false;
        }

        // Update the document
        await updateDoc(docRef, {
            schedules: updatedSchedules
        });

        return true;
    } catch (error) {
        console.error('Error updating time slot status:', error);
        return false;
    }
};

// Example usage:
// updateTimeSlotStatus('2025-04-12', 48, 'processing')
//   .then(success => console.log('Update status:', success ? 'successful' : 'failed'))
//   .catch(error => console.error('Error:', error));
