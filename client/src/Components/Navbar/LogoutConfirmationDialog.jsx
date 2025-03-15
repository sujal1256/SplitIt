import React from "react";

const LogoutConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1a2235] rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#2a3144] flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Log Out?</h2>
          <p className="text-center text-gray-300 mb-6">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#2a3144] text-white rounded hover:bg-[#343f5a] transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationDialog;