import React, { useState, useEffect, useMemo } from "react";
import defaultGamesData from "./data/games.json";
import UnblockedHeader from "./components/UnblockedHeader";
import GameCard from "./components/GameCard";
import GamePlayer from "./components/GamePlayer";
import AddCustomGameModal from "./components/AddCustomGameModal";
import { Gamepad2, History, Trophy, Star, ArrowRight, FolderOpen, Zap } from "lucide-react";

export default function App() {
  // --- Core Persistent State ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("arcade_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [customGames, setCustomGames] = useState(() => {
    const saved = localStorage.getItem("arcade_custom_games");
    return saved ? JSON.parse(saved) : [];
  });

  const [playCounts, setPlayCounts] = useState(() => {
    const saved = localStorage.getItem("arcade_play_counts");
    if (saved) return JSON.parse(saved);
    // Baseline playcounts for classic catalog to make it look alive
    return {
      "2048": 1420,
      "hextris": 948,
      "pacman": 2305,
      "tetris": 3102,
      "trex": 843,
      "space-invaders": 1152,
      "tower-game": 642,
      "asteroids": 732,
      "clumsy-bird": 1823,
    };
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("arcade_ratings");
    return saved ? JSON.parse(saved) : {};
  });

  const [ratingsLikes, setRatingsLikes] = useState(() => {
    const saved = localStorage.getItem("arcade_ratings_likes");
    if (saved) return JSON.parse(saved);
    // Baseline likes for realistic arcade stats
    return {
      "2048": 142,
      "hextris": 89,
      "pacman": 285,
      "tetris": 401,
      "trex": 72,
      "space-invaders": 165,
      "tower-game": 49,
      "asteroids": 58,
      "clumsy-bird": 189,
    };
  });

  const [backupUrls, setBackupUrls] = useState(() => {
    const saved = localStorage.getItem("arcade_backup_urls");
    return saved ? JSON.parse(saved) : {};
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem("arcade_recently_played");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Dynamic Dashboard States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Sync State back to LocalStorage whenever changes happen ---
  useEffect(() => {
    localStorage.setItem("arcade_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("arcade_custom_games", JSON.stringify(customGames));
  }, [customGames]);

  useEffect(() => {
    localStorage.setItem("arcade_play_counts", JSON.stringify(playCounts));
  }, [playCounts]);

  useEffect(() => {
    localStorage.setItem("arcade_ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("arcade_ratings_likes", JSON.stringify(ratingsLikes));
  }, [ratingsLikes]);

  useEffect(() => {
    localStorage.setItem("arcade_backup_urls", JSON.stringify(backupUrls));
  }, [backupUrls]);

  useEffect(() => {
    localStorage.setItem("arcade_recently_played", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Combine Default JSON Games & Custom Loaded User Games
  const allGames = useMemo(() => {
    return [...defaultGamesData, ...customGames];
  }, [customGames]);

  // Pre-calculated stats for the top Header stats badge
  const statsOverview = useMemo(() => {
    return {
      totalCount: allGames.length,
      customCount: customGames.length,
      favoritesCount: favorites.length,
    };
  }, [allGames, customGames, favorites]);

  // Filtered Game lists based on search parameter and tab category Selection
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      // Category tab checks
      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Favorites" && favorites.includes(game.id)) ||
        (activeCategory === "Custom" && game.isCustom) ||
        game.category === activeCategory;

      // Fuzzy search matcher
      const matchesSearch =
        searchQuery.trim() === "" ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.creator && game.creator.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [allGames, activeCategory, favorites, searchQuery]);

  // Create a stunning default featured game banner
  const featuredGame = useMemo(() => {
    const tetrisItem = allGames.find((g) => g.id === "tetris");
    const pacmanItem = allGames.find((g) => g.id === "pacman");
    return tetrisItem || pacmanItem || allGames[0];
  }, [allGames]);

  // Resolve recently played items to actual Game objects
  const resolvedRecentlyPlayed = useMemo(() => {
    return recentlyPlayed
      .map((id) => allGames.find((g) => g.id === id))
      .filter((g) => !!g)
      .slice(0, 4); // Show top 4 recently played items
  }, [recentlyPlayed, allGames]);

  // --- Handlers ---
  const handleSelectGame = (game) => {
    setActiveGame(game);

    // Track Playcount increments
    setPlayCounts((prev) => ({
      ...prev,
      [game.id]: (prev[game.id] || 0) + 1,
    }));

    // Update Recently Played queue
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      return [game.id, ...filtered].slice(0, 10); // persist 10 records
    });

    // Scroll to player smoothly
    setTimeout(() => {
      document.getElementById("game-player-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleToggleFavoriteEvent = (e, gameId) => {
    e.stopPropagation();
    handleToggleFavorite(gameId);
  };

  const handleRateGame = (gameId, rating) => {
    const previousRating = ratings[gameId];

    if (previousRating === rating) {
      // Toggle off if they click the same button
      setRatings((prev) => ({ ...prev, [gameId]: null }));
      if (rating === "like") {
        setRatingsLikes((prev) => ({ ...prev, [gameId]: Math.max(0, (prev[gameId] || 0) - 1) }));
      }
    } else {
      setRatings((prev) => ({ ...prev, [gameId]: rating }));
      if (rating === "like") {
        setRatingsLikes((prev) => ({ ...prev, [gameId]: (prev[gameId] || 0) + 1 }));
      } else if (previousRating === "like") {
        setRatingsLikes((prev) => ({ ...prev, [gameId]: Math.max(0, (prev[gameId] || 0) - 1) }));
      }
    }
  };

  const handleSaveBackupIframe = (gameId, backupUrl) => {
    if (!backupUrl) {
      setBackupUrls((prev) => {
        const copy = { ...prev };
        delete copy[gameId];
        return copy;
      });
    } else {
      setBackupUrls((prev) => ({
        ...prev,
        [gameId]: backupUrl,
      }));
    }
  };

  const handleAddGame = (newGameData) => {
    const id = `custom-${Date.now()}`;
    const newGame = {
      ...newGameData,
      id,
    };
    setCustomGames((prev) => [newGame, ...prev]);
    // Auto-open custom added game for premium catalog feedback !
    handleSelectGame(newGame);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white antialiased">
      
      {/* Decorative top strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600"></div>

      {/* Brand Header */}
      <UnblockedHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        favoritesCount={statsOverview.favoritesCount}
        totalGamesCount={statsOverview.totalCount}
        customGamesCount={statsOverview.customCount}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Main Stage Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
        
        {/* Game Player Section (Loads above when a game is selected) */}
        {activeGame ? (
          <div className="mb-10 animate-fade-in">
            <GamePlayer
              game={activeGame}
              isFavorite={favorites.includes(activeGame.id)}
              onClose={() => setActiveGame(null)}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleRateGame}
              userRating={ratings[activeGame.id] || null}
              customIframeBackup={backupUrls[activeGame.id] || ""}
              onSaveBackupIframe={handleSaveBackupIframe}
            />
          </div>
        ) : null}

        {/* Home Portal Hero layouts (Only visible when NO game is playing and NO query is active) */}
        {!activeGame && !searchQuery && activeCategory === "All" && featuredGame && (
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Featured Hero Banner */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col justify-end p-6 md:p-8 min-h-[340px] group shadow-xl">
              {/* Cover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>
              
              {/* Mesh background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-60"></div>
              
              {/* Backgrid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <div className="relative z-20 space-y-3.5 max-w-lg">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wider font-mono">
                  <Star className="h-3 w-3 fill-orange-400" />
                  <span>FEATURED ARCADE CLASSIC</span>
                </span>
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
                  {featuredGame.title}
                </h2>
                
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {featuredGame.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => handleSelectGame(featuredGame)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-orange-950/20 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95"
                  >
                    <span>Play Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleToggleFavorite(featuredGame.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors border cursor-pointer ${
                      favorites.includes(featuredGame.id)
                        ? "bg-amber-600/15 border-amber-500/30 text-amber-400"
                        : "bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {favorites.includes(featuredGame.id) ? "Favorited ✓" : "Add to Favorites"}
                  </button>
                </div>
              </div>
            </div>

            {/* Recently Played Side board */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
              <div>
                <h3 className="text-sm font-bold font-sans tracking-tight text-white flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
                  <History className="h-4.5 w-4.5 text-orange-500" />
                  <span>Resume Playing</span>
                </h3>

                {resolvedRecentlyPlayed.length > 0 ? (
                  <div className="space-y-3">
                    {resolvedRecentlyPlayed.map((game) => (
                      <div
                        key={game.id}
                        onClick={() => handleSelectGame(game)}
                        className="flex items-center gap-3 p-2 bg-slate-950/50 hover:bg-slate-950 border border-slate-800/60 hover:border-slate-800 rounded-xl cursor-pointer transition-all group"
                      >
                        {/* Game miniature icon fallback */}
                        <div className="h-10 w-14 rounded bg-gradient-to-tr from-slate-850 to-slate-900 flex items-center justify-center border border-slate-800 overflow-hidden shrink-0">
                          <Gamepad2 className="h-4 w-4 text-slate-500 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                            {game.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {game.category} • Plays: {playCounts[game.id] || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                    <Gamepad2 className="h-8 w-8 text-slate-700 animate-pulse" />
                    <p className="text-xs text-slate-400 max-w-[200px]">
                      Your recently played arcade games will populate here for fast offline access.
                    </p>
                  </div>
                )}
              </div>

              {/* Offline backup disclaimer */}
              <div className="mt-4 border-t border-slate-850 pt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Cookies local-save enabled.</span>
              </div>
            </div>
          </div>
        )}

        {/* Game grid title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
              {activeCategory === "All" && !searchQuery
                ? "Browse Game Library"
                : activeCategory === "Favorites"
                ? "Your Bookmark Collection"
                : `${activeCategory} Arcade Matches`}
              {searchQuery && (
                <span className="text-slate-500 font-normal ml-2 font-mono text-sm select-all">
                  (matches for &quot;{searchQuery}&quot;)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Displaying {filteredGames.length} of {allGames.length} unblocked modules
            </p>
          </div>

          {/* Catalog stats banner */}
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <Trophy className="h-3 w-3 text-amber-500" />
            <span>Leaderboards synchronized locally per device</span>
          </div>
        </div>

        {/* Primary Games Grid Layout */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onSelect={handleSelectGame}
                onToggleFavorite={handleToggleFavoriteEvent}
                playCount={playCounts[game.id] || 0}
                ratingLikes={ratingsLikes[game.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-6 space-y-4">
            <div className="p-3 bg-slate-950 text-slate-500 rounded-full w-fit mx-auto">
              <FolderOpen className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">No games matched selection</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No local listings or customized packages correspond to your query &quot;{searchQuery || activeCategory}&quot;.
              </p>
            </div>
            {activeCategory === "Favorites" ? (
              <button
                onClick={() => setActiveCategory("All")}
                className="py-1.5 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium cursor-pointer transition-colors"
              >
                Explore Catalog
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="py-1.5 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium cursor-pointer transition-colors"
              >
                Add Custom Game Link
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer Navigation bar */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 font-mono text-[11px] space-y-2">
          <p>
            ARCADE UNBLOCKED • Lightweight serverless single page client platform.
          </p>
          <p className="text-slate-500">
            Open-source and unblocked on school & workplace networks. Every gameplay session and ranking is calculated client-side.
          </p>
        </div>
      </footer>

      {/* Add Custom Game Dialog Modal */}
      {isAddModalOpen && (
        <AddCustomGameModal
          onClose={() => setIsAddModalOpen(false)}
          onAddGame={handleAddGame}
        />
      )}
    </div>
  );
}
