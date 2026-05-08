import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Camera, ArrowLeft, X, Play, Plus, 
  CheckCircle2, Disc, User, Loader2
} from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const SearchView = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    handleSearch, 
    searchResults, 
    loading, 
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    playSong,
    currentSong,
    moodTracks,
    featuredTracks,
    charts,
    recentlyPlayed
  } = useStore();

  const handleItemClick = (item) => {
    addToSearchHistory(item);
    if (item.type === 'Artista') {
      navigate(`/artist/${item.id}`);
    } else {
      playSong(item);
    }
  };

  const exploreCategories = [
    { title: 'Música', color: 'bg-[#E13300]', image: charts[0]?.image },
    { title: 'Podcasts', color: 'bg-[#1E3264]', image: moodTracks[0]?.image },
    { title: 'Eventos en vivo', color: 'bg-[#842E00]', image: moodTracks[1]?.image },
    { title: 'Creado para ti', color: 'bg-[#1E3264]', image: featuredTracks[0]?.image },
    { title: 'Próximos lanzamientos', color: 'bg-[#0D73EC]', image: featuredTracks[1]?.image },
    { title: 'Nuevos lanzamientos', color: 'bg-[#E8115B]', image: featuredTracks[2]?.image },
    { title: 'Pop', color: 'bg-[#148A08]', image: featuredTracks[3]?.image },
    { title: 'Latina', color: 'bg-[#E13300]', image: featuredTracks[4]?.image },
  ];

  const discoverCards = [
    { title: '#EDM', image: moodTracks[2]?.image || 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&q=80' },
    { title: '#alternativo español', image: moodTracks[3]?.image || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80' },
    { title: '#rock latino', image: moodTracks[4]?.image || 'https://images.unsplash.com/photo-1459749411177-0421800673d6?w=800&q=80' },
  ];

  return (
    <div className="pb-32 bg-black min-h-screen">
      <AnimatePresence mode="wait">
        {!isFocused && !searchQuery ? (
          <motion.div 
            key="initial"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 lg:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-[#f472b6] flex items-center justify-center text-black font-black text-xs lg:hidden">S</div>
                 <h1 className="text-2xl lg:text-3xl font-black text-white">Buscar</h1>
              </div>
              <Camera className="text-white lg:hidden" size={24} />
            </div>

            {/* Large Search Bar - Only on mobile, desktop uses global header */}
            <div 
              onClick={() => setIsFocused(true)}
              className="lg:hidden w-full bg-white flex items-center gap-3 px-4 py-3 rounded-md mb-8 cursor-pointer"
            >
              <Search className="text-black/70" size={22} />
              <span className="text-black/60 font-bold text-sm lg:text-base">¿Qué quieres escuchar?</span>
            </div>

            {/* Discover Section */}
            <section className="mb-10 lg:mb-12">
               <h2 className="text-lg lg:text-xl font-black text-white mb-6">Descubre algo nuevo para ti</h2>
               <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                  {discoverCards.map((card, i) => (
                    <div key={i} className="relative w-40 lg:w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                       {card.image && <img src={card.image} className="w-full h-full object-cover" alt="" />}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                       <div className="absolute bottom-4 left-4 font-black text-white text-sm">{card.title}</div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Explore All Section */}
            <section>
               <h2 className="text-lg lg:text-xl font-black text-white mb-6">Explorar todo</h2>
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {exploreCategories.map((cat, i) => (
                    <div 
                      key={i} 
                      className={`${cat.color} rounded-lg aspect-[16/9] lg:aspect-[4/3] p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                    >
                       <span className="text-base lg:text-xl font-black text-white relative z-10 leading-tight">{cat.title}</span>
                       {cat.image ? (
                         <img 
                           src={cat.image} 
                           className="absolute -right-4 -bottom-2 w-16 lg:w-24 h-16 lg:h-24 object-cover rotate-[25deg] shadow-2xl" 
                           alt="" 
                         />
                       ) : (
                         <div className="absolute -right-4 -bottom-2 w-16 h-16 bg-black/20 rounded rotate-[25deg]" />
                       )}
                    </div>
                  ))}
               </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="focused"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-0 flex flex-col h-screen"
          >
            {/* Focused Header - Only on mobile, desktop uses global header */}
            <header className="lg:hidden bg-[#121212] p-4 flex items-center gap-4 sticky top-0 z-50">
               <button onClick={() => { setIsFocused(false); setSearchQuery(''); }} className="text-white">
                  <ArrowLeft size={24} />
               </button>
               <div className="flex-1 bg-[#242424] flex items-center px-4 py-2.5 rounded-md">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="¿Qué quieres escuchar?"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim()) handleSearch(e.target.value);
                    }}
                    className="w-full bg-transparent text-white text-sm lg:text-base outline-none font-bold"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-white/60">
                       <X size={20} />
                    </button>
                  )}
               </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 text-white/40">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="font-bold">Buscando...</p>
                 </div>
               ) : searchQuery.trim() ? (
                 /* Search Results */
                 <div className="space-y-6 animate-fade-in">
                    {/* Top Result */}
                    {searchResults.artists?.[0] && (
                      <div className="mb-8">
                         <h2 className="text-xl font-black mb-4">Resultado principal</h2>
                         <div 
                           onClick={() => handleItemClick({...searchResults.artists[0], type: 'Artista'})}
                           className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/10"
                         >
                            <img src={searchResults.artists[0].image} className="w-20 h-20 rounded-full object-cover shadow-2xl" alt="" />
                            <div>
                               <div className="text-2xl font-black">{searchResults.artists[0].name}</div>
                               <div className="text-white/50 font-bold text-sm">Artista</div>
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Songs List */}
                    <div className="space-y-4">
                       <h2 className="text-xl font-black">Canciones</h2>
                       {searchResults.songs?.slice(0, 10).map((song) => (
                         <div 
                           key={song.id} 
                           onClick={() => handleItemClick({...song, type: 'Canción'})}
                           className="flex items-center gap-4 group cursor-pointer"
                         >
                            <img src={song.image} className="w-12 h-12 rounded object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                               <div className={`font-bold truncate ${currentSong?.id === song.id ? 'text-[#1DB954]' : 'text-white'}`}>{song.name}</div>
                               <div className="text-white/50 text-xs font-bold truncate">Canción • {song.artist}</div>
                            </div>
                            <Plus size={20} className="text-white/40" />
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 /* Recent Searches */
                 <div className="animate-fade-in">
                    <h2 className="text-xl font-black mb-6">Contenido reciente</h2>
                    <div className="space-y-6">
                       {(searchHistory.length > 0 ? searchHistory : recentlyPlayed.slice(0, 5)).map((item) => (
                         <div key={item.id} className="flex items-center gap-4 group">
                            <div 
                              className="flex-1 flex items-center gap-4 cursor-pointer"
                              onClick={() => {
                                if (item.type === 'Artista') navigate(`/artist/${item.id}`);
                                else playSong(item);
                              }}
                            >
                               <img 
                                 src={item.image} 
                                 className={`w-14 h-14 object-cover shadow-lg ${item.type === 'Artista' ? 'rounded-full' : 'rounded'}`} 
                                 alt="" 
                               />
                               <div className="flex-1 min-w-0">
                                  <div className="font-bold text-base truncate">{item.name}</div>
                                  <div className="text-white/50 text-sm font-bold truncate">
                                     {item.type || (item.songs ? 'Playlist' : 'Canción')} • {item.artist || item.owner || 'Reciente'}
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-6 px-2">
                               <Plus size={20} className="text-white/40" />
                               <button onClick={() => removeFromSearchHistory(item.id)} className="text-white/40 hover:text-white">
                                  <X size={20} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchView;
