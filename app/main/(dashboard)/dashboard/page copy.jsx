"use client";
import { Button, Total, TableDashboard } from '@/components';
import React, { useEffect, useState } from 'react';
import ChartDoughnut from '@/components/Atoms/ChartDoughnut';
import AreaProgressBar from '@/components/Atoms/AreaProgressBar';

const Page = () => {
    const cardColor = ['bg-[#369FFF]', 'bg-[#FF993A]', 'bg-[#8AC53E]', 'bg-[#8038AB]'];
    const cardIcons = ['dollar.svg','list.svg'];
    const obj = [
        {
            bgColor: 'bg-[#FF993A]',
            titleText: 'Total Nilai Pagu'
        },
        {
            bgColor: 'bg-[#8038AB]',
            titleText: 'Total Nilai Kontrak'
        },
    ]
    const [totalData, setTotalData] = useState([
        {
            value: '45 JT',
            percentage: '3.1%',
        },
        {
            value: '45 JT',
            percentage: '3.1%',
        },
    ]);

    const [area,setArea] = useState([
        {area: 'DKI Jakarta', persentase: '97%'},
        {area: 'Jawa Timur', persentase: '88%'},
        {area: 'Papua', persentase: '45%'},
        {area: 'Sumatera Barat', persentase: '41%'},
        {area: 'Riau', persentase: '41%'}
    ])

    return (
        <div className=''>
            <div className='block p-3 bg-white mt-2 mx-7 h-48 border rounded-lg border-transparent'>
                <h1 className='text-black font-bold'>Overview</h1>
                <div className='mt-3 grid grid-cols-2 gap-8'>
                    {obj.map((data, index) => (
                        <Total
                            key={index}
                            bgColor={data?.bgColor}
                            icon={cardIcons[index]}
                            titleText={data?.titleText}
                            value={totalData[index]?.value || 0}
                            percentage={totalData[index]?.percentage || 0}
                        />
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-3 gap-5 mt-5 mx-7 h-[70%]'>
                <div className='col-span-2 p-6 block h-[100%] bg-white rounded-lg'>
                    <div className='grid grid-cols-2 justify-items-stretch'>
                        <div className='justify-self-start'>
                            <span className='font-bold text-black'>Project</span>
                        </div>
                        <div className='justify-self-end'>
                            <Button
                                className='text-[#5D5FEF] border-[#5D5FEF] !rounded-full'
                            >
                                Lihat Semua
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="relative overflow-y-auto overflow-x-auto shadow-md sm:rounded-lg">
                            <TableDashboard />
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-7 h-[100%]'>
                    <div className='h-[100%] bg-white p-3 rounded-lg'>
                        <h1 className='font-bold text-base text-black'>Presentasi Progress</h1>
                        <div className='w-full flex justify-center'>
                            <ChartDoughnut/>
                        </div>
                    </div>
                    <div className='h-[100%] bg-white p-3 rounded-lg'>
                        <h1 className='font-bold text-base text-black'>Presentasi Progress</h1>
                        <div className='w-full'>
                            {area.map((data, index) => (
                                <AreaProgressBar
                                key={index}
                                area={data.area}
                                persentase={data.persentase}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page