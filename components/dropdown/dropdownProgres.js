import { formatDateNew } from "../../utils/formateDate";
import React, { useState } from "react";

export default function DropdownProgres({ minH = true, data }) {
  const [isTrue, setIsTrue] = useState(false);
  return (
    <div>
      <div
        onClick={() => setIsTrue(!isTrue)}
        className="bg-[#F5F6FB] rounded-full flex items-center justify-between px-4 py-1 cursor-pointer"
      >
        <div className="text-[#7D7D7D] text-xs font-semibold">
          {data?.title || ""}
        </div>
        <div className="bg-[#5D5FEF] rounded-full">
          <svg
            className={`h-5 w-5 transition-transform ${
              isTrue ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke={"white"}
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

      <ol
        class={`relative  border-l ml-7 border-gray-200 dark:border-gray-400`}
      >
        {minH && !isTrue ? <div className="h-16"></div> : null}
        {isTrue ? (
          <>
            {data?.value?.map((res, i) => (
              <li key={i} class=" ml-4 flex items-center py-5">
                <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-400"></div>
                <div className="p-3 border-2 rounded-lg w-full">
                  <div className="flex justify-between items-center ">
                    <div className="text-xs font-medium text-[#7D7D7D]">
                      Remarks
                    </div>
                    <div className="text-[10px] font-medium text-[#7D7D7D]">
                      {formatDateNew(res?.updated_at, "HH:mm")}
                    </div>
                  </div>
                  <div className="text-xs ">{res?.description}</div>
                </div>
              </li>
            ))}
          </>
        ) : null}
      </ol>
    </div>
  );
}
