# Demo Character Research: Mira Ashvane

**Context:** Zenobits validation sprint - landing page demo for D&D AI NPC demand testing
**Decision:** Female tavern keeper/info broker chosen over Grimjaw (from playbook)

## Why Mira Over Grimjaw
- #1 DM pain point: most DMs are male, struggle voicing female NPCs
- Demonstrates AI voice range better than generic gruff male
- Blocks "just do a deep voice yourself" objection
- Layers (secrets, emotional shifts, pushback) showcase AI capabilities fast

## Character Summary
- Mid-40s, The Brine & Barrel (dockside tavern)
- Warm alto, confident, unhurried, slight rasp
- Retired smuggler, owes debt to crime lord Vellus Kaine
- Knows: missing ship Aldara's Promise, corrupt harbormaster, hooded figure "Renn"
- TTS: ElevenLabs "mature female, warm, confident, slight rasp" / OpenAI `nova` or `shimmer`

## Demo Interactions
1. "The Rumor" - personality + knowledge (player asks for news, Mira hooks with more)
2. "The Secret" - emotional range + info hiding (guarded → vulnerable on Renn reveal)
3. "The Pushback" - NPC boundaries (player threatens, Mira stands firm)

## Landing Page Format
10s setup → 45s main interaction → 15s contrast voice → 10s CTA (~80s total)

## Prompt Engineering (OpenAI Cookbook)
- See `/research/npc-system-prompt-engineering.md` for full techniques
- Key patterns: markdown sections, 1-3 sentence limit, sample phrases as length anchors, explicit knowledge boundaries, conversation phases with exit conditions, pronunciation guides, CAPITALIZED critical rules, variety constraints
