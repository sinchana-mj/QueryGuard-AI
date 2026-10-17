---
base_model: Qwen/Qwen2.5-Coder-1.5B-Instruct
library_name: peft
pipeline_tag: text-generation
tags:
  - lora
  - transformers
  - text-to-sql
  - queryguard-ai
---

# QueryGuard-AI Fine-Tuned Model

## Model Details

### Model Description

This model is a LoRA fine-tuned adapter based on `Qwen/Qwen2.5-Coder-1.5B-Instruct`. It is used in QueryGuard-AI, a prototype application that converts natural-language questions about student records into SQL queries.

The application validates generated SQL and executes permitted queries against a SQLite database containing demo student data.

- **Developed by:** QueryGuard-AI project team
- **Model type:** LoRA adapter for a causal language model
- **Task:** Natural-language-to-SQL generation
- **Language:** English prompts and SQL
- **Base model:** Qwen/Qwen2.5-Coder-1.5B-Instruct
- **Fine-tuning method:** LoRA, using PEFT
- **Framework:** Transformers and PEFT
- **License:** Refer to the base model's license and the applicable adapter and training-data terms.

## Intended Uses

### Direct Use

The adapter is intended to generate SQL from natural-language questions about the project's demo database schema.

### Downstream Use

The adapter is integrated into QueryGuard-AI, which uses a FastAPI backend, a React frontend, and a SQLite database.

The application includes SQL validation, restrictions on permitted tables and columns, read-only query execution, and checks for potentially destructive user requests.

### Out-of-Scope Uses

This model and prototype are not intended for:
- Executing data modification or destructive SQL statements.
- Accessing arbitrary databases or unapproved tables.
- Handling production or sensitive personal data without further security assessment.
- Serving as a replacement for a comprehensive database authorization system.

## Bias, Risks, and Limitations

The model may generate incorrect, incomplete, or unsuitable SQL. Fine-tuning does not guarantee accuracy or security.

Natural-language checks and SQL validation can have limitations. The application must validate every generated query before execution. Read-only database permissions and schema restrictions provide additional safeguards.

**ArmorIQ is not currently integrated.** Authorization in this prototype is implemented using local application rules and SQLite controls.

### Recommendations

- Validate generated SQL before execution.
- Use a read-only database connection.
- Restrict access to approved tables and columns.
- Test both normal and adversarial prompts.
- Do not rely on the model alone to enforce security.
- Review and test the system before using it with real or sensitive data.

## How to Get Started

The adapter is intended to be loaded through the QueryGuard-AI application.

1. Set up the project's Python environment and dependencies.
2. Ensure the base model and LoRA adapter are available.
3. Start the FastAPI backend.
4. Open the React frontend and submit a natural-language question.
5. Review the generated SQL and returned results.

See the project README for the complete setup and execution instructions.

## Training Details

### Training Data

The exact training dataset, size, provenance, and preprocessing details have not been documented here. These details should be added from the actual training files or logs.

### Training Procedure

The model uses a LoRA adapter with the PEFT library. Other training details should be documented from the training configuration rather than inferred.

- **Training hyperparameters:** Not documented here.
- **Training hardware:** Not documented here.
- **Training duration:** Not documented here.

## Evaluation

The application has been manually tested with example prompts, including:
- Queries for students above or below a marks threshold.
- Queries for the highest-scoring student.
- Queries for a specific department.
- Requests for destructive operations.
- Attempts to access unapproved tables.
- A SQL injection-style prompt containing SQL comment syntax.

These are prototype checks, not a formal benchmark. No quantitative model accuracy or security rate is claimed.

## Technical Specifications

- **Base model:** Qwen/Qwen2.5-Coder-1.5B-Instruct
- **Adapter method:** LoRA
- **Adapter framework:** PEFT
- **Application backend:** FastAPI
- **Database:** SQLite
- **Frontend:** React with Vite
- **Execution policy:** Local SQL validation and read-only, schema-restricted execution

Exact package versions, compute requirements, and hardware details should be recorded from the project environment.

## Environmental Impact

Carbon emissions, energy usage, hardware details, and training duration have not been measured for this project.

## Citation

Please cite the original Qwen base model and relevant PEFT documentation according to their published citation guidance. Add a project-specific citation if a report or publication becomes available.

## Model Card Maintenance

This card describes the current prototype and should be updated when the training dataset, configuration, evaluation results, or application security architecture changes.
