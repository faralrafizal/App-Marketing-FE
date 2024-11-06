import React from 'react'
import Image from 'next/image'

const ActionButton = ({icon,title,width=13,height=13,onClick,className}) => {
    return (
        <button onClick={onClick} type="button" className={`${className} border border-[#DDDDDD] bg-[#F6F6F6] px-2 py-2 rounded-lg flex items-center gap-2 focus:outline-none text-white font-medium text-sm`}>
            {icon?<Image
            src={`/icon/${icon}`}
            width={width}
            height={height}
            alt='button'
            />:null}
            {title&&<div>{title}</div>}
        </button>
    )
}

export default ActionButton