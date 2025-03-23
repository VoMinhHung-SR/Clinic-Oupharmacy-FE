import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import useRevenueChart from '../hooks/useRevenueChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = () => {
    const {t} = useTranslation(['dashboard'])
    const {revenueData, handleYearChange, selectedYear} = useRevenueChart()

    const data = {
        labels: [
            t('dashboard:January'), t('dashboard:February'),
            t('dashboard:.March'), t('dashboard:April'),
            t('dashboard:May'), t('dashboard:June'),
            t('dashboard:July'), t('dashboard:August'),
            t('dashboard:September'), t('dashboard:October'),
            t('dashboard:November'), t('dashboard:December'),
        ],
        datasets: [
            {
                label: `${t('dashboard:revenueLabel')} ${selectedYear}`,
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4 // Optional: smooth lines
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
                text: `${t('dashboard:revenueTitle')} ${selectedYear}`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: t('revenue')
                }
            }
        }
    };

    return (
        <div>
            <div className='ou-text-right ou-mb-3'>
                <TextField placeholder={t('dashboard:Year')} value={selectedYear}
                onChange={handleYearChange} type='number'/>
            </div>   
            <Line data={data} options={options} />
        </div>
    )
    
};

export default RevenueChart;