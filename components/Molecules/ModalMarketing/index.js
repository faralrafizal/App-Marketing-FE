import React, { useRef, useEffect } from 'react';

export default function ModalBody({ onClose, onEdit, top, left, props }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
        modalRef.current.style.top = `${top}px`;
        modalRef.current.style.left = `${left}px`;
        }
    }, [top, left]);

    return (
        <div
        ref={modalRef}
        className="fixed flex justify-center items-center z-50"
        >
        <div className="bg-white w-1/6 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Options</h2>
            <button
            onClick={() => {
                onEdit();
                onClose();
            }}
            className="block w-full text-left py-2 px-4 hover:bg-gray-100"
            >
            Add Marketing
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
