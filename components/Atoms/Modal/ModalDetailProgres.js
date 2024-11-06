import React, { useEffect } from "react";
import Modal from ".";
import Image from "next/image";
import DropdownProgres from "../../dropdown/dropdownProgres";
import { progressDetail } from "../../../config/Api/Api";
import { useState } from "react";

export default function ModalDetailProgres(props) {
  let { data } = props;
  const [dataList, setdataList] = useState([]);

  // let profile = [
  //   {
  //     title: "Marketing",
  //     value: data?.marketing_name,
  //     svg: "imageProfile",
  //   },
  //   {
  //     title: "Metode",
  //     value: data?.method,
  //     svg: "tag",
  //   },
  //   {
  //     title: "Jenis Pengadaan",
  //     value: data?.procurement_type,
  //     svg: "note-2",
  //   },
  // ];

  const getProgres = async () => {
    let getdata = await progressDetail(data);
    console.log("getdata", getdata);
    if (+getdata.code) {
      let data = groupedData(getdata?.responseResult);
      setdataList(data);
    }
  };

  const groupedData = (data) => {
    const grouped = {};

    data.forEach((item) => {
      if (item.updated_at) {
        const date = item.updated_at.split("T")[0];

        if (!grouped[date]) {
          grouped[date] = { title: date, value: [] };
        }

        grouped[date].value.push({
          updated_at: item.updated_at,
          description: item.description,
        });
      }
    });

    // Sort the grouped data by date in descending order (most recent first)
    const sortedGrouped = Object.values(grouped).sort((a, b) => {
      return new Date(b.title) - new Date(a.title);
    });

    return sortedGrouped;
  };

  useEffect(() => {
    getProgres();
  }, [data]);

  return (
    <Modal
      {...props}
      className="justify-end"
      classNameheader=""
      endTitle="Details"
      title=""
      width="w-[600px] transition-transform duration-500 ease-in-out"
    >
      {dataList?.length > 0 ? (
        <div>
          {dataList.map((val, i) => (
            <DropdownProgres
              key={i}
              data={val}
              minH={dataList.length - 1 == i ? false : true}
            />
          ))}

          <div className="flex mt-5">
            <button className="text-base font-semibold border rounded-full px-5 py-1 border-[#5D5FEF] text-[#5D5FEF]">
              Show Older
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Image
            className=""
            src="/icon/notFound.svg"
            alt="Next.js Logo"
            width={300}
            height={300}
            priority
          />
        </div>
      )}
    </Modal>
  );
}
