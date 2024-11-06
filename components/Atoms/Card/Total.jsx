"use client"
import React from 'react'
import Image from 'next/image'

const Total = ({bgColor,icon,titleText,value,percentage}) => {
  return (
    <div
      className={`flex items-center h-28 p-3 border border-transparent rounded-lg ${bgColor}`}>
      <div className='grid grid-cols-3'>
        <div 
        className='h-24 w-23 pe-5'>
          <Image
            src={`/icon/${icon}`}
            width={44}
            height={44}
          />
        </div>
        <div 
        className='col-span-2'>
          <div>
            <p 
            className='text-white font-medium sm:text-xs lg:text-sm'
            >{titleText}</p>
          </div>
          <div className='flex items-center mt-4'>
            <div>
              <p className='text-white font-bold sm:text-sm lg:text-2xl'>{value}</p>
            </div>
            <div className='ms-5'>
              <span className="bg-white text-opacity-10 sm:text-sm md:text-base text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900">{percentage}</span>
            </div>
          </div>
          <div>
            <p className='text-white font-thin'>Last Month</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Total