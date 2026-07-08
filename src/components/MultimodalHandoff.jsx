import React, { useState, useEffect } from 'react';
import { Eye, UserCheck, MessageSquare, ArrowRight, CheckCircle2, UserPlus, Image, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, Code } from 'lucide-react';

function MultimodalHandoff({ subTab, onNext, onPrev, onSelectTopic }) {
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- VLM State ---
  const [imagePreset, setImagePreset] = useState('chart'); // chart, receipt
  const [showPatches, setShowPatches] = useState(false);
  const [isVlmRunning, setIsVlmRunning] = useState(false);
  const [vlmOutput, setVlmOutput] = useState('');
  const [selectedPatch, setSelectedPatch] = useState(null);

  // --- Handoff State ---
  const [activeAgent, setActiveAgent] = useState('triage'); // triage, billing, tech
  const [chatLog, setChatLog] = useState([]);
  const [isHandoffRunning, setIsHandoffRunning] = useState(false);

  // Patch definitions
  const patchesData = {
    chart: [
      { id: 1, text: "Top-left axis", coords: "x: 0-50, y: 0-50", token: "P_001", data: "Grid line label: '$200'" },
      { id: 2, text: "Header title", coords: "x: 50-100, y: 0-50", token: "P_002", data: "Text tokens: 'AAPL Stock'" },
      { id: 3, text: "Chart line peak", coords: "x: 100-150, y: 50-100", token: "P_003", data: "Graph coordinate: $180.50" },
      { id: 4, text: "Volume bars", coords: "x: 150-200, y: 150-200", token: "P_004", data: "Vertical bar count: 1.2M" }
    ],
    receipt: [
      { id: 1, text: "Merchant Logo", coords: "x: 0-50, y: 0-50", token: "P_001", data: "Text string: 'Acme Corp'" },
      { id: 2, text: "Date Stamp", coords: "x: 100-50, y: 0-50", token: "P_002", data: "Timestamp: '2026-06-25'" },
      { id: 3, text: "Subtotal Line", coords: "x: 50-100, y: 100-150", token: "P_003", data: "Currency amount: $120.00" },
      { id: 4, text: "MFA Code box", coords: "x: 100-150, y: 150-200", token: "P_004", data: "Auth String: 'MFA_ENABLED'" }
    ]
  };

  const handleVlmAnalyze = () => {
    setIsVlmRunning(true);
    setVlmOutput('');
    setShowPatches(true);

    setTimeout(() => {
      if (imagePreset === 'chart') {
        setVlmOutput('VLM Analysis: The visual chart indicates a stock price peak of $180.50 for AAPL, with a steady upward trajectory in Q3.');
      } else {
        setVlmOutput('VLM Analysis: Receipt parsed successfully. Merchant: Acme Corp, Transaction Date: 2026-06-25, Total Amount: $120.00.');
      }
      setIsVlmRunning(false);
    }, 1800);
  };

  const resetVlm = () => {
    setShowPatches(false);
    setVlmOutput('');
    setIsVlmRunning(false);
    setSelectedPatch(null);
  };

  const triggerHandoff = (intentType) => {
    setIsHandoffRunning(true);
    setActiveAgent('triage');
    
    if (intentType === 'billing') {
      setChatLog([
        { sender: 'user', text: 'I want a refund for my last transaction of $120.00.' },
        { sender: 'triage', text: 'Analyzing request intent... Intent matches [Billing/Refunds]. Initiating billing handoff sequence...' }
      ]);

      setTimeout(() => {
        setActiveAgent('billing');
        setChatLog(prev => [
          ...prev,
          { sender: 'system', text: 'Control handed off to Billing Specialist Agent. Context synced.' },
          { sender: 'billing', text: 'Hello! I am your Billing Specialist. I have received the transfer. Checking transaction history for a $120.00 charge. Under our 14-day policy, this is refundable. Would you like me to process it?' }
        ]);
        setIsHandoffRunning(false);
      }, 2000);
    } else {
      setChatLog([
        { sender: 'user', text: 'My Python code is throwing a division by zero error.' },
        { sender: 'triage', text: 'Analyzing request intent... Intent matches [Technical/Bug-fixing]. Initiating support handoff sequence...' }
      ]);

      setTimeout(() => {
        setActiveAgent('tech');
        setChatLog(prev => [
          ...prev,
          { sender: 'system', text: 'Control handed off to Tech Specialist Agent. Context synced.' },
          { sender: 'tech', text: 'Hello! I am your Tech Support Agent. A division by zero error occurs when the divisor in a division operation is 0. Please verify your loop denominators or add a check: `if denominator != 0`.' }
        ]);
        setIsHandoffRunning(false);
      }, 2000);
    }
  };

  const resetChat = () => {
    setActiveAgent('triage');
    setChatLog([]);
    setIsHandoffRunning(false);
  };

  useEffect(() => {
    resetVlm();
    resetChat();

    if (subTab === 'vlm') {
      const timer = setTimeout(() => {
        handleVlmAnalyze();
      }, 500);
      return () => clearTimeout(timer);
    } else if (subTab === 'handoff') {
      const timer = setTimeout(() => {
        triggerHandoff('billing');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [subTab]);

  const getCodeSnippet = () => {
    if (subTab === 'vlm') {
      if (codeLang === 'python') {
        return `# Encoding images as Base64 payload parameters
import base64
import google.generativeai as genai

model = genai.GenerativeModel("gemini-2.5-flash")

with open("receipt.jpg", "rb") as image_file:
    img_data = image_file.read()

# Send Base64 visual chunks directly alongside query text
response = model.generate_content([
    "Parse merchant name and sum total from this receipt.",
    {"mime_type": "image/jpeg", "data": img_data}
])
print(response.text)`;
      } else if (codeLang === 'javascript') {
        return `// Using Google GenAI SDK to send inline image data
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI();

const imagePart = {
  inlineData: {
    data: Buffer.from(fs.readFileSync('chart.png')).toString('base64'),
    mimeType: 'image/png'
  }
};

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: ['Extract peak stock price:', imagePart]
});
console.log(response.text);`;
      } else {
        return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "What is in this image?"},
          {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}
        ]
      }
    ]
  }'`;
      }
    } else {
      // Handoff code
      if (codeLang === 'python') {
        return `# Multi-agent transfer function orchestrations
def triage_agent(user_query, history):
    intent = classify_intent(user_query)
    
    if intent == "billing":
        # Synced context payload handoff to specialist
        return billing_specialist(user_query, history)
    else:
        return tech_support(user_query, history)

def billing_specialist(query, history):
    system_prompt = "You are a Billing Specialist agent..."
    return query_llm(system_prompt, query, history)`;
      } else if (codeLang === 'javascript') {
        return `// Handoff logic transfer in Node.js
function triage(input, chatLogs) {
  if (input.includes('refund')) {
    return transferToAgent('billing', chatLogs);
  }
  return transferToAgent('tech', chatLogs);
}`;
      } else {
        return `# Handoffs require the client pipeline to intercept the transfer request
# and dynamically switch the system prompt definition for the next turn.`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: Multimodality & Handoffs</h1>
            <p className="subtitle">Learn how models understand images and route conversation control across specialized agents.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${subTab === 'vlm' ? 'active' : ''}`}
              onClick={() => { onSelectTopic('vlm'); }}
            >
              1. Multimodality
            </button>
            <button 
              className={`lesson-tab-btn ${subTab === 'handoff' ? 'active' : ''}`}
              onClick={() => { onSelectTopic('handoff'); }}
            >
              2. Multi-Agent Handoff
            </button>
          </div>

          {/* Sub Navigation tabs */}
          <div className="lesson-nav-tabs">
            <button 
              className={`lesson-nav-tab ${lessonTab === 'analogy' ? 'active' : ''}`}
              onClick={() => setLessonTab('analogy')}
            >
              Layman Analogy
            </button>
            <button 
              className={`lesson-nav-tab ${lessonTab === 'mechanics' ? 'active' : ''}`}
              onClick={() => setLessonTab('mechanics')}
            >
              Under the Hood
            </button>
            <button 
              className={`lesson-nav-tab ${lessonTab === 'code' ? 'active' : ''}`}
              onClick={() => setLessonTab('code')}
            >
              Programmatic Code
            </button>
          </div>

          <div className="lesson-content">
            {lessonTab === 'analogy' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <BookOpen size={16} />
                  {subTab === 'vlm' ? 'The Eye Doctor’s Grid Analogy' : 'The Bank Receptionist Desk'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'vlm' ? (
                    <div>
                      Imagine an eye doctor examining a complicated retinal scan scan. 
                      <br /><br />
                      They don't just blink and stare at the whole photo at once. Instead, they project a grid over the scan, dividing it into 16 quadrants. They study the details of quadrant [1, 1], then [1, 2], converting each section into a descriptive checklist.
                      <br /><br />
                      **VLMs** do the exact same thing: they break down incoming images into pixel grids (patches) and read them as visual tokens.
                    </div>
                  ) : (
                    <div>
                      Imagine walking into a massive bank lobby to open a business loan. 
                      <br /><br />
                      You don't just yell your request to the entire lobby. First, a <strong>Triage Receptionist</strong> greets you and asks: <i>"How can I help?"</i>. When you say "business loan", they route your request and walk you over to the <strong>Loan Specialist’s desk</strong>. 
                      <br /><br />
                      The receptionist hands your folder (chat history context) to the specialist, so you don't have to explain your request twice.
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {subTab === 'vlm' ? 'Vision Transformers (ViT) & Patches' : 'Modular Agent State Transfers'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'vlm' ? (
                    <div>
                      Vision-Language Models (VLMs) process images by translating visual regions into standard vector sequences:
                      <ul>
                        <li><strong>Grid Patching</strong>: The image is segmented into sub-squares (typically $14 \times 14$ pixels each).</li>
                        <li><strong>Patch Embedding</strong>: A Vision Transformer (ViT) embeds each grid patch into a numerical list representing visual features.</li>
                        <li><strong>Attention Union</strong>: These visual token vectors are appended alongside text token vectors in the attention sequence, letting the model cross-reference coordinates with text.</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      To scale complex agent networks, developers split labor among modular specialized agents:
                      <ol>
                        <li><strong>Triage Classifier</strong>: Classifies the intent parameters from the user's query.</li>
                        <li><strong>Context Syncing</strong>: The triage agent outputs a routing command (e.g. transfer to agent ID).</li>
                        <li><strong>Handoff Dispatch</strong>: The orchestrator merges the previous chat transcript into the new specialized agent prompt, initializing their focused tools.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Programmatic Handoffs & Vision
                </div>
                <div className="lesson-section-body">
                  <div className="code-switcher">
                    <button className={`code-btn ${codeLang === 'python' ? 'active' : ''}`} onClick={() => setCodeLang('python')}>Python</button>
                    <button className={`code-btn ${codeLang === 'javascript' ? 'active' : ''}`} onClick={() => setCodeLang('javascript')}>Node.js</button>
                    <button className={`code-btn ${codeLang === 'curl' ? 'active' : ''}`} onClick={() => setCodeLang('curl')}>cURL API</button>
                  </div>
                  <div className="code-preview" style={{ fontSize: '0.75rem' }}>
                    {getCodeSnippet()}
                    <div className="code-badge">{codeLang.toUpperCase()}</div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="lesson-nav-footer">
            <button className="btn-secondary" onClick={onPrev}>
              ← Previous
            </button>
            <button className="btn-primary" onClick={onNext}>
              Next Topic →
            </button>
          </div>
        </aside>

        {/* Right Panel: Interactive Simulations */}
        <main className="simulator-panel">
          
          {/* VLM Tab */}
          {subTab === 'vlm' && (
            <div className="grid-2 slide-in">
              <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Image size={20} color="var(--primary-color)" />
                  Input Modality: Image
                </h2>

                <div className="input-group">
                  <label className="input-label" htmlFor="img-preset-select">Select Image Target</label>
                  <select
                    id="img-preset-select"
                    className="text-input"
                    value={imagePreset}
                    onChange={(e) => {
                      setImagePreset(e.target.value);
                      resetVlm();
                    }}
                    disabled={isVlmRunning}
                  >
                    <option value="chart">Technical Stock Price Chart</option>
                    <option value="receipt">Corporate Purchase Receipt</option>
                  </select>
                </div>

                {/* VLM Image grid patching visualization */}
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#020204', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {imagePreset === 'chart' ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', width: '70%', height: '60%', position: 'relative' }}>
                      <div style={{ height: '30%', width: '15px', backgroundColor: 'var(--primary-color)' }} />
                      <div style={{ height: '50%', width: '15px', backgroundColor: 'var(--primary-color)' }} />
                      <div style={{ height: '80%', width: '15px', backgroundColor: 'var(--primary-color)' }} />
                      <div style={{ height: '70%', width: '15px', backgroundColor: 'var(--primary-color)' }} />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '70%', padding: '1rem', border: '1px solid #333', background: '#111', borderRadius: '4px', position: 'relative' }}>
                      <div style={{ height: '10px', width: '40%', backgroundColor: '#555' }} />
                      <div style={{ height: '1px', width: '100%', backgroundColor: '#333' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ height: '8px', width: '30%', backgroundColor: '#444' }} />
                        <div style={{ height: '8px', width: '20%', backgroundColor: '#444' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ height: '8px', width: '45%', backgroundColor: '#444' }} />
                        <div style={{ height: '8px', width: '20%', backgroundColor: '#444' }} />
                      </div>
                    </div>
                  )}

                  {/* Patch overlays grids */}
                  {showPatches && (
                    <div className="vlm-image-grid">
                      <div className={`vlm-grid-cell ${selectedPatch?.id === 1 ? 'active' : ''}`} onClick={() => setSelectedPatch(patchesData[imagePreset][0])}>P_001</div>
                      <div className={`vlm-grid-cell ${selectedPatch?.id === 2 ? 'active' : ''}`} onClick={() => setSelectedPatch(patchesData[imagePreset][1])}>P_002</div>
                      <div className={`vlm-grid-cell ${selectedPatch?.id === 3 ? 'active' : ''}`} onClick={() => setSelectedPatch(patchesData[imagePreset][2])}>P_003</div>
                      <div className={`vlm-grid-cell ${selectedPatch?.id === 4 ? 'active' : ''}`} onClick={() => setSelectedPatch(patchesData[imagePreset][3])}>P_004</div>
                    </div>
                  )}
                </div>

                <button className="btn-primary" onClick={handleVlmAnalyze} disabled={isVlmRunning}>
                  {isVlmRunning ? 'Segmenting Patches...' : 'Analyze Image'}
                </button>
              </section>

              {/* VLM Text result panel */}
              <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} color="var(--primary-color)" />
                  Vision Token Inspect
                </h2>

                {/* clicked patch inspector details */}
                {selectedPatch ? (
                  <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Selected: {selectedPatch.token}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Coords: {selectedPatch.coords}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                      Segment description: {selectedPatch.text}<br />
                      <strong>Extracted Value:</strong> <code style={{ color: 'var(--success-color)' }}>{selectedPatch.data}</code>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '0.75rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click visual quadrants P_001 to P_004 in grid above to inspect their token embeddings coordinates.
                  </div>
                )}

                <div>
                  <span className="input-label">Output Text Response</span>
                  <div className="code-preview" style={{ minHeight: '100px', borderColor: vlmOutput ? 'var(--success-border)' : 'var(--border-color)' }}>
                    {vlmOutput}
                    {isVlmRunning && <span className="pulse" style={{ color: 'var(--primary-color)' }}>_</span>}
                    {!vlmOutput && !isVlmRunning && <span style={{ color: 'var(--text-muted)' }}>Click 'Analyze Image' to run...</span>}
                    {vlmOutput && <div className="code-badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-color)' }}>VLM parsed output</div>}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Handoff Tab */}
          {subTab === 'handoff' && (
            <div className="grid-2 slide-in">
              <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={20} color="var(--primary-color)" />
                  Triage Handoff Simulator
                </h2>

                {/* Avatar Routing map tree */}
                <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.15)' }}>
                  <span className="input-label" style={{ marginBottom: '0.5rem' }}>Active Handoff Agent Node</span>
                  
                  <div className="agent-tree-container">
                    <div className={`agent-tree-node ${activeAgent === 'triage' ? 'active' : ''}`}>
                      <UserPlus size={14} />
                      Triage Agent
                    </div>
                    
                    <div className="agent-tree-row">
                      <div className={`agent-tree-node ${activeAgent === 'billing' ? 'active' : ''}`}>
                        <Wrench size={14} />
                        Billing Specialist
                      </div>
                      <div className={`agent-tree-node ${activeAgent === 'tech' ? 'active' : ''}`}>
                        <Wrench size={14} />
                        Tech Support Specialist
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="input-label">Select Customer Intent Scenario</span>
                  <button 
                    className="btn-primary" 
                    onClick={() => triggerHandoff('billing')}
                    disabled={isHandoffRunning}
                    style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    1. Refund billing request
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={() => triggerHandoff('tech')}
                    disabled={isHandoffRunning}
                    style={{ fontSize: '0.85rem', padding: '0.6rem', backgroundColor: 'var(--success-color)' }}
                  >
                    2. Python division bug support
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={resetChat}
                    disabled={isHandoffRunning}
                    style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Reset chat context
                  </button>
                </div>
              </section>

              <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} color="var(--primary-color)" />
                  Conversation Session Log
                </h2>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#020204' }}>
                  {chatLog.map((chat, idx) => {
                    let senderName = 'Customer';
                    let chatBg = 'rgba(255,255,255,0.03)';
                    let senderColor = 'var(--text-color)';
                    
                    if (chat.sender === 'triage') {
                      senderName = 'Triage Agent';
                      chatBg = 'rgba(37, 99, 235, 0.05)';
                      senderColor = 'var(--primary-color)';
                    } else if (chat.sender === 'billing') {
                      senderName = 'Billing Specialist';
                      chatBg = 'rgba(245, 158, 11, 0.05)';
                      senderColor = 'var(--warning-color)';
                    } else if (chat.sender === 'tech') {
                      senderName = 'Tech Support Agent';
                      chatBg = 'rgba(16, 185, 129, 0.05)';
                      senderColor = 'var(--success-color)';
                    } else if (chat.sender === 'system') {
                      senderName = 'SYSTEM STATE HANDOFF';
                      chatBg = 'rgba(255, 255, 255, 0.05)';
                      senderColor = '#ec4899';
                    }

                    return (
                      <div key={idx} style={{ padding: '0.6rem', borderRadius: '6px', backgroundColor: chatBg, fontSize: '0.8rem', borderLeft: chat.sender === 'system' ? '3px solid #ec4899' : '' }}>
                        <span style={{ fontWeight: 'bold', color: senderColor, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                          {senderName}
                        </span>
                        <span style={{ color: 'var(--text-color)', lineHeight: '1.4' }}>{chat.text}</span>
                      </div>
                    );
                  })}
                  {chatLog.length === 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>Select a scenario to start chat session logs.</span>
                  )}
                  {isHandoffRunning && (
                    <div className="pulse" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classifying user input intent...</div>
                  )}
                </div>
              </section>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default MultimodalHandoff;
