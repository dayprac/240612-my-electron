(function () {
    'use strict';
    // WebSocket连接对象
    let socket;
    // WebSocket服务器地址
    const socketUrl = 'ws://127.0.0.1:5488';
    // WebSocket连接状态标志
    var ws = false;
    // 当前控制的视频对象
    var video = null;
    // 从URL获取的时间控制参数
    var cnt=getQueryVariable("cnt");
    // 从URL获取的文件名参数
    var cnf=getQueryVariable("cnf");
    // 存储页面中所有视频对象的数组
    var _videoObj = [];
    // 存储页面中所有视频源URL的数组
    var _videoSrc = [];

    // 处理Shadow DOM，确保可以访问shadow root中的视频元素
    function hackAttachShadow() {
        if (window._hasHackAttachShadow_) return;
        try {
            window.Element.prototype._attachShadow =
                window.Element.prototype.attachShadow;
            window.Element.prototype.attachShadow = function () {
                const arg = arguments;
                if (arg[0] && arg[0].mode) {
                    // 强制设置shadow root为open模式以便访问
                    arg[0].mode = "open";
                }
                const shadowRoot = this._attachShadow.apply(this, arg);
                // 添加标记属性以便后续查找
                shadowRoot.host.setAttribute("clipnote", "");
                return shadowRoot;
            };
            window._hasHackAttachShadow_ = true;
        } catch (e) {
        }
    }

    // 定期发送视频播放信息到服务器
    setInterval(function(){
        if(video&&socket&&!video.paused){
            if(socket.readyState==1){
                var obj = { action: "info", duration:parseInt(video.duration),current:parseInt(video.currentTime) };
                socket.send(JSON.stringify(obj));
            }            
        }

    }, 500);

    // 创建Intersection Observer监听视频元素的可见性
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // 针对不同平台的视频播放处理
                if (href().includes("aliyundrive.com")) {
                    var play = document.getElementsByClassName("btn--UrTVT");
                    play[1].click();
                }else{
                    if(video){
                        video.play();
                    }
                }
            } 
        });
    }, { threshold: 0 });

    // 更新视频列表
    updete_video();
    function updete_video() {
        hackAttachShadow();
        let videoObj = [];
        let videoSrc = [];
        // 查找页面中的所有视频和音频元素
        document.querySelectorAll("video ,audio").forEach(function (video) {
            if (video.currentSrc != "" && video.currentSrc != undefined) {
                videoObj.push(video);
                videoSrc.push(video.currentSrc);
            }
        });
        // 查找iframe中的视频元素
        document.querySelectorAll("iframe").forEach(function (iframe) {
            if (iframe.contentDocument == null) { return; }
            iframe.contentDocument.querySelectorAll("video ,audio").forEach(function (video) {
                if (video.currentSrc != "" && video.currentSrc != undefined) {
                    videoObj.push(video);
                    videoSrc.push(video.currentSrc);
                }
            });
        });
        // 查找shadow DOM中的视频元素
        document.querySelectorAll("[clipnote]").forEach(function (elem) {
            elem.shadowRoot.querySelectorAll("video ,audio").forEach(function (video) {
                if (video.currentSrc != "" && video.currentSrc != undefined) {
                    videoObj.push(video);
                    videoSrc.push(video.currentSrc);
                }
            });
        });

        if (videoObj.length > 0) {
            // 检测视频列表是否发生变化
            if (videoObj.length !== _videoObj.length || videoSrc.toString() !== _videoSrc.toString()) {
                _videoSrc = videoSrc;
                _videoObj = videoObj;
              
                if (ws == false) {
                    seek();
                    createWebSocket(); }
                _videoObj.forEach(function (videoElement) {
                    // 设置跨域属性
                    if (!href().includes("cloud.189.cn")) {
                        videoElement.setAttribute("crossOrigin", 'anonymous');
                    }
                    // 监听视频时间更新事件
                    videoElement.addEventListener("timeupdate", function () {
                        if(cnt){
                            // 处理时间段播放控制
                            if (cnt.includes("-")) {
                                if ((video.currentTime >= cnt.split("-")[1])&&(parseInt(video.currentTime)==parseInt(cnt.split("-")[1]))) {
                                    video.pause();
                                    cnt="";
                                }
                            }
                            // 处理循环播放控制
                            if (cnt.includes("~")) {
                                if ((video.currentTime >= cnt.split("~")[1])&&(parseInt(video.currentTime)==parseInt(cnt.split("~")[1]))) {
                                    video.currentTime = cnt.split("~")[0];
                                }
                            }
                        }
                      
                    });
                   observer.observe(videoElement);
                });
            }
        }
        requestAnimationFrame(updete_video);
    }

    // 记录最长时长的视频
    var duration =0;
    var v = null;
    bind_video();
    function bind_video() {
        _videoObj.forEach(function (value) {
            if (value.duration >= duration) {
                duration = value.duration;
                v = value;
            }
        });
        if (v && (v != video||video.src=="")) {
            video = v;
            seek();         
            duration = 0;
            v = null;
        }
    requestAnimationFrame(bind_video);
    }

    // URL参数处理函数
    function addParameterToUrl(url, paramName, paramValue) {
        const separator = url.includes('?') ? '&' : '?';
        const newUrl = `${url}${separator}${paramName}=${paramValue}`;
        return newUrl;
    }

    // 移除URL中的cnf参数
    function nocnf(url) {
        let link = url;
        var regex = /[/?&]cnf=.*/g;
        var match = regex.exec(link);
        if (match) {
            link = link.replace(match[0], "");
        }
        return link;
    }

    // 移除URL中的cnt参数
    function nocnt(url) {
        let link = url;
        var regex = /[/?&]cnt=.*/g;
        var match = regex.exec(link);
        if (match) {
            link = link.replace(match[0], "");
        }
        return link;
    }

    // 移除URL中的hash部分
    function nohash(url) {
        let link = url;
        var regex = /#.*$/g;
        var match = regex.exec(link);
        if (match) {
            link = link.replace(match[0], "");
        }
        return link;
    }
  
    // 获取处理后的URL
    function href() {
        var url = nohash(nocnt(nocnf(decodeURIComponent(window.location.href))));
        if(filename()!=""){}
        if (url.includes("aliyundrive.com")) {
            url = addParameterToUrl(url, "cnf", filename())
        }
        url += window.location.hash;
        return url;
    }

    // 获取不同平台的文件名
    function filename(){
        if (window.location.href.includes("aliyundrive.com")) {
            var filename = document.querySelector(".text--KBVB3");
            if (filename) {
                var f = filename.textContent;
                return f;
            }
        }
        if (window.location.href.includes("cloud.189.cn")) {
            var filename = document.querySelector(".video-title");
            if (filename) {
                var f = filename.textContent;
                return f;
            }
        }
        if (window.location.href.includes("pan.xunlei")) {
            var filename = document.querySelector(".video-name");
            if (filename) {
                var f = filename.getAttribute("title");
                return f;
            }
        }
        return "";
    }

    // 页面加载完成后执行点击操作
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            click();
        }
    };

    // 视频控制函数
    function pause() { if (video) { video.pause(); } }
    function play() {
        if (video) {
            video.muted = false;
            video.play();
        }
    }

    // 获取URL参数
    function getQueryVariable(variable) {
        var query = decodeURIComponent(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return "";
    }
  
    // 阿里云盘视频处理
    function aliyundrive() {
        var elements = document.getElementsByClassName('title--HvI83');
        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].textContent == cnf) {
                    elements[i].click();
                    play();
                }
            }
        } 
    }

    // 阿里云盘视频处理（备用选择器）
    function aliyundrive2() {
        var elements = document.getElementsByClassName('text-primary--JzAb9');
        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].textContent == cnf) {
                    elements[i].click();
                    play();
                }
            }
        } 
    }

    // 天翼云盘视频处理
    function tianyi() {
        var elements = document.getElementsByClassName('file-item-name-fileName-span');
        var ad = document.getElementsByClassName("advertising-popup-close");
        if (ad[0]) { ad[0].click(); }
        if (elements.length > 0 && elements[0].getAttribute("title")) {
            for (var i = 0; i < elements.length; i++) {

                if ((elements[i].getAttribute("title") == cnf)) {
                    var previousSibling = elements[i].parentNode.parentNode.previousElementSibling;
                    setTimeout(function () { previousSibling.click(); }, 1500);
                    play();
                }
            }
        } 
    }

    // 迅雷网盘视频处理
    function xunlei() {
        var elements = document.getElementsByTagName('a');
        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute("title") == cnf) {
                    elements[i].click();
                    play();
                }
            }
        }
    }

    // 根据不同平台执行相应的点击操作
    function click() {
        if (href().includes("weibo.com") || href().includes("weibo.cn")) {
            var button = document.querySelector('.mwbv-play-button');
            if (button) { button.click(); }
        }
        if (href().includes("aliyundrive.com")) {
          
            setTimeout(aliyundrive, 1500);
            setTimeout(aliyundrive2, 1500);
        }
        if (href().includes("cloud.189.cn")) {
            setTimeout(tianyi, 1500);
        }
        if (href().includes("mp.weixin")) {
            var play = document.querySelector('.mid_play_box.reset_btn');
            play.click();
        }
        if (href().includes("pan.xunlei")) {
            setTimeout(xunlei, 1500);
        }
        if (href().includes("zhihu.com")) {
                    var play = document.getElementsByClassName("_1smmk5k");
                    play[0].click();
                }
    }

    // 视频跳转控制
    function seek() {
        var pos = -2;
        if(cnt){
            if (cnt.includes("-")) {
                pos = cnt.split("-")[0];
            }
            else if (cnt.includes("~")) {
                pos = cnt.split("~")[0];
            } else if (cnt != "") {
                pos = cnt;
            }
        }
       
        if(video&&pos>=0){
            setTimeout(function () {
                video.currentTime = pos;
                if (parseInt(video.currentTime) != parseInt(pos)) {
                    requestAnimationFrame(seek);
                } else {
                    play();
                }
            }, 200);
        }else{
            requestAnimationFrame(seek);
        }
        
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState == 'visible') {
            play();
            if (_videoObj.length > 0 && socket.readyState != 1) {
                createWebSocket();
            }
        } else {
            pause();
            if (_videoObj.length > 0) {
                socket.close();
            }
        }
    });
    function createWebSocket() {
        ws = true;
        socket = new WebSocket(socketUrl);
        socket.addEventListener('open', function (event) {
                play();
        });
        socket.addEventListener('message', function (event) {
            var json = JSON.parse(event.data);
            if (document.visibilityState != 'visible') { pause(); return; }
            if (json["action"] == "pos") {
                var currentTime = video.currentTime;
                var obj = { action: "pos", data: currentTime, url: href()};
                socket.send(JSON.stringify(obj));
            }
            if (json["action"] == "pos"){
                cnt=json["cnt"];
                seek()
            }
            if (json["action"] == "seek") {
                var url = new URL(href());
                var domain = url.host;
                if ((href().includes(nocnf(json["url"]))||nocnf(json["url"]).includes(href()))&&domain!=href().replace("https://","").replace("http://","").replace("/","")) {
                    cnt=json["cnt"];
                    seek()
                } else {
                  
                   window.location.href = json["data"];
                }

            }
            if (json["action"] == "playorpause") {
                if (video.paused) {
                    play();
                } else {
                    pause();
                }
            }
            if (json["action"] == "pause") {
                pause();
            }
            if (json["action"] == "play") {
                play()
            }
            if (json["action"] == "snapshots") {
                var canvas = document.createElement('canvas');
                canvas.style.cssText = 'display: none;';
                document.body.appendChild(canvas);
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                var context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                try {
                    var screenshotDataUrl = canvas.toDataURL('image/png');
                    var obj = { action: "snapshots", data: screenshotDataUrl, url: href() };
                    socket.send(JSON.stringify(obj));
                } catch {
                    alert("服务器跨域限制,请手动操作！");
                    canvas.style = 'max-width:100%';
                    const previewPage = window.open('', '_blank');
                    if (previewPage && previewPage.document) {
                        previewPage.document.title = 'snapshots';
                        previewPage.document.body.style.textAlign = 'center';
                        previewPage.document.body.style.background = '#000';
                        previewPage.document.body.appendChild(canvas);
                    } else {
                        alert("无法打开窗口，请设置浏览器权限（设置->cookie和网站权限->弹出窗口和重定向->允许）");
                    }
                    return;
                }
            }
            if (json["action"] == "close") {
                pause();
                window.close();
            }
            if (json["action"] == "kj") {
                video.currentTime = video.currentTime + 5;
            }
            if (json["action"] == "kt") {
                video.currentTime = video.currentTime - 5;
            }
            if (json["action"] == "jiasu") {
                video.playbackRate = video.playbackRate + 0.25;
            }
            if (json["action"] == "jiansu") {
                video.playbackRate = video.playbackRate - 0.25;
            }
            if (json["action"] == "changsu") {
                video.playbackRate = 1.0;
            }
           
            if (json["action"] == "yljia") {
                if(video.volume+ 0.1>1.0){
                    video.volume = 1.0;
                }else{
                    video.volume = video.volume+ 0.1;
                }
            }
            if (json["action"] == "yljian") {

                if(video.volume- 0.1<0.0){
                    video.volume = 0.0;
                }else{
                    video.volume = video.volume- 0.1;
                }
            }
        });
        socket.addEventListener('close', function (event) {
            if (document.visibilityState == "visible"&&socket.readyState!=1) {
                setTimeout(createWebSocket, 500);
            }
        });
    }
})();