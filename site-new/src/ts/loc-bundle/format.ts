export function formatString(input: string): string {
    for (const func of filters) {
        input = func(input);
    }

    return input
}

function removeBold(input: string) {
    return input.replace(/\[\/?b\]/gi, "");
}

function removeItalics(input: string) {
    return input.replace(/\[\/?i\]/gi, "");
}

function removeCTag(input: string) {
    return input.replace(/\[\/?c\]/gi, "");
}

function removeColorCodes(input: string) {
    input = input.replace(/\[[0-9a-fA-F]{6}\]/g, "");
    input = input.replace(/\[-\]/g, "");
    return input;
}

function fixUnicode(input: string) {
    return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
    });
}

function fixDubleNewlines(input: string) {
    return input.replace(/\\\\n/g, "\n");
}

function fixNewlines(input: string) {
    return input.replace(/\\n/g, "\n");
}

const filters = [removeBold, removeItalics, removeCTag, removeColorCodes, fixUnicode, fixDubleNewlines, fixNewlines];

export async function Copy(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand("copy");
        document.body.removeChild(textarea);

        return success;
    }
}
