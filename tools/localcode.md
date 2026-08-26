? OpenAI-compatible API) to query DB, generate reports, call APIs.
  - Agents: plan/execute with local model; but keep human in loop.
  - Multi-model routing: small fast for chat, larger for code.
  - Embeddings + vector DB (Chroma, LanceDB, Qdrant).
  - Fine-tuning? Maybe not necessary; use LoRA if repeated style. But local teacher maybe advanced.
- Part F: Design tech teacher project ideas and patterns
  - Curriculum websites: accessible PWA, offline, print styles, lesson plans generator, standards mapping.
  - Assessment tools: rubric builder, evidence portfolio, auto-checklist, formative quiz with immediate feedback, data export CSV/JSON, privacy local storage.
  - Games: HTML5 canvas, Phaser? For local LLM maybe vanilla JS or p5.js; game loop, state machine, levels as JSON, procedural generation, accessibility (keyboard, colorblind), scoring, save/load.
  - Simulations: physics of materials, circuits, forces, CAD concepts with Three.js/SVG.
  - Classroom tools: randomizer, timer, group manager, feedback dashboard, printable worksheets, QR code generator, image-to-CSS? Maybe local vision models? Could mention multimodal local (Qwen-VL, LLaVA) for analyzing student photos/diagrams but privacy.
- Part G: Cheat sheet
  - Quick setup commands Ollama.
  - Prompt templates copy-paste.
  - Code review checklist.
  - Common failure prompts and fixes.
  - File structure template.
  - Testing commands (node, vitest? maybe simple). For web: npm create vite? But local LLM can generate; use Node + Vite or plain HTML. Provide minimal stack: single-file HTML for quick tools; Vite/React for larger; Python FastAPI if backend.
- Part H: Example end-to-end mini project: "Design Tech Assessment Tracker" with prompts and code skeleton. Or "Game: Material Strength Challenge". Need maybe include sample prompt sequence.

Need be practical, not too long? Desired oververbosity 9, so detailed. But final should be readable. Use headings, tables, bullet points, code blocks. Ensure no unsupported claims. Could mention local LLMs can't reliably produce huge apps in one shot; use scaffolding.

Need maybe include "cheat sheet" at end with compact prompts. Also "pushing possible": advanced patterns:
- Use LLM as compiler? No.
- Generate unit tests, property-based tests.
- Ask for "state machine diagram", "data model JSON schema".
- Use structured outputs (JSON) and validate with Zod/Pydantic.
- Use local embeddings to search your own lesson plans.
- Build a private "classroom copilot" that knows your standards and rubrics via RAG.
- Generate student-facing explanations at different reading levels.
- Create accessible alternatives: audio descriptions, captions, keyboard controls.
- Use LLM to create procedural content: mazes, word search, crossword, quiz banks.
- Use local vision model to inspect screenshots? Maybe if hardware.

Need include safety/privacy: local data stays on machine; but still avoid uploading student PII; use pseudonyms; consent; school policy; don't rely for high-stakes assessment without human review.

Need maybe mention "temperature" settings: code 0-0.2, creative content 0.7-1.0. Context length: keep under model's trained context; if long, summarize. Use system prompt persistent.

Potential final outline:
Title: Guide & Cheat Sheet for Coding with Local LLMs (Design Tech Teacher Edition)
1. The core idea: local LLM = fast private pair programmer; you are architect/QA.
2. Setup cheat sheet
   - Choose runtime table
   - Model selection by hardware table
   - Ollama commands
3. Prompting system that works with small/local models
   - Universal prompt formula
   - 10 high-leverage prompts
4. Workflow for building web tools/games
   - Step 0: define outcome, users, constraints
   - Step 1: spec and data model
   - Step 2: file plan
   - Step 3: implement in slices
   - Step 4: test/verify
   - Step 5: polish/accessibility/performance
   - Include example prompts for each step.
5. Local LLM superpowers (beyond code)
   - RAG, structured output, tool calling, agents, multimodal, fine-tuning? 
6. Design-tech specific ideas and patterns
   - Table of project types with recommended stack and LLM tasks.
7. Quality control checklist
8. Common failure modes + fixes table
9. Copy-paste cheat sheet (prompts)
10. Example: build a "Design Challenge Game" in 6 prompts maybe.

Need ensure final not too massive but thorough. Could include code snippets for minimal web tool and game loop. But user asks guide/cheat sheet, not full code. Include small examples.

Let's craft with high detail. Need mention local LLMs: Ollama API endpoint http://localhost:11434/api/generate or /api/chat; LM Studio OpenAI-compatible at localhost:1234/v1. Use Python requests? Could include curl commands. For coding, use VS Code Continue/Cline/Roo? Local models with extensions. Mention "Continue" and "Cline" as IDE integrations that can point to Ollama/LM Studio. Also "Open WebUI" for chat UI.

Need maybe include "model naming": Use `ollama run qwen2.5-coder:7b` etc. But if model not available, use `ollama list`. Could say replace with best local coder you have. Need avoid outdated? Qwen2.5-Coder existed late 2024; okay. DeepSeek Coder V2 maybe. Llama 3.1 8B/70B. Mistral Small 3.x? Phi-4? Gemma 3? Since current 2026, likely newer but these are safe as examples. Could phrase "examples of good local coding families (check your Ollama/LM Studio library for latest versions)".

Need include hardware table:
- 8GB RAM/VRAM: 7B/8B Q4/Q5; short context 4k-8k; simple scripts, small components.
- 16GB: 13B/14B or strong 8B with long context; multi-file tools.
- 24GB+: 32B/70B quantized? 70B Q4 needs ~40GB maybe not 24; say 32B Q4/Q5, MoE if supported. For 64GB: 70B Q4 or larger.
- CPU-only: smaller models, slower; use 1-4B for quick tasks? Phi-3/Phi-4, Gemma 2 9B maybe slow.

Need mention quantization: Q4_K_M good balance, Q5/Q6 better if memory. Context length tradeoff KV cache memory. Use `num_ctx` in Ollama? In API options: {"options": {"num_ctx": 8192}}. Temperature top_p etc.

Prompt formula:
[Role] [Context] [Task] [Constraints] [Output format] [Quality bar] [Assumptions to state]
Example: "You are a senior front-end engineer... Build a single-file HTML/CSS/JS tool for Year 9 design tech students... Use no external libraries... Include keyboard accessibility, print styles, localStorage save. Output only code in one file."

Need include "ask for plan first" prompt:
"Before coding, produce: 1) user stories, 2) data model JSON schema, 3) UI states, 4) edge cases, 5) test checklist, 6) file structure. Do not write implementation yet."

Then implement:
"Implement step 1 only... Keep under 200 lines..." etc.

Need include "bug fix prompt":
"I have this code and expected/actual behavior. Identify root cause, propose minimal patch as diff, then provide full corrected function. Do not change unrelated code."

Testing prompts:
"Write a test plan for this tool... Then write unit tests using Vitest/Jest or plain Node assert..." For local small model maybe ask simple manual test checklist.

Need include "RAG setup": Use embeddings (nomic-embed-text, bge-m3? all-MiniLM-L6-v2) and vector DB; Ollama supports embedding models: `ollama pull nomic-embed-text`. Then use Python with chromadb or LanceDB. Provide simple pseudocode. For teacher: upload lesson plans, standards, rubrics; ask "Which standard does this activity align to?" etc.

Tool calling: local model can output JSON action; you execute in code. Example schema:
{"tool":"get_student_progress","args":{"class":"9A"}}
Then parse and call function. Use structured outputs if supported (Ollama format? `format` json). For small models, constrain with few examples and validation.

Agents: simple loop: Goal -> Plan -> Action -> Observation -> Next action; keep max steps 5; log all actions. Good for "generate quiz from uploaded PDF" but need OCR/RAG.

Need include "multimodal local": Qwen2-VL? LLaVA? Could analyze diagrams, photos of student work (with consent), generate alt text. But caution privacy and accuracy.

Need maybe mention "fine-tuning vs RAG/prompting": For teacher, don't fine-tune first; use RAG + examples + system prompt. Fine-tune only if repeated style and data.

Need include "classroom deployment": PWA offline, local server on school network? Use `python -m http.server` or Node serve; avoid cloud APIs for student data; export CSV; no external fonts maybe. Accessibility WCAG: contrast, focus states, alt text, keyboard, reduced motion.

Potential final with cheat sheet at end. Need ensure answer directly addresses "I feel I have not yet discovered many useful things". Emphasize shift from one-off prompts to systems: specs, tests, RAG, tool use, structured outputs, local pipelines. Provide "next 30 days" plan maybe. Good idea: include a 2-week/30-day progression:
- Week 1: set up Ollama + Continue; build small tool with spec/test loop.
- Week 2: RAG over your curriculum docs; generate aligned activities.
- Week 3: game engine pattern with JSON levels and state machine.
- Week 4: assessment dashboard with local data export, accessibility audit.

Need include "cheat sheet" maybe compact table of prompts by task:
- New project spec
- Break into tasks
- Generate component
- Refactor
- Debug
- Accessibility audit
- Performance audit
- Student explanation generator
- Rubric/assessment generator
- Game level JSON generator
- Code review

Need include "local LLM settings" table:
Task | temp | top_p | context | notes
Code deterministic 0.1, creative 0.8, explanations 0.5.

Need maybe mention "use smaller model for classification/summarization, larger for code". Multi-model routing: e.g., Phi-4/Gemma for quick labels; Qwen2.5-Coder for implementation; Llama/Mistral for student-facing text.

Need include "what to avoid": asking local 7B to build entire app in one prompt; pasting huge files without context; accepting hallucinated dependencies; no tests; ignoring accessibility; using cloud APIs with student data.

Let's draft final. Need be thorough but not insane. Use markdown. Include code blocks for Ollama commands and sample API call maybe.

Need ensure no hidden chain-of-thought in final. Just answer.

Potential final:
# Guide & Cheat Sheet...
## 1) Mental model
Local LLM is best as a constrained assistant, not magic app generator. Your leverage comes from: precise specs, small tasks, tests, retrieval, structured outputs, tool execution.

## 2) Setup
Table runtimes: Ollama, LM Studio, llama.cpp, vLLM, Open WebUI, Continue/Cline.
Commands:
```
ollama pull qwen2.5-coder:7b
ollama pull nomic-embed-text
ollama serve
curl http://localhost:11434/api/chat ...
```
Maybe include JSON body.

Model table with examples. Need mention "if you have NVIDIA GPU, use CUDA; if Apple Silicon, Metal".

## 3) Prompting patterns
Universal formula and examples. Include system prompt for teacher context:
"You are a design technology educator and software engineer..." etc.

High-leverage prompts list (10). Could be in table with copy-paste.

## 4) Build workflow
Detailed steps with prompts.
Step 1: Define product brief. Provide template.
Step 2: Ask for architecture/data model. Output JSON schema, states, edge cases.
Step 3: Generate minimal viable version (single file). Prompt constraints.
Step 4: Add tests/checklist.
Step 5: Iterate with diffs.
Step 6: Accessibility/performance/security audit.

Include sample code skeleton for single-file web tool? Maybe small:
```html
<!doctype html>... <script> const state = {...}; function render(){} </script>
```
But maybe not necessary. Could include "recommended stacks":
- Quick classroom tool: one HTML file, vanilla JS, localStorage, print CSS.
- Larger app: Vite + React/Svelte/TypeScript; or SvelteKit for SSR? For local LLM, simpler is better.
- Games: p5.js or Phaser 3; but local model may know p5.js well. Use JSON levels.
- Backend/data: Python FastAPI + SQLite if needed; avoid cloud DBs.

## 5) Advanced capabilities
RAG pipeline with steps and simple code pseudocode. Tool calling example. Agents loop. Structured outputs. Multimodal. Fine-tuning note.

## 6) Design tech use cases table
Columns: Goal, local LLM task, output, stack.
Examples: curriculum site, assessment evidence tracker, rubric generator, game, simulation, worksheet generator, student feedback writer, accessibility checker, offline PWA, data dashboard.

## 7) Quality checklist
Functional, edge cases, accessibility, performance, privacy, maintainability.

## 8) Failure modes table
Symptom -> cause -> fix.

## 9) Cheat sheet quick prompts
Maybe compact list with placeholders.

## 10) 30-day plan
Week by week.

Need ensure final is not too long? It's okay desired oververbosity 9. But maybe around 4000-6000 words? We can be detailed but concise enough. Let's aim ~5000 words? Token budget okay. Need produce final only.

Let's refine content.

Detailed sections:

### Setup
Runtimes table:
- Ollama: easiest, CLI/API, good for local server; `ollama serve`.
- LM Studio: GUI, model download, OpenAI-compatible API.
- llama.cpp: max control, GGUF, CPU/GPU.
- vLLM: high throughput if serving many requests (teacher maybe not).
- Open WebUI: chat UI with RAG? Actually Open WebUI has document upload and Ollama integration; good for non-code interface.
- Continue/Cline/Roo Code: IDE coding assistants that can use local models.

Model selection table:
Hardware | Good targets | Notes
8GB RAM/VRAM | 7B/8B Q4/Q5, Phi-4/Gemma small | short context; simple tasks
16GB | 13B/14B or strong 8B long ctx | multi-file
24-32GB | 32B Q4/Q5, MoE if supported | better reasoning/code
64GB+ | 70B Q4 or larger | slower but stronger
CPU only | 1-9B quantized | use for quick edits/summarization

Examples: `qwen2.5-coder:7b`, `deepseek-coder-v2:8b`? Ollama tags may vary; say check library. `mistral-small3.2:24b`? Maybe too specific. Use generic "Qwen Coder, DeepSeek Coder, Llama 3.x Instruct/Coder, Mistral Small, Phi-4, Gemma".

API settings table:
Task | temp | top_p | context
Code generation/bug fix | 0.0-0.2 | 0.9 | enough for file + tests
Refactor | 0.1 | 0.9 | include relevant snippets only
Creative student content | 0.7-0.9 | 0.95 | shorter context okay
Summarization/classification | 0.2-0.4 | 0.9 | use structured output

Ollama curl example:
```
curl http://localhost:11434/api/chat -d '{
 "model":"qwen2.5-coder:7b",
 "messages":[{"role":"user","content":"..."}],
 "stream":false,
 "options":{"temperature":0.1,"num_ctx":8192}
}'
```

### Prompting patterns
Universal formula with example. Include "context pack" idea: maintain `CONTEXT.md` with standards, target age, constraints, style guide, existing code structure. Paste or RAG it.

Prompt templates:
1. Product brief generator
2. Architecture/data model
3. Implementation slice
4. Test plan
5. Bug fix
6. Refactor
7. Accessibility audit
8. Student-facing explanation
9. Assessment/rubric generator
10. Game level/content generator

Need include exact prompts maybe in code blocks for copy-paste.

Example product brief prompt:
```
You are a design technology teacher and software engineer. Create a concise product brief for a web tool that helps Year 9 students track evidence for a design challenge.
Constraints: single HTML file, no external libraries, works offline after load, localStorage only, printable, accessible (WCAG AA), no student names stored—use class code + anonymous ID.
Output sections: purpose, users, core features, non-goals, data model, UI states, success metrics, risks, 5 acceptance tests.
```

Architecture prompt:
```
Given this brief, propose a minimal architecture... Do not write full app yet. Output JSON schema for state, list of components/functions, event flow, edge cases, and a build order in slices under 100 lines each.
```

Implementation slice:
```
Implement only Slice 1: add/edit evidence item. Use vanilla JS. Keep code under 250 lines total. Include input validation, empty state, error message, keyboard support. Do not invent features. If assumptions needed, list them first.
```

Bug fix:
```
Here is the relevant code... Expected behavior... Actual behavior... Steps to reproduce... Identify likely root cause. Provide minimal patch as a diff. Then provide corrected function only. Do not rewrite unrelated code.
```

Testing prompt:
```
Create a manual test checklist and, if possible, automated tests using Node's built-in test runner or Vitest. Cover happy path, invalid input, empty state, localStorage failure, keyboard navigation, print view.
```

Accessibility audit:
```
Audit this HTML/CSS/JS for accessibility... Output table: issue, severity, WCAG criterion, fix, code change. Prioritize keyboard focus, contrast, labels, aria-live, reduced motion, touch targets.
```

Student explanation generator:
```
Explain [concept] to a 14-year-old design tech student using one analogy, one classroom example, one common misconception, and one quick check question. Tone encouraging, no jargon unless defined.
```

Assessment/rubric:
```
Create a rubric for [task] aligned to [standards]. Use 4 levels with observable evidence. Include moderation notes and two exemplar descriptors per level. Output Markdown table + JSON.
```

Game content generator:
```
Generate 10 levels as JSON for a game about material strength. Each level has id, prompt, constraints, target score, hints array, accessibility note. Difficulty curve... Validate against schema...
```

### Workflow details
Maybe include "context budget" rule: For local models, keep each request under ~2-4k tokens if possible; provide only relevant code. Use file names and line numbers. Ask for patches not whole files. If model loses track, restart with summary.

Use "spec-driven development": maintain `SPEC.md`, `TODO.md`, `TESTS.md`. LLM updates them. This is powerful. Provide template:
```
# SPEC.md
Goal:
Users:
Constraints:
Data model:
UI states:
Acceptance tests:
Open questions:
```

Use "slice" approach: each slice has input/output, acceptance test. Example slices for assessment tracker:
1. Add evidence item (title, date, type)
2. List and delete items
3. Save to localStorage
4. Export CSV
5. Print view
6. Accessibility pass

### Advanced techniques
RAG details:
- Chunk documents 300-800 words with overlap; metadata: year, subject, standard, date.
- Embedding models: nomic-embed-text, bge-m3, all-MiniLM-L6-v2 (if available). Ollama `nomic-embed-text`.
- Vector DB: Chroma, LanceDB, Qdrant, FAISS. For teacher local: LanceDB/Chroma easy.
- Prompt with retrieved chunks and citations. Example prompt: "Using only the provided curriculum excerpts...".

Tool calling example:
```
Available tools: get_class_roster(class_code), save_evidence(student_id, evidence), generate_report(class_code)
Respond only JSON: {"tool":"...", "args":{}}
```
Then code validates and executes. For local small models, use constrained choices and examples.

Agents: simple loop with max steps; log plan/action/observation; stop if uncertain. Use for multi-step tasks like "create quiz from lesson plan" but human review.

Structured outputs: ask JSON schema; validate with Zod/Pydantic; retry with error message. Example:
```
Return JSON matching: {"title":string,"levels":[{...}]}
```

Multimodal: local vision models can describe diagrams, generate alt text, check UI screenshots for contrast? But not reliable; use as assistive. Privacy.

Fine-tuning: only after stable prompt/RAG; small LoRA on style or domain terms; but often overkill.

### Design tech ideas
Table with 15 ideas maybe. Need include "make better games": patterns:
- State machine (menu, playing, paused, gameover)
- Data-driven levels JSON
- Separation of content and engine
- Procedural generation with seeded RNG for reproducible classroom versions
- Accessibility: keyboard controls, colorblind-safe palettes, text-to-speech optional, reduced motion
- Save/load via localStorage/IndexedDB; export progress CSV
- Teacher dashboard: view class stats locally (no cloud)

Examples of games/simulations:
- "Material Strength Challenge": drag loads onto bridge, score based on failure point.
- "Circuit Builder": connect components, simulate current/voltage with simple model.
- "Design Sprint Timer/Role Card Generator".
- "Failure Mode Detective": identify design flaws in images/descriptions.
- "Sustainable Design Trade-off Simulator".

### Quality checklist
Functional: works offline, no console errors, handles empty/error states, data persists safely.
Accessibility: semantic HTML, labels, focus order, contrast 4.5:1, keyboard, aria-live for dynamic updates, reduced motion, touch targets >=44px.
Performance: load <3s on school devices, no heavy libraries unless needed, lazy load images, avoid layout thrash.
Privacy: local storage only, pseudonyms, export/delete data, no external analytics/fonts if possible.
Maintainability: clear file structure, comments for teachers, version notes.

### Failure modes table
- "It rewrites whole app and breaks things" -> ask for diff/slice; provide current code; use git.
- "Invents library/API" -> constrain stack; ask to list dependencies before using; verify docs.
- "Forgets earlier context" -> maintain SPEC.md, summarize, smaller chunks.
- "Code looks right but fails edge cases" -> test checklist, error states.
- "Too generic student content" -> provide standards, age, examples, tone, constraints.
- "Slow local model" -> lower context, quantize, use smaller model for simple tasks, batch requests.

### Cheat sheet quick reference
Maybe include a compact table:
Task | Prompt starter
New tool | "Build a single-file accessible web tool..."
Plan first | "Do not code yet. Output spec, data model, states, tests."
Implement slice | "Implement only this slice... under N lines..."
Debug | "Expected/actual/repro; minimal patch as diff"
Refactor | "Improve readability without changing behavior; list changes"
Tests | "Write manual checklist + automated tests for edge cases"
Accessibility | "Audit and fix: labels, focus, contrast, keyboard, aria-live"
Student content | "Explain to Year 9... analogy, misconception, check question"
Assessment | "Create rubric aligned to standards; observable evidence; JSON+Markdown"
Game levels | "Generate N levels as JSON matching schema..."

Commands cheat sheet:
```
ollama pull qwen2.5-coder:7b
ollama run qwen2.5-coder:7b
ollama list
ollama ps
curl ...
python -m http.server 8000
npx vite --host
node --test tests/*.js
```

Need maybe include "IDE setup": Continue config with Ollama base URL and model; Cline can use local. But not too much.

Potential final answer should be self-contained. Let's write elegantly.

Need consider if user wants "coding with LLM's" grammar? We'll respond professionally.

Let's produce final. Ensure no analysis. Use headings. Include enough detail. Maybe include a "start here" summary at top: 5 principles. Then detailed guide. Good.

Double-check local model names: Ollama tags may be `qwen2.5-coder:7b`, `deepseek-coder-v2:16b`? I can say examples, verify with `ollama search`. For embeddings: `nomic-embed-text` is common. Good.

Need maybe mention "local LMs are not perfect at long codebases; use IDE + linter". Include git workflow: commit before asking changes; ask for patch; review diff. This is important. Add to workflow.

Could include sample `.gitignore`? Not necessary.

Let's craft final with high detail but organized. Use tables. Ensure copy-paste prompts are clear.

Potential final length maybe 6000 words. That's okay. Let's write.
</think>

# Guide + Cheat Sheet: Coding with LLMs, Especially Local LMs  
### A practical system for a design technology teacher who wants to build better websites, assessment tools, games, simulations, and classroom resources

You are not missing some secret “magic prompt.” The biggest jump usually comes from changing your workflow: stop asking the model to “make me an app” in one shot, and start using it as a **private pair programmer + curriculum assistant + QA reviewer** inside a structured process.

Local LLMs are especially useful for you because they can work offline, keep student data private, run on school hardware, and be embedded into tools that students use without cloud dependencies.

---

## 1) The core mental model

A local LLM is best used as:

- A **fast code generator**
- A **refactoring assistant**
- A **bug-finding partner**
- A **test writer**
- A **curriculum content generator**
- A **rubric/assessment designer**
- A **student explanation writer**
- A **data/content structurer**
- A **local “classroom copilot”** that knows your standards, schemes of work, and assessment language

But it is not best used as:

- A one-shot full-app generator
- A reliable long-context memory system
- A final authority on correctness
- A safe place to put sensitive student data without controls
- A substitute for testing, accessibility review, and pedagogical judgment

Your leverage comes from **constraints, structure, verification, and iteration**.

---

# 2) Setup: local LLM stack that actually works

## A. Choose a runtime

| Tool | Best for | Notes |
|---|---|---|
| **Ollama** | Easiest local model server + API | Great default. Simple CLI and HTTP API. |
| **LM Studio** | GUI, easy model management, OpenAI-compatible API | Good if you prefer a desktop app. |
| **llama.cpp** | Maximum control, CPU/GPU flexibility | More advanced, but very capable. |
| **vLLM** | High-throughput serving | Overkill for most classroom use unless serving many users. |
| **Open WebUI** | Nice chat interface with document upload/RAG-style features | Good for non-code workflows and quick exploration. |
| **Continue / Cline / Roo Code** | IDE coding assistants that can point at local models | Excellent for code editing inside VS Code or similar. |

For most teachers, I would start with:

- **Ollama** as the model server
- **LM Studio** if you want a GUI
- **Continue** or **Cline** in your editor for coding assistance
- A simple local web stack for student tools

---

## B. Basic Ollama setup

```bash
# Start Ollama
ollama serve

# Pull a coder model — replace with whatever strong local coder you have available
ollama pull qwen2.5-coder:7b

# Pull an embedding model for RAG / document search
ollama pull nomic-embed-text

# List models
ollama list

# Run interactively
ollama run qwen2.5-coder:7b
```

Example API call:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5-coder:7b",
  "messages": [
    {"role": "user", "content": "Write a small vanilla JS function to validate an email address."}
  ],
  "stream": false,
  "options": {
    "temperature": 0.1,
    "num_ctx": 8192
  }
}'
```

---

## C. Choosing models by hardware

You do not need the biggest model for everything. In fact, smaller models are often better for speed and reliability in constrained tasks.

| Hardware | Practical target | What to expect |
|---|---|---|
| **8 GB RAM/VRAM** | 7B–8B quantized models | Good for short code snippets, small tools, refactors, explanations. Keep context modest. |
| **16 GB RAM/VRAM** | Strong 8B or 13B–14B models | Better multi-file work and longer reasoning. Still best with slicing. |
| **24–32 GB RAM/VRAM** | 32B-class quantized models, or capable MoE if supported | Much stronger coding and planning. Slower but worth it for complex tasks. |
| **64 GB+** | 70B-class quantized or larger | Strongest local option, but often overkill unless you are doing serious local development. |
| **CPU only** | Small models, 1B–9B depending on machine | Fine for quick edits, summaries, classification; slower and less reliable for large code tasks. |

### Good families to