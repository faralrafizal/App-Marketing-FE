"use client";
import { ActionButton, Total } from "../../../../components";
import Checkbox from "../../../../components/Atoms/Checkbox";
import ModalDelete from "../../../../components/Atoms/Modal/ModalDelete";
import ModalDetailSirup from "../../../../components/Atoms/Modal/ModalDetailSirup";
import Pagination from "../../../../components/Molecules/Pagination/pagination";
import TabelSirup from "../../../../components/Molecules/tabelSirup";
import { GetAllProject } from "../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [detailSirup, setDetailSirup] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [pageData, setPageData] = useState(1);
  const [sizeData, setSizeData] = useState(10);
  const [lenPage, setLenPage] = useState(1);

  const [listDataProject, setListDataProject] = useState([]);

  const cardIcons = ["award.svg", "dollar.svg", "check.svg", "list.svg"];

  const obj = [
    {
      bgColor: "bg-[#369FFF]",
      titleText: "Total Project",
    },
    {
      bgColor: "bg-[#FF993A]",
      titleText: "Total Nilai Pagu",
    },
  ];

  const [totalData, setTotalData] = useState([
    {
      value: "45",
      percentage: "3.1%",
    },
    {
      value: "150 JT",
      percentage: "3.1%",
    },
  ]);

  useEffect(() => {
    const getProject = async () => {
      let listProject = await GetAllProject({
        status: "not approve", // approve / not approve
        page: pageData,
        size: sizeData,
        searchWord: searchTerm,
      });

      if ((listProject.responseCode = 200)) {
        setListDataProject(listProject?.responseResult?.rows);
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
    };
    getProject();
  }, [pageData, searchTerm, sizeData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let NavigateEdit = () => { };

  let DetailData = () => {
    setDetailSirup(true);
  };

  let modalDeletes = () => {
    setModalDelete(true);
  };

  return (
    <div className="mx-7 py-3">
      <div className="block p-3 bg-white mt-2 mb-4  h-48 border rounded-lg border-transparent">
        <h1 className="text-black font-bold">Overview</h1>
        <div className="mt-3 grid grid-cols-2 gap-8">
          {obj.map((data, index) => (
            <Total
              key={index}
              bgColor={data?.bgColor}
              icon={cardIcons[index]}
              titleText={data?.titleText}
              value={totalData[index]?.value || 0}
              percentage={totalData[index]?.percentage || 0}
            />
          ))}
        </div>
      </div>
      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="text-base font-bold">Upload SIRUP</div>
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
            <a
              href={"/main/uploadSirup/addSirup"}
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

        <TabelSirup
          modalDeletes={modalDeletes}
          DetailData={DetailData}
          NavigateEdit={NavigateEdit}
          listData={listDataProject}
          setPageData={(e) => setPageData(e)}
          pageData={pageData}
          maxLenght={lenPage}
          setSizeData={setSizeData}
          sizeData={sizeData}
        />
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
  );
}
