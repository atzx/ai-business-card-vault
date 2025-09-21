
import React, { useState, useEffect, useCallback } from 'react';
import { BusinessCard, Category, ExtractedCardData } from '../types';
import { extractInfoFromImage } from '../services/geminiService';
import { CATEGORIES } from '../constants';

interface EditCardModalProps {
  card: BusinessCard | null;
  onClose: () => void;
  onSave: (cardData: BusinessCard) => void;
  onDelete: (id: string) => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Omit<BusinessCard, 'id'>>({
    name: '', company: '', position: '', phone: '', email: '', website: '', address: '',
    category: 'Work', imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNewCardFlow, setIsNewCardFlow] = useState(!card);

  useEffect(() => {
    if (card) {
      setFormData(card);
      setImagePreview(card.imageUrl);
      setIsNewCardFlow(false);
    } else {
        setIsNewCardFlow(true);
    }
  }, [card]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleExtract = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const extractedData = await extractInfoFromImage(imageFile);
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        imageUrl: imagePreview || '',
      }));
      setIsNewCardFlow(false); // Move to form view
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      setError('Name is a required field.');
      return;
    }

    // If there's a new image file, upload it. Otherwise, just save the text data.
    if (imageFile) {
      const data = new FormData();
      data.append('image', imageFile);
      data.append('cardData', JSON.stringify(formData));

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3002/cards', {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file.');
        }

        const savedCard = await response.json();
        onSave(savedCard);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred during upload.');
      } finally {
        setIsLoading(false);
      }
    } else if (card) {
      // If no new image, just save the updated form data (for existing cards)
      // This path should ideally be a PUT request to an update endpoint
      onSave({ ...formData, id: card.id });
    }
  };
  
  const handleDelete = () => {
      if(card && window.confirm('Are you sure you want to delete this card?')) {
          onDelete(card.id);
      }
  }

  const renderUploader = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Add a New Business Card</h2>
        <p className="text-slate-400 mb-6">Upload an image of the card, and our AI will extract the details for you.</p>
        <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-300 mb-2">Card Image</label>
            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
        </div>
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-60 object-contain rounded-lg mb-4 bg-slate-700 p-2" />}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg">Cancel</button>
            <button onClick={handleExtract} disabled={isLoading || !imageFile} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Extracting...
                    </>
                ) : 'Extract Information'}
            </button>
        </div>
    </div>
  );

  const renderForm = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{card ? 'Edit Business Card' : 'Review & Save Card'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
        {Object.keys(formData).filter(k => !['category', 'imageUrl', 'address'].includes(k)).map(key => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium capitalize text-slate-300">{key}</label>
            <input type="text" id={key} name={key} value={(formData as any)[key]} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
        ))}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium capitalize text-slate-300">Address</label>
            <textarea id="address" name="address" rows={2} value={formData.address} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <div className="mt-8 flex justify-between items-center">
        <div>
            {card && <button onClick={handleDelete} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Card</button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {isNewCardFlow ? renderUploader() : renderForm()}
      </div>
    </div>
  );
};

export default EditCardModal;
