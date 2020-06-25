/* global ICCGAME_STORAGE, PASSPORT, ICCGAME_API */

/**
 * 初始玩家数据
 */
if ("ICCGAME_STORAGE" in window === false) {
	throw "class ICCGAME_STORAGE not exists.";
}
ICCGAME_STORAGE.reset();

/**
 * 历史 SDK 版本兼容
 */
var acct_name = localStorage.getItem("acct_name");
if (acct_name) {
	// 拷贝数据
	var acct_password = localStorage.getItem("acct_password");
	var acct_login_persisted = parseInt(localStorage.getItem("acct_remain_login")) === 1 ? true : false;
	// 清除历史
	localStorage.clear();
	// 重写数据
	ICCGAME_STORAGE.setItem("acct_name", acct_name);
	ICCGAME_STORAGE.setItem("acct_password", acct_password);
	ICCGAME_STORAGE.setItem("acct_login_persisted", acct_login_persisted);
	// 清理在原
	delete acct_password;
	delete acct_login_persisted;
	// 重载程序
	location.reload();
}
// 清理资源
delete acct_name;

/**
 * 初始程序
 */
if ("PASSPORT" in window === false) {
	throw "class PASSPORT not exists.";
}
ICCGAME_PASSPORT = new PASSPORT();
ICCGAME_PASSPORT.init();

/**
 * 错误捕获
 * @param {Error} msg
 * @returns {undefined}
 */
window.onerror = function (msg) {
	setTimeout(function () {
		try {
			ICCGAME_API.alert(msg);
		} catch (exc) {
		}
	}, 500);
};

/**
 * 绑定模块
 */
ICCGAME_PASSPORT
		.addModule("push", new PASSPORT.PushModule("#push")) // 弹窗
		.addModule("login", new PASSPORT.LoginModule("#login")) // 登录
		.addModule("forget_password", new PASSPORT.ForgetPasswordModule("#forget-password")) // 忘记密码
		.addModule("register", new PASSPORT.RegisterModule("#register")) // 注册/转正
		.addModule("center", new PASSPORT.CenterModule("#center")) // 账号管理
		.addModule("center_events", new PASSPORT.CenterEventsModule("#center-events")) // 活动
		.addModule("center_messages", new PASSPORT.CenterMessagesModule("#center-messages")) // 活动
		.addModule("center_pays", new PASSPORT.CenterPaysModule("#center-pays")) // 支付日志
		.addModule("center_set_id", new PASSPORT.CenterSetIdModule("#center-set-id")) // 选项
		.addModule("center_settings", new PASSPORT.CenterSettingsModule("#center-settings")) // 选项
		.addModule("center_modify_email", new PASSPORT.CenterModifyEmailModule("#center-modify-email")) // 修改邮箱
		.addModule("center_modify_password", new PASSPORT.CenterModifyPasswordModule("#center-modify-password")) // 修改密码
		.addModule("center_modify_phone", new PASSPORT.CenterModifyPhoneModule("#center-modify-phone")) // 修改手机
		.addModule("pay", new PASSPORT.PayModule("#pay")) // 支付
		.addModule("browser", new PASSPORT.BrowserModule("#browser")) // 浏览器
		.addModule("about", new PASSPORT.AboutModule("#about")) // 关于
		.addModule("logout", new PASSPORT.LogoutModule("#logout")) // 注销
		.addModule("exit", new PASSPORT.ExitModule("#exit")); // 退出