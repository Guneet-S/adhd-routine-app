'use client';

import { useState } from 'react';
import { EMOJI_OPTIONS } from '@/lib/mockData';

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

const PAGE_SIZE = 12;

export default function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(EMOJI_OPTIONS.length / PAGE_SIZE);
  const visible = EMOJI_OPTIONS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-6 gap-2">
        {visible.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
              selected === emoji
                ? 'bg-primary/10 border-2 border-primary scale-105'
                : 'bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Pagination dots */}
      {pages > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === page ? 'bg-primary' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
