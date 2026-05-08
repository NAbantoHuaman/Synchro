import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, ListMusic } from 'lucide-react';
import useStore from '../store/useStore';

const PlaylistCover = ({ songs, id, icon: Icon, type }) => {
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

  if (Icon) {
    return (
      <div className="w-full h-full bg-[#282828] flex items-center justify-center">
        <Icon size={24} className="text-[#A7A7A7]" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
      <ListMusic size={24} className="text-[#A7A7A7]" />
    </div>
  );
};

const LibraryItem = ({ id, name, type, image, active, onClick, icon: Icon, songs, plId }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all group ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
  >
    <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg ${type === 'Artista' ? 'rounded-full' : 'rounded-md'}`}>
      {type === 'Artista' ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <PlaylistCover songs={songs} id={plId} icon={Icon} type={type} />
      )}
    </div>
    <div className="flex-1 text-left min-w-0">
      <div className={`text-sm font-bold truncate ${active ? 'text-white' : 'text-[#A7A7A7] group-hover:text-white'}`}>{name}</div>
      <div className="text-[12px] text-[#A7A7A7] font-medium truncate">{type} {type === 'Playlist' ? '• Tú' : ''}</div>
    </div>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    playlists, 
    followingArtists, 
    libraryFilter, 
    setLibraryFilter, 
    setIsModalOpen 
  } = useStore();

  const libraryItems = [
    ...playlists.map(pl => ({ 
      id: `/playlist/${pl.id}`, 
      plId: pl.id,
      name: pl.name, 
      type: 'Playlist', 
      songs: pl.songs,
      icon: pl.id === 'favs' ? Heart : ListMusic,
      onClick: () => navigate(`/playlist/${pl.id}`)
    })),
    ...followingArtists.map(artist => ({
      id: `/artist/${artist.id}`,
      name: artist.name,
      type: 'Artista',
      image: artist.image,
      onClick: () => navigate(`/artist/${artist.id}`)
    }))
  ].filter(item => {
    if (libraryFilter === 'all') return true;
    if (libraryFilter === 'playlists') return item.type === 'Playlist';
    if (libraryFilter === 'artists') return item.type === 'Artista';
    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex w-[380px] bg-black flex-col h-full flex-shrink-0">
      {/* Brand Logo / Home Link - Matches Header Height */}
      <div className="px-6 flex items-center h-16 flex-shrink-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group transition-all hover:opacity-80 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-xl">
            <img src="/logo.png" alt="Synchro" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">Synchro</span>
        </button>
      </div>

      <div className="flex-1 px-2 pb-2 flex flex-col overflow-hidden">
        <div className="flex-1 bg-[#121212] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 shadow-xl z-10 flex-shrink-0">
            <div className="flex items-center justify-between text-[#A7A7A7] mb-6 px-1">
              <button className="flex items-center gap-3 hover:text-white transition font-bold min-w-0">
                <Library size={24} className="flex-shrink-0" /> 
                <span className="text-white font-black whitespace-nowrap overflow-hidden text-ellipsis">Tu biblioteca</span>
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition active:scale-95"
                >
                  <Plus size={16} />
                  <span className="text-xs font-bold">Crear</span>
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full text-[#A7A7A7] hover:text-white transition">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.5 1h-2v1.5h1.25L5 9.25V8H3.5v3.5H7V10H5.75L12 3.75V5h1.5V1.5c0-.275-.225-.5-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-2 px-2">
              {['playlists', 'artists'].map(type => (
                <button 
                  key={type}
                  onClick={() => setLibraryFilter(libraryFilter === type ? 'all' : type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${libraryFilter === type ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/15'}`}
                >
                  {type === 'playlists' ? 'Playlists' : 'Artistas'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-1 pb-24">
            {libraryItems.map(item => (
              <LibraryItem key={item.id} {...item} active={isActive(item.id)} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
