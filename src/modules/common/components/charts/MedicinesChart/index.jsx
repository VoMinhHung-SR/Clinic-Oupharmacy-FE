import {Pie} from 'react-chartjs-2'
import React from 'react';
import {
    Chart as ChartJS,
    Tooltip,
    Legend, ArcElement
} from 'chart.js/auto';

// ChartJS.register(ArcElement, Tooltip, Legend);

const MedicinesChart = ({ medicinesLabel, medicinesData, year }) => {
    // Chart data

    const data = {
        labels: medicinesLabel,
        datasets: [
            {
                label: `Quantity in ${year}:`,
                data: medicinesData,
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
                text: `Frequency of drug use in ${year}`
            }
        }
    };
    // return <Pie data={data} options={options} />;
    return <h3>This is drugs stats</h3>
};

export default MedicinesChart;