import React, { useEffect, useState } from "react";
import Checkbox from "../Checkbox";
import { formatDateSimple } from "@/utils/formateDate";
import { FetchData, getOneStructureOrgan } from "@/config/Api/Api";
import NewSelect from "../SelectInput/NewSelect";

export default function ChildTabelSirup({
  index,
  val,
  pageData,
  sizeData,
  onchangeDate,
  filterData,
}) {
  const selectCoordinator = async (id) => {
    let data = await getOneStructureOrgan(id);

    if (data?.code == 1) {
      onchangeDate(index, "kordinator", data?.responseResult?.profile);
    } else {
      onchangeDate(index, "kordinator", {});
    }
  };

  return (
    <tr key={index} className="border-b">
      <td className="w-[2%] text-center">
        <div className="flex w-full items-center justify-center">
          <div className="w-[50px] items-center justify-center">
            <Checkbox
              checked={val?.checked}
              onChange={(e) =>
                // val?.id_keyword?.id_keyword &&
                // val?.procurement_type?.id_procurement_type &&
                // val?.location_name?.id_location &&
                // val?.location_name?.id_location &&
                onchangeDate(index, "checked", e)
              }
            />
          </div>
        </div>
      </td>
      <td className="text-xs text-center py-2">
        <div className="w-[50px]"></div>
        {(pageData - 1) * sizeData + index + 1}.
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.project_code}
          onChange={(e) => {
            onchangeDate(index, "project_code", e.target.value);
          }}
        />
      </td>
      <td
        className={
          "text-xs py-2 px-2 flex-1" +
          (!val?.id_keyword?.id_keyword && "bg-red-300")
        }
      >
        <div className="w-[200px]"></div>
        {val?.id_keyword?.id_keyword ? (
          <NewSelect
            list={filterData("keyword")}
            title={"keyword"}
            defaultValue={val?.id_keyword}
            onChange={(e) => {
              onchangeDate(index, "id_keyword", e);
            }}
          />
        ) : (
          val?.id_keyword
        )}
      </td>
      <td className="text-xs py-2">
        <input
          type="date"
          value={val?.input_date}
          onChange={(e) => {
            onchangeDate(index, "input_date", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <div className="w-[200px]"></div>
        <textarea
          id="dropzone-file"
          className="w-full px-1"
          type="text"
          value={val?.package}
          onChange={(e) => {
            onchangeDate(index, "package", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.pagu}
          onChange={(e) => {
            onchangeDate(index, "pagu", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.jenis_barang}
          onChange={(e) => {
            onchangeDate(index, "jenis_barang", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.unit_set}
          onChange={(e) => {
            onchangeDate(index, "unit_set", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.unit_value}
          onChange={(e) => {
            onchangeDate(index, "unit_value", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.method}
          onChange={(e) => {
            onchangeDate(index, "method", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <input
          type="date"
          value={val?.choose_date}
          onChange={(e) => {
            onchangeDate(index, "choose_date", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <textarea
          id="dropzone-file"
          className="min-w-[200px]"
          type="text"
          value={val?.klpd}
          onChange={(e) => {
            onchangeDate(index, "klpd", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <textarea
          id="dropzone-file"
          className="min-w-[200px]"
          type="text"
          value={val?.work_unit}
          onChange={(e) => {
            onchangeDate(index, "work_unit", e.target.value);
          }}
        />
      </td>
      <td
        className={
          "text-xs py-2 px-2 " +
          (!val?.location_name?.id_location && "bg-red-300")
        }
      >
        <div className="w-[150px]"></div>
        {val?.location_name?.id_location ? (
          <NewSelect
            list={filterData("location")}
            title={"location_name"}
            defaultValue={val?.location_name}
            onChange={(e) => {
              onchangeDate(index, "location_name", e);
            }}
          />
        ) : (
          val?.location_name
        )}
      </td>
      <td className="text-xs py-2">
        <input
          type="text"
          value={val?.fund_source}
          onChange={(e) => {
            onchangeDate(index, "fund_source", e.target.value);
          }}
        />
      </td>
      <td className="text-xs py-2 min-w-[150px]">
        <NewSelect
          list={
            filterData(
              "marketing",
              "id_location",
              val?.location_name?.id_location
            ).length > 0
              ? filterData(
                  "marketing",
                  "id_location",
                  val?.location_name?.id_location
                )
              : filterData("marketing")
          }
          title={"employee_name"}
          defaultValue={val?.marketing}
          onChange={(e) => {
            onchangeDate(index, "marketing", e);
            selectCoordinator(e.id_profile);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <div className="w-[150px]"></div>
        <input type="text" value={val?.kordinator?.employee_name} disabled />
      </td>
      <td className="text-xs py-2">
        <div className="w-[150px]"></div>
        <NewSelect
          list={filterData("location")}
          title={"location_name"}
          defaultValue={val?.location_name}
          onChange={(e) => {
            onchangeDate(index, "location_name", e);
          }}
        />
      </td>
      <td className="text-xs py-2">
        <div className="">
          <div className="w-[150px]"></div>
          <NewSelect
            list={filterData("location")}
            title={"location_name"}
            defaultValue={val?.location_name}
            onChange={(e) => {
              onchangeDate(index, "location_name", e);
            }}
          />
        </div>
      </td>

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
        .td {
          padding: 1.5rem 1.5rem;
          vertical-align: middle;
        }
        tr > th:first-child {
          position: sticky;
          background: #f5f6fb;
          left: 0;
          border-radius: 50px 0 0px 50px;
        }

        tr > th:last-child {
          position: sticky;
          background: #f5f6fb;
          right: 0;
          border-radius: 0 50px 50px 0;
        }
        tr > td:last-child {
          position: sticky;
          background: white;
          right: 0;
        }
        tr > td:first-child {
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
    </tr>
  );
}
