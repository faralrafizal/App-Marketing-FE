import React from "react";
import Modal from ".";
import Image from "next/image";
import Field from "../Input";


export default function ModalApprove(props) {
  return (
    <Modal {...props} classNameheader="" width="w-[350px]">
      <div className="text-black flex justify-center">
        <div className="">
          <Image
            className=" cursor-pointer"
            src="/icon/deleteImage.svg"
            alt="Next.js Logo"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
      <div className="text-black text-center text-base font-bold">
        Confirmation
      </div>
      <div className="text-[#7D7D7D] text-center text-sm font-bold">
        Are you sure you want {props.message}?
      </div>
      {
        props.message == "Reject Project" && 
        <div className="flex mt-6 items-center justify-center">
          <Field
          label=""
          onChange={(e) => props.onChange(e)}
          placeholder="Reject Message"
          id="reject_Message"
          name="reject_Message"
          type="text"
          />
        </div>
      }
      <div className='flex items-center justify-end border-t-2 mt-4 pt-3 '>
        <div>
          <button
          onClick={()=>{props?.onClose()}}
            className="bg-gray-100 hover:bg-gray-200 rounded-full text-[#7D7D7D] text-sm font-bold py-2 px-5 "
          >
            Cancel
          </button>
          <button
          onClick={()=>{props?.ConfirmOk()}}
            className="bg-[#FF234F] ml-5 hover:bg-red-500 rounded-full text-white text-sm font-bold py-2 px-5 "
          >
            {props.message}
          </button>
        </div>
      </div>
    </Modal>
  );
}
