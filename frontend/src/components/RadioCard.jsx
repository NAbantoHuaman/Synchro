import React from 'react';
import { Play } from 'lucide-react';
import useStore from '../store/useStore';

const RadioCard = ({ track, index, list }) => {
  const { playSong } = useStore();
  
  const colors = [
    'from-red-600 to-indigo-900',
    'from-green-600 to-teal-900',
    'from-blue-600 to-purple-900',
    'from-yellow-600 to-orange-900',
    'from-pink-600 to-rose-900',
  ];
  const bgGradient = colors[index % colors.length];

  return (
    <div 
      className={`group relative flex-shrink-0 w-64 h-[350px] bg-gradient-to-br ${bgGradient} rounded-[32px] p-6 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden shadow-2xl`}
      onClick={() => playSong(track, index, list)}
    >
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      
      <div className="relative h-full flex flex-col">
        <div className="mb-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">Estación Premium</span>
        </div>

        {/* Multiple Circles logic */}
        <div className="flex-1 flex items-center justify-center relative scale-110">
          <div className="w-24 h-24 rounded-full border-4 border-black/20 shadow-2xl overflow-hidden z-10">
            <img src={track.image || null} className="w-full h-full object-cover" alt="r1" />
          </div>
          <div className="absolute left-0 w-16 h-16 rounded-full border-2 border-black/10 overflow-hidden opacity-60">
             <img src={track.image || null} className="w-full h-full object-cover grayscale" alt="r2" />
          </div>
          <div className="absolute right-0 w-16 h-16 rounded-full border-2 border-black/10 overflow-hidden opacity-60">
             <img src={track.image || null} className="w-full h-full object-cover grayscale" alt="r3" />
          </div>
        </div>

        <div className="mt-auto">
          <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">{track.artist} Radio</h3>
          <p className="text-xs text-white/60 font-bold mb-6">Con {track.name} y más</p>
          
          <button className="w-full py-4 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl">
             <Play size={18} fill="currentColor" /> Reproducir estación
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioCard;
