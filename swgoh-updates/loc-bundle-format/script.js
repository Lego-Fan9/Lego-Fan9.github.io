const outputText = document.getElementById("outputText");
const inputText = document.getElementById("inputText");
const copyBtn = document.querySelector(".output-box button");

function transformText() {
    var input = inputText.value;

    for (const func of filters) {
        input = func(input);
    }

    outputText.value = input;
    autoResize(outputText);
}

function removeBold(input) {
    return input.replace(/\[\/?b\]/gi, "");
}

function removeItalics(input) {
    return input.replace(/\[\/?i\]/gi, "");
}

function removeCTag(input) {
    return input.replace(/\[\/?c\]/gi, "");
}

function removeColorCodes(input) {
    input = input.replace(/\[[0-9a-fA-F]{6}\]/g, "");
    input = input.replace(/\[-\]/g, "");
    return input;
}

function fixUnicode(input) {
    return input.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
    });
}

function fixNewlines(input) {
    return input.replace(/\\\\n/g, "\n");
}

const filters = [removeBold, removeItalics, removeCTag, removeColorCodes, fixUnicode, fixNewlines];

inputText.addEventListener("input", transformText);

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
}

async function copyOutput() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(outputText.value);
            showCopied();
            return;
        } catch (err) {
            console.warn("Clipboard API failed, falling back...", err);
        }
    }

    // Fallback for iOS / older browsers
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    const success = document.execCommand("copy");

    if (success) {
        showCopied();
    } else {
        alert("Copy failed. Please copy manually.");
    }
}

function showCopied() {
    copyBtn.textContent = "Copied!";
    copyBtn.disabled = true;

    setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.disabled = false;
    }, 1500);
}