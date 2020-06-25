/* global ICC_CALLBACK, ICCGAME_PASSPORT */
ICCGAME_API_IOS = (function () {

	/**
	 * 是否调试模式
	 * @returns {Boolean}
	 */
	function isDebug() {
		return (window.navigator.userAgent.indexOf("ICCGAME SDK") < 0);
	}

	/**
	 * 调用应用程序接口
	 * @param {String} name
	 * @returns {String}
	 */
	function zLeiCall(name) {
		if ("ICCGAME_IOS" in window === false) {
			throw new Error("window.ICCGAME_IOS not defined");
		}
		if (typeof (window.ICCGAME_IOS) !== "object") {
			throw new Error("window.ICCGAME_IOS must be a object");
		}
		if (name in window.ICCGAME_IOS === false) {
			throw new Error("window.ICCGAME_IOS." + name + " not exits");
		}
		if (typeof (window.ICCGAME_IOS[name]) !== "function") {
			throw new Error("window.ICCGAME_IOS." + name + " must be a function");
		}
		// 选填参数修正
		var params = new Array();
		for (var i = 1; i < arguments.length; i++) {
			params.push(arguments[i]);
		}
		console.log("window.ICCGAME_IOS." + name + "(" + JSON.stringify(params) + ")");
		return window.ICCGAME_IOS[name].apply(window.ICCGAME_IOS, params);
	}

	/**
	 * 弹出窗口
	 * @param {String} message
	 * @returns {undefined}
	 */
	this.alert = function (message) {
		if (isDebug()) {
			console.warn("ICCGAME_API.tip(String):Void not exists.");
			console.info(message);
//			alert(message);
			return;
		}
		zLeiCall("tip", message);
	};

	/**
	 * 告知游戏
	 * 初始化完成后调用
	 * @returns {undefined}
	 */
	this.ready = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.ready():Void not exists.");
			ICCGAME_PASSPORT.login(ICC_CALLBACK);
			return;
		}
		zLeiCall("ready");
	};

	/**
	 * AES 加密
	 * @param {String} seed
	 * @param {String} cleartext
	 * @returns {String}
	 */
	this.aesEncrypt = function (seed, cleartext) {
		if (isDebug()) {
			console.warn("ICCGAME_API.aesEncrypt(String, String):String not exists.");
			return "";
		}
		return zLeiCall("aesEncrypt", seed, cleartext);
	};

	/**
	 * AES 加密
	 * @param {String} seed
	 * @param {String} ciphertext
	 * @returns {String}
	 */
	this.aesDecrypt = function (seed, ciphertext) {
		if (isDebug()) {
			console.warn("ICCGAME_API.aesDecrypt(String, String):String not exists.");
			return "";
		}
		return zLeiCall("aesDecrypt", seed, ciphertext);
	};

	/**
	 * 判断文件是否存在
	 * @param {String} path
	 * @returns {Boolean}
	 */
	this.fileExists = function (path) {
		if (isDebug()) {
			console.warn("ICCGAME_API.fileExists(String):Boolean not exists.");
			return false;
		}
		return zLeiCall("fileExists", path);
	};

	/**
	 * 读取文件
	 * @param {String} filename
	 * @param {String} contents
	 * @returns {Boolean}
	 */
	this.writeFile = function (filename, contents) {
		if (isDebug()) {
			console.warn("ICCGAME_API.writeFile(String, String):Boolean not exists.");
			return false;
		}
		return zLeiCall("writeFile", filename, contents);
	};

	/**
	 * 追加文件
	 * @param {String} filename
	 * @param {String} contents
	 * @returns {Boolean}
	 */
	this.appendFile = function (filename, contents) {
		if (isDebug()) {
			console.warn("ICCGAME_API.appendFile(String, String):Boolean not exists.");
			return false;
		}
		return  zLeiCall("appendFile", filename, contents);
	};

	/**
	 * 读取文件
	 * @param {String} filename
	 * @returns {String}
	 */
	this.readFile = function (filename) {
		if (isDebug()) {
			console.warn("ICCGAME_API.readFile(String):String not exists.");
			return "";
		}
		return zLeiCall("readFile", filename);
	};

	/**
	 * 删除文件
	 * @param {String} path
	 * @returns {Boolean}
	 */
	this.deleteFile = function (path) {
		if (isDebug()) {
			console.warn("ICCGAME_API.deleteFile(String):Boolean not exists.");
			return false;
		}
		return  zLeiCall("deleteFile", path);
	};

	/**
	 * 获得文件列表
	 * @param {String} path
	 * @returns {Array}
	 */
	this.getFiles = function (path) {
		if (isDebug()) {
			console.warn("ICCGAME_API.getFiles():Array<String> not exists.");
			return [];
		}
		return zLeiCall("getFiles", path);
	};

	/**
	 * 显示窗口
	 * @returns {undefined}
	 */
	this.createActivity = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.createActivity():Void not exists.");
			return;
		}
		zLeiCall("createActivity");
	};

	/**
	 * 隐藏窗口
	 * @returns {undefined}
	 */
	this.finishActivity = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.finishActivity():Void not exists.");
			return;
		}
		zLeiCall("finishActivity");
	};

	/**
	 * 显示浮标按钮
	 * @param {String} imageBase64PNG
	 * @returns {undefined}
	 */
	this.enableAssistiveTouch = function (imageBase64PNG) {
		if (isDebug()) {
			console.warn("ICCGAME_API.enableAssistiveTouch(String):Void not exists.");
			return;
		}
		zLeiCall("enableAssistiveTouch", imageBase64PNG);
	};

	/**
	 * 隐藏浮标按钮
	 * @returns {undefined}
	 */
	this.disableAssistiveTouch = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.disableAssistiveTouch():Void not exists.");
			return;
		}
		zLeiCall("disableAssistiveTouch");
	};

	/**
	 * 唤起苹果支付
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithAppleStore = function (contextJSON) {
		if (isDebug()) {
			console.warn("ICCGAME_API.payWithAppleStore(String):Void not exists.");
			alert(contextJSON);
			return;
		}
		zLeiCall("tranWithAppleStore", contextJSON);
	};

	/**
	 * 苹果支付数据存储地址
	 * @returns {String}
	 */
	this.payWithAppleStoreDataPath = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.payWithAppleStoreDataPath():Void not exists.");
			return "";
		}
		return zLeiCall("tranWithAppleStoreDataPath");
	};

	/**
	 * SD存储路径
	 * @returns {String}
	 */
	this.getExternalStoragePath = function () {
		// /Users/zhangjingyi/Library/Developer/CoreSimulator/Devices/030725C2-425A-4A20-AE90-5B6505838F0D/data/Containers/Data/Application/9256C81B-1877-4AB3-B7A5-1B294840DDAB/Documents/ICCGAME/
		if (isDebug()) {
			console.warn("ICCGAME_API.getExternalStoragePath():String not exists.");
			return "";
		}
		return zLeiCall("getExternalStoragePath");
	};

	/**
	 * 获得应用地址
	 * @returns {String}
	 */
	this.getPackageDataPath = function () {
		// /Users/zhangjingyi/Library/Developer/CoreSimulator/Devices/030725C2-425A-4A20-AE90-5B6505838F0D/data/Containers/Data/Application/9256C81B-1877-4AB3-B7A5-1B294840DDAB/Documents/ICCGAME/
		if (isDebug()) {
			console.warn("ICCGAME_API.getPackageDataPath():String not exists.");
			return "";
		}
		return zLeiCall("getPackageDataPath");
	};

	/**
	 * 当前软件名称
	 * @returns {String}
	 */
	this.getPackageName = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getPackageName():String not exists.");
			return "com.iccgame.sdk";
		}
		return zLeiCall("getPackageName");
	};

	/**
	 * 当前软件版本
	 * @returns {String}
	 */
	this.getPackageVersion = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getPackageVersion():String not exists.");
			return "2.0";
		}
		return zLeiCall("getPackageVersion");
	};

	/**
	 * 获得设备名称
	 * @returns {String}
	 */
	this.getDevice = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getDevice():String not exists.");
			return "iPhone 4";
		}
		return zLeiCall("getDevice");
	};

	/**
	 * 获得设备入网标识
	 * @returns {String}
	 */
	this.getIMEI = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getIMEI():String not exists.");
			return "";// or empty
		}
		return zLeiCall("getIMEI");
	};

	/**
	 * 获得安装软件列表
	 * @returns {Array}
	 */
	this.getInstalledPackages = function () {
		console.warn("ICCGAME_API.getInstalledPackages():Array<String> not exists.");
		return [];
	};

	/**
	 * 获得网卡地址
	 * @returns {String}
	 */
	this.getMACAddress = function () {
		console.warn("ICCGAME_API.getMACAddress():String not exists.");
		return "";
	};

	/**
	 * 获得网卡地址
	 * @returns {Array}
	 */
	this.getMACAddresses = function () {
		console.warn("ICCGAME_API.getMACAddress():Array<String> not exists.");
		return [];
	};

	/**
	 * 获得网络类型
	 * @returns {Number}
	 */
	this.getNetworkType = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getNetworkType():Int not exists.");
			return 9;
		}
		return zLeiCall("getNetworkType");
	};

	/**
	 * 获得序列号
	 * @returns {String}
	 */
	this.getSerialNumber = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSerialNumber():String not exists.");
			return "00000000-0000-0000-0000-000000000000";
		}
		return zLeiCall("getSerialNumber");
	};

	/**
	 * 获得Sim服务商代码
	 * @returns {String}
	 */
	this.getSimOperator = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSimOperator():String not exists.");
			return "CMCC";
		}
		return zLeiCall("getSimOperator");
	};

	/**
	 * 获得Sim序列号
	 * @returns {String}
	 */
	this.getSimSerialNumber = function () {
		console.warn("ICCGAME_API.getSimSerialNumber():String not exists.");
		return "";// or empty
	};

	/**
	 * 获得系统名称
	 * @returns {String}
	 */
	this.getSystem = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSystem():String not exists.");
			return "iOS";
		}
		var str = zLeiCall("getSystem");
		switch (str.toUpperCase()) {
			case "iOS":
			case "iPhone OS":
				str = "iOS";
				break;
			default:
				str = "iOS";
		}
		return "iOS";
	};

	/**
	 * 获得系统版本
	 * @returns {String}
	 */
	this.getSystemVersion = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSystemVersion():String not exists.");
			return "7.0";
		}
		return zLeiCall("getSystemVersion");
	};

	/**
	 * 获得SDK版本
	 * @returns {Float}
	 */
	this.getVersion = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSystemVersion():String not exists.");
			return 0.0;
		}
		return zLeiCall("getVersion");
	};

	/**
	 * 获得安装插件
	 * @returns {Array}
	 */
	this.getPlugins = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getPlugins():Array<String> not exists.");
			return ["apple", "apple store"];
		}
		return zLeiCall("getPlugins");
	};

	/**
	 * 唤出拨号界面
	 * @param {String} phoneNumber
	 * @returns {undefined}
	 */
	this.callPhone = function (phoneNumber) {
		if (isDebug()) {
			console.warn("ICCGAME_API.callPhone(String):Void not exists.");
			return;
		}
		zLeiCall("callPhone", phoneNumber);
	};

	/**
	 * 唤出短息界面
	 * @param {String} phoneNumber
	 * @param {String} message
	 * @returns {undefined}
	 */
	this.sendMessage = function (phoneNumber, message) {
		if (isDebug()) {
			console.warn("ICCGAME_API.sendMessage(String, String):Void not exists.");
			return;
		}
		zLeiCall("sendMessage", phoneNumber, message);
	};

	/**
	 * 唤出浏览器界面
	 * @param {String} url
	 * @returns {undefined}
	 */
	this.openBrowser = function (url) {
		if (isDebug()) {
			console.warn("ICCGAME_API.openBrowser(String):Void not exists.");
			window.open(url);
			return;
		}
		zLeiCall("openBrowser", url);
	};

	/**
	 * 震动
	 * @param {Number|undefined} milliseconds
	 * @returns {undefined}
	 */
	this.vibrate = function (milliseconds) {
		console.warn("ICCGAME_API.vibrate(Number):Void not supported.");
		return;
		if (isDebug()) {
			console.warn("ICCGAME_API.vibrate(Number):Void not exists.");
			return;
		}
		zLeiCall("vibrate", milliseconds);
	};

	// 返回公共方法
	return this;
}).call({}); // End Object