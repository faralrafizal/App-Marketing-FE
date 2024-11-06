"use client";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FetchData, GetAllProject } from "../../../../config/Api/Api";
import ModalDetailSirup from "../../../../components/Atoms/Modal/ModalDetailSirup";
import ModalDelete from "../../../../components/Atoms/Modal/ModalDelete";
import TableMonitoringProject from "../../../../components/Molecules/TableMonitoringProject";
import { ShowLoading, SwalClose } from "../../../../utils/loading";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSession } from "next-auth/react";
import {generatePdf} from "../../../../utils/generatePdf";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Monitoring Project"]?.map((res) => res.event)

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const [selectedOptionLength, setSelectedOptionLength] = useState("");
  const [detailSirup, setDetailSirup] = useState(false);
  const [detailSirupData, setDetailSirupData] = useState({});
  const [idDelete, setIdDelete] = useState([])
  const [flagDelete, setFlagDelete] = useState('')
  const [modalDelete, setModalDelete] = useState(false);
  const [listDataProject, setListDataProject] = useState([]);
  const [filter, setFilter] = useState('')
  const filterValue = [
    { tittle: "All", value: "" },
    { tittle: "Approved", value: "approve" },
    { tittle: "Not Approved", value: "not approve" },
  ]

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);

  const [countChecked, setCountChecked] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let NavigateEdit = (val) => {
    router.push(`/main/master/project/${val.id_project}`)
    // router.push(`/master/project`)
  };

  let DetailData = (val) => {
    setDetailSirupData(val);
    setDetailSirup(true);
  };

  let modalDeletes = (data) => {
    setFlagDelete(data?.flag)
    setIdDelete([data?.id_project])
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
      searchWord: searchTerm,
    }, token);
    if ((listProject.responseCode = 200)) {
      setListDataProject(
        listProject?.responseResult?.rows?.map((res) => ({
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
      SwalClose()
    }
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

  let deleteProject = async () => {
    await FetchData({
      methode: "delete",
      url: "/delete-project",
      data: {
        data: {
          category: flagDelete, // actual / temp
          idProject: idDelete,
        },
      },
      token: token
    });
    setRefreshPage(!refreshPage);
    setModalDelete(false);
    setPageData(1)
  };

  useEffect(() => {
    if (token)
      getProject();
  }, [pageData, searchTerm, sizeData, refreshPage, token]);


  // const generatePdf = () => {
  //   const doc = new jsPDF('landscape');
  //   const headers = [
  //     ['Flag', 'ID Project', 'Marketing Name',
  //       'Project Code', 'Status Approval', 'klpd',
  //       'location name', 'pagu', 'Procurement Type',
  //       'Sub Dis Name', 'Type Item', 'Progress'
  //     ]
  //   ];
  //   const rows = listDataProject.map(row => [
  //     row.flag,
  //     row.id_project,
  //     row.marketing_name,
  //     row.project_code,
  //     row.status_approval,
  //     row.klpd,
  //     row.location_name,
  //     row.pagu,
  //     row.procurement_type,
  //     row.sub_dis_name,
  //     row.type_item,
  //     row.progress_description
  //   ]);

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const columnWidth = pageWidth / headers[0].length;

  //   doc.autoTable({
  //     startY: 20,
  //     head: headers,
  //     body: rows,
  //     theme: 'grid',
  //     columnStyles: { 0: { cellWidth: columnWidth } },
  //   });

  //   // Simpan atau tampilkan PDF (tergantung pada kebutuhan)
  //   doc.save('project_data.pdf');
  // };

  const downloadReport = (report) => {
    generatePdf(report);
  }

  const downloadAllReport = () => {
    generatePdf(listDataProject);
  }

  return (
    <div className="mx-7 py-3">

      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="text-base font-bold">Monitoring Project</div>
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
            {Role?.includes("Download All Report") && <div
              onClick={downloadAllReport}
              className="bg-white cursor-pointer px-4 py-2 rounded-full border border-[#5D5FEF] flex items-center gap-2"
            >
              <Image
                className=""
                src="/icon/downloadIcon.svg"
                alt="downloadIcon"
                width={20}
                height={20}
                priority
              />
              <div className="font-semibold text-base text-[#5D5FEF]"
              >Download Report</div>
            </div>}
          </div>
        </div>
        <TableMonitoringProject
          downloadReport={(e) => downloadReport(e)}
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
          Role={Role}
        />
      </div>
      {detailSirup && (
        <ModalDetailSirup
          isOpen={detailSirup}
          data={detailSirupData}
          onClose={() => setDetailSirup(false)}
        />
      )}
      <ModalDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        ConfirmOk={() => { deleteProject() }}
        title="Delete Project"
      />
    </div>
  );
}


function Loading() {
  return <h2>Loading...</h2>
}