"use client";
import { useEffect, useState } from "react";

function Pagination({ maxLenght = 5,dataActived=1, onChange = () => {} }, pageData = 1) {
  const [listData, setlistData] = useState([]);
  const [dataActive, setdataActive] = useState(1);
  // console.log(ActivePage,"ActivePage")

  useEffect(() => {
    onChange(dataActive); 
  }, [dataActive]);

  useEffect(() => {
    setdataActive(+dataActived);
  }, [dataActived]);

  useEffect(() => {
    if (maxLenght > 5) {
      setlistData([1, 2, 3, "...", maxLenght]);
    } else {  
      var angkaBerurutan = [];

      for (var i = 1; i <= maxLenght; i++) {
        angkaBerurutan.push(i);
      }
      setlistData(angkaBerurutan);
    }
  }, [maxLenght]);

  const clickdataNext = () => {
    if (maxLenght > dataActive) {
      if (maxLenght - listData[2] == 3) {
        setlistData([
          listData[0] + 1,
          listData[1] + 1,
          listData[2] + 1,
          listData[2] + 2,
          maxLenght,
        ]);
        setdataActive(dataActive + 1);
      } else if (dataActive == listData[2] && maxLenght - listData[2] > 3) {
        setlistData([
          listData[0] + 1,
          listData[1] + 1,
          listData[2] + 1,
          "...",
          maxLenght,
        ]);
        setdataActive(listData[2] + 1);
      } else {
        setdataActive(dataActive + 1);
      }
    }
  };

  const clickdataPrev = () => {
    if (dataActive >= 0) {
      if (dataActive <= 3 && dataActive != listData[0] && dataActive > 1) {
        setdataActive(dataActive - 1);
      } else if (maxLenght - dataActive < 4) {
        setlistData([
          maxLenght - 4,
          maxLenght - 3,
          maxLenght - 2,
          maxLenght - 1,
          maxLenght,
        ]);
        setdataActive(dataActive - 1);
      } else {
        if (dataActive > 1) {
          setlistData([
            listData[0] - 1,
            listData[1] - 1,
            listData[2] - 1,
            "...",
            maxLenght,
          ]);
          setdataActive(dataActive - 1);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="py-1 px-3 bg-[#F5F6FB] cursor-pointer rounded-full select-none"
        onClick={() => clickdataPrev()}
      >
        {"<"}
      </div>
      <div className=" flex items-center gap-2">
        {listData?.map((data, key) => (
          <div
            key={key}
            onClick={() => data != "..." && setdataActive(data)}
            className={`p-1 cursor-pointer px-3 ${
              dataActive == data ? "bg-[#5D5FEF]" : ""
            } rounded-full overflow-hidden`}
          >
            <div
              className={`text-base font-medium ${
                dataActive == data ? "text-white" : ""
              }`}
            >
              {data}
            </div>
          </div>
        ))}
      </div>
      <div
        className="py-1 px-3 bg-[#F5F6FB] cursor-pointer rounded-full select-none"
        onClick={() => clickdataNext()}
      >
        {">"}
      </div>
    </div>
  );
}

export default Pagination;
