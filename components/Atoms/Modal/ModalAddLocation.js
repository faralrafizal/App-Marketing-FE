import React from "react";
import Modal from ".";
import Select from 'react-select';
import Field from "../Input";

export default function ModalAddMaster(props) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: 38,
    }),
    menu: (provided) => {
      return ({
        ...provided,
        maxHeight: 130,
        overflowY: 'hidden',
        boxSizing: null,
        // Set the maximum height for the dropdown
      })
    },
  };
  return (
    <Modal {...props} classNameheader="" width="w-[350px]">
      <div className="text-black justify-center">
        <div className="w-[100%]">
          <Select
            id="id_province"
            options={props.option}
            value={props.selectedProvince}
            onChange={(selectedOption) => props.setOptionProvince(selectedOption)}
            styles={customStyles}
            isSearchable
            placeholder="Pilih Provinsi"
            className="mb-4 w-100"
          />
        </div>
        <div>
          <Field
            label=""
            type="text"
            onChange={(e) => props.setDataCity(e.target.value)}
            placeholder="Nama Kota"
            value={props.dataCity}
            className="!h-11 !rounded-none border-gray-100 !hover:border-gray-50"
          />
        </div>
      </div>
      <div className='flex items-center justify-end border-t-2 mt-4 pt-3 '>
        <div>
          <button
            onClick={() => { props?.onClose() }}
            className="bg-gray-100 hover:bg-gray-200 rounded-full text-[#7D7D7D] text-sm font-bold py-2 px-5 "
          >
            Cancel
          </button>
          <button
            onClick={() => { props?.ConfirmOk() }}
            className="bg-[#ffffff] ml-5 hover:bg-[#5D5FEF] border border-[#5D5FEF] rounded-full text-black text-sm font-bold py-2 px-5 "
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
