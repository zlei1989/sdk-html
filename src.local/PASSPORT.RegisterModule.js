/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.RegisterModule}
 */
PASSPORT.RegisterModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 是否需要实名认证
	this.needRealname = false;
	// 捆绑事件
	this.on(this.element.find("input[name=acct_name]"), "keyup", this.eventHanders.keyup);
	this.on(this.element.find("input[type=\"button\"], a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(document.body, "ICC_CAPTCHASuccess", this.eventHanders.ICC_CAPTCHASuccess);
	this.on(document.body, "ICC_NeedRealname", this.eventHanders.ICC_NeedRealname);
	this.on(document.body, "ICC_Login", this.eventHanders.ICC_Login);
	this.on(document.body, "ICC_VerifyOwnerSuccess", this.eventHanders.ICC_VerifyOwnerSuccess);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.RegisterModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检测状态
 * @returns {Number}
 */
PASSPORT.RegisterModule.prototype.isValid = function () {
	console.log("register check status");
	// 状态验证
	if (this.session.acctIsPlaying && this.session.acctIsPersisted()) {
		return -3103;
	}
	if (this.session.acctIsPlaying) {
		this.element.addClass('playing');
	} else {
		this.element.removeClass('playing');
	}
	return 0;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.RegisterModule.prototype.refresh = function () {
	// 清理内容
	this.element.find("input[type=text],input[type=number],input[type=password]").val("");
	this.element.find("h1").text(this.session.acctIsPersisted() ? "快速注册" : "试玩转为正式账号");
};

/**
 * 检查账号
 * @param {String} acct_name
 * @returns {Boolean}
 */
PASSPORT.RegisterModule.prototype.checkName = function (acct_name) {
	if (acct_name.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "通行证不符合规则, 必须是电子邮箱或手机号码",
				parameter: "acct_name",
				filter: "validate"
			}]);
		return false;
	}
	return true;
};

/**
 * 检查密码
 * @param {String} acct_password
 * @param {String} acct_password2
 * @returns {Boolean}
 */
PASSPORT.RegisterModule.prototype.checkPassword = function (acct_password, acct_password2) {
	if (acct_password.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "密码不符合规则, 必须6位以上",
				parameter: "acct_password",
				filter: "validate"
			}]);
		return false;
	}
	if (!(/^[0-9A-Z0-9`\-\=\[\]\;\"\\\,\.\/\~\!\@\#\$\%\^\&\*\(\)\_\+\{\}\:\"\|\<\>\? ]+$/i).test(acct_password)) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "密码不符合规则, 必须使用键盘字符",
				parameter: "acct_password",
				filter: "validate"
			}]);
		return false;
	}
	if (acct_password2.length < 6) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "确认密码不符合规则, 必须6位以上",
				parameter: "acct_password2",
				filter: "validate"
			}]);
		return false;
	}
	if (acct_password !== acct_password2) {
		$(document.body).trigger("ICC_Exception", [{
				type: "ZLeiPlus\\Database\\Procedure\\Exception\\ValidationException",
				code: 0,
				message: "两次输入的密码不一致",
				parameter: "acct_password",
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
PASSPORT.RegisterModule.prototype.eventHanders = {
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
		var acct_name = $(event.target).find("input[name=acct_name]").val();
		var acct_password = $(event.target).find("input[name=acct_password]").val();
		var acct_password2 = $(event.target).find("input[name=acct_password2]").val();
		// 验证账号
		if (this.checkName(acct_name) === false) {
			return;
		}
		// 验证密码
		if (this.checkPassword(acct_password, acct_password2) === false) {
			return;
		}
		// 属性赋值
		this.session["sessionLoginName"] = acct_name;
		this.session["sessionLoginPassword"] = $.md5(acct_password);
		// 试玩转正
		if (this.session.acctIsPersisted() === false) {
			this.session.persisted();
			return;
		}
		// 创建账号
		this.session.createAccount();
	},
	/**
	 * 取消操作
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	cancel: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 取消操作
		this.cancel();
	},
	/**
	 *
	 * @param {jQuery.Event} event
	 * @param {Boolean} bool
	 * @returns {undefined}
	 */
	ICC_NeedRealname: function (event, bool) {
		this.needRealname = bool;
	},
	/**
	 * 登录完成
	 * @param {jQuery.Event} event
	 * @param {String} token
	 * @returns {undefined}
	 */
	ICC_Login: function (event, token) {
		var lHandler = this.handler;
		var pHandler = function () {
			lHandler(JSON.stringify({
				sdk_result: 0,
				sdk_message: "注册成功",
				sdk_token: token,
				sdk_from_ad_id: ICCGAME_API.getFromAdId(),
				sdk_from_site_id: ICCGAME_API.getFromSiteId(),
				sdk_from_site_name: "ICCGAME(" + ICCGAME_API.getFromSiteId() + ")"
			}));
			// 开启浮标
			ICCGAME_API.enableAssistiveTouch();
			// 显示浮标
			ICCGAME_API.openedActivities() > 0 || ICCGAME_API.setAssistiveTouchState(true);
		};
		// 清理回调（此段代码顺序很关键，不能调整）
		this.setHandler(null);
		// 强制进行实名制认证
		this.needRealname
				? ICCGAME_PASSPORT.center_set_id(pHandler)
				: pHandler();
		// 延迟隐藏
		var that = this;
		setTimeout(function () {
			that.leave();
		}, 99);
	},
	/**
	 * 重新提交
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerSuccess: function (event) {
		this.element.find("form:first").submit();
	},
	/**
	 * 重新提交
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_CAPTCHASuccess: function (event) {
		this.element.find("form:first").submit();
	}
	// End eventHanders
};