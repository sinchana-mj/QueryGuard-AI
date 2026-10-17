
import unittest

from backend.sql_validator import validate_sql


class TestSQLSecurity(unittest.TestCase):

    def test_allows_simple_select(self):
        valid, _ = validate_sql("SELECT * FROM students")
        self.assertTrue(valid)

    def test_allows_avg_function(self):
        valid, _ = validate_sql(
            "SELECT AVG(marks) FROM students"
        )
        self.assertTrue(valid)

    def test_allows_count_function(self):
        valid, _ = validate_sql(
            "SELECT COUNT(*) FROM students"
        )
        self.assertTrue(valid)

    def test_allows_max_function(self):
        valid, _ = validate_sql(
            "SELECT MAX(marks) FROM students"
        )
        self.assertTrue(valid)

    def test_allows_min_function(self):
        valid, _ = validate_sql(
            "SELECT MIN(marks) FROM students"
        )
        self.assertTrue(valid)

    def test_allows_sum_function(self):
        valid, _ = validate_sql(
            "SELECT SUM(marks) FROM students"
        )
        self.assertTrue(valid)

    def test_rejects_unapproved_function(self):
        valid, _ = validate_sql(
            "SELECT ABS(marks) FROM students"
        )
        self.assertFalse(valid)

    def test_rejects_delete(self):
        valid, _ = validate_sql("DELETE FROM students")
        self.assertFalse(valid)

    def test_rejects_drop_table(self):
        valid, _ = validate_sql("DROP TABLE students")
        self.assertFalse(valid)

    def test_rejects_multiple_statements(self):
        valid, _ = validate_sql(
            "SELECT * FROM students; DELETE FROM students"
        )
        self.assertFalse(valid)

    def test_rejects_sql_comments(self):
        valid, _ = validate_sql(
            "SELECT * FROM students -- comment"
        )
        self.assertFalse(valid)

    def test_rejects_unapproved_table(self):
        valid, _ = validate_sql("SELECT * FROM users")
        self.assertFalse(valid)

    def test_rejects_unapproved_column(self):
        valid, _ = validate_sql(
            "SELECT password FROM students"
        )
        self.assertFalse(valid)


if __name__ == "__main__":
    unittest.main(verbosity=2)
