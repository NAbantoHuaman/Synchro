import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const useStore = create(
  persist(
    (set, get) => ({
      // --- PLAYER STATE ---
      isPlaying: false,
      currentSong: null,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      queue: [],
      currentIndex: -1,
      isShuffle: false,
      repeatMode: 'none',
      isExpanded: false,
      showVideo: false,
      showLyrics: false,
      showQueue: false,
      lyrics: '',
      syncedLyrics: [],

      // --- LIBRARY STATE ---
      playlists: [{ id: 'favs', name: 'Tus me gusta', songs: [] }],
      recentlyPlayed: [],
      followingArtists: [],

      // --- UI STATE ---
      currentView: 'home',
      searchQuery: '',
      searchResults: { songs: [], artists: [] },
      suggestions: [],
      currentArtist: null,
      currentAlbum: null,
      loading: false,
      notifications: [],
      libraryFilter: 'all',
      contextMenu: null,
      isModalOpen: false,
      searchHistory: [],

      // --- HOME DATA ---
      featuredTracks: [],
      newReleases: [],
      mixesForYou: [],
      charts: [],
      moodTracks: [],
      topPodcasts: [],
      classicHits: [],
      dailyMix: [],
      recommendations: [],
      
      // --- AUTH STATE ---
      user: null,
      token: null,

      // --- ACTIONS ---
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setVolume: (volume) => set({ volume }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setIsExpanded: (expanded) => set({ isExpanded: expanded }),
      setShowVideo: (show) => set({ showVideo: show }),
      setIsModalOpen: (open) => set({ isModalOpen: open }),
      setShowLyrics: (show) => set({ showLyrics: show }),
      setShowQueue: (show) => set({ showQueue: show }),
      setIsShuffle: (isShuffle) => set({ isShuffle }),
      setRepeatMode: (repeatMode) => set({ repeatMode }),
      setLibraryFilter: (filter) => set({ libraryFilter: filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setContextMenu: (menu) => set({ contextMenu: menu }),
      handleContextMenu: (e, track) => {
        e.preventDefault();
        set({ contextMenu: { x: e.clientX, y: e.clientY, track } });
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      fetchStream: async (song) => {
        if (!song || song.audioUrl) return;
        try {
          const res = await axios.get(`${API_URL}/track/${song.id}`);
          // Solo actualizamos la URL de audio y otros campos técnicos,
          // preservando el nombre, artista e imagen originales para evitar "YouTube Track"
          const updatedSong = { 
            ...song, 
            audioUrl: res.data.streamUrl,
            bitrate: res.data.bitrate,
            format: res.data.format,
            name: (song.name && song.name !== 'YouTube Track') ? song.name : res.data.name,
            artist: (song.artist && song.artist !== 'YouTube Music') ? song.artist : res.data.artist,
            image: song.image || res.data.image
          };
          set((state) => ({ 
            currentSong: updatedSong,
            queue: state.queue.map(s => s.id === song.id ? { ...s, ...updatedSong } : s)
          }));
        } catch (error) {
          console.error("Error fetching stream:", error);
          get().showNotification("Error al cargar el audio", "error");
        }
      },

      playSong: async (song, index = -1, songList = []) => {
        if (!song) return;
        set({
          currentSong: song,
          isPlaying: true,
          currentTime: 0,
          duration: 0,
          queue: songList.length > 0 ? songList : [song],
          currentIndex: index !== -1 ? index : (songList.findIndex(s => s.id === song.id) || 0)
        });
        
        // Add to recently played
        const recentlyPlayed = get().recentlyPlayed;
        const filtered = recentlyPlayed.filter(s => s.id !== song.id);
        set({ recentlyPlayed: [song, ...filtered].slice(0, 50) });

        await get().fetchStream(song);
        get().preloadNextTracks();
      },

      preloadNextTracks: async () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        // Precargamos los siguientes 2 temas
        const toPreload = queue.slice(currentIndex + 1, currentIndex + 3);
        
        for (const track of toPreload) {
          if (track.audioUrl) continue; // Ya cargado

          try {
            const res = await axios.get(`${API_URL}/track/${track.id}`);
            const streamData = {
              audioUrl: res.data.streamUrl,
              bitrate: res.data.bitrate,
              format: res.data.format,
              duration_ms: res.data.duration_ms || track.duration_ms
            };

            set((state) => ({
              queue: state.queue.map(s => s.id === track.id ? { ...s, ...streamData } : s)
            }));
            console.log(`Preloaded: ${track.name}`);
          } catch (e) {
            console.log(`Failed to preload: ${track.name}`);
          }
        }
      },

      nextSong: async () => {
        const { queue, currentIndex, repeatMode, isShuffle } = get();
        if (queue.length === 0) return;

        let nextIdx;
        if (isShuffle) {
          nextIdx = Math.floor(Math.random() * queue.length);
        } else {
          nextIdx = currentIndex + 1;
          if (nextIdx >= queue.length) {
            nextIdx = repeatMode === 'all' ? 0 : currentIndex;
          }
        }
        
        if (nextIdx !== currentIndex || repeatMode === 'all') {
          const nextSong = queue[nextIdx];
          set({ currentSong: nextSong, currentIndex: nextIdx, isPlaying: true, currentTime: 0, duration: 0 });
          await get().fetchStream(nextSong);
          get().preloadNextTracks();
        }
      },

      prevSong: async () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : 0;
        const prevSong = queue[prevIdx];
        set({ currentSong: prevSong, currentIndex: prevIdx, isPlaying: true, currentTime: 0, duration: 0 });
        await get().fetchStream(prevSong);
      },

      addToQueue: (track) => {
        if (!track) return;
        set((state) => ({ queue: [...state.queue, track] }));
        get().showNotification('Añadido a la cola');
      },

      toggleLike: (track) => {
        if (!track) return;
        const { playlists, showNotification } = get();
        const favs = playlists.find(p => p.id === 'favs');
        const isLiked = favs.songs.some(s => s.id === track.id);

        let newPlaylists;
        if (isLiked) {
          newPlaylists = playlists.map(p => 
            p.id === 'favs' ? { ...p, songs: p.songs.filter(s => s.id !== track.id) } : p
          );
          showNotification('Eliminado de tus Me gusta', 'info');
        } else {
          newPlaylists = playlists.map(p => 
            p.id === 'favs' ? { ...p, songs: [{ ...track, addedAt: Date.now() }, ...p.songs] } : p
          );
          showNotification('Añadido a tus Me gusta', 'success');
        }
        set({ playlists: newPlaylists });
      },

      isTrackLiked: (track) => {
        if (!track) return false;
        const favs = get().playlists.find(p => p.id === 'favs');
        return favs?.songs.some(s => s.id === track.id) || false;
      },

      isTrackInAnyPlaylist: (track) => {
        if (!track) return false;
        const { playlists } = get();
        // Excluimos 'favs' de esta comprobación si queremos que se refiera solo a playlists creadas,
        // o lo incluimos si queremos cualquier lista. Spotify usa el check para cualquier lista.
        return playlists.some(p => p.songs.some(s => s.id === track.id));
      },

      showNotification: (message, type = 'success') => {
        const id = Date.now();
        set((state) => ({ notifications: [...state.notifications, { id, message, type }] }));
        setTimeout(() => set((state) => ({ 
          notifications: state.notifications.filter(n => n.id !== id) 
        })), 3000);
      },

      fetchHome: async () => {
        try {
          const [homeRes, newRes, mixesRes, chartsRes, moodRes, podRes, classicRes] = await Promise.all([
            axios.get(`${API_URL}/home`),
            axios.get(`${API_URL}/search?q=Nuevos lanzamientos 2024`),
            axios.get(`${API_URL}/search?q=Mix de musica`),
            axios.get(`${API_URL}/search?q=Top Global Charts`),
            axios.get(`${API_URL}/search?q=Focus Relaxing Music`),
            axios.get(`${API_URL}/search?q=Podcast Español`),
            axios.get(`${API_URL}/search?q=Classic Rock Hits`),
          ]);
          set({
            featuredTracks: homeRes.data,
            newReleases: newRes.data.songs ? newRes.data.songs.slice(0, 10) : [],
            mixesForYou: mixesRes.data.songs ? mixesRes.data.songs.slice(0, 10) : [],
            charts: chartsRes.data.songs ? chartsRes.data.songs.slice(0, 10) : [],
            moodTracks: moodRes.data.songs ? moodRes.data.songs.slice(0, 10) : [],
            topPodcasts: podRes.data.songs ? podRes.data.songs.slice(0, 10) : [],
            classicHits: classicRes.data.songs ? classicRes.data.songs.slice(0, 10) : [],
          });
          get().fetchRecommendations();
        } catch (error) {
          console.error('Error fetching home content:', error);
        }
      },

      fetchRecommendations: async () => {
        const { followingArtists, recentlyPlayed, searchHistory } = get();
        
        // Obtenemos una lista de intereses (artistas seguidos o escuchados recientemente)
        const interests = [
          ...followingArtists.map(a => a.name),
          ...recentlyPlayed.slice(0, 5).map(s => s.artist),
          ...searchHistory.slice(0, 3).map(h => h.name || h.text)
        ].filter(Boolean);

        // Si no hay intereses, usamos algunos géneros populares por defecto
        const queries = interests.length > 0 
          ? interests.slice(0, 5) 
          : ['Pop 2024', 'Rock Classics', 'Indie Chill', 'Techno Mix'];

        try {
          // Seleccionamos una query aleatoria de nuestros intereses para variar las recomendaciones
          const randomQuery = queries[Math.floor(Math.random() * queries.length)];
          const res = await axios.get(`${API_URL}/search?q=${randomQuery} similar tracks`);
          
          // Mezclamos un poco con los intereses para que no sea solo una búsqueda directa
          const mix = res.data.songs ? res.data.songs.slice(0, 15).sort(() => Math.random() - 0.5).slice(0, 10) : [];
          set({ recommendations: mix });
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      },

      handleSearch: async (query) => {
        if (!query.trim()) {
          set({ searchResults: { songs: [], artists: [] } });
          return;
        }
        set({ loading: true });
        try {
          const response = await axios.get(`${API_URL}/search?q=${query}`);
          set({ searchResults: response.data });
          
          // Save to search history (limit to 10 unique items)
          const { searchHistory } = get();
          const newHistory = [{ text: query, timestamp: Date.now() }, ...searchHistory.filter(h => h.text !== query)].slice(0, 10);
          set({ searchHistory: newHistory });
          
          // Occasional recommendation update on search
          if (Math.random() > 0.7) get().fetchRecommendations();
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          set({ loading: false });
        }
      },

      addToSearchHistory: (item) => {
        if (!item) return;
        set((state) => {
          const filtered = state.searchHistory.filter(h => h.id !== item.id);
          return { searchHistory: [item, ...filtered].slice(0, 20) };
        });
      },

      removeFromSearchHistory: (id) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter(h => h.id !== id)
        }));
      },

      createPlaylist: (name) => {
        if (!name.trim()) return;
        const newPl = { id: Date.now().toString(), name, songs: [] };
        set((state) => ({ 
          playlists: [...state.playlists, newPl],
          currentView: `playlist-${newPl.id}`
        }));
        get().showNotification('Playlist creada con éxito');
      },

      addTrackToPlaylist: (playlistId, track) => {
        if (!track) return;
        const { playlists } = get();
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        // Evitar duplicados
        if (playlist.songs.some(s => s.id === track.id)) {
          get().showNotification('Esta canción ya está en la playlist', 'info');
          return;
        }

        const newPlaylists = playlists.map(p => 
          p.id === playlistId ? { ...p, songs: [{ ...track, addedAt: Date.now() }, ...p.songs] } : p
        );
        set({ playlists: newPlaylists });
        get().showNotification(`Añadido a ${playlist.name}`);
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === playlistId
              ? { ...pl, songs: pl.songs.filter((s) => s.id !== songId) }
              : pl
          ),
        }));
        get().showNotification('Canción eliminada de la playlist', 'info');
      },

      addSongToPlaylist: (playlistId, song) => {
        set((state) => ({
          playlists: state.playlists.map((pl) => {
            if (pl.id === playlistId) {
              // Evitar duplicados
              if (pl.songs.find(s => s.id === song.id)) return pl;
              return { ...pl, songs: [...pl.songs, { ...song, addedAt: Date.now() }] };
            }
            return pl;
          }),
        }));
      },

      toggleFollow: (artist) => {
        if (!artist) return;
        const { followingArtists } = get();
        const isFollowing = followingArtists.some(a => a.id === artist.id);
        
        if (isFollowing) {
          set({ followingArtists: followingArtists.filter(a => a.id !== artist.id) });
          get().showNotification(`Dejaste de seguir a ${artist.name}`, 'info');
        } else {
          set({ followingArtists: [...followingArtists, artist] });
          get().showNotification(`Siguiendo a ${artist.name}`, 'success');
        }
      },

      addArtistToLibrary: (artist) => {
        if (!artist) return;
        const { followingArtists } = get();
        if (followingArtists.some(a => a.id === artist.id)) return;
        set({ followingArtists: [artist, ...followingArtists] });
      },

      fetchArtist: async (id) => {
        set({ loading: true, currentArtist: null });
        try {
          const res = await axios.get(`${API_URL}/artist/${id}`);
          set({ currentArtist: res.data });
          get().addArtistToLibrary({
             id: res.data.id,
             name: res.data.name,
             image: res.data.image,
             type: 'Artista'
          });
        } catch (error) {
          console.error('Error fetching artist:', error);
        } finally {
          set({ loading: false });
        }
      },

      fetchAlbum: async (id) => {
        set({ loading: true, currentAlbum: null });
        try {
          const res = await axios.get(`${API_URL}/album/${id}`);
          set({ currentAlbum: res.data });
        } catch (error) {
          console.error('Error fetching album:', error);
        } finally {
          set({ loading: false });
        }
      },

      // --- AUTH ACTIONS ---
      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post(`${API_URL}/auth/login`, { email, password });
          set({ user: res.data.user, token: res.data.token });
          get().showNotification(`Bienvenido de nuevo, ${res.data.user.name}`, 'success');
          return true;
        } catch (error) {
          get().showNotification(error.response?.data?.message || 'Error al iniciar sesión', 'error');
          return false;
        } finally {
          set({ loading: false });
        }
      },

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
          set({ user: res.data.user, token: res.data.token });
          get().showNotification(`¡Cuenta creada con éxito!`, 'success');
          return true;
        } catch (error) {
          get().showNotification(error.response?.data?.message || 'Error al registrarse', 'error');
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('synchro-auth-storage');
      },

      updateProfile: async (updates) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await axios.put(`${API_URL}/auth/profile`, updates, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data.user });
          get().showNotification('Perfil actualizado con éxito');
          return true;
        } catch (error) {
          get().showNotification(error.response?.data?.message || 'Error al actualizar perfil', 'error');
          return false;
        }
      }
    }),
    {
      name: 'spoclon-storage',
      partialize: (state) => ({
        playlists: state.playlists,
        recentlyPlayed: state.recentlyPlayed,
        followingArtists: state.followingArtists,
        volume: state.volume,
        currentSong: state.currentSong,
        queue: state.queue,
        currentIndex: state.currentIndex,
        currentTime: state.currentTime,
        duration: state.duration,
        searchHistory: state.searchHistory,
        user: state.user,
        token: state.token
      }),
    }
  )
);

export default useStore;
