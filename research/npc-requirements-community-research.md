# What DMs & Players Actually Need from AI NPCs
## Community Research - March 2026

Research compiled from Reddit (r/DnD, r/DMAcademy, r/dndnext), D&D Beyond Forums, EN World, Angry GM, Sly Flourish, RPGnet, and the UC Berkeley DnD NPC AI project.

---

## 1. NPC Knowledge Hierarchy

### World-Level Knowledge (What ALL NPCs Share)

Every NPC in a setting shares a baseline of "common knowledge" -- things that are "commonly communicated between groups." This includes:

- **Geography**: Where the nearest town is, what road leads where, basic lay of the land
- **Common threats**: What goblins look like, sound like, common tactics they use when raiding -- "fairly common threats so details about them might be well known"
- **Calendar & seasons**: Harvest times, festival dates, seasonal patterns
- **Basic religion**: Names of major gods, local temples, common prayers
- **Recent major events**: Wars, plagues, regime changes -- "people communicate and common threats are likely to be passed along through word of mouth"
- **Currency & trade basics**: What things cost roughly, who trades with whom

**Key insight**: Common knowledge is context-dependent. A city dweller "might not know a lot about the wilderness" while a villager might have "a lot of rumors about monsters that are half truths." Magic "may be somewhat common in the game but that doesn't make it common knowledge -- otherwise wizards, paladins, warlocks wouldn't need special training."

### Faction-Level Knowledge (Guild/Group Secrets)

Factions serve as a "color coding" system for NPCs so DMs don't have to "go through the rigmarole of establishing motives and goals every time the players meet someone." Faction knowledge includes:

- **Secret signs and passwords**: Faction agents "know secret signs and passwords to identify operatives"
- **Safe houses and resources**: Agents "can provide access to hidden safe houses, free room and board"
- **Political allegiances**: Each faction has "public and secret goals, long-term visions, and current objectives"
- **Faction secrets**: "Can be used as long-term campaign reveals that reward player investigation"
- **Guild rules and economics**: "Guilds might charge dues or they might take a cut of your business or dictate specific rules for how you can do business"
- **Internal politics**: Adventures can involve "unveiling secrets and potential betrayals within the factions themselves"

**Key design implication**: An AI NPC needs to know which faction it belongs to and what information that faction would and would NOT share with outsiders. The faction membership IS the access control layer.

### Individual NPC Knowledge (Personal History & Secrets)

World Anvil's character template -- the industry standard for NPC tracking -- reveals what DMs consider important for individual NPCs:

**Mental characteristics**: Personal morality, intellect, accomplishments & failures, education, sexuality, personal history, intellectual characteristics, motivation, taboos

**Personality**: Vices & flaws, ticks & quirks, savvies & ineptitudes, likes & dislikes, virtues & perks, hygiene

**Social**: Speech patterns (tone, pitch, accent, dialect, impediments, catch phrases, common phrases, compliments, insults, greetings, farewell, swearing, metaphors), wealth, contacts, family ties, religious views, social aptitude, mannerisms, hobbies

**Relationships**: Type of relationship (brother, friend, rival), how much two characters like or dislike each other, linked to other NPCs, factions, and locations

**The d100 NPC Secrets List**: The community resource "d100 Secrets Your NPC Knows" from Dump Stat Adventures shows that individual NPCs carry specific plot-relevant secrets that are the core currency of information exchange in D&D.

### How DMs Currently Manage NPC Knowledge

**Tools used (in rough order of popularity)**:
1. **OneNote** -- free, notebook-style, favored for treating notes "like an actual notebook"
2. **Notion** -- templating features for standardized NPC pages
3. **World Anvil** -- wiki-style with hyperlinking between NPCs, factions, locations; character articles with sections for relationships, locations
4. **Kanka.io** -- create locations and add characters to those locations
5. **Obsidian** -- free, good for "showing links between notes"
6. **Index cards** -- physical cards organized in groups like "NPCs/Current," "NPCs/Dead," "NPCs/Inactive"
7. **Google Docs / Spreadsheets** -- simple lists and tracking documents

**Organisation strategies vary**: Some DMs organize alphabetically, others by species, by importance, by city, or by campaign relevance. "No single wrong approach."

**Key pain point**: After sessions, DMs need to update NPC records with what was said, current opinion of the party, and any new information revealed. This is manual and often forgotten. As one system puts it: DMs maintain "general information like NPC names with their current opinion on the party next to them."

---

## 2. Game Mechanics Integration

### Social Skill Checks with NPCs

The core D&D social skills that interact with NPCs:
- **Persuasion** (Charisma) -- convincing NPCs through logic, flattery, or charm
- **Deception** (Charisma) -- lying to NPCs convincingly
- **Intimidation** (Charisma) -- threatening or coercing NPCs
- **Insight** (Wisdom) -- detecting whether an NPC is lying or hiding something

**DC Guidelines** (from community consensus):
- DC 10: Easy -- NPC is already inclined to help
- DC 13-15: Medium -- NPC needs a reason
- DC 17-20: Hard -- NPC is hostile or the ask is significant
- DC 25: Very hard -- nearly impossible persuasion
- DC 30: Legendary -- "intimidating a demon lord"

**Critical design insight**: "The intent is to capture the DC of the situation, not the people in it. If someone is hostile, getting them to be somewhat friendly requires DC 20."

### How DMs Handle "Roll vs. Roleplay"

The community is split, but the dominant approach is a **hybrid model**:

1. Players roleplay the conversation first
2. If the argument is genuinely compelling, some DMs skip the roll entirely or grant advantage
3. If the DM is "on the fence," they call for a roll
4. The roll determines degree of success, not binary pass/fail

**Contested rolls**: Deception is commonly contested against Insight ("Insight is literally designed to detect the use of that skill"). Persuasion and Intimidation are typically against a set DC.

### Graduated Success / Degrees of Success

The community widely uses (or wants) graduated outcomes beyond simple pass/fail:

| Result | Social Outcome |
|--------|---------------|
| **Success And** (beat DC by 10+) | NPC gives everything plus a bonus -- extra information, a discount, a favor |
| **Success** (beat DC by 5+) | NPC cooperates fully |
| **Success But** (beat DC by 0-4) | NPC helps, but needs something in return -- "sweeten the deal" with a bribe, collateral, or service |
| **Failure** (miss DC by 1-4) | NPC declines but isn't hostile -- partial info like "I heard a rumour but I don't have much hope" |
| **Failure And** (miss DC by 5+) | NPC becomes hostile, closes off, or raises alarm |

**Design implication for AI NPCs**: The system should accept a "roll result + DC" input and adjust NPC response accordingly. This is NOT a binary gate -- it is a spectrum of cooperation.

### Commerce & Shopping Mechanics

**Haggling mechanics in practice**:
- Players roll Charisma (Persuasion) or Charisma (Deception)
- Typical DC range: 13-17, adjusted for item rarity
- Discount tiers: Beat DC = 10% off; beat DC by 5 = base price; beat DC by 10 = 5% below base
- Context matters: "An exclusive or despised shopkeeper makes negotiation very hard, while a well-liked reputation or naive yokel makes it easy"
- Merchants can reflect party reputation: "Famous heroes might receive discounts; evil characters might face higher prices or refusals to sell"
- **Key limit**: "If a customer keeps trying to haggle after the shopkeeper says the price is final, the shopkeeper will tell them to get out"

**What shopkeepers know and sell depends on location**: "In big cities anything goes within reason, but in small farming villages the shopkeeper has general goods and likely not much more."

### Quest Giving & Information Revelation

**How DMs gate information through NPCs**:
- NPC knows exactly where the MacGuffin is, but the villain has threatened to kill their family
- NPC doesn't speak the PCs' language -- can show the way but can't answer verbal questions
- NPC is drunk/senile/confused and gives unreliable partial information
- NPC is loyal to a faction and won't betray them without extraordinary persuasion
- NPC wants something in return (favor economy)

**Design insight**: "NPCs can lie, and players might try to catch them in lies using Deception and Bluff mechanics." An AI NPC needs to be able to lie convincingly while having a hidden "truth" state that can be revealed through successful skill checks.

---

## 3. Session Flow

### How DMs Introduce NPCs Mid-Session

- NPCs are most commonly introduced as **pacing tools**: "If the party is floundering around town with no clear purpose, you can step in with an NPC and give them one"
- DMs prepare NPC notes before sessions: "Spend a few minutes reviewing or thinking about your NPCs before sessions"
- Quick NPC creation uses "3-5 separate adjectives and maybe a catchphrase or two" -- this allows "consistent improvisation and usually creates a memorable character"
- For unexpected NPCs (players talk to someone unplanned): DMs need to "come up with key personality traits in the bathroom before the interaction"

### NPC Switching Speed

**The core challenge**: DMs switch between NPCs constantly during social scenes. In a tavern alone, players might interact with the barkeeper, a mysterious stranger, a serving girl, and a drunk guard -- all within minutes.

- DMs differentiate NPCs through "mannerisms" rather than distinct voices: "Selecting one thing to signify a given character and doing it whenever speaking as that character"
- Word choice and vocabulary are used instead of accent changes
- "Speech patterns give NPCs their own unique voices without actually doing accents or major vocal changes"

**Design implication for AI NPCs**: The tool must support near-instant NPC switching. If there is any noticeable delay when switching from the barkeeper to the mysterious stranger, it breaks the scene. This is arguably the hardest technical requirement.

### Typical NPC Interaction Length

Based on community reports:
- **Quick NPC scene** (shopkeeper, guard, quest pickup): 2-5 minutes
- **Standard social encounter** (information gathering, negotiation): 15-30 minutes
- **Major NPC roleplay** (key plot NPC, emotional scene): 30-60+ minutes
- **Percentage of session**: In a 4-hour session, groups typically do 2 NPC roleplay scenes + investigation + exploration + 2 combats. Roleplay easily consumes 30-50% of non-combat time.

**A social encounter "can take 15-30 minutes" and "giving information without the requirement to spend time digging it out of an NPC can clip a good 15-30 minutes."**

### Between-Session NPC Interactions

This is an **established demand** in the D&D community:

- **"Blue booking"**: Players write out side interactions with NPCs between sessions; DM includes these in canon
- **Discord roleplay**: One-on-one text or voice chat between DM and player "over lunch, coffee, or during a walk"
- **Asynchronous downtime**: "Downtime works well with asynchronous gameplay since specific time isn't as important in downtime as it is with combat"
- **Prompt-driven exploration**: DM gives prompts for players to "fill out some of their backstory, drives, motivations, or character development"

**Design implication**: This is a massive opportunity for AI NPCs. Between sessions, the DM is unavailable but players want to continue interacting with NPCs. An AI NPC that can handle between-session conversations -- shopping, relationship building, information gathering, downtime activities -- solves a real problem that currently has no good solution.

---

## 4. DM Pain Points with NPCs

### Voice Fatigue

- "Voices are becoming more and more of a problem" in the DM community
- "Not everyone that uses voices should be doing it, and no one should be forced or feel compelled to do a voice"
- New DMs feel particular pressure: "Already operating at the edges of your comfort zone, feeling obligated to add in things that you are not comfortable with will reduce your enjoyment"
- Voice work is physically exhausting over 3-4 hour sessions with multiple characters

**Current workarounds** (what AI voice could replace):
- Using mannerisms instead of voices -- "selecting one thing to signify a given character"
- Word choice and vocabulary differentiation
- Speech patterns without accent changes
- Some DMs simply don't do voices at all and describe how NPCs speak in third person

### Consistency Between Sessions

- Remembering what an NPC said in previous sessions is a major challenge
- DMs maintain "general information like NPC names with their current opinion on the party"
- Notes help "track NPC and organization names over a long campaign"
- Index cards, notebooks, and digital tools are all attempts to solve this
- **The core problem**: Human memory is fallible, and most DMs don't have time to write detailed post-session notes for every NPC interaction

### Improvising When Players Go Off-Script

- "Building a scene around the expectation that players will act in a particular way is inherently fragile"
- DMs "end up entirely off-track when players fall in love with an improvised NPC they've just made up, more so than NPCs carefully developed beforehand"
- For unplanned NPCs, DMs need to "come up with key personality traits in the bathroom before the interaction"
- Sometimes "Bob the innkeeper just needs to be what they are -- you only need to think about hobbies or personal motivations if these become conversation topics"

### Making Mundane NPCs Interesting

The community has extensive advice on making shopkeepers memorable:
- Give them "big personalities, varied inventory, and unpredictable developments"
- Add "irritation" -- "perhaps they talk too slowly or too quickly, ignore certain members of the group, be too loud or mumble"
- Know what the NPC wants beyond the transaction
- Give them "a reason not to engage in a never-ending social encounter"
- Have exclusive items or information available only through specific NPCs
- Connect merchants to their products -- "a potion trader enjoys making potions and identifying mystery potions"

**Key insight**: The community already has frameworks for making NPCs interesting. The problem is execution -- doing it consistently for dozens of NPCs across many sessions.

---

## 5. What Would Make DMs NOT Use AI NPCs

### Loss of Creative Control (CRITICAL)

This is the number one concern:
- "If you rely on AI to make that world, then the world will never be yours"
- "RPing NPCs is fun" -- many DMs explicitly enjoy this part and don't want to outsource it
- AI should provide "suggestions, not decisions, leaving the DM in full control"
- Players don't want "trading effort and creativity for convenience"
- MIT research cited: those who relied on AI "had low cognitive performance scores" and "were less satisfied with their work"
- Using AI compared to "never taking off the training wheels of a bike"

**Design implication**: The DM must be able to override, redirect, pause, or correct the AI NPC at any moment. The AI is a voice, not a brain. The DM remains the intelligence behind the NPC.

### NPCs Revealing Plot Secrets (CRITICAL)

- AI systems can "completely forget how towns looked, what NPCs existed there, and promised rewards"
- The inverse is equally dangerous: AI making up information the DM hasn't authorized
- "Instructions emphasize avoiding informing players to prevent spoilers"
- An NPC that reveals the BBEG's plan because it wasn't properly constrained would be session-destroying

**Design implication**: The NPC must have a hard boundary on what it can and cannot reveal. This is not just prompt engineering -- it requires a structured knowledge system with explicit "locked" information that only unlocks based on DM action or successful skill checks.

### Breaking Immersion with Wrong Tone/Knowledge

- The output is described as "somewhere between generic and clearly derivative"
- AI is "heavily weighted to give permissive/positive responses" -- breaking character for hostile NPCs
- AI "tends to contradict itself the longer it goes"
- "Pretty prose from a soulless machine" -- the uncanny valley of NPC dialogue
- NPCs that break character by using modern language, referencing things outside the setting, or being inappropriately helpful

### Latency and Technical Friction (CRITICAL)

- "Speed of service remains a challenge, especially in very dynamic interactions or rapid conversations" (UC Berkeley research)
- Any noticeable delay breaks the flow of a live tabletop session
- DMs need to switch between NPCs in seconds, not minutes
- Technical setup and troubleshooting during a session is unacceptable -- "the session must be frictionless"

### Memory and Consistency Failures

- "AI has a horrible memory and would make the most inconsistent campaigns"
- "Completely forgetting how towns looked, what NPCs existed there, and promised rewards when moving between locations"
- Current LLMs "lack consistency and go off the rails after brief interactions"
- "Cannot handle nuance required for complex storytelling scenarios"

### Ethical Concerns

- Training data licensing: AI should only use data "specifically licensed by the creator for LLM training, fully owned by WotC, or public domain"
- Community resistance to corporate AI: Hasbro's AI push "created a fundamental disconnect with players"
- "A large segment of players have consistently made it clear that they don't want generative AI in games"

---

## 6. The Opportunity Gap: What the Community Actually Wants

Based on this research, the sweet spot for AI NPCs is NOT replacing the DM's creative control but rather:

### Tier 1: High Demand, Low Resistance
- **Voice generation for NPC dialogue the DM has already decided** -- DM types/speaks what the NPC says; AI provides a distinct voice
- **Between-session async NPC conversations** -- players can chat with NPCs between sessions within DM-defined boundaries
- **NPC consistency tracking** -- remembering what was said in previous sessions automatically
- **Mundane NPC voicing** -- shopkeepers, guards, tavern patrons where the DM doesn't want to spend creative energy

### Tier 2: Medium Demand, Medium Resistance
- **AI-assisted NPC improvisation** -- AI generates NPC responses based on DM-defined personality, knowledge, and constraints; DM can approve/modify before delivery
- **Graduated response based on dice rolls** -- AI adjusts NPC cooperation level based on skill check results
- **Commerce automation** -- handling shopping interactions with predefined inventory and pricing rules

### Tier 3: High Demand But High Resistance
- **Fully autonomous NPC roleplay** -- AI handles NPC conversation without DM intervention
- **Quest giving and plot-critical information** -- AI decides what to reveal based on context
- **AI determining NPC emotional reactions** -- AI decides whether NPC is offended, pleased, suspicious

### The Critical Design Principle

**"AI is a tool for the DM, not a replacement for the DM."**

The DM must always feel like they are controlling the NPC through the AI, not that the AI is controlling the NPC independently. The mental model should be: "The AI is my voice actor and my memory, but I am the NPC's mind."

---

## 7. Prior Art: UC Berkeley DnD NPC AI Project

The most relevant technical precedent is the [UC Berkeley School of Information DnD NPC AI project](https://www.ischool.berkeley.edu/projects/2024/dnd-npc-ai) (2024):

**Architecture**: RAG (Retrieval Augmented Generation) system with three components:
1. **QDrant vector store** -- character backstories + interaction logs (NPC memory)
2. **MongoDB** -- catalog of available characters
3. **Llama 3 70B Instruct** -- generates contextual responses

**Interface**: Discord bot with FastAPI endpoints for character management, rules lookup, and voice-to-text transcription.

**Key findings**:
- "DMs do not have to think as quickly or be as creative in highly specific NPC interactions" -- reduced cognitive load
- "LLM does not, without prompt or other interjection, 'move the story' along or take actions" -- AI NPCs are reactive, not proactive
- "Speed of service remains a challenge, especially in very dynamic interactions"
- Immersion testing showed NPCs could maintain backstory consistency when tested with targeted questions
- Rules lookup worked well for simple questions, struggled with edge cases

**Implication for Zenobits**: The RAG architecture validates the knowledge hierarchy approach. Character backstory + interaction history as vector embeddings, with faction/world knowledge as contextual retrieval, is the right technical direction.

---

## Sources

- [D&D Beyond Forum: "Assuming a WoTC AI is coming, what do and don't we want from it?"](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/194035-assuming-a-wotc-ai-is-coming-what-do-and-dont-we)
- [D&D Beyond Forum: "How to handle the PC's General Knowledge of the realm?"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/96838-how-to-handle-the-pcs-general-knowledge-of-the)
- [D&D Beyond Forum: "How do you track your NPCs?"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-guild/160980-how-do-you-track-your-npcs)
- [D&D Beyond Forum: "How to do the voices?"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/107309-how-to-do-the-voices)
- [D&D Beyond Forum: "Persuasion, DC or roll"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/46620-persuasion-dc-or-roll)
- [D&D Beyond Forum: "Roleplaying Social Interaction: choosing between calculated DCs, fixed/passive DCs, or contested rolls"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/194989-roleplaying-social-interaction-choosing-between)
- [D&D Beyond Forum: "Haggling and items"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/43203-haggling-and-items)
- [D&D Beyond Forum: "PACING: how much does your group get done per session?"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/125008-pacing-how-much-does-your-group-get-done-per)
- [D&D Beyond Forum: "Should I use AI for DnD?"](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/227534-should-i-use-ai-for-dnd)
- [D&D Beyond Forum: "Researching Voice Tools"](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/180095-researching-voice-tools-and-willing-to-create-one)
- [EN World: "Integrating AI NPCs into Your Campaign"](https://www.enworld.org/threads/integrating-ai-npcs-into-your-campaign.697981/)
- [EN World: "AI Has Completely Spoiled Dungeons & Dragons for Me"](https://www.enworld.org/threads/ai-has-completely-spoiled-dungeons-dragons-for-me-%E2%80%94-i-can%E2%80%99t-go-back-to-human-dms.718219/)
- [UC Berkeley: DnD NPC AI Project](https://www.ischool.berkeley.edu/projects/2024/dnd-npc-ai)
- [Sly Flourish: Roleplaying Between Sessions](https://slyflourish.com/roleplaying_between_sessions.html)
- [The Angry GM: Help! My Players are Talking to Things!](https://theangrygm.com/help-my-players-are-talking-to-things/)
- [The Angry GM: The Unexpected NPC](https://theangrygm.com/the-unexpected-npc/)
- [The Angry GM: Resistance is Futile (Factions)](https://theangrygm.com/resistance-is-futile/)
- [Red Ragged Fiend: Add Degrees of Success & Failure](https://www.redraggedfiend.com/add-degrees-of-success-failure-to-your-game/)
- [World Anvil: Character Template](https://www.worldanvil.com/w/WorldAnvilCodex/a/character-template)
- [World Anvil: Campaign Manager Features](https://www.worldanvil.com/features/dnd-campaign-manager)
- [LitRPG Reads: The Secret to Making D&D Factions Work](https://litrpgreads.com/blog/rpg/the-secret-to-making-dd-factions-work)
- [Dump Stat Adventures: d100 Secrets Your NPC Knows](https://dumpstatadventures.com/the-gm-is-always-right/d100-secrets-your-npc-knows)
- [Wargamer: Generative AI might make DMing DnD easier, but at what cost?](https://www.wargamer.com/dnd/why-you-should-not-use-ai-dm-tools)
- [Wargamer: AI is perfect for lazy DnD players and precisely no one else](https://www.wargamer.com/dnd/ai-useful-and-useless)
- [Master The Dungeon: Role Playing a Shopkeeper](https://www.masterthedungeon.com/role-playing-a-shopkeeper/)
- [DnDspeak: 100 Interesting Shopkeepers and Merchants](https://www.dndspeak.com/2018/12/08/100-interesting-shopkeepers-and-merchants/)
- [Dungeon Master's Vault: How to Successfully Haggle with NPCs](https://www.dungeonmastersvault.com/2024/06/28/how-to-successfully-haggle-with-npcs-in-dd/)
- [Roleplaying Tips: Practical Methods for Making NPCs Come Alive](https://www.roleplayingtips.com/rptn/rpt114-practical-methods-making-npcs-come-alive/)
- [The Gamer: Best Tips for Voicing NPCs](https://www.thegamer.com/dungeons-dragons-tips-voicing-npcs/)
- [CharGen: Best Free D&D AI Tools](https://char-gen.com/blogs/best-free-dnd-ai-tools)
- [Inworld AI](https://inworld.ai/)
- [Convai](https://www.convai.com/)
