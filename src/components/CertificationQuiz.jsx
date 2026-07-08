import React, { useState } from 'react';
import { Award, CheckCircle, Printer, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

function CertificationQuiz({ onPrev }) {
  const [studentName, setStudentName] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [q6, setQ6] = useState('');
  const [q7, setQ7] = useState('');
  const [q8, setQ8] = useState('');
  const [q9, setQ9] = useState('');
  const [q10, setQ10] = useState('');

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setFeedbackMsg('Please enter your name to issue the certificate.');
      return;
    }

    const answers = {
      q1: q1 === 'mcp',
      q2: q2 === 'orchestrator',
      q3: q3 === 'reflection',
      q4: q4 === 'softmax',
      q5: q5 === 'stateless',
      q6: q6 === 'cosine',
      q7: q7 === 'ceo',
      q8: q8 === 'cot',
      q9: q9 === 'patches',
      q10: q10 === 'context'
    };

    const wrongQuestions = [];
    Object.entries(answers).forEach(([key, isCorrect]) => {
      if (!isCorrect) {
        wrongQuestions.push(key.toUpperCase());
      }
    });

    if (wrongQuestions.length === 0) {
      setIsPassed(true);
      setFeedbackMsg('');
    } else {
      setIsPassed(false);
      setFeedbackMsg(`Evaluation failed. Incorrect answers on: ${wrongQuestions.join(', ')}. Please review the lessons and try again!`);
    }
    setQuizSubmitted(true);
  };

  const handleRetake = () => {
    setQ1('');
    setQ2('');
    setQ3('');
    setQ4('');
    setQ5('');
    setQ6('');
    setQ7('');
    setQ8('');
    setQ9('');
    setQ10('');
    setQuizSubmitted(false);
    setIsPassed(false);
    setFeedbackMsg('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="slide-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1>The Gen Academy Certification</h1>
        <p className="subtitle">Test your understanding of the Agentic AI ladder, workflows, and context engineering to earn your certificate of completion.</p>
      </header>

      {!isPassed ? (
        <section className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary-color)" />
            Mastering Agentic AI Quiz
          </h2>

          <form onSubmit={handleSubmitQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Student Name */}
            <div className="input-group">
              <label className="input-label" htmlFor="student-name-input">Full Name (for Certificate)</label>
              <input
                id="student-name-input"
                className="text-input"
                type="text"
                placeholder="Enter your name..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>

            {/* Q1 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q1: Which open-source standard protocol connects LLM client applications to database, filesystem, or search tools?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q1" value="rest" checked={q1 === 'rest'} onChange={(e) => setQ1(e.target.value)} required />
                  Standard REST JSON Endpoints
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q1" value="mcp" checked={q1 === 'mcp'} onChange={(e) => setQ1(e.target.value)} />
                  Model Context Protocol (MCP)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q1" value="ws" checked={q1 === 'ws'} onChange={(e) => setQ1(e.target.value)} />
                  WebSockets Real-Time Sync
                </label>
              </div>
            </div>

            {/* Q2 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q2: Which workflow pattern uses a coordinator LLM to plan, delegate parallel subtasks to specialist models, and aggregate results?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q2" value="chaining" checked={q2 === 'chaining'} onChange={(e) => setQ2(e.target.value)} required />
                  Linear Prompt Chaining
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q2" value="orchestrator" checked={q2 === 'orchestrator'} onChange={(e) => setQ2(e.target.value)} />
                  Orchestrator-Workers Parallel Flow
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q2" value="evaluator" checked={q2 === 'evaluator'} onChange={(e) => setQ2(e.target.value)} />
                  Evaluator-Optimizer Loop
                </label>
              </div>
            </div>

            {/* Q3 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q3: How does a Reflexion agent learn to correct coding or logic errors in subsequent attempts?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q3" value="weights" checked={q3 === 'weights'} onChange={(e) => setQ3(e.target.value)} required />
                  It triggers fine-tuning loops to update the model weights in real-time.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q3" value="reflection" checked={q3 === 'reflection'} onChange={(e) => setQ3(e.target.value)} />
                  It writes a verbal critique of the mistake and caches it in short-term context memory.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q3" value="search" checked={q3 === 'search'} onChange={(e) => setQ3(e.target.value)} />
                  It deletes its tools and queries vector databases for similar codes.
                </label>
              </div>
            </div>

            {/* Q4 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q4: What function is mathematically used to map logit scores into next-token probabilities?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q4" value="sigmoid" checked={q4 === 'sigmoid'} onChange={(e) => setQ4(e.target.value)} required />
                  Sigmoid Function
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q4" value="softmax" checked={q4 === 'softmax'} onChange={(e) => setQ4(e.target.value)} />
                  Softmax Function
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q4" value="relu" checked={q4 === 'relu'} onChange={(e) => setQ4(e.target.value)} />
                  ReLU Activation
                </label>
              </div>
            </div>

            {/* Q5 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q5: Large language models are stateless. What does this mean?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q5" value="stateless" checked={q5 === 'stateless'} onChange={(e) => setQ5(e.target.value)} required />
                  They have no persistent memory; the entire conversation history must be sent on every turn.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q5" value="noapi" checked={q5 === 'noapi'} onChange={(e) => setQ5(e.target.value)} />
                  They cannot connect to any external third party tool or API.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q5" value="nocode" checked={q5 === 'nocode'} onChange={(e) => setQ5(e.target.value)} />
                  They are incapable of generating valid executable Python code.
                </label>
              </div>
            </div>

            {/* Q6 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q6: Which mathematical distance metric is primarily used in vector retrieval search?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q6" value="euclid" checked={q6 === 'euclid'} onChange={(e) => setQ6(e.target.value)} required />
                  Euclidean Manhattan Distance
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q6" value="cosine" checked={q6 === 'cosine'} onChange={(e) => setQ6(e.target.value)} />
                  Cosine Similarity
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q6" value="hamming" checked={q6 === 'hamming'} onChange={(e) => setQ6(e.target.value)} />
                  Hamming Hash Difference
                </label>
              </div>
            </div>

            {/* Q7 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q7: Under the tool calling paradigm, who runs the actual tool?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q7" value="llm" checked={q7 === 'llm'} onChange={(e) => setQ7(e.target.value)} required />
                  The LLM runs the tool internally inside its weight matrices.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q7" value="ceo" checked={q7 === 'ceo'} onChange={(e) => setQ7(e.target.value)} />
                  The developer's client-side application code runs the execution and returns observations.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q7" value="db" checked={q7 === 'db'} onChange={(e) => setQ7(e.target.value)} />
                  The vector database runs all custom code scripts dynamically.
                </label>
              </div>
            </div>

            {/* Q8 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q8: Chain-of-Thought (CoT) reasoning is analogous to what human behavior?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q8" value="typing" checked={q8 === 'typing'} onChange={(e) => setQ8(e.target.value)} required />
                  Fast touch-typing without pausing.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q8" value="cot" checked={q8 === 'cot'} onChange={(e) => setQ8(e.target.value)} />
                  Solving complex algebra math on a scratchpad before speaking the answer.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q8" value="sleeping" checked={q8 === 'sleeping'} onChange={(e) => setQ8(e.target.value)} />
                  Retrieving old book files from storage desks.
                </label>
              </div>
            </div>

            {/* Q9 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q9: How do Multimodal Vision Models (VLMs) read visual images?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q9" value="readtext" checked={q9 === 'readtext'} onChange={(e) => setQ9(e.target.value)} required />
                  They read OCR text tokens only.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q9" value="patches" checked={q9 === 'patches'} onChange={(e) => setQ9(e.target.value)} />
                  They split the image into grid patches and project them as embedding tokens.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q9" value="rawjpeg" checked={q9 === 'rawjpeg'} onChange={(e) => setQ9(e.target.value)} />
                  They feed raw byte-streams of JPEG files into standard text decoders.
                </label>
              </div>
            </div>

            {/* Q10 */}
            <div className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="input-label" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                Q10: What technique allows developers to cache static system instructions to save cost and execution latency?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q10" value="finetune" checked={q10 === 'finetune'} onChange={(e) => setQ10(e.target.value)} required />
                  Supervised Fine-Tuning
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q10" value="context" checked={q10 === 'context'} onChange={(e) => setQ10(e.target.value)} />
                  Prompt Caching / Context Caching
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="q10" value="vector" checked={q10 === 'vector'} onChange={(e) => setQ10(e.target.value)} />
                  Vector Database Ingestion
                </label>
              </div>
            </div>

            {feedbackMsg && (
              <div className="alert alert-warning" style={{ fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Examination
            </button>
          </form>

          <div className="lesson-nav-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onPrev}>
              ← Previous Topic
            </button>
          </div>
        </section>
      ) : (
        /* Upgraded Gilded Certificate view */
        <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          
          <div className="certificate-frame" style={{ maxWidth: '800px' }}>
            {/* Corner Gold Accents */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', borderTop: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', width: '25px', height: '25px', borderTop: '3px solid #d4af37', borderRight: '3px solid #d4af37' }} />
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderBottom: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }} />
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderBottom: '3px solid #d4af37', borderRight: '3px solid #d4af37' }} />

            {/* Seal Ribbon */}
            <div className="cert-seal">
              <div className="cert-seal-ribbon-left" />
              <div className="cert-seal-ribbon-right" />
            </div>

            <h2 style={{ fontFamily: 'Georgia, serif', color: '#d4af37', fontSize: '2.5rem', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              THE GEN ACADEMY
            </h2>
            <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Certificate of Completion
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
              This certifies that
            </p>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fafafa', margin: '0.5rem 0 2rem 0', borderBottom: '2px solid #d4af37', display: 'inline-block', paddingBottom: '0.5rem' }}>
              {studentName}
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              has successfully completed the comprehensive certification curriculum and demonstrated mastery in the core concepts, protocols, and deployment strategies of
            </p>

            <h4 style={{ fontSize: '1.6rem', color: '#fafafa', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '3rem' }}>
              Mastering Agentic AI: The Complete 2026 Course
            </h4>

            {/* Dynamic Signatures */}
            <div className="cert-signatures">
              <div className="signature-block">
                <div className="signature-line">The Faculty Board</div>
                <div className="signature-title">ISSUED BY</div>
              </div>
              <div className="signature-block">
                <div className="signature-line">
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="signature-title">DATE OF ISSUE</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={16} />
              Print Certificate
            </button>
            <button className="btn-secondary" onClick={handleRetake} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} />
              Retake Examination
            </button>
            <button className="btn-secondary" onClick={onPrev}>
              ← Previous Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificationQuiz;
