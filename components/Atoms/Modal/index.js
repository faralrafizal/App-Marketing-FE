import React from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "justify-center items-center",
  width = "w-[50%]",
  title = "View Details User",
  endTitle = "",
  classNameheader = 'border-b-2'
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex ${className} z-50`}>
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black opacity-75"
      />
      <div
        className={` bg-white ${width}  rounded shadow-lg z-50 overflow-y-auto`}
      >
        <div className={`flex justify-between items-center py-3 ` + classNameheader}>
          {title && <div className="text-black mx-4 text-base font-bold">{title}</div>}
          <div
            onClick={onClose}
            className="cursor-pointer mx-4 text-gray-500 text-sm"
          >
            <span className="font-bold text-black py-[1px] px-[6px] bg-[#F5F6FB] rounded-full text-xl">&times;</span>
            {endTitle && <span className="text-black mx-4 text-base font-bold">{endTitle}</span>}
          </div>
        </div>
        <div className="modal-content  overflow-auto py-4 text-left px-6 ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
