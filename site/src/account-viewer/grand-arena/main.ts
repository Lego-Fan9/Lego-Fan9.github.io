import { getRound } from "./request.ts"
import type { GACResp } from "./request.ts"
import { getPlayerPlayerId } from "../requestMaker.ts"
import type { PlayerResp } from "../requestMaker.ts"
import { galacticPowerMappings } from "../listBuilderMappings.ts"

export let round5v5: GACResp | null = null;
export let round3v3: GACResp | null = null;

async function getData(playerId: string): Promise<void> {
    if (!round5v5 || round5v5.playerId !== playerId) {
        const tempRound5v5 = await getRound(playerId, "5v5");
        if (!tempRound5v5) {
            return;
        }
        round5v5 = tempRound5v5;
    }

    if (!round3v3 || round3v3.playerId !== playerId) {
        const tempRound3v3 = await getRound(playerId, "3v3");
        if (!tempRound3v3) {
            return;
        }
        round3v3 = tempRound3v3;
    }
}

export async function getWins(playerId: string, gp: number): Promise<number | null> {
    await getData(playerId);

    if ((!round5v5 || !round3v3) || (round5v5.playerId !== playerId || round3v3.playerId !== playerId)) {
        console.error("Could not find round 5v5 or round 3v3, exiting")
        return null;
    }

    let winCounter = 0;

    for (const round of round5v5.matchResult) {
        const homeScore = round.home.score;
        const awayScore = round.away.score;

        if (homeScore > awayScore) {
            winCounter++;
            continue;
        }
        if (homeScore === awayScore) {
            let won = await getTieWinner(round.away.playerId, gp);
            if (won) {
                winCounter++;
                continue;
            }
        }
    }

    return winCounter;
}

async function getTieWinner(awayPlayerId: string, homeGP: number): Promise<boolean> {
    const awayProfile: PlayerResp = await getPlayerPlayerId(awayPlayerId);
    let awayGP = 0;
    galacticPowerMappings.forEach(stat => {
        const playerStat = awayProfile.profileStat.find(ps => ps.index === stat.index)
        if (playerStat) {
            awayGP = Number(playerStat.value);
        }
    });
    if (awayGP === 0) {
        console.error("Found a player with 0 GP...");
        return true;
    }

    if (homeGP > awayGP) {
        return true
    }
    return false
}