import React, { useState } from 'react';
import { CustomizationItem, CategoryTab } from '../types/customization';

interface CustomizationPanelProps {
  items: CustomizationItem[];
  onSelectItem: (item: CustomizationItem) => void;
  totalItems: number;

}

export function CustomizationPanel({ items, onSelectItem, totalItems }: CustomizationPanelProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories: CategoryTab[] = [
    { id: 'all', label: '全部', category: 'all' },
    { id: 'head', label: '头饰', category: 'head' },
    { id: 'top', label: '上衣', category: 'top' },
    { id: 'legs', label: '下装', category: 'legs' },

  ];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-[420px] bg-black/90 text-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-gray-400">外装</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{totalItems} 物品</span>
        </div>
      </div>

      <div className="px-4 border-b border-gray-800">
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 text-sm transition-colors relative whitespace-nowrap
                ${activeCategory === cat.category ? 'text-white' : 'text-gray-400'}
              `}
            >
              {cat.label}
              {activeCategory === cat.category && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-4 gap-2 h-[calc(100%-180px)] overflow-auto">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              console.log(`Selecting item: ${item.name}`);
              onSelectItem(item);
            }}
            className="relative aspect-square group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-purple-900/80 rounded-lg" />
            <img 
              src={item.thumbnail} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg relative z-10 group-hover:opacity-90 transition-opacity"
            />
            {item.rarity === 'epic' && (
              <div className="absolute inset-0 border-2 border-purple-400 rounded-lg z-20" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

