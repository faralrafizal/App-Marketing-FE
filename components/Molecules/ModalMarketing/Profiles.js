import React, { useState } from 'react';
import AddEmployeeModal from './AddEmployee';
import ModalDelete from '../../Atoms/Modal/ModalDelete';
import SwitchEmployee from './SwitchEmployee';
import { Fetch } from '../../../config/Api/Api';
import { ShowLoading, SwalClose } from '../../../utils/loading';
import { useSession } from "next-auth/react";

export default function ModalMarketing({ Role, onClose, onEdit, onUpdate, onDelete, addEmployee, id_leader, refresh }) {
    const userSession = useSession();
    const token = userSession?.data?.user?.responseResult?.token;
    const [activeModal, setActiveModal] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalSwitch, setModalSwitch] = useState(false);


    const handleCloseModal = () => {
        setActiveModal(null);
        onClose();
    };

    let deleteProfile = async () => {
        ShowLoading();
        let updateDown = await Fetch({
            method: "PUT",
            url: '/update-down-structure-organ',
            data: { "data": [id_leader] },
            token: token
        })

        let updateUp = await Fetch({
            method: "PUT",
            url: '/update-up-structure-organ',
            data: { "data": [id_leader] },
            token: token
        })
        onClose();
        SwalClose();
        window.location.reload();
    }


    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
            <div className="bg-white w-1/6 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Options</h2>
                {/* {Role?.includes("Create") && <button
                    onClick={() => {
                        setActiveModal('addEmployee');
                    }}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                >
                    Add Employee
                </button>} */}
                <button
                    onClick={() => {
                        setActiveModal('addEmployee');
                    }}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                >
                    Add Employee
                </button>
                {/* <button
                onClick={() => {
                    setActiveModal('switchEmployee');
                    setModalSwitch(true);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                >
                Switch Employee
                </button> */}
                {/* <button
                onClick={() => {
                    setActiveModal('editEmployee');
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                >
                Edit Employee
                </button> */}
                <button
                    onClick={() => {
                        setActiveModal('deleteEmployee');
                        setModalDelete(true);
                    }}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 text-red-600"
                >
                    Delete
                </button>
                <button
                    onClick={onClose}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 mt-4 text-gray-600"
                >
                    Cancel
                </button>
            </div>

            {activeModal === 'addEmployee' && (
                <AddEmployeeModal
                    refresh={refresh}
                    id_leader={id_leader}
                    onClose={handleCloseModal}
                />
            )}

            {activeModal === 'switchEmployee' && (
                <SwitchEmployee
                    isOpen={modalSwitch}
                    onClose={() => setModalSwitch(false)}
                    ConfirmOk={() => { }}
                    title="Switch Employee"
                />
            )}

            {activeModal === 'editEmployee' && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <div className="bg-white w-1/3 p-4 rounded-lg shadow-lg">
                        <h1>modal edit sub</h1>
                    </div>
                </div>
            )}
            {activeModal === 'deleteEmployee' && (
                <ModalDelete
                    isOpen={modalDelete}
                    onClose={() => setModalDelete(false)}
                    ConfirmOk={() => { deleteProfile() }}
                    title="Delete Structur Organ"
                />
            )}
        </div>
    );
}
