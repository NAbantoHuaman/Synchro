import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Home, User, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery, handleSearch, setSuggestions, suggestions, user, logout } = useStore();

  const isHome = location.pathname === '/';
  const isSearch = location.pathname === '/search';
  const isLibrary = location.pathname === '/library';
  const isDetailView = location.pathname.includes('/playlist') || 
                       location.pathname.includes('/artist') || 
                       location.pathname.includes('/album');

  // Búsqueda en vivo con debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
        if (document.activeElement?.tagName === 'INPUT' && !window.location.pathname.includes('/search')) {
           navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch, navigate]);

  const onSearchSubmit = (query) => {
    if (!query.trim()) return;
    handleSearch(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
  };

  return (
    <header className={`sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-8 glass-header transition-all border-b border-white/5 ${(isHome || isSearch || isLibrary || isDetailView) ? 'hidden lg:flex' : 'flex'}`}>
      {/* Left Section: Navigation */}
      <div className="flex items-center gap-2 w-1/3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-[#A7A7A7] hover:text-white transition active:scale-90">
          <ChevronLeft size={22} />
        </button>
        <button onClick={() => navigate(1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-[#A7A7A7] hover:text-white transition active:scale-90">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Center Section: Home & Search */}
      <div className="flex items-center gap-3 w-1/3 justify-center min-w-[500px]">
        <button 
          onClick={() => navigate('/')} 
          className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all flex-shrink-0 ${isHome ? 'text-white' : 'text-[#A7A7A7] hover:text-white'}`}
        >
          <Home size={24} fill={isHome ? 'white' : 'none'} />
        </button>
        <div className="relative flex-1 max-w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="¿Qué quieres escuchar hoy?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => navigate('/search')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchSubmit(searchQuery);
              }
            }}
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-sm rounded-full py-3 pl-12 pr-4 outline-none transition-all border border-transparent focus:border-white/10"
          />
        </div>
      </div>

      {/* Right Section: Profile */}
      <div className="flex items-center justify-end gap-4 w-1/3">
         {user ? (
           <div className="flex items-center gap-3 group relative">
             <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</div>
                <div className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Premium</div>
             </div>
             
             <button 
               className="w-10 h-10 bg-[#282828] rounded-full flex items-center justify-center text-white font-black text-sm border border-white/10 cursor-pointer overflow-hidden hover:scale-105 transition active:scale-95 shadow-xl peer"
             >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
             </button>

             {/* DROP-DOWN MENU */}
             <div className="absolute top-[110%] right-0 w-48 bg-[#282828] border border-white/10 rounded-lg shadow-[0_16px_32px_rgba(0,0,0,0.5)] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] transform origin-top-right group-hover:translate-y-0 translate-y-[-10px]">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition text-sm font-bold text-white"
                >
                   Perfil
                   <User size={16} className="text-[#A7A7A7]" />
                </button>
                <div className="h-[1px] bg-white/5 mx-2 my-1" />
                <button 
                  onClick={logout}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition text-sm font-bold text-red-500"
                >
                   Cerrar sesión
                   <LogOut size={16} />
                </button>
             </div>
           </div>
         ) : (
           <div className="w-10 h-10 bg-[#282828] rounded-full flex items-center justify-center text-[#A7A7A7] font-black text-sm border border-white/10">U</div>
         )}
      </div>
    </header>
  );
};

export default Header;
