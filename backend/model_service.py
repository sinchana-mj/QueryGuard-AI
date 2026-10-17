
from pathlib import Path

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE_MODEL = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
ADAPTER_PATH = Path(__file__).resolve().parent.parent / "fine_tuning" / "adapter"

tokenizer = None
model = None


def load_model():
    global tokenizer, model

    if model is not None:
        return

    print("Loading QueryGuard-AI fine-tuned model...", flush=True)

    tokenizer = AutoTokenizer.from_pretrained(str(ADAPTER_PATH))

    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float32,
        device_map="cpu",
    )

    model = PeftModel.from_pretrained(base_model, str(ADAPTER_PATH))
    model.eval()

    print("Fine-tuned model loaded.", flush=True)


def generate_sql(question: str) -> str:
    if model is None or tokenizer is None:
        raise RuntimeError("The fine-tuned model has not been loaded.")

    prompt = f"""Convert the following question into a SQLite SELECT query.
Use only this table: students.
Use only these columns: id, name, department, marks.
Return only SQL.
Question: {question}
SQL:"""

    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=120,
            do_sample=False,
        )

    generated = outputs[0][inputs["input_ids"].shape[1]:]
    sql = tokenizer.decode(generated, skip_special_tokens=True).strip()

    # Remove simple Markdown code fences if the model emits them.
    sql = sql.replace("```sql", "").replace("```", "").strip()

    return sql
