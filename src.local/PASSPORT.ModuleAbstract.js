/* global ICCGAME_API, PASSPORT */

PASSPORT.ModuleAbstract = function () {
};

/**
 * 对象名称
 * @type String
 */
PASSPORT.ModuleAbstract.prototype.objName;
/**
 * 视图节点
 * @type jQuery
 */
PASSPORT.ModuleAbstract.prototype.element;

/**
 * 用户会话
 * @type PASSPORT.Session.prototype
 */
PASSPORT.ModuleAbstract.prototype.session;

/**
 * 回调指针
 * @type Function
 */
PASSPORT.ModuleAbstract.prototype.handler;

/**
 * 后退模块
 * @type Array
 */
PASSPORT.ModuleAbstract.prototype.backModules;

/**
 * 劝阻关闭
 * @type Boolean
 */
PASSPORT.ModuleAbstract.prototype.preventCancel = false;

/**
 * 劝阻关闭
 * @type Boolean
 */
PASSPORT.ModuleAbstract.prototype.obstructCancel = true;

/**
 * 劝阻时间
 * @type Number
 */
PASSPORT.ModuleAbstract.prototype.obstructedTime = 0;

/**
 * 结果案例
 * @type Object
 */
PASSPORT.ModuleAbstract.prototype.results = {
	"0": {"sdk_result": 0, "sdk_message": "操作成功"},
	"-3101": {"sdk_result": -3101, "sdk_message": "操作被打断"},
	"-3102": {"sdk_result": -3102, "sdk_message": "玩家取消"},
	"-3103": {"sdk_result": -3103, "sdk_message": "该账号以为正式状态"},
	"-3104": {"sdk_result": -3104, "sdk_message": "充值结果不能确定(等待系统回调)"},
	"-3105": {"sdk_result": -3105, "sdk_message": "游戏正在处于登录状态"},
	"-3106": {"sdk_result": -3106, "sdk_message": "支付订单请求不能为空"},
	"-3107": {"sdk_result": -3107, "sdk_message": "请先登录"}
};

/**
 * 回调
 * @param {Number|Object} value
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.triggerHandler = function (value) {
	console.log("module trigger handler");
	var params = null;
	if (typeof value === "number") {
		if (value in this.results === false) {
			throw "result code invalid. " + value;
		}
		value = this.results[value];
	}
	// 格式数据
	params = JSON.stringify(value);
	// 完成回调
	var fn = this.handler;
	if (typeof (fn) === "function") {
		// 延迟运行
		setTimeout(function () {
			fn.call(window, params);
		}, 99);
	}
	// 清理资源
	this.setHandler(null);
	return this;
};

/**
 * 绑定回调处理
 * @param {Function} callback
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.setHandler = function (callback) {
	if (callback instanceof PASSPORT.ModuleAbstract) {
		// 导出指针
		this.handler = callback.handler;
		// 拷贝路径
		this.backModules = callback.backModules;
		this.backModules.push(callback);
		// 清空上级
		callback.setHandler(null);
		// 注销上级
		setTimeout(function () {
			callback.leave();
		}, 99);
	} else if (typeof (callback) === "function") {
		this.handler = callback;
		this.backModules = new Array();
	} else if (callback === null) {
		this.handler = null;
		this.backModules = null;
	} else {
		console.warn("module set handler invalid");
	}
	return this;
};

/**
 * 是否运行状态
 * @returns {Boolean}
 */
PASSPORT.ModuleAbstract.prototype.isActive = function () {
	return (this.handler ? true : false);
};

/**
 * 验证进入条件
 * 虚方法
 * @returns {Number}
 */
PASSPORT.ModuleAbstract.prototype.isValid = function () {
	return 0;
};

/**
 * 刷新界面
 * 虚方法
 * @returns {undefined}
 */
PASSPORT.ModuleAbstract.prototype.refresh = function () {
	// 模式切换
	if (this.session.acctIsPersisted()) {
		this.element.removeClass("acct_temped").addClass("acct_persisted");
	} else {
		this.element.addClass("acct_temped").removeClass("acct_persisted");
	}
};

/**
 * 自动表单焦点
 * @param {String} name
 * @returns {undefined}
 */
PASSPORT.ModuleAbstract.prototype.autoInputFocus = function (name) {
	if (name) {
		name = ":input[name=" + name + "]";
	} else {
		name = ":input[autofocus]:not([readonly]):not([disabled]):first";
	}
	// 设定焦点
	var $that = this.element.find(name);
	setTimeout(function () {
		if ($that.val()) {
			return;
		}
		$that.focus();
	}, 200);
};

/**
 * 验证非法表单数量
 * @param {HTMLElement} element
 * @returns {Number}
 */
PASSPORT.ModuleAbstract.prototype.checkValidity = function (element) {
	var count = 0;
	if ($(element).is("form") === false) {
		return -1;
	}
	$(element).find(":input").each(function () {
		var $that = $(this);
		var required = $that.attr("required");
		var pattern = $that.attr("pattern");
		var inputVal = $.trim($that.val());
		if (required && inputVal === "") {
			count++ || this.focus();
			$that.trigger("invalid", [this, count]);
		} else if (pattern && (new RegExp(pattern)).test(inputVal) === false) {
			count++ || this.focus();
			$that.trigger("invalid", [this, count]);
		}
	});
	return count;
};

/**
 * 开始模块
 * 虚方法
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.enter = function () {
	console.log(this.objName + " enter");
	// 检测状态
	var code = this.isValid();
	if (code !== 0) {
		this.triggerHandler(code);
		return this.leave();
	}
	// 刷新显示
	this.refresh();
	// 显示界面
	this.element.addClass("active").css("zIndex", $.now());
	ICCGAME_API.createActivity();
	// 设定焦点
	this.autoInputFocus();
	return this;
};

/**
 * 结束模块
 * 虚方法
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.leave = function () {
	console.log(this.objName + " leave");
	this.element.removeClass("active").css("zIndex", "");
	// 等待HTML刷新结束后隐藏界面，防止打开存影
	ICCGAME_API.finishActivity();
	return this;
};

/**
 * 绑定事件处理器
 * @param {jQuery} selector
 * @param {String} eventType
 * @param {Function} handler
 * @param {Boolean} suppressDisabledCheck
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.on = function (selector, eventType, handler, suppressDisabledCheck) {
	var that = this;
	$(selector).bind(eventType, function () {
		if (suppressDisabledCheck || that.isActive()) {
			console.log("PASSPORT.Module call " + eventType + " event handler");
			return handler.apply(that, arguments);
		}
		return false;
	});
	return this;
};

/**
 * 解除事件处理器
 * @param {jQuery} selector
 * @param {String} eventType
 * @param {Function} handler
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.off = function (selector, eventType, handler) {
	$(selector).unbind(eventType, handler);
	return this;
};

/**
 * 取消操作
 * @param {Boolean} force
 * @returns {PASSPORT.ModuleAbstract.prototype}
 */
PASSPORT.ModuleAbstract.prototype.cancel = function (force) {
	console.log(this.objName + " module cancel");
	// 震动设备
	force || ICCGAME_API.vibrate();
	if (this.preventCancel) {
		return this;
	}
	// 阻拦退出
	if (this.obstructCancel === true && !force) {
		var current_timestamp = $.now();
		if (current_timestamp - this.obstructedTime > 2000) {
			this.obstructedTime = current_timestamp;
			ICCGAME_API.alert("再按一次返回键将放弃操作");
			return this;
		} else {
			this.obstructedTime = 0;
		}
	}
	if (this.backModules.length > 0) {
		var m = this.backModules.pop();
		m.handler = this.handler;
		m.backModules = this.backModules;
		m.enter();
		this.setHandler(null).leave();
	} else {
		this.triggerHandler(-3102).leave();
	}
	return this;
};


PASSPORT.ModuleAbstract.prototype.clickEventStopPropagation = function (evnt) {
	return window.touchClick.stopPropagation(evnt);
};