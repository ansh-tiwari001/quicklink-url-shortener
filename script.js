const form = document.getElementById("shortenForm");
const longUrlInput = document.getElementById("longUrl");
const resultDiv = document.getElementById("result");
const shortUrlText = document.getElementById("shortUrlText");
const copyBtn = document.getElementById("copyBtn");

const BASE_URL = window.location.origin;

/* Generate Random Code */
function generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

/* Get Stored Links */
function getStoredLinks() {
    return JSON.parse(localStorage.getItem("shortLinks")) || {};
}

/* Save Link */
function saveLink(code, url) {
    const links = getStoredLinks();
    links[code] = url;
    localStorage.setItem("shortLinks", JSON.stringify(links));
}

/* Validate URL */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/* Form Submit (Shorten) */
form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent reload

    const longUrl = longUrlInput.value.trim();

    if (!isValidURL(longUrl)) {
        alert("Please enter a valid URL.");
        return;
    }

    const links = getStoredLinks();
    let code;

    // Collision check
    do {
        code = generateCode();
    } while (links[code]);

    saveLink(code, longUrl);

    const shortUrl = `${BASE_URL}/index.html?c=${code}`;
    shortUrlText.textContent = shortUrl;
    resultDiv.classList.remove("hidden");

    longUrlInput.value = ""; // clear input after success
});

/* Copy Button */
copyBtn.addEventListener("click", async () => {
    const text = shortUrlText.textContent;

    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 2000);
    } catch {
        alert("Copy failed!");
    }
});

/* Redirect Handler */
(function handleRedirect() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("c");

    if (!code) return;

    const links = getStoredLinks();

    if (links[code]) {
        window.location.href = links[code];
    }
})();