import { useState } from "react";
import "./App.css";

const API_URL = "https://queryguard-ai-yo19.onrender.com";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [question, setQuestion] = useState("");
  const [sql, setSql] = useState("");
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [history, setHistory] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentsError, setStudentsError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question first.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusMessage("");
    setSql("");
    setResults([]);
    setColumns([]);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            `Request failed with status ${response.status}`
        );
      }

      const generatedSql =
        data.sql || data.query || data.generated_sql || "";

      const resultRows =
        data.rows || data.results || data.data || [];

      const resultColumns =
        data.columns ||
        (Array.isArray(resultRows) && resultRows.length > 0
          ? Object.keys(resultRows[0])
          : []);

      setSql(generatedSql);
      setResults(Array.isArray(resultRows) ? resultRows : []);
      setColumns(Array.isArray(resultColumns) ? resultColumns : []);

      setHistory((previous) => [
        {
          id: Date.now(),
          question: question.trim(),
          sql: generatedSql,
          time: new Date().toLocaleString(),
        },
        ...previous,
      ]);

      setStatusMessage("Query processed successfully.");
      setActivePage("Ask AI");
    } catch (err) {
      console.error("Query generation failed:", err);

      setError(
        err.message ||
          "Cannot connect to the backend. Please check the Render service."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMcpStudents() {
    setStudentsLoading(true);
    setStudentsError("");
    setStatusMessage("");

    try {
      const response = await fetch(`${API_URL}/api/mcp/students`);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            `Request failed with status ${response.status}`
        );
      }

      const studentRows = Array.isArray(data)
        ? data
        : data.students || data.rows || data.results || [];

      if (!Array.isArray(studentRows)) {
        throw new Error("The backend returned an unexpected student format.");
      }

      setStudents(studentRows);
      setStatusMessage("Student records loaded successfully.");
    } catch (err) {
      console.error("Loading student records failed:", err);

      setStudentsError(
        err.message ||
          "Unable to load student records from the backend."
      );
    } finally {
      setStudentsLoading(false);
    }
  }

  function openPage(page) {
    setActivePage(page);
    setError("");
    setStudentsError("");
    setStatusMessage("");

    if (page === "Database") {
      loadMcpStudents();
    }
  }

  function useHistoryItem(item) {
    setQuestion(item.question);
    setSql(item.sql);
    setActivePage("Ask AI");
    setError("");
    setStatusMessage("");
  }

  function renderTable(data, suppliedColumns = []) {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="empty-state">
          <p>No records available.</p>
        </div>
      );
    }

    const tableColumns =
      suppliedColumns.length > 0
        ? suppliedColumns
        : Object.keys(data[0] || {});

    if (tableColumns.length === 0) {
      return <p>No columns were returned.</p>;
    }

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={row.id ?? row.student_id ?? index}>
                {tableColumns.map((column) => (
                  <td key={column}>
                    {row[column] === null ||
                    row[column] === undefined
                      ? "—"
                      : typeof row[column] === "object"
                        ? JSON.stringify(row[column])
                        : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">Q</div>

          <div>
            <h2>QueryGuard</h2>
            <span>AI SQL Assistant</span>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          <button
            className={activePage === "Dashboard" ? "active" : ""}
            onClick={() => openPage("Dashboard")}
          >
            <span>▦</span> Dashboard
          </button>

          <button
            className={activePage === "Ask AI" ? "active" : ""}
            onClick={() => openPage("Ask AI")}
          >
            <span>✧</span> Ask AI
          </button>

          <button
            className={activePage === "Database" ? "active" : ""}
            onClick={() => openPage("Database")}
          >
            <span>▤</span> Database
          </button>

          <button
            className={activePage === "History" ? "active" : ""}
            onClick={() => openPage("History")}
          >
            <span>◷</span> Query History
          </button>

          <button
            className={activePage === "Settings" ? "active" : ""}
            onClick={() => openPage("Settings")}
          >
            <span>⚙</span> Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="connection-indicator">
            <span className="status-dot" />
            <div>
              <strong>Backend configured</strong>
              <small>Render API endpoint</small>
            </div>
          </div>

          <p className="sidebar-footer">QueryGuard-AI · Project</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="online-label">
              <span className="status-dot" />
              API configured
            </span>
            <div className="avatar">QG</div>
          </div>
        </header>

        <div className="page-content">
          {statusMessage && (
            <div className="success-message" role="status">
              ✓ {statusMessage}
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <section className="welcome-section">
                <span className="eyebrow">YOUR INTELLIGENT SQL WORKSPACE</span>

                <h1>Welcome to QueryGuard AI</h1>

                <p>
                  Turn natural-language questions into SQL and explore your
                  database through a simple interface.
                </p>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon purple">✧</div>
                  <p>Total Queries</p>
                  <h2>{history.length}</h2>
                  <span>Queries in this session</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">▤</div>
                  <p>Rows Retrieved</p>
                  <h2>{results.length}</h2>
                  <span>From the latest query</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">✓</div>
                  <p>Backend</p>
                  <h2 className="status-text">Configured</h2>
                  <span>Deployed API address</span>
                </div>
              </section>

              <section className="panel quick-query-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Ask your database</h2>
                    <p>Describe the information you want in plain English.</p>
                  </div>
                  <span className="ai-badge">AI POWERED</span>
                </div>

                <form onSubmit={askQuestion}>
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Example: Show all students with their names and marks..."
                    rows={4}
                  />

                  <div className="form-footer">
                    <span>Enter a question to generate a query.</span>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "✧ Generate SQL"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="error-message" role="alert">
                    {error}
                  </div>
                )}
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent queries</h2>
                    <p>Your latest questions in this session.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => openPage("History")}
                  >
                    View history →
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⌕</div>
                    <h3>No queries yet</h3>
                    <p>Your generated queries will appear here.</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {history.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        className="history-item"
                        onClick={() => useHistoryItem(item)}
                      >
                        <div className="history-icon">SQL</div>
                        <div className="history-description">
                          <strong>{item.question}</strong>
                          <small>{item.time}</small>
                        </div>
                        <span className="history-arrow">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {activePage === "Ask AI" && (
            <>
              <section className="welcome-section">
                <span className="eyebrow">NATURAL LANGUAGE TO SQL</span>
                <h1>Ask AI</h1>
                <p>
                  Ask a question about your data and send it to the QueryGuard
                  backend.
                </p>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Write your question</h2>
                    <p>Use natural language to describe your data request.</p>
                  </div>
                  <span className="ai-badge">AI POWERED</span>
                </div>

                <form onSubmit={askQuestion}>
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Example: Show all students..."
                    rows={5}
                  />

                  <div className="form-footer">
                    <span>Backend: Render</span>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "✧ Generate SQL"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="error-message" role="alert">
                    {error}
                  </div>
                )}
              </section>

              {sql && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Generated SQL</h2>
                      <p>SQL returned by the backend.</p>
                    </div>
                    <span className="success-badge">RECEIVED</span>
                  </div>

                  <pre className="sql-code">
                    <code>{sql}</code>
                  </pre>

                  <button
                    className="secondary-button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(sql)
                        .then(() => setStatusMessage("SQL copied to clipboard."))
                        .catch(() =>
                          setError("Could not copy SQL. Please copy it manually.")
                        );
                    }}
                  >
                    Copy SQL
                  </button>
                </section>
              )}

              {sql && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Query results</h2>
                      <p>{results.length} row(s) returned.</p>
                    </div>
                  </div>

                  {renderTable(results, columns)}
                </section>
              )}
            </>
          )}

          {activePage === "Database" && (
            <>
              <section className="welcome-section">
                <span className="eyebrow">DATA EXPLORER</span>
                <h1>Student Database</h1>
                <p>
                  View student records returned by your backend's MCP endpoint.
                </p>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Student records</h2>
                    <p>
                      {students.length} record(s) currently loaded.
                    </p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={loadMcpStudents}
                    disabled={studentsLoading}
                  >
                    {studentsLoading ? "Loading..." : "↻ Refresh"}
                  </button>
                </div>

                {studentsError && (
                  <div className="error-message" role="alert">
                    {studentsError}
                  </div>
                )}

                {studentsLoading ? (
                  <div className="empty-state">
                    <p>Loading student records...</p>
                  </div>
                ) : (
                  renderTable(students)
                )}
              </section>
            </>
          )}

          {activePage === "History" && (
            <>
              <section className="welcome-section">
                <span className="eyebrow">QUERY ACTIVITY</span>
                <h1>Query History</h1>
                <p>
                  Review and reopen questions submitted during this session.
                </p>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>All queries</h2>
                    <p>{history.length} query/queries in this session.</p>
                  </div>

                  {history.length > 0 && (
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setHistory([]);
                        setStatusMessage("Session query history cleared.");
                      }}
                    >
                      Clear history
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">◷</div>
                    <h3>No query history</h3>
                    <p>Generate your first SQL query to see it here.</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        className="history-item"
                        onClick={() => useHistoryItem(item)}
                      >
                        <div className="history-icon">SQL</div>
                        <div className="history-description">
                          <strong>{item.question}</strong>
                          <small>{item.time}</small>
                          {item.sql && <code>{item.sql}</code>}
                        </div>
                        <span className="history-arrow">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {activePage === "Settings" && (
            <>
              <section className="welcome-section">
                <span className="eyebrow">CONFIGURATION</span>
                <h1>Settings</h1>
                <p>View the API endpoint configured for this frontend.</p>
              </section>

              <section className="panel settings-panel">
                <h2>Backend connection</h2>

                <div className="setting-row">
                  <div>
                    <strong>API endpoint</strong>
                    <p>{API_URL}</p>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(API_URL)
                        .then(() =>
                          setStatusMessage("API URL copied to clipboard.")
                        )
                        .catch(() =>
                          setError("Could not copy the API URL.")
                        );
                    }}
                  >
                    Copy URL
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>SQL generation endpoint</strong>
                    <p>{API_URL}/api/generate</p>
                  </div>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>MCP student endpoint</strong>
                    <p>{API_URL}/api/mcp/students</p>
                  </div>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>Frontend</strong>
                    <p>GitHub Pages</p>
                  </div>
                </div>

                <p className="settings-note">
                  The endpoint is configured in this file. A configured URL
                  does not guarantee that the backend is currently online.
                </p>
              </section>
            </>
          )}

          <footer className="page-footer">
            <span>QueryGuard AI</span>
            <span>Natural language. Smarter SQL.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;