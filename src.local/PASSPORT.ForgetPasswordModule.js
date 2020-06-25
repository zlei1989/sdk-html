/* global ICCGAME_API, ICCGAME_VERIFY, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.ForgetPasswordModule}
 */
PASSPORT.ForgetPasswordModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find("input[name=acct_name]"), "keyup", this.eventHanders.keyup);
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(document.body, "ICC_CAPTCHASuccess", this.eventHanders.ICC_CAPTCHASuccess);
	this.on(document.body, "ICC_Login", this.eventHanders.ICC_Login);
	this.on(document.body, "ICC_VerifyOwnerSuccess", this.eventHanders.ICC_VerifyOwnerSuccess);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.ForgetPasswordModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.ForgetPasswordModule.prototype.isValid = function () {
	console.log("forget password check status");
	if (this.session.acctIsPlaying) {
		return -3105;
	}
	return 0;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.ForgetPasswordModule.prototype.refresh = function () {
	// 清理内容
	this.element.find("input[type=password], input[type=text]").val("");
	// 清理状态
	this.element.removeClass("passed");
};

/**
 * 检查新密码
 * @param {String} acct_password
 * @param {String} acct_password2
 * @returns {undefined}
 */
PASSPORT.ForgetPasswordModule.prototype.checkNewPassword = function (acct_password, acct_password2) {
	return PASSPORT.CenterModifyPasswordModule.prototype.checkNewPassword.call(this, acct_password, acct_password2);
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.ForgetPasswordModule.prototype.eventHanders = {
	/**
	 * 清理账号特殊符号
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	keyup: function (event) {
		var input = $(event.target).val();
		var value = input.replace(/[^0-9a-z_\-@\.]/ig, "");
		if (value === input) {
			return;
		}
		$(event.target).val(value);
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
		var acct_name = this.element.find("input[name=acct_name]").val();
		var acct_new_password = null, acct_new_password2 = null;
		if ($(this.element).is(".passed")) {
			acct_new_password = this.element.find("input[name=\"acct_new_password\"]").val();
			acct_new_password2 = this.element.find("input[name=\"acct_new_password2\"]").val();
			// 验证密码
			if (this.checkNewPassword(acct_new_password, acct_new_password2) === false) {
				return;
			}
		}
		// 修改账号
		this.session.forgetPassword(acct_name, acct_new_password);
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
	},
	/**
	 * 验证身份成功
	 * @param {jQuery.Event} event
	 * @param {String} sessn_context
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerSuccess: function (event, sessn_context) {
		// 通过验证
		this.element.addClass("passed");
		// 更新焦点
		this.autoInputFocus("acct_new_password");
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
	 * 登录完成
	 * @param {jQuery.Event} event
	 * @param {String} token
	 * @returns {undefined}
	 */
	ICC_Login: function (event, token) {
		PASSPORT.LoginModule.prototype.eventHanders.ICC_Login.call(this, event, token);
	}
	// End eventHanders
};