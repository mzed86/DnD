# VTT & TTRPG Community Outreach Map

**Date:** 2026-03-12
**Purpose:** Map all VTT communities for demand validation outreach

---

## Discord Servers

### VTT Platforms

| Platform | Members (approx.) | Module/Extension System? | Self-Promo Tolerance |
|----------|-------------------|--------------------------|----------------------|
| **D&D Official** (merged with D&D Beyond) | ~295,000 | No (WotC-run) | Low — awareness only |
| **Foundry VTT** | ~107,000 | Yes — open module architecture | High — module devs share routinely |
| **Tabletop Simulator** | ~97,000 | Yes — Steam Workshop mods | Moderate |
| **Roll20** | ~35,000 | No — closed ecosystem | Low — official forums discourage competitor products |
| **TaleSpire** | ~30,000 | Yes — Thunderstore mods | High — mod-friendly |
| **Fantasy Grounds** | ~19,000 | Yes — extensions | Moderate |
| **Alchemy RPG** | ~8,400 | Limited | Unknown |
| **Owlbear Rodeo** | ~7,700 | Yes — extension system | Moderate — small community, useful extensions welcome |
| **Let's Role** | ~5,500 | Limited | Unknown |

**Notable secondary servers:**
- TTSClub (fan Tabletop Simulator): ~38,000
- Fantasy Grounds Academy: ~6,700
- TaleSpire Modding: ~2,500

### General TTRPG (Non-Platform)

| Server | Description | Relevance |
|--------|-------------|-----------|
| **The GM Cafe** | "By game masters, for game masters" | High — pure DM audience |
| **Critical Role** (fan) | Largest actual-play community | Low — heavily moderated, not a place to pitch |
| **All Things DnD** | YouTube channel community | Medium — large casual audience |

**Discovery tools:** [DISBOARD](https://disboard.org/servers/tag/dnd), [Discord.me](https://discord.me/servers/tag/ttrpg), [The Hive Index](https://thehiveindex.com/topics/dnd/platform/discord/)

---

## Subreddits

| Subreddit | Est. Members | Audience | Priority |
|-----------|-------------|----------|----------|
| **r/DnD** | ~2.3M | General D&D (players + DMs) | Tier 2 — massive but noisy |
| **r/DMAcademy** | ~654k | DMs seeking advice | Tier 1 — highest DM concentration |
| **r/dndnext** | ~490k | 5e-focused | Tier 2 |
| **r/rpg** | Large | System-agnostic TTRPG | Tier 3 |
| **r/FoundryVTT** | ~78k | Foundry users (technical, module-savvy) | Tier 1 |
| **r/Roll20** | ~50-80k | Roll20 users (community-moderated since 2018) | Tier 3 |
| **r/Solo_Roleplaying** | ~80k | Solo players | Tier 2 — different use case but receptive |
| **r/FantasyGrounds** | Smaller | FG users | Tier 3 |
| **r/TaleSpire** | Unknown | TaleSpire users | Tier 3 |
| **r/OwlbearRodeo** | <10k | Owlbear users | Tier 3 |

*Note: Reddit removed public subscriber counts in Sept 2025. Figures are from third-party trackers.*

---

## Existing AI NPC & Voice Tools (Competitive Landscape)

### Foundry VTT Modules (most developed ecosystem)

| Module | What It Does | Threat Level |
|--------|-------------|--------------|
| **Archive of Voices Pro** | Full AI NPC voice + memory + personality. ElevenLabs TTS. Supports OpenAI, Claude, Gemini. | **Direct competitor** — most feature-complete |
| **Archive of Voices** (free) | GPT-powered text-only NPC dialogue. No voice. | Low — text only |
| **Inworld AI Integration** | Inworld AI + ElevenLabs. Limited to 1 NPC : 1 player. | Medium — limited scope |
| **Nova Multi-AI** | Multiple AI personas + ElevenLabs TTS. | Medium |
| **VoiceGen** | ElevenLabs TTS for token speech. No AI conversation. | Low — TTS only |
| **Vox Ludorum** | Text-to-speech-to-text. | Low |

### Other Platforms
- **TaleSpire:** Basic TTS plugin only (LordAshes). No AI conversation.
- **Owlbear Rodeo:** Theatre! (dialog delivery, not AI). No AI voice extensions.
- **Roll20:** Nothing — closed architecture blocks third-party modules.

### Standalone (VTT-Agnostic)
| Tool | Description |
|------|-------------|
| **Voicemod** | Real-time voice changer (DM's own voice). Not AI conversation. |
| **Kenku FM** | Audio streaming for Discord. Delivery mechanism, not AI. |
| **Inworld AI** | Pivoted to AAA studios (Ubisoft, NVIDIA). Less indie TTRPG focus. |
| **Arcane AI / MythicVoices** | AI voice gen for TTRPG characters. Newer (Jan 2026). |
| **Friends & Fables** | AI Game Master — replaces DM, not assists DM. Different positioning. |

---

## Key Differentiators vs. Archive of Voices Pro

Archive of Voices Pro is the closest competitor. Our advantages:

1. **Full voice conversation loop** — STT → LLM → TTS, not just text-to-TTS
2. **DM remains in full control** — AI executes DM configuration, never decides what to reveal
3. **Knowledge locking** — multi-layer protection (prompt + filtering + topic detection + DM review)
4. **3-layer knowledge hierarchy** — World → Faction → Individual via RAG
5. **Tiered voice providers** — cheap/fast for tavern NPCs, premium for BBEGs
6. **Game mechanics integration** — dice rolls, commerce, information gating

Nobody has shipped the complete DM-controlled voice conversation loop yet. The market has validated demand — existing modules prove people want this — but the execution gap is real.

---

## Outreach Priority Order

### Tier 1 — Build presence here first
1. **Foundry VTT Discord** `#module-development` — Ask technical questions, get feedback from module devs
2. **r/DMAcademy** — Frame as DM pain point discussion, not product pitch
3. **r/FoundryVTT** — Share once you have a prototype or demo video inside Foundry

### Tier 2 — Engage after establishing credibility
4. **The GM Cafe Discord** — Small but pure DM audience
5. **r/DnD** — Demo post once you have video/audio to show
6. **r/Solo_Roleplaying** — Different angle but receptive to AI tools
7. **TaleSpire Discord** — Mod-friendly, less competition

### Tier 3 — Monitor and engage opportunistically
8. **Roll20 subreddit** — Large user base but no integration path
9. **Owlbear Rodeo Discord** — Small but extension-friendly
10. **Alchemy RPG Discord** — Cinematic focus aligns with voice immersion

### Approach Per Channel Type

**Discord servers:** Lower stakes than Reddit. Ask in module-dev or general channels. "I'm exploring building X, would anyone find this useful?" is completely normal.

**Reddit:** Don't pitch. Ask technical questions or discuss the DM pain point. Let people come to you. One subreddit at a time, days apart. Have account history first.

---

## Action Items

- [ ] Search r/FoundryVTT for existing "AI NPC", "NPC voice", "text to speech" threads — see what people have already asked for
- [ ] Install and test Archive of Voices Pro — understand the current best-in-class
- [ ] Join Foundry VTT Discord, post in `#module-development` about technical approach
- [ ] Join The GM Cafe Discord for organic DM conversations
- [ ] Record demo video inside Foundry (tavern map + Mira Ashvane token)
- [ ] Post technical question in r/FoundryVTT (not a pitch — see astroturfing notes)
