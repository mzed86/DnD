# D&D AI Voice NPC -- Validation Playbook

**Goal:** Make a confident go/no-go decision in 2 weeks, spending < £100.
**Date:** 2026-02-24
**Decision deadline:** 2026-03-10

---

## The 5 Cheapest Validation Moves (Ranked by Signal Strength)

### 1. Talk to the Friend (Cost: £0, Time: 30 min)

This is the single most important step. The friend who suggested D&D triggered this entire exploration. Before anything else, get specifics.

**Questions to ask:**

- "When you said 'minimal but material edits' -- what specifically would need to change?"
- "Have you ever wished for AI-voiced NPCs during a session? What triggered that?"
- "How do you currently handle NPC voices? Do you do accents? Use any tools?"
- "If I showed you a working demo, would you use it in your next session?"
- "Would you pay £8-15/month for this? What would make it worth that?"
- "Do you know 5 other DMs who'd want to try this?"
- "What would make this a gimmick vs. genuinely useful?"

**Strong signal:** They get visibly excited. They volunteer to test it. They name specific NPCs they'd use it for. They introduce you to other DMs.

**Kill signal:** "Yeah it's a cool idea I guess" (polite but not excited). They don't play regularly. They wouldn't pay.

---

### 2. Reddit Posts -- Gauge Demand Without Building Anything (Cost: £0, Time: 2 hrs)

Post in 3-4 subreddits. Don't sell -- ask. Frame as genuine curiosity from someone who builds voice roleplay tech.

#### Post A: r/DMAcademy (~900K members)

> **Title:** DMs who voice their NPCs -- what's your biggest frustration?
>
> I build voice roleplay software (currently for corporate training -- think practicing difficult conversations with AI characters that talk back).
>
> A D&D-playing friend suggested I adapt it so DMs could set up NPCs with distinct AI voices that players can actually talk to during sessions. Like, you define the personality, what they know, what they're hiding, and the AI handles the conversation in character.
>
> Before I go down that rabbit hole -- I'm curious about the actual pain point. DMs who voice NPCs:
>
> - How many distinct voices can you realistically maintain per session?
> - Do you wish you had more distinct NPC voices but can't keep up?
> - Would handing off some NPC conversations to an AI feel like cheating or like relief?
> - What would make something like this useful vs. annoying at your table?
>
> Not selling anything, genuinely trying to understand if this is a real problem or a solution looking for one.

**Engagement thresholds:**
- 50+ upvotes = strong signal
- 20-50 upvotes = moderate signal
- <20 upvotes = weak signal
- 10+ comments saying "I'd use this" = very strong signal
- Majority "this is dumb / AI bad" = kill signal

#### Post B: r/Solo_Roleplaying (~80K members)

> **Title:** Would voice AI change solo RPG for you?
>
> I run a voice AI platform and I'm exploring whether it could work for tabletop RPG. The idea: NPCs that actually talk to you with distinct voices, remember your previous interactions, and stay in character.
>
> For solo players specifically -- would hearing an NPC respond to you in voice (vs. reading text) meaningfully change the experience? Or is text-based AI good enough?
>
> What would you want from something like this that ChatGPT doesn't give you?

#### Post C: r/FoundryVTT (~60K members)

> **Title:** Would you use a Foundry module that gives your NPCs AI voices?
>
> Concept: a module where you configure NPC personality, knowledge, and voice -- then during the session, players click on the NPC token and can have a voice conversation with them. The AI stays in character and responds with a distinct voice.
>
> I already build this kind of thing for corporate training (voice roleplay practice). Wondering if the Foundry community would find it useful or if it'd be a gimmick.
>
> What would it need to do to be worth installing?

#### Post D: r/DnD (~3.5M members)

> **Title:** Players -- would you want to hear your DM's NPCs talk with distinct AI voices?
>
> Imagine: your DM sets up the tavern keeper with a gruff voice, the elf ranger with an ethereal tone, the villain with a menacing rasp. When you interact with them, they respond in real-time voice, in character, remembering your previous conversations.
>
> Would this add to your experience or break immersion? What would make it cool vs. cringe?

**Timing:** Post Monday-Wednesday, 10am-1pm EST (peak Reddit D&D traffic).

---

### 3. Landing Page + Waitlist (Cost: £0-20, Time: 3-4 hrs)

Build a one-page site to capture email addresses. Drive traffic from Reddit posts and the friend's network.

**Use:** Carrd.co (free), or a quick page on zenobits.co.uk/dnd

**Page structure:**

```
HEADLINE: Give your NPCs a voice they'll remember

SUBHEAD: AI-powered NPC voices for tabletop RPG sessions.
Set the personality. Define what they know. Let your players talk to them.

[30-second concept video or 3-panel mockup]

HOW IT WORKS:
1. Create your NPC (personality, voice, knowledge, secrets)
2. Players talk -- the NPC responds in real-time voice
3. Campaign memory -- NPCs remember across sessions

ALREADY BUILT: We run voice roleplay tech for Fortune 500 training.
Now we're bringing it to the table.

COMING SOON
[Email signup: "Get early access"]

"Built by a DM, for DMs" (or similar social proof)
```

**Signal thresholds:**
- Email conversion rate from targeted traffic (Reddit, D&D Discord):
  - >15% = exceptional (build immediately)
  - 10-15% = strong
  - 5-10% = moderate (investigate further)
  - <5% = weak

---

### 4. The 15-Minute Demo Test (Cost: £0, Time: 1-2 hrs)

**You already have the platform.** The fastest way to validate is to show, not tell.

Take the existing Zenobits platform and create one D&D NPC scenario:

**"Grimjaw the Tavern Keeper"**
- Personality: Gruff but kind. Ex-adventurer. Knows local rumors. Hides a gambling debt.
- Voice: Deep, gravelly (pick a voice from your current TTS provider)
- Knowledge: Knows about the missing merchant caravan. Heard strange noises from the old mine. Won't talk about the debt unless pressed.
- Interaction: Player walks in and says "What do you know about the missing caravan?" -- Grimjaw responds in voice, in character.

Record a 60-90 second demo video of this interaction. This becomes:
- The landing page video
- The Reddit post attachment ("here's what it looks like")
- The thing you show the friend
- The thing you show in DM interviews

**This is your strongest validation asset.** A working demo of a D&D NPC having a voice conversation is something no one else can show.

---

### 5. DM Interviews (Cost: £0, Time: 3-5 hrs over 1 week)

Recruit from Reddit responses and the friend's network. Target 10 DMs, aim for 5-7 interviews.

**Screening question:** "Do you DM at least monthly and use any digital tools (VTT, D&D Beyond, etc.)?"

**Interview script (15-20 min):**

```
CONTEXT (2 min)
- How long have you been DMing?
- How often do you run sessions?
- Online, in-person, or hybrid?

CURRENT PAIN (5 min)
- How do you handle NPC voices? Do you do accents/voices?
- What's the hardest part about running NPCs?
- How many distinct NPCs do you typically run per session?
- Have you ever wished you had help with NPC conversations?

SOLUTION FIT (5 min)
- [Show demo video or describe concept]
- What's your honest first reaction?
- Would this be useful in your sessions? Why or why not?
- What would it need to do to be genuinely useful?
- What would make it annoying or break immersion?

WILLINGNESS TO PAY (3 min)
- Do you currently pay for any DM tools? Which ones? How much?
- Would you pay for something like this? How much per month?
- What's your total monthly spend on D&D tools?

CLOSING (2 min)
- On a scale of 1-10, how likely would you be to try this?
- Would you want to be a beta tester?
- Do you know other DMs who'd be interested?
```

**Signal thresholds:**
- 7+/10 DMs rate interest 7+ out of 10 = strong signal
- 5+/10 say they'd pay £5+/month = strong signal
- 3+/10 actively ask "when can I try this?" = very strong signal
- <3/10 interested = kill signal

---

## Decision Matrix (2-Week Deadline: March 10)

| Signal | Score |
|--------|-------|
| Friend is excited, offers to test, connects you to DMs | +3 |
| Reddit posts get 50+ upvotes with "I'd use this" comments | +3 |
| Landing page converts >10% to waitlist | +2 |
| 5+ DMs score 7+/10 interest in interviews | +3 |
| 3+ DMs say they'd pay £8+/month | +2 |
| Demo video gets strong reactions ("this is amazing") | +2 |
| **Total possible** | **+15** |

| Total Score | Decision |
|-------------|----------|
| **10-15** | GO. Build v1 in 2 weeks. Target UK Games Expo. |
| **6-9** | EXTEND. Run 2 more weeks of validation. Adjust positioning. |
| **3-5** | PAUSE. Interesting but not compelling. Revisit in Q3. |
| **0-2** | KILL. Not a market. Park permanently. |

---

## Negative Signals to Watch For

These override positive signals:

- **"Cool idea but I'd never actually use it in a session"** -- excitement without intent
- **"I'd use it for solo play but not with my group"** -- narrows the market significantly (still viable, just different)
- **"Only if it's free"** -- no willingness to pay = no business
- **"My players would hate this"** -- player resistance is a DM blocker
- **"This already exists, it's called [X]"** -- missed competitor (investigate immediately)
- **"Latency would kill it"** -- technical dealbreaker if your demo can't show <3s response time

---

## Budget

| Item | Cost |
|------|------|
| Reddit posts | £0 |
| Friend conversation | £0 |
| Landing page (Carrd.co) | £0-9/mo |
| Demo video (screen recording) | £0 |
| DM interviews (video calls) | £0 |
| Optional: Coffee for in-person DM chats | £20-30 |
| Optional: Small Reddit ad to drive traffic | £50-100 |
| **Total** | **£0-140** |

---

## Week-by-Week Timeline

### Week 1 (Feb 24 - Mar 2)

| Day | Task | Time |
|-----|------|------|
| Mon | Call the friend. Get specifics. | 30 min |
| Tue | Build the Grimjaw demo on Zenobits platform. Record video. | 2-3 hrs |
| Wed | Write and post Reddit posts (r/DMAcademy, r/Solo_Roleplaying). | 1 hr |
| Thu | Build landing page with demo video + waitlist. | 2-3 hrs |
| Fri | Post in r/FoundryVTT, r/DnD. Share landing page in Reddit comments. | 1 hr |
| Sat-Sun | Monitor Reddit engagement. Respond to comments authentically. | 30 min/day |

### Week 2 (Mar 3 - Mar 9)

| Day | Task | Time |
|-----|------|------|
| Mon | Review Reddit results. Compile engagement data. | 1 hr |
| Mon-Wed | Run 5-7 DM interviews (recruited from Reddit + friend). | 3-5 hrs |
| Thu | Compile interview data. Score against decision matrix. | 2 hrs |
| Fri | Check landing page conversion rate. Final signal assessment. | 1 hr |

### March 10: Decision Day

Score the signals. Make the call. Document the decision.

---

## What "Good" Looks Like vs What "Bad" Looks Like

### Good (Score 10+):

> "The Reddit post in r/DMAcademy hit 200 upvotes. 30+ comments saying 'shut up and take my money.' The demo video made 3 DMs ask to beta test immediately. 6/7 interviewed DMs rated interest 8+/10 and 4 said they'd pay £10/month. Friend is all-in and recruited 4 DM friends. Landing page converted at 14%."
>
> **Decision: BUILD IT.**

### Bad (Score 0-2):

> "Reddit post got 15 upvotes and the top comment was 'just do the voices yourself, that's half the fun.' Only 2 DMs agreed to interview and both said 'cool tech but I wouldn't use it.' Friend was lukewarm when pressed on specifics. Landing page converted at 2%."
>
> **Decision: KILL IT. Park permanently. Focus elsewhere.**

### Ambiguous (Score 4-7):

> "Reddit was mixed -- 60 upvotes but comments split between 'amazing' and 'AI ruins D&D.' 4/6 DMs were interested but only 2 would pay. Solo players were more excited than group DMs. Landing page at 7%."
>
> **Decision: PIVOT THE ANGLE. Consider solo play as the wedge instead of DM augmentation. Run 2 more weeks testing that positioning.**

---

*This playbook is designed to be executed by one person in their spare time alongside other work. Total time commitment: ~15-20 hours over 2 weeks. Total cost: under £100.*
