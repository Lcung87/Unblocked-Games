import React, { useState } from "react";
import { X, Gamepad2, Info, ArrowRight } from "lucide-react";

export default function AddCustomGameModal({ onClose, onAddGame }) {
  const [title, setTitle] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [category, setCategory] = useState("Arcade");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [controls, setControls] = useState("");
  const [creator, setCreator] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !iframeUrl.trim() || !description.trim()) {
      setError("Please complete all required fields (*).");
      return;
    }

    // Direct url validation
    let finalIframeUrl = iframeUrl.trim();
    if (!/^https?:\/\//i.test(finalIframeUrl)) {
      finalIframeUrl = `https://${finalIframeUrl}`;
    }

    // Thumbnail check
    let finalThumbnailUrl = thumbnailUrl.trim();
    if (finalThumbnailUrl && !/^https?:\/\//i.test(finalThumbnailUrl)) {
      finalThumbnailUrl = `https://${finalThumbnailUrl}`;
    }

    onAddGame({
      title: title.trim(),
      iframeUrl: finalIframeUrl,
      category,
      description: description.trim(),
      instructions: instructions.trim() || "Dodge hurdles and navigate successfully using your keys.",
      controls: controls.trim() || "Use standard keyboard configurations.",
      creator: creator.trim() || "Unblocked Explorer",
      thumbnailUrl: finalThumbnailUrl || undefined,
      isCustom: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Dialog container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 flex flex-col gap-5 overflow-hidden">
        
        {/* Header decoration */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-600/10 text-orange-500 rounded-lg">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-sans">
                Add Custom HTML5 Game
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Store standard iframes locally in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Warning notification */}
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Unblocked Note:</strong> Ensure the link is compatible with an iframe embed (e.g. allows iframe rendering origins). Most secure games from safe web developers, itch.io iframe sources, or GitHub pages run seamlessly!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded font-mono">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5">
            {/* Title */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Game Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Retro Racer Deluxe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-sans"
              />
            </div>

            {/* Category selection */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-sans cursor-pointer"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Action">Action</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
          </div>

          {/* Iframe Source Link */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Iframe Play URL *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://shasidhar.github.io/super-snake/"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-mono"
            />
          </div>

          {/* Optional Thumbnail URL */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Thumbnail Image Link <span className="text-slate-600 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. image-provider.com/thumbnail.png"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-mono"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              About / Description *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Briefly pitch what makes this game incredible..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-sans resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Controls */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Controls <span className="text-slate-600">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. WASD or Space to Flap"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-sans"
              />
            </div>

            {/* Developer/Creator */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Creator / Credit <span className="text-slate-600">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Scott Cawthon"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/50 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 font-sans font-medium rounded-lg text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-sans font-bold rounded-lg text-xs cursor-pointer hover:shadow-lg hover:shadow-orange-900/10 hover:scale-[1.01] active:translate-y-0.5 transition-all"
            >
              <span>Add to Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
