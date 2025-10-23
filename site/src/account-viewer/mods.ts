import type { PlayerResp } from "./requestMaker.ts"
import { offenseModMappings } from "./listBuilderMappings"

export function getSpeedModCount(player: PlayerResp, min: number, max: number): number {
    let counter = 0;
    player.rosterUnit.forEach(unit => {
        unit.equippedStatMod.forEach(mod => {
            mod.secondaryStat.forEach(stat => {
                if (stat.stat.unitStatId === 5) {
                    const speed = stat.stat.unscaledDecimalValue / 1e8;
                    if (min < speed && speed < max) {
                        counter++;
                    };
                };
            });
        });
    });
    return counter;
}

export function getPipCount(player: PlayerResp): { sixDot: number; fiveDot: number; other: number } {
    let sixDotCounter = 0, fiveDotCounter = 0, otherDotCounter = 0;

    player.rosterUnit.forEach(unit => {
        unit.equippedStatMod.forEach(mod => {
            if (mod.definitionId[1] === "6") {
                sixDotCounter++;
            } else if (mod.definitionId[1] === "5") {
                fiveDotCounter++;
            }
            else {
                otherDotCounter++;
            }
        });
    });

    return { sixDot: sixDotCounter, fiveDot: fiveDotCounter, other: otherDotCounter };
}

export function countOffensePercentRolls(player: PlayerResp): Record<string, number> {
    const counts: Record<string, number> = {};
    offenseModMappings.forEach(mapping => {
        counts[mapping.displayName] = 0;
    });

    function processStat(value: number) {
        const val = Math.round(value / 1e6 * 100) / 100;

        let bestMapping = offenseModMappings
            .filter(mapping => val >= mapping.threshold)
            .reduce((prev, curr) => (curr.threshold > prev.threshold ? curr : prev), { threshold: -Infinity, displayName: '' });

        if (bestMapping.threshold !== -Infinity) {
            counts[bestMapping.displayName]++;
        }
    }

    player.rosterUnit.forEach(char => {
        if (!char.equippedStatMod) return;
        char.equippedStatMod.forEach(mod => {
            if (!mod.secondaryStat) return;
            mod.secondaryStat.forEach(statObj => {
                const stat = statObj.stat;
                if (stat.unitStatId === 48) {
                    processStat(Number(stat.unscaledDecimalValue));
                }
            });
        });
    });

    return counts;
}

