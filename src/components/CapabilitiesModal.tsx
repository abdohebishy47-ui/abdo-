import React from 'react';
import { X, Search, Calculator, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/agent';
import { translations } from '../locales/translations';

interface CapabilitiesModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const CapabilitiesModal: React.FC<CapabilitiesModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const icons = [
    <Search key="search" className="w-5 h-5 text-amber-400" />,
    <Calculator key="calc" className="w-5 h-5 text-indigo-400" />,
    <Terminal key="term" className="w-5 h-5 text-emerald-400" />,
    <FileCode key="code" className="w-5 h-5 text-sky-400" />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="text-base font-semibold text-white">
              {t.capabilitiesModal.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.capabilitiesModal.desc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tool Cards */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-[#090d16]">
          {t.capabilitiesModal.tools.map((tool, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {icons[idx]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {tool.name}
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {tool.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed ps-11">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
