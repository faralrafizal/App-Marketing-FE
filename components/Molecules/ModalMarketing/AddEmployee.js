'use client'
import { GetAllUser } from "../../../config/Api/Api";
import { AddStructure } from "../../../config/Api/Marketing";
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useSession } from "next-auth/react";


function AddEmployeeModal({ onClose, id_leader, refresh }) {
  const userSession = useSession();
  const token = userSession?.data?.user?.responseResult?.token;
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dataUser, setDataUser] = useState([]);

  const handleAddEmployee = async () => {
    let data = {
      "data": [
        {
          id_leader: id_leader,
          id_profile: selectedUserId
        }
      ]
    }
    if (selectedUserId) {
      await AddStructure(data, token)
      window.location.reload();
      // refresh()
      onClose();
    }
  };

  const getUser = async () => {
    const response = await GetAllUser();
    setDataUser(response);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="bg-white w-1/6 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <div className="mb-4">
          <Select
            id="user"
            name="user"
            options={dataUser?.map((user) => ({
              value: user.id_profile,
              label: user.employee_name,
            }))}
            onChange={(selectedOption) => setSelectedUserId(selectedOption.value)}
            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            isSearchable={true}
          />
        </div>
        <button
          onClick={handleAddEmployee}
          className="block w-full text-center py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
        >
          Add Employee
        </button>
        <button
          onClick={onClose}
          className="block w-full text-left py-2 px-4 hover:bg-gray-100 mt-4 text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddEmployeeModal;
