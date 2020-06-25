/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterMessagesModule}
 */
PASSPORT.CenterMessagesModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 缓存有效时间
	this.cacheExpire = 60 * 5 * 1000;
	// 最后加载时间
	this.lastUpdated = 0;
	// 加载起始偏移
	this.loadOffset = 0;
	// 加载单次行数
	this.loadLength = 40;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".content ol"), "touchend click", this.eventHanders.click);
	this.on(this.element.find(".content"), "scroll", this.eventHanders.scroll);
	this.on(this.element.find(".msg-viewer"), "touchend click", this.eventHanders.clickCloseViewer);
	this.on(document.body, "ICC_MyMessage", this.eventHanders.ICC_MyMessage);
	this.on(document.body, "ICC_MyMessages", this.eventHanders.ICC_MyMessages, true);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterMessagesModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterMessagesModule.prototype.isValid = function () {
	console.log("center messages check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.CenterMessagesModule.prototype.refresh = function () {
	var now = (new Date()).getTime();
	if (now - this.lastUpdated > this.cacheExpire) {
		console.log("messages expire");
		this.lastUpdated = now;
		this.reload();
	}
	this.element.find(".msg-viewer.show").removeClass("show");
};

/**
 *
 * @returns {undefined}
 */
PASSPORT.CenterMessagesModule.prototype.reload = function () {
	console.log("messages clear");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("messages locked");
		return;
	}
	$ul.removeClass("full").empty();
	this.loadOffset = 0;
	this.load();
};

/**
 *
 * @returns {undefined}
 */
PASSPORT.CenterMessagesModule.prototype.load = function () {
	console.log("messages loading");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("messages locked");
		return;
	}
	if ($ul.is(".full")) {
		console.log("messages load full");
		return;
	}
	// 添加标记
	$ul.removeClass("error").addClass("loading");
	// 开始载入
	this.session.loadMessages(this.loadOffset, this.loadLength);
};

/**
 * 关闭窗口
 * @returns {undefined}
 */
PASSPORT.CenterMessagesModule.prototype.cancel = function () {
	var $viewer = this.element.find(".msg-viewer");
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
PASSPORT.CenterMessagesModule.prototype.eventHanders = {
	/**
	 * 屏幕滚动
	 * @param {jQuery.Event} event
	 * @returns {undefined}
	 */
	scroll: function (event) {
		var span = event.currentTarget.scrollHeight - event.currentTarget.scrollTop;
		if (span <= event.currentTarget.offsetHeight) {
			this.load();
		}
	},
	/**
	 * 刷新信息
	 * @param {jQuery.Event} event
	 * @param {Array} items
	 * @param {Number} offset
	 * @param {Number} length
	 * @param {Number} count
	 * @returns {undefined}
	 */
	ICC_MyMessages: function (event, items, offset, length, count) {
		console.log("messages append");
		var $ul = this.element.find(".content ol");
		if (offset + length >= count) {
			$ul.addClass("full");
		}
		// 逐行追加
		for (var i in items) {
			var $li = $("<li>").attr("data-msg_uuid", items[i].msg_uuid);
			var $span = $("<span></span>").text(time2ShortStr(items[i].msg_created));
			var $h5 = $("<h5></h5>").text(items[i].msg_subject);
			var $p = $("<p></p>").text(items[i].msg_body);
			$h5.append($span);
			$li.append($h5);
			$li.append($p);
			if (items[i].msg_clicked === null) {
				$li.addClass("unclick");
			}
			$ul.append($li);
		}
		// 修改偏移
		this.loadOffset = offset + length;
		// 标记完成
		$ul.removeClass("loading");
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
		var $li = $(event.target).closest("li[data-msg_uuid]");
		if ($li.length !== 1) {
			return;
		}
		var msg_uuid = $li.attr("data-msg_uuid");
		// 打开内容
		this.session.loadMessage(msg_uuid);
		// 标记已读
		if ($li.is(".unclick") === false) {
			return;
		}
		console.log("message open " + msg_uuid);
		$li.removeClass("unclick");
		this.session.modifyMessageClick(msg_uuid);
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
		if ($(event.target).is(".msg-viewer") === false) {
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
	 * 显示消息
	 * @param {jQuery.Event} event
	 * @param {Object} msg
	 * @returns {undefined}
	 */
	ICC_MyMessage: function (event, msg) {
		this.element.find(".msg-viewer h2").text(msg.msg_subject);
		this.element.find(".msg-viewer .msg_created").html(time2Str(msg.msg_created));
		this.element.find(".msg-viewer .msg_body").empty().html(msg.msg_body);
		this.element.find(".msg-viewer").addClass("show");
		// 打开链接
		this.element.find(".msg-viewer .msg_body a").on("touchend click", this.eventHanders.clickTagA);
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