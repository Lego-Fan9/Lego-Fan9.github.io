import CryptoJS from "crypto-js";

const SERVER_URL = "https://stats-server.onrender.com/"

async function makeHMACSigCrypto(secret: string, message: string): Promise<string> {
	const enc = new TextEncoder();
	const keyData = enc.encode(secret);

	const key = await crypto.subtle.importKey(
		"raw",
		keyData,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(message));

	const sigBytes = new Uint8Array(sigBuffer);
	const hex = Array.from(sigBytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return hex;
}

async function makeHMACSigCryptoJS(secret: string, message: string): Promise<string> {
	return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
}

async function makeHMACSig(secret: string, message: string): Promise<string> {
	if (crypto.subtle) {
		return makeHMACSigCrypto(secret, message);
	} else {
		return makeHMACSigCryptoJS(secret, message);
	}
}

async function makeAuthHeader(secret: string, user: string, method: string, path: string): Promise<string> {
	const ts = Math.floor(Date.now() / 1000).toString();
	const message = `${user}\n${ts}\n${method}\n${path}`;


	const sig = await makeHMACSig(secret, message);

	return `HMAC user=${user},ts=${ts},sig=${sig}`;
}

export type ProfileStat = {
	value: string;
	index: number;
};

export type SecondaryStat = {
	stat: {
		unitStatId: number;
		unscaledDecimalValue: number;
	};
};

export type EquippedStatMod = {
	secondaryStat: SecondaryStat[];
	definitionId: string;
};

export type RosterUnit = {
	equippedStatMod: EquippedStatMod[];
	purchasedAbilityId: string[];
	definitionId: string;
	currentRarity: number;
	currentTier: number;
	relic: {
		currentTier: number;
	};
};

export type PlayerRating = {
	playerSkillRating: {
		skillRating: number;
	};
	playerRankStatus: {
		leagueId: string;
		divisionId: number;
	};
};

export type PlayerResp = {
	name: string;
	guildName: string;
	allyCode: string;
	playerId: string;
	guildId: string;
	lastActivityTime: string;
	playerRating: PlayerRating
	profileStat: ProfileStat[];
	rosterUnit: RosterUnit[];
};

export type UnitsResp = {
	id: string;
	combatType: number;
	legend: boolean;
	obtainable: boolean;
	obtainableTime: number;
};

export async function getUnitsLegacy(): Promise<any> {
	const header = await makeAuthHeader("It96XCNbCtVhN7Hg+a2cPSJJ7WF7jG6YuBybI1lLS4XykNQwcWm+0fkk2ciKaeLy", "LegoFan9", "GET", "/units");
	//console.log("Authorization:", header);

	try {
		const resp = await fetch(SERVER_URL + "/units", {
			headers: { Authorization: header }
		});

		if (!resp.ok) {
			console.error("HTTP error", resp.status, resp.statusText);
			return null;
		}

		const data = await resp.json();
		//console.log(`Response:\n${JSON.stringify(data, null, 2)}`);
		return data;
	} catch (err) {
		console.error("Fetch failed:", err);
		return null;
	}
}

export async function getUnits(): Promise<UnitsResp[] | null> {
	try {
		const resp = await fetch("https://raw.githubusercontent.com/swgoh-utils/gamedata/refs/heads/main/units.json");

		if (!resp.ok) {
			console.error("HTTP error", resp.status, resp.statusText);
			return null;
		}

		const data = await resp.json();
		return data.data;
	} catch (err) {
		console.error("Fetch failed:", err);
		return null;
	}
}

export async function getPlayer(allyCode: string): Promise<any> {
	const header = await makeAuthHeader("It96XCNbCtVhN7Hg+a2cPSJJ7WF7jG6YuBybI1lLS4XykNQwcWm+0fkk2ciKaeLy", "LegoFan9", "GET", "/player");
	//console.log("Authorization:", header);

	try {
		const resp = await fetch(`${SERVER_URL}/player?allyCode=${allyCode}`, {
			headers: { Authorization: header }
		});

		if (!resp.ok) {
			console.error("HTTP error", resp.status, resp.statusText);
			return null;
		}

		const data = await resp.json();
		//console.log(`Response:\n${JSON.stringify(data, null, 2)}`);
		return data;
	} catch (err) {
		console.error("Fetch failed:", err);
		return null;
	}
}

export async function getPlayerPlayerId(playerId: string): Promise<any> {
	const header = await makeAuthHeader("It96XCNbCtVhN7Hg+a2cPSJJ7WF7jG6YuBybI1lLS4XykNQwcWm+0fkk2ciKaeLy", "LegoFan9", "GET", "/player");
	//console.log("Authorization:", header);

	try {
		const resp = await fetch(`${SERVER_URL}/player?playerId=${playerId}`, {
			headers: { Authorization: header }
		});

		if (!resp.ok) {
			console.error("HTTP error", resp.status, resp.statusText);
			return null;
		}

		const data = await resp.json();
		//console.log(`Response:\n${JSON.stringify(data, null, 2)}`);
		return data;
	} catch (err) {
		console.error("Fetch failed:", err);
		return null;
	}
}

export function cleanAllyCode(input: string): string | null {
	const digitsOnly = input.replace(/\D/g, "");

	if (digitsOnly.length !== 9) {
		return null;
	}

	return digitsOnly;
}

export async function wakeServer(): Promise<boolean> {
	try {
		const resp = await fetch(SERVER_URL + "/Wake")

		if (!resp.ok) {
			console.error("/Wake call failed", resp.status, resp.statusText)
			return false
		}
	} catch (e) {
		console.error("/Wake call failed", e)
		return false
	}

	return true
}