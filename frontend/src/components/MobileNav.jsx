import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus } from 'lucide-react';
import useStore from '../store/useStore';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsModalOpen } = useStore();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#000000]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-40 px-2">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-white' : 'text-[#A7A7A7]'}`}
      >
        <Home size={22} fill={isActive('/') ? 'white' : 'none'} />
        <span className="text-[10px] font-bold">Inicio</span>
      </button>
      
      <button 
        onClick={() => navigate('/search')}
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/search') ? 'text-white' : 'text-[#A7A7A7]'}`}
      >
        <Search size={22} />
        <span className="text-[10px] font-bold">Buscar</span>
      </button>

      <button 
        onClick={() => navigate('/library')}
        className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/library' ? 'text-white' : 'text-[#A7A7A7]'}`}
      >
        <Library size={22} fill={location.pathname === '/library' ? 'white' : 'none'} />
        <span className="text-[10px] font-bold">Tu biblioteca</span>
      </button>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center gap-1 text-[#A7A7A7] hover:text-white transition-all"
      >
        <Plus size={22} />
        <span className="text-[10px] font-bold">Crear</span>
      </button>
    </div>
  );
};

export default MobileNav;
