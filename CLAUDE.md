# D&D AI NPC Voice Engine

## Project Status: BUILD PHASE

**Owner:** Michael Zafiropoulos
**Business:** [Zenobits](https://www.zenobits.co.uk) — voice roleplay platform (L&D → D&D pivot)
**Technical Spec:** `technical-spec.md` (source of truth for all implementation decisions)

## What We're Building

A real-time voice AI NPC tool for Dungeon Masters. Players speak to NPCs and hear them respond in character with distinct voices. The DM controls everything — the AI is a voice actor and memory, not a replacement DM.

**Core pipeline:** Player speech → STT → Context Assembly → LLM → TTS → NPC voice

## Architecture at a Glance

- **Frontend:** Next.js (React), WebSocket for real-time, Web Audio API
- **Backend:** Node.js + Fastify, WebSocket server, REST API
- **Data:** PostgreSQL (structured), Qdrant (vector/RAG), Redis (session state)
- **STT:** Deepgram Nova-2
- **LLM:** Claude Sonnet (primary), GPT-4o-mini (fallback/quick tier)
- **TTS:** Cartesia Sonic 3 (quick NPCs), ElevenLabs (standard), Hume Octave (premium)

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 0** | Prototype — single NPC voice conversation, hardcoded | Not started |
| **Phase 1** | Core Engine — multi-NPC, DM controls, voice tiers | Not started |
| **Phase 2** | Knowledge — 3-layer hierarchy, RAG, locked content | Not started |
| **Phase 3** | Game Mechanics — dice rolls, commerce, information gating | Not started |
| **Phase 4** | Memory — cross-session NPC memory, summaries | Not started |
| **Phase 5** | Polish & Beta — keyboard shortcuts, NPC library, billing | Not started |
| **Phase 6** | Async & Integrations — blue booking, Foundry VTT, Discord | Not started |

See `technical-spec.md` §15 for detailed scope per phase.

## Repo Structure

```
/
├── CLAUDE.md                       # This file
├── technical-spec.md               # Full technical specification
├── app/
│   ├── web/                        # Next.js frontend
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   ├── hooks/              # Custom hooks (audio, websocket, etc.)
│   │   │   ├── lib/                # Client utilities
│   │   │   ├── app/                # Next.js app router pages
│   │   │   └── types/              # Frontend-specific types
│   │   ├── public/                 # Static assets
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── server/                     # Backend API
│   │   ├── src/
│   │   │   ├── routes/             # Fastify route handlers
│   │   │   ├── services/           # Business logic (voice pipeline, context engine, etc.)
│   │   │   ├── models/             # Database models
│   │   │   ├── lib/                # Shared utilities
│   │   │   └── types/              # Backend types
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/                     # Shared types and schemas
│       ├── src/
│       │   ├── schemas/            # Zod schemas (NPC, Campaign, etc.)
│       │   └── types/              # TypeScript interfaces
│       ├── package.json
│       └── tsconfig.json
├── research/                       # Market research & analysis (reference)
│   ├── dnd-opportunity-assessment.md
│   ├── voice-ai-api-landscape-2026.md
│   ├── npc-requirements-community-research.md
│   ├── npc-system-prompt-engineering.md
│   └── validation-playbook.md
├── prototypes/                     # Prototype experiments
│   └── mira-ashvane-system-prompt.md
├── landing-page/                   # Validation landing page
├── dnd-opportunity-idea.md         # Original opportunity doc
└── .gitignore
```

## Key Design Decisions

These are settled. Don't re-litigate unless the user asks to reconsider.

1. **Pipeline architecture (STT → LLM → TTS), not speech-to-speech.** Game mechanics injection and knowledge locking require control over the LLM prompt between input and output. See spec §5.1.

2. **DM controls everything.** The AI never decides what to reveal, when a roll is needed, or how an NPC feels. It executes the DM's configuration. See spec §1.

3. **3-layer knowledge hierarchy (World → Faction → Individual).** Each NPC's context is assembled from these layers via RAG. See spec §4.

4. **Tiered voice providers.** Quick NPCs get cheap/fast TTS (Cartesia). Important NPCs get premium TTS (Hume/ElevenLabs). DM assigns tier per NPC. See spec §5.4.

5. **Locked knowledge is multi-layer protected.** Prompt instructions + post-generation filtering + topic detection + optional DM review. See spec §13.1.

## Testing

Automated test harness for the voice pipeline (requires server running on port 3002):

- **Text pipeline test:** `npx tsx app/server/src/test-pipeline.ts` — sends text directly to LLM→TTS, verifies no narration, audio output, timing (3 scenarios)
- **Audio pipeline test:** `npx tsx app/server/test/test-audio-pipeline.ts` — sends real WAV audio through WebSocket→STT→LLM→TTS, verifies transcript accuracy, no narration, audio output (3 scenarios)
- **Generate fixtures:** `bash app/server/test/generate-fixtures.sh` — creates WAV test audio files using macOS `say` (16-bit mono 16kHz)

Use these to diagnose speech pipeline bugs without manual browser testing.

## Working With Claude in This Repo

- **Reference the technical spec** for any implementation question. It's comprehensive — check there before improvising.
- **Build incrementally by phase.** Don't pull in Phase 3 concerns when building Phase 0.
- **Keep the DM control principle central.** If a feature removes DM agency, it's wrong.
- **Latency matters.** Every design choice should consider its impact on time-to-first-audio.
- **Cost matters.** Track per-response and per-session costs. The margin is thin (see spec §14).
- **The Mira Ashvane NPC** (`prototypes/mira-ashvane-system-prompt.md`) is our test character. Use her for all prototype testing.
- **D&D domain knowledge** is important — understand how DMs run sessions, switch NPCs, handle skill checks. The community research (`research/npc-requirements-community-research.md`) has the details.
- **Don't over-engineer.** Phase 0 is deliberately minimal. Resist adding features before the current phase is solid.
