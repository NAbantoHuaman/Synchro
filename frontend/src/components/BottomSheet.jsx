import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, CheckCircle2, Heart } from 'lucide-react';
import useStore from '../store/useStore';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#121212] z-[201] rounded-t-[32px] border-t border-white/10 max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-4 shrink-0" />
            <div className="px-6 pb-6 flex items-center justify-between shrink-0">
               <h2 className="text-xl font-black">{title}</h2>
               <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-10">
               {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
