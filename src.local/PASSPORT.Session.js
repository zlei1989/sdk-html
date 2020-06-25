/* global ICCGAME_STORAGE, PASSPORT */

/**
 * 会话对象 保存本地运行参数
 *
 * @returns {PASSPORT.Session}
 */
PASSPORT.Session = function () {
	/**
	 * 接口地址
	 * @type String
	 */
	this.interfaceURL = "/index.php";
	/**
	 * 账号是否已经登录
	 * @type Boolean
	 */
	this.acctIsPlaying = false;
	/**
	 * 账号是否实名认证
	 * @type Boolean
	 */
	this.acctIsRealName = false;
	/**
	 * 账号是否试玩阶段
	 */
	this.acctIsTrialPeriod = true;
	/**
	 * 会话标识
	 * @type String
	 */
	this.sessionID;
	/**
	 * 随机种子
	 * @type String
	 */
	this.sessionSecret;
	/**
	 * 当前登录账号
	 * @type String
	 */
	this.sessionLoginName;

	/**
	 * 当前会话所有者验证结果
	 * @type String
	 */
	this.sessionContext;
	/**
	 * 当前会话图形码验证结果
	 * @type String
	 */
	this.sessionCAPTCHA;
	/**
	 * 当前登录密码
	 * @type String
	 */
	this.sessionLoginPassword;
	// 开始事件监听
	this.listenEvents();
};

/**
 * 获得或设置账号名称
 *
 * @param {String|undefined} value
 * @returns {PASSPORT.Session|String}
 */
PASSPORT.Session.prototype.acctName = function (value) {
	if (value === undefined) {
		return ICCGAME_STORAGE.getItem("acct_name");
	}
	ICCGAME_STORAGE.setItem("acct_name", value);
	return this;

};

/**
 * 获得或设置账号密码
 *
 * @param {String|undefined} value
 * @param {Boolean|undefined} hash
 * @returns {String}
 */
PASSPORT.Session.prototype.acctPassword = function (value, hash) {
	if (value === undefined) {
		return ICCGAME_STORAGE.getItem("acct_password");
	}
	if (hash) {
		value = $.md5(value);
	}
	ICCGAME_STORAGE.setItem("acct_password", value);
	return this;
};

/**
 * 获得或设置账号是否转正
 *
 * @returns {Boolean}
 */
PASSPORT.Session.prototype.acctIsPersisted = function () {
	if (this.acctLoginTimes() < 1) {
		return true;
	}
	if (/^guest\/[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/.test(this.acctName())) {
		return false;
	}
	return true;
};

/**
 * 获得或设置是否自动登录
 *
 * @param {Boolean|undefined} value
 * @returns {PASSPORT.Session|String}
 */
PASSPORT.Session.prototype.acctLoginPersisted = function (value) {
	if (value === undefined) {
		return ICCGAME_STORAGE.getItem("acct_login_persisted");
	}
	ICCGAME_STORAGE.setItem("acct_login_persisted", value ? true : false);
	return this;
};

/**
 * 获得游戏安装时间
 *
 * @param {Boolean|undefined} increase
 * @returns {Number}
 */
PASSPORT.Session.prototype.acctLoginTimes = function (increase) {
	var value = ICCGAME_STORAGE.getItem("acct_login_times");
	if (!value) {
		value = 0;
	}
	if (increase === undefined) {
		return value;
	}
	ICCGAME_STORAGE.setItem("acct_login_times", value + 1);
	return this;
};

/**
 * 获得或设置账号最后提交软件安装列表时间
 *
 * @param {Number|undefined} value
 * @returns {Number}
 */
PASSPORT.Session.prototype.acctLastReported = function (value) {
	if (value === undefined) {
		return ICCGAME_STORAGE.getItem("acct_last_reported");
	}
	ICCGAME_STORAGE.setItem("acct_last_reported", parseInt(value));
	return this;
};

/**
 * 获得或这是账号第一次游戏时间戳
 *
 * @param {Number|undefined} value
 * @returns {Number}
 */
PASSPORT.Session.prototype.acctFirstPlayed = function (value) {
	if (value === undefined) {
		return ICCGAME_STORAGE.getItem("acct_first_played");
	}
	ICCGAME_STORAGE.setItem("acct_first_played", parseInt(value));
	return this;
};

/**
 * 获得一个试玩账号
 *
 * @returns {String}
 */
PASSPORT.Session.prototype.getGuestAcctName = function () {
	return "guest/" + this.sessionID;
};