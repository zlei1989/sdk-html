/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT, ICCGAME_STORAGE */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterModule}
 */
PASSPORT.CenterModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 缓存活动
	this._lastEvents = "";
	// 最后更新时间
	this.lastAltered = 0;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".button.register"), "touchend click", this.eventHanders.register);
	/** #if for debug begin */
	this.on(this.element.find(".button.pay_test"), "touchend click", this.eventHanders.pay_test);
	/** #if for debug end */
	// 气泡提示
	this.on(this.element.find(".alert.center_set_id"), "touchend click", this.eventHanders.center_set_id);
	this.on(this.element.find(".alert.center_modify_phone"), "touchend click", this.eventHanders.center_modify_phone);
	// 核心功能
	this.on(this.element.find(".button.center_events"), "touchend click", this.eventHanders.center_events);
	this.on(this.element.find(".button.center_messages"), "touchend click", this.eventHanders.center_messages);
	this.on(this.element.find(".button.center_settings"), "touchend click", this.eventHanders.center_settings);
	this.on(document.body, "ICC_MyProfile", this.eventHanders.ICC_MyProfile, true);
	this.on(document.body, "ICC_MyEvents", this.eventHanders.ICC_MyEvents, true);
	this.on(document.body, "ICC_Login", this.eventHanders.ICC_Login, true);
	/** #if for debug begin */
	this.on(document.body, "ICC_TestTradeInfo", this.eventHanders.ICC_TestTradeInfo, true);
	/** #if for debug end */
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterModule.prototype.isValid = function () {
	console.log("center check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.CenterModule.prototype.refresh = function () {
	// 模式切换
	if (this.session.acctIsPersisted()) {
		this.element.removeClass("acct_temped").addClass("acct_persisted");
	} else {
		this.element.addClass("acct_temped").removeClass("acct_persisted");
	}
	// 刷新账号信息
	if ($.now() - this.lastAltered > 1800 * 1000) { // 30 minutes
		this.lastAltered = $.now();
		this.session.loadAccount();
	}
};

/**
 * 获得最后消息标识
 * @param {String} evnt_uuid
 * @returns {Boolean}
 */
PASSPORT.CenterModule.prototype.checkEvntChanged = function (evnt_uuid) {
	var events = this.getCacheEvents();
	for (var e in events) {
		if (events[e][0] === evnt_uuid) {
			return false;
		}
	}
	return true;
};

/**
 * 设置最后活动列表
 * @param {Array} items
 * @returns {PASSPORT.CenterModule.prototype}
 */
PASSPORT.CenterModule.prototype.setLastEvntUuidList = function (items) {
	var events = this.getCacheEvents();
	for (var i in items) {
		var index = -1;
		for (var e in events) {
			if (events[e][0] !== items[i][0]) {
				continue;
			}
			index = parseInt(e);
			break;
		}
		(index < 0) && events.push([items[i][0], items[i][1]]);
	}
	events.sort(function (l, r) {
		return l[1] - r[1];
	});
	this._lastEvents = events;
	return this;
};

PASSPORT.CenterModule.prototype.getLastEvntUuidList = function () {
	return this._lastEvents;
};

/**
 *
 * @returns {Object}
 */
PASSPORT.CenterModule.prototype.getCacheEvents = function () {
	var str = localStorage.getItem("ICCGAME_EVENTS");
	var val = null;
	try {
		str && (val = JSON.parse(str));
	} catch (e) {
	}
	val || (val = new Array());
	return val;
};

/**
 *
 * @param {Array} events
 * @returns {PASSPORT.CenterModule.prototype}
 */
PASSPORT.CenterModule.prototype.setCacheEvents = function (events) {
	if (events instanceof Array === false) {
		return this;
	}
	var str = JSON.stringify(events.slice(0, 32));
	localStorage.setItem("ICCGAME_EVENTS", str);
	return this;
};

/**
 * 获得最后消息标识
 * @param {String} msg_uuid
 * @returns {String|PASSPORT.CenterModule.prototype}
 */
PASSPORT.CenterModule.prototype.checkMsgChanged = function (msg_uuid) {
	if (typeof (msg_uuid) !== "string" || msg_uuid.length !== 36) {
		return false;
	}
	return  msg_uuid !== ICCGAME_STORAGE.getItem("last_msg_uuid");
};

/**
 * 获得最后消息标识
 * @param {String} msg_uuid
 * @returns {String|PASSPORT.CenterModule.prototype}
 */
PASSPORT.CenterModule.prototype.setLastMsgUuid = function (msg_uuid) {
	ICCGAME_STORAGE.setItem("last_msg_uuid", msg_uuid);
	return this;
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.CenterModule.prototype.eventHanders = {
	/** #if for debug begin */
	/**
	 * 测试充值
	 * @param {jQuery.Event} event
	 * @param {String} tradeInfo
	 * @returns {undefined}
	 */
	ICC_TestTradeInfo: function (event, tradeInfo) {
		// 发起请求
		ICCGAME_PASSPORT.pay(tradeInfo, this);
	},
	/** #if for debug end */
	/**
	 * 账号登录成功
	 */
	ICC_Login: function () {
		this.lastAltered = 0;
	},
	/**
	 * 刷新信息
	 * @param {jQuery.Event} event
	 * @param {Object} acct
	 * @returns {undefined}
	 */
	ICC_MyProfile: function (event, acct) {
		// 修正最后更新时间
		this.lastAltered = $.now();
		// 判断信息
		this.element.find(".alert.center_modify_phone").html(acct.acct_phone ? "" : "为了您的账号安全，建议绑定手机号。<u><i>立即绑定</i></u>");
		this.element.find(".alert.center_set_id").html(acct.acct_birthdate ? "" : (acct.acct_phone ? "为了您的游戏体验，应文化部要求，请您尽快完成实名认证。<u><i>立即认证</i></u>" : ""));
		// 账号信息
		this.element.find("h3").text(acct.acct_is_persisted ? acct.acct_name : "游客");
		// 余额信息
		var k = "9" + ICCGAME_API.getGameId();
		var c = "0.00";
		if (k in acct.acct_wallets) {
			c = (acct.acct_wallets[k].wallet_amount / 100).toFixed(2);
		}
		this.element.find("span.balances").text(c);
		// 加载完成
		this.element.find(".content").addClass("loaded");
		// 标记最后
		var $button = this.element.find(".content .button.center_messages");
		$button.attr("last_msg_uuid", acct.acct_last_msg_uuid);
		// 高亮提醒
		this.checkMsgChanged(acct.acct_last_msg_uuid) && $button.append("<span class=\"new\"></span>");
	},
	/**
	 * 活动载入完成
	 * @param {jQuery.Event} event
	 * @param {Array} items
	 * @returns {undefined}
	 */
	ICC_MyEvents: function (event, items) {
		var last_evnt_uuid = null;
		var list = new Array();
		for (var i in items) {
			last_evnt_uuid || (last_evnt_uuid = items[i].evnt_uuid);
			list.push([items[i].evnt_uuid, items[i].evnt_start_time]);
		}
		if (last_evnt_uuid === null) {
			return;
		}
		this.setLastEvntUuidList(list);
		// 标记最后
		var $button = this.element.find(".content .button.center_events");
		$button.attr("last_evnt_uuid", last_evnt_uuid);
		// 高亮提醒
		this.checkEvntChanged(last_evnt_uuid) && $button.append("<span class=\"new\"></span>");
	},
	/**
	 * 试玩转正
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
		// 切换界面
		ICCGAME_PASSPORT.register(this);
	},
	/** #if for debug begin */
	/**
	 * 测试支付
	 * @param {type} event
	 * @returns {undefined}
	 */
	pay_test: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		this.session.createTestTradeInfo();
	},
	/** #if for debug end */
	/**
	 * 实名认证
	 * @param {type} event
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
		if (this.session.acctIsPersisted()) {
			ICCGAME_PASSPORT.center_modify_phone(this);
		} else {
			ICCGAME_PASSPORT.register(this);
		}
	},
	/**
	 * 活动
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_events: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 删除标记
		$(event.target).find(".new").remove();
		// 刷新缓存
		this.setCacheEvents(this.getLastEvntUuidList());
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_events(this);
	},
	/**
	 * 活动
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_messages: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 删除标记
		$(event.target).find(".new").remove();
		this.setLastMsgUuid($(event.target).attr("last_msg_uuid"));
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_messages(this);
	},
	/**
	 * 选项
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	center_settings: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 震动设备
		ICCGAME_API.vibrate();
		// 切换界面
		ICCGAME_PASSPORT.center_settings(this);
	},
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