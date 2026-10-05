import React from 'react';
import { Sparkles, Camera, History, Wand2, Shirt, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenTextToAnime: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTextToAnime,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Shirt className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Anime Garment &amp; Identity Studio
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" />
                100% Fidelity Lock
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Identical garment replication &amp; distinct feature preservation in Japanese anime art
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenTextToAnime}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 transition text-xs font-medium"
            title="Create Anime from Text Prompt"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Text to Anime</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 transition text-xs font-medium relative"
            title="View Past Transformations"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span>Gallery</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-600 text-[10px] text-white font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
