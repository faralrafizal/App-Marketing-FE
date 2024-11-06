import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/pagination";
import ActionButton from "../../Atoms/ActionButton";
import { formatDate, formatDateNew } from "../../../utils/formateDate";
import Image from "next/image";
import ModalDetailActivity from "../../Atoms/Modal/ModalDetailActivity";
import { getAllDaily } from "../../../config/Api/Api";
import NotFound from "../../../components/Atoms/NotFound";
import { ShowLoading, SwalClose } from "../../../utils/loading";
import { useSession } from "next-auth/react";
import ModalDelete from "../../Atoms/Modal/ModalDelete";

export default function ActivityTabel({
  modalDeletes,
  DetailData,
  NavigateEdit,
  searchTerm,
  countChecked,
  token,
  Role
}) {
  const [detailActivity, setDetailActivity] = useState(false);
  const [detailActivityData, setDetailActivityData] = useState({});

  const [listData, setListData] = useState([]);

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [modalDelete, setModalDelete] = useState(false);


  const getListData = async () => {
    ShowLoading()
    let getList = await getAllDaily({ searchTerm, page: pageData, size: sizeData, token });
    if (+getList.code) {
      setListData(
        getList?.responseResult.rows.map((res) => ({
          ...res,
          checked: false,
        }))
      );

      let count = getList?.responseResult?.count;
      let number = count / +sizeData;

      number = parseInt(number);
      let valCount = count / +sizeData;
      if (valCount === 0) {
        setLenPage(valCount);
      } else {
        setLenPage(valCount + 1);
      }
    } else {
      setListData([]);
      setLenPage(0);
    }
    SwalClose()
  };

  useEffect(() => {
    if (token)
      getListData();
  }, [pageData, sizeData, searchTerm, token]);

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

      <ModalDetailActivity
        isOpen={detailActivity}
        data={detailActivityData}
        onClose={() => setDetailActivity(false)}
        Role={Role}
      />

      <ModalDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        ConfirmOk={() => {
          deleteProject();
        }}
        title="Delete Project"
      />

      <div className="my-5 overflow-auto  element-with-scrollbar">
        <table className="tabel w-full">
          <thead>
            <tr className="text-center">
              <th className="bg-[#F5F6FB] rounded-s-full text-xs py-2 text-[#7D7D7D] text-center w-[50px]">
                No
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-center flex-1">
                Date
              </th>
              {/* <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-center flex-1">
                Location
              </th> */}
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-center flex-1">
                Time Activity
              </th>
              <th className="bg-[#F5F6FB] text-xs text-[#7D7D7D] text-center flex-1">
                Description
              </th>
              {Role?.includes("Detail") && <th className="bg-[#F5F6FB] rounded-e-full text-xs text-[#7D7D7D] text-center flex-1">
                Coordinate
              </th>}
            </tr>
          </thead>
          <tbody>
            {listData?.length > 0
              ? listData?.map((val, key) => (
                <tr key={key} className="border-b">
                  <td className="text-xs text-center py-2">{key + 1}</td>
                  <td className="text-xs text-center py-2">
                    {formatDate(new Date(val?.activity_date))
                      .substring(5)
                      .replaceAll(" ", "-")}
                  </td>
                  {/* <td className="text-xs text-center py-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#369FFF]/20 text-[#369FFF]">
                    Work From Office
                  </span>
                </td> */}
                  <td className="text-xs text-center font-medium py-2">
                    {formatDateNew(new Date(val?.activity_date), "HH:mm")}
                  </td>
                  <td className="text-xs text-center font-medium py-2">
                    {val?.activity}
                  </td>
                  {Role?.includes("Detail") && <td className="text-xs py-2 flex items-center justify-center">
                    <div
                      onClick={() => {
                        setDetailActivityData(val);
                        setDetailActivity(true);
                      }}
                      className="border cursor-pointerx flex items-center justify-around px-3 py-1 border-[#5D5FEF] rounded-full cursor-pointer"
                    >
                      <Image
                        className=" right-4 "
                        src="/icon/location.svg"
                        alt="Next.js Logo"
                        width={20}
                        height={20}
                        priority
                      />
                      <div className="text-sm font-semibold ml-2 text-[#5D5FEF]">
                        View On Map
                      </div>
                    </div>
                  </td>}
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
              onChange={(e) => { setPageData(+e.target.value || 1) }}
              inputMode="numeric"
              className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
