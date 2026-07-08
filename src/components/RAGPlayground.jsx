import React, { useState, useEffect, useRef } from 'react';
import { Search, Database, ArrowRight, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, Code, Plus } from 'lucide-react';

function RAGPlayground({ onNext, onPrev, onSelectTopic }) {
  const ragTimersRef = useRef([]);
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Search & database states ---
  const [searchQuery, setSearchQuery] = useState('how do I get a refund for my purchase?');
  const [scores, setScores] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [topMatch, setTopMatch] = useState(null);
  const [llmOutput, setLlmOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // --- Dynamic doc ingestion states ---
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [db, setDb] = useState([
    {
      id: 1,
      title: 'Refund & Purchase Policy',
      content: 'Refund requests must be filed within 14 days of purchase. Digital assets and downloaded source codes are strictly non-refundable.',
      vector: [0.82, -0.15],
      keywords: ['refund', 'money', 'back', 'purchase', 'buy', 'return', 'refundable']
    },
    {
      id: 2,
      title: 'IT Security Guidelines',
      content: 'All employees must enable multi-factor authentication (MFA) and update their system password every 90 days. Password reuse is forbidden.',
      vector: [-0.12, 0.91],
      keywords: ['security', 'password', 'mfa', 'auth', 'login', 'hack', 'protection']
    },
    {
      id: 3,
      title: 'Stock Equity Limits',
      content: 'The rebalancing ceiling for technology sector equities is set at 25x price-to-earnings (P/E) ratio. Immediate balancing alerts are triggered if limits are breached.',
      vector: [0.35, -0.88],
      keywords: ['stock', 'threshold', 'pe', 'rebalance', 'equity', 'limits', 'financial']
    },
    {
      id: 4,
      title: 'Working Hours & Shifts',
      content: 'Standard operating hours are 9:00 AM to 6:00 PM, Monday through Friday, with a mandatory 1-hour lunch break between 12:00 PM and 2:00 PM.',
      vector: [-0.65, -0.41],
      keywords: ['hours', 'time', 'lunch', 'work', 'office', 'break', 'shift', 'friday']
    }
  ]);

  // Query vector position for plotting
  const [queryVector, setQueryVector] = useState([0.0, 0.0]);

  const handleAutoRAG = () => {
    if (isAutoPlaying || isSearching || isGenerating) return;
    setIsAutoPlaying(true);
    setSearchQuery('how do I enable security MFA?');
    setTopMatch(null);
    setLlmOutput('');
    setIsSearching(true);

    const t1 = setTimeout(() => {
      // Simulate query vector movement
      setQueryVector([-0.20, 0.75]);
      
      const newScores = {};
      const queryLower = 'how do i enable security mfa?';
      db.forEach(doc => {
        let matchCount = 0;
        doc.keywords.forEach(keyword => {
          if (queryLower.includes(keyword)) matchCount++;
        });
        const baseScore = 0.15 + Math.random() * 0.1;
        const finalScore = Math.min(0.98, baseScore + (matchCount * 0.25));
        newScores[doc.id] = finalScore;
      });
      setScores(newScores);

      const bestDoc = db[1]; // IT Security Guidelines doc
      const maxScore = newScores[bestDoc.id];
      setTopMatch({ doc: bestDoc, score: maxScore });
      setIsSearching(false);

      const t2 = setTimeout(() => {
        setIsGenerating(true);
        const t3 = setTimeout(() => {
          setLlmOutput('According to the IT Security Guidelines, you must enable multi-factor authentication (MFA) and update your system password every 90 days. Password reuse is strictly forbidden.');
          setIsGenerating(false);
          setIsAutoPlaying(false);
        }, 1200);
        ragTimersRef.current.push(t3);
      }, 1000);
      ragTimersRef.current.push(t2);

    }, 1000);
    ragTimersRef.current.push(t1);
  };

  useEffect(() => {
    ragTimersRef.current.forEach(clearTimeout);
    ragTimersRef.current = [];
    setIsAutoPlaying(false);
    setIsSearching(false);
    setIsGenerating(false);
    setTopMatch(null);
    setLlmOutput('');

    const timer = setTimeout(() => {
      handleAutoRAG();
    }, 500);

    return () => {
      clearTimeout(timer);
      ragTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setTopMatch(null);
    setLlmOutput('');

    setTimeout(() => {
      const queryLower = searchQuery.toLowerCase();
      const newScores = {};

      // Match query vectors based on keyword overlap simulation
      let qX = 0.0;
      let qY = 0.0;

      db.forEach(doc => {
        let matchCount = 0;
        doc.keywords.forEach(keyword => {
          if (queryLower.includes(keyword)) {
            matchCount++;
          }
        });

        const baseScore = 0.1 + Math.random() * 0.15;
        const finalScore = Math.min(0.98, baseScore + (matchCount * 0.25));
        newScores[doc.id] = finalScore;

        if (matchCount > 0) {
          qX += doc.vector[0] * (matchCount / 2);
          qY += doc.vector[1] * (matchCount / 2);
        }
      });

      // Normalize query vector
      const mag = Math.sqrt(qX*qX + qY*qY);
      if (mag > 0) {
        setQueryVector([qX / mag, qY / mag]);
      } else {
        setQueryVector([0.1, -0.1]);
      }

      setScores(newScores);

      let bestDoc = db[0];
      let maxScore = 0;
      db.forEach(doc => {
        if (newScores[doc.id] > maxScore) {
          maxScore = newScores[doc.id];
          bestDoc = doc;
        }
      });

      setTopMatch({ doc: bestDoc, score: maxScore });
      setIsSearching(false);
    }, 600);
  };

  const handleGenerate = () => {
    if (!topMatch) return;
    setIsGenerating(true);
    setLlmOutput('');

    setTimeout(() => {
      let answer = '';
      const docId = topMatch.doc.id;
      
      if (docId === 1) {
        answer = 'Based on the Refund & Purchase Policy, you can request a refund only if it is filed within 14 days of purchase. Please note that digital assets and downloaded source codes are strictly non-refundable.';
      } else if (docId === 2) {
        answer = 'According to the IT Security Guidelines, you must use multi-factor authentication (MFA) on all devices and reset your password every 90 days. You are not allowed to reuse old passwords.';
      } else if (docId === 3) {
        answer = 'The current limits require technology sector stocks to remain below a P/E ratio ceiling of 25x. If this P/E threshold is exceeded, a rebalancing alert is immediately triggered.';
      } else if (docId === 4) {
        answer = 'Our standard office working hours are from 9:00 AM to 6:00 PM, Monday to Friday. A 1-hour lunch break is mandatory and should be taken between 12:00 PM and 2:00 PM.';
      } else {
        // Fallback for dynamically added docs
        answer = `[Source Context: "${topMatch.doc.title}"] Found data matching query. Details: ${topMatch.doc.content}`;
      }

      setLlmOutput(answer);
      setIsGenerating(false);
    }, 1200);
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const keywordsList = newKeywords.split(',').map(k => k.trim().toLowerCase());
    
    // Generate a random vector for plotting
    const angle = Math.random() * Math.PI * 2;
    const vX = Math.cos(angle) * 0.75;
    const vY = Math.sin(angle) * 0.75;

    const newDoc = {
      id: db.length + 1,
      title: newTitle,
      content: newContent,
      vector: [parseFloat(vX.toFixed(2)), parseFloat(vY.toFixed(2))],
      keywords: keywordsList.length > 0 ? keywordsList : [newTitle.toLowerCase()]
    };

    setDb([...db, newDoc]);
    setNewTitle('');
    setNewContent('');
    setNewKeywords('');
    setShowAddForm(false);
  };

  const getCodeSnippet = () => {
    if (codeLang === 'python') {
      return `from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# Initialize local Vector DB
embeddings = OpenAIEmbeddings()
db = Chroma.from_texts(
    texts=[
        "Refund requests must be filed within 14 days...",
        "All employees must enable multi-factor authentication (MFA)..."
    ],
    embedding=embeddings
)

# Perform Semantic similarity query
query = "${searchQuery}"
docs = db.similarity_search(query, k=1)

print(f"Top Grounding Context: {docs[0].page_content}")`;
    } else if (codeLang === 'javascript') {
      return `import { VectorDB } from 'faiss-node-js';
import { getEmbedding } from './embeddings';

const db = new VectorDB();
db.addDocuments([
  { id: 1, text: "Refund requests must be filed within 14 days of purchase..." },
  { id: 2, text: "All employees must enable multi-factor authentication (MFA)..." }
]);

const queryVector = await getEmbedding("${searchQuery}");
const topDocs = db.search(queryVector, 1);

console.log('Top Match:', topDocs[0].text);`;
    } else {
      return `# Retrieve vector embeddings for the text chunks using APIs
curl https://api.openai.com/v1/embeddings \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "${searchQuery}",
    "model": "text-embedding-3-small"
  }'`;
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: RAG</h1>
            <p className="subtitle">Learn how vector databases allow models to answer questions using external files.</p>
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
                  Open-Book vs. Closed-Book Exam
                </div>
                <div className="lesson-section-body">
                  Imagine you are a university student taking a high-pressure exam.
                  <br /><br />
                  <strong>Closed-Book Exam (No RAG)</strong>: You must rely entirely on what you memorized weeks ago. If you forgot the exact date of a historical treaty, you guess, make a mistake, or hallucinate a false date.
                  <br /><br />
                  <strong>Open-Book Exam (With RAG)</strong>: Before writing your answers, a smart librarian rushes to the library shelves, pulls the exact three relevant books, and lays them open on your desk. You read the factual coordinates directly from the book and write a 100% correct, grounded answer.
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  The Retrieval, Augmentation, & Generation Pipeline
                </div>
                <div className="lesson-section-body">
                  RAG works in 3 clear sequential phases:
                  <ol>
                    <li><strong>Ingestion & Vectorization</strong>: Documents are cut into 500-character chunks. An embedding model turns these chunks into lists of coordinates (e.g. 768 dimensions) representing their semantic meanings. These are stored in a Vector DB.</li>
                    <li><strong>Retrieval (Cosine Similarity)</strong>: When a user queries the model, the query is converted to a vector coordinate, and compared against document vectors using:
                      <div style={{ margin: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.5rem', background: '#020204', borderRadius: '6px', textAlign: 'center' }}>
                        CosineSim(A, B) = (A • B) / (||A|| * ||B||)
                      </div>
                      The highest scoring chunks are retrieved.
                    </li>
                    <li><strong>Augmentation & Generation</strong>: The retrieved document text is dynamically pasted into the hidden context payload prompt, forcing the LLM to write a response grounded strictly in that facts file.</li>
                  </ol>
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Programmatic RAG Implementation
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
          <div className="grid-2">
            
            {/* Vector DB Card */}
            <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Database size={20} color="var(--primary-color)" />
                  Vector Database
                </h2>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Plus size={14} />
                  Ingest Document
                </button>
              </div>

              {/* Add document form */}
              {showAddForm && (
                <form onSubmit={handleAddDocument} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '0.7rem' }} htmlFor="doc-title-input">Title</label>
                    <input id="doc-title-input" className="text-input" style={{ padding: '0.4rem', fontSize: '0.8rem' }} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title (e.g. Terms of Service)" required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '0.7rem' }} htmlFor="doc-content-input">Content</label>
                    <textarea id="doc-content-input" className="text-input" rows="2" style={{ padding: '0.4rem', fontSize: '0.8rem' }} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Content text..." required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '0.7rem' }} htmlFor="doc-keywords-input">Keywords (comma separated)</label>
                    <input id="doc-keywords-input" className="text-input" style={{ padding: '0.4rem', fontSize: '0.8rem' }} value={newKeywords} onChange={(e) => setNewKeywords(e.target.value)} placeholder="refund, money, back" />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '0.4rem', fontSize: '0.75rem' }}>Save & Compute Embedding</button>
                </form>
              )}

              {/* 2D Vector Plot Mapping */}
              <div>
                <span className="input-label">Semantic Embeddings Map (2D Projection)</span>
                <div className="vector-2d-plot">
                  {/* Grid Lines */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', borderTop: '1px dashed var(--border-color)' }} />
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed var(--border-color)' }} />
                  
                  {/* Document Vectors */}
                  {db.map(doc => {
                    // Map coordinate vectors from range [-1, 1] to percent [10%, 90%]
                    const left = `${((doc.vector[0] + 1) / 2) * 80 + 10}%`;
                    const top = `${((doc.vector[1] + 1) / 2) * 80 + 10}%`;
                    const isSelected = topMatch && topMatch.doc.id === doc.id;
                    return (
                      <div 
                        key={doc.id}
                        className="vector-plot-dot"
                        style={{ 
                          left, 
                          top, 
                          backgroundColor: isSelected ? 'var(--success-color)' : 'var(--primary-color)',
                          boxShadow: isSelected ? '0 0 10px var(--success-color)' : 'none'
                        }}
                      >
                        <span className="vector-plot-label" style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                          {doc.title.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}

                  {/* Query Vector */}
                  {queryVector && (
                    <div 
                      className="vector-plot-dot"
                      style={{ 
                        left: `${((queryVector[0] + 1) / 2) * 80 + 10}%`, 
                        top: `${((queryVector[1] + 1) / 2) * 80 + 10}%`, 
                        backgroundColor: 'var(--warning-color)',
                        boxShadow: '0 0 12px var(--warning-color)'
                      }}
                    >
                      <span className="vector-plot-label" style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>Query</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="vector-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {db.map(doc => {
                  const score = scores[doc.id];
                  const isSelected = topMatch && topMatch.doc.id === doc.id;
                  return (
                    <div key={doc.id} className={`vector-item ${isSelected ? 'selected' : ''}`} style={{ padding: '0.6rem' }}>
                      <div className="vector-header">
                        <strong style={{ fontSize: '0.8rem' }}>{doc.title}</strong>
                        {score && (
                          <span className="vector-score" style={{ fontSize: '0.75rem', color: isSelected ? 'var(--success-color)' : 'var(--text-muted)' }}>
                            Similarity: {(score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {doc.content}
                      </p>
                      <div className="vector-embedding-text" style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
                        Embedding Coordinates: [{doc.vector.join(', ')}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* RAG Query Card */}
            <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} color="var(--primary-color)" />
                RAG Query Execution
              </h2>

              <div className="input-group">
                <label className="input-label" htmlFor="rag-query">Search Query</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="rag-query"
                    className="text-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about refund, security, tech stock, working hours..."
                    disabled={isAutoPlaying}
                  />
                  <button 
                    className="btn-primary" 
                    onClick={handleSearch}
                    disabled={isSearching || isAutoPlaying}
                    style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Search
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleAutoRAG}
                    disabled={isSearching || isGenerating || isAutoPlaying}
                    style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--success-color)' }}
                  >
                    {isAutoPlaying ? 'Playing...' : 'Auto RAG'}
                  </button>
                </div>
              </div>

              {topMatch && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Step 1: Retrieval */}
                  <div>
                    <span className="input-label">Step 1: Retrieve Best Match</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid var(--success-border)', borderRadius: '8px' }}>
                      <BookOpen size={20} color="var(--success-color)" />
                      <div style={{ fontSize: '0.85rem' }}>
                        Retrieved <strong>{topMatch.doc.title}</strong> with similarity of <strong>{(topMatch.score * 100).toFixed(0)}%</strong>.
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Augmentation */}
                  <div>
                    <span className="input-label">Step 2: Augment Prompt Context</span>
                    <div className="code-preview" style={{ maxHeight: '120px', fontSize: '0.75rem' }}>
                      {`[INSTRUCTION] Answer user question strictly based on the context.\n\n[CONTEXT]\n${topMatch.doc.content}\n\n[QUESTION]\n${searchQuery}`}
                      <div className="code-badge">PROMPT TEMPLATE</div>
                    </div>
                  </div>

                  {/* Step 3: Generation */}
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-primary" 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {isGenerating ? 'Generating...' : 'Inject Context & Generate Answer'}
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Generated Grounded Output */}
                  {llmOutput && (
                    <div>
                      <span className="input-label">Step 3: Grounded Answer</span>
                      <div className="alert alert-success" style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: 0 }}>
                        {llmOutput}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {isSearching && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="pulse" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Searching vector database...</div>
                </div>
              )}

              {!topMatch && !isSearching && (
                <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Submit a query to run the RAG search simulator.
                </div>
              )}
            </section>

          </div>
        </main>

      </div>
    </div>
  );
}

export default RAGPlayground;
