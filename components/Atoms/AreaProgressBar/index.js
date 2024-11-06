import React from 'react'

export default function AreaProgressBar(props) {
    return (
        <div key={props.key} className='w-full gap-4'>
            <div className='flex justify-between mt-4 mb-2'>
                <p className='text-black font-normal'>{props.area}</p>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{props.persentase}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${props.persentase}`}}></div>
            </div>
        </div>
    )
}
