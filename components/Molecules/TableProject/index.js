import React, { useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import { formatDate } from "../../../utils/formateDate";
import { AiFillCheckCircle, AiFillCloseCircle, AiFillFileText } from "react-icons/ai";
import NotFound from "../../Atoms/NotFound";
import { ShowLoading, SwalClose } from "../../../utils/loading";
import { FetchData } from "../../../config/Api/Api";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function TableProject({
  modalDeletes,
  DetailData,
  isAwait,
  NavigateEdit,
  listData,
  setPageData = () => { },
  maxLenght,
  pageData,
  setSizeData,
  sizeData,
  selectData,
  countChecked,
  checkedAll,
  checkAll,
  onClickDelete,
  refresh,
  listAccess
}) {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Master Project"]?.map((res) => res.event)
  let Actions = [
    {
      svg: "edit.svg",
      action: NavigateEdit,
      title: "Edit"
    },
    {
      svg: "eye.svg",
      action: DetailData,
      title: "View"
    },
    {
      svg: "trash.svg",
      className: "!bg-[#FF234F] !border !border-[#FF234F] !px-2 !py-2",
      action: modalDeletes,
      title: "Delete"
    },
  ];

  let approve = async () => {
    ShowLoading()
    let approveProject = await FetchData({
      url: '/approve-project',
      methode: "POST",
      data: {
        "id": listData.filter((res) => res.checked).map((res) => res.id_project),
        "status": "approved",
        "description": "approved"
      },
      token : token
    });

    SwalClose()

    if (!approveProject.code) {
      console.log(approveProject.data)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: approveProject.data.status == 500 ? approveProject.data.statusText : approveProject.response.msg,
      });
    } else {
      refresh()
    }
  }

  console.log(listData);

  console.log((isAwait && (listAccess?.includes("Delete") || listAccess?.includes("Approval Project"))) || (listAccess?.includes("Delete") || listAccess?.includes("Approval Project")) && "sasas")

  return (
    <div>
      {countChecked ? (
        <div className="flex items-center justify-between my-4">
          <div className="text-sm font-semibold text-[#7D7D7D]">
            {countChecked} Items Selected
          </div>
          <div className="flex items-center gap-3">
            {isAwait && listAccess?.includes("Approval Project") && <ActionButton
              className={
                "!bg-[#2D9596] border px-7 !border-[#2D9596] rounded-full  py-2"
              }
              icon={""}
              title={"Approve  " + countChecked}
              width={20}
              height={20}
              onClick={() => approve()}
            />}
            {listAccess?.includes("Delete") && <ActionButton
              className={
                "bg-[#FF234F] border border-[#FF234F] rounded-full px-3 py-2"
              }
              icon={"trash.svg"}
              title={"Delete"}
              width={20}
              height={20}
              onClick={() => onClickDelete()}
            />}
          </div>
        </div>
      ) : null}

      <div className="my-5 overflow-auto  element-with-scrollbar">
        <table className="tabel w-[200%]">
          <thead>
            <tr className="text-start">
              {(isAwait && (listAccess?.includes("Delete") || listAccess?.includes("Approval Project"))) || (listAccess?.includes("Delete") || listAccess?.includes("Approval Project")) ? <th className="w-[2%] containet">
                <div className="flex w-full items-center justify-center">
                  <Checkbox
                    checked={checkedAll}
                    onChange={(e) => checkAll(e)}
                  />
                </div>
              </th> : null}
              <th className="bg-[#F5F6FB] text-xs py-2 text-[#7D7D7D] text-center w-[50px]">
                No
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                ID
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Kata Kunci
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Tanggal Input
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start w-[300px]">
                Paket
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Pagu
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Jenis Pengadaan
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Metode
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Pemilihan
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                K/L/PD
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Satuan Kerja
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Lokasi
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Sumber Dana
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Marketing
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Status Approval
              </th>
              <th className="bg-[#F5F6FB] text-center text-xs py-2 text-[#7D7D7D]  w-[5%] rounded-r-full">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.length > 0
              ? listData?.map((val, key) => (
                <tr key={key} className="border-b">
                  {(isAwait && (listAccess?.includes("Delete") || listAccess?.includes("Approval Project"))) || (listAccess?.includes("Delete") || listAccess?.includes("Approval Project")) ? <td className="w-[2%] text-center">
                    <div className="flex w-full items-center justify-center">
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => selectData(key, e)}
                      />
                    </div>
                  </td> : null}
                  <td className="text-xs text-center py-2">
                    {(pageData - 1) * sizeData + key + 1}.
                  </td>
                  <td className="text-xs py-2">{val?.project_code}</td>
                  <td className="text-xs py-2">{val?.keyword}</td>
                  <td className="text-xs py-2">
                    {formatDate(val?.input_date)
                      .substring(5)
                      .replaceAll(" ", "-")}
                  </td>
                  <td className="text-xs py-2">{val?.package}</td>
                  <td className="text-xs py-2">
                    {(val.id_status != 5 ? +val?.pagu : +val?.contract_value).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="text-xs py-2">{val?.procurement_type}</td>
                  <td className="text-xs py-2">{val?.method}</td>
                  <td className="text-xs py-2">{val?.choose_date}</td>
                  <td className="text-xs py-2">{val?.klpd}</td>
                  <td className="text-xs py-2">{val?.work_unit}</td>
                  <td className="text-xs py-2">{val?.location_name}</td>
                  <td className="text-xs py-2">{val?.fund_source}</td>
                  <td className="text-xs py-2">{val?.marketing_name}</td>
                  <td className="text-xs text-center">
                    {
                      val?.status_approval == "approved" ?
                        <div className="flex justify-center">
                          <AiFillCheckCircle className="text-green-500 text-xl text-center" />
                        </div>
                        : val?.status_approval == "rejected" ?
                          <div className="flex justify-center">
                            <AiFillCloseCircle className="text-red-500 text-xl text-center" />
                          </div> :
                          <div className="flex justify-center">
                            <AiFillFileText className="text-yellow-300 text-xl text-center" />
                          </div>
                    }
                  </td>
                  <td className="text-xs py-2 w-[130px]">
                    <div className="flex items-center justify-around">
                      {Actions?.filter((res) => listAccess?.includes(res.title)).map((res, key) => (
                        <ActionButton
                          key={key}
                          className={res?.className}
                          icon={res?.svg}
                          onClick={() => res?.action(val)}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))
              : null}
          </tbody>
        </table>
        {listData?.length <= 0 ? <NotFound /> : null}
      </div>

      <div className="flex items-center justify-center my-5 gap-5">
        <div className="flex items-center gap-5">
          <Pagination dataActived={pageData} maxLenght={maxLenght} onChange={(e) => setPageData(e)} pageData={pageData = 1} />
          <select
            value={sizeData}
            onChange={(e) => setSizeData(e.target.value)}
            className="border-[2px] px-2 py-1 border-[#5D5FEF] rounded-full focus:outline-none"
          >
            <option value="10" className="text-sm font-medium">
              10/Page
            </option>
            <option value="30">30/Page</option>
            <option value="50">50/Page</option>
          </select>

          <div>Go to</div>
          <div>
            <input
              type="text"
              placeholder=""
              onChange={(e) => { setPageData(+e.target.value || 1) }}
              inputMode="numeric"
              className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .table {
          position: relative;
          table-layout: auto;
          white-space: nowrap;
        }

        .table thead tr th {
          background: #edf2f7;
          width: 300px;
          padding: 0.75rem 1.5rem;
          vertical-align: middle;
        }
        .table tbody td {
          padding: 1.5rem 1.5rem;
          vertical-align: middle;
        }
        table tr > th:first-child {
          position: sticky;
          background: #f5f6fb;
          left: 0;
          border-radius: 50px 0 0px 50px;
        }

        table tr > th:last-child {
          position: sticky;
          background: #f5f6fb;
          right: 0;
          border-radius: 0 50px 50px 0;
        }
        table tr > td:last-child {
          position: sticky;
          background: white;
          right: 0;
        }
        table tr > td:first-child {
          position: sticky;
          background: white;
          left: 0;
        }

        .element-with-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .element-with-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
