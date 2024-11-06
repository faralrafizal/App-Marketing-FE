"use client";
import { useSession } from "next-auth/react";
import { Button, Field } from "../../../../../components";
import MultipleSelect from "../../../../../components/Atoms/SelectInput";
import { Fetch } from "../../../../../config/Api/Api";
import Image from "next/image";
import AnimatedMulti from "../../../../../components/Atoms/SelectMultiple/SelectMultipleData";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShowLoading, SwalClose } from "../../../../../utils/loading";
import Swal from "sweetalert2";
import Checkbox from "../../../../../components/Atoms/Checkbox";

export default function Page() {
  const router = useRouter();
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["User Management"]?.map((res) => res.event)

  const [listRole, setListRole] = useState([]);
  const [listLocation, setListLocation] = useState([]);
  const [namaPengguna, setNamaPengguna] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    value: "",
    role_name: "Select",
  });
  const [selectedLocation, setSelectedLocation] = useState({
    id_location: "",
    location_name: "Select"
  })

  const [namaPenggunaErr, setNamaPenggunaErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [nipErr, setNipErr] = useState(false);

  const [selectedOptionErr, setSelectedOptionErr] = useState(false);

  useEffect(() => {
    GetlistRole();
    GetListLocation();
  }, []);

  let GetListLocation = async () => {
    await Fetch({
      method: "POST",
      url: "/get-all-location-city",
      token: token
    }).then((res) => {
      setListLocation([
        // {
        //   id_location: "",
        //   location_name: "Select",
        // },
        ...res.data?.responseResult?.rows
      ])
    })
  }

  let GetlistRole = async () => {
    await Fetch({
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

  const saveLocation = async (id) => {
    try {
      let payload = [
        ...(defaultLocationChecked
          ? [...defaultLocation.map(e => ({
            "id_profile": id,
            "id_location": e.value.id_location,
            "is_default": "Y"
          }))]
          : []),
        ...optionalLocation.map(e => ({
          "id_profile": id,
          "id_location": e.value.id_location,
          "is_default": "N"
        }))
      ];

      await Fetch({
        method: "POST",
        url: `/add-detail-location-work`,
        data: payload
      })
    } catch (error) {
      return error
    }
  }

  const saveData = async () => {
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

    if (!nip) {
      err = 1
      setNipErr(true)
    } else {
      setNipErr(false)
    }

    if (err == 0) {
      let payload = {
        position: selectedOption?.role_name,
        employee_name: namaPengguna,
        phone_number: "",
        email: email,
        leader_code: null,
        id_role: selectedOption?.id_role,
        username: email,
        password: nip,
        id_location: selectedLocation?.id_location | null,
      };
      ShowLoading()
      await Fetch({
        method: "POST",
        url: `/register`,
        data: payload
      }).then(async (res) => {
        console.log(res.data.responseResult.id_profile);
        SwalClose()
        setSelectedOptionErr(false)
        setEmailErr(false)
        setNamaPenggunaErr(false)
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${res?.data?.msg}`,
          timer: 2000
        }).then(() => {
          router.push("/main/userManagement");
        })
      })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: `${err?.response?.data?.msg}`,
            timer: 2000
          })
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
          <div>Add User</div>
        </div>
        <div className="py-5 px-10 border-b">
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
                label="NIP"
                id="nip"
                name="nip"
                value={nip}
                placeholder="Nomor Induk Pegawai"
                className="h-11"
                onChange={(e) => setNip(e.target.value)}
                err={namaPenggunaErr}
              />
            </div>
          </div>
          <div className="flex items-start w-full gap-5">
            <div className="flex-1">
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
          {/* <div className="flex items-start w-[49%] gap-5">
              <div className="flex-1">
                <div>
                  <MultipleSelect
                    label="Location"
                    selectedOption={selectedLocation}
                    title="location_name"
                    options={listLocation}
                    valueOption={(e) => setSelectedLocation(e)}
                    Err={selectedOptionErr}
                  />
                </div>
              </div>
            </div> */}
          {/* {Role?.includes('Set Location') && <div className="border p-5 rounded-lg">
            <div className="mb-3 font-semibold">Location</div>
            <div className=" flex items-center gap-10 ">
              <div className=" w-[49%] gap-5">
                <div className="text-sm mb-2 font-medium">Default Location</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={defaultLocationChecked}
                      onChange={(e) => setDefaultLocationChecked(e)}
                    />
                    <div className="flex-1">
                      <AnimatedMulti
                        defaultValue={defaultLocation}
                        onChange={(e) => {
                          // onSelect(i, e);
                          setDefaultLocation(e)
                        }}
                        maxMenuHeight={200}
                        listData={listLocation?.filter(e => !optionalLocation.some(d => d.label == e.location_name)).map((res) => ({
                          value: res,
                          label: res?.location_name,
                        }))}
                        isDisabled={!defaultLocationChecked}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-[49%] gap-5">
                <div className="text-sm mb-2 font-medium">Additional Location</div>
                <div className="flex-1">
                  <div>
                    <AnimatedMulti
                      defaultValue={optionalLocation}
                      onChange={(e) => {
                        // onSelect(i, e);
                        setOptionalLocation(e)
                      }}
                      maxMenuHeight={200}
                      listData={listLocation?.filter(e => !defaultLocation.some(d => d.label == e.location_name))?.map((res) => ({
                        value: res,
                        label: res?.location_name,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>} */}
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
