// Core data model types — see technical-spec.md §3 for full documentation

// === Voice ===

export type VoiceTier = "quick" | "standard" | "premium";
export type VoiceProvider = "cartesia" | "hume" | "elevenlabs" | "openai";

export interface VoiceConfig {
  tier: VoiceTier;
  provider: VoiceProvider;
  voiceDescription?: string;
  voiceId?: string;
  cloneAudioUrl?: string;
  speed?: number;
  stability?: number;
  defaultEmotion?: string;
}

// === NPC ===

export type NPCStatus = "alive" | "dead" | "missing" | "imprisoned" | "unknown";
export type VocabularyLevel = "simple" | "common" | "educated" | "archaic" | "scholarly";

export type LockType =
  | "never"
  | "dm_command"
  | "skill_check"
  | "item_shown"
  | "faction_membership"
  | "trust_threshold"
  | "quest_complete"
  | "custom";

export interface LockedItem {
  id: string;
  content: string;
  unlockType: LockType;
  skill?: string;
  dc?: number;
  itemName?: string;
  factionId?: string;
  trustThreshold?: number;
  questFlag?: string;
  customCondition?: string;
  unlocked: boolean;
  unlockedAt?: string;
  deflection: string;
}

export interface Lie {
  id: string;
  claim: string;
  truth: string;
  detectDc: number;
  tells: string[];
  caughtResponse: string;
}

export interface Relationship {
  targetType: "npc" | "faction" | "location" | "party";
  targetId: string;
  targetName: string;
  relationshipType: string;
  description: string;
  disposition: number;
  knownToParty: boolean;
}

export interface NPCSpeech {
  tone: string;
  accent?: string;
  vocabulary: VocabularyLevel;
  catchphrases: string[];
  quirks: string[];
  styleNotes: string;
}

export interface NPCPersonality {
  traits: string[];
  motivation: string;
  currentGoal: string;
  fears: string[];
  flaws: string[];
  moralAlignment?: string;
  temperament: string;
}

export interface ShopItem {
  name: string;
  description?: string;
  basePriceGp: number;
  quantity: number | "unlimited";
  rarity: string;
  notes?: string;
}

export interface CommerceConfig {
  isMerchant: boolean;
  shopType: string;
  inventoryMode: "fixed" | "generated" | "hybrid";
  fixedItems?: ShopItem[];
  inventoryTags?: string[];
  inventoryRarityCap: string;
  priceModifier: number;
  haggleDc: number;
  haggleAllowed: boolean;
  maxHaggleAttempts: number;
  buysItems: boolean;
  buyPriceModifier: number;
  buyCategories: string[];
  specialStock?: string;
  reputationDiscounts: boolean;
}

export interface NPC {
  id: string;
  campaignId: string;
  name: string;
  race: string;
  class?: string;
  age: string;
  gender: string;
  appearance: string;
  occupation: string;
  currentLocationId?: string;
  status: NPCStatus;
  voice: VoiceConfig;
  personality: NPCPersonality;
  speech: NPCSpeech;
  factionIds: string[];
  personalKnowledge: string[];
  secrets: string[];
  lockedKnowledge: LockedItem[];
  lies: Lie[];
  relationships: Relationship[];
  partyDisposition: number;
  dispositionModifiers: string[];
  commerce?: CommerceConfig;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// === Game Mechanics ===

export type ResultTier =
  | "critical_success"
  | "strong_success"
  | "success"
  | "partial_failure"
  | "hard_failure";

export interface RollResult {
  skill: string;
  dc: number;
  roll: number;
  resultTier: ResultTier;
  natural20: boolean;
  natural1: boolean;
}

// === Session ===

export interface InteractionLog {
  id: string;
  npcId: string;
  timestamp: string;
  playerInput: string;
  npcResponse: string;
  dmWhisper?: string;
  rollResult?: RollResult;
  informationRevealed: string[];
  liesTold: string[];
  promisesMade: string[];
  dispositionChange: number;
}

// === DM Commands (WebSocket messages) ===

export type DMCommand =
  | { type: "whisper"; text: string }
  | { type: "roll"; result: RollResult }
  | { type: "switch_npc"; npcId: string }
  | { type: "mute" }
  | { type: "unmute" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "set_mood"; mood: string; disposition: number }
  | { type: "unlock_knowledge"; lockedItemId: string }
  | { type: "end_conversation" }
  | { type: "cancel_response" };

export type ServerEvent =
  | { type: "transcript"; text: string; isFinal: boolean }
  | { type: "npc_response_text"; text: string; npcId: string }
  | { type: "npc_response_audio"; audio: string; npcId: string } // base64 audio chunk
  | { type: "npc_response_done"; npcId: string }
  | { type: "alert"; alertType: string; message: string; details?: unknown }
  | { type: "cost_update"; sessionCost: number }
  | { type: "npc_switched"; npcId: string; npcName: string }
  | { type: "error"; message: string };
