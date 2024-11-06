import React, { useState } from "react";
import Modal from ".";
import Image from "next/image";
import ModalApprove from "./ModalApprove";
import { Button } from "../..";
import { Fetch, FetchData } from "../../../config/Api/Api";
import { ShowLoading, SwalClose } from "../../../utils/loading";
import { formatDateNew } from "../../../utils/formateDate";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { formatRupiah } from "../../../utils/formateRupiah";


export default function ModalDetailSirup(props) {
  let { data, listAccess } = props;
  const [modalApprove, setModalApprove] = useState(false);
  const [status, setStatus] = useState('');
  const [titleModal, setTitleModal] = useState('');
  const [description, setDescription] = useState('');
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token

  let approve = async () => {
    ShowLoading()
    let approveProject = await FetchData({
      url: '/approve-project',
      methode: "POST",
      data: {
        "id": [data.id_project],
        "status": status,
        "description": description
      },
      token: token
    });
    
    SwalClose()
    props.modalDetail()

    if (!approveProject.code) {
      console.log(approveProject.data)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: approveProject.data.status == 500 ? approveProject.data.statusText : approveProject.response.msg,
      });
    } else {
      props.refresh()
    }
    setModalApprove(false)
  }

  let handleOnChange = (e) => {
    setDescription(e.target.value)
  }

  let profile = [
    {
      title: "Marketing",
      value: data?.marketing_name,
      svg: "imageProfile",
    },
    {
      title: "Metode",
      value: data?.method,
      svg: "tag",
    },
    {
      title: "Jenis Pengadaan",
      value: data?.procurement_type,
      svg: "note-2",
    },
  ];
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
        <Image
          className=""
          src="/image/detail-sirup.png"
          alt="Next.js Logo"
          width={800}
          height={200}
          priority
        />
      </div>
      <div>
        <div className="flex items-center mt-5 gap-5 w-full">
          {profile.map((val, key) => (
            <div
              key={key}
              className={`${key != 2 ? "border-r-2 " : "  w-[30%]"} px-2 ${key == 0 ? "w-[30%]" : "  w-[40%]"
                } `}
            >
              <div className="text-[#7D7D7D] text-xs font-semibold">
                {val?.title}
              </div>
              <div className={`flex items-center gap-3 mt-2 `}>
                <div
                  className={` rounded-full ${key == 0 ? "border border-[#5D5FEF]" : "py-3"
                    } overflow-hidden p-[1px]`}
                >
                  <Image
                    className=" rounded-full"
                    src={`/icon/${val?.svg}.svg`}
                    alt="Next.js Logo"
                    width={key == 0 ? 43 : 20}
                    height={key == 0 ? 43 : 20}
                    priority
                  />
                </div>
                <div className="text-xs font-medium py-1 text-black">
                  {val?.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className=" py-2 rounded-xl bg-[#F5F6FB] px-6 my-6">
          <div className="text-[#7D7D7D] text-xs font-semibold">Paket</div>
          <div className="text-black text-sm py-1 font-medium">
            {data?.package}
          </div>
        </div>
        <div className="flex items-center flex-wrap ">
          <div className="text-[#7D7D7D] text-xs font-medium w-[30%]">ID</div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.project_code}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Kata Kunci
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.keyword}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Tanggal Input
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {/* 12-Sep-2023
             */}
            {formatDateNew(data?.input_date, "DD-MM-YYYY")}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Pagu
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {formatRupiah(data?.pagu)}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Pemilihan
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.choose_date}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Sumber Dana
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.fund_source}
          </div>
        </div>
        <hr className="my-3" />
        <div className="flex items-center flex-wrap ">
          <div className="text-[#7D7D7D] text-xs font-medium w-[30%]">
            K/L/PD
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.klpd}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Satuan Kerja
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.work_unit}
          </div>

          <div className="text-[#7D7D7D] text-xs font-medium w-[30%] mt-3">
            Lokasi
          </div>
          <div className="text-black text-xs font-medium w-[70%]">
            {data?.location_name}
          </div>
        </div>
      </div>
      {data?.status_approval != "approved" && listAccess.includes("Approval Project") &&
        <div className="flex items-center gap-3">
          <Button
            className="mt-10 !bg-[#FF234F] !text-white"
            // children={"Reject"}
            title="Reject"
            onClick={() => { setModalApprove(true), setStatus('rejected'), setTitleModal('Reject Project') }}
          />
          <Button
            className="mt-10 bg-[#2D9596] !text-white"
            // children={"Approve"}
            title="Approve"
            onClick={() => { setModalApprove(true), setStatus('approved'), setTitleModal('Approval Project') }}
          />
        </div>
      }
      <ModalApprove
        onChange={handleOnChange}
        message={titleModal}
        isOpen={modalApprove}
        onClose={() => setModalApprove(false)}
        title={titleModal}
        ConfirmOk={() => {
          approve();
        }}
      />
    </Modal>
  );
}
