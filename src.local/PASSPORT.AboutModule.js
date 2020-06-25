/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.AboutModule}
 */
PASSPORT.AboutModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(document.body, "ICC_Success", this.eventHanders.ICC_Success);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.AboutModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.AboutModule.prototype.isValid = function () {
	console.log("about check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.AboutModule.prototype.refresh = function () {
	// 清理内容
	this.element.find("input[name=dev_hash]").val(ICCGAME_API.getDevHash());
	this.element.find("input[name=version]").val(ICCGAME_API.getVersion().toFixed(2) + "/" + ICCGAME_VersionControl.version);
	this.element.find("textarea").val("");
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.AboutModule.prototype.eventHanders = {
	/**
	 * 成功提交
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_Success: function (event) {
		// 浮出提示
		ICCGAME_API.alert("感谢您的反馈");
		// 页面返回
		this.cancel(true);
	},
	/**
	 * 当点击提交按钮
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	submit: function (event) {
		// 中断系统事件
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
		// 验证属性
		if (this.checkValidity(event.target) > 0) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 获得数据
		var criti_content = $(event.target).find(":input[name=criti_content]").val();
		// 添加评论
		this.session.createCriticism(criti_content);
	},
	/**
	 * 事件回调
	 * 取消注册/转正操作
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
	}
	// End eventHanders
};