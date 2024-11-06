import React, { useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import { formatDate } from "../../../utils/formateDate";

export default function TabelSirup({
  modalDeletes,
  DetailData,
  NavigateEdit,
  listData,
  classNameTable,
  setPageData = () => {},
  maxLenght,
  pageData,
  setSizeData,
  sizeData,
}) {
  const [countChecked, setCountChecked] = useState(0);

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
  return (
    <div>
      {countChecked ? (
        <div className="flex items-center justify-between">
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

      <div className="my-5 overflow-auto element-with-scrollbar">
        <table className={`${classNameTable} tabel w-[200%]`}>
          <thead>
            <tr className="text-start">
              <th className="w-[2%] containet">
                <div className="flex w-full items-center justify-center">
                  <Checkbox
                  // checked={checkedAll}
                  // onChange={(e) => onCheckAll(e)}
                  />
                </div>
              </th>
              <th className="bg-[#F5F6FB] text-xs py-2 text-[#7D7D7D] text-center w-[50px]">
                No
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
                ID
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Sumber Dana
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Marketing
              </th>
              {/* <th className="bg-[#F5F6FB] text-center text-xs py-2 text-[#7D7D7D]  w-[5%] rounded-r-full">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody>
            {listData?.map((val, key) => (
              <tr key={key} className="border-b">
                <td className="w-[2%] text-center">
                  <div className="flex w-full items-center justify-center">
                    <Checkbox
                    checked={val?.checked}
                    // onChange={(e) => onCheckAll(e)}
                    />
                  </div>
                </td>
                <td className="text-xs px-2 text-center py-2">
                  {(pageData - 1) * sizeData + key + 1}.
                </td>
                <td className="text-xs px-2 py-2">{val?.project_code}</td>
                <td className="text-xs px-2 py-2">
                  {formatDate(val?.input_date)
                    .substring(5)
                    .replaceAll(" ", "-")}
                </td>
                <td className="text-xs px-2 py-2">{val?.package}</td>
                <td className="text-xs px-2 py-2">{val?.pagu}</td>
                <td className="text-xs px-2 py-2">{val?.procurement_type}</td>
                <td className="text-xs px-2 py-2">{val?.method}</td>
                <td className="text-xs px-2 py-2">{val?.choose_date}</td>
                <td className="text-xs px-2 py-2">{val?.klpd}</td>
                <td className="text-xs px-2 py-2">{val?.work_unit}</td>
                <td className="text-xs px-2 py-2">{val?.location_name}</td>
                <td className="text-xs px-2 py-2">{val?.project_code}</td>
                <td className="text-xs px-2 py-2">{val?.fund_source}</td>
                <td className="text-xs px-2 py-2">{val?.marketing_name}</td>
                {/* <td className="text-xs py-2 w-[130px]">
                  <div className="flex items-center justify-around">
                    {Actions?.map((res, key) => (
                      <ActionButton
                        key={key}
                        className={res?.className}
                        icon={res?.svg}
                        onClick={() => res?.action()}
                      />
                    ))}
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center my-5 gap-5">
        <div className="flex items-center gap-5">
          <Pagination maxLenght={maxLenght} onChange={(e) => setPageData(e)} />
          <select
            value={sizeData}
            onChange={(e) => setSizeData(e.target.value)}
            className="border-[2px] px-2 py-1 border-[#5D5FEF] rounded-full focus:outline-none"
          >
            <option value="10" className="text-sm font-medium" selected>
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

      `}</style>
    </div>
  );
}
