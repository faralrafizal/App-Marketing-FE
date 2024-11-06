import React, { useEffect, useState } from "react";
import Modal from ".";
import Image from "next/image";
import { Fetch } from "../../../config/Api/Api";
import Checkbox from "../Checkbox";
import AnimatedMulti from "./../SelectMultiple/SelectMultipleData";

export default function ModalLocation(props) {
  const { id, onClose } = props

  const [defaultLocationChecked, setDefaultLocationChecked] = useState(false);
  const [defaultLocationValue, setDefaultLocationValue] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState([]);

  const [optionalLocationValue, setOptionalLocationValue] = useState([]);
  const [optionalLocation, setOptionalLocation] = useState([]);

  const [listLocationDefault, setListLocationDefault] = useState([]);
  const [listLocationOptional, setListLocationOptional] = useState([]);

  const [Refresh, setRefresh] = useState(false);

  useEffect(() => {
    GetListLocation()
  }, [])

  let GetListLocation = async () => {
    await Fetch({
      method: "POST",
      url: "/get-location-default",
      data: {
        id_profile: id
      }
    }).then((res) => {
      let locationD = res.data?.responseResult.map(res => ({
        value: res,
        label: res?.location_name,
        isDisabled: res.flag == "Y" ? true : false
      }))
      setListLocationDefault(locationD)
      let locationO = res.data?.responseResult.map(res => ({
        value: res,
        label: res?.location_name,
      }))
      setListLocationOptional(locationO)
      Getlocation(locationD, locationO)
    })
  }

  let Getlocation = (locationD, locationO) => {
    Fetch({
      method: "POST",
      url: `/get-all-detail-location-work`,
      data: {

        "id_profile": id,
      }
    })
      .then((res) => {
        let newDefaultLocation = []
        let newOptionalLocation = []
        res.data?.responseResult.rows.map(e => {
          let { 'mst_location.location_name': location_name, ...rest } = e;
          let newObj = { location_name, ...rest };
          return newObj
        }).map(e => {
          if (e.is_default == "Y") {
            newDefaultLocation.push(e)
          } else {
            newOptionalLocation.push(e)
          }
        })
        setOptionalLocationValue(newOptionalLocation)
        setOptionalLocation(newOptionalLocation.map(res =>
          locationD.find(d => d.label == res.location_name)
        ))

        if (newDefaultLocation.length) setDefaultLocationChecked(true)
        setDefaultLocationValue(newDefaultLocation)
        setDefaultLocation(newDefaultLocation.map(res => locationO.find(d => d.label == res.location_name)))
        setRefresh(!Refresh)
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  };

  // console.log(defaultLocation)

  let updateLocation = async () => {
    let dataUpdate = []
    let dataDelete = []
    let dataAdd = []
    let listID = []

    let listBefore = [...defaultLocationValue, ...optionalLocationValue]

    const findData = (id) => listBefore.find(e => e.id_location == id)


    if (defaultLocationChecked) {
      defaultLocation.map(e => {
        let data = findData(e.value.id_location)
        if (!data) {
          dataAdd.push({
            "id_profile": id,
            "id_location": e.value.id_location,
            "is_default": "Y"
          })
        } else {
          if (data.is_default != "Y") {
            dataUpdate.push({
              "id_profile": id,
              "id_location": data.id_location,
              "is_default": "Y"
            })
          }
        }
        listID.push(e.value.id_location)
      })
    }

    optionalLocation.map(e => {
      let data = findData(e.value.id_location)
      if (!data) {
        dataAdd.push({
          "id_profile": id,
          "id_location": e.value.id_location,
          "is_default": "N"
        })
      } else {
        if (data.is_default == "Y") {
          dataUpdate.push({
            "id_profile": id,
            "id_location": data.id_location,
            "is_default": "N"
          })
        }
      }
      listID.push(e.value.id_location)
    })
    dataDelete = listBefore.filter(e => !listID.includes(+e.id_location)).map(f => f.id_detail_location_work)
    let body = {
      dataDelete,
      dataUpdate,
      dataAdd
    }

    return await Fetch({
      method: "PUT",
      url: `/update-detail-work`,
      data: body
    })
      .then((res) => {
        console.log(res.data)
        onClose()
      })
      .catch((err) => {
        console.log(err.response, "err");
      });
  }

  return (
    <Modal {...props} title={"Add Location User"} classNameheader="" width="w-[60%]">
      {<div className="border px-5 pt-5 pb-20 rounded-lg">
        <div className="mb-3 font-semibold">Location</div>
        <div className=" flex items-center gap-10 ">
          <div className=" w-[49%] gap-5">
            <div className="text-sm mb-2 font-medium">Default Location</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={defaultLocationChecked}
                  onChange={(e) => setDefaultLocationChecked(e)}
                />
                <div className="flex-1">
                  <AnimatedMulti
                    defaultValue={defaultLocation}
                    onChange={(e) => {
                      // onSelect(i, e);
                      setDefaultLocation(e)
                    }}
                    maxMenuHeight={140}
                    listData={listLocationDefault?.filter(e => !optionalLocation.some(d => d?.label == e?.label))}
                    isDisabled={!defaultLocationChecked}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" w-[49%] gap-5">
            <div className="text-sm mb-2 font-medium">Additional Location</div>
            <div className="flex-1">
              <div>
                <AnimatedMulti
                  defaultValue={optionalLocation}
                  onChange={(e) => {
                    // onSelect(i, e);
                    setOptionalLocation(e)
                  }}
                  maxMenuHeight={140}
                  listData={listLocationOptional?.filter(e => !defaultLocation.some(d => d?.label == e?.label))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>}
      <div className='flex items-center justify-end border-t-2 mt-4 pt-3 '>
        <div>
          <button
            onClick={() => { props?.onClose() }}
            className="bg-gray-200 hover:bg-gray-300 rounded-full text-[#7D7D7D] text-sm font-bold py-2 px-5 "
          >
            Cancel
          </button>
          <button
            onClick={() => { updateLocation() }}
            className="bg-[#5D5FEF] ml-5 hover:bg-[#5052d3] rounded-full text-white text-sm font-bold py-2 px-10 "
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
