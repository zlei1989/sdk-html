/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterEventsModule}
 */
PASSPORT.CenterEventsModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 缓存有效时间
	this.cacheExpire = 60 * 5 * 1000;
	// 最后加载时间
	this.lastUpdated = 0;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".content ol"), "touchend click", this.eventHanders.click);
	this.on(this.element.find(".evnt-viewer"), "touchend click", this.eventHanders.clickCloseViewer);
	this.on(document.body, "ICC_MyEvents", this.eventHanders.ICC_MyEvents, true);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterEventsModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterEventsModule.prototype.isValid = function () {
	console.log("center events check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.CenterEventsModule.prototype.refresh = function () {
	var now = (new Date()).getTime();
	if (now - this.lastUpdated > this.cacheExpire) {
		console.log("events expire");
		this.lastUpdated = now;
		this.reload();
	}
	this.element.find(".evnt-viewer.show").removeClass("show");
};

/**
 *
 * @returns {undefined}
 */
PASSPORT.CenterEventsModule.prototype.reload = function () {
	console.log("events clear");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("events locked");
		return;
	}
	this.load();
};


/**
 *
 * @returns {undefined}
 */
PASSPORT.CenterEventsModule.prototype.load = function () {
	console.log("events loading");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("events locked");
		return;
	}
	// 添加标记
	$ul.removeClass("error").addClass("loading");
	// 开始载入
	this.session.loadEvents();
};

/**
 * 关闭窗口
 * @returns {undefined}
 */
PASSPORT.CenterEventsModule.prototype.cancel = function () {
	var $viewer = this.element.find(".evnt-viewer");
	if ($viewer.is(".show")) {
		$viewer.removeClass("show");
		return this;
	}
	return PASSPORT.ModuleAbstract.prototype.cancel.call(this);
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.CenterEventsModule.prototype.eventHanders = {
	/**
	 * 刷新信息
	 * @param {jQuery.Event} event
	 * @param {Array} items
	 * @returns {undefined}
	 */
	ICC_MyEvents: function (event, items) {
		// 缓存指针
		var $ul = this.element.find(".content ol");
		// 清空内容
		$ul.empty();
		// 逐项绘制
		for (var i in items) {
			// 逐行追加
			var $li = $("<li>").attr("data-evnt_uuid", items[i].evnt_uuid)
					.data("evnt_start_time", items[i].evnt_start_time)
					.data("evnt_description", items[i].evnt_description)
					.data("evnt_name", items[i].evnt_name);
			var $span = $("<span></span>").text(time2ShortStr(items[i].evnt_start_time));
			var $h5 = $("<h5></h5>").text(items[i].evnt_name);
			var $p = $("<p></p>").text(html2text(items[i].evnt_description));
			$h5.append($span);
			$li.append($h5);
			$li.append($p);
			$ul.append($li);
		}
	},
	/**
	 * 点击查看
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	click: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		var $li = $(event.target).closest("li[data-evnt_uuid]");
		if ($li.length !== 1) {
			return;
		}
		// 打开链接
		var evnt_description = $li.data("evnt_description");
		var evnt_start_time = $li.data("evnt_start_time");
		var evnt_name = $li.data("evnt_name");
		//
		this.element.find(".evnt-viewer h2").text(evnt_name);
		this.element.find(".evnt-viewer .evnt_start_time").html(time2Str(evnt_start_time));
		this.element.find(".evnt-viewer .evnt_description").empty().html(evnt_description);
		this.element.find(".evnt-viewer").addClass("show");
		// 打开链接
		this.element.find(".evnt-viewer .evnt_description a").on("touchend click", this.eventHanders.clickTagA);
	},
	/**
	 * 关闭消息显示
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	clickCloseViewer: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		if ($(event.target).is(".evnt-viewer") === false) {
			return;
		}
		this.cancel();
	},
	/**
	 *
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	clickTagA: function (event) {
		// 中断系统事件
		if (this.clickEventStopPropagation(event) !== true) {
			return;
		}
		// 外部调用
		ICCGAME_API.openBrowser($(event.target).attr("href"));
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