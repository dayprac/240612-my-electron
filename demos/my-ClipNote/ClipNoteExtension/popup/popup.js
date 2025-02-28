// 更新UI的函数
function updateTimeSegmentsUI(segments, url, title) {
    const timeSegmentsDiv = document.getElementById('timeSegments');
    timeSegmentsDiv.innerHTML = ''; // 清空现有内容

    let pageTitle = title || '未知标题';
    
    // 处理标题长度
    if (pageTitle.length > 20) {
        pageTitle = pageTitle.substring(0, 10) + '...' + pageTitle.substring(pageTitle.length - 10);
    }

    // 为每个时间段创建链接
    const allLinks = [];
    const htmlLinks = [];
    segments.forEach(segment => {
        const link = document.createElement('a');
        link.textContent = `${pageTitle} ${segment}`;
        const linkUrl = `cn://go?url=${url}&time=${segment}`;
        link.href = linkUrl;
        timeSegmentsDiv.appendChild(link);
        allLinks.push(linkUrl);
        
        // 创建HTML格式的链接
        const htmlLink = `<a href="${linkUrl}" style="display: block; margin: 5px 0; color: #0066cc; text-decoration: none;">${pageTitle} ${segment}</a>`;
        htmlLinks.push(htmlLink);
    });

    // 复制所有链接到剪贴板（包括纯文本和HTML格式）
    const clipboardText = allLinks.join('\n');
    // const htmlText = htmlLinks.join('<br>');
    const htmlText= `<span>${title}</span>&nbsp;` + Array.from('ABCD').map((item, index) => `<a href="${allLinks[index]}">${item}</a>`).join('&nbsp;');
    console.log(htmlText);
    console.log(htmlLinks.join('<br>'))
    navigator.clipboard.write([
        new ClipboardItem({
            'text/plain': new Blob([clipboardText], { type: 'text/plain' }),
            'text/html': new Blob([htmlText], { type: 'text/html' })
        })
    ]);
}

// 添加按钮点击事件处理
document.getElementById('generateTimeSegments').addEventListener('click', () => {
    // 向content script发送请求，获取最新的时间段数据
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getTimeSegments'}, function(response) {
                if (response && response.segments) {
                    updateTimeSegmentsUI(response.segments, response.url, response.title);
                }
            });
        }
    });
});