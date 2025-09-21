
import React, { useState, useMemo, useEffect } from 'react';
import { BusinessCard, Category } from './types';
import CardList from './components/CardList';
import SearchBar from './components/SearchBar';
import EditCardModal from './components/EditCardModal';

const App: React.FC = () => {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3002/cards');
        if (!response.ok) {
          throw new Error('Failed to fetch cards.');
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Failed to fetch cards from server", error);
        // Set empty array on error to avoid crash
        setCards([]);
      }
    };
    fetchCards();
  }, []);

  const handleOpenAddNew = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: BusinessCard) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleSaveCard = (savedCard: BusinessCard) => {
    setCards(prevCards => {
      const existing = prevCards.find(c => c.id === savedCard.id);
      if (existing) {
        return prevCards.map(c => c.id === savedCard.id ? savedCard : c);
      } else {
        return [savedCard, ...prevCards];
      }
    });
    handleCloseModal();
  };

  const handleDeleteCard = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3002/cards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete card.');
      }
      setCards(prevCards => prevCards.filter(c => c.id !== id));
      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const handleEraseAllCards = async () => {
    if (window.confirm('Are you sure you want to delete all cards? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:3002/cards', {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete all cards.');
        }
        setCards([]);
      } catch (error) {
        console.error("Failed to delete all cards:", error);
      }
    }
  };

  const filteredCards = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return cards.filter(card =>
      (card.name && card.name.toLowerCase().includes(query)) ||
      (card.company && card.company.toLowerCase().includes(query)) ||
      (card.position && card.position.toLowerCase().includes(query)) ||
      (card.category && card.category.toLowerCase().includes(query))
    );
  }, [cards, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-500">
            AI Business Card Vault
          </h1>
          <p className="text-slate-400 mt-2">Your intelligent contact database.</p>
        </header>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={handleOpenAddNew}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Add New Card
          </button>
          <button
            onClick={handleEraseAllCards}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Erase all Cards
          </button>
        </div>

        <CardList cards={filteredCards} onEdit={handleOpenEdit} />

        {isModalOpen && (
          <EditCardModal
            card={editingCard}
            onClose={handleCloseModal}
            onSave={handleSaveCard}
            onDelete={handleDeleteCard}
          />
        )}
      </main>
    </div>
  );
};

export default App;
