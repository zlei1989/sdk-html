/* global ICCGAME_API, ICCGAME_STORAGE, ICCGAME_PASSPORT, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.LoginModule}
 */
PASSPORT.LoginModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 显示界面
	this.showUI = false;
	// 是否需要实名认证
	this.needRealname = false;
	// 是否需要帐号转正
	this.needRegister = false;
	// 登录次数
	this.times = 0;
	// 捆绑事件
	this.on(this.element.find(".button.register"), "touchend click", this.eventHanders.register);
	this.on(this.element.find(".button.trial"), "touchend click", this.eventHanders.trial);
	this.on(this.element.find(".button.forget-password"), "touchend click", this.eventHanders.forget_password);
	this.on(this.element.find("form"), "submit", this.eventHanders.submit);
	this.on(this.element.find("input"), "change", this.eventHanders.change);
	this.on(this.element.find("input[type=password]"), "keyup", this.eventHanders.keyup);
	this.on(window, "ICC_ScrollToFocus", this.eventHanders.ICC_ScrollToFocus);
	this.on(document.body, "ICC_Login", this.eventHanders.ICC_Login);
	this.on(document.body, "ICC_NeedRealname", this.eventHanders.ICC_NeedRealname);
	this.on(document.body, "ICC_NeedRegister", this.eventHanders.ICC_NeedRegister);
	this.on(document.body, "ICC_Exception", this.eventHanders.ICC_Exception);
	this.on(document.body, "ICC_CAPTCHASuccess", this.eventHanders.ICC_CAPTCHASuccess);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.LoginModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 结束运行
 * @returns {undefined}
 */
PASSPORT.LoginModule.prototype.enter = function () {
	console.log(this.objName + " enter");
	// 切换弹窗
	if ((this.times++) < 1) {
		ICCGAME_PASSPORT.push(0, this);
		return this;
	}
	// 检测状态
	var code = this.isValid();
	if (code !== 0) {
		this.session.acctIsPlaying = false;
//		this.triggerHandler(code);
//		return this.leave();
	}
	// 刷新显示
	this.refresh();
	// 显示界面
	this.element.addClass("active").css("zIndex", $.now());
	if (this.session.acctLoginPersisted()) {
		ICCGAME_API.alert("正在登录...");
		this.element.addClass('persisted');
		this.showUI = false;
	} else {
		ICCGAME_API.createActivity();
		this.showUI = true;
		this.autoInputFocus();
	}
	return this;
};

/**
 * 结束运行
 * @returns {PASSPORT.LoginModule.prototype}
 */
PASSPORT.LoginModule.prototype.leave = function () {
	console.log(this.objName + " leave");
	this.element.removeClass("active").css("zIndex", "");
	if (this.showUI) {
		ICCGAME_API.finishActivity();
	}
	this.element.removeClass('persisted');
	this.showUI = false;
	return this;
};

/**
 * 检测状态
 * @returns {Number}
 */
PASSPORT.LoginModule.prototype.isValid = function () {
	console.log("login check status");
	// 已经登录
	if (this.session.acctIsPlaying) {
		return -3105;
	}
	return 0;
};
/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.LoginModule.prototype.refresh = function () {
	console.log("login refresh UI");
	// 隐藏/显示试玩按钮
	if (this.session.acctLoginTimes() > 0) {
		this.element.addClass("acct_played");
	} else {
		this.element.removeClass("acct_played");
	}
	// 模式切换
	if (this.session.acctIsPersisted()) {
		this.element.removeClass("acct_temped").addClass("acct_persisted");
	} else {
		this.element.addClass("acct_temped").removeClass("acct_persisted");
	}
	// 初始显示
	this.acctName(this.session.acctName());
	this.acctPassword(this.session.acctPassword());
	// 更新密钥
	$(document.body).trigger("ICC_Expire");
	// 初始数据
	this.session.sessionLoginName = this.session.acctName();
	this.session.sessionLoginPassword = this.session.acctPassword();
};

/**
 * 获得或设置账号名称
 * @param {String} value
 * @returns {undefined|String}
 */
PASSPORT.LoginModule.prototype.acctName = function (value) {
	if (value) {
		this.element.find("input[name=acct_name]").val(value);
		return;
	}
	return this.element.find("input[name=acct_name]").val();
};

/**
 * 获得或设置账号密码
 * @param {String} value
 * @returns {undefined|String}
 */
PASSPORT.LoginModule.prototype.acctPassword = function (value) {
	// 缩短指针
	var tag = this.element.find("input[name=acct_password]");
	if (value) {
		tag.val(value).attr("local", "true");
		return;
	}
	if (tag.attr("local")) {
		return tag.val();
	}
	return $.md5(tag.val());
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.LoginModule.prototype.eventHanders = {
	/**
	 * 当点击登录按钮
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	submit: function (event) {
		// 中断系统事件
		event.preventDefault();
		event.stopImmediatePropagation();
		event.preventDefault();
		// 验证属性
		if (this.checkValidity(event.target) > 0) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 获得数据
		this.session["sessionLoginName"] = this.acctName();
		this.session["sessionLoginPassword"] = this.acctPassword();
		// 自动注册
		this.session.login();
	},
	/**
	 * 自动清空
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	change: function (event) {
		$(event.currentTarget).removeAttr("local");
	},
	/**
	 * 自动清空密码
	 * @param {type} event
	 * @returns {undefined}
	 */
	keyup: function (event) {
		var $elm = $(event.currentTarget);
		if (event.keyCode === 8
				&& $elm.val().length === 31) {
			$elm.val("");
		}
	},
	/**
	 *
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_ScrollToFocus: function (event) {
		$element = this.element.find(".content :input:focus");
		if ($element.length !== 1) {
			return;
		}
		$box = $element.closest(".content");
		var num = $box.height();
		if (window.screen.height <= num) {
			this.element.addClass("absolute");
		} else {
			this.element.removeClass("absolute");
		}
		var eleTop = $element.position().top;
		var eleHeight = $element.outerHeight();
		$(this.element).animate({scrollTop: eleTop + (eleHeight * .5) - (window.screen.height * .382)}, {duration: 200});
	},
	/**
	 * 单击注册按钮触发此函数
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	register: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换注册界面
		ICCGAME_PASSPORT.register(this);
	},
	/**
	 * 单击试玩按钮发此函数
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	trial: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 继续试玩
		if (this.session.acctLoginTimes() > 0) {
			this.session.login();
			return;
		}
		// 创建账号
		var acct_name = this.session.getGuestAcctName();
		var acct_password = $.md5(acct_name);
		// 保存数据
		this.session.sessionLoginName = acct_name;
		this.session.sessionLoginPassword = acct_password;
		// 试玩开始时间（数据不够安全，临时方案）
		this.session.acctFirstPlayed($.now());
		// 自动注册
		this.session.createAccount();
	},
	/**
	 * 单击忘记密码按钮触发此函数
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	forget_password: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换忘记密码界面
		ICCGAME_PASSPORT.forget_password(this);
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
	 *
	 * @param {jQuery.Event} event
	 * @param {Boolean} bool
	 * @returns {undefined}
	 */
	ICC_NeedRegister: function (event, bool) {
//		this.needRegister = bool;
		// 临时方案（方便测试）
		if (this.session.acctIsTrialPeriod) {
			var key = "acct_first_played_time";
			var ts = ICCGAME_STORAGE.getItem(key);
			if (!ts) {
				ts = (new Date()).getTime();
				ICCGAME_STORAGE.setItem(key, parseInt(ts));
			}
			this.needRegister = $.now() - ts > 86400000 * 15;
		} else {
			this.needRegister = false;
		}
	},
	/**
	 * 登录完成
	 * @param {jQuery.Event} event
	 * @param {String} token
	 * @returns {undefined}
	 */
	ICC_Login: function (event, token) {
		console.log("login success.");
		var lHandler = this.handler;
		var pHandler = function () {
			// 返回成功
			var site_id = ICCGAME_API.getFromSiteId();
			var site_name = "ICCGAME";
			// 针对《破天一剑》定制代码 开始
			if (ICCGAME_API.getGameId() === 3064) {
				if (site_id > 100 || site_id === 2) {
					site_name += "(3)";
				} else {
					site_name += "(" + site_id + ")";
				}
			}
			// 针对《破天一剑》定制代码 结束
			lHandler(JSON.stringify({
				sdk_result: 0,
				sdk_message: "登录成功",
				sdk_token: token,
				sdk_from_ad_id: ICCGAME_API.getFromAdId(),
				sdk_from_site_id: ICCGAME_API.getFromSiteId(),
				sdk_from_site_name: site_name,
				sdk_from_site_name_origin: "ICCGAME(" + ICCGAME_API.getFromSiteId() + ")"
			}));
			// 开启浮标
			ICCGAME_API.enableAssistiveTouch();
			// 显示浮标
			ICCGAME_API.openedActivities() > 0 || ICCGAME_API.setAssistiveTouchState(true);
		};
		// 清理回调（此段代码顺序很关键，不能调整）
		this.setHandler(null);
		// 调用接口
		var pHandler2 = function () { // 弹出公告
			ICCGAME_PASSPORT.push(1, pHandler);
		};
		// 弹出完善信息
		var that = this;
		setTimeout(function () {
			if (that.needRealname) { // 实名认证
				ICCGAME_PASSPORT.center_set_id(pHandler2);
			} else if (that.needRegister) { // 试玩转正
				ICCGAME_PASSPORT.register(pHandler2);
			} else {
				pHandler2();
			}
		}, 88);
		// 延迟隐藏
//		var that = this;
		setTimeout(function () {
			that.leave();
		}, 99);
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
	 * 异常处理
	 * @param {jQuery.Event} event
	 * @param {Object} exception
	 * @returns {undefined}
	 */
	ICC_Exception: function (event, exception) {
		console.error("login exception.");
		switch (parseInt(exception.code)) {
			case - 2002: // 试玩：账号不存在
			case - 2004: // 试玩：密码错误
				if (this.session.acctIsPersisted()) {// 正式账号 重新登录
					break;
				}
				// 临时账号 清空重置
				ICCGAME_STORAGE.clear();
				this.triggerHandler(-3102).leave();
				break;
		}
		if (this.showUI === false) {
			this.element.removeClass('persisted');
			ICCGAME_API.createActivity();
			this.showUI = true;
		}
	}
	// End eventHanders
};