const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ip = require('ip');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// �������� ������������ ��������
const clients = new Set();

// ��������� WebSocket ����������
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // �������� ��������� ���� ������������ ��������, ����� �����������
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket connection close');
        clients.delete(ws);
    });
});

// ������� API �������� ��� �������� ������� �������
app.get('/status', (req, res) => {
    res.json({ status: 'Server is running', clientsCount: clients.size });
});

// ������ �������
server.listen(PORT, () => {
    console.log(`Server runned on http://${ip.address()}:${PORT}`);
    console.log(`WebSocket availible on ws://${ip.address()}:${PORT}`);
});
