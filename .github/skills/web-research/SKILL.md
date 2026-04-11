---
name: web-research
description: "Search the web and synthesize information for curriculum planning. Use when researching a topic for syllabus creation, finding latest tools and best practices, or checking information accuracy."
---

# Web Research Skill

Use this skill to gather current, accurate information about any learning topic.

## Research Strategy

### Phase 1: Topic Scoping
Search for the broad topic to understand its landscape:
- `"{topic}" tutorial roadmap`
- `"{topic}" learning path beginner to advanced`
- `"{topic}" skills breakdown`

### Phase 2: Depth Research  
For each major subtopic identified:
- `"{subtopic}" best practices 2024 2025`
- `"{subtopic}" common mistakes`
- `"{subtopic}" tutorial hands-on`

### Phase 3: Industry Context
- `"{topic}" job requirements` 
- `"{topic}" interview questions`
- `"{topic}" real-world applications`
- `"{topic}" vs alternatives comparison`

### Phase 4: Resource Validation
- Check official documentation for accuracy
- Verify tool versions and API changes
- Cross-reference multiple sources for contested claims

## Output Format

Return a structured research summary:
```json
{
  "topicOverview": "Brief synthesis of the topic landscape",
  "keySubtopics": ["list", "of", "essential", "subtopics"],
  "currentBestPractices": ["practice 1", "practice 2"],
  "commonTools": [
    { "name": "Tool", "version": "latest", "purpose": "why it's used" }
  ],
  "learningResources": [
    { "title": "Resource", "url": "link", "quality": "high/medium/low" }
  ],
  "interviewInsights": ["common questions and expectations"],
  "recentChanges": ["anything that changed recently in this field"]
}
```

## Quality Rules
- Always prefer official documentation over blog posts
- Note when information might be outdated
- Flag areas where the field is rapidly changing
- Include version numbers for all tools and libraries
