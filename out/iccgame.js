$(function () {

	/**
	 * 提交表单
	 */
	$("form").on("submit", function (event) {
		var $form = $(event.currentTarget);
		var url = $form.attr("action");
		$.ajax({
			beforeSend: function () {
				$(window).addClass("busy");
			},
			cache: false,
			context: this,
			complete: function (jqXHR, textStatus) {
				$(window).removeClass("busy");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$(window).trigger('ICC_Exception', [this, {
						code: -2099,
						message: null,
						type: null
					}]);
			},
			data: $form,
			dataType: 'json',
			method: 'post',
			success: function (data, textStatus) {
				for (var i in data) {
					var event = data[i].name;
					var params = null;
					if (data[i].args instanceof Array === false) {
						params = [data[i].args];
					} else {
						params = data[i].args;
					}
					params.unshift(this);
					$(window).trigger(event, params);
				}
			},
			url: url
		});
		event.preventDefault();
	});


	// Loaded Event End
});