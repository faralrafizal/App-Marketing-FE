'use client';
import React, { useEffect, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import ProfileCard from '../../../../../components/Atoms/OrgChart/ProfileCard';
import { Button } from '../../../../../components';
import { GetStructureData } from '../../../../../config/Api/Api';
import ModalBody from '../../../../../components/Molecules/ModalMarketing';
import { ShowLoading, SwalClose } from '../../../../../utils/loading';
import { useSession } from "next-auth/react";

export default function Page() {
    const userSession = useSession();
    const dataUser = userSession?.data?.user?.responseResult;
    const token = dataUser?.token
    const Role = dataUser?.role_access["Master Marketing & Coordinator"]?.map((res) => res.event)
    const [searchTerm, setSearchTerm] = useState("");
    const [structureData, setStructureData] = useState([]);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [refresh, setRefresh] = useState(false);


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEdit = () => {
        console.log('Edit clicked');
    };

    const handleUpdate = () => {
        console.log('Update clicked');
    };

    // const handleSearch = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    // const handlerZoomIn = () => {
    //     setZoomLevel(zoomLevel + 10);
    // }

    // const handlerResetZoom = () => {
    //     setZoomLevel(100)
    // }

    // const handlerZoomOut = () => {
    //     setZoomLevel(Math.max(10, zoomLevel - 10));
    // }

    const getData = async () => {
        ShowLoading();
        const res = await GetStructureData(token);
        setStructureData(res.responseResult);
        SwalClose();
    }

    useEffect(() => {
        getData()
    }, [refresh]);

    return (
        <div className="mx-7 py-3">
            <div className="bg-white rounded-xl p-5">
                <nav className="text-gray-500 text-sm" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <a className="font-normal text-black hover:text-gray-700">Master</a>
                            <AiOutlineRight
                                className='mx-2'
                            />
                        </li>
                        <li class="flex items-center">
                            <a class="text-blue-600 hover:text-gray-700">Marketing & Coordinator</a>
                        </li>
                    </ol>
                </nav>
                <div className='flex my-3 items-center justify-between'>
                    <h1 className='font-semibold text-black text-base'>Master Marketing & Coordinator</h1>
                </div>
                <div className='mt-10 h-full'>
                    <div className='items-center overflow-auto h-full justify-center flex'>
                        <div className='overflow-auto' style={{ zoom: `${zoomLevel}%` }}>
                            {structureData && structureData.map((profile, idX) => (
                                <ProfileCard Role={Role} refresh={() => setRefresh(!refresh)} key={idX} {...profile} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <ModalBody
                    onClose={handleCloseModal}
                    onEdit={handleEdit}
                    onUpdate={handleUpdate}
                    top={modalPosition.top}
                    left={modalPosition.left}
                />
            )}
        </div>
    )
}
