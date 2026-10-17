from pathlib import Path
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE_MODEL = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
ADAPTER_PATH = Path(__file__).resolve().parent / "adapter"

print("Loading tokenizer...", flush=True)
tokenizer = AutoTokenizer.from_pretrained(str(ADAPTER_PATH))

print("Loading base model on CPU...", flush=True)
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float32,
    device_map="cpu",
)

print("Loading trained LoRA adapter...", flush=True)
model = PeftModel.from_pretrained(base_model, str(ADAPTER_PATH))
model.eval()

prompt = """Convert the following question into a SQLite SELECT query.
Use only these columns: id, name, department, marks.
Use the table: students.
Return only SQL.
Question: Show students who scored above 80 marks
SQL:"""
inputs = tokenizer(prompt, return_tensors="pt")

print("Generating SQL...", flush=True)
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        do_sample=False,
    )

print("\nModel output:", flush=True)
print(
    tokenizer.decode(
        outputs[0][inputs["input_ids"].shape[1]:],
        skip_special_tokens=True,
    ),
    flush=True,
)