import React, { useState, useEffect } from 'react';
import { Sparkles, Dices, BookOpen, Settings, HelpCircle, AlertCircle, PlayCircle, Code, Cpu } from 'lucide-react';

function Tokenizer({ activeConcept, onNext, onPrev, onSelectTopic }) {
  const typingIntervalRef = React.useRef(null);
  const streamTimersRef = React.useRef([]);

  // --- Sub tabs for lesson ---
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Tokenizer State ---
  const [inputText, setInputText] = useState('Agentic AI will reshape software engineering by 2026.');
  const [tokens, setTokens] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tokenizerType, setTokenizerType] = useState('cl100k'); // cl100k, o200k, llama3

  // --- Temperature Simulator State ---
  const [selectedPreset, setSelectedPreset] = useState('sky');
  const [temperature, setTemperature] = useState(0.7);
  const [probabilities, setProbabilities] = useState([]);
  const [rolledToken, setRolledToken] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [predictedSentence, setPredictedSentence] = useState('');

  const presets = {
    sky: {
      sentence: 'The sky is',
      logits: { blue: 4.5, clear: 2.2, cloudy: 1.5, green: -1.2, falling: -2.5 }
    },
    cook: {
      sentence: 'I want to cook dinner, so I will open the',
      logits: { fridge: 4.8, kitchen: 3.0, book: 1.0, window: -0.5, garage: -3.0 }
    },
    code: {
      sentence: 'To write secure code, developers must always',
      logits: { test: 4.6, review: 3.5, compile: 2.0, guess: -1.0, panic: -2.8 }
    }
  };

  // --- Tokenizer Logic ---
  useEffect(() => {
    if (!inputText) {
      setTokens([]);
      return;
    }
    // Simple simulated token splits for different tokenizers
    let rawTokens = [];
    if (tokenizerType === 'llama3') {
      // Llama 3 split simulation: larger tokens
      rawTokens = inputText.match(/[\w]+|[^\w\s]|\s+/g) || [];
    } else if (tokenizerType === 'o200k') {
      // O200k split simulation: standard words/spaces merged
      rawTokens = inputText.match(/[\w]+|\s+[\w]+|[^\w\s]|\s+/g) || [];
    } else {
      // CL100k: classic GPT-4/Claude token splits
      rawTokens = inputText.match(/[\w]+|[^\w\s]|\s+/g) || [];
    }
    setTokens(rawTokens);
  }, [inputText, tokenizerType]);

  // --- Probability Recalculation (Softmax with Temperature) ---
  useEffect(() => {
    const currentPreset = presets[selectedPreset];
    if (!currentPreset) return;

    const logits = currentPreset.logits;
    const keys = Object.keys(logits);
    const t = Math.max(0.01, temperature);
    const expValues = {};
    let sumExp = 0;
    
    keys.forEach(key => {
      const exp = Math.exp(logits[key] / t);
      expValues[key] = exp;
      sumExp += exp;
    });

    const calculatedProbs = keys.map(key => ({
      token: key,
      prob: sumExp > 0 ? (expValues[key] / sumExp) * 100 : 0
    }));

    calculatedProbs.sort((a, b) => b.prob - a.prob);
    setProbabilities(calculatedProbs);
    setPredictedSentence(currentPreset.sentence);
    setRolledToken('');
  }, [selectedPreset, temperature]);

  // --- Weighted Dice Roll Sampling ---
  const handleRollDice = () => {
    if (isRolling || isStreaming) return;
    setIsRolling(true);
    setRolledToken('');

    setTimeout(() => {
      const randomValue = Math.random() * 100;
      let cumulativeProb = 0;
      let selectedToken = probabilities[probabilities.length - 1].token;

      for (let i = 0; i < probabilities.length; i++) {
        cumulativeProb += probabilities[i].prob;
        if (randomValue <= cumulativeProb) {
          selectedToken = probabilities[i].token;
          break;
        }
      }

      setRolledToken(selectedToken);
      setPredictedSentence(prev => prev + ' ' + selectedToken);
      setIsRolling(false);
    }, 800);
  };

  // --- Auto-Play Type Simulation ---
  const handleAutoType = () => {
    if (isTyping) return;
    setIsTyping(true);
    setInputText('');
    const sentence = "Agentic AI will automate software engineering workflows.";
    let currentText = '';
    let charIndex = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = setInterval(() => {
      currentText += sentence[charIndex];
      setInputText(currentText);
      charIndex++;
      if (charIndex >= sentence.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 50);
  };

  // --- Auto-Play Temperature Stream ---
  const runAutoStreamStep = (count, currentProbs, textSoFar) => {
    if (count <= 0) {
      setIsStreaming(false);
      setIsRolling(false);
      return;
    }

    setIsRolling(true);
    setRolledToken('');

    const t1 = setTimeout(() => {
      const randomValue = Math.random() * 100;
      let cumulativeProb = 0;
      let selectedToken = currentProbs[currentProbs.length - 1].token;

      for (let i = 0; i < currentProbs.length; i++) {
        cumulativeProb += currentProbs[i].prob;
        if (randomValue <= cumulativeProb) {
          selectedToken = currentProbs[i].token;
          break;
        }
      }

      setRolledToken(selectedToken);
      const updatedSentence = textSoFar + ' ' + selectedToken;
      setPredictedSentence(updatedSentence);
      setIsRolling(false);

      const t2 = setTimeout(() => {
        runAutoStreamStep(count - 1, currentProbs, updatedSentence);
      }, 600);
      streamTimersRef.current.push(t2);
    }, 800);
    streamTimersRef.current.push(t1);
  };

  const handleAutoStream = () => {
    if (isRolling || isStreaming) return;
    setIsStreaming(true);
    setPredictedSentence(presets[selectedPreset].sentence);
    runAutoStreamStep(5, probabilities, presets[selectedPreset].sentence);
  };

  const handleResetPreset = () => {
    setPredictedSentence(presets[selectedPreset].sentence);
    setRolledToken('');
  };

  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    streamTimersRef.current.forEach(clearTimeout);
    streamTimersRef.current = [];
    setIsTyping(false);
    setIsStreaming(false);
    setIsRolling(false);

    if (activeConcept === 'tokenization') {
      const timer = setTimeout(() => {
        handleAutoType();
      }, 500);
      return () => clearTimeout(timer);
    } else if (activeConcept === 'temperature') {
      const timer = setTimeout(() => {
        handleAutoStream();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeConcept]);

  const inputCharCount = inputText.length;
  const tokenCount = tokens.length;
  const estimatedCost = (tokenCount * 0.00000015).toFixed(8);

  const getCodeSnippet = () => {
    if (activeConcept === 'tokenization') {
      if (codeLang === 'python') {
        return `import tiktoken

# Load the CL100k tokenizer (used by GPT-4 and Claude 3)
encoding = tiktoken.get_encoding("cl100k_base")

text = "${inputText}"
tokens = encoding.encode(text)

print(f"Token count: {len(tokens)}")
print(f"Token integer IDs: {tokens}")
print(f"Decoded chunks: {[encoding.decode_single_token_bytes(t) for t in tokens]}")`;
      } else if (codeLang === 'javascript') {
        return `// Using official @xenova/transformers library
import { AutoTokenizer } from '@xenova/transformers';

const tokenizer = await AutoTokenizer.from_pretrained('Xenova/cl100k_base');
const text = "${inputText}";

const tokens = tokenizer.encode(text);
console.log('Token IDs:', tokens);
console.log('Token count:', tokens.length);`;
      } else {
        return `# Estimate input lengths using standard CLI utility or APIs
curl https://api.anthropic.com/v1/messages \\
  -H "content-type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "${inputText}"}]
  }'
# Response headers contain input_tokens/output_tokens measurements`;
      }
    } else {
      // temperature code
      if (codeLang === 'python') {
        return `import numpy as np

logits = np.array([4.5, 2.2, 1.5, -1.2, -2.5]) # [blue, clear, cloudy, green, falling]
temperature = ${temperature}

# Scale logits by temperature
scaled_logits = logits / temperature

# Calculate Softmax distribution
exp_logits = np.exp(scaled_logits)
probabilities = exp_logits / np.sum(exp_logits)

# Roll weighted dice
tokens = ["blue", "clear", "cloudy", "green", "falling"]
selected_token = np.random.choice(tokens, p=probabilities)

print(f"Probabilities: {dict(zip(tokens, np.round(probabilities*100, 2)))}")
print(f"Sampled result: {selected_token}")`;
      } else if (codeLang === 'javascript') {
        return `const logits = [4.5, 2.2, 1.5, -1.2, -2.5];
const temp = ${temperature};

// Scale logits by temperature and compute exponents
const exps = logits.map(l => Math.exp(l / temp));
const sumExp = exps.reduce((a, b) => a + b, 0);

// Calculate Softmax probabilities
const probs = exps.map(e => e / sumExp);

console.log('Probabilities:', probs.map(p => (p * 100).toFixed(2) + '%'));`;
      } else {
        return `curl https://api.anthropic.com/v1/messages \\
  -H "content-type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 10,
    "temperature": ${temperature},
    "messages": [{"role": "user", "content": "${presets[selectedPreset].sentence}..."}]
  }'`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: The AI Ladder</h1>
            <p className="subtitle">Learn how the underlying foundations of large language models function.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${activeConcept === 'tokenization' ? 'active' : ''}`}
              onClick={() => onSelectTopic('tokenization')}
            >
              1. Tokenization
            </button>
            <button 
              className={`lesson-tab-btn ${activeConcept === 'temperature' ? 'active' : ''}`}
              onClick={() => onSelectTopic('temperature')}
            >
              2. Temperature
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
                  {activeConcept === 'tokenization' ? 'The Fridge Magnet Analogy' : 'The Chef’s Spiciness Dial'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'tokenization' ? (
                    <div>
                      Imagine you want to spell a sentence on your refrigerator using letter magnets. Buying individual letter magnets for every word is slow and expensive.
                      <br /><br />
                      Instead, the magnet company sells pre-packaged word fragments—like <strong>"anti-"</strong>, <strong>"ing"</strong>, and <strong>"gravity"</strong>. 
                      To spell <strong>"antigravity"</strong>, you simply put <strong>"anti-"</strong> and <strong>"gravity"</strong> side-by-side. 
                      <br /><br />
                      This chunking system is exactly how computers read text. It saves massive amounts of computer memory and processing time.
                    </div>
                  ) : (
                    <div>
                      Imagine a master chef who knows a recipe by heart but likes to improvise slightly. 
                      <br /><br />
                      If you set their kitchen temperature to <strong>"Low (Deterministic)"</strong>, they follow the cookbook perfectly down to the milligram, producing the exact same soup every single day.
                      <br /><br />
                      If you turn the kitchen temperature to <strong>"High (Creative/Random)"</strong>, they start rolling a dice in the kitchen, tossing in random spices and garnishes. 
                      Sometimes it's a culinary masterpiece, other times it is completely inedible!
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {activeConcept === 'tokenization' ? 'Byte-Pair Encoding (BPE)' : 'Softmax Scaling Calculations'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'tokenization' ? (
                    <div>
                      Large Language Models (LLMs) cannot process letters or raw string characters directly. Instead, they run an algorithm called **Byte-Pair Encoding (BPE)**:
                      <ul>
                        <li><strong>Token vocabulary</strong>: Modern models use a dictionary of 100k to 200k pre-calculated token IDs.</li>
                        <li><strong>Average Token length</strong>: One token is typically about **4 characters** in English, or ¾ of a word.</li>
                        <li><strong>Capitalization & spacing</strong>: The leading spaces or capital letters (e.g. <code> word</code> vs <code>word</code>) map to separate IDs.</li>
                      </ul>
                      <br />
                      <strong>BPE Vocab Grid Example:</strong>
                      <div className="tokenizer-vocab-grid">
                        <div className="vocab-card"><strong>"agent"</strong><br />ID: 4102</div>
                        <div className="vocab-card"><strong>"ic"</strong><br />ID: 289</div>
                        <div className="vocab-card"><strong>" AI"</strong><br />ID: 15309</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      To select the next token, the model outputs raw values called <strong>logits</strong>. The Softmax function translates these logits into percentages:
                      <div style={{ margin: '1rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.75rem', background: '#020204', borderRadius: '6px', textAlign: 'center' }}>
                        P(x) = exp(Logit / Temp) / Sum(exp(Logits / Temp))
                      </div>
                      <ul>
                        <li><strong>Low Temp (e.g., 0.1)</strong>: Sharpens probabilities. The token with the highest logit dominates with nearly 99%, making outputs predictable.</li>
                        <li><strong>High Temp (e.g., 1.2)</strong>: Flattens probabilities. The gap between likely and unlikely tokens shrinks, allowing the model to choose rare or creative outputs.</li>
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
            <button className="btn-secondary" onClick={onPrev} disabled={activeConcept === 'tokenization'}>
              ← Previous
            </button>
            <button className="btn-primary" onClick={onNext}>
              Next Topic →
            </button>
          </div>
        </aside>

        {/* Right Panel: Interactive Simulations */}
        <main className="simulator-panel">
          {activeConcept === 'tokenization' ? (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary-color)" />
                Real-Time Tokenizer Simulator
              </h2>
              
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="tokenizer-type-select">Tokenizer Vocabulary Model</label>
                  <select 
                    id="tokenizer-type-select" 
                    className="text-input" 
                    value={tokenizerType} 
                    onChange={(e) => setTokenizerType(e.target.value)}
                    style={{ padding: '0.5rem' }}
                  >
                    <option value="cl100k">Claude 3 / GPT-4 (CL100k Base)</option>
                    <option value="o200k">GPT-4o (O200k Base - High Density)</option>
                    <option value="llama3">LLaMA 3 (128k Vocab - Native)</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="tokenizer-input">Input Prompt</label>
                  <input
                    id="tokenizer-input"
                    type="text"
                    className="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type anything to see it tokenized..."
                    style={{ padding: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleAutoType}
                  disabled={isTyping}
                  style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <PlayCircle size={16} />
                  {isTyping ? 'Simulating typing...' : 'Run Automated Typing Demo'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="input-label">Characters</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                    {inputCharCount}
                  </span>
                </div>
                <div>
                  <span className="input-label">Tokens</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'var(--font-mono)' }}>
                    {tokenCount}
                  </span>
                </div>
                <div>
                  <span className="input-label">Estimated Cost (USD)</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ${estimatedCost}
                  </span>
                </div>
              </div>

              <span className="input-label">Token Breakdown</span>
              <div className="token-container">
                {tokens.map((token, index) => {
                  const colorClass = `token-c${(index % 6) + 1}`;
                  return (
                    <span key={index} className={`token-pill ${colorClass}`}>
                      {token}
                    </span>
                  );
                })}
                {tokens.length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No tokens to display. Type in the input field above.</span>
                )}
              </div>
              
              <div className="alert alert-info" style={{ marginTop: '1.25rem', fontSize: '0.85rem', marginBottom: 0 }}>
                <HelpCircle size={18} style={{ flexShrink: 0 }} />
                <span>Notice how spaces are pre-fixed or trailing to tokens depending on the vocabulary. Standard models count punctuation marks as isolated tokens.</span>
              </div>
            </section>
          ) : (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dices size={20} color="var(--primary-color)" />
                Next-Token Predictor & Temperature
              </h2>

              <div className="input-group">
                <label className="input-label" htmlFor="preset-select">Select Scenario</label>
                <select
                  id="preset-select"
                  className="text-input"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                >
                  <option value="sky">"The sky is..."</option>
                  <option value="cook">"I want to cook dinner, so I will open the..."</option>
                  <option value="code">"To write secure code, developers must always..."</option>
                </select>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="input-label" htmlFor="temp-slider">Temperature: {temperature}</label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {temperature <= 0.3 ? 'Deterministic / Safe' : temperature >= 1.0 ? 'Creative / Random' : 'Balanced'}
                  </span>
                </div>
                <input
                  id="temp-slider"
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
              </div>

              {/* Current Generated Text */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="input-label">Sentence Stream</span>
                <div className="code-preview" style={{ padding: '1.25rem', fontSize: '1rem' }}>
                  {predictedSentence}
                  <span className="pulse" style={{ color: 'var(--primary-color)', marginLeft: '2px', fontWeight: 'bold' }}>_</span>
                  <div className="code-badge">LLM Stream</div>
                </div>
              </div>

              {/* Probabilities and Dice Roll Grid */}
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div>
                  <span className="input-label">Predictions Probability</span>
                  <ul className="prob-list">
                    {probabilities.map(({ token, prob }) => (
                      <li key={token} className="prob-row" style={{ fontWeight: rolledToken === token ? 'bold' : 'normal' }}>
                        <span className="prob-label" style={{ color: rolledToken === token ? 'var(--success-color)' : 'inherit' }}>
                          {token}
                        </span>
                        <div className="prob-bar-container">
                          <div 
                            className="prob-bar-fill" 
                            style={{ 
                              width: `${prob}%`,
                              backgroundColor: rolledToken === token ? 'var(--success-color)' : 'var(--primary-color)'
                            }}
                          />
                        </div>
                        <span className="prob-value" style={{ color: rolledToken === token ? 'var(--success-color)' : 'var(--text-muted)' }}>
                          {prob.toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dice-container">
                  <div className={`dice ${isRolling ? 'rolling' : ''}`}>
                    {isRolling ? '🎲' : rolledToken ? '🎯' : '🎲'}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {isRolling ? 'Rolling weighted dice...' : rolledToken ? `Selected "${rolledToken}"` : 'Roll to sample next token'}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
                    <button 
                      className="btn-primary" 
                      onClick={handleRollDice}
                      disabled={isRolling || isStreaming}
                      style={{ flex: 1 }}
                    >
                      Predict Token
                    </button>
                    <button 
                      className="btn-primary" 
                      onClick={handleAutoStream}
                      disabled={isRolling || isStreaming}
                      style={{ flex: 1, backgroundColor: 'var(--success-color)' }}
                    >
                      {isStreaming ? 'Streaming...' : 'Auto Stream'}
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={handleResetPreset}
                      disabled={isRolling || isStreaming}
                      style={{ flex: '1 1 100%' }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

            </section>
          )}
        </main>

      </div>
    </div>
  );
}

export default Tokenizer;
