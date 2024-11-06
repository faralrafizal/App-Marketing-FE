import Modal from "../../Atoms/Modal";
import React from "react";

export default function SwitchEmployee(props) {
  return (
    <Modal {...props} classNameheader="" width="w-[350px]">
      <div className="text-black flex justify-center">

      </div>
      <div className="text-black text-center text-base font-bold">
        Confirmation
      </div>
      <div className="text-[#7D7D7D] text-center text-sm font-bold">
        Are you sure you want to switch this data?
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
            className="bg-[#86fa7c] ml-5 hover:bg-red-500 rounded-full text-white text-sm font-bold py-2 px-5 "
          >
            Switch
          </button>
        </div>
      </div>
    </Modal>
  );
}
