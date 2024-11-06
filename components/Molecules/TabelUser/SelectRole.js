import MultipleSelect from '../../Atoms/SelectInput'
import { Fetch, FetchData } from '../../../config/Api/Api';
import React, { useState } from 'react'

export default function SelectRole({ listRole,token, SelectedRole, index }) {
  const [selectedOption, setSelectedOption] = useState(SelectedRole)

  let UpdateRole = (e) => {
    let payload = {
      "id_profile": index,
      id_role: e?.id_role,
    };
    FetchData({
      methode: "POST",
      url: `/edit-profile`,
      data: payload,
      token
    })
  };

  return (
    <div className='w-[70%]'>
      <MultipleSelect
        label=""
        selectedOption={selectedOption}
        title="role_name"
        className=' !bg-[#F5F6FB] !py-1 !rounded-md !px-2'
        options={listRole}
        valueOption={(e) => {
          setSelectedOption(e)
          UpdateRole(e)
        }}
        not={-1}
        top="top-9"
      />
    </div>
  )
}
