# Real-Time Voice AI API Landscape for Character Roleplay (March 2026)

Research compiled for Zenobits D&D NPC voice roleplay evaluation.

**Key question:** Which voice AI stack gives us the best combination of fantasy character voice variety, real-time latency, emotional expression, and cost-effectiveness for live D&D sessions?

---

## Executive Summary

The voice AI landscape has evolved dramatically since mid-2025. The key findings for a D&D NPC voice product:

1. **PlayHT is dead** -- acquired by Meta in July 2025, all services ceased December 31, 2025. Remove from consideration entirely.
2. **True speech-to-speech (voice in, voice out) is now available** from OpenAI (gpt-realtime) and Hume AI (EVI 3). Most others are TTS-only, requiring a separate STT step.
3. **Fantasy character voice creation is now viable** through prompt-based voice design (Hume, ElevenLabs, Cartesia) and massive voice libraries (ElevenLabs 10K+ voices, Hume 200K+).
4. **Latency is no longer the bottleneck** -- multiple providers hit sub-100ms time-to-first-audio. The bottleneck is now LLM reasoning time.
5. **Cost for a 4-hour D&D session ranges from ~$0.50 to $15** depending on provider and how much voice output is generated.
6. **Open-source models (Sesame CSM, Fish Audio S1-mini, CosyVoice 3, Dia) are catching up fast** but are not yet production-ready for real-time conversational use without significant infrastructure.

---

## Provider-by-Provider Analysis

### 1. ElevenLabs

**Status:** Market leader in TTS quality. Most mature API ecosystem.

| Dimension | Details |
|---|---|
| **Voice variety** | 10,000+ voices in library. Voice Design lets you generate voices from text prompts. 380+ built-in voices across 70+ languages. Dedicated fantasy voice categories (dwarf, elf, etc.) in community library. |
| **Voice cloning** | Instant clone from short audio sample. Professional clone for higher fidelity. Available from Starter plan ($5/mo). |
| **Real-time latency** | Flash v2.5: ~75ms TTFA. Multilingual v2: higher quality but higher latency. WebSocket streaming supported. |
| **Pricing** | Credit-based. Starter $5/mo (10K credits ~20min audio). Pro $99/mo (500K chars). Scale $330/mo (2M chars). Business $1,320/mo (11M chars). Roughly $0.20/1K chars at Scale tier. |
| **Emotional expression** | Multilingual v2 excels at emotional nuance. Flash models trade some expression for speed. |
| **Speech-to-speech** | Yes -- voice changer API and Conversational AI 2.0 platform with speech-to-speech capability. Sub-100ms latency claimed. |
| **API maturity** | Excellent. Well-documented. Python, JS SDKs. WebSocket streaming. RAG integration. Conversational AI agent platform. |
| **D&D suitability** | HIGH. Best voice library for fantasy characters. Community has already created dwarf/elf/orc voices. Conversational AI platform could accelerate development. |

**Estimated 4hr session cost:** $2-8 depending on voice minutes generated and model choice.

**Sources:**
- [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api)
- [ElevenLabs Models Documentation](https://elevenlabs.io/docs/overview/models)
- [ElevenLabs Latency Optimization](https://elevenlabs.io/docs/developers/best-practices/latency-optimization)
- [ElevenLabs Conversational AI 2.0](https://elevenlabs.io/blog/conversational-ai-2-0)
- [ElevenLabs Fantasy Voice Library](https://elevenlabs.io/voice-library/fantasy)

---

### 2. OpenAI Realtime API (Direct)

**Status:** The only provider offering unified LLM + voice in a single model. Speech-to-speech native.

| Dimension | Details |
|---|---|
| **Voice variety** | 13 built-in voices (alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse, marin, cedar). Limited -- not all available in Realtime mode. Custom voices announced but gated behind safety review. |
| **Voice cloning** | Not available for general use. Custom voice program exists but requires approval. |
| **Real-time latency** | Native speech-to-speech -- no separate STT/TTS steps. Sub-second conversational turns. gpt-realtime model optimized for production voice agents. |
| **Pricing** | gpt-realtime: $32/1M audio input tokens, $64/1M audio output tokens. Roughly $0.06/min input, $0.24/min output. Text: $4/1M input, $16/1M output tokens. |
| **Emotional expression** | gpt-4o-mini-tts supports "voice instructions" -- you can prompt HOW to speak (whispering, excited, gruff). This is unique and powerful for character work. |
| **Speech-to-speech** | YES -- native. This is the core differentiator. Single model handles listening, thinking, and speaking. |
| **API maturity** | GA as of August 2025. WebSocket and WebRTC. Well-documented but less battle-tested than ElevenLabs for pure TTS. |
| **D&D suitability** | MEDIUM-HIGH. The voice instruction steerability is excellent for "speak like a gruff dwarf." But only 13 voices means less variety. No voice cloning limits character differentiation. |

**Estimated 4hr session cost:** $5-15 depending on conversation density. More expensive because you're paying for LLM reasoning + audio in one.

**Key advantage:** Zero latency penalty from STT->LLM->TTS pipeline. The model IS the voice.

**Key limitation:** You're locked into OpenAI's LLM. Can't use Claude or another model for reasoning while using their voice. Limited voice selection.

**Sources:**
- [OpenAI Realtime API Guide](https://platform.openai.com/docs/guides/realtime)
- [Introducing gpt-realtime](https://openai.com/index/introducing-gpt-realtime/)
- [OpenAI Next-Gen Audio Models](https://openai.com/index/introducing-our-next-generation-audio-models/)
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing)
- [OpenAI Text to Speech Guide](https://platform.openai.com/docs/guides/text-to-speech)

---

### 3. PlayHT -- DEFUNCT

**Acquired by Meta July 2025. All services ceased December 31, 2025.**

PlayHT was acqui-hired -- Meta absorbed the team into their Superintelligence Labs division for voice features in Meta AI, AI Characters, and wearables. The technology lives on inside Meta's ecosystem but is no longer available as an independent API.

**Do not plan around this provider.**

**Sources:**
- [PlayHT Shutdown Guide](https://gaga.art/blog/playht/)
- [Murf AI PlayHT Migration Guide](https://murf.ai/blog/play-ai-transition-guide)
- [ElevenLabs on PlayHT Shutdown](https://x.com/ElevenLabsDevs/status/1943332745188643084)

---

### 4. Cartesia (Sonic 3)

**Status:** Fastest TTS on the market. Built for real-time gaming use cases.

| Dimension | Details |
|---|---|
| **Voice variety** | Growing voice library. Supports custom voice creation. Voice Changer API for transforming existing audio. 40+ languages with native voices. |
| **Voice cloning** | Instant clone from 3-10 seconds of audio. Pro Voice Cloning for higher fidelity. SSML support for fine control. |
| **Real-time latency** | Industry-leading 40ms TTFA. Claimed "less than 100ms model latency, outperforming next best by 4x." WebSocket streaming. |
| **Pricing** | ~$0.038/1K chars ($38/M chars). Free tier: 10K chars. Starter: $5/mo (100K chars). Growth: $29/mo (500K chars). Scale: $99/mo (2M chars). Pro: $299/mo (8M chars). ~1/5th the cost of ElevenLabs. |
| **Emotional expression** | Sonic 3 has fine-grained emotion control. Laughter, breathing, and emotional inflections built in. SSML tags for directing performance. |
| **Speech-to-speech** | No native speech-to-speech. TTS only. Requires separate STT provider. Has Voice Changer for audio-to-audio transformation. |
| **API maturity** | Good. Python, JS SDKs. WebSocket support. Well-documented. Dedicated gaming page. |
| **D&D suitability** | HIGH. Explicitly markets to gaming. "Design unique NPC dialogues with fantasy accents." Fastest latency means most responsive NPCs. Price is very competitive. |

**Estimated 4hr session cost:** $0.50-3 depending on voice output volume. Very cost-effective.

**Sources:**
- [Cartesia Sonic 3](https://cartesia.ai/sonic)
- [Cartesia Pricing](https://cartesia.ai/pricing)
- [Cartesia Gaming Use Case](https://cartesia.ai/industries/gaming)
- [Cartesia Voice Cloning Docs](https://docs.cartesia.ai/api-reference/voices/clone)
- [Cartesia Sonic 3 API Review](https://www.eesel.ai/blog/cartesia-sonic-3-api)

---

### 5. Hume AI (EVI 3 / Octave)

**Status:** Most expressive voice AI. Unique emotional intelligence. Only true speech-to-speech competitor to OpenAI.

| Dimension | Details |
|---|---|
| **Voice variety** | 200,000+ community-designed voices. Prompt-based voice design ("a gruff pirate with a sarcastic tone"). Save custom voices for reuse. |
| **Voice cloning** | New in EVI 3: clone from 30 seconds of audio. Captures timbre, accent, rhythm, tone, and personality aspects. |
| **Real-time latency** | Conversational latency (not specified in ms, but positioned for real-time dialogue). Octave 2 (TTS) improved speed by 50%. |
| **Pricing** | Free tier available. Starter $3/mo. Creator $14/mo (commercial license). Pro $70/mo (1,200 min included, $0.06/min overage). Scale $200/mo. Business $500/mo. |
| **Emotional expression** | INDUSTRY BEST. EVI detects emotion in user's voice and responds expressively. Wide range of emotions, styles, personality. This is Hume's core differentiator. |
| **Speech-to-speech** | YES -- EVI 3 is a full speech-language model. Speech in, speech out. No separate STT/TTS pipeline needed. Handles transcription, reasoning, and speech generation in one model. |
| **API maturity** | Good and rapidly improving. SDK available. Commercial license from Creator tier. |
| **D&D suitability** | VERY HIGH. The emotional expressiveness is exactly what you need for fantasy NPCs. Prompt-based voice design means "a wise elderly elven sage with a gentle, melodic voice" just works. 200K voices is massive variety. EVI 3 speech-to-speech means players could TALK to NPCs naturally. |

**Estimated 4hr session cost:** $3-14 depending on plan and minutes used. $0.06/min on Pro plan = $14.40 for 240 minutes of continuous audio.

**Key insight for Zenobits:** Hume's voice design prompts are the closest thing to "describe a fantasy character and get a matching voice." This maps perfectly to a DM describing an NPC.

**Sources:**
- [Hume AI EVI 3 Announcement](https://www.hume.ai/blog/announcing-evi-3-api)
- [Hume AI Pricing](https://www.hume.ai/pricing)
- [Hume Voice Design Documentation](https://dev.hume.ai/docs/voice/voice-design)
- [Hume Custom Character Voices Blog](https://www.hume.ai/blog/creating-custom-character-voices-with-ai)
- [Hume Octave TTS Prompting Guide](https://www.hume.ai/blog/octave-tts-prompting-guide)

---

### 6. Rime (Arcana v3 / Mist v2)

**Status:** Enterprise-focused. Strong on creative voice work. Emerging competitor.

| Dimension | Details |
|---|---|
| **Voice variety** | 300+ voices spanning diverse demographics and accents. Arcana v3 beta: generate infinite voices from just a description or fictional name. |
| **Voice cloning** | Professional voice cloning (Business plan $249/mo and up). |
| **Real-time latency** | Mist v2: sub-100ms on-prem, sub-200ms cloud. Arcana: slightly higher latency, optimized for quality. |
| **Pricing** | Free: 10K chars/mo. Starter: $5/mo (100K chars). Developer: $19/mo (500K chars). Pro: $99/mo (3M chars). Business: $249/mo (10M chars). |
| **Emotional expression** | Arcana v3 infers emotion from context. Supports laughter, yawning, whispering, sarcasm, mockery in-line with speech. Code-switching between languages. |
| **Speech-to-speech** | No. TTS only. |
| **API maturity** | Good. Available on Together AI for serverless inference. |
| **D&D suitability** | MEDIUM-HIGH. The "generate voice from description or fictional name" feature in Arcana v3 is intriguing for D&D. Whispering, sarcasm, mockery are useful for NPC personalities. But no speech-to-speech limits interactive potential. |

**Estimated 4hr session cost:** $1-5 depending on output volume.

**Sources:**
- [Rime Pricing](https://rime.ai/pricing)
- [Rime Arcana v3 Launch](https://rime.ai/resources/arcana-v3)
- [Rime Arcana Introduction](https://rime.ai/resources/introducing-arcana)
- [Rime Arcana v3 on Together AI](https://www.together.ai/models/rime-arcana-v3)

---

### 7. Fish Audio (OpenAudio S1)

**Status:** Top-ranked open source TTS. Strong on Asian languages. Rapidly improving.

| Dimension | Details |
|---|---|
| **Voice variety** | 2,000,000+ community voices. Zero-shot cloning from 10-30 seconds audio. Same API for cloned and catalog voices. |
| **Voice cloning** | Excellent. 10-30 seconds of audio, no fine-tuning needed. Captures timbre, style, and emotional tendencies. Instant processing. |
| **Real-time latency** | <100ms latency claimed. Streaming support. Real-time factor 1:5 on RTX 4060, 1:15 on RTX 4090 with acceleration. |
| **Pricing** | Pay-as-you-go, no feature lockout. Plus: 400 min/mo of generation included. Pro plan: 2M credits/mo, up to 54 hours generation. Voice cloning included at same price as regular TTS. |
| **Emotional expression** | OpenAudio S1 is "first TTS model to support open-domain fine-grained emotion control" via explicit emotion markers. Supports angry, sad, excited, surprised, etc. Control speech rate, volume, pauses, laughter via text commands. |
| **Speech-to-speech** | No. TTS only. |
| **API maturity** | Good and improving. Cloud API available. S1-mini (0.5B) open source on HuggingFace for self-hosting. |
| **D&D suitability** | HIGH. Ranked #1 on HuggingFace TTS Arena for naturalness. Fine-grained emotion control is excellent for NPC moods. Open source option means potential for unlimited self-hosted usage. Best value if you can self-host. |

**Estimated 4hr session cost:** $1-4 on cloud API. Near-$0 if self-hosting S1-mini on own GPU.

**Key consideration:** Fish Audio is strongest on Asian languages. English quality is competitive but may not be best-in-class for fantasy character voices.

**Sources:**
- [Fish Audio](https://fish.audio/)
- [Fish Audio S1 Launch Blog](https://fish.audio/blog/introducing-s1/)
- [OpenAudio S1 Overview](https://openaudios1.com/)
- [Fish Audio GitHub](https://github.com/fishaudio/fish-speech)
- [Fish Audio Pricing](https://fish.audio/plan/)

---

### 8. Sesame CSM (Conversational Speech Model)

**Status:** Most human-sounding conversational speech. Open source. NOT production-ready for real-time.

| Dimension | Details |
|---|---|
| **Voice variety** | Limited to conditioned audio samples. No voice library. Generate from reference audio. |
| **Voice cloning** | Condition on audio input to match voice characteristics. |
| **Real-time latency** | PROBLEMATIC. Raw inference is ~6 seconds. Streaming reduces perceived latency to 1-2s. Optimized deployments (Vogent) claim 200-400ms, but community reports "super slow inference." |
| **Pricing** | Free (open source, Apache 2.0 compatible for research). Self-host costs are your GPU costs. CSM-1B needs substantial GPU resources. |
| **Emotional expression** | Exceptional naturalness -- "even audio experts struggle to distinguish from human." Natural hesitations, "umms," and rhythm. But emotion CONTROL is limited vs. directed emotion in commercial APIs. |
| **Speech-to-speech** | No. Audio generation only. Must pair with separate LLM for conversation. |
| **API maturity** | Low. Research release. Community-built APIs exist. Not enterprise-grade. |
| **D&D suitability** | LOW (today). The naturalness is unmatched but it's not ready for real-time interactive use. Could be interesting for pre-generated content or as the tech matures. Watch this space. |

**Sources:**
- [Sesame CSM GitHub](https://github.com/SesameAILabs/csm)
- [Sesame CSM on HuggingFace](https://huggingface.co/sesame/csm-1b)
- [Sesame Crossing the Uncanny Valley](https://www.sesame.com/research/crossing_the_uncanny_valley_of_voice)
- [Deploying CSM as API (Cerebrium)](https://www.cerebrium.ai/articles/deploying-sesame-csm-the-most-realistic-voice-model)
- [CSM Real-time Discussion (GitHub)](https://github.com/SesameAILabs/csm/issues/78)

---

### 9. Other Notable Providers

#### Inworld AI
- **#1 ranked TTS** on Artificial Analysis (ELO 1,160)
- Built specifically for gaming NPCs -- includes behavior, memory, dialogue, and voice in one engine
- $5-10/M characters (25x cheaper than ElevenLabs)
- Voice cloning from 5-15 seconds
- Gaming archetypes built in (sages, soldiers, bosses, sorceresses)
- Sub-250ms latency
- **D&D suitability: VERY HIGH** -- this is literally built for NPC voice. But it's a full NPC engine, not just TTS. May conflict with Zenobits' own platform.
- [Inworld TTS](https://inworld.ai/tts)
- [Inworld 2026 Benchmarks](https://inworld.ai/resources/best-voice-ai-tts-apis-for-real-time-voice-agents-2026-benchmarks)

#### Deepgram Aura-2
- Enterprise-grade TTS focused on voice agents
- Sub-200ms baseline TTFB, 90ms optimized
- $0.030/1K characters
- 40+ English voices, limited language support (7 languages)
- Strong for voice agents but limited voice variety for fantasy characters
- [Deepgram Aura-2](https://deepgram.com/product/text-to-speech)
- [Deepgram Pricing](https://deepgram.com/pricing)

#### Smallest.ai (Lightning)
- World's fastest TTS: sub-100ms, RTF of 0.01
- Runs on consumer hardware (<1GB VRAM, even Raspberry Pi)
- $0.01/min TTS, $0.045/min voice cloning
- Good for edge deployment scenarios
- Limited voice library compared to leaders
- [Smallest.ai Pricing](https://smallest.ai/pricing)
- [Lightning Model](https://smallest.ai/blog/lightning-fastest-text-to-speech-model-by-smallestai)

#### CosyVoice 3 (Open Source, Alibaba)
- 0.5B parameter model, Apache 2.0 license
- 150ms streaming latency
- Zero-shot cross-language voice cloning
- 9 languages, 18 Chinese dialects
- Strong for multilingual, especially Asian languages
- [CosyVoice GitHub](https://github.com/FunAudioLLM/CosyVoice)
- [CosyVoice 3 Overview](https://cosyvoice.org/)

#### Dia (Open Source, Nari Labs)
- 1.6B parameters, Apache 2.0 license
- Generates realistic dialogue from transcripts
- Nonverbal sounds: laughter, coughing, throat clearing
- Voice cloning from seconds of reference audio
- English only
- Requires ~10GB VRAM
- [Dia GitHub](https://github.com/nari-labs/dia)
- [Dia on HuggingFace](https://huggingface.co/nari-labs/Dia-1.6B)

---

## Comparative Analysis

### Latency Ranking (Time to First Audio)

| Provider | TTFA | Notes |
|---|---|---|
| Cartesia Sonic 3 | ~40ms | Fastest in industry |
| ElevenLabs Flash v2.5 | ~75ms | Good quality/speed balance |
| Smallest.ai Lightning | <100ms | Ultra-lightweight |
| Fish Audio S1 | <100ms | With acceleration |
| Deepgram Aura-2 | ~90ms | Optimized config |
| Rime Mist v2 | <200ms | Cloud; <100ms on-prem |
| Inworld TTS | 130-250ms | P90 range |
| CosyVoice 3 | ~150ms | Streaming mode |
| Hume Octave/EVI 3 | Conversational | Not benchmarked in ms |
| OpenAI gpt-realtime | Sub-second | End-to-end including reasoning |
| Sesame CSM | 1-6 seconds | Not production-ready |

### Voice Variety & Fantasy Character Suitability

| Provider | Voice Count | Custom Voice Creation | Fantasy Character Fit |
|---|---|---|---|
| Hume AI | 200K+ designed | Text prompt description | BEST -- "wise elderly elven sage" |
| ElevenLabs | 10K+ library | Text prompt + clone | Excellent -- existing fantasy voices |
| Fish Audio | 2M+ community | Clone from audio | Good -- largest library |
| Inworld | Gaming archetypes | Clone 5-15s audio | Excellent -- built for NPCs |
| Cartesia | Growing library | Clone 3-10s audio | Good -- gaming focus |
| Rime Arcana v3 | 300+ | Description-based (beta) | Promising -- from name/description |
| OpenAI | 13 built-in | Voice instructions | Limited variety, good steerability |
| Deepgram | 40+ English | None | Poor for fantasy |

### True Speech-to-Speech Providers

Only these providers offer native voice-in, voice-out without a separate STT step:

1. **OpenAI gpt-realtime** -- LLM + voice unified. Best if you want OpenAI's reasoning.
2. **Hume AI EVI 3** -- Speech-language model with emotional understanding. Can use any voice.
3. **ElevenLabs Conversational AI** -- Platform combining STT + LLM + TTS with tight integration (technically pipelined but feels unified).

All other providers are **TTS-only** and require a separate STT solution (Deepgram, Whisper, AssemblyAI, etc.) in your pipeline.

### Cost Comparison (Estimated 4hr D&D Session)

Assumptions: ~60 minutes of NPC voice output during a 4-hour session, moderate conversation density.

| Provider | Estimated Cost | Notes |
|---|---|---|
| Inworld TTS | $0.50-1.50 | Cheapest commercial option |
| Smallest.ai | $0.60-2.70 | With voice cloning |
| Cartesia Sonic 3 | $0.50-3.00 | Excellent value |
| Fish Audio | $1-4 | Cloud API |
| Rime | $1-5 | Depends on plan |
| ElevenLabs | $2-8 | Most expensive TTS |
| Hume AI | $3-14 | $0.06/min on Pro |
| OpenAI Realtime | $5-15 | Includes LLM cost |
| Self-hosted open source | ~$0 marginal | GPU infrastructure cost only |

---

## State of the Art: Creating Distinct Fantasy Character Voices

### What Works Today

**1. Prompt-Based Voice Design (Best Approach for D&D)**

The most promising technique for D&D NPCs. Supported by Hume AI and ElevenLabs:

- Write a natural language description: "A deep, gravelly voice of an ancient dwarven smith. Speaks slowly and deliberately, with a Scottish-tinged accent. Prone to grumbling and sighing."
- The model generates a matching voice that can be saved and reused
- This maps perfectly to how DMs think about their NPCs

**2. Voice Instructions / Steerability (OpenAI's Approach)**

OpenAI's gpt-4o-mini-tts and gpt-realtime support "voice instructions" that tell the model HOW to speak:
- "Speak in a low whisper, as if sharing a secret"
- "Sound excited and breathless, like you've been running"
- "Adopt a regal, commanding tone"

This doesn't change the base voice but dramatically alters delivery. Combined with system prompts, this creates convincing character shifts even with limited voice options.

**3. Voice Cloning + Post-Processing**

For specific recurring NPCs:
- Clone a voice actor's sample (3-30 seconds depending on provider)
- Use that clone for a specific NPC throughout a campaign
- Some providers (Cartesia, ElevenLabs) support SSML for fine control over emphasis, pauses, pitch

**4. Emotion Markers / Tags (Fish Audio S1)**

Fish Audio's S1 model supports explicit emotion tags in text:
- `[angry]` "You dare enter my domain!"
- `[whispering]` "The walls have ears..."
- `[laughing]` "Oh, you naive little adventurer..."

This gives programmatic control over NPC emotional delivery.

**5. Pre-Built Archetype Libraries**

Inworld and ElevenLabs offer pre-built character archetypes:
- Sages, soldiers, bosses, sorceresses (Inworld)
- Dwarf, elf, orc, dragon categories (ElevenLabs community)
- Can be used as starting points and customized

### What Doesn't Work Well Yet

- **Consistent voice across long sessions:** Voice drift over extended conversations is still an issue with some models
- **Non-human voices:** Truly alien or monstrous voices (a dragon, a hive-mind) are still hit-or-miss
- **Singing or chanting:** Most TTS struggles with musical delivery (bards, ritual chanting)
- **Accents within fantasy languages:** Speaking Elvish or Dwarvish with consistent phonetics is not supported
- **Real-time voice transformation of DM speech:** Voice changers exist (Voicemod) but quality is noticeably artificial

### Recommended Techniques by Character Type

| Character Type | Best Technique | Recommended Provider |
|---|---|---|
| Gruff Dwarf | Deep voice prompt + Scottish accent instruction | Hume (prompt design) or ElevenLabs (library) |
| Ethereal Elf | Light, melodic voice prompt + slow pacing | Hume (prompt design) |
| Menacing Villain | Low voice clone + [angry]/[whispering] emotion tags | Fish Audio S1 or Cartesia |
| Wise Old Sage | Elderly voice prompt + deliberate pacing | Hume or ElevenLabs |
| Tavern Barkeep | Casual, warm voice + regional accent | ElevenLabs library or Rime Arcana |
| Mysterious Fey | Ethereal, playful voice prompt + emotional range | Hume (best emotional range) |
| Dragon/Monster | Voice modification + reverb/effects post-processing | Cartesia Voice Changer + effects |

---

## Recommendations for Zenobits

### Tier 1: Best Fit for D&D NPC Voice Product

**Hume AI (EVI 3)** -- Top recommendation for the full product vision.
- Prompt-based voice design = DMs describe NPC, get matching voice
- Speech-to-speech means players can talk naturally to NPCs
- Emotional expressiveness is best-in-class for roleplay
- 200K+ voices already designed by community
- $0.06/min is acceptable for the target price point
- Commercial license from $14/mo Creator plan

**ElevenLabs** -- Best for TTS-only approach (DM types, NPC speaks).
- Largest fantasy voice library already exists
- Most mature API and tooling
- Conversational AI platform reduces build effort
- Higher cost but proven reliability

### Tier 2: Strong Alternatives

**Cartesia Sonic 3** -- Best latency and value. If you're building your own pipeline (STT + LLM + TTS), Cartesia's 40ms TTFA and ~1/5th ElevenLabs pricing makes it compelling for the TTS layer.

**Fish Audio S1** -- Best open-source option. If you want to self-host to control costs at scale, S1-mini on your own GPU gives near-zero marginal cost per session.

**Inworld AI** -- Direct competitor risk. Inworld is literally building the AI NPC engine for games. Their TTS is cheapest and top-ranked. But using their full engine would mean competing with your own supplier. Their TTS API alone could be viable.

### Not Recommended

- **OpenAI Realtime** -- Voice selection too limited for character variety. Locks you into OpenAI's LLM. Expensive.
- **Sesame CSM** -- Not production-ready. Watch for future releases.
- **Deepgram** -- Wrong focus (enterprise voice agents, not character voices).
- **PlayHT** -- Dead.

### Suggested Architecture for Zenobits D&D Product

**Option A: Full Speech-to-Speech (Premium Experience)**
```
Player speaks -> Hume EVI 3 (STT + reasoning + expressive TTS in one)
                 OR
Player speaks -> Deepgram STT -> Claude/GPT (reasoning) -> ElevenLabs Conversational AI
```

**Option B: Text-Driven with Voice Output (Simpler, Cheaper)**
```
DM types NPC dialogue -> Cartesia Sonic 3 or Fish Audio S1 (TTS)
                         with pre-configured character voices
```

**Option C: Hybrid (Recommended)**
```
Player speaks -> Deepgram/Whisper (STT, ~$0.006/min)
              -> Claude/GPT with D&D context (reasoning, ~$0.01-0.05/response)
              -> Cartesia or ElevenLabs (TTS with character voice, ~$0.01-0.04/response)

Total pipeline: ~$0.03-0.10 per NPC response
Per 4hr session (est. 200 NPC responses): $6-20
```

---

## Key Takeaways

1. **The voice variety problem is solved.** Between Hume's 200K+ designed voices, ElevenLabs' 10K+ library, and prompt-based voice creation, you can create convincing fantasy character voices today.

2. **Latency is solved for TTS.** Sub-100ms TTFA from multiple providers. The bottleneck is now LLM reasoning time, not voice generation.

3. **Speech-to-speech is emerging but limited.** Only Hume and OpenAI offer true speech-in-speech-out. This is the premium experience but narrows your provider choices.

4. **Cost is viable.** A 4-hour D&D session can cost $3-15 in voice AI, which fits within a $7.99-14.99/mo subscription if sessions are weekly (roughly 4 sessions/month).

5. **Open source is 6-12 months behind commercial.** Fish Audio S1-mini and CosyVoice 3 are impressive but not yet matching commercial quality for English fantasy voices. Worth monitoring for cost reduction at scale.

6. **Inworld is both the best comparison and the biggest competitive threat.** They're building exactly what you'd build, but for AAA games. Their TTS is available separately and is cheapest + top quality.

---

*Research date: March 4, 2026*
*Next update recommended: April 2026 or when any major provider makes a relevant announcement*
