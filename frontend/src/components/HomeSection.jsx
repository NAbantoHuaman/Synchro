import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrackCard from './TrackCard';

const HomeSection = ({ title, tracks, compact = true, variant = 'default', size = 'default' }) => {
  const scrollRef = useRef(null);

  if (!tracks || tracks.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 group/section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <div className="flex items-center gap-4">
          <button className="text-xs font-black uppercase tracking-widest text-[#A7A7A7] hover:text-white transition">Ver todo</button>
          <div className="flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button 
              onClick={() => scroll('left')}
              className="p-1.5 bg-[#181818] rounded-full hover:bg-[#282828] transition text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1.5 bg-[#181818] rounded-full hover:bg-[#282828] transition text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-3 lg:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
      >
        {tracks.map((track, idx) => (
          <div key={track.id + title + idx} className="snap-start flex-shrink-0">
            <TrackCard 
              track={track} 
              index={idx} 
              list={tracks} 
              compact={compact} 
              variant={variant}
              size={size}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
