import React from 'react'

const Field = (props) => {
  return (
    <div>
      <label className='text-sm font-semibold'>{props.label}</label>
      <div className='my-5'>
        <input {...props} className={`${props.className}  px-3 block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder: focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`} />
        {props.err && <p className='text-red-500 text-xs ml-3 py-1'>* wajib diisi</p>}
      </div>
    </div>
  )
}

export default Field