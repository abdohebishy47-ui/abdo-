import React from 'react';
import { Sparkles, Globe, Plus, Cpu, FileText, History, Share2, Smartphone } from 'lucide-react';
import { Language } from '../types/agent';
import { translations } from '../locales/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'workspace' | 'capabilities' | 'artifacts' | 'sessions';
  onTabChange: (tab: 'workspace' | 'capabilities' | 'artifacts' | 'sessions') => void;
  onNewSession: () => void;
  onOpenShare: (tab?: 'share' | 'apk') => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  onNewSession,
  onOpenShare,
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-slate-800/80 bg-[#0c1220]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm shadow-indigo-900/30">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap font-sans">
            OmniAgent
          </span>
        </div>

        {/* Zone 2: Navigation links, concise, single-line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('workspace')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'workspace'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.workspace}
          </button>
          <button
            onClick={() => onTabChange('capabilities')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'capabilities'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.capabilities}
          </button>
          <button
            onClick={() => onTabChange('artifacts')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'artifacts'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.artifacts}
          </button>
          <button
            onClick={() => onTabChange('sessions')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'sessions'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.sessions}
          </button>
          <button
            onClick={() => onOpenShare('apk')}
            className="whitespace-nowrap pb-1 text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.nav.getApk}</span>
          </button>
        </nav>

        {/* Zone 3: Actions + PWA + Share + Language toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenShare('share')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
            title={language === 'ar' ? 'مشاركة ورابط التطبيق' : 'Share & Copy Link'}
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{language === 'ar' ? 'مشاركة' : 'Share'}</span>
          </button>

          <PWAInstallButton language={language} />

          <button
            onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.newSession}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
