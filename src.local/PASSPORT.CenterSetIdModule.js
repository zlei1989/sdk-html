/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.PASSPORT.CenterSetIdModule}
 */
PASSPORT.CenterSetIdModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 阻止取消
	this.preventCancel = true;
	// 捆绑事件
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(document.body, "ICC_IdentityChanged", this.eventHanders.ICC_IdentityChanged);
	this.on(document.body, "ICC_CAPTCHASuccess", this.eventHanders.ICC_CAPTCHASuccess);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterSetIdModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterSetIdModule.prototype.isValid = function () {
	console.log("center modify password check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.CenterSetIdModule.prototype.refresh = function () {
	// 清理内容
	this.element.find("input[type=acct_realname]").val("");
	this.element.find("input[type=acct_card_id]").val("");
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.CenterSetIdModule.prototype.eventHanders = {
	/**
	 * 当点击注册按钮
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	submit: function (event) {
		// 防止跳转
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
		// 验证属性
		if (this.checkValidity(event.target) > 0) {
			return;
		}
		// 获得数据
		var acct_realname = $(event.target).find("input[name=acct_realname]").val();
		var acct_card_id = $(event.target).find("input[name=acct_card_id]").val();
		// 验证信息
		this.session.setId(acct_realname, acct_card_id);
	},
	/**
	 * 重新提交
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_CAPTCHASuccess: function (event) {
		this.element.find("form:first").submit();
	},
	/**
	 * 密码修改成功
	 * @returns {undefined}
	 */
	ICC_IdentityChanged: function () {
		// 浮出提示
		ICCGAME_API.alert("认证成功");
		// 取消阻止
		this.preventCancel = false;
		// 页面返回
		this.cancel(true);
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
		// 界面切换
		this.cancel();
	}
	// End eventHanders
};