import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Play, MoreHorizontal, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';

const ArtistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discogFilter, setDiscogFilter] = useState('popular');
  const [isPopularExpanded, setIsPopularExpanded] = useState(false);

  const { 
    currentArtist, 
    fetchArtist, 
    followingArtists, 
    currentSong, 
    playSong, 
    toggleFollow, 
    handleContextMenu 
  } = useStore();

  useEffect(() => {
    fetchArtist(id);
    window.scrollTo(0, 0);
  }, [id, fetchArtist]);

  if (!currentArtist) return (
    <div className="p-6 lg:p-12 space-y-12 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-12">
        <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/5 rounded-full mx-auto lg:mx-0" />
        <div className="space-y-4 flex-1">
          <div className="h-4 w-20 bg-white/5 rounded mx-auto lg:mx-0" />
          <div className="h-16 lg:h-20 w-full lg:w-96 bg-white/5 rounded" />
          <div className="h-4 w-48 bg-white/5 rounded mx-auto lg:mx-0" />
        </div>
      </div>
      <div className="space-y-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-xl" />)}
      </div>
    </div>
  );

  const isFollowing = followingArtists.some(a => a.id === currentArtist.id);
  const artistPick = currentArtist.albums?.[0] || currentArtist.tracks?.[0];

  const getFilteredDiscog = () => {
    if (discogFilter === 'albums') return currentArtist.albums || [];
    if (discogFilter === 'singles') return currentArtist.singles || [];
    return [...(currentArtist.albums || []), ...(currentArtist.singles || [])];
  };

  const filteredDiscog = getFilteredDiscog();

  const relatedArtists = (currentArtist.related && currentArtist.related.length > 0) 
    ? currentArtist.related 
    : [
        { id: 'r1', name: `${currentArtist.name} Mix`, image: currentArtist.image, listeners: 1245678 },
        { id: 'r2', name: 'Artistas similares', image: currentArtist.image, listeners: 850321 },
        { id: 'r3', name: 'Radio de ' + currentArtist.name, image: currentArtist.image, listeners: 2304958 },
        { id: 'r4', name: 'Descubrimientos', image: currentArtist.image, listeners: 110293 },
        { id: 'r5', name: 'Top Hits', image: currentArtist.image, listeners: 4567890 }
      ];

  return (
    <div className="pb-32 animate-fade-in custom-scrollbar relative">
      {/* Mobile Top Controls - Floating for immersive feel */}
      <div className="lg:hidden p-4 absolute top-0 left-0 right-0 z-50 flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="text-white bg-black/20 rounded-full p-1 backdrop-blur-sm">
            <ArrowLeft size={26} />
         </button>
      </div>

      {/* HEADER HERO */}
      <div className="relative h-[350px] lg:h-[450px] w-full overflow-hidden mb-8">
         <div className="absolute inset-0">
           {currentArtist.image && (
             <>
               <img src={currentArtist.image || null} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[80px] scale-125" alt="bg-blur" />
               <img src={currentArtist.image || null} className="relative w-full h-full object-cover opacity-100 object-top transition-all duration-700" alt="bg" />
             </>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
         </div>
         <div className="relative h-full flex flex-col justify-end p-6 lg:p-12 max-w-6xl">
            <div className="flex items-center gap-2 mb-3 lg:mb-4">
               <div className="bg-blue-500 rounded-full p-1 shadow-lg"><CheckCircle2 className="text-white w-3 h-3 lg:w-3.5 lg:h-3.5" /></div>
               <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white drop-shadow-md">Artista verificado</span>
            </div>
            <h1 className="text-5xl lg:text-[120px] font-black mb-4 lg:mb-6 tracking-tighter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] leading-none truncate">{currentArtist.name}</h1>
            <div className="flex items-center gap-2 text-white font-bold text-sm lg:text-lg drop-shadow-lg">
               <span>{currentArtist.listeners?.toLocaleString() || '1,245,678'} oyentes mensuales</span>
            </div>
         </div>
      </div>

      {/* ACTION BAR */}
      <div className="px-6 lg:px-12 flex items-center gap-6 lg:gap-8 mb-8 lg:mb-12">
         <button 
           onClick={() => playSong(currentArtist.tracks[0], 0, currentArtist.tracks)}
           className="w-14 h-14 lg:w-16 lg:h-16 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-2xl shadow-red-600/40 active:scale-95 flex-shrink-0"
         >
           <Play className="ml-1 w-7 h-7 lg:w-8 lg:h-8" fill="white" />
         </button>
         <button 
           onClick={() => toggleFollow(currentArtist)}
           className={`px-6 lg:px-8 py-2 lg:py-2.5 rounded-full border-2 font-black transition tracking-[0.2em] uppercase text-[10px] lg:text-[11px] ${isFollowing ? 'border-red-600 bg-red-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}`}
         >
           {isFollowing ? 'Siguiendo' : 'Seguir'}
         </button>
         <MoreHorizontal className="text-[#A7A7A7] hover:text-white cursor-pointer transition w-7 h-7 lg:w-8 lg:h-8" />
      </div>

      {/* POPULAR & PICK */}
      <div className="px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mb-16 lg:mb-20">
         <div>
            <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-6 lg:mb-8">Popular</h2>
            <div className="space-y-1">
               {currentArtist.tracks?.slice(0, isPopularExpanded ? 10 : 5).map((track, idx) => (
                 <div 
                   key={track.id + idx}
                   onClick={() => playSong(track, idx, currentArtist.tracks)}
                   onContextMenu={(e) => handleContextMenu(e, track)}
                   className="group flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                 >
                   <span className="hidden lg:block w-6 text-sm font-mono text-[#A7A7A7] group-hover:hidden">{idx + 1}</span>
                   <div className="w-6 hidden lg:group-hover:block"><Play size={16} className="text-white" fill="white" /></div>
                   {track.image && <img src={track.image || null} alt={track.name} className="w-10 h-10 object-cover rounded shadow-lg flex-shrink-0" />}
                   <div className="flex-1 min-w-0">
                     <div className={`font-bold text-sm truncate ${currentSong?.id === track.id ? 'text-red-600' : 'text-white'}`}>{track.name}</div>
                   </div>
                   <div className="hidden md:block text-sm text-[#A7A7A7] font-medium mr-12 opacity-60 group-hover:opacity-100 transition-opacity">{(track.playCount || 124567).toLocaleString()}</div>
                   <div className="text-[#A7A7A7] text-xs lg:text-sm font-mono opacity-60 group-hover:opacity-100 min-w-[40px] text-right">
                     {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                   </div>
                 </div>
               ))}
               <button onClick={() => setIsPopularExpanded(!isPopularExpanded)} className="text-[10px] lg:text-xs font-black text-[#A7A7A7] hover:text-white uppercase tracking-[0.2em] mt-4 lg:mt-6 px-4">
                 {isPopularExpanded ? 'Ver menos' : 'Ver más'}
               </button>
            </div>
         </div>

         {artistPick && (
           <div className="bg-white/5 rounded-3xl p-6 lg:p-8 border border-white/5">
              <h2 className="text-lg lg:text-xl font-black tracking-tight mb-6 lg:mb-8">Selección del artista</h2>
              <div className="flex gap-4 lg:gap-6">
                 <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                    <img src={artistPick.image || null} className="w-full h-full object-cover" alt="pick" />
                 </div>
                 <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                       <img src={currentArtist.image || null} className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border border-white/10" alt="a" />
                       <span className="text-[9px] lg:text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Publicado por {currentArtist.name}</span>
                    </div>
                    <div className="font-black text-white text-base lg:text-lg leading-tight mb-1 truncate max-w-[200px]">{artistPick.name}</div>
                    <div className="text-xs text-[#A7A7A7] font-bold">{artistPick.year || '2024'} • Álbum</div>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* DISCOGRAPHY */}
      <div className="px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-black tracking-tight">Discografía</h2>
          <button className="text-[10px] lg:text-xs font-black text-[#A7A7A7] hover:text-white uppercase tracking-widest">Mostrar todo</button>
        </div>
        <div className="flex gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2 hide-scrollbar">
          {['popular', 'albums', 'singles'].map(type => (
            <button key={type} onClick={() => setDiscogFilter(type)} className={`px-4 lg:px-6 py-2 rounded-full text-[10px] lg:text-xs font-black transition flex-shrink-0 ${discogFilter === type ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {type === 'popular' ? 'Populares' : type === 'albums' ? 'Álbumes' : 'Sencillos'}
            </button>
          ))}
        </div>
        <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-6 custom-scrollbar">
           {filteredDiscog.map((album, idx) => (
             <div key={album.id + idx} onClick={() => navigate(`/album/${album.id}`)} className="group w-40 lg:w-48 flex-shrink-0 cursor-pointer">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl shadow-2xl bg-[#181818]">
                   <img src={album.image || null} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl lg:translate-y-4 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                       <Play className="ml-1 w-5 h-5 lg:w-6 lg:h-6" fill="white" />
                    </button>
                </div>
                <div className="font-bold text-white text-sm mb-1 truncate">{album.name}</div>
                <div className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-widest">{album.year} • {album.type || 'Álbum'}</div>
             </div>
           ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="px-6 lg:px-12 mb-16">
         <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-6 lg:mb-8">Acerca de</h2>
         <div 
           className="relative h-[400px] lg:h-[500px] w-full rounded-3xl lg:rounded-[40px] overflow-hidden group cursor-pointer shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]"
         >
            <img src={currentArtist.image || null} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" alt="bio" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 lg:p-12 max-w-2xl">
               <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div className="flex flex-col">
                     <span className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-1 lg:mb-2">#{currentArtist.rank || '12'}</span>
                     <span className="text-[8px] lg:text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">En el mundo</span>
                  </div>
                  <div className="w-px h-8 lg:h-12 bg-white/20" />
                  <div className="flex flex-col">
                     <span className="text-xl lg:text-2xl font-black text-white tracking-tighter mb-1">{currentArtist.listeners?.toLocaleString() || '1.2M'}</span>
                     <span className="text-[8px] lg:text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Oyentes mensuales</span>
                  </div>
               </div>
               <p className="text-sm lg:text-lg text-white/80 font-medium leading-relaxed line-clamp-3 mb-4 lg:mb-6">
                 {currentArtist.description || `${currentArtist.name} es uno de los artistas más influyentes de la actualidad, dominando las listas de éxitos con su estilo único y producciones de vanguardia.`}
               </p>
               <button className="text-xs lg:text-sm font-black text-white uppercase tracking-widest hover:underline transition">Ver más</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ArtistView;
