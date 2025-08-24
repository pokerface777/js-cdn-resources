// 设备兼容性修复脚本
(function() {
    'use strict';
    
    function fixHuaweiCompatibility() {
        const ua = navigator.userAgent.toLowerCase();
        
        const isHuawei = [
            'huawei', 'honor', 'ela-', 'harmonyos', 'emui', 'hms',
            'ana-', 'vog-', 'lya-', 'yal-', 'aqm-', 'jny-', 'tah-',
            'tnp-', 'nop-', 'hw-', 'p40', 'p30', 'mate'
        ].some(k => ua.includes(k));
        
        if (isHuawei) {
            console.log('🔧 华为设备兼容性修复已启用');
            window.__huawei_mobile_fix__ = true;
            
            if (!window.ontouchstart) {
                window.ontouchstart = null;
            }
            if (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0) {
                Object.defineProperty(navigator, 'maxTouchPoints', { 
                    value: 10,
                    writable: false,
                    configurable: false
                });
            }
            
            if (typeof window.orientation === 'undefined') {
                window.orientation = screen.width < screen.height ? 0 : 90;
                window.addEventListener('resize', function() {
                    window.orientation = screen.width < screen.height ? 0 : 90;
                });
            }
            
            if (!window.devicePixelRatio || window.devicePixelRatio < 1) {
                Object.defineProperty(window, 'devicePixelRatio', {
                    value: 2.0,
                    writable: false,
                    configurable: false
                });
            }
            
            function addDeviceClasses() {
                if (document.body) {
                    document.body.classList.add('huawei-device');
                    if (ua.includes('ela-') || ua.includes('p40')) {
                        document.body.classList.add('huawei-p40');
                    }
                    if (ua.includes('harmonyos')) {
                        document.body.classList.add('harmonyos-device');
                    }
                }
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addDeviceClasses);
            } else {
                addDeviceClasses();
            }
        }
    }
    
    function fixAppleCompatibility() {
        const ua = navigator.userAgent.toLowerCase();
        
        const isApple = [
            'iphone', 'ipad', 'ipod', 'macintosh', 'safari'
        ].some(k => ua.includes(k));
        
        const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
        
        if (isApple) {
            console.log('🍎 苹果设备兼容性修复已启用');
            window.__apple_mobile_fix__ = true;
            window.__safari_browser__ = isSafari;
            
            if (!window.ontouchstart) {
                window.ontouchstart = null;
            }
            if (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0) {
                Object.defineProperty(navigator, 'maxTouchPoints', { 
                    value: 5,
                    writable: false,
                    configurable: false
                });
            }
            
            if (typeof window.orientation === 'undefined') {
                window.orientation = screen.width < screen.height ? 0 : 90;
                window.addEventListener('resize', function() {
                    window.orientation = screen.width < screen.height ? 0 : 90;
                });
            }
            
            if (!window.devicePixelRatio || window.devicePixelRatio < 1) {
                Object.defineProperty(window, 'devicePixelRatio', {
                    value: 2.0,
                    writable: false,
                    configurable: false
                });
            }
            
            function addAppleDeviceClasses() {
                if (document.body) {
                    document.body.classList.add('apple-device');
                    if (ua.includes('iphone')) {
                        document.body.classList.add('iphone-device');
                    }
                    if (ua.includes('ipad')) {
                        document.body.classList.add('ipad-device');
                    }
                    if (isSafari) {
                        document.body.classList.add('safari-browser');
                    }
                }
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addAppleDeviceClasses);
            } else {
                addAppleDeviceClasses();
            }
        }
    }
    
    fixHuaweiCompatibility();
    fixAppleCompatibility();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            fixHuaweiCompatibility();
            fixAppleCompatibility();
        });
    }
})();

// 工具函数
function copyToClipboard(kl) {
    var cont = document.getElementById('des');
    cont.value = kl;
    cont.select();
    document.execCommand('Copy');
    alert('复制成功');
}

function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
}

if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
} else {
    onBridgeReady();
}

function isQQAPP(){
    var ua = navigator.userAgent;
    return /QQ\//.test(ua) && !/QQBrowser(?!\/)/.test(ua);
}

function isJump(channel) {
    if(isQQAPP()) {
        return true
    }

    var fullUrl = window.location.href;
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/aweme/i)) {
        return false;
    } else if(ua.match(/AlipayClient/i) && channel == 'weixin') {
        return true;
    }

    return false;
}

function isJumpByServer(payId,vm) {
    const flattened = Object.values(vm.payList).reduce((acc, val) => acc.concat(val), []);
    const target = flattened.find(item => item.id === payId);

    let qq_is_jump=1;
    let wx_is_jump=1;
    let dy_is_jump=1;
    let ks_is_jump=1;

    if (target) {
        qq_is_jump = target.qq_is_jump ?? 1;
        wx_is_jump = target.wx_is_jump ?? 1;
        dy_is_jump = target.dy_is_jump ?? 1;
        ks_is_jump = target.ks_is_jump ?? 1;
    }

    var ua = navigator.userAgent;
    if(qq_is_jump && /QQ\//.test(ua) && !/QQBrowser(?!\/)/.test(ua)) {
        return true;
    }else if (wx_is_jump && /MicroMessenger\/([\d.]+)/.test(ua)) {
        return true;
    }else if (dy_is_jump && /aweme(_|\/)([\d.]+)/i.test(ua)) {
        return true;
    }else if (ks_is_jump && /Kwai\/[\d.]+/.test(ua)) {
        return true;
    }else{
        return false;
    }
}

function isJump1(channel) {
    var fullUrl = window.location.href;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else if(ua.match(/aweme/i)) {
        return false;
    } else if(ua.match(/AlipayClient/i) && channel == 'weixin') {
        return true;
    }

    return false;
}

// 初始化
window.onload = function(){
    var app = document.getElementById("list");
    if (!app) return;
    
    var touchstartY;
    app.addEventListener("touchstart",function (event) {
        var events = event.touches[0] || event;
        touchstartY = events.clientY;
    },{passive: false});
    
    app.addEventListener("touchmove",function (event) {
        var events = event.touches[0] || event;
        var scrollTop = app.scrollTop || document.documentElement.scrollTop;
        var clientHeight = document.documentElement.clientHeight;
        var scrollHeight = app.scrollHeight;
        if (events.clientY > touchstartY && scrollTop === 0 && event.cancelable)
        {
            event.preventDefault();
        } else if (scrollTop + clientHeight > scrollHeight && event.cancelable)
        {
            // event.preventDefault();
        }
    }, {passive: false});
};

var height = document.documentElement.clientHeight;
$('.wrap').css('height',height);

Vue.config.productionTip = false;
Vue.config.lang = 'zh-CN';

Vue.use(vant.Lazyload, {
    lazyComponent: true,
});

// Vue实例
new Vue({
    el: '#app',
    data: {
        payTypeActive: 0,
        active: 0,
        myPlayer: {},
        list: [],
        refreshing: false,
        total: 0,
        itemindex: 0,
        activeClass: -1,
        cat: [],
        ds_title: "demo",
        ds_img: "",
        loading: false,
        finished: false,
        isShow: true,
        password: '',
        vid: 0,
        overlay: false,
        msg: '没有更多了',
        kouling: "OwGXNr",
        rkType: 1,
        ldk: "",
        hezi: {
            status: "",
            url: "",
        },
        params: {
            ldk: "",
            page: 1,
            limit: 20,
            encode: 1,
            cid: '',
            key: '',
            rkType: 1,
            payed: "0",
        },
        dialog: {
            pay: {
                status: false,
                data: [],
            },
            qrcode: {
                status: false,
                img: "/uploads/20250522/4b088d5f2ca2cf053f001227c661b4be.jpg",
                title: "长按识别观看精彩内容",
            },
            login: {
                status: false,
                vipStatus: false
            }
        },
        show: false,
        payList: [],
        url: '',
        money: '',
        activeTab: 0,
        decryptedParams: {
            f: '',
            fingerprint: ''
        }
    },
    created() {
        if (!this.securityCheck()) {
            return;
        }
        
        this.addAppEnvironmentClass();
        this.decryptedParams.fingerprint = this.ensureUUID();
        this.handleUrlParams();
    },
    mounted: function () {
        this.getPayList();
        let vm = this;
        
        // 初始化示例数据 - 动态加载
        vm.initializeData();
        
        vm.getCat();
        vm.doGetList(-1,'cat');
        if (vm.hezi.status) {
            vm.createPlayer(vm.hezi.url);
        }

        window.addEventListener('scroll',function(){
            let scrollHight = $('#list').scrollTop()
            if(scrollHight > 1)
            {
                vm.isShow = false
                if(vm.hezi.url){
                    vm.hezi.status = false
                }
            }else{
                vm.isShow = true
                if(vm.hezi.url){
                    vm.hezi.status = true
                }
            }
        },true)
    },
    methods: {
        // 安全检测方法
        securityCheck() {
            try {
                if (!this.isMobileDevice()) {
                    this.redirectToError('设备不支持，请使用手机访问');
                    return false;
                }
                
                if (!this.validateURL()) {
                    this.redirectToError('访问地址无效');
                    return false;
                }
                
                if (this.isDebugEnvironment()) {
                    this.redirectToError('检测到调试环境');
                    return false;
                }
                
                return true;
            } catch (e) {
                console.log('安全检测异常');
                this.redirectToError('系统检测异常');
                return false;
            }
        },
        
        // 检测是否为真实移动设备
        isMobileDevice() {
            const ua = navigator.userAgent.toLowerCase();
            
            if (window.__apple_mobile_fix__ || ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
                return true;
            }
            
            if (this.isDouyinAPP() || this.isKuaishouAPP()) {
                return true;
            }
            
            if (this.isWeixinAPP() || this.isQQAPP_Mobile()) {
                return true;
            }
            
            if (window.__huawei_mobile_fix__) {
                return true;
            }
            
            if (!/mobile|android|iphone|ipad|phone|blackberry|opera mini|windows ce|nokia|sony/i.test(ua)) {
                return false;
            }
            
            const simulatorKeywords = [
                'simulator', 'emulator', 'virtual', 'genymotion', 
                'bluestacks', 'noxplayer', 'android sdk', 'google sdk'
            ];
            
            for (let keyword of simulatorKeywords) {
                if (ua.includes(keyword.toLowerCase())) {
                    return false;
                }
            }
            
            if (!('ontouchstart' in window) && !navigator.maxTouchPoints && 
                !ua.includes('mobile') && !ua.includes('android') && !ua.includes('iphone')) {
                return false;
            }
            
            if (screen.width > 1200 || screen.height > 1920) {
                if (!ua.includes('mobile') && !ua.includes('android') && !ua.includes('iphone')) {
                    return false;
                }
            }
            
            return true;
        },
        
        isDouyinAPP() {
            const ua = navigator.userAgent.toLowerCase();
            return /aweme/i.test(ua) || /douyin/i.test(ua) || /toutiao/i.test(ua);
        },
        
        isKuaishouAPP() {
            const ua = navigator.userAgent.toLowerCase();
            return /kwai/i.test(ua) || /kuaishou/i.test(ua);
        },
        
        isWeixinAPP() {
            const ua = navigator.userAgent.toLowerCase();
            return /micromessenger/i.test(ua);
        },
        
        isQQAPP_Mobile() {
            const ua = navigator.userAgent;
            return /QQ\//.test(ua) && !/QQBrowser(?!\/)/.test(ua);
        },
        
        addAppEnvironmentClass() {
            const bodyElement = document.body;
            
            if (this.isDouyinAPP()) {
                bodyElement.classList.add('douyin-app');
                console.log('检测到抖音APP环境');
            } else if (this.isKuaishouAPP()) {
                bodyElement.classList.add('kuaishou-app');
                console.log('检测到快手APP环境');
            } else if (this.isWeixinAPP()) {
                bodyElement.classList.add('weixin-app');
                console.log('检测到微信APP环境');
            } else if (this.isQQAPP_Mobile()) {
                bodyElement.classList.add('qq-app');
                console.log('检测到QQ APP环境');
            } else {
                bodyElement.classList.add('browser-env');
                console.log('检测到浏览器环境');
            }
            
            if (this.isMobileDevice()) {
                bodyElement.classList.add('mobile-device');
            }
        },
        
        validateURL() {
            const currentURL = window.location.href;
            const pathname = window.location.pathname;
            const ua = navigator.userAgent.toLowerCase();
            
            if (window.__apple_mobile_fix__ || ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
                const criticalInvalidPatterns = [
                    /\/admin\//,
                    /\/api\//,
                    /\/debug\//
                ];
                
                for (let pattern of criticalInvalidPatterns) {
                    if (pattern.test(currentURL)) {
                        return false;
                    }
                }
                
                if (pathname.includes('/newh5') || pathname.includes('newh5') || 
                    currentURL.includes('info=')) {
                    return true;
                }
                
                return true;
            }
            
            if (this.isDouyinAPP() || this.isKuaishouAPP()) {
                const criticalInvalidPatterns = [
                    /\/admin\//,
                    /\/api\//,
                    /\/debug\//
                ];
                
                for (let pattern of criticalInvalidPatterns) {
                    if (pattern.test(currentURL)) {
                        return false;
                    }
                }
                
                return true;
            }
            
            if (this.isWeixinAPP() || this.isQQAPP_Mobile()) {
                const criticalInvalidPatterns = [
                    /\/admin\//,
                    /\/api\//,
                    /\/debug\//
                ];
                
                for (let pattern of criticalInvalidPatterns) {
                    if (pattern.test(currentURL)) {
                        return false;
                    }
                }
                
                return true;
            }
            
            if (window.__huawei_mobile_fix__) {
                const criticalInvalidPatterns = [
                    /\/admin\//,
                    /\/api\//,
                    /\/debug\//
                ];
                
                for (let pattern of criticalInvalidPatterns) {
                    if (pattern.test(currentURL)) {
                        return false;
                    }
                }
                
                return true;
            }
            
            const invalidPatterns = [
                /#\/d\/[a-zA-Z0-9]+/,
                /\/admin\//,
                /\/api\//,
                /\/test\//,
                /\/debug\//
            ];
            
            for (let pattern of invalidPatterns) {
                if (pattern.test(currentURL)) {
                    return false;
                }
            }
            
            if (!pathname.includes('/newh5') && !pathname.endsWith('/newh5')) {
                return false;
            }
            
            return true;
        },
        
        isDebugEnvironment() {
            const ua = navigator.userAgent.toLowerCase();
            
            if (window.__apple_mobile_fix__ || ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
                console.log('🍎 苹果设备跳过调试环境检测');
                return false;
            }
            
            if (this.isDouyinAPP() || this.isKuaishouAPP()) {
                return false;
            }
            
            if (this.isWeixinAPP() || this.isQQAPP_Mobile()) {
                return false;
            }
            
            if (window.__huawei_mobile_fix__) {
                return false;
            }
            
            let devtools = false;
            const threshold = 160;
            
            try {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.outerWidth > threshold) {
                    devtools = true;
                }
            } catch (e) {
                // 忽略错误
            }
            
            try {
                const start = performance.now();
                debugger;
                const end = performance.now();
                if (end - start > 100) {
                    devtools = true;
                }
            } catch (e) {
                // 忽略错误
            }
            
            try {
                if (typeof console !== 'undefined' && 
                    console.clear && 
                    console.clear.toString().indexOf('[native code]') === -1) {
                    devtools = true;
                }
            } catch (e) {
                // 忽略错误
            }
            
            return devtools;
        },
        
        redirectToError(message) {
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #000;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    text-align: center;
                    flex-direction: column;
                ">
                    <h2 style="color: #ff4444; margin-bottom: 20px;">访问受限</h2>
                    <p style="font-size: 16px; margin-bottom: 10px;">${message}</p>
                    <p style="font-size: 14px; color: #888;">请使用手机浏览器访问</p>
                </div>
            `;
            
            throw new Error('安全检测失败');
        },
        
        selectPay(i){
            this.payTypeActive = i
        },
        
        select(str,index,money){
            this.active = index
            this.url = str
            this.show = true
            this.doClose()
            this.payList = []
            this.money = money
            this.getPayList()
        },
        
        getPayList(){
            var vm = this;
            // 这里可以添加获取支付列表的逻辑
        },
        
        showPopup(){
            this.show = true
        },
        
        createPlayer(url){
            if (typeof Hls !== 'undefined') {
                this.myPlayer = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                this.myPlayer.loadSource(url);
                this.myPlayer.attachMedia(document.getElementById('mse'));
            }
        },
        
        copy(){
            let clipboard = new ClipboardJS(".tip-item .copy")
            clipboard.on('success', e => {
                vant.Toast.success('复制成功')
                e.clearSelection();
            })
            clipboard.on('error', e => {
                vant.Toast.success('复制失败')
            });
        },
        
        doClose(e){
            const overlayEl = document.querySelector('.overlay');
            if (overlayEl) {
                overlayEl.classList.remove('show');
            }
            document.body.classList.remove('modal-open');
            
            if (window.__huawei_mobile_fix__) {
                console.log('🔧 华为设备弹窗关闭优化已应用');
            }
            
            setTimeout(() => {
                this.dialog.pay.status = false
                this.dialog.pay.data = []
                this.dialog.qrcode.status = false
                this.overlay = false
                this.dialog.login.status = false
            }, 300);
        },
        
        doQrcode(){
            this.dialog.pay.status = false
            this.dialog.pay.data = []
            this.dialog.qrcode.status = true
        },
        
        doLogin(){
            this.dialog.pay.status = false
            this.dialog.pay.data = []
            this.dialog.login.status = true
        },
        
        sumLogin(){
            let vm = this
            if(!vm.password) {
                return vant.Toast.fail('请先输入口令')
            }

            $.ajax({
                url: "/api/resource/login",
                type: 'POST',
                dataType: 'JSON',
                data: {'pwd':vm.password,'ldk':vm.ldk,'type':vm.rkType},
                complete: function (XMLHttpRequest, textStatus) {
                },
                success: function (res) {
                    if(res.code==200){
                        vant.Toast.success(res.msg);
                        location.href = res.url
                    }else{
                        return vant.Toast.fail(res.msg)
                    }
                }
            });
        },
        
        linkTo(payItem) {
            let vm = this;
            let baseUrl = window.location.protocol + '//' + document.domain + '/';
            let fullUrl = baseUrl + payItem.url;
            
            let form = document.createElement('form');
            form.method = 'POST';
            form.action = fullUrl;
            
            let urlParams = new URLSearchParams(payItem.url.split('?')[1]);
            let murmur = urlParams.get('murmur');
            
            let postData = {
                f: vm.decryptedParams.f,
                vid: vm.vid,
                money: payItem.money,
                murmur: vm.decryptedParams.fingerprint,
            };
            
            Object.entries(postData).forEach(([key, value]) => {
                let input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        },
        
        doSearch(e) {
            let vm = this;
            vm.params.page = 1;
            vm.list = [];
            this.doGetList("-1", '');
        },
        
        doTop() {
            $('#list').scrollTop(0);
        },
        
        doPay(item) {
            let vm = this;
            vm.vid = item.id;
            vm.ds_img = item.img;
            vm.ds_title = item.title;
            
            if (item.pay == 1) {
                let data = {
                    'vid': item.id,
                    'm': item.money,
                    'f': vm.decryptedParams.f,
                    'murmur': vm.decryptedParams.fingerprint
                };
                let url = window.location.protocol + '//' + window.location.host + '/fvideo';

                var temp = document.createElement("form");
                temp.action = url;
                temp.method = "post";
                temp.style.display = "none";
                for (var x in data) {
                    var opt = document.createElement("textarea");
                    opt.name = x;
                    opt.value = data[x];
                    temp.appendChild(opt);
                }
                document.body.appendChild(temp);
                temp.submit();
                return temp;
            }
            
            $.ajax({
                url: "/index/index/pays",
                type: 'POST',
                dataType: 'JSON',
                data: {
                    'vid': item.id,
                    'm': item.money,
                    'f': vm.decryptedParams.f,
                    'murmur': vm.decryptedParams.fingerprint
                },
                success: function (res) {
                    if(res.code == 200){
                        vm.ds_img = res.stock.ds_img;
                        vm.ds_title = res.stock.title;
                        
                        // 转换后端数据为前端需要的格式
                        vm.dialog.pay.data = res.pay.map((payItem, index) => {
                            // 根据支付方式名称判断类型
                            let type = 'alipay'; // 默认支付宝
                            let icon = '支'; // 默认支付宝图标
                            
                            if (payItem.name.includes('微信') || payItem.name.includes('WeChat') || 
                                payItem.name.toLowerCase().includes('wechat')) {
                                type = 'wechat';
                                icon = '✓';
                            }
                            
                            let convertedItem = {
                                id: payItem.id,
                                name: payItem.name,
                                css: payItem.css,
                                type: type,
                                icon: icon,
                                url: payItem.url || '#',
                                money: payItem.money || 0
                            };
                            
                            // 调试输出
                            console.log('🔄 转换支付项:', payItem.name, '→ 类型:', type, '图标:', icon);
                            
                            return convertedItem;
                        });
                        
                        console.log('最终支付数据:', vm.dialog.pay.data);
                        
                        vm.dialog.pay.status = true;
                        vm.overlay = true;
                        
                        vm.$nextTick(() => {
                            const overlayEl = document.querySelector('.overlay');
                            if (overlayEl) {
                                overlayEl.classList.add('show');
                            }
                            document.body.classList.add('modal-open');
                            
                            // 简单调试
                            console.log('✅ 弹窗已显示，支付数据:', vm.dialog.pay.data.length, '个选项');
                            
                            // 检查图标大小
                            setTimeout(() => {
                                const icons = document.querySelectorAll('.payment-icon');
                                console.log('🔍 检查图标数量:', icons.length);
                                icons.forEach((icon, index) => {
                                    const computed = window.getComputedStyle(icon);
                                    console.log(`图标 ${index}:`, {
                                        宽度: computed.width,
                                        高度: computed.height,
                                        字体大小: computed.fontSize,
                                        显示文字: icon.textContent
                                    });
                                });
                            }, 300);
                            
                            if (window.__huawei_mobile_fix__) {
                                console.log('🔧 华为设备弹窗居中优化已应用');
                            }
                        });
                    } else {
                        vant.Toast.fail('获取支付信息失败');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('支付接口请求失败:', error);
                    vant.Toast.fail('网络请求失败，请重试');
                }
            });
        },
        
        doGetList(index, row) {
            let vm = this;
            
            if (arguments.length === 0) {
                vm.loading = true;
            } else {
                if (index || index === 0) {
                    vm.activeClass = index;
                }
        
                if (row == "payed") {
                    vm.list = [];
                    vm.finished = false;
                    vm.params.page = 1;
                    vm.params.payed = 1;
                    vm.params.cid = '';
                    this.dialog.login.vipStatus = true;
                }
        
                if (row != undefined && row.id != undefined) {
                    vm.list = [];
                    vm.finished = false;
                    vm.params.page = 1;
                    vm.params.payed = 0;
                    vm.params.cid = row.id;
                }
        
                if (row == "cat") {
                    vm.list = [];
                    vm.finished = false;
                    vm.params.page = 1;
                    vm.params.payed = 0;
                    vm.params.key = '';
                    vm.params.cid = 0;
                }
            }
        
            let requestParams = {
                'num': 1,
                'size': 10,
                'f': vm.decryptedParams.f,
                'row': 50,
                'murmur': vm.decryptedParams.fingerprint,
                'time': null,
                'page': vm.params.page,
                'cid': vm.params.cid || "",
                'key': vm.params.key || "",
                'payed': vm.params.payed || "0"
            };

            $.ajax({
                url: '/index/index/vlist',
                type: 'POST',
                dataType: 'JSON',
                data: requestParams,
                success: function (res) {
                    if (res.status == 1) {
                        if (vm.refreshing) {
                            vm.list = []
                            vm.refreshing = false
                        }
                        vm.loading = false;
                        let encodedData = res.data;
                        let reversedData = encodedData.split('').reverse().join('');
                        let decodedData = Base64.decode(reversedData);
                        let temp = JSON.parse(decodedData);
                        if (temp.length > 0) {
                            if (vm.params.page == 1) {
                                vm.list = temp;
                            } else {
                                vm.list = vm.list.concat(temp);
                                if (vm.list.length == res.total) {
                                    vm.finished = true;
                                }
                            }
                            vm.params.page++;
                        } else {
                            vm.finished = true;
                        }
                    } else {
                        vant.Toast.fail(res.msg);
                    }
                }
            });
        },
        
        onRefresh() {
            this.finished = false
            this.params.page = 1
            this.loading = true
            this.doGetList()
        },
        
        getCat() {
            let vm = this;
            $.ajax({
                url: '/index/index/cat',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    'limit': 99,
                    'f': vm.decryptedParams.f
                },
                success: function (res) {
                    if(res.status==1){
                        let encodedData = res.data;
                        let reversedData = encodedData.split('').reverse().join('');
                        let decodedData = Base64.decode(reversedData);
                        let temp = JSON.parse(decodedData); 
                        let categories = temp.map(item => {
                            return {
                                id: item.id,
                                name: item.title
                            };
                        });
                        
                        vm.cat = categories;
                        console.log('分类数据:', categories);
                    }
                }
            });
        },
        
        jspost(URL, PARAMS) {
            var temp = document.createElement("form");
            temp.action = URL;
            temp.method = "post";
            temp.style.display = "none";
            for (var x in PARAMS) {
                var opt = document.createElement("textarea");
                opt.name = x;
                opt.value = PARAMS[x];
                temp.appendChild(opt);
            }
            document.body.appendChild(temp);
            temp.submit();
            return temp;
        },
        
        decryptAES(encrypted, key) {
            try {
                const encryptedHex = CryptoJS.enc.Hex.parse(encrypted);
                const keyBytes = CryptoJS.enc.Utf8.parse(key);
                const decrypted = CryptoJS.AES.decrypt(
                    { ciphertext: encryptedHex },
                    keyBytes,
                    {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                );
                return decrypted.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                console.error('失败:', e);
                return '';
            }
        },
        
        handleUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const info = urlParams.get('info');
            
            if (info) {
                const key = 'EBACONDEFAULTAES';
                const decrypted = this.decryptAES(info, key);
                
                const params = new URLSearchParams(decrypted);
                this.decryptedParams.f = params.get('f');
                this.decryptedParams.fingerprint = this.ensureUUID();
                
                this.saveDecryptedParams();
            }
        },

        saveDecryptedParams() {
            this.updateRequestParams();
        },

        updateRequestParams() {
            let vm = this;
            vm.params.f = vm.decryptedParams.f;
            vm.params.murmur = vm.decryptedParams.fingerprint;
        },
        
        parseButtonStyle(cssString) {
            try {
                const cleanCss = cssString
                    .replace(/([a-zA-Z0-9]+):/g, '"$1":')
                    .replace(/'/g, '"');
                
                return JSON.parse(cleanCss);
            } catch (e) {
                console.error('解析按钮样式失败:', e);
                return {
                    backgroundColor: '#f6ff00',
                    color: 'red',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px'
                };
            }
        },
        
        ensureUUID() {
            try {
                let uuid = localStorage.getItem('app_uuid');
                if (!uuid) {
                    uuid = this.generateUUIDv4();
                    localStorage.setItem('app_uuid', uuid);
                }
                return uuid;
            } catch (e) {
                if (!this._uuidCache) {
                    this._uuidCache = this.generateUUIDv4();
                }
                return this._uuidCache;
            }
        },
        
        generateUUIDv4() {
            if (window.crypto && window.crypto.getRandomValues) {
                const buffer = new Uint8Array(16);
                window.crypto.getRandomValues(buffer);
                buffer[6] = (buffer[6] & 0x0f) | 0x40;
                buffer[8] = (buffer[8] & 0x3f) | 0x80;
                const hex = Array.from(buffer).map(b => ('00' + b.toString(16)).slice(-2));
                return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
            }
            const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
            return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
        },
        
        setActiveTab(index) {
            this.activeTab = index;
            // 移除所有底部导航的active类
            document.querySelectorAll('.foot-item').forEach(item => {
                item.classList.remove('active');
            });
            // 给当前点击的添加active类
            document.querySelectorAll('.foot-item')[index].classList.add('active');
            
            if (index === 0) {
                // 首页
                this.doGetList(-1, 'cat');
            } else if (index === 2) {
                // 我的页面
                console.log('我的页面功能');
            }
        },
        
        // 初始化数据方法
        initializeData() {
            // 初始化示例数据
            this.list = [
                {
                    id: 1,
                    title: "精彩视频内容1",
                    img: "https://via.placeholder.com/300x200/333/fff?text=Video1",
                    duration: "10:30",
                    rand: 123,
                    money: 9.9,
                    pay: 0
                },
                {
                    id: 2,
                    title: "精彩视频内容2",
                    img: "https://via.placeholder.com/300x200/333/fff?text=Video2",
                    duration: "15:45",
                    rand: 456,
                    money: 19.9,
                    pay: 0
                },
                {
                    id: 3,
                    title: "精彩视频内容3",
                    img: "https://via.placeholder.com/300x200/333/fff?text=Video3",
                    duration: "08:20",
                    rand: 789,
                    money: 29.9,
                    pay: 0
                },
                {
                    id: 4,
                    title: "精彩视频内容4",
                    img: "https://via.placeholder.com/300x200/333/fff?text=Video4",
                    duration: "12:15",
                    rand: 234,
                    money: 39.9,
                    pay: 0
                }
            ];
            
            this.cat = [
                {id: 1, name: "热门"},
                {id: 2, name: "最新"},
                {id: 3, name: "推荐"},
                {id: 4, name: "分类1"},
                {id: 5, name: "分类2"}
            ];
        }
    },
    computed: {
        payListCount() {
            return Object.keys(this.payList).filter(key => !isNaN(parseInt(key, 10))).length;
        }
    }
});
