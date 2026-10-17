
import re
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "queryguard.db"

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

FORBIDDEN_KEYWORDS = re.compile(
    r"\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|"
    r"ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|TRIGGER|"
    r"GRANT|REVOKE)\b",
    re.IGNORECASE,
)


def validate_sql(sql: str):
    if not sql or not sql.strip():
        return False, "SQL query is empty."

    query = sql.strip()

    # Reject SQL comments.
    if "--" in query or "/*" in query or "*/" in query:
        return False, "SQL comments are not allowed."

    # Allow only one SQL statement and one optional trailing semicolon.
    if ";" in query[:-1] or query.count(";") > 1:
        return False, "Only one SQL statement is allowed."

    query = query.removesuffix(";").strip()

    # Only SELECT queries are allowed.
    if not re.match(r"^SELECT\b", query, re.IGNORECASE):
        return False, "Only SELECT queries are allowed."

    # Reject forbidden SQL keywords.
    if FORBIDDEN_KEYWORDS.search(query):
        return False, "The query contains a forbidden SQL keyword."

    uri = DB_PATH.resolve().as_uri() + "?mode=ro"

    try:
        with sqlite3.connect(uri, uri=True) as connection:
            connection.execute("PRAGMA query_only = ON")

            def authorizer(action, arg1, arg2, database, trigger):
                # Permit SELECT statements.
                if action == sqlite3.SQLITE_SELECT:
                    return sqlite3.SQLITE_OK

                # Permit reads only from the approved table and columns.
                if action == sqlite3.SQLITE_READ:
                    table = (arg1 or "").lower()
                    column = (arg2 or "").lower()

                    if table != ALLOWED_TABLE:
                        return sqlite3.SQLITE_DENY

                    if column and column not in ALLOWED_COLUMNS:
                        return sqlite3.SQLITE_DENY

                    return sqlite3.SQLITE_OK

                # Permit only approved aggregate functions.
                if action == sqlite3.SQLITE_FUNCTION:
                    function_name = (arg2 or arg1 or "").lower()

                    if function_name in ALLOWED_FUNCTIONS:
                        return sqlite3.SQLITE_OK

                    return sqlite3.SQLITE_DENY

                # Deny all other SQLite operations.
                return sqlite3.SQLITE_DENY

            connection.set_authorizer(authorizer)

            # Check the query without executing its result-producing SELECT.
            connection.execute(
                "EXPLAIN QUERY PLAN " + query
            ).fetchall()

    except sqlite3.Error:
        return (
            False,
            "Query is invalid or accesses a table, column, "
            "or operation that is not permitted.",
        )

    return True, "Query passed read-only schema validation."
