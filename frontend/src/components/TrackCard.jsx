import React from 'react';
import { Play, Disc } from 'lucide-react';
import useStore from '../store/useStore';

const TrackCard = ({ track, index, list, compact = false, variant = 'default', size = 'default' }) => {
  const { playSong, handleContextMenu } = useStore();

  const isSmall = size === 'small';

  if (variant === 'mix') {
    const colors = ['bg-cyan-400', 'bg-yellow-400', 'bg-red-500', 'bg-pink-400', 'bg-green-400', 'bg-purple-500'];
    const barColor = colors[index % colors.length];

    return (
      <div 
        className={`group bg-transparent hover:bg-white/5 p-1 lg:p-4 rounded-xl transition-all duration-300 cursor-pointer animate-fade-in flex-shrink-0 ${isSmall ? 'w-28' : 'w-40 lg:w-48'}`}
        onClick={() => playSong(track, index, list)}
        onContextMenu={(e) => handleContextMenu(e, track)}
      >
        <div className="relative mb-2 overflow-hidden rounded-xl shadow-2xl aspect-square">
          <img src={track.image || null} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${barColor}`} />
          <div className="absolute bottom-1.5 left-1.5">
             <span className={`font-black text-black uppercase tracking-widest bg-white/90 px-1 py-0.5 rounded-sm ${isSmall ? 'text-[7px]' : 'text-[8px] lg:text-[10px]'}`}>Mix diario {index + 1}</span>
          </div>
          <button className={`absolute bottom-2 right-2 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-2xl opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${isSmall ? 'w-8 h-8' : 'w-10 h-10'}`}>
            <Play size={isSmall ? 16 : 20} fill="black" className="ml-0.5" />
          </button>
        </div>
        <h3 className={`font-bold text-white mb-0.5 truncate ${isSmall ? 'text-[10px]' : 'text-xs lg:text-sm'}`}>Mix {index + 1}</h3>
        <p className={`text-[#A7A7A7] font-medium line-clamp-2 leading-tight ${isSmall ? 'text-[9px]' : 'text-[11px] lg:text-[12px]'}`}>
          {track.artist}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`group bg-transparent hover:bg-white/5 p-1 lg:p-4 rounded-xl transition-all duration-300 cursor-pointer animate-fade-in flex-shrink-0 ${isSmall ? 'w-28' : (compact ? 'w-40 lg:w-48' : 'w-full')}`}
      onClick={() => playSong(track, index, list)}
      onContextMenu={(e) => handleContextMenu(e, track)}
    >
      <div className="relative mb-2 overflow-hidden rounded-xl shadow-2xl aspect-square">
        {track.image ? (
          <img src={track.image || null} alt={track.name} className="w-full h-full object-cover lg:group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-[#282828] flex items-center justify-center">
            <Disc size={isSmall ? 32 : 40} className="text-[#A7A7A7]" />
          </div>
        )}
        <button className={`absolute bottom-2 right-2 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-2xl opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${isSmall ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <Play size={16} fill="black" className="ml-0.5" />
        </button>
      </div>
      <h3 className={`font-bold text-white mb-0.5 truncate tracking-tight ${isSmall ? 'text-[10px]' : 'text-xs lg:text-sm'}`}>{track.name}</h3>
      <p className={`text-[#A7A7A7] font-medium truncate ${isSmall ? 'text-[9px]' : 'text-[11px] lg:text-[12px]'}`}>{track.artist}</p>
    </div>
  );
};

export default TrackCard;
