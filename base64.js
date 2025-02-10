// Initialize the page with decode mode active
document.addEventListener('DOMContentLoaded', function() {
    toggleMode('decode');
});

function toggleMode(mode) {
    // Update button states
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => {
        if (button.dataset.mode === mode) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Show/hide appropriate section
    const encodeSection = document.getElementById('encode-section');
    const decodeSection = document.getElementById('decode-section');

    if (mode === 'encode') {
        encodeSection.style.display = 'block';
        decodeSection.style.display = 'none';
    } else {
        encodeSection.style.display = 'none';
        decodeSection.style.display = 'block';
    }

    // Clear previous inputs and outputs
    clearFields();
}

function clearFields() {
    document.getElementById('encode-input').value = '';
    document.getElementById('encode-output').value = '';
    document.getElementById('decode-input').value = '';
    document.getElementById('decode-output').value = '';
}

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

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    const successMsg = element.parentElement.querySelector('.success-message');
    successMsg.style.display = 'block';
    successMsg.textContent = 'Copied to clipboard!';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 2000);
} 