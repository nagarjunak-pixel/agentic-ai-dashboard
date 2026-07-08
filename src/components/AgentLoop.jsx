import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, RotateCcw, Wrench, AlertTriangle, ArrowRight, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, Code, Plus, Trash2 } from 'lucide-react';

function AgentLoop({ activeConcept, onNext, onPrev, onSelectTopic }) {
  const loopIntervalRef = useRef(null);
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Agent Execution states ---
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // --- Dynamic objective & tools states ---
  const [customGoal, setCustomGoal] = useState('Check AAPL stock price, fetch its EPS, calculate the P/E ratio, check if it exceeds the portfolio threshold (25x), and send an email alert if breached.');
  
  const [tools, setTools] = useState([
    { name: 'stockPriceLookup(symbol)', desc: 'Returns current trading price of a stock ticker.' },
    { name: 'financialsLookup(symbol, metric)', desc: 'Returns financial metric (e.g. EPS, revenue).' },
    { name: 'sendEmail(to, subject, body)', desc: 'Sends an email notification to the specified address.' }
  ]);

  const [newToolName, setNewToolName] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');

  const [steps, setSteps] = useState([
    {
      id: 0,
      title: 'Agent Initialized',
      type: 'thought',
      message: 'Goal received. I need to break this down. First, I will look up the current stock price of AAPL using the stockPriceLookup tool.',
      toolCall: null,
      observation: null
    },
    {
      id: 1,
      title: 'Action: Get Stock Price',
      type: 'action',
      message: 'Calling stockPriceLookup for AAPL.',
      toolCall: 'stockPriceLookup(symbol="AAPL")',
      observation: '{"symbol": "AAPL", "price": 180.50, "currency": "USD"}'
    },
    {
      id: 2,
      title: 'Thought: Get Earnings Per Share',
      type: 'thought',
      message: 'The current stock price of AAPL is $180.50. Now I need to retrieve the Earnings Per Share (EPS) to calculate the P/E ratio. I will call financialsLookup.',
      toolCall: null,
      observation: null
    },
    {
      id: 3,
      title: 'Action: Get Financial Metrics',
      type: 'action',
      message: 'Requesting EPS metric for AAPL.',
      toolCall: 'financialsLookup(symbol="AAPL", metric="EPS")',
      observation: '{"symbol": "AAPL", "EPS": 6.15, "fiscalYear": "2025"}'
    },
    {
      id: 4,
      title: 'Thought: Calculate & Check Threshold',
      type: 'thought',
      message: 'I have the price ($180.50) and EPS ($6.15). P/E Ratio = Price / EPS = 180.50 / 6.15 = 29.35x. The portfolio rebalancing ceiling is 25x. Since 29.35x > 25x, the threshold is breached. I must send an email alert.',
      toolCall: null,
      observation: null
    },
    {
      id: 5,
      title: 'Action: Send Notification',
      type: 'action',
      message: 'Sending portfolio rebalancing breach alert email.',
      toolCall: 'sendEmail(to="user@example.com", subject="Alert: AAPL Threshold Breach", body="AAPL P/E is 29.35x, which exceeds your threshold limit of 25x.")',
      observation: '{"status": "delivered", "id": "msg_90123512"}'
    },
    {
      id: 6,
      title: 'Final Answer',
      type: 'final',
      message: 'Task accomplished. AAPL current P/E ratio is 29.35x, which exceeds the portfolio limit of 25x. A rebalancing alert has been sent to user@example.com.',
      toolCall: null,
      observation: null
    }
  ]);

  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    setCurrentStep(0);
    setIsCompleted(false);

    let stepIndex = 0;
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    loopIntervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(loopIntervalRef.current);
        setIsCompleted(true);
        setIsAutoPlaying(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsAutoPlaying(false);

    if (activeConcept === 'tool' || activeConcept === 'react') {
      const timer = setTimeout(() => {
        handleAutoPlay();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeConcept, steps]);

  const handleAddTool = (e) => {
    e.preventDefault();
    if (!newToolName.trim() || !newToolDesc.trim()) return;
    const newTool = {
      name: newToolName,
      desc: newToolDesc
    };
    setTools([...tools, newTool]);
    setNewToolName('');
    setNewToolDesc('');

    // Generate custom steps based on custom goal
    generateCustomSteps(customGoal, [...tools, newTool]);
  };

  const handleDeleteTool = (index) => {
    const updated = tools.filter((_, idx) => idx !== index);
    setTools(updated);
    generateCustomSteps(customGoal, updated);
  };

  const generateCustomSteps = (goalText, currentTools) => {
    // Generate a simple dynamic timeline based on user inputs
    const dummySteps = [
      {
        id: 0,
        title: 'Analyzing Objective',
        type: 'thought',
        message: `Plan established. Objective: "${goalText}". Mapping required tools in context.`,
        toolCall: null,
        observation: null
      }
    ];

    let stepCounter = 1;
    currentTools.forEach((tool, idx) => {
      if (idx < 2) {
        const toolNameClean = tool.name.split('(')[0];
        dummySteps.push({
          id: stepCounter++,
          title: `Action: Run ${toolNameClean}`,
          type: 'action',
          message: `Requesting tool execution: ${tool.name}.`,
          toolCall: `${toolNameClean}(arguments)`,
          observation: `{"status": "success", "result": "Retrieved data from mock ${toolNameClean} backend"}`
        });
        dummySteps.push({
          id: stepCounter++,
          title: `Reasoning Context Update`,
          type: 'thought',
          message: `Analyzed response from ${toolNameClean}. Planning next step...`,
          toolCall: null,
          observation: null
        });
      }
    });

    dummySteps.push({
      id: stepCounter,
      title: 'Final Resolution',
      type: 'final',
      message: `Completed custom objective. Processed tasks successfully.`,
      toolCall: null,
      observation: null
    });

    setSteps(dummySteps);
    handleReset();
  };

  const handleGoalChange = (e) => {
    const val = e.target.value;
    setCustomGoal(val);
    generateCustomSteps(val, tools);
  };

  const getCodeSnippet = () => {
    if (activeConcept === 'tool') {
      if (codeLang === 'python') {
        return `# Define tool schemas for Gemini / Claude API
tools = [
    {
        "name": "stockPriceLookup",
        "description": "Returns current trading price of a stock ticker.",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Ticker symbol (e.g. AAPL)"}
            },
            "required": ["symbol"]
        }
    }
]

# Send request to model with tool declarations
import google.generativeai as genai
model = genai.GenerativeModel("gemini-2.5-pro", tools=tools)
response = model.generate_content("What is the stock price of AAPL?")
print(response.candidates[0].content.parts[0].function_call)`;
      } else if (codeLang === 'javascript') {
        return `// Define tools in Google GenAI SDK
const tools = [{
  functionDeclarations: [{
    name: 'stockPriceLookup',
    description: 'Returns current trading price of a stock ticker.',
    parameters: {
      type: 'OBJECT',
      properties: {
        symbol: { type: 'STRING', description: 'Ticker symbol' }
      },
      required: ['symbol']
    }
  }]
}];`;
      } else {
        return `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "tools": [{
      "name": "stockPriceLookup",
      "description": "Returns current trading price...",
      "input_schema": { "type": "object", "properties": {"symbol": {"type": "string"}} }
    }],
    "messages": [{"role": "user", "content": "Check stock price of AAPL"}]
  }'`;
      }
    } else {
      // ReAct Loop python
      if (codeLang === 'python') {
        return `# Standard ReAct execution loop
user_query = "Check AAPL and rebalance"
chat = model.start_chat()

while True:
    response = chat.send_message(user_query)
    
    # Check if model wants to call a tool
    function_call = response.candidates[0].content.parts[0].function_call
    if not function_call:
        print(f"Final Answer: {response.text}")
        break
        
    # Execute the actual tool
    tool_output = execute_tool(function_call.name, function_call.args)
    
    # Send tool output back as user observation turn
    user_query = genai.protos.Part(
        function_response=genai.protos.FunctionResponse(
            name=function_call.name,
            response={"result": tool_output}
        )
    )`;
      } else if (codeLang === 'javascript') {
        return `// Javascript client-side loop
let messages = [{ role: 'user', content: 'rebalance portfolio' }];
let active = true;

while (active) {
  const res = await ai.models.generateContent({ contents: messages, tools });
  const call = res.functionCalls?.[0];
  
  if (!call) {
    console.log("Done!", res.text);
    active = false;
  } else {
    const out = await runTool(call.name, call.args);
    messages.push({
      role: 'user',
      content: [ { functionResponse: { name: call.name, response: { result: out } } } ]
    });
  }
}`;
      } else {
        return `# ReAct requires multi-turn API iterations where client code
# executes the tool actions and feeds observations back to the endpoint.`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: Tool Calling & ReAct</h1>
            <p className="subtitle">Learn how models recommend functions and run in autonomous loops.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${activeConcept === 'tool' ? 'active' : ''}`}
              onClick={() => onSelectTopic('tool')}
            >
              7. Tool Calling
            </button>
            <button 
              className={`lesson-tab-btn ${activeConcept === 'react' ? 'active' : ''}`}
              onClick={() => onSelectTopic('react')}
            >
              8. ReAct Loop
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
                  {activeConcept === 'tool' ? 'The CEO with No Arms' : 'The Blindfolded Dart Thrower'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'tool' ? (
                    <div>
                      Imagine you hire an incredibly smart CEO who has no arms. Because they have no arms, they cannot write emails, check databases, or run calculations directly.
                      <br /><br />
                      Instead, they write a structured memo: <i>"Please run the calculator for $180.50 / $6.15."</i> 
                      As the developer, you run the calculator, type the answer on a sheet, and hand the paperwork back. 
                      <br /><br />
                      This structured memo is **Tool Calling**. It gives the AI "hands" to request actions.
                    </div>
                  ) : (
                    <div>
                      A standard prompt-response model is like throwing a dart with your eyes closed: you throw once and hope it hits.
                      <br /><br />
                      A **ReAct Agent** is like walking up to the dartboard, looking at the board, throwing, listening to the crowd’s feedback (Observation), adjusting your posture (Thought), and throwing again until you hit the bullseye.
                      <br /><br />
                      It runs a loop of thoughts and actions, adapting to tool errors and results on the fly.
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {activeConcept === 'tool' ? 'JSON Tool Schemas' : 'The Reason-Act-Observe Loop'}
                </div>
                <div className="lesson-section-body">
                  {activeConcept === 'tool' ? (
                    <div>
                      To let models call functions, developers write a JSON description schema specifying:
                      <ol>
                        <li>Function name (e.g. <code>financialsLookup</code>).</li>
                        <li>Parameter names and types (e.g. <code>symbol</code> as <code>string</code>).</li>
                        <li>Detailed descriptions so the LLM understands when to call it.</li>
                      </ol>
                      The model does not execute code; it simply outputs a structured JSON block requesting the tool call. The developer's backend executes it.
                    </div>
                  ) : (
                    <div>
                      The ReAct loop executes three key steps iteratively:
                      <ol>
                        <li><strong>Thought</strong>: The model decides the next step based on the prompt history.</li>
                        <li><strong>Action</strong>: The model halts token generation and outputs a JSON tool call.</li>
                        <li><strong>Observation</strong>: The application backend catches the tool request, runs the API/script, and formats the response back to the LLM.</li>
                      </ol>
                      This cycle repeats autonomously until the model writes a <code>Final Answer</code> token.
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Programmatic Agent Loop
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
          {/* Goal Banner */}
          <div className="alert alert-info" style={{ margin: 0, borderLeft: '4px solid var(--primary-color)' }}>
            <Terminal size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ width: '100%' }}>
              <strong style={{ display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>Active Objective</strong>
              <input 
                className="text-input" 
                value={customGoal} 
                onChange={handleGoalChange}
                placeholder="Type custom agent goal..."
                style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: '2px 0', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="grid-2">
            
            {/* Left Column: Timeline */}
            <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="flex-row-center">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Terminal size={20} color="var(--primary-color)" />
                  ReAct Execution Timeline
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn-primary" 
                    onClick={handleAutoPlay}
                    disabled={isAutoPlaying || isCompleted}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Play size={14} />
                    {isAutoPlaying ? 'Running...' : isCompleted ? 'Goal Achieved' : 'Run Simulation'}
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={handleReset}
                    disabled={isAutoPlaying}
                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              <div className="agent-timeline" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {steps.slice(0, currentStep + 1).map((step, idx) => {
                  const isActive = idx === currentStep && !isCompleted;
                  const isDone = idx < currentStep || isCompleted;
                  
                  let typeClass = 'step-type-thought';
                  if (step.type === 'action') typeClass = 'step-type-action';
                  if (step.type === 'final') typeClass = 'step-type-final';

                  return (
                    <div 
                      key={step.id} 
                      className={`agent-step-node ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                    >
                      <div className="agent-step-dot" />
                      <div className="agent-step-card" style={{ borderLeft: isActive ? '3px solid var(--primary-color)' : '' }}>
                        <div className="agent-step-header">
                          <span className={typeClass}>{step.type}</span>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <span>{step.title}</span>
                        </div>
                        
                        <p className="agent-step-body">{step.message}</p>
                        
                        {step.toolCall && (
                          <div className="agent-step-tool-block">
                            <span style={{ color: '#ec4899' }}>⚙️ Request:</span> {step.toolCall}
                          </div>
                        )}
                        
                        {step.observation && (
                          <div className="agent-step-tool-block" style={{ borderLeftColor: 'var(--success-color)' }}>
                            <span style={{ color: 'var(--success-color)' }}>📥 Response:</span> {step.observation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Right Column: Status & Tools */}
            <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Reasoning loop flowchart */}
              <div>
                <span className="input-label">Reasoning State Machine</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      backgroundColor: !isCompleted && steps[currentStep] && steps[currentStep].type === 'thought' ? 'var(--warning-bg)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: !isCompleted && steps[currentStep] && steps[currentStep].type === 'thought' ? 'var(--warning-border)' : 'var(--border-color)',
                      color: !isCompleted && steps[currentStep] && steps[currentStep].type === 'thought' ? 'var(--warning-color)' : 'var(--text-muted)',
                      textAlign: 'center',
                      flex: 1
                    }}>
                      THINK
                    </div>
                    
                    <ArrowRight size={16} color="var(--border-color)" style={{ margin: '0 0.5rem' }} />

                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      backgroundColor: !isCompleted && steps[currentStep] && steps[currentStep].type === 'action' ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: !isCompleted && steps[currentStep] && steps[currentStep].type === 'action' ? 'rgba(37,99,235,0.2)' : 'var(--border-color)',
                      color: !isCompleted && steps[currentStep] && steps[currentStep].type === 'action' ? 'var(--primary-color)' : 'var(--text-muted)',
                      textAlign: 'center',
                      flex: 1
                    }}>
                      ACT
                    </div>

                    <ArrowRight size={16} color="var(--border-color)" style={{ margin: '0 0.5rem' }} />

                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      backgroundColor: !isCompleted && steps[currentStep] && steps[currentStep].observation ? 'var(--success-bg)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: !isCompleted && steps[currentStep] && steps[currentStep].observation ? 'var(--success-border)' : 'var(--border-color)',
                      color: !isCompleted && steps[currentStep] && steps[currentStep].observation ? 'var(--success-color)' : 'var(--text-muted)',
                      textAlign: 'center',
                      flex: 1
                    }}>
                      OBSERVE
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.25rem 0' }}>
                    <div style={{ 
                      padding: '0.5rem 1.25rem', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      backgroundColor: isCompleted ? 'var(--success-bg)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: isCompleted ? 'var(--success-border)' : 'var(--border-color)',
                      color: isCompleted ? 'var(--success-color)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}>
                      {isCompleted ? <span>🎉 Goal Achieved!</span> : <span>Evaluating Progress...</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools List with dynamic add/delete */}
              <div>
                <span className="input-label" style={{ marginBottom: '0.5rem' }}>Tools Available in Sandbox</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '0.5rem' }}>
                  {tools.map((tool, idx) => (
                    <div key={idx} style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-color)', display: 'block', marginBottom: '0.15rem' }}>
                          {tool.name}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{tool.desc}</span>
                      </div>
                      <button onClick={() => handleDeleteTool(idx)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Tool Form */}
                <form onSubmit={handleAddTool} style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <input className="text-input" style={{ padding: '0.3rem', fontSize: '0.75rem', flex: 1 }} value={newToolName} onChange={(e) => setNewToolName(e.target.value)} placeholder="toolName(args)" required />
                  <input className="text-input" style={{ padding: '0.3rem', fontSize: '0.75rem', flex: 2 }} value={newToolDesc} onChange={(e) => setNewToolDesc(e.target.value)} placeholder="Description of tool" required />
                  <button type="submit" className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>+ Tool</button>
                </form>
              </div>

              {/* Breach Visual Alert */}
              {customGoal.includes('AAPL') && currentStep >= 4 && (
                <div className="alert alert-warning slide-in" style={{ margin: 0, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Breach Alert:</strong> AAPL P/E is <strong>29.35x</strong> (limit <strong>25.00x</strong>).
                  </div>
                </div>
              )}

            </section>

          </div>
        </main>

      </div>
    </div>
  );
}

export default AgentLoop;
