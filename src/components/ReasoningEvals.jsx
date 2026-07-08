import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Play, CheckCircle, XCircle, ShieldCheck, Sparkles, ChevronDown, ChevronUp, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, Code, Plus, Trash2 } from 'lucide-react';

function ReasoningEvals({ subTab, onNext, onPrev, onSelectTopic }) {
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Reasoning State ---
  const [modelType, setModelType] = useState('system2'); // system1, system2
  const [isThinking, setIsThinking] = useState(false);
  const [cotExpanded, setCotExpanded] = useState(true);
  const [finalOutput, setFinalOutput] = useState('');
  const [thinkingLogs, setThinkingLogs] = useState([]);
  const [activePuzzle, setActivePuzzle] = useState('batball');

  // --- Evals State ---
  const [isEvalRunning, setIsEvalRunning] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0); // 0 to 100
  const [testResults, setTestResults] = useState([]);
  const [customAssertString, setCustomAssertString] = useState('interest');
  const [customAssertType, setCustomAssertType] = useState('contains'); // contains, matches_regex

  const puzzles = {
    batball: {
      question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
      sys1: 'The ball costs $0.10. Since the total is $1.10 and the bat costs $1.00 more than the ball, we subtract $1.00 from $1.10 to get $0.10. Therefore, the ball costs 10 cents.',
      sys2Cot: [
        '[CoT] Parsing variables: let ball = x, bat = y...',
        '[CoT] Setting equations: x + y = 1.10, y = x + 1.00.',
        '[CoT] Substituting y: x + (x + 1.00) = 1.10. 2x + 1.00 = 1.10.',
        '[CoT] Solving for x: 2x = 0.10 -> x = 0.05.',
        '[CoT] Double checking: If ball is $0.05 and bat is $1.05. Total = $1.10. Difference = $1.00.',
        '[CoT] Verification SUCCESS. Correct answer is $0.05. The intuitive $0.10 answer is mathematically incorrect.'
      ],
      sys2Final: 'The ball costs $0.05. If the ball is $0.05 and the bat is $1.05 (which is exactly $1.00 more expensive than the ball), the combined total equals $1.10.'
    },
    monty: {
      question: 'In the Monty Hall Problem, you pick Door 1. Host Monty Hall opens Door 3 showing a goat. Should you switch to Door 2 to maximize your chance of winning the car?',
      sys1: 'It doesn’t matter if you switch or stay. There are 2 doors left, so the probability of winning is 50/50 for either door.',
      sys2Cot: [
        '[CoT] Goal: Calculate probabilities of Switch vs Stay.',
        '[CoT] Standard setup: 3 doors. P(Door 1 has car) = 1/3. P(Door 2 or 3 has car) = 2/3.',
        '[CoT] Monty opens Door 3, revealing a goat. This is non-random; Monty knows where the car is and always shows a goat.',
        '[CoT] This collapses the probability pool: P(Door 3 has car) becomes 0.',
        '[CoT] Therefore, the entire 2/3 probability shifts exclusively to Door 2.',
        '[CoT] Conclusion: Switching to Door 2 gives a 2/3 (66.7%) chance of winning, while staying at Door 1 yields only 1/3 (33.3%).'
      ],
      sys2Final: 'You should switch to Door 2. Switching doubles your probability of winning the car from 1/3 to 2/3 because host Monty Hall’s filter concentrates the probabilities.'
    },
    river: {
      question: 'A farmer needs to cross a river with a wolf, a goat, and a cabbage. The boat can only hold the farmer and one item. If left alone, the wolf eats the goat, and the goat eats the cabbage. How can he cross all three safely?',
      sys1: 'The farmer should take the wolf first, then return for the goat, and then take the cabbage. (Wait: If wolf goes first, goat eats cabbage!). Let’s adjust... This requires manual backtracking.',
      sys2Cot: [
        '[CoT] Goal: Move Wolf (W), Goat (G), Cabbage (C) across river safely.',
        '[CoT] Constraint: G+W cannot be alone. G+C cannot be alone.',
        '[CoT] Step 1: Take Goat across. Left side: W, C. Right side: G (Safe).',
        '[CoT] Step 2: Return alone. Left side: Farmer, W, C.',
        '[CoT] Step 3: Take Wolf across. Right side: W, G.',
        '[CoT] Step 4: Take Goat back! Left side: Farmer, G, C. Right side: W.',
        '[CoT] Step 5: Take Cabbage across. Left side: G. Right side: W, C.',
        '[CoT] Step 6: Return alone. Left side: Farmer, G.',
        '[CoT] Step 7: Take Goat across. Safe! All cross successfully.'
      ],
      sys2Final: '1. Take Goat across. 2. Return alone. 3. Take Wolf across. 4. Bring Goat back. 5. Take Cabbage across. 6. Return alone. 7. Take Goat across. Safely completed.'
    }
  };

  const handleSolveQuestion = () => {
    setIsThinking(true);
    setFinalOutput('');
    setThinkingLogs([]);

    const data = puzzles[activePuzzle];

    if (modelType === 'system1') {
      setTimeout(() => {
        setFinalOutput(data.sys1);
        setIsThinking(false);
      }, 800);
    } else {
      let index = 0;
      setThinkingLogs([data.sys2Cot[0]]);
      
      const interval = setInterval(() => {
        index++;
        if (index < data.sys2Cot.length) {
          setThinkingLogs(prev => [...prev, data.sys2Cot[index]]);
        } else {
          clearInterval(interval);
          setFinalOutput(data.sys2Final);
          setIsThinking(false);
        }
      }, 700);
    }
  };

  const startEvals = () => {
    setIsEvalRunning(true);
    setEvalProgress(10);
    setTestResults([]);

    // Test 1: Value check
    setTimeout(() => {
      setEvalProgress(40);
      setTestResults(prev => [...prev, {
        id: 1,
        name: 'Exact Value Check',
        desc: 'Assert that the agent output string contains "$1157.63".',
        status: 'pass',
        detail: 'Pass. Found value "$1157.63" in response.'
      }]);
    }, 800);

    // Test 2: JSON formatting
    setTimeout(() => {
      setEvalProgress(70);
      setTestResults(prev => [...prev, {
        id: 2,
        name: 'JSON Schema Validation',
        desc: 'Assert output parsed as valid JSON with keys: "principal", "interest", "total".',
        status: 'pass',
        detail: 'Pass. Output parsed successfully as JSON schema.'
      }]);
    }, 1600);

    // Test 3: Custom User Assertion
    setTimeout(() => {
      const outputToCheck = "total amount is $1157.63 with interest accrued.";
      const isCustomPass = customAssertType === 'contains' 
        ? outputToCheck.includes(customAssertString.toLowerCase())
        : new RegExp(customAssertString).test(outputToCheck);

      setTestResults(prev => [...prev, {
        id: 3,
        name: `Custom User Assertion (${customAssertType})`,
        desc: `Check if output ${customAssertType} "${customAssertString}"`,
        status: isCustomPass ? 'pass' : 'fail',
        detail: isCustomPass 
          ? `Pass. Verified assertion criteria matches response string.`
          : `Fail. Response string does not match assertion filter.`
      }]);
      setEvalProgress(100);
      setIsEvalRunning(false);
    }, 2400);
  };

  const resetEvals = () => {
    setEvalProgress(0);
    setTestResults([]);
    setIsEvalRunning(false);
  };

  const getCodeSnippet = () => {
    if (subTab === 'reasoning') {
      if (codeLang === 'python') {
        return `# Configure thinking budgets in APIs (e.g. Gemini 2.0 / Claude 3.7)
import google.generativeai as genai

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-thinking-exp",
)

# Request reasoning model to solve mathematical puzzles
response = model.generate_content(
    "A bat and a ball cost $1.10. The bat costs $1.00 more than the ball..."
)
# Thinking logs are automatically parsed and displayed
print("Thinking steps:", response.candidates[0].content.parts[0].thought)
print("Visible Answer:", response.text)`;
      } else if (codeLang === 'javascript') {
        return `// Requesting reasoning configuration in Node.js
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI();

const res = await ai.models.generateContent({
  model: 'gemini-2.0-flash-thinking-exp',
  contents: 'Monty Hall: Switch or Stay?'
});

console.log(res.text);`;
      } else {
        return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "o1-mini",
    "reasoning_effort": "high",
    "messages": [{"role": "user", "content": "Monty Hall math"}]
  }'`;
      }
    } else {
      // Evals code
      if (codeLang === 'python') {
        return `# Writing rule-based assertion tests in python
def test_interest_calculation():
    output = agent_call("Calculate compound interest on $1000 at 5%")
    
    # Assertion 1: Check substring
    assert "$1157.63" in output, "Failing value assertion check"
    
    # Assertion 2: Check JSON schema compliance
    import json
    data = json.loads(extract_json(output))
    assert "interest" in data, "Missing interest key in schema"
    assert data["total"] == 1157.63, "Calculation mismatch"
    
    print("All test cases passed successfully.")`;
      } else if (codeLang === 'javascript') {
        return `// Automated Node assertion test suite
import assert from 'assert';

try {
  const output = await agentCall();
  
  assert(output.includes('$1157.63'), 'Failed to output correct sum');
  assert(JSON.parse(output).total === 1157.63, 'Total calculation failed');
  console.log('PASS');
} catch (err) {
  console.error('FAIL:', err.message);
}`;
      } else {
        return `# Evals are typically run in CI/CD pipelines using promptfoo CLI
promptfoo eval --config promptfooconfig.yaml`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: Reasoning & Evals</h1>
            <p className="subtitle">Learn how models solve logic problems and how developers write automated checks.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${subTab === 'reasoning' ? 'active' : ''}`}
              onClick={() => { onSelectTopic('reasoning'); }}
            >
              1. Reasoning
            </button>
            <button 
              className={`lesson-tab-btn ${subTab === 'evals' ? 'active' : ''}`}
              onClick={() => { onSelectTopic('evals'); }}
            >
              2. Evaluations
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
                  {subTab === 'reasoning' ? 'System 1 vs. System 2 Thinking' : 'Automated Calipers in a Car Factory'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'reasoning' ? (
                    <div>
                      Imagine someone asks you: <i>"A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"</i>
                      <br /><br />
                      <strong>System 1 (Intuitive/Fast)</strong>: Your brain instantly blurts out: <i>"10 cents!"</i>. This feels right but is mathematically wrong.
                      <br /><br />
                      <strong>System 2 (Deliberate/Slow)</strong>: You stop, grab a scratchpad, declare algebraic equations ($x + y = 1.10$, $y = x + 1.00$), solve step-by-step ($2x = 0.10 \implies x = 0.05$), and double check.
                      <br /><br />
                      **Chain of Thought (CoT)** is the model's scratchpad paper.
                    </div>
                  ) : (
                    <div>
                      Imagine you manage a high-end sports car factory. 
                      <br /><br />
                      Instead of just looking at the finished car and saying: <i>"Yep, looks like a car to me!"</i>, the quality inspector hooks up electronic diagnostic wires, checks door alignments to the millimeter using **automated calipers**, and runs the engine through simulated high-speed runs.
                      <br /><br />
                      This automated checklist standard is **Evaluations**. It ensures model updates don't break product requirements.
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {subTab === 'reasoning' ? 'Test-Time Compute Scaling' : 'Assertion & Judge Evaluation'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'reasoning' ? (
                    <div>
                      Reasoning models scale intelligence through **Test-Time Compute**:
                      <ul>
                        <li><strong>Internal Deliberation</strong>: The model runs a hidden loop to draft plans, compute equations, check its own output for errors, and backtrack if it finds a contradiction.</li>
                        <li><strong>Reinforcement Learning (RL)</strong>: Models are not trained just on static human texts; they are rewarded for mathematical correctness, teaching them to self-correct.</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      To guarantee agent safety, developers deploy different evaluation styles:
                      <ol>
                        <li><strong>Rule-Based Assertions</strong>: Substring matches, regex assertions, and strict JSON schema parsers (checks structural bounds).</li>
                        <li><strong>LLM-as-a-Judge</strong>: Querying a larger teacher model to grade tone, compliance, safety, or explanation clarity on a 1-5 scale based on rubrics.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Programmatic Reasoning & Evals
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
          {subTab === 'reasoning' ? (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BrainCircuit size={20} color="var(--primary-color)" />
                Reasoning Sandbox (System 1 vs System 2)
              </h2>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="puzzle-select">Select Logic Puzzle</label>
                  <select
                    id="puzzle-select"
                    className="text-input"
                    value={activePuzzle}
                    onChange={(e) => { setActivePuzzle(e.target.value); setFinalOutput(''); setThinkingLogs([]); }}
                  >
                    <option value="batball">Bat & Ball Algebra Puzzle</option>
                    <option value="monty">Monty Hall Probability Shift</option>
                    <option value="river">Wolf, Goat & Cabbage Crossing</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="model-select">Reasoning Model Style</label>
                  <select
                    id="model-select"
                    className="text-input"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                  >
                    <option value="system1">System 1: Intuitive / Token-by-Token</option>
                    <option value="system2">System 2: Chain of Thought / Deliberate</option>
                  </select>
                </div>
              </div>

              {/* Display Question */}
              <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <strong>Puzzle Question:</strong><br />
                {puzzles[activePuzzle].question}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button className="btn-primary" onClick={handleSolveQuestion} disabled={isThinking} style={{ flex: 1 }}>
                  Solve Puzzle
                </button>
              </div>

              {/* System 2 thinking block logs */}
              {modelType === 'system2' && thinkingLogs.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="input-label" style={{ margin: 0 }}>Chain of Thought Scratchpad (&lt;thinking&gt;)</span>
                    <button 
                      onClick={() => setCotExpanded(!cotExpanded)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      {cotExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {cotExpanded ? 'Hide Thoughts' : 'Expand Thoughts'}
                    </button>
                  </div>
                  {cotExpanded && (
                    <div className="code-preview" style={{ maxHeight: '160px', overflowY: 'auto', fontSize: '0.75rem', color: 'var(--warning-color)', borderColor: 'var(--warning-border)' }}>
                      {thinkingLogs.map((log, idx) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>{log}</div>
                      ))}
                      {isThinking && <div className="pulse">Deliberating equations...</div>}
                    </div>
                  )}
                </div>
              )}

              {/* Output Panel */}
              <div>
                <span className="input-label">Grounded Visible Response</span>
                <div className="code-preview" style={{ minHeight: '80px', borderColor: finalOutput ? 'var(--success-border)' : 'var(--border-color)' }}>
                  {finalOutput}
                  {isThinking && <span className="pulse" style={{ color: 'var(--primary-color)' }}>_</span>}
                  {!finalOutput && !isThinking && <span style={{ color: 'var(--text-muted)' }}>Click 'Solve Puzzle' to get response...</span>}
                  {finalOutput && <div className="code-badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-color)' }}>Final Output</div>}
                </div>
              </div>
            </section>
          ) : (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--primary-color)" />
                CI/CD Automated Evaluation Suite
              </h2>

              {/* Custom assertion builder */}
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="assert-type-select">Assertion Method</label>
                  <select
                    id="assert-type-select"
                    className="text-input"
                    value={customAssertType}
                    onChange={(e) => setCustomAssertType(e.target.value)}
                    style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <option value="contains">Output contains string</option>
                    <option value="matches_regex">Output matches regex</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="assert-value-input">Assertion Expected Output</label>
                  <input
                    id="assert-value-input"
                    className="text-input"
                    value={customAssertString}
                    onChange={(e) => setCustomAssertString(e.target.value)}
                    placeholder="e.g. interest or total"
                    style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button className="btn-primary" onClick={startEvals} disabled={isEvalRunning} style={{ flex: 1 }}>
                  Run Eval Suite
                </button>
                <button className="btn-secondary" onClick={resetEvals} disabled={isEvalRunning}>
                  Reset
                </button>
              </div>

              {/* Progress bar */}
              {isEvalRunning && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>Running automated tests...</span>
                    <span>{evalProgress}%</span>
                  </div>
                  <div className="prob-bar-container" style={{ height: '8px' }}>
                    <div className="prob-bar-fill" style={{ width: `${evalProgress}%`, backgroundColor: 'var(--primary-color)' }} />
                  </div>
                </div>
              )}

              {/* Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span className="input-label">Test Case Assertions</span>
                
                {testResults.map(result => (
                  <div key={result.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: result.status === 'pass' ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)', borderColor: result.status === 'pass' ? 'var(--success-border)' : 'var(--error-border)' }}>
                    {result.status === 'pass' ? (
                      <CheckCircle size={20} color="var(--success-color)" style={{ flexShrink: 0 }} />
                    ) : (
                      <XCircle size={20} color="var(--error-color)" style={{ flexShrink: 0 }} />
                    )}
                    <div>
                      <strong style={{ fontSize: '0.8rem', display: 'block' }}>{result.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{result.desc}</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: result.status === 'pass' ? 'var(--success-color)' : 'var(--error-color)', marginTop: '0.25rem' }}>
                        {result.detail}
                      </div>
                    </div>
                  </div>
                ))}

                {testResults.length === 0 && !isEvalRunning && (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Click 'Run Eval Suite' to initiate tests...
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

      </div>
    </div>
  );
}

export default ReasoningEvals;
