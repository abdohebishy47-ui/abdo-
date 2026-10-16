/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { ArtifactModal } from './components/ArtifactModal';
import { CapabilitiesModal } from './components/CapabilitiesModal';
import { SessionsModal } from './components/SessionsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ShareAppModal } from './components/ShareAppModal';
import { Language, AgentMode, AgentSession, AgentMessage, ThoughtStep, ToolExecution, Artifact } from './types/agent';
import { translations } from './locales/translations';

const STORAGE_KEY_SESSIONS = 'omni_agent_sessions_v1';
const STORAGE_KEY_LANG = 'omni_agent_lang_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const [mode, setMode] = useState<AgentMode>('autonomous');
  const [sessions, setSessions] = useState<AgentSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading sessions from storage', e);
    }
    const initialId = `session-${Date.now()}`;
    return [
      {
        id: initialId,
        title: language === 'ar' ? 'جلسة عمل جديدة' : 'New Workspace Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        language: 'ar',
        mode: 'autonomous',
        messages: []
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeThoughts, setActiveThoughts] = useState<ThoughtStep[]>([]);
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([]);
  const [activeArtifacts, setActiveArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const [activeModal, setActiveModal] = useState<'capabilities' | 'artifacts' | 'sessions' | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'share' | 'apk'>('share');
  const [mobileTab, setMobileTab] = useState<'chat' | 'inspector'>('chat');

  // Handle document direction (RTL / LTR)
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed writing sessions to storage', e);
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  // Sync active inspector items when switching sessions
  useEffect(() => {
    if (!currentSession) return;
    const lastAssistantMsg = [...currentSession.messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMsg) {
      setActiveThoughts(lastAssistantMsg.thoughts || []);
      setActiveTools(lastAssistantMsg.tools || []);
      setActiveArtifacts(lastAssistantMsg.artifacts || []);
    } else {
      setActiveThoughts([]);
      setActiveTools([]);
      setActiveArtifacts([]);
    }
  }, [currentSessionId]);

  const handleNewSession = useCallback(() => {
    const newSession: AgentSession = {
      id: `session-${Date.now()}`,
      title: language === 'ar' ? 'جلسة جديدة' : 'New Workspace Session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      language,
      mode,
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveThoughts([]);
    setActiveTools([]);
    setActiveArtifacts([]);
    setMobileTab('chat');
  }, [language, mode]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const fresh: AgentSession = {
          id: `session-${Date.now()}`,
          title: language === 'ar' ? 'جلسة جديدة' : 'New Workspace Session',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          language,
          mode,
          messages: []
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentSessionId, language, mode]);

  // Execute Agent Task with SSE Stream
  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || isRunning) return;

    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now()
    };

    const updatedMessages = [...currentSession.messages, userMessage];

    // Update session title if first prompt
    const newTitle = currentSession.messages.length === 0
      ? promptText.slice(0, 40) + (promptText.length > 40 ? '...' : '')
      : currentSession.title;

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              title: newTitle,
              updatedAt: Date.now(),
              messages: updatedMessages
            }
          : s
      )
    );

    setIsRunning(true);
    setStatusMessage(language === 'ar' ? 'بدء معالجة الهدف...' : 'Initiating agent objective...');
    setActiveThoughts([]);
    setActiveTools([]);

    // Temporary accumulating variables for stream
    const tempThoughts: ThoughtStep[] = [];
    const tempTools: ToolExecution[] = [];
    const tempArtifacts: Artifact[] = [...activeArtifacts];
    let tempSources: Array<{ title: string; uri: string }> = [];
    let accumulatedResponse = '';

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: promptText,
          history: currentSession.messages.map(m => ({ role: m.role, content: m.content })),
          language,
          mode
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported on this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const jsonStr = trimmed.replace(/^data:\s*/, '');
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'status') {
              setStatusMessage(event.data?.message || '');
            } else if (event.type === 'thought') {
              tempThoughts.push(event.data);
              setActiveThoughts([...tempThoughts]);
            } else if (event.type === 'tool_call') {
              const exec: ToolExecution = {
                tool: event.data.tool,
                callId: event.data.callId,
                input: event.data.input,
                status: 'running',
                timestamp: Date.now()
              };
              tempTools.push(exec);
              setActiveTools([...tempTools]);
            } else if (event.type === 'tool_result') {
              const existingIdx = tempTools.findIndex(t => t.callId === event.data.callId);
              if (existingIdx !== -1) {
                tempTools[existingIdx] = {
                  ...tempTools[existingIdx],
                  output: event.data.output,
                  status: 'success'
                };
              } else {
                tempTools.push({
                  tool: event.data.tool,
                  callId: event.data.callId || `res-${Date.now()}`,
                  input: {},
                  output: event.data.output,
                  status: 'success',
                  timestamp: Date.now()
                });
              }
              setActiveTools([...tempTools]);
            } else if (event.type === 'artifact') {
              const art: Artifact = {
                id: event.data.id,
                title: event.data.title,
                type: event.data.type || 'markdown',
                content: event.data.content,
                language: event.data.language,
                timestamp: Date.now()
              };
              tempArtifacts.push(art);
              setActiveArtifacts([...tempArtifacts]);
            } else if (event.type === 'done') {
              accumulatedResponse = event.data.fullResponse || accumulatedResponse;
              if (event.data.searchSources) {
                tempSources = event.data.searchSources;
              }
            } else if (event.type === 'error') {
              accumulatedResponse += `\n\n⚠️ ${event.data?.message || 'Error executing agent'}`;
            }
          } catch (err) {
            console.error('Failed parsing stream chunk', err);
          }
        }
      }

      // Add final assistant message to session
      const assistantMessage: AgentMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: accumulatedResponse || (language === 'ar' ? 'تمت معالجة المهمة بنجاح.' : 'Task completed successfully.'),
        thoughts: tempThoughts,
        tools: tempTools,
        artifacts: tempArtifacts,
        sources: tempSources,
        timestamp: Date.now()
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? {
                ...s,
                updatedAt: Date.now(),
                messages: [...updatedMessages, assistantMessage]
              }
            : s
        )
      );
    } catch (err: any) {
      console.error('Agent execution error:', err);
      const errorMessage: AgentMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: language === 'ar'
          ? `عذراً، حدث خطأ أثناء تشغيل الوكيل: ${err.message || 'فشل الاتصال بالخادم'}. يرجى التحقق من مفتاح GEMINI_API_KEY والمحاولة مرة أخرى.`
          : `Execution failed: ${err.message || 'Unable to connect to backend'}. Please verify GEMINI_API_KEY.`,
        timestamp: Date.now()
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? {
                ...s,
                updatedAt: Date.now(),
                messages: [...updatedMessages, errorMessage]
              }
            : s
        )
      );
    } finally {
      setIsRunning(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#090d16] text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <Header
        language={language}
        onLanguageChange={(l) => setLanguage(l)}
        activeTab={activeModal === 'capabilities' ? 'capabilities' : activeModal === 'sessions' ? 'sessions' : 'workspace'}
        onTabChange={(tab) => {
          if (tab === 'capabilities') setActiveModal('capabilities');
          else if (tab === 'sessions') setActiveModal('sessions');
          else if (tab === 'artifacts') {
            if (activeArtifacts.length > 0) {
              setSelectedArtifact(activeArtifacts[activeArtifacts.length - 1]);
            } else {
              setMobileTab('inspector');
            }
          } else {
            setActiveModal(null);
          }
        }}
        onNewSession={handleNewSession}
        onOpenShare={(tab) => {
          setShareModalTab(tab || 'share');
          setShareModalOpen(true);
        }}
      />

      {/* Mobile Viewport Toggle */}
      <div className="lg:hidden flex items-center border-b border-slate-800 bg-[#0c1220] p-1.5">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-colors ${
            mobileTab === 'chat'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {translations[language].nav.workspace}
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-colors ${
            mobileTab === 'inspector'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {translations[language].inspector.title} ({activeThoughts.length + activeTools.length})
        </button>
      </div>

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Chat Stream & Interactive Prompts (45% on desktop) */}
        <section
          className={`h-full flex-col ${
            mobileTab === 'chat' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-[46%] shrink-0`}
        >
          <ChatPanel
            language={language}
            mode={mode}
            onModeChange={(m) => setMode(m)}
            messages={currentSession?.messages || []}
            isRunning={isRunning}
            onSendMessage={handleSendMessage}
          />
        </section>

        {/* Right Pane: Agent Inspector & Live Telemetry (54% on desktop) */}
        <section
          className={`h-full flex-col ${
            mobileTab === 'inspector' ? 'flex w-full' : 'hidden'
          } lg:flex lg:flex-1`}
        >
          <InspectorPanel
            language={language}
            thoughts={activeThoughts}
            tools={activeTools}
            artifacts={activeArtifacts}
            isRunning={isRunning}
            statusMessage={statusMessage}
            onSelectArtifact={(art) => setSelectedArtifact(art)}
          />
        </section>
      </main>

      {/* Modals */}
      <ArtifactModal
        artifact={selectedArtifact}
        language={language}
        onClose={() => setSelectedArtifact(null)}
      />

      <CapabilitiesModal
        language={language}
        isOpen={activeModal === 'capabilities'}
        onClose={() => setActiveModal(null)}
      />

      <SessionsModal
        language={language}
        isOpen={activeModal === 'sessions'}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => setCurrentSessionId(id)}
        onDeleteSession={handleDeleteSession}
        onClose={() => setActiveModal(null)}
      />

      <ShareAppModal
        language={language}
        isOpen={shareModalOpen}
        defaultTab={shareModalTab}
        onClose={() => setShareModalOpen(false)}
      />

      <OfflineIndicator language={language} />
    </div>
  );
}
