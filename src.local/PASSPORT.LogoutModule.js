/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {Element} element
 * @returns {PASSPORT.LogoutModule}
 */
PASSPORT.LogoutModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".button.submit, a[href=\"#submit\"]"), "touchend click", this.eventHanders.submit);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.LogoutModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 开始运行
 * @returns {PASSPORT.LogoutModule.prototype}
 */
PASSPORT.LogoutModule.prototype.enter = function () {
	// 防止报错
	if (this.session.acctIsPlaying !== true) {
		var that = this;
		setTimeout(function () {
			that.triggerHandler({sdk_result: 0, sdk_message: "请先登录"}).leave();
		}, 99);
		return this;
	}
	return PASSPORT.ModuleAbstract.prototype.enter.call(this);
};

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.LogoutModule.prototype.isValid = function () {
	console.log("logout check status");
	if (this.session.acctIsPlaying !== true) {
		return -3107;
	}
	return 0;
};

/**
 * 清理登录数据
 * @returns {undefined}
 */
PASSPORT.LogoutModule.prototype.clearSession = function () {
	console.log("logout clear session");
	this.session.acctLoginPersisted(false);
	this.session.acctIsPlaying = false;
};


/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.LogoutModule.prototype.eventHanders = {
	/**
	 * 取消退出
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	cancel: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 关闭窗口
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();
		this.cancel();
	},
	/**
	 * 立即退出
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	submit: function (event) {
		// 关闭窗口
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
		// 震动设备
		ICCGAME_API.vibrate();
		// 清理数据
		this.clearSession();
		// 关闭浮标
		ICCGAME_API.disableAssistiveTouch();
		// 立即退出
		this.triggerHandler({sdk_result: 0, sdk_message: "注销成功"}).leave();
	}
	// End eventHanders
};