export interface RecentSearch {
    playerName: string;
    allyCode: string;
    timestamp: number;
}

const STORAGE_KEY = "recentSearches";

export function getRecentSearches(): RecentSearch[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as RecentSearch[];
    } catch {
        return [];
    }
}

export function deleteRecentSearch(allyCode: string): void {
	const existing = getRecentSearches();
	const updated = existing.filter(s => s.allyCode !== allyCode);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function saveRecentSearch(allyCode: string, playerName: string): void {
    const existing = getRecentSearches();

    const filtered = existing.filter(s => s.allyCode !== allyCode);

    filtered.unshift({
        playerName,
        allyCode,
        timestamp: Date.now(),
    });

    const limited = filtered.slice(0, 5);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}

export function checkIfSearchExists(allyCode: string): boolean {
    let recentSearches = getRecentSearches();
    let found = false;
    recentSearches.forEach(search => {
        if (search.allyCode === allyCode) {
            found = true;
        }
    })

    return found;
}