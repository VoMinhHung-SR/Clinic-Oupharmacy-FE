import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { authApi, endpoints } from '../config/APIs';

const Demo = () => {
  const [date, setDate] = useState('');
  const [examinations, setExaminations] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const getExaminationData = async (date) => {
      try {
        const res = await authApi().post(endpoints['get-total-exams'], { date: date });
        if (res.status === 200) {
          setExaminations(res.data.examinations);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (date) {
      getExaminationData(date);
    }
  }, [date]);

 const shouldDisableTime = (time) => {
  const selectedDate = moment(date).format('YYYY-MM-DD');
  const disabledTimesFromData = examinations
    .filter((e) => e.created_date.includes(selectedDate))
    .map((e) => moment(e.created_date).format('HH:mm:ss'));

  const isDisabledRange = (time.hour() >= 0 && time.hour() < 7) || (time.hour() >= 17 && time.hour() <= 23);

  return (
    disabledTimesFromData.includes(time.format('HH:mm:ss')) || isDisabledRange
  );
};

  const handleTimeChange = (time) => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    const selectedTime = time.format('HH:mm:ss');
    const concatenatedValue = `${selectedDate}T${selectedTime}`;
    
    // Use the concatenated value as needed

    setSelectedTime(concatenatedValue);
  };

  if(selectedTime){
    const date2= new Date(selectedTime)
  }
  return (
    <>
      <h1>Day la trang demo</h1>
      <TextField
        value={date}
        type="date"
        onChange={(newValue) => setDate(newValue.target.value)}
      />
      {date &&  <TimePicker
          label="Basic time picker"
          onChange={handleTimeChange}
          renderInput={(props) => <TextField {...props} />}
          views={['hours', 'minutes']}
          minTime={moment().startOf('day')}
          maxTime={moment().endOf('day')}
          ampm={false}
          timeSteps={{minutes:20}}
          shouldDisableTime={shouldDisableTime}
        /> }
    

      {examinations &&
        examinations.map((e) => <Box key={e.id}>{e.created_date}</Box>)}
    </>
  );
};

export default Demo;