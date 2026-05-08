import React from 'react';
import { Users, Music, Play } from 'lucide-react';

const FriendActivity = () => {
  const friends = [
    { name: 'Charlie', song: 'Nightcrawler', artist: 'Travis Scott', time: '2 min', image: 'https://i.pravatar.cc/150?u=charlie' },
    { name: 'Luna', song: 'Cruel Summer', artist: 'Taylor Swift', time: '5 min', image: 'https://i.pravatar.cc/150?u=luna' },
    { name: 'Max', song: 'Starboy', artist: 'The Weeknd', time: '12 min', image: 'https://i.pravatar.cc/150?u=max' },
    { name: 'Sofia', song: 'Flowers', artist: 'Miley Cyrus', time: '25 min', image: 'https://i.pravatar.cc/150?u=sofia' },
  ];

  return (
    <div className="hidden xl:flex w-72 flex-col bg-black border-l border-white/5 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-black text-[#A7A7A7] uppercase tracking-widest flex items-center gap-2">
          <Users size={16} /> Actividad de amigos
        </h2>
        <button className="text-[#A7A7A7] hover:text-white transition"><Play size={16} /></button>
      </div>

      <div className="space-y-6">
        {friends.map((friend, i) => (
          <div key={i} className="flex gap-4 group cursor-pointer">
            <div className="relative">
              <img src={friend.image} className="w-10 h-10 rounded-full border-2 border-green-500/50" alt="avatar" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-sm font-bold text-white truncate hover:underline">{friend.name}</span>
                <span className="text-[10px] text-[#A7A7A7]">{friend.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#A7A7A7] truncate">
                <Music size={10} />
                <span className="truncate hover:text-white transition-colors">{friend.song}</span>
              </div>
              <div className="text-[10px] text-[#A7A7A7] truncate">
                {friend.artist}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
         <p className="text-[11px] text-[#A7A7A7] leading-relaxed mb-4">
           Conéctate con amigos para ver qué están escuchando en tiempo real.
         </p>
         <button className="w-full py-3 bg-white text-black text-xs font-black rounded-full hover:scale-105 transition tracking-widest uppercase shadow-xl shadow-white/5">
           Encontrar amigos
         </button>
      </div>
    </div>
  );
};

export default FriendActivity;
