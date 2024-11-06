"use client";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FetchData, GetAllMaster, GetAllProject } from "../../../../../config/Api/Api";
import ModalDetailSirup from "../../../../../components/Atoms/Modal/ModalDetailSirup";
import ModalDelete from "../../../../../components/Atoms/Modal/ModalDelete";
import TableMonitoringProject from "../../../../../components/Molecules/TableMonitoringProject";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSession } from "next-auth/react";
import { generatePdf } from "../../../../../utils/generatePdf";
import TableMaster from "../../../../../components/Molecules/TableMaster";
import Swal from "sweetalert2";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Master Procurement Type"]?.map((res) => res.event)

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const [idDelete, setIdDelete] = useState(null)
  const [flagDelete, setFlagDelete] = useState('')
  const [modalDelete, setModalDelete] = useState(false);
  const [listDataMaster, setListDataMaster] = useState([]);
  const [filter, setFilter] = useState('')

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

  let modalDeletes = (data) => {
    setIdDelete(data?.id_procurement_type)
    setModalDelete(true);
  };

  const getMaster = async () => {
    if (searchTerm == '') {
      ShowLoading();
    }
    let listMaster = await GetAllMaster({
      status: filter, // approve / not approve
      page: pageData,
      size: sizeData,
      searchWord: searchTerm,
    }, token, '/get-all-procurement-type');
    if ((listMaster.responseCode = 200)) {
      setListDataMaster(
        listMaster?.responseResult?.rows?.map((res) => ({
          ...res,
          checked: false,
        }))
      );
      if ((listMaster.responseCode = 200)) {
        let count = listMaster?.responseResult?.count;
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

  const addMaster = async (data) => {
    Swal.fire(
      {
        title: data?.id_procurement_type ? "Edit Data" : "Masukan Data",
        input: "text",
        inputValue: data?.type,
        focusConfirm: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: data?.id_procurement_type ? "Save Edit" : "Save",
        showLoaderOnConfirm: true,
        preConfirm: async (val) => {
          let body = {}
          if (data?.id_procurement_type) {
            body = {
              "id": data?.id_procurement_type,
              "type": val ? val : ''
            }
          } else {
            body = {
              "type": val ? val : ''
            }
          }
          await FetchData({
            methode: data?.id_procurement_type ? "put" : "post",
            url: data?.id_procurement_type ? "/edit-procurement-type" : "/add-procurement-type",
            data: body,
            token: token
          }).then((data) => {
            if (data.responseCode == 201) {
              Swal.fire({
                icon: "success",
                title: data?.msg,
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                setRefreshPage(!refreshPage);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: data?.data?.data?.msg,
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
  }

  let selectData = (index, e) => {
    let defaultValue = listDataMaster;
    defaultValue[index].checked = e;
    setListDataMaster(defaultValue);
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
    let dataNew = listDataMaster.map((val) => ({ ...val, checked: e }));
    setListDataMaster(dataNew);
    setCheckedAll(e);
    setCountChecked(dataNew.filter((res) => res.checked).length);
    setRefresh(!refresh);
  };

  let deleteMaster = async () => {
    await FetchData({
      methode: "delete",
      url: `/delete-procurement-type?id=${idDelete}`,
      token: token
    });
    setRefreshPage(!refreshPage);
    setModalDelete(false);
    setPageData(1)
  };

  useEffect(() => {
    if (token)
      getMaster();
  }, [pageData, searchTerm, sizeData, refreshPage, token]);

  return (
    <div className="mx-7 py-3">
      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="text-base font-bold">Master Keyword</div>
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
            {Role?.includes('Create') && <div
              onClick={() => addMaster()}
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
            </div>}
          </div>
        </div>
        <TableMaster
          columName="Jenis Pengadaan"
          objectKey="type"
          modalDeletes={modalDeletes}
          listData={listDataMaster}
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
          modalEdit={(e) => addMaster(e)}
        />
      </div>
      <ModalDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        ConfirmOk={() => { deleteMaster() }}
        title="Hapus Jenis Pengadaan"
      />
    </div>
  );
}


function Loading() {
  return <h2>Loading...</h2>
}