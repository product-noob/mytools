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