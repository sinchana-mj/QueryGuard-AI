# QueryGuard-AI

### Natural Language to SQL with Security Validation

QueryGuard-AI is an AI-assisted database querying application that allows users to ask questions in natural language, generate SQL queries, and view database results through a web dashboard.

## Features

- **Natural Language Querying:** Submit questions in plain English.
- **SQL Generation:** Generate SQL through the configured backend model service.
- **Read-Only Validation:** Validate queries before execution.
- **Schema Restrictions:** Restrict queries to approved database tables and columns.
- **Query Results:** Display database records in a structured table.
- **MCP Integration:** Retrieve student records through the MCP endpoint.
- **Security Center:** Display validation rules and frontend security events.
- **Query History:** View recent queries during the current frontend session.

## Technology Stack

- Frontend: React, Vite, CSS
- Backend: Python, FastAPI
- Database: SQLite
- Database Security: SQL validation and read-only execution
- Integration: Model service and MCP server

## Project Structure

```text
QueryGuard-AI/
├── backend/
│   ├── main.py
│   ├── sql_validator.py
│   └── model_service.py
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── mcp_server.py
├── queryguard.db
└── README.md
```

## Setup and Run

### 1. Start the backend

From the project root, activate the existing virtual environment by running:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

### 2. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

### 3. Test the backend

Health check:

```text
GET http://127.0.0.1:8000/api/health
```

Generate a query:

```text
POST http://127.0.0.1:8000/api/generate
```

Request body:

```json
{
  "question": "Show all students"
}
```

MCP student records:

```text
GET http://127.0.0.1:8000/api/mcp/students
```

## Security Testing

The SQL validator was tested against the following cases:

| Test | Expected result |
|---|---|
| Safe SELECT query | Allowed |
| DELETE statement | Blocked |
| DROP statement | Blocked |
| Unapproved table | Blocked |
| Unapproved column | Blocked |
| Multiple SQL statements | Blocked |

All six listed tests passed in the local test run.

## Current Limitations

- Authorization uses a local demo policy; ArmorIQ is not connected.
- Security events are stored in frontend memory, not a persistent backend audit log.
- Query history is session-only.
- MCP student retrieval is available, but its connection to the SQL generation workflow must be verified.
- Production deployment and additional security testing remain necessary.

## Future Enhancements

- Integrate production-grade authorization.
- Add persistent security audit logging.
- Expand automated security tests.
- Add authentication and role-based access control.
- Deploy the frontend and backend.
- Add monitoring and error reporting.

## Project Goal

Make database querying more accessible while applying validation controls to reduce unsafe SQL execution.
