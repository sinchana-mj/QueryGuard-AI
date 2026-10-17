\
import sqlite3
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = PROJECT_ROOT / "queryguard.db"

ALLOWED_TABLE = "students"

ALLOWED_COLUMNS = {
    "id",
    "name",
    "department",
    "marks",
}

ALLOWED_FUNCTIONS = {
    "avg",
    "count",
    "max",
    "min",
    "sum",
}


def init_database():
    """Create the sample database and insert demo data once."""
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT NOT NULL,
                marks INTEGER NOT NULL
            )
        """)

        count = connection.execute(
            "SELECT COUNT(*) FROM students"
        ).fetchone()[0]

        if count == 0:
            connection.executemany(
                """
                INSERT INTO students (name, department, marks)
                VALUES (?, ?, ?)
                """,
                [
                    ("Asha", "Computer Science", 92),
                    ("Ravi", "Electronics", 76),
                    ("Meera", "Computer Science", 88),
                    ("Arjun", "Mechanical", 69),
                    ("Diya", "Electronics", 95),
                ],
            )


def _read_authorizer(action, arg1, arg2, database, trigger):
    """Allow reads from the approved table and approved SQL functions."""

    if action == sqlite3.SQLITE_SELECT:
        return sqlite3.SQLITE_OK

    if action == sqlite3.SQLITE_READ:
        table = (arg1 or "").lower()
        column = (arg2 or "").lower()

        if table != ALLOWED_TABLE:
            return sqlite3.SQLITE_DENY

        if column and column not in ALLOWED_COLUMNS:
            return sqlite3.SQLITE_DENY

        return sqlite3.SQLITE_OK

    if action == sqlite3.SQLITE_FUNCTION:
        # SQLite reports the function name in arg2 on standard
        # SQLite authorizer callbacks.
        function_name = (arg2 or arg1 or "").lower()

        if function_name in ALLOWED_FUNCTIONS:
            return sqlite3.SQLITE_OK

        return sqlite3.SQLITE_DENY

    # Deny writes, schema changes, attachment, and other operations.
    return sqlite3.SQLITE_DENY


def execute_read_only(sql: str):
    """Execute SQL against the approved schema using a read-only connection."""
    uri = DB_PATH.resolve().as_uri() + "?mode=ro"

    with sqlite3.connect(uri, uri=True) as connection:
        connection.execute("PRAGMA query_only = ON")
        connection.set_authorizer(_read_authorizer)

        cursor = connection.execute(sql)

        columns = [
            description[0]
            for description in (cursor.description or [])
        ]

        rows = cursor.fetchmany(100)

    return {
        "columns": columns,
        "rows": [list(row) for row in rows],
    }
