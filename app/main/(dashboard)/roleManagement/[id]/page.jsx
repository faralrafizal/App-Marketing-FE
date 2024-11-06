"use client";
import { useSession } from "next-auth/react";
import { Button, Field } from "../../../../../components";
import Checkbox from "../../../../../components/Atoms/Checkbox";
import MultipleSelect from "../../../../../components/Atoms/SelectInput";
import SelectMultiple from "../../../../../components/Atoms/SelectMultiple";
import AnimatedMulti from "../../../../../components/Atoms/SelectMultiple/SelectMultipleData";
import { FetchRoleLevel, Fetch, getCheckDocument } from "../../../../../config/Api/Api";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["User Management"]?.map((res) => res.event)

  const { id } = useParams();
  const router = useRouter();

  const [roleLevel, setRoleLevel] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    value: "",
    level_name: "Tingkat Role",
  });

  const [roleName, setRoleName] = useState("");
  const [dataDefauld, setDataDefauld] = useState({});

  const [roleParent, setRoleParent] = useState([]);
  const [roleParentCheckbox, setRoleParentCheckbox] = useState([]);
  const [roleChiled, setRoleChiled] = useState([]);
  const [tipeDeviceRefresh, setTipeDeviceRefresh] = useState(false);
  const [tipeDevice, setTipeDevice] = useState({
    Web: true,
    Mobile: true,
  });
  const [refresh, setRefresh] = useState(false);

  let findData = (listData, id, title) =>
    listData?.filter((val) => val[title] == id);

  const navigateToUserManagement = () => {
    let system =
      tipeDevice.Mobile && tipeDevice.Web
        ? "General"
        : tipeDevice.Mobile
          ? "Mobile"
          : tipeDevice.Web
            ? "Web"
            : "";

    let moduleRole = [];
    roleParent?.filter((res, i) => {
      if (res) {
        roleChiled[i].map((res) => {
          let checked = findData(
            dataDefauld?.list,
            res?.value?.id_role_event,
            "value"
          );

          if (checked[0]?.value) {
            moduleRole?.push({ idEvent: checked[0]?.value, roleManagementId: checked[0]?.roleManagementId });
          } else {
            moduleRole?.push({ idEvent: res?.value?.id_role_event });
          }
        });
      }
    });

    let data = {
      idLevel: selectedOption?.id_role_level,
      module: JSON.stringify(moduleRole),
      roleName,
      system,
    };
    // return console.log();
    Fetch({
      method: "PUT",
      url: `/update-role?roleId=${id}`,
      data,
      token
    })
      .then((res) => {
        console.log(res.data);
        router.push("/main/roleManagement");
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };

  useEffect(() => {
    Fetch({
      method: "GET",
      url: `/role-one?id_role=${id}`,
      token
    })
      .then((res) => {
        let data = res.data?.result;
        setDataDefauld(data);
        setRoleName(data?.role_name);
        let defauldDevice = {
          Web: true,
          Mobile: true,
        };
        if (data?.system == "Mobile") {
          defauldDevice.Web = false;
        } else if (data?.system == "Web") {
          defauldDevice.Mobile = false;
        }

        setTipeDevice(defauldDevice);
        setTipeDeviceRefresh(!tipeDeviceRefresh);
        FetchRoleLevel().then((res) => {
          let roleLevel = [
            { value: "", level_name: "Tingkat Role" },
            ...res.data.responseResult.rows,
          ];
          setRoleLevel(roleLevel);
          let newData = res.data.responseResult.rows.find(
            (val) => val?.id_role_level === data?.id_role_level
          );
          setSelectedOption(newData);
        });
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  }, []);

  useEffect(() => {
    GetlistParent();
  }, [tipeDeviceRefresh]);

  let GetlistParent = () => {
    let system =
      tipeDevice.Mobile && tipeDevice.Web
        ? "General"
        : tipeDevice.Mobile
          ? "Mobile"
          : tipeDevice.Web
            ? "Web"
            : "";
    Fetch({
      method: "POST",
      url: `/get-role-parent?system=${system}`,
      token
    })
      .then((res) => {
        let data = res.data?.responseResult;

        let ListChecked = [];
        let ListChild = [];

        data?.map((res2) => {
          let checked = findData(
            dataDefauld?.modules,
            res2.id_role_event_parent,
            "id_role_event_parent"
          );
          if (checked[0]?.id_role_event_parent) {
            ListChecked.push(true);

            let Child = [];

            let listModule = checked[0]?.module?.map((res3) => {
              let checked = findData(
                res2.mst_role_event,
                res3.value,
                "id_role_event"
              );
              Child.push({
                value: checked[0],
                label: checked[0]?.event,
              });
            });

            ListChild.push(Child);
          } else {
            ListChecked.push(false);
            ListChild.push([]);
          }
        });

        // setRoleParentCheckbox(ListChecked);
        setRoleChiled(ListChild);
        setRoleParent(
          data.map((res, i) => ({ ...res, checked: ListChecked[i] }))
        );
      })
      .catch((err) => {
        if (err.response?.data?.msg == "Data role Parent Empty") {
          setRoleParentCheckbox([]);
          setRoleChiled([]);
          setRoleParent([]);
        }
        // console.log(, "err");
      });
  };

  const onSelect = async (index, e) => {
    let data = roleChiled;
    if (e.length > 0 && (e[e.length - 1]?.label).includes("Approval")) {
      // e[e.length - 1]?.label.slice(9)
      let params = e[e.length - 1]?.label
        .toLowerCase()
        .replaceAll(" ", "_")
        .slice(9);
      // if(e[e.length - 1]?.label.slice(9)){

      // }
      let result = await getCheckDocument(params);
      if (result?.responseCode == 200) {
        data[index] = e;
        setRoleChiled(data);
        setRefresh(!refresh);
      }
    } else {
      data[index] = e;
      setRoleChiled(data);
      setRefresh(!refresh);
    }
  };

  let onChangeCheckbox = (index, e) => {
    let data = roleParent;
    data[index].checked = e;
    setRoleParent(data);

    let chileRole = roleChiled;
    chileRole[index] = [];
    setRoleChiled(chileRole);
    setRefresh(!refresh);
  };

  const tipeAkses = [
    { title: "Website", value: "Web" },
    { title: "Mobile", value: "Mobile" },
  ];

  return (
    <div className="mx-7 py-3 h-screen">
      <div className="bg-white text-black rounded-xl mb-10">
        <div className="text-base font-bold border-b flex items-center gap-3 p-5 ">
          <a href={"/main/roleManagement"}>
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
          <div>Edit Role</div>
        </div>
        <div className="py-3 px-10  flex items-center w-full gap-5">
          <div className="flex-1">
            <Field
              label="Nama Role"
              value={roleName}
              className="h-11"
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <div>
              <MultipleSelect
                selectedOption={selectedOption}
                title="level_name"
                options={roleLevel}
                label="Tingkat Role"
                valueOption={(e) => setSelectedOption(e)}
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="py-3 px-10 text-sm border-b font-semibold">
            Akses Pengguna
          </div>
          <div className="px-10">
            <div className="flex items-center gap-5 my-5">
              {tipeAkses?.map((val, key) => (
                <div className="flex items-center gap-3"
                  key={key}
                >
                  <Checkbox
                    checked={tipeDevice[val?.value]}
                    onChange={(e) => {
                      let data = tipeDevice;
                      data[val?.value] = e;
                      setTipeDevice(data);
                      setTipeDeviceRefresh(!tipeDeviceRefresh);
                    }}
                  />
                  <label className="font-medium text-xs">{val?.title}</label>
                </div>
              ))}
            </div>
            {roleParent.length ? (
              <div className="p-7 border rounded-2xl my-5 grid grid-cols-2 gap-4">
                {roleParent?.map((val, i) => (
                  <div className=""
                    key={i}
                  >
                    <div className="flex items-center gap-3 mb-4"
                    >
                      <Checkbox
                        checked={val?.checked}
                        onChange={(e) => onChangeCheckbox(i, e)}
                      />
                      <label className="font-medium text-xs">
                        {val?.parent_name}
                      </label>
                    </div>
                    <AnimatedMulti
                      defaultValue={roleChiled[i]}
                      onChange={(e) => {
                        onSelect(i, e);
                      }}
                      listData={val?.mst_role_event?.map((res) => ({
                        value: res,
                        label: res?.event,
                      }))}
                      isDisabled={!val.checked}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex border-t items-center justify-end p-5">
          <button
            onClick={navigateToUserManagement}
            className="bg-[#5D5FEF] px-5 py-2 !rounded-full mr-4"
          >
            <p className="text-white text-sm">Save</p>
          </button>
        </div>
      </div>
    </div>
  );
}
