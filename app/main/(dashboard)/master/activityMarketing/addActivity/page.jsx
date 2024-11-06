"use client";
import { Field } from "../../../../../../components";
import InputDate from "../../../../../../components/Atoms/Input/inputDate";
import Maps from "../../../../../../components/Atoms/Maps/Map";
import { AddActivity, FetchData, getLocation } from "../../../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

export default function Page() {
  const [location, setLocation] = useState({
    value: "wfc",
    title: "Work From Office",
  });
  const router = useRouter();
  const ListLocation = [
    { value: "wfc", title: "Work From Office" },
    { value: "wfs", title: "Work From Site" },
    { value: "wfh", title: "Work From Home" },
  ];
  const [inputDate, setInputDate] = useState(new Date());
  const [Remarks, setRemarks] = useState("");
  const [activity, setActivity] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [coordinate, setCoordinate] = useState({
    lat: null,
    long: null,
    address: "",
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not available in your browser.");
    }
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await getLocation(latitude, longitude);

      if (response.status === 200) {
        const data = response.data;
        setCoordinate({
          lat: latitude,
          long: longitude,
          address: data.display_name,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addActivity = async () => {
    let payload = {
      data: {
        activity:
          activity,
        lat: coordinate?.lat,
        long: coordinate?.long,
        address: coordinate?.address,
        // remarks: Remarks,
      },
    };
    if ((coordinate?.lat, coordinate?.long)) {
      let result = await AddActivity(payload);
      if (+result.code) {
        router.push("/main/master/activityMarketing");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Tambah Data",
          text: result.response.data.msg,
        });
      }
    }
  };

  return (
    <div className="m-10 text-black">
      <div className="bg-white rounded-lg">
        <div className="text-base font-bold border-b flex items-center gap-3 p-5 ">
          <a href={"/main/master/activityMarketing"}>
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
          <div>Add Activity</div>
        </div>
        <div>
          <div className="py-3 px-10 flex items-center w-full gap-5">
            <div className="flex-1">
              <InputDate
                selected={inputDate}
                placeholderText="Input Date"
                // onChange={(e) => console.log(e)}
                label="Tgl Input"
                className="!h-11"
                disabled
              />
            </div>
            <div className="flex-1">
              {/* <MultipleSelect
                label="title"
                selectedOption={location}
                title="title"
                options={ListLocation}
                valueOption={(e) => setLocation(e)}
                // Err={selectedOptionErr}
                not={-1}
              /> */}
            </div>
          </div>
          <div className="px-10">
            <Field
              label="Coordinate"
              id="paket"
              name="paket"
              type="text"
              // onChange={(e) => setPaket(e.target.value)}
              placeholder="Input Paket"
              value={coordinate.address}
              className="!h-11 "
              disabled={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <Maps coordinate={coordinate} setCoordinate={setCoordinate} />
          </div>
          <div className="px-10">
            <Field
              label="Activity"
              id="paket"
              name="remarks"
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Input Paket"
              className="!h-11 "
            />
          </div>
          <hr />
          <div className="flex items-center justify-end p-5">
            <button
              onClick={() => addActivity()}
              className="bg-[#5D5FEF] px-5 py-2 !rounded-full mr-4"
            >
              <p className="text-white text-sm">Save</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
