/* global ICCGAME_API */

/**
 * 本地存储账号信息
 * @type {ICCGAME_STORAGE}
 */
ICCGAME_STORAGE = {
	/**
	 * 内存数据
	 */
	buffer: new Object(),
	/**
	 * 数据文件
	 * @type String
	 */
	filename: "/ICCGAME_SDK/local_storage.dat",
	/**
	 * 公共目录
	 * @param {type} key
	 * @param {type} value
	 * @returns {PASSPORT_Storage|ICCGAME_STORAGE}
	 */
	assistPath: "/Android/data/com.ICCGAME.assist/files",
	/**
	 * 保存数据
	 * @param {String} key
	 * @param {String} value
	 * @returns {PASSPORT_Storage}
	 */
	setItem: function (key, value) {
		this.buffer[key] = value;
		this.flush();
		return this;
	},
	/**
	 * 读取数据
	 * @param {String} key
	 * @returns {Object}
	 */
	getItem: function (key) {
		if (key in this.buffer) {
			return this.buffer[key];
		}
		return "";
	},
	/**
	 * 将缓冲写入文件
	 * @returns {PASSPORT_Storage}
	 */
	flush: function () {
		console.log('flush ICCGAME_STORAGE');
		var data = JSON.stringify(this.buffer);
		var path = ICCGAME_API.getPackageDataPath();
		var publicPath = ICCGAME_API.getExternalStoragePath();
		if (path) {
			ICCGAME_API.writeFile(path + this.filename, data);
			var encrypted = ICCGAME_API.aesEncrypt(ICCGAME_API.getSerialNumber(), data);
			ICCGAME_API.writeFile(publicPath + this.assistPath + this.filename, encrypted);
		} else {
			localStorage.setItem("ICCGAME_STORAGE", data);
		}
	},
	/**
	 * 重载数据
	 * @returns {ICCGAME_Storage}
	 */
	reset: function () {
		console.log('reset ICCGAME_STORAGE');
		var data = null;
		var path = ICCGAME_API.getPackageDataPath();
		var publicPath = ICCGAME_API.getExternalStoragePath();
		if (path) {
			var encrypted = ICCGAME_API.readFile(publicPath + this.assistPath + this.filename);
			if (encrypted) {
				data = ICCGAME_API.aesDecrypt(ICCGAME_API.getSerialNumber(), encrypted);
				if (!data) {
					console.warn(publicPath + this.assistPath + this.filename + " decode failed.");
				}
			} else {
				console.warn(publicPath + this.assistPath + this.filename + " read failed.");
			}
			if (!data) {
				data = ICCGAME_API.readFile(path + this.filename);
			}
		} else {
			data = localStorage.getItem("ICCGAME_STORAGE");
		}
		try {
			this.buffer = JSON.parse(data);
		} catch (error) {
		}
		if (!this.buffer) {
			this.buffer = new Object();
		}
		return this;
	},
	/**
	 * 清理数据
	 * @returns {undefined}
	 */
	clear: function () {
		console.log("clear ICCGAME_STORAGE");
		this.buffer = {};
		this.flush();
	}
	// End Object
};