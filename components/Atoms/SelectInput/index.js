"use client";
import { useState } from "react";

function MultipleSelect({
  label = "Select",
  selectedOptionValue,
  options = [],
  title,
  className,
  placeholder = "Select Options",
  selectedOption,
  valueOption = () => {},
  not=0,
  top="top-12",
  Err
}) {
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (value) => {
    valueOption(value);
    setIsOpen(false);
  };
  const handleBlur = () => {
    console.log("mauk on blur");
    setTimeout(function () {
      setIsOpen(false);
    }, 500);
  };
  
  return (
    <div className="w-full">
      {label&&<label className="text-sm font-semibold">{label}</label>}
      <div
        className="relative inline-block w-full my-5"
        onBlur={() => {
        }}
      >
        <div
          className={`${className} rounded-full border-0 ring-gray-300 ring-1 ring-inset py-[14px] px-5 select-button w-full  flex justify-between items-center  cursor-pointer`}
          onClick={toggleDropdown}
          onBlur={handleBlur}
        >
        <span className="text-xs">{selectedOption[title]}</span>
        <svg
          className={`h-5 w-5 ml-2 transition-transform ${
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
          {Err&&<p className='text-red-500 text-xs ml-3 py-1'>* wajib diisi</p>}
        {isOpen && (
          <div className={`custom-dropdown absolute ${top} left-0 right-0 z-10 bg-white border border-gray-300 rounded shadow`}>
            {options.map((option, key) => (
              <div
                key={option.value}
                className={`${
                  key == not ? "bg-gray-300 text-gray-400" : ""
                }dropdown-item flex items-center p-2 cursor-pointer select-none hover:bg-gray-200`}
                onClick={() => key > not && handleOptionSelect(option)}
              >
                <span className="text-[13px]">{option[title].toUpperCase()}</span>
                {/* Tambahkan ikon di sini */}
                {/* Contoh ikon: <img src="/icon.png" alt="Icon" className="w-4 h-4 ml-2" /> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultipleSelect;
