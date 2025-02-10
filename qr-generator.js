function generateQR() {
    const text = document.getElementById('qr-input').value;
    if (!text) {
        alert('Please enter some text or URL');
        return;
    }

    const qrOutput = document.getElementById('qr-output');
    qrOutput.innerHTML = '';
    
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

function downloadQR() {
    const canvas = document.querySelector('#qr-output canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
} 