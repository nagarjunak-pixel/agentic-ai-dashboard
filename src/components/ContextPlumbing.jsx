import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowDown, FileText, CheckCircle2, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, Code, Cpu } from 'lucide-react';

function ContextPlumbing({ activeConcept, onNext, onPrev, onSelectTopic }) {
  const plumbingTimersRef = useRef([]);
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Plumbing states ---
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a cautious financial advisor. You explain things simply, reference rules strictly, and never make things up.'
  );
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'user', content: 'Hello, can you help me check my portfolio balance rules?' },
    { role: 'assistant', content: 'Certainly! I can pull up our balance guidelines. What specifically would you like to know?' }
  ]);

  const [ragContext, setRagContext] = useState(
    'Rule 102 (Portfolio thresholds): Technology stocks should not exceed a P/E ratio of 25x. Any deviation triggers an immediate rebalancing alert.'
  );

  const [userInput, setUserInput] = useState('What is my current P/E threshold for tech stocks?');
  const [activeNode, setActiveNode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Prompt Caching states ---
  const [useCaching, setUseCaching] = useState(true);

  // --- Self-Attention interactive state ---
  const [hoveredAttentionWord, setHoveredAttentionWord] = useState('');

  // Sentence words for Attention Map
  const attentionSentence = ["The", "animal", "did", "not", "cross", "the", "street", "because", "it", "was", "too", "tired"];
  
  // Attention weights from "it" to others
  const attentionWeights = {
    "it": { "animal": 0.82, "street": 0.08, "cross": 0.04, "tired": 0.06 },
    "animal": { "animal": 0.60, "tired": 0.30, "cross": 0.10 },
    "street": { "street": 0.70, "cross": 0.20, "animal": 0.10 },
    "tired": { "animal": 0.75, "tired": 0.25 }
  };

  const handlePlayPlumbing = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    setActiveNode('system');
    
    const t1 = setTimeout(() => {
      setActiveNode('history');
    }, 800);

    const t2 = setTimeout(() => {
      setActiveNode('rag');
    }, 1600);

    const t3 = setTimeout(() => {
      setActiveNode('user');
    }, 2400);

    const t4 = setTimeout(() => {
      setActiveNode('');
      setIsPlaying(false);
    }, 3200);

    plumbingTimersRef.current.push(t1, t2, t3, t4);
  };

  useEffect(() => {
    plumbingTimersRef.current.forEach(clearTimeout);
    plumbingTimersRef.current = [];
    setIsPlaying(false);
    setActiveNode('');

    if (activeConcept === 'plumbing') {
      const timer = setTimeout(() => {
        handlePlayPlumbing();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeConcept]);

  // Assemble messages structure
  const assembledMessages = [
    {
      role: 'system',
      content: systemPrompt
    },
    ...chatHistory,
    {
      role: 'user',
      content: `[RETRIEVED KNOWLEDGE]\n${ragContext}\n\n[USER QUESTION]\n${userInput}`
    }
  ];

  const handleAddHistory = () => {
    setChatHistory([
      ...chatHistory,
      { role: 'user', content: 'Can we adjust this limit?' },
      { role: 'assistant', content: 'Limits can only be adjusted by submitting Form 409 to compliance.' }
    ]);
  };

  const handleClearHistory = () => {
    setChatHistory([]);
  };

  // Cost calculations
  const sysTokens = Math.ceil(systemPrompt.length / 4);
  const histTokens = Math.ceil(chatHistory.reduce((sum, h) => sum + h.content.length, 0) / 4);
  const ragTokens = Math.ceil(ragContext.length / 4);
  const userTokens = Math.ceil(userInput.length / 4);
  const totalTokens = sysTokens + histTokens + ragTokens + userTokens;

  // Cached vs uncached cost pricing
  const baseCostPerMillion = 3.00; // $3.00 per 1M tokens input
  const cachedCostPerMillion = 0.30; // $0.30 per 1M tokens (90% discount)
  
  const calculatedCost = useCaching 
    ? ((sysTokens + ragTokens) * (cachedCostPerMillion / 1000000) + (histTokens + userTokens) * (baseCostPerMillion / 1000000)).toFixed(7)
    : (totalTokens * (baseCostPerMillion / 1000000)).toFixed(7);

  const payloadString = JSON.stringify({
    model: "gemini-2.5-pro",
    messages: assembledMessages,
    temperature: 0.2,
    max_tokens: 800,
    ...(useCaching && {
      caching: {
        cache_type: "context_plumbing_cache",
        ttl_seconds: 300
      }
    })
  }, null, 2);

  const getCodeSnippet = () => {
    if (activeConcept === 'plumbing') {
      if (codeLang === 'python') {
        return `import google.generativeai as genai

# Configure API
genai.configure(api_key="YOUR_API_KEY")

# Context plumbing model creation
model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    system_instruction="${systemPrompt}"
)

# Compile history + RAG + user input
chat = model.start_chat(history=[
    {"role": "user", "parts": ["Hello, can you help me check my portfolio balance rules?"]},
    {"role": "model", "parts": ["Certainly! I can pull up our balance guidelines. What specifically would you like to know?"]}
])

user_query = """[RETRIEVED KNOWLEDGE]
${ragContext}

[USER QUESTION]
${userInput}"""

response = chat.send_message(user_query)
print(response.text)`;
      } else if (codeLang === 'javascript') {
        return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY' });

const messages = [
  { role: 'system', content: '${systemPrompt}' },
  { role: 'user', content: 'Hello, can you help me check my portfolio balance rules?' },
  { role: 'assistant', content: 'Certainly! I can pull up our balance guidelines. What specifically would you like to know?' },
  { role: 'user', content: \`[RETRIEVED KNOWLEDGE]\\n${ragContext}\\n\\n[USER QUESTION]\\n${userInput}\` }
];

const response = await ai.models.generateContent({
  model: 'gemini-2.5-pro',
  contents: messages
});

console.log(response.text);`;
      } else {
        return `curl https://api.gemini.ai/v1/chat/completions \\
  -H "Authorization: Bearer $GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "system", "content": "${systemPrompt}"},
      {"role": "user", "content": "Hello..."},
      {"role": "assistant", "content": "Certainly!..."},
      {"role": "user", "content": "[RETRIEVED KNOWLEDGE]..."}
    ]
  }'`;
      }
    } else {
      // attention model code
      if (codeLang === 'python') {
        return `import numpy as np

# Simple Self-Attention simulation
query = np.array([0.2, 0.8, -0.5])
keys = np.array([
    [0.1, 0.9, -0.4], # "animal" key vector
    [-0.3, 0.4, 0.8], # "street" key vector
    [0.9, -0.1, 0.2]  # "tired" key vector
])

# Matrix dot product representing raw attention scores
raw_scores = np.dot(keys, query)

# Softmax to get attention weights
weights = np.exp(raw_scores) / np.sum(np.exp(raw_scores))
print(f"Attention Weights: {weights}")`;
      } else if (codeLang === 'javascript') {
        return `// Attention dot product calculation
const query = [0.2, 0.8, -0.5];
const keys = [
  [0.1, 0.9, -0.4], // animal
  [-0.3, 0.4, 0.8]  // street
];

const dotProduct = (a, b) => a.reduce((sum, val, idx) => sum + val * b[idx], 0);
const scores = keys.map(k => dotProduct(k, query));

console.log('Self-Attention Scores:', scores);`;
      } else {
        return `# Attention layer parameters are internal weights of decoder transformers
# and are triggered implicitly by standard context structures.`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: Context & Attention</h1>
            <p className="subtitle">Learn how models focus on specific words and how chat history is maintained.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${activeConcept === 'plumbing' ? 'active' : ''}`}
              onClick={() => onSelectTopic('plumbing')}
            >
              5. Context Plumbing
            </button>
            <button 
              className={`lesson-tab-btn ${activeConcept === 'attention' ? 'active' : ''}`}
              onClick={() => onSelectTopic('attention')}
            >
              3 & 4. Attention & Models
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
                  {activeConcept === 'plumbing' ? 'The Consultant’s Desk Analogy' : 'The Loud Dinner Party Analogy'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'plumbing' ? (
                    <div>
                      Imagine you hire an elite business consultant. However, this consultant has a rare condition: <strong>every night, their memory is completely wiped clean (stateless)</strong>.
                      <br /><br />
                      To get them to do any work, you must carefully lay out their desk every single morning. You lay out:
                      <ol>
                        <li>The employee manual (<strong>System Prompt</strong>).</li>
                        <li>The transcripts of what you discussed yesterday (<strong>Chat History</strong>).</li>
                        <li>Relevant files grabbed from storage (<strong>RAG Context</strong>).</li>
                        <li>Your active question (<strong>User Input</strong>).</li>
                      </ol>
                      The size of this consultant's desk is the <strong>Context Window</strong>.
                    </div>
                  ) : (
                    <div>
                      Imagine you are standing in the middle of a loud dinner party. Ten conversations are happening at once, and glasses are clinking. 
                      <br /><br />
                      <strong>Attention</strong> is your brain's biological superpower that lets you tune out the noise and focus 100% on the person speaking directly to you.
                      <br /><br />
                      Decoder-only transformers do the same mathematically: they read a sentence and calculate which words are linked contextually, ignoring the surrounding filler words.
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {activeConcept === 'plumbing' ? 'Plumbing Architecture & Caching' : 'Dot-Product Self-Attention'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'plumbing' ? (
                    <div>
                      Because LLM models are stateless, they have no long-term memory. State is a developer illusion:
                      <ul>
                        <li><strong>Chat history compiling</strong>: With every message, the developer's backend pulls the database logs, merges user/assistant structures, and resends the entire conversation.</li>
                        <li><strong>Context Caching</strong>: Uploading the same 20,000 system tokens repeatedly is slow and expensive. Caching allows the server to save these parsed tokens in RAM for up to 5 minutes, giving you a 90% discount on cache hits!</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      Self-attention calculates relations using Query, Key, and Value vectors:
                      <div style={{ margin: '1rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.75rem', background: '#020204', borderRadius: '6px', textAlign: 'center' }}>
                        Attention(Q,K,V) = softmax(Q * K^T / sqrt(d)) * V
                      </div>
                      In the sentence: <i>"The animal did not cross the street because it was too tired."</i>
                      <ul>
                        <li>Self-attention maps the pronoun <code>it</code> directly to <code>animal</code> (weight 0.82) based on the adjective <code>tired</code>.</li>
                        <li>If the sentence ended with <i>"because it was too wide,"</i> self-attention weights would shift to map <code>it</code> to <code>street</code>.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Interactive Code Reference
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
          {activeConcept === 'plumbing' ? (
            <div className="grid-2">
              
              {/* Context Elements Builder Card */}
              <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="var(--primary-color)" />
                  Context Elements Builder
                </h2>

                <div 
                  className="input-group" 
                  onFocus={() => setActiveNode('system')}
                  onBlur={() => setActiveNode('')}
                >
                  <label className="input-label" htmlFor="sys-prompt">
                    1. System Prompt (Global Rules)
                  </label>
                  <textarea
                    id="sys-prompt"
                    className="text-input"
                    rows="3"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Define model behavior..."
                  />
                </div>

                <div 
                  className="input-group"
                  onFocus={() => setActiveNode('history')}
                  onBlur={() => setActiveNode('')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="input-label" style={{ margin: 0 }}>
                      2. Chat History Context ({chatHistory.length} turns)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={handleAddHistory} 
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Add Turn
                      </button>
                      <button 
                        onClick={handleClearHistory} 
                        style={{ background: 'none', border: 'none', color: 'var(--error-color)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '100px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    {chatHistory.map((msg, i) => (
                      <div key={i} style={{ fontSize: '0.75rem', display: 'flex', gap: '0.25rem' }}>
                        <strong style={{ color: msg.role === 'user' ? 'var(--primary-color)' : 'var(--success-color)' }}>
                          {msg.role}:
                        </strong>
                        <span style={{ color: 'var(--text-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.content}
                        </span>
                      </div>
                    ))}
                    {chatHistory.length === 0 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No history (First Turn).</span>
                    )}
                  </div>
                </div>

                <div 
                  className="input-group"
                  onFocus={() => setActiveNode('rag')}
                  onBlur={() => setActiveNode('')}
                >
                  <label className="input-label" htmlFor="rag-context">
                    3. Retrieved Knowledge (RAG Document)
                  </label>
                  <textarea
                    id="rag-context"
                    className="text-input"
                    rows="2"
                    value={ragContext}
                    onChange={(e) => setRagContext(e.target.value)}
                    placeholder="External documents retrieved..."
                  />
                </div>

                <div 
                  className="input-group"
                  onFocus={() => setActiveNode('user')}
                  onBlur={() => setActiveNode('')}
                  style={{ marginBottom: 0 }}
                >
                  <label className="input-label" htmlFor="user-msg">
                    4. User Input (Current Request)
                  </label>
                  <input
                    id="user-msg"
                    className="text-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="What do you want to ask?"
                  />
                </div>
              </section>

              {/* Assembled API Payload Card */}
              <section className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="flex-row-center" style={{ marginBottom: '1rem' }}>
                  <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <FileText size={20} color="var(--primary-color)" />
                    Assembled API Payload
                  </h2>
                  <button 
                    className="btn-primary" 
                    onClick={handlePlayPlumbing}
                    disabled={isPlaying}
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <PlayCircle size={14} />
                    {isPlaying ? 'Assembling...' : 'Run Assembly'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  
                  {/* Context Assembly Flow */}
                  <div className="plumbing-diagram" style={{ padding: '0.75rem' }}>
                    <div className={`plumbing-node ${activeNode === 'system' ? 'active' : ''}`}>
                      <CheckCircle2 size={16} color="var(--primary-color)" />
                      System Prompt ({sysTokens} tokens)
                    </div>
                    <div className={`plumbing-arrow ${activeNode === 'system' ? 'active' : ''}`}><ArrowDown size={12} /></div>
                    
                    <div className={`plumbing-node ${activeNode === 'history' ? 'active' : ''}`}>
                      <CheckCircle2 size={16} color="var(--primary-color)" />
                      Chat History Context ({histTokens} tokens)
                    </div>
                    <div className={`plumbing-arrow ${activeNode === 'history' ? 'active' : ''}`}><ArrowDown size={12} /></div>

                    <div className={`plumbing-node ${activeNode === 'rag' ? 'active' : ''}`}>
                      <CheckCircle2 size={16} color="var(--primary-color)" />
                      RAG Context Injection ({ragTokens} tokens)
                    </div>
                    <div className={`plumbing-arrow ${activeNode === 'rag' ? 'active' : ''}`}><ArrowDown size={12} /></div>

                    <div className={`plumbing-node ${activeNode === 'user' ? 'active' : ''}`}>
                      <CheckCircle2 size={16} color="var(--primary-color)" />
                      User Input ({userTokens} tokens)
                    </div>
                  </div>

                  {/* Cache Settings & Hit Calculator */}
                  <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={useCaching} onChange={(e) => setUseCaching(e.target.checked)} />
                        Enable Prompt Caching
                      </label>
                      <span className="code-badge" style={{ position: 'static', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)' }}>
                        {useCaching ? 'Cache Active' : 'Cache Off'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-muted)' }}>
                      <div>Total Payload: <strong>{totalTokens} tokens</strong></div>
                      {useCaching ? (
                        <>
                          <div>Cached tokens: <strong>{sysTokens + ragTokens} tokens</strong></div>
                          <div>Estimated API cost: <strong style={{ color: 'var(--success-color)' }}>${calculatedCost}</strong></div>
                        </>
                      ) : (
                        <div>Estimated API cost: <strong style={{ color: 'var(--warning-color)' }}>${calculatedCost}</strong></div>
                      )}
                    </div>
                  </div>

                  {/* Compiled JSON code box */}
                  <div style={{ flex: 1 }}>
                    <div className="code-preview" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                      {payloadString}
                      <div className="code-badge">JSON POST</div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          ) : (
            /* Attention Simulator */
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} color="var(--primary-color)" />
                Self-Attention Weight Map Visualizer
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                Self-Attention enables the model to calculate how much words relate to each other. Hover over key tokens (like <strong>it</strong> or <strong>tired</strong>) to see the computed mathematical weights highlighting linked words.
              </p>

              {/* Words row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                {attentionSentence.map((word, idx) => {
                  const isHoverable = attentionWeights[word.toLowerCase()];
                  const isHovered = hoveredAttentionWord === word.toLowerCase();
                  
                  // Compute background weight color relative to hovered word
                  let weightColor = 'transparent';
                  if (hoveredAttentionWord && attentionWeights[hoveredAttentionWord]) {
                    const weight = attentionWeights[hoveredAttentionWord][word.toLowerCase()] || 0;
                    if (weight > 0) {
                      weightColor = `rgba(37, 99, 235, ${weight})`;
                    }
                  }

                  return (
                    <span 
                      key={idx}
                      onMouseEnter={() => isHoverable && setHoveredAttentionWord(word.toLowerCase())}
                      onMouseLeave={() => setHoveredAttentionWord('')}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1rem',
                        cursor: isHoverable ? 'pointer' : 'default',
                        backgroundColor: isHovered ? 'var(--primary-color)' : weightColor,
                        border: isHoverable ? '1px dashed var(--primary-color)' : '1px solid transparent',
                        color: isHovered ? '#fff' : 'inherit',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Attention matrix grid */}
              <div>
                <span className="input-label">Attention Relationship Matrix</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  {hoveredAttentionWord && attentionWeights[hoveredAttentionWord] ? (
                    <div>
                      <strong style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Hovering: "{hoveredAttentionWord}"</strong>
                      <div className="prob-list">
                        {Object.entries(attentionWeights[hoveredAttentionWord]).map(([target, val]) => (
                          <div key={target} className="prob-row">
                            <span className="prob-label">{target}</span>
                            <div className="prob-bar-container">
                              <div className="prob-bar-fill" style={{ width: `${val * 100}%`, backgroundColor: 'var(--primary-color)' }} />
                            </div>
                            <span className="prob-value" style={{ width: '40px' }}>{(val * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Hover over dashed word tokens in the sentence above to trace self-attention weights.
                    </div>
                  )}
                </div>
              </div>

            </section>
          )}
        </main>

      </div>
    </div>
  );
}

export default ContextPlumbing;
