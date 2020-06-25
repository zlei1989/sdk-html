/* global ICC_CALLBACK, ICCGAME_PASSPORT */
/** #if for android begin */
ICCGAME_API_ANDROID = (function () {

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
	 * @param {Array} params
	 * @returns {String}
	 */
	function zLeiCall(name, params) {
		var arg1 = "ICCGAME_API:" + name;
		var arg2 = "";
		if (params instanceof Array) {
			arg2 = JSON.stringify(params);
		}
		var str = prompt(arg1, arg2);
		return (typeof (str) === "string") ? str : "";
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
		zLeiCall("tip", [message]);
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
		return zLeiCall("aesEncrypt", [seed, cleartext]);
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
		return zLeiCall("aesDecrypt", [seed, ciphertext]);
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
		return parseBool(zLeiCall("fileExists", [path]));
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
		return parseBool(zLeiCall("writeFile", [filename, contents]));
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
		return parseBool(zLeiCall("appendFile", [filename, contents]));
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
		return zLeiCall("readFile", [filename]);
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
		return zLeiCall("deleteFile", [path]);
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
		return zLeiCall("getFiles", [path]).split("\n");
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
			console.warn("ICCGAME_API.setAssistiveTouch(String):Void not exists.");
			return;
		}
		zLeiCall("setAssistiveTouch", [imageBase64PNG]);
	};

	/**
	 * 隐藏浮标按钮
	 * @returns {undefined}
	 */
	this.disableAssistiveTouch = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.setAssistiveTouch():Void not exists.");
			return;
		}
		zLeiCall("setAssistiveTouch");
	};

	/**
	 * 唤起支付宝钱包
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithAlipay = function (contextJSON) {
		if (isDebug()) {
			console.warn("ICCGAME_API.payWithAlipay(String):Void not exists.");
			alert(contextJSON);
			return;
		}
		zLeiCall("payWithAlipay", [contextJSON]);
	};

	/**
	 * 唤起聚财通(微信钱包)
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithPaytend = function (contextJSON) {
		if (isDebug()) {
			console.warn("ICCGAME_API.payWithPaytend(String):Void not exists.");
			alert(contextJSON);
			return;
		}
		zLeiCall("payWithPaytend", [contextJSON]);
	};

	/**
	 * 唤起快付、威富通(微信钱包)
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithSwitfpass = function (contextJSON) {
		if (isDebug()) {
			console.warn("ICCGAME_API.payWithSwitfpass(String):Void not exists.");
			alert(contextJSON);
			return;
		}
		zLeiCall("payWithSwitfpass", [contextJSON]);
	};

	/**
	 * SD存储路径
	 * @returns {String}
	 */
	this.getExternalStoragePath = function () {
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
	 * 当前软件签名哈希
	 * @returns {String}
	 */
	this.getPackageSignatureHash = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getPackageSignatureHash():String not exists.");
			return "00000000000000000000000000000000";
		}
		return zLeiCall("getPackageSignatureHash");
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
			return "Android SDK built for x86";
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
			return "000000000000000";// or empty
		}
		return zLeiCall("getIMEI");
	};

	/**
	 * 获得安装软件列表
	 * @returns {Array}
	 */
	this.getInstalledPackages = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getInstalledPackages():Array<String> not exists.");
			return ["Browser", "Calculator", "Settings"];
		}
		return zLeiCall("getInstalledPackages").split("\n");
	};

	/**
	 * 获得网卡地址
	 * @returns {String}
	 */
	this.getMACAddress = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getMACAddress():String not exists.");
			return "C8:60:00:A0:C3:7E";
		}
		return zLeiCall("getMACAddress");
	};

	/**
	 * 获得网卡地址
	 * @returns {Array}
	 */
	this.getMACAddresses = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getMACAddress():Array<String> not exists.");
			return ["C8:60:00:A0:C3:7E"];
		}
		return zLeiCall("getMACAddresses").split("\n");
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
		return parseInt(zLeiCall("getNetworkType"));
	};

	/**
	 * 获得序列号
	 * @returns {String}
	 */
	this.getSerialNumber = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSerialNumber():String not exists.");
			return "0000000000000000";
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
		if (isDebug()) {
			console.warn("ICCGAME_API.getSimSerialNumber():String not exists.");
			return "89014103211118510720";// or empty
		}
		return zLeiCall("getSimSerialNumber");
	};

	/**
	 * 获得系统名称
	 * @returns {String}
	 */
	this.getSystem = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSystem():String not exists.");
			return "Android";
		}
		return zLeiCall("getSystem");
	};

	/**
	 * 获得系统版本
	 * @returns {String}
	 */
	this.getSystemVersion = function () {
		if (isDebug()) {
			console.warn("ICCGAME_API.getSystemVersion():String not exists.");
			return "5.0";
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
		if (isDebug() === false
				&& this.getVersion() > 2.7) {
			return zLeiCall("getPlugins").split("\n");
		}
		console.warn("ICCGAME_API.getPlugins():Array<String> not exists.");
//		return ["alipay"];
		return ["alipay", "switfpass"];
//		return ["alipay", "switfpass", "paytend", "weixin"];
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
		zLeiCall("callPhone", [phoneNumber]);
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
		zLeiCall("sendMessage", [phoneNumber, message]);
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
		zLeiCall("openBrowser", [url]);
	};

	/**
	 * 震动
	 * @param {Number|undefined} milliseconds
	 * @returns {undefined}
	 */
	this.vibrate = function (milliseconds) {
		if (navigator.vibrate) {
			navigator.vibrate(milliseconds);
		} else if (navigator.webkitVibrate) {
			navigator.webkitVibrate(milliseconds);
		}
	};

	// 返回公共方法
	return this;
}).call({}); // End Object

/** #if for android end */