"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DropdownMaster from "../dropdown/DropdownMaster";
import { usePathname, useRouter } from "next/navigation";
import { accessRoleMenu } from "../../utils/checkAccess";
import { useSession } from "next-auth/react";

export default function Menu() {
  const userSession = useSession();
  const Role = userSession?.data?.user?.responseResult.role_access;

  const router = useRouter();
  const [masterOption, setMasterOption] = useState("");
  const [MenuAccess, setMenuAccess] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    if (Role)
      setMenuAccess(Object.keys(Role))
  }, [Role])

  const filteredData = (keyword) => MenuAccess?.find(item => item.toLowerCase().includes(keyword.toLowerCase()));

  const menus = [
    {
      svg: "dashboard",
      title: "Dashboard",
      desc: "Dashboard",
      link: "/main/dashboard",
    },
    {
      svg: "uploadSirup",
      title: "Upload SIRUP",
      desc: "Sirup",
      link: "/main/uploadSirup/addSirup",
    },
    { svg: "master", title: "Master", desc: "Indonesia", link: "/master" },
    {
      svg: "monitoring",
      title: "Monitoring Project",
      desc: "Monitoring Project",
      link: "/main/monitoringProject",
    },
    {
      svg: "calender",
      title: "Calender",
      desc: "Calender Event",
      link: "/main/calendar",
    },
    {
      svg: "uploadSirup",
      title: "User Management",
      desc: "User Management",
      link: "/main/userManagement",
    },
    {
      svg: "master",
      title: "Role Management",
      desc: "Role Management",
      link: "/main/roleManagement",
    },
  ];

  const searchMenu = () => {
    return menus.findIndex((e) => pathname.includes(e?.link));
  };

  const [isOpen, setIsOpen] = useState(searchMenu(pathname) || 0);

  useEffect(() => {
    let keynum = searchMenu(pathname);
    if (keynum >= 0) {
      setIsOpen(keynum);
    }
  }, [pathname]);

  const options = [
    { title: "Master Project", link: "/main/master/project" },
    { title: "Master Marketing & Coordinator", link: "/main/master/marketing" },
    { title: "Master Activity Marketing", link: "/main/master/activityMarketing" },
    { title: "Master Location", link: "/main/master/location" },
    { title: "Master Procurement Type", link: "/main/master/procurement" },
    { title: "Master Keyword", link: "/main/master/keyword" }
  ];

  return (
    <div className="flex py-3 gap-2 mx-8 flex-wrap items-center">
      {menus.map((res, key) => (
        <div key={key}>
          {key != 2 ? (MenuAccess.includes(res.desc) && (
            <a
              href={`${res.link}`}
              key={key}
              // onClick={() => {
              //   // showLoading();
              //   router.push(res.link);
              // }}
              className={`flex items-center cursor-pointer py-2 px-4 gap-2 ${key == isOpen
                ? "bg-[#5D5FEF] text-white  rounded-full"
                : " text-[#7D7D7D]"
                }`}
            >
              <Image
                className=""
                src={`/icon/${key == isOpen ? `${res?.svg}Active` : res?.svg
                  }.svg`}
                alt="Next.js Logo"
                width={20}
                height={20}
                priority
              />
              <div className="font-semibold whitespace-nowrap">
                {res?.title}
              </div>
            </a>
          )) : (
            <div>
              {filteredData("master") && <DropdownMaster
                title={res?.title}
                svg={key == isOpen ? `${res?.svg}Active` : res?.svg}
                classTitle={`font-semibold py-2 px-4 text-[#7D7D7D] ${key == isOpen
                  ? "bg-[#5D5FEF] text-white  rounded-full"
                  : " text-[#7D7D7D]"
                  }`}
                options={options.filter((res) =>
                  res.title == "Master Activity Marketing" ?
                    filteredData("Status Project")
                      || filteredData("Master Activity Marketing")
                      || filteredData("Master Lokasi")
                      || filteredData("Master Jenis Pengadaan")
                      || filteredData("Master Keyword")
                      ? res : false
                    : MenuAccess.includes(res.title))}
                selected={pathname}
              />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
