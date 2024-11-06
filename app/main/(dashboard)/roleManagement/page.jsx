"use client";
import { useSession } from "next-auth/react";
import { ActionButton } from "../../../../components";
import Checkbox from "../../../../components/Atoms/Checkbox";
import Modal from "../../../../components/Atoms/Modal";
import ModalDelete from "../../../../components/Atoms/Modal/ModalDelete";
import NotFound from "../../../../components/Atoms/NotFound";
import Pagination from "../../../../components/Molecules/Pagination/pagination";
import { Fetch } from "../../../../config/Api/Api";
import { ShowLoading, SwalClose } from "../../../../utils/loading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token
  const Role = dataUser?.role_access["Role Management"]?.map((res) => res.event)
  const router = useRouter();
  const [selectedOptionLength, setSelectedOptionLength] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [searchRole, setSearchRole] = useState("");
  const [pageRole, setPageRole] = useState(1);
  const [sizeRole, setSizeRole] = useState(10);
  const [lenPage, setLenPage] = useState(1);

  const [listRole, setListRole] = useState([]);
  const [detailRole, setDetailRole] = useState({});

  const [dataDelete, setDataDelete] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [countChecked, setCountChecked] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);

  useEffect(() => {
    GetlistRole();
  }, [searchRole, refresh, pageRole, sizeRole]);

  let GetDetailRole = (param) => {
    Fetch({
      method: "GET",
      url: `/role-one?id_role=${param}`,
    })
      .then((res) => {
        setDetailRole(res.data?.result);
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };

  const clickDelete = (key) => {
    setDataDelete([key]);
    setOpenModalDelete(true);
  };

  const navigateToAdd = (key) => {
    router.push(`/main/roleManagement/${key}`);
  };

  let Actions = [
    {
      svg: "edit.svg",
      action: navigateToAdd,
      title: "Edit"
    },
    {
      svg: "eye.svg",
      action: GetDetailRole,
      title: "View"
    },
    {
      svg: "trash.svg",
      className: "bg-[#FF234F] border border-[#FF234F] px-2 py-2",
      action: clickDelete,
      title: "Delete"
    },
  ];

  let GetlistRole = () => {
    if (searchRole == '') {
      ShowLoading();
    }
    Fetch({
      method: "POST",
      url: `/list-role?page=${pageRole}&size=${sizeRole}&searchWord=${searchRole}`,
    })
      .then((res) => {
        console.log(res, "ini ada role");
        setListRole(
          res.data?.checkRole?.rows?.map((res) => ({ ...res, checked: false }))
        );

        let count = res.data?.checkRole?.count;
        let number = count / sizeRole;
        number = parseInt(number);
        let valCount = count % +sizeRole;
        if (valCount === 0) {
          setLenPage(number);
        } else {
          setLenPage(number + 1);
        }

      })
      .catch((err) => {
        console.log(err.response, "err");
        setLenPage(0);
        setListRole([]);
      });
    SwalClose()
  };

  let ConfirmDelete = (key) => {
    Fetch({
      method: "DELETE",
      url: `/delete-role`,
      data: { roleId: key },
    })
      .then((res) => {
        setOpenModalDelete(false);
        setRefresh(!refresh);
        setDataDelete([]);
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };

  let onCheckList = (e, index) => {
    let dataDefault = listRole;
    dataDefault[index].checked = e;
    let count = countChecked;
    if (e) {
      count += 1;
      setCountChecked(count);
    } else {
      count -= 1;
      setCountChecked(count);
    }

    if (count == dataDefault?.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
    setListRole(dataDefault);
  };

  let onCheckAll = (e) => {
    let dataDefault = listRole;
    dataDefault = dataDefault?.map((res) => ({ ...res, checked: e }));
    if (e) {
      setCountChecked(dataDefault.length);
    } else {
      setCountChecked(0);
    }
    setCheckedAll(e);
    console.log(JSON.stringify(dataDefault));
    setListRole(dataDefault);
  };

  let getListDelete = () => {
    let id = [];
    listRole?.map((res) => {
      if (res.checked) {
        id.push(res.id_role);
      }
    });
    return id;
  };

  console.log(lenPage);


  return (
    <div className="mx-7 py-3 h-screen">
      <div className="bg-white text-black rounded-xl p-5">
        <div className="flex items-center justify-between py-3 border-b mb-4">
          <div className="text-base font-bold">Role Management</div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
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
            {Role?.includes("Create") && <a
              href={"/main/roleManagement/addRole"}
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
              <div className="font-semibold text-base text-white">Add Role</div>
            </a>}
          </div>
        </div>
        {countChecked ? (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#7D7D7D]">
              {countChecked} Items Selected
            </div>
            <div>
              <ActionButton
                className={
                  "bg-[#FF234F] border border-[#FF234F] rounded-full px-3 py-2"
                }
                icon={"trash.svg"}
                title={"Delete"}
                width={20}
                height={20}
                onClick={() => clickDelete(getListDelete())}
              />
            </div>
          </div>
        ) : null}
        <div className="my-5 overflow-auto  element-with-scrollbar">
          <table className=" w-full">
            <thead>
              <tr className="text-start">
                {Role?.includes("Delete") && <th className=" bg-[#F5F6FB] rounded-l-full">
                  <div className="flex w-full items-center justify-center">
                    <Checkbox
                      checked={checkedAll}
                      onChange={(e) => onCheckAll(e)}
                    />
                  </div>
                </th>}
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-center">
                  No
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-center">
                  Nama Role
                </th>
                <th className="bg-[#F5F6FB] text-center text-xs py-3 text-[#7D7D7D]  rounded-r-full">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {listRole?.length > 0
                ? listRole?.map((val, key) => (
                  <tr key={key} className="border-b">
                    {Role?.includes("Delete") && <td className="w-[5%] text-center">
                      <div className="flex w-full items-center justify-center">
                        <Checkbox
                          checked={val?.checked}
                          onChange={(e) => onCheckList(e, key)}
                        />
                      </div>
                    </td>}
                    <td className="text-xs py-4 w-[30%] text-center">
                      {(pageRole - 1) * sizeRole + key + 1}.
                    </td>
                    <td className="text-xs py-4 flex-1 text-center">
                      {val?.role_name}
                    </td>
                    <td className="text-xs py-4 w-[130px]">
                      <div className="flex items-center justify-around">
                        {Actions?.filter((res) => Role?.includes(res.title)).map((res, key) => (
                          <ActionButton
                            key={key}
                            className={res?.className}
                            icon={res?.svg}
                            onClick={() => res?.action(val?.id_role)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
                : null}
              {/* Tambahkan baris data lainnya di sini */}
            </tbody>
          </table>
          {listRole?.length <= 0 ? <NotFound /> : null}

          {/* pagination */}
          <div className="flex items-center justify-center my-5 gap-5">
            <div className="flex items-center gap-5">
              <Pagination
                maxLenght={lenPage}
                onChange={(e) => setPageRole(e)}
                dataActived={pageRole}
                pageData={lenPage}
              />
              <select
                value={sizeRole}
                onChange={(e) => setSizeRole(e.target.value)}
                className="border-[2px] px-2 py-1 border-[#5D5FEF] rounded-full focus:outline-none"
              >
                <option value="10" className="text-sm font-medium" selected>
                  10/Page
                </option>
                <option value="30">30/Page</option>
                <option value="50">50/Page</option>
              </select>

              <div>Go to</div>
              <div>
                <input
                  type="text"
                  placeholder=""
                  inputMode="numeric"
                  onChange={(e) => { setPageRole(+e.target.value || 1) }}
                  className="rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal title={"View Details Role"} width={"w-[70%]"} isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="text-black" style={{ maxHeight: "40rem" }}>
          <div className="grid grid-cols-2 border-b py-5 gap-4">
            <div className="">
              <div className="text-[#7D7D7D] text-xs font-medium">
                Nama Role
              </div>
              <div className="text-sm font-medium py-1">
                {detailRole?.role_name}
              </div>
            </div>
            <div className="">
              <div className="text-[#7D7D7D] text-xs font-medium">
                Tingkat Role
              </div>
              <div className="text-sm font-medium py-1">
                {detailRole?.level_name}
              </div>
            </div>
          </div>
          <div className="py-5">
            <div className="text-[#7D7D7D] text-xs font-medium">
              Akses Pengguna
            </div>
            <div className="text-sm font-medium py-1">{detailRole?.system}</div>
          </div>
          {detailRole?.modules?.length > 0 ? (
            <div className="border rounded-xl grid grid-cols-2 gap-4 p-5">
              {detailRole?.modules?.map((val, key) => (
                <div key={key} className="">
                  <div className="text-[#7D7D7D] text-xs font-medium">
                    {val?.parent_name}
                  </div>
                  <div className="flex items-center py-2 gap-3 flex-wrap w-full">
                    {val?.module?.map((val2, i) => (
                      <div
                        key={i}
                        className="bg-[#F5F6FB] font-medium text-sm px-3 py-1 rounded-full text-[#5D5FEF]"
                      >
                        {val2?.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Modal >
      <ModalDelete
        isOpen={openModalDelete}
        onClose={() => {
          setOpenModalDelete(false);
          setDataDelete([]);
        }}
        title=" "
        ConfirmOk={() => ConfirmDelete(dataDelete)}
      />
    </div >
  );
}
