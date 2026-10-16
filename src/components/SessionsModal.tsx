import React from 'react';
import { X, MessageSquare, Trash2, ArrowUpRight, Calendar } from 'lucide-react';
import { AgentSession, Language } from '../types/agent';
import { translations } from '../locales/translations';

interface SessionsModalProps {
  language: Language;
  isOpen: boolean;
  sessions: AgentSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClose: () => void;
}

export const SessionsModal: React.FC<SessionsModalProps> = ({
  language,
  isOpen,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onClose,
}) => {
  if (!isOpen) return null;
  const isArabic = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="text-base font-semibold text-white">
              {isArabic ? 'سجل الجلسات والمحادثات' : 'Sessions & Conversation History'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'استرجع مهام الوكيل السابقة ونتائج التفكير والمخرجات' : 'Resume past agent tasks, reasoning chains, and deliverables'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[65vh] overflow-y-auto bg-[#090d16]">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              {isArabic ? 'لا توجد جلسات محفوظة حتى الآن' : 'No saved sessions yet'}
            </div>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                      : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className="flex-1 text-start space-y-1 cursor-pointer"
                  >
                    <div className="text-xs font-semibold truncate max-w-sm">
                      {session.title || (isArabic ? 'مهمة بدون عنوان' : 'Untitled Goal')}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="capitalize">{session.mode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{session.messages.length} {isArabic ? 'رسائل' : 'messages'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title={isArabic ? 'حذف الجلسة' : 'Delete Session'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
