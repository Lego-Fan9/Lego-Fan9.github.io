export const profileStatMappings: { index: number, displayName: string }[] = [
    {
        "index": 5,
        "displayName": "Fleet Arena Battles Won"
    },
    {
        "index": 6,
        "displayName": "Squad Arena Battles Won"
    },
    {
        "index": 15,
        "displayName": "Successful GAC Defends"
    },
    {
        "index": 17,
        "displayName": "GAC Full Clears"
    },
    {
        "index": 9,
        "displayName": "Galactic Battles Won"
    },
    {
        "index": 10,
        "displayName": "Raids Won"
    },
    {
        "index": 18,
        "displayName": "GAC Undersize Battles Won"
    },
    {
        "index": 8,
        "displayName": "Hard Battles Won"
    },
    {
        "index": 11,
        "displayName": "Guild Tokens Earned"
    },
    {
        "index": 12,
        "displayName": "Gear Donated in Guild Exchange"
    },
    {
        "index": 16,
        "displayName": "Banners Earned"
    },
    {
        "index": 7,
        "displayName": "PVE Battles Won"
    },
    {
        "index": 14,
        "displayName": "GAC Battles Won"
    },
    {
        "index": 19,
        "displayName": "GAC Territories Defeated"
    },
];

export const galacticPowerMappings: { index: number; displayName: string }[] = [
    {
        "index": 1,
        "displayName": "Galactic Power"
    },
    {
        "index": 2,
        "displayName": "Character Galactic Power"
    },
    {
        "index": 3,
        "displayName": "Ship Galactic Power"
    },
];

export const speedModMappings: { min: number, max: number, displayName: string }[] = [
    {
        "min": 26,
        "max": 32,
        "displayName": "27+ Speed Mods"
    },
    {
        "min": 24,
        "max": 26,
        "displayName": "25+ Speed Mods"
    },
    {
        "min": 19,
        "max": 25,
        "displayName": "20+ Speed Mods"
    },
    {
        "min": 14,
        "max": 20,
        "displayName": "15+ Speed Mods"
    },
    {
        "min": 9,
        "max": 15,
        "displayName": "10+ Speed Mods"
    },
    {
        "min": 4,
        "max": 10,
        "displayName": "5+ Speed Mods"
    }
]

export const offenseModMappings: { threshold: number, displayName: string }[] = [
    {
        "threshold": 8,
        "displayName": "8%+ Offense Mods",
    },
    {
        "threshold": 7,
        "displayName": "7%+ Offense Mods"
    },
    {
        "threshold": 6,
        "displayName": "6%+ Offense Mods"
    },
    {
        "threshold": 5,
        "displayName": "5%+ Offense Mods"
    },
    {
        "threshold": 3,
        "displayName": "3%+ Offense Mods"
    },
    {
        "threshold": 1,
        "displayName": "1%+ Offense Mods"
    },
]

export const pipMappings: Record<string, string> = {
    "sixDot": "6 Dot Mods",
    "fiveDot": "5 Dot Mods",
    "other": "1-4 Dot Mods"
}

export const relicMappings: Record<string, string> = {
    "1": "Not Reliced",
    "2": "Relic 0",
    "3": "Relic 1",
    "4": "Relic 2",
    "5": "Relic 3",
    "6": "Relic 4",
    "7": "Relic 5",
    "8": "Relic 6",
    "9": "Relic 7",
    "10": "Relic 8",
    "11": "Relic 9"
}

export const gearMappings: Record<string, string> = {
    "1": "Gear 1",
    "2": "Gear 2",
    "3": "Gear 3",
    "4": "Gear 4",
    "5": "Gear 5",
    "6": "Gear 6",
    "7": "Gear 7",
    "8": "Gear 8",
    "9": "Gear 9",
    "10": "Gear 10",
    "11": "Gear 11",
    "12": "Gear 12",
    "13": "Gear 13"
}

export const rarityMappings: Record<string, string> = {
    "1": "1 Star",
    "2": "2 Star",
    "3": "3 Star",
    "4": "4 Star",
    "5": "5 Star",
    "6": "6 Star",
    "7": "7 Star"
}

export const playerMappings: Record<string, { displayType: number; displayName: string }> = {
    "name": {
        "displayType": 0,
        "displayName": "Player Name",
    },
    "allyCode": {
        "displayType": 0,
        "displayName": "Player Allycode",
    },
    "guildName": {
        "displayType": 0,
        "displayName": "Guild Name",
    },
    "GP": {
        "displayType": 2,
        "displayName": "",
    },
    "modPips": {
        "displayType": 4,
        "displayName": "",
    },
    "speedMods": {
        "displayType": 3,
        "displayName": "",
    },
    "offenseMods": {
        "displayType": 9,
        "displayName": "",
    },
    "relic": {
        "displayType": 5,
        "displayName": "",
    },
    "gear": {
        "displayType": 6,
        "displayName": "",
    },
    "star": {
        "displayType": 7,
        "displayName": "",
    },
    "activated": {
        "displayType": 8,
        "displayName": "",
    },
    "profileStat": {
        "displayType": 1,
        "displayName": "",
    },
    "lastActive": {
        "displayType": 10,
        "displayName": "",
    },
    "GACWins": {
        "displayType": 11,
        "displayName": "",
    }
};