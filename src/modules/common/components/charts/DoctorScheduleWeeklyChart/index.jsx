import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import useDoctorScheduleChart from '../hooks/useDoctorScheduleChart';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DoctorScheduleWeeklyChart = () => {
  const { t } = useTranslation(['doctor-schedule']);
  const { dataChart, handleYearChange, handleChangeWeek, weeksOfYear,
    selectedWeek, selectedYear } = useDoctorScheduleChart();

  const data = {
    labels: [t('doctor-schedule:monday'), t('doctor-schedule:tuesday'), 
      t('doctor-schedule:wednesday'), t('doctor-schedule:thursday'), 
      t('doctor-schedule:friday'), t('doctor-schedule:saturday')],
    datasets: dataChart,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${t('doctor-schedule:doctorScheduleTitle')} ${selectedYear}`
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${t('doctor-schedule:appointments')}`;
          },
        },
      },
    },
    scales: {
      y: { title: { display: true, text: t('doctor-schedule:appointments') } },
    },
  };

  return (
    <div>
      <div className='ou-text-right ou-m-3'>
        <FormControl variant="outlined" className='!ou-mr-3'>
          <InputLabel>{t('doctor-schedule:week')}</InputLabel>
          <Select value={selectedWeek} onChange={handleChangeWeek}
          label={t('doctor-schedule:week')} className='ou-max-h-[200px] ou-overflow-y-auto'>
            {weeksOfYear.map((week) => (
              <MenuItem key={`w-${week}`} value={week}>
                {t('doctor-schedule:week')} {week}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField placeholder={t('doctor-schedule:year')} label={t('doctor-schedule:year')}
        value={selectedYear} onChange={handleYearChange} type='number' />
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default DoctorScheduleWeeklyChart;