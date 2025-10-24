export interface EventInstance {
  eventInstanceId: string;
  startTime: number;
  endTime: number;
  season: number;
  instanceId: string;
  mode: "3v3" | "5v5";
}

export async function getInstanceIds(roundType: "5v5" | "3v3"): Promise<EventInstance | null> {
    try {
        const resp = await fetch(`https://gahistory.c3po.wtf/${roundType}/info.json`);

        if (!resp.ok) {
            console.error("HTTP error", resp.status, resp.statusText);
            return null;
        }

        const data: EventInstance = await resp.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
}