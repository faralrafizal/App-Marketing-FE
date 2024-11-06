import React from 'react'

function ProgressBar({progressValue, descValue}) {
    return (
        <div className='flex items-center w-full gap-4'>
            <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressValue == null ? 0 : progressValue}%` }}></div>
            </div>
            <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{descValue == null ? 0 : descValue }</span>
            </div>
        </div>
    )
}

export default ProgressBar