import React, { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCw,
  Maximize2,
  Minimize2,
  Tv,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  Info,
  ShieldAlert,
  Save,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Gamepad2
} from "lucide-react";

export default function GamePlayer({
  game,
  isFavorite,
  onClose,
  onToggleFavorite,
  onRate,
  userRating,
  customIframeBackup,
  onSaveBackupIframe,
}) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [backupUrlInput, setBackupUrlInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Active URL takes the backup if configured
  const activePlayUrl = customIframeBackup || game.iframeUrl;

  useEffect(() => {
    setIframeLoading(true);
    setBackupUrlInput(customIframeBackup || "");
    setShowReportForm(false);
  }, [game, customIframeBackup]);

  // Clean iframe reload
  const handleReload = () => {
    if (iframeRef.current) {
      setIframeLoading(true);
      // Re-assign src to trigger reload
      iframeRef.current.src = activePlayUrl;
    }
  };

  // Toggle Standard browser HTML5 fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error enabling fullscreen: ", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleSaveBackup = (e) => {
    e.preventDefault();
    if (!backupUrlInput.trim()) {
      onSaveBackupIframe(game.id, ""); // clear backup
    } else {
      // Basic scheme validation
      let formattedUrl = backupUrlInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      onSaveBackupIframe(game.id, formattedUrl);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowReportForm(false);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="game-player-section">
      {/* Top Breadcrumb and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Return to catalog"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white select-all">{game.title}</h2>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-[10px] rounded uppercase">
                {game.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Running via sandbox iframe • {customIframeBackup ? "Custom Source" : "Secure Official Release"}
            </p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reload Grid */}
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors border border-slate-800/80 cursor-pointer"
            title="Reset Game Frame"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Reload</span>
          </button>

          {/* Theater View Toggle */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              isTheaterMode
                ? "bg-amber-600/10 border-amber-600/30 text-amber-500 font-bold"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            }`}
            title="Toggle Expanded Theater mode"
          >
            <Tv className="h-3.5 w-3.5" />
            <span>Theater {isTheaterMode ? "ON" : "OFF"}</span>
          </button>

          {/* Fullscreen Tool */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors border border-slate-800/80 cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Fullscreen</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              isFavorite
                ? "bg-orange-500/15 border-orange-500/30 text-orange-400 font-medium"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            }`}
          >
            {isFavorite ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Add Favorite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Game Playing Frame Grid */}
      <div
        ref={containerRef}
        className={`relative bg-black border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "w-full aspect-[21/9] min-h-[500px]" : "w-full aspect-video md:aspect-[16/10] max-h-[640px] shadow-orange-950/5"
        } ${isFullscreen ? "rounded-none border-0 w-screen h-screen max-h-none min-h-none" : ""}`}
      >
        {/* Iframe Loading screen wrapper */}
        {iframeLoading && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-20">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              <Gamepad2 className="h-5 w-5 text-orange-500 absolute animate-pulse" />
            </div>
            <p className="mt-4 text-sm font-sans font-medium text-slate-100">
              Initializing Sandbox Frame...
            </p>
            <p className="mt-1 text-xs font-mono text-slate-500 max-w-[280px] text-center line-clamp-1">
              {activePlayUrl}
            </p>
          </div>
        )}

        {/* Real Game Iframe */}
        <iframe
          ref={iframeRef}
          src={activePlayUrl}
          title={game.title}
          allow="autoplay; keyboard; gamepad; fullscreen"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIframeLoading(false)}
          className="w-full h-full border-0 bg-slate-950"
        />

        {/* Floating Custom HUD Exit for Fullscreen */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-40 p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all pointer-events-auto"
            title="Exit Fullscreen"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Under-Player Information Grid: Instructions, Report form, and Feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Game details, Instructions & Controls Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls & Quick Guide Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
            <h3 className="text-sm font-sans font-bold text-slate-100 flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4 text-orange-500" />
              <span>How To Play & Controller Bindings</span>
            </h3>

            {game.controls ? (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Active Keyboard Layout
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">
                  {game.controls}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  General Layout
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  Arrow keys / WASD for movement. Spacebar or Enter for main commands.
                </p>
              </div>
            )}

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <div className="flex gap-2">
                <span className="text-orange-500 font-bold shrink-0 font-mono">•</span>
                <p>{game.instructions || "Slide, combine, or navigate through objectives using simple desktop keyboard controls."}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-500 font-bold shrink-0 font-mono">•</span>
                <p className="text-slate-400">
                  If controls are unresponsive, click inside the game screen above to activate keyboard focus in the iframe.
                </p>
              </div>
            </div>
          </div>

          {/* Description & Metadata Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-sans font-bold text-slate-100 flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                <span>About this Game</span>
              </h3>
              {game.creator && (
                <span className="text-xs font-mono text-slate-400">
                  Developer: <strong className="text-slate-300 font-medium">{game.creator}</strong>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {game.description}
            </p>
          </div>
        </div>

        {/* Right Side: Rating and Firewall Override / Firewall Reports */}
        <div className="space-y-6">
          
          {/* Reaction Portal Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-sans font-bold text-slate-100 mb-2">
                Are you enjoying this?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Your feedback sets the leaderboard ranking for this unblocked collection.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onRate(game.id, "like")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-sans font-medium transition-all border cursor-pointer ${
                  userRating === "like"
                    ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-400 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${userRating === "like" ? "fill-emerald-400/20" : ""}`} />
                <span>Awesome</span>
              </button>

              <button
                onClick={() => onRate(game.id, "dislike")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-sans font-medium transition-all border cursor-pointer ${
                  userRating === "dislike"
                    ? "bg-rose-600/10 border-rose-500/50 text-rose-400 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${userRating === "dislike" ? "fill-rose-400/20" : ""}`} />
                <span>Meh</span>
              </button>
            </div>
          </div>

          {/* Firewall Override (Report Block / Set custom backup) */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
            {!showReportForm ? (
              <div className="text-center sm:text-left">
                <h4 className="text-xs font-sans font-bold text-slate-200 flex items-center gap-2 justify-center sm:justify-start">
                  <ShieldAlert className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>Is this Link Blocked?</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 mb-3 leading-relaxed">
                  Firewalls/proxies occasionally filter standard GitHub Pages. Click below to specify an alternative unblocked mirror link or proxy URL for this game.
                </p>
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-orange-400 hover:text-orange-300 text-xs font-mono rounded transition-colors cursor-pointer"
                >
                  Configure Backup URL
                </button>
                {customIframeBackup && (
                  <span className="text-[10px] text-emerald-500 font-mono mt-1.5 block">
                    ✓ Custom proxy URL active.
                  </span>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveBackup} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-sans font-bold text-slate-100 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-orange-400" />
                    <span>Configure Bypass Link</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 font-mono"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                  Input a custom unblocked frame source (e.g. your proxy address or custom itch.io iframe link).
                </p>
                <input
                  type="text"
                  placeholder="e.g. my-proxy-server.com/gamemirror"
                  value={backupUrlInput}
                  onChange={(e) => setBackupUrlInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 text-xs text-slate-200 rounded border border-slate-800 focus:outline-none focus:border-orange-500"
                />
                
                <div className="flex items-center gap-2 pt-1.5">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded text-xs transition-colors cursor-pointer"
                  >
                    <Save className="h-3 w-3" />
                    <span>Save Override</span>
                  </button>

                  {customIframeBackup && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveBackupIframe(game.id, "");
                        setBackupUrlInput("");
                        setSaveSuccess(true);
                        setTimeout(() => {
                          setSaveSuccess(false);
                          setShowReportForm(false);
                        }, 1500);
                      }}
                      className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs rounded border border-slate-800 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {saveSuccess && (
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-center pt-1 animate-pulse">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Changes synced successfully!</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
