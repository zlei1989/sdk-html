/* global ICCGAME_API, ICCGAME_STORAGE, ICCGAME_PASSPORT, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.ForgetPasswordModule}
 */
PASSPORT.ExitModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".button.cancel, a[href=\"#submit\"]"), "touchend click", this.eventHanders.submit);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.ExitModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.ExitModule.prototype.eventHanders = {
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
		// 立即退出
		this.triggerHandler({sdk_result: 0, sdk_message: "确认退出"}).leave();
	}
	// End eventHanders
};