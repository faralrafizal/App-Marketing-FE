"use client";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FetchData, GetAllMaster, GetAllProject } from "../../../../../config/Api/Api";
import ModalDetailSirup from "../../../../../components/Atoms/Modal/ModalDetailSirup";
import ModalDelete from "../../../../../components/Atoms/Modal/ModalDelete";
import ModalAddLocation from "../../../../../components/Atoms/Modal/ModalAddLocation";
import TableMonitoringProject from "../../../../../components/Molecules/TableMonitoringProject";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSession } from "next-auth/react";
import { generatePdf } from "../../../../../utils/generatePdf";
import TableMaster from "../../../../../components/Molecules/TableMaster";
import TableMasterLocation from "../../../../../components/Molecules/TableMasterLocation";
import ModalAddMaster from "../../../../../components/Atoms/Modal/ModalAddLocation";
import Swal from "sweetalert2";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Master Location"]?.map((res) => res.event)

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const [idDelete, setIdDelete] = useState(null)
  const [flagDelete, setFlagDelete] = useState('')
  const [modalDelete, setModalDelete] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [listDataMaster, setListDataMaster] = useState([]);
  const [filter, setFilter] = useState('')
  const [editIdLoc, setEditIdLoc] = useState(null)
  const [listProvince, setListProvince] = useState([])

  const [dataProvince, setDataProvince] = useState(
    {
      "value": null,
      "label": "Pilih Provinsi"
    });
  const [dataCity, setDataCity] = useState('')

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

  let DetailData = (val) => {
    setDetailSirupData(val);
    setDetailSirup(true);
  };

  let modalDeletes = (data) => {
    setIdDelete(data?.id_location)
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
    }, token, '/get-all-location-city');
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

  const openModalAdd = async (data) => {
    let province = await FetchData({
      methode: "post",
      url: "/get-all-province",
      token: token
    });

    province = province?.responseResult?.rows.map(prov => ({
      value: prov.id_province,
      label: prov.province_name,
    }));
    if (data) {
      setDataCity(data?.location_name)
      setDataProvince(province?.find(res => res.value == data?.id_province))
      setEditIdLoc(data?.id_location)
    }
    setModalAdd(!modalAdd)
    setListProvince(province)

  }


  let deleteCity = async () => {
    await FetchData({
      methode: "delete",
      url: `/delete-location?id=${idDelete}`,
      token: token
    });
    setRefreshPage(!refreshPage);
    setModalDelete(false);
    setPageData(1)
    setDataProvince({
      "value": null,
      "label": "Pilih Provinsi"
    })
  };

  let saveLocation = async () => {
    let res;
    if (editIdLoc) {
      res = await FetchData({
        methode: "Put",
        url: "/edit-location",
        data: {
          "id": editIdLoc,
          "id_prov": dataProvince?.value,
          "loc": dataCity
        },
        token: token
      });
    } else {
      res = await FetchData({
        methode: "Post",
        url: "/add-location",
        data: {
          "id_prov": dataProvince?.value,
          "loc": dataCity
        },
        token: token
      });
    }

    Swal.fire({
      icon: res?.code == 1 ? "success" : "error",
      title: res?.msg ? res?.msg : res?.data?.data?.msg,
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      setRefreshPage(!refreshPage);
    });

    setModalAdd(!modalAdd);
    setPageData(1)
    setDataProvince({
      "value": null,
      "label": "Pilih Provinsi"
    })
    setDataCity("")
    setEditIdLoc(null)
  }

  useEffect(() => {
    if (token)
      getMaster();
  }, [pageData, searchTerm, sizeData, refreshPage, token]);

  return (
    <div className="mx-7 py-3">
      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="text-base font-bold">Master Lokasi</div>
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
              onClick={openModalAdd}
              className="bg-[#5D5FEF] cursor-pointer px-4 py-2 rounded-full flex items-center gap-2"
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
        <TableMasterLocation
          modalDeletes={modalDeletes}
          DetailData={DetailData}
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
          modalEdit={(e) => openModalAdd(e)}
        />
      </div>
      <ModalDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        ConfirmOk={() => { deleteCity() }}
        title="Hapus Lokasi"
      />
      <ModalAddMaster
        isOpen={modalAdd}
        selectedProvince={dataProvince}
        setOptionProvince={(e) => { setDataProvince(e) }}
        option={listProvince}
        dataCity={dataCity}
        setDataCity={(e) => { setDataCity(e) }}
        onClose={() => {
          setModalAdd(false);
          setEditIdLoc(null);
          setDataProvince({
            "value": null,
            "label": "Pilih Provinsi"
          })
        }}
        ConfirmOk={() => { saveLocation() }}
        title={editIdLoc ? "Edit Data" : "Masukan Data"}
      />
    </div>
  );
}


function Loading() {
  return <h2>Loading...</h2>
}