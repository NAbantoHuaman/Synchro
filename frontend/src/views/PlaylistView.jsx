import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Trash2, Play, Heart, ArrowLeft, Share2, 
  MoreVertical, Plus, Music2, Globe, CheckCircle2,
  Download, Shuffle, ArrowDownToLine, ListFilter,
  ArrowUpDown, Pencil
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatTime } from '../utils/formatTime';

const PlaylistView = ({ isLikedSongs = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    playlists, 
    currentSong, 
    playSong, 
    removeSongFromPlaylist, 
    addSongToPlaylist,
    handleContextMenu,
    featuredTracks,
    isShuffle,
    setIsShuffle
  } = useStore();

  const pl = isLikedSongs 
    ? playlists.find(p => p.id === 'favs')
    : playlists.find(p => p.id === id);

  if (!pl) return <div className="p-12 text-2xl font-black text-[#A7A7A7] animate-pulse italic">Lista no encontrada...</div>;

  const totalDurationMs = pl.songs.reduce((acc, song) => acc + (song.duration_ms || 0), 0);
  const totalHours = Math.floor(totalDurationMs / 3600000);
  const totalMinutes = Math.floor((totalDurationMs % 3600000) / 60000);
  const durationText = totalHours > 0 ? `${totalHours} h ${totalMinutes} min` : `${totalMinutes} min`;

  const formatAddedDate = (timestamp) => {
    if (!timestamp) return 'Reciente';
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 30) return `Hace ${days} días`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Recommendations based on the songs already in the playlist
  const playlistArtists = Array.from(new Set(pl.songs.map(s => s.artist)));
  const recommendations = featuredTracks
    .filter(t => !pl.songs.find(s => s.id === t.id))
    .filter(t => playlistArtists.includes(t.artist) || Math.random() > 0.7) // Favor same artists, then random
    .slice(0, 10);

  return (
    <div className="pb-32 animate-fade-in bg-[#121212] min-h-screen relative overflow-y-auto custom-scrollbar">
      {/* IMMERSIVE BACKGROUND - STRICTLY BEHIND EVERYTHING */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-white/10 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-gradient-to-b from-white/10 via-[#121212]/80 to-[#121212] pointer-events-none z-0" />
      
      {/* ALL CONTENT IN Z-10 TO BE ON TOP */}
      <div className="relative z-10">
        {/* Mobile Top Controls */}
      <div className="lg:hidden p-4 absolute top-0 left-0 right-0 z-50 flex items-center">
         <button onClick={() => navigate(-1)} className="text-white p-1">
            <ArrowLeft size={26} />
         </button>
      </div>

      {/* MOBILE HEADER (lg:hidden) */}
      <div className="lg:hidden flex flex-col pt-16 px-6 mb-6 relative z-10">
        <div className="w-64 h-64 mx-auto mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden">
           {pl.id === 'favs' ? (
             <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
               <Heart className="text-white drop-shadow-2xl w-32 h-32" fill="white" />
             </div>
           ) : pl.songs.length >= 4 ? (
             <div className="grid grid-cols-2 w-full h-full">
               {pl.songs.slice(0, 4).map((song, i) => (
                 <img key={i} src={song.image} alt="" className="w-full h-full object-cover" />
               ))}
             </div>
           ) : pl.songs.length > 0 ? (
             <img src={pl.songs[0].image || null} className="w-full h-full object-cover" alt="pl" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-[#282828]">
               <Music2 size={64} className="text-[#A7A7A7] opacity-40" />
             </div>
           )}
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2 uppercase">{pl.name}</h1>
        
        <div className="flex items-center gap-2 mb-2">
           <div className="w-6 h-6 bg-[#f472b6] rounded-full flex items-center justify-center font-black text-[10px] text-black">S</div>
           <span className="text-white font-black text-sm">Synchro</span>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
           <Globe size={14} />
           <span>{durationText}</span>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-6">
              <Plus size={24} className="text-white/60" />
              <ArrowDownToLine size={24} className="text-white/60" />
              <Share2 size={24} className="text-white/60" />
              <MoreVertical size={24} className="text-white/60" />
           </div>
           <div className="flex items-center gap-4">
              <Shuffle size={24} className={isShuffle ? "text-[#1DB954]" : "text-white/60"} onClick={() => setIsShuffle(!isShuffle)} />
              <button 
                onClick={() => pl.songs.length > 0 && playSong(pl.songs[0], 0, pl.songs)}
                className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-2xl active:scale-95 transition"
              >
                <Play className="ml-1 w-7 h-7" fill="black" />
              </button>
           </div>
        </div>
      </div>

      {/* MOBILE ACTION PILLS (lg:hidden) */}
      <div className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar px-6 mb-8">
           <button className="flex items-center gap-2 bg-[#282828] px-4 py-2 rounded-full text-white text-xs font-bold whitespace-nowrap">
              <Plus size={16} />
              Agregar
           </button>
           <button className="flex items-center gap-2 bg-[#282828] px-4 py-2 rounded-full text-white text-xs font-bold whitespace-nowrap">
              <ListFilter size={16} />
              Editar
           </button>
           <button className="flex items-center gap-2 bg-[#282828] px-4 py-2 rounded-full text-white text-xs font-bold whitespace-nowrap">
              <ArrowUpDown size={16} />
              Ordenar
           </button>
           <button className="flex items-center gap-2 bg-[#282828] px-4 py-2 rounded-full text-white text-xs font-bold whitespace-nowrap">
              <Pencil size={16} />
              Nombre y da...
           </button>
      </div>

      {/* PC HEADER SECTION (hidden lg:flex) */}
      <div className="hidden lg:flex p-8 pt-20 flex-row items-end gap-8 relative z-10">
        {/* Cover Art */}
        <div className="w-60 h-60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden flex-shrink-0">
          {pl.id === 'favs' ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
              <Heart className="text-white drop-shadow-2xl w-32 h-32" fill="white" />
            </div>
          ) : pl.songs.length >= 4 ? (
            <div className="grid grid-cols-2 w-full h-full">
              {pl.songs.slice(0, 4).map((song, i) => (
                <img key={i} src={song.image} alt="" className="w-full h-full object-cover" />
              ))}
            </div>
          ) : pl.songs.length > 0 ? (
            <img src={pl.songs[0].image || null} className="w-full h-full object-cover" alt="pl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#282828]">
              <Music2 size={64} className="text-[#A7A7A7] opacity-40" />
            </div>
          )}
        </div>

        {/* Playlist Info */}
        <div className="w-full flex-1 min-w-0 flex flex-col items-start text-left">
          <span className="text-xs font-black uppercase tracking-widest mb-2 text-white">Playlist pública</span>
          <h1 className="text-8xl font-black tracking-tighter mb-6 line-clamp-2 uppercase">{pl.name}</h1>
          
          <div className="flex items-center flex-wrap gap-2 text-sm">
            <div className="w-6 h-6 bg-[#f472b6] rounded-full flex items-center justify-center font-black text-[10px] text-black">S</div>
            <span className="text-white font-black">Synchro</span>
            <span className="text-white/60">•</span>
            <span className="text-white font-medium">{pl.songs.length} canciones</span>
            <span className="text-white/60">, {durationText}</span>
          </div>
        </div>
      </div>

      {/* PC Action Bar & List Wrapper - Start Solid Dark Color here */}
      <div className="hidden lg:block bg-[#121212]/90 backdrop-blur-sm border-t border-white/5 mt-4">
         <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => pl.songs.length > 0 && playSong(pl.songs[0], 0, pl.songs)}
              className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              <Play className="ml-1 w-7 h-7" fill="black" />
            </button>
            <button className="text-white/60 hover:text-white transition"><Heart size={32} /></button>
            <button onClick={() => setIsShuffle(!isShuffle)} className="transition-all">
               <Shuffle size={28} className={isShuffle ? "text-[#1DB954]" : "text-white/60 hover:text-white"} />
            </button>
            <button className="text-white/60 hover:text-white transition"><ArrowDownToLine size={28} /></button>
            <button className="text-white/60 hover:text-white transition"><MoreVertical size={28} /></button>
         </div>
         <div className="hidden lg:flex items-center gap-4 text-[#A7A7A7] text-sm font-bold">
            <span>Lista</span>
            <ListFilter size={20} />
         </div>
      </div>

      <div className="px-4 lg:px-8">
        {/* PC Tracks Table Header */}
        <div className="hidden lg:grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 text-[#A7A7A7] text-[13px] font-bold border-b border-white/10 mb-4 uppercase tracking-wider">
          <div className="flex justify-center">#</div>
          <div>Título</div>
          <div>Álbum</div>
          <div>Fecha en que se agregó</div>
          <div className="flex justify-end"><Clock size={16} /></div>
        </div>

        {/* Tracks List (Responsive Item) */}
        <div className="space-y-1 lg:space-y-0">
           {pl.songs.map((track, idx) => (
             <div 
               key={track.id + idx}
               onClick={() => playSong(track, idx, pl.songs)}
               onContextMenu={(e) => handleContextMenu(e, track)}
               className="grid grid-cols-1 lg:grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 lg:py-3 rounded-md group hover:bg-white/10 transition-all cursor-pointer items-center"
             >
                {/* Number / Play Icon */}
                <div className="hidden lg:flex justify-center text-[#A7A7A7] group-hover:text-white">
                   <span className="group-hover:hidden text-sm">{idx + 1}</span>
                   <Play size={14} className="hidden group-hover:block" fill="currentColor" />
                </div>

                {/* Title & Artist */}
                <div className="flex items-center gap-4 min-w-0">
                   <img src={track.image} alt="" className="w-10 h-10 lg:w-12 lg:h-12 rounded object-cover shadow-lg" />
                   <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm lg:text-base truncate ${currentSong?.id === track.id ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</div>
                      <div className="flex items-center gap-1.5">
                         {track.explicit && (
                           <span className="w-3.5 h-3.5 bg-white/40 rounded-[2px] flex items-center justify-center text-[8px] font-black text-black shrink-0">E</span>
                         )}
                         <div className="text-xs lg:text-sm font-bold text-[#A7A7A7] group-hover:text-white transition-colors truncate">{track.artist}</div>
                      </div>
                   </div>
                </div>

                {/* Album (PC Only) */}
                <div className="hidden lg:block text-sm text-[#A7A7A7] truncate group-hover:text-white">{track.album || "Single"}</div>

                {/* Date (PC Only) */}
                <div className="hidden lg:block text-sm text-[#A7A7A7] group-hover:text-white">{formatAddedDate(track.addedAt)}</div>

                {/* Duration / More (PC Only) */}
                <div className="hidden lg:flex items-center justify-end gap-4 text-[#A7A7A7] text-sm">
                   <Heart size={16} className="opacity-0 group-hover:opacity-100 hover:text-white transition" />
                   <span className="group-hover:text-white">{track.duration || "3:45"}</span>
                   <MoreVertical size={16} className="opacity-0 group-hover:opacity-100 hover:text-white transition" />
                </div>

                {/* Mobile More Button */}
                <div className="lg:hidden ml-auto">
                   <MoreVertical size={20} className="text-white/40" />
                </div>
             </div>
           ))}
        </div>

        {/* Recommendations Section */}
        {!isLikedSongs && pl.songs.length < 50 && (
          <div className="mt-12 lg:mt-20 animate-fade-in pb-20">
            <h2 className="text-xl lg:text-2xl font-black mb-6">Canciones recomendadas</h2>
            <div className="space-y-1 lg:space-y-0">
              {recommendations.map((track) => (
                <div 
                  key={track.id} 
                  className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 lg:py-3 rounded-md group hover:bg-white/5 transition-all cursor-pointer items-center"
                  onClick={() => playSong(track)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={track.image} alt="" className="w-10 h-10 lg:w-14 lg:h-14 rounded object-cover shadow-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm lg:text-base text-white truncate">{track.name}</div>
                      <div className="text-xs lg:text-sm font-bold text-[#A7A7A7] truncate">{track.artist}</div>
                    </div>
                  </div>
                  <div className="hidden lg:block text-sm text-[#A7A7A7] truncate">{track.album || "Recomendado"}</div>
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addSongToPlaylist(pl.id, track);
                      }}
                      className="px-4 py-1.5 border border-white/20 rounded-full text-xs font-black text-white hover:border-white transition active:scale-95"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  </div>
);
};

export default PlaylistView;
