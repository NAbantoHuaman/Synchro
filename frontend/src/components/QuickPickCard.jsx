import React from 'react';
import useStore from '../store/useStore';

const QuickPickCard = ({ track }) => {
  const { playSong } = useStore();

  return (
    <div 
      onClick={() => playSong(track)}
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all rounded-md overflow-hidden group cursor-pointer h-[56px] lg:h-20"
    >
      <div className="w-[56px] h-[56px] lg:w-20 lg:h-20 flex-shrink-0">
        <img src={track.image || null} alt={track.name} className="w-full h-full object-cover shadow-2xl" />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-bold text-white truncate text-[11px] lg:text-base leading-tight">{track.name}</h3>
      </div>
    </div>
  );
};

export default QuickPickCard;
