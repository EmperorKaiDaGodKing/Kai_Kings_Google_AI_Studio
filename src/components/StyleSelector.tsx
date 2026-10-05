import React from 'react';
import {
  SunMedium,
  Leaf,
  Sparkles,
  Zap,
  Tv,
  Cpu,
  Crown,
  Check,
  Palette,
  MessageSquareQuote,
} from 'lucide-react';
import { ANIME_STYLES } from '../data/samplePresets';
import { AnimeStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleName: string) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  customPrompt,
  onCustomPromptChange,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'SunMedium':
        return <SunMedium className="w-4 h-4 text-amber-400" />;
      case 'Leaf':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-rose-500" />;
      case 'Tv':
        return <Tv className="w-4 h-4 text-yellow-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Crown':
        return <Crown className="w-4 h-4 text-indigo-400" />;
      default:
        return <Palette className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Japanese Anime Art Style</h3>
            <p className="text-[11px] text-zinc-400">
              Select your preferred anime studio aesthetic and inking style
            </p>
          </div>
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {ANIME_STYLES.map((style) => {
          const isSelected = selectedStyle === style.name;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.name)}
              className={`text-left p-3 rounded-xl border transition relative flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/40'
                  : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {getIcon(style.iconName)}
                    <span className="text-xs font-bold text-white">{style.name}</span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mb-1">{style.studio}</div>
                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2 mb-2">
                  {style.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-auto">
                {style.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Director Prompt Input */}
      <div className="pt-2 border-t border-zinc-800/80">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5 text-rose-400" />
          Custom Art Direction / Prompt Refinement (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder="e.g. dramatic lighting, cherry blossom petals, cyberpunk alley background, golden sunset..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 transition"
          />
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">
          Add specific mood, lighting, or setting details while keeping your garments intact.
        </p>
      </div>
    </div>
  );
};
