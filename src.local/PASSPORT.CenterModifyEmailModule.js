/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterModifyEmailModule}
 */
PASSPORT.CenterModifyEmailModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(document.body, "ICC_EmailChanged", this.eventHanders.ICC_EmailChanged);
	this.on(document.body, "ICC_VerifyOwnerSuccess", this.eventHanders.ICC_VerifyOwnerSuccess);
};
/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterModifyEmailModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterModifyEmailModule.prototype.isValid = function () {
	console.log("center modify email check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.CenterModifyEmailModule.prototype.refresh = function () {
	// 清理内容
	this.element.find(":input[name]").val("");
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.CenterModifyEmailModule.prototype.eventHanders = {
	/**
	 * 验证身份成功后再次提交
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerSuccess: function (event) {
		this.element.find("form").submit();
	},
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
		var acct_email = $(event.target).find("input[name=acct_email]").val();
		// 修改账号
		this.session.modifyEmail(acct_email);
	},
	/**
	 * 密码修改成功
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_EmailChanged: function (event) {
		// 浮出提示
		ICCGAME_API.alert("修改成功");
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
		// 切换界面
		this.cancel();
	}
	// End eventHanders
};