import Image from "next/image";
import React from "react";

export default function NotFound() {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center bg-white">
      <Image
        className=""
        src="/icon/notFound.svg"
        alt="Next.js Logo"
        width={300}
        height={300}
        priority
      />
    </div>
  );
}
