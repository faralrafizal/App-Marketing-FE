import React, { useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import NewSelect from "../../Atoms/SelectInput/NewSelect";
import { getOneStructureOrgan } from "../../../config/Api/Api";
import Colomn from "./Colomn";

export default function TabelSirupEditable({
  modalDeletes,
  DetailData,
  NavigateEdit,
  listData,
  classNameTable,
  setPageData = () => { },
  maxLenght = 1,
  pageData = 1,
  setSizeData = () => { },
  sortByStatus,
  sizeData = 10,
  onchangeDate,
  filterData,
  onCheckAll,
  checkedAll,
  token
}) {
  const [countChecked, setCountChecked] = useState(0);
  const [Refresh, setRefresh] = useState(false);

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

  let listHeader = [
    { title: "No", className: "!w-[50px]" },
    { title: "ID", className: "flex-1" },
    { title: "Kata Kunci", className: "flex-1" },
    { title: "Tanggal Input", className: "flex-1" },
    { title: "Paket", className: "flex-1" },
    { title: "Pagu (Rp)", className: "flex-1" },
    { title: "Jenis Pengadaan", className: "flex-1" },
    { title: "Jenis Barang", className: "flex-1" },
    { title: "Unit/Set", className: "flex-1" },
    { title: "Nilai Satuan", className: "flex-1" },
    { title: "Metode", className: "flex-1" },
    { title: "Pemilihan", className: "flex-1" },
    { title: "K/L/PD", className: "flex-1" },
    { title: "Satuan Kerja", className: "flex-1" },
    { title: "Sumber Dana", className: "flex-1" },
    { title: "Lokasi", className: "flex-1" },
    { title: "Kordinator", className: "flex-1" },
    { title: "Marketing", className: "flex-1" },
    { title: "Perusahaan", className: "flex-1" },
    { title: "Progress", className: "flex-1" },
  ];

  const selectCoordinator = async (id, index) => {
    let data = await getOneStructureOrgan(id);

    if (data?.code == 1) {
      onchangeDate(index, "kordinator", data?.responseResult?.leader);
    } else {
      onchangeDate(index, "kordinator", {});
    }
    setRefresh(!Refresh);
  };

  const listProgres = [
    {
      title: "Contract",
      value: 5,
      css: " text-[#0095FF] bg-[#0095FF]/20 border-[#0095FF]",
    },
    {
      title: "100%",
      value: 100,
      css: " text-[#0095FF] bg-[#0095FF]/20 border-[#0095FF]",
    },
    {
      title: "75%",
      value: 75,
      css: " text-[#FF8F0D] bg-[#FF8F0D]/20 border-[#FF8F0D]",
    },
    {
      title: "50%",
      value: 50,
      css: " text-[#884DFF] bg-[#884DFF]/20 border-[#884DFF]",
    },
    {
      title: "25%",
      value: 25,
      css: " text-[#FF234F] bg-[#FF234F]/20 border-[#FF234F]",
    },
    {
      title: "0%",
      value: 0,
      css: " text-[#555555] bg-[#555555]/20 border-[#555555]",
    },
  ];

  const listCompany = [
    { title: "select" },
    { title: "CMC" },
    { title: "ARVIRO" },
    { title: "UEP" },
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

      <div className="my-5 overflow-auto  tableContainer element-with-scrollbar ">
        <table className={`${classNameTable} tabel w-[200%] `}>
          <thead>
            <tr className="text-start">
              <th className="w-[2%] containet">
                <div className="flex w-full items-center justify-center">
                  <div className="w-[50px] items-center justify-center">
                    <Checkbox
                      checked={checkedAll}
                      onChange={(e) => onCheckAll(e)}
                    />
                  </div>
                </div>
              </th>
              {listHeader.map((val, i) => (
                <th
                  key={i}
                  className={
                    "bg-[#F5F6FB] text-xs py-2 text-[#7D7D7D] " + val.className
                  }
                >
                  {val.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody >
            {listData?.map((val, index) => (
              <Colomn
                sortByStatus={sortByStatus}
                onchangeDate={onchangeDate}
                listCompany={listCompany}
                filterData={filterData}
                sizeData={sizeData}
                pageData={pageData}
                index={index}
                val={val}
                key={index}
                token={token}
                listProgres={listProgres}
              />
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
      .tableContainer {
        max-height: 70vh;
        overflow-y: scroll;
        padding: 0;
        margin: 0;
        width: 100%;
      }

      table {
        width: 100%;
      }

      thead {
        position: sticky;
        top: 0px;
        background-color: white;
      }
`}</style>



    </div>
  );
}
