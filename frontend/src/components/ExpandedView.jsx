import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, MoreHorizontal, Heart, Plus, Shuffle, SkipBack, Pause, Play, 
  SkipForward, Repeat, ListMusic, Mic2, X, CheckCircle2, CirclePlus, 
  Share2, Disc, User, Music, ListOrdered, Search, PlusCircle, Laptop2, 
  Share, LayoutList, MonitorSpeaker, Clock
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatTime } from '../utils/formatTime';
import BottomSheet from './BottomSheet';

const ExpandedView = ({ audioRef }) => {
  const [isPlaylistSheetOpen, setIsPlaylistSheetOpen] = useState(false);
  const [isOptionsSheetOpen, setIsOptionsSheetOpen] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState('');

  const { 
    isExpanded, 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    isShuffle, 
    repeatMode, 
    showLyrics,
    showQueue,
    queue,
    playlists,
    setIsExpanded, 
    setShowLyrics,
    setShowQueue,
    toggleLike, 
    togglePlay, 
    prevSong, 
    nextSong, 
    setIsShuffle, 
    setRepeatMode, 
    setCurrentTime,
    isTrackLiked,
    handleContextMenu,
    playSong,
    isTrackInAnyPlaylist,
    addTrackToPlaylist,
    removeSongFromPlaylist,
    addToQueue
  } = useStore();

  if (!isExpanded) return null;

  const isLiked = isTrackLiked(currentSong);

  const handleSaveClick = () => {
    if (!isLiked) {
      toggleLike(currentSong);
    } else {
      setIsPlaylistSheetOpen(true);
    }
  };

  const filteredPlaylists = playlists.filter(p => 
    p.name.toLowerCase().includes(playlistSearch.toLowerCase())
  );

  const isSongInPlaylist = (playlist) => {
    return playlist.songs.some(s => s.id === currentSong?.id);
  };

  const togglePlaylistSelection = (playlist) => {
    if (isSongInPlaylist(playlist)) {
      removeSongFromPlaylist(playlist.id, currentSong.id);
    } else {
      addTrackToPlaylist(playlist.id, currentSong);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 35, stiffness: 200 }}
      className="fixed inset-0 bg-[#121212] z-[100] overflow-hidden flex flex-col"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2a] via-[#121212] to-[#0a0a0a] opacity-90" />
      
      {/* Header */}
      <header className="relative z-10 p-4 lg:p-8 flex items-center justify-between">
        <button onClick={() => setIsExpanded(false)} className="text-white/60 hover:text-white transition-all hover:scale-110">
          <ChevronLeft className="rotate-[-90deg] lg:rotate-0" size={32} />
        </button>
        
        <div className="flex flex-col items-center">
           <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Reproduciendo desde artista</span>
           <span className="text-xs lg:text-sm font-black text-white">{currentSong?.artist}</span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic llegue al window y cierre el menú inmediatamente
            if (window.innerWidth >= 1024) {
              handleContextMenu(e, currentSong);
            } else {
              setIsOptionsSheetOpen(true);
            }
          }} 
          className="text-white/60 hover:text-white transition-all hover:scale-110"
        >
          <MoreHorizontal size={28} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-20 px-8 lg:px-24 py-4 lg:py-12 overflow-hidden">
        
        {/* Art Section */}
        <div className="w-full aspect-square max-w-[340px] lg:max-w-[500px] flex-shrink-0 flex items-center justify-center">
           <img 
             src={currentSong?.image || null} 
             alt="Art" 
             className="w-full aspect-square object-cover rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] lg:shadow-[0_50px_150px_rgba(0,0,0,0.9)]" 
           />
        </div>

        {/* Info & Controls Section */}
        <div className="w-full max-w-[400px] lg:max-w-[500px] flex flex-col justify-center">
            {/* Spacer to maintain layout without lyrics */}
            <div className="h-24 lg:hidden" />

            {/* Info & Save Button */}
            <div className="w-full flex items-center justify-between mb-6 lg:mb-10">
               <div className="flex-1 min-w-0 pr-6">
                  <h1 className="text-2xl lg:text-5xl font-black text-white truncate mb-1 lg:mb-3 tracking-tight">{currentSong?.name}</h1>
                  <p className="text-base lg:text-xl font-bold text-white/50 truncate hover:text-white cursor-pointer transition-colors">{currentSong?.artist}</p>
               </div>
               <button 
                 onClick={handleSaveClick}
                 className={`transition-all hover:scale-110 active:scale-90 ${isLiked ? 'text-[#1DB954]' : 'text-white'}`}
               >
                 {isLiked ? (
                   <CheckCircle2 size={32} fill="#1DB954" className="text-white" />
                 ) : (
                   <CirclePlus size={32} />
                 )}
               </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-8 lg:mb-12 group">
               <div className="relative h-1 w-full bg-white/10 rounded-full mb-3">
                  <input 
                    type="range" 
                    min="0" max={duration || 0} 
                    value={currentTime} 
                    onChange={(e) => { 
                      if (audioRef.current) audioRef.current.currentTime = e.target.value; 
                      setCurrentTime(parseFloat(e.target.value)); 
                    }} 
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" 
                  />
                  <div 
                    className="h-full bg-white relative z-10 rounded-full" 
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  >
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                  </div>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-white/40 tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
               </div>
            </div>

            {/* Main Controls */}
            <div className="w-full flex items-center justify-between mb-10 lg:mb-14">
               <button 
                 onClick={() => setIsShuffle(!isShuffle)}
                 className={`transition-all hover:scale-110 ${isShuffle ? 'text-[#1DB954]' : 'text-white'}`}
               >
                 <Shuffle size={24} />
               </button>
               
               <button onClick={prevSong} className="text-white hover:scale-110 transition-all active:scale-95">
                 <SkipBack size={36} fill="currentColor" />
               </button>
               
               <button 
                 onClick={togglePlay}
                 className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-90 transition-all"
               >
                 {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
               </button>

               <button onClick={nextSong} className="text-white hover:scale-110 transition-all active:scale-95">
                 <SkipForward size={36} fill="currentColor" />
               </button>

               <button 
                 className="text-white/40 hover:text-white transition-all hover:scale-110"
               >
                 <Clock size={24} />
               </button>
            </div>

            {/* Footer Actions */}
            <div className="w-full flex items-center justify-between">
               <button className="text-white/60 hover:text-white transition-colors">
                  <MonitorSpeaker size={20} />
               </button>
               <div className="flex items-center gap-8">
                  <button className="text-white/60 hover:text-white transition-colors">
                     <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => setShowQueue(!showQueue)}
                    className={`transition-colors ${showQueue ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'}`}
                  >
                     <LayoutList size={20} />
                  </button>
               </div>
            </div>
        </div>
      </div>

      {/* MODALS */}
      <BottomSheet isOpen={isPlaylistSheetOpen} onClose={() => setIsPlaylistSheetOpen(false)} title="Guardado en">
        <div className="flex flex-col gap-6 p-4">
           <div onClick={() => toggleLike(currentSong)} className="flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
                 <Heart size={20} fill="white" className="text-white" />
              </div>
              <div className="flex-1 font-bold text-lg">Tus me gusta</div>
              <CheckCircle2 size={24} className="text-white" fill={isLiked ? '#1DB954' : 'none'} />
           </div>

           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" placeholder="Buscar playlist" value={playlistSearch}
                onChange={(e) => setPlaylistSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none"
              />
           </div>

           <div className="space-y-4">
              {filteredPlaylists.filter(p => p.id !== 'favs').map(playlist => (
                <div key={playlist.id} onClick={() => togglePlaylistSelection(playlist)} className="flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                    {playlist.songs[0] ? <img src={playlist.songs[0].image} className="w-full h-full object-cover" alt="" /> : <Music size={20} className="text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{playlist.name}</div>
                    <div className="text-xs text-white/50 font-bold">{playlist.songs.length} canciones</div>
                  </div>
                  <CheckCircle2 size={24} className="text-white" fill={isSongInPlaylist(playlist) ? '#1DB954' : 'none'} />
                </div>
              ))}
           </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={isOptionsSheetOpen} onClose={() => setIsOptionsSheetOpen(false)} title="">
        <div className="p-4 flex flex-col gap-2">
           <div className="flex items-center gap-4 mb-8">
              <img src={currentSong?.image} className="w-16 h-16 rounded-xl shadow-2xl" alt="" />
              <div className="min-w-0">
                 <div className="font-black text-xl truncate">{currentSong?.name}</div>
                 <div className="text-white/50 font-bold">{currentSong?.artist}</div>
              </div>
           </div>
           {[
             { icon: Share2, label: 'Compartir' },
             { icon: Mic2, label: 'Letra', onClick: () => setShowLyrics(true) },
             { icon: PlusCircle, label: 'Agregar a playlist', onClick: () => setIsPlaylistSheetOpen(true) },
             { icon: ListOrdered, label: 'Agregar a la cola', onClick: () => addToQueue(currentSong) },
             { icon: Disc, label: 'Ir al álbum' },
             { icon: User, label: 'Ir al artista' },
           ].map((opt, i) => (
             <button key={i} onClick={() => { if(opt.onClick) opt.onClick(); setIsOptionsSheetOpen(false); }} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all font-bold">
                <opt.icon size={24} className="text-white/60" /> {opt.label}
             </button>
           ))}
        </div>
      </BottomSheet>
    </motion.div>
  );
};

export default ExpandedView;
