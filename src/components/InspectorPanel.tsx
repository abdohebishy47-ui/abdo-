import React, { useState } from 'react';
import { Brain, Wrench, FileCode, CheckCircle2, ChevronDown, ChevronRight, Copy, Check, Terminal, Search, Calculator, Layers, Loader2 } from 'lucide-react';
import { Language, ThoughtStep, ToolExecution, Artifact } from '../types/agent';
import { translations } from '../locales/translations';

interface InspectorPanelProps {
  language: Language;
  thoughts: ThoughtStep[];
  tools: ToolExecution[];
  artifacts: Artifact[];
  isRunning: boolean;
  statusMessage?: string;
  onSelectArtifact: (artifact: Artifact) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  language,
  thoughts,
  tools,
  artifacts,
  isRunning,
  statusMessage,
  onSelectArtifact,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'timeline' | 'tools' | 'artifacts'>('timeline');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [copiedCallId, setCopiedCallId] = useState<string | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const copyPayload = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedCallId(id);
      setTimeout(() => setCopiedCallId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'googleSearch':
        return <Search className="w-4 h-4 text-amber-400" />;
      case 'calculate_expression':
        return <Calculator className="w-4 h-4 text-indigo-400" />;
      case 'execute_code_sandbox':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'generate_artifact':
        return <FileCode className="w-4 h-4 text-sky-400" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] border-l border-slate-800/70">
      {/* Header Strip */}
      <div className="p-3.5 border-b border-slate-800/70 bg-[#0d1424] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t.inspector.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.inspector.subtitle}
            </p>
          </div>
          {isRunning && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
              <span>{statusMessage || t.chat.running}</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.inspector.tabs.timeline} ({thoughts.length})
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'tools'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.inspector.tabs.tools} ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab('artifacts')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'artifacts'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.inspector.tabs.artifacts} ({artifacts.length})
          </button>
        </div>
      </div>

      {/* Tab Contents Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Timeline (Reasoning Trace) */}
        {activeTab === 'timeline' && (
          <div className="space-y-3">
            {thoughts.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-500">
                <Brain className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>{t.inspector.emptyTimeline}</p>
              </div>
            ) : (
              thoughts.map((step) => {
                const isExpanded = expandedSteps[step.step] !== false;
                return (
                  <div
                    key={step.step}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleStep(step.step)}
                      className="w-full flex items-center justify-between p-3 text-start hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-[10px] font-mono font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                          {step.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        <p className="whitespace-pre-wrap">{step.content}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tools Execution Log */}
        {activeTab === 'tools' && (
          <div className="space-y-3">
            {tools.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-500">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>{t.inspector.emptyTools}</p>
              </div>
            ) : (
              tools.map((exec, idx) => (
                <div
                  key={exec.callId || idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/70">
                        {getToolIcon(exec.tool)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white font-mono">
                          {exec.tool}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          {new Date(exec.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      exec.status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : exec.status === 'failed'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {exec.status}
                    </span>
                  </div>

                  {/* Input Arguments */}
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/70 text-[11px] font-mono text-slate-300 overflow-x-auto space-y-1">
                    <div className="text-[10px] text-slate-500 font-sans font-medium">
                      {t.inspector.input}
                    </div>
                    <pre className="whitespace-pre-wrap break-words">
                      {typeof exec.input === 'object'
                        ? JSON.stringify(exec.input, null, 2)
                        : String(exec.input)}
                    </pre>
                  </div>

                  {/* Output Result */}
                  {exec.output && (
                    <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/70 text-[11px] font-mono text-slate-300 overflow-x-auto space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans font-medium">
                        <span>{t.inspector.output}</span>
                        <button
                          onClick={() => copyPayload(JSON.stringify(exec.output, null, 2), exec.callId)}
                          className="hover:text-slate-300 transition-colors"
                        >
                          {copiedCallId === exec.callId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap break-words text-emerald-300/90">
                        {typeof exec.output === 'object'
                          ? JSON.stringify(exec.output, null, 2)
                          : String(exec.output)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Artifacts Canvas Cards */}
        {activeTab === 'artifacts' && (
          <div className="space-y-3">
            {artifacts.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-500">
                <FileCode className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>{t.inspector.emptyArtifacts}</p>
              </div>
            ) : (
              artifacts.map((art) => (
                <div
                  key={art.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 space-y-3 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {art.type} {art.language ? `· ${art.language}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectArtifact(art)}
                      className="px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {t.artifacts.viewCanvas}
                    </button>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/70 text-[11px] font-mono text-slate-400 max-h-24 overflow-hidden relative">
                    <pre className="line-clamp-4">{art.content}</pre>
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-950 to-transparent" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
