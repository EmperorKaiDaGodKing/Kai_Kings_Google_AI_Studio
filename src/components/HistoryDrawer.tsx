import React from 'react';
import { X, Trash2, Clock, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { TransformationItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: TransformationItem[];
  onSelectItem: (item: TransformationItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Transformation History</h3>
            <span className="text-xs text-zinc-500 font-mono">({items.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <Sparkles className="w-10 h-10 text-zinc-700 mb-3" />
              <p className="text-sm font-medium text-zinc-400">No transformations yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                Your anime conversions and edits will appear here for easy reloading.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="group p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer flex items-center space-x-3"
              >
                {/* Thumbnails */}
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800 flex">
                  <img
                    src={item.currentAnimeImage}
                    alt="Anime Result"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded border border-white/40 overflow-hidden shadow">
                    <img
                      src={item.originalImage}
                      alt="Original"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white truncate">{item.stylePreset}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    Fidelity: {item.garmentFidelity === 'strict' ? '100% Strict' : 'Stylized'} • {item.identityFidelity}% Identity
                  </p>
                  {item.customPrompt && (
                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic mt-0.5">
                      "{item.customPrompt}"
                    </p>
                  )}
                  <div className="flex items-center text-[10px] text-rose-400 mt-2 font-medium">
                    <Eye className="w-3 h-3 mr-1" />
                    Load in Studio
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-between items-center">
            <span className="text-xs text-zinc-500">{items.length} saved creations</span>
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
