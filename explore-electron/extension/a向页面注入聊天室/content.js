// 创建聊天室UI
function createChatUI() {
  const container = document.createElement('div');
  container.className = 'chat-extension-container hidden';
  container.innerHTML = `
    <div class="chat-extension-header">
      <span>聊天室</span>
      <button class="chat-extension-button" id="chat-extension-minimize">-</button>
    </div>
    <div class="chat-extension-messages" id="chat-extension-messages"></div>
    <div class="chat-extension-input-area">
      <input type="text" class="chat-extension-input" id="chat-extension-input" placeholder="输入消息...">
      <button class="chat-extension-button" id="chat-extension-send">发送</button>
    </div>
  `;

  const toggle = document.createElement('div');
  toggle.className = 'chat-extension-toggle';
  toggle.textContent = '💬';
  toggle.style.display = 'block';

  document.body.appendChild(container);
  document.body.appendChild(toggle);

  return { container, toggle };
}

// 添加消息到聊天界面
function addMessage(from, content, timestamp = new Date().toISOString()) {
  const messagesDiv = document.getElementById('chat-extension-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-extension-message';
  messageDiv.innerHTML = `
    <div class="header">
      <span>${from}</span>
      <span>${new Date(timestamp).toLocaleString()}</span>
    </div>
    <div class="content">${content}</div>
  `;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 初始化WebSocket连接
function initializeWebSocket() {
  const ws = new WebSocket('ws://localhost:4000');

  ws.onopen = () => {
    console.log('Connected to WebSocket server');
    addMessage('系统', '已连接到聊天室');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);

    if (data.type === 'chat') {
      addMessage(data.from, data.content, data.timestamp);
    }
  };

  ws.onclose = () => {
    addMessage('系统', '已断开连接');
  };

  return ws;
}

// 初始化聊天室
function initializeChatRoom() {
  const { container, toggle } = createChatUI();
  const ws = initializeWebSocket();

  // 切换聊天室显示/隐藏
  toggle.addEventListener('click', () => {
    container.classList.toggle('hidden');
  });

  // 最小化按钮
  document.getElementById('chat-extension-minimize').addEventListener('click', () => {
    container.classList.add('hidden');
  });

  // 发送消息
  const sendMessage = () => {
    const input = document.getElementById('chat-extension-input');
    const content = input.value.trim();
    if (content && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'chat',
        content: content
      }));
      input.value = '';
    }
  };

  // 发送按钮点击事件
  document.getElementById('chat-extension-send').addEventListener('click', sendMessage);

  // 输入框回车事件
  document.getElementById('chat-extension-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// 当页面加载完成后初始化聊天室
window.addEventListener('load', initializeChatRoom);