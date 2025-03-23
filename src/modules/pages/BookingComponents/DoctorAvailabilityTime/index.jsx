import { Divider } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DoctorAvailabilityTime = ({ schedule, isLoading, selectedStartTime, selectedEndTime, onChange, defaultValue }) => {
  const { t } = useTranslation(['common']);

  const [selectedTime, setSelectedTime] = useState({ start: selectedStartTime, end: selectedEndTime });

  const renderRadioButtons = (hours, session) => {
    return hours.map((hour, index) => {
      const startHour = `${hour.toString().padStart(2, "0")}:00:00`;
      const endHour = `${(hour + 1).toString().padStart(2, "0")}:00:00`;
      const label = `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`;

      const scheduleItem = schedule.find(
        (time) => time.session === session && time.is_off === false
      );
      const scheduleID = scheduleItem ? scheduleItem.id : null;

      const isDisabled = scheduleItem === undefined || scheduleItem.time_slots.some(
        (slot) => slot.start_time === startHour && slot.end_time === endHour
      );
      const isSelected = startHour === selectedTime.start && endHour === selectedTime.end;
      const shouldDisable = isDisabled && (!isSelected || !selectedStartTime || !selectedEndTime);
      const isDefaultSelected = label === defaultValue;

      return (
        <label
          key={index}
          className={`ou-radio-label ${shouldDisable ? 'ou-opacity-50 ou-cursor-not-allowed' : ''} ${isSelected ? 'ou-selected' : ''}`}
        >
          <input
            type="radio"
            name="hour"
            value={`${label}|${scheduleID}`}
            className="ou-radio-input"
            disabled={shouldDisable}
            onChange={handleChange}
            checked={isSelected || isDefaultSelected}
          />
          <div className={`ou-radio-custom ${isSelected ? 'ou-selected-time' : ''}`}>{label}</div>
        </label>
      );
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const [label, scheduleID] = value.split('|');
    const [start, end] = label.split(' - ').map((time) => time.trim());

    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };

    const selectedTimeData = { start: formatTime(start), end: formatTime(end), scheduleID };
    setSelectedTime(selectedTimeData);
    onChange(selectedTimeData);
  };

  const morningHours = Array.from({ length: 4 }, (_, index) => 8 + index); // 8-12
  const afternoonHours = Array.from({ length: 4 }, (_, index) => 13 + index); // 13-17

  return (
    <div>
      {!isLoading && (
        <>
          <div className="ou-mb-3">
            <Divider className='ou-mb-2'>{t('common:morning')}</Divider>
            <div className='ou-radio-container'>
              {renderRadioButtons(morningHours, 'morning')}
            </div>
          </div>
          <div className="ou-mb-3">
            <Divider className='ou-mb-2'>{t('common:afternoon')}</Divider>
            <div className='ou-radio-container'>
              {renderRadioButtons(afternoonHours, 'afternoon')}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorAvailabilityTime;