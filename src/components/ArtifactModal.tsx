import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code2, Table, CheckSquare } from 'lucide-react';
import { Artifact, Language } from '../types/agent';
import { translations } from '../locales/translations';

interface ArtifactModalProps {
  artifact: Artifact | null;
  language: Language;
  onClose: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  artifact,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const ext = artifact.type === 'code' ? (artifact.language || 'txt') : 'md';
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.title.replace(/\s+/g, '_')}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = () => {
    switch (artifact.type) {
      case 'code':
        return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'table':
        return <Table className="w-5 h-5 text-emerald-400" />;
      case 'plan':
        return <CheckSquare className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {artifact.title}
              </h3>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="capitalize">{artifact.type}</span>
                {artifact.language && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{artifact.language}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {new Date(artifact.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.artifacts.copy}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.artifacts.copy}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.artifacts.download}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ms-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#090d16]">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto selection:bg-indigo-500 selection:text-white">
            <pre className="whitespace-pre-wrap break-words">{artifact.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
