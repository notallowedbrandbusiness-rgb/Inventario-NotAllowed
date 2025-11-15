
import React, { useState, useEffect } from 'react';
import { getAccountingTip } from '../services/geminiService';
import { LightbulbIcon } from './icons';

interface GeminiTipProps {
  topic: string;
  onClose: () => void;
}

export const GeminiTip: React.FC<GeminiTipProps> = ({ topic, onClose }) => {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoading(true);
      const result = await getAccountingTip(topic);
      setTip(result);
      setIsLoading(false);
    };
    fetchTip();
  }, [topic]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-11/12 max-w-lg transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mr-4">
            <LightbulbIcon className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">¡Consejo Contable!</h3>
            <p className="text-sm text-muted">{topic}</p>
          </div>
        </div>
        <div className="text-gray-700 dark:text-gray-300 space-y-4 min-h-[100px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{tip}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Entendido
        </button>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};