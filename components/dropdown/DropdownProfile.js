"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function DropdownProfile({
  htmlContent,
  tailwindClasses,
  options,
  svg = false,
}) {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const [isOpen, setIsOpen] = useState(false);
  const [Profile, setProfile] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  var username
  var position

  if (typeof window !== 'undefined') {
    username = sessionStorage.getItem('username');
    position = sessionStorage.getItem('position');
  }

  useEffect(() => {
    setProfile({ username: dataUser?.username, position: dataUser?.position })
  }, [dataUser])


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const logOut = async () => {

    await signOut();
    window.location.href = '/auth/login';
  }

  const redirectProfile = () => {
    window.location.href = '/main/profile';
  }


  return (
    <div className="relative inline-block">
      <div
        className="bg-white flex items-center gap-3  p-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="rounded-full bg-zinc-500 overflow-hidden">
          <Image
            className=""
            src={`/icon/imageProfile.svg`}
            alt="Next.js Logo"
            width={40}
            height={40}
            priority
          />
        </div>
        <div>
          <div className="text-lg font-semibold select-none">
            <p>
              {Profile?.username}
            </p>
          </div>
          <div className=" text-xs font-medium text-[#7D7D7D] select-none">
            <p>
              {Profile?.position}
            </p>
          </div>
        </div>
        <svg
          className={`h-5 w-5 ml-5 transition-transform ${isOpen ? "transform rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute z-50 w-[100%] left-0 mt-2  bg-white border border-gray-300 rounded-md shadow-lg">
          <li
            // key={i}
            onClick={() => selectOption()}
          >
          </li>
          <li onClick={redirectProfile} className="cursor-pointer px-2 py-3 flex gap-3 items-center hover:bg-gray-100">
            {svg && (
              <Image
                className=""
                src={`/icon/account.svg`}
                alt="Next.js Logo"
                width={20}
                height={50}
                priority
              />
            )}
            <a href="/main/profile" className="font-medium">Account Settings</a>
          </li>
          <li onClick={logOut} className="cursor-pointer px-2 pb-5 py-3 flex gap-3 items-center hover:bg-gray-100">
            {svg && (
              <Image
                className=""
                src={`/icon/logout.svg`}
                alt="Next.js Logo"
                width={20}
                height={50}
                priority
              />
            )}
            <button type="button" className="font-medium text-[#FF234F]">Sign Out</button>
          </li>
        </ul>
      )}
    </div>
  );
}
