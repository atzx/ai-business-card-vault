
import React from 'react';
import { BusinessCard } from '../types';
import CardItem from './CardItem';

interface CardListProps {
  cards: BusinessCard[];
  onEdit: (card: BusinessCard) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onEdit }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-800/50 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-300">No Cards Found</h2>
        <p className="text-slate-400 mt-2">Try adding a new business card or refining your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <CardItem key={card.id} card={card} onEdit={() => onEdit(card)} />
      ))}
    </div>
  );
};

export default CardList;
