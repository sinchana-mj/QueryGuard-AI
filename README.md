\# QueryGuard-AI



\## Overview

QueryGuard-AI is an AI-powered SQL assistant that converts natural-language questions into SQL queries, validates requests, and retrieves database results.



\## Technologies

\- Frontend: React and Vite

\- Backend: FastAPI

\- AI: Fine-tuned Qwen model with LoRA adapter

\- Database: SQLite

\- Tool integration: Model Context Protocol (MCP)



\## Features

\- Natural-language-to-SQL generation

\- SQL validation and execution

\- Blocking destructive SQL requests

\- Input validation

\- Student record retrieval through MCP



\## Run locally



\### 1. Start the MCP server

```powershell

.\\.venv\\Scripts\\python.exe -u mcp\_server.py

```



\### 2. Start the backend in another terminal

```powershell

.\\.venv\\Scripts\\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

```



\### 3. Start the frontend in another terminal

```powershell

cd frontend

npm run dev

```



Open the local URL displayed by Vite.



\## Verification

\- SQL generation and student query execution tested

\- Destructive SQL request rejected

\- Empty question rejected

\- MCP retrieved five student records



\## Current limitations

ArmorIQ is not connected; authorization currently uses a local demo policy. Public deployment has not yet been verified.
