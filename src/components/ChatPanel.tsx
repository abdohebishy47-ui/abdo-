import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, ExternalLink, Bot, User, CornerDownLeft, Loader2, ArrowUpRight } from 'lucide-react';
import { Language, AgentMode, AgentMessage } from '../types/agent';
import { translations } from '../locales/translations';

interface ChatPanelProps {
  language: Language;
  mode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
  messages: AgentMessage[];
  isRunning: boolean;
  onSendMessage: (prompt: string) => void;
  onSelectThoughtStep?: (stepIndex: number) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  language,
  mode,
  onModeChange,
  messages,
  isRunning,
  onSendMessage,
}) => {
  const t = translations[language];
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRunning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRunning) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const modesList: AgentMode[] = ['autonomous', 'research', 'analytics', 'code'];

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] border-r border-slate-800/70">
      {/* Mode Selector Strip */}
      <div className="p-3 border-b border-slate-800/70 bg-[#0d1424]">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto">
          {modesList.map((m) => {
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {t.modes[m].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="py-8 space-y-6">
            <div className="text-center max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-white">
                {t.chat.noMessages}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.chat.noMessagesSub}
              </p>
            </div>

            {/* Starter Prompt Cards */}
            <div className="pt-2">
              <div className="text-xs font-medium text-slate-400 mb-3 px-1">
                {t.chat.starterPromptsTitle}
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {t.starters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(starter.prompt)}
                    className="group text-start p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {starter.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {starter.prompt}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {/* Clean unboxed metadata separator */}
                  {!isUser && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                      <span>OmniAgent</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.thoughts && msg.thoughts.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-indigo-400">
                            {msg.thoughts.length} {t.chat.stepsCount}
                          </span>
                        </>
                      )}
                      {msg.tools && msg.tools.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-emerald-400">
                            {msg.tools.length} {t.chat.toolsCount}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>

                  {/* Grounded Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60 mt-3 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-400">
                        {t.chat.sourcesTitle}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-indigo-300 hover:text-indigo-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-md border border-slate-700/60 transition-colors"
                          >
                            <span className="max-w-[200px] truncate">{source.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action row */}
                  {!isUser && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors"
                        title={t.chat.copy}
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{t.chat.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t.chat.copy}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/40 border border-indigo-500/50 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Live Running State */}
        {isRunning && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl p-4 bg-slate-900/90 border border-indigo-500/30 text-slate-300 rounded-tl-sm flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>{t.chat.running}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-3.5 lg:p-4 border-t border-slate-800/70 bg-[#0d1424]">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative rounded-xl border border-slate-700/80 focus-within:border-indigo-500 bg-slate-950/80 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              rows={2}
              placeholder={t.chat.inputPlaceholder}
              className="w-full bg-transparent px-3.5 py-2.5 text-xs lg:text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/70 text-xs">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Shift + Enter for new line
              </span>
              <button
                type="submit"
                disabled={!input.trim() || isRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.chat.running}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.chat.send}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
