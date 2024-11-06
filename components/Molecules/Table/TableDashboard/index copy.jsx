import { ProgressBar, ActionButton } from "@/components";
import React from "react";
import Image from "next/image";

function TableDashboard() {
  const clickdata = (nilai) => {
    console.log(nilai);
  };

  let Actions = [
    {
      svg: "eye.svg",
      action: clickdata,
    }
  ];

  return (
    <table className="w-full h-32 text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            No
          </th>
          <th scope="col" className="px-6 py-3">
            Nama Project
          </th>
          <th scope="col" className="px-6 py-3">
            Nilai Pagu
          </th>
          <th scope="col" className="px-6 py-3">
            Tanggal Kunjungan
          </th>
          <th scope="col" className="px-6 py-3">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="overflow-scroll">
        <tr className="bg-white">
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            1
          </th>
          <td className="px-6 py-4">
            Pembangunan IPAL 3 Kawasan Inti Pusat Pemerintahan Ibu Kota Negara
            (KIPP IKN)
          </td>
          <td className="px-6 py-4">Rp. 48.000.000</td>
          <td className="px-6 py-4">19 Agustus 2022</td>
          <td className="w-[12%]">
            <div className="flex items-center justify-around">
              {Actions?.map((res, key) => (
                <ActionButton
                  key={key}
                  className={res?.className}
                  icon={res?.svg}
                  onClick={() => res?.action("nilai " + key)}
                />
              ))}
            </div>
          </td>
        </tr>
        <tr className="border-b dark:bg-gray-800 dark:border-gray-700">
          <td colSpan={5}>
            <div className="bg-gray-100 p-1 flex justify-center items-center text-center h-11 border rounded-full">
              <div className="flex text-black items-center gap-4 w-[20%] text-center">
                <Image src="/icon/flag.svg" width={25} height={25} />
                <p className="font-bold text-gray-300">Project Progress</p>
              </div>
              <div className="w-full flex items-center">
                <ProgressBar />
              </div>
            </div>
          </td>
        </tr>
        <tr className="bg-white">
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            2
          </th>
          <td className="px-6 py-4">
            Pembangunan IPAL 3 Kawasan Inti Pusat Pemerintahan Ibu Kota Negara
            (KIPP IKN)
          </td>
          <td className="px-6 py-4">Rp. 48.000.000</td>
          <td className="px-6 py-4">19 Agustus 2022</td>
          <td className="w-[12%]">
            <div className="flex items-center justify-around">
              {Actions?.map((res, key) => (
                <ActionButton
                  key={key}
                  className={res?.className}
                  icon={res?.svg}
                  onClick={() => res?.action("nilai " + key)}
                />
              ))}
            </div>
          </td>
        </tr>
        <tr className="border-b dark:bg-gray-800 dark:border-gray-700">
          <td colSpan={5}>
            <div className="bg-gray-100 p-1 flex justify-center items-center text-center h-11 border rounded-full">
              <div className="flex text-black items-center gap-4 w-[20%] text-center">
                <Image src="/icon/flag.svg" width={25} height={25} />
                <p className="font-bold text-gray-300">Project Progress</p>
              </div>
              <div className="w-full flex items-center">
                <ProgressBar />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableDashboard;
