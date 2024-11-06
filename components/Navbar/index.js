'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Dropdown from "../dropdown";
import DropdownProfile from "../dropdown/DropdownProfile";
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import Link from "next/link";
import Menu from "./menu";
import { useSession } from "next-auth/react";

function Navbar() {
  const Route = useRouter();
  const [token, setToken] = useState('')
  const userSession = useSession();

  useEffect(() => {
    if (userSession) {
      setToken(userSession?.data?.user?.responseResult);
      // if(!token) return Route.push('/login')
    }
  }, [userSession]);

  const htmlContent = `<h1 class="bg-red-500">Hello, Next.js with Tailwind CSS!</h1><div>hallo</div>`;
  const tailwindClasses = "text-2xl text-blue-500";
  return (
    <div className="bg-white mx-auto text-black ">
      <div className="flex justify-between items-center ">
        <div className="flex py-5 px-3 gap-5">
          <Image
            src="/icon/logoCompany.svg"
            alt="Next.js Logo"
            width={300}
            height={50}
            priority
          />
          <div className="bg-[#D9D9D9] w-[1.1px] " />

        </div>
        <div className="px-3 flex items-center gap-3">
          <Image
            className="pr-1"
            src="/icon/notification.svg"
            alt="Next.js Logo"
            width={25}
            height={25}
            priority
          />
          <DropdownProfile
            htmlContent={htmlContent}
            tailwindClasses={tailwindClasses}
            svg={true}
          />
        </div>
      </div>
      <hr />
      <Menu />
    </div>
  );
}

export default Navbar;
