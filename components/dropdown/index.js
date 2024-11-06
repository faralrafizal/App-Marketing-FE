"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function Dropdown({
  htmlContent,
  tailwindClasses,
  options,
  svg = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div
        className="bg-white flex items-center gap-3  p-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        {svg && (
          <Image
            className=""
            src={`/icon/${selectedOption.svg}.svg`}
            alt="Next.js Logo"
            width={20}
            height={20}
            priority
          />
        )}
        <div className="text-lg font-semibold select-none">
          {selectedOption.title}
        </div>
        <svg
          className={`h-5 w-5 ml-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
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
        <ul className="absolute w-[100%] left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {options?.map((option, i) => (
            <li
              key={i}
              className="cursor-pointer  px-2 py-2 flex justify-between items-center hover:bg-gray-100"
              onClick={() => selectOption(option)}
            >
              {svg && (
                <Image
                  className=""
                  src={`/icon/${option.svg}.svg`}
                  alt="Next.js Logo"
                  width={20}
                  height={50}
                  priority
                />
              )}
              <div className="font-medium">{option.desc}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
