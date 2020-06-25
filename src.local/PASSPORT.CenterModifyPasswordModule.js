/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterModifyPasswordModule}
 */
PASSPORT.CenterModifyPasswordModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(document.body, "ICC_PasswordChanged", this.eventHanders.ICC_PasswordChanged);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterModifyPasswordModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterModifyPasswordModule.prototype.isValid = function () {
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
PASSPORT.CenterModifyPasswordModule.prototype.refresh = function () {
	// 清理内容
	this.element.find("input[type=password]").val("");
};

/**
 * 检查密码
 * @param {String} acct_password
 * @returns {Boolean}
 */
PASSPORT.CenterModifyPasswordModule.prototype.checkPassword = function (acct_password) {
	if (acct_password.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "旧密码错误",
				parameter: "acct_password",
				filter: "validate"
			}]);
		return false;
	}
	return true;
};

/**
 * 检查新密码
 * @param {String} acct_password
 * @param {String} acct_password2
 * @returns {Boolean}
 */
PASSPORT.CenterModifyPasswordModule.prototype.checkNewPassword = function (acct_password, acct_password2) {
	if (acct_password.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "新密码不符合规则, 必须6位以上",
				parameter: "acct_new_password",
				filter: "validate"
			}]);
		return false;
	}
	if (!(/^[0-9A-Z0-9`\-\=\[\]\;\"\\\,\.\/\~\!\@\#\$\%\^\&\*\(\)\_\+\{\}\:\"\|\<\>\? ]+$/i).test(acct_password)) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "新密码不符合规则, 必须使用键盘字符",
				parameter: "acct_new_password",
				filter: "validate"
			}]);
		return false;
	}
	if (acct_password2.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "确认密码不符合规则, 必须6位以上",
				parameter: "acct_new_password2",
				filter: "validate"
			}]);
		return false;
	}
	if (acct_password !== acct_password2) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "两次输入的密码不一致",
				parameter: "acct_new_password",
				filter: "equal"
			}]);
		return false;
	}
	return true;
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.CenterModifyPasswordModule.prototype.eventHanders = {
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
		var acct_password = $(event.target).find("input[name=acct_password]").val();
		var acct_new_password = $(event.target).find("input[name=acct_new_password]").val();
		var acct_new_password2 = $(event.target).find("input[name=acct_new_password2]").val();
		// 验证账号 & 验证密码
		if (this.checkPassword(acct_password)
				&& this.checkNewPassword(acct_new_password, acct_new_password2)
				) {
			// 修改账号
			this.session.modifyPassword(acct_password, acct_new_password);
		}
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
	ICC_PasswordChanged: function () {
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
		// 界面切换
		this.cancel();
	}
	// End eventHanders
};