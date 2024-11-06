"use client";
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Field } from '../../../../components';
import Image from 'next/image';
import { EditProfile, Fetch } from '../../../../config/Api/Api';
import { useRouter } from 'next/navigation';
import { accessRole } from '../../../../utils/checkAccess';
import { useSession } from "next-auth/react";
import MultipleSelect from '../../../../components/Atoms/SelectInput';

export default function Profile() {
  const userSession = useSession();
  const dataUser = userSession?.data?.user?.responseResult;
  const token = dataUser?.token

  const router = useRouter();
  const [Role, setRole] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [selectMenu, setSelectMenu] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [listLocation, setListLocation] = useState([]);
  const [editPassword, setEditPassword] = useState({ CurrentPassword: "", NewPassword: "", ConfirmPassword: "" });
  const menu = [
    {
      title: "Basic Information"
    }, {
      title: "Security"
    }]

  const [selectedLocation, setSelectedLocation] = useState({
    id_location: "",
    location_name: "Select"
  })

  let GetListLocation = () => {
    Fetch({
      method: "POST",
      url: "/get-all-location-city",
      token: token
    }).then((res) => {
      setListLocation([
        {
          id_location : "",
          location_name: "Select",
        },
        ...res.data?.responseResult?.rows
      ])
    })
  }

  let GetUserProfile = () => {
    if(dataUser) {
      Fetch({
        method: "GET",
        url: "/get-one-user?id=" + dataUser?.id_profile,
        token: token
      }).then((res) => {
        let result = res?.data?.responseResult
        setEditProfile(res?.data?.responseResult)
        setSelectedLocation({
          "id_location" : result?.mst_location?.id_location,
          "location_name" : result?.mst_location?.location_name,
        })
      })
    }
  }

  useEffect(() => {
    GetUserProfile()
    GetListLocation();
    // setIsEdit(Role?.includes("Edit"));
    // if (token) {
    //   setRole(dataUser?.role_access["Profile"]?.map((res) => res.event))
    //   let dataProfile = dataUser;    
    
    //   setSelectedLocation({
    //     "id_location" : dataUser?.location?.id_location,
    //     "location_name" : dataUser?.location?.location_name,
    //   })

    //   delete dataProfile?.token
    //   delete dataProfile?.role_access

    //   setEditProfile(dataProfile)
    // }
  }, [refresh, dataUser])

  let onChangeEdit = (e, key) => {
    setEditProfile({ ...editProfile, [key]: e })
  }

  let onChangePass = (e, key) => {
    setEditPassword({ ...editProfile, [key]: e })
  }



  let saveData = async () => {
    let body = {
      "id_profile": editProfile?.id_profile,
      "employee_name": editProfile?.name,
      "phone_number": editProfile?.phone_number,
      "email": editProfile?.email,
      "id_location" : selectedLocation?.id_location | null,
    }
    if (editPassword.CurrentPassword && editPassword.NewPassword && editPassword.ConfirmPassword) {
      if (editPassword.NewPassword || editPassword.ConfirmPassword) {
        body.password =  editPassword.ConfirmPassword
      }
    }
    // return console.log(body, "<<<<<<<<<====");
    let result = await EditProfile(body)
    console.log(result);
    if (result?.code == 1) {
      window.location.reload();
    }

  }

  return (
    <div className="mx-7 py-3 h-screen">
      <div className="bg-white text-black rounded-xl p-5">
        <div className='text-base font-bold'>Account Settings</div>
        <div className='text-sm font-medium text-gray-400'>Here you can manage your account.</div>
        <div className='flex my-3'>
          <div className='bg-gray-100 rounded-md flex gap-1'>
            {menu.map((res, i) => (<div key={i} onClick={() => setSelectMenu(i)} className={`font-medium cursor-pointer p-3 ${selectMenu == i ? "bg-[#5D5FEF] rounded-md text-white" : "text-gray-400"}`}>{res.title}</div>))}
          </div>
        </div>
        <hr />
        <div className='flex items-center gap-5 my-3'>
          <div className='w-[20%] justify-center border rounded-lg p-2'>
            {selectMenu == 0 ? <div className='p-3'>
              <div className='flex justify-center my-4'>
                <Image
                  src="/image/image-profile.png"  // Replace with the actual path to your image in the public directory
                  alt="Description of the image"
                  width={100}  // Set the desired width of the image
                  height={100}  // Set the desired height of the image
                />
              </div>
              <div className='flex justify-center my-4'>
                <div className='font-semibold text-center'>Profile Picture</div>
              </div>
              <div className='flex justify-center my-4'>
                <button className='rounded-full font-semibold border border-[#5D5FEF] px-4 py-2 text-[#5D5FEF]'>Upload Image</button>
              </div>

              <div className='flex justify-center my-4'>
                <button className='rounded-full font-semibold border border-gray-200 px-4 py-2 text-gray-400 bg-gray-200'>Remove</button>
              </div>

              <div className='flex justify-center my-4'>
                <div className='text-gray-400'>File size: maximum 10,000,000 bytes (10 Megabytes). Allowed file extensions: .JPG .JPEG .PNG</div>
              </div>
            </div> :
              <div className='p-3'>
                <Image
                  src="/image/password.svg"  // Replace with the actual path to your image in the public directory
                  alt="Description of the image"
                  width={100}  // Set the desired width of the image
                  height={100}  // Set the desired height of the image
                  layout="responsive"  //
                />
                <div className='font-medium'>Hai, <span className='font-semibold'>Annisa Safitri</span></div>
                <div className=' text-gray-400'>Set a unique password to protect your account.</div>
              </div>}
          </div>
          <div className='flex-1'>
            {selectMenu == 0 ? <div>
              <div className='grid grid-cols-2 items-center gap-4'>
                <div className="">
                  <Field
                    label="Username"
                    id="paket"
                    name="paket"
                    type="text"
                    value={editProfile?.username}
                    onChange={(e) => onChangeEdit(e.target.value, "username")}
                    placeholder="Input Username"
                    className="!h-11"
                    disabled={!isEdit}
                  />
                </div>
                <div className="">
                  <div>
                    <label for='phone_number' >
                      <div className='text-sm font-semibold'>Phone Number</div>
                      <div className='!h-11 flex my-5 items-center border rounded-full border-gray-300 py-2 px-3 focus:outline-none   focus:border-transparent focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                        <div className='mr-1 text-gray-400'>
                          +62 |
                        </div>
                        <input disabled={!isEdit} id='phone_number' type='text' onChange={(e) => onChangeEdit(e.target.value, "phone_number")} value={editProfile?.phone_number} />
                      </div>
                    </label>
                  </div>

                </div>
                <div className="">
                  <Field
                    label="Email"
                    id="paket"
                    name="paket"
                    type="text"
                    value={editProfile?.email}
                    onChange={(e) => onChangeEdit(e.target.value, "email")}
                    placeholder="Input Email"
                    className="!h-11"
                    disabled={!isEdit}
                  />
                </div>
                <div className="">
                  <Field
                    label="Occupation"
                    id="paket"
                    name="paket"
                    type="text"
                    value={editProfile?.position}
                    onChange={(e) => setPaket(e.target.value)}
                    placeholder="Input Occupation"
                    className="!h-11"
                    disabled={!isEdit}
                  />
                </div>
                {/* <div>
                  <MultipleSelect
                    label="Location"
                    selectedOption={selectedLocation}
                    title="location_name"
                    options={listLocation}
                    valueOption={(e) => setSelectedLocation(e)}
                  />
                </div> */}
              </div>
              <hr />
              {isEdit && <div className='flex  my-4'>
                <button onClick={() => saveData()} className='rounded-full font-semibold bg-[#5D5FEF] px-4 py-2 text-white'>Save Changes</button>
              </div>}
            </div> :
              <div>
                <div className='grid grid-cols-2 items-center gap-4'>
                  <div className="col-span-2">
                    <Field
                      label="Current Password"
                      id="paket"
                      name="paket"
                      type="text"
                      value={editPassword?.CurrentPassword}
                      // onChange={(e) => onChangePass(e.target.value, "CurrentPassword")}
                      onChange={(e) => setEditPassword({ ...editPassword, CurrentPassword: e.target.value })}
                      placeholder="Input Current Password"
                      className="!h-11"
                      disabled={!isEdit}
                    />
                  </div>
                  <div className="">
                    <Field
                      label="New Password"
                      id="paket"
                      name="paket"
                      type="text"
                      value={editPassword?.NewPassword}
                      onChange={(e) => setEditPassword({ ...editPassword, NewPassword: e.target.value })}
                      placeholder="Input New Password"
                      className="!h-11"
                      disabled={!isEdit}
                    />
                  </div>
                  <div className="">
                    <Field
                      label="Confirm Password"
                      id="paket"
                      name="paket"
                      type="text"
                      value={editPassword?.ConfirmPassword}
                      // onChange={(e) => onChangePass(e.target.value, "ConfirmPassword")}
                      onChange={(e) => setEditPassword({ ...editPassword, ConfirmPassword: e.target.value })}
                      placeholder="Input Confirm Password"
                      className="!h-11"
                      disabled={!isEdit}
                    />
                  </div>
                </div>
                <hr />
                {isEdit && <div className='flex  my-4'>
                  <button onClick={() => saveData()} className='rounded-full font-semibold bg-[#5D5FEF] px-4 py-2 text-white'>Save Changes</button>
                </div>}
              </div>}
          </div>
        </div>
      </div>
    </div >
  )
}
