// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '..', 'tinyllama-chat-frontend', 'build')));

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', async function incoming(message) {
    console.log('Received message:', message);
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'tinyllama',
        prompt: message.toString() // Convert Buffer to string
      });
      console.log('API Response:', response.data.response); // Log the API response
      ws.send(JSON.stringify({ success: true, response: response.data.response }));
    } catch (error) {
      console.error('Error sending message:', error);
      ws.send(JSON.stringify({ success: false, error: 'An error occurred while processing the message' }));
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

// Serve index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tinyllama-chat-frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
