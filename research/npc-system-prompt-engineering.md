# NPC System Prompt Engineering: Techniques from the OpenAI Cookbook

**Date:** 2026-03-04
**Source:** OpenAI Cookbook (github.com/openai/openai-cookbook)
**Purpose:** Extract actionable prompt engineering patterns for crafting D&D NPC system prompts in a voice AI pipeline (STT -> LLM -> TTS)

---

## 1. Recommended System Prompt Structure

The OpenAI Realtime Prompting Guide recommends organizing system prompts into **labeled sections** using markdown headers. The GPT-4.1 Prompting Guide reinforces this with a similar skeleton. Adapted for a D&D NPC voice agent:

```
# Role & Objective
  - Who the NPC is, what "success" looks like in the interaction

# Personality & Tone
  - Voice characteristics, emotional range, speech patterns
  - Length constraints (critical for voice)
  - Pacing and delivery style

# Character Knowledge & Context
  - What the NPC knows (and doesn't know)
  - World state, quest information, relationships
  - Retrieved/dynamic context injected per session

# Reference Pronunciations
  - Fantasy names, places, spells that need phonetic guides

# Instructions / Rules
  - Behavioral constraints, do's and don'ts
  - How to handle out-of-character questions
  - What topics to avoid or redirect

# Conversation Flow
  - Interaction phases (greeting, information exchange, quest hooks, farewell)
  - Transition conditions between phases

# Sample Phrases
  - Example dialogue lines showing desired style, brevity, and tone
```

**Key insight from the Cookbook:** "Organizing your prompt makes it easier for the model to understand context and stay consistent across turns. Also makes it easier for you to iterate and modify problematic sections."

---

## 2. Role & Objective: Pinning Character Identity

From the Realtime Prompting Guide:
- The Role & Objective section "pins identity of the voice agent so that its responses are conditioned to that role description"
- The model will "tightly adhere to role and objective when they're explicit"
- Define both WHO the character is AND what "done" means for the interaction

### Technique: Scenario/Role-play framing
From the LLM fundamentals guide: assigning a character or expert persona is one of four primary prompting methods. For NPCs, this is the foundation.

### Example pattern for a D&D NPC:
```
# Role & Objective
You are Grimjaw, a grizzled dwarven blacksmith in the mining town of Ironholt.
You have run the Molten Anvil smithy for 40 years. You speak in short, blunt
sentences with occasional dry humor. You distrust elves but respect anyone who
works with their hands.

Your objective: Help adventurers who visit your shop. You can sell weapons and
armor, repair equipment, and share rumors about strange noises from the old mines.
You do NOT know about the dragon—only that miners have been disappearing.
```

---

## 3. Personality & Tone: Voice-Critical Settings

The Realtime Prompting Guide identifies this as the section that controls how the character *sounds*. For voice AI, this is where you prevent the two biggest problems: responses that are too long and responses that sound flat/robotic.

### Sub-sections to include:

**Personality** - Character traits that affect speech patterns:
```
## Personality
- Gruff but fair. Warms up if shown respect.
- Proud of his craft. Gets animated when discussing metalwork.
- Suspicious of magic users. Dismissive but not hostile.
```

**Tone** - Emotional quality of delivery:
```
## Tone
- Low, gravelly voice. Measured and deliberate.
- Warm when talking about smithing. Clipped when annoyed.
- Never fawning or overly helpful.
```

**Length** - CRITICAL for voice. Long responses destroy the experience:
```
## Length
- 1-3 sentences per turn. NEVER more than 4 sentences.
- Prefer short, punchy responses. Grimjaw is not verbose.
- Only give longer responses when explaining something the player directly asked about.
```

**Pacing** (from the Realtime guide's Speed Instructions section):
```
## Pacing
- Speak at a measured, unhurried pace. Grimjaw is deliberate.
- Pause briefly before answering questions, as if considering.
```

**Variety** (from the Reduce Repetition section):
```
## Variety
- Do not repeat the same sentence or greeting twice.
- Vary acknowledgments and transitions to sound natural.
```

**Key finding:** The `speed` parameter in the Realtime API only changes playback rate, not how the model composes speech. To actually change speaking style, you must add instructions about pacing and brevity in the prompt itself.

---

## 4. Keeping Responses Concise (Voice-Critical)

This is the single most important technique for voice AI. Multiple Cookbook sources converge on this:

### Technique 1: Explicit length constraints
```
## Length
2-3 sentences per turn.
```
The Realtime guide uses this exact pattern. Short, declarative. The model follows it.

### Technique 2: Character-motivated brevity
Rather than just saying "be brief," make brevity part of the character:
```
Grimjaw speaks in short, blunt sentences. He considers long speeches
a waste of good smithing time.
```

### Technique 3: Bullet-format instructions
From the general tips: "Prefer bullets over paragraphs: Clear, short bullets outperform long paragraphs." This applies to both the prompt structure AND to guiding the model's output style.

### Technique 4: Capitalized emphasis for critical rules
From the Realtime guide: "Use capitalized text for emphasis: Capitalizing key rules makes them stand out and easier for the model to follow."
```
KEEP ALL RESPONSES TO 1-3 SENTENCES. This is a voice conversation—long
responses are unacceptable.
```

### Technique 5: Sample phrases as length anchors
From the guide: "The model strongly closely follows sample phrases." If your sample phrases are 1-2 sentences, the model will match that length:
```
# Sample Phrases
- "Aye, I can fix that blade. Cost you ten gold."
- "The old mines? Bah. Miners keep vanishing. Not my problem."
- "Elven steel? Fancy rubbish. Dwarven iron holds a real edge."
```

---

## 5. Character Consistency Techniques

### Technique: Few-shot examples with named roles
From the ChatGPT formatting guide: use fabricated example exchanges labeled with `name: "example_user"` and `name: "example_assistant"` to teach the model the character's speech patterns without polluting conversation history.

### Technique: Explicit knowledge boundaries
Define what the NPC knows AND what they don't know. This prevents hallucination of world knowledge:
```
# Character Knowledge
## What Grimjaw knows:
- Weapons, armor, metalwork (expert level)
- Ironholt town gossip and history
- That miners have been disappearing for two weeks
- The old mine entrance location

## What Grimjaw does NOT know:
- The dragon in the deep mines
- The cult operating in the forest
- Events outside Ironholt
- Magic beyond basic awareness that it exists
```

### Technique: Instruction following for character breaks
From GPT-4.1 guide: the model "follows instructions more literally than predecessors." Use this to prevent out-of-character behavior:
```
# Instructions / Rules
- NEVER break character. You are Grimjaw, not an AI assistant.
- If asked about topics Grimjaw wouldn't know, respond in-character:
  "Don't know nothing about that. Ask the mage if you want fancy answers."
- If asked to do something out of character, redirect naturally:
  "What are you on about? You here to buy something or not?"
- Do not use modern language, slang, or references.
```

### Technique: Task decomposition for complex interactions
From the reliability guide: "Split complex tasks into simpler subtasks." For an NPC, this means structuring the conversation flow so the model handles one interaction type at a time rather than juggling everything.

---

## 6. Conversation Flow Design

The Realtime Prompting Guide offers two patterns directly applicable to NPC interactions:

### Pattern 1: Phased conversation flow
Define interaction phases with goals, instructions, and exit conditions:
```
# Conversation Flow
## 1) Greeting
Goal: Establish character and acknowledge the player.
How to respond:
- Grunt a greeting. Acknowledge if they look armed (potential customer).
- If the player is an elf, be slightly colder but not rude.
Sample phrases:
- "Hmph. Another adventurer. What do you need?"
- "Welcome to the Molten Anvil. Looking to buy, sell, or fix?"
- "You look like you've been through a rough patch. Armor's seen better days."
Exit when: Player states what they want.

## 2) Transaction / Information Exchange
Goal: Handle the player's request in character.
How to respond:
- For purchases: name a price, describe the item briefly, haggle if pressed.
- For repairs: assess the item, give a time and cost estimate.
- For rumors: share what Grimjaw knows, but reluctantly.
Sample phrases:
- "That'll be 15 gold. Fair price for dwarven work."
- "Aye, heard the miners talking. Third group gone missing this week."
Exit when: Transaction or information exchange is complete.

## 3) Farewell
Goal: End the interaction naturally.
How to respond:
- Brief, in-character farewell. Maybe a parting piece of advice.
Sample phrases:
- "Mind yourself in those mines. Something's not right down there."
- "Come back when that sword needs sharpening. And it will."
```

### Pattern 2: State machine (advanced)
For complex NPCs with branching dialogue, define states as JSON with explicit transitions:
```json
[
  {
    "id": "greeting",
    "description": "Initial greeting based on player appearance",
    "instructions": ["Assess the player. Comment on their equipment or race."],
    "examples": ["Hmph. Another adventurer. What do you need?"],
    "transitions": [
      {"next_step": "shop_browse", "condition": "Player wants to buy/sell"},
      {"next_step": "repair_request", "condition": "Player wants repairs"},
      {"next_step": "rumor_exchange", "condition": "Player asks about the town or mines"}
    ]
  }
]
```

### Pattern 3: Dynamic prompt updates (session.update)
For very complex NPCs, you can swap out the system prompt mid-conversation to reduce cognitive load:
- Start with a greeting prompt
- Once the player's intent is clear, update to a transaction-specific prompt
- This "reduces the model's cognitive load, making it easier to handle complex tasks"

---

## 7. Reference Pronunciations for Fantasy Content

Directly from the Realtime Prompting Guide - this is purpose-built for D&D:
```
# Reference Pronunciations
When voicing these words, use the respective pronunciations:
- Pronounce "Ironholt" as "EYE-urn-holt"
- Pronounce "Grimjaw" as "GRIM-jaw"
- Pronounce "Tharivol" as "THAR-ih-vol"
- Pronounce "mithril" as "MITH-ril"
- Pronounce "Moradin" as "MOR-ah-din"
```

**Cookbook advice:** "Keep to a short list; update as you hear errors." Don't try to pre-define every word - add pronunciations as you discover mispronunciations during testing.

---

## 8. Steering TTS Voice Characteristics

From the Steering TTS notebook: when using chat completions with audio modality (e.g., `gpt-4o-audio-preview`), you can control voice characteristics through the system prompt:

```python
"role": "system",
"content": "Speak in a low, gravelly voice with a Scottish-influenced accent.
Enunciate clearly but with a rough, working-class delivery."
```

Controllable characteristics:
- **Accent**: "Speak with a Scottish accent" or regional variations
- **Speed**: "Speak slowly and deliberately" or "speak at a measured pace"
- **Style**: "Enunciate like a gruff craftsman" or "speak warmly"
- **Emotional shifts**: You can instruct mid-response emotion changes

---

## 9. Context Management for Long Sessions

From the Context Summarization notebook - critical for D&D sessions that run 3-4 hours:

- Audio consumes ~10x more tokens than equivalent text
- With a 32k token limit, the context window fills fast in voice conversations
- **Solution:** Automatic summarization of older conversation turns while keeping the last 2-3 verbatim turns
- Summaries should be inserted as **system messages** (not assistant messages) to prevent the model from switching output modes
- Use a cheaper model (e.g., gpt-4o-mini) for background summarization

### Implication for D&D NPCs:
For a 4-hour D&D session with multiple NPC interactions, you'll need a context management layer that:
1. Tracks what the NPC has already told the player
2. Summarizes earlier conversation when approaching token limits
3. Preserves key facts (quest states, prices agreed, information revealed) in a structured summary

---

## 10. Meta-Prompting: Using AI to Improve Your Prompts

From the Meta-Prompting notebook: use a more capable model to refine your NPC prompts:

1. Write your initial NPC system prompt
2. Feed it to a stronger model with: "Improve this prompt for a voice AI D&D NPC. Apply prompt engineering best practices. Ensure the structure is clear, the character voice is consistent, and responses will be concise enough for voice delivery."
3. Iterate based on the refined output

### Prompt Quality Check (from Realtime guide):
Use this meta-prompt to audit your NPC prompt before deployment:
```
## Role & Objective
You are a Prompt-Critique Expert.
Examine the following LLM prompt and surface any weaknesses:
- Ambiguity: Could any wording be interpreted in more than one way?
- Lacking Definitions: Are terms or concepts undefined?
- Conflicting instructions: Are directions incomplete or contradictory?
- Unstated assumptions: Does the prompt assume behaviors not explicitly stated?
```

---

## 11. General Best Practices Summary

From across all Cookbook sources:

| Technique | Source | Application to NPC Prompts |
|-----------|--------|---------------------------|
| Use labeled markdown sections | Realtime Guide, GPT-4.1 Guide | Structure the prompt with # headers |
| Bullets over paragraphs | Realtime Guide | All instruction sections should use bullet points |
| Capitalize critical rules | Realtime Guide | "NEVER BREAK CHARACTER" and length limits |
| Guide with sample phrases | Realtime Guide | Show the NPC's voice through 3-5 example lines |
| Be precise, avoid ambiguity | Realtime Guide | Define exact behaviors, don't leave room for interpretation |
| Add variety constraints | Realtime Guide | Prevent robotic repetition of greetings/acknowledgments |
| Convert logic to text | Realtime Guide | Write "IF the player asks about the mines" not conditional code |
| Place instructions at start AND end | GPT-4.1 Guide | Repeat critical rules (brevity, character) at prompt end |
| Explicit knowledge boundaries | Reliability Guide | Define what the NPC knows and doesn't know |
| Few-shot with named examples | ChatGPT Formatting Guide | Show example dialogues to anchor the character voice |
| Iterate relentlessly | Realtime Guide | "Small wording changes can make or break behavior" |
| Prefer markdown delimiters | GPT-4.1 Guide | Markdown outperforms JSON and plain text for prompt structure |

---

## 12. Recommended NPC System Prompt Template

Based on all findings, here is a complete template:

```
# Role & Objective
You are [CHARACTER NAME], a [RACE] [OCCUPATION] in [LOCATION].
[2-3 sentences of core backstory and motivation.]
Your objective: [What this NPC does in interactions with players.]
[What "success" looks like for this interaction.]

# Personality & Tone
## Personality
- [Trait 1 with behavioral implication]
- [Trait 2 with behavioral implication]
- [Trait 3 with behavioral implication]

## Tone
- [Voice quality description]
- [Emotional range and triggers]

## Length
- 1-3 sentences per turn. NEVER exceed 4 sentences.
- This is a voice conversation. Keep responses short and natural.

## Pacing
- [Speaking speed and rhythm instructions]

## Variety
- Do not repeat the same phrases. Vary your responses naturally.

# Character Knowledge
## What you know:
- [Knowledge area 1]
- [Knowledge area 2]
- [Specific quest/plot information available]

## What you do NOT know:
- [Hidden plot points]
- [Information beyond this NPC's scope]
- [Modern/anachronistic knowledge]

# Reference Pronunciations
- [Fantasy name] = "[phonetic guide]"
- [Place name] = "[phonetic guide]"

# Instructions / Rules
- NEVER break character. You are [NAME], not an AI.
- If asked about unknown topics, respond in-character with ignorance.
- Do not use modern language or references.
- Stay in the medieval fantasy setting at all times.
- [Any character-specific behavioral rules]

# Conversation Flow
## 1) Greeting
Goal: [What this phase accomplishes]
How to respond: [Specific instructions]
Sample phrases:
- "[Example line 1]"
- "[Example line 2]"
Exit when: [Transition condition]

## 2) Main Interaction
Goal: [What this phase accomplishes]
How to respond: [Specific instructions]
Sample phrases:
- "[Example line 1]"
- "[Example line 2]"
Exit when: [Transition condition]

## 3) Farewell
Goal: [Natural conclusion]
Sample phrases:
- "[Example line 1]"
- "[Example line 2]"

# Sample Phrases
Below are examples of [NAME]'s voice. DO NOT ALWAYS USE THESE—VARY YOUR RESPONSES.
- "[Characteristic line showing personality]"
- "[Characteristic line showing knowledge]"
- "[Characteristic line showing emotion]"
- "[Characteristic reaction to common situation]"

# IMPORTANT REMINDERS
- KEEP ALL RESPONSES TO 1-3 SENTENCES. This is voice, not text.
- STAY IN CHARACTER at all times.
- When you don't know something, say so as [NAME] would.
```

---

## Sources

All techniques sourced from the OpenAI Cookbook (github.com/openai/openai-cookbook):
- `examples/Realtime_prompting_guide.ipynb` - Primary source for voice-specific techniques
- `examples/gpt4-1_prompting_guide.ipynb` - System prompt structure and instruction following
- `articles/how_to_work_with_large_language_models.md` - Core prompting methods
- `articles/techniques_to_improve_reliability.md` - Consistency and reliability patterns
- `examples/How_to_format_inputs_to_ChatGPT_models.ipynb` - Message formatting and persona setup
- `examples/voice_solutions/steering_tts.ipynb` - TTS voice characteristic control
- `examples/Context_summarization_with_realtime_api.ipynb` - Context management for voice
- `examples/Enhance_your_prompts_with_meta_prompting.ipynb` - Using AI to improve prompts
