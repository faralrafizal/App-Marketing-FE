"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TableProject from "../../../../../components/Molecules/TableProject";
import { FetchData, GetAllProject } from "../../../../../config/Api/Api";
import ModalDetailSirup from "../../../../../components/Atoms/Modal/ModalDetailSirup";
import ModalDelete from "../../../../../components/Atoms/Modal/ModalDelete";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";
import { useSession } from "next-auth/react";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Master Project"]?.map((res) => res.event)
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const [selectedOptionLength, setSelectedOptionLength] = useState("");
  const [detailSirup, setDetailSirup] = useState(false);
  const [detailSirupData, setDetailSirupData] = useState({});
  const [idDelete, setIdDelete] = useState([]);
  const [flagDelete, setFlagDelete] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteChecked, setModalDeleteChecked] = useState(false);
  const [listDataProject, setListDataProject] = useState([]);
  const [filter, setFilter] = useState("");
  const filterValue = [
    { tittle: "All", value: "" },
    { tittle: "Approved", value: "approve" },
    { tittle: "Waiting Approve", value: "not approve" },
  ];

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);

  const [countChecked, setCountChecked] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSizeData(10)
    setPageData(1)
  };

  let NavigateEdit = (val) => {
    router.push(`/main/master/project/${val.flag}/${val.id_project}/${val.project_code}`);
  };

  let DetailData = (val) => {
    setDetailSirupData(val);
    setDetailSirup(true);
  };

  let modalDeletes = (data) => {
    setFlagDelete(data?.flag);
    setIdDelete([data?.id_project]);
    setModalDelete(true);
  };

  const getProject = async () => {
    if (searchTerm == '') {
      ShowLoading();
    }
    let listProject = await GetAllProject({
      status: filter, // approve / not approve
      page: pageData,
      size: sizeData,
      searchWord: searchTerm
    },
      token
    );
    if (+listProject.code) {
      setListDataProject(
        listProject?.responseResult.rows.map((res) => ({
          ...res,
          checked: false,
        }))
      );

      if ((listProject.responseCode = 200)) {
        let count = listProject?.responseResult?.count;

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
      setLenPage(0);
      setListDataProject([]);
    }
    SwalClose()
  };

  let selectData = (index, e) => {
    let defaultValue = listDataProject;
    defaultValue[index].checked = e;
    setListDataProject(defaultValue);
    let count = defaultValue.filter((res) => res.checked).length;
    if (count == defaultValue.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
    setCountChecked(count);
    setRefresh(!refresh);
  };

  let checkAll = (e) => {
    let dataNew = listDataProject.map((val) => ({ ...val, checked: e }));
    setListDataProject(dataNew);
    setCheckedAll(e);
    setCountChecked(dataNew.filter((res) => res.checked).length);
    setRefresh(!refresh);
  };

  let deleteProjectChecked = async () => {
    let temp = listDataProject.filter((e) => e.checked && e.flag == "temp").map((el) => {
      return el.id_project;
    });
    let actual = listDataProject.filter((e) => e.checked && e.flag == "actual").map((el) => {
      return el.id_project;
    })
    ShowLoading()
    let delActual = await FetchData({
      methode: "DELETE",
      url: `/delete-project-actual-api?id=[${actual}]`,
      token: token
    });

    let delTemp = await FetchData({
      methode: "DELETE",
      url: `/delete-project-temp-api?id=[${temp}]`,
      token: token
    });

    setRefreshPage(!refreshPage);
    setModalDeleteChecked(false);
    setPageData(1);
    SwalClose()
  };

  let clickDelete = () => {
    setModalDeleteChecked(true);
  }

  let deleteProject = async () => {

    console.log(idDelete, flagDelete);
    ShowLoading()
    let uri
    if (flagDelete == "actual") {
      uri = `/delete-project-actual-api?id=[${idDelete}]`
    } else {
      uri = `/delete-project-temp-api?id=[${idDelete}]`
    }

    let del = await FetchData({
      methode: "DELETE",
      url: uri,
      token: token
    });

    console.log(del);
    setRefreshPage(!refreshPage);
    setModalDelete(false);
    setPageData(1);
    SwalClose()
  };

  useEffect(() => {
    if (token)
      getProject();
  }, [pageData, searchTerm, sizeData, refreshPage, token]);
  
  return (
    <div className="mx-7 py-3">
      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-base font-bold">Master Project</div>
            <div className="flex px-3 py-1 items-center gap-3 bg-gray-200 rounded-full">
              {filterValue.map((e) => (
                <div
                  key={e.value}
                  onClick={() => {
                    setFilter(e.value);
                    setPageData(1);
                    setCountChecked(0);
                    setCheckedAll(false);
                    setRefreshPage(!refreshPage);
                  }}
                  className={`${e.value == filter
                    ? "bg-[#5D5FEF] text-white rounded-full"
                    : ""
                    } text-sm cursor-pointer  px-2`}
                >
                  {e.tittle}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="py-2 px-6 rounded-full border border-gray-300 focus:outline-none "
              />
              <Image
                className="h-6 w-6 text-gray-400 absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                src="/icon/search.svg"
                alt="Next.js Logo"
                width={30}
                height={30}
                priority
              />
            </div>
            {Role?.includes("Create") && <a
              href={"/main/master/project/addProject"}
              className="bg-[#5D5FEF] px-4 py-2 rounded-full flex items-center gap-2"
            >
              <Image
                className=""
                src="/icon/addCircle.svg"
                alt="Next.js Logo"
                width={20}
                height={20}
                priority
              />
              <div className="font-semibold text-base text-white">Add Data</div>
            </a>}
          </div>
        </div>

        <TableProject
          isAwait={filter == "not approve"}
          modalDeletes={modalDeletes}
          DetailData={DetailData}
          NavigateEdit={NavigateEdit}
          listData={listDataProject}
          setPageData={(e) => setPageData(e)}
          pageData={pageData}
          maxLenght={lenPage}
          setSizeData={setSizeData}
          sizeData={sizeData}
          selectData={selectData}
          countChecked={countChecked}
          checkAll={checkAll}
          checkedAll={checkedAll}
          onClickDelete={clickDelete}
          refresh={() => setRefreshPage(!refreshPage)}
          listAccess={Role}
        />
      </div>
      {detailSirup && (
        <ModalDetailSirup
          refresh={() => { setRefreshPage(!refreshPage) }}
          modalDetail={() => { setDetailSirup(!detailSirup) }}
          isOpen={detailSirup}
          data={detailSirupData}
          onClose={() => setDetailSirup(false)}
          listAccess={Role}
        />
      )}
      <ModalDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        ConfirmOk={() => {
          deleteProject();
        }}
        title="Delete Project"
      />
      <ModalDelete
        isOpen={modalDeleteChecked}
        onClose={() => setModalDeleteChecked(false)}
        ConfirmOk={() => deleteProjectChecked()}
        title="Delete Project Checked"
      />
    </div>
  );
}
