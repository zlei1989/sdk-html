/* global ICCGAME_API, ICCGAME_CAPTCHA, ICCGAME_PASSPORT */

/**
 * 验证人工操作
 * @type {ICCGAME_CAPTCHA}
 */
ICCGAME_CAPTCHA = {
	/**
	 * 视图指针
	 * @type jQuery
	 */
	element: null,
	/**
	 * 请求信息
	 * @type String
	 */
	cipherRequest: null,
	/**
	 * 回掉函数
	 * @type Function
	 */
	callback: null,
	/**
	 *
	 * @returns {Number}
	 */
	wait: 0,
	/**
	 * 生成视图代码
	 * @returns {String}
	 */
	createHTML: function () {
		return  "<div class=\"overlay-white\">"
				+ "<div class=\"CAPTCHA\">"
				+ "<h2>请按顺序选择上方出现的文字</h2>"
				+ "<ul><li><span></span><li><span></span><li><span></span><li><span></span><li><span></span><li><span></span><li><span></span><li><span></span></ul>"
				+ "<a href=\"#reset\" class=\"icon black icon-reset\"></a>"
				+ "</div>"
				+ "</div>";
	},
	/**
	 * 获得视图指针
	 * @returns {jQuery}
	 */
	getElement: function () {
		if (this.element) {
			return this.element;
		}
		// 初始界面
		this.element = $(this.createHTML());
		// 绑定事件
		this.element.find("li").on("click", this.eventHanders.click);
		this.element.find("a[href=\"#reset\"]").on("click", this.eventHanders.clickReset);
		// 输出显示
		$(document.body).append(this.element);
		// 返回结果
		return this.element;
	},
	/**
	 * 获得验证输入
	 * @returns {Number}
	 */
	getInput: function () {
		var values = new Array();
		this.getElement().find(".checked").each(function () {
			var matches = (this.className.match(/sort-(\d+)/));
			values[matches[1]] = $(this).index();
		});
		return values.join("");
	},
	/**
	 * 清理输入
	 * @returns {undefined}
	 */
	clearInput: function () {
		this.getElement().find("li[class]").removeAttr("class");
	},
	/**
	 * 重置
	 * @returns {undefined}
	 */
	reset: function () {
		var $that = this.getElement().find(".CAPTCHA");
		if ($that.is(".loading")) {
			return;
		}
		$that.addClass("loading");
		$that.find("img").fadeOut(function () {
			$(this).remove();
		});
		var img = new Image();
		img.onload = function () {
			$that.prepend($(img).fadeIn());
			$that.removeClass("loading");
		};
		// 开始载入
		img.src = "/?module=GAME.Sessions.Captcha&captcha_id=" + this.id + "&_" + new Date().getTime();
	},
	/**
	 * 打开面板
	 * @param {String} id
	 * @param {String} request
	 * @returns {undefined}
	 */
	open: function (id, request) {
		// 属性缓存
		this.id = id;
		this.request = request;
		// 初始显示
		this.reset();
		this.clearInput();
		// 显示动画
		var that = this;
		setTimeout(function () {
			// 清理内容
			that.getElement().remove("img");
			// 显示图层
			that.getElement().addClass("show").css("zIndex", new Date().getTime());
			// 收起输入法
			setTimeout(function () {
				$(":input:focus").blur();
			}, 200);
		}, 99);
		// 锁定响应
		$(document.body).addClass("lock");
	},
	/**
	 *
	 * 关闭面板
	 * @returns {undefined}
	 */
	close: function () {
		// 隐藏界面
		this.getElement().removeClass("show");
		// 解除锁定
		$(document.body).removeClass("lock");
	},
	/**
	 * 事件处理方法
	 * @type Object
	 */
	eventHanders: {
		/**
		 * 点击刷新
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		clickReset: function (event) {
			// 中断系统事件
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			// 震动效果
			ICCGAME_API.vibrate();
			// 清理内容
			ICCGAME_CAPTCHA.clearInput();
		},
		/**
		 * 点击按钮
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		click: function (event) {
			// 中断系统事件
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			var $that = $(event.currentTarget);
			if ($that.is("checked")) {
				return;
			}
			var sort = $that.siblings(".checked").length;
			if (sort > 3) {
				return;
			}
			// 播放动画
			$that.addClass("checked sort-" + sort);
			// 震动效果
			ICCGAME_API.vibrate();
			// 提交请求
			if (sort >= 3) {
				setTimeout(function () {
					// 发送验证码
					ICCGAME_PASSPORT.session.CAPTCHA(
							ICCGAME_CAPTCHA.id, ICCGAME_CAPTCHA.request, ICCGAME_CAPTCHA.getInput()
							);
				}, 200);
			}
		}

		// End eventHanders
	}
	// End Class
};