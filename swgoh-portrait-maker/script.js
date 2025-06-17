const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadLink = document.getElementById('downloadLink');
const downloadLinkM = document.getElementById('downloadLinkM');
const downloadLinkMDesc = document.getElementById('downloadLinkMDesc');
const resetAll = document.getElementById('resetAll');
const urlInput = document.getElementById('urlInput');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const discordIdInput = document.getElementById('discordIdInput');
const loadDiscordBtn = document.getElementById('loadDiscordBtn');

function isTrueWebKit() {
    const ua = navigator.userAgent;
    const isWebKit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|SamsungBrowser/.test(ua);
    const hasWebKitFeatures = 'WebkitAppearance' in document.documentElement.style;
    const hasAppleProdName = /iP(ad|hone|od)/.test(ua)
    const hasMac = /Macintosh|Mac OS/.test(ua);
    return isWebKit && hasWebKitFeatures && hasAppleProdName && hasMac;
}
const isWebKit = isTrueWebKit();

let imageOffsetX = 0;
let imageOffsetY = 0;
let imageScale = 1;
let userImageDataURL = null;

const discordServerStartUrl = "https://legofan9-discord-hash-getter.onrender.com/"
fetch(discordServerStartUrl)

const unwantedEntries = {
    'dismissedAnnouncementVersion': ['1.0.0'],
    "agreedToTerms": ['1.0.0']
};

const CURRENT_ANNOUNCEMENT_VERSION = '1.1.0';
const CURRENT_TERMS_VERSION = '1.1.0';

Object.entries(unwantedEntries).forEach(([key, valuesToRemove]) => {
    const currentValue = localStorage.getItem(key);

    if (valuesToRemove.includes(currentValue)) {
        localStorage.removeItem(key);
        console.log(`Removed ${key} because value matched: ${currentValue}`);
    }
});

function closeAnnouncementBar() {
    const banner = document.getElementById('announcement-bar');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('dismissedAnnouncementVersion', CURRENT_ANNOUNCEMENT_VERSION);
    }
}

function initAnnouncementBar() {
    const dismissedVersion = localStorage.getItem('dismissedAnnouncementVersion');
    const banner = document.getElementById('announcement-bar');

    if (!banner) return;

    if (dismissedVersion !== CURRENT_ANNOUNCEMENT_VERSION) {
        banner.style.display = '';
    }
}

document.addEventListener('DOMContentLoaded', initAnnouncementBar);

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        userImageDataURL = event.target.result;
    };
    reader.readAsDataURL(file);
});

loadUrlBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        showErrorPopup("Please input a URL");
        return;
    }

    const encodedUrl = encodeURIComponent(url);
    const proxyPath = "/image/proxy";
    const method = "GET";
    const sharedSecret = "jotpBwkCiLjKqg8Jcr9kXCtU5fxrcIKoQpJIK6pRROk=";
    const { signature, timestamp } = await generateSignature(
        base64ToUint8Array(sharedSecret), method, proxyPath
    );

    fetch(`https://legofan9-discord-hash-getter.onrender.com${proxyPath}?url=${encodedUrl}`, {
        method: method,
        headers: {
            "X-Timestamp": timestamp,
            "X-Signature": signature
        }
    })
        .then(res => {
            const contentType = res.headers.get('Content-Type') || '';
            const extensionMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
            const extension = extensionMatch ? extensionMatch[1].toLowerCase() : null;

            if (!res.ok || !contentType.startsWith('image/')) {
                const fallbackType = extension || contentType || 'unknown';
                showErrorPopup(`Unsupported: ${fallbackType} Make sure your url includes something like .gif, .png, etc.`);
                throw new Error(`Unsupported or failed image type: ${fallbackType}`);
            }

            return res.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function (event) {
                userImageDataURL = event.target.result;
            };
            reader.readAsDataURL(blob);
        })
        .catch(err => {
            console.error("Image load error via proxy:", err);
        });
});

async function generateSignature(sharedSecret, method, endpoint) {
    const encoder = new TextEncoder();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = `${method}:${endpoint}:${timestamp}`;

    const key = await crypto.subtle.importKey(
        'raw',
        sharedSecret,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(message)
    );

    const signature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return { signature, timestamp };
}

function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function extractDiscordId(input) {
    const mentionMatch = input.match(/^<@!?(\d{17,19})>$/);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    if (/^\d{17,19}$/.test(input)) {
        return input;
    }
    return null;
}

loadDiscordBtn.addEventListener('click', async () => {
    const discordId = extractDiscordId(discordIdInput.value.trim());
    if (!discordId) {
        showErrorPopup("Please provide a discordId");
        return;
    }
    const hash_url = "https://legofan9-discord-hash-getter.onrender.com/discord/avatar/hash";
    const hash_endpoint = "/discord/avatar/hash";
    const hash_method = "POST";
    const sharedSecret = "jotpBwkCiLjKqg8Jcr9kXCtU5fxrcIKoQpJIK6pRROk=";
    const hash_secret = base64ToUint8Array(sharedSecret);
    const { signature, timestamp } = await generateSignature(hash_secret, hash_method, hash_endpoint);

    const hash_headers = {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp
    };
    const hash_body = JSON.stringify({ "discordId": discordId });

    fetch(hash_url, {
        method: "POST",
        headers: hash_headers,
        body: hash_body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            const format = data.avatarHash.startsWith('a_') ? 'gif' : 'png';
            const discord_url = `https://cdn.discordapp.com/avatars/${discordId}/${data.avatarHash}.${format}`;
            fetch(discord_url)
                .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        userImageDataURL = event.target.result;
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(err => {
                    console.error("Failed to load image from URL:", err);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function updatePreviewTransform() {
    const imgEl = document.querySelector('.character-portrait__img');
    if (imgEl) {
        imgEl.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageScale})`;
        imgEl.style.transformOrigin = 'center center';
    }
    renderCanvasFromDOM();
}

async function stackImages() {
    if (localStorage.getItem("agreedToTerms") === CURRENT_TERMS_VERSION) {
        return doGenerate();
    }

    document.getElementById('termsModal').style.display = 'flex';
}

function confirmTerms() {
    const agree = document.getElementById('modalAgree').checked;
    const remember = document.getElementById('modalRemember').checked;

    if (!agree) {
        alert("You must agree to continue.");
        return;
    }

    if (remember) {
        localStorage.setItem("agreedToTerms", CURRENT_TERMS_VERSION);
    }

    document.getElementById('termsModal').style.display = 'none';
    doGenerate();
}

function closeTermsModal() {
    document.getElementById('termsModal').style.display = 'none';
}

async function doGenerate() {
    if (!userImageDataURL) {
        showErrorPopup("Please upload an image first");
        return;
    }

    const zeta = parseInt(document.getElementById('zetaCount').value);
    const omi = parseInt(document.getElementById('omiCount').value);
    const relic = parseInt(document.getElementById('relicLevel').value);
    const alignmentVal = parseInt(document.getElementById('switch').value);
    const isGL = document.getElementById('gl-checkbox').checked;

    const portraitContainer = document.getElementById('portraitContainer');
    portraitContainer.innerHTML = buildPortraitHTML(zeta, omi, relic, alignmentVal, isGL, userImageDataURL);
    if (isWebKit) {
        updatePreviewTransform();
    }

    await new Promise(r => setTimeout(r, 200));

    const Node = portraitContainer.querySelector('.collection-char');
    Node.style.background = 'transparent';
    var scale = 2;
    const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: Node.offsetWidth + "px",
        height: Node.offsetHeight + "px"
    };
    const param = {
        width: Node.clientWidth * scale,
        height: Node.clientHeight * scale,
        style
    };
    const dataUrl = await domtoimage.toPng(Node, param);

    const img = new Image();
    img.src = dataUrl;

    await new Promise(resolve => {
        img.onload = resolve;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    // will add back later canvas.classList.add('loaded')

    downloadLink.href = canvas.toDataURL('image/webp');
    downloadLink.download = "swgoh-portrait-image.webp";
    downloadLink.textContent = "Download Result (PC)";
    downloadLink.style.display = "inline";
    downloadLinkM.style.display = "inline";
    downloadLinkM.textContent = "Download Result (Mobile)";
    resetAll.style.display = "inline";
}

function mobileDownload() {
    const mainEl = document.querySelector('main');
    const oldPreview = document.getElementById('imgPreview');
    downloadLinkMDesc.style.display = "block";
    if (oldPreview) oldPreview.remove();

    const imgPreview = document.createElement('img');
    imgPreview.src = canvas.toDataURL('image/webp');
    imgPreview.style.maxWidth = "100%";
    imgPreview.id = "imgPreview";
    mainEl.appendChild(imgPreview);
}


function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function buildPortraitHTML(zeta = 3, omi = 3, relic = 9, alignment = 0, isGL = false, imgSrc = '') {
    let return_string = "";

    return_string += `<div class="collection-char"><div class="character-portrait"><div class="character-portrait__primary">`;

    if (isGL) {
        return_string += `<div class="character-portrait__image-frame character-portrait__image-frame--is-galactic-legend">`;
    } else {
        if (alignment === 1) {
            return_string += `<div class="character-portrait__image-frame">`;
        } else if (alignment === 2) {
            return_string += `<div class="character-portrait__image-frame character-portrait__image-frame--alignment-2">`;
        } else {
            return_string += `<div class="character-portrait__image-frame character-portrait__image-frame--alignment-3">`;
        }
    }
    return_string += `<img class="character-portrait__img" src="${imgSrc}" /></div>`;
    if (zeta != 0) {
        return_string += `<div class="character-portrait__zeta">${zeta}</div>`;
    }
    if (omi != 0) {
        return_string += `<div class="character-portrait__omicron">${omi}</div>`;
    }
    if (relic != 0) {
        if (isGL) {
            return_string += `<div class="character-portrait__relic character-portrait__relic--ultimate"> ${relic}</div>`
        } else {
            if (alignment === 1) {
                return_string += `<div class="character-portrait__relic character-portrait__relic--alignment-alignment_neutral"> ${relic}</div>`;
            } else if (alignment === 0) {
                return_string += `<div class="character-portrait__relic character-portrait__relic--alignment-alignment_dark"> ${relic}</div>`;
            } else {
                return_string += `<div class="character-portrait__relic">${relic}</div>`;
            }
        }
    }
    if (alignment === 1) {
        return_string += `<div class="character-portrait__rframe character-portrait__rframe--alignment-alignment_neutral"></div>`;
        return_string += `<div class="character-portrait__rframe character-portrait__rframe--right character-portrait__rframe--alignment-alignment_neutral"></div>`;
    } else if (alignment === 0) {
        return_string += `<div class="character-portrait__rframe character-portrait__rframe--alignment-alignment_dark"></div>`;
        return_string += `<div class="character-portrait__rframe character-portrait__rframe--right character-portrait__rframe--alignment-alignment_dark"></div>`;
    } else {
        return_string += `<div class="character-portrait__rframe"></div>`;
        return_string += `<div class="character-portrait__rframe character-portrait__rframe--right"></div>`;
    }
    return_string += `</div></div><div class="character-portrait__footer"><div class="character-portrait__stars">
                    <div class="character-portrait__star"></div><div class="character-portrait__star"></div>
                    <div class="character-portrait__star"></div><div class="character-portrait__star"></div>
                    <div class="character-portrait__star"></div><div class="character-portrait__star"></div>
                    <div class="character-portrait__star"></div></div></div></div></div>`;
    return return_string;
}

async function renderCanvasFromDOM() {
    const portraitContainer = document.getElementById('portraitContainer');

    var scale = 2;
    const Node = portraitContainer.querySelector('.collection-char');

    Node.style.background = 'transparent';

    const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: Node.offsetWidth + "px",
        height: Node.offsetHeight + "px"
    };

    const param = {
        width: Node.clientWidth * scale,
        height: Node.clientHeight * scale,
        style
    };

    const dataUrl = await domtoimage.toPng(Node, param);

    const img = new Image();
    img.src = dataUrl;

    await new Promise(resolve => {
        img.onload = resolve;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    downloadLink.href = canvas.toDataURL('image/webp');
}

function zoomIn() {
    if (isWebKit) {
        // zoom in
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
        // zoom out
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
        // zoom in
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
        // zoom out
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
        // zoom in
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
    } else {
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
    }
}

function zoomOut() {
    if (isWebKit) {
        // zoom out
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
        // zoom in
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
        // zoom out
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
        // zoom in
        imageScale = Math.min(imageScale * 1.1, 5);
        updatePreviewTransform();
        // zoom out
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
    } else {
        imageScale = Math.max(imageScale / 1.1, 0.2);
        updatePreviewTransform();
    }
}

function imgMove(val, amount) {
    if (val === 'X') {
        imageOffsetX += amount;
    } else if (val === 'Y') {
        imageOffsetY += amount
    }
    updatePreviewTransform();
}

function resetImagePosition() {
    imageOffsetX = 0;
    imageOffsetY = 0;
    imageScale = 1;
    updatePreviewTransform();
}

function fakeRefresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;

    userImageDataURL = null;
    imageOffsetX = 0;
    imageOffsetY = 0;
    imageScale = 1;

    uploadInput.value = "";

    document.getElementById('zetaCount').value = "0";
    document.getElementById('omiCount').value = "0";
    document.getElementById('relicLevel').value = "9";
    document.getElementById('switch').value = "1";
    document.getElementById('gl-checkbox').checked = false;

    downloadLink.style.display = "none";
    downloadLink.href = "#";
    downloadLink.textContent = "";

    downloadLinkM.style.display = "none";
    downloadLinkM.textContent = "";
    downloadLinkMDesc.style.display = "none";

    resetAll.style.display = "none";

    const portraitContainer = document.getElementById('portraitContainer');
    portraitContainer.innerHTML = "";

    const oldPreview = document.getElementById('imgPreview');
    if (oldPreview) oldPreview.remove();

    document.getElementById('modalAgree').checked = false;
    document.getElementById('modalRemember').checked = false;
    document.getElementById('termsModal').style.display = 'none';

    portraitContainer.style.left = '-9999px';
    portraitContainer.style.top = '-9999px';
    portraitContainer.style.border = '';
    portraitContainer.style.background = '';
    portraitContainer.style.transform = '';
    portraitContainer.style.marginTop = ''
}

function debugMode() {
    const portraitContainer = document.getElementById('portraitContainer');
    portraitContainer.style.left = '50%';
    portraitContainer.style.top = '50%';
    portraitContainer.style.transform = 'translate(-50%, -50%)';
    portraitContainer.style.marginTop = '50px'
    document.getElementById("debugGap").style.display = "";
    document.getElementById("debugGapB").style.display = "";
    document.getElementById("debugGapC").style.display = "";
    document.getElementById("debugInfo").style.display = "";
    document.getElementById("userAgent").textContent = navigator.userAgent;
    document.getElementById("isSafari").textContent = `isWebKit = ${isWebKit}`
}

function setupHelpTooltip(btnId, tooltipId) {
    const btn = document.getElementById(btnId);
    const tooltip = document.getElementById(tooltipId);
    let isVisible = false;

    function showTooltip() {
        tooltip.style.display = 'block';
        isVisible = true;
    }
    function hideTooltip() {
        tooltip.style.display = 'none';
        isVisible = false;
    }
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        isVisible ? hideTooltip() : showTooltip();
    });
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !tooltip.contains(e.target)) {
            hideTooltip();
        }
    });

    btn.addEventListener('blur', () => {
        setTimeout(() => {
            if (!tooltip.contains(document.activeElement)) {
                hideTooltip();
            }
        }, 100);
    });
}
setupHelpTooltip('discordHelpBtn', 'discordHelpTooltip');
setupHelpTooltip('urlHelpBtn', 'urlHelpTooltip');

function showErrorPopup(message) {
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('popupModal').style.display = 'flex';
}

function closeErrorPopup() {
    document.getElementById('popupModal').style.display = 'none';
}