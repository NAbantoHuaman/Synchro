import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Music2 } from 'lucide-react';
import useStore from '../store/useStore';

const LoginView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, loading } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#121212]/80 backdrop-blur-2xl p-8 lg:p-12 rounded-3xl border border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
          
          <div className="flex flex-col items-center mb-10">
             <div className="w-16 h-16 bg-[#1DB954] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                <Music2 size={32} className="text-black" />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Synchro</h1>
             <p className="text-[#A7A7A7] text-sm font-medium">
               {isLogin ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Tu nombre" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#535353] focus:outline-none focus:border-[#1DB954] focus:bg-white/[0.08] transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#535353] focus:outline-none focus:border-[#1DB954] focus:bg-white/[0.08] transition-all"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#535353] focus:outline-none focus:border-[#1DB954] focus:bg-white/[0.08] transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_8px_20px_rgba(29,185,84,0.2)]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Registrarse'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="text-[#A7A7A7] text-sm hover:text-white transition-colors"
             >
               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
             </button>
          </div>
        </div>

        <p className="mt-8 text-[#535353] text-[10px] text-center px-8 uppercase tracking-widest font-bold">
          Al continuar, aceptas los Términos de servicio y la Política de privacidad de Synchro.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
