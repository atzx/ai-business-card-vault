import React from 'react';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<Props> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p>{message}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
