/**
 * 版本控制
 * @returns {VersionControl}
 */
VersionControl = function () {
	/**
	 * 更新地址
	 * @type String
	 */
	this.upgradeURL = "version.json";
	/**
	 * 当前代码版本
	 * @type Number
	 */
	this.version = 0;
	/**
	 * 当前最小兼容
	 * @type Number
	 */
	this.compatiable = 0;
	/**
	 * 最新版本信息
	 * @type Object
	 */
	this.lastVersion = null;
	/**
	 * 脚本下载结果
	 * @type {VersionControl.Loader}
	 */
	this.loader = null;
	//
	console.log('current version: ' + this.version);
	// End Function
};

/**
 * 载入最后一个版本信息
 * @returns {undefined}
 */
VersionControl.prototype.loadLastVersion = function () {
	$.ajax({
		cache: false,
		context: this,
		dataType: "json",
		error: this._loadErrorCallback,
		success: this._loadSuccessCallback,
		url: this.upgradeURL
	});
};

/**
 * 最后版本信息载入完成后回调
 * @param {Object} data
 * @param {String} textStatus
 * @param {jqXHR} jqXHR
 * @returns {undefined}
 */
VersionControl.prototype._loadSuccessCallback = function (data, textStatus, jqXHR) {
	console.log("last version: " + data.version);
	this.lastVersion = data;
	var result = this.compareWithVersion(data);
	if (result === 1) {
		console.log("force upgrade");
		this.forceUpgrade();
	} else {
		if (result === -1) {
			console.log("background upgrade");
			this.upgrade();
		}
		this.runCacheCodes();
	}

};

/**
 * 最后版本信息载入失败后回调
 * @param {jqXHR} jqXHR
 * @param {String} textStatus
 * @returns {undefined}
 */
VersionControl.prototype._loadErrorCallback = function (jqXHR, textStatus) {
	console.error("load version error(" + textStatus + ")");
	this.runCacheCodes();
};

/**
 * 对比版本是否需要更新
 * 返回 0:无需更新; -1:需要更新; 1:强制更新.
 * @param {Object} lastVersion
 * @returns {Number}
 */
VersionControl.prototype.compareWithVersion = function (lastVersion) {
	if (this.version !== lastVersion.version) {
		if (this.version >= lastVersion.compatiable)
			return -1;
		return 1;
	}
	return 0;
};

/**
 * 强制更新
 * @returns {undefined}
 */
VersionControl.prototype.forceUpgrade = function () {
	var that = this;
	this.upgrade(function () {
		that.runCacheCodes();
		//location.reload();
	});
};

/**
 * 升级代码
 * @param {Function} callback
 * @returns {undefined}
 */
VersionControl.prototype.upgrade = function (callback) {
	console.log("upgrade start");
	var that = this;
	this.loader = new this.Loader();
	this.loader.load(
			this.lastVersion.scripts,
			function (codes) {
				console.log("upgrade stop");
				that.loader = null;
				that.cacheCodes(codes);
				callback && callback(true);
			}
	);
};

/**
 * 将代码保存至缓存
 * @param {Object} codes
 * @returns {undefined}
 */
VersionControl.prototype.cacheCodes = function (codes) {
	if (codes === false) {
		console.warn("cache codes not equal to null");
		return;
	}
	// 清除历史
	this.clearCache();
	// 缓存代码
	for (var k in codes) {
		localStorage.setItem(k, $.trim(codes[k]));
		console.log("cached code: " + k);
	}
};

/**
 * 清楚已经缓存的代码
 * @returns {undefined}
 */
VersionControl.prototype.clearCache = function () {
	console.log("clear cache");
	var reg = /^CODE_.+$/;
	for (var n in localStorage) {
		if (reg.test(n) === false) {
			continue;
		}
		localStorage.removeItem(n);
	}
};

/**
 * 运行代码
 * @returns {undefined}
 */
VersionControl.prototype.runCacheCodes = function () {
	// 执行代码
	if (localStorage["CODE_JAVASCRIPT"]) {
		console.log("run cache codes");
		this.runCodes(localStorage["CODE_HTML"], localStorage["CODE_JAVASCRIPT"]);
	} else {
		console.log("run local codes");
		this.runCodes(window.CODE_HTML, window.CODE_JAVASCRIPT);
	}
};

/**
 * 运行代码
 * @param {String} html
 * @param {String} javascript
 * @returns {undefined}
 */
VersionControl.prototype.runCodes = function (html, javascript) {
	if ("ICCGAME_PASSPORT" in window) {
		console.error("class ICCGAME_PASSPORT not exists.");
		return;
	}
	if (!html || !javascript) {
		console.error("code html or javascript is empty");
		return;
	}
	// 执行代码
	$(document.body).html(html);
	try {
		window.eval(javascript);
	} catch (e) {
		var lines = javascript.split("\n");
		for (var i = 0; i < lines.length; i++) {
			console.log((1 + i) + ": " + lines[i]);
		}
		console.warn(e);
//		console.warn(e.message + " line " + ("line" in e ? e.line : "0"));
	}
};

/**
 * 引导启动
 * @returns {undefined}
 */
VersionControl.prototype.bootstrap = function () {
	console.log("load last version");
	this.loadLastVersion();
};