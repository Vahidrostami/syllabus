---
name: quiz-generation
description: "Generate varied, pedagogically-sound assessments: MCQ, code completion, ordering, coding challenges, and scenario questions with difficulty calibration and feedback design."
---

# Quiz Generation Skill

## Question Type Catalog

### Multiple Choice (MCQ)
- 4 options, exactly 1 correct
- Distractors must represent real misconceptions, not obviously wrong
- Avoid "all of the above" and "none of the above"
- Randomize correct answer position

### Code Completion
- Provide working code with 2-4 blanks (marked as `___N___`)
- Each blank tests a specific concept
- Provide progressive hints (3 levels: vague → specific → almost-answer)
- Include the expected output

### Ordering Exercise
- 4-8 items to arrange in correct sequence
- Items should be plausibly reorderable (not trivially obvious)
- Works for: algorithms, workflows, debugging steps, deployment pipelines

### Coding Challenge
- Clear problem statement with input/output specification
- Starter code with function signature
- 2-3 test cases (shown) + 1-2 hidden test cases
- Solution code + explanation
- 3-level hint system

### Scenario / Interview Question
- Real-world scenario with constraints
- Rubric with 4-6 key points to hit
- Sample "good answer" for self-assessment
- Common pitfalls to avoid

## Difficulty Calibration

| Difficulty | Cognitive Load | Hint Availability | Time Expected |
|-----------|---------------|-------------------|---------------|
| Easy | Single concept recall/apply | Full hints | 30-60 sec |
| Medium | Multi-concept synthesis | 2 hints | 2-5 min |
| Hard | Novel application + analysis | 1 hint | 5-15 min |

## Feedback Design
- **Correct**: Affirm + explain WHY it's correct + bonus insight
- **Incorrect**: No shame + explain the misconception + guide toward correct understanding
- **Partial**: Acknowledge what's right + point to what's missing

## Anti-Patterns
- Gotcha questions that test trick wording, not understanding
- Questions answerable by elimination without topic knowledge
- Code questions with syntax errors in the template
- Ambiguous questions with multiple defensible answers
