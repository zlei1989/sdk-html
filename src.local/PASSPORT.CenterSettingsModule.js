/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterSettingsModule}
 */
PASSPORT.CenterSettingsModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".button.about"), "touchend click", this.eventHanders.about);
	/** #if for debug begin */
	this.on(this.element.find(".button.logout"), "touchend click", this.eventHanders.logout);
	/** #if for debug end */
	this.on(this.element.find(".button.center_set_id"), "touchend click", this.eventHanders.center_set_id);
	this.on(this.element.find(".button.center_modify_email"), "touchend click", this.eventHanders.center_modify_email);
	this.on(this.element.find(".button.center_modify_password"), "touchend click", this.eventHanders.center_modify_password);
	this.on(this.element.find(".button.center_modify_phone"), "touchend click", this.eventHanders.center_modify_phone);
	this.on(this.element.find(".button.center_pays"), "touchend click", this.eventHanders.center_pays);
	this.on(document.body, "ICC_MyProfile", this.eventHanders.ICC_MyProfile, true);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterSettingsModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterSettingsModule.prototype.isValid = function () {
	console.log("center settings check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.CenterSettingsModule.prototype.refresh = function () {
	// 模式切换
	if (this.session.acctIsPersisted()) {
		this.element.removeClass("acct_temped").addClass("acct_persisted");
	} else {
		this.element.addClass("acct_temped").removeClass("acct_persisted");
	}
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.CenterSettingsModule.prototype.eventHanders = {

	/**
	 * 刷新信息
	 * @param {jQuery.Event} event
	 * @param {Object} acct
	 * @returns {undefined}
	 */
	ICC_MyProfile: function (event, acct) {
		// 判断信息
		this.element.find(".button.center_modify_email span").text(acct.acct_email ? "修改" : "绑定");
		this.element.find(".button.center_modify_phone span").text(acct.acct_phone ? "修改" : "绑定");
		// 判断实名认证
		if (acct.acct_birthdate) {
			this.element.find(".button.center_set_id").hide();
		} else {
			this.element.find(".button.center_set_id").show();
		}
	},

	/**
	 * 实名认证
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_set_id: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_set_id(this);
	},

	/**
	 * 修改密码
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_modify_password: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_modify_password(this);
	},

	/**
	 * 修改电话
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_modify_phone: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_modify_phone(this);
	},

	/**
	 * 支付日志
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_pays: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_pays(this);
	},

	/**
	 * 修改邮箱
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_modify_email: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_modify_email(this);
	},

	/**
	 * 关于SDK
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	about: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.about(this);
	},

	/** #if for debug begin */

	/**
	 * 单击注销按钮发此函数
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	logout: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 切换界面
		ICCGAME_PASSPORT.logout(this);
	},

	/** #if for debug end */

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
	}
	// End eventHanders
};