class CurlTester {
    constructor() {
        this.elements = {
            curlInput: document.getElementById('curl-input'),
            methodSelect: document.getElementById('method-select'),
            executeBtn: document.getElementById('execute-btn'),
            clearBtn: document.getElementById('clear-btn'),
            requestDetails: document.getElementById('request-details'),
            responseOutput: document.getElementById('response-output'),
            responseFormat: document.getElementById('response-format'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message')
        };
        this.rawResponse = '';
        this.init();
    }

    init() {
        this.elements.executeBtn.addEventListener('click', () => this.executeRequest());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
    }

    parseCurl(curlCommand) {
        try {
            const headers = new Headers();
            let url = '';
            let body = null;
            let method = 'GET';

            const parts = curlCommand.replace(/^curl\s+/, '').split(/\s+/);
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                
                if (part.startsWith('http') && !url) {
                    url = part.replace(/^['"]|['"]$/g, '');
                }
                
                if (part === '-H' || part === '--header') {
                    const header = parts[++i].replace(/^['"]|['"]$/g, '');
                    const [key, value] = header.split(/:\s*(.+)/);
                    if (key && value) headers.append(key, value);
                }
                
                if (part === '-d' || part === '--data') {
                    body = parts[++i].replace(/^['"]|['"]$/g, '');
                    method = 'POST';
                }
                
                if (part === '-X' || part === '--request') {
                    method = parts[++i].toUpperCase();
                }
            }

            if (!url) throw new Error('No URL found in CURL command');
            return { url, method, headers, body };
        } catch (error) {
            throw new Error('Invalid CURL command: ' + error.message);
        }
    }

    async executeRequest() {
        try {
            this.setLoading(true);
            this.clearMessages();
            
            const curl = this.elements.curlInput.value.trim();
            if (!curl) throw new Error('Please enter a CURL command');

            const { url, method: curlMethod, headers, body } = this.parseCurl(curl);
            const selectedMethod = this.elements.methodSelect.value;
            const method = selectedMethod === 'get' ? 'GET' : 
                          selectedMethod === 'fetch' ? curlMethod : selectedMethod;

            const options = {
                method,
                headers: Object.fromEntries(headers),
            };

            if (body) {
                options.body = body;
                if (!headers.has('Content-Type')) {
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            }

            // Display request details
            this.elements.requestDetails.textContent = 
                `URL: ${url}\nMethod: ${method}\nHeaders: ${JSON.stringify(options.headers, null, 2)}${body ? `\nBody: ${body}` : ''}`;

            const response = await fetch(url, options);
            this.rawResponse = await response.text();
            
            this.formatResponse();
            this.showSuccess(`Request completed with status: ${response.status} ${response.statusText}`);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    formatResponse() {
        const format = this.elements.responseFormat.value;
        try {
            if (format === 'json' && this.rawResponse) {
                const json = JSON.parse(this.rawResponse);
                this.elements.responseOutput.textContent = JSON.stringify(json, null, 2);
            } else {
                this.elements.responseOutput.textContent = this.rawResponse;
            }
        } catch {
            this.elements.responseOutput.textContent = this.rawResponse;
        }
    }

    clearAll() {
        this.elements.curlInput.value = '';
        this.elements.requestDetails.textContent = '';
        this.elements.responseOutput.textContent = '';
        this.rawResponse = '';
        this.clearMessages();
    }

    setLoading(isLoading) {
        this.elements.executeBtn.disabled = isLoading;
        document.querySelector('.curl-container').classList.toggle('loading', isLoading);
        this.elements.executeBtn.textContent = isLoading ? 'Executing...' : 'Execute';
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.elements.successMessage.style.display = 'none';
    }

    showSuccess(message) {
        this.elements.successMessage.textContent = message;
        this.elements.successMessage.style.display = 'block';
        this.elements.errorMessage.style.display = 'none';
    }

    clearMessages() {
        this.elements.errorMessage.style.display = 'none';
        this.elements.successMessage.style.display = 'none';
    }
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard!'))
        .catch(() => alert('Failed to copy'));
}

new CurlTester();
