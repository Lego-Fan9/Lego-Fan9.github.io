import { getPlayer, getUnits } from "./requestMaker.ts";
import type { PlayerResp, UnitsResp } from "./requestMaker.ts";
import { profileStatMappings, playerMappings, galacticPowerMappings, speedModMappings, pipMappings, relicMappings, gearMappings, rarityMappings } from "./listBuilderMappings.ts";
import { getSpeedModCount, getPipCount, countOffensePercentRolls } from "./mods.ts";
import { ULLocation, relicChart, gearChart, starChart, activeChart } from "./locations.ts"
import { getWins } from "./grand-arena/main.ts"
import { getInstanceIds } from "./grand-arena/getRecentRounds.ts"
import { saveRecentSearch } from "./recentSearches.ts"

function handleLastSeen(player: PlayerResp): void {
    let lastSeen = new Date(Number(player.lastActivityTime)).toLocaleString();
    ULLocation("mainList", `Last Seen: ${lastSeen}`);
}

function handleProfileStat(player: PlayerResp): void {
    profileStatMappings.forEach(stat => {
        const playerStat = player.profileStat.find(ps => ps.index === stat.index);
        if (playerStat) {
            ULLocation("profileStatList", `${stat.displayName}: ${Number(playerStat.value).toLocaleString()}`);
        }
    });
}

function handleGP(player: PlayerResp): void {
    galacticPowerMappings.forEach(stat => {
        const playerStat = player.profileStat.find(ps => ps.index === stat.index)
        if (playerStat) {
            ULLocation("GPList", `${stat.displayName}: ${Number(playerStat.value).toLocaleString()}`);
        }
    });
}

function handleGear(player: PlayerResp, units: UnitsResp[]): void {
    let tracker: number[] = [];
    for (let key in gearMappings) {
        let counter = 0;
        player.rosterUnit.forEach(unit => {
            if (unit.currentTier && !checkIfShip(units, unit.definitionId)) {
                if (unit.currentTier === Number(key)) {
                    counter++;
                }
            }
        });
        tracker.push(counter);
    }

    gearChart(tracker);
}

function handleRelics(player: PlayerResp, units: UnitsResp[]): void {
    let tracker: number[] = [];
    for (let key in relicMappings) {
        let counter = 0;
        player.rosterUnit.forEach(unit => {
            if (checkIfShip(units, unit.definitionId)) {
                return;
            }
            if (unit.relic && unit.relic.currentTier) {
                if (unit.relic.currentTier === Number(key)) {
                    counter++;
                }
            }
        });
        tracker.push(counter);
    }
    relicChart(tracker);
}

function handleActivated(player: PlayerResp, units: UnitsResp[]): void {
    let activated = 0, notActivated = 0;
    units.forEach(unit => {
        if (!unit.id.endsWith(":SEVEN_STAR")) {
            return;
        }
        if (!unit.obtainable || unit.obtainableTime != 0) {
            return;
        }
        const trimmed = unit.id.split(":")[0];
        let found = false;
        for (const pUnit of player.rosterUnit) {
            if (pUnit.definitionId.split(":")[0] === trimmed) {
                found = true;
                activated++;
                break;
            }
        }
        if (!found) {
            notActivated++;
            //console.log(`${trimmed} not activated`);
        }
    });

    activeChart(activated, notActivated);
}

function handleSpeedMods(player: PlayerResp): void {
    speedModMappings.forEach(stat => {
        ULLocation("modsList", `${stat.displayName}: ${getSpeedModCount(player, stat.min, stat.max)}`);
    });
}

function handleOffenseMods(player: PlayerResp): void {
    const offenseStats = countOffensePercentRolls(player)
    for (const key in offenseStats) {
        ULLocation("offenseModsList", `${key}: ${offenseStats[key]}`)
    }
}

function handlePips(player: PlayerResp): void {
    const { sixDot, fiveDot, other } = getPipCount(player);

    ULLocation("pipList", `${pipMappings.sixDot}: ${sixDot.toLocaleString()}`);
    ULLocation("pipList", `${pipMappings.fiveDot}: ${fiveDot.toLocaleString()}`);
    ULLocation("pipList", `${pipMappings.other}: ${other.toLocaleString()}`);
}

function handleStars(player: PlayerResp): void {
    let tracker: number[] = [];
    for (let rarity in rarityMappings) {
        let counter = 0;
        player.rosterUnit.forEach(unit => {
            if (unit.currentRarity === Number(rarity)) {
                counter++;
            }
        });
        tracker.push(counter);
    }
    starChart(tracker);
}

function checkIfShip(units: UnitsResp[], defId: string): boolean {
    for (const unit of units) {
        if (unit.id === defId) {
            return unit.combatType === 2;
        }
    }

    console.log(`Unit not found: ${defId}`);
    return false;
}

async function handleGACWins(player: PlayerResp): Promise<void> {
    let gp = 0;
    galacticPowerMappings.forEach(stat => {
        const playerStat = player.profileStat.find(ps => ps.index === stat.index)
        if (playerStat) {
            gp = Number(playerStat.value);
        }
    });
    if (gp === 0) {
        console.error("Found a player with 0 GP...");
        return;
    }

    const wins = await getWins(player.playerId, gp);
    const recent3v3 = await getInstanceIds("3v3");
    const recent5v5 = await getInstanceIds("5v5");
    if (!wins || !recent3v3 || !recent5v5) {
        console.error("Missing wins, recent3v3, or recent5v5 in handleGACWins()");
        return;
    }

    let seasons: number[] = [];
    seasons.push(recent3v3.season);
    seasons.push(recent5v5.season);
    seasons.sort((a, b) => a - b);

    ULLocation("gacInfo", `Wins in seasons ${seasons[0]} and ${seasons[1]}: ${wins}`);
}

export async function FillList(allyCode: string) {
    const units = await getUnits();
    if (!units) {
        console.error(`Failed to get units`)
        return
    }

    const player: PlayerResp = await getPlayer(allyCode);

    for (const playerKey in playerMappings) {
        const key = playerKey as keyof PlayerResp;
        if (!(key in playerMappings)) {
            console.error(`Missing ${key} in playerMappings`)
            continue
        }

        switch (playerMappings[key].displayType) {
            case 0:
                if (playerMappings[key].displayName == "Player Allycode") {
                    ULLocation("mainList", `${playerMappings[key].displayName}: ${Number(player[key]).toLocaleString("en-US").replace(/,/g, "-")}`);
                    break;
                }
                ULLocation("mainList", `${playerMappings[key].displayName}: ${player[key]}`);
                break;
            case 1:
                handleProfileStat(player);
                break;
            case 2:
                handleGP(player);
                break;
            case 3:
                handleSpeedMods(player);
                break;
            case 4:
                handlePips(player);
                break;
            case 5:
                handleRelics(player, units);
                break;
            case 6:
                handleGear(player, units);
                break;
            case 7:
                handleStars(player);
                break;
            case 8:
                handleActivated(player, units);
                break;
            case 9:
                handleOffenseMods(player);
                break;
            case 10:
                handleLastSeen(player);
                break;
            case 11:
                await handleGACWins(player);
                break;
            default:
                console.error(`Found unknown playerMappings key: ${key}`);
        }
    }

    saveRecentSearch(allyCode, player.name);
}