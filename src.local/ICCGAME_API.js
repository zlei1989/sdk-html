/* global ICCGAME_PASSPORT, ICCGAME_API_ANDROID, ICCGAME_API_IOS, TouchEvent */

/**
 * 由 ICCGAME SDK 提供的方法
 * @type {ICCGAME_API}
 */
ICCGAME_API = (function () {

	/**
	 * 浮标显隐状态
	 * @type Boolean
	 */
	var assistiveTouchState = false;

	/**
	 * 打开活动
	 * @type Number
	 */
	var activityCounter = 0;

	/**
	 * 延迟响应
	 * @type Number
	 */
	var activityDelay = 99;

	/**
	 * 动画持续时间
	 * @type Number
	 */
	var animationDuration = 0;

	/**
	 * 应用程序接口内核
	 * @type Object
	 */
	var apiCore = (function () {
		var str = navigator.userAgent;
		var isIos = false;
		if (str.indexOf("Android") < 0
				&& str.indexOf("Mac OS") > 0) {
			isIos = true;
		}
		return isIos ? ICCGAME_API_IOS : ICCGAME_API_ANDROID;
	})();

	/**
	 * 动画延迟
	 * @param {Number} milliseconds
	 * @returns {Number}
	 */
	function queueAnimationDuration(milliseconds) {
		var timestamp = $.now();
		var delay = Math.max(0, animationDuration - timestamp);
		delay += milliseconds;
		animationDuration = timestamp + delay;
		return delay;
	}

	/**
	 * 打开窗口数量
	 * @returns {Number}
	 */
	this.openedActivities = function () {
		return activityCounter;
	};

	/**
	 * 获得日期数字
	 * @returns {Number}
	 */
	this.getDate = function () {
		var date = new Date();
		var y = date.getFullYear();
		var m = "00" + date.getMonth();
		m = m.slice(-2);
		var d = "00" + date.getDate();
		d = d.slice(-2);
		return parseInt(y + m + d);
	};

	/**
	 * 获得运行参数
	 * @returns {String}
	 */
	this.getParams = function () {
		var path = this.getPackageDataPath();
		var file = "/ICCGAME_SDK/start_params.dat";
		if (path) {
			var params = apiCore.readFile(path + file);
			if (params) {
				return params;
			}
			apiCore.writeFile(path + file, location.search);
		}
		return location.search.toString();
	};

	/**
	 * 获得游戏标识
	 * @returns {Number}
	 */
	this.getGameId = function () {
		var game_id = location.search.match(/(\?|&)game_id=(\d+)/i);
		if (game_id) {
			return parseInt(game_id[2]);
		}
		return 3001;
	};

	/**
	 * 获得来源网站标识
	 * @returns {Number}
	 */
	this.getFromSiteId = function () {
		var site_id = this.getParams().match(/(\?|&)site_id=(\d+)/i);
		if (site_id) {
			return parseInt(site_id[2]);
		}
		return 0;
	};

	/**
	 * 获得来源广告标识
	 * @returns {Number}
	 */
	this.getFromAdId = function () {
		var ad_id = this.getParams().match(/(\?|&)ad_id=(\d+)/i);
		if (ad_id) {
			return parseInt(ad_id[2]);
		}
		return 0;
	};

	/**
	 * 获得设备哈希标识
	 * @returns {String}
	 */
	this.getDevHash = function () {
		var v0 = this.getSerialNumber();
		switch (this.getSystem()) {
			case "iOS":
				var regular = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
				if (regular.test(v0)) {
					return v0.toLowerCase();
				}
				break;
			case "Android":
				var v1 = this.getMACAddress();
				var v2 = this.getIMEI();
				if (!v1 || !v2) {
					break;
				}
				return $.md5(v1.toLowerCase() + v2.toLowerCase());
		}
		return null;
	};

	/**
	 * 弹出窗口
	 * @param {String} message
	 * @returns {undefined}
	 */
	this.alert = function (message) {
		if (typeof (message) !== "string" || message === "") {
			return;
		}
		return apiCore.alert(message);
	};

	/**
	 * 告知游戏
	 * 初始化完成后调用
	 * @returns {undefined}
	 */
	this.ready = function () {
		return apiCore.ready();
	};

	/**
	 * AES 加密
	 * @param {String} seed
	 * @param {String} cleartext
	 * @returns {String}
	 */
	this.aesEncrypt = function (seed, cleartext) {
		return apiCore.aesEncrypt(seed, cleartext);
	};

	/**
	 * AES 加密
	 * @param {String} seed
	 * @param {String} ciphertext
	 * @returns {String}
	 */
	this.aesDecrypt = function (seed, ciphertext) {
		return	apiCore.aesDecrypt(seed, ciphertext);
	};

	/**
	 * 判断文件是否存在
	 * @param {String} filename
	 * @returns {Boolean}
	 */
	this.fileExists = function (filename) {
		return	apiCore.fileExists(filename);
	};

	/**
	 * 读取文件
	 * @param {String} filename
	 * @param {String} contents
	 * @returns {Boolean}
	 */
	this.writeFile = function (filename, contents) {
		return	apiCore.writeFile(filename, contents);
	};

	/**
	 * 追加文件
	 * @param {String} filename
	 * @param {String} contents
	 * @returns {Boolean}
	 */
	this.appendFile = function (filename, contents) {
		return	apiCore.appendFile(filename, contents);
	};

	/**
	 * 读取文件
	 * @param {String} filename
	 * @returns {String}
	 */
	this.readFile = function (filename) {
		return	apiCore.readFile(filename);
	};

	/**
	 * 删除文件
	 * @param {String} filename
	 * @returns {String}
	 */
	this.deleteFile = function (filename) {
		return	apiCore.deleteFile(filename);
	};

	/**
	 * 获得文件列表
	 * @param {String} filename
	 * @returns {Array}
	 */
	this.getFiles = function (filename) {
		return	apiCore.getFiles(filename);
	};

	/**
	 * 显示窗口
	 * @returns {undefined}
	 */
	this.createActivity = function () {
		// 添加计数
		activityCounter++;
		console.log("create activity, " + activityCounter + " Activities");
		if (activityCounter > 1) {
			return;
		}
//		var delay = queueAnimationDuration(activityDelay);
//		setTimeout(function () {
		$(document.body).trigger("create_activity");
		apiCore.createActivity();
//		}, delay);
	};

	/**
	 * 隐藏窗口
	 * @returns {undefined}
	 */
	this.finishActivity = function () {
		if (activityCounter < 1) {
			console.warn("finish activity invalid");
			return;
		}
		activityCounter--;
		console.log("finish activity, " + activityCounter + " Activities");
		if (activityCounter > 0) {
			return;
		}
//		var delay = queueAnimationDuration(activityDelay);
//		setTimeout(function () {
		apiCore.finishActivity();
		$(document.body).trigger("finish_activity");
//		}, delay);
	};

	/**
	 * 设置浮标浮标状态
	 * @param {Booleam} visibility
	 * @returns {undefined}
	 */
	this.setAssistiveTouchState = function (visibility) {
		if (this.assistiveTouchState && visibility) {
			var key = this.getScreenType();
			var img = (key in assistiveTouchImages) ? assistiveTouchImages[key] : assistiveTouchImages.ldpi;
			apiCore.enableAssistiveTouch(img);
		} else {
			apiCore.disableAssistiveTouch();
		}
	};

	/**
	 * 显示浮标按钮
	 * @returns {undefined}
	 */
	this.enableAssistiveTouch = function () {
		console.warn("enable AssistiveTouch");
		this.assistiveTouchState = true;
	};

	/**
	 * 隐藏浮标按钮
	 * @returns {undefined}
	 */
	this.disableAssistiveTouch = function () {
		console.warn("disable AssistiveTouch");
		this.assistiveTouchState = false;
	};

	/** #if for android begin */

	/**
	 * 唤起支付宝钱包
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithAlipay = function (contextJSON) {
		if (typeof (apiCore.payWithAlipay) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithAlipay(contextJSON);
	};

	/**
	 * 唤起微信钱包
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithWeixin = function (contextJSON) {
		if (typeof (apiCore.payWithWeixin) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithWeixin(contextJSON);
	};

	/**
	 * 唤起聚财通(微信钱包)
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithPaytend = function (contextJSON) {
		if (typeof (apiCore.payWithPaytend) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithPaytend(contextJSON);
	};

	/**
	 * 唤起快付、威富通(微信钱包)
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithSwitfpass = function (contextJSON) {
		if (typeof (apiCore.payWithSwitfpass) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithSwitfpass(contextJSON);
	};

	/** #if for android end */

	/**
	 * 唤起苹果支付
	 * @param {String} contextJSON
	 * @returns {undefined}
	 */
	this.payWithAppleStore = function (contextJSON) {
		if (typeof (apiCore.payWithAppleStore) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithAppleStore(contextJSON);
	};

	/**
	 * 苹果支付数据存储地址
	 * @returns {String}
	 */
	this.payWithAppleStoreDataPath = function () {
		if (typeof (apiCore.payWithAppleStoreDataPath) !== "function") {
			throw new Error("not support");
		}
		return apiCore.payWithAppleStoreDataPath();
	};

	/**
	 * SD存储路径
	 * @returns {String}
	 */
	this.getExternalStoragePath = function () {
		return apiCore.getExternalStoragePath();
	};

	/**
	 * 获得应用地址
	 * @returns {String}
	 */
	this.getPackageDataPath = function () {
		return apiCore.getPackageDataPath();
	};

	/**
	 * 当前软件名称
	 * @returns {String}
	 */
	this.getPackageName = function () {
		return apiCore.getPackageName();
	};

	/**
	 * 当前软件签名哈希
	 * @returns {String}
	 */
	this.getPackageSignatureHash = function () {
		if (typeof (apiCore.getPackageSignatureHash) !== "function") {
			console.warn("ICCGAME_API.getPackageSignatureHash():String not exists.");
			return null;
		}
		return apiCore.getPackageSignatureHash();
	};

	/**
	 * 当前软件版本
	 * @returns {String}
	 */
	this.getPackageVersion = function () {
		return apiCore.getPackageVersion();
	};

	/**
	 * 获得屏幕类型
	 * @returns {String}
	 */
	this.getScreenType = function () {
		if ("devicePixelRatio" in window === false || window.devicePixelRatio < 1) {
			return "ldpi";
		} else if (window.devicePixelRatio <= 1) {
			return "mdpi";
		} else if (window.devicePixelRatio <= 1.5) {
			return "hdpi";
		} else if (window.devicePixelRatio <= 2) {
			return "xhdpi";
		} else if (window.devicePixelRatio <= 3) {
			return "xxhdpi";
		}
		return "xxxhdpi";
	};

	/**
	 * 获得设备名称
	 * @returns {String}
	 */
	this.getDevice = function () {
		return apiCore.getDevice();
	};

	/**
	 * 获得设备入网标识
	 * @returns {String}
	 */
	this.getIMEI = function () {
		return apiCore.getIMEI();
	};

	/**
	 * 获得安装软件列表
	 * @returns {Array}
	 */
	this.getInstalledPackages = function () {
		return apiCore.getInstalledPackages();
	};

	/**
	 * 获得网卡地址
	 * @returns {String}
	 */
	this.getMACAddress = function () {
		return apiCore.getMACAddress();
	};

	/**
	 * 获得网卡地址
	 * @returns {Array}
	 */
	this.getMACAddresses = function () {
		return apiCore.getMACAddresses();
	};

	/**
	 * 获得网络类型
	 * @returns {Number}
	 */
	this.getNetworkType = function () {
		return apiCore.getNetworkType();
	};

	/**
	 * 获得序列号
	 * @returns {String}
	 */
	this.getSerialNumber = function () {
		return apiCore.getSerialNumber();
	};

	/**
	 * 获得Sim服务商代码
	 * @returns {String}
	 */
	this.getSimOperator = function () {
		return apiCore.getSimOperator();
	};

	/**
	 * 获得Sim序列号
	 * @returns {String}
	 */
	this.getSimSerialNumber = function () {
		return apiCore.getSimSerialNumber();
	};

	/**
	 * 获得系统名称
	 * @returns {String}
	 */
	this.getSystem = function () {
		return apiCore.getSystem();
	};

	/**
	 * 获得系统版本
	 * @returns {String}
	 */
	this.getSystemVersion = function () {
		return apiCore.getSystemVersion();
	};

	/**
	 * 获得SDK版本
	 * @returns {String}
	 */
	this.getVersion = function () {
		return parseFloat(apiCore.getVersion());
	};

	/**
	 * 获得安装插件
	 * @returns {Array}
	 */
	this.getPlugins = function () {
		return apiCore.getPlugins();
	};

	/**
	 * 唤出拨号界面
	 * @param {String} phoneNumber
	 * @returns {undefined}
	 */
	this.callPhone = function (phoneNumber) {
		return apiCore.callPhone(phoneNumber);
	};

	/**
	 * 唤出短息界面
	 * @param {String} phoneNumber
	 * @param {String} message
	 * @returns {undefined}
	 */
	this.sendMessage = function (phoneNumber, message) {
		return apiCore.sendMessage(phoneNumber, message);
	};

	/**
	 * 唤出浏览器界面
	 * @param {String} url
	 * @returns {undefined}
	 */
	this.openBrowser = function (url) {
		return apiCore.openBrowser(url);
	};

	/**
	 * 震动
	 * @param {Number|undefined} milliseconds
	 * @returns {undefined}
	 */
	this.vibrate = function (milliseconds) {
		if (typeof (milliseconds) !== "number") {
			milliseconds = 7;
		}
		return apiCore.vibrate(milliseconds);
	};

	/**
	 * 图标文件
	 * @type Object
	 */
	var assistiveTouchImages = {
		hdpi: "iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAASmklEQVR4Xu2cCZBdVZnHf2e5r9Nb9p1IQtJJSIAESDARIwy7U0iV4swoAzMOOoU1FEoQRLScsRRKcSuDyDAgTgkK41JahQsiYQ1JyL6QEEiHELIQIGTp7nSn+717zvmmq98pT\/H6pZol0bTlv+qrvnXPvd\/yP99Xp757Tj8lIhwef4MFWD1L0ScURwI6insX\/oYoRx2zVgmaow9LQgDGAlcAtwELgZeANkAqpC2OLYzPXhHfDSTYo+\/80YEBPGU44J+BTwBzgYG8GTmgAEl5igC1wDjgBOB8EtqAZcC9wAO9bB5h6KNEuAemAA\/HYO8HLoxBC29GFt9TFQVt41hCIu7CqFOijSmJHOyxSJBK2cJZwFZgM3AR4CrIUO\/STkaCizY2R5tnJXuoY4UgAwjQAKwDngImAuFolnGF7hBtPhV9aIg+mWOBIA\/cChwEZgL+Heg+UnH46MPB6JP\/SxFk0\/u0A19IqY3hL4Vk20Wf2lOM2D8XQTY6cDbggXpAAMuxAwtI9M1HXx1gjzZBJhr6DPAkCYpjD4qEJ6PPDjBHiyANeOB7wPcBT\/+Bjz5\/L17rI02QBQJwl1LM1wanDEYbUAaU4thGyvz5wF0xFntkCErKr1eaq0RwLmBdAOfBOxBA6X7RdzrgKuD6t1putu8qxivFqcB3nOBDF1YJ6BKIBQF8AYwBY0HCMU+SB74DPAase2sEKaojZcbaXAEdmOJzMHgujJgBpU7YsxLcs8B0EAVWg8gxX24AawH1bkrMxNcl16DaoWs3nPkAnHQXDP84jP0UzPo5nHwLdGwCKYJ3oBT9BZJIe\/sEeaVY4AJwEDpeh7MXgdJgVkDhJShsAb0B6i6Fs++C0ksQcgihX5G0APBvnyCFCZ5rfSeuaxOcdTO4l8B2Cx4kB3FAO9inQd4HEy4F0wkh0F\/ggGvfbgZZAKV4IQiogB14GnAq2FaQoZFvBZCuzXoYdy6UDkLIQaRfZJGljBdS7H0T5IC5QBMKrzU0jgZfA+SApLdQ8VqDNsAw0A2gHEigv8ADTTFm19cyr4EA\/IwyjATo6gIV4oikJ5EoAQRQJZASUAMoEtI7KasqxkWSPhRvHRL1akBFkSoNR4iTFnrZNwAx5gmJg+oEBWAcMB4IWtB5DvtXQVYCPxL0c0ADZaSvx7hRkG8EdQDUcNBpuUcZQCfn8SA+BaR0fEZI42+VGBv1OAhZWSSk0lcFUA50V7RhElkVcY+Pse\/q65v0fQAiaG1BD4XaQ7DtVhj3G1CtoLYDI6PaveBPgmwyrJ4PelLKEhXLT6LzYkCKIIeAdpAAqg5UI6gMAEwMRBGDEKpC2VQfUgfhNZCdGgYZVH2A4MEYwkEDLQ6GB\/RE0DmYYtme+BgD6BQ75x5uFYsucg7gkMhggDASdv0WWq4DLgM\/FRgIDAH3XrAzYfVlYA6BWDBZOUgBcgt5SeNfy2A5+BWQbwK3A\/wucM3gVwNLIOxVlPYa8gy8xMyyqXzi4oHOIATIG8HvtqjHobgJqAmYkaOpnzibwXMvouHEOWRDxxLqA6XtEJ4Av0+To3AmZlj0FYWLsQNk1TIoBy5P90FC2RljwUyDlQtg9CKYeiXUDwEMtC+DjVeAaQMzA6wqG3QOXNCoPYF8S6BwwjBGXH8hg+ZeQmHyJAaMG40owb1xgNK2HbStX8q+h39L6yMbqd0ObrwlTHSYdtCkUlUa8gHgX7XoVY6QOUbfPJ9x13weM3hsr00zBRhASRd77r2dbV+9Fff8fvQUhR8tGFuuCi1YZUAClyPcT4QSEVbPVkQsTFssyQJiCXscB3YCwPDJ4GaDCqAfhpZWqB8EdrLFFByuBvK9Gr8hUHfaCUz76X3UTJ+Hj+q0CyhxAAiakFmEuCB27mPHd2\/hpf9cQIOC\/ESLUQ5twQ6AMALyXdC+Hpq+8B+ccOt\/kwPaC0ZL9a4ZITiPtxYNtD70S57\/x3+CQ6CaMkwOenBAWw+aRwlcgMCs1QIiwqpZ6G6hWw52S6lbpEdmI8tPRVbWI89dNleKO5+Vlof+V179yQLZdsf3ZceCb8vuu78mrY\/fL82fvkjWjUKWXYQsPRX5Pcgbv7xTnIjkIhJcLn0iBHG5l1Ic2HzlxT16ngZZBbLsXN2j+zcgvnNLz3PeeXk7CHneoz+IyNb5n5Qlx9XK+g82yWqLLJ9hSyu7OeiOu4cTkUSQ7ZYJkZgQyemRZ2Yii0G6dmyRrhhssUJ67r\/2hiyxyFMjtfwBxO17TkrRoXcC58u2Dq78g7RvWiT7Fv6PPAXyIIhIa8+YBNcXHVIVkdhiikdeuPpSWT41C8vPQFa\/t4cLK5K2nh0wLxVVulIKCkDr4z9CA8Y5ChAFMufQQPHVP5A7aN8TeN\/TPyYMnU4mHmUtCUDweAclkuRAcHHliTC6bKtu5gWYaR9g6Pmfpn72ZObc83VyBmIRUKZCdSAHkpYcAA\/RRhrRRlMAiHEc+NViQhGlgMiFA4gZRLdwRzmDkqw+o5xFS0+xsrCnZH4gpSozfXDZoz3ji7MG2XT5DMmrZo7vue9EpLRjvey68yuy9cZ\/ky03XCmv3Xur5LufL49VvOtjkjwI8jso36vQHXz+J79evPoTsihDnqQsj4EsPW64bP\/qjT3aY1lGPWXli+qRZU3I8vN0d\/b0xNzNRZkbS8JUqkAb0IMctUBx1zYqETS0P\/cwJSDk7bz\/p4vxgTdnjnicMlh2sHjoDNoOtBIXQQTYA2zgJhrfM5QT77+bhg98FAQMnmAML1\/7YYaNG8PpD95BDmRv0h1w2uK3LeahiR9gJGDqLLbWQQaSKyge4JWvfIu13TLzy59i3M33oHyOtxmvfu+LmA5QE8C2h6gzcaFJaIqZmCAgAWgBA9SdOhOhN+qmnUwjMOriiTgaMVpIoIccdaCZX6vxMLiVwdMUeg7IXGAO6DOgfoLC1e5nyVn\/wObLziQoyqQeeoEl33+QQ7tepfb0j2Cdq9Ct0S3b+X03OUNPBnMJZHMc2XQoTILCdMHO8JgLYeBoy8pbfkTHU7+jZDIyOlnzuVthmkW3ggLEkwNN1VqNwb26IAUiIBo8IKUSqkorVHp1L43zTmbUxz5GgKQm1r21hkeGTmXUKVBzEqhtggIQkp0Rgh8DjXssO3\/2DNP\/DwR4pH4a44ePZMKVTb2yR7wDY1kxtYkxE6AwE8x2wINIbDUE1CFAQcNpjprNsO0rn+HkJz\/EypPPYFQTqHEO0wGhFL2BwdUIGgQI1RAAQGcDqIa8pQ3dsYO6pjnoimbTW8Our15LHWAngtkZVXoiQMV+zL4OnOKo3QIbL5mNHddIHSB79xDqL+7lXBBNsXkpxT2ObBKoLSAKxPWeRGXA7AeGaPzml1mrFWoCyHCDbvOEEONUmMgFAPqtniMTYiD0hj9YgrVt1J7QhM5zKtG6eCF2ska1gngIOSBJJIC48pgtgoy1dG55lvaHl2DOsdQA4hqpRLCaro1b0ICuBwKIpwpS32VMwB0PbhyEYWC1B0nNbSUHmr4QA1AASlfNMRUCAGJM1ST0nftA274PpkgsC+XwkuMH5+gDDj0STL2qYhdUw8DoW8pGhITKUvag2i2mvoBylhRb3\/ti9FViUqiv+kTwHgDXdgBRlkrY0SfByyVoTP1ULz0KlI3lIZqsGQrrIIwyhBy6dmylEibkDL3wAoqAf80S6mJzawCVRNnU4DpvMTsd9bPPQDc7vLcIoNLcyuEIagU81SAx0EINhGoslwiThtC1dQMh05VxM+nrt3CgCPnWDCegC2WHlY2Sle8FD7kGtyZw\/GM\/ZNQDt+P+6CnZjIPL16ABJCTd1pLTwMTPf5LwuiNvN7jaOKbTZIhAnkFeA53rHKO+eCNNP1kM085E9jlkJGgbJw480FqNoBZADltmgGQZqloGmYzcWTpWLuylwHhHNuVMJl9zCa45p3jA4oaBL0AgSgZ5A+QCbj+0A0PP\/XdGX3YNOeDeyLsD2w1t2whek6AwPjDhWz9i8LzJ5Gs8xWctJQc5ZSkpKHZC6TmLWwIdwLgvfhMNzFq1hNe3Q7HZ4hwxixCgpRpBLwIZhwda68Pch87tb7DrzvuwgDiXQjAW5WHS7b9h5L9cRMvzjtJSKK2wlDZDaQuUVlnCGuhaDV1bYd7WZZE8ONdvZi\/QHuCNH34NbytsG40AJz\/dzIQvf5b2vY7SWmAFsBykW4oboX2\/Y8ynLuVi6cDFQHPgjDtugmaHHwSiQBmyyEUvgjbTB5TNqu4t+64cATpegZaHfoCr6L+MgRBg8n0Pc87ahxgwaTZOHMUWyPdDnjsGTJnFjCd+znkimIlzsMFh8eR6CrOu\/wgeWH\/Dj8kAV22r1HvG3nwbHxThlCd\/wdjv3Miwz36c47\/9BWaveLDn\/vh7foUPdVgEAOM8Y67+Bq4O5BVwAwGVuKjsxa6o6MXKfcnpyNLxyCKQzm3rxBdzSSh3wtv+6ypZWkAWDTLyaOyXcumN4HLJJfZbkuDjvWrdv3flJ9fMGCGLTpkiS4eU9TtJqGajmCT2hiXpjaRnMcjSgcjKcg96RXfcpG4eLLD4sCuZigPqMMNOyEqgZnoaT4SVExqwlTMdy81WOeqqgSxK6uEEL+CMogM4bf2zyIZmigdg\/QWzMEl\/VRuFJNiY\/RGIc7HrT\/1g4TjQGgGIXNhUYhCAl4H2XnYV4EEBhboGqkEGWKSGHpIYrxDTwZKxNVggjw69HQTnyVHoUisvXnY+hx68k\/XzzqN+Ggw4z1Jcu4Ylo2qx6VMJIPSFSAxiLe1P\/IInleLpRsWKOoVuBD0ZpxTtEngZCJUEASwDEtWqLFKAQ4DraEHRG53NG\/BDQQnYdkFOADOoxGNK0fbIrxFrKcXADxeIBI+LAWtr2P31G1k4YDAtP3uMlz98Nfn+TVBvKBxycJrCjOjij0qx+xs3os1BHIoS9Ih3Qijl+JLDSfrmhLV0PPpLVk4ZwYZzP0btEIWJTVYYCFqRRQ5AEapt+\/wYOD95DSEDNBwEbGMDKKlC0DbkVQjHKUDIDoGbBHWieOGij5JNGM7Yz13D2KuvQxhI5f6dAow25FvXsvsHt\/HKgnupARomWkyTQ\/YAGpR44iTgx0Jjl+W1L32b7d0y+JzpDP77C2k4aR6F48aQDR1E8B7\/+gE6XtxI6+Lfse+Bhfg2j50G2WkKM0TQ7UAOKjqE9HBA74\/2aeUTwKGx4sC1AVthxprfdiv9EJn49CUvHR1l\/flDKL7ejrIOUwMKcAoCCmnTsMlTBMwIqBk2msKIYdghAym1tJHv2Udp62uQQ40C9x6LPqHcYWtTufOa9tuCA18LstOgagX9QsBR2VqBBfQICIUMRuXoAWBKoCxpZzjEUEARuZi1ShJBCTwOnENcmt0GCEV4vwihqwNlsjdvJWtFSWfsu+dL7L7qG\/jTwUR1cRuFkEXZDrJHoxosapCAFiQoaFFQcqjxAT0EdAdoDfS1eWjSl4FQF4ksgnSCdAESNyXrABNJifMbSanEE8C5pH+HwtIb\/wrsRAjKo\/VQyFqgo\/lJ6qecTnFHM2ZALUoX4le0WmzNGFqfWQxjQYW0NEhedsYEMF0gwyCMDUhWijMHKGA06CJogXKagbi+9unT9rU2oPM0adSCDEgtR6rp6p9D4qiOsVO1xCJ0WtEYDyACCghroEh8QIHSKRmNgprR4BstyriqQal0EqQaUqon4t4qEpGqyuEIAQFImXg43dsrDy\/0LrGEucAzKDwaIzmEFghdKTsgfbnTAdRIMAOicaE\/wceo3hdXMPoqMRsffBGhiRDLZAiYNCvpT7ynpF+SQyTnxRizBVxfpzviA5wIOAQHWGUAVfFhq\/f5nv4GB9gYK1UPUPWRercB1wJI4K8RNsbo39kxYJjPXz\/mv+NjwJSh+OuFAug7g\/rGaUlRv4dPMR25f2ZZB9wQrx39Fy7GcEOMyRwJgjxgge8Cd6elsN+uWHfHWCzg3z1BSbkGPg0sSMr7CdIkL4gxaMAd6f84jF0W1wGfBQz9Byb6fF28DrxF6Hc4E7cDf0eCcOxBiIi+3v5OMl+\/i1p+CjBARzrKfczAASr6ZqKvqY04ygSRDBGABuCbqW3BHwNLuI0+NaRywv0lf5riJqARWA+YRN6fDSH5wvroy03H0k9TKKAdOBU4G3gp6T6KpZd062jz7OhDe\/TJHwsEAUhKbRYBk4CpwB+rnOaXd2knJ8FGG1OjzUXJHnIs\/n6QS6lOM\/BBQAGXA48AnVV6uzy+JxVEuDiWACrqeCTqVNFGcyonXH\/4BSpfYeOBKADHA2cBZwDT48wPBxqrELEX2ApsAlbGDNlRodsdzcXBcvThKjJ2N\/DTKO\/EX12xMh1V9PEzgX\/D\/wMkD4R3sTMjuwAAAABJRU5ErkJggg==",
		ldpi: "iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAGP0lEQVR4Xs3YfWxW1R0H8M+9z31abEuhDqgEhSGAU6XyJuI2HBGjJtMIbnE6nW7\/aLIte0k2NTKN6jTZa7IlWbZlDKbOmCzOIQqqoLxr6QtK2WAURdFNSlFaW7C0fZ7fzGxSbBpTFBI\/yUlucs7N+f5O7k3yO0lE+DTJoHFuAkBKGhR7+Yis38RCzEI18oAetKAB\/8AyQ2dWfcgM3Tn4K2oMDvI4tW9ciaXYhuuw3RCkhmYbmlDj2NWgCduOR6B5CEzzyU1DYN7HCpTm3JGVWp\/LiHA8rccdxxQoO8l9HS3uaWng8EGGjSAcV\/fgviEFypeb89Ymtxf+y7iL6Gym9WVKhiMcT7djzuCBEiTky3hrs9qKScxv5uzfc0kdSQkHd5CVHfdQtYMH6iENDu6xPytywQrsxzKUM\/+PdLfT20maIVAYMAaTDJwfdP3+QU8oyZnStc\/oUTMxAisoZngGEykby+EDJBlJBdko\/aOqf3MBCPSQG0lJNVkl6UlkY8iqyWVEAWE0pggggwgKvVZVncHezdS8gltJH8aNdC6lbQ8TLqfQxru19B4hkCBLqZhOyViKh+htI1dJfgQH13GokwQQSFA1hfKp9LxH70GrcsNMhhSg2GNS2RhGz+bhubzxbSQ0X8FTN3P6QtrXsmcjZaPLjP3a9Sbd9kPjvnGd8jPGO9DIf1bR3Uq+mjTPricp9jL1J3eb+fgq5z252rlLHjLuqwu1NfPak7xbR1ZqEoCIUD\/LDe+PqK8RW2eJhosujucmLoq1p0yOZ0ddEv9c9NlYUyJWEO2bX47BdL\/dFo3T5sSjRO2Z4jHi9bt\/Gx+l8QvzY7V8bJ0n6s5zQ0ToC2RlwwViy1liOTFQ05enx1+IoXq+RGy\/\/qYYqOdQ2+DrjYn1I608OtCb9TPES5eJNUT9jFn9le\/bHUuII\/9+IY72r+\/9KNaWVMamqurYdcstcbQVxNHeWf9sPEGsJp4lNn3x0ugTzbf+4v9zTZd58+hAPfUzxcsXi7VE\/cwzo0+8+Zufx9MMqEg8SGwcKdYNEw8Qq\/rWPEQ03Xh59ImundviT8Tzee8XKhprxFLihRkz433xKPHSxaJhjp6IkAIygAJKTzsFQKRdRs+dCGD\/g8u0YvYiRlzAyPlMX0DlOF4cmxiJKYt\/CaB27gKnY9y3CBTL+NL1xOuN\/p4kpl5OsZPokUGqH0WgWCgCSLoOS\/IJgK49r8gjdzJHWulppbSa8gns2UcZIlcCoOzUap3QTX4UpaM49AbdXYxAoQMJxSKQAnpBAmTDSgEUCpXerX0VwPg77xXYsYRcjlyw82H2bubaCHux\/3d3AZjd1OQ9NC3jUB0HnmDjOsbdvNiCCDvXkS8nLdELKaAFAkVELgNQPu1Mb3Trh0URhldO0lLLgUbKyyeYv7MZzL7tx57+1QP6cXWEiZd+hd5KJWM\/54o\/\/sHkX\/8UnPezJV5bTclntKD\/t6+fKbbOF2uI3d+5uv+j3NsYDxEbR4yKQRW6Y6CVxHMjq2OoniE2n2Zl\/0fNI4pkJ9ONdzZsB\/D2is2q0dF+wKbKyQaS5gG8esddNo0\/y+nXTtDe1mJDRZWe1k6DaVu3wfPpCE8lidELKB3rEf0nRP0cUTddPEV0NOyIPlE8ErGG2HqReIZYSTRddVW89eelceCxJ6Llb8tj9w++H2tLxeM+eL\/ubLHr6x88ryK2nHNq7Ljm2tj13Zti+8IrY8OoXCwn1hAvjhcNnxeNc4gISURomJXIhtvd\/qJJScK89wJQQM72hXO8vbzOmGvoeImOnXQhQxEpKqqomE2S0nOACIadQtc+Ohvp1a+0gorpZGUUuih0eCXNmzyjNvoCzU4IU9IKu4pF2jaSIJCg8hzSKort5E4iG0mxiCPIIyMOU+hAigQQSMmGI6+vPuKDECSAxFQ0f7gvSzTr0ppkRpedRgS5It2HUULSS5Kn2Et3S\/\/GAkUkyBAA\/fO9B31YDimAVjQD+k8IQIjcMKSAlMIhBBInQvLRnWvi\/MIRtQMqPVFhzjdAZiC24H6J251Y92PLUBvFxbjTiXMnFh9rK30vLnT8XYh7P25vvwEJmnxyTUiw4XjcftRgGrY5dtswDTWGIDN023Huibywgk\/dld7\/AKg6FFN19tCMAAAAAElFTkSuQmCC",
		mdpi: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAK0UlEQVR4Xs2aC2xdxZ3Gf\/M499oOeTgPIIYAKW\/iFvIwdEMoRWUryqYALa36Qk2rdrUqQorKttXC7vYlqLaiaquWXXUrCSPS3e1rswkruqU0BNLGmCQueTjQElIa8mCJY+LYiX3vmZn\/ju8d+VxZibKODM0nfZrrOfN\/fPO\/M6O5x+p319IIlI40ABDyyCpI4GSwgGNiKGxOHWhOHZYCDrgJ+FegC+gDAiCJIfV1pTE3jRNsJyGJic1c4grg68C5FJATVGMacA3wTuCz1LEX+Aeg81Srok9BrAP+LiX6cEo+UEABGaBO0heS7cOAJJ+uiDW5AlRyviQFewDwJ\/Qz8dg++ZQUwwFqMgUI8FNgEwUMkwdDgU0plky2gDsAx5sPB9wxKQKUAlRypEBprFK82bAUkFMXIOAd4gJUj0HuwAWQJOwthExYgHhwguSDIFvB74XwPJCDA0ROHxHjBRgJkAfW5AMw1AsX\/z0sWwUdj4Ihcis492cRseZ4m4eVQAGF944F7ii3DPaS\/+VGsnwqhBcAC4vWw\/bbofoq+OlgDW8VcuAWYAHQSwFUzzUNYsDlHgnbYMG90PxByFaDzAE1AP4iMLPht7HfzolsBmVA5ASFVhP8gqiT9KWexhPbih\/rdiLcE45BLjBtMciLILOAKshUMAfBt8HUy2H4EAQBU+xQoMaJEJCQ+tSJdzpMYZvGFuND8lHgHuBbJOhkY0VAwYOqjFc5hCFwCtQ+wIACQjPoM2DktbpTpSNtiiPgLbgssgRegXhQthiDFC0q9Svwqm6T68gQqSLL4HRaa1maIPDAg43brU1OHbACDVpjyu+Ari\/CtXvqCdlXILSC\/ygMfAXULtBXgTKQlyDkwCsWNR1U2SFeEwYMrsmj5wf0MTBplvGArtNFBjQMgekNBIgsviP+7ZFYzBSHOQbKYlJFViB0jt+FHiCkhdkKNoeN88CeBywCvRgOfgl23g9yJSCQ5xa2Qr4FwpCi1HYV065ezpTLl6KazqL6SkCeAt8PeSu4MogAFvKZChmASneAkfOY+50vc+HPf8wVTz3BJat\/Rtu3v055WgeV7Q56oFqxtap4B0rzABbQoDYvHlsQAgSl0cFbgnYMboZZLVD6a5BhOPoD4GwIMy20OEY2w+zlH6L9sVUIJXyxBNCAAQ79z1p2vv82rBPUFQbjNX4WmH05w\/tbue7ofkLWhD\/OGtapEr0f\/jgHfvpvnAHYdgJZplUpVygsUUAkN0fKlquR5yI3Xa6l94PLZRRHduyWvWu3yevrXpBRvLRymfxmIbIGZOTlfZKLiJPjI+RVqY62kX\/6ylflmVmt8vwd50r3jBhr6VKJGLVPI1IbXGQeWe9zIdTGDG3fJnu\/\/z3Z+bn3x\/xintdwc8+7IAmgsybgmvjgnUj3lVp23v7eWvBK3+HYVqRyuL\/maOdNl8paEJHB2nPxXmqNc3GUjAmqps8hz8VHjj47Grnn3zvlcSiSjwjVfExoqA6IH35dJPlwkcE5qUYfwyKy+x\/vl+cuiwKW0dlzXSGgO9Jv7qiL6FpqZQPIvocerCeZnB38j2\/JxrZz5NUvf7qYuYZEdq1cGZ1fJF0XnSNb33ODHFm3Nj0vxjwL4g5sG\/PrnK8Jfv2R78kvQJ5KfBLk+VtvrcdO7PvFY7IepGuh9THP7sgxAX2R1UjpGa3AdUgXyIFH\/2UsUCXyj\/d+Tp6BNOO+IfmqrAb5LZFna9k4tyRdZyK\/hFpSCbXK\/SdIchAbX\/P\/0l131sZtuMBIVzvStSD6eVsmv2lBHmmw\/y9i\/2Jk89VUt1wdc15U7EKtgEGBBGAEBGg+92waUe0foIk6tNGId2jgSVVi9jugvAKyywL2wir6Kpj+bjDAkXWroHKYM4HrH\/0aed0B3iuMe43ehx7ljPaMpvmeUjM1lmfnNN8IbwN2feMuej9yG+fMgay5ZmrE09p499SNp7bo1OaOBBRQfX03TQvb8IABQlCMbH8GBdizQf0BrAMBVA5Bw\/QOzYvvvROnQEFs55GAN4q9X7qfOUDWlmOPQgBEgY5U\/VBeajl07z9DBrojw\/icUEWnpNAcB0qSAJPRCBMcqqmEFCOpHu7DAqoaGUAAAoiAMaDO0EiWEUoZCsgPO2TMGsqxygGQaSAq7e06CXQg3gGgWoBcTngfCIlA8UmXm1CFDb5SZuT3f8KQjFWg9d0f4BBQ+V9wsxiDhPrfrsfRcnM7Mz\/wF6gl7ejqdhIwznHO3ffV7f8A\/vzI5sgyuBlQ8Yo3uqF99xZaP7EStcPhS6CzlK+MW8RbltTPgu6O+oIcfPZJyV2xiHs\/+bGxRRxcdWyH6F\/3mPwEZMPFyMZ2JV1XxPZSKxvmIj8ASZAfgjyd7CXZ56M8tEd+TLQh8lwTmcnGmch\/E32eNX3snFmdFvGmjphrR8x5YVGBlwFDgiRiLUqEBKZeNpcycHTrGlz6elnnmHrDcpa\/2MPwS80M7xAqO+HY7x2lC6\/nM0N7yQEH3PxPX6D5vAVUnl5V2EtAZs7jwyLM\/pvPkLVeii6fFX3exrs2PsW1rx1GgBxY9sTjyBZwWIPiZZWNP8iWRHYQ99l6BYZ2PCeu6sYqsOebd9dm8JfjDyLnapXwqddX+orZTVumq9Qr1nP7DbVqpeoVJ673UmmwqSaGPBfnnIyIyLHIbbcvl2evymTTUjp7lhUViD4TdLEb6eZmGhEGLSaDKRrWK4VNM4MIGckZGp3NAAQLaO\/JtUFVhhncuoMz\/2oZbbPgcaVQbwziYutDwGhNCbCJWVojzlqMMbx690r233cXPi4KHUDlKedYAZuqEGcfP7oGuq5X8gTIwK\/XiKvmYxXYtPBi6Z6PbLgT6V6C\/Apk4Jmn0\/OC1aKt4eX77pPHQdaD9EyJtjfaWpXXgfR+\/M50pqeZT61Ptvsf+m5t3Eaoxd60xPrNi7XEU5hIq6KABPYrzVwnIIOgfSuLXupHuxxlM3Kg\/0eP8MonVsBCBVMEBkC2QwVo+\/wKpl25hGz6WQRRuDf20bd6NX2PrWcKkF9i0TMcpgqmBN5EDmWYXTkjw6BaDC2XXow9bw4cqzC4fRf+tX7KgMw3qAUe3Q9qBLTlAEKbCDQKWIHm4bzWCUuGdjMyZT5Z484KvLBoBnnfIObMAAbcdAgvWvSIIxwsboYa4BKQYNHzHPoIaF3cn5UBCeBbIAyB7DGoZh0ZkKCQwwpGBZ8v6IG6LQAeRPgUQicUAizgUIj3eH0UUzr\/AqYuvpHKgd1oU6Y09wJoaeLwqm+TK4UuC6qUxPnIppRcTh1lUAHMMKhs3P04QWnAgNSTQsoA6RrpQbviOioOEDwK03ixrwsocA+aByXXoDVy0CEeiFQDkVOA8y1KuWKqiwv98X9NCCe52J\/8R4Hx+NvGS30hoKEKAOIhNCc\/KTg5GJ+CCZOIifwsU8z+eAEJLAB2KE2OIktOCiEBEN5q5EAGtAO9JBxPgAE8sAa4hdMLa4FbixyP936geHArpxuKnPz\/9\/2A4vSBOtU3NOp0Th5AT9CB482Ho4CazLeUPwMsbz5siqUm+zXrh4AOCngmD54CHSnWpL9mtcDm5PhewFAgMHE02pjkU6UYdrJfszLuLfo3UrBPAXvH+REgB+QkfTrZRh+o5NM2xpq4gIkL6QTmJTHvA34IdANHGIfU153GxLGoZNs54cTHn8Qnx+n77zb\/B4uTDMmuh0kEAAAAAElFTkSuQmCC",
		xhdpi: "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAZgklEQVR4XuzYzWtdRRjH8d\/MmRQCxmqRSlqBWN+1WsRQA6RowZ1UKwQERMBNcWdXmkIaqAUDKIhCEUHyD1QQBHcFoREC1ELrSggSEWoJJWpbbJp758Uv+KwOkLbcpDn3NA98eGZCIHPnlzknE1dK0VZtHq+t2grgXhYgo\/Ojrmmns0JXvdUAErIaUi\/9XGoBNENlPVnPGMY49uFpPIZdeAD1tUf8gz\/xG37FRfyES2v8nE0VGrDpCbL+BN7A6ziIekUUeNTLY7uF8wLq9SN+wPdYqK\/hXgsgICJhHybwAYZqmx3uYL3eCHURB81nuI4v8C0u1tbU6pdwsB7xHs7hAqYwiAKZsEEnvWAQU7iAc7aWCCG0LYD6xh\/HCmYxWvvgThtfrraeUcxiBcdrQfR9AL72G1\/wMQZsLIQGvAMLBmxtpXYifL8GUCFjBAuYtblQwak55VBByJjFAkZsXvVjAAkzWMTjNvdqfnkkW\/MiZpD6JYAAmWVMIkKo1D9VWY+YxDJkQlMDCIgYR8EO60H9W6H2WcYREZoWgEPEFOZqX+\/3cpCZwxQiXJMCKDiNk0hqbyWcxGmUJgUwhwlEVGpvVYiYwNxmB+Csz2McUU4BQlur\/q6b7\/VRG3r8J9p3GHNOUV5BRYLkDFVyq0MYsz14CxXS3TgBAQknnNNhVykWKaQkdSNW0ZVilnKSnJfkWh3CYZxAQrgbAUQccE7TcoopKXQ7UroquX+lsky\/Tmcc6d1iZ9S3OoRpHEDc+ADgnM5aEiGx0ekXSUV6+Hlp5E36y9LgkNT5XXI3pRjtNLT3JAhnN\/olXNnmL4mKWdKKdPMP6ZlJaf\/X0vD70o5D9HekZz+Rxk5JVcZlKUWp5Na\/oJesV+sdgEfC59gZk7JWpc4V6dVvpKF3JfeXtG0JV8C4gntQevEU86ekcE2EIKq1IWTstD1K8Ov5V1DGo87paIqK+YZCvCzt\/1SKD0kD81KJ8GIAYUUKTkoEtfcj6fyHkmOeo+SD2lgeEUfxJRbX6wQESE5nCi0nBd+RHnlN0nNSdUUqSZJRQUYE82qV1pGePCSVS7DvaWkF62dg894DiDjinPaUpFw6UlyVdr8iVWSsG0jwcJB1jwKEq9J9e6Vq1\/\/z0tIXssnYgyOIvQYQrH+FXCywbdsZ7EZVv3jVOGQaPd8vDQ4z9lJp923ZI9ueCaGXACKOwRtBzq4gdsla+5FSrAUpeBur9eXNsVudgnCbl4yEytkBW71G7zKsJJfXCKDAQvIdaeVvqeQGX8rcrR+NpdBwG5UwjRkExDsNIOJt\/MfMuQfJXVV5\/HPuvb\/ueWQyM5mEJBPyNuRBIJG3CKgAy66iq4IWIrpAWbuoiyu1vhc0PAW2CnXVEtVdVGALFUGUV6HAAiLyToCQhJAHSZiEZCaTeXf37957Nk79arorO93TwG7V3qrzR0\/9+ndvf7\/nnnPP404DoGgGXA7YCYProOlUcGsrsiD2APAjIBAAtxuGXwUzBaypQZrUSZC+ETBqK0h5J1e+NxMAKZNT+azGmvMboCHD8BdvbAeUIb0EABDNCDANIHNg\/a1wzPshzgWzFmjLSJADfMBkiIfDpq9C0gIxl\/kBrQBBQCwgoBE0gApQ6S8iAEgE0QOI0jeX9BOXzelBHUSBWAItAWllXwRIHkjA5MAISABxZV1XrZotviQjwAKhXgIisARYXqnbKFiBNAeyAzZdCfNugGjAbgXNV2ixQmyDcBQUfgx77gN7CDgBpTzEZkCnEPMQPcR9wBBQEMQIOEGjQlCwCk0gk8D8RRREQWwGQh1EiAEsaAohD2EfsNsgbRbZmqI6vmIbgTgvIfRFaI+YGYorgViQ8XdEyDBcAmx4IztAgbMPDKuzXYAT8LNh9z1g\/gHmXQGlFnA7y6fPNAHmQd\/34cXroXFJpj2Z9osAFqKHkEDcK0i3w3SlqIcAmGbFdeSQhgRSTxgoELvLhy6da0mLihwUsU1gAoirHWuIAxR8DsJegwxD3BBRiUxaMZPJHzkCN3MhDdMOxra3gTGE3n0UurbjX99I31PPMPxkP7ppCFOEVCwyJ2ALYNyBZgwLkGG5ql4CDBCBL4xj2VEFmwMVCEth2\/3Qsx0WngVtc4BJIB4KG2H7T6D7EcgvBNME1mROOKM0OPADBumPhI2KndVC+98vof20s5m06EjMzBnYKTMzU1pChnop9uwi3foKfasfZe\/ddzJw\/6vkdkGY7whTPNYyKggQK7RSwFiIAfxk0J2G+HIkt3Iu82\/5FAd96EJC49QJN9BswJHSd\/+NvHrdv9L\/wCvkipBOspjOgBsBtDIWIqCjWK4qY1seoqoH3g+wwBxgc\/lVBzhJQIPBv+4oDQAtUOqCAAhKBCxKQzvQBElLJGmKkAGjQGiFsN3g10eaVsxm0bcvY9K7z8eTrd2D0RI4g4gFjWiIqBpCYscWFl7bQPfN32LL5T8kGQad4zALPBJAhjITlQAmA3\/EYl4OjKRw2H3\/QetfnU8EbBowztQVIar3eOcQoLjuETZ99jPse2gtuSWgjYL0KKYZTBMYg6oiKAuAbUDI7gdUJQDgIuDfqgVW0QsuKqZ9Dq6pg9LQ66SDSqlf8YMBTKSx2WObAs41QambmDeoeDCQNgC7YGgjrLj9B7Tv174IOO8R56h3aAxEtQQLCSPs+OYlbP7a9eSbITY5TAKmJWJbIyqQ9jtY52n54DKW37GWtMqc9YoGj7cOgOJzf2DtGWdQ6CqSAxJAlzsk7xEDKJ9D+S5APQQ8DJzEAUMshAhxp8MmOVZu2Y3SjMCYGECJoxIooTSx+3tfYc9F15IeBdoEugNKr8FJhUFSmquCUL8o0SvBGWToNdaccAz7Vncx7bSZFH6\/E1lhSBFkTaDjc3\/N275zL6pghTpG\/URYYNuqC5j+dxew587fsfvL1xEXOkyDRyyPoLzrQAJQ1TF5+kjMfmG\/6H5J94tWyjPHok+egD4+K9Gnj1igqaqqRv2fI2YStKSqPXffrE+A\/vEI9PG3oQ8JqqpVvv8WJAZNVUfnHN7yrHpV3Xvfz\/WxFvQR0HXnLB79m\/f6fzKCD6NzF7M1rP\/M6frE4pw+sYL06aPRp49iFONKzM045\/8ZVR20AkWQGJGRbVggjJuLEEBQH4mAH9yBWtDNlqFX4N1xDx5wExYHFKInltL9EvaLR32p+qFfDA5wMdAw61Ai0H76JxgegAFgyS3rQcHaCew7kIUCFZL9LXtmvGGsIclATNjB3p8+SCwo4nACoMwAbK1cUAqcUt3mgokg0wJhk2f18VNQP1h1Qd45+m\/7Iduv\/QphhoN9gZV3XUPKVBw6IQgpQjQpafd6ipsfp7D1KbzvxosZi5M0hnF4sGNkPHPcFBzwnudvIaWG2YkBDwTnKD71KNsvOpMNZ8xh7cmzWPuu\/XLGXLZffCaD998GzpACMSgHjhDBAg\/LbGR6isxPsVngmWGbThQHLKmlkOLA5KHUIvQ83sshz99P4\/K\/rarHGy+8EHoMtEUaj26k9X1fxnoPVWx+ANQ5hh\/6DVuuupihZ7ei+0AVBLAtYGfnaH\/Phzn4i19B567AAFZD+XxLHCV\/8NeX0ftEL+1HziB\/2DlI8GBd1VMNu9bw\/CnvYOClERoA5iSQCACkSunu2+n69u2ohdlfOJP519xW6cjR4FHrWH\/uCeQAZoIbqYzkWVJPHLACoCYJJRCrTG4CN\/2Qmp1bTUe3MPjICHGfZ8nV16FQ1eFmZonVJ0yl+7EemtsADKYjVjg8CEOR7u\/fStd+6fjw8Sy56UekTYeOAREwJOzkwbNWYYATf3I1AUjGAR8No+AXnrmFPx51Lm0HQTJbkOkKpIipSJFMBTcIca9jx7W\/Zsu1wpGP\/Yqm488iAbx1+Jd\/w\/ZbHqNpliMfPSKgvoxtPenohYCfKCMoEUwDkOSBUI0rcpOn4BryJPOh7dR\/xHlfVfMd8NgkYeTPPTTOEexKSBZHknmQzAU3D9wiMJ0eOQbcdEff7X\/ioeblDP3pp6NAxhAR4LkFnXQY6JwKuZUfJAlVzKRYTN96HtsP\/uTFBnM45DuVxDAqDnAKo58d5CZDbqnHHg+5OfDiBz6NAEEhAR5f\/CGalwm5ZR5LBr6O6dfCenZAx0QZFQVUgBQg1vSjoXcYI0WmfvRUPJBz45mAFHUJa06ZgxkBjoa8KKYwjpoIEAEFM8\/jZ0Lzaui540c0HX8ewRp2fPU8dm+BBhJa3zePlHZyVsdR\/hRswjNHv53WdrCzI26worqr42dqXQAJUPJC7OlG92wkTlvE+jNPZhKgMxTbX5GbEjKg6KiXAFNX4c2Aiq1pgtLhIqHH03zY6dVJcgkDD9xE94Pbyc8z5CViswSdxuopawuIg7DM0fvzJ5l96QbCUIGt1\/yMhskOV0xpXHBE1VaMYBIKa++ksLGAnSEk\/YoYiKXaxSUiGAPJLMU0wYunHUvL+09i+J6HiIc4XJ8HBxoqp8XVS4CruzU3D9Y6pBZPxUgEmhatwMTxqY3A6\/\/+I5odcHDEeogpEMbFDbT844wAeY+0w\/Nzl2A7DC2HQRGPfQGSts7qaxPovvM+coBOVyRCVCYYZc02QGwWYhik97Z7YGGCa0gRCxrqu8ds3lJvdARVpeYYCQDkZ83D+HRcNAUovLYR5iVICdBMpL6ijFiIDRA7wEsECzYDQBuaqDXCrj0IgGSi1Dey9ZlEwaaopEhuFHyI9b\/HvGnwAeMAsRPMICgQQ\/VVCSPE4UEINathtYHIiiYyCSQpnwvsBC80LS0ogL65pjGNoFmUBiD1v+Ot7wAFsAJSY5OkWaxcLFT1F0ojkm9BDaOCvEFlCBA96IigA4IGQfJggLS\/q+ZXW487Gg\/oCKD1K4BYUA+aOuwWsF2Ar7Ca8uYJ8ECshwDJg3ENNVO4kmlgsWsDMbFVt1PrCaehm9IxbRQ78TYWk5EcBPsaWCvYxgbwSowgsywDzz1VFQvnPW3v\/wQeoOgIrYAplyqrOX9JQAFvQF\/wzFz1JZZue4rSCxB2JwQH4sZ1db4eAnoAX5u2coFajanCtgIBUcUAw+ueq4qnCTDv61cyCKM1Bt8OYkGSDGQ5QCpA8hait8TOVlZuDBx690MMPA+h35E6w+AD27GAjhMHiLMEWlh2y1UUXvWUXnb4prJfGU8woAH8NPB7HelkmP6la7FTj2L6Fz+Jbk0JMq4SeaCnXgJMPT3qWEFqnoKEaARpTOh76Naqz1kT8U1zWPGzf2F4k6f40ugPK3dTW8CURYEYwTdAcaswstZz8Oc\/SgDMnGOZftaJyDZPacRT3NXLyEv3Eqwbd33We9rP+RrzP386xe2edLMjVfACAQgRQoAQwRtILRT7IV1v6d\/iOfjiTxGAJEQWXvcz0hzEXgitZcJQAEy9BGya6CiqY20aDrXUMEEBA4QW2PvbrTggeh0\/i5kGOj55JYsv\/QiDfwFvo6U4CCUPaYSUTBRKJSjtAt9l8a8rzcvyTDv3CpwHo7DsVw8xArAXTA62X38tWuW+lHEOG2D2t+5j2Q8upbDFo09B6ErwG8BvgXQbpJvBb3bEtZBuAPN64Pg7vk3nqh\/jQsRYQwocs+UuBtdB6SVH0EpzhgM21UPAmrocnwhiDYJUPx4Ej6YKBEwBtl11NsGN\/7xJLCYonZf\/kuPv\/R5+UyBdBzwL+nqC7s2hvTn0VQtrwG\/PwL7pWxyxtoDmp2NcxAqkWI750y8Y8Uoxn98fYzxMUthOqOJhjQXjA1MvvJxTipuZfvF5mLyiIsQeiHtAh0ByhpYTl3Ho7\/6TYweU5g\/+E877UfABXPS4zvdx8DnvwOzweFc2RZXYTlQT\/jhwcy3v7w3ELkcyuZHDX9hJQgNgDyDAE\/wgzyydSSiVQAxhh+eEoAQFK7XrrRbovesm9v3+DoZeeRqKYABtb6Dl0JOZesbZNB717qye6zGJq3wHwbnRFHL33duwQNvfTGX5PXtGgTbOVg3vYzB4CwawoZeRLRsg9SQzZmLaFxIBapQys9\/GAyI0HwKmE9zwWHPAucAttUqSCdAB7KxJgEDclZB0tLLimV04xjk7xhTvB3hu8QyiC8RcxL0Ek85awqJfrcOkAZPYGjWBFO+SA+MxtGLr2iogUNHO8WiToAXwCstu\/Bod511VZwlU0eDRIIAgJiLW1hWoeMClO3ks14k9CNzBZAEaM4Ge\/QSk1dIOAdhV+Z6aZshMsJigaFTwis2DP8TSc9t6Om5eRfu5q5AaQIhLSJhgjAeiRjR4DFByOd752moen7ISmh0vnX81Kxctp+WdHxslz9QkQRCbIJa6bh2FoEQrKACgSZ58J4QCoGNY7gJMLR8QAYBHJgY\/61pj\/MhJFTRGJAqIYPLgOgJ2iWPdJy5j4O4bxtLH\/1sj+kAqhrTvNfxgFw7Ycs13aBBITvQ0LhVWn3AOe2+9nugc4a33aqPekwJihVc\/9zHWvfft9N16JU\/N7kAcmHlZcU55pIzxxJHwbROG\/0DS0opWdcKKxhTTaAAFBRvBTfPklhrWnPFpdn7jArCmXGd9iyCos\/Tc8HUenrqAP8+bz\/PHTWPfdTcSD3PkusHOVBqXWjZ+7J9Z\/4GV2HQPKUKIQAxvas7oHAP338iTC1vZ891bKTy6mq3nXwqtljgtMxIGUG6rNxK2wF1QRT0MkEAYUIq791VlUFVgsJdSd5FYga0tgp0aaVjk6Lr8Rp6Y00bh2XsJzpECMY31ddpqJHillNVx++\/5Kc8ePovNn76C5ukOZ4Tiq72EwwVjPWIhGYKkPeCWWYb\/sIb\/yh3EjkvOxe9cjTd2rOgeUoilFA0lNKaoL41+9hFKjAo4Yd8vv8mzy+fy0ukXQOMAHCHoSogLQfIBI+VOtQxTW0\/qWYEtwBBUHm8qM6CC7U3p37O75gZO+7ro64XWFouKH8PVpWDaPeFogeE+nj3yvUw+agGdF32cqWd9Fp9Mp5ICxklUGjFo31a6f3EDXTf8hOILPbilYA41mGkeUwRKAVHAgHpAwALSFAjHQv6VhD1X3cJr+6X5+AVMOflwJr3rIzRMm04yawG2uQnN5aEwhO7rpdi9i6E1D9P74G\/pvWMDOlDELBHsIQbTHrFFkBS0sWLBkQgUMkxNPcfQTFgFfOPADGj0oOrIJQnLfvkCMn8hSY1mpa4rvsyeH1xHbBdsXsEAUm6ijQ3gdxgkB2FDRAWajpvJpJVzaehcjm1tI5naCRIIe\/spDe2juOlpBp97heEn92ABWWwhRMx0xRbAJOWc\/Xh3CMQCAlEybd9hMK0WeTklBRQwzSB5oMGhJY92gwIWsO0Qcw7aAqZDscVy06\/GcW3HZRme1NsZJ8BiYN3YiU4AIE1B1sD82y6h7cwryMUIxlR1itFZ1p3aQmHnCCQBkwBaCQSor2gT32mgzSHdKTqgME6WWJpBpydof0AOipgWsD4DoU4LJpKhGSEC0UIsgPaCFkGKFQ9GLV+3mAS2FYwFSSuADzVPw0uBDYDW+7+jDbAeeBFYTuXwEIGGacsB0OghlNfKmAjGWQKAmwQUDyjel82CWHABbBPookiUErEt284RSEENYMq3dEwuxXSA6KiArSiAS51VLV\/umjYKmgBTy6kWFUC1TFg2lwhQ35w2w3D9G7ugUX7wSuDWsSkyRbDAvsfvo\/OkD1PctwUjBmMNYhzYHOoMKoLJTUEwxL69YCJSpbCjoSLVK2AUSEBd9atCKGDKGv9mCypoBmLFxQ0ZZ41IjatJUqtUxJUHYFq3D3CAB0ZgrOMum9xh+zylXtA8GIFAZnsFjDGoEWxzK1IqYpIhggWxdQIktYsaSpmY\/8cjACnQWIEl9ZogKr5wOXB1OUIFgidNQDNnFwEBNAUMRBQMeN+PiGJygnGaPfTf7Z0hT8RAEIXTdhEYDAKDAYHGIBCHIPwBBAn6DEGeIogigAQMCRYMGgX\/AAECgUYRQCNITtPuMSFfLhOWI+RSetvb3eRl0tDuzrxhZ8uWnfnjbyWy4enNcsXlULkijOBITaOUqS+HD74WQ3f69eNm7+vYT8KpeMgPpVkkR1SHd0CB3BacCayQmDIT+ENjUIxApFwHRD5Wb2kOh3GAvudcsCOY1yT3\/vSvI0HW5XmGM1OFAwrkGh2zs+cQHAE3cMV1dQmbXgSnDGAj1w4s3JzqbYeqHGBZ1TuCtx+fiy2Fmw5c2cocAErkDDLCxQyy\/O\/MuSv9GBdboTmpK3HrrWC\/v8rHRXcfTmpL3JqxVX2tnBAq+ddwkdWWuFUlplkX3AfnBMjH9nW4KOvOnt5DLgvugnEC5GPzsuJipPUDWnzINwEUcDDY2vKthMmGIA+ggEOOrd6VMDHsmrbGbCdI29DCRuNXCRM3NiaCd2TR7Hivbal+rUv\/QWF93PUYhYmfjWkl0mDDtLaxSaUMdwVzgie9P+I5LLo+oftuY0sZ0v8rhZrbajyvUnijS6k4aaPzK9dl4xwArJrKF8TRPT5WJx7sJxX6UD+6JehqtA3NdIBrqKEQ2iQz4kEZWtQ0K3paH3Roo9OB1mccK2oX32bEkmCRVzsy61S82Ll9JYx1yNhL6OIQP34OcAnJODeVC6YEC+QrvRGYAc99DAgLlp85BNLXDX0vMFbO2NkoQ2Hqw+seyPjmfCJYZTbMknX2iIJpj4LuLw7ocs8Vz2zSR0KfJ4yROTqMCMa7d2\/3E98lGLZN0Jf1gfBfTklGeBCCIgJzQGyfVKXwOPa4wMwAAAAASUVORK5CYII=",
		xxhdpi: "iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAiX0lEQVR4XuzaYWjUZQDH8e\/zv\/O8223zbFqmzpkxN2vJdNNoSEYuDQghAsEIhLJ3M0HTkBIBBRwigHsfQa8EAbEiNETfmi6KShVTkqXaUqfqprvd3dMPeICrsaHb3f+28\/nCh4N7+dyP53\/sZqy1+LyxCvB5fkBeqUTJq7vVUOYlZb48I4E0SKPUyhx5VmpkpIOwckt65ar0yHm5IDm5LX9KP2VcyxmbN6DyrkZWS4MbzavSLDHGXkpeFIYjLT\/LKbnthnVMblGmRcvwhqmTD6VVamUB4RWT5Q7OZemRM\/KlXJF+\/x1o4qiSlbJbzkm3bHXvLaD0LZCVslW65Zzsdu9V+RuodJbKWnlHWpgcxaVWvnC65Vs5Ij\/5G6j4Em40P8gJ2SUtTN5aZJeckB9krST8DVR40+QN6ZQGyq9qaXcuyGdyUu76G2j8OtxhHpYGyr8GOewG1OEHNPZhfyCnpEuaefpqli455c4i8AN6PEvlqHwty\/Etd2dxVJb6AY0sKfulW9rx\/V+7dLszSvoB\/dcaOSNbxDe6Le6s1vgBQVwOyPfSiO9xNbozOyDxp3VArXJcNonB96SMbHJn2Pq0DahDTkgbvvFqc2fZ8bQMqFO6pBJfoVRKl3SW84Bicki24yuW7e6MY+U2oHlyXN7DV2zvubOeVy4DqpfvZAW+sKxwZ14\/2Qe0RI5LE76wNbmzXzJZB9QmJ6UWX6nUyklpm2wDqpeDUo2v1KrloNRPlgHNlSPuNYS8ED6TUAd0UBrxTTSNcnCiD+gracM3UbXJVxP1X1q7ZIMMz4DBZcSKywoWX3g2yH3ZNJEG9Il0kJ8FExVg6JH0g83kjSUCBogmYEoSTAC5DL5wdMhFOTARHmF1sof8LESmQnYI7vwJQ3egchbMbIY5K2H+2zDjZaiYDWSg7yIM3odoHDD4wrFH6kp9A6XkkFThwkAkDv3XIN0Hc96EWa9D9Xw316wgRqbCwx74+zT0fAPpO1Bdh4bnH2shqJJD8pbcKdWA9klr\/nhMAHcvQ7IGFm+BqpeAPrA3gYxYyUlUDCSmwfz34bk34ex+uH0eUvWABZv1N1KRtco++bgUj7AVshEXFoIo3LsClTNgyR43notgrwGDYgUJJCcZsL3yKyQqoWUveszB3UsQiYEx+Ipvo6wI+waaLofJH08MBvsgXg2LP4dIFuwvQEKmimV4RgL3eklmwyu7oHs79F2C1AuQTeMrvsNSL31h3UDbpAaXiUAuCwO90PARTJkB9EhSArGMngWbkL+APmj+FCIBDNwCE+ArvhrZFtYjrEV2kFcQgftXYUYTTH8VuAI2BljncbKShMwfEEnA3HbIPMAXnh3SEsaAOsnLGEgPgMnBvDVgb0BuAIjwxBkjCbC9MHc5TEmCHcIXns5iD2i9rCI\/A5kBqJ4LqTrggXvsWJ44m4MgCsZAdCbEZ0H6oX+MhWiVrC\/WgCpkJ8Mj+wjic4CUZCRgfKXBRKF6Ngw9BBPBF56dUlGMAa2TRQwPi\/uQczLev90YsBkgBhUpyA76Gyhki2RdoQeUlK2MkAkgyAHpAtw+7jc0spAdgkgEbBZfuLZKspADWi1NjJCRzCAQESOW8WXEQrofiOILX5OsLuSA9jJKkTg8uAzZB2BSQIaxZ2WKDMK9axBLABZf+PYWakBrZSEjZC1EE9B\/E+7fAKaJZezlpAIe9UL\/dYhWQC6LL3wLZW0hBrSZ0XIDCuSvI0AUTJXYMX7\/yQEpuH4asgMQRPGVzubx\/hbWJMsYPWwWqp6Hf87C3R9h2mvA7zJVLI+dGQJehIfX4eoxiKXwGYY16vdMSyFb5jbw21gH9K5UMXr8y955AMdV3f\/+c9sW7WrVZcu2ZMkFd+OGsenlnwAJCeXlPUpofxJCiwkMf0IxJSQk\/wCB4JDQy58SQgmmhAAhAWwM7hW5V0m2bHVppe177z3vjc+d2XloLOvuysbM5DNzZ7T2zM7Ze773d37t3CMsWUz1l8PG5+GYatBrgO2AB9D7EJICWKCYQDUIAzbMA0uHQBHY6Rz9KSXTZoKSqc0pCggAW34WIvM3Cl8PAlDlvQQQJog0CEAknb8twAZFdxKvHlAcP1HR5GcUOScijUQhW\/IdDazPZgkrAM6nPyhgp8BbBMkIrL4PLBOUKc7YE31MSsJZtkaDBdT+EiKNUFAFtpnbRGh58lINsBNghiG1D9KtkGyUf1s9YMXlGDQ\/aEFQPNlEk7kLXQvKJTu5F6JboGc1RNdBZC2kmsGOK6AEwF+MndZR1CDpToisgchaeUU3QawBrDDoAVB8Of+O84GCbCzQWFdvR1WktSioge4GWPFfMO5mKJgESjvQTG\/InJET2wq1D0G0GYpGge2yK1FamUxJxOqR32kmQE1JH00xQPM74vYoYAvS7YAAOwlClRNoFMiOAtVpscUGIQ6NoBRVXlYCur8EuxuMQvCPHU\/xyf+Br6YYNPBVjkQrKkcLFqL687C6WtF8QRJN9cS3bJDf0ZOm7f2PiddvIrknTKQO\/IPAUw6oIKysxDTF0cIyeoMihDjQcU\/3AXPJAt0LkWZIt0P5KTD8JPBXgyqQ2IAGAhn+710BrQtB+CC\/wkVLqwA00AwwI\/LJFQkg6MET9BM6bjaBqadiFJaQN64aLWig5ecjUilUvx9hmZhdPWBCYm8b0U0bSe3dRXTdZyS2tuz\/PwF4BoFRBqoGViLnZQFsaeUUDRKNYLaAWhik8ITZlF96LfmTKvEOrUExSnBPDLOjkURjO23\/+AdtrzxOfFczmOCtkn6lbYIwXf2GXwN39j7uqW8B7QGGZmWOkZOaispQ3BsAowJ8+VAwVAokEYZ4F8R3y8n3VoA3BCLVP+0gpFVBQGQjmF0Qmj6e0LFjqLj6TnxVI9ELQ1nNtEjHMNsjtLz2KO0fLaJ75SKSLTb+4RCsllbNTmVZYrFBzZP+Sddy8FYVMfgH32fYzb\/BO6RiwB0wO95Dx0fv0PjHp+hcuAg8UDAFUMGO9ltEjcAwNwKaBKwBNFyiaBnLoDifzRSke5ylwlkOVMd0G0EwvGBbGUdW2PSNApoH4nshWgelZ8xmyOUXUn7R1YCXgSZa+y9a3\/mEfS\/9mfieBvKHg1EsRSRsXKH5INEGkS0w7KpLqL7j5\/iqJ3E46PzwFXY\/9QLNb31EoAL8NY6jbgFqJqDpDRYwFajtr4AecN2hpoDqlX6HJfeAyfVdc6rrPkcYFqhGpmFeKCDSmahCLwD\/KOfpUOltdfKk09uzFvw1xYy4\/3HKz\/8e4OdQY7Y10viX+TQ+cNd+HyNvDHjL5HgQclkSJmADSu+lVjWgezEY1RWMfuRhys65kMOPoO29t9h1181Ea+vwVYK\/CpJNMtDwDpXWtXc0yoPAz\/sroEWuGq0dR9MOQ+i0b+EdVkNqTx2K3++Y0Siqx8BOJEEzEFYSLAVFU7DilhRUygZFxYqGiW5ci1EEwvqK6Q+C1Q6dG2HIFRcw5uGH0IuGcrhJd7SyY+5P2ffy66gqFE6TwonXS4dVMWTYjZoJr\/UAtC2E\/ImTmPjuW\/irR\/J1Yqci1N1zJ7tfeIZ0a5RAqQfF48cWYfJqwIr2EtHnwIn9EVAI+NLtpjPFA+ElMO2LFRQcN4Ns6V6xgZUzJ1J0PNgJJEKa\/lQnhDfB2N\/\/nsobb+Trpvvzv7Hl3ofo+Wwhhg98VSWkmtrxVsiQ3E4CirSa4RUQOHo60z\/9FNWfz5FCbOMXbHvgCap+eDG+0RWsPuMszH1NhCY7uSeBA\/XAZKD7YGemfgeoctuKiilDZNJhckHE92EEwI4DGmDJCUh1QPcmmPTSUwy+5CqOBEInfI9j\/nkmdf99P\/Etqxn14O\/Y9+wrbL39LkJjwSgBFAgvgsC0Y5mx4J8ovnyOJPLGH8\/R\/3M8DhyzaAU7bp1D10dv4xkMKDhQ5Wjj1YPlgSa4DgUU+bRpXtCCBrlgxWSorPrkdyq6rPJ3b4Rxf3pCiueIwqD69jtxoOq2OzEqhrHrttvRAk2kO8BTNZyp\/\/xAiucIx1M+jJJvTafl9bcxykHJVBEUYEJ\/MtEFZIFiOOumHiQX1PwCEGQ+a9C1FqpvuZ6h113NN4GKyy8nMLaI+FaZFR7\/8qPoxUV8E4jtWMeGa35NXiWovbPYBQcTUAA4FpcIx9nSC6Ft\/suYkQhZkYwQ37QCowCsFGj50PMlFM2qYdQDv+WbwtZbfkZ4xSZSPVB5\/eUUnng2A4HZEyaycQPdyxfT\/v4btLz6JD2rlhGpXUNyzx4gSS6IVJTacy5A0xJ4BoNI8VWOBQJ9LWFVwJRsk4e+kVD\/u9\/T8OJfOOYf8\/EfNZv+0r3kEzZdfSnppmb8I0HVId0BtlLI2CfeAILkToz4zvWIVIp0SwR0HYRANRSM0hBaMIRRPpZcaHvnz+z+3aP4y0AvyaP67vtySg7a3bvpWLCa1vnP0r30M1LdSdS0ibBMsED4DISq4NUNAkePwD\/jTIpPPpXQtAloBVW4YcddPyGyYQslx4MZ6T1sRxtVwKYDCagY8JAlwgb\/MEg0NmF2d+GGyNolhGv3UjzZyfAia0Mj7r1kf\/SSC7HtK2h99X3Cn35A96ploIKIgVAB20lq5oGWH6DwxO+SP3085RdfhlFWgxvSXXVsvP4KAjVgtsGwn12FUTKMbNn71DzqH32A2Pq9GCHwlUJg2FcSf3Za+qCJFOFltbQsrKXh3gfJm1DBkEsuZ8h1N6KFBnEwOj\/9B3UPvULBFLCTHAgPUNyXBTLIAcUG2wK1JIhRMgg3eCuLCQQyuZ\/EHhkWV\/50DtmS2LWenXPvoGPRp6T2RDAKwFMCip4plDrCx46CnYzS8trr7HsJdj\/2JEUnnciwm24hMH4G\/WHzFXOwmky800DEvQy95m6ywY50U3ve92n710K8FVA0S2beLdnS4QiHDEL+nrwxENTB7IbEvn1sv\/237H7xL1RecyWVN8w9YGEh1baZ9f\/7YvxFYOSDFaMvjL4ENIZccH6YKkBYFm5IN7dgJsGrS4c8uQeG\/GQqevFRZEPrW0+z4cobIJbAXwl5M53yiiIFg00GxfH9FfBVyoc63b6PphdeZ9+bbzPk0v9D9c1z8VSN5UA0Pn47ze+8R9kJEF4Hg6+4AKOkGLeY3T2sOukMetYtpWgGaAbYVmZJQTlAMVfI1Ift5OTyRsgMc2JfPVtvvYf2zz5mzO8fx185nq+y645fkG7voPjEg4gno5EFBxLQWHJFAJqGqhu4QQ0EQQOQ0ZxWoDLoijtxi5zMP7L+ujmERoB\/EljxTBmlX418CnhKZVrf7E7R+OTLNL06n\/FPPEbpeZf3Fn97E9tue4T8MaB4Zd2v+KyLsih8drLmpG8R2biK0lPkfbBSLqr\/jqiEKS+Qu3vzqqHpzc9Qoldw9AfLyQDtf3+RvU+\/RuEMsJP9aqgb21cUVjkQe7ps00SkUy5T6ykUAaoBZjsEJg6mYPbJuGXfM0\/uF0\/RWPAPdZ5ct708ToeiHZMNacUzARFj3UVXEN24qFflft2Z30OxEvsnKrYD\/EUQmjgUt+y446d0rVtF6WywI4BNzghT1rYCXgiOHfOV2l49m668Am8FKEa\/Wzwq+xLQEHJBlTfd4w+ihopdRhsJWYD1QbIVys69BrfEtqxi61XXUFAje3isaI67WlXpc1gJ8ATBN3wogfGzyAA7f\/NfdK5cSWgKmD0ycsybMhVPZY3L\/Mtm9jzxCoWTnCq\/xcDgBArGIOhasprYpi9xYNuNd5JsEfhHSJGh0B+G9CWg8oGwQBbCdZ+DGtRAlxMmkpA\/\/TTcUn\/fHSge8FXJjkQUckdxti6FQIm1s+tXt+BA99IvqLv\/eQomyHHbKemMF516uuu0Q+Oj96ACeshZSlQGDGGDtxJS9RtZNm0a4c\/fp+29F9jz55f3W1dh4obyvgRUSo4IDYSZRqSTLivcAkVIq2GUglGmuuzZWU77ux\/hHy2dSRQGDiHrfL6KBDvunseGy79DYtcqtvz4YjxGAk+JnCRhycs7pBA3CJGm+7PVslswBagMOHZctsn4ayzWn\/tdtl17nRSPtLJuKO0rClPIAaGAiIJ3WDF66VBckbRBkWu\/UeTHM6gIN3R8+FfMKAQKwE4MsIBwOhAN6Q91zP+AyOKPwU4RGJeJXLBB0QBNuBT\/FyT21mOEAMGhQZHj9BZB2gZEzGnRdb3MK31ZIEEOKALwghmJInq6cINeoKEakOoCz4hpGCXDcUO6aSeqckgnQEY3AgLjQdVS6MWAnZl04QhI9efhhmTDdkQyjeLBNVkVvfNBC2XdlisO2VkZQpEiUjQNoem4Ib43gW0BGmj5RaD6cUOquQXVC8Lm0OIsVVoB9Hb1nPqRbeMGxTQP7340AYgj9LQekQQjPx+toBQ36AEDBdAAwu1AHDckW5JgcNgmQlgH6IvygOLysbZSKRmBKnzjUBlgFANSHWGscAtu0FQh9zZZIEJFrnuc9SI9k8f4mhAgx4CJG4IzT8Yoy8eKHYbxq6CoAydWdeCc6ExtTy8NoYdKcUO8JYaFjHbMliaE1YMbjBI\/tuMQIjikKDqg9BarqoNig9mdxg3+6qPRyquwYqAI3ONiG5RIQHQDJHf36vf52p1oiQ2a14tiBHCDXuhFBVQV7K5G7FgHbsgbcyxCiufQbj\/2y5sf2wSKlunYQzjZXAOiWxtwS2haJekeUL2AzQAjxZNohJ4NMPzuuRSc8V16NoKeD4iBc6LbyBUVrGgSkY65bGVNIJyMabK+mdj2RtxQctbF6H5Id4FqHAqrI6\/O1eCtOZrqW\/+TuLOFSfFkkqh6PnQvXQpEcMPQ6+\/FSoEZlvU0xMBun063gbBKmPD6q1Tdeh8jH3wWK6WRbJGidUFbXwJqyTnUTYOnvMC1BUrHLCwhuxqTYTA7FdzgP2oCJeedQ3QzqIFDYIkEJHZoFJ96JpM\/WEDlXc9RcNbFRDZkBCtsmUlO1m\/Zv0XaDcGJM6n5+Rza14PqbHtGDNwbP5J7oOrGSyj\/XxcA4C0vY8TtNxLe5DpybelLQHvJEUWAMC3c4vEKVBtphXzQvfRvrlVQPffXqPlFxHaAFgTEwD3BiQbwV0\/i6Pc+QM8vBOCoh3+NXgTxXXL5spPgHQbxPUm61+zGLdX3\/ILiE0fSsRQ0L5CriGzp56gKxKKQausig8rwufdTMH008Z2uls69fQlo90D4CcKyXc+emTRlhGCDUQ4tbzzhWgH+UROY9M4rhOshuVfelNyR32NGobtpL4h4RvSDqhn98Dxie0BR5AXgKYa2+Y+5Hr+iFzNl\/ocEJo6i5XN5LxRvFqGNAorqbIdqhdalMOg\/ZlHxo1v5\/9EY+4d5JFudjLSnX0Pe3ZeANg9EttYoCbr+1ULVAbAt0IogubOT8JJ\/4ZL9S8ykF+bR3SCthuYD1esieSYy27RVDwgLuleAhYeR993ZK\/8z+PIbKPnODLpWgh4EOyYbudrn\/51UYx1uMUpHMX3B5wz98Q\/p2iq3igtne5PqlZdigKKRuYzMv6u6zDAn9rF\/TOmOEGP\/+FumfPQx\/hHj+Cqh486i6vab6FoNav\/EurkvAW0hR4QKViSBW5RIB5oCtgl6AKxuaH7pMbJh6GU3MPXtN7GMUjq+gFQLGEHQgpkQHPGVCzkZer4UT6oZwishsgnyTz2ZY5d\/wbDL5qDofr7KUQ89hRooJ9GYeWOY1QMND95ONuj5gxj\/9MtM+et8fONm7xdRz3JI1EOyEcx2MtX\/BFhd0sdJbIfwMohvA2PYNGruvptZ2+qovP5WUPI4EDVzb8Q\/pJTIRtD8HIwtfQkoPRA+kOLRcYvwBLEAVZNWzFMJLe8uJdWSnVEsPet8Zi5exOAfX0ZqN7Qul1uEzFZ581EBJZNYExak22U7aucSKaCyiy5g0hvPMPWDBeSNm8GByBs7lVEP3Ur3dhAAFhgVsPfFj0nsWka2FH\/7PGYsWszEt19iyJxrULwhrJiMqCIbILZJWqjEHmmlfCNHUTX3dsa9+AeOWbKK6jvuRS8q4mBogSrGPfccyQ65VCv0SbqvF0yNA9YCHtzi5EGitVB6\/imMe+lT3LD52qto\/p9nCE2VJlj1QediqLz1Okb\/95\/IhfiWpTS\/t4CeJR+S3LyWVFsS206jKAokTWyfB1U18BQb5E2eTtHJ51F02gz8o491saeqi9Unn0pk7VpCMwABXcug5JxTmPzXTxkI0q3bsBJR7FiU1J5O0FTUgB\/Vp2MU5WOUVKD6B5Etm688nabnP6HwBA6UFU8BU6avFAfc1tPgCGhmtvlJRQGRtHCL1dGMboAQSGwITYS9Dz1BxQXnE5xyOtniHzOL6v93wS1YkQiJ3Y2Y4VYU3SDdWIe3egxaQTlGUQi9ID+rCo\/iKWTss0+ybOqxmJ0yHVFwDDS\/uYDmF59m0GVXkStG2WgMcBKnDDijHnmTlr9VE9sTJm9YbxE52mg42Cvu\/gDMydoCrYOyi05l7HOfuFP\/9dfS\/PwT0gIlASHzOZH1kDd5BtMXrOCbwK67bmTnffMoORmECekWiNXB9GUfkj\/1DI50Wt96jA2XXi83CGi9ckSPAjdMXyn6LKaGyQEhQFEEbrG6WjN1rEwDFPkToHPhSjZf+RO+CdT86hHKzv4O0c0gUrI3Wy+AdedfRLJxI0c6ZeddR8lxM0jUA9rBtaHSmw2AyKmx3vUSJhDxGIrW2yG301B4NOx+\/mkafnM93wSGXXs2Vpu0pFYcgmPAautk9bkXkmraxJFEat9m4tvXyb8bt7Phwh8Q3bEF3\/BevdIC2NAfAb0PNGSdB7JAC\/pwh4JeMhjbBJTeeSUtD4qmwLa5j7H7ges40uhZ9jfp+QNNr\/yJ7XMfIG+0kwQErCQUTIX0zlqWzzyJrs\/f4Uhg39OPsGzGdFbPmkLTs\/dSe\/ZMWt99E09xj1Mk7uUfv98fAXVnnZEWACBME3ckSDXuQPOAEPTCTkoRhabA5lsfZ9sNVx8RJ7Ak6naw8ZLvsfTM77PhsnOou\/OHbLj0p5htdWilgI1EgBWRQQGpNladcS67H\/glYHL4sej4+5usOfUYNv7kJjRPDL0Itlz1C9KdnRTOANG7YQ5HE939bShbQpaoGqAquENFQTlwQ5IiE2Z6wFnO\/vgUK085jejmNXwdmF2N1M\/7DaumTab1jfcIDYWuDz9kz7xXCE0G\/3CZke7dpQDBoyBQAdvvvoc1p59M+POFh0044SULWH\/e6ay\/+AdElq6kcDrkDQWjDAJHy04IKw6IPjTRTwG9BFhZLWEp0PKLcYeO4vUj7IM0hMdlkbF4FiS2fsby6dOou+s2rJ5GDg9Rdj98LyuOO44dt8zFMyhGwQww8sA\/AvLGgmr0tStEishTAgXTILZmMatOPIWNP\/ohHe89x6EhTctrj7Du3G+z6rhT6Vq4kMBoCEx1ApWEnDN5SuQBxWMBL7kRUC3Q5DqMV+VA7FgEN4hUmHTbbvQ8EP3wsawk5I+DQCVsv+9+ls+azc7briXV2nlIloXkvibq7rmaFdNnsPXmX2D3NFAyG7RCnH33ziUAu39+okhCYBL7BdjywivUnvsj1pwwk61Xn0vPysWk28JZFgZM0p1hIiuWsOWas1g5YyobL7yJrk8+ITQNghMzveuIfrcSNgG1h\/SoA9Ur6z9NtVBz\/kQmvFlLv0m3s3jcSJINYYpngxkDRD9aFfw4vojcUqyUhSieNZHS8+cQmjECX2U1ircct4hkK6mmBnpW1dH6zkt0\/OtjrK4IWh74q0Hx9PUiAve5M0UFM+wc1WCCmqej6AEKZ48hePx52JYgOLIG34gKp0VDR9E0rHgSBCTqWjF7IsTrNhP98guiK2uxolGsmInmB89g0EKOcNMuxpzjUQfHAkv7vd8oBqpvMMGzf0T5KdMpOvU8N+2INDz\/DPV334TXZ6MPcrVbUlakVTmpsQZZbPQUg2\/UUQQnTSc4cTR6mQ8rmcZTVIq\/ZhypjiZUXxAR6yHZsQ\/SFmZHnPjOBsJLviBVv4VkE6ghyKtxxOpYGgQDj5JpIsMGKwWpRkjFQAB62jkiwcqcs2EnAEDEwQbwgu5FvmbYD2gAAzLmWcAytwIqABb058Qe1YDwUhj2szmMeuQPZEti22LWnvVtVDWKXgzCzKJn2bnJqWb5VFsRpx3CeUGTHgCjVMeKmk4TmBS\/MME2QfOBFpSXpwI0w7GINqAc\/nPDVB0ArHimtCDSUhSqAahSLIouP9uWk1GwBmy8a4FTgLA7AUnuAn7ZHwvQsxKqbruJml8\/TC6smVVMsqkTTwWIdA43P9NmisicTiOFkpATI+zMEQRAps9GB2QSM1fh5I5AIq2sREEiIGNhDtlY7wZ+haSXgHT65i3glj5PLVScSVJAL\/CQC1ZPGLPbzq2VU3EmP0UGRYoDMq+3OxDCkpcDKHy9KAD9PoRmoOkB3srlzNT1wArgtINFX1gghJdcUP0BhKociob47Pg3K4D1ue5MnQdwMAuk+8GO75G1lZ2rSexcQ7q9nkRDLem2OszufaSbt2MnO7EizVjRFiCx\/zOkccJ5FM1GVTgy+Dfzcju1WfIusBU4qi+fI28ytLz8HC2vv4YViaKqoJcNJt3Vgh4qQ\/PmYfZ04imvRCTjoKrohWWY0e79iUc9rwgr1o6iRFEKQFh8vfybrcC7uQtIchswnwPhOG9aANLdUTQvCCDd0oSig9najGkBOsRau0AFBIj0VhmOmoApi4\/e4YAKWP+3vTMIiSIMw\/DXIl66FRQQQbcSAiqFri5CEkUKCJ6CoGvrxaJLQJAQGArUHosIBCEQMLokBgjLQqImELmyIOnWJbBMWxMJ7QWeuxgzO\/PPfg88LHr653tfmRn8+dcSxCFzi6pAU9wLzxsA8JajArSePOwDL59Gqf4mXR6HrKeiLFBdjsiXB50RvS\/DxiHretTHu7yWS5Z1nCWytqgLtC0fWaZxyHg78gLBuHxvmcQh2\/G4Tyi7b9nEIdu4CzQvH1umcMh0PvYCwRO5blnBWSdTiL9AP2WvZQWnl0wbUyAoyecWNA4ZlpI65veenLNQcebI0JIq0Ibsk1sWGs4W2W0kViBYlQ8sKBwyW03LSfVPZdFCwSmSGSRcICjIV5ZqHDIqpPW7Mm7JsqUVp0xGlsoCQb+sWNpwKmRjaS\/QV3mDz1hxks8kZ\/FQpe2bligOGfSTiQVRICjLTlmzpHBqZFA2CKZA8FF2yU\/WUBxm3kUGFmSBoCqvyZI1CqfEzKsGwRYI1vhrmLC4cSaY9ZpB8AWCXdknhy0unGFmvGsNIpfQtsmC\/G2R4DDLArOFjBYIijIfyduBU2aWRYPMFwjmuFc\/+6\/zM5x9ZtfFLK2pCgQ7ckBePdS\/P5wKMxtghtasBQJ7JzvkqB2EMyo7mBl4gYTV5aBsl9MSwJlmNoPMCsALBGYLslvelLPmzDKLbmaTKlosnezJMbwjb8sL1lwsyhdp3+mZC2T7ZafslcuWfZa51s4IyuMFgl9yUl6UPXI6Y1tFNrmmHq5xkmtOPS0WFn\/kG7zEJqnrst3CZF6+5XoWLEByFigM\/KHMc4sbkjW5Y+llhzUOseY810B5vEBJsCVnOFW\/jVfdEX63YsmzwlpGWFsba51h7UHTYtmiLj\/Lu\/x8XF6RZ+UxeZm3udYYdxwsyg\/yBw\/EU8GcZOIFAiC4cQl2VJ6hTDmKdU6elqfkCUp3xADA9inDd\/mN21GFouxRmi8UuQngy1bCw\/FnIMcL5Dj\/AGjQJmbW9uX9AAAAAElFTkSuQmCC",
		xxxhdpi: "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAoRUlEQVR4Xuzbf2hd5R3H8fc590faLIm9MU3SqqHr6kBdcbVu1gGFSScUqAO6FLRlQmqGgrBSRRi6tRNB0HUFBB2ZGUJ1YFAAAQawyhiDbqxbt4Kb2m3Ngs2vpo0muW3ur\/PsAzxQgN70Lr03ufee7wvenP\/D87nPSbgJnHPElTEhsWOMDcAYG4AxSTyPv9wfcFPMN9TdapOvT\/WqbtVFZWbUtJpUY2rU9w\/1Z5bNbD\/tyg6gcibjD\/kj\/sDfo7qpni7f3ZQ3rT7yg\/jAj2OWipnKB2DuVQ+pfWoH9aHb9231HNf8UY2oD9XfWSYbgDmo9qrdNJYdPo\/fqPfVMEuwAZgW9Zw6oL5K89jte1N9qt5Wr6gcsWcDSKkB9VPVQ\/PTsHnRN6WOqF+pgg0gXh5SP1K7iK8e9Qvfb9XL6kNiJiRenlGX1Um1C8+wS51Ul9UzdgM0nyE1yI2YjPqZ75fqB3YDNK5W9bZyyzr8ZlA5\/zNstQE0lmGVVfu5WWa\/yqphG0D9e1U5NUC1mQHl1Ks2gPrTr5x6llozzyqn+m0Aq+8O9W81wkozI\/5nf4cNYHUcV2NqM6vFbFZj6rgNYOVsVE4dol6YQ8qpjTaA2npdXaBemQvqdRtA9QVqWj1FvTNPqWkV2ACq43EVqfU0CrNeRepxG8DNeU+9RaMyb6n3bADLc07tpdGZveqcDaByG5RTW2gWZotyaoMNYGnb1TjNyoyr7TaA6xtUp2l25rQatAF43hE1RFyYIXXEBiDymjpK3Jij6rW4D2BYPU1cmafVcFwHcEINEHdmQJ2I2wDeUAcQY\/xZeCMuA3hePYnnGfOker7ZBzCoXuL6jHlJDTbrAHaoIZZmzJDa0WwDyKhTVMaYUyrTTAO4jDF1eGaS1N4klSMIEPFPHDgVS2ZS9TbyAD5QPTc88EqISlC4gp7g8gpIrlUqRBKIH4RqeqbHn6FHGvEVaJ\/awxLCBBRzsDgL8xNwZQpSbdDWC+u3woZt0NIOCxMwNwnZGch9ATgIQuLB7FH7GvEGeHfJT\/0QHWqgBLf0Qd+D0Pk1oEU5\/4xUzs\/0KoyehIkz8MUotHbB2lvRgGh+5l010kg3QJYygiQ4B5c+go4MfPOH8PWfQOdOYK0qqpKaV1kVqITqgE374cFjcM+jkLsEl85DqoV4MNlGuQHeVK1cR5CA4jwsTMHWR6G3H8irUeXABUCkQv8Ucn4QCQguAWug53vqW\/CnF2HmHKz7MrgSzc20+rP1RD3fAF3qINcRhJCfh4VpuG8Qep8ALqr\/gvOHH+cnGaiEL1Ap\/EDUVeCs6oQHfg7r74TZUUikaH7moOqq5wFcpAwXwcIEbPs+rNsN\/A3c5yq8dtAJy\/x1x6nQjyEJTvGpysHWH0PmNvh8DMIWmp+5WK8DOEYZYRrmRmHLw5DZA3ziX1kSPkflnEr4EXym8nDfEQiTcGUCwhTNzxyrtwFk1OFyrz6Ll6GlEzbt8\/vNXXvVweEtbwTuP0Ab3H8QcnNQXIQgoLmZwypTTwP4mDLCAObG4a7vAl3gplQCcNwcp0JwKcifhdYH0C\/DsDgHBDQ\/83G9DKBfdZf79F+YgVu3QGYbMIpIguoIIExBlAdm4c5dEDigRPMz3aq\/HgYwQhnOQXERbtsGtMLVCxCsARzVEYED0h1ADtrvBVeCUjEmt4AZWe0BHKeMIIBSDlpaof0rQB5aOsBFVJf\/WgQllYbOuyCfjdHvAeb4ag7gEOUEUMpDYi20bQayEKQAR20UVQS3bIzZ1yPModUawAluIIogTALrVIGacgUgDe09UMoBAfFhTqzGAA5wA2G4gv\/aECgH6TY\/hjgxB1Z6AO9QCQeJJOBUSE0FKaAI2RlItQEl4sW8s5IDeIxKBFBYBFIqoSJqx6kkRAUVASHxYh5bqQEMV\/zpn4ZCFhb+CayDIKI2nB9ZAebHIZkinszwSgxgoOJvK6QgfwUWPgMy1E6oEsrB9CeQagcc8WMGaj2Aw1TKQZgCHMyOATm1pjYHM3BAGnLnoTAHiTQ4RzyZw7UcwFEqR1SCjtth\/K+weAq4HYJIUT0BEqh2OP97CFtUgvgyR2s1gJ2qHfl\/b4FkGv71OyBSX6ry4S+qbiidg6kzkPa3TGyZdrWzFgN4gWWICtDRB5NnYOEPQJ8qUh1OZVQHnP01OCDVtuKvPyag3rxQi\/8J\/g7L9D\/2zjs6rura\/59z71RpNOqSJVlyw9gQN7Bs3CgmQEJLCGlAXvIChJACISHEQBoQHiXhByF58EIxhLzkR0ghEAcTQrMx2NjYuBcsd9lW7xpNv\/e8P\/YfWtGyhaR7R5a9+Kw1a6RZWiDr7u8+++yzz946DeEx8N5TcG4lMAHULtBeQDmI+4PAWNj\/ELTtgYKTwE7jJh+hQClAXr1Yfb426YU+32tAD2s\/p\/PdFsD1OEBr8AbBlwVv3Q1n3w+cAmovkAZtDtLwbaAAKIG6x2DXm4jx28Pj6aStS1\/vJ59rANvBgx8pRm+A8gBpSWXbEdAxQEM6DSZgaTBssAGlELR8jdl7Om\/4wcwBMwxGALQNpOU9g1wPPO6WAO7DIbYF2SXQUw9v3QYLbgdzJrAPVCvg7zd06a3zDwLlgIaaB2H\/CsifIMLQOkPGYIpB2GkRbLobUt2ABVYn4JGfsXrAMOVB45M6KNMPRg6Y2fLAsUQQ2CPU8H2gLEjUQ7wWLKSK15MP\/rEKPB6yQ2Fyz\/o0Vk8X3qIKAuMmk6jbh452YYZySXd307X2X8Q\/2IORY2J3WyRboadGxOI1ITAevEWIj0iSCe5zSwCmO1l8MaDsMoh3wvI74JTPQPlFwAygFlQXYCDYgNHnoGusvFtbYOP\/QtdByJ8MpgJtZ2DJN8Sokwch3oF8BPjLwD8aDAWBiZMgHicV7cZfPhY7HiW2fxcqbmHFIdkJqT2QFp3gLQRfkYgEBSDCQB\/jEMeQ\/Vr3WkilIDwBSv9jBtlTq8ldcBnhWZ9AeT0MlXhtDS1LHiexfzfJ5gO0vrSJzl2QXSBiwARsV1eFfJCFin5Quo\/bfL9a0YefAD\/DRZQBVhrad0HBBCg7AyqqgUlABEjQiwGEgFZoXw\/170PTZvGooVHiPbRLv5PygtUFVgSS7ZDqlMs2hZ+cTP4FV5A9bRZ4AgTHT8eTW8hASLU3Edu1gWTDbhIH9tHx1hK6Vu0i1QAqB3x5YOZKiKDTw9vfSPnk\/5luhkSdlK9XXn82pV9bRGjG+agMHqkn25vpfvtvHPr1D2l\/ow1PCHyjwZsH2nbt7\/BT4G56YeY6PWgBHACqcBmlJETobhBDC5WLUfsCUDRRDC\/eCYl2iEUg2gSxZhFOqAw8QfFYjlFgBCHdBN07wRsWoy\/+8mepvOmXeEsryQSxHes49MgiWv6+jFSniC44HgJV8jWajGJkQWIPxOogMBqqbl1ExQ0\/51iQbD7E3h9cTvNf1pKOQnAc+CvBjjpeGWuBMU4FoMkghgm2lqZZdhxsAwzkM6UADdjirQLZsqHSEke74wEt6H5PxFj02YlU3vIYOdXnMpy0v\/kX6p\/6Ce0v7aS7C4pngicb0mIA7mLISXnHKlAaJjz0LUZ\/71FGAjqVZO+tl1L32KskY5BXjTyjBE5QTgTwDTen9ylPb2yPAnSfOFQAGwC0iKA3PtR9ZCkCQVtDCHdMiO2XFajq6tOZcPef8VVM4FiS7mqk8emHqPneL7CA\/NPoFbztTsm4HYPWTTDqnGymL4swEtHRdnbfegX7H3mVQAhCp4JW8pzRCGrA7vmbwGNDFcBLwMU4xQRlQ7QGtBggOi3v+EAlwbYkRYYhD8nwyPd2GkgCWWCaYMURLxYEKwGGAf4xA7wEo0EFweqAzm0QPgVmrjyMmV\/OSGP\/ndez764nUF7IPlmyMHaMISJC6tkm4ea0JU9QeOl1jHSs7ka2Xj6V1tebCZZCYFxvmtlOio3oDxfBUuCSoQpA4xQFpEAD\/jGV+EePI7FnB6nuLnyFxdi2RbqjFdPnA9NDuqsDw5sFpsaKxSAFnpCfVE8C4vIgMcFqByO79yIMXvpHgycXojsg0gCTHryRqpt\/zUhn62fKqX+xnoAPcubLJr03PdvrFY+Klk1253J5n7XzAP6SKo4nWpY8xc5rvkasFXKniLOL7hQB5MwW50ma\/lBHE4CHozMFl7ATkGqF6o21uIWOx1CBIABvKEX+7P5DITMMHe+AlYL5W94ma8oCjgemvFDHuPf\/xZYvfpKGZVA6V+qrks0Q3QPZk8DIOXqc7M2FtmXgKYIFzZrjkaJPXUtRy7Xs++nn2Hv383g8UL3+DVpefJSdP\/sbRTNkZdfJfm1562BrgRbiEiokGRw71oVbiPEL\/pCERqijL\/8db4OZB+dqLcZ\/HJE98xPM2a2Z+qsf0vYuNK+QcGjCfd8iVgeJD8AIHinTI8YfqBDjP94Z97O\/csaG5Zyx+wNCp53L2Lue55QHrqV1I6TqQfkGb8uGWxeN++0P1AU5Y8AIhnEbOxHHWwIkjlKNGoLIOvCNggVNmuOZiu\/cw7nxHkovGs\/UV9cz+uZHOX3ZKuJt0LUajGCfmH+97JXmHNKcKIRmnE1gzCQEqLplMfPeewUCEhaj+rHlQQpgNi6hk+J9M4HhUcT3ySqD7hPzZ0PPDvl43gliBMqfxdSle8iaeBoA2VPnstBK4CuERK1k2pQBqRZpELYgkuBEJzTrE4RnjifZDkr1Y8uDEEAuLqGRephEMxlBmz7SGgxPX0OBeAPEm+DM1lZOaAwfcxs0Vgek2sDwQUcNzHzzTyjDx4nOoYe+Rt3\/30vWeNA2DMamjUxvgBVgW5mb6qhQBPLAigIKwQDi0LYLTvvHr1ChghPfCH51A1qBtwDaV0LV1aeSu\/ALnOgkDm5i6\/efInwK6DT9MWUwArgEl9BaShxQcOjhW1xvEde1fhlm6N+lbHihYwOM\/4\/JFF7yHU50Yvu2sf27jxKcAMnDYIZg8tPbGA6STfvpfu81IttW0vzCb6h77Ha6Vi8ltnsDsZo1pDqayCTrTptBdgg8hR96WHjJYKpB57ravNYL\/lGw5\/sPsvl7D1L97P2UXHkrTmj+wwPsvWMRsYOQfSqYXhGbMiDZCP5CmPT7HQwnVlc7yp+F4fNh9Uhp8HCwfs4UciokCxI9BKc8cweZwk5007bkKZpe\/B0db20kchj8Btg2KJDT5hRYgEKaI2dPgaLLrycwdjyFF38dI5SHG+z65kzirVB4NlgRPoy5gxHAZNxEgwZy50H6HejesMKxAHbdvIieZiieA1ZajB8kE9KxB87cvIxMku5opuGZu+lcvhQr3U26tZ1kXVpScR4gJgdv\/rEVePNL8Y+dTOmVtxCcdBpusuMrk0k0QcECiO2BrIlQ9p934jbpSAe7vzmf1n9sJ9oJfo+czBbPkyQH5pGPnuwoxA\/BrtseJwXkjLqV0JyJlF91A0WfH\/rq3PbaU+x7bD3FC8T4B8DkwQigFLfREqMZQNbkapySf97H0P\/chg2gAaR0onMljDrbT9bUc8gEzf94hgM\/vZroB6BspAN2SMIuMww6IcaPKStRT81hrPhhDGM9h371LN5cKPzMRYz58WK8hWU4ofPt37H\/9zspngFaLrFw6vP\/jdvs\/fFVHLjnj2ggqwqKPtZ7ucdOIKSPXnDoHw2BsaBMuWTT9uIu2v5+E9m338TYh56h+FP\/yWDZdMHXCFeJTQ2Q0oEKQJEpTEgBGgunWPGef79qqKQ+JGXBuP\/3PG7T8vwvqfn2zcQbIVAKgTFyxmD6xRg40rVHBX65XihhQbd4q\/rFL3P44XIKLjuV8Xf9muxpH2corD\/rq+RXyh4r3SXvJZffgJu8W6KINkP4ZPAUg06J0Q\/K8VnyAvCViiDsCCQaYPOnv0po4leZ9s81BCfMZiBs\/GRAwqsKsJNDaaHcvwCqyRC2JYpTaRunpA4fwAzS6\/290P0+FC2AcPXFuMnGj\/toejNFTgXkzxOvgwatB2YMGkCBJwc8YeTBWdDx8nZWvXgepRcUMek3r+MfP33gxj9fYSJ3CKw4xLbB2Huuxj2kxMQXlPBKJ8CO45ReMXjFiQRPhp6tsOKkM5h8x6WMuXMJ\/dH83AO0\/CtB\/ulDaoBQDaz9MAFMIRMoQCr4MLLDOMUIBLGsKChAibisJORf\/HXcwo63s3pcAT0NUDQPEIMfGn3uLCsgexZkJ6D11RbenTCDiuvOYeITy\/gw6hd\/n9ZVUHQmpCOy7+mxoeTKm3CL5Urhz4XsaRLHu0zvytADWR+DrARsvusfdG0oZ+rf6zga2760iPAYUP4h3SWeIgLoPw1aRSaQ7gAk06BcGOFihPMhTW+5RZvct6282Z0Y2E5FWBEsINUMxQtAJ+XlJjoOGsibLyXP+59czpqJCp1K0R\/br3uI8ETQCeTUtwHySiAwZjpusG6aAiB7uhh\/RlGgo4APisqg4816jsbmC8MYXvBWDvlZVA3kHGA8mcIUxVnJJE5JtTdgBgANKPGE4eoSDJ8PN3gnJwdPCMLzwIoBmsygJbQw86BkIbTvhl3fW8jRWFWuMD1S26QtUB7o2Q0FF0536R7C5bRtgbx5YPcwPKjebhulV83lSDQ+8SOaXukmZ5qjUGz8QAQwOlNKtyLgVeAtGIVTrCYLfAhAsg3Kv34HbrDlwnx0ArJPFw84HGhLNnQKqPzOfRyJPYs+QU895C0QzyyhHwCEzrgAp1ixbvbc9QK50mNpeLGl20bL0neJ7d7Cv5Nm+\/X3EhoH2nDkjEYPRAClZBIPGLkFLoRAgIWgxXgKL\/wKTul45x+0vNJBSIx\/eLHBA0Tef5e+RHa8ze4HXqVwNljR3tDP7pbzhvz5n8YptQ9ejy3ZlWEfM6VtubNg+mDVxGkcfuSHCLB2ihdDgb8cdBonlA5EAGVkAi2luckUpJsO4hTlNUQASnr3+ApBBUM4Ze8tn8KbK\/lrNMOJiPhs2HjVrez67lkIwvoZZxEe3afTjYJUBPwlkDVtPk5pfOKP4v2jHBN0ErwlkDsVtt14H4cfvI6GZ35MxzbIXeBKFqpsIAIoIBPIco0BKI\/PqZZI7LMxQ4gRtEFOdTFO6V73BpFN4KsALI4JVgSK58O+X73NulkKgN03nIOdlPYlOtlnAxmT\/L9TeravJn4QPAWgbY4ZOi0ZnuKzYPcti9lx9T2ULpRVzwUK6IOH4UJJysufDd6qSThB2RZ2EkwTlKwABEafhFNaXniUdFyaM9kJjhlWCkrmQtcGWDNRgYbQdLDto9daOW\/N8lcMH6A49mjZgOfMAWxIdZExDIYLDZiSqzfSluNmQr4SSSOi5IQ1OHkaTknVH8BgBGCBZUHOdMAGMwuMwNFXJbOwCKf0bF6NEQI0IwadynynPA\/DiAqKd0vW7XJlqcQUCSeB3Nnn4JT4ob14w6DtkSECGznb0Poomz8lcbHSCsckYyjFCOQEEgAJMD1glozDCVa0i+g+CE0FNBiATlk4JdnYgZE1wrygTf\/YuJKzVCgyyEcCUArSCbmn63NYBWkEQnhygKR4Rq+CxKF9DvtTNpCoA28+YHN8oKUMAoVj4nUHwMsI5QTYA2iZG0y6E5LtdThBGQb+ErCSSKWlBm+JM1F5srMxpOEuKI4PlISUyjRxSnjBhegIIwt14ghAMJEVO9qNI6IR4nVyroABKUB5\/Q67JefgG9V7wnq8YGqwujtwSt45l5GKAObIcc0KUMYJIgBJV0qKMThuCk5Ip6Mke4AgYIMPiGxciVO8uTmkukEZjBiU0Y8gbakhSjYkcUpo2hxxJIpji+5td9m9HuL7yei+zDgWD9T0ZeEEIxjGnwtE+6SFHBKaez7p2MgxfOWRGic7JV8fER+k45BuqcMJnrxyimeLwSnzGBp\/loTJnRvg5P\/5AeH5VUS2gwoMnwDaMhoCxSHV2YwjYnGMbLF5rcFXDJ1vv45T8mZfgmlCOnZsPaHhhXQP9GwEr+T\/sY\/Q+lHbkiaNH4K215\/FKaXX3057nXjc4UeMPF4DXTtgxpLFlF3\/C6a8cIBoK+iIKymbtoEIoJ5MYYsnM7zZOMFKdhGtk27H2pJha52r9+OUgkuuJlAOybpjFwsrP0T3Qud2GPfAzczcqgmOLqJ7E\/TtcYXu\/SxZtxenlF9zL\/mlcrPOCDCsKBNS9VIQd3b9bgouvRYBpjx8La2bwZRw0An1AxFAY8ZqgaRFIv7KcQ7DAw8aUCYiqixINeMKVT\/5IbEmiUNh+I3AagEdhzPeXcroGx8E4JQXD5AG7K4jrAIWeALQ\/d7LuMHUpS\/Q0w1WbBj3QgqwpHtgxddvxDtqAoJQcdNiQqXQs1McqAMaByKAQ2QIwwbSYMfjOEFjEAhL4RgKDFPeO1e9hFPKr7uH8EkyTMIIAnoYz0mi0jVh1gc1hOdchACmP4spT9xOx1b6liug09IXqf5PB0g11+KU0MzLOPm282lZL\/9+jOFb+XQKWpb8jiMx\/c1VRNpApR2tAocGIoC9ZAIN+JA9QFcrTrC726FPLxpvIRx86GbcoHpnimi7hEJGNqCHqVRKNrRwBAdRdt29hE+FnrV9YnQt4YoGYrXbcYPx973K2Kun0bwClCXGmSmUzEUhWgOpBJRfewdHIvvUuZz8g\/NoX4eTmqW9AxFAbeZCIHl4Poc3woxQiHicf+8KkQ3dq3bhBobhYfZrT9G8F1KNoIJkHMMP6TboAmJ1NRyJ01YdJtoD6RZQ3j6rwGioufZC3GLy05uovHYOjeshdVgcgasoeWapemhZDaRg1soXKL7q6E5s3C9ew\/BAbLuEvUOgdiAC2EqmsMRoPXmFuIJFbzYkX6bQtCx9GjfIO+8aFrz5W5pqIF0v4YBSGUh1mvLf7l4NXfth4co\/kTf\/sxwJT245ExddQMcHffcB4CuDyCawulrdE8Hid6n+48\/pOQAdK2SlUTIVH9QQJ+6bveFO6woZVDjh9k8zv0OTO+8y+kcmw3Q3AbEhhUJbByKAdWQKSTFitTfjhERTPVlZUluEArSUDOsk1C++DbfIW\/hVLji0gZ690P0OUsrtd7g5VKC8SKozInn35ncg74JRnK814XlfoD\/G\/fxfhEZDrKbPRBRDDhm3XTEJNym+YhHnaouyL8+heSVEt8iqqBNg+OWlvCDCQF4e5OWV39HwyM+nm2WP07FKZnxNvO8mzrIjjLv3RQZKaOq5jP58ER1Dy1StG4gAdKZ3+7aVxgnKTpGKSsyMBgCdkv4yLS82k4624xa+ihks1JqCS6vo2gxdq2TzbYbEkMUb9uONlLyUB2RTKcbbuRpiu2Uo9Fl7djDt5XoGyuwdzUTb+lSK2nKdsPWfraS62nAXg8n\/+y7ntjdTevX5WBpie8SQO1dBz0b5PtkMyQYZ1JE8BD2bIbIWOtdA7IBM3w+dksXUvy3mrJhmzG0PY6hsBsvH\/tyM3N8YtDPS\/Qkg86nQpOTuvSWjcUKwcjwJQHn6XKouAAvYu+h83GbKkgPMfu91ii+vJFoDDW\/Jw001gh0DpXs9obwkR69t8X7RXdD6DnS+J7nuyps\/wewPNnPaak1g\/GQGgxkqouqbc2lfA2YY0EgYWAwAOz5fQibw5BUx8ZFXmXdAM\/m5Jym\/pprSr1ST\/8lKAlWyAqPkOagsCFXnUPrlmVTecA6T\/\/AUC9o1097sofgz1+KUqX95gI49oIJDTYH2PyZ1OXA2LqI84gV8hTBrq8YJ0V3rWHPyLHJn9fGCgBmAhpVwQbQVI1hAJojXrKN91Rt0r\/0XHcuWkTosk+7RoAEPIsQ04FMihNzzRpE760LyzjyP3HOvwg3eCSlUNgQngo73xtkta2DW638g\/+NfYjhJtzeDYeLJLYBUErw+Msmm8\/x0vZUkNHdAF\/nfAs4Z6Jzg+4DbcBFlSlrR9EP19jjK52eotL35HFsvvJLQNOijX5RPjtODE+C0NZrhIB3pIrF7A1Y6ga+gmJ4PNmHYFtmzzkVrjTe3HCMYwG0iG15i5emXUjwdtA+wJeZO1svmcqHWnOi8phThCRL+6ST9cT9w+0AFMB94x+0VIFkLKh\/O2KZxQs+2VayeMp\/8OUfpX+OBjjUw7S\/3UPy5H3Iis\/0LVdT\/5SAF88BO9E7G7FwJ4Wo4fbXmRKbu4evY9L3FlJ7xoUPDFwAr+wrAABiuVKgVB1+eB6f4ikeh+7kwoTRkT4BNn\/8RJzqn\/rkWL3KGgAEo6aiQNwva1sDu28\/jRKb8u09S9el8yYqZ9MPgBmV3ZqwaNJl2oYfNekwFpI\/eZjBYDr4sWJGlONGZ8c4Suj6Q1KoAtobcabDv\/jdo+O1POZGpuOE36DQgm3AGY9MGR+c9XEaZ7nQd0z2dKN3\/b5+OQniWFHVtPCfIiUx4\/qWUXzmF6NbezJhOgTcH8k6FDdfcTdNz93MicvDnN7L1i1fgHwPaA+h+bHmQAvhDJvq8mDk4xn\/SVCwARb9YEWk93v5WnG2XV3Ci0rHsWSKbt+IrA20jKBG\/mQtF02HjlbdTe88VHL9otlw2URqFCWxemEXNbY\/gK5WDUOx+bHkIAljmei1QHIxQGKfYsSgGA8NOQHg2NLxQx8aFBsc7exZdTPNzDyHA9i9WsvrcL4EFZt+OFgqZ0u+HwtNh54\/\/xNbPlXO8ceAnX2C5MmhdupvkPlgzSbFhrqJjTYyCM8ETkrB3KLbsQcj8RliqFrG7u3BKZOsaTEm2fzgalIL8M6B9uWb1GMWcA5rjjdZXnmX3179Ex0EweZmxa18hsWMtdf\/soKQa8IBOHX1PpLxQOAsan6+na7TitFfWEJwym5FM42\/vZ8+PbidaDznjwVcOGFI+EtsLOTMGHFJvHWpfoKXAxbiFAVopnGJ6A9hpwADsgXeRy5sHkY3wplJMXfIkxZd+jZFOsu0gWz5eRedG8OVD6ZnIoL3fvIaZJ6ObbAtIDexvUDgPIltgzdQzKPv2+Ux65FVGGm3\/fJrdN15LdA\/4R8nvrG05cQf5DAY8IG+pk8ZYL7kmAAX0gK+oBKf4yyrQDBJLDCU0A1ItsOFT11F2yUNMXbIOVBYjjWRdDfvu\/Aa1Ty4jKx\/yZ4M2wIoCHhk+jRYjQA+m56jUTNkpaHj0NRqfVIz9xbepuukRjjWNv7+T2vvvoms7ZFfJOQZm30bFg+4X+pITATwG\/AY3UMhAa9OLU+L1h1AMDTsBnnwZR9T40g46fNmU3XAeJ\/3yNUYC6c5Wdn3rLOqf3Q5A0RzQSgwdC8EG7TAZoRSEF0gt067vPsqhex6l6PK5jL3jOXxlVQwXiYZa6v77Zpr++jydNZBdCAVzxci1DaRxymNOWyPWujI4z5YMkB3pwCnJw3tQfmeNda1OKFoI8d1w8OHXOfw\/irKrz+Lkx97iWBDZvIJ9t36B9rcasWOQMxE8ZRmc06XBjokzKJgnpRN1j79L05\/HYHqh5MsXUfntB\/CNOxW30fEeGp65l0NP3kt8H9jtiFNaALaMinKLWjd6gy4GfuZGKYQdBR2J4BRvfiFYoEwH7YCUiMA3WkYCpVqh6dkV7HtcUTwbRt\/yIOHZFxEYM5lMEatZT+eKF9n3s7uJHQR\/oczO9eaBtgdj\/M7n9gYqIVgJqW5pYFb\/1MvUPvgyAPnzAxRf8S3Cs84m1RXBX1JBcPJsDH+Qo2JZxPZ\/gDINUvU76dy4iti2tTQ+uxyrHZQffEUy3cZ7EmgTrBhus5g+DKgatA+mo4VIiaFGd0CkCyo\/fxIf+\/MunFD36M2su+GXFJUhU1MUYLnTgU15xBtG66SYMf\/MPHLmLCQ44XRCsz5O8KRpmIHsIXi9BD01a2l\/9Y+kmg7QuWwpnesgDeScJK1dsEFKm0dIJzole4VkIyQPQxLBBwTHi9fWaVAGeEcVQjJNorkT0w+pTkgdBBtIxMAEvFkQGCs5e4w+85M1maBvrpCBFsP1pQ3IZ5BIHlqqQMc\/9ACjvnwLbhHd8T47r60mfhD8pSICtHsn1soL6Q5JuaV7kIecC96wVB4ahUWkmlvwlZSSe8b5KMOkp3Yn3nAh3twiut57Dbxe7FiEZG0rVgLsDki0IUZUKF7XyJKYXNuMTJSIAqNXHHZUOtYRB1uBssV7o8CUhmWYATBywFBghgFE2FKwxnDQDhQgOBbA9cBjg\/cmYjyxD+DM7g6MrFzc5r1TFOluCFSAtjLgDU1QiCe0ovIiJYV9ojnAFgEauleIGjA9YMssX5nykiXlCSjQODCGkSIKRS8KQSNoeWkAm2PBN4DHP0wAHgbG40MQgBgBkmVM1B8gOGEa7iKGpeOZMSRt92ZcUHLi6MlBUPRiIYgiBBPQfQxDgy1hzvGNFvGOcB53e0DGa8D5g232lIhIiOIfNY5MYHf1GlrGH7oexI3TNMeOj3gtE92h\/2vI2Z842OlExiYq2jYf8RF9bNV9AawAugdd\/2NKiKKT8Yx1UsZA+IiPEBtd4b4AhDsHnWvvAm8FeItHkwlsE4ze2PsjPuLOTA7Jewh4cDCbSH+F9LvcclEZgbGnkGitx25tIGviDFR+AcmDe1C+AFknTUcnYyQaDxKomICnuIJUYy2YBoExk9G2RbqtBW9ZJb6CMuxEDB2NYChQQdCaj\/gIsdEMT4l8GrhmwBtHD3j8ENnYQOd7DcjcJ+jasBwApcR4lb0GAA0ovVw+6xWSID8LlnyNH7LGioyx\/6+9O3aJMo7jOP65S2pwSirCSIIoooaWglyLhhaX4oJSEK6OChqkanIooiWsHAStw4PgbPBwyaFF3AIhGhxyiIgoqDThNiEirs\/wGUs8ved5fvc8nxe8\/wCf3\/ez3CLMKqCoB1DUADbmD9DYBuzYj\/XpgJFv4pj1u7uO36wY+QDkJbsUye\/Gf9CcBsx0k\/H9k7zLCIvZ5dgGIFWEwawKinsAAwiD2UDsA5BRJMlMN5jUAIaQLLOhxAYgBSTDrABKegA1toJ4ma2wWuIDkCOIk5luLpQB1NkTxMPsCasHMwC5hTiY6daCGoDsRpTMdGOhDmCVTSIaZpNsNdgByBW2htYyW9NtIegBSCfM2uCm8ojORZhFdkvhD2CazWJrzGbZdNsNQPrYMjbHbFk3hLYcgOyFWaC3k0c8umAW2c2EP4A668XGmPWyemoGIAushPWZlXQrSNUApMyG8W9mw7oRpHIA8pBNQMRsQreBVA9ArrMqiMyquglkYgAywCrIOqvoFpCpAUiRjSGrbEw3gEwOQG6ye8gau6e3R6YHIPdZCVlhJb05eQCCMjuBtLMTrAwRD0DesW6klXXrjeEB\/N93lmMfkRb2keX0tvAANuYQm0G7sxm9pXgAzbjABtGubFBvCA9g815oqD\/RLuwny+vt4AFsXYPtYeMInY3rrRogD6C1brB9CJXt0xuJBxCFbyzHRhEKG2U5vQ08gHgMsR72CUmxT3qDIYgHEK+v7CArIG5WYAf1BvAAklVjOTaCqNmIvnUN4gGE446GUEGrWUWHfwfiAYSryDrZFLbKpvQti0ihDqTXGutXz9lVNMPKrISUyyMbSizHbrM6\/sfq+ka5dB2\/ByB4zLrYGTYHMczpm3TpG4kHkFbz7Czbzq6xZWTPsv727foW88igDmTbb\/ZM7WB3WT87jHT6wKrsEfsF0wAMOogHilBk59k5tLfXbIZNogkegE0qwnF2mhXYKYRtgU2zebaIFvAAbFE9BdFOdpT1sZPsGNuDeK2w9+wte8WWWB0x8ACszt4oEQ5C4zigetheDWQXNmZVB\/6DfWGf1ZIOvkUs12g0kBlm\/hnUzAMw8wDM\/gIP947VXoV98wAAAABJRU5ErkJggg=="
	};

	// 返回公共方法
	return this;
}).call({}); // End Object

/**
 *
 * @param {String} val
 * @returns {Boolean}
 */
function parseBool(val) {
	if (typeof val === 'string') {
		switch ($.trim(val).toLocaleLowerCase()) {
			case '':
			case '0':
			case 'false':
			case 'off':
				return false;
			default:
				return true;
		}
	}
	return val;
}

/**
 *
 * @param {Number} val
 * @returns {String}
 */
function time2ShortStr(val) {
	var date = null;
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
	var thisYear = new Date(now.getFullYear(), 0, 1);
	if (typeof (val) === "number") {
		date = new Date(val * 1000);
	} else if (typeof (val) === "string") {
		date = new Date(val);
	} else if (val instanceof Date) {
		date = val;
	} else {
		return "";
	}
	var spanMinutes = Math.floor((now.getTime() - date.getTime()) / 60 / 1000);
	var spanHours = Math.floor(spanMinutes / 60);
	var padMonth = ("0" + (date.getMonth() + 1)).slice(-2);
	var padDate = ("0" + date.getDate()).slice(-2);
	var padHours = ("0" + date.getHours()).slice(-2);
	var padMinutes = ("0" + date.getMinutes()).slice(-2);
	if (spanMinutes < 60) {
		return spanMinutes.toString() + "分钟前";
	} else if (date.getTime() >= today.getTime()) {
		return spanHours.toString() + "小时前";
	} else if (date.getTime() >= yesterday.getTime()) {
		return "昨天";
//		return "昨天" + padHours + ":" + padMinutes;
	} else if (date.getTime() >= thisYear.getTime()) {
		return (date.getMonth() + 1).toString() + "月" + date.getDate().toString() + "日";
	}
	return date.getFullYear().toString() + "/" + padMonth + "/" + padDate;
}

/**
 *
 * @param {Number} val
 * @returns {String}
 */
function time2Str(val) {
	var date = null;
	if (typeof (val) === "number") {
		date = new Date(val * 1000);
	} else if (typeof (val) === "string") {
		date = new Date(val);
	} else if (val instanceof Date) {
		date = val;
	} else {
		return "";
	}
	var padMonth = ("0" + (date.getMonth() + 1)).slice(-2);
	var padDate = ("0" + date.getDate()).slice(-2);
	var padHours = ("0" + date.getHours()).slice(-2);
	var padMinutes = ("0" + date.getMinutes()).slice(-2);
	var padSeconds = ("0" + date.getSeconds()).slice(-2);
	return date.getFullYear().toString()
			+ "-" + padMonth
			+ "-" + padDate
			+ " " + padHours
			+ ":" + padMinutes
			+ ":" + padSeconds;
}

/**
 * 格式转换
 * @param {String} val
 * @returns {String}
 */
function text2html(val) {
	var paragraphs = val.split(/\n{2,}/);
	var html = "";
	for (var i in paragraphs) {
		var p = $("<div></div>").text(paragraphs[i]).html();
		html += "<p>" + p.replace(/\n/g, "<br/>") + "</p>";
	}
	return html;
}

/**
 * 格式转换
 * @param {String} val
 * @returns {String}
 */
function html2text(val) {
	var formated = val.replace(/\n+/, "")
			.replace(/<p(\s+.*)?>/ig, "")
			.replace(/<\/p>/ig, "\n\n")
			.replace(/<br\/?>/ig, "\n");
	var text = $("<div></div>").html(formated).text();
	return $.trim(text);
}

/**
 * 虚拟回调
 * @param {String} resultJSON
 * @returns {undefined}
 */
ICC_CALLBACK = function (resultJSON) {
	console.info(resultJSON);
//	alert(resultJSON);
	var data = JSON.parse(resultJSON);
	if (data.sdk_result !== 0) {
		return;
	}
	// 调整界面
	setTimeout(function () {
		ICCGAME_PASSPORT.session.acctIsPlaying
				? ICCGAME_PASSPORT.center(ICC_CALLBACK) // ICCGAME_PASSPORT.center(ICC_CALLBACK)
				: ICCGAME_PASSPORT.login(ICC_CALLBACK);
	}, 99);
};



window.touchClick = (function () {

	/**
	 *
	 * @returns {TouchClick}
	 */
	function TouchClick() {

		/**
		 * 触摸点列表
		 * @type Array
		 */
		var touches = new Array();

		/**
		 * 单击对象
		 * @param {Object} opt
		 * @returns {undefined}
		 */
		function Point(opt) {

			/**
			 * 唯一标识
			 */
			this.identifier = opt.identifier;

			/**
			 * 页面横向位置
			 */
			this.pageX = opt.pageX;

			/**
			 * 页面纵向位置
			 */
			this.pageY = opt.pageY;

			/**
			 * 时间戳记
			 */
			this.timeStamp = opt.timeStamp;

			/**
			 *
			 * @param {number|TouchClick.Point} val
			 * @returns {undefined}
			 */
			this.equal = function (val) {
				if (typeof (val) === "number") {
					return this.identifier === val;
				}
				if (val instanceof Point) {
					return this.identifier === val.identifier;
				}
				return false;
			};

			// end subClass
		}

		/**
		 *
		 * @param {number|Point} val
		 * @returns {undefined|Point}
		 */
		this.get = function (val) {
			if (typeof (val) !== "number") {
				return undefined;
			}
			for (var i in touches) {
				if (touches[i].equal(val)) {
					return touches[i];
				}
			}
			return undefined;
		};

		/**
		 *
		 * @param {Event} evnt
		 * @returns {Boolean}
		 */
		this.isClick = function (evnt) {
			// 判断是否有效
			for (var i = 0; i < evnt.changedTouches.length; i++) {
				var lP = evnt.changedTouches[i];
				var rP = this.get(lP.identifier);
				if (rP instanceof Point !== true) {
					return false;
				}
				if (rP.pageX !== lP.pageX
						|| rP.pageY !== lP.pageY) {
					return false;
				}
				if (evnt.timeStamp - rP.timeStamp > 300) {
					return false;
				}
			}
			return true;
		};

		/**
		 *
		 * @param {jQuery.Event} evnt
		 * @returns {undefined}
		 */
		this.stopPropagation = function (evnt) {
			// 调整指针
			evnt = (evnt instanceof jQuery.Event) ? evnt.originalEvent : evnt;
			// 判断类型
			if (evnt.type !== "touchend" && evnt.type !== "click") {
				return false;
			}
			// 针对触摸事件验证
			if ("TouchEvent" in window && evnt instanceof TouchEvent && this.isClick(evnt) !== true) {
				return false;
			}
			// 终止传递
			evnt.preventDefault();
			evnt.stopImmediatePropagation();
			evnt.stopPropagation();
			return true;
		};

		/**
		 *
		 * @param {Point} point
		 * @returns {Boolean}
		 */
		function add(point) {
			if (point instanceof Point !== true) {
				return false;
			}
			for (var i in touches) {
				if (touches[i].equal(point)) {
					touches[i] = point;
					return true;
				}
			}
			touches.push(point);
			return true;
		}

		/**
		 *
		 * @returns {undefined}
		 */
		function clear() {
			touches = new Array();
		}

		// 侦听触摸开始事件
		$(document).on("touchstart", function (evnt) {
//			(evnt.originalEvent.targetTouches.length === 1) && clear();
			for (var i = 0; i < evnt.originalEvent.changedTouches.length; i++) {
				var touch = evnt.originalEvent.changedTouches[i];
				add(new Point({
					identifier: touch.identifier,
					pageX: touch.pageX,
					pageY: touch.pageY,
					timeStamp: evnt.timeStamp
				}));
			}
		});

		// 侦听触摸结束事件
		$(document).on("touchend", function (evnt) {
			(evnt.originalEvent.targetTouches.length < 1) && clear();
		});

		// end class
	}

	// 返回对象
	return new TouchClick();

})();