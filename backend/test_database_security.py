
import unittest
import sqlite3

from backend.database import execute_read_only


class TestDatabaseSecurity(unittest.TestCase):

    def test_allows_safe_select(self):
        result = execute_read_only(
            "SELECT name FROM students"
        )
        self.assertIn("columns", result)
        self.assertIn("rows", result)

    def test_rejects_delete(self):
        with self.assertRaises(sqlite3.DatabaseError):
            execute_read_only(
                "DELETE FROM students"
            )

    def test_rejects_drop_table(self):
        with self.assertRaises(sqlite3.DatabaseError):
            execute_read_only(
                "DROP TABLE students"
            )

    def test_rejects_unapproved_table(self):
        with self.assertRaises(sqlite3.DatabaseError):
            execute_read_only(
                "SELECT * FROM users"
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
