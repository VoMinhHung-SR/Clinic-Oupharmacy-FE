import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import useBookingChart from '../hooks/useBookingChart';
import { TextField } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingChart = () => {
    const { t } = useTranslation(['dashboard']);

    const {bookingChartData, selectedYear, handleYearChange} = useBookingChart()

    // Chart data
    const data = {
        labels: [
            t('dashboard:January'), t('dashboard:February'),
            t('dashboard:March'), t('dashboard:April'),
            t('dashboard:May'), t('dashboard:June'),
            t('dashboard:July'), t('dashboard:August'),
            t('dashboard:September'), t('dashboard:October'),
            t('dashboard:November'), t('dashboard:December'),
        ],
        datasets: [
            {
                label: `${t('dashboard:examinationLabel')} ${selectedYear}`,
                data: bookingChartData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `${t('dashboard:examinationTitle')} ${selectedYear}`
            }
        }
    };

    return (
        <div>
            <div className='ou-text-right ou-mb-3'>
                <TextField placeholder={t('dashboard:Year')} value={selectedYear}
                onChange={handleYearChange} type='number'/>
            </div>    
            <Bar data={data} options={options} />
        </div>
    );
};

export default BookingChart;
