import React, { useState } from "react";
import Modal from ".";
import Image from "next/image";

import Maps from "../Maps/Map";
import { Button } from "../..";
import ModalDelete from "./ModalDelete";

export default function ModalDetailActivity(props) {
  let { data } = props;

  const [modalDelete, setModalDelete] = useState(false);

  return (
    <Modal
      {...props}
      className="justify-end"
      classNameheader=""
      endTitle="Details"
      title=""
      width="w-[600px] transition-transform duration-500 ease-in-out"
    >
      <div>
        <Maps coordinate={{ lat: data?.lat, long: data?.long }} w="w-[100%]" />
      </div>
      <div>
        <div className="flex items-center flex-wrap ">
          <div className="text-[#7D7D7D] text-xs font-medium w-[30%]">ID</div>
          <div className="text-black text-xs font-medium w-[70%] mt-3">
            Attendance at 08:00 AM - 05:00 PM for 12 September 2023
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Location
          </div>
          <div className="text-black text-xs font-medium w-[70%] mt-3">
            Jalan Nilam VI, RW 02, Sumur Batu, Kemayoran, Central Jakarta,
            Special Capital Region of Jakarta, Java, 10640, Indonesia
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Coordinate
          </div>
          <div className="text-black text-xs font-medium w-[70%] mt-3">
            {data?.lat}, {data?.long}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div
          onClick={() => { }}
          className="border flex items-center justify-center gap-2 px-3 py-1 border-[#5D5FEF] bg-[#5D5FEF]  rounded-full cursor-pointer"
        >
          <Image
            className=" right-4 "
            src="/icon/Vector.svg"
            alt="Next.js Logo"
            width={20}
            height={20}
            priority
          />
          <div className="text-sm font-semibold ml-2 text-white">
            View On Map
          </div>
        </div>
      </div>
      {props?.Role?.includes("Approval Daily Activity") && <div className="flex items-center gap-3">
        <Button
          className="mt-10 !bg-[#FF234F] !text-white"
          title={"Reject"}
          onClick={() => { props.onClose(); setModalDelete(true) }}
        />

        <Button
          className="mt-10 bg-[#2D9596] !text-white"
          title={"Approve"}
          onClick={() => { setModalApprove(true), setStatus('approved'), setTitleModal('Approval Project') }}
        />
      </div>
      }

    </Modal>
  );
}
