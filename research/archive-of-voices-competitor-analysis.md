# Competitor Analysis: Archive of Voices Pro

**Date:** 2026-03-12
**Verdict:** Validates demand, but architecturally a generation behind what we're building.

---

## What It Is

Archive of Voices Pro is a Foundry VTT module that gives NPCs AI-powered dialogue with voice output. It's the most feature-complete AI NPC tool in the Foundry ecosystem. Built by a solo developer (Damond Shadowdrake), distributed via Patreon.

There's also a free version (Archive of Voices) that does text-only AI dialogue — no voice.

### UX Flow
1. DM enables the module + SocketLib dependency
2. DM configures API key(s) in settings (or links Patreon for a hosted GPT proxy)
3. DM or player clicks the robot icon in chat sidebar, selects an NPC token
4. Types a question (or speaks it in Pro via browser-based voice capture)
5. LLM generates an in-character response based on NPC personality + memory log
6. In Pro: response is also sent to ElevenLabs, audio plays to players, MP3 saved locally
7. Memory log updated in a Journal Entry automatically

### Their Stated Philosophy
> "The GM is always in control. AI features are optional, off by default, and only run when you initiate them. Nothing is created without your input. No hidden calls, no automatic generation, no surprises. Everything is editable. Responses are drafts — you can tweak, expand, or ignore them freely."

This is notably similar to our DM-controls-everything principle. The difference is they state it but lack the architecture to enforce it (no knowledge locking, no DM review gates, no game mechanics integration).

---

## Features

| Feature | Archive of Voices Pro | Our Spec |
|---------|----------------------|----------|
| AI dialogue generation | Yes — multi-provider (OpenAI, Claude, Gemini, OpenRouter) | Yes — Claude primary, GPT-4o-mini fallback |
| Text-to-Speech | ElevenLabs only | Tiered — Cartesia (quick), ElevenLabs (standard), Hume Octave (premium) |
| Speech-to-Text (player voice input) | Basic/limited | Full — Deepgram Nova-2 real-time streaming |
| NPC memory | Journal-based flat logs | 3-layer hierarchy (World → Faction → Individual) + vector RAG |
| Knowledge locking | No | Yes — multi-layer (prompt + filtering + topic detection + DM review) |
| Game mechanics | No | Yes — dice rolls, commerce, persuasion checks, information gating |
| DM control layer | Limited | Full — DM configures everything, AI executes |
| Voice-to-voice conversation | No — primarily text input → voice output | Yes — full loop (player speaks → STT → LLM → TTS → NPC voice) |
| Platform | Foundry VTT only | Platform-independent (web app, future Foundry module) |

---

## Pricing

- **Patreon tiers:**
  - Amateur Voice Actor: $4.25/month — early access to free modules + chat only
  - **Professional Voice Actor: $8.50/month** — Archive of Voices Pro access
  - Master Voice Actor: $12.75/month — Pro + Archive of Observers
- **On top of that, users pay their own API costs:**
  - LLM API (OpenAI/Claude/Gemini) — varies by usage
  - ElevenLabs TTS API — varies by usage
- **Effective total cost:** ~$20-50/month depending on usage

This is a BYOK (Bring Your Own Keys) model. Users must set up and manage their own API accounts with multiple providers.

**Patron count:** 317 Patreon members (includes free followers + paying patrons). Paying patrons estimated 95–160. Gross revenue estimated $400–$1,500/month. Earnings hidden. Not indexed on Graphtreon.

---

## Install Base & Popularity

**Tiny.**

- GitHub: 1 star
- Reddit discussions: Essentially zero — no meaningful threads found on r/FoundryVTT, r/DMAcademy, or r/DnD
- YouTube coverage: No reviews or demos found
- Foundry package listing: Listed but no visible download count data

This is a niche module used by a small number of early adopters, not a mainstream tool.

---

## User Feedback & Complaints

Given the tiny install base, there's minimal public feedback. The complaints that can be inferred from architecture and community patterns:

### Known/Likely Pain Points

1. **Latency: 3-6+ seconds per response** — Not real-time voice conversation. There's a noticeable pause between player input and NPC response. For a tabletop session, this breaks conversational flow.

2. **ElevenLabs lock-in** — Only one TTS provider. No ability to use cheaper/faster TTS for unimportant NPCs or premium voices for key characters.

3. **BYOK complexity** — Users need to set up API keys for both an LLM provider AND ElevenLabs. This is a significant barrier for non-technical DMs.

4. **No knowledge hierarchy** — NPC memory is flat journal logs. No concept of "this NPC knows about their faction but not another faction's secrets." No locked knowledge.

5. **No game mechanics** — Can't trigger dice rolls, handle persuasion checks, or gate information behind skill checks. The AI just talks — it doesn't interact with the game system.

6. **Foundry-only** — Excludes the massive Roll20 user base, Discord-based games, and in-person play with digital aids.

7. **No post-generation filtering** — No safeguard against the AI accidentally revealing information the DM wanted locked.

---

## Technical Architecture

- **LLM:** Multi-provider via API (OpenAI, Claude, Gemini, OpenRouter). User configures which provider to use.
- **TTS:** ElevenLabs only. Voice assigned per NPC.
- **STT:** Basic/limited implementation. Not a core feature — primarily designed for text input.
- **Memory:** Journal-based. NPC "remembers" via stored conversation logs. No vector search, no RAG, no hierarchical knowledge.
- **Context assembly:** Simple prompt construction. No world/faction/individual layer system.
- **Foundry integration:** Token-based. Click NPC token to interact.
- **Runtime:** Everything runs client-side within Foundry. No dedicated backend server. API calls made from the GM's browser, routed through SocketLib for multiplayer safety.
- **Data storage:** Foundry Journal Entries for memory + MP3 files in world folder for audio.

---

## Foundry AI NPC Module Landscape

Archive of Voices Pro is one of ~8 competing modules. None have significant adoption, though some show meaningful download activity.

| Module | LLM | TTS | STT | Memory | GitHub Downloads | Status |
|--------|-----|-----|-----|--------|----------------:|--------|
| **Talking Actors** | None | ElevenLabs | No | No | 271,557 | Active — most downloaded voice module |
| **Intelligent NPCs** | Multi-provider | None | No | Yes | ~258,319 | Active — most downloaded AI NPC module |
| **Inworld Integration** | Inworld AI | ElevenLabs | No | Inworld-managed | ~219,347* | Limited (1 NPC at a time) |
| **Archive of Voices Pro** | Multi-provider | ElevenLabs | Basic (browser) | Journal-based | N/A (Patreon) | Active — 317 Patreon members |
| **Archive of Voices (free)** | Multi-provider | None | No | Journal-based | 135 | Active (stale — last update Jan 2025) |
| **NOVA Multi-AI** | Multi-provider | ElevenLabs | No | Per-persona notes | 189 | Active — brand new |
| **UnKenny** | Multi-provider | None | No | Basic | 0 releases | Unmaintained (dev seeking new owner) |
| **RPGX AI Assistant** | Local (Ollama) | None | No | None | N/A | New (Nov 2025) |

*Inworld downloads heavily inflated by manifest update checks (216k from one version alone).

**Note:** GitHub download counts include manifest file fetches (automatic update checks), not just installs. Real install counts are a fraction of these numbers.

Archive of Voices Pro is the only one combining LLM + TTS + STT + memory in a single module. Intelligent NPCs (cswendrowski) has significant traction but no TTS — it's AI dialogue only.

---

## The Developer

- **Solo developer:** Damond Shadowdrake (DamondSD on GitHub)
- **Organization:** "Shadowdrake Creations" — described as "a small team of nerdy creators" but likely solo
- **Background:** Has been running tabletop RPGs for almost 30 years. Built the tool to solve keeping dozens of NPCs consistent mid-session.
- **Distribution:** Patreon-gated. Also has a Discord for supporters (not publicly indexed).
- **Maintenance:** Active on Pro (v5.0.0 Oct 2025, v14-readiness ongoing). Free version on GitHub not updated since Jan 2025 with 2 open bugs unfixed.
- **Other modules:** Also created "Archive of Observers" (cinematic play module)
- **Resources:** One person. Limited ability to build the kind of pipeline infrastructure we're designing.

---

## What This Means for Us

### It Validates the Thesis

1. **Someone built this and people pay for it** — even with a tiny install base, the fact that a paying audience exists at all confirms DMs want AI NPC voices.
2. **It's listed on Foundry's package system** — the ecosystem accepts AI NPC modules. No platform resistance.
3. **The free version exists** — shows there's a funnel from "curious" to "willing to pay for voice."

### It Doesn't Kill the Thesis

Archive of Voices Pro is a **first-generation proof of concept**, not a polished product. The gaps are enormous:

| Gap | Why It Matters |
|-----|---------------|
| No real-time voice conversation | Players can't just *talk* to NPCs — defeats the core fantasy |
| No knowledge locking | DMs can't trust the AI not to spoil secrets |
| No game mechanics | AI is disconnected from the actual game being played |
| No tiered voices | Every NPC costs the same, regardless of importance |
| BYOK complexity | Limits audience to technical users only |
| 3-6s+ latency | Breaks immersion and conversational flow |

### The Real Competitive Risk

It's **not** Archive of Voices Pro. A solo dev with 1 GitHub star isn't going to suddenly ship a real-time voice pipeline with knowledge locking and game mechanics.

The risk is:
- **A well-funded startup** seeing the same opportunity and building faster (e.g., someone with Inworld AI's resources pivoting back to TTRPG)
- **ElevenLabs or OpenAI** shipping a "game NPC" product as a showcase for their APIs
- **A Foundry power-developer** with a large following building something good enough

**Speed to market matters.** The window is open now because the existing tools are primitive. That won't last forever.

---

## Action Items

- [ ] Install Archive of Voices Pro and test it firsthand — experience the latency and UX gaps yourself
- [ ] Monitor their Patreon for subscriber count / growth signals
- [ ] Use their limitations as explicit differentiators in positioning ("Unlike existing tools, we do X, Y, Z")
- [ ] Consider: is a Foundry module the right first platform, or should we ship standalone first and add Foundry integration later?

---

## Sources

- [Archive of Voices Pro — Foundry VTT Package](https://foundryvtt.com/packages/archive-of-voices-pro)
- [Archive of Voices (Free) — Foundry VTT Package](https://foundryvtt.com/packages/archive-of-voices)
- [GitHub Repository (Free Version)](https://github.com/DamondSD/archive-of-voices)
- [Shadowdrake Creations Patreon](https://www.patreon.com/ShadowdrakeCreations)
- [Shadowdrake Creations — Foundry VTT Creator Page](https://foundryvtt.com/creators/shadowdrake-creations/)
- [Talking Actors — Foundry VTT](https://foundryvtt.com/packages/acd-talking-actors)
- [NOVA Multi-AI — Foundry VTT](https://foundryvtt.com/packages/nova-multiai)
- [UnKenny — Foundry VTT](https://foundryvtt.com/packages/unkenny)
- [Inworld AI Integration — Foundry VTT](https://foundryvtt.com/packages/inworldintegration)
- [RPGX AI Assistant — Foundry VTT](https://foundryvtt.com/packages/rpgx-ai-assistant)
