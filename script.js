// QR Code Generator
function generateQR() {
    const text = document.getElementById('qr-input').value;
    if (!text) {
        alert('Please enter some text or URL');
        return;
    }

    const qrOutput = document.getElementById('qr-output');
    qrOutput.innerHTML = '';
    
    // Create a new QRCode instance
    new QRCode(qrOutput, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    document.getElementById('download-qr').style.display = 'block';
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    // Show success message
    const successMsg = element.parentElement.querySelector('.success-message');
    successMsg.style.display = 'block';
    successMsg.textContent = 'Copied to clipboard!';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 2000);
}

// Add to existing HTML elements:
// <button class="copy-button" onclick="copyToClipboard('encode-output')">Copy</button>

function downloadQR() {
    const canvas = document.querySelector('#qr-output canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Base64 Functions
function encodeBase64() {
    const input = document.getElementById('encode-input').value;
    try {
        const encoded = btoa(input);
        document.getElementById('encode-output').value = encoded;
    } catch (e) {
        alert('Error encoding text');
    }
}

function decodeBase64() {
    const input = document.getElementById('decode-input').value;
    try {
        const decoded = atob(input);
        document.getElementById('decode-output').value = decoded;
    } catch (e) {
        alert('Invalid Base64 string');
    }
}

// JSON Formatter
function formatJSON() {
    const input = document.getElementById('json-input').value;
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        document.getElementById('json-output').value = formatted;
    } catch (e) {
        alert('Invalid JSON');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function saveToHistory(type, input, output) {
    let history = JSON.parse(localStorage.getItem('utilityHistory') || '[]');
    history.unshift({
        type,
        input,
        output,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 items
    history = history.slice(0, 10);
    localStorage.setItem('utilityHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('utilityHistory') || '[]');
    // Display history in UI
} 