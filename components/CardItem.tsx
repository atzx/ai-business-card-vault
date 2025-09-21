
import React from 'react';
import { BusinessCard } from '../types';
import { UserIcon, BuildingIcon, PhoneIcon, MailIcon, GlobeIcon, LocationIcon } from './icons';

interface CardItemProps {
  card: BusinessCard;
  onEdit: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-blue-500/20 flex flex-col">
      <div className="relative">
        <img className="w-full h-32 object-cover" src={card.imageUrl} alt="Business Card" />
        <div className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
          {card.category}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-100">{card.name || 'No Name'}</h3>
        <p className="text-blue-400 font-semibold">{card.position || 'No Position'}</p>
        
        <div className="mt-4 space-y-3 text-sm flex-grow">
          {card.company && <div className="flex items-center text-slate-300"><BuildingIcon className="w-4 h-4 mr-3 text-slate-400" /><span>{card.company}</span></div>}
          {card.phone && <div className="flex items-center text-slate-300"><PhoneIcon className="w-4 h-4 mr-3 text-slate-400" /><span>{card.phone}</span></div>}
          {card.email && <div className="flex items-center text-slate-300"><MailIcon className="w-4 h-4 mr-3 text-slate-400" /><span>{card.email}</span></div>}
          {card.website && <div className="flex items-center text-slate-300"><GlobeIcon className="w-4 h-4 mr-3 text-slate-400" /><span>{card.website}</span></div>}
          {card.address && <div className="flex items-start text-slate-300"><LocationIcon className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-slate-400" /><span>{card.address}</span></div>}
        </div>
        
        <button onClick={onEdit} className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg transition">
          Edit
        </button>
      </div>
    </div>
  );
};

export default CardItem;
