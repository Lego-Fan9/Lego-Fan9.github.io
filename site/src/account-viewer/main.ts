import './style.css';
import '/src/nav-bar.css'
import { FillList } from "./listBuilder.ts";
import { cleanAllyCode, wakeServer } from "./requestMaker.ts"
import { Chart } from "chart.js"

wakeServer();

const allyInput = document.getElementById("allyCodeInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitAllyCode") as HTMLButtonElement;
const inputError = document.getElementById("inputError") as HTMLParagraphElement;
const loadingScreen = document.getElementById("loadingScreen") as HTMLElement;
const backBtn = document.getElementById("backToInput") as HTMLButtonElement;

const dashboardSections = document.querySelectorAll<HTMLElement>(
    ".player-info, .stats-grid, .charts-grid, .stats-grid-2, .back"
);

submitBtn.addEventListener("click", async () => {
    const rawInput = allyInput.value.trim();
    const allyCode = cleanAllyCode(rawInput);

    if (!allyCode) {
        inputError.style.display = "block";
        return;
    }

    inputError.style.display = "none";

    (document.querySelector(".allycode-input") as HTMLElement).classList.add("hidden");

    loadingScreen.classList.remove("hidden");

    await FillList(allyCode);

    loadingScreen.classList.add("hidden");
    dashboardSections.forEach(section => section.classList.remove("hidden"));
});

allyInput.addEventListener("keypress", e => {
    if (e.key === "Enter") submitBtn.click();
});

// This formats the allycode in the input box to format 123-456-789
allyInput.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, "").slice(0, 9);

    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
        if (i === 3 || i === 6) formatted += "-";
        formatted += raw[i];
    }

    const prevPos = input.selectionStart || 0;
    let cursorPos = prevPos;
    const diff = formatted.length - input.value.length;
    cursorPos += diff;

    input.value = formatted;
    input.setSelectionRange(cursorPos, cursorPos);
});

window.addEventListener("resize", () => {
    Object.values(Chart.instances).forEach((chart: any) => {
        chart.resize();
    });
});

export function backButton() {
    dashboardSections.forEach(section => section.classList.add("hidden"));

    Object.values(Chart.instances).forEach((chart: any) => chart.destroy());

    (document.querySelector(".allycode-input") as HTMLElement).classList.remove("hidden");

    allyInput.value = "";

    const listsToClear = [
        "mainList",
        "GPList",
        "pipList",
        "modsList",
        "offenseModsList",
        "profileStatList"
    ];

    listsToClear.forEach(id => {
        const ul = document.getElementById(id);
        if (ul) ul.innerHTML = "";
    });
}

backBtn.addEventListener("click", () => {
    backButton();
});