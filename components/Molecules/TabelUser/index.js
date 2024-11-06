import React, { useState } from 'react'
import ActionButton from '../../Atoms/ActionButton'
import Checkbox from '../../Atoms/Checkbox'
import SelectRole from './SelectRole'
import { formatDate } from '../../../utils/formateDate'

export default function TabelUser({ listUser, token, Actions, pageUser, sizeUser, listRole, onCheckList, isRole }) {
  return (
    <tbody>{listUser.map((val, key) => (
      <tr
        key={key}
        className="border-b">
        {isRole?.includes("Delete") && <td className="text-center">
          <div className="flex w-full items-center justify-center">
            <Checkbox
              checked={val?.checked}
              onChange={(e) => onCheckList(e, key)}
            />
          </div>
        </td>}
        <td className="text-xs font-medium ">
          {(pageUser - 1) * sizeUser + key + 1}.
        </td>
        <td className="text-xs font-medium ">
          <div>{val?.employee_name}</div>
          <div className="text-[#7D7D7D]">{val?.email}</div>
        </td>
        <td className="text-xs font-medium ">
          <SelectRole listRole={listRole} index={val?.id_profile} token={token} SelectedRole={val.role_access} />
        </td>
        <td className="text-xs font-medium ">{val?.created_at ? formatDate(val?.created_at) : "-"}</td>
        <td className="text-xs font-medium ">{val?.updated_at ? formatDate(val?.updated_at) : "-"}</td>
        <td className="text-xs font-medium ">
          <div className='max-h-20 overflow-y-auto  px-1 my-1  rounded-md break-all'>
            <ul className='w-full'>
              {val?.role_event.map((e, i) => (
                <li key={i} className='w-full'>- {e}</li>
              ))}
            </ul>
          </div>
        </td>
        <td className="text-xs ">
          <div className="flex items-center justify-around">
            {Actions?.map((res, key) => (
              <ActionButton
                key={key}
                className={res?.className}
                icon={res?.svg}
                onClick={() => res?.action(val?.id_profile)}
              />
            ))}
          </div>
        </td>
      </tr>
    ))}</tbody>
  )
}


