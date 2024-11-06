import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto';

export default function ChartDoughnut() {
    const [presentase, setPresentase] = useState([
        { presentase: '25%' },
        { presentase: '50%' },
        { presentase: '75%' },
        { presentase: '100%' }
    ]);

    const dotColor = ['#4252EA', '#F3C331', '#59C624', '#52BEFF'];
    
    useEffect(() => {
        const ctx = document.getElementById('myChart').getContext('2d');
        const data = [12, 19, 3];
        const labels = ['Label 1', 'Label 2', 'Label 3'];
        const colors = ['rgba(82, 190, 255, 1)', 'rgba(0, 43, 180, 1)', 'rgba(243, 195, 49, 1)'];

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                legend: {
                    display: false,
                },
                },
                animation: {
                animateRotate: false,
                },
                tooltips: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                    const label = labels[context.dataIndex];
                    const value = data[context.dataIndex];
                    const total = data.reduce((acc, curr) => acc + curr, 0);
                    const percent = ((value / total) * 100).toFixed(2);
                    return `${label}: ${percent}%`;
                    },
                },
                },
            },
        });
    }, []);
    
    return (
        <div className='h-72 flex flex-col w-full justify-center items-center my-5'>
            <canvas id="myChart"></canvas>
            <hr className='bg-gray-600 mt-4 w-full'></hr>
            <div className='flex gap-4 my-3'>
                {presentase.map((item, key) => (
                    <div key={key} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: `${dotColor[key]}` }}></div>
                        <p className="text-sm text-black">{item.presentase}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
