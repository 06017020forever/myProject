import React from 'react';
import { EquipmentSlot } from '../types/customization';

interface EquipmentSlotsProps {
  slots: EquipmentSlot[];
  onRemoveItem: (slotId: string) => void;

}

export function EquipmentSlots({ slots, onRemoveItem }: EquipmentSlotsProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 space-y-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer
            ${slot.item ? 'bg-gradient-to-br from-purple-600/80 to-purple-900/80' : 'bg-gray-800/50'}
          `}
          onClick={() => slot.item && onRemoveItem(slot.id)}
        >
          {slot.item && (
            <img
              // src={slot.item.thumbnail}
              alt={slot.item.name}
              className="w-10 h-10 object-cover rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}

