import React, { useState } from 'react';
import { User, Mail, Calendar, Music2, Heart, ListMusic, LogOut, ChevronRight, Lock, Bell, Monitor, Check, X } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileView = () => {
  const { user, logout, playlists, followingArtists, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [activeTab, setActiveTab] = useState(null); // 'privacy', 'notifications'

  // Settings State (Mock)
  const [settings, setSettings] = useState({
    privateProfile: false,
    showActivity: true,
    emailNotifications: true,
    pushNotifications: true
  });

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) setIsEditing(false);
  };

  const Toggle = ({ active, onClick }) => (
    <div 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-[#1DB954]' : 'bg-[#3E3E3E]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </div>
  );

  return (
    <div className="min-h-screen pb-32 animate-fade-in relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-8 lg:p-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 mb-12">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/5 relative group">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-[#282828] flex items-center justify-center text-6xl font-black text-white">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setIsEditing(true)}>
               <span className="text-white text-xs font-black uppercase tracking-widest text-center px-4">Cambiar Avatar</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-start">
             <span className="text-xs font-black uppercase tracking-widest text-[#1DB954] mb-2">Perfil de usuario</span>
             <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-6 uppercase">{user.name}</h1>
             
             <div className="flex items-center gap-6 text-[#A7A7A7] text-sm font-medium">
                <div className="flex items-center gap-2">
                   <ListMusic size={18} className="text-[#1DB954]" />
                   <span>{playlists.length} Playlists</span>
                </div>
                <div className="flex items-center gap-2">
                   <User size={18} className="text-[#1DB954]" />
                   <span>{followingArtists.length} Siguiendo</span>
                </div>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
           <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <Mail className="text-[#A7A7A7] group-hover:text-white transition" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#535353]">Contacto</span>
              </div>
              <div className="text-white font-bold truncate">{user.email}</div>
              <div className="text-[#A7A7A7] text-xs mt-1">Correo verificado</div>
           </div>
           
           <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <Calendar className="text-[#A7A7A7] group-hover:text-white transition" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#535353]">Miembro desde</span>
              </div>
              <div className="text-white font-bold">Mayo 2026</div>
              <div className="text-[#A7A7A7] text-xs mt-1">Synchro Premium</div>
           </div>

           <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => {
              if (window.confirm('¿Cerrar sesión?')) logout();
           }}>
              <div className="flex items-center justify-between mb-4">
                 <LogOut className="text-red-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50">Sesión</span>
              </div>
              <div className="text-red-500 font-bold">Cerrar sesión</div>
              <div className="text-red-500/50 text-xs mt-1">Desconectar cuenta</div>
           </div>
        </div>

        {/* Action List */}
        <div className="space-y-4 max-w-4xl">
           <h2 className="text-2xl font-black text-white mb-6">Configuración</h2>
           
           {/* EDIT PROFILE */}
           <button 
             onClick={() => setIsEditing(true)}
             className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#282828] rounded-xl flex items-center justify-center text-[#A7A7A7] group-hover:text-white group-hover:bg-[#1DB954] transition-all">
                    <User size={20} />
                 </div>
                 <div className="text-left">
                    <span className="text-white font-bold block">Editar Perfil</span>
                    <span className="text-[#A7A7A7] text-xs">Cambiar nombre, email o contraseña</span>
                 </div>
              </div>
              <ChevronRight className="text-[#535353] group-hover:text-white transition" />
           </button>

           {/* PRIVACY */}
           <div className="bg-white/5 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#282828] rounded-xl flex items-center justify-center text-[#A7A7A7]">
                       <Lock size={20} />
                    </div>
                    <span className="text-white font-bold">Privacidad y Seguridad</span>
                 </div>
              </div>
              <div className="space-y-4 pl-14">
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-bold text-white">Perfil Privado</div>
                       <div className="text-xs text-[#A7A7A7]">Solo tú verás tus playlists y actividad</div>
                    </div>
                    <Toggle 
                       active={settings.privateProfile} 
                       onClick={() => setSettings(s => ({ ...s, privateProfile: !s.privateProfile }))} 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-bold text-white">Mostrar Actividad</div>
                       <div className="text-xs text-[#A7A7A7]">Permitir que otros vean qué escuchas</div>
                    </div>
                    <Toggle 
                       active={settings.showActivity} 
                       onClick={() => setSettings(s => ({ ...s, showActivity: !s.showActivity }))} 
                    />
                 </div>
              </div>
           </div>

           {/* NOTIFICATIONS */}
           <div className="bg-white/5 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#282828] rounded-xl flex items-center justify-center text-[#A7A7A7]">
                       <Bell size={20} />
                    </div>
                    <span className="text-white font-bold">Notificaciones</span>
                 </div>
              </div>
              <div className="space-y-4 pl-14">
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-bold text-white">Email</div>
                       <div className="text-xs text-[#A7A7A7]">Novedades y recomendaciones por correo</div>
                    </div>
                    <Toggle 
                       active={settings.emailNotifications} 
                       onClick={() => setSettings(s => ({ ...s, emailNotifications: !s.emailNotifications }))} 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-sm font-bold text-white">Push</div>
                       <div className="text-xs text-[#A7A7A7]">Alertas en tiempo real en tu navegador</div>
                    </div>
                    <Toggle 
                       active={settings.pushNotifications} 
                       onClick={() => setSettings(s => ({ ...s, pushNotifications: !s.pushNotifications }))} 
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
         {isEditing && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="bg-[#181818] w-full max-w-md rounded-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden"
               >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <h3 className="text-xl font-black text-white uppercase tracking-widest">Editar Perfil</h3>
                     <button onClick={() => setIsEditing(false)} className="text-[#A7A7A7] hover:text-white transition">
                        <X size={24} />
                     </button>
                  </div>
                  
                  <form onSubmit={handleUpdate} className="p-8 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Nombre Completo</label>
                        <input 
                           type="text" 
                           value={formData.name}
                           onChange={e => setFormData({ ...formData, name: e.target.value })}
                           className="w-full bg-[#282828] border border-transparent focus:border-[#1DB954] outline-none p-4 rounded-xl text-white font-bold transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Correo Electrónico</label>
                        <input 
                           type="email" 
                           value={formData.email}
                           onChange={e => setFormData({ ...formData, email: e.target.value })}
                           className="w-full bg-[#282828] border border-transparent focus:border-[#1DB954] outline-none p-4 rounded-xl text-white font-bold transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Nueva Contraseña (opcional)</label>
                        <input 
                           type="password" 
                           placeholder="••••••••"
                           value={formData.password}
                           onChange={e => setFormData({ ...formData, password: e.target.value })}
                           className="w-full bg-[#282828] border border-transparent focus:border-[#1DB954] outline-none p-4 rounded-xl text-white font-bold transition-all"
                        />
                     </div>
                     
                     <div className="pt-4 flex gap-4">
                        <button 
                           type="submit"
                           className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-black py-4 rounded-full transition shadow-lg shadow-[#1DB954]/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                           <Check size={18} />
                           Guardar Cambios
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileView;
