
from pathlib import Path
import sqlite3

from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="QueryGuard-AI",
    host="127.0.0.1",
    port=8001,
    streamable_http_path="/mcp",
    log_level="DEBUG",
)

DB_PATH = Path(__file__).parent / "queryguard.db"


@mcp.tool()
def list_student_records() -> list[dict]:
    """List student records using read-only database access."""
    if not DB_PATH.exists():
        raise RuntimeError("Student database not found.")

    connection = sqlite3.connect(
        f"file:{DB_PATH.as_posix()}?mode=ro",
        uri=True,
    )
    connection.row_factory = sqlite3.Row

    try:
        connection.execute("PRAGMA query_only = ON")
        rows = connection.execute(
            "SELECT id, name, department, marks FROM students LIMIT 100"
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


if __name__ == "__main__":
    print("Starting QueryGuard-AI MCP server on port 8001...", flush=True)
    mcp.run(transport="streamable-http")
