# QueryGuard-AI — Security Test Report

## 1. Overview

QueryGuard-AI is a natural-language-to-SQL application that uses a fine-tuned Qwen2.5-Coder model to generate SQL queries. It applies SQL validation and read-only database controls before executing queries.

## 2. Testing Environment

- **Backend:** Python, FastAPI
- **Frontend:** React and Vite
- **Database:** SQLite
- **AI model:** Fine-tuned Qwen2.5-Coder-1.5B-Instruct with LoRA adapter
- **Testing framework:** Python `unittest`

## 3. Automated Security Test Results

**Overall result: 17 tests passed, 0 failures.**

### SQL Validation Tests — 13 Passed

| Test | Expected result | Status |
|---|---|---|
| Allows a simple SELECT query | Accept query | PASS |
| Allows AVG aggregate function | Accept query | PASS |
| Allows COUNT aggregate function | Accept query | PASS |
| Allows MAX aggregate function | Accept query | PASS |
| Allows MIN aggregate function | Accept query | PASS |
| Allows SUM aggregate function | Accept query | PASS |
| Rejects an unapproved function | Reject query | PASS |
| Rejects DELETE | Reject query | PASS |
| Rejects DROP TABLE | Reject query | PASS |
| Rejects multiple SQL statements | Reject query | PASS |
| Rejects SQL comments | Reject query | PASS |
| Rejects an unapproved table | Reject query | PASS |
| Rejects an unapproved column | Reject query | PASS |

### Database Execution Tests — 4 Passed

| Test | Expected result | Status |
|---|---|---|
| Allows a safe SELECT query | Execute query | PASS |
| Rejects DELETE | Block operation | PASS |
| Rejects DROP TABLE | Block operation | PASS |
| Rejects an unapproved table | Block access | PASS |

## 4. Test Execution

Command used to run all automated tests:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s backend -p "test_*.py" -v
```

Observed result:

```text
Ran 17 tests in 0.014s

OK
```

### Frontend Production Build

Command executed from the `frontend` directory:

```powershell
npm run build
```

Result: **PASS**

Vite successfully generated the production build. The build completed in 398 ms.

### Functional Testing

The following frontend questions were tested:

- Calculate the average marks of all students. The expected average is 84.0, and this result was verified.
- Count the total number of students.
- Show all students in the Electronics department.

The count and department questions were reported as tested in the frontend.

## 5. Conclusion

All 17 automated tests passed in the reported test run, and the frontend production build completed successfully. The tested SQL validation controls reject the specified destructive operations, multiple statements, comments, unauthorized tables and columns, and unapproved SQL functions. The approved aggregate functions are accepted by the validator.

These results cover selected security scenarios and do not establish that the application is immune to all SQL injection attacks or other security vulnerabilities.

## 6. Known Limitations

- ArmorIQ integration has not been completed or verified. The application currently relies on local SQL validation and SQLite read-only controls.
- Additional adversarial prompt and SQL injection testing is needed.
- The security tests cover selected scenarios and do not constitute a comprehensive security audit.
- Further testing is required before treating the application as production-ready.
