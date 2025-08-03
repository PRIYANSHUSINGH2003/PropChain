import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, className = '' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className={["relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-glass p-6", className].join(' ')}>
        {title && <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}
        <button
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-primary transition-colors"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
