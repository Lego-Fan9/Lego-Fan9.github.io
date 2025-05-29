const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadLink = document.getElementById('downloadLink');
const downloadLinkM = document.getElementById('downloadLinkM');
const downloadLinkMDesc = document.getElementById('downloadLinkMDesc');
const resetAll = document.getElementById('resetAll');

let imageOffsetX = 0;
let imageOffsetY = 0;
let imageScale = 1;
let userImageDataURL = null;

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        userImageDataURL = event.target.result;
    };
    reader.readAsDataURL(file);
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
    if (document.cookie.includes("agreedToTerms=true")) {
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
        document.cookie = "agreedToTerms=true; path=/; max-age=" + (60 * 60 * 24 * 56);
    }

    document.getElementById('termsModal').style.display = 'none';
    doGenerate();
}

function closeTermsModal() {
    document.getElementById('termsModal').style.display = 'none';
}

async function doGenerate() {
    if (!userImageDataURL) {
        alert("Please upload an image first");
        return;
    }

    const zeta = parseInt(document.getElementById('zetaCount').value);
    const omi = parseInt(document.getElementById('omiCount').value);
    const relic = parseInt(document.getElementById('relicLevel').value);
    const alignmentVal = parseInt(document.getElementById('switch').value);
    const isGL = document.getElementById('gl-checkbox').checked;

    const portraitContainer = document.getElementById('portraitContainer');
    portraitContainer.innerHTML = buildPortraitHTML(zeta, omi, relic, alignmentVal, isGL, userImageDataURL);

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

    downloadLink.href = canvas.toDataURL();
    downloadLink.download = "swgoh-portrait-image.png";
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
    imgPreview.src = canvas.toDataURL();
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

    downloadLink.href = canvas.toDataURL();
}

function zoomIn() {
    imageScale = Math.min(imageScale * 1.1, 5);
    updatePreviewTransform();
}

function zoomOut() {
    imageScale = Math.max(imageScale / 1.1, 0.2);
    updatePreviewTransform();
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
}
