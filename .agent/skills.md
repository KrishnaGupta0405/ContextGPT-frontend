# Agent Skills

This document consolidates the skills available to the agent.

---

## Skill: creating-skills

**Description**: Generates high-quality, predictable, and efficient .agent/skills/ directories based on user requirements. Use when the user asks to create a new skill or "build a skill" for the agent.

### Antigravity Skill Creator System Instructions

You are an expert developer specializing in creating "Skills" for the Antigravity agent environment. Your goal is to generate high-quality, predictable, and efficient `.agent/skills/` directories based on user requirements.

#### 1. Core Structural Requirements

Every skill you generate must follow this folder hierarchy:

- `<skill-name>/`
  - `SKILL.md` (Required: Main logic and instructions)
  - `scripts/` (Optional: Helper scripts)
  - `examples/` (Optional: Reference implementations)
  - `resources/` (Optional: Templates or assets)

#### 2. YAML Frontmatter Standards

The `SKILL.md` must start with YAML frontmatter following these strict rules:

- **name**: Gerund form (e.g., `testing-code`, `managing-databases`). Max 64 chars. Lowercase, numbers, and hyphens only. No "claude" or "anthropic" in the name.
- **description**: Written in **third person**. Must include specific triggers/keywords. Max 1024 chars. (e.g., "Extracts text from PDFs. Use when the user mentions document processing or PDF files.")

#### 3. Writing Principles

When writing the body of `SKILL.md`, adhere to these best practices:

- **Conciseness**: Assume the agent is smart. Do not explain what a PDF or a Git repo is. Focus only on the unique logic of the skill.
- **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. If more detail is needed, link to secondary files (e.g., `[See ADVANCED.md](ADVANCED.md)`) only one level deep.
- **Forward Slashes**: Always use `/` for paths, never `\`.
- **Degrees of Freedom**:
  - Use **Bullet Points** for high-freedom tasks (heuristics).
  - Use **Code Blocks** for medium-freedom (templates).
  - Use **Specific Bash Commands** for low-freedom (fragile operations).

#### 4. Workflow & Feedback Loops

For complex tasks, include:

1.  **Checklists**: A markdown checklist the agent can copy and update to track state.
2.  **Validation Loops**: A "Plan-Validate-Execute" pattern. (e.g., Run a script to check a config file BEFORE applying changes).
3.  **Error Handling**: Instructions for scripts should be "black boxes"—tell the agent to run `--help` if they are unsure.

#### 5. Output Template

When asked to create a skill, output the result in this format:

### [Folder Name]

**Path:** `.agent/skills/[skill-name]/`

### [SKILL.md]

````markdown
---
name: [gerund-name]
description: [3rd-person description]
---

# [Skill Title]

## When to use this skill

- [Trigger 1]
- [Trigger 2]

## Workflow

[Insert checklist or step-by-step guide here]

## Instructions

[Specific logic, code snippets, or rules]

## Resources

- [Link to scripts/ or resources/]
  [Supporting Files]
  (If applicable, provide the content for scripts/ or examples/)

---

## Instructions for use

1.  **Copy the content above** into a new file named `antigravity-skill-creator.md`.
2.  **Upload this file** to your AI agent or paste it into the system prompt area.
3.  **Trigger a skill creation** by saying: \*"Based on my skill creator instructions, build me a skill for [Task, e.g., 'automating React component testing with Vitest']."\*\*

## Skill: managing-design-system

**Description**: Manages the application's design system, including colors, typography, and component styling. Use when the user requests UI updates or provides design tokens.

### Design System Manager

This skill encapsulates the "Pro SaaS" aesthetic guidelines and tokens.

#### When to use this skill

- When the user provides new design tokens (JSON/CSV).
- When asked to "branding" or "theme" the app.
- When fixing inconsistent styles.
- When creating new components that need to match the "Chatbase" style context.

#### Resources

### Tech-stack used

this is nextjs project, with shadcn with js and jsx only, don't make use of typescript
use the color varilables already declared in the global.css

all the error message should se destructured like this -> error.response.data.message

all the api call should be made using axios

make use of shadcn breadcrumn on all the pages

**Design Tokens (theme.json)**:

```json
{
  "colorScheme": "light",
  "fonts": [
    {
      "family": "Inter",
      "role": "body"
    }
  ],
  "colors": {
    make use of the global.css available color, as the project uses shadcn colors as the base
  },
  "typography": {
    "fontFamilies": {
      "primary": "Inter",
      "heading": "Inter"
    },
    "fontStacks": {
      "heading": [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji"
      ]
    },
    "fontSizes": {
      "h1": "70.4px",
      "h2": "48px",
      "body": "20px"
    }
  },
  "spacing": {
    "baseUnit": 8,
    "borderRadius": "6px"
  },
  "personality": {
    "tone": "modern",
    "energy": "medium",
    "targetAudience": "businesses looking for AI customer service solutions"
  },
  "designSystem": {
    "framework": "shadcn + tailwind",
    "componentLibrary": "shadcn + tailwind"
  },
  "confidence": {
    "buttons": 0.95,
    "colors": 0.9,
    "overall": 0.925
  }
}
```
````

#### Instructions

Applies the "Pro SaaS" design tokens to the project.

**Core Configuration**:

1.  **Tailwind Config**: Update `tailwind.config.js` to use the colors from `theme.json` (specifically `colors.primary`, `colors.accent`, etc.).
2.  **Globals**: Ensure `globals.css` imports `@tailwind base;` etc. and sets `:root` variables if dynamic theming is required.
3.  **Fonts**: Use `Inter` for everything (Primary, Heading, Body). Configure this in `layout.js` or `tailwind.config.js`.

**Component Specifics**:

**"Pro SaaS" Improvements (from Upgrade Guide)**:

- **H1 Size**: Target `64px` with `-2%` tracking (tighter).
- **Body Size**: Target `16px` for better readability (vs `20px` raw).
- **Border Radius**: Use `8px` generally for a modern/friendly look.
- **Secondary Button**: Suggest Transparent with 1px border instead of gray background if appropriate.

#### Workflow

1.  Read the "Design Tokens" and "Upgrade Guide" sections above.
2.  Apply these changes to `tailwind.config.js`, `globals.css`, and relevant components (e.g., `Button.jsx`, `Navbar.jsx`).
