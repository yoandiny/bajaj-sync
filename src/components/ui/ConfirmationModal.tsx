import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-50', text: 'text-red-800', icon: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' },
    success: { bg: 'bg-green-50', text: 'text-green-800', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: 'text-yellow-600', button: 'bg-yellow-500 hover:bg-yellow-600' },
  };

  const style = colors[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className={`p-6 ${style.bg} flex items-start gap-4`}>
            <div className={`p-2 bg-white rounded-full shadow-sm ${style.icon}`}>
              {type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${style.text}`}>{title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-6 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 text-sm ${style.button}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
