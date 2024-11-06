import React from 'react'

const Index = ({ title, className, ...props }) => {
    return (
        <button
            {...props}
            type="submit"
            className={`${className} font-bold py-2.5 px-5 mr-2 mb-2 text-sm focus:outline-none rounded-md border focus:z-10 focus:ring-4 focus:ring-gray-500 hover:brightness-95 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>
            {title}
        </button>
    )
}

export default Index