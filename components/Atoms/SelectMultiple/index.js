import React from "react";

export default function SelectMultiple({ listData, key = "title" }) {
  return (
    <div>
      <div  className="w-full bg-[#F5F6FB] rounded-lg overflow-y-auto max-h-16 py-[1px] px-3 element-with-scrollbar flex flex-wrap items-center gap-2">
        {listData?.map((val, i) => (
          <div key={i} className="bg-custom-blue rounded-full  flex items-center my-1 px-1 py-2">
            <div className="pl-3 pr-2 text-xs font-medium text-[#5D5FEF]">
              {val[key]}
            </div>
            <div onClick={() => {}} className="pr-2 cursor-pointer">
              <svg
                width="16"
                height="16"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 13L13.5 5"
                  stroke="#212121"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.5 13L5.5 5"
                  stroke="#212121"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
