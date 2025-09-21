import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const GeminiApiKeyModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSave(apiKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Gemini API Key</h2>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute inset-y-0 right-0 px-3 flex items-center"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiKeyModal;
