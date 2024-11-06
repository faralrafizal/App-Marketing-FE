import React, { useState, useRef, useEffect } from 'react';
import 'tailwindcss/tailwind.css'; // Pastikan Anda mengimpor file CSS Tailwind

const CustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [input, setinput] = useState('');
  const dropdownRef = useRef();

  const options = ['Option 1', 'Option 2', 'Option 3'];

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    // Toggle the option in the selectedOptions array
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((selectedOption) => selectedOption !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  return (
    <div className="relative inline-block text-left">
      <label className="py-2 px-4 border border-gray-300 rounded-md cursor-pointer">
{selectedOptions.join(', ')}
      <input
        type="text"
        
        placeholder="Select options"
        onClick={toggleDropdown}
        value={input}
        onChange={(e)=>setinput(e.target.value)}
      />
      </label>
      {isOpen && (
        <ul className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
          {options.filter((res)=>res.includes(input)).map((option) => (
            <li
              key={option}
              className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${selectedOptions.includes(option) ? 'bg-gray-200' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;