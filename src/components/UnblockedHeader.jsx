import React from "react";
import { Gamepad2, Search, PlusCircle, Bookmark, Compass, Landmark, Flame, Sparkles } from "lucide-react";

export default function UnblockedHeader({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  favoritesCount,
  totalGamesCount,
  customGamesCount,
  activeCategory,
  setActiveCategory,
}) {
  const categories = [
    { id: "All", label: "All Games", icon: Gamepad2 },
    { id: "Arcade", label: "Arcade", icon: Flame },
    { id: "Puzzle", label: "Puzzle", icon: Sparkles },
    { id: "Retro", label: "Retro", icon: Landmark },
    { id: "Strategy", label: "Strategy", icon: Compass },
    { id: "Favorites", label: "My Favorites", icon: Bookmark, badge: favoritesCount },
  ];

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveCategory("All")}>
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg ring-1 ring-orange-400/20">
              <Gamepad2 className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5">
                ARCADE<span className="text-orange-500 font-normal">UNBLOCKED</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                HTML5 Portable Catalog • {totalGamesCount} Games Loaded
              </p>
            </div>
          </div>

          {/* Search Bar & Custom Game Triggers */}
          <div className="flex flex-1 max-w-lg items-center gap-3 w-full">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search retro, puzzle, arcade classics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-lg text-sm shadow-md transition-all shrink-0 hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Game</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills Grid */}
        <div className="flex flex-wrap items-center mt-6 gap-2 border-t border-slate-800/50 pt-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery(""); // Clear search to show categorized selection
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                  isActive
                    ? "bg-slate-100 border-slate-100 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-slate-950" : "text-slate-500"}`} />
                <span>{cat.label}</span>
                {cat.badge !== undefined && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-slate-950 text-slate-100" : "bg-slate-900 text-slate-400"
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}

          {customGamesCount > 0 && (
            <button
              onClick={() => {
                setActiveCategory("Custom");
                setSearchQuery("");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                activeCategory === "Custom"
                  ? "bg-orange-500 border-orange-500 text-white font-bold"
                  : "bg-slate-950/50 border-slate-800 text-orange-400 hover:text-orange-300 hover:border-orange-700/50"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span>Loaded custom ({customGamesCount})</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
