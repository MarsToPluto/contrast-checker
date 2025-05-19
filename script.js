// --- Contrast Calculation Logic (from previous example) ---
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    let processedHex = hex.startsWith('#') ? hex.slice(1) : hex;
    if (processedHex.length === 3) {
        processedHex = processedHex.split('').map(char => char + char).join('');
    }
    if (processedHex.length !== 6) return null;
    const r = parseInt(processedHex.substring(0, 2), 16);
    const g = parseInt(processedHex.substring(2, 4), 16);
    const b = parseInt(processedHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
}

function getRelativeLuminance(rgb) {
    if (!rgb || typeof rgb.r !== 'number' || typeof rgb.g !== 'number' || typeof rgb.b !== 'number') return null;
    const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    const linearRGB = sRGB.map(val => {
        if (val <= 0.03928) return val / 12.92;
        return Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * linearRGB[0] + 0.7152 * linearRGB[1] + 0.0722 * linearRGB[2];
}

function getContrastRatio(color1Hex, color2Hex) {
    const rgb1 = hexToRgb(color1Hex);
    const rgb2 = hexToRgb(color2Hex);
    if (!rgb1 || !rgb2) return null;
    const lum1 = getRelativeLuminance(rgb1);
    const lum2 = getRelativeLuminance(rgb2);
    if (lum1 === null || lum2 === null) return null;
    const lighterLum = Math.max(lum1, lum2);
    const darkerLum = Math.min(lum1, lum2);
    return (lighterLum + 0.05) / (darkerLum + 0.05);
}

// --- DOM Elements ---
const fgColorPicker = document.getElementById('fgColorPicker');
const fgColorHex = document.getElementById('fgColorHex');
const bgColorPicker = document.getElementById('bgColorPicker');
const bgColorHex = document.getElementById('bgColorHex');

const contrastRatioValue = document.getElementById('contrastRatioValue');
const aaNormalStatus = document.getElementById('aaNormal');
const aaLargeStatus = document.getElementById('aaLarge');
const aaaNormalStatus = document.getElementById('aaaNormal');
const aaaLargeStatus = document.getElementById('aaaLarge');

const previewTextDiv = document.getElementById('previewText');

// --- WCAG Thresholds ---
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3;
const WCAG_AAA_NORMAL = 7;
const WCAG_AAA_LARGE = 4.5;

// --- Update Function ---
function updateContrast() {
    const fgColor = fgColorHex.value;
    const bgColor = bgColorHex.value;

    // Update preview
    previewTextDiv.style.color = fgColor;
    previewTextDiv.style.backgroundColor = bgColor;

    const ratio = getContrastRatio(fgColor, bgColor);

    if (ratio === null) {
        contrastRatioValue.textContent = "Invalid Color";
        setAllStatus("N/A", "neutral");
        return;
    }

    contrastRatioValue.textContent = `${ratio.toFixed(2)}:1`;

    // Update WCAG status
    updateStatus(aaNormalStatus, ratio >= WCAG_AA_NORMAL);
    updateStatus(aaLargeStatus, ratio >= WCAG_AA_LARGE);
    updateStatus(aaaNormalStatus, ratio >= WCAG_AAA_NORMAL);
    updateStatus(aaaLargeStatus, ratio >= WCAG_AAA_LARGE);
}

function updateStatus(element, passes) {
    element.textContent = passes ? "PASS" : "FAIL";
    element.className = 'status ' + (passes ? 'pass' : 'fail');
}

function setAllStatus(text, className) {
    const statuses = [aaNormalStatus, aaLargeStatus, aaaNormalStatus, aaaLargeStatus];
    statuses.forEach(el => {
        el.textContent = text;
        el.className = 'status ' + className;
    });
}

// --- Event Listeners ---
fgColorPicker.addEventListener('input', () => {
    fgColorHex.value = fgColorPicker.value;
    updateContrast();
});

fgColorHex.addEventListener('input', () => {
    // Basic validation for hex input (visual only, main validation in hexToRgb)
    if (/^#[0-9A-Fa-f]{6}$/.test(fgColorHex.value) || /^#[0-9A-Fa-f]{3}$/.test(fgColorHex.value)) {
        fgColorPicker.value = fgColorHex.value; // Sync picker if hex is valid format
    }
    updateContrast();
});

bgColorPicker.addEventListener('input', () => {
    bgColorHex.value = bgColorPicker.value;
    updateContrast();
});

bgColorHex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(bgColorHex.value) || /^#[0-9A-Fa-f]{3}$/.test(bgColorHex.value)) {
        bgColorPicker.value = bgColorHex.value;
    }
    updateContrast();
});

// Initial calculation on page load
document.addEventListener('DOMContentLoaded', updateContrast);