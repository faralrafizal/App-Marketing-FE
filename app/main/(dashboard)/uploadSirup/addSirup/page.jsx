// components/ExcelReader.js
"use client";
import ModalDelete from "../../../../../components/Atoms/Modal/ModalDelete";
import ModalDetailSirup from "../../../../../components/Atoms/Modal/ModalDetailSirup";
import TabelSirupEditable from "../../../../../components/Molecules/tabelSirup/TabelSirupEditable";
import {
  DownloadTemplate,
  Fetch,
  FetchData,
  cekProjectCode,
  getAllKeyword,
  getAllLocation,
  getAllProcurement,
  getAllStatus,
  getOneStructureOrgan,
  locationWork,
} from "../../../../../config/Api/Api";
import { formateDateKhusus } from "../../../../../utils/formateDate";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import Dropzone from "dropzone";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";
import { Button } from "../../../../../components";
import { useSession } from "next-auth/react";

Dropzone.autoDiscover = false;

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Sirup"]?.map((res) => res.event)
  const router = useRouter();
  const [excelData, setExcelData] = useState([]);
  const [uploadFile, setUploadFile] = useState([]);
  const [detailSirup, setDetailSirup] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [checkedAll, setCheckedAll] = useState(false);
  const [dataMaster, setDataMaster] = useState([]);

  const handleFileUpload = async (e) => {
    ShowLoading();
    try {
      const file = e;
      setUploadFile(e);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        var listProjectCode = [];
        extrakData(jsonData)
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }

  };

  const extrakData = async (value) => {
    try {
      const header = [
        "Kata Kunci",
        "Tgl Input",
        "Perusahaan",
        "Paket",
        "Pagu (Rp)",
        "Jenis Pengadaan",
        "Jenis Barang",
        "Unit/Set",
        "Nilai Satuan",
        "Metode",
        "Pemilihan",
        "K/L/PD",
        "Satuan Kerja",
        "Lokasi",
        "ID",
        "Sumber Dana",
        "MARKETING",
        "Progress"
      ];

      const urutanObject = {};

      header.map((res) => {
        let data = value[0]?.findIndex((res2) => res2.toLowerCase() === res.toLowerCase());
        urutanObject[res] = data;
      });
      value.shift()

      let listProjectCode = []

      let sheet = value.map((res, key) => {
        if (!res[urutanObject["ID"]]) {
          throw new Error(`ID tidak ditemukan di row  ${key + 1} `);
        }
        listProjectCode.push(`${res[urutanObject["ID"]]}`)
        let dataLokasi = filterData("location", "location_name", res[urutanObject["Lokasi"]])[0]
        let marketing = sortByStatus(filterData('locationWork', "id_location", dataLokasi?.id_location))[0]
        return {
          checked: false,
          id_keyword: filterData("keyword", "keyword", res[urutanObject["Kata Kunci"]])[0] || res[urutanObject["Kata Kunci"]],
          input_date: formateDateKhusus(res[urutanObject["Tgl Input"]]),
          company: res[urutanObject["Perusahaan"]],
          package: res[urutanObject["Paket"]],
          pagu: res[urutanObject["Pagu (Rp)"]],
          type_item: filterData("procurement", "type", res[urutanObject["Jenis Pengadaan"]])[0] || res[urutanObject["Jenis Pengadaan"]],
          jenis_barang: res[urutanObject["Jenis Barang"]],
          unit_set: res[urutanObject["Unit/Set"]],
          unit_value: res[urutanObject["Nilai Satuan"]],
          method: res[urutanObject["Metode"]],
          choose_date: formateDateKhusus(res[urutanObject["Pemilihan"]]),
          klpd: res[urutanObject["K/L/PD"]],
          work_unit: res[urutanObject["Satuan Kerja"]],
          location_name: dataLokasi || res[urutanObject["Lokasi"]],
          project_code: res[urutanObject["ID"]],
          fund_source: res[urutanObject["Sumber Dana"]],
          marketing: marketing,
          kordinator: {},
          progres: res[urutanObject["Progress"]] ? res[urutanObject["Progress"]] : 0,
          url: "",
        };
      })

      let result = await cekProjectCode({ projectCode: listProjectCode }, token);

      const filter = (i) => {
        if (result.responseResult.length) {
          let data = result.responseResult.find((val) => val?.project_code == i);
          if (data) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }

      let datanew = sheet.map((res, i) => {
        if (filter(res.project_code)) {
          return { ...res, exist: true };
        } else {
          return { ...res, exist: false };
        }
      });
      SwalClose();
      setExcelData(datanew);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }

  }

  const onDrop = (acceptedFiles) => {
    handleFileUpload(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".xlsx",
    multiple: false,
  });




  const getListMarketing = async (search) => {
    ShowLoading();
    try {
      let dataMaster = {
        marketing: [],
        location: [],
        locationWork: [],
        procurement: [],
        keyword: [],
      };

      // Use Promise.all to make concurrent requests
      const [locationData, procurementData, keywordData, statusData, location] = await Promise.all([
        getAllLocation(token),
        getAllProcurement(token),
        getAllKeyword(token),
        getAllStatus(token),
        locationWork(token)
      ]);

      // Handle marketing data
      if (location.status == 200) {
        dataMaster.locationWork = location.responseResult
      }

      // Handle location data
      if (locationData.status == 200) {
        dataMaster.location = locationData.responseResult.rows;
      }

      // Handle procurement data
      if (procurementData.status == 200) {
        dataMaster.procurement = procurementData.responseResult?.rows;
      }

      // Handle keyword data
      if (keywordData.status == 200) {
        dataMaster.keyword = keywordData.responseResult?.rows;
      }

      // Handle status data
      if (statusData.status == 200) {
        dataMaster.status = statusData.responseResult?.rows;
      }

      setDataMaster(dataMaster);
      SwalClose();
    } catch (error) {
      console.log("error", error);
      SwalClose();
    }
  };


  useEffect(() => {
    if (token) {
      getListMarketing();
    }
  }, [token]);

  let NavigateEdit = () => { };

  let DetailData = () => {
    setDetailSirup(true);
  };

  let filterData = (datalist, key, value) => {
    if (key && value) {
      return dataMaster[datalist]?.filter((res) => res[key] == value);
    } else {
      return dataMaster[datalist];
    }
  };

  let modalDeletes = () => {
    setModalDelete(true);
  };

  const sortByStatus = (list, key) =>
    list?.sort((a, b) => {
      const getStatusOrder = (value) => (value === 'Y' ? -1 : value === 'N' ? 1 : 0);

      const statusA = a[key] !== null ? getStatusOrder(a[key]) : 0;
      const statusB = b[key] !== null ? getStatusOrder(b[key]) : 0;

      return statusA - statusB;
    });




  const onchangeDate = useCallback((index, key, e) => {
    let data = excelData;
    if (key == "checked") {
      if (
        !data[index]["project_code"] ||
        !data[index]?.id_keyword ||
        !data[index]?.input_date ||
        !(+data[index]?.pagu?.toString().replace(/,/g, "") > 0) ||
        !data[index]?.type_item?.id_procurement_type ||
        !data[index]?.method ||
        !data[index]?.choose_date ||
        !data[index]?.work_unit ||
        !data[index]?.location_name?.id_location ||
        !data[index]?.fund_source
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lengkapi terlebih dahulu!",
        });
      } else {
        data[index][key] = e;
      }
    } else {
      if (key == "project_code") {
        if (!e) data[index]["checked"] = false;
      }
      data[index][key] = e;
    }
    setExcelData(data);
    let checkall = data.every((val) => val?.checked);
    if (checkall) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
    setRefresh(!refresh);
  }, [excelData, setExcelData, setCheckedAll, refresh]);

  let onCheckAll = (e) => {
    try {
      let updatedData = excelData.map((res) => {
        if (
          !res.project_code ||
          !res.id_keyword ||
          !res.input_date ||
          !(+res?.pagu?.toString().replace(/,/g, "") > 0) ||
          !res.type_item?.id_procurement_type ||
          !res.method ||
          !res.choose_date ||
          !res.work_unit ||
          !res.location_name?.id_location ||
          !res.fund_source
        ) {
          throw new Error("Lengkapi terlebih dahulu!");
        } else {
          return {
            ...res,
            checked: res.id_keyword?.id_keyword ? e : false,
          };
        }
      });

      setCheckedAll(e);
      setExcelData(updatedData);
      setRefresh((prevRefresh) => !prevRefresh);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };


  let saveData = async () => {
    ShowLoading();
    const data = excelData
      .filter((val) => val.checked)
      .map((val) => ({
        id_marketing: +val?.marketing?.id_marketing || null,
        project_code: `${val?.project_code}`,
        project_data_source: 1,
        status_approval: null,
        id_keyword: val?.id_keyword?.id_keyword,
        input_date: val?.input_date,
        package: val?.package,
        url: val?.url,
        pagu: (typeof val?.pagu == "string" ? parseInt(val?.pagu?.toString().replace(/,/g, ''), 10) : val?.pagu),
        id_procurement_type: val?.type_item?.id_procurement_type,
        method: val?.method,
        choose_date: val?.choose_date,
        klpd: val?.klpd,
        work_unit: val?.work_unit,
        id_location: val?.location_name?.id_location,
        fund_source: val?.fund_source,
        filename: "PROJ0003_02.pdf",
        id_sub_dis: null,
        unit_value: val?.unit_value,
        type_item: val?.jenis_barang,
        unit_set: val?.unit_set,
        coordinator: val?.marketing?.id_coordinator || null,
        company: val?.company?.title,
        source_document: "Sirup",
        id_progress: dataMaster.status.find(
          (res) => +res.value == +val?.progres
        )?.id_status ? dataMaster.status.find(
          (res) => +res.value == +val?.progres
        )?.id_status : +val?.progres,
      }));

    let body = {
      data: {
        project_code: data.map((val) => `${val.project_code}`),
        data: data,
      },
    };

    if (data.length < 1) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Data yang Ingin Diunggah",
        text: "Pastikan untuk memberi tanda centang pada data yang perlu diunggah.",
      });
      return false;
    }
    await Fetch({
      method: "POST",
      url: "/add-projects",
      data: body,
      token
    })
      .then((res) => {
        SwalClose();
        setExcelData(excelData.filter(item => !body?.data?.project_code?.includes(`${item.project_code}`)))
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "Data berhasil Disimpan",
          showConfirmButton: false,
          timer: 1500
        });

        // router.push("/main/master/project");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Gagal Tambah Data",
          text: "Tambah Data Sirup Gagal, Silahkan Coba Lagi",
        });
        SwalClose();
        console.log(err.response);
      });
  };

  let downloadTemplate = () => {
    DownloadTemplate()
  }

  return (
    <div className="mx-7 py-3 text-black">
      <div className="bg-white block p-3 rounded-lg  mt-2 mb-4 ">
        <div className="flex items-center justify-end gap-4 border-b">
          <div className="flex items-center justify-center">
            <div className="text-base font-bold gap-3">
              <a
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
              </a>
            </div>
          </div>
          {Role?.includes("Download Template") && <div className="flex justify-center items-center">
            <Button
              onClick={downloadTemplate}
              className={"border-[#5d5fef]"}
              title={"Download Template"}
            />
          </div>}
        </div>
        <div className="p-5">
          <div className="text-sm font-semibold">Upload Data</div>
          <div
            {...getRootProps()}
            class="flex items-center justify-center w-full my-5"
          >
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-52 border-2 border-[#5D5FEF] border-dashed rounded-lg cursor-pointer bg-[#acaeff3a] "
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.14 10.5967H12.75V16.0767C12.75 16.4867 12.41 16.8267 12 16.8267C11.59 16.8267 11.25 16.4867 11.25 16.0767V10.5967H2.86C2.38 10.5967 2 10.9767 2 11.4567C2 17.3467 6.11 21.4567 12 21.4567C17.89 21.4567 22 17.3467 22 11.4567C22 10.9767 21.62 10.5967 21.14 10.5967Z"
                    fill="#5D5FEF"
                  />
                  <path
                    d="M12.7499 6.49665L14.3099 8.05665C14.5999 8.34665 15.0799 8.34665 15.3699 8.05665C15.6599 7.76665 15.6599 7.28665 15.3699 6.99665L12.5199 4.15665C12.2299 3.86665 11.7499 3.86665 11.4599 4.15665L8.6199 7.00665C8.4799 7.15665 8.3999 7.34665 8.3999 7.53665C8.3999 7.72665 8.4699 7.91665 8.6199 8.06665C8.9099 8.35665 9.3899 8.35665 9.6799 8.06665L11.2399 6.50665V10.5966H12.7399V6.49665H12.7499Z"
                    fill="#5D5FEF"
                  />
                </svg>

                <p class="mb-2 text-base font-semibold text-black ">
                  Drag & Drop or{" "}
                  <span class="font-semibold text-[#5d5fef]">Choose File</span>{" "}
                  to Upload Click to upload
                </p>
                <p class="text-xs font-medium text-gray-500 ">
                  Supported formats: XLS, XLSX
                </p>
              </div>
              <input type="file" accept=".xlsx" {...getInputProps()} />
            </label>
          </div>
          {uploadFile?.name ? (
            <div>
              <div className="border-2 rounded-lg p-4 flex items-center justify-between">
                <div className=" flex items-center gap-5">
                  <Image
                    className=""
                    src="/icon/excel.svg"
                    alt="Next.js Logo"
                    width={30}
                    height={30}
                    priority
                  />
                  <div>
                    <div className="text-sm font-semibold">
                      {uploadFile?.name}
                    </div>
                    <div className="text-xs font-medium text-[#7D7D7D]">
                      {Math.floor(uploadFile?.size / 1024)} MB
                    </div>
                  </div>
                </div>
                <div onClick={() => { setUploadFile([]), setExcelData([]) }}>
                  <span className="font-semibold cursor-pointer select-none text-black pb-[1px] px-[6px] bg-[#F5F6FB] rounded-full text-xl">
                    &times;
                  </span>
                </div>
              </div>

              <div className="text-center my-2">or</div>
              <div className="border rounded-full flex items-center justify-between">
                <label
                  for="dropzone-file"
                  class="flex  items-center w-full justify-between px-5 cursor-pointer "
                >
                  <div className="text-xs font-medium p-4 text-[#7D7D7D]">
                    Attachment File
                  </div>
                  <div className="px-3 py-[1px] rounded-full border border-[#5D5FEF] text-[#5D5FEF] text-base font-semibold">
                    Upload
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    class="hidden"
                    accept=".xlsx"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>

        {excelData?.length > 0 ? (
          <TabelSirupEditable
            classNameTable="!w-[160%]"
            modalDeletes={modalDeletes}
            DetailData={DetailData}
            NavigateEdit={NavigateEdit}
            listData={excelData}
            onchangeDate={onchangeDate}
            filterData={filterData}
            onCheckAll={onCheckAll}
            checkedAll={checkedAll}
            token={token}
            sortByStatus={sortByStatus}
          />
        ) : null}

        <div className="border-t py-5 flex justify-end h-[10vh] mt-8 items-center px-5">
          {excelData.find(e => e.checked) && (
            <div
              onClick={() => saveData()}
              className="bg-[#5D5FEF] px-7 cursor-pointer py-2 rounded-full flex items-center gap-2"
            >
              <div className="font-semibold text-base text-white">Save</div>
            </div>
          )}
        </div>

        {detailSirup && (
          <ModalDetailSirup
            isOpen={detailSirup}
            onClose={() => setDetailSirup(false)}
          />
        )}
        <ModalDelete
          isOpen={modalDelete}
          onClose={() => setModalDelete(false)}
          ConfirmOk={() => { }}
          title=" "
        />
      </div>
    </div>
  );
}
