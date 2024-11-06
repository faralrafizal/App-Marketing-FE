import React, { useEffect, useState } from 'react'
import Checkbox from '../../Atoms/Checkbox';
import NewSelect from '../../Atoms/SelectInput/NewSelect';
import { MarketirByCoordinator, coordinatorByLocation } from '../../../config/Api/Api';

export default function Colomn({ token, sortByStatus, onchangeDate, filterData, listCompany, index, listProgres, sizeData, pageData, val }) {
  const [coordinator, setCoordinator] = useState([]);
  const [marketing, setMarketing] = useState([]);

  const getCoordinator = () => {
    let result = filterData('locationWork', "id_location", val?.location_name?.id_location)
    if (result.length) {
      onchangeDate(index, "marketing", sortByStatus(result, "is_default")[0]);
    } else {
      setCoordinator([])
    }
  }

  useEffect(() => {
    val?.location_name?.id_location && getCoordinator()
  }, [val?.location_name?.id_location])

  return (
    <tr
      key={index}
      className={"border border-gray-400  " + (val?.exist ? "bg-green-200" : val.checked ? "bg-blue-100" : "")}
    >
      <td className="w-[2%] text-center">
        <div className="flex w-full  items-center justify-center">
          <div className="w-[50px] items-center justify-center">
            <Checkbox
              checked={val?.checked}
              onChange={(e) =>
                onchangeDate(index, "checked", e)
              }
            />
          </div>
        </div>
      </td>
      <td className="text-xs py-2 border border-gray-400 text-center ">
        <div className="w-[50px]"></div>
        {(pageData - 1) * sizeData + index + 1}.
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.project_code}
          onChange={(e) => {
            onchangeDate(index, "project_code", e.target.value);
          }}
        />
      </td>
      <td
        className={
          "text-xs  border border-gray-400 px-2 py-1 flex-1 " +
          (!val?.id_keyword?.id_keyword && "bg-red-300")
        }
      >
        <div className="min-w-[200px] border border-gray-500 rounded p-1">
          {/* {val?.id_keyword?.id_keyword ? ( */}
          <NewSelect
            list={filterData("keyword")}
            title={"keyword"}
            valueDefault={val?.id_keyword}
            onChange={(e) => {
              onchangeDate(index, "id_keyword", e);
            }}
          />
          {/* ) : (
            val?.id_keyword
          )} */}
        </div>
        {!val?.id_keyword?.id_keyword && <div className="mt-2 text-center"> {val?.id_keyword}</div>}
      </td>
      <td className="text-xs px-2 py-1  border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="date"
          value={val?.input_date}
          onChange={(e) => {
            onchangeDate(index, "input_date", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <div className="min-w-[200px] border border-gray-500 rounded p-1">
          <textarea
            id="dropzone-file"
            className="w-full px-1"
            type="text"
            value={val?.package}
            onChange={(e) => {
              onchangeDate(index, "package", e.target.value);
            }}
          />
        </div>
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.pagu}
          onChange={(e) => {
            onchangeDate(index, "pagu", e.target.value);
          }}
        />
      </td>
      <td className={"text-xs px-2 py-1 border border-gray-400  flex-1 " +
        (!val?.type_item?.id_procurement_type && "bg-red-300")}>
        <div className="min-w-[200px] border border-gray-500 rounded p-1">
          {/* {val?.type_item?.id_procurement_type ? ( */}
          <NewSelect
            list={filterData("procurement")}
            title={"type"}
            valueDefault={val?.type_item}
            onChange={(e) => {
              onchangeDate(index, "type_item", e);
            }}
          />
          {/* ) : (
            val?.type_item
          )} */}
        </div>
        {!val?.type_item?.id_procurement_type && <div className="mt-2 text-center"> {val?.type_item}</div>}
      </td>
      <td className="text-xs px-2 py-1  border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.jenis_barang}
          onChange={(e) => {
            onchangeDate(index, "jenis_barang", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.unit_set}
          onChange={(e) => {
            onchangeDate(index, "unit_set", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.unit_value}
          onChange={(e) => {
            onchangeDate(index, "unit_value", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.method}
          onChange={(e) => {
            onchangeDate(index, "method", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="date"
          value={val?.choose_date}
          onChange={(e) => {
            onchangeDate(index, "choose_date", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <textarea
          className="min-w-[200px] border border-gray-500 rounded p-1"
          type="text"
          value={val?.klpd}
          onChange={(e) => {
            onchangeDate(index, "klpd", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <textarea
          className="min-w-[200px] border border-gray-500 rounded p-1"
          type="text"
          value={val?.work_unit}
          onChange={(e) => {
            onchangeDate(index, "work_unit", e.target.value);
          }}
        />
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400">
        <input
          className="border border-gray-500 rounded p-1"
          type="text"
          value={val?.fund_source}
          onChange={(e) => {
            onchangeDate(index, "fund_source", e.target.value);
          }}
        />
      </td>
      <td
        className={
          "text-xs  border py-1 border-gray-400 px-2 " +
          (!val?.location_name?.id_location && "bg-red-300")
        }
      >
        <div className="min-w-[150px] border border-gray-500 rounded p-1">
          {/* {val?.location_name?.id_location ? ( */}
          <NewSelect
            list={filterData("location")}
            title={"location_name"}
            valueDefault={val?.location_name}
            onChange={(e) => {
              onchangeDate(index, "location_name", e);
            }}
          />
        </div>
        {!val?.location_name?.id_location && <div className="mt-2 text-center"> {val?.location_name}</div>}
      </td>
      <td className="text-xs py-2 px-1 border border-gray-400 min-w-[150px]">
        <div className="border border-gray-500 text-center  rounded p-1">
          {val?.marketing?.coordinator || "-"}

        </div>
      </td>
      <td className="text-xs px-2 py-1 border border-gray-400 min-w-[150px]">
        <div className="border border-gray-500 text-center rounded p-1">
          {val?.marketing?.marketing || "-"}

        </div>
      </td>

      <td className="text-xs py-2 px-1 border border-gray-400">
        <div className="min-w-[150px] border border-gray-500 rounded p-1">
          <NewSelect
            list={listCompany}
            title={"title"}
            valueDefault={val?.company}
            onChange={(e) => {
              if (e.title != "select")
                onchangeDate(index, "company", e);
            }}
          />
        </div>
      </td>
      <td className="text-xs py-2 px-1 border border-gray-400">
        <div className="">
          <div className="w-[150px]"></div>
          <select
            className={
              ` border border-gray-500 rounded-full w-full  px-2 py-1 focus:right-0 focus:border-none ` +
              listProgres.find((res) => +res.value + val?.progres)
                ?.css
            }
            onChange={(e) => {
              onchangeDate(index, "progres", e.target.value);
            }}
            value={val?.progres}
          >
            {listProgres.map((val, i) => (
              <option
                key={i}
                value={val.value}
                className="text-black bg-white"
              >
                {val.title}
              </option>
            ))}
          </select>
        </div>
      </td>

    </tr>
  )
}
