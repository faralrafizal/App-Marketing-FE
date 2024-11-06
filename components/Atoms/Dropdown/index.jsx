import React, { useState } from "react";

export default function DropdownNew({
  children,
  title,
  className,
  show = false,
}) {
  const [isShow, setIsShow] = useState(show);
  return (
    <div className={"w-100 " + className}>
      <div onClick={() => setIsShow(!isShow)} className="cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="text-black text-sm font-semibold">{title}</div>
          <div>
            <svg
              className={`h-5 w-5 ml-5 transition-transform ${
                isShow ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke={"#7D7D7D"}
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
        </div>
      </div>
      {isShow && <div>{children}</div>}
    </div>
  );
}
