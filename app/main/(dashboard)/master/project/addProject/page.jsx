"use client";
import { Button, Field } from "../../../../../../components";
import MultipleSelect from "../../../../../../components/Atoms/SelectInput";
import { FetchRoleLevel, Fetch } from "../../../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InputDate from "../../../../../../components/Atoms/Input/inputDate";
import {formatRupiah} from "../../../../../../utils/formateRupiah";
import Select from 'react-select';
import { ShowLoading, SwalClose } from "../../../../../../utils/loading";
import {useSession} from "next-auth/react";
import {validateData, checkValidation} from "../../../../../../utils/validation";
import Swal from "sweetalert2";
import { formatDate, formatDateNew } from "../../../../../../utils/formateDate";
import SearchSelect from "../../../../../../components/Atoms/SearchSelect";

export default function Page() {
  const userSession = useSession();
  const token = userSession?.data?.user?.responseResult?.token;
  const router = useRouter();
  const [projectCode, setProjectCode] = useState('');
  const [selectedKeyWord, setSelectedKeyword] = useState({ "id_keyword": null, "keyword": "selected" });
  const [inputDate, setInputDate] = useState(new Date());
  const [paket, setPaket] = useState('');
  const [pagu, setPagu] = useState(null);
  const [method, setMethod] = useState('');
  const [chooseDate, setChooseDate] = useState(new Date());
  const [klpd, setKlpd] = useState('');
  const [workUnit, setWorkUnit] = useState('');
  const [fundSource, setFundSource] = useState('');
  const [selectedDocSource, setSelectedDocSource] = useState({ "dokumen": "Selected" });
  const [selectedProcurement, setSelectedProcurement] = useState({ "value": "", "type": "Selected" });
  const [selectedMarketing, setSelectedMarketing] = useState({ "value": null, "employee_name": "Selected" });
  const [selectedStatus, setSelectedStatus] = useState({ "value": null, "status": "Selected" });
  const [selectedLocation, setSelectedLocation] = useState({ "value": null, "location_name": "Selected" });
  const [selectedSubDis, setSelectedSubDis] = useState({ "id_sub_dis": null, "sub_dis_name": "Selected" });
  const [selectedCompany, setSelectedCompany] = useState({ "title": "select" });
  const [statusProgress, setStatusProgress] = useState({ "label": "select", "id": "" });
  const [contractValue, setContractValue] = useState(null);
  const [typeItem, setTypeItem] = useState("");
  const [unitValue, setUnitValue] = useState(null);
  const [unitSet, setUnitSet] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState({ "id_profile": null, "employee_name": "Selected" });
  const [validation, setValidation] = useState({});
  const [subdis, setSubdis] = useState('');
  // const [coordinator, setCoordinator] = ("");

  const [selectedOption, setSelectedOption] = useState({
    value: "1",
    role_name: "Pekerjaan Kontruksi",
  });

  const listProgres = [
    { "label": "0%", "id": "6" },
    { "label": "25%", "id": "1" },
    { "label": "50%", "id": "2" },
    { "label": "75%", "id": "3" },
    { "label": "100%", "id": "4" },
    { "label": "Contract", "id": "5" },
  ]

  const [sourceDoc, setSourceDoc] = useState([
    { "dokumen": "Sirup" },
    { "dokumen": 'Non-Sirup' }
  ])
  const [selectedOptionErr, setSelectedOptionErr] = useState(false);
  const [listProcurement, setListProcutement] = useState([]);
  const [listMarketing, setListMarketing] = useState([]);
  const [listStatus, setListStatus] = useState([
    { "status": "Approved" },
    { "status": "Not Approve" },
    { "status": "Draft" },
  ]);
  const [listLocation, setListLocation] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [listSubDis, setListSubDis] = useState([]);
  const [listKeyWord, setListKeyWord] = useState([]);

  const listCompany = [
    { value: '', title: "select" },
    { value: '2', title: "CMC" },
    { value: '3', title: "ARVIRO" },
    { value: '4', title: "UEP" },
  ];

  let GetList = async () => {
     Fetch({
      method: "POST",
      url: '/get-all-procurement-type',
      data: {
        "page": 1,
        "size": 100
      }
    },
    token)
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_procurement_type, 
          label: location.type,
        }));
        setListProcutement(transformedData)
      })

    await Fetch({
      method: "POST",
      url: '/get-all-marketing',
    },
    token)
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_profile, 
          label: location.employee_name,
        }));
        setListMarketing(transformedData)
      })

    await Fetch({
      method: "POST",
      url: '/get-all-location-city',
    },token)
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((location) => ({
          value: location.id_location, 
          label: location.location_name,
        }));

        setLocationData(transformedData)
        setListLocation(res.data?.responseResult.rows)
      })

    // await Fetch({
    //   method: "POST",
    //   url: '/get-all-subdis',
    // },token)
    //   .then((res) => {
    //     let data = res.data?.responseResult.rows;
    //     setListSubDis(data)
    //   })

    Fetch({
      method: "POST",
      url: '/get-all-keyword',
    },token)
      .then((res) => {
        let data = res.data?.responseResult.rows;
        const transformedData = data?.map((e) => ({
          value: e.id_keyword, 
          label: e.keyword,
        }));

        setListKeyWord(transformedData)
      })
  }


  let saveData = async () => {
    let payload = {
      "data": {
        "project_code": [
          projectCode
        ],
        "data": [
          {
            "id_marketing": selectedMarketing.value,
            "project_code": projectCode,
            "project_data_source": selectedDocSource.dokumen,
            "id_keyword": selectedKeyWord.value,
            "input_date": formatDateNew(inputDate.toISOString(), "YYYY-MM-DD/numeric"),
            "package": paket,
            "pagu": pagu ? +pagu.toString().replace(/[.,]/g, '') : 0,
            "id_procurement_type": selectedProcurement.value,
            "method": method,
            "choose_date": formatDateNew(chooseDate.toISOString(), "YYYY-MM-DD/numeric"),
            "klpd": klpd,
            "work_unit": workUnit,
            "id_location": selectedLocation.value,
            "fund_source": fundSource,
            "sub_dis": subdis ? subdis : null,
            "company": selectedCompany.title,
            "source_document": selectedDocSource.dokumen,
            "filename": "-",
            "unit_value": unitValue ? unitValue : null,
            "type_item": typeItem,
            "unit_set": unitSet ? unitSet : null,
            "url": "-",
            "id_progress": statusProgress.id ? statusProgress.id : null,
            "contract_value": contractValue ? +contractValue.toString().replace(/[.,]/g, '') : 0,
            "coordinator": selectedCoordinator.value
          }
        ]
      }
    }

    // return console.log(payload);

    // console.log(chooseDate);
    // let dateee = chooseDate.toISOString()
    // console.log(dateee, "<<<,====== ini datee");
    // return console.log(payload);

    let validationData = {  
      "data" : {
        "pagu": pagu ? +pagu.toString().replace(/[.,]/g, '') : '',
        "id_keyword": selectedKeyWord.value || '',
        "input_date": inputDate.toDateString() || '',
        "package": paket || '',
        "id_procurement_type": selectedProcurement.value || '',
        "method": method || '',
        "choose_date": chooseDate.toDateString() || '',
        "klpd": klpd || '',
        "project_code": projectCode || '',
        "work_unit": workUnit || '',
        "id_location": selectedLocation.value || '',
        "fund_source": fundSource || '',
      }
    };

    setValidation(validateData(validationData?.data));

    let validate =  validateData(validationData?.data)
    if (checkValidation(validate)) {
      return Swal.fire({
        icon: "error",
        title: "Data Belum Lengkap",
        text: "Silakan melengkapi data yang masih kosong.",
      });
    }

    ShowLoading();
    let saving = await Fetch({
      method: 'POST',
      url: '/add-projects',
      data: payload
    },token)
      .then((res) => {
        SwalClose();
        router.push("/main/master/project")
      })
      .catch((err) => {
        console.log(err.response)
      })

      console.log(saving);

  }

  useEffect(() => {
    GetList();
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
          <div>Add Project</div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <MultipleSelect
              label="Perusahaan"
              selectedOption={selectedCompany}
              title="title"
              options={listCompany}
              valueOption={(e) => setSelectedCompany(e)}
              Err={selectedOptionErr}
              not={-1}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Kode Project"
              id="kodeProject"
              name="kodeProject"
              err={!validation?.project_code}
              type="text"
              placeholder="Input Kode Project"
              className="!h-11"
              onChange={(e) => setProjectCode(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Kata Kunci"
              selectedOption={selectedKeyWord}
              title="keyword"
              options={listKeyWord}
              valueOption={(e) => setSelectedKeyword(e)}
              Err={!validation?.id_keyword}
              not={-1}
            /> */}
            <SearchSelect
            title={"Kata Kunci"}
            selectedData={selectedKeyWord}
            listData={listKeyWord}
            onChange={(e) => {setSelectedKeyword(e)}}
            Err={!validation?.id_keyword}
            />
          </div>
          <div className="flex-1">
            <InputDate
              selected={inputDate}
              placeholderText="Input Date"
              onChange={(e) => setInputDate(e)}
              label="Tgl Input"
              className="!h-11"
              err={!validation.input_date}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Paket"
              id="paket"
              err={!validation?.package}
              name="paket"
              type="text"
              onChange={(e) => setPaket(e.target.value)}
              placeholder="Input Paket"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <MultipleSelect
              label="Sumber Dokumen"
              selectedOption={selectedDocSource}
              title="dokumen"
              options={sourceDoc}
              valueOption={(e) => setSelectedDocSource(e)}
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
              value={formatRupiah(pagu)}
              name="pagu"
              err={!validation?.pagu}
              type="text" 
              placeholder="Input Pagu"
              className="!h-11"
              onChange={(e) => setPagu(e.target.value)}
            />
          </div>
          <div className="flex-1">
            {/* <MultipleSelect
              label="Jenis Pengadaan"
              selectedOption={selectedProcurement}
              title="type"
              options={listProcurement}
              valueOption={(e) => setSelectedProcurement(e)}
              Err={!validation?.id_procurement_type}
              not={-1}
            /> */}
            <SearchSelect
            title={"Jenis Pengadaan"}
            selectedData={selectedProcurement}
            listData={listProcurement}
            onChange={(e) => {setSelectedProcurement(e)}}
            Err={!validation?.id_procurement_type}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Metode"
              id="metode"
              name="metode"
              err={!validation?.method}
              type="text"
              placeholder="Input Metode"
              className="!h-11"
              onChange={(e) => setMethod(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <InputDate
              selected={chooseDate}
              placeholderText="Input Input Satuan Kerja"
              onChange={(e) => setChooseDate(e.Date)}
              label="Pemilihan"
              className="!h-11"
              err={!validation.choose_date}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="K/L/PD"
              id="klpd"
              name="klpd"
              err={!validation?.klpd}
              type="text"
              placeholder="K/L/PD"
              className="!h-11"
              onChange={(e) => setKlpd(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Satuan Kerja"
              id="satuanKerja"
              name="satuanKerja"
              err={!validation?.work_unit}
              type="text"
              placeholder="Input Satuan Kerja"
              className="!h-11"
              onChange={(e) => setWorkUnit(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Lokasi"
              selectedOption={selectedLocation}
              title="location_name"
              options={listLocation}
              valueOption={(e) => setSelectedLocation(e)}
              Err={!validation?.id_location}
              not={-1}
            />  */}
            <SearchSelect
            title={"Lokasi"}
            selectedData={selectedLocation}
            listData={locationData}
            onChange={(e) => {setSelectedLocation(e)}}
            Err={!validation?.id_location}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Sumber Dana"
              id="sumberDana"
              name="sumberDana"
              err={!validation?.fund_source}
              type="text"
              placeholder="Input Sumber Dana"
              className="!h-11"
              onChange={(e) => setFundSource(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Contract Value"
              id="contract_value"
              value={formatRupiah(contractValue)}
              disabled={statusProgress.id == 5 ? false : true}
              name="contract_value"
              type="text"
              onChange={(e) => setContractValue(e.target.value)}
              placeholder="Input Contract Value"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <MultipleSelect
              label="Status Progress"
              selectedOption={statusProgress}
              title="label"
              options={listProgres}
              valueOption={(e) => setStatusProgress(e)}
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
              name="type_item"
              type="text"
              onChange={(e) => setTypeItem(e.target.value)}
              placeholder="Input Type Item"
              className="!h-11"
            />
          </div>
          <div className="flex-1">
            <Field
              label="Unit Value"
              id="unit_value"
              name="unit_value"
              type="number"
              onChange={(e) => setUnitValue(e.target.value)}
              placeholder="Input Unit value"
              className="!h-11"
            />
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Coordinator"
              selectedOption={selectedCoordinator}
              title="employee_name"
              placeholder="Coordinator name"
              options={listMarketing}
              valueOption={(e) => setSelectedCoordinator(e)}
              Err={selectedOptionErr}
              not={-1}
            /> */}
            <SearchSelect
            title={"Coordinator"}
            selectedData={selectedCoordinator}
            listData={listMarketing}
            onChange={(e) => {setSelectedCoordinator(e)}}
            />
          </div>
          <div className="flex-1">
            <SearchSelect
            title={"Marketing"}
            selectedData={selectedMarketing}
            listData={listMarketing}
            onChange={(e) => {setSelectedMarketing(e)}}
            />
            {/* <MultipleSelect
              label="Marketing"
              selectedOption={selectedMarketing}
              title="employee_name"
              placeholder="employee name"
              options={listMarketing}
              valueOption={(e) => setSelectedMarketing(e)}
              Err={selectedOptionErr}
              not={-1}
            /> */}
          </div>
        </div>
        <div className="py-3 px-10 flex items-center w-full gap-5">
          <div className="flex-1">
            {/* <MultipleSelect
              label="Sub Dis"
              selectedOption={selectedSubDis}
              title="sub_dis_name"
              options={listSubDis}
              valueOption={(e) => setSelectedSubDis(e)}
              Err={selectedOptionErr}
              not={-1}
            /> */}
            <Field
              label="Sub Dis"
              id="sub_dis"
              name="sub_dis"
              type="text"
              placeholder="Input Sub Dis"
              className="!h-11"
              onChange={(e) => setSubdis(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Unit Set"
              id="unit_set"
              name="unit_set"
              type="number"
              placeholder="Input Unit Set"
              className="!h-11"
              onChange={(e) => setUnitSet(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end p-5">
        <button
          onClick={saveData}
          className="bg-[#5D5FEF] px-5 py-2 !rounded-full mr-4"
        >
          <p className="text-white text-sm">Save</p>
        </button>
      </div>
    </div>
  );
}
