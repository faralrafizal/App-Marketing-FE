"use client";
import { Button, Total, TableDashboard } from "../../../../components";
import React, { useEffect, useState } from "react";
import TotalDash from "../../../../components/Atoms/Card/TotalDash";
import Image from "next/image";
import DropdownNew from "../../../../components/Atoms/Dropdown";
import Checkbox from "../../../../components/Atoms/Checkbox";
import { useSession } from "next-auth/react";
import {
  ListDashboard,
  getAllMarketing,
  getAllMarketingCoordinator,
  miniDashboard,
} from "../../../../config/Api/Api";
import { ShowLoading, SwalClose } from "../../../../utils/loading";

const Page = () => {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Dashboard"]?.map((res) => res.event)


  const obj = [
    {
      bgColor: "bg-[#369FFF]",
      titleText: "Contract",
      value: "contract",
    },
    {
      bgColor: "bg-[#2D9596]",
      titleText: "100%",
      value: 100,
    },
    {
      bgColor: "bg-[#8038AB]",
      titleText: "75%",
      value: 75,
    },
    {
      bgColor: "bg-[#FF993A]",
      titleText: "50%",
      value: 50,
    },
    {
      bgColor: "bg-[#FF234F]",
      titleText: "25%",
      value: 25,
    },
    {
      bgColor: "bg-[#7D7D7D]/70",
      titleText: "0%",
      value: 0,
    },
  ];

  const [searchMarketing, setSearchMarketing] = useState("");
  const [searchCoordinasi, setSearchCoordinasi] = useState("");

  const [listProject, setListProject] = useState([]);
  const [lentlistProject, setLentListProject] = useState(0);

  const [listMarketing, setListMarketing] = useState([]);
  const [listCoordinasi, setListCoordinasi] = useState([]);
  const [valueProjectAll, setvalueProjectAll] = useState(0);
  const [totalData, setTotalData] = useState([
    {
      value: "0",
    },
    {
      value: "0",
    },
    {
      value: "0",
    },
    {
      value: "0",
    },
    {
      value: "0",
    },
    {
      value: "0",
    },
  ]);

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [refreshProject, setRefreshProject] = useState(false);

  const [countChecked, setCountChecked] = useState(0);

  const [checkedAllFilterCompany, setCheckedAllFilterCompany] = useState([
    { title: "All", value: "", checked: true },
    { title: "CMC", value: "CMC", checked: false },
    { title: "ARVIRO", value: "ARVIRO", checked: false },
    { title: "UEP", value: "UEP", checked: false },
  ]);
  const [filterSumberDokumen, setFilterSumberDokumen] = useState([
    { title: "All", value: "", checked: true },
    { title: "Sirup", value: "Sirup", checked: false },
    { title: "Non Sirup", value: "Non-Sirup", checked: false },
  ]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  // const [filterCustomer, setFilterCustomer] = useState([
  //   { title: "All", value: "", checked: true },
  //   { title: "DK/RS", value: "DK/RS", checked: false },
  //   { title: "PU", value: "PU", checked: false },
  //   { title: "Lain-lain", value: "DLL", checked: false },
  // ]);
  const [filterStatus, setFilterStatus] = useState([
    { title: "All", value: "", checked: true },
    { title: "Kontrak", value: "Contract", checked: false },
    { title: "100%", value: "100", checked: false },
    { title: "75%", value: "75", checked: false },
    { title: "50%", value: "50", checked: false },
    { title: "25%", value: "25", checked: false },
    { title: "0%", value: "0", checked: false },
  ]);

  // filter
  const [checkedAll, setCheckedAll] = useState(false);

  let selectData = (index, e) => {
    let defaultValue = listProject;
    defaultValue[index].checked = e;
    setListProject(defaultValue);
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
    let dataNew = listProject.map((val) => ({ ...val, checked: e }));
    setListProject(dataNew);
    setCheckedAll(e);
    setCountChecked(dataNew.filter((res) => res.checked).length);
    setRefresh(!refresh);
  };

  const getDataMaster = async () => {
    ShowLoading();
    let listMarketing = await getAllMarketingCoordinator(token);
    if (listMarketing?.code == 1) {
      setListMarketing([
        { employee_name: "All", id_marketing: "", checked: true },
        ...listMarketing?.responseResult?.marketing,
      ]);
      setListCoordinasi([
        { employee_name: "All", coordinator: "", checked: true },
        ...listMarketing?.responseResult?.coordinator,
      ]);
      setFilterCustomer([
        { klpd: "All", checked: true },
        ...listMarketing?.responseResult?.customer,
      ]);
    }
    SwalClose();
  };

  useEffect(() => {
    if (token) {
      getDataMaster();
      getMiniDash();
    }
  }, [token]);

  const getMiniDash = async () => {
    let data = await miniDashboard(token);
    if (data?.code == 1) {

      let value = data.responseResult;
      setTotalData([
        {
          value: value?.contract || 0,
        },
        {
          value: value?.total100 || 0,
        },
        {
          value: value?.total75 || 0,
        },
        {
          value: value?.total50 || 0,
        },
        {
          value: value?.total25 || 0,
        },
        {
          value: value?.total0 || 0,
        },
      ]);
      setvalueProjectAll(
        (value?.allProjectValue || 0).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
      );
    }
  };

  // cons

  const clickFilter = () => {
    const indexToRemove = array.indexOf("tiga");

    if (indexToRemove !== -1) {
      array.splice(indexToRemove, 1);
    }
  };

  const getListDash = async () => {
    let payload = {
      page: pageData,
      size: sizeData,
      searchWord: searchMarketing,
    };

    payload.filter = {
      status: filterStatus
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.value), // Kontrak / 0 / 25 / 50 / 75 / 100
      company: checkedAllFilterCompany
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.value), // CMC / ARVIRO / UEP
      sourceDocument: filterSumberDokumen
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.value), // Sirup / Non-Sirup
      customer: filterCustomer
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.klpd),
      marketing: listMarketing
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.id_marketing), // array int
      coordinator: listCoordinasi
        .slice(1)
        ?.filter((val) => val?.checked)
        ?.map((value) => value?.coordinator), // array int
    };

    let result = await ListDashboard(payload, token);
    if (+result.code) {
      setListProject(result?.responseResult?.rows);

      let count = result?.responseResult?.count;

      setLentListProject(count);

      let number = count / sizeData;
      number = parseInt(number);
      let valCount = count % +sizeData;
      if (valCount === 0) {
        setLenPage(number);
      } else {
        setLenPage(number + 1);
      }
    } else {
      setListProject([]);
      setLentListProject(0);
      setLenPage(0);
    }
  };

  useEffect(() => {
    if (token)
      getListDash();
  }, [pageData, sizeData, searchMarketing, refreshProject, token]);

  const filterCompany = (list, key, val, checker) => {
    const listFilter = [
      checkedAllFilterCompany,
      filterSumberDokumen,
      filterCustomer,
      filterStatus,
      listCoordinasi,
      listMarketing,
    ];
    const setListFilter = [
      setCheckedAllFilterCompany,
      setFilterSumberDokumen,
      setFilterCustomer,
      setFilterStatus,
      setListCoordinasi,
      setListMarketing,
    ];

    let newData = listFilter[list];
    if (!val || val == "All") {
      newData = newData.map((res, i) => {
        if (i == 0) {
          return { ...res, checked: true };
        } else {
          return { ...res, checked: false };
        }
      });
    } else {
      newData[key].checked = checker;

      if (newData?.slice(1)?.every((val) => val?.checked == false)) {
        newData[0].checked = true;
      } else {
        newData[0].checked = false;
      }
    }
    // setCheckedAllFilterCompany(newData);
    setListFilter[list](newData);
    setRefresh(!refresh);
    setRefreshProject(!refreshProject);
  };

  const resetFilter = () => {
    const listFilter = [
      checkedAllFilterCompany,
      filterSumberDokumen,
      filterCustomer,
      filterStatus,
      listCoordinasi,
      listMarketing,
    ];

    const setListFilter = [
      setCheckedAllFilterCompany,
      setFilterSumberDokumen,
      setFilterCustomer,
      setFilterStatus,
      setListCoordinasi,
      setListMarketing,
    ];
    listFilter.map((val, i) => {
      let newFilter = val?.map((val2, index) => ({
        ...val2,
        checked: index == 0 ? true : false,
      }));
      setListFilter[i](newFilter);
    });
  };

  const setHeaderFilter = (i) => {
    let newStatusFilter = filterStatus;
    newStatusFilter = newStatusFilter?.map((val2) => ({
      ...val2,
      checked: false,
    }));
    newStatusFilter[i].checked = true;
    setFilterStatus(newStatusFilter);
  };

  return (
    <div className="text-black ">
      <div className=" p-5 bg-white mt-2 mx-7 border rounded-lg border-transparent">
        <div className="flex items-center gap-3">
          <Image alt="empty-walet" src={`/icon/empty-wallet.svg`} width={43} height={43} />
          <div>
            <div className="text-gray text-base font-bold">
              Your Total Status (0% - 100%)
            </div>
            <div className="text-blue text-[26px] font-bold">
              {valueProjectAll}
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-8">
          {obj.map((data, index) => (
            <TotalDash
              onClick={() => {
                setPageData(1);
                resetFilter();
                setHeaderFilter(index + 1);
                setRefreshProject(!refreshProject);
              }}
              key={index}
              bgColor={data?.bgColor}
              icon={"dollar.svg"}
              titleText={data?.titleText}
              value={totalData[index]?.value.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              }) || 0}
              percentage={totalData[index]?.percentage || 0}
            />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-5 mt-5 mx-7 ">
        <div className="sm:w-[40%] md:w-[30%] lg:w-[20%]">
          <div className="bg-white rounded-lg px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="text-black font-bold text-base">Filter</div>
              <div
                onClick={() => {
                  resetFilter();
                  setRefreshProject(!refreshProject);
                }}
                className="text-[#5D5FEF] cursor-pointer md:text-sm text-sm font-semibold lg:text-sm"
              >
                Reset Filter
              </div>
            </div>
            {Role?.includes("Filter Company") && <div>
              <DropdownNew
                show={true}
                className="my-4 text-black"
                title="Company"
              >
                <div className="my-4">
                  {checkedAllFilterCompany?.map((val, i) => (
                    <div key={i} className="flex items-center my-2 gap-3">
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => filterCompany(0, i, val?.value, e)}
                      />
                      <div className="text-sm font-medium">{val?.title}</div>
                    </div>
                  ))}
                </div>
              </DropdownNew>
              <hr />
            </div>}
            {Role?.includes("Filter Sumber Dokumen") && <div>
              <DropdownNew
                show={true}
                className="my-4 text-black"
                title="Sumber Dokumen"
              >
                <div className="my-4">
                  {filterSumberDokumen?.map((val, i) => (
                    <div key={i} className="flex items-center my-2 gap-3">
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => filterCompany(1, i, val?.value, e)}
                      />
                      <div className="text-sm font-medium">{val?.title}</div>
                    </div>
                  ))}
                </div>
              </DropdownNew>
              <hr />
            </div>}
            {Role?.includes("Filter Customer") && <div>
              <DropdownNew className="my-4 text-black" title="Customer">
                <div className="my-4">
                  {filterCustomer?.map((val, i) => (
                    <div key={i} className="flex items-center my-2 gap-3">
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => filterCompany(2, i, val?.klpd, e)}
                      />
                      <div className="text-sm font-medium truncate">
                        {val?.klpd}
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownNew>
              <hr />
            </div>}
            {Role?.includes("Filter Status") && <div>
              <DropdownNew className="my-4 text-black" title="Status">
                <div className="my-4">
                  {filterStatus?.map((val, i) => (
                    <div key={i} className="flex items-center my-2 gap-3">
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => filterCompany(3, i, val?.value, e)}
                      />
                      <div className="text-sm font-medium">{val?.title}</div>
                    </div>
                  ))}
                </div>
              </DropdownNew>
              <hr />
            </div>}
            {Role?.includes("Filter Coordinator") && <div>
              <DropdownNew className="my-4 text-black" title="Coordinator">
                <div className="my-4">
                  <div className="border w-full my-4 rounded-full px-3 py-2">
                    <label
                      htmlFor="filterCoordinator"
                      className="flex w-full items-center"
                    >
                      <div className="flex-1">
                        <input
                          id="filterCoordinator"
                          type="text"
                          className="w-[95%] focus:outline-none"
                          onChange={(e) => setSearchCoordinasi(e.target.value)}
                        />
                      </div>
                      <div>
                        <Image alt="search" src={`/icon/search.svg`} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="max-h-[250px] overflow-y-scroll">
                    {listCoordinasi.map(
                      (val, i) =>
                        val?.employee_name
                          ?.toUpperCase()
                          .includes(searchCoordinasi.toUpperCase()) && (
                          <div key={i} className="flex items-center my-2 gap-3">
                            <Checkbox
                              checked={val?.checked}
                              onChange={(e) =>
                                filterCompany(4, i, val?.coordinator, e)
                              }
                            />
                            <div className="text-sm font-medium">
                              {val?.employee_name}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </DropdownNew>
              <hr />
            </div>}
            {Role?.includes("Filter Marketing Name") && <div>
              <DropdownNew className="my-4 text-black" title="Marketing Name">
                <div className="my-4">
                  <div className="border w-full my-4 rounded-full px-3 py-2">
                    <label
                      htmlFor="filterMarketing"
                      className="flex w-full items-center"
                    >
                      <div className="flex-1">
                        <input
                          id="filterMarketing"
                          type="text"
                          className="w-[95%] focus:outline-none"
                          onChange={(e) => setSearchMarketing(e.target.value)}
                        />
                      </div>
                      <div>
                        <Image alt="search-icon" src={`/icon/search.svg`} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="max-h-[250px] overflow-y-scroll">
                    {listMarketing.map(
                      (val, i) =>
                        val?.employee_name
                          ?.toUpperCase()
                          .includes(searchMarketing.toUpperCase()) && (
                          <div key={i} className="flex items-center my-2 gap-3">
                            <Checkbox
                              checked={val?.checked}
                              onChange={(e) =>
                                filterCompany(5, i, val?.id_marketing, e)
                              }
                            />
                            <div className="text-sm font-medium">
                              {val?.employee_name}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </DropdownNew>
            </div>}
          </div>
        </div>
        <div className="flex-1 p-6 h-[100%] bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <div className="justify-self-start">
              <span className="font-semibold text-sm text-[#7D7D7D]">
                {lentlistProject} Result
              </span>
            </div>
            <div className="justify-self-end">
              <label htmlFor="search" className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  value={searchMarketing}
                  onChange={(e) => {
                    setSearchMarketing(e.target.value);
                  }}
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
              </label>
            </div>
          </div>
          <div>
            <div className=" overflow-auto  sm:rounded-lg">
              <TableDashboard
                listData={listProject}
                setPageData={(e) => setPageData(e)}
                pageData={pageData}
                maxLenght={lenPage}
                setSizeData={setSizeData}
                sizeData={sizeData}
                selectData={selectData}
                countChecked={countChecked}
                checkAll={checkAll}
                checkedAll={checkedAll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
