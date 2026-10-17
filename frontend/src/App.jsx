
import { useState } from "react";
import "./App.css";

const examples = [
  {
    icon: "users",
    title: "Show all users",
    description: "Retrieve all registered users",
    question: "Show all students",
  },
  {
    icon: "chart",
    title: "Analyze departments",
    description: "Summarize student marks by department",
    question: "Show the average marks of students",
  },
  {
    icon: "calendar",
    title: "Top performers",
    description: "Find students with the highest marks",
    question: "Show the top 3 students by marks",
  },
  {
    icon: "search",
    title: "Find records",
    description: "Search for matching student records",
    question: "Show students in Computer Science",
  },
];

function Icon({ name, size = 20 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.sparkles}
    </svg>
  );
}

function Robot() {
  return (
    <div className="robot-scene" aria-label="QueryGuard AI robot illustration">
      <div className="robot-orbit orbit-one" />
      <div className="robot-orbit orbit-two" />
      <div className="robot-spark spark-one">✦</div>
      <div className="robot-spark spark-two">✧</div>
      <div className="robot-spark spark-three">✦</div>
      <div className="robot">
        <div className="robot-antenna"><span /></div>
        <div className="robot-head">
          <div className="robot-ear left-ear" />
          <div className="robot-ear right-ear" />
          <div className="robot-face">
            <span className="robot-eye" />
            <span className="robot-eye" />
            <span className="robot-smile" />
          </div>
          <div className="robot-cheek left-cheek" />
          <div className="robot-cheek right-cheek" />
        </div>
        <div className="robot-neck" />
        <div className="robot-body">
          <div className="robot-badge"><Icon name="shield" size={24} /></div>
          <div className="robot-body-line" />
          <div className="robot-body-line short-line" />
        </div>
        <div className="robot-arm left-arm" />
        <div className="robot-arm right-arm" />
      </div>
      <div className="robot-shadow" />
      <div className="robot-label"><span className="status-dot" /> AI is ready to help</div>
    </div>
  );
}

function App() {
  const [question, setQuestion] = useState("");
  const [sql, setSql] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([
    {
      type: "Blocked",
      message: "Destructive SQL request rejected",
      time: "Test verified",
    },
    {
      type: "Blocked",
      message: "Unapproved table access rejected",
      time: "Test verified",
    },
    {
      type: "Allowed",
      message: "Safe SELECT query passed validation",
      time: "Test verified",
    },
  ]);

  const [mcpStudents, setMcpStudents] = useState([]);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpError, setMcpError] = useState("");

  async function askQuestion(value = question) {
    const prompt = value.trim();
    if (!prompt || loading) return;

    setQuestion(prompt);
    setLoading(true);
    setError("");
    setSql("");
    setRows([]);
    setColumns([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const rejectionMessage =
          data.detail ||
          data.error ||
          "The server could not process your question.";

        setSecurityEvents((previous) => [
          {
            type: "Blocked",
            message: rejectionMessage,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...previous,
        ].slice(0, 10));

        throw new Error(rejectionMessage);
      }

      const generatedSql =
        data.sql ||
        data.generated_sql ||
        data.query ||
        data.generated_query ||
        "";

      const resultRows = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.rows)
          ? data.rows
          : Array.isArray(data.data)
            ? data.data
            : [];

      let resultColumns = Array.isArray(data.columns)
        ? data.columns
        : [];

      if (
        resultColumns.length === 0 &&
        resultRows.length > 0 &&
        resultRows[0] !== null &&
        typeof resultRows[0] === "object" &&
        !Array.isArray(resultRows[0])
      ) {
        resultColumns = Object.keys(resultRows[0]);
      }

      setSql(
        typeof generatedSql === "string"
          ? generatedSql
          : JSON.stringify(generatedSql, null, 2)
      );
      setRows(resultRows);
      setColumns(resultColumns);

      setSecurityEvents((previous) => [
        {
          type: "Allowed",
          message: "Query passed validation and executed",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...previous,
      ].slice(0, 10));

      setHistory((previous) => [
        {
          question: prompt,
          sql: generatedSql,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...previous,
      ].slice(0, 5));

      if (!generatedSql && resultRows.length === 0 && data.answer) {
        setError(data.answer);
      }
    } catch (err) {
      setError(
        err.message?.includes("Failed to fetch")
          ? "Cannot connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMcpStudents() {
    setMcpLoading(true);
    setMcpError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mcp/students"
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not load MCP student records."
        );
      }

      setMcpStudents(
        Array.isArray(data.students) ? data.students : []
      );
    } catch (err) {
      setMcpError(
        err.message?.includes("Failed to fetch")
          ? "Cannot connect to the MCP API. Check that the FastAPI backend and MCP server are running."
          : err.message || "Could not load student records."
      );
    } finally {
      setMcpLoading(false);
    }
  }

  async function copySql() {
    if (!sql) return;

    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(
        "Could not copy SQL automatically. Select the SQL text and copy it manually."
      );
    }
  }

  function chooseNav(item) {
    setActiveNav(item);

    if (item === "Database") {
      setError("");
      loadMcpStudents();
      return;
    }

    setError("");

    if (item === "Ask AI") {
      setTimeout(() => {
        document.querySelector(".question-input")?.focus();
      }, 0);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            chooseNav("Dashboard");
          }}
        >
          <span className="brand-icon"><Icon name="shield" size={25} /></span>
          <span className="brand-copy">
            <strong>QueryGuard<span> AI</span></strong>
            <small>INTELLIGENT SQL ASSISTANT</small>
          </span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {[
            ["Dashboard", "grid"],
            ["Ask AI", "message"],
            ["Database", "database"],
            ["History", "clock"],
          ].map(([item, icon]) => (
            <button
              key={item}
              className={`nav-item ${activeNav === item ? "active" : ""}`}
              onClick={() => chooseNav(item)}
            >
              <Icon name={icon} />
              <span>{item}</span>
              {item === "History" && (
                <span className="nav-count">{history.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="workspace-label">PREFERENCES</div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeNav === "Security" ? "active" : ""}`}
            onClick={() => chooseNav("Security")}
          >
            <Icon name="shield" /><span>Security Center</span>
          </button>
          <button
            className={`nav-item ${activeNav === "Settings" ? "active" : ""}`}
            onClick={() => chooseNav("Settings")}
          >
            <Icon name="settings" /><span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-icon"><Icon name="sparkles" size={19} /></div>
            <strong>Query smarter.</strong>
            <p>Explore your data with AI-powered SQL.</p>
            <button onClick={() => chooseNav("Security")}>
              Explore features <Icon name="arrow" size={14} />
            </button>
          </div>
          <div className="profile">
            <div className="avatar">QG</div>
            <div className="profile-info">
              <strong>Workspace user</strong>
              <span>Personal workspace</span>
            </div>
            <button
              className="profile-menu"
              aria-label="Profile settings"
              onClick={() => chooseNav("Settings")}
            >
              •••
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <div className="connection-status">
              <span className="status-dot" />
              <span>AI assistant</span>
            </div>
            <button
              className="icon-button"
              title="Security center"
              onClick={() => chooseNav("Security")}
            >
              <Icon name="shield" />
            </button>
            <div className="top-avatar">Q</div>
          </div>
        </header>

        <div className={`dashboard-content ${activeNav === "History" ? "history-view" : ""}`}>
          {activeNav === "Security" ? (
            <>
              <section className="section-heading">
                <div>
                  <span className="section-kicker">QUERY PROTECTION</span>
                  <h2>Security Center</h2>
                  <p>Review the local SQL validation controls protecting your demo database.</p>
                </div>
                <div className="ai-chip"><span className="status-dot" /> Local validation active</div>
              </section>

              <section className="output-grid security-overview-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <span className="panel-title-icon results-icon"><Icon name="shield" /></span>
                      <div><h3>SQL validation</h3><p>Read-only query policy</p></div>
                    </div>
                  </div>
                  <div className="security-details">
                    <p><Icon name="check" size={16} /> Only SELECT statements accepted</p>
                    <p><Icon name="check" size={16} /> Multiple statements rejected</p>
                    <p><Icon name="check" size={16} /> SQL comments rejected</p>
                    <p><Icon name="check" size={16} /> Table and column allowlists enforced</p>
                    <p><Icon name="check" size={16} /> SQLite read-only execution</p>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <span className="panel-title-icon sql-icon"><Icon name="database" /></span>
                      <div><h3>Authorization status</h3><p>Current prototype configuration</p></div>
                    </div>
                  </div>
                  <div className="security-details">
                    <p><strong>Mode:</strong> Local demo policy</p>
                    <p><strong>Database:</strong> SQLite demo</p>
                    <p><strong>Approved table:</strong> students</p>
                    <p><strong>Approved columns:</strong> id, name, department, marks</p>
                    <p><strong>ArmorIQ:</strong> Not connected</p>
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="panel-title-icon results-icon"><Icon name="clock" /></span>
                    <div><h3>Recent security events</h3><p>Recent frontend requests and initial test results</p></div>
                  </div>
                  <span className="results-count">{securityEvents.length} events</span>
                </div>
                <div className="security-event-list">
                  {securityEvents.map((event, index) => (
                    <div className="security-event" key={`${event.time}-${index}`}>
                      <span className={`security-event-status ${event.type === "Blocked" ? "blocked" : "allowed"}`}>
                        <Icon name={event.type === "Blocked" ? "shield" : "check"} size={16} />
                        {event.type}
                      </span>
                      <span className="security-event-message">{event.message}</span>
                      <span className="security-event-time">{event.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="notice notice-info">
                <Icon name="shield" size={19} />
                <div>
                  <strong>Prototype limitation</strong>
                  <p>Security events are held in frontend memory and are not a permanent server audit log. ArmorIQ integration has not been configured.</p>
                </div>
              </div>
            </>
          ) : activeNav === "Settings" ? (
            <section className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-icon results-icon"><Icon name="settings" /></span>
                  <div><h3>Settings</h3><p>QueryGuard-AI configuration</p></div>
                </div>
              </div>
              <div className="security-details">
                <p><strong>API endpoint:</strong> http://127.0.0.1:8000</p>
                <p><strong>Database:</strong> SQLite demo</p>
                <p><strong>Query policy:</strong> Read-only SELECT</p>
                <p><strong>Authorization:</strong> Local validation; ArmorIQ not connected</p>
              </div>
            </section>
          ) : activeNav === "History" ? (
            <section className="panel history-page">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-icon results-icon"><Icon name="clock" size={18} /></span>
                  <div><h3>Query History</h3><p>Review your recent questions and generated SQL.</p></div>
                </div>
                <span className="results-count">{history.length} queries</span>
              </div>
              <div className="history-list">
                {history.length === 0 ? (
                  <div className="empty-results">
                    <div className="empty-results-art"><Icon name="clock" size={28} /></div>
                    <strong>No query history yet</strong>
                    <p>Go to Ask AI and submit a question. Your recent queries will appear here.</p>
                    <button className="generate-button" onClick={() => chooseNav("Ask AI")}>
                      Ask your first question <Icon name="arrow" size={16} />
                    </button>
                  </div>
                ) : history.map((item, index) => (
                  <article className="history-item" key={`${item.time}-${index}`}>
                    <div className="history-item-top">
                      <div className="history-question"><Icon name="message" size={17} /><strong>{item.question}</strong></div>
                      <span className="history-time"><Icon name="clock" size={14} />{item.time}</span>
                    </div>
                    <div className="history-sql-label">GENERATED SQL</div>
                    <pre className="history-sql"><code>{typeof item.sql === "string" ? item.sql || "No SQL was generated." : JSON.stringify(item.sql, null, 2)}</code></pre>
                    <button
                      className="copy-button"
                      onClick={() => {
                        setQuestion(item.question);
                        chooseNav("Ask AI");
                      }}
                    >
                      Reuse question <Icon name="arrow" size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="welcome-section" id="home">
                <div className="welcome-copy">
                  <div className="eyebrow"><span className="eyebrow-spark">✦</span> YOUR AI DATA COMPANION</div>
                  <h1>Hello!<br /><span>I'm QueryGuard AI</span> <span className="wave">✋</span></h1>
                  <p>Turn your questions into insights. Ask in plain English, and let AI handle the SQL.</p>
                  <div className="welcome-tags">
                    <span><Icon name="shield" size={15} /> Security-first</span>
                    <span><Icon name="sparkles" size={15} /> AI-powered</span>
                    <span><Icon name="database" size={15} /> Data made simple</span>
                  </div>
                </div>
                <Robot />
              </section>

              <section className="query-section">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">LET'S GET STARTED</span>
                    <h2>{activeNav === "Database" ? "Explore your database" : "What would you like to know?"}</h2>
                    <p>Describe what you need, just as you'd ask a teammate.</p>
                  </div>
                  <div className="ai-chip"><span className="status-dot" /> Ready for your question</div>
                </div>

                <div className="query-box">
                  <div className="query-box-top">
                    <div className="query-box-icon"><Icon name="sparkles" size={20} /></div>
                    <span>Ask QueryGuard AI</span>
                    <span className="natural-language-label">NATURAL LANGUAGE</span>
                  </div>
                  <textarea
                    className="question-input"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        askQuestion();
                      }
                    }}
                    placeholder="e.g. Show all students..."
                    rows={3}
                    aria-label="Describe your database question"
                  />
                  <div className="query-box-footer">
                    <span className="input-hint"><kbd>Enter</kbd> to ask <span>·</span> <kbd>Shift + Enter</kbd> for a new line</span>
                    <button className="generate-button" onClick={() => askQuestion()} disabled={loading || !question.trim()}>
                      {loading ? <span className="spinner" /> : <Icon name="sparkles" size={17} />}
                      {loading ? "Generating..." : "Generate SQL"}
                      {!loading && <Icon name="arrow" size={16} />}
                    </button>
                  </div>
                </div>

                <div className="examples-heading"><span>NEED INSPIRATION?</span><span>Try an example <span className="down-arrow">↓</span></span></div>
                <div className="example-grid">
                  {examples.map((example) => (
                    <button className="example-card" key={example.title} onClick={() => askQuestion(example.question)} disabled={loading}>
                      <span className={`example-icon icon-${example.icon}`}><Icon name={example.icon} size={19} /></span>
                      <span className="example-copy"><strong>{example.title}</strong><small>{example.description}</small></span>
                      <Icon name="arrow" size={16} />
                    </button>
                  ))}
                </div>
              </section>

              {error && (
                <div className={`notice ${error.startsWith("Cannot connect") ? "notice-error" : "notice-info"}`} role="status">
                  <Icon name={error.startsWith("Cannot connect") ? "shield" : "sparkles"} size={19} />
                  <div><strong>{error.startsWith("Cannot connect") ? "Backend connection issue" : "Notice"}</strong><p>{error}</p></div>
                  <button onClick={() => setError("")} aria-label="Dismiss notice">×</button>
                </div>
              )}

              <section className="output-grid">
                <div className="panel sql-panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <span className="panel-title-icon sql-icon"><Icon name="database" size={18} /></span>
                      <div><h3>Generated SQL</h3><p>Your question, translated into SQL</p></div>
                    </div>
                    <span className={`small-status ${sql ? "success-status" : "waiting-status"}`}><span className="status-dot" />{sql ? "Generated" : "Waiting"}</span>
                  </div>
                  <div className="sql-code-area">
                    {loading ? (
                      <div className="loading-state"><span className="spinner" /><span>Generating your SQL query...</span></div>
                    ) : sql ? (
                      <pre><code>{sql}</code></pre>
                    ) : (
                      <div className="empty-code"><div className="empty-code-icon"><Icon name="sparkles" size={24} /></div><strong>Your SQL will appear here</strong><p>Enter a question above to generate a query securely.</p></div>
                    )}
                  </div>
                  <div className="panel-footer sql-footer">
                    <span><Icon name="shield" size={15} /> Review before executing</span>
                    <button className="copy-button" onClick={copySql} disabled={!sql}><Icon name={copied ? "check" : "copy"} size={15} />{copied ? "Copied!" : "Copy SQL"}</button>
                  </div>
                </div>

                <div className="panel results-panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <span className="panel-title-icon results-icon"><Icon name="chart" size={18} /></span>
                      <div><h3>Query Results</h3><p>Explore your data at a glance</p></div>
                    </div>
                    <span className="results-count">{rows.length} rows</span>
                  </div>
                  <div className="results-content">
                    {loading ? (
                      <div className="loading-state"><span className="spinner" /><span>Fetching results...</span></div>
                    ) : rows.length > 0 && columns.length > 0 ? (
                      <div className="table-scroll">
                        <table>
                          <thead><tr>{columns.map((column) => <th key={column}>{String(column).replaceAll("_", " ")}</th>)}</tr></thead>
                          <tbody>
                            {rows.slice(0, 50).map((row, index) => (
                              <tr key={index}>
                                {columns.map((column, columnIndex) => (
                                  <td key={column}>{String((Array.isArray(row) ? row[columnIndex] : row?.[column]) ?? "—")}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-results"><div className="empty-results-art"><div className="mini-chart"><span /><span /><span /><span /><span /></div></div><strong>No results to display yet</strong><p>Ask a question to see your database results here.</p></div>
                    )}
                  </div>
                  <div className="panel-footer results-footer"><span><Icon name="shield" size={15} /> Protected query execution</span><span className="live-label"><span className="status-dot" /> Live</span></div>
                </div>
              </section>

              <section className="panel mcp-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="panel-title-icon results-icon"><Icon name="database" size={18} /></span>
                    <div><h3>MCP Student Records</h3><p>Student data retrieved through the MCP server</p></div>
                  </div>
                  <button className="copy-button" onClick={loadMcpStudents} disabled={mcpLoading}>{mcpLoading ? "Loading..." : "Refresh records"}</button>
                </div>
                <div className="results-content">
                  {mcpError ? (
                    <div className="notice notice-error" role="alert"><p>{mcpError}</p></div>
                  ) : mcpLoading ? (
                    <div className="loading-state"><span className="spinner" /><span>Loading MCP student records...</span></div>
                  ) : mcpStudents.length > 0 ? (
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Marks</th></tr></thead>
                        <tbody>{mcpStudents.map((student) => <tr key={student.id}><td>{student.id}</td><td>{student.name}</td><td>{student.department}</td><td>{student.marks}</td></tr>)}</tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-results"><strong>No MCP records loaded yet</strong><p>Click Refresh records or select Database in the sidebar.</p></div>
                  )}
                </div>
                <div className="panel-footer results-footer"><span><Icon name="shield" size={15} /> Read-only MCP data</span><span className="results-count">{mcpStudents.length} students</span></div>
              </section>

              <section className="security-banner">
                <div className="security-banner-icon"><Icon name="shield" size={23} /></div>
                <div className="security-banner-copy">
                  <strong>Your data stays protected</strong>
                  <p>Queries are checked against the local read-only SQL policy before execution.</p>
                </div>
                <button onClick={() => chooseNav("Security")}>Security details <Icon name="arrow" size={15} /></button>
              </section>

              <footer className="page-footer">
                <span>© 2026 QueryGuard AI <span className="footer-dot">·</span> Built for safer data exploration</span>
                <span className="footer-right"><Icon name="shield" size={14} /> Security-first by design</span>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
