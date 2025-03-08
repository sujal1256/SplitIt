import React from "react";

function DeleteConfirmation({ isOpen, onClose, onConfirm, groupName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[#242a3a] border border-[#2a3040] rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 bg-opacity-10 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">Delete Group?</h3>
          <p className="text-gray-300 mt-2">
            Are you sure you want to delete <span className="font-medium text-white">{groupName || "this group"}</span>? 
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="py-3 px-4 flex-1 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-3 px-4 flex-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 font-medium"
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;