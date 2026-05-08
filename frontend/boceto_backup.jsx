import React, { useState, useRef } from 'react';
import { Home, Search, Library, PlusSquare, Heart, Play, SkipBack, SkipForward, Volume2, Maximize2, Mic2, ListMusic, MonitorSpeaker, Repeat, Shuffle, Pause, Clock, User, Youtube } from 'lucide-react';

export default function SpotifyClone() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'search', 'library'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef(null);

  // --- DATOS SIMULADOS (Mock Data - Adaptado para YouTube Music) ---
  
  // Datos para Inicio (Ej: Resultados de ytmusicapi)
  const recentSongs = [
    { id: "v_101", title: "Get Lucky", artist: "Daft Punk", albumImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "4:08" },
    { id: "v_102", title: "Blinding Lights", artist: "The Weeknd", albumImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "3:20" },
    { id: "v_103", title: "Bohemian Rhapsody", artist: "Queen", albumImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "5:55" },
    { id: "v_104", title: "Levitating", artist: "Dua Lipa", albumImage: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "3:23" },
    { id: "v_105", title: "Shape of You", artist: "Ed Sheeran", albumImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", duration: "3:53" },
    { id: "v_106", title: "Bad Guy", artist: "Billie Eilish", albumImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", duration: "3:14" },
  ];

  const featuredPlaylists = [
    { id: "p_1", title: "Mix de Pop Latino", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60", description: "YouTube Music Mix" },
    { id: "p_2", title: "Clásicos del Rock", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=60", description: "Lo mejor de las décadas" },
    { id: "p_3", title: "Lofi Hip Hop Radio", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60", description: "Beats para relajar/estudiar" },
    { id: "p_4", title: "Nuevos Lanzamientos", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60", description: "Lo último de esta semana" },
    { id: "p_5", title: "Supermix", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60", description: "Basado en lo que escuchas" },
  ];

  // Datos para Búsqueda (Secciones de YT Music)
  const searchCategories = [
    { id: 1, name: "Podcasts", color: "bg-[#282828]" },
    { id: 2, name: "En vivo", color: "bg-[#282828]" },
    { id: 3, name: "Mixes para ti", color: "bg-[#282828]" },
    { id: 4, name: "Novedades", color: "bg-[#282828]" },
    { id: 5, name: "Pop", color: "bg-[#282828]" },
    { id: 6, name: "Hip-Hop", color: "bg-[#282828]" },
    { id: 7, name: "Rock", color: "bg-[#282828]" },
    { id: 8, name: "Latina", color: "bg-[#282828]" },
    { id: 9, name: "Electrónica", color: "bg-[#282828]" },
    { id: 10, name: "Tendencias", color: "bg-[#282828]" },
    { id: 11, name: "Para concentrarse", color: "bg-[#282828]" },
    { id: 12, name: "Indie", color: "bg-[#282828]" },
  ];

  // Datos para Biblioteca
  const libraryItems = [
    { id: "l_1", title: "Tus me gusta", type: "Lista de reproducción", author: "124 canciones", image: "liked" },
    { id: "l_2", title: "Rock para programar", type: "Lista de reproducción", author: "Tú", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&auto=format&fit=crop&q=60" },
    { id: "l_3", title: "Descubrimiento Semanal", type: "Lista de reproducción", author: "YouTube Music", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&auto=format&fit=crop&q=60" },
    { id: "l_4", title: "Mix de los 90s", type: "Lista de reproducción", author: "YouTube Music", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&auto=format&fit=crop&q=60" },
    { id: "l_5", title: "Daft Punk", type: "Artista", author: "1.2M suscriptores", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=60" },
    { id: "l_6", title: "Chill vibes 2024", type: "Lista de reproducción", author: "Tú", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&auto=format&fit=crop&q=60" },
    { id: "l_7", title: "The Weeknd", type: "Artista", author: "30M suscriptores", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=60" },
  ];


  // --- FUNCIONES DE REPRODUCCIÓN ---
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current.play();
    }, 50);
  };

  // --- VISTAS (Componentes internos) ---

  const HomeView = () => (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-6">Escuchar de nuevo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recentSongs.map((song) => (
          <div 
            key={song.id} 
            className="bg-white/5 hover:bg-white/10 transition flex items-center rounded-md overflow-hidden cursor-pointer group border border-white/5"
            onClick={() => playSong(song)}
          >
            <img src={song.albumImage} alt={song.title} className="w-16 h-16 object-cover shadow-lg" />
            <div className="flex flex-col ml-4 flex-1 truncate pr-2">
               <span className="font-bold truncate text-sm">{song.title}</span>
               <span className="text-xs text-gray-400 truncate">{song.artist}</span>
            </div>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black mr-4 opacity-0 group-hover:opacity-100 transition-all shadow-xl shadow-black/50 hover:scale-105">
              <Play size={20} fill="black" className="ml-1" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Recomendados</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {featuredPlaylists.map((playlist) => (
          <div key={playlist.id} className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition duration-300 cursor-pointer group">
            <div className="relative mb-4">
              <img src={playlist.image} alt={playlist.title} className="w-full aspect-square object-cover rounded-md shadow-lg shadow-black/40" />
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all shadow-xl translate-y-2 group-hover:translate-y-0 hover:scale-105">
                <Play size={24} fill="black" className="ml-1" />
              </button>
            </div>
            <h3 className="font-bold text-base mb-1 truncate">{playlist.title}</h3>
            <p className="text-sm text-[#A7A7A7] line-clamp-2">{playlist.description}</p>
          </div>
        ))}
      </div>
    </main>
  );

  const SearchView = () => (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-6">Explorar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {searchCategories.map((category) => (
          <div 
            key={category.id} 
            className={`${category.color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer hover:bg-[#3E3E3E] transition-colors border border-white/10 flex items-center justify-center`}
          >
            <h3 className="font-bold text-lg text-center z-10">{category.name}</h3>
          </div>
        ))}
      </div>
    </main>
  );

  const LibraryView = () => (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tu biblioteca</h2>
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-400">
          <span className="hover:text-white cursor-pointer bg-white/10 px-3 py-1 rounded-full">Listas de reproducción</span>
          <span className="hover:text-white cursor-pointer bg-white/10 px-3 py-1 rounded-full">Artistas</span>
          <span className="hover:text-white cursor-pointer bg-white/10 px-3 py-1 rounded-full">Suscripciones</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Cabecera de la tabla */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-[#A7A7A7] text-sm border-b border-white/10 mb-4">
          <span>#</span>
          <span>Título</span>
          <Clock size={16} />
        </div>

        {/* Lista de items */}
        {libraryItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 py-2 hover:bg-white/10 rounded-md cursor-pointer group transition">
            <span className="text-[#A7A7A7] group-hover:hidden w-6 text-right">{index + 1}</span>
            <Play size={16} className="text-white hidden group-hover:block w-6" fill="white" />
            
            <div className="flex items-center gap-4">
              {item.image === 'liked' ? (
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded shadow-md">
                  <Heart size={20} fill="black" className="text-black" />
                </div>
              ) : (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-12 h-12 object-cover shadow-md ${item.type === 'Artista' ? 'rounded-full' : 'rounded'}`} 
                />
              )}
              <div className="flex flex-col">
                <span className={`font-bold ${item.image === 'liked' ? 'text-white' : ''}`}>{item.title}</span>
                <span className="text-sm text-[#A7A7A7]">{item.type} • {item.author}</span>
              </div>
            </div>
            
            <span className="text-[#A7A7A7] text-sm">{Math.floor(Math.random() * 3 + 2)}:{Math.floor(Math.random() * 50 + 10)}</span>
          </div>
        ))}
      </div>
    </main>
  );


  // --- RENDER PRINCIPAL ---
  return (
    <div className="h-screen flex flex-col bg-black text-white font-sans overflow-hidden select-none">
      {/* Contenedor Principal: Sidebar + Contenido */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* === BARRA LATERAL (Sidebar) === */}
        <div className="w-64 bg-black flex flex-col p-6 hidden md:flex border-r border-[#282828]">
          {/* Logo */}
          <div className="text-2xl font-bold mb-8 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className="w-8 h-8 flex items-center justify-center text-white">
              <Youtube size={28} />
            </span>
            Music Clone
          </div>

          {/* Navegación Principal */}
          <nav className="space-y-4 font-semibold text-[#A7A7A7]">
            <button 
              onClick={() => setCurrentView('home')} 
              className={`flex items-center gap-4 hover:text-white transition w-full ${currentView === 'home' ? 'text-white' : ''}`}
            >
              <Home size={24} className={currentView === 'home' ? 'stroke-white' : ''} /> Inicio
            </button>
            <button 
              onClick={() => setCurrentView('search')} 
              className={`flex items-center gap-4 hover:text-white transition w-full ${currentView === 'search' ? 'text-white' : ''}`}
            >
              <Search size={24} /> Explorar
            </button>
            <button 
              onClick={() => setCurrentView('library')} 
              className={`flex items-center gap-4 hover:text-white transition w-full ${currentView === 'library' ? 'text-white' : ''}`}
            >
              <Library size={24} /> Biblioteca
            </button>
          </nav>

          <div className="mt-8 space-y-4 font-semibold text-[#A7A7A7]">
            <button className="flex items-center gap-4 hover:text-white transition w-full">
              <span className="bg-[#A7A7A7] text-black p-1 rounded-sm hover:bg-white transition"><PlusSquare size={20} /></span> 
              Nueva lista
            </button>
            <button 
              onClick={() => setCurrentView('library')}
              className="flex items-center gap-4 hover:text-white transition w-full"
            >
              <span className="bg-white text-black p-1 rounded-sm opacity-70 hover:opacity-100 transition"><Heart size={20} fill="black" /></span> 
              Tus me gusta
            </button>
          </div>

          <hr className="border-[#282828] my-4" />

          {/* Playlists de usuario en el Sidebar */}
          <div className="flex-1 overflow-y-auto custom-scrollbar text-sm text-[#A7A7A7] space-y-3 pr-2">
            {libraryItems.filter(item => item.type.includes('Lista')).map(item => (
               <p key={item.id} className="hover:text-white cursor-pointer truncate">{item.title}</p>
            ))}
          </div>
        </div>

        {/* === ÁREA PRINCIPAL (Main Content) === */}
        <div className="flex-1 bg-black overflow-y-auto custom-scrollbar relative">
          
          {/* Top Bar dinámica */}
          <header className={`sticky top-0 z-10 px-6 py-4 flex items-center justify-between transition-colors duration-300 ${currentView === 'search' ? 'bg-black' : 'bg-black/80 backdrop-blur-md'}`}>
            <div className="flex gap-2 items-center w-full max-w-md">
              <button 
                onClick={() => setCurrentView('home')}
                className="bg-[#282828] p-2 rounded-full hover:bg-[#3E3E3E] transition text-white"
              >
                <SkipBack size={20} />
              </button>
              
              {/* Buscador visible solo en vista de búsqueda */}
              {currentView === 'search' && (
                <div className="relative flex-1 ml-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar canciones, artistas, podcasts" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#282828] text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white transition-all font-medium border border-transparent focus:border-white"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition shadow-sm border border-white/20">
                <span className="font-semibold text-sm">T</span>
              </div>
            </div>
          </header>

          {/* Renderizado Condicional de la Vista Actual */}
          {currentView === 'home' && <HomeView />}
          {currentView === 'search' && <SearchView />}
          {currentView === 'library' && <LibraryView />}

        </div>
      </div>

      {/* === BARRA DEL REPRODUCTOR (Player Bar) === */}
      <div className="h-20 bg-[#212121] border-t border-black px-4 flex items-center justify-between z-50 relative">
        
        {/* Info de la canción actual */}
        <div className="w-[30%] min-w-[180px] flex items-center gap-4">
          {currentSong ? (
            <>
              <img src={currentSong.albumImage} alt="Album" className="w-12 h-12 shadow-md" />
              <div className="flex flex-col justify-center truncate">
                <span className="text-sm font-bold hover:underline cursor-pointer truncate">{currentSong.title}</span>
                <span className="text-xs text-[#A7A7A7] hover:underline cursor-pointer truncate">{currentSong.artist}</span>
              </div>
              <Heart size={16} className="text-white cursor-pointer ml-2 flex-shrink-0 opacity-70 hover:opacity-100" />
            </>
          ) : (
            <div className="text-xs text-[#A7A7A7]">Selecciona una canción</div>
          )}
        </div>

        {/* Controles Centrales */}
        <div className="flex flex-col items-center max-w-[40%] w-full">
          <div className="flex items-center gap-4 sm:gap-6">
            <Shuffle size={20} className="text-[#A7A7A7] hover:text-white cursor-pointer hidden sm:block" />
            <SkipBack size={24} className="text-white cursor-pointer" fill="white" />
            <button 
              className="w-10 h-10 flex items-center justify-center text-white transition hover:scale-105"
              onClick={handlePlayPause}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
            </button>
            <SkipForward size={24} className="text-white cursor-pointer" fill="white" />
            <Repeat size={20} className="text-[#A7A7A7] hover:text-white cursor-pointer hidden sm:block" />
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full flex items-center gap-2 text-xs text-[#A7A7A7] absolute -top-1.5 left-0 right-0 px-0">
            <div className="h-1 bg-transparent w-full group cursor-pointer relative">
               <div className="h-1 bg-red-600 w-1/3 relative z-10"></div>
               <div className="h-1 bg-white/20 w-full absolute top-0 left-0"></div>
            </div>
          </div>
        </div>

        {/* Controles Extra */}
        <div className="w-[30%] min-w-[150px] flex justify-end items-center gap-3 sm:gap-4 text-[#A7A7A7]">
          <span className="text-xs font-medium mr-2">{isPlaying ? "0:12" : "0:00"} / {currentSong?.duration || "0:00"}</span>
          <div className="flex items-center gap-2 w-24 group cursor-pointer">
            <Volume2 size={20} className="hover:text-white" />
            <div className="h-1 bg-[#4D4D4D] rounded-full flex-1">
              <div className="h-1 bg-white rounded-full w-2/3 group-hover:bg-red-600 relative">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0 -top-1 hidden group-hover:block shadow"></div>
              </div>
            </div>
          </div>
          <Maximize2 size={18} className="hover:text-white cursor-pointer hidden lg:block" />
        </div>

        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentSong ? currentSong.audioUrl : ""} 
          onEnded={() => setIsPlaying(false)}
        />
      </div>
      
      {/* Estilos Globales para Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}} />
    </div>
  );
}