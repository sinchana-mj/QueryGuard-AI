
import re
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

from backend.database import init_database, execute_read_only
from backend.sql_validator import validate_sql
from backend.model_service import load_model, generate_sql


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    load_model()
    yield


app = FastAPI(
    title="QueryGuard-AI",
    description="Secure Text-to-SQL prototype with MCP integration",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class QueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=500)


UNSAFE_REQUEST_PATTERNS = [
    r"\bupdate\b",
    r"\bdelete\b",
    r"\bdrop\b",
    r"\balter\b",
    r"\binsert\b",
    r"\btruncate\b",
    r"\bcreate\b",
    r"\breplace\b",
    r"\bmodify\b",
    r"\bchange\b",
    r"\bremove\b",
    r"\berase\b",
    r"\bwipe\b",
    r"\bdestroy\b",
]


def is_unsafe_request(question: str) -> bool:
    return any(
        re.search(pattern, question, re.IGNORECASE)
        for pattern in UNSAFE_REQUEST_PATTERNS
    )


def requests_unapproved_table(question: str) -> bool:
    patterns = [
        r"\b(?:from|in|query|access)\s+(?:the\s+)?"
        r"([a-zA-Z_][a-zA-Z0-9_]*)\s+table\b",
        r"\btable\s+([a-zA-Z_][a-zA-Z0-9_]*)\b",
    ]

    for pattern in patterns:
        for match in re.finditer(
            pattern, question, re.IGNORECASE
        ):
            table_name = match.group(1).lower()

            if table_name != "students":
                return True

    return False


@app.get("/")
def home():
    return {
        "message": "QueryGuard-AI backend is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "project": "QueryGuard-AI",
        "database": "SQLite demo",
        "ai_model": "Fine-tuned Qwen LoRA adapter",
        "authorization": (
            "Local SQL validation; ArmorIQ not connected"
        ),
        "mcp_server": "http://127.0.0.1:8001/mcp",
    }


@app.get("/api/mcp/students")
async def get_mcp_students():
    """Retrieve student records through the MCP server."""

    try:
        async with streamablehttp_client(
            "http://127.0.0.1:8001/mcp"
        ) as (read_stream, write_stream, _):
            async with ClientSession(
                read_stream, write_stream
            ) as session:
                await session.initialize()

                result = await session.call_tool(
                    "list_student_records",
                    arguments={},
                )

                if result.isError:
                    raise HTTPException(
                        status_code=502,
                        detail="The MCP tool returned an error.",
                    )

                structured = result.structuredContent or {}
                students = structured.get("result", [])

                return {
                    "source": "MCP",
                    "count": len(students),
                    "students": students,
                }

    except HTTPException:
        raise

    except Exception as exc:
        print(
            f"MCP connection error: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=502,
            detail=(
                "Could not retrieve student records from MCP. "
                "Check that the MCP server is running."
            ),
        )


@app.post("/api/generate")
def generate(request: QueryRequest):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    # Reject modification or destructive requests.
    if is_unsafe_request(question):
        raise HTTPException(
            status_code=400,
            detail=(
                "Request rejected: data modification or "
                "destructive operations are not allowed."
            ),
        )

    # Reject explicitly requested unapproved tables.
    if requests_unapproved_table(question):
        raise HTTPException(
            status_code=400,
            detail=(
                "Request rejected: the requested table "
                "is not allowed."
            ),
        )

    # Generate SQL with the fine-tuned Qwen model.
    try:
        sql = generate_sql(question)

    except Exception as exc:
        print(
            f"Model generation error: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=500,
            detail="SQL generation failed.",
        )

    # Validate SQL before execution.
    valid, reason = validate_sql(sql)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail=f"Generated SQL rejected: {reason}",
        )

    # Execute only after validation.
    try:
        results = execute_read_only(sql)

    except Exception as exc:
        print(
            f"Read-only query execution error: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=400,
            detail=(
                "The generated query could not be executed."
            ),
        )

    return {
        "question": question,
        "sql": sql,
        "authorized": True,
        "authorization_mode": (
            "local demo policy; not ArmorIQ"
        ),
        "columns": results["columns"],
        "results": results["rows"],
        "message": (
            "Fine-tuned model query executed successfully."
        ),
    }
