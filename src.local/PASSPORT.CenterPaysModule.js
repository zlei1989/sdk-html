/* global ICCGAME_API, PASSPORT, ICCGAME_PASSPORT */

/**
 * 构造函数
 * @param {jQuery} element
 * @type {PASSPORT.CenterPaysModule}
 */
PASSPORT.CenterPaysModule = function (element) {
	// 属性赋值
	this.element = $(element);
	// 快速取消
	this.obstructCancel = false;
	// 加载起始偏移
	this.loadOffset = 0;
	// 加载单次行数
	this.loadLength = 40;
	// 捆绑事件
	this.on(this.element.find(".button.cancel, a[href=\"#cancel\"]"), "touchend click", this.eventHanders.cancel);
	this.on(this.element.find(".content"), "scroll", this.eventHanders.scroll);
	this.on(document.body, "ICC_MyPays", this.eventHanders.ICC_MyPays, true);
};

/**
 * 继承父类
 * @type PASSPORT.ModuleAbstract
 */
PASSPORT.CenterPaysModule.prototype = new PASSPORT.ModuleAbstract();

/**
 * 检查状态
 * @returns {Number}
 */
PASSPORT.CenterPaysModule.prototype.isValid = function () {
	console.log("center pays check status");
	if (!this.session.acctIsPlaying) {
		return -3107;
	}
	return 0;
};

/**
 * 开始运行
 * @returns {undefined}
 */
PASSPORT.CenterPaysModule.prototype.refresh = function () {
	console.log("pays clear");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("pays locked");
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
PASSPORT.CenterPaysModule.prototype.load = function () {
	console.log("pays loading");
	var $ul = this.element.find(".content ol");
	if ($ul.is(".loading")) {
		console.log("pays locked");
		return;
	}
	if ($ul.is(".full")) {
		console.log("pays load full");
		return;
	}
	// 添加标记
	$ul.removeClass("error").addClass("loading");
	// 开始载入
	this.session.loadPays(this.loadOffset, this.loadLength);
};

/**
 * 事件响应
 * @returns {undefined}
 */
PASSPORT.CenterPaysModule.prototype.eventHanders = {
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
	ICC_MyPays: function (event, items, offset, length, count) {
		console.log("pays append");
		var $ul = this.element.find(".content ol");
		if (offset + length >= count) {
			$ul.addClass("full");
		}
		// 逐行追加
		for (var i in items) {
			var $li = $("<li>").attr("data-pay_uuid", items[i].pay_uuid);
			var $h5 = $("<h5></h5>").text(items[i].pay_trade_no);
			var $p1 = $("<p></p>");
			var $span1 = $("<span class=\"pay_content\"></span>").text(items[i].pay_content);
			$p1.append($span1);
			var $p2 = $("<p></p>");
			var $span2 = $("<span class=\"pay_amount\"></span>").text((items[i].pay_amount / 100).toFixed(2));
			$p2.append($span2);
			var $p3 = $("<p></p>");
			var $span3 = $("<span class=\"pay_created\"></span>").text(time2Str(items[i].pay_created));
			var $span4 = $("<span class=\"game_name\"></span>").text(items[i].pay_game_name);
			var $span5 = $("<span class=\"pay_result v" + items[i].pay_result + "\"></span>");
			$p3.append($span3).append($span4).append($span5);
			$li.append($h5).append($p1).append($p2).append($p3);
			$ul.append($li);
		}
		// 修改偏移
		this.loadOffset = offset + length;
		// 标记完成
		$ul.removeClass("loading");
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