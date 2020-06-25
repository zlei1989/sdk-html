2015-08-28 version 1
基础版本

2015-09-02 version 2
修正试玩提示“账号不存在”
修正试玩提示“记录已经存在”


// 提供 事件
weixin_result, data = [string code, string message]; // 微信支付完成触发冒泡事件
alipay_result, data = [int code, string message]; // 支付宝支付完成触发冒泡事件
receive_acct_data, data = [int trigger, object data]; // 提交游戏角色数据

// 提供 方法
PASSPORT.login(function callback); // 唤出登录
PASSPORT.register(function callback); // 唤出注册
PASSPORT.pay(string tradeInfo, function callback); // 唤出支付
PASSPORT.center(function callback); // 唤出账号中心
PASSPORT.logout(function callback); // 唤出注销确认对话框
PASSPORT.exit(function callback); // 唤出退出确认对话框
PASSPORT.setAssistiveTouchState(boolean enabled); // 浮标显隐状态切换

// 在线文档
http://sdk.m.iccgame.com/document/

// 在线内核
http://sdk.m.iccgame.com/html5-v2/