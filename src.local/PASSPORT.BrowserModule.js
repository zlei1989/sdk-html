/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.BrowserModule}
 */
PASSPORT.BrowserModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("iframe"), "load", this.eventHanders.load);
	this.on(document.body, "ICC_CallHander", this.eventHanders.ICC_CallHander);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.BrowserModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 请求地址
 * @type String
 */
PASSPORT.BrowserModule.prototype.url = "about:blank";

/**
 * 页面标题
 * @type String
 */
PASSPORT.BrowserModule.prototype.title = "Page";

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.BrowserModule.prototype.enter = function () {
	// 加载页面
	this.setUrl(this.url, this.title);
	// 显示界面
	return PASSPORT.ModuleAbstract.prototype.enter.call(this);
};
/**
 * 结束运行
 * @returns {PASSPORT.BrowserModule.prototype}
 */
PASSPORT.BrowserModule.prototype.leave = function () {
	// 清空页面
	this.url = "about:blank";
	this.title = "";
	this.setUrl(this.url, this.title);
	// 隐藏界面
	return PASSPORT.ModuleAbstract.prototype.leave.call(this);
};

/**
 *
 * @param {type} url
 * @param {type} name
 * @returns {undefined}
 */
PASSPORT.BrowserModule.prototype.setUrl = function (url, name) {
	// 清空页面
	this.element.find("iframe").attr("src", url);
	this.element.find("h1").text(name);
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.BrowserModule.prototype.eventHanders = {
	/**
	 * 事件回调
	 * 取消操作
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	cancel: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 切换界面
		this.cancel();
	},
	/**
	 * 页面载入完成
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	load: function (event) {
	},
	/**
	 *
	 * @param {jQuery.Event} event
	 * @param {Number} result
	 * @returns {PASSPORT.BrowserModule.prototype.eventHanders@call;leave}
	 */
	ICC_CallHander: function (event, result) {
		this.handler(result);
		return this.setHandler(null).leave();
	}
	// End eventHanders
};