"use client";
import React from "react";
import Image from "next/image";

const TotalDash = ({ bgColor, icon, titleText, value, percentage,onClick=()=>{} }) => {
  return (
    <div
    onClick={()=>{onClick()}}
      className={`flex cursor-pointer items-center h-28 p-3 border border-transparent rounded-lg ${bgColor}`}
    >
      <div className="grid items-center grid-cols-4 w-full">
        <div className="">
          <Image alt={`icon-${icon}`} src={`/icon/${icon}`} width={35} height={35} />
        </div>
        <div className="col-span-3">
          <div>
            <div className="text-white font-bold sm:text-sm lg:text-sm">
              {titleText}
            </div>
          </div>
          <div className="flex border-t-2 pt-3 items-center mt-3">
            <div>
              <div className="text-white font-bold sm:text-xs lg:text-xs">
                {value}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalDash;
