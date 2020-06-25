/* global VersionControl */

/**
 * 版本控制
 *
 * @returns {VersionControl.Loader}
 */
VersionControl.prototype.Loader = function () {
	/**
	 * 处于加载中的线程数量
	 *
	 * @type Number
	 */
	this.actives = 0;
	/**
	 * 加载成功的脚本
	 *
	 * @type Array
	 */
	this.scripts = null;
	/**
	 * 加载完成回调
	 *
	 * @type Function
	 */
	this.callback = null;
};

/**
 * 加载脚本
 * @param {Object} scripts
 * @param {Function} callback
 * @returns {undefined}
 */
VersionControl.prototype.Loader.prototype.load = function (scripts, callback) {
	// 不能反复加载
	if (this.actives > 0) {
		throw "loader busy.";
	}
	// 回调函数
	this.callback = callback;
	// 初始容器
	this.scripts = new Array();
	// 遍历 类型/链接
	for (var t in scripts) {
		for (var i in  scripts[t]) {
			this.loadScript(t, scripts[t][i]);
		}
	}
};

/**
 * 开始载入单个脚本
 * @param {String} scriptType
 * @param {String} scriptURL
 * @returns {undefined}
 */
VersionControl.prototype.Loader.prototype.loadScript = function (scriptType, scriptURL) {
	console.log("load " + scriptType + " scripts " + scriptURL);
	// 添加标记
	this.actives++;
	// 初始结构
	var item = {
		no: this.actives,
		type: scriptType,
		code: null
	};
	// 初始指针
	this.scripts.push(item);
	// 异步加载
	$.ajax({
		cache: false,
		context: this,
		//crossDomain: true,
		dataType: "text",
		complete: function () { // 标识进度
			this.actives--;
			if (this.actives > 0) {
				return;
			}
			// 回调方法
			this.callback && this.callback(this.getLoadedCodes());
		},
		success: function (data) {// 保存脚本
			item.code = data;
		},
		url: scriptURL
	});
};

/**
 * 分类合并已经下载完成的代码
 * @returns {Object|Boolean}
 */
VersionControl.prototype.Loader.prototype.getLoadedCodes = function () {
	// 代码排序
	this.scripts.sort(function (a, b) {
		if (a.no > b.no) {
			return 1;
		}
		return -1;
	});
	// 导出代码
	var codes = new Object();
	for (var i in this.scripts) {
		// 缩短指针
		var code = this.scripts[i].code;
		var type = "CODE_" + this.scripts[i].type;
		// 判断结果
		if (code === null) {
			return false;
		}
		// 追加数据
		if (type in codes === false) {
			codes[type] = "";
		}
		codes[type] += "\r\n\r\n" + $.trim(code);
	}
	return codes;
};