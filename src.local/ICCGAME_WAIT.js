/**
 * 后台繁忙等待界面
 * @type {ICCGAME_WAIT}
 */
ICCGAME_WAIT = {
	/**
	 * 视图指针
	 */
	element: null,
	/**
	 * 生成视图代码
	 * @returns {String}
	 */
	createHTML: function () {
		return "<div class=\"overlay-white wait\">"
				+ "<ul></ul>"
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
		this.element = $(this.createHTML());
		$(document.body).append(this.element);
		return this.element;
	},
	/**
	 * 添加气泡
	 * @param {String} tipId
	 * @returns {ICCGAME_WAIT.prototype}
	 */
	addTip: function (tipId) {
		this.getElement().find("ul").append("<li id=\"" + tipId + "\">载入中...</li>");
		this.getElement().addClass("show").css("zIndex", $.now());
		return this;
	},
	/**
	 * 删除气泡
	 * @param {String} tipId
	 * @returns {ICCGAME_WAIT.prototype}
	 */
	removeTip: function (tipId) {
		this.getElement().find("li[id=\"" + tipId + "\"]").remove();
		if (this.getElement().find("li").length < 1) {
			this.getElement().removeClass("show");
		}
		return this;
	}
	// End Class
};