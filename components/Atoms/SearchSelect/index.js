import React from 'react';
import Select from 'react-select';

const SearchSelect = ({ selectedData, listData, onChange, title, Err }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '25px', 
      height: '43px'
    }),
  };

  return (
    <div>
      <p className="text-sm font-semibold mb-4">{title}</p>
      <Select
        className="rounded-full"
        value={selectedData} 
        options={listData}
        onChange={onChange}
        styles={customStyles}
        placeholder={"Select"}
      />
      {Err&&<p className='text-red-500 text-xs ml-3 py-1'>* wajib diisi</p>}
    </div>
  );
};

export default SearchSelect;
