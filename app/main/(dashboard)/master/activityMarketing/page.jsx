"use client";
import { useSession } from "next-auth/react";
import CalendarComponent from "../../../../../components/Atoms/ButtonCalendar";
import ActivityTabel from "../../../../../components/Molecules/TabelActivityMarketing";
import ProjectStatusTabel from "../../../../../components/Molecules/TabelProjectStatus";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineRight } from "react-icons/ai";

export default function Page() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token

  const [isDaily, setIsDaily] = useState(true);
  const [isDual, setIDual] = useState(true);
  const [Role, setRole] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    if (token) {
      let MenuAccess = Object?.keys(dataUser?.role_access)
      const filteredData = (keyword) => MenuAccess?.find(item => item.toLowerCase().includes(keyword.toLowerCase()));
      let activity = filteredData("Master Activity Marketing")
      let project = filteredData("Status Project")
      if (activity && project) {
        setRole(dataUser?.role_access["Master Activity Marketing"]?.map((res) => res.event))
        setIDual(true)
      } else if (activity) {
        setRole(dataUser?.role_access["Master Activity Marketing"]?.map((res) => res.event))
        setIDual(false)
      } else if (project) {
        setRole(dataUser?.role_access["Status Project"]?.map((res) => res.event))
        setIsDaily(false)
        setIDual(false)
      }
    }
  }, [token])


  return (
    <div className="mx-7 py-3 text-black z">
      <div className="bg-white rounded-xl p-5">
        <nav className="text-gray-500 text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center cursor-pointer select-none">
              <a className="font-semibold text-sm text-black hover:text-gray-700">
                Master
              </a>
              <AiOutlineRight className="mx-2" />
            </li>
            <li class="flex items-center cursor-pointer select-none">
              <a class="text-blue-600 font-semibold text-sm hover:text-gray-700">
                Master Activity Marketing
              </a>
            </li>
          </ol>
        </nav>
        {isDual && <div className="flex items-center">
          <div className="my-3 py-2 text-sm select-none rounded font-medium cursor-pointer bg-[#F5F6FB]">
            <span
              onClick={() => {
                setIsDaily(true);
                setRole(dataUser?.role_access["Master Activity Marketing"]?.map((res) => res.event))
              }}
              className={
                "px-3 py-2 rounded " +
                (isDaily ? "bg-[#5D5FEF] text-white" : " text-[#71717A]")
              }
            >
              Daily Activity
            </span>
            <span
              onClick={() => {
                setIsDaily(false);
                setRole(dataUser?.role_access["Status Project"]?.map((res) => res.event))
              }}
              className={
                "px-3 py-2 rounded " +
                (!isDaily ? "bg-[#5D5FEF] text-white" : " text-[#71717A]")
              }
            >
              Project Status
            </span>
          </div>
        </div>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-base font-bold">Master Activity Marketing</div>

          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="bg-[#F5F6FB] px-4 py-2 rounded-full flex items-center gap-2">
              <Image
                className=""
                src="/icon/calendarIcon.svg"
                alt="Next.js Logo"
                width={20}
                height={20}
                priority
              />
              <div className="font-semibold text-base">
                <CalendarComponent />
              </div>
            </div>
            {!isDaily && Role.includes("Create") ? (
              <a
                href={"/"}
                className="bg-[#5D5FEF] px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Image
                  className=""
                  src="/icon/flagWhite.svg"
                  alt="Next.js Logo"
                  width={20}
                  height={20}
                  priority
                />
                <div className="font-semibold text-base text-white">
                  Submit Progress
                </div>
              </a>
            ) : (
              <a
                href={"/main/master/activityMarketing/addActivity"}
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
                <div className="font-semibold text-base text-white">
                  Add Activity
                </div>
              </a>
            )}
          </div>
        </div>

        {isDaily ? (
          <ActivityTabel searchTerm={searchTerm} token={token} Role={Role} />
        ) : (
          <ProjectStatusTabel searchTerm={searchTerm} token={token} Role={Role} />
        )}
      </div>
    </div>
  );
}
