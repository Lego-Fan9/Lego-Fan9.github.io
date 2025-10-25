import './style.css';
import '/src/nav-bar.css'
import { FillList } from "./listBuilder.ts";
import { cleanAllyCode, wakeServer } from "./requestMaker.ts"
import { Chart } from "chart.js"
import { getRecentSearches } from "./recentSearches.ts";
import {populateTermsModal} from "./terms.ts"

wakeServer();

const allyInput = document.getElementById("allyCodeInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitAllyCode") as HTMLButtonElement;
const inputError = document.getElementById("inputError") as HTMLParagraphElement;
const loadingScreen = document.getElementById("loadingScreen") as HTMLElement;
const backBtn = document.getElementById("backToInput") as HTMLButtonElement;
const recentSearchList = document.getElementById("recentSearchList") as HTMLUListElement;
const noRecent = document.getElementById("noRecent") as HTMLParagraphElement;
const termsModal = document.getElementById("termsModal") as HTMLElement;
const acceptBtn = document.getElementById("acceptTerms") as HTMLButtonElement;
const closeBtn = document.getElementById("closeTerms") as HTMLButtonElement;
const openTerms = document.getElementById("openTerms") as HTMLAnchorElement;

const dashboardSections = document.querySelectorAll<HTMLElement>(
    ".player-info, .stats-grid, .charts-grid, .stats-grid-2, .back" //, .gac-info
);

const urlParams = new URLSearchParams(window.location.search);

const TERMS_VERSION = "v0"

submitBtn.addEventListener("click", async () => {
    const termsVersion = localStorage.getItem("acceptedTerms");
    if (termsVersion !== TERMS_VERSION) {
        const agreed = await showTermsModal();
        if (!agreed) {
            alert("You must agree to the terms to use this site.");
            return;
        }
    }

    const rawInput = allyInput.value.trim();
    const allyCode = cleanAllyCode(rawInput);

    if (!allyCode) {
        inputError.style.display = "block";
        return;
    }

    inputError.style.display = "none";

    (document.querySelector(".allycode-input") as HTMLElement).classList.add("hidden");
    (document.querySelector(".recent-searches") as HTMLElement).classList.add("hidden");

    loadingScreen.classList.remove("hidden");

    await FillList(allyCode);

    const url = new URL(window.location.href);
    url.searchParams.set("p", allyCode);
    window.history.replaceState({}, "", url.toString());

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
    (document.querySelector(".recent-searches") as HTMLElement).classList.remove("hidden");

    allyInput.value = "";

    const listsToClear = [
        "mainList",
        "GPList",
        "pipList",
        "modsList",
        "offenseModsList",
        "profileStatList",
        "recentSearchList"
    ];

    listsToClear.forEach(id => {
        const ul = document.getElementById(id);
        if (ul) ul.innerHTML = "";
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("p");
    window.history.replaceState({}, "", url.toString());

    populateRecentSeen();
}

backBtn.addEventListener("click", () => {
    backButton();
});

function populateRecentSeen(): void {
    let recentSearch = getRecentSearches();
    recentSearch.forEach(search => {
        let newButton = document.createElement("button");
        newButton.classList.add("recent-item");
        newButton.textContent = `${search.playerName}: ${search.allyCode}`;
        newButton.addEventListener("click", () => {
            allyInput.value = search.allyCode;
			submitBtn.click();
        });

        let newEntry = document.createElement("li");
        newEntry.appendChild(newButton);
        recentSearchList.append(newEntry);
    });

    if (recentSearch.length > 0) {
        noRecent.classList.add("hidden")
    }
}

openTerms.addEventListener("click", async e => {
    e.preventDefault();
    await showTermsModal();
});

function showTermsModal(): Promise<boolean> {
    return new Promise(resolve => {
        termsModal.classList.remove("hidden");

        const onAccept = () => {
            localStorage.setItem("acceptedTerms", TERMS_VERSION);
            termsModal.classList.add("hidden");
            cleanup();
            resolve(true);
        };

        const onReject = () => {
            localStorage.setItem("acceptedTerms", "OPTED_OUT");
            termsModal.classList.add("hidden");
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            acceptBtn.removeEventListener("click", onAccept);
            closeBtn.removeEventListener("click", onReject);
        };

        acceptBtn.addEventListener("click", onAccept);
        closeBtn.addEventListener("click", onReject);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { }, 1)

    const allyCodeUrlQuery = urlParams.get("p");
    if (allyCodeUrlQuery) {
        allyInput.value = allyCodeUrlQuery;
        submitBtn.click();
    }

    populateRecentSeen();
    populateTermsModal();
});