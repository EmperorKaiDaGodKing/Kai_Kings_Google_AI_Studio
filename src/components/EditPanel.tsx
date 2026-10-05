import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  History,
  RotateCcw,
  ArrowRight,
  Send,
  Loader2,
  Layers,
} from 'lucide-react';
import { QUICK_EDIT_PROMPTS } from '../data/samplePresets';

interface EditPanelProps {
  onApplyEdit: (prompt: string) => Promise<void>;
  isEditing: boolean;
  historyVersions: string[];
  activeVersionIndex: number;
  onSelectVersion: (index: number) => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({
  onApplyEdit,
  isEditing,
  historyVersions,
  activeVersionIndex,
  onSelectVersion,
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isEditing) return;
    await onApplyEdit(prompt.trim());
    setPrompt('');
  };

  const handleQuickPromptClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Prompt Editor</h3>
            <p className="text-[11px] text-zinc-400">
              Refine atmosphere, weather, effects, and background using gemini-3.1-flash-image-preview
            </p>
          </div>
        </div>

        {/* Version Stack Pills */}
        {historyVersions.length > 1 && (
          <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-mono px-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Ver:
            </span>
            {historyVersions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelectVersion(idx)}
                className={`w-6 h-6 rounded-md text-xs font-bold transition flex items-center justify-center ${
                  activeVersionIndex === idx
                    ? 'bg-rose-600 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                v{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Prompt Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isEditing}
            placeholder="Describe an edit (e.g., 'Add cherry blossoms floating', 'Change to sunset rim lighting', 'Add neon rain reflections')..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-24 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isEditing}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            {isEditing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Editing...</span>
              </>
            ) : (
              <>
                <span>Apply</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* 1-Click Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick Studio Directives:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_EDIT_PROMPTS.map((quick, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(quick)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition text-left"
            >
              + {quick}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
