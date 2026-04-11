---
name: content-writing
description: "Write educational content with pedagogy best practices. Covers opening hooks, explanation layering, code example standards, callout types, and readability rules."
---

# Content Writing Skill

## The Syllabus Writing Formula

### Opening Hook Patterns
1. **The Analogy Open**: "Imagine you're a chef, but instead of a full kitchen, you only have a microwave..."
2. **The Problem Open**: "You've just been asked to deploy an ML model, but your GPU budget is $0."
3. **The Surprising Fact**: "A 3-billion parameter model can outperform GPT-3.5 on specific tasks."
4. **The Question Open**: "What if you could train a model on your laptop in under an hour?"

### Explanation Layering
For any complex concept, use three layers:
1. **Intuition** (1-2 sentences) — The "what" in plain English
2. **Mechanism** (1-2 paragraphs) — The "how" with technical detail
3. **Implication** (1-2 sentences) — The "so what" for practical use

### Code Example Standards
```python
# ✅ GOOD: Annotated, realistic, runnable
from peft import LoraConfig, get_peft_model

# Configure LoRA — these hyperparams work well for most instruction-tuning tasks
lora_config = LoraConfig(
    r=16,              # Rank: higher = more capacity but more memory
    lora_alpha=32,     # Scaling factor: typically 2x the rank  
    target_modules=["q_proj", "v_proj"],  # Attention layers to adapt
    lora_dropout=0.05, # Light dropout to prevent overfitting
    task_type="CAUSAL_LM"
)

model = get_peft_model(base_model, lora_config)
print(f"Trainable params: {model.print_trainable_parameters()}")
# Output: trainable params: 4,194,304 || all params: 3,821,079,552 || trainable%: 0.1098
```

### Callout Types
- **💡 Key Insight**: Core concept that everything builds on
- **⚠️ Common Mistake**: Error that 80% of beginners make
- **🎯 Interview Tip**: How to discuss this in an interview
- **🔬 Deep Dive**: Optional deeper explanation for curious learners
- **🛠️ Pro Tip**: Time-saving shortcut from experienced practitioners

### Transition Patterns
Between sections, use connecting phrases:
- "Now that we understand X, let's see how it connects to Y..."
- "This raises an important question: how do we handle Z?"
- "With this foundation in place, we're ready to tackle..."
- "Remember the analogy from earlier? Here's where it breaks down..."

## Readability Rules
- Sentences: Max 25 words for technical content
- Paragraphs: Max 4-5 sentences  
- Jargon: Define on first use, inline
- Acronyms: Spell out on first use
- Lists: Max 5-7 items (chunk if longer)
