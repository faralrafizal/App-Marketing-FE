"use client";
import { useSession } from "next-auth/react";
import { ActionButton } from "../../../../components";
import Checkbox from "../../../../components/Atoms/Checkbox";
import Modal from "../../../../components/Atoms/Modal";
import ModalDelete from "../../../../components/Atoms/Modal/ModalDelete";
import ModalLocation from "../../../../components/Atoms/Modal/ModalLocation";
import NotFound from "../../../../components/Atoms/NotFound";
import Pagination from "../../../../components/Molecules/Pagination/pagination";
import TabelUser from "../../../../components/Molecules/TabelUser";
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
  const Role = dataUser?.role_access["User Management"]?.map((res) => res.event)

  const router = useRouter();
  const [selectedOptionLength, setSelectedOptionLength] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [AddLocation, setAddLocation] = useState(false);
  const [IdUserLokasi, setIdUserLokasi] = useState(false);

  const [searchUser, setSearchUser] = useState("");
  const [pageUser, setPageUser] = useState(1);
  const [sizeUser, setSizeUser] = useState(10);
  const [lenPage, setLenPage] = useState(1);
  const [DetailUser, setDetailUser] = useState(null);

  const [listUser, setListUser] = useState([]);
  const [listRole, setListRole] = useState([]);

  const [countChecked, setCountChecked] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);
  const [Refresh, setRefresh] = useState(false);


  const clickdata = (nilai) => {
    setDetailUser(nilai);
    setOpenModal(true);
  };

  const clickDelete = (nilai) => {
    console.log(nilai);
    setDetailUser(nilai);
    setOpenModalDelete(true);
  };
  const clickLocation = (nilai) => {
    // console.log(nilai, "pppppppppppppp");
    setIdUserLokasi(nilai);
    setAddLocation(true);
  };

  const navigateToAdd = (nilai) => {
    router.push(`/main/userManagement/${nilai}`);
  };

  useEffect(() => {
    if (token) {
      GetlistUser();
      GetlistRole();
    }
  }, [Refresh, pageUser, sizeUser, token]);

  let GetlistRole = () => {
    Fetch({
      method: "POST",
      url: `/list-role`,
      token
    })
      .then((res) => {
        setListRole([...res.data?.checkRole?.rows]);
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };

  let GetlistUser = () => {
    // console.log(pageUser, sizeUser);
    if (searchUser == '') {
      ShowLoading();
    }
    Fetch({
      method: "POST",
      url: `/get-all-user?page=${pageUser}&size=${sizeUser}&searchWord=${searchUser}`,
      token
    })
      .then((res) => {
        let dataResult = res.data?.responseResult?.rows?.map((res) => ({
          ...res,
          checked: false,
        }));
        setListUser(dataResult);

        let count = res.data?.responseResult?.count;
        let number = count / sizeUser;
        number = parseInt(number);
        let valCount = count % +sizeUser;
        if (valCount === 0) {
          setLenPage(number);
        } else {
          setLenPage(number + 1);
        }

      })
      .catch((err) => {
        console.log(err.response, "err");
        setLenPage(0);
        setListUser([]);
      });

    SwalClose()
  };


  let DeletelistUser = (id) => {
    Fetch({
      method: "DELETE",
      url: `/delete-user`,
      data: { id: id },
    })
      .then((res) => {
        GetlistUser();
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
    setOpenModalDelete(false);
  };

  let Actions = [
    {
      svg: "edit.svg",
      action: navigateToAdd,
      title: "Edit",
      value: "Edit"
    },
    {
      svg: "eye.svg",
      action: clickdata,
      title: "View",
      value: "View"
    },
    {
      svg: "location-add.svg",
      action: clickLocation,
      title: "Location",
      value: "Set Location"
    },
    {
      svg: "trash.svg",
      className: "bg-[#FF234F] border border-[#FF234F] px-2 py-2",
      action: clickDelete,
      title: "Delete",
      value: "Delete",
    },
  ];

  const ViewDetail = () => {
    let data = listUser.find((res) => res.id_profile == DetailUser);
    let dataNew = [
      {
        title: "Nama Pengguna",
        value: data?.employee_name,
      },
      {
        title: "Email Pengguna",
        value: data?.email,
      },
      {
        title: "Default Location",
        value: data?.detail_location_work?.default,
      },
      {
        title: "Additional Location",
        value: data?.detail_location_work?.additional,
      },
      {
        title: "Roles",
        value: data?.role_access?.role_name,
      },
    ];
    return dataNew;
  };

  let onCheckList = (e, index) => {
    let dataDefault = listUser;
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
    setListUser(dataDefault);
  };

  let onCheckAll = (e) => {
    let dataDefault = listUser;
    dataDefault = dataDefault?.map((res) => ({ ...res, checked: e }));
    if (e) {
      setCountChecked(dataDefault.length);
    } else {
      setCountChecked(0);
    }
    setCheckedAll(e);
    setListUser(dataDefault);
  };

  let getListDelete = () => {
    let id = [];
    listUser?.map((res) => {
      if (res.checked) {
        id.push(res.id_profile);
      }
    });
    return id;
  };

  return (
    <div className="mx-7 py-3 h-screen">
      <div className="bg-white text-black rounded-xl p-5 ">
        <div className="flex items-center justify-between py-3 border-b mb-4 b    ">
          <div className="text-base font-bold">User Management</div>
          <div className="flex items-center gap-5">
            <div className="rounded-full flex border p-1 overflow-hidden border-gray-300 focus:outline-none">
              <input
                type="text"
                placeholder="Search..."
                value={searchUser}
                onChange={(e) => { setSearchUser(e.target.value); setRefresh(!Refresh) }}
                // onBlur={() => setRefresh(!Refresh)}
                className="py-1 px-6  "
              />
              <Image
                className=" text-gray-400 mr-3 cursor-pointer"
                src="/icon/search.svg"
                alt="Next.js Logo"
                width={20}
                height={20}
                priority
              />
            </div>

            {Role?.includes("Create") && <a
              href={"/main/userManagement/addUser"}
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
              <div className="font-semibold text-base text-white">Add User</div>
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
        <div className="my-5 overflow-hidden  element-with-scrollbar">
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
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] rounded-l-full pl-3 text-start">
                  No
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-start">
                  Nama Pengguna
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-start">
                  Role
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-start">
                  Tanggal Daftar
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-start">
                  Terakhir Di Perbaruhi
                </th>
                <th className="bg-[#F5F6FB] text-xs py-3 text-[#7D7D7D] text-start">
                  Akses
                </th>
                <th className="bg-[#F5F6FB] text-center text-xs py-3 text-[#7D7D7D]  rounded-r-full">
                  Action
                </th>
              </tr>
            </thead>

            {listUser?.length > 0 ? (
              <TabelUser
                isRole={Role}
                listUser={listUser}
                listRole={listRole}
                Actions={Actions.filter((res) => [...Role, "Location"]?.includes(res.title))}
                pageUser={pageUser}
                sizeUser={sizeUser}
                onCheckList={onCheckList}
                token={token}
              />
            ) : null}
            {/* Tambahkan baris data lainnya di sini */}
          </table>
          {listUser?.length <= 0 ? <NotFound /> : null}

          {/* pagination */}
          <div className="flex items-center justify-center my-5 gap-5">
            <div className="flex items-center gap-5">
              <Pagination
                maxLenght={lenPage}
                onChange={(e) => setPageUser(e)}
              />
              <select
                value={sizeUser}
                onChange={(e) => setSizeUser(e.target.value)}
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
                  // value={searchTerm}
                  // onChange={handleSearch}
                  inputMode="numeric"
                  className=" rounded-full px-2 py-[1px] border-[2px] w-20 border-[#5D5FEF] focus:outline-none "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="text-black">
          <div className={"grid grid-cols-2 gap-4"}>
            {ViewDetail()?.map((val, key) => (
              <div className=""
                key={key}
              >
                <div className="text-[#7D7D7D] text-xs font-medium">
                  {val?.title}
                </div>
                <div className="text-sm font-medium py-1">{val?.title.includes('Location') ? <ul>{val?.value?.map((e,i) => <li key={i}>- {e}</li>)}</ul> : val?.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <ModalDelete
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        ConfirmOk={() => DeletelistUser([DetailUser])}
        title=" "
      />
      {AddLocation && <ModalLocation
        isOpen={AddLocation}
        onClose={() => setAddLocation(false)}
        id={IdUserLokasi}
        // ConfirmOk={() => DeletelistUser([DetailUser])}
        title=" "
      />}
    </div>
  );
}
