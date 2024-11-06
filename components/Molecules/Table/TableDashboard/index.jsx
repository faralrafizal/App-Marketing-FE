import React, { useState } from "react";
import Pagination from "../../Pagination/pagination";
import { AiFillCheckCircle } from "react-icons/ai";
import { formatDate, formatDateNew } from "../../../../utils/formateDate";
import NotFound from "../../../../components/Atoms/NotFound";
import ActionButton from "../../../Atoms/ActionButton";

export default function TableDashboard({
  modalDeletes,
  DetailData,
  NavigateEdit,
  listData,
  classNameTable,
  setPageData = () => { },
  maxLenght,
  pageData,
  setSizeData,
  sizeData,
  selectData,
  countChecked,
  checkedAll,
  checkAll,
}) {
  let Actions = [
    {
      svg: "edit.svg",
      action: NavigateEdit,
    },
    {
      svg: "eye.svg",
      action: DetailData,
    },
    {
      svg: "trash.svg",
      className: "!bg-[#FF234F] !border !border-[#FF234F] !px-2 !py-2",
      action: modalDeletes,
    },
  ];
  let progresColor = {
    Contract: "text-[#00E096] bg-[#00E096]/20 border-[#00E096]",
    100: "text-[#0095FF] bg-[#0095FF]/20 border-[#0095FF]",
    50: " text-[#FF8F0D] bg-[#FF8F0D]/20 border-[#FF8F0D]",
    75: " text-[#884DFF] bg-[#884DFF]/20 border-[#884DFF]",
    25: " text-[#FF234F] bg-[#FF234F]/20 border-[#FF234F]",
    0: " text-[#555555] bg-[#555555]/20 border-[#555555]",
  };


  return (
    <div>
      {countChecked ? (
        <div className="flex items-center justify-between my-4">
          <div className="text-sm font-semibold text-[#7D7D7D]">
            {countChecked} Items Selected
          </div>
          <div>
            <ActionButton
              className={
                "bg-[#FF234F] border border-[#FF234F] rounded-full px-3 py-2"
              }
              icon={"trash.svg"}
              title={"Delete"}
              width={20}
              height={20}
              onClick={() => clickDelete(getListDelete())}
            />
          </div>
        </div>
      ) : null}

      <div className="my-5 overflow-auto  element-with-scrollbar">
        <table className="tabel w-[200%]">
          <thead>
            <tr className="text-start">
              <th className="bg-[#F5F6FB] text-xs py-2 text-[#7D7D7D] text-center w-[50px]">
                No
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Kata Kunci
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Tanggal Input
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Paket
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Pagu (Rp)
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Jenis Barang
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Unit / Set
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Nilai Satuan
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
                Coordinator
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Perusahaan
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Sumber Dokumen
              </th>
              <th className="bg-[#F5F6FB] text-center text-xs py-2 text-[#7D7D7D]  w-[5%] rounded-r-full">
                Presentase
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.length > 0
              ? listData?.map((val, key) => (
                <tr key={key} className="border-b">
                  <td className="text-xs text-center py-2">
                    {(pageData - 1) * sizeData + key + 1}.
                  </td>
                  <td className="text-xs py-2">{val?.keyword}</td>
                  <td className="text-xs py-2">
                    {formatDate(val?.input_date)
                      .substring(5)
                      .replaceAll(" ", "-")}
                  </td>
                  <td className="text-xs py-2">{val?.package}</td>
                  <td className="text-xs py-2">
                    {(+val?.pagu).toLocaleString()}
                  </td>
                  <td className="text-xs py-2">{val?.type_item || ""}</td>
                  <td className="text-xs py-2">{val?.unit_set || ""}</td>
                  <td className="text-xs py-2">
                    {val?.unit_value?.toLocaleString() || ""}
                  </td>
                  <td className="text-xs py-2">{val?.method}</td>
                  <td className="text-xs py-2">
                    {formatDateNew(val?.choose_date, "MM-YYYY")}
                  </td>
                  <td className="text-xs py-2">{val?.klpd}</td>
                  <td className="text-xs py-2">{val?.work_unit}</td>
                  <td className="text-xs py-2">{val?.location_name}</td>
                  <td className="text-xs py-2">{val?.fund_source}</td>
                  <td className="text-xs py-2">{val?.marketing_name}</td>
                  <td className="text-xs text-center">{val?.coordinator_name}</td>
                  <td className="text-xs text-center">{val?.company}</td>
                  <td className="text-xs text-center">
                    {val?.source_document}
                  </td>
                  <td className="text-xs py-2 px-4 w-[130px]">
                    <div
                      className={
                        ` border rounded-full text-center  px-2 py-1 focus:right-0 focus:border-none ` +
                        progresColor[
                        val?.progress_description ||
                        val?.progress_value ||
                        0
                        ]
                      }
                    >
                      {val?.progress_description ||
                        (val?.progress_value && val?.progress_value + " %") ||
                        "0 %"}
                    </div>
                  </td>
                </tr>
              ))
              : null}
          </tbody>
        </table>
      </div>
      {listData?.length <= 0 ? <NotFound /> : null}

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
              // value={searchTerm}
              // onChange={handleSearch}
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
