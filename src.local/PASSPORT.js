/* global ICCGAME_API */

/**
 * SDK 注册对象
 *
 * @returns {PASSPORT}
 */
PASSPORT = function () {
	console.log("PASSPORT initialization");
	// 会话对象
	this.session = new PASSPORT.Session();
	// 功能模块
	this.modules = new Object();
	// 自动焦点滚动
	$(document.body).on("focus", ".content :input", function () {
		$(document.body).trigger("ICC_ScrollToFocus");
	});
	$(window).on("resize", function () {
		$(document.body).trigger("ICC_ScrollToFocus");
	});
	$(document.body).on("ICC_ScrollToFocus", function () {
		$element = $(".content :input:focus");
		if ($element.length !== 1) {
			return;
		}
		$box = $element.closest(".content");
		var point = $element.position();
		var top = Math.floor($box.innerHeight() * 0.382);
		$($box).animate({scrollTop: $box.scrollTop() - (top - point.top)}, {duration: 200});
	});
};

/**
 * 初始应用
 *
 * @returns {undefined}
 */
PASSPORT.prototype.init = function () {
	// 捆绑属性
	console.log("PASSPORT set attributes");
	$(document.body).attr("version", ICCGAME_API.getVersion())// 标记 SDK版本
			.attr("game_id", ICCGAME_API.getGameId())// 标记 游戏标识
			.attr("ad_id", ICCGAME_API.getFromAdId())// 标记 广告编号
			.attr("site_id", ICCGAME_API.getFromSiteId());// 标记 站点编号
	// 捆绑样式
	$(document.body).addClass(ICCGAME_API.getSystem());
	// 监听键盘操作
	console.log("PASSPORT listen keydown event");
	var that = this;
	var fn = function () {
		return that.keyEventHandler.apply(that, arguments);
	};
	$(window).on("keydown", fn).on("keystart", fn);
	// 异步处理
	setTimeout(function () {
		$(document.body).trigger("ICC_Ready");
	}, 99);
};

/**
 * 清理舞台
 *
 * @param {number} code
 * @returns {PASSPORT.prototype}
 */
PASSPORT.prototype.clearStage = function (code) {
	for (var name in this.modules) {
		if (this.modules[name].isActive() === false) {
			continue;
		}
		console.warn("module " + name + " is active");
		this.modules[name].triggerHandler(code).leave();
	}
	return this;
};

/**
 * 添加模块
 *
 * @param {String} name
 * @param {PASSPORT.ModuleAbstract} module
 * @returns {PASSPORT.prototype}
 */
PASSPORT.prototype.addModule = function (name, module) {
	if (name in this.modules) {
		console.error("module " + name + " exists.");
		return this;
	}
	if (module instanceof PASSPORT.ModuleAbstract === false) {
		console.error("module " + name + " type error.");
		return this;
	}
	this.modules[name] = module;
	this.modules[name].objName = name;
	this.modules[name].session = this.session;
	console.log("add " + name + " module");
	return this;
};

/**
 * 获得模块
 *
 * @param {String} name
 * @returns {PASSPORT.prototype}
 */
PASSPORT.prototype.getModule = function (name) {
	if (name in this.modules) {
		return this.modules[name];
	}
	return null;
};

/**
 * 按键处理
 *
 * @param {KeyEvent} event
 * @returns {undefined}
 */
PASSPORT.prototype.keyEventHandler = function (event) {
	console.log("PASSPORT receive key code " + event.keyCode);
	if ($(document.body).is(".lock")) {
		return;
	}
	switch (event.keyCode) {
		case 4:
		case 8:
			if ($(event.target).is(':input')) {
				break;
			}
		case 27:
			for (var name in this.modules) {
				if (this.modules[name].isActive() === false) {
					continue;
				}
				this.modules[name].cancel();
				break;
			}
			event.preventDefault();
			break;
	}
};

/**
 * 游戏登录
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.login = function (callback) {
	console.log("call PASSPORT.login(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.login.setHandler(callback).enter();
};

/**
 * 弹窗
 *
 * @param {String} occasion
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.push = function (occasion, callback) {
	console.log("call PASSPORT.push(Function, PASSPORT.ModuleAbstract)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 设置时机
	this.modules.push["occasion"] = occasion;
	// 调整参数
	this.modules.push.setHandler(callback).enter();
};

/**
 * 账号注册/试玩转正
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.register = function (callback) {
	console.log("call PASSPORT.register(Function, PASSPORT.ModuleAbstract)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.register.setHandler(callback).enter();
};

/**
 * 找回密码
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.forget_password = function (callback) {
	console.log("call PASSPORT.forget_password(Function, PASSPORT.ModuleAbstract)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.forget_password.setHandler(callback).enter();
};

/**
 * 支付
 *
 * @param {String} tradeInfo
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.pay = function (tradeInfo, callback) {
	console.log("call PASSPORT.pay(" + tradeInfo + ", Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 传入参数
	this.modules.pay["request"] = tradeInfo;
	this.modules.pay["context"] = null;
	// 重置参数，实名验证返回判断
	this.modules.pay["skips"] = 0;
	// 调整参数
	this.modules.pay.setHandler(callback).enter();
};

// 临时兼容
PASSPORT.prototype.transaction = PASSPORT.prototype.pay;

/**
 * 账号中心
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center = function (callback) {
	console.log("call PASSPORT.center(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center.setHandler(callback).enter();
};

/**
 * 活动
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_events = function (callback) {
	console.log("call PASSPORT.center_events(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_events.setHandler(callback).enter();
};

/**
 * 消息
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_messages = function (callback) {
	console.log("call PASSPORT.center_messages(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_messages.setHandler(callback).enter();
};

/**
 * 修改账号信息
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_modify_passport = function (callback) {
	console.log("call PASSPORT.center_modify_passport(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_modify_passport.setHandler(callback).enter();
};

/**
 * 修改密码
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_modify_password = function (callback) {
	console.log("call PASSPORT.center_modify_password(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_modify_password.setHandler(callback).enter();
};

/**
 * 修改邮箱
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_modify_email = function (callback) {
	console.log("call PASSPORT.center_modify_email(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_modify_email.setHandler(callback).enter();
};

/**
 * 修改电话
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_modify_phone = function (callback) {
	console.log("call PASSPORT.center_modify_phone(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_modify_phone.setHandler(callback).enter();
};

/**
 * 支付日志
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_pays = function (callback) {
	console.log("call PASSPORT.center_pays(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_pays.setHandler(callback).enter();
};

/**
 * 实名认证
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_set_id = function (callback) {
	console.log("call PASSPORT.center_set_id(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_set_id.setHandler(callback).enter();
};

/**
 * 选项
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.center_settings = function (callback) {
	console.log("call PASSPORT.center_settings(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.center_settings.setHandler(callback).enter();
};

/**
 * 关于SDK
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.about = function (callback) {
	console.log("call PASSPORT.about(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.about.setHandler(callback).enter();
};

/**
 * 切换账号
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.login_switch = function (callback) {
	console.log("call PASSPORT.login_switch(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 返回结果
	setTimeout(function () {
		callback(JSON.stringify({"sdk_result": -3109, "sdk_message": "暂不支持"}));
	}, 99);
	// 调整参数
//	this.modules.login_switch.setHandler(callback).enter();
};

/**
 * 登出游戏
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.logout = function (callback) {
	console.log("call PASSPORT.logout(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.logout.setHandler(callback).enter();
};

/**
 * 退出游戏
 *
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.exit = function (callback) {
	console.log("call PASSPORT.exit(Function)");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 调整参数
	this.modules.exit.setHandler(callback).enter();
};

/**
 * 浏览器
 *
 * @param {String} url
 * @param {String} title
 * @param {Function} callback
 * @returns {undefined}
 */
PASSPORT.prototype.browser = function (url, title, callback) {
	// 格式转换
	if (typeof (title) === "function" && callback === undefined) {
		callback = title;
		title = "";
	}
	console.log("call PASSPORT.browser(" + url + ", " + title + ")");
	// 清理舞台
	if (typeof (callback) === "function") {
		this.clearStage(-3101);
	}
	// 请求地址
	this.modules.browser["url"] = url;
	this.modules.browser["title"] = title;
	// 调整参数
	this.modules.browser.setHandler(callback).enter();
};