import React, { useState } from "react";
import ProfileList from "./ProfileList";
import ModalMarketing from "../../Molecules/ModalMarketing/Profiles";

function ProfileCard({ Role, id_profile, employee_name, position, profiles = [], refresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContextMenu = (e) => {
    // console.log("masuk sini", Role);
    // if (Role?.includes("Edit")) {
    // }
    e?.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEmployee = () => {
    console.log('masuk add profiles');
  }

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleUpdate = () => {
    console.log('Update clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <div className="text-center">
      <div className="flex justify-center items-center">
        <div onContextMenu={handleContextMenu} className="bg-gray-100 shadow-md py-4 px-2 md:p-0 rounded-lg !rounded-l-full text-center grid grid-flow-col items-center">
          <div className="md:mr-4 w-16 md:w-20">
            <img
              className="block shadow-md rounded-full"
              src={`https://randomuser.me/api/portraits/men/1.jpg`}
              alt=""
            />
          </div>
          <div className="md:text-left text-center">
            <h2 className="text-md font-semibold w-32">{employee_name}</h2>
            <p className="text-gray-700 text-sm uppercase">{position}</p>
          </div>
        </div>
      </div>
      {profiles.length > 0 && <ProfileList profiles={profiles} />}
      {profiles.length == -1 && (
        <div className="text-center mt-4">
          <button onClick={handleAddProfile}>Add Profile</button>
        </div>
      )}
      {isModalOpen && (
        <ModalMarketing
          Role={Role}
          refresh={refresh}
          id_leader={id_profile}
          addEmployee={handleAddEmployee}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProfileCard;