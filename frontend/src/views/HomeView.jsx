import React, { useState } from 'react';
import HomeSection from '../components/HomeSection';
import RadioCard from '../components/RadioCard';
import QuickPickCard from '../components/QuickPickCard';
import useStore from '../store/useStore';

const HomeView = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { 
    recentlyPlayed, 
    featuredTracks, 
    mixesForYou, 
    dailyMix, 
    newReleases, 
    charts,
    moodTracks,
    topPodcasts,
    classicHits,
    playSong,
    handleContextMenu,
    recommendations
  } = useStore();

  return (
    <div className="pb-32 px-4 lg:px-8 pt-4">
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
         <div className="w-8 h-8 rounded-full bg-[#f472b6] flex items-center justify-center text-black font-black text-xs">S</div>
         <div className="flex gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-[#1DB954] text-black' : 'bg-white/10 text-white'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setActiveFilter('music')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === 'music' ? 'bg-[#1DB954] text-black' : 'bg-white/10 text-white'}`}
            >
              Música
            </button>
            <button 
              onClick={() => setActiveFilter('podcasts')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === 'podcasts' ? 'bg-[#1DB954] text-black' : 'bg-white/10 text-white'}`}
            >
              Podcasts
            </button>
         </div>
      </div>

      {activeFilter !== 'podcasts' && (
        <>
          {/* SHORTCUTS GRID (Top 6 Recents) */}
          <div className="grid grid-cols-2 gap-2 lg:gap-6 mb-8 lg:mb-12">
            {recentlyPlayed.slice(0, 6).map((track, i) => (
              <QuickPickCard 
                key={i} 
                track={track} 
                onPlay={() => playSong(track, i, recentlyPlayed)} 
              />
            ))}
          </div>

          {/* SECTIONS */}
          <div className="space-y-10 lg:space-y-12">
            {recommendations.length > 0 && (
              <HomeSection 
                title="Hecho para ti" 
                tracks={recommendations} 
                onPlay={playSong} 
                onContextMenu={handleContextMenu} 
              />
            )}
            
            <HomeSection 
              title="Viernes de lanzamientos" 
              tracks={newReleases} 
              onPlay={playSong} 
              onContextMenu={handleContextMenu} 
            />
            
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-black tracking-tight">Estaciones recomendadas</h2>
                </div>
                <button className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#A7A7A7] hover:text-white transition">Mostrar todo</button>
              </div>
              <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 custom-scrollbar hide-scrollbar lg:show-scrollbar">
                {featuredTracks.slice(0, 8).map((track, i) => (
                  <RadioCard key={i} track={track} onPlay={() => playSong(track, i, featuredTracks)} />
                ))}
              </div>
            </div>

            <HomeSection title="Recientes" tracks={recentlyPlayed.slice(6)} onPlay={playSong} onContextMenu={handleContextMenu} size="small" />
            <HomeSection title="Éxitos mundiales" tracks={charts} onPlay={playSong} onContextMenu={handleContextMenu} />
            <HomeSection title="Mixes para ti" tracks={mixesForYou} onPlay={playSong} onContextMenu={handleContextMenu} />
            <HomeSection title="Estado de ánimo" tracks={moodTracks} onPlay={playSong} onContextMenu={handleContextMenu} />
          </div>
        </>
      )}

      {activeFilter === 'podcasts' && (
        <div className="space-y-12">
           <HomeSection title="Podcasts populares" tracks={topPodcasts} onPlay={playSong} onContextMenu={handleContextMenu} />
           
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <svg className="text-[#A7A7A7]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </div>
              <h2 className="text-3xl font-black mb-4">¿Buscas algo más?</h2>
              <p className="text-[#A7A7A7] font-bold max-w-sm">Sigue tus programas favoritos para ver los nuevos episodios aquí.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
