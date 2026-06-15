import React from "react";
import { Play, Bookmark, BookmarkCheck, Heart, User, Sparkles, Flame, Trophy, Compass, Landmark } from "lucide-react";

export default function GameCard({
  game,
  isFavorite,
  onSelect,
  onToggleFavorite,
  playCount,
  ratingLikes,
}) {
  // Generate beautiful category-specific fallback gradients
  const getFallbackGradient = (category) => {
    switch (category) {
      case "Puzzle":
        return "from-indigo-600 via-purple-600 to-pink-500";
      case "Arcade":
        return "from-rose-500 via-orange-600 to-amber-500";
      case "Action":
        return "from-red-600 via-purple-700 to-violet-800";
      case "Strategy":
        return "from-cyan-600 via-blue-600 to-teal-500";
      case "Retro":
        return "from-emerald-500 via-teal-600 to-sky-600";
      default:
        return "from-amber-500 via-orange-600 to-yellow-500";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Puzzle":
        return <Sparkles className="h-8 w-8 text-white/80" />;
      case "Arcade":
        return <Flame className="h-8 w-8 text-white/80" />;
      case "Strategy":
        return <Compass className="h-8 w-8 text-white/80" />;
      case "Retro":
        return <Landmark className="h-8 w-8 text-white/80" />;
      default:
        return <Trophy className="h-8 w-8 text-white/80" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative bg-[#0f172a] hover:bg-[#1e293b] rounded-xl border border-slate-800 hover:border-slate-700 p-3 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl overflow-hidden"
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => onToggleFavorite(e, game.id)}
        className="absolute top-2.5 right-2.5 z-10 p-2 bg-slate-950/80 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-orange-500 border border-slate-800/80 transition-all cursor-pointer"
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? (
          <BookmarkCheck className="h-4.5 w-4.5 text-orange-500 fill-orange-500" />
        ) : (
          <Bookmark className="h-4.5 w-4.5" />
        )}
      </button>

      {/* Thumbnail or Fallback Gradient */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 mb-3 border border-slate-900">
        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-tr ${getFallbackGradient(game.category)} flex flex-col items-center justify-center p-4 relative`}>
            {/* Retro grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            {getCategoryIcon(game.category)}
            <span className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              {game.category} Play
            </span>
          </div>
        )}

        {/* Hover Hover Play HUD */}
        <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="bg-orange-500 text-white p-3.5 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300 delay-75">
            <Play className="h-5 w-5 fill-white" />
          </div>
        </div>

        {/* Category Badge overlay on bottom left */}
        <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 bg-slate-950/90 text-[10px] text-slate-300 font-mono rounded border border-slate-800/80">
          {game.category}
        </span>
      </div>

      {/* Game Meta Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-sans font-bold text-slate-100 group-hover:text-amber-400 transition-colors text-base line-clamp-1">
              {game.title}
            </h3>
            {game.isCustom && (
              <span className="px-1 text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-mono">
                User
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 min-h-[2rem]">
            {game.description}
          </p>
        </div>

        {/* Statistics and Footer Row */}
        <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1 font-mono text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Plays: <strong className="text-slate-300 font-medium">{playCount || 0}</strong></span>
            {ratingLikes > 0 && (
              <span className="flex items-center gap-1 text-emerald-500">
                <Heart className="h-2.5 w-2.5 fill-emerald-500" />
                {ratingLikes}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {game.creator ? (
              <span className="line-clamp-1 max-w-[80px]" title={`Creator: ${game.creator}`}>
                by {game.creator}
              </span>
            ) : (
              <span>Arcade Hub</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
