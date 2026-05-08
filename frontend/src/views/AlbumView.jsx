import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Play, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import { formatTime } from '../utils/formatTime';

const AlbumView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAlbum, fetchAlbum, currentSong, playSong } = useStore();

  useEffect(() => {
    fetchAlbum(id);
  }, [id, fetchAlbum]);

  if (!currentAlbum) return <div className="p-6 lg:p-12 animate-pulse flex flex-col gap-8"><div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/5 rounded-xl shadow-2xl mx-auto lg:mx-0" /><div className="space-y-4 text-center lg:text-left"><div className="h-10 w-full lg:w-96 bg-white/5 rounded" /><div className="h-4 w-48 bg-white/5 rounded mx-auto lg:mx-0" /></div></div>;
  
  return (
    <div className="pb-32 animate-fade-in relative">
      {/* Mobile Top Controls */}
      <div className="lg:hidden p-4 absolute top-0 left-0 right-0 z-50 flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="text-white bg-black/20 rounded-full p-1 backdrop-blur-sm">
            <ArrowLeft size={26} />
         </button>
      </div>

      <div className="relative p-6 lg:p-8 pt-16 lg:pt-16 flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8 bg-gradient-to-b from-white/25 via-white/5 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent opacity-50" />
        <img src={currentAlbum.image || null} className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto lg:mx-0 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)] rounded-xl object-cover z-10" alt="Album" />
        <div className="relative z-10 text-center lg:text-left flex-1 min-w-0">
          <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white mb-2 block">{currentAlbum.type || 'Álbum'}</span>
          <h1 className="text-4xl lg:text-8xl font-black mb-4 lg:mb-6 tracking-tighter drop-shadow-2xl truncate">{currentAlbum.name}</h1>
          <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-xs lg:text-sm text-white">
            <span className="hover:underline cursor-pointer">{currentAlbum.artist}</span>
            <span className="text-[#A7A7A7]">•</span>
            <span>{currentAlbum.year}</span>
            <span className="text-[#A7A7A7]">•</span>
            <span>{currentAlbum.tracks?.length} canciones</span>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        <div className="flex items-center gap-6 mb-8 lg:mb-10">
           <button 
             onClick={() => playSong(currentAlbum.tracks[0], 0, currentAlbum.tracks)}
             className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-2xl active:scale-95 transition"
           >
             <Play size={24} fill="black" className="ml-1" />
           </button>
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 py-2 text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-[#A7A7A7] border-b border-white/5 mb-4">
            <span>#</span>
            <span>Título</span>
            <Clock size={16} />
          </div>
          {currentAlbum.tracks?.map((track, idx) => (
            <div 
              key={track.id + idx}
              onClick={() => playSong(track, idx, currentAlbum.tracks)}
              className="group flex items-center gap-4 px-3 lg:px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent"
            >
              <img src={currentAlbum.image} className="w-10 h-10 rounded object-cover shadow-lg lg:hidden" alt="" />
              <div className="min-w-0 flex-1">
                <div className={`font-bold text-sm lg:text-base truncate ${currentSong?.id === track.id ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</div>
                <div className="text-[11px] lg:text-sm text-[#A7A7A7] font-bold group-hover:text-white transition-colors truncate">{track.artist}</div>
              </div>
              <span className="text-[#A7A7A7] text-xs lg:text-sm font-mono font-bold w-10 lg:w-12 text-right">{formatTime(track.duration_ms / 1000)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumView;
