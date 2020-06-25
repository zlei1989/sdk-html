/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.PayModule}
 */
PASSPORT.PayModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	/** #if for android begin */
	this.on(this.element.find(".button.payWithAlipay"), "touchend click", this.eventHanders.payWithAlipay);
	this.on(this.element.find(".button.payWithChongqilai"), "touchend click", this.eventHanders.payWithChongqilai);
	this.on(this.element.find(".button.payWithPaytend"), "touchend click", this.eventHanders.payWithPaytend);
	this.on(this.element.find(".button.payWithYeepay"), "touchend click", this.eventHanders.payWithYeepay);
//	this.on(this.element.find(".button.payWithCardOf27399"), "touchend click", this.eventHanders.payWithCardOf27399);
//	this.on(this.element.find(".button.payWithCardOfYeepay"), "touchend click", this.eventHanders.payWithCardOfYeepay);
//	this.on(this.element.find(".button.payWithWeixin"), "touchend click", this.eventHanders.payWithWeixin);
	/** #if for android end */
	// 绑定事件
	this.on(document.body, "ICC_PayBalanceLow", this.eventHanders.ICC_PayBalanceLow);
	this.on(document.body, "ICC_PayCompleted", this.eventHanders.ICC_PayCompleted);
	this.on(document.body, "ICC_MyProfile", this.eventHanders.ICC_MyProfile, true);
	// 绑定事件
	this.on(document.body, "ICC_CallAppleStore", this.eventHanders.ICC_CallAppleStore);
	/** #if for android begin */
	this.on(document.body, "ICC_CallAlipay", this.eventHanders.ICC_CallAlipay);
	this.on(document.body, "ICC_CallPaytend", this.eventHanders.ICC_CallPaytend);
	this.on(document.body, "ICC_CallChongqilai", this.eventHanders.ICC_CallChongqilai);
	this.on(document.body, "ICC_CallYeepay", this.eventHanders.ICC_CallYeepay);
//	this.on(document.body, "ICC_CallCardOf27399", this.eventHanders.ICC_CallCardOf27399);
//	this.on(document.body, "ICC_CallCardOfYeepay", this.eventHanders.ICC_CallCardOfYeepay);
//	this.on(document.body, "ICC_CallWeixin", this.eventHanders.ICC_CallWeixin);
	/** #if for android end */
	// 支付成功事件
	this.on(document.body, "apple_result", this.eventHanders.apple_result, true);
	this.on(document.body, "apple_store_result", this.eventHanders.apple_store_result);
	/** #if for android begin */
	this.on(document.body, "alipay_result", this.eventHanders.alipay_result);
	this.on(document.body, "paytend_result", this.eventHanders.paytend_result);
	this.on(document.body, "switfpass_result", this.eventHanders.switfpass_result);
//	this.on(document.body, "weixin_result", this.eventHanders.weixin_result);
	/** #if for android end */
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.PayModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 支付请求数据
 * @type String
 */
PASSPORT.PayModule.prototype.request = null;

/**
 * 充值上下文数据(未被使用)
 * @type Object
 */
PASSPORT.PayModule.prototype.context = null;

/**
 * 充值订单设置
 * @type Object
 */
PASSPORT.PayModule.prototype.charge_params = {
	service_id: 0,
	amount: 0,
	foreign_uuid: null
};

/**
 * 开始运行
 * @returns {PASSPORT.PayModule.prototype}
 */
PASSPORT.PayModule.prototype.enter = function () {
	// 解除锁定
	this.element.removeClass("lock");
	// 显示界面
	PASSPORT.ModuleAbstract.prototype.enter.call(this);
	// 二次回调
	if (this.context) {
		return this;
	}
	// 进入实名认证界面
//	if (this.session.acctIsRealName !== true && this.skips < 1) {
	if (this.session.acctIsRealName !== true) {
		return this.enterSetIdBreakpoint(this, this.skips++);
	}
	// 尝试支付
	this.session.tryPay(this.request);
	return this;
};


PASSPORT.PayModule.prototype.enterSetIdBreakpoint = function (that, times) {
	if (times > 0) {
		setTimeout(function () {
			// 取消操作
			that.cancel(true);
		});
	} else {
		setTimeout(function () {
			// 震动设备
			ICCGAME_API.vibrate();
			// 气泡提示
			ICCGAME_API.alert("请实名认证后才能进行充值消费");
			// 页面跳转
			ICCGAME_PASSPORT.center_set_id(that);
		}, 99);
	}
	return false;
};

/**
 * 结束运行
 * @returns {PASSPORT.PayModule.prototype}
 */
PASSPORT.PayModule.prototype.leave = function () {
	// 隐藏界面
	var result = PASSPORT.ModuleAbstract.prototype.leave.call(this);
	// 刷新账号信息显示
	$(document.body).trigger("ICC_AcountChanged");
	return result;
};

/**
 * 刷新界面
 * @returns {undefined}
 */
PASSPORT.PayModule.prototype.refresh = function () {
	// 隐藏插件
	this.element.find(".functions .button.optional").hide();
	if (ICCGAME_API.getSystem() === "iOS") {
		return;
	}
	/** #if for android begin */
	// 检查安装
	var plugins = ICCGAME_API.getPlugins();
	if ($.inArray("alipay", plugins) > -1) {
		this.element.find(".button.payWithAlipay").show();
	}
	if ($.inArray("weixin", plugins) > -1) {
		this.element.find(".button.payWithWeixin").show();
	}
	if ($.inArray("switfpass", plugins) > -1) {
		this.element.find(".button.payWithChongqilai").show();
	}
	if ($.inArray("paytend", plugins) > -1) {
		this.element.find(".button.payWithPaytend").show();
	}
	/** #if for android end */
};

/**
 * 检测状态
 * @returns {Number}
 */
PASSPORT.PayModule.prototype.isValid = function () {
	// 状态验证
	console.log("pay check status");
	// 已经登录
	if (!this.request) {
		return -3106;
	}
	return 0;
};

/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.PayModule.prototype.eventHanders = {

	/** #if for android begin */

	/**
	 * 支付宝充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithAlipay: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithAlipay(this.context.trade_no, this.context.amount);
	},

	/**
	 * 微信(聚财通)充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithPaytend: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithPaytend(this.context.trade_no, this.context.amount);
	},

	/**
	 * 微信(快付)充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithChongqilai: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithChongqilai(this.context.trade_no, this.context.amount);
	},

	/**
	 * 易宝充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithYeepay: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithYeepay(this.context.trade_no, this.context.amount);
	},

	/**
	 * 易宝虚拟卡充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithCardOfYeepay: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithCardOfYeepay(this.context.trade_no, this.context.amount);
	},

	/**
	 * 天宏虚拟卡充值
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	payWithCardOf27399: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if (!this.context) {
			return;
		}
		// 调用请求
		this.session.chargeWithCardOf27399(this.context.trade_no, this.context.amount);
	},

	/** #if for android end */

	/**
	 * 回到游戏
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
	 * 刷新准备参数
	 * @param {jQuery.Event} event
	 * @param {Number} out_trade_no
	 * @param {Number} chg_amount
	 * @param {Number} bal_amount
	 * @param {String} trade_no
	 * @returns {undefined}
	 */
	ICC_PayBalanceLow: function (event, out_trade_no, chg_amount, bal_amount, trade_no) {
		// 支付订单序号缓存
		this.context = new Object();
		this.context.amount = chg_amount;
		this.context.trade_no = trade_no;
		this.context.out_trade_no = out_trade_no;
		// 提交状态
		console.log("pay failure. balance low.");
		console.log("pay out_trade_no: " + out_trade_no + ", trade_no: " + trade_no);
		console.log("balance: " + bal_amount + ", charge: " + chg_amount);
		// 开始支付
		if (ICCGAME_API.getSystem() !== "iOS") {
			return;
		}
		this.session.chargeWithAppleStore(this.context.trade_no, this.context.amount);
	},

	/**
	 * 支付完成
	 * @param {jQuery.Event} event
	 * @param {String} trade_no
	 * @param {String} out_trade_no
	 * @returns {PASSPORT.PayModule.prototype}
	 */
	ICC_PayCompleted: function (event, trade_no, out_trade_no) {
		// 发起请求
		console.log("pay success.");
		console.log("pay out_trade_no: " + out_trade_no + ", trade_no: " + trade_no);
		// 返回游戏
		this.triggerHandler({"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": out_trade_no, "trade_no": trade_no});
		// 返回游戏
		return this.leave();
	},

	/**
	 * 读取账户信息完成
	 * 处理异常订单
	 * @param {Event} evnt
	 * @param {Object} acct
	 * @returns {undefined}
	 */
	ICC_MyProfile: function (evnt, acct) {
		if ($.inArray("apple store", ICCGAME_API.getPlugins()) > -1) {
			var dir = ICCGAME_API.payWithAppleStoreDataPath();
			var files = ICCGAME_API.getFiles(dir);
			for (var idx in files) {
				if (/^Suspended_\d+\.json$/i.test(files[idx]) !== true) {
					continue;
				}
				var filename = dir + "/" + files[idx];
				var contents = ICCGAME_API.readFile(filename);
				var obj = JSON.parse(contents);
				obj["module"] = "GAME.Charges.AppleStore";
				obj["do"] = "SuspendedTransaction";
				$.post(this.session.interfaceURL, obj, function (text) {
					if (text === "success") {
						ICCGAME_API.deleteFile(filename);
					}
				});
			}
		} else if ($.inArray("apple", ICCGAME_API.getPlugins()) > -1) {
			ICCGAME_API.retryApplePayExceptionTransactions();
		}
	},

	/**
	 * 收到请求串后回调支付宝sdk
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallAppleStore: function (event, params) {
		console.log("call AppleStore SDK, " + params);
		// 锁定界面
		this.element.addClass("lock");
		// 调用接口
		ICCGAME_API.payWithAppleStore(params);
	},

	/** #if for android begin */

	/**
	 * 收到请求串后回调支付宝sdk
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallAlipay: function (event, params) {
		console.log("call Alipay SDK, " + params);
		// 锁定界面
		this.element.addClass("lock");
		// 调用接口
		ICCGAME_API.payWithAlipay(params);
	},

	/**
	 * 收到请求串后回调微信sdk
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallPaytend: function (event, params) {
		console.log("call Paytend(Weixin) SDK, " + params);
		// 锁定界面
		this.element.addClass("lock");
		// 调用接口
		ICCGAME_API.payWithPaytend(params);
	},

	/**
	 * 收到请求串后回调微信sdk
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallChongqilai: function (event, params) {
		console.log("call Chongqilai(Weixin) SDK, " + params);
		// 锁定界面
		this.element.addClass("lock");
		// 调用接口
		ICCGAME_API.payWithSwitfpass(params);
	},

	/**
	 * 收到请求串后回调易宝sdk
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallYeepay: function (event, params) {
		console.log("call Yeepay SDK, " + params);
		var payHandler = this.handler;
		var defaultParams = {"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no};
		var yeepayHandler = function (sdk_result) {
			if (sdk_result) {
				payHandler(sdk_result);
			} else {
				payHandler(JSON.stringify(defaultParams));
			}
		};
		// 清理回调（此段代码顺序很关键，不能调整）
		var that = this.setHandler(null);
		// 调用接口
		ICCGAME_PASSPORT.browser(params, '银行卡支付', yeepayHandler);
		// 延迟隐藏
		setTimeout(function () {
			that.leave();
		}, 99);
	},

	/**
	 * 收到请求串后回调易宝虚拟卡
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallCardOfYeepay: function (event, params) {
		console.log("call Card Of Yeepay SDK, " + params);
		var payHandler = this.handler;
		var defaultParams = {"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no};
		var yeepayHandler = function (sdk_result) {
			if (sdk_result) {
				payHandler(sdk_result);
			} else {
				payHandler(JSON.stringify(defaultParams));
			}
		};
		// 清理回调（此段代码顺序很关键，不能调整）
		var that = this.setHandler(null);
		// 调用接口
		ICCGAME_PASSPORT.browser(params, '电话卡充值', yeepayHandler);
		// 延迟隐藏
		setTimeout(function () {
			that.leave();
		}, 99);
	},

	/**
	 * 收到请求串后回调天宏一卡通
	 * @param {jQuery.Event} event
	 * @param {String} params
	 * @returns {undefined}
	 */
	ICC_CallCardOf27399: function (event, params) {
		console.log("call Card Of 27399 SDK, " + params);
		var payHandler = this.handler;
		var defaultParams = {"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no};
		var yeepayHandler = function (sdk_result) {
			if (sdk_result) {
				payHandler(sdk_result);
			} else {
				payHandler(JSON.stringify(defaultParams));
			}
		};
		// 清理回调（此段代码顺序很关键，不能调整）
		var that = this.setHandler(null);
		// 调用接口
		ICCGAME_PASSPORT.browser(params, '天宏一卡通', yeepayHandler);
		// 延迟隐藏
		setTimeout(function () {
			that.leave();
		}, 99);
	},

	/** #if for android end */

	/**
	 * 苹果支付返回结果 SDK 产生
	 * @param {Event} event
	 * @returns {undefined}
	 */
	apple_store_result: function (event) {
		var result = event.originalEvent.data;
		console.log("receive apple_store_result event, " + JSON.stringify(result));
		if (result.code === 0) {
			this.triggerHandler({"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no});
		} else {
			this.triggerHandler({"sdk_result": -3108, "sdk_message": result.message});
		}
		this.leave();
	},

	/** #if for android begin */

	/**
	 * 支付宝支付返回结果 SDK 产生
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	alipay_result: function (event) {
		var result = event.originalEvent.data;
		console.log("receive alipay_result event, " + JSON.stringify(result));
		var code = null;
		if (typeof (result) === "string") {
			// 验证状态
			var pattern = /resultStatus={(\d+)}/i;
			var matches = pattern.exec(result);
			if (!matches) {
				this.triggerHandler(-3108);
			} else {
				code = matches[1];
			}
		} else {
			code = result.resultStatus;
		}
		if (code === "9000") {
			this.triggerHandler({"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no});
		} else {
			if (code in this.ALIPAY_ERRORS) {
				this.triggerHandler({"sdk_result": -3108, "sdk_message": this.ALIPAY_ERRORS[code]});
			} else {
				this.triggerHandler(-3108);
			}
		}
		this.leave();
	},

	/**
	 * 微信支付返回结果 SDK 产生
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	paytend_result: function (event) {
		var result = event.originalEvent.data;
		console.log("receive paytend_result event, " + JSON.stringify(result));
		if (result.code === "SUCCESS") {
			this.triggerHandler({"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no});
		} else {
			this.triggerHandler({"sdk_result": -3108, "sdk_message": result.message});
		}
		this.leave();
	},

	/**
	 * 快付、威富通（微信钱包）返回结果 SDK 产生
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	switfpass_result: function (event) {
		var result = event.originalEvent.data;
		console.log("receive switfpass_result event, " + JSON.stringify(result));
		if (result.errCode === 0) {
			this.triggerHandler({"sdk_result": 0, "sdk_message": "支付成功", "out_trade_no": this.context.out_trade_no, "trade_no": this.context.trade_no});
		} else {
			switch (result.errCode) {
				case - 1:
					result.errStr = "签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等";
					break;
				case - 2:
					result.errStr = "用户不支付了，点击取消，返回APP";
					break;
			}
			this.triggerHandler({"sdk_result": -3108, "sdk_message": result.errStr});
		}
		this.leave();
	}

	/** #if for android end */

	// End eventHanders
};

/** #if for android begin */
PASSPORT.PayModule.prototype.ALIPAY_ERRORS = {
	"9000": "订单支付成功",
	"8000": "正在处理中",
	"4000": "订单支付失败",
	"6001": "用户中途取消",
	"6002": "网络连接出错"
};
/** #if for android end */

/** #if for android begin */
PASSPORT.PayModule.prototype.WEIXIN_ERRORS = {
	"WEIXIN_NOT_FOUND": "没有安装微信",
	"WEIXIN_VERSION_TOO_LOW": "微信版本过低",
	"PLUGIN_INSTALLATION": "正在安装安全插件",
	//
	"SUCCESS": "成功",
	"FAIL": "失败",
	"TIMEOUT": "超时：连接微信服务端超时",
	"SYSTEMERROR_PAYTEND": "系统错误：如参数格式错误、签名错误、方法调用出错",
	"ORDERSTATUSERROR_PAYTEND": "订单状态错误",
	"ORDER_NOTEXIST_PAYTEND": "订单不存在",
	"REFUNDORDER_NOTEXIST_PAYTEND": "退款单不存在",
	"ORDER_CAN_NOTCLOSE_PAYTEND": "订单不允许关闭",
	"ORDER_AMOUNTERROR_PAYTEND": "同一笔订单多次提交金额不一致",
	"ORDER_DATA_NOTSAME_PAYTEND": "相同的订单号数据不一致，请核对后再提交",
	"FAIL_NOT_ENOUGH": "头寸不足",
	"FAIL_NOT_EXIST": " 原订单不存在，撤销的时候会检查原订单号",
	"FAIL_NOT_SUPPORT": "原订单不支持撤销",
	"FAIL_STATUS": "受理机构状态异常",
	"FAIL_SIGN": "结算中心验签失败",
	"FAIL_SZFS": "结算中心处理请求失败",
	"DUPLICATE_SZFS": "重复提交",
	"FAIL_MERID_INVALID": "微信子商户号无效",
	"SYSTEMERROR": "接口返回错误",
	"INVALID_TRANSACTIONID": "无效transaction_id",
	"PARAM_ERROR": "参数错误",
	"ORDERPAID": "订单已支付",
	"OUT_TRADE_NO_USED": "商户订单号重复",
	"NOAUTH": "商户无权限",
	"AUTHCODEEXPIRE": "二维码已过期，请刷新再试",
	"NOTENOUGH": "余额不足",
	"NOTSUPORTCARD": "不支持卡类型",
	"ORDERCLOSED": "订单已关闭",
	"ORDERREVERSED": "订单已撤销",
	"BANKERROR": "银行系统异常",
	"USERPAYING": "用户支付中，需要输入密码",
	"AUTH_CODE_ERROR": "授权码参数错误",
	"TRADE_STATE_ERROR": "请重新发起",
	"REFUND_FEE_INVALID": "退款金额大于支付金额"
};

/** #if for android end */