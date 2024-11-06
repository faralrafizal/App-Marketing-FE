"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function DropdownMaster({
  htmlContent,
  tailwindClasses,
  options,
  title,
  onChange,
  selected,
  classTitle = "text-lg font-semibold select-none",
  svg = "",
  svgSelect = false,
}) {
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setIsOpen(false);
  };
  const handleBlur = () => {
    setTimeout(function () {
      setIsOpen(false);
    }, 600);
  };

  return (
    <div className="relative inline-block">
      <div
        // className="bg-white flex items-center gap-3  p-2 cursor-pointer"
        className={classTitle + " flex items-center gap-3 cursor-pointer"}
        onClick={toggleDropdown}
        onBlur={handleBlur}
        tabIndex={0}
      >
        {svg && (
          <Image
            className=""
            src={`/icon/${svg}.svg`}
            alt="Next.js Logo"
            width={20}
            height={20}
            priority
          />
        )}
        <div>{title}</div>
        <svg
          className={`h-5 w-5 ml-5 transition-transform ${isOpen ? "transform rotate-180" : ""
            }`}
          fill="none"
          stroke={selected?.includes("/master") ? "white" : "#7D7D7D"}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute w-[180%] z-50 gap-3 left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {options?.map((option, i) => (
            <li
              key={i}
              onClick={() => {
                // onChange(option);
                setIsOpen(false);
              }}
            >
              <a
                className="cursor-pointer.  px-2 py-2 flex items-center hover:bg-gray-100"
                href={`${option.link}`}
              >
                {svgSelect && (
                  <Image
                    className=""
                    src={`/icon/${option.svg}.svg`}
                    alt="Next.js Logo"
                    width={20}
                    height={50}
                    priority
                  />
                )}
                <div
                  className={`text-base font-semibold ${selected.includes(option?.link)
                      ? "text-[#5D5FEF] border-l-2 border-[#5D5FEF] pl-2"
                      : "text-[#7D7D7D]"
                    } `}
                >
                  {option.title}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
