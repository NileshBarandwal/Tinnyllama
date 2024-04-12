document.getElementById('submitBtn').addEventListener('click', function() {
    const promptInput = document.getElementById('promptInput').value;
    const statusMessage = document.getElementById('statusMessage');
    const resultDiv = document.getElementById('result');

    // Clear previous results and show processing message
    resultDiv.innerHTML = '';
    statusMessage.textContent = 'Request being processed by AI...';
    statusMessage.style.opacity = 1;

    fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "tinyllama",
            prompt: promptInput
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        statusMessage.style.opacity = 0;
        resultDiv.innerHTML = '<p>${data.result}</p>';
    })
    .catch(error => {
        statusMessage.textContent = 'Error processing your request';
        console.error('Error:', error);
    });
});