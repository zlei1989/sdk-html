/* global ICCGAME_API, PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.PushModule}
 */
PASSPORT.PushModule = function (element) {
	// 继承父类
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 加载标识
	this.loadId = false;
	// 载入结果
	this.loaded = false;
	// 当前时机
	this.occasion = false;
	// 推动内容
	this.pushes = new Array();
	// 推送完成列表
	this.pushedItems = this.readPushedItems();
	// 显示界面
	this.showUI = false;
	// 捆绑事件
	this.on(this.element.find("a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(document.body, "ICC_AjaxComplete", this.eventHanders.ICC_AjaxComplete, true);
	this.on(document.body, "ICC_MyPushes", this.eventHanders.ICC_MyPushes, true);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.PushModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 结束运行
 * @returns {undefined}
 */
PASSPORT.PushModule.prototype.enter = function () {
	console.log(this.objName + " enter");
	// 初始加载数据
	this.loadId || (this.loadId = this.session.loadPushes());
	// 检查加载完成
	if (this.loaded === false) {
		return this;
	}
	// 显示事件
	var that = this;
	setTimeout(function () {
		that._enter();
	}, 99);
	return this;
};

/**
 * 结束运行
 * @returns {PASSPORT.LoginModule.prototype}
 */
PASSPORT.PushModule.prototype.leave = function () {
	console.log(this.objName + " leave");
	this.element.removeClass("active").css("zIndex", "");
	this.element.removeClass("show");
	if (this.showUI) {
		ICCGAME_API.finishActivity();
	}
	this.showUI = false;
	return this;
};

/**
 *
 * @returns {undefined}
 */
PASSPORT.PushModule.prototype._enter = function () {
	if (this.occasion in this.pushes === false || this.pushes[this.occasion].length < 1) {
		if (this.backModules.length > 0) {
			this.cancel();
		} else {
			this.triggerHandler(0).leave();
		}
		return this;
	}
	var messages = this.pushes[this.occasion];
	// 权重排序
	messages.sort(this.sort);
	// 记录推送
	this.addPushed(messages[0].push_uuid);
	// 更新显示
	this.element.find("h2").text(messages[0].push_subject);
	this.element.find(".content").html(text2html(messages[0].push_content));
	// 弹出窗口
	ICCGAME_API.createActivity();
	this.element.addClass("show");
	this.showUI = true;
};

/**
 *
 * @returns {Object}
 */
PASSPORT.PushModule.prototype.readPushedItems = function () {
	var pushed = localStorage.getItem("ICCGAME_PUSHES");
	if (pushed) {
		try {
			pushed = JSON.parse(pushed);
		} catch (err) {
		}
	}
	pushed || (pushed = new Object());
	return pushed;
};

/**
 *
 * @param {Object} pushed
 * @returns {Boolean}
 */
PASSPORT.PushModule.prototype.savePushedItems = function (pushed) {
	if (typeof (pushed) !== "object") {
		return false;
	}
	var items = [];
	for (var i in pushed) {
		items.push([i, pushed[i]]);
	}
	items.sort(function (l, r) {
		return l[1][1] - r[1][1];
	});
	pushed = new Object();
	for (var i = 0; i < 8 && i < items.length; i++) {
		pushed[items[i][0]] = items[i][1];
	}
	localStorage.setItem("ICCGAME_PUSHES", JSON.stringify(pushed));
	return true;
};

/**
 * 是否推送终止
 * @param {String} push_uuid
 * @param {String} push_times
 * @returns {undefined}
 */
PASSPORT.PushModule.prototype.isPushed = function (push_uuid, push_times) {
	if (push_uuid in this.pushedItems === false) {
		return false;
	}
	if (this.pushedItems[push_uuid][0] < push_times) {
		return false;
	}
	return true;
};

/**
 * 添加推送记录
 * @param {String} push_uuid
 * @returns {undefined}
 */
PASSPORT.PushModule.prototype.addPushed = function (push_uuid) {
	if (push_uuid in this.pushedItems) {
		this.pushedItems[push_uuid][0]++;
	} else {
		this.pushedItems[push_uuid] = [1, $.now()];
	}
	this.savePushedItems(this.pushedItems);
};

/**
 * 排序算法
 * @param {Object} l
 * @param {Object} r
 * @returns {Boolean}
 */
PASSPORT.PushModule.prototype.sort = function (l, r) {
	// 权重左侧
	var lWeight = l.push_times;
	var rWeight = r.push_times;
	(lWeight > 9) && (lWeight = 9);
	(rWeight > 9) && (rWeight = 9);
	(lWeight === 0) && (lWeight = 10);
	(rWeight === 0) && (rWeight = 10);
	lWeight = (10 - lWeight) * 10;
	rWeight = (10 - rWeight) * 10;
	(l.push_end_time > r.push_end_time) && (rWeight++);
	(l.push_end_time < r.push_end_time) && (lWeight++);
	return rWeight > lWeight;
};


/**
 * 事件响应
 * @returns {Object}
 */
PASSPORT.PushModule.prototype.eventHanders = {
	/**
	 * 我的推送数据载入成功
	 * @param {jQuery.Event} event
	 * @param {Array} pushes
	 * @returns {undefined}
	 */
	ICC_MyPushes: function (event, pushes) {
		// 取消事件
		this.off(event.type, this.eventHanders.ICC_MyPushes);
		// 循环导出
		for (var i in pushes) {
			var occasion = pushes[i].push_occasion;
			var keys = [];
			while (occasion > 0) {
				keys.push((1 & occasion) === 1);
				occasion >>= 1;
			}
			for (var k in keys) {
				if (keys[k] === false) {
					continue;
				}
				if (k in this.pushes === false) {
					this.pushes[k] = new Array();
				}
				if (pushes[i].push_times > 0
						&& this.isPushed(pushes[i].push_uuid, pushes[i].push_times)
						) {
					continue;
				}
				this.pushes[k].push(pushes[i]);
			}
		} // End For pushes
	},
	/**
	 * 数据载入完成
	 * @param {jQuery.Event} event
	 * @param {String} requestId
	 * @returns {undefined}
	 */
	ICC_AjaxComplete: function (event, requestId) {
		if (this.loadId !== requestId) {
			return;
		}
		// 取消事件
		this.off(event.type, this.eventHanders.ICC_AjaxComplete);
		// 标记状态
		this.loaded = true;
		// 显示窗口
		var that = this;
		setTimeout(function () {
			that._enter();
		}, 99);
	},
	/**
	 * 事件回调
	 * 取消注册/转正操作
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