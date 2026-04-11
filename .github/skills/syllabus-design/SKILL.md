---
name: syllabus-design
description: "Structure learning paths with pedagogical best practices including Bloom's Taxonomy, module arc patterns, prerequisite mapping, and duration estimation."
---

# Syllabus Design Skill

Patterns and frameworks for building effective learning sequences.

## Bloom's Taxonomy Mapping

Map each lesson to a cognitive level:

| Level | Verbs | Example Objective |
|-------|-------|-------------------|
| **Remember** | Define, list, recall | "List the 5 main SLM families" |
| **Understand** | Explain, compare, summarize | "Explain why LoRA reduces memory usage" |
| **Apply** | Implement, use, execute | "Fine-tune a model using the HuggingFace Trainer" |
| **Analyze** | Debug, differentiate, examine | "Diagnose why a fine-tuned model is overfitting" |
| **Evaluate** | Justify, critique, assess | "Evaluate which quantization method suits a given scenario" |
| **Create** | Design, build, produce | "Design a fine-tuning pipeline for a customer support bot" |

## Module Arc Pattern

Each module should follow this arc:

```
1. HOOK — Why does this matter? (motivation)
2. FOUNDATIONS — Core concepts and vocabulary
3. DEEP DIVE — Detailed mechanics and theory
4. PRACTICE — Hands-on application
5. SYNTHESIS — Connect back to the bigger picture
6. CHECK — Quiz/exercise to verify understanding
```

## Prerequisite Mapping

Define prerequisites at three levels:
- **Required**: Must know before starting (block if missing)
- **Recommended**: Will help but not essential (suggest catch-up resources)
- **Nice-to-have**: Enriches understanding (mention briefly)

## Duration Estimation Rules

| Content Type | Duration per Unit |
|-------------|------------------|
| Concept explanation | 3-5 min per concept |
| Code walkthrough | 5-8 min per example |
| Hands-on exercise | 10-20 min per exercise |
| Quiz (MCQ) | 1-2 min per question |
| Coding challenge | 15-30 min each |
| Diagram analysis | 3-5 min per diagram |

## Anti-Patterns to Avoid

- **Info dump**: Modules that are all theory, no practice
- **Orphan concepts**: Topics introduced but never used again
- **Cliff jumps**: Sudden difficulty spikes without scaffolding
- **Kitchen sink**: Trying to cover everything instead of the essential 80%
- **Dead ends**: Lessons that don't connect forward to anything
