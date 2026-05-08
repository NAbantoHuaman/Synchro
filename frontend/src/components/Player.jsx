import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, SkipBack, Pause, Play, SkipForward, Repeat, 
  Maximize2, Heart, Plus, CheckCircle2, Youtube, Mic, Volume2, X,
  MonitorSpeaker, CirclePlus
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatTime } from '../utils/formatTime';

const Player = ({ audioRef }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    isShuffle, 
    repeatMode, 
    volume, 
    isExpanded,
    playlists,
    showLyrics,
    lyrics,
    syncedLyrics,
    setIsExpanded,
    togglePlay,
    prevSong,
    nextSong,
    setCurrentTime,
    setVolume,
    setIsShuffle,
    setRepeatMode,
    setShowLyrics,
    toggleLike,
    isTrackLiked,
    handleContextMenu,
    isTrackInAnyPlaylist
  } = useStore();

  if (isExpanded) return null;

  const isLiked = isTrackLiked(currentSong);

  return (
    <>
      {/* Desktop Player */}
      <div className="hidden lg:flex fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 px-4 h-24 items-center justify-between z-50">
        {/* Track Info */}
        <div className="w-[30%] flex items-center gap-4 min-w-0">
          {currentSong ? (
            <>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer w-14 h-14 shadow-2xl flex-shrink-0" 
                onClick={() => setIsExpanded(true)}
              >
                <img src={currentSong.image || null} alt="Art" className="w-full h-full object-cover rounded shadow-2xl" />
                <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 flex items-center justify-center rounded">
                  <Maximize2 size={18} />
                </div>
              </motion.div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white hover:underline cursor-pointer truncate" onClick={() => setIsExpanded(true)}>{currentSong.name}</span>
                  {currentSong.bitrate > 0 && (
                    <span className="bg-white/10 text-[8px] px-1.5 py-0.5 rounded text-white/40 font-black uppercase tracking-tighter flex-shrink-0">
                      {currentSong.format || 'webm'} {currentSong.bitrate}k
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#A7A7A7] font-semibold hover:underline cursor-pointer truncate">{currentSong.artist}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button onClick={() => toggleLike(currentSong)}>
                  <Heart 
                    size={18} 
                    className={`transition-all ${isLiked ? 'text-red-600 fill-red-600' : 'text-[#A7A7A7] hover:text-white'}`} 
                  />
                </button>
                <button 
                  onClick={(e) => handleContextMenu(e, currentSong)} 
                  className={`transition ${isTrackInAnyPlaylist && isTrackInAnyPlaylist(currentSong) ? 'text-red-600' : 'text-[#A7A7A7] hover:text-white'}`}
                >
                  {isTrackInAnyPlaylist && isTrackInAnyPlaylist(currentSong) ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                </button>
              </div>
            </>
          ) : (
            <div className="text-xs font-semibold text-[#A7A7A7] tracking-widest uppercase opacity-40 italic">Descubre nueva música...</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 max-w-[45%] flex flex-col items-center gap-1">
          <div className="flex items-center gap-6 mb-1">
            <Shuffle 
              size={18} 
              className={`cursor-pointer transition ${isShuffle ? 'text-red-600' : 'text-[#A7A7A7] hover:text-white'}`} 
              onClick={() => setIsShuffle(!isShuffle)}
            />
            <SkipBack size={24} className="text-white hover:scale-110 transition cursor-pointer" fill="white" onClick={prevSong} />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg shadow-white/10"
            >
              {currentSong && !currentSong.audioUrl ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full" />
              ) : (
                isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-0.5" />
              )}
            </motion.button>
            <SkipForward size={24} className="text-white hover:scale-110 transition cursor-pointer" fill="white" onClick={nextSong} />
            <Repeat 
              size={18} 
              className={`cursor-pointer transition ${repeatMode !== 'none' ? 'text-red-600' : 'text-[#A7A7A7] hover:text-white'}`} 
              onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
            />
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#A7A7A7] w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative group h-1 bg-white/10 rounded-full cursor-pointer">
              <input 
                type="range" 
                min="0" max={duration || 0} 
                value={currentTime} 
                onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = e.target.value; setCurrentTime(parseFloat(e.target.value)); }}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <div className="absolute top-0 left-0 h-full bg-white group-hover:bg-red-600 transition-colors rounded-full" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
            </div>
            <span className="text-[10px] font-mono text-[#A7A7A7] w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extras */}
        <div className="w-[30%] justify-end items-center gap-4 flex">
          <button onClick={() => setShowLyrics(!showLyrics)} className={`p-2 rounded-full transition ${showLyrics ? 'bg-red-600 text-white' : 'text-[#A7A7A7] hover:text-white'}`}><Mic size={20} /></button>
          <div className="flex items-center gap-3 group">
            <Volume2 size={20} className="text-[#A7A7A7] group-hover:text-white transition" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 accent-red-600" />
          </div>
          <Maximize2 size={20} className="text-[#A7A7A7] hover:text-white cursor-pointer transition" onClick={() => setIsExpanded(true)} />
        </div>
      </div>

      {/* Mobile Floating Player */}
      <AnimatePresence>
        {currentSong && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:hidden fixed bottom-[72px] left-2 right-2 h-[56px] bg-[#222222] rounded-lg shadow-2xl flex items-center px-2 z-40 overflow-hidden"
            onClick={() => setIsExpanded(true)}
          >
             <img src={currentSong.image} className="w-10 h-10 rounded object-cover shadow-lg" alt="" />
             <div className="flex-1 min-w-0 px-3">
                <div className="font-black text-sm text-white truncate">{currentSong.name}</div>
                <div className="text-[11px] font-bold text-white/60 truncate">{currentSong.artist}</div>
             </div>
             <div className="flex items-center gap-4 px-2" onClick={(e) => e.stopPropagation()}>
                <MonitorSpeaker size={22} className="text-white/60" />
                <button 
                  onClick={() => toggleLike(currentSong)}
                  className={`transition-all active:scale-90 ${isLiked ? 'text-[#1DB954]' : 'text-white'}`}
                >
                   {isLiked ? (
                     <CheckCircle2 size={24} fill="#1DB954" className="text-white" />
                   ) : (
                     <CirclePlus size={24} />
                   )}
                </button>
                <button onClick={togglePlay} className="text-white">
                   {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </button>
             </div>
             {/* Progress Line */}
             <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Player;
