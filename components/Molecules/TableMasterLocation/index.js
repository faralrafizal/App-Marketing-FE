import React, { useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import ProgressBar from "../../Atoms/ProgressBar";
import { Button } from "../..";

export default function TableMasterLocation({
  listData,
  setPageData = () => {
  },
  maxLenght,
  pageData,
  setSizeData,
  sizeData,
  columName,
  objectKey,
  modalDeletes,
  Role,
  modalEdit
}) {

  let Actions = [];


  if (Role?.includes('Edit')) {
    Actions.push({
      svg: "edit.svg",
      action: modalEdit,
      title: "Edit"
    })
  }

  if (Role?.includes('Delete')) {
    Actions.push({
      svg: "trash.svg",
      className: "!bg-[#FF234F] !border !border-[#FF234F] !px-2 !py-2",
      action: modalDeletes,
      title: "Delete"
    })
  }


  return (
    <div>
      <div className="my-5">
        <table className="tabel w-full">
          <thead>
            <tr className="text-start">
              <th className="bg-[#F5F6FB] w-[5%] text-xs py-3 text-[#7D7D7D] text-center">
                No
              </th>
              <th className="bg-[#F5F6FB] w-[25%] text-xs py-3 text-[#7D7D7D] text-center">
                Nama Kota
              </th>
              <th className="bg-[#F5F6FB] w-[25%] text-xs py-3 text-[#7D7D7D] text-center">
                Provinsi
              </th>
              {Role?.includes('Delete') && <th className="bg-[#F5F6FB] w-[25%] text-center text-xs py-3 text-[#7D7D7D]  rounded-r-full">
                Action
              </th>}
            </tr>
          </thead>
          <tbody>
            {listData?.map((val, key) => (
              <tr key={key} className="border-b">
                <td className="text-xs text-center py-2">{(pageData - 1) * sizeData + key + 1}.</td>
                <td className="text-xs text-center py-2">{val?.location_name}</td>
                <td className="text-xs text-center py-2">{val?.province_name}</td>
                {(Role?.includes('Delete') || Role?.includes('Edit')) && <td className="text-xs py-2 justify-center flex">
                  <div className="flex items-center gap-3">
                    {Actions?.map((res, key) => (
                      <ActionButton
                        key={key}
                        className={res?.className}
                        icon={res?.svg}
                        onClick={() => res?.action(val)}
                      />
                    ))}
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center my-5 gap-5">
        <div className="flex items-center gap-5">
          <Pagination dataActived={pageData} maxLenght={maxLenght} onChange={(e) => {
            setPageData(e)
          }} pageData={pageData = 1} />
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
              // value={searchTerm}
              // onChange={handleSearch}
              inputMode="numeric"
              onChange={(e) => {
                setPageData(+e.target.value || 1)
              }}
              className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
