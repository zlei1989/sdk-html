/* global ICCGAME_API, ICCGAME_PASSPORT, ICCGAME_VERIFY */

/**
 * 验证身份操作
 * @type {ICCGAME_VERIFY}
 */
ICCGAME_VERIFY = {
	/**
	 * 视图指针
	 * @type jQuery
	 */
	element: null,
	/**
	 * 请求标识
	 * @type String
	 */
	id: null,
	/**
	 * 请求信息
	 * @type String
	 */
	request: null,
	/**
	 *
	 * @returns {Number}
	 */
	wait: 0,
	/**
	 *
	 * @type Number
	 */
	lastSent: 0,
	/**
	 * 生成视图代码
	 * @returns {String}
	 */
	createHTML: function () {
		return "<div class=\"overlay-black\">"
				+ "<form class=\"verify-owner\">"
				+ "<h2>验证您的<span><!--邮箱|手机--></span></h2>"
				+ "<h3><span>?</span><a href=\"#send\"><!--获取验证码|60秒后重发|重发验证码--></a></h3>"
				+ "<input type=\"number\" placeholder=\"请输入验证码\"/>"
				+ "<div><a href=\"#cancel\">取消</a><a href=\"#submit\" class=\"disabled\">确定</a></div>"
				+ "</form>"
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
		this.element.find("a[href=\"#send\"]").on("click", this.eventHanders.clickSend);
		this.element.find("a[href=\"#cancel\"]").on("click", this.eventHanders.clickCancel);
		this.element.find("a[href=\"#submit\"]").on("click", this.eventHanders.clickSubmit);
		this.element.find(":input").on("keyup", this.eventHanders.keyup);
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
		var val = parseInt(this.getElement().find(":input").val());
		if (isNaN(val)) {
			return 0;
		}
		return val;
	},
	/**
	 * 清理输入
	 * @returns {undefined}
	 */
	clearInput: function () {
		// 缩短指针
		var $that = this.getElement().find(":input");
		// 清空内容
		$that.val("").keyup();
		// 设定焦点
		setTimeout(function () {
			$that.focus();
		}, 100);
	},
	/**
	 * 重置
	 * @returns {undefined}
	 */
	reset: function () {
		// 重置界面
		this.getElement().find("h3 a").removeClass("disabled").text("获取验证码");
		// 重置缓存
		this.wait = 0;
	},
	/**
	 * 发送随机数字
	 * @param {Boolan|undefined} decrease
	 * @returns {undefined}
	 */
	send: function (decrease) {
		if (decrease) {
			if (this.wait > 0) {
				var that = this;
				setTimeout(function () {
					that.send(true);
				}, 1000);
				this.getElement().find("h3 a")
						.addClass("disabled").text(this.wait + "秒后重发");
				this.wait--;
			} else {
				this.getElement().find("h3 a.disabled")
						.removeClass("disabled").text("重发验证码");
			}
		} else if (this.wait === 0) {
			// 设置时间
			this.wait = 60;
			// 开始递减
			this.send(true);
			// 发送验证码
//			if ($.now() - this.lastSent > 60 * 1000) {
			ICCGAME_PASSPORT.session.verifyOwner(this.id, this.request);
//			}
		}
	},
	/**
	 * @param {String} id
	 * @param {String} recipient
	 * @param {String} request
	 * @returns {undefined}
	 */
	open: function (id, request, recipient) {
		// 初始图形
		this.getElement().find("h2 span").text(recipient.indexOf("@") > -1 ? "邮箱" : "手机");
		this.getElement().find("h3 span").text(recipient);
		// 属性缓存
		this.id = id;
		this.request = request;
		// 初始显示
		this.reset();
		this.clearInput();
		// 显示动画
		var that = this;
		setTimeout(function () {
			that.getElement().addClass("show").css("zIndex", $.now());
			setTimeout(function () {
				that.getElement().find(":input").focus();
			}, 200);
		}, 99);
		// 锁定响应
		$(document.body).addClass("lock");
	},
	/**
	 *
	 * @param {type} event
	 * @returns {undefined}
	 */
	close: function (event) {
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
		 * 刷新确定按钮
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		keyup: function (event) {
			var $button = ICCGAME_VERIFY.getElement().find("a[href=\"#submit\"]");
			($(event.currentTarget).val() === "") ?
					$button.addClass("disabled") : $button.removeClass("disabled");
		},
		/**
		 * 发送验证码
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		clickSend: function (event) {
			// 中断系统事件
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			// 震动设备
			ICCGAME_API.vibrate();
			// 发送验证码
			ICCGAME_VERIFY.send();
			// 清理输入框
			ICCGAME_VERIFY.clearInput();
		},
		/**
		 * 取消验证
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		clickCancel: function (event) {
			// 中断系统事件
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			// 震动设备
			ICCGAME_API.vibrate();
			// 关闭窗口
			ICCGAME_VERIFY.close();
		},
		/**
		 * 提交随机数字
		 * @param {jQuery.Event} event
		 * @returns {undefined}
		 */
		clickSubmit: function (event) {
			// 中断系统事件
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			// 震动设备
			ICCGAME_API.vibrate();
			// 发送请求
			ICCGAME_PASSPORT.session.verifyOwner(ICCGAME_VERIFY.id, ICCGAME_VERIFY.request, ICCGAME_VERIFY.getInput());
		}
		// End eventHanders
	}
	// End Class
};