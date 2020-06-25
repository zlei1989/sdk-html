/* global PASSPORT, ICCGAME_API */


/**
 * 创建请求参数
 *
 * @param {String} controller
 * @param {String} action
 * @returns {Object}
 */
PASSPORT.Session.prototype.newFields = function (controller, action) {
	var fields = new Object();
	// 基本属性
	fields["dev_hash"] = ICCGAME_API.getDevHash();
	fields["dev_network_type"] = ICCGAME_API.getNetworkType();
	fields["from_ad_id"] = ICCGAME_API.getFromAdId();
	fields["from_site_id"] = ICCGAME_API.getFromSiteId();
	fields["game_id"] = ICCGAME_API.getGameId();
	fields["package_name"] = ICCGAME_API.getPackageName();
	fields["package_signature_hash"] = ICCGAME_API.getPackageSignatureHash();
	fields["package_version"] = ICCGAME_API.getPackageVersion();
	fields["version"] = ICCGAME_API.getVersion();
	// 追加参数
	this.sessionContext && (fields["sessn_context"] = this.sessionContext);
	this.sessionCAPTCHA && (fields["sessn_captcha"] = this.sessionCAPTCHA);
	// 追加参数
	controller && (fields["module"] = controller);
	action && (fields["do"] = action);
	return fields;
};

/**
 * 发送请求
 * @param {Object} data
 * @param {Boolean} silent
 * @returns {String}
 */
PASSPORT.Session.prototype.ajaxPost = function (data, silent) {
	// 作用范围
	var requestId = "ajax-" + $.now().toString();
	// 发出请求
	$.ajax({
		beforeSend: function () {
			console.log("ajax start. " + requestId);
			silent || $(this).trigger("ICC_AjaxStart", [requestId]);
			$(this).trigger("ICC_AjaxBeforeSend", [requestId]);
		},
		cache: false,
		complete: function (jqXHR, textStatus) {
			console.log("ajax stop. " + requestId);
			silent || $(this).trigger("ICC_AjaxStop", [requestId, textStatus]);
			$(this).trigger("ICC_AjaxComplete", [requestId, textStatus]);
		},
		context: document.body,
		crossDomain: true,
		error: function (jqXHR, textStatus, errorThrown) {
			console.warn("ajax error. " + requestId);
			try {
				res = JSON.parse(jqXHR.responseText);
				$(this).trigger("ICC_Exception", [{
						code: res.code,
						data: res.data,
						message: res.data.message,
						type: res.data.type
					}]);
			} catch (err) {
				jqXHR.status || $(this).trigger("ICC_Exception", [{
						code: -2099,
						data: data,
						message: textStatus,
						type: null
					}]);
			}
			$(this).trigger("ICC_AjaxError", [requestId, textStatus, errorThrown]);
		},
		global: false,
		data: data,
		dataType: "json",
		method: "post",
		success: function (res, textStatus) {
			console.log("ajax success. " + requestId);
			$(this).trigger("ICC_AjaxSuccess", [requestId, textStatus, res]);
			var data = res.data;
			for (var i in data) {
				var event = data[i].name;
				var params = null;
				if (data[i].args instanceof Array === false) {
					params = [data[i].args];
				} else {
					params = data[i].args;
				}
				console.log("dispatch " + event + " event");
				$(this).trigger(event, params);
			}
		},
		timeout: 5000,
		url: this.interfaceURL
	});
	console.log("ajax created. " + requestId);
	// 返回标识
	return requestId;
};