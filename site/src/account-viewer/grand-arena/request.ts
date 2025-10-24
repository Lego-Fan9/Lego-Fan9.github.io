export interface GACResp {
  matchResult: MatchResult[];
  territoryMapId: string;
  eventInstanceId: string;
  league: string;
  startTime: number;
  endTime: number;
  date: string;
  mode: string;
  season: number;
  playerId: string;
}

export interface MatchResult {
  attackResult: AttackResult[];
  matchId: number;
  home: PlayerSummary;
  away: PlayerSummary;
  matchState: number;
}

export interface PlayerSummary {
  playerName: string;
  playerId: string;
  score: string;
}

export interface AttackResult {
  duelResult: DuelResult[];
  zoneId: string;
}

export interface DuelResult {
  defenderUnit: Unit[];
  attackerUnit: Unit[];
  startTime: string;
  endTime: string;
  battleOutcome: number;
  defenderDatacron: Datacron;
  attackerDatacron: Datacron;
}

export interface Unit {
  definitionId: string;
  healthPercent: number;
  shieldPercent: number;
  squadUnitType: number;
  relicTier: number;
  tier: number;
  rarity: number;
  level: number;
}

export interface Datacron {
  tag: string[];
  affix: Affix[];
  id: string;
  setId: number;
  templateId: string;
  highestTierApplied: number;
}

export interface Affix {
  tag: string[];
  targetRule: string;
  abilityId: string;
  statType: number;
  statValue: string;
  requiredUnitTier: number;
  requiredRelicTier: number;
  scopeIcon: string;
}

export async function getRound(playerId: string, roundType: "5v5" | "3v3"): Promise<GACResp | null> {
    try {
        const resp = await fetch(`https://gahistory.c3po.wtf/${roundType}/${playerId}.json`);

        if (!resp.ok) {
            console.error("HTTP error", resp.status, resp.statusText);
            return null;
        }

        const data: GACResp = await resp.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
}