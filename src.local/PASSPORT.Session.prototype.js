/* global ICCGAME_API, PASSPORT */

/**
 * 提交创建游戏账号请求
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.createAccount = function () {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.Create");
	fields["acct_is_persisted"] = this.acctIsPersisted();
	fields["acct_name"] = this.sessionLoginName;
	fields["acct_password"] = this.sessionLoginPassword;
	fields["dev_serial_number"] = ICCGAME_API.getSerialNumber();
	fields["dev_system"] = ICCGAME_API.getSystem();
	// 提交请求
	console.info("create account: " + fields["acct_name"]);
	return this.ajaxPost(fields);
};

/**
 * 提交登录请求
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.login = function () {
	if (!this.sessionSecret) {
		console.warn("session secret is empty.");
		return null;
	}
	// 构造参数
	var fields = this.newFields("GAME.Accounts.Login");
	fields["acct_name"] = this.sessionLoginName;
	fields["acct_secret"] = $.md5(this.sessionSecret + this.sessionLoginPassword);
	// 提交请求
	console.info("session login: " + fields["acct_name"] + ", " + fields["acct_secret"]);
	return this.ajaxPost(fields);
};

/**
 * 载入账号信息
 * @returns {String}
 */
PASSPORT.Session.prototype.loadAccount = function () {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.Profile");
	// 发起请求
	console.log("load account");
	return this.ajaxPost(fields, true);
};

/**
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.loadEvents = function () {
	// 构造参数
	var fields = this.newFields("GAME.Events.Index");
	// 发起请求
	console.log("load events");
	return this.ajaxPost(fields, true);
};

/**
 * 载入消息列表
 * @param {number} offset
 * @param {number} length
 * @returns {String}
 */
PASSPORT.Session.prototype.loadMessages = function (offset, length) {
	// 构造参数
	var fields = this.newFields("GAME.Messages.Index");
	fields["_offset"] = offset;
	fields["_length"] = length;
	// 发起请求
	console.log("load messages");
	return this.ajaxPost(fields);
};

/**
 * 载入单条消息
 * @param {String} msg_uuid
 * @returns {String}
 */
PASSPORT.Session.prototype.loadMessage = function (msg_uuid) {
	// 构造参数
	var fields = this.newFields("GAME.Messages.Profile");
	fields["msg_uuid"] = msg_uuid;
	// 发起请求
	console.log("load message " + msg_uuid);
	return this.ajaxPost(fields);
};

/**
 * 载入支付日志
 * @param {number} offset
 * @param {number} length
 * @returns {String}
 */
PASSPORT.Session.prototype.loadPays = function (offset, length) {
	// 构造参数
	var fields = this.newFields("GAME.Pays.Index");
	fields["_offset"] = offset;
	fields["_length"] = length;
	// 发起请求
	console.log("load pays");
	return this.ajaxPost(fields);
};

/**
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.loadPushes = function () {
	// 构造参数
	var fields = this.newFields("GAME.Pushes.Index");
	// 发起请求
	console.log("load pushes");
	return this.ajaxPost(fields, true);
};

/**
 * 载入混淆密钥
 * @returns {String}
 */
PASSPORT.Session.prototype.loadSecret = function () {
	// 构造参数
	var fields = this.newFields("GAME.Sessions.Create");
	// 发起请求
	console.log("load secret");
	return this.ajaxPost(fields, true);
};

/**
 * 提交试玩转正请求
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.persisted = function () {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.Create", "guest");
	fields["acct_name"] = this.sessionLoginName;
	fields["acct_password"] = this.sessionLoginPassword;
	fields["acct_pre_name"] = this.acctName();
	// 提交请求
	console.info("persisted: " + fields["acct_pre_name"] + ", " + fields["acct_name"]);
	return this.ajaxPost(fields);
};

/**
 * 提交尝试扣费请求
 *
 * @param {String} context
 * @returns {String}
 */
PASSPORT.Session.prototype.tryPay = function (context) {
	// 构造参数
	var fields = this.newFields("GAME.Pays.Create");
	fields["pay_source"] = context;
	// 提交请求
	console.log("try pay");
	return this.ajaxPost(fields);
};

/** #if for debug begin */

/**
 * 创建测试订单信息
 * @returns {PASSPORT.Session}
 */
PASSPORT.Session.prototype.createTestTradeInfo = function () {
	// 构造参数
	var fields = this.newFields("GAME.Pays.TradeTest", "Create");
	fields["acct_name"] = this.sessionLoginName;
	fields["game_id"] = ICCGAME_API.getGameId();
	// 提交请求
	console.info("create tradeInfo(test): " + fields["acct_name"]);
	return this.ajaxPost(fields);
};

/** #if for debug end */

/**
 * 提交尝试扣费请求
 *
 * @param {String} criti_content
 * @returns {String}
 */
PASSPORT.Session.prototype.createCriticism = function (criti_content) {
	// 构造参数
	var fields = this.newFields("GAME.Criticisms.Create");
	fields["acct_name"] = this.sessionLoginName;
	fields["criti_content"] = criti_content;
	// 提交请求
	console.log("create criticism");
	return this.ajaxPost(fields);
};

/**
 * 提交苹果支付充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithAppleStore = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields("GAME.Charges.AppleStore");
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply apple store charge");
	return this.ajaxPost(fields);
};

/** #if for android begin */

/**
 * 提交支付宝充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithAlipay = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields("GAME.Charges.Alipay");
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply alipay charge");
	return this.ajaxPost(fields);
};

/**
 * 提交快付（微信钱包）请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithChongqilai = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields("GAME.Charges.Chongqilai");
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply chongqilai(weixin) charge");
	return this.ajaxPost(fields);
};

/**
 * 提交微信充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithWeixin = function (trade_no, amount) {
};

/**
 * 提交聚财通（微信钱包）充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithPaytend = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields("GAME.Charges.Paytend");
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply paytend(weixin) charge");
	return this.ajaxPost(fields);
};

/**
 * 提交易宝银行卡充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithYeepay = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields("GAME.Charges.Yeepay");
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply yeepay charge");
	return this.ajaxPost(fields);
};

/**
 * 提交天宏一卡通充值请求
 *
 * @param {String} trade_no
 * @param {Number} amount
 * @returns {String}
 */
PASSPORT.Session.prototype.chargeWithCardOf27399 = function (trade_no, amount) {
	// 构造参数
	var fields = this.newFields();
	fields["acct_name"] = this.acctName();
	fields["pay_trade_no"] = trade_no;
	fields["chg_amount"] = amount;
	// 提交请求
	console.log("apply 27399 charge");
	var params = "out/27399-card-pipe.html?" + this.serialize(fields);
	// 发送请求
	$(document.body).trigger("ICC_CallCardOf27399", params);
	return null;
};

/** #if for android end */

/**
 * 上传设备信息
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.sendDeviceInfo = function () {
	// 构造参数
	var fields = this.newFields("GAME.Devices.Create");
	fields["dev_apps"] = ICCGAME_API.getInstalledPackages();
	fields["dev_imei"] = ICCGAME_API.getIMEI();
	fields["dev_mac_address"] = ICCGAME_API.getMACAddress();
	fields["dev_name"] = ICCGAME_API.getDevice();
	fields["dev_screen_type"] = ICCGAME_API.getScreenType();
	fields["dev_serial_number"] = ICCGAME_API.getSerialNumber();
	fields["dev_sim_operator"] = ICCGAME_API.getSimOperator();
	fields["dev_sim_serial_number"] = ICCGAME_API.getSimSerialNumber();
	fields["dev_system"] = ICCGAME_API.getSystem();
	fields["dev_system_version"] = ICCGAME_API.getSystemVersion();
	// 提交请求
	console.log("send device info");
	fields.dev_hash && this.ajaxPost(fields, true);
	// 推广统计（未成体系，临时活动）
	fields.dev_hash && setTimeout(function () {
		$.get("http://activity.pcik.iccgame.com/2017/1201_ad/src/push.php", fields);
	}, 1000);
};


/**
 * 提交修改密码请求
 *
 * @param {String} acct_password
 * @param {String} acct_new_password
 * @returns {String}
 */
PASSPORT.Session.prototype.modifyPassword = function (acct_password, acct_new_password) {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.ModifyPassword");
	fields["acct_password"] = $.md5(acct_new_password);
	fields["acct_secret"] = $.md5(this.sessionSecret + $.md5(acct_password));
	// 挂起密码
	this.sessionLoginPassword = fields["acct_password"];
	// 提交请求
	console.log("modify password");
	return this.ajaxPost(fields);
};

/**
 * 提交修改密码请求
 *
 * @param {String} acct_email
 * @returns {String}
 */
PASSPORT.Session.prototype.modifyEmail = function (acct_email) {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.ModifyEmail");
	fields["acct_email"] = acct_email;
	// 提交请求
	console.log("modify email");
	return this.ajaxPost(fields);
};

/**
 * 提交修改密码请求
 *
 * @param {String} acct_phone
 * @returns {String}
 */
PASSPORT.Session.prototype.modifyPhone = function (acct_phone) {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.ModifyPhone");
	fields["acct_phone"] = acct_phone;
	// 提交请求
	console.log("modify phone");
	return this.ajaxPost(fields);
};

/**
 * 提交修改消息
 *
 * @param {String} msg_uuid
 * @returns {String}
 */
PASSPORT.Session.prototype.modifyMessageClick = function (msg_uuid) {
	// 构造参数
	var fields = this.newFields("GAME.Messages.Modify", "clicked");
	fields["msg_uuid"] = msg_uuid;
	// 提交请求
	console.log("modify message click");
	return this.ajaxPost(fields, true);
};

/**
 * 提交实名认证
 * @param {String} acct_realname
 * @param {String} acct_card_id
 * @returns {PASSPORT.Session.prototype@call;ajaxPost}
 */
PASSPORT.Session.prototype.setId = function (acct_realname, acct_card_id) {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.SetId");
	fields["acct_realname"] = acct_realname;
	fields["acct_card_id"] = acct_card_id;
	// 提交请求
	console.log("set id");
	return this.ajaxPost(fields);
};

/**
 * 提交找回密码请求
 *
 * @param {String} acct_name
 * @param {String} acct_password
 * @returns {String}
 */
PASSPORT.Session.prototype.forgetPassword = function (acct_name, acct_password) {
	// 构造参数
	var fields = this.newFields("GAME.Accounts.ForgetPassword");
	if (acct_name) {
		fields["acct_name"] = acct_name;
		this.sessionLoginName = fields["acct_name"];
	}
	if (acct_password) {
		fields["acct_password"] = $.md5(acct_password);
		this.sessionLoginPassword = fields["acct_password"];
	}
	// 提交请求
	console.log("forget password");
	return this.ajaxPost(fields);
};

/**
 * 验证所有者
 * @param {String} var_id
 * @param {String} ver_request_encrypted
 * @param {String} ver_value
 * @returns {String}
 */
PASSPORT.Session.prototype.verifyOwner = function (var_id, ver_request_encrypted, ver_value) {
// 构造参数
	var fields = this.newFields("GAME.Sessions.VerifyOwner", ver_value ? "Validate" : "Index");
	fields["captcha_id"] = var_id;
	fields["captcha_request_encrypted"] = ver_request_encrypted;
	ver_value && (fields["captcha_value"] = ver_value);
	// 提交请求
	console.log("authentication owner");
	return this.ajaxPost(fields, !ver_value);
};

/**
 * 验证图形码
 *
 * @param {String} var_id
 * @param {String} ver_request_encrypted
 * @param {String} ver_value
 * @returns {String}
 */
PASSPORT.Session.prototype.CAPTCHA = function (var_id, ver_request_encrypted, ver_value) {
	// 构造参数
	var fields = this.newFields("GAME.Sessions.Captcha", "Validate");
	fields["captcha_id"] = var_id;
	fields["captcha_request_encrypted"] = ver_request_encrypted;
	fields["captcha_value"] = ver_value;
	// 提交请求
	console.log("CAPTCHA");
	return this.ajaxPost(fields);
};

/**
 * 序列化数据
 * @param {Object} data
 * @returns {String}
 */
PASSPORT.Session.prototype.serialize = function (data) {
	var params = new Array();
	for (var d in arguments) {
		if (typeof (data) !== "object") {
			continue;
		}
		for (var i in arguments[d]) {
			var t = typeof (arguments[d][i]);
			switch (t) {
				case "string":
					params.push(i + "=" + encodeURI(arguments[d][i]));
					break;
				case "number":
					params.push(i + "=" + arguments[d][i].toString());
					break;
			}
		}
	}
	return params.join("&");
};