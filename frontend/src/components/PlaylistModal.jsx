import React, { useState } from 'react';
import { X, ListMusic, Music2 } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const PlaylistModal = () => {
  const [step, setStep] = useState(0); // 0: Menu, 1: Name Input
  const [name, setName] = useState('');
  const { isModalOpen, setIsModalOpen, createPlaylist } = useStore();

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(0);
    setName('');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-end p-4 lg:justify-center">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-sm flex flex-col items-center">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-[#282828] rounded-[24px] overflow-hidden shadow-2xl mb-4"
            >
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div 
                    key="menu"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-2"
                  >
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-14 h-14 bg-[#3E3E3E] rounded-full flex items-center justify-center">
                        <Music2 size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-base">Playlist</div>
                        <div className="text-white/60 text-xs font-medium">Crea una playlist con canciones o episodios</div>
                      </div>
                    </button>
                    {/* Other options would go here, but user only wants Playlist */}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="input"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 text-center"
                  >
                    <h2 className="text-xl font-black mb-8">Ponle nombre a tu playlist</h2>
                    <form onSubmit={handleSubmit}>
                       <input 
                         autoFocus
                         type="text"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder="Mi playlist #1"
                         className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#1DB954] outline-none text-2xl font-black text-center pb-4 mb-10 transition-all"
                       />
                       <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setStep(0)}
                            className="flex-1 py-3 text-white font-black text-sm uppercase tracking-widest"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 py-3 bg-[#1DB954] text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition"
                          >
                            Crear
                          </button>
                       </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Close Button */}
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleClose}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform active:scale-95"
            >
               <X size={32} />
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistModal;
