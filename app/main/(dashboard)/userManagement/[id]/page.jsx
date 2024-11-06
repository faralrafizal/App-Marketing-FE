"use client";
import { Button, Field } from "../../../../../components";
import MultipleSelect from "../../../../../components/Atoms/SelectInput";
import { Fetch } from "../../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Checkbox from "../../../../../components/Atoms/Checkbox";
import AnimatedMulti from "../../../../../components/Atoms/SelectMultiple/SelectMultipleData";
import { useSession } from "next-auth/react";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["User Management"]?.map((res) => res.event)

  const [listRole, setListRole] = useState([]);
  const [namaPengguna, setNamaPengguna] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    value: "",
    role_name: "Tingkat Role",
  });

  const [namaPenggunaErr, setNamaPenggunaErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [selectedOptionErr, setSelectedOptionErr] = useState(false);



  const [listLocation, setListLocation] = useState([]);

  useEffect(() => {
    GetListLocation();
    GetDetailUser()

    GetlistRole();
  }, []);

  let GetlistRole = () => {
    Fetch({
      method: "POST",
      url: `/list-role`,
    })
      .then((res) => {
        setListRole([
          {
            value: "",
            role_name: "Tingkat Role",
          },
          ...res.data?.checkRole?.rows,
        ]);
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };





  let GetDetailUser = () => {
    Fetch({
      method: "GET",
      url: `/get-one-user?id=${id}`,
    })
      .then((res) => {

        setNamaPengguna(res.data.responseResult.employee_name)
        setEmail(res.data.responseResult.email)
        setSelectedOption(res.data.responseResult.mst_role)
      })
      .catch((err) => {
        console.log(err.response, "err");
        router.push("/main/userManagement");
      });
  };

  let GetListLocation = async () => {
    await Fetch({
      method: "POST",
      url: "/get-all-location-city",
      token: token
    }).then((res) => {
      let location = [
        // {
        //   id_location: "",
        //   location_name: "Select",
        // },
        ...res.data?.responseResult?.rows
      ].map((res) => ({
        value: res,
        label: res?.location_name,
      }))
      setListLocation(location)
    })
  }

  const saveData = () => {

    let err = 0
    if (!namaPengguna) {
      err = 1
      setNamaPenggunaErr(true)
    } else {
      setNamaPenggunaErr(false)
    }

    if (!email) {
      console.log("maskamsak")
      err = 1
      setEmailErr(true)
    }

    if (!email.includes("@")) {
      err = 1
      setEmailErr(true)
    }

    if (!selectedOption?.id_role) {
      err = 1
      setSelectedOptionErr(true)
    } else {
      setSelectedOptionErr(false)
    }

    if (err == 0) {
      ShowLoading()
      let payload = {
        "id_profile": id,
        position: selectedOption?.role_name,
        employee_name: namaPengguna,
        phone_number: "",
        email: email,
        leader_code: null,
        id_role: selectedOption?.id_role,
        username: email,
        password: password,
        id_location: null,
      };

      // return console.log(payload);
      Fetch({
        method: "POST",
        url: `/edit-profile`,
        data: payload
      })
        .then(async (res) => {
          // if (Role?.includes('Set Location')) await updateLocation()
          setSelectedOptionErr(false)
          setEmailErr(false)
          setNamaPenggunaErr(false)
          SwalClose()
          router.push("/main/userManagement");
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  };
  return (
    <div className="mx-7 py-3 h-screen">
      <div className="bg-white text-black rounded-xl mb-10">
        <div className="text-base font-bold border-b flex items-center gap-3 p-5 ">
          <a href={"/main/userManagement"}>
            {" "}
            <Image
              className=""
              src="/icon/arrow-left.svg"
              alt="Next.js Logo"
              width={20}
              height={20}
              priority
            />
          </a>
          <div>Edit User</div>
        </div>
        <div className="py-5 px-10 border-b ">
          <div className="flex items-start w-full gap-5">
            <div className="flex-1">
              <Field
                label="Nama Pengguna"
                id="username"
                name="username"
                value={namaPengguna}
                placeholder="Nama Pengguna"
                className="h-11"
                onChange={(e) => setNamaPengguna(e.target.value)}
                err={namaPenggunaErr}
              />
            </div>
            <div className="flex-1">
              <Field
                label="Email"
                id="username"
                name="username"
                type="email"
                value={email}
                placeholder="Email Pengguna"
                className="h-11"
                onChange={(e) => setEmail(e.target.value)}
                err={emailErr}
              />
            </div>
          </div>
          {/* <div className="flex-1">
            <div>
              <MultipleSelect
                label="Roles"
                selectedOption={selectedOption}
                title="role_name"
                options={listRole}
                valueOption={(e) => setSelectedOption(e)}
                Err={selectedOptionErr}
              />
            </div>
          </div> */}
          <div className="flex items-start w-full gap-5">
            <div className="flex-1">
              <Field
                label="Password"
                type="password"
                id="password"
                name="password"
                value={password}
                placeholder="Password"
                className="h-11"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex-1"></div>
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
    </div>
  );
}
