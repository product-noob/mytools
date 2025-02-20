// Store the raw response for formatting
let rawResponse = null;

function parseCurl(curlCommand) {
    try {
        // Remove 'curl' from the beginning if present
        curlCommand = curlCommand.trim().replace(/^curl\s+/, '');

        const request = {
            method: 'GET',
            headers: {},
            body: null
        };

        // Parse URL
        const urlMatch = curlCommand.match(/['"]([^'"]+)['"]/);
        if (urlMatch) {
            request.url = urlMatch[1];
        } else {
            request.url = curlCommand.split(' ')[0];
        }

        // Parse headers
        const headerMatches = curlCommand.matchAll(/-H\s+['"]([^'"]+)['"]/g);
        for (const match of headerMatches) {
            const [key, value] = match[1].split(': ');
            request.headers[key] = value;
        }

        // Parse method
        const methodMatch = curlCommand.match(/-X\s+(['"]?)(\w+)\1/);
        if (methodMatch) {
            request.method = methodMatch[2];
        }

        // Parse data
        const dataMatch = curlCommand.match(/-d\s+['"]([^'"]+)['"]/);
        if (dataMatch) {
            request.method = request.method || 'POST';
            try {
                request.body = JSON.parse(dataMatch[1]);
            } catch {
                request.body = dataMatch[1];
            }
        }

        return request;
    } catch (error) {
        throw new Error('Invalid CURL command');
    }
}

async function convertAndExecute() {
    const curlInput = document.getElementById('curl-input').value;
    const requestDetails = document.getElementById('request-details');
    const responseOutput = document.getElementById('response-output');
    
    try {
        // Parse CURL command
        const request = parseCurl(curlInput);
        
        // Display request details
        requestDetails.textContent = JSON.stringify(request, null, 2);
        
        // Execute request
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body ? JSON.stringify(request.body) : null
        });
        
        // Store raw response
        rawResponse = await response.text();
        
        // Format and display response
        formatResponse();
        
        showMessage('Request executed successfully!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
        requestDetails.textContent = '';
        responseOutput.textContent = '';
    }
}

function formatResponse() {
    const format = document.getElementById('response-format').value;
    const responseOutput = document.getElementById('response-output');
    
    if (!rawResponse) {
        responseOutput.textContent = '';
        return;
    }
    
    try {
        if (format === 'json') {
            const jsonData = JSON.parse(rawResponse);
            responseOutput.textContent = JSON.stringify(jsonData, null, 2);
        } else {
            responseOutput.textContent = rawResponse;
        }
    } catch {
        responseOutput.textContent = rawResponse;
    }
}

function clearAll() {
    document.getElementById('curl-input').value = '';
    document.getElementById('request-details').textContent = '';
    document.getElementById('response-output').textContent = '';
    rawResponse = null;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy to clipboard', 'error');
    });
}

function showMessage(message, type) {
    const messageElement = document.getElementById(`${type}-message`);
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
} 
