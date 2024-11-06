import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputDate = (props) => {
  return (
    <div>
      <label for="date" className="text-sm font-semibold">
        {props.label}
      </label>
      <div
        className={`${props.className} flex mt-5 items-center border rounded-full border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      >
        <FaCalendarAlt className="text-gray-400 text-xl" />
        <div className="w-px h-5 bg-gray-300 mx-2"></div>
        <DatePicker
          id="date"
          {...props}
          onChange={value => props.onChange?.(value,props.name)}
          selected={props.selected ? new Date(props.selected) : undefined}
          dateFormat="dd/MM/yyyy"
          className="flex-1 focus:outline-none"
        />
      </div>
      {props.err && <p className='text-red-500 text-xs mb-5 ml-3 py-1'>* wajib diisi</p>}
    </div>
  );
};

export default InputDate;
