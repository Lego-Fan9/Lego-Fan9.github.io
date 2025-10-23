import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, DoughnutController, PieController } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend, ChartDataLabels, DoughnutController, PieController);

let main = document.querySelector("main") as HTMLElement | null

export function ULLocation(id: string, input: string): void {
    if (!main) {
        document.appendChild(document.createElement("main"));
        main = document.querySelector("main") as HTMLElement;
    }

    const profileStatList = locationListBuilder(id)

    newULEntry(`${id}__item`, input, profileStatList)
}

function locationListBuilder(id: string): HTMLUListElement {
    if (!main) {
        document.appendChild(document.createElement("main"));
        main = document.querySelector("main") as HTMLElement;
    }

    let location = document.getElementById(id) as HTMLUListElement | null;
    if (!location) {
        location = document.createElement("ul");
        location.id = id;
        main.appendChild(location)
    }

    return location
}

function newULEntry(classToAssign: string, input: string, UL: HTMLUListElement): HTMLLIElement {
    let newEntry = document.createElement("li");
    newEntry.classList.add(classToAssign)
    newEntry.textContent = input;
    UL.append(newEntry);
    return newEntry;
}

function makeCanvas(name: string): HTMLCanvasElement {
    if (!main) {
        document.body.appendChild(document.createElement("main"));
        main = document.querySelector("main") as HTMLElement;
    }

    let container = document.getElementById(`${name}-container`);
    if (!container) {
        container = document.createElement("div");
        container.id = `${name}-container`;
        main.appendChild(container);
    }

    let canvas = document.getElementById(name) as HTMLCanvasElement;
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = name;
        container.appendChild(canvas);
    }

    return canvas;
}

export function relicChart(relics: number[]) {
    const canvas = makeCanvas("relicCanvas")

    const data = {
        labels: ["Not Reliced", "Relic 0", "Relic 1", "Relic 2", "Relic 3", "Relic 4", "Relic 5", "Relic 6", "Relic 7", "Relic 8", "Relic 9"],
        datasets: [{
            label: "Relics",
            data: relics,
            backgroundColor: [
                "#e9d5ff",
                "#d8b4fe",
                "#c084fc",
                "#a855f7",
                "#9333ea",
                "#7e22ce",
                "#6b21a8",
                "#581c87",
                "#4c1d95",
                "#3b0764",
                "#2e1065",
            ],
            borderColor: "#ffffff",
            borderWidth: 1.5,
            hoverBackgroundColor: "#a855f7"
        }]
    }

    new Chart(canvas, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Relic Levels", font: { size: 18, weight: 'bold' } },
                datalabels: {
                    anchor: "end",
                    align: "right",
                    color: "black",
                    formatter: (value: number) => value,
                },
            },
        }
    });
}

export function gearChart(gearLevels: number[]) {
    const canvas = makeCanvas("gearCanvas");

    const data = {
        labels: ["Gear 1", "Gear 2", "Gear 3", "Gear 4", "Gear 5", "Gear 6", "Gear 7", "Gear 8", "Gear 9", "Gear 10", "Gear 11", "Gear 12", "Gear 13"],
        datasets: [{
            label: "Gear Levels",
            data: gearLevels,
            backgroundColor: [
                "#fef2f2",
                "#fecaca",
                "#fca5a5",
                "#f87171",
                "#ef4444",
                "#dc2626",
                "#e11d48",
                "#be123c",
                "#b91c1c",
                "#991b1b",
                "#9f1239",
                "#881337",
                "#7f1d1d",
            ],
            borderColor: "#ffffff",
            borderWidth: 1.5,
            hoverBackgroundColor: "#fca5a5"
        }]
    };

    new Chart(canvas, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Gear Levels", font: { size: 18, weight: 'bold' } },
                datalabels: {
                    anchor: "end",
                    align: "right",
                    color: "black",
                    formatter: (value: number) => value,
                },
            },
        }
    });
}

export function starChart(starCounts: number[]) {
    const canvas = makeCanvas("starCanvas");

    const data = {
        labels: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star", "6 Star", "7 Star"],
        datasets: [{
            label: "Star Counts",
            data: starCounts,
            backgroundColor: [
                "#e2e8f0",
                "#cbd5e1",
                "#94a3b8",
                "#60a5fa",
                "#3b82f6",
                "#2563eb",
                "#1d4ed8",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
        }]
    };

    new Chart(canvas, {
        type: 'doughnut',
        data: data,
        options: {
            indexAxis: "y",
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Star Counts", font: { size: 18, weight: 'bold' } },
                datalabels: {
                    anchor: "end",
                    align: "start",
                    offset: 10,
                    color: "black",
                    font: { weight: "bold" },
                    formatter: (value: number) => value,
                },
            },
            maintainAspectRatio: false,
        }
    });
}

export function activeChart(active: number, inactive: number) {
    const canvas = makeCanvas("activeCanvas");

    const data = {
        labels: ["Activated", "Not Activated"],
        datasets: [{
            label: "Unit Activation",
            data: [active, inactive],
            backgroundColor: [
                "#facc15",
                "#d1d5db",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
        }]
    };

    new Chart(canvas, {
        type: 'pie',
        data: data,
        options: {
            rotation: -180,
            indexAxis: "y",
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Activation", font: { size: 18, weight: 'bold' } },
                datalabels: {
                    anchor: "end",
                    align: "start",
                    offset: 10,
                    color: "black",
                    font: { weight: "bold" },
                    formatter: (value: number) => value,
                },
            },
            maintainAspectRatio: false,
        }
    });
}