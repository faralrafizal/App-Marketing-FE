"use client";
import React, { useEffect, useState } from "react";

export default function Checkbox({ onChange = () => {}, checked }) {

  return (
    <div
      onClick={() => {
        // setCheckedValue(!checkedValue);
        onChange(!checked);
      }}
      className="flex items-center justify-center cursor-pointer"
    >
      <div
        className={`px-1 py-[1px]
    text-[10px]
    border
    ${
      checked
        ? "bg-[#5D5FEF] text-white border-[#5D5FEF]"
        : " bg-[#F5F5F5] text-white border-[#BEBEBE] "
    }
    rounded select-none
    `}
      >
        ✔
      </div>
    </div>
  );
}
