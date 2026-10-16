import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types/agent';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  const isArabic = language === 'ar';

  return (
    <div className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 text-slate-950 px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-sm border border-amber-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        {isArabic
          ? 'وضع غير متصل بالإنترنت — يمكنك تصفح الجلسات والمخرجات المحفوظة'
          : 'Offline Mode — Cached sessions and deliverables are available'}
      </span>
    </div>
  );
};
