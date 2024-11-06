import React, { useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import ProgressBar from "../../Atoms/ProgressBar";
import { Button } from "../..";

export default function TableMonitoringProject({
  downloadReport = () => {},
  listData,
  setPageData = () => { },
  maxLenght,
  pageData,
  setSizeData,
  sizeData,
  Role  
}) {
  
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
                Nama Project
              </th>
              <th className="bg-[#F5F6FB] w-[10%] text-xs py-3 text-[#7D7D7D] text-center">
                Nilai Pagu
              </th>
              <th className="bg-[#F5F6FB] w-[5%] text-xs py-3 text-[#7D7D7D] text-center">
                Status Project
              </th>
              <th className="bg-[#F5F6FB] w-[25%] text-xs py-3 text-[#7D7D7D] text-center">
                Project Progress
              </th>
              {Role?.includes("Download Project Report") && <th className="bg-[#F5F6FB] w-[25%] text-center text-xs py-3 text-[#7D7D7D]  rounded-r-full">
                Action
              </th>}
            </tr>
          </thead>
          <tbody>
            {listData?.map((val, key) => (
              <tr key={key} className="border-b">
                <td className="text-xs text-center py-2">{key + 1}.</td>
                <td className="text-xs py-2">{val?.package}</td>
                <td className="text-xs text-center py-2">Rp. {(val.id_status != 5 ? +val?.pagu : +val?.contract_value).toLocaleString()}</td>
                <td className="text-xs text-center">
                  <div className="flex justify-center">
                    <span class={`${val?.status_approval == null || val?.status_approval == 0 ? "bg-yellow-200 text-yellow-400" : "bg-green-100 text-green-400"} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300`}>
                      {val?.status_approval == null || val?.status_approval == 0 ? "Draft" : "Approve"}
                    </span>
                  </div>
                </td>
                <td className="text-xs py-4 text-center">
                  <div className="w-full flex items-center justify-center">
                    <ProgressBar
                      progressValue={val?.progress_value}
                      descValue={val.progress_description}
                    />
                  </div>
                </td>
                {Role?.includes("Download Project Report") && <td className="text-xs text-center py-2">
                  <Button
                    onClick={() => downloadReport([val])}
                    title={"Download Report"}
                    className="border-[#5D5FEF] !rounded-full text-[#5D5FEF]"
                  />
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center my-5 gap-5">
        <div className="flex items-center gap-5">
          <Pagination dataActived={pageData} maxLenght={maxLenght} onChange={(e) => { setPageData(e) }} pageData={pageData = 1} />
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
              onChange={(e) => { setPageData(+e.target.value || 1) }}
              className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
