import React, { useRef, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Store
import useStore from './store/useStore';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import ExpandedView from './components/ExpandedView';
import MobileNav from './components/MobileNav';
import ContextMenu from './components/ContextMenu';
import PlaylistModal from './components/PlaylistModal';

// Views
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ArtistView from './views/ArtistView';
import AlbumView from './views/AlbumView';
import PlaylistView from './views/PlaylistView';
import LibraryView from './views/LibraryView';
import LoginView from './views/LoginView';
import ProfileView from './views/ProfileView';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();
  const audioRef = useRef(null);
  
  const { 
    user,
    currentSong, 
    isPlaying, 
    volume, 
    duration, 
    currentTime, 
    setDuration,
    setCurrentTime, 
    nextSong,
    fetchHome,
    fetchStream,
    notifications,
    showNotification
  } = useStore();

  // Initialize Home Data
  useEffect(() => {
    if (user) {
      fetchHome();
    }
  }, [fetchHome, user]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Manejo de la transición de canciones
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Si la canción ha cambiado y no tenemos URL todavía, pausamos el audio anterior
    if (currentSong && !currentSong.audioUrl) {
      audio.pause();
    }

    if (isPlaying && currentSong?.audioUrl) {
      audio.play().catch(err => console.log("Playback blocked or interrupted:", err));
    } else if (!isPlaying) {
      audio.pause();
    }
  }, [isPlaying, currentSong?.id, currentSong?.audioUrl]);

  // Si no hay usuario, mostramos el Login
  if (!user) {
    return (
      <div className="h-screen bg-black text-white font-sans overflow-hidden">
        <Routes>
          <Route path="*" element={<LoginView />} />
        </Routes>

        {/* NOTIFICACIONES */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2">
          {notifications.map(n => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-6 py-3 rounded-full shadow-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 backdrop-blur-md border border-white/10 ${n.type === 'error' ? 'bg-red-600/90' : 'bg-[#282828]/90'} text-white`}
            >
              {n.message}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden select-none font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-gradient-to-b from-[#121212] to-black">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomeView /></PageTransition>} />
              <Route path="/search" element={<PageTransition><SearchView /></PageTransition>} />
              <Route path="/artist/:id" element={<PageTransition><ArtistView /></PageTransition>} />
              <Route path="/album/:id" element={<PageTransition><AlbumView /></PageTransition>} />
              <Route path="/playlist/:id" element={<PageTransition><PlaylistView /></PageTransition>} />
              <Route path="/library" element={<PageTransition><LibraryView /></PageTransition>} />
              <Route path="/liked" element={<PageTransition><PlaylistView isLikedSongs={true} /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><ProfileView /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>

        <Player audioRef={audioRef} />
      </div>

      {/* GLOBAL AUDIO ELEMENT */}
      <audio 
        ref={audioRef} 
        src={currentSong?.audioUrl || null} 
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.target.duration);
          // Restaurar el tiempo guardado si existe
          if (currentTime > 0 && e.target.currentTime === 0) {
            e.target.currentTime = currentTime;
          }
        }}
        onEnded={nextSong}
        onError={() => {
          if (currentSong && isPlaying) {
             console.log("Audio URL expired, refreshing...");
             fetchStream(currentSong);
          }
        }}
      />

      <ExpandedView audioRef={audioRef} />
      <MobileNav />
      <ContextMenu />
      <PlaylistModal />

      {/* NOTIFICACIONES */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2">
        {notifications.map(n => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-6 py-3 rounded-full shadow-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 backdrop-blur-md border border-white/10 ${n.type === 'error' ? 'bg-red-600/90' : 'bg-[#282828]/90'} text-white`}
          >
            {n.message}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
