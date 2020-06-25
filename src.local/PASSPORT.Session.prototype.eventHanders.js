/* global ICCGAME_API, ICCGAME_WAIT, ICCGAME_VERIFY, ICCGAME_CAPTCHA, PASSPORT, ICCGAME_PASSPORT */

/**
 *
 * 监听所有事件
 * @returns {undefined}
 */
PASSPORT.Session.prototype.listenEvents = function () {
	var that = this;
	$.each(this.eventHanders, function (eventName, handler) {
		$(document.body).bind(eventName, function () {
			return handler.apply(that, arguments);
		});
		console.log("PASSPORT.Session listen " + eventName + " event");
	});
	return this;
};

/**
 * 事件处理
 */
PASSPORT.Session.prototype.eventHanders = {

	/**
	 * 异常事件
	 * @param {jQuery.Event} event
	 * @param {Object} exception
	 * @returns {undefined}
	 */
	ICC_Exception: function (event, exception) {
		var code = "" + exception.code;
		var message = null;
		// 报告错误
		console.error("exception: " + code + ", " + exception.message, exception);
		if (code in this.exceptionMessages) {
			message = this.exceptionMessages[code];
		} else if (code !== "0" && code !== "-1999") {
			message = "网络故障(" + code + ")";
		}
		// 已知处理
		switch (exception.type) {
			case "ZLei\\Mvc\\Exception\\ValidationException":
				// 清理密令
				this.sessionCAPTCHA = false;
				// 提取表单名称
				var matches = exception.message.match(/^([a-z_][0-9a-z_]+)\:\s*(.*)$/i);
				if (matches === null) {
					break;
				}
				$(".module.active :input[name=\"" + matches[1] + "\"]").focus().click();
				if (message === null) {
					if (exception.property in this.exceptionValidationFields) {
						message = this.exceptionValidationFields[matches[1]];
					} else {
						message = matches[2];
					}
				}
				ICCGAME_API.alert(message);
				break;
			case "ZLei\\Captcha\\Exception\\ValidationException":
				// 清理密令
				this.sessionCAPTCHA = false;
				// 匹配信息
				var matches = exception.message.match(/CAPTCHA,\s*([0-9a-f]+):([0-9a-z\+\/\=]+),(.*)/i);
				if (matches === null) {
					break;
				}
				if (matches[3]) {
					console.info("demand verify owner.");
					ICCGAME_VERIFY.open(matches[1], matches[2], matches[3]);
				} else {
					console.info("demand CAPTCHA.", matches[1]);
					ICCGAME_CAPTCHA.open(matches[1], matches[2]);
				}
				break;
			default:
				// 反馈玩家
				ICCGAME_API.alert(message ? message : exception.message);
				break;
		}
	},

	/**
	 * 异步回调
	 * 当异步通讯完成时候回调
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_AjaxError: function (event) {
		if (this.sessionID) {
			return;
		}
		setTimeout(function () {
			$(document.body).trigger("ICC_Expire");
		}, 5000);
		console.error("session failure. 5 seconds later, try again.");
	},

	/**
	 * 应运初始化完成调用
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_Ready: function (event) {
		// 通知SDK
		ICCGAME_API.ready();
	},

	/**
	 * 长时间没有操作，会话过期。
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_Expire: function (event) {
		console.log("init session secret");
		// 清理参数
		this.sessionID = null;
		this.sessionSecret = null;
		// 发起请求
		this.loadSecret();
	},

	/**
	 * 当 Session 信息发生变更时候回调
	 * @param {jQuery.Event} event
	 * @param {Object} data
	 * @returns {undefined}
	 */
	ICC_SessionChange: function (event, data) {
		this.sessionID = data.sessionID;
		this.sessionSecret = data.sessionSecret;
		console.info("session ID: " + this.sessionID);
		// 每10分钟心跳一次
		setTimeout(function () {
			$(document.body).trigger("ICC_Expire");
		}, 1000 * 600);
		// 自动登录
		if (this.acctIsPlaying) {
			return;
		}
		// 发送请求
		if (ICCGAME_API.getNetworkType() > 2
				&& this.acctLastReported() !== ICCGAME_API.getDate()) {
			this.sendDeviceInfo();
		}
		// 自动登录
		console.info("session login persisted: " + this.acctLoginPersisted());
		this.acctLoginPersisted() && this.login();
	},

	/**
	 * 更新账号信息
	 * @param {jQuery.Event} event
	 * @param {Object} account
	 * @returns {undefined}
	 */
	ICC_MyProfile: function (event, account) {
		this.sessionAccount = account;
	},

	/**
	 * 设备注册完成
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_DeviceRegistered: function (event) {
		console.log("device registered.");
		// 记录报告时间
		this.acctLastReported(ICCGAME_API.getDate());
	},

	/**
	 * 登录完成
	 * @param {jQuery.Event} event
	 * @param {String} token
	 * @returns {undefined}
	 */
	ICC_Login: function (event, token) {
		console.log("session login succeed.");
		// 更新状态
		this.acctLoginTimes(true);
		this.acctLoginPersisted(true);
		this.acctIsPlaying = true;
		this.acctIsRealName = /acct_birthdate=\d{8}/i.test(token);
		this.acctIsTrialPeriod = /acct_is_persisted=0/i.test(token);
		// 保存数据
		this.acctName(this.sessionLoginName);
		this.acctPassword(this.sessionLoginPassword);
		// 发送请求
		if (this.acctLastReported() !== ICCGAME_API.getDate()) {
			this.sendDeviceInfo();
		}
		// 刷新账号信息
//		this.loadAccount();
		// 刷新活动列表
		this.loadEvents();
		// 清理上下文
		this.sessionCAPTCHA = false;
	},

	/**
	 * 保存修改密码
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_PasswordChanged: function (event) {
		console.info("password changed.");
		// 刷新本地密码
		this.acctPassword(this.sessionLoginPassword);
	},

	/**
	 * 修改邮箱成功
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_EmailChanged: function (event) {
		console.info("email changed.");
		// 刷新账号信息显示
		this.loadAccount();
		// 清理验证令牌
		this.sessionCAPTCHA = false;
	},

	/**
	 * 修改邮箱成功
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_IdentityChanged: function (event) {
		console.info("identity changed.");
		// 刷新账号信息显示
		this.loadAccount();
		// 设置实名状态
		this.acctIsRealName = true;
		// 清理验证令牌
		this.sessionCAPTCHA = false;
	},

	/**
	 * 修改手机成功
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_PhoneChanged: function (event) {
		console.info("phone changed.");
		// 刷新账号信息显示
		this.loadAccount();
		// 清理验证令牌
		this.sessionCAPTCHA = false;
	},

	/**
	 * 验证码错误
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_CAPTCHAError: function (event) {
		console.info("CAPTCHA error.");
		// 清理输入框
		ICCGAME_CAPTCHA.clearInput();
		ICCGAME_CAPTCHA.reset();
	},

	/**
	 * 验证完成
	 * @param {jQuery.Event} event
	 * @param {String} sessn_captcha
	 * @returns {undefined}
	 */
	ICC_CAPTCHASuccess: function (event, sessn_captcha) {
		console.info("CAPTCHA success.");
		// 缓存密令
		this.sessionCAPTCHA = sessn_captcha;
		// 关闭验证窗口
		ICCGAME_CAPTCHA.close();
	},

	/**
	 * 清理上下文
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerCoolDown: function (event) {
		this.sessionCAPTCHA = false;
		ICCGAME_VERIFY.lastSent = $.now();
	},

	/**
	 * 验证身份失败
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerError: function (event) {
		console.info("verify owner error.");
		// 清理输入框
		ICCGAME_VERIFY.clearInput();
	},

	/**
	 * 需要验证手机
	 * @param {jQuery.Event} event
	 * @param {String} sessn_captcha
	 * @returns {undefined}
	 */
	ICC_VerifyOwnerSuccess: function (event, sessn_captcha) {
		console.info("verify owner success.");
		// 缓存密令
		this.sessionCAPTCHA = sessn_captcha;
		// 关闭验证窗口
		ICCGAME_VERIFY.close();
	},

	/**
	 * 事件完成
	 * @param {jQuery.Event} event
	 * @param {String} requestId
	 * @returns {undefined}
	 */
	ICC_AjaxStop: function (event, requestId) {
		ICCGAME_WAIT.removeTip(requestId);
	},

	/**
	 * 事件请求
	 * @param {jQuery.Event} event
	 * @param {String} requestId
	 * @returns {undefined}
	 */
	ICC_AjaxStart: function (event, requestId) {
		ICCGAME_WAIT.addTip(requestId);
	},

	/*
	 * 验证
	 * @param {jQuery.Event} event
	 * @param {Number} count
	 * @returns {undefined}
	 */
	invalid: function (event, element, count) {
		if (count > 1) {
			return;
		}
		var $that = $(element);
		var name = $that.attr("name");
		var message = $(element).attr("placeholder");
		if ($that.val() && name in this.validtyMessages) {
			message = this.validtyMessages[name];
		}
		ICCGAME_API.alert(message);
	},

	/**
	 * 创建 HTML5 Activity 事件
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	create_activity: function (event) {
		ICCGAME_API.setAssistiveTouchState(false);
	},

	/**
	 * 销毁 HTML5 Activity 事件
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	finish_activity: function (event) {
		ICCGAME_API.setAssistiveTouchState(true);
	},

	/**
	 * 触摸浮标事件
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	assistive_touch: function (event) {
		// 震动设备
		ICCGAME_API.vibrate();
		// 账号中心
		ICCGAME_PASSPORT.center(function () {
			console.log('back game.');
		});
	}
// End Handers
};

/**
 * 验证变凉标识
 * @type Object
 */
PASSPORT.Session.prototype.exceptionValidationFields = {
	"game_id": "该游戏暂未发布，或游戏编号不符合规则",
	"service_id": "业务编号不符合规则",
	"out_trade_no": "游戏支付订单不符合规则",
	"acct_name": "ICCGAME通行证不符合规则",
	"acct_password": "通行证密码不符合规则",
	"trade_info": "交易信息无效，请检查service或sign是否正确"
};

/**
 * 验证信息提示
 * @type Object
 */
PASSPORT.Session.prototype.validtyMessages = {
	"acct_password": "密码可以是任意字符，长度必须大于6位"
};

/**
 * 异常转换消息
 * @type Object
 */
PASSPORT.Session.prototype.exceptionMessages = {
//"-1000": "没有对应记录",
//"-1001": "更新失败,没有对应记录",
//	"-1002": "参数不能为空",
	"-1003": "账号已经转正",
//"-1004": "查询记录失败(记录为空或不唯一)",
	"-1005": "余额不足(请先充值)",
	"-1006": "余额不足",
	"-1007": "已经冻结金额小于解冻金额",
//"-1008": "SQLEXCEPTION",
//"-1009": "记录插入失败",
	"-1010": "充值订单金额异常，请联系客服",
	"-1011": "记录已经存在",
	"-1012": "账目异常，请联系客服",
//	"-1999": "动态异常提示",
	"-2001": "账号名称无效",
	"-2002": "账号不存在",
	"-2003": "账号已经转正",
	"-2004": "账号密码错误",
	"-2005": "会话超时",
	"-2006": "账号已被注册",
	"-2007": "需要进行短信随机码验证",
	"-2008": "需要进行邮件随机码验证",
	"-2009": "需要进行图片随机码验证",
	"-2010": "短信随机码错误",
	"-2011": "交易信息不能为空",
	"-2012": "币种不支持充值",
	"-2013": "交易业务编号或签名错误",
	"-2014": "余额不足",
	"-2021": "账号没有绑定邮箱或手机，请联系客服",
	"-2022": "新手机号码与当前绑定号码一致",
	"-2023": "新邮件地址与当前绑定地址一致",
	"-2024": "参数不符合规则",
	"-2025": "账号名称与记录数据不匹配",
	"-2026": "网络繁忙，会话建立失败",
	"-2027": "账号状态异常，请联系客服",
	"-2028": "实名信息不能修改，请联系客服",
	"-2029": "请求全国公民身份证号码查询服务中心接口失败，请稍后重试",
	"-2030": "身份证号或真实姓名错误",
	"-2031": "交易信息无效，请检查service或sign是否正确",
	"-2032": "建议开放“读取手机信息”权限，通过设备信息绑定提高账号安全",
	"-2033": "新密码与当前密码一致",
	"-2099": "没有网络",
	"-2098": "系统正在升级...稍等1分钟",
	"-2097": "返回数据格式异常",
	"-2091": "第三方渠道 操作失败",
	"-2090": "ICCGAME 操作失败",
	"-3001": "令牌不能为空",
	"-3002": "令牌无效",
	"-3003": "令牌暂未登录",
	"-3004": "业务标识不能为空",
	"-3005": "游戏交易标识不能为空",
	"-3006": "业务标识或交易标识无效",
	"-3007": "等待买家支付",
	"-3008": "交易需要人工干预(回调超时,间隔共计请求7次后)",
	"-3101": "操作被打断",
	"-3102": "玩家取消",
	"-3103": "该账号以为正式状态",
	"-3104": "充值结果不能确定(等待系统回调)",
	"-3105": "游戏正在处于登录状态",
	"-3106": "支付订单请求不能为空(请参见 http://sdk.m.iccgame.com/document/#pay)",
	"-3107": "请先登录",
	"-3108": "支付失败",
	"-3109": "暂不支持",
	"-3110": "IP无效",
	"-3111": "IP拒绝"
};