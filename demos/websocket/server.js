const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
  port: 4000
});

// 存储所有连接的客户端
const clients = new Map();

wss.on('connection', function (ws) {
  console.log(`[SERVER] New client connected`);
  
  // 为新连接的客户端生成一个随机ID
  const clientId = Math.random().toString(36).substring(7);
  clients.set(ws, { id: clientId, name: `用户${clientId}` });

  // 广播在线用户列表
  broadcastUserList();

  // 处理接收到的消息
  ws.on('message', function (message) {
    try {
      const data = JSON.parse(message);
      console.log(`[SERVER] Received:`, data);

      switch (data.type) {
        case 'chat':
          // 广播聊天消息给所有客户端
          broadcast({
            type: 'chat',
            from: clients.get(ws).name,
            content: data.content,
            timestamp: new Date().toISOString()
          });
          break;

        case 'rename':
          // 更新用户名
          const client = clients.get(ws);
          client.name = data.name;
          clients.set(ws, client);
          broadcastUserList();
          break;
      }
    } catch (err) {
      console.error('[SERVER] Error parsing message:', err);
    }
  });

  // 处理客户端断开连接
  ws.on('close', function () {
    console.log(`[SERVER] Client disconnected:`, clients.get(ws));
    clients.delete(ws);
    broadcastUserList();
  });
});

// 广播消息给所有客户端
function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of clients.keys()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

// 广播在线用户列表
function broadcastUserList() {
  const users = Array.from(clients.values()).map(client => ({
    id: client.id,
    name: client.name
  }));

  broadcast({
    type: 'users',
    users: users
  });
}

console.log('[SERVER] WebSocket server started on port 4000');