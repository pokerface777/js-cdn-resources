// API域名配置系统
(function(window) {
    'use strict';
    
    // API配置对象
    const APIConfig = {
        // 默认配置
        baseURL: '000.duanzai.me', // 您的配置域名
        protocol: 'https', // 协议 http 或 https
        version: '1.0.0',
        timeout: 30000,
        debug: true,
        
        // API接口路径配置
        endpoints: {
            // 分类接口
            category: '/index/index/cat',
            // 视频列表接口
            videoList: '/index/index/vlist',
            // 支付接口
            payment: '/index/index/pays',
            // 登录接口
            login: '/api/resource/login',
            // 视频播放接口
            video: '/fvideo'
        },
        
        // 获取完整的API URL
        getFullURL: function(endpoint) {
            const path = this.endpoints[endpoint] || endpoint;
            
            // 如果传入的是完整URL，直接返回
            if (path.startsWith('http://') || path.startsWith('https://')) {
                return path;
            }
            
            // 如果baseURL为空，使用当前域名
            if (!this.baseURL) {
                return path;
            }
            
            // 构建完整URL
            const protocol = this.protocol || 'https';
            const baseURL = this.baseURL.replace(/^https?:\/\//, ''); // 移除协议前缀
            return `${protocol}://${baseURL}${path}`;
        },
        
        // 更新基础URL
        updateBaseURL: function(newBaseURL, newProtocol) {
            this.baseURL = newBaseURL;
            if (newProtocol) {
                this.protocol = newProtocol;
            }
            
            if (this.debug) {
                console.log('🔧 API配置已更新:', {
                    baseURL: this.baseURL,
                    protocol: this.protocol,
                    fullExample: this.getFullURL('category')
                });
            }
        },
        
        // 快速配置方法
        quickSetup: function(domain, protocol = 'https') {
            this.updateBaseURL(domain, protocol);
            return this;
        },
        
        // 验证配置
        validateConfig: function() {
            const errors = [];
            
            if (!this.baseURL) {
                errors.push('baseURL不能为空');
            }
            
            if (!this.protocol || !['http', 'https'].includes(this.protocol)) {
                errors.push('protocol必须为http或https');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        // 获取所有API列表
        getAllAPIs: function() {
            const apis = {};
            for (let key in this.endpoints) {
                apis[key] = this.getFullURL(key);
            }
            return apis;
        }
    };
    
    // 导出到全局
    window.APIConfig = APIConfig;
    
    // 初始化日志
    if (APIConfig.debug) {
        console.log('🚀 API配置已加载:', {
            baseURL: APIConfig.baseURL,
            protocol: APIConfig.protocol,
            endpoints: Object.keys(APIConfig.endpoints)
        });
    }
    
})(window);

// 现代浏览器移动设备检测
(function() {
    'use strict';
    
    // 简化的移动设备检测
    function detectMobileDevice() {
        const ua = navigator.userAgent.toLowerCase();
        
        // 基本的移动设备标识
        if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
            document.body.classList.add('mobile-device');
            
            // 添加具体设备类型
            if (/iphone|ipad|ipod/i.test(ua)) {
                document.body.classList.add('ios-device');
            } else if (/android/i.test(ua)) {
                document.body.classList.add('android-device');
            }
        }
    }
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectMobileDevice);
    } else {
        detectMobileDevice();
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

// 获取URL参数中的访问权限标识
function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 尝试从不同的参数名获取访问标识
    const possibleParams = ['date', 'f', 'token', 'auth', 'access'];
    
    for (let param of possibleParams) {
        const value = urlParams.get(param);
        if (value) {
            console.log(`🔑 找到访问标识 ${param}:`, value);
            return value;
        }
    }
    
    // 尝试从hash中获取
    const hash = window.location.hash;
    if (hash && hash.includes('=')) {
        const hashParams = new URLSearchParams(hash.substring(1));
        for (let param of possibleParams) {
            const value = hashParams.get(param);
            if (value) {
                console.log(`🔑 从hash中找到访问标识 ${param}:`, value);
                return value;
            }
        }
    }
    
    // 从localStorage中获取已保存的标识
    const savedToken = localStorage.getItem('app_access_token');
    if (savedToken) {
        console.log('🔑 使用已保存的访问标识:', savedToken);
        return savedToken;
    }
    
    console.warn('⚠️ 未找到访问标识，API调用可能失败');
    return null;
}

// 保存访问标识到本地存储
function saveAccessToken(token) {
    if (token) {
        localStorage.setItem('app_access_token', token);
        console.log('💾 访问标识已保存');
    }
}

// 获取并保存访问标识
const ACCESS_TOKEN = getAccessToken();
if (ACCESS_TOKEN) {
    saveAccessToken(ACCESS_TOKEN);
}

// 访问权限诊断工具
function diagnoseAccess() {
    console.log('🔍 访问权限诊断报告:');
    console.log('📍 当前URL:', window.location.href);
    console.log('🔑 访问标识 (ACCESS_TOKEN):', ACCESS_TOKEN || '❌ 未找到');
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log('📝 URL参数:', Object.fromEntries(urlParams));
    
    const savedToken = localStorage.getItem('app_access_token');
    console.log('💾 本地保存的标识:', savedToken || '❌ 无');
    
    // 测试API可访问性
    if (ACCESS_TOKEN) {
        console.log('✅ 访问标识可用，API调用应该正常');
    } else {
        console.warn('⚠️ 缺少访问标识，API调用可能会失败！');
        console.log('💡 解决方案：确保URL中包含 ?date=访问码 参数');
    }
    
    return {
        hasToken: !!ACCESS_TOKEN,
        token: ACCESS_TOKEN,
        urlParams: Object.fromEntries(urlParams),
        savedToken: savedToken
    };
}

// 全局访问诊断函数（可在控制台调用）
window.diagnoseAccess = diagnoseAccess;

// 页面加载完成后执行诊断
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(diagnoseAccess, 1000);
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
        ds_title: "",
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
        
        // 访问权限初始化
        this.initializeAccessPermission();
        
        this.addAppEnvironmentClass();
        this.decryptedParams.fingerprint = this.ensureUUID();
        this.handleUrlParams();
    },
    mounted: function () {
        this.getPayList();
        let vm = this;
        
        // 数据将通过API动态加载
        
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
        // 访问权限初始化
        initializeAccessPermission() {
            console.log('🔐 初始化访问权限...');
            
            // 如果有访问标识，更新decryptedParams.f
            if (ACCESS_TOKEN) {
                this.decryptedParams.f = ACCESS_TOKEN;
                console.log('✅ 访问标识已设置:', ACCESS_TOKEN);
            } else {
                console.warn('⚠️ 未检测到访问标识，API调用可能失败');
            }
            
            // 显示当前访问状态
            const hasAccess = !!ACCESS_TOKEN;
            if (hasAccess) {
                vant.Toast({
                    message: '访问权限验证成功',
                    type: 'success',
                    duration: 2000
                });
            } else {
                vant.Toast({
                    message: '未检测到访问权限，请通过正确入口访问',
                    type: 'warning',
                    duration: 3000
                });
            }
            
            return hasAccess;
        },
        
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
        
        // 简化的移动设备检测
        isMobileDevice() {
            const ua = navigator.userAgent.toLowerCase();
            
            // 检查常见的移动APP环境
            if (this.isDouyinAPP() || this.isKuaishouAPP()) {
                return true;
            }
            
            if (this.isWeixinAPP() || this.isQQAPP_Mobile()) {
                return true;
            }
            
            // 基本的移动设备检测
            if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
                return true;
            }
            
            // 触摸设备检测
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                return true;
            }
            
            return false;
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
            
            // 检查禁止访问的路径
            const invalidPatterns = [
                /\/admin\//,
                /\/api\//,
                /\/debug\//,
                /\/test\//
            ];
            
            for (let pattern of invalidPatterns) {
                if (pattern.test(currentURL)) {
                    return false;
                }
            }
            
            // 允许的路径模式
            if (pathname.includes('/newh5') || pathname.includes('newh51') || 
                currentURL.includes('info=')) {
                return true;
            }
            
            return true; // 默认允许访问
        },
        
        isDebugEnvironment() {
            // 移动设备和APP环境跳过调试检测
            if (this.isMobileDevice()) {
                return false;
            }
            
            if (this.isDouyinAPP() || this.isKuaishouAPP()) {
                return false;
            }
            
            if (this.isWeixinAPP() || this.isQQAPP_Mobile()) {
                return false;
            }
            
            // 简化的开发者工具检测
            let devtools = false;
            
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
                url: APIConfig.getFullURL('login'),
                type: 'POST',
                dataType: 'JSON',
                data: {
                    'pwd': vm.password,
                    'ldk': vm.ldk,
                    'type': vm.rkType,
                    'f': ACCESS_TOKEN || vm.decryptedParams.f || getAccessToken() || ''
                },
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
                    'f': ACCESS_TOKEN || vm.decryptedParams.f || getAccessToken() || '',
                    'murmur': vm.decryptedParams.fingerprint
                };
                let url = APIConfig.getFullURL('video');

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
                url: APIConfig.getFullURL('payment'),
                type: 'POST',
                dataType: 'JSON',
                data: {
                    'vid': item.id,
                    'm': item.money,
                    'f': ACCESS_TOKEN || vm.decryptedParams.f || getAccessToken() || '',
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
                            
                            // 弹窗显示成功
                            console.log('✅ 弹窗已显示，支付数据:', vm.dialog.pay.data.length, '个选项');
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
                'f': ACCESS_TOKEN || vm.decryptedParams.f || getAccessToken() || '',
                'row': 50,
                'murmur': vm.decryptedParams.fingerprint,
                'time': null,
                'page': vm.params.page,
                'cid': vm.params.cid || "",
                'key': vm.params.key || "",
                'payed': vm.params.payed || "0"
            };
            
            console.log('🔑 视频列表接口请求数据:', requestParams);

            $.ajax({
                url: APIConfig.getFullURL('videoList'),
                type: 'POST',
                dataType: 'JSON',
                data: requestParams,
                success: function (res) {
                    console.log('✅ 视频列表接口响应:', res);
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
                                console.log('📺 视频列表首页加载:', temp.length + '个视频');
                            } else {
                                vm.list = vm.list.concat(temp);
                                console.log('📺 视频列表追加:', temp.length + '个视频，总计:', vm.list.length);
                                if (vm.list.length == res.total) {
                                    vm.finished = true;
                                }
                            }
                            vm.params.page++;
                        } else {
                            vm.finished = true;
                            console.log('📺 视频列表加载完成');
                        }
                    } else {
                        console.error('❌ 视频列表接口返回错误:', res);
                        vant.Toast.fail('获取视频列表失败：' + (res.msg || '未知错误'));
                    }
                },
                error: function(xhr, status, error) {
                    console.error('❌ 视频列表接口请求失败:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        error: error
                    });
                    
                    vm.loading = false;
                    
                    // 如果是302错误，提示用户
                    if (xhr.status === 302) {
                        vant.Toast.fail('访问被重定向，请检查访问权限');
                    } else {
                        vant.Toast.fail('网络请求失败，请重试');
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
            
            // 准备请求数据，优先使用URL参数中的访问标识
            const requestData = {
                'limit': 99,
                'f': ACCESS_TOKEN || vm.decryptedParams.f || ''
            };
            
            // 如果没有访问标识，尝试从URL参数获取
            if (!requestData.f) {
                console.warn('⚠️ 缺少访问标识，尝试从URL参数获取');
                requestData.f = getAccessToken() || '';
            }
            
            console.log('🔑 分类接口请求数据:', requestData);
            
            $.ajax({
                url: APIConfig.getFullURL('category'),
                type: 'POST',
                dataType: 'JSON',
                data: requestData,
                success: function (res) {
                    console.log('✅ 分类接口响应:', res);
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
                        console.log('📂 分类数据加载成功:', categories.length + '个分类');
                    } else {
                        console.error('❌ 分类接口返回错误:', res);
                        vant.Toast.fail('获取分类失败：' + (res.msg || '未知错误'));
                    }
                },
                error: function(xhr, status, error) {
                    console.error('❌ 分类接口请求失败:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        error: error
                    });
                    
                    // 如果是302错误，提示用户
                    if (xhr.status === 302) {
                        vant.Toast.fail('访问被重定向，请检查访问权限');
                    } else {
                        vant.Toast.fail('网络请求失败，请重试');
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
        }
    },
    computed: {
        payListCount() {
            return Object.keys(this.payList).filter(key => !isNaN(parseInt(key, 10))).length;
        }
    }
});
});
