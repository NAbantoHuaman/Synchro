import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, ArrowUpDown, LayoutGrid, ListOrdered, 
  Heart, ListMusic, Music, ArrowDownWideNarrow, List
} from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const PlaylistCover = ({ songs, id }) => {
  if (id === 'favs') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
        <Heart size={24} className="text-white" fill="white" />
      </div>
    );
  }

  if (songs && songs.length >= 4) {
    return (
      <div className="grid grid-cols-2 w-full h-full">
        {songs.slice(0, 4).map((song, i) => (
          <img key={i} src={song.image} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
    );
  }

  if (songs && songs.length > 0) {
    return <img src={songs[0].image} alt="" className="w-full h-full object-cover" />;
  }

  return (
    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
      <ListMusic size={24} className="text-[#A7A7A7]" />
    </div>
  );
};

const LibraryView = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const { 
    playlists, 
    followingArtists, 
    setIsModalOpen 
  } = useStore();

  const libraryItems = [
    ...playlists.map(pl => ({ 
      id: pl.id, 
      path: `/playlist/${pl.id}`,
      name: pl.name, 
      type: 'Playlist', 
      songs: pl.songs,
      artist: pl.id === 'favs' ? `${pl.songs.length} canciones` : 'Tú',
      image: null,
      isPinned: pl.id === 'favs'
    })),
    ...followingArtists.map(artist => ({
      id: artist.id,
      path: `/artist/${artist.id}`,
      name: artist.name,
      type: 'Artista',
      image: artist.image,
      artist: 'Artista',
      isPinned: false
    }))
  ].filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'playlists') return item.type === 'Playlist';
    if (activeFilter === 'artists') return item.type === 'Artista';
    return true;
  });

  return (
    <div className="pb-32 bg-black min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-50">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-[#f472b6] flex items-center justify-center text-black font-black text-xs">S</div>
           <h1 className="text-2xl font-black text-white">Tu biblioteca</h1>
        </div>
        <div className="flex items-center gap-6">
           <Search size={26} className="text-white" />
           <button onClick={() => setIsModalOpen(true)}>
              <Plus size={28} className="text-white" />
           </button>
        </div>
      </header>

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto hide-scrollbar">
         {[
           { id: 'playlists', label: 'Playlists' },
           { id: 'albums', label: 'Álbumes' },
           { id: 'artists', label: 'Artistas' }
         ].map(filter => (
           <button 
             key={filter.id}
             onClick={() => setActiveFilter(activeFilter === filter.id ? 'all' : filter.id)}
             className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter.id ? 'bg-[#1DB954] text-black' : 'bg-white/10 text-white'}`}
           >
             {filter.label}
           </button>
         ))}
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between px-4 py-2 mb-2">
         <button className="flex items-center gap-2 text-white/90 text-sm font-bold">
            <ArrowDownWideNarrow size={18} />
            Recientes
         </button>
         <LayoutGrid size={18} className="text-white/90" />
      </div>

      {/* Library List */}
      <div className="px-2">
         {libraryItems.map((item) => (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             key={item.id} 
             onClick={() => navigate(item.path)}
             className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
           >
              <div className={`w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-2xl ${item.type === 'Artista' ? 'rounded-full' : 'rounded-md'}`}>
                {item.type === 'Artista' ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <PlaylistCover songs={item.songs} id={item.id} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="font-bold text-base text-white truncate">{item.name}</div>
                 <div className="flex items-center gap-1 text-[13px] font-bold text-white/60 truncate">
                    {item.isPinned && <ArrowDownWideNarrow size={12} className="text-[#1DB954] rotate-180" />}
                    <span>{item.type} • {item.artist}</span>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};

export default LibraryView;
