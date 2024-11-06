"use client";
import { Field } from "../../../../../../../../components";
import MultipleSelect from "../../../../../../../../components/Atoms/SelectInput";
import { Fetch, FetchData } from "../../../../../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InputDate from "../../../../../../../../components/Atoms/Input/inputDate";
import { ShowLoading, SwalClose } from "../../../../../../../../utils/loading";
import { useSession } from "next-auth/react";
import { formatRupiah } from "../../../../../../../../utils/formateRupiah";
import { validateData, checkValidation } from "../../../../../../../../utils/validation";
import Swal from "sweetalert2";
import SearchSelect from "../../../../../../../../components/Atoms/SearchSelect";
import { formatDate, formatDateNew } from "../../../../../../../../utils/formateDate";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const { id, flag, projectCode } = useParams();
  const router = useRouter();
  const [dataProject, setDataProject] = useState({});
  const [selectedOptionErr, setSelectedOptionErr] = useState(false);
  const [listProcurement, setListProcutement] = useState([]);
  const [listMarketing, setListMarketing] = useState([]);
  const [listStatus, setListStatus] = useState([])
  const [updateUrl, setUpdateUrl] = useState('');
  const [listLocation, setListLocation] = useState([]);
  const [listSubDis, setListSubDis] = useState([]);
  const [listKeyWord, setListKeyWord] = useState([]);
  const [validation, setValidation] = useState({});
  const [sourceDoc, setSourceDoc] = useState([
    { "dokumen": "Sirup" },
    { "dokumen": 'Non-Sirup' }
  ])
  const listCompany = [
    { "title": "select" },
    { "title": "CMC" },
    { "title": "ARVIRO" },
    { "title": "UEP" },
  ];

  const listProgres = [
    { "label": "25%", "value": "1" },
    { "label": "50%", "value": "2" },
    { "label": "75%", "value": "3" },
    { "label": "100%", "value": "4" },
    { "label": "Contract", "value": "5" },
  ]

  let GetList = () => {
    Fetch({
      method: "POST",
      url: '/get-all-procurement-type',
      data: {
        "page": 1,
        "size": 100
      },
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult.rows;
        setListProcutement(data)
      })

    Fetch({
      method: "POST",
      url: '/get-all-keyword',
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_keyword,
          label: location.keyword,
        }));
        setListKeyWord(transformedData)
      })

    Fetch({
      method: "POST",
      url: '/get-all-marketing',
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_profile,
          label: location.employee_name,
        }));
        setListMarketing(transformedData)
      })

    Fetch({
      method: "POST",
      url: '/get-all-location-city',
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_location,
          label: location.location_name,
        }));
        setListLocation(transformedData)
      })

    Fetch({
      method: "POST",
      url: '/get-all-subdis',
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult.rows;
        setListSubDis(data)
      })

    FetchData({
      methode: "GET",
      url: `/check-project?status=${flag}&project=${projectCode}`,
      token: token
    })
      .then((res) => {
        setUpdateUrl(res.responseResult.url);
      })
  }

  let GetDataProject = () => {
    Fetch({
      method: "POST",
      url: '/get-one-project',
      data: {
        "status": flag,
        "id_project": id,
      },
      token: token
    })
      .then((res) => {
        let data = res.data?.responseResult;
        console.log(flag);
        if (flag == 'temp') {
          setListStatus([
            { "value": "1", "status": "Draft" }
          ])
        } else {
          setListStatus([
            { "value": "1", "status": "Approved" },
            { "value": "2", "status": "Not Approve" }
          ])
        }

        setDataProject(data);
      })
  }

  let saveData = (e) => {
    e?.preventDefault();
    console.log(updateUrl, "updateUrl============================00000000000000")
    ShowLoading()
    let payload

    if (flag == 'temp') {
      payload = {
        "data": {
          "id_marketing": dataProject.id_marketing,
          "project_code": dataProject.project_code,
          "project_data_source": dataProject.source_document,
          "approved_by": dataProject.approved_by,
          "approved_date": dataProject.approved_date,
          "id_keyword": dataProject.id_keyword,
          "input_date": formatDateNew(dataProject.input_date, 'YYYY-MM-DD/numeric'),
          "package": dataProject.package,
          "id_procurement_type": dataProject.id_procurement_type,
          "method": dataProject.method,
          "choose_date": formatDateNew(dataProject?.choose_date, 'YYYY-MM-DD/numeric'),
          "work_unit": dataProject.work_unit,
          "id_location": dataProject.id_location,
          "fund_source": dataProject.fund_source,
          "klpd": dataProject.klpd,
          "filename": dataProject.filename,
          "unit_value": dataProject.unit_value,
          "type_item": dataProject.type_item,
          "unit_set": dataProject.unit_set,
          "url": dataProject.url,
          "sub_dis": dataProject.sub_dis_name,
          "coordinator": dataProject.coordinator,
          "company": dataProject.company,
          "id_progress": dataProject.id_status | 0,
          "source_document": dataProject.source_document,
          "id_progress": dataProject.id_status,
          "pagu": +dataProject.pagu.toString().replace(/[.,]/g, ''),
          "contract_value": +dataProject.contract_value?.toString().replace(/[.,]/g, ''),
        }
      }
      // "id_sub_dis": dataProject.id_sub_dis ? dataProject.id_sub_dis : null ,
    } else {
      payload = {
        "data": {
          "id_marketing": dataProject.id_marketing,
          "project_code": dataProject.project_code,
          "id_location": dataProject.id_location,
          "sub_dis": dataProject.sub_dis_name ? dataProject.sub_dis_name : null,
          "coordinator": dataProject.coordinator,
          "contract_value": dataProject.contract_value,
          "company": dataProject.company,
        }
      }
    }

    let validationData = {
      "data": {
        "pagu": dataProject.pagu ? +dataProject.pagu?.toString().replace(/[.,]/g, '') : '',
        "id_keyword": dataProject.id_keyword || '',
        "input_date": dataProject.input_date || '',
        "package": dataProject.package || '',
        "id_procurement_type": dataProject.id_procurement_type || '',
        "method": dataProject.method || '',
        "choose_date": dataProject.choose_date || '',
        "klpd": dataProject.klpd || '',
        "project_code": dataProject.project_code || '',
        "work_unit": dataProject.work_unit || '',
        "id_location": dataProject.id_location || '',
        "fund_source": dataProject.fund_source || '',
      }
    };

    setValidation(validateData(validationData?.data));

    let validate = validateData(validationData?.data)
    if (checkValidation(validate)) {
      return Swal.fire({
        icon: "error",
        title: "Data Belum Lengkap",
        text: "Silakan melengkapi data yang masih kosong.",
      });
    }

    console.log(updateUrl, "updateUrl========ttttttt====================00000000000000")
    Fetch({
      method: 'PUT',
      url: updateUrl + id,
      data: payload,
      token: token
    })
      .then((res) => {
        router.push("/main/master/project")
      })
      .catch((err) => {
        return Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan data",
          text: "Silakan periksa data kembali.",
        });
      })

    SwalClose()
  }

  const handleChange = (e, f) => {
    let value = e
    let name = f

    if (e.target) {
      value = e.target.value
      name = e.target.name
    }

    setDataProject(prev => ({ ...prev, [name]: value }));
  };

  console.log(dataProject);


  useEffect(() => {
    GetList();
    GetDataProject();
  }, []);
  return (
    <div className="mx-7 py-3">
      <div className="bg-white text-black rounded-xl mb-10">
        <div className="text-base font-bold border-b flex items-center gap-3 p-5 ">
          <a href={"/main/master/project"}>
            {""}
            <Image
              className=""
              src="/icon/arrow-left.svg"
              alt="Next.js Logo"
              width={20}
              height={20}
              priority
            />
          </a>
          <div>Update Project</div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <MultipleSelect
              label="Perusahaan"
              selectedOption={{ "title": dataProject.company }}
              name="company"
              title="title"
              options={listCompany}
              valueOption={(e) => setDataProject({ ...dataProject, "company": e.title })}
              Err={selectedOptionErr}
              not={-1}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Kode Project"
              id="kodeProject"
              name="project_code"
              type="text"
              value={dataProject.project_code}
              placeholder="Input Kode Project"
              className="!h-11"
              err={!validation.project_code}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Kata Kunci"
              selectedOption={{ "id_keyword": dataProject.id_keyword, "keyword": dataProject.keyword }}
              title="keyword"
              options={listKeyWord}
              valueOption={(e) => setDataProject({ ...dataProject, "id_keyword": e.id_keyword, "keyword": e.keyword })}
              Err={!validation.id_keyword}
              not={-1}
            /> */}
            <SearchSelect
              title={"Kata Kunci"}
              selectedData={{ "value": dataProject.id_keyword, "label": dataProject.keyword }}
              listData={listKeyWord}
              onChange={(e) => setDataProject({ ...dataProject, "id_keyword": e.value, "keyword": e.label })}
              Err={!validation?.id_keyword}
            />
          </div>
          <div className="flex-1">
            <InputDate
              selected={dataProject.input_date}
              name="input_date"
              placeholderText="Input Date"
              onChange={handleChange}
              label="Tgl Input"
              err={!validation.input_date}
              className="!h-11"
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Paket"
              id="paket"
              name="package"
              value={dataProject.package}
              type="text"
              err={!validation.package}
              onChange={handleChange}
              placeholder="Input Paket"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <MultipleSelect
              label="Sumber Dokumen"
              selectedOption={{ "dokumen": dataProject.source_document }}
              title="dokumen"
              options={sourceDoc}
              valueOption={(e) => setDataProject({ ...dataProject, "source_document": e.dokumen })}
              Err={selectedOptionErr}
              not={-1}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Pagu"
              id="pagu"
              name="pagu"
              value={formatRupiah(dataProject.pagu)}
              type="text"
              err={!validation?.pagu}
              placeholder="Input Pagu"
              className="!h-11"
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <MultipleSelect
              label="Jenis Pengadaan"
              selectedOption={{ "id_procurement_type": dataProject.id_procurement_type, "type": dataProject.procurement_type }}
              title="type"
              options={listProcurement}
              valueOption={(e) => setDataProject({ ...dataProject, "id_procurement_type": e.id_procurement_type, "type": e.type })}
              Err={!validation.id_procurement_type}
              not={-1}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Metode"
              id="metode"
              name="method"
              value={dataProject.method}
              type="text"
              placeholder="Input Metode"
              className="!h-11"
              err={!validation.method}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <InputDate
              selected={dataProject.choose_date}
              name="choose_date"
              placeholderText=""
              onChange={handleChange}
              label="Pemilihan"
              err={!validation.choose_date}
              className="!h-11"
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="K/L/PD"
              id="klpd"
              value={dataProject.klpd}
              name="klpd"
              type="text"
              err={!validation.klpd}
              placeholder="K/L/PD"
              className="!h-11"
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Satuan Kerja"
              id="satuanKerja"
              name="work_unit"
              value={dataProject.work_unit}
              type="text"
              err={!validation.work_unit}
              placeholder="Input Satuan Kerja"
              className="!h-11"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Lokasi"
              selectedOption={{ "id_location": dataProject.id_location, "location_name": dataProject.location_name }}
              title="location_name"
              name="id_location"
              options={listLocation}
              valueOption={(e) => setDataProject({ ...dataProject, "id_location": e.id_location, "location_name": e.location_name })}
              Err={!validation.id_location}
              not={-1}
            /> */}
            <SearchSelect
              title={"Lokasi"}
              selectedData={{ "value": dataProject.id_location, "label": dataProject.location_name }}
              listData={listLocation}
              onChange={(e) => setDataProject({ ...dataProject, "id_location": e.value, "location_name": e.label })}
              Err={!validation?.id_location}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Sumber Dana"
              id="sumberDana"
              name="fund_source"
              value={dataProject.fund_source}
              type="text"
              placeholder="Input Sumber Dana"
              className="!h-11"
              err={!validation.fund_source}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Contract Value"
              value={formatRupiah(dataProject.contract_value)}
              disabled={dataProject?.id_status == 6 ? true : false}
              id="contract_value"
              name="contract_value"
              type="text"
              onChange={handleChange}
              placeholder="Input Contract Value"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <MultipleSelect
              label="Status Progress"
              selectedOption={{ label: dataProject.progress_description, value: dataProject.id_status }}
              disabled={true}
              title="label"
              options={listProgres}
              valueOption={(e) => setDataProject({ ...dataProject, progress_description: e.label, id_status: e.value })}
              Err={selectedOptionErr}
              not={-1}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Type Item"
              id="type_item"
              value={dataProject.type_item}
              name="type_item"
              type="text"
              onChange={handleChange}
              placeholder="Input Type Item"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <Field
              label="Unit Value"
              id="unit_value"
              value={dataProject.unit_value}
              name="unit_value"
              type="number"
              onChange={handleChange}
              placeholder="Input Unit value"
              className="!h-11"
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Coordinator"
              selectedOption={{ "coordinator": dataProject.coordinator, "employee_name": dataProject.coordinator_name }}
              title="employee_name"
              options={listMarketing}
              valueOption={(e) => setDataProject({ ...dataProject, "coordinator": e.id_profile, "coordinator_name": e.employee_name })}
              Err={selectedOptionErr}
              not={-1}
            /> */}
            <SearchSelect
              title={"Coordinator"}
              selectedData={{ "value": dataProject.coordinator, "label": dataProject.coordinator_name }}
              listData={listMarketing}
              onChange={(e) => setDataProject({ ...dataProject, "coordinator": e.value, "coordinator_name": e.label })}
            />
          </div>
          <div className="flex-1">
            {/* <MultipleSelect
              label="Marketing"
              selectedOption={{ "id_marketing": dataProject.id_marketing, "employee_name": dataProject.marketing_name }}
              title="employee_name"
              options={listMarketing}
              valueOption={(e) => setDataProject({ ...dataProject, "id_marketing": e.id_profile, "marketing_name": e.employee_name })}
              Err={selectedOptionErr}
              not={-1}
            /> */}
            <SearchSelect
              title={"Marketing"}
              selectedData={{ "value": dataProject.id_marketing, "label": dataProject.marketing_name }}
              listData={listMarketing}
              onChange={(e) => setDataProject({ ...dataProject, "id_marketing": e.value, "marketing_name": e.label })}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Sub Dis"
              selectedOption={{ "sub_dis_name": dataProject.sub_dis_name, "id_sub_dis": dataProject.sub_dis_name }}
              title="sub_dis_name"
              options={listSubDis}
              valueOption={(e) => setDataProject({ ...dataProject, "sub_dis_name": e.sub_dis_name, "id_sub_dis": e.id_sub_dis })}
              Err={selectedOptionErr}
              not={-1}
            /> */}
            <Field
              label="Sub Dis"
              id="sub_dis"
              name="sub_dis"
              value={dataProject.sub_dis_name}
              type="text"
              placeholder="Input Sub Dis"
              className="!h-11"
              onChange={(e) => setDataProject({ ...dataProject, "sub_dis_name": e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Unit Set"
              id="unit_set"
              name="unit_set"
              value={dataProject.unit_set}
              type="number"
              placeholder="Input Unit Set"
              className="!h-11"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end p-5">
        <button
          onClick={() => saveData()}
          className="bg-[#5D5FEF] px-5 py-2 !rounded-full mr-4"
        >
          <p className="text-white text-sm">Save</p>
        </button>
      </div>
    </div>
  );
}
