# Phase 1 Implementation Plan: Core Engine

**Status:** Planning complete, ready to implement
**Date:** 2026-03-07
**Spec reference:** `technical-spec.md` §15 (Phase 1)
**Estimated duration:** 12 working days

---

## Overview

Transform the single-NPC hardcoded prototype into a multi-NPC engine with DM controls, voice tiers, and persistent storage.

**Exit criteria:** A DM can run a session with 3+ NPCs, switch between them, and steer conversations via whispers.

---

## Phase 0 Baseline (what exists today)

| Layer | Current State |
|-------|--------------|
| **Frontend** | Single page: PTT/VAD audio capture, WebSocket, playback. Hardcoded Mira Ashvane. No DM controls. |
| **Backend** | Fastify + single WebSocket route. `VoicePipeline`: Deepgram STT -> Claude Sonnet -> Cartesia TTS. Hardcoded NPC config. |
| **Data** | No database. NPC defined as TypeScript const. Conversation history in-memory. Session logs as JSON files on disk. |
| **Shared** | Full NPC type definitions exist (`app/shared/src/types/index.ts`) including `NPC`, `VoiceConfig`, `DMCommand`, `ServerEvent`. Zod schemas are empty stubs. |

---

## Architecture Changes

```
Phase 0                              Phase 1
--------                             --------
No database              ->          PostgreSQL + Drizzle ORM
Hardcoded Mira           ->          NPC CRUD via REST API
Single pipeline          ->          Session manager with multi-NPC support
Cartesia only            ->          TTS provider abstraction (Cartesia + ElevenLabs)
No DM controls           ->          WebSocket DM commands (whisper, mute, switch)
Single page UI           ->          Player view + DM control panel
Hardcoded system prompt  ->          Dynamic prompt builder from NPC data model
No cost tracking         ->          Per-response cost accumulation
JSON file logs           ->          PostgreSQL conversation logging
```

**Explicitly deferred to Phase 2+:**
- RAG / Vector DB / Qdrant (Phase 2)
- Locked knowledge enforcement beyond prompt instructions (Phase 2)
- Skill check / roll input system (Phase 3)
- NPC memory across sessions (Phase 4)
- Redis session cache (not needed until multi-server)
- Auth / multi-user (Phase 5)

---

## Work Streams

### WS1: Database & Persistence Layer

**Why first:** Everything else depends on persistent NPC storage.

**Technology:** PostgreSQL + Drizzle ORM
- Drizzle: TypeScript-native, lightweight, explicit SQL, great migration story
- PostgreSQL: spec's chosen DB
- Dev: local Postgres via `brew services` or Docker

**Schema tables:**

```
campaigns
  id (uuid, PK)
  name (text)
  owner_id (text)              -- placeholder, no auth yet
  setting (text)
  tone (text)
  created_at (timestamp)
  updated_at (timestamp)

npcs
  id (uuid, PK)
  campaign_id (uuid, FK)
  name (text)
  race (text)
  class (text, nullable)
  age (text)
  gender (text)
  appearance (text)
  occupation (text)
  status (enum)
  voice_config (jsonb)         -- VoiceConfig object
  personality (jsonb)          -- NPCPersonality object
  speech (jsonb)               -- NPCSpeech object
  personal_knowledge (text[])
  secrets (text[])
  locked_knowledge (jsonb[])
  lies (jsonb[])
  relationships (jsonb[])
  party_disposition (integer)
  disposition_modifiers (text[])
  tags (text[])
  notes (text)
  created_at (timestamp)
  updated_at (timestamp)

sessions
  id (uuid, PK)
  campaign_id (uuid, FK)
  started_at (timestamp)
  ended_at (timestamp, nullable)
  active_npc_ids (text[])
  total_cost (numeric)
  status (enum: active/ended)

interaction_logs
  id (uuid, PK)
  session_id (uuid, FK)
  npc_id (uuid, FK)
  timestamp (timestamp)
  player_input (text)
  npc_response (text)
  dm_whisper (text, nullable)
  cost_stt (numeric)
  cost_llm (numeric)
  cost_tts (numeric)
  cost_total (numeric)
```

**Steps:**
1. Install Drizzle: `drizzle-orm`, `drizzle-kit`, `postgres` (driver)
2. Create `app/server/src/db/schema.ts` with Drizzle table definitions
3. Create `app/server/src/db/index.ts` for connection setup
4. Create `drizzle.config.ts` for migrations
5. Add `DATABASE_URL` to `.env.example`
6. Generate and run initial migration
7. Create seed script to insert Mira Ashvane as a proper NPC record

**Files created:**
- `app/server/src/db/schema.ts`
- `app/server/src/db/index.ts`
- `app/server/drizzle.config.ts`
- `app/server/src/db/seed.ts`
- `app/server/drizzle/` (migration files)

---

### WS2: NPC CRUD API (REST endpoints)

**Why:** DMs need to create, read, update, and delete NPCs. Quick Create requires an LLM call.

**Endpoints:**

```
POST   /api/campaigns                       Create campaign
GET    /api/campaigns                       List campaigns
GET    /api/campaigns/:id                   Get campaign with NPCs
PATCH  /api/campaigns/:id                   Update campaign
DELETE /api/campaigns/:id                   Delete campaign

POST   /api/campaigns/:id/npcs              Create NPC (detailed)
POST   /api/campaigns/:id/npcs/quick-create Quick create (LLM-generated)
GET    /api/campaigns/:id/npcs              List NPCs for campaign
GET    /api/npcs/:id                        Get single NPC
PATCH  /api/npcs/:id                        Update NPC
DELETE /api/npcs/:id                        Delete NPC
```

**Quick Create flow:**
1. DM sends brief text: `"Dwarven blacksmith, gruff, knows about the missing shipment"`
2. Backend sends to Claude Sonnet with a meta-prompt that outputs structured JSON matching the NPC schema
3. System fills defaults for anything not specified (generates name, selects voice tier/provider, etc.)
4. Returns full NPC object for DM review
5. DM confirms -> NPC saved to DB

**Steps:**
1. Create `app/server/src/routes/api/campaigns.ts`
2. Create `app/server/src/routes/api/npcs.ts`
3. Add Zod schemas in `app/shared/src/schemas/index.ts` for request validation
4. Implement Quick Create LLM prompt in `app/server/src/services/npc-generator.ts`
5. Register routes in `app/server/src/index.ts`

**Files created:**
- `app/server/src/routes/api/campaigns.ts`
- `app/server/src/routes/api/npcs.ts`
- `app/server/src/services/npc-generator.ts`

**Files modified:**
- `app/shared/src/schemas/index.ts`
- `app/server/src/index.ts`
- `app/server/package.json` (add `zod`)

---

### WS3: System Prompt Builder

**Why:** Currently the system prompt is a hand-written const. Phase 1 needs to generate prompts dynamically from the NPC data model.

**Design:** A pure function `buildSystemPrompt(npc: NPC, options?: PromptOptions): string` that implements the template from spec section 11.1. For Phase 1, we omit sections requiring Phase 2+ features (RAG, memory retrieval) and include:

- NPC identity, personality, speech patterns
- Personal knowledge, secrets
- Locked knowledge (prompt-level only, no post-generation filter yet)
- Lies
- Relationships
- Party disposition
- DM whisper injection (if any)
- Response length rules

**Key techniques (from prompt engineering research):**
- Include 2-3 sample phrases as tone anchors (dramatically improves voice consistency)
- Use CAPITALIZED emphasis for critical rules
- Character-motivated brevity (tie short responses to personality, not just rules)

**Steps:**
1. Create `app/server/src/services/prompt-builder.ts`
2. Implement template with variable sections from NPC data model
3. Add whisper injection support (`dmWhisper?: string` parameter)
4. Test with Mira Ashvane's data to verify parity with the hardcoded prompt
5. Wire into pipeline to replace hardcoded system prompt

**Files created:**
- `app/server/src/services/prompt-builder.ts`

---

### WS4: Multi-NPC Pipeline & Session Manager

**Why:** The core Phase 1 feature. Currently `VoicePipeline` holds a single NPC config and conversation history. We need a session-level manager that tracks multiple loaded NPCs, switches between them, and routes DM commands.

**Architecture:**

```typescript
SessionManager (1 per WebSocket connection)
  campaign_id
  session_id (from DB)
  loaded NPCs: Map<npcId, { npc: NPC, history: Message[], pipeline: VoicePipeline }>
  active NPC ID
  dm_whisper: string | null
  muted: boolean
  paused: boolean

  switchNPC(npcId)      // swaps active pipeline
  setWhisper(text)      // queues for next response
  mute() / unmute()
  pause() / resume()
  getActivePipeline()   // returns current VoicePipeline
```

**Key refactors to VoicePipeline:**
- Constructor takes full `NPC` object (not just `{ name, systemPrompt, voiceId }`)
- Uses prompt builder (WS3) to generate system prompt dynamically
- Accepts whisper injection before each response
- Pipeline.processPlayerInput checks mute/pause state
- TTS provider selected based on `npc.voice.tier` (WS5)

**NPC switching flow:**
1. DM sends `{ type: "switch_npc", npcId: "..." }`
2. SessionManager pauses current pipeline (cancel any in-progress TTS)
3. If target NPC not loaded: load from DB, create pipeline, cache
4. If already loaded: just swap active pointer
5. Send `npc_switched` event to client with new NPC info
6. Ready for next player input
7. Target: <500ms total switch time

**Steps:**
1. Create `app/server/src/services/session-manager.ts`
2. Refactor `VoicePipeline` to accept `NPC` type and use prompt builder
3. Refactor `app/server/src/routes/session.ts` to:
   - Accept `campaignId` as query param on WebSocket connect
   - Instantiate `SessionManager` instead of single `VoicePipeline`
   - Route DM commands through SessionManager
   - Load NPCs from DB on session start
4. Create DB session record on connect, update on disconnect
5. Backward compatibility: if no campaignId, fall back to Mira Ashvane

**Files created:**
- `app/server/src/services/session-manager.ts`

**Files modified:**
- `app/server/src/services/pipeline.ts` (major refactor)
- `app/server/src/routes/session.ts` (major refactor)

---

### WS5: TTS Provider Abstraction & Voice Tiers

**Why:** Spec requires tiered TTS. Currently only Cartesia. Need ElevenLabs for standard/premium tiers.

**Provider strategy (Phase 1):**

| Tier | Provider | TTFA | Cost/char |
|------|----------|------|-----------|
| Quick | Cartesia Sonic 3 | ~40ms | ~$0.038/1K chars |
| Standard | ElevenLabs Flash v2.5 | ~75ms | ~$0.15/1K chars |
| Premium | ElevenLabs Multilingual v2 | ~200ms | ~$0.30/1K chars |

**Decision: defer Hume Octave** to Phase 2+. Adding a 3rd TTS provider increases surface area without critical value. ElevenLabs covers both standard and premium tiers adequately.

**Interface:**

```typescript
interface TTSProvider {
  speak(textChunks: AsyncIterable<string>, voiceId: string): Promise<void>;
  cancel(): void;
  on(event: "audio", handler: (data: string) => void): void;
  on(event: "done", handler: () => void): void;
}
```

**LLM routing (same pattern):**

| NPC Tier | Model | Rationale |
|----------|-------|-----------|
| Quick | GPT-4o-mini | Cheapest, fastest, fine for simple NPCs |
| Standard | Claude Sonnet | Good character consistency |
| Premium | Claude Sonnet | Same for now, upgrade path to Opus later |

**Steps:**
1. Extract `TTSProvider` interface to `app/server/src/services/tts/types.ts`
2. Move existing Cartesia to `app/server/src/services/tts/cartesia.ts`
3. Create `app/server/src/services/tts/elevenlabs.ts`
4. Create `app/server/src/services/tts/factory.ts` (selects provider by tier)
5. Add `ELEVENLABS_API_KEY` to config
6. Create `app/server/src/services/llm/factory.ts` (selects model by tier)
7. Add OpenAI SDK for GPT-4o-mini

**Files created:**
- `app/server/src/services/tts/types.ts`
- `app/server/src/services/tts/cartesia.ts` (moved from `tts.ts`)
- `app/server/src/services/tts/elevenlabs.ts`
- `app/server/src/services/tts/factory.ts`
- `app/server/src/services/llm/factory.ts`

**Files modified:**
- `app/server/src/config.ts` (add ElevenLabs + OpenAI keys)
- `app/server/src/services/pipeline.ts` (use factories)
- `app/server/package.json` (add `openai` SDK)

---

### WS6: DM Control WebSocket Protocol

**Why:** Whispers, mute, pause, NPC switching all flow over WebSocket.

**Existing protocol:**
- Player -> Server: `audio`, `start_recording`, `stop_recording`, `text_input`
- Server -> Client: `transcript`, `npc_text`, `npc_audio`, `npc_done`, `status`, `barge_in`, `error`

**New DM commands (client -> server):**

```typescript
{ type: "whisper"; text: string }
{ type: "switch_npc"; npcId: string }
{ type: "mute" }
{ type: "unmute" }
{ type: "pause" }
{ type: "resume" }
{ type: "cancel_response" }
```

**New server events (server -> client):**

```typescript
{ type: "npc_switched"; npcId: string; npcName: string }
{ type: "cost_update"; sessionCost: number }
{ type: "whisper_applied"; text: string }
{ type: "session_info"; campaignId: string; npcs: NPC[]; activeNpcId: string }
```

**Design decision: single WebSocket, dual role.** The DM control panel and player view share the same WebSocket connection. DM commands are additional message types. No auth separation needed for Phase 1 (single-user).

**Command behavior:**
- **Whisper**: stored on SessionManager, injected into next prompt builder call, cleared after use
- **Mute**: pipeline.tts.cancel() + suppress future audio events
- **Pause**: ignore incoming audio, hold pipeline state
- **Cancel**: kill current LLM stream + TTS, reset to idle
- **Switch NPC**: delegate to SessionManager.switchNPC()

**Files modified:**
- `app/server/src/routes/session.ts` (add DM command handling)
- `app/shared/src/types/index.ts` (add new event types)

---

### WS7: DM Frontend

**Why:** The DM needs a UI to manage NPCs, switch between them, send whispers, and see costs.

**Route structure:**

```
/                           -> Player view (existing, enhanced)
/dm                         -> DM session control panel
/dm/campaigns               -> Campaign list / management
/dm/campaigns/:id           -> Campaign detail with NPC list
/dm/campaigns/:id/npcs/new  -> NPC creation (detailed form)
```

**DM Session Panel (`/dm`) layout:**

```
+----------------------------------------------------------+
|  SESSION: "Untitled"              Cost: $0.00    [End]   |
+----------------------------------------------------------+
|  ACTIVE NPC: Mira Ashvane                    [Mute] [||] |
|  Voice: Cartesia (quick)         Disposition: +20        |
+----------------------------------------------------------+
|  CONVERSATION                                            |
|  Player: "What do you know about the ship?"              |
|  Mira: "The Aldara's Promise? Three days gone..."        |
+----------------------------------------------------------+
|  WHISPER: [Type instruction for NPC...        ] [Send]   |
+----------------------------------------------------------+
|  NPC SWITCHER:                                           |
|  [* Mira Ashvane] [  Guard] [  Merchant]  [+ Quick NPC] |
+----------------------------------------------------------+
```

**Components to build:**
- `NPCSwitcher.tsx` - row of NPC buttons, click to switch
- `WhisperInput.tsx` - text field for DM whisper
- `DMControlBar.tsx` - mute, pause, end session, cost display
- `QuickCreateModal.tsx` - LLM-powered NPC creation in-session
- `NPCForm.tsx` - detailed NPC creation/edit form (multi-section)
- `CampaignList.tsx` - campaign management

**State management:** Zustand store for session state (active NPC, loaded NPCs, cost). Shared WebSocket connection via custom hook.

**Steps:**
1. Create DM layout at `app/web/src/app/dm/layout.tsx`
2. Create DM session page at `app/web/src/app/dm/page.tsx`
3. Create campaign management pages
4. Build DM-specific components
5. Create `app/web/src/stores/session-store.ts` (Zustand)
6. Create `app/web/src/hooks/useDMSession.ts` (extends useSession with DM commands)
7. Create `app/web/src/lib/api.ts` (REST client for CRUD)

**Files created:**
- `app/web/src/app/dm/layout.tsx`
- `app/web/src/app/dm/page.tsx`
- `app/web/src/app/dm/campaigns/page.tsx`
- `app/web/src/app/dm/campaigns/[id]/page.tsx`
- `app/web/src/app/dm/campaigns/[id]/npcs/new/page.tsx`
- `app/web/src/components/dm/NPCSwitcher.tsx`
- `app/web/src/components/dm/WhisperInput.tsx`
- `app/web/src/components/dm/DMControlBar.tsx`
- `app/web/src/components/dm/QuickCreateModal.tsx`
- `app/web/src/components/dm/NPCForm.tsx`
- `app/web/src/stores/session-store.ts`
- `app/web/src/hooks/useDMSession.ts`
- `app/web/src/lib/api.ts`

---

### WS8: Cost Tracking

**Why:** DMs need cost transparency (spec section 14).

**Per-response cost calculation:**

```typescript
const COST_RATES = {
  stt: { deepgram: 0.0059 / 60 },              // per second of audio
  llm: {
    "claude-sonnet": { input: 3.0 / 1e6, output: 15.0 / 1e6 },
    "gpt-4o-mini":   { input: 0.15 / 1e6, output: 0.60 / 1e6 },
  },
  tts: {
    cartesia:           0.038 / 1000,           // per character
    elevenlabs_flash:   0.15  / 1000,
    elevenlabs_premium: 0.30  / 1000,
  },
};
```

**Steps:**
1. Create `app/server/src/services/cost-tracker.ts`
2. Track cost per response in pipeline (after STT, LLM, TTS complete)
3. Accumulate session total
4. Emit `cost_update` event after each response
5. Save per-interaction costs to `interaction_logs` table

**Files created:**
- `app/server/src/services/cost-tracker.ts`

---

### WS9: Conversation Logging

**Why:** Replace JSON file dumps with proper DB logging.

**What gets logged per interaction:**
- Player input text + NPC response text
- DM whisper (if applied)
- NPC ID
- Per-response cost breakdown (STT, LLM, TTS)
- Timestamp

**Steps:**
1. Modify pipeline to return structured interaction data
2. On each `npc_done`, write to `interaction_logs` table
3. On session end, update session record with `ended_at` and `total_cost`
4. Remove `SessionRecorder` JSON file dumps (or keep as debug fallback)

**Files modified:**
- `app/server/src/services/session-manager.ts` (add logging calls)
- `app/server/src/services/session-recorder.ts` (deprecate or convert)

---

## Implementation Sequence

Dependency graph:

```
Week 1
------
WS1: Database & Persistence  -----+
                                    +--->  WS2: NPC CRUD API --+
WS3: System Prompt Builder   -----+                           |
                                                                |
WS5: TTS Abstraction (parallel, no DB dependency) -------------+
                                                                |
                                                                v
Week 2
------
WS4: Multi-NPC Pipeline & Session Manager  <--------------------+
(depends on: DB, CRUD API, Prompt Builder, TTS Abstraction)     |
                                                                 |
WS8: Cost Tracking (parallel once pipeline structure clear) -----+
                                                                 |
                                                                 v
Week 3
------
WS6: DM Control Protocol  <-----------------------------------------+
(depends on: Session Manager)                                        |
                                                                      |
WS7: DM Frontend  <--- depends on DM protocol ----------------------+
WS9: Conversation Logging (parallel with frontend)
```

**Day-by-day breakdown:**

| Day | Focus | Deliverable |
|-----|-------|-------------|
| 1 | WS1 | PostgreSQL + Drizzle schema, migrations, seed script |
| 2 | WS2 + WS3 | REST API routes (campaign + NPC CRUD) + prompt builder |
| 3 | WS5 | TTS interface, refactor Cartesia, add ElevenLabs |
| 4 | WS2 (finish) | Quick Create endpoint with LLM generation |
| 5 | WS4 | SessionManager, pipeline refactor for multi-NPC |
| 6 | WS4 + WS6 | NPC switching + DM command protocol |
| 7 | WS8 + WS9 | Cost tracker + DB conversation logging |
| 8-9 | WS7 | DM session panel (switcher, whisper, controls) |
| 10-11 | WS7 | Campaign/NPC management pages, Quick Create modal |
| 12 | Testing | Run a 3-NPC session end-to-end, fix issues |

---

## New Dependencies

```
Server:
  drizzle-orm, drizzle-kit     -- ORM + migrations
  postgres                      -- PostgreSQL driver
  openai                        -- GPT-4o-mini for quick tier LLM
  zod                           -- Request validation

Frontend:
  (no new deps -- zustand already present)

Infrastructure:
  PostgreSQL (local dev via brew or Docker)
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| ElevenLabs streaming API differs from Cartesia | Delays WS5 by 1-2 days | Read docs early; fall back to REST+streaming if WebSocket is problematic |
| LLM Quick Create produces low quality NPCs | DMs lose trust | Thorough meta-prompt with examples; "regenerate" button; DM always reviews |
| NPC switching >500ms | Breaks session flow | Pre-create pipeline instances for loaded NPCs; measure and optimize |
| System prompt too long after template expansion | Slow LLM, higher cost | Hard limit 4000 tokens; truncate knowledge sections; log prompt size |
| Pipeline refactor breaks Phase 0 functionality | Can't demo prototype | Write pipeline tests before refactoring; keep Mira Ashvane as seed data |
| Database migrations cause issues | Blocks all dev | Use Drizzle push mode for rapid dev, proper migrations before shipping |

---

## File Map

```
New files (~25):
  app/server/drizzle.config.ts
  app/server/src/db/schema.ts
  app/server/src/db/index.ts
  app/server/src/db/seed.ts
  app/server/src/routes/api/campaigns.ts
  app/server/src/routes/api/npcs.ts
  app/server/src/services/session-manager.ts
  app/server/src/services/prompt-builder.ts
  app/server/src/services/npc-generator.ts
  app/server/src/services/cost-tracker.ts
  app/server/src/services/tts/types.ts
  app/server/src/services/tts/cartesia.ts
  app/server/src/services/tts/elevenlabs.ts
  app/server/src/services/tts/factory.ts
  app/server/src/services/llm/factory.ts
  app/web/src/app/dm/layout.tsx
  app/web/src/app/dm/page.tsx
  app/web/src/app/dm/campaigns/page.tsx
  app/web/src/app/dm/campaigns/[id]/page.tsx
  app/web/src/app/dm/campaigns/[id]/npcs/new/page.tsx
  app/web/src/components/dm/NPCSwitcher.tsx
  app/web/src/components/dm/WhisperInput.tsx
  app/web/src/components/dm/DMControlBar.tsx
  app/web/src/components/dm/QuickCreateModal.tsx
  app/web/src/components/dm/NPCForm.tsx
  app/web/src/stores/session-store.ts
  app/web/src/hooks/useDMSession.ts
  app/web/src/lib/api.ts

Modified files (~8):
  app/server/src/index.ts
  app/server/src/config.ts
  app/server/src/routes/session.ts
  app/server/src/services/pipeline.ts
  app/server/src/services/llm.ts
  app/server/package.json
  app/shared/src/schemas/index.ts
  .env.example
```

---

## Exit Criteria Verification Checklist

Run this scenario to confirm Phase 1 is complete:

1. **Create a campaign** via DM UI -> campaign appears in list
2. **Create 3 NPCs** -- one via Quick Create, two via detailed form -- each with different voice tiers (quick, standard, premium)
3. **Start a session** with all 3 NPCs loaded
4. **Talk to NPC #1** (Mira Ashvane, Cartesia) -> hear voice response in character
5. **Switch to NPC #2** (e.g., a guard, ElevenLabs standard) -> switch <500ms -> talk -> hear different voice
6. **Send a whisper** ("mention strange noises last night") -> next response incorporates the whisper
7. **Switch to NPC #3** (e.g., a merchant, ElevenLabs premium) -> hear premium voice quality
8. **Mute NPC mid-response** -> audio stops immediately
9. **Check cost display** -> session cost increments with each response
10. **End session** -> cost total saved, conversation log in database
