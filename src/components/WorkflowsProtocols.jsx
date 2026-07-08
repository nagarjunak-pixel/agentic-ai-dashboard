import React, { useState, useEffect, useRef } from 'react';
import { Layers, Play, ArrowRight, RefreshCw, Cpu, Server, Terminal, Code, CheckCircle, XCircle, BookOpen, Settings, PlayCircle, AlertCircle, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';

function WorkflowsProtocols({ subTab, onNext, onPrev, onSelectTopic }) {
  const workflowTimersRef = useRef([]);
  const [lessonTab, setLessonTab] = useState('analogy'); // analogy, mechanics, code
  const [codeLang, setCodeLang] = useState('python'); // python, javascript, curl

  // --- Workflows Simulator State ---
  const [workflowPattern, setWorkflowPattern] = useState('evaluator'); // orchestrator, evaluator
  const [wfStep, setWfStep] = useState(0); // 0: Idle, 1+: Step progress
  const [wfLogs, setWfLogs] = useState([]);
  const [isWfRunning, setIsWfRunning] = useState(false);

  // --- Reflexion State ---
  const [refStep, setRefStep] = useState(0);
  const [isRefRunning, setIsRefRunning] = useState(false);
  const [reflectionLogs, setReflectionLogs] = useState([]);

  // --- MCP State ---
  const [mcpLogs, setMcpLogs] = useState([]);
  const [mcpConnectionState, setMcpConnectionState] = useState('disconnected'); // disconnected, connected, toolsListed
  const [isMcpRunning, setIsMcpRunning] = useState(false);

  // ==========================================
  // --- Workflows Simulator Logic ---
  // ==========================================
  const startWorkflowSimulation = () => {
    setIsWfRunning(true);
    setWfStep(1);
    setWfLogs(['[Workflow] Initializing...']);

    if (workflowPattern === 'evaluator') {
      const t1 = setTimeout(() => {
        setWfStep(2);
        setWfLogs(prev => [...prev, '[Generator] Drafting function `factorial(n)`...', '[Generator] Code output:\n`def factorial(n): return n * factorial(n-1)`']);
      }, 1000);

      const t2 = setTimeout(() => {
        setWfStep(3);
        setWfLogs(prev => [...prev, '[Evaluator] Running unit tests on draft...', '[Evaluator] Result: FAIL! Infinite recursion detected (missing base case).']);
      }, 2200);

      const t3 = setTimeout(() => {
        setWfStep(4);
        setWfLogs(prev => [...prev, '[Optimizer] Analyzing failure. Refactoring code...', '[Optimizer] Code output:\n`def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n-1)`']);
      }, 3500);

      const t4 = setTimeout(() => {
        setWfStep(5);
        setWfLogs(prev => [...prev, '[Evaluator] Re-testing updated code...', '[Evaluator] Result: PASS! All 5 unit tests passed successfully.', '[Workflow] Completed successfully!']);
        setIsWfRunning(false);
      }, 4800);

      workflowTimersRef.current.push(t1, t2, t3, t4);
    } else {
      const t1 = setTimeout(() => {
        setWfStep(2);
        setWfLogs(prev => [...prev, '[Orchestrator] Goal: Create Website Header.', '[Orchestrator] Subtasks created: 1. Write HTML, 2. Style CSS, 3. Add JS interactions.']);
      }, 1000);

      const t2 = setTimeout(() => {
        setWfStep(3);
        setWfLogs(prev => [
          ...prev,
          '[Parallelization] Spawning 3 concurrent workers...',
          '[HTML Worker] Generated structure: `<header><h1>Title</h1></header>`',
          '[CSS Worker] Generated styling: `header { background: #0c0c0f; padding: 20px; }`',
          '[JS Worker] Generated script: `document.querySelector("h1").addEventListener("click", alert)`'
        ]);
      }, 2200);

      const t3 = setTimeout(() => {
        setWfStep(4);
        setWfLogs(prev => [...prev, '[Orchestrator] Aggregating assets...', '[Orchestrator] Code merged and validated successfully.', '[Workflow] Completed!']);
        setIsWfRunning(false);
      }, 3500);

      workflowTimersRef.current.push(t1, t2, t3);
    }
  };

  const resetWorkflowSimulation = () => {
    setWfStep(0);
    setWfLogs([]);
    setIsWfRunning(false);
  };

  // ==========================================
  // --- Reflexion Simulator Logic ---
  // ==========================================
  const runReflexionSimulation = () => {
    setIsRefRunning(true);
    setRefStep(1);
    setReflectionLogs(['[Reflexion] Initializing Attempt 1...']);

    const t1 = setTimeout(() => {
      setRefStep(2);
      setReflectionLogs(prev => [...prev, '[Actor] Outputting code for `fibonacci(n)`...', '[Actor] Draft: `def fib(n): return fib(n-1) + fib(n-2)`']);
    }, 1200);

    const t2 = setTimeout(() => {
      setRefStep(3);
      setReflectionLogs(prev => [
        ...prev, 
        '[Evaluator] Running unit tests...', 
        '[Evaluator] Test result: FAIL. RecursionError: maximum recursion depth exceeded.',
        '[Evaluator] Triggering self-reflection evaluation...'
      ]);
    }, 2500);

    const t3 = setTimeout(() => {
      setRefStep(4);
      setReflectionLogs(prev => [
        ...prev,
        '[Critique Memory] Self-Critique: "The implementation fails because there are no base cases to terminate recursion. I must add base cases for n <= 0 (return 0) and n == 1 (return 1)."'
      ]);
    }, 3800);

    const t4 = setTimeout(() => {
      setRefStep(5);
      setReflectionLogs(prev => [
        ...prev,
        '[Actor] Starting Attempt 2 with critique injected in prompt context...',
        '[Actor] Corrected Draft: `def fib(n):\\n    if n <= 0: return 0\\n    if n == 1: return 1\\n    return fib(n-1) + fib(n-2)`',
        '[Evaluator] Re-testing...',
        '[Evaluator] Result: PASS! All test cases succeeded.',
        '[Reflexion] Correct code generated successfully.'
      ]);
      setIsRefRunning(false);
    }, 5000);

    workflowTimersRef.current.push(t1, t2, t3, t4);
  };

  const resetReflexion = () => {
    setRefStep(0);
    setIsRefRunning(false);
    setReflectionLogs([]);
  };

  // ==========================================
  // --- MCP Simulator Logic ---
  // ==========================================
  const handleMCPConnect = () => {
    setMcpConnectionState('connected');
    setMcpLogs([
      '[MCP Client] Initializing JSON-RPC link...',
      'Client -> Server: {"jsonrpc":"2.0", "method":"initialize", "params":{"protocolVersion":"2024-11-05"}, "id":1}',
      'Server -> Client: {"jsonrpc":"2.0", "result":{"protocolVersion":"2024-11-05", "capabilities":{"tools":{}}}, "id":1}',
      '[MCP Client] Handshake successful! Protocol version established.'
    ]);
  };

  const handleMCPListTools = () => {
    setMcpConnectionState('toolsListed');
    setMcpLogs(prev => [
      ...prev,
      'Client -> Server: {"jsonrpc":"2.0", "method":"tools/list", "id":2}',
      'Server -> Client: {"jsonrpc":"2.0", "result":{"tools":[{"name":"read_file","description":"Read local file contents","inputSchema":{"type":"object","properties":{"path":{"type":"string"}}}},{"name":"search_web","description":"Search query on search engine"}]}, "id":2}',
      '[MCP Client] 2 tools registered in local context.'
    ]);
  };

  const handleMCPCallTool = () => {
    setMcpLogs(prev => [
      ...prev,
      'Client -> Server: {"jsonrpc":"2.0", "method":"tools/call", "params":{"name":"read_file","arguments":{"path":"/workspace/config.json"}}, "id":3}',
      '[MCP Server] Intercepted call. Reading local file path: /workspace/config.json...',
      'Server -> Client: {"jsonrpc":"2.0", "result":{"content":[{"type":"text","text":"{\\n  \\\"theme\\\": \\\"dark\\\",\\n  \\\"port\\\": 5173\\n}"}]}, "id":3}',
      '[MCP Client] Received content successfully! Theme set to dark.'
    ]);
  };

  const handleAutoMCP = () => {
    if (isMcpRunning) return;
    setIsMcpRunning(true);
    
    // Connect
    setMcpConnectionState('connected');
    setMcpLogs([
      '[MCP Client] Initializing JSON-RPC link...',
      'Client -> Server: {"jsonrpc":"2.0", "method":"initialize", "params":{"protocolVersion":"2024-11-05"}, "id":1}',
      'Server -> Client: {"jsonrpc":"2.0", "result":{"protocolVersion":"2024-11-05", "capabilities":{"tools":{}}}, "id":1}',
      '[MCP Client] Handshake successful! Protocol version established.'
    ]);

    const t1 = setTimeout(() => {
      // List Tools
      setMcpConnectionState('toolsListed');
      setMcpLogs(prev => [
        ...prev,
        'Client -> Server: {"jsonrpc":"2.0", "method":"tools/list", "id":2}',
        'Server -> Client: {"jsonrpc":"2.0", "result":{"tools":[{"name":"read_file","description":"Read local file contents","inputSchema":{"type":"object","properties":{"path":{"type":"string"}}}},{"name":"search_web","description":"Search query on search engine"}]}, "id":2}',
        '[MCP Client] 2 tools registered in local context.'
      ]);

      const t2 = setTimeout(() => {
        // Call Tool
        setMcpLogs(prev => [
          ...prev,
          'Client -> Server: {"jsonrpc":"2.0", "method":"tools/call", "params":{"name":"read_file","arguments":{"path":"/workspace/config.json"}}, "id":3}',
          '[MCP Server] Intercepted call. Reading local file path: /workspace/config.json...',
          'Server -> Client: {"jsonrpc":"2.0", "result":{"content":[{"type":"text","text":"{\\n  \\\"theme\\\": \\\"dark\\\",\\n  \\\"port\\\": 5173\\n}"}]}, "id":3}',
          '[MCP Client] Received content successfully! Theme set to dark.'
        ]);
        setIsMcpRunning(false);
      }, 1200);
      workflowTimersRef.current.push(t2);

    }, 1200);
    workflowTimersRef.current.push(t1);
  };

  const handleResetMCP = () => {
    setMcpConnectionState('disconnected');
    setMcpLogs([]);
    setIsMcpRunning(false);
  };

  useEffect(() => {
    workflowTimersRef.current.forEach(clearTimeout);
    workflowTimersRef.current = [];

    resetWorkflowSimulation();
    resetReflexion();
    handleResetMCP();

    if (subTab === 'workflows') {
      const timer = setTimeout(() => {
        startWorkflowSimulation();
      }, 500);
      return () => clearTimeout(timer);
    } else if (subTab === 'reflexion') {
      const timer = setTimeout(() => {
        runReflexionSimulation();
      }, 500);
      return () => clearTimeout(timer);
    } else if (subTab === 'mcp') {
      const timer = setTimeout(() => {
        handleAutoMCP();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [subTab]);

  const getCodeSnippet = () => {
    if (subTab === 'workflows') {
      if (codeLang === 'python') {
        return `# Simple Routing & Parallel workflows in Python
def orchestrate_workflow(goal):
    # Step 1: Subtask breakdown (Router)
    if "code" in goal:
        # Step 2: Parallel execution (Workers)
        html_code = generate_html()
        css_code = generate_css()
        return f"{html_code}\\n{css_code}"
    else:
        return default_agent(goal)`;
      } else if (codeLang === 'javascript') {
        return `// Linear Prompt Chaining in JS
const draft = await ai.models.generateContent({ contents: 'Write outline for essay' });
const essay = await ai.models.generateContent({
  contents: \`Write essay based on this outline: \${draft.text}\`
});
console.log(essay.text);`;
      } else {
        return `# Workflows are custom structures coded in client applications
# rather than single-call REST prompt parameters.`;
      }
    } else if (subTab === 'reflexion') {
      if (codeLang === 'python') {
        return `# Reflexion cycle implementation
def run_reflexion_loop(task):
    code_draft = actor_model(task)
    
    # Run tests on draft
    success, error_log = run_compiler_tests(code_draft)
    if success:
        return code_draft
        
    # Get verbal critique
    critique = evaluator_model(code_draft, error_log)
    
    # Re-attempt with critique
    corrected_code = actor_model(task, previous_critique=critique)
    return corrected_code`;
      } else if (codeLang === 'javascript') {
        return `// Verbal critique loop in JS
const attempt1 = await actor(task);
const feedback = await evaluate(attempt1);
if (feedback.isPassed) {
  return attempt1;
}
const attempt2 = await actor(task + "\\nCritique: " + feedback.critique);`;
      } else {
        return `# Reflexion loops store error state as verbal critiques in the prompt
# buffer to force models to fix logic errors on next turns.`;
      }
    } else {
      // MCP
      if (codeLang === 'python') {
        return `# Standard MCP Server implementation (mcp SDK)
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Acme Tool Server")

@mcp.tool()
def read_file(path: str) -> str:
    """Read local file contents."""
    with open(path, "r") as f:
        return f.read()

if __name__ == "__main__":
    mcp.run()`;
      } else if (codeLang === 'javascript') {
        return `// Standard MCP Server in JS
import { McpServer } from '@modelcontextprotocol/sdk';

const server = new McpServer({
  name: 'Acme Tool Server',
  version: '1.0.0'
});

server.tool('read_file', { path: z.string() }, async ({ path }) => {
  const data = await fs.readFile(path, 'utf8');
  return { content: [{ type: 'text', text: data }] };
});`;
      } else {
        return `# MCP clients communicate with local tool servers over Stdio / SSE
# using standard JSON-RPC 2.0 version handshakes.`;
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="dashboard-split-layout">
        
        {/* Left Panel: Course Material */}
        <aside className="lesson-panel">
          <div className="lesson-header">
            <h1>Curriculum: Workflows & Protocols</h1>
            <p className="subtitle">Explore advanced agent patterns (workflows, reflexion) and communication protocol standards.</p>
          </div>

          <div className="lesson-tabs">
            <button 
              className={`lesson-tab-btn ${subTab === 'workflows' ? 'active' : ''}`}
              onClick={() => onSelectTopic('workflows')}
            >
              1. Workflows
            </button>
            <button 
              className={`lesson-tab-btn ${subTab === 'reflexion' ? 'active' : ''}`}
              onClick={() => onSelectTopic('reflexion')}
            >
              2. Reflexion
            </button>
            <button 
              className={`lesson-tab-btn ${subTab === 'mcp' ? 'active' : ''}`}
              onClick={() => onSelectTopic('mcp')}
            >
              3. MCP Protocol
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
                  {subTab === 'workflows' ? 'The Assembly Line Analogy' : subTab === 'reflexion' ? 'The Basketball Practice Analogy' : 'The USB-C Wall Adapter Analogy'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'workflows' ? (
                    <div>
                      Imagine building a car.
                      <br /><br />
                      <strong>Prompt Chaining</strong>: An assembly line. Worker A molds the steel, Worker B paints, and Worker C mounts tires.
                      <br /><br />
                      <strong>Routing</strong>: A postroom separator. A clerk checks the envelope address and routes billing queries to accounts, and technical bugs to engineering.
                      <br /><br />
                      <strong>Parallelism</strong>: Cooking different parts of a meal concurrently, merged at the end.
                    </div>
                  ) : subTab === 'reflexion' ? (
                    <div>
                      Imagine a basketball player practicing three-pointers. 
                      <br /><br />
                      Instead of throwing shot after shot blindly, after they miss left, they halt. They look down and write a verbal critique: <i>"I leaned too far left. I must keep my elbow tucked in next time."</i>
                      <br /><br />
                      During their next attempt, they read this critique memo, make adjustments, and shoot a perfect basket. This is **Reflexion**.
                    </div>
                  ) : (
                    <div>
                      Imagine if every single electronic appliance—your phone, toaster, vacuum, and lamp—had a completely unique wall plug. You would have to rewire your house's electrical sockets every time you bought a new device.
                      <br /><br />
                      <strong>MCP is the USB-C standard plug</strong> for AI. Instead of writing custom connectors for every tool, every database and local file tool connects to the same universal interface socket.
                    </div>
                  )}
                </div>
              </section>
            ) : lessonTab === 'mechanics' ? (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Settings size={16} />
                  {subTab === 'workflows' ? 'Workflow Architectures' : subTab === 'reflexion' ? 'Verbal Critique Loops' : 'JSON-RPC Protocol Standards'}
                </div>
                <div className="lesson-section-body">
                  {subTab === 'workflows' ? (
                    <div>
                      Complex workflows increase reliability by reducing LLM cognitive load:
                      <ul>
                        <li><strong>Evaluator-Optimizer</strong>: Iteratively checks outputs against quality guidelines using a critic model to edit drafts.</li>
                        <li><strong>Orchestrator-Workers</strong>: Orchestrator model breaks an objective into dynamic subtasks, delegates to workers, and aggregates into a final merged output.</li>
                      </ul>
                    </div>
                  ) : subTab === 'reflexion' ? (
                    <div>
                      Reflexion implements a loop that stores critiques in short-term context memory:
                      <ol>
                        <li><strong>Actor</strong>: Outputs draft response.</li>
                        <li><strong>Evaluator</strong>: Inspects code, runs compilers/unit tests, and drafts a verbal analysis of errors if tests fail.</li>
                        <li><strong>Memory Cache</strong>: The verbal critique is stored in context. During Attempt 2, the model reads the critique, helping it bypass the same mistake.</li>
                      </ol>
                    </div>
                  ) : (
                    <div>
                      The Model Context Protocol (MCP) formalizes tool discoveries over JSON-RPC 2.0:
                      <ul>
                        <li><strong>initialize</strong>: Client establishes connection and exchanges capabilities with the server.</li>
                        <li><strong>tools/list</strong>: Client requests tool list, server returns JSON schema declarations.</li>
                        <li><strong>tools/call</strong>: Client sends tool name and arguments, server executes and returns contents.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="lesson-section">
                <div className="lesson-section-title">
                  <Code size={16} />
                  Programmatic Workflows & Protocols
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
          {subTab === 'workflows' ? (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="var(--primary-color)" />
                Workflows Simulator
              </h2>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="workflow-pattern-select">Select Workflow Pattern</label>
                  <select
                    id="workflow-pattern-select"
                    className="text-input"
                    value={workflowPattern}
                    onChange={(e) => { setWorkflowPattern(e.target.value); resetWorkflowSimulation(); }}
                  >
                    <option value="evaluator">Evaluator-Optimizer Loop</option>
                    <option value="orchestrator">Orchestrator-Workers Flow</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <button className="btn-primary" onClick={startWorkflowSimulation} disabled={isWfRunning} style={{ flex: 1 }}>
                    Simulate Flow
                  </button>
                  <button className="btn-secondary" onClick={resetWorkflowSimulation} disabled={isWfRunning}>
                    Reset
                  </button>
                </div>
              </div>

              {/* Workflow visual diagram */}
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', marginBottom: '1.5rem' }}>
                <span className="input-label">Active Workflow Nodes</span>
                
                {workflowPattern === 'evaluator' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                    <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 2 || wfStep === 4 ? 'var(--warning-bg)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 2 || wfStep === 4 ? 'var(--warning-border)' : 'var(--border-color)', color: wfStep === 2 || wfStep === 4 ? 'var(--warning-color)' : 'inherit', flex: 1, textAlign: 'center' }}>
                      Generator Draft
                    </div>
                    <ArrowRight size={16} style={{ margin: '0 0.5rem' }} />
                    <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 3 ? 'var(--error-bg)' : wfStep === 5 ? 'var(--success-bg)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 3 ? 'var(--error-border)' : wfStep === 5 ? 'var(--success-border)' : 'var(--border-color)', color: wfStep === 3 ? 'var(--error-color)' : wfStep === 5 ? 'var(--success-color)' : 'inherit', flex: 1, textAlign: 'center' }}>
                      Evaluator Test
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
                    <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 2 ? 'var(--warning-bg)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 2 ? 'var(--warning-border)' : 'var(--border-color)', textAlign: 'center' }}>
                      Orchestrator Plan
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '0.5rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 3 ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 3 ? 'var(--primary-color)' : 'var(--border-color)', fontSize: '0.75rem', flex: 1, textAlign: 'center' }}>HTML Worker</div>
                      <div style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 3 ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 3 ? 'var(--primary-color)' : 'var(--border-color)', fontSize: '0.75rem', flex: 1, textAlign: 'center' }}>CSS Worker</div>
                      <div style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 3 ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 3 ? 'var(--primary-color)' : 'var(--border-color)', fontSize: '0.75rem', flex: 1, textAlign: 'center' }}>JS Worker</div>
                    </div>
                    <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid', backgroundColor: wfStep === 4 ? 'var(--success-bg)' : 'rgba(255,255,255,0.02)', borderColor: wfStep === 4 ? 'var(--success-border)' : 'var(--border-color)', textAlign: 'center' }}>
                      Merged Output
                    </div>
                  </div>
                )}
              </div>

              <div>
                <span className="input-label">Workflow Logs</span>
                <div className="code-preview" style={{ height: '160px', overflowY: 'auto' }}>
                  {wfLogs.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: '0.3rem', fontSize: '0.8rem' }}>{log}</div>
                  ))}
                  {wfLogs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Click 'Simulate Flow' to execute...</span>}
                  {isWfRunning && <div className="pulse" style={{ color: 'var(--primary-color)' }}>Executing next pipeline step...</div>}
                </div>
              </div>
            </section>
          ) : subTab === 'reflexion' ? (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={20} color="var(--primary-color)" />
                Reflexion Loop Simulator
              </h2>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button className="btn-primary" onClick={runReflexionSimulation} disabled={isRefRunning} style={{ flex: 1 }}>
                  Run Reflexion Cycle
                </button>
                <button className="btn-secondary" onClick={resetReflexion} disabled={isRefRunning}>
                  Reset
                </button>
              </div>

              {/* Flowchart step indicator */}
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.25)', marginBottom: '1.25rem' }}>
                <span className="input-label">Reflexion Pipeline Steps</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: refStep >= 2 ? 'var(--success-color)' : 'var(--border-color)' }} />
                    <span style={{ color: refStep === 2 ? '#fff' : 'var(--text-muted)' }}>Actor generates initial code draft (base case omitted)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: refStep >= 3 ? 'var(--success-color)' : 'var(--border-color)' }} />
                    <span style={{ color: refStep === 3 ? '#fff' : 'var(--text-muted)' }}>Evaluator runs tests, outputs failure log</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: refStep >= 4 ? 'var(--success-color)' : 'var(--border-color)' }} />
                    <span style={{ color: refStep === 4 ? '#fff' : 'var(--text-muted)' }}><strong>Verbal Self-Critique</strong> generated and stored in Memory Cache</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: refStep >= 5 ? 'var(--success-color)' : 'var(--border-color)' }} />
                    <span style={{ color: refStep === 5 ? '#fff' : 'var(--text-muted)' }}>Actor reads critique, outputs corrected base case draft (PASS)</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="input-label">Self-Correction Terminal Output</span>
                <div className="code-preview" style={{ height: '150px', overflowY: 'auto' }}>
                  {reflectionLogs.map((log, idx) => {
                    const isCritique = log.includes('[Critique Memory]');
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          marginBottom: '0.4rem', 
                          fontSize: '0.75rem', 
                          color: isCritique ? 'var(--warning-color)' : 'inherit',
                          borderLeft: isCritique ? '2px solid var(--warning-color)' : 'none',
                          paddingLeft: isCritique ? '0.5rem' : 'none'
                        }}
                      >
                        {log}
                      </div>
                    );
                  })}
                  {reflectionLogs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Click 'Run Reflexion Cycle' to start...</span>}
                  {isRefRunning && <div className="pulse" style={{ color: 'var(--primary-color)', fontSize: '0.75rem' }}>Deliberating correction steps...</div>}
                </div>
              </div>
            </section>
          ) : (
            <section className="card slide-in">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={20} color="var(--primary-color)" />
                MCP Client-Server Sandbox
              </h2>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleMCPConnect} 
                  disabled={mcpConnectionState !== 'disconnected'}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  1. Connect (Handshake)
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleMCPListTools} 
                  disabled={mcpConnectionState !== 'connected'}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  2. List Tools (Schema)
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleMCPCallTool} 
                  disabled={mcpConnectionState !== 'toolsListed'}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  3. Call Tool read_file
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={handleResetMCP}
                  style={{ padding: '0.5rem' }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* JSON-RPC console output */}
              <div>
                <span className="input-label">JSON-RPC Stdio Traffic Monitor</span>
                <div className="rpc-terminal">
                  {mcpLogs.map((log, idx) => {
                    let logClass = 'rpc-line-system';
                    if (log.startsWith('Client -> Server')) logClass = 'rpc-line-client';
                    if (log.startsWith('Server -> Client')) logClass = 'rpc-line-server';
                    return (
                      <div key={idx} className={logClass}>
                        {log}
                      </div>
                    );
                  })}
                  {mcpLogs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Click 'Connect' to open the stdio pipe...</span>}
                </div>
              </div>
            </section>
          )}
        </main>

      </div>
    </div>
  );
}

export default WorkflowsProtocols;
