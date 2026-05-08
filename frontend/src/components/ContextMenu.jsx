import React, { useEffect } from 'react';
import { ListPlus, Heart, Share2, PlusCircle, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const ContextMenu = () => {
  const { 
    contextMenu, 
    setContextMenu, 
    addToQueue, 
    toggleLike, 
    isTrackLiked, 
    playlists, 
    addTrackToPlaylist,
    showNotification 
  } = useStore();

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const handleAddToPlaylist = (playlistId, playlistName) => {
    addTrackToPlaylist(playlistId, contextMenu.track);
    setContextMenu(null);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/track/${contextMenu.track.id}`;
    navigator.clipboard.writeText(url);
    showNotification('Enlace copiado al portapapeles');
    setContextMenu(null);
  };

  return (
    <div 
      className="fixed z-[1000] bg-[#181818] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-2 min-w-[240px] backdrop-blur-3xl animate-scale-in"
      style={{ 
        left: Math.min(contextMenu.x, window.innerWidth - 250), 
        top: Math.min(contextMenu.y, window.innerHeight - 350) 
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-[10px] text-[#A7A7A7] px-4 py-3 uppercase font-black tracking-[0.2em] border-b border-white/5 mb-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
           <img src={contextMenu.track.image} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="truncate">{contextMenu.track.name}</span>
      </div>

      <button 
        onClick={() => { addToQueue(contextMenu.track); setContextMenu(null); }} 
        className="w-full text-left px-4 py-2.5 hover:bg-white/10 rounded-xl text-sm font-bold transition flex items-center justify-between text-white group"
      >
        <div className="flex items-center gap-3">
          <ListPlus size={18} className="text-[#A7A7A7] group-hover:text-white" /> 
          <span>Añadir a la cola</span>
        </div>
      </button>

      <button 
        onClick={() => { toggleLike(contextMenu.track); setContextMenu(null); }} 
        className="w-full text-left px-4 py-2.5 hover:bg-white/10 rounded-xl text-sm font-bold transition flex items-center justify-between text-white group"
      >
        <div className="flex items-center gap-3">
          <Heart 
            size={18} 
            className={isTrackLiked(contextMenu.track) ? 'text-red-600 fill-red-600' : 'text-[#A7A7A7] group-hover:text-white'} 
          /> 
          <span>{isTrackLiked(contextMenu.track) ? 'Quitar de favoritos' : 'Añadir a favoritos'}</span>
        </div>
        {isTrackLiked(contextMenu.track) && <CheckCircle2 size={14} className="text-red-600" />}
      </button>

      <div className="h-px bg-white/5 my-2" />

      <div className="px-4 py-2 text-[10px] font-black uppercase text-[#A7A7A7] tracking-widest">Añadir a playlist</div>
      <div className="max-h-[150px] overflow-y-auto custom-scrollbar px-1">
         {playlists.map(pl => (
            <button 
              key={pl.id}
              onClick={() => handleAddToPlaylist(pl.id, pl.name)}
              className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition flex items-center gap-3 text-white/80 hover:text-white group"
            >
               <PlusCircle size={16} className="text-[#A7A7A7] group-hover:text-white" />
               <span className="truncate">{pl.name}</span>
            </button>
         ))}
      </div>

      <div className="h-px bg-white/5 my-2" />
      
      <button 
        onClick={handleShare}
        className="w-full text-left px-4 py-2.5 hover:bg-white/10 rounded-xl text-sm font-bold transition flex items-center gap-3 text-white/60 hover:text-white group"
      >
        <Share2 size={18} className="text-[#A7A7A7] group-hover:text-white" /> Compartir
      </button>
    </div>
  );
};

export default ContextMenu;
