import React, { useState, useEffect } from 'react';
import './App.css';
import { Cpu, Layers, Search, Terminal, Sun, Moon, Server, BrainCircuit, Eye, Award } from 'lucide-react';
import Tokenizer from './components/Tokenizer';
import ContextPlumbing from './components/ContextPlumbing';
import RAGPlayground from './components/RAGPlayground';
import AgentLoop from './components/AgentLoop';
import WorkflowsProtocols from './components/WorkflowsProtocols';
import ReasoningEvals from './components/ReasoningEvals';
import MultimodalHandoff from './components/MultimodalHandoff';
import CertificationQuiz from './components/CertificationQuiz';

const TOPICS = [
  { id: 'tokenization', tab: 'brain' },
  { id: 'temperature', tab: 'brain' },
  { id: 'plumbing', tab: 'plumbing' },
  { id: 'attention', tab: 'plumbing' },
  { id: 'rag', tab: 'rag' },
  { id: 'tool', tab: 'agent' },
  { id: 'react', tab: 'agent' },
  { id: 'workflows', tab: 'workflows' },
  { id: 'reflexion', tab: 'workflows' },
  { id: 'mcp', tab: 'workflows' },
  { id: 'reasoning', tab: 'reasoning' },
  { id: 'evals', tab: 'reasoning' },
  { id: 'vlm', tab: 'multimodal' },
  { id: 'handoff', tab: 'multimodal' },
  { id: 'certification', tab: 'certification' }
];

function App() {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Sync class with HTML element
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const activeTopic = TOPICS[activeTopicIndex];
  const activeTab = activeTopic.tab;

  const onNextTopic = () => {
    if (activeTopicIndex < TOPICS.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    }
  };

  const onPrevTopic = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(activeTopicIndex - 1);
    }
  };

  const onSelectTopic = (topicId) => {
    const idx = TOPICS.findIndex(t => t.id === topicId);
    if (idx !== -1) {
      setActiveTopicIndex(idx);
    }
  };

  const selectTab = (tabName) => {
    const topicIdx = TOPICS.findIndex(t => t.tab === tabName);
    if (topicIdx !== -1) {
      setActiveTopicIndex(topicIdx);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'brain':
        return <Tokenizer activeConcept={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'plumbing':
        return <ContextPlumbing activeConcept={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'rag':
        return <RAGPlayground onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'agent':
        return <AgentLoop activeConcept={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'workflows':
        return <WorkflowsProtocols subTab={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'reasoning':
        return <ReasoningEvals subTab={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'multimodal':
        return <MultimodalHandoff subTab={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
      case 'certification':
        return <CertificationQuiz onPrev={onPrevTopic} />;
      default:
        return <Tokenizer activeConcept={activeTopic.id} onNext={onNextTopic} onPrev={onPrevTopic} onSelectTopic={onSelectTopic} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Terminal size={24} />
          <span>Agentic AI</span> 2026
        </div>
        
        <div className="sidebar-progress" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            <span>Course Progress</span>
            <span>{Math.round((activeTopicIndex / (TOPICS.length - 1)) * 100)}%</span>
          </div>
          <div className="prob-bar-container" style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div className="prob-bar-fill" style={{ width: `${(activeTopicIndex / (TOPICS.length - 1)) * 100}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'center' }}>
            Topic {activeTopicIndex + 1} of {TOPICS.length}
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'brain' ? 'active' : ''}`}
                onClick={() => selectTab('brain')}
              >
                <Cpu size={18} />
                Brain & Tokens
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'plumbing' ? 'active' : ''}`}
                onClick={() => selectTab('plumbing')}
              >
                <Layers size={18} />
                Context Plumbing
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'rag' ? 'active' : ''}`}
                onClick={() => selectTab('rag')}
              >
                <Search size={18} />
                RAG Playground
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'agent' ? 'active' : ''}`}
                onClick={() => selectTab('agent')}
              >
                <Terminal size={18} />
                Agent ReAct Loop
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'workflows' ? 'active' : ''}`}
                onClick={() => selectTab('workflows')}
              >
                <Server size={18} />
                Workflows & Protocols
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'reasoning' ? 'active' : ''}`}
                onClick={() => selectTab('reasoning')}
              >
                <BrainCircuit size={18} />
                Reasoning & Evals
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'multimodal' ? 'active' : ''}`}
                onClick={() => selectTab('multimodal')}
              >
                <Eye size={18} />
                Multimodal & Handoffs
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-btn ${activeTab === 'certification' ? 'active' : ''}`}
                onClick={() => selectTab('certification')}
              >
                <Award size={18} />
                Certification Quiz
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="theme-toggle-btn"
            onClick={() => setIsLightMode(!isLightMode)}
          >
            {isLightMode ? (
              <>
                <Moon size={16} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;
