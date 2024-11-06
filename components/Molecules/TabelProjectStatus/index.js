import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/pagination";
import Checkbox from "../../Atoms/Checkbox";
import ActionButton from "../../Atoms/ActionButton";
import { formatDate } from "../../../utils/formateDate";
import { AiFillCheckCircle } from "react-icons/ai";
import ModalDetailProgres from "../../Atoms/Modal/ModalDetailProgres";
import ModalDetailActivity from "../../Atoms/Modal/ModalDetailActivity";
import {
  GetAllProject,
  UpdateProgresProject,
  approveStatusProject,
  getAllStatus,
} from "../../../config/Api/Api";
import NotFound from "../../Atoms/NotFound";
import Swal from "sweetalert2";

export default function ProjectStatusTabel({
  modalDeletes,
  NavigateEdit,
  classNameTable,
  maxLenght,
  searchTerm,
  countChecked,
  token,
  Role
}) {
  const [selectProgres, setSelectProgres] = useState(0);
  const [detailProgres, setDetailProgres] = useState(false);
  const [detailProgresData, setDetailProgresData] = useState(null);
  const [listData, setListData] = useState([]);

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const [masterStatus, setMasterStatus] = useState([]);
  const [countCheked, setcountCheked] = useState(0);

  const DetailData = (id) => {
    setDetailProgres(true);
    setDetailProgresData(id.id_project);
  };

  const editProgres = (e, idProject) => {
    let htmlComponent = '<input id="remark" class="swal2-input" placeholder="Remark">'
    let idStatus = masterStatus.find((val) => val.value == e)?.id_status;
    let titlePopUp = "Tambahkan Remark"
    if (+idStatus == 5) {
      htmlComponent = htmlComponent + '<input id="contract_value" type="number" class="swal2-input" placeholder="Nilai Kontrak">';
      titlePopUp = titlePopUp + " & Nilai Kontrak"
    }
    Swal.fire(
      {
      title: titlePopUp,
      html:
        htmlComponent,
      focusConfirm: false,
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: "Kirim",
      showLoaderOnConfirm: true,
      preConfirm: (val) => {
        const remark = Swal.getPopup().querySelector("#remark")?.value;
        const contract_value = Swal.getPopup().querySelector("#contract_value")?.value;
        updateProgres(
          idProject,
          masterStatus.find((val) => val.value == e)?.id_status,
          remark,
          contract_value
        );
        setSelectProgres(e);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
    
  };

  const getStatus = async () => {
    let result = await getAllStatus(token);
    if (result.code) {
      setMasterStatus(result.responseResult?.rows);
    }
  };

  useEffect(() => {
    if (token)
      getStatus();
  }, [token]);

  const updateProgres = async (idProject, idstatus, remaks, contractValue) => {
    let body = {
      data: [
        {
          id_project: idProject,
          id_status: idstatus,
          description: remaks,
          contract_value: +contractValue ? +contractValue : null
        },
      ],
    };

    let result = await UpdateProgresProject(body);

    if (result.code) {
      setRefresh(!refresh);
    } else {
    }
  };

  const approveStatus = async (data) => {
    let result = await approveStatusProject({
      id: [data.id_project],
    });
    if (result.status == "200") {
      setRefresh(!refresh);
    }
  };
  const approveStatusAll = async (data) => {
    let result = await approveStatusProject({
      id: listData.filter((val) => val.checked).map((val1) => val1?.id_project),
    });
    if (result.status == "200") {
      setRefresh(!refresh);
    }
  };

  let Actions = [
    {
      svg: "eye.svg",
      className: "!w-8",
      action: DetailData,
      type: "actual",
    },
    {
      title: "Approve",
      className: "!bg-[#5D5FEF]",
      action: approveStatus,
    },
  ];

  let ActionsApplove = [
    {
      svg: "eye.svg",
      className: "!w-7",
      action: DetailData,
      type: "actual",
    },
  ];

  const getList = async () => {
    let getList = await GetAllProject({
      status: "approve",
      page: pageData,
      size: sizeData,
      searchWord: searchTerm,
    }, token);
    if (+getList.code) {
      setListData(
        getList?.responseResult.rows.map((res) => ({
          ...res,
          checked: false,
        }))
      );
      if ((getList.responseCode = 200)) {
        let count = getList?.responseResult?.count;

        let number = count / sizeData;
        number = parseInt(number);
        let valCount = count % +sizeData;
        if (valCount === 0) {
          setLenPage(number);
        } else {
          setLenPage(number + 1);
        }
      }
    } else {
      setListData([]);
      setLenPage(0);
    }
  };

  useEffect(() => {
    if (token)
      getList();
  }, [pageData, sizeData, searchTerm, refresh, token]);

  let progresColor = {
    100: "text-[#0095FF] bg-[#0095FF]/20 border-[#0095FF]",
    50: " text-[#FF8F0D] bg-[#FF8F0D]/20 border-[#FF8F0D]",
    75: " text-[#884DFF] bg-[#884DFF]/20 border-[#884DFF]",
    25: " text-[#FF234F] bg-[#FF234F]/20 border-[#FF234F]",
    0: " text-[#555555] bg-[#555555]/20 border-[#555555]",
  };

  const onchangeChecked = (index, e) => {
    let newData = listData;
    listData[index].checked = e;
    setListData([...newData]);
    if (newData.every((val) => val.checked == true)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    setcountCheked(listData.filter((res) => res.checked)?.length);
  };

  const ClickCheckAll = (e) => {
    setCheckAll(e);
    let newData = listData;
    setListData(
      newData?.map((val) => ({
        ...val,
        checked: val?.progress_flag != "actual" ? e : false,
      }))
    );
    setcountCheked(newData.filter((res) => res.checked)?.length);
  };

  return (
    <div>
      {countCheked ? (
        <div className="flex items-center justify-between my-4">
          <div className="text-sm font-semibold text-[#7D7D7D]">
            {countCheked} Items Selected
          </div>
          <div className="flex items-center gap-3">
            {Actions?.slice(1).map((res, key) => (
              <div
                key={key}
              >
                <ActionButton
                  key={key}
                  className={res?.className}
                  icon={res?.svg || ""}
                  title={res?.title}
                  onClick={() => approveStatusAll()}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {detailProgres && (
        <ModalDetailProgres
          isOpen={detailProgres}
          data={detailProgresData}
          onClose={() => setDetailProgres(false)}
        />
      )}
      <div className="my-5  element-with-scrollbar">
        <table className="tabel w-full">
          <thead>
            <tr className="text-start">
              {<th className="w-[5%] bg-[#F5F6FB] rounded-s-full containet">
                <div className="flex w-full items-center justify-center">
                  <Checkbox
                    checked={checkAll}
                    onChange={(e) => ClickCheckAll(e)}
                  />
                </div>
              </th>}
              <th className="bg-[#F5F6FB] text-xs py-2 text-[#7D7D7D] text-center w-[50px]">
                No
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Kode Project
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start w-[20%]">
                Nama Project
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Tanggal Update
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Progres
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Nilai Kontrak
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-start flex-1">
                Remarks
              </th>
              <th className="bg-[#F5F6FB] rounded-e-full text-center text-xs py-2 text-[#7D7D7D]  w-[5%] rounded-r-full">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData.length > 0
              ? listData.map((val, key) => (
                <tr key={key} className="border-b">
                  <td className="w-[2%] text-center">
                    <div className="flex w-full items-center justify-center">
                      {val?.progress_flag != "actual" ? (
                        <Checkbox
                          checked={val?.checked}
                          onChange={(e) => onchangeChecked(key, e)}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="text-xs text-center py-2">
                    {(pageData - 1) * sizeData + key + 1}.
                  </td>
                  <td className="text-xs py-2">{val?.project_code}</td>
                  <td className="text-xs py-2 px-2">
                    {val?.package ||
                      "Pembangunan IPAL 3 Kawasan Inti Pusat Pemerintahan Ibu Kota Negara  (KIPP IKN)"}
                  </td>
                  <td className="text-xs py-2">
                    {formatDate(new Date(val?.updated_at))
                      .substring(5)
                      .replaceAll(" ", "-")}
                  </td>
                  <td className="text-xs py-2">
                    <select
                      className={
                        ` border rounded-full  px-2 py-1 focus:right-0 focus:border-none ` +
                        progresColor[val?.progress_value || 0]
                      }
                      onChange={(e) =>
                        editProgres(e.target.value, val.id_project)
                      }
                      value={val?.progress_value || 0}
                      disabled={val?.progress_flag == "actual" ? false : true}
                    >
                      <option
                        value="Contract"
                        className="text-black bg-white"
                      >
                        Contract
                      </option>
                      <option value="100" className="text-black bg-white">
                        100%
                      </option>
                      <option value="75" className="text-black bg-white">
                        75%
                      </option>
                      <option value="50" className="text-black bg-white">
                        50%
                      </option>
                      <option value="25" className="text-black bg-white py-5">
                        25%
                      </option>
                      <option value="0" className="text-black bg-white">
                        0%
                      </option>
                    </select>
                  </td>
                  <td className="text-xs py-2 px-3">
                    <div className="px-3 py-1 text-center text-xs font-medium border rounded-full">
                      {(+val?.pagu).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </div>
                  </td>
                  <td className="text-xs relative py-2 w-[15%] ">
                    <div className="px-3 trigger py-1 text-center text-xs font-medium border rounded-full">
                      {val?.progress_remarks
                        ? val?.progress_remarks.length > 15
                          ? val?.progress_remarks?.slice(0, 15) + "..."
                          : val?.progress_remarks
                        : "-"}
                    </div>
                    <div className="hidden rounded bottom-12 absolute bg-slate-100 p-1">
                      {val?.progress_remarks}
                    </div>
                  </td>

                  <td className="text-xs py-2 w-[15%]">
                    <div className="flex items-center justify-around">
                      {val?.progress_flag == "actual"
                        ? ActionsApplove?.map((res, key) => (
                          <div
                            key={key}
                          >
                            <ActionButton
                              key={key}
                              className={res?.className}
                              icon={res?.svg || ""}
                              title={res?.title}
                              onClick={() => res?.action(val)}
                            />
                          </div>
                        ))
                        : Actions?.map((res, key) => (
                          <div
                            key={key}
                          >
                            <ActionButton
                              key={key}
                              className={res?.className}
                              icon={res?.svg || ""}
                              title={res?.title}
                              onClick={() => res?.action(val)}
                            />
                          </div>
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
          <Pagination dataActived={pageData} maxLenght={lenPage} onChange={(e) => setPageData(e)} />
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
              onChange={(e) => { setPageData(+e.target.value || 1) }}
              inputMode="numeric"
              className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
            />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .hidden {
            display: none;
            z-index: 1000;
          }

          .trigger:hover + .hidden {
            display: block;
          }
        `}
      </style>
    </div>
  );
}
