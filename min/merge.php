<?php

// Decline timezone
ini_get('date.timezone') || date_default_timezone_set('Asia/Shanghai');

// 设定运行目录
chDir(dirName(__DIR__));

// 实例对象
$sdk = new SDK();
$codes = $sdk->getLocalCodes();
$sdk->write($codes);

// 结束脚本
exit;

class SDK {

	/**
	 * 内嵌模板
	 */
	const TPL = <<<HTML
<!DOCTYPE html>
<html>
	<head>
		<title>ICCGAME</title>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
		<meta name="format-detection" content="email=no"/>
		<meta name="format-detection" content="telephone=no"/>
		<script>/* LOCAL_CODES */</script>
		<script>
			// 执行代码
			if (localStorage["CODE_BOOTSTRAP"]) {
				console.log("run cache bootstrap");
				window.eval(localStorage["CODE_BOOTSTRAP"]);
			} else {
				console.log("run local bootstrap");
				window.eval(window.CODE_BOOTSTRAP);
			}
			// 初始调用
			if ("ICCGAME_VersionControl" in window === false) {
				window.ICCGAME_VersionControl = new VersionControl();
				window.ICCGAME_VersionControl.bootstrap();
			}
		</script>
	</head><body oncontextmenu="return false"></body>
</html>
HTML;

	/**
	 *
	 */
	const VERSION_FORMAT = '{"version":%d,"scripts":{"BOOTSTRAP":["src/CODE_BOOTSTRAP.min.js"],"HTML":["src/CODE_HTML.min.html"],"JAVASCRIPT":["src/CODE_JAVASCRIPT.min.js"]},"compatiable":%d}';

	/**
	 * 最小兼容版本
	 * @var int
	 */
	public $compatiable = 201;

	/**
	 * 类库地址
	 * @var array
	 */
	public $labraryPaths = [
		'src.local/jquery/jquery.js',
		'src.local/jquery/jquery.md5.js',
	];

	/**
	 * 版本地址
	 * @var string
	 */
	public $versionPath = 'version.local.json';

	/**
	 * 获得本地代码
	 */
	public function getLocalCodes() {
		// 版本信息
		$version = $this->getVersion();
		// 连接代码
		$bootstrap_o = $this->loadCode($version['scripts']['BOOTSTRAP']);
		$javascript = $this->loadCode($version['scripts']['JAVASCRIPT']);
		$html = $this->loadCode($version['scripts']['HTML']);
		// 替换版本
		list($v, $c) = [$version['release']['version'], $version['release']['compatiable']];
		$patterns = [
			'/(^\s*this\.version\s*=)\s*0/m', '/(^\s*this\.compatiable\s*=)\s*0/m',
		];
		$replacements = [
			'\\1 ' . $v, '\\1 ' . $c,
		];
		$bootstrap = preg_replace($patterns, $replacements, $bootstrap_o);
		// 重载代码
		$codes = [];
		$codes['CODE_BOOTSTRAP'] = $bootstrap;
		$codes['CODE_JAVASCRIPT'] = $javascript;
		$codes['CODE_HTML'] = $html;
//		$codes['CODE_BOOTSTRAP'] = $this->minJS($bootstrap);
//		$codes['CODE_JAVASCRIPT'] = $this->minJS($javascript);
//		$codes['CODE_HTML'] = $this->minHTML($html);
		return $codes;
	}

	/**
	 *
	 * @param array $codes
	 * @return type
	 */
	public function clearCodes(array &$codes, $tag = 'debug') {
		$codes['CODE_JAVASCRIPT'] = preg_replace(
				'/\/\*\*\s*(#if\s+for\s+' . $tag . ')\s+begin\s*\*\/(.*?)\/\*\*\s*\1\s+end\s*\*\//ms', //patterns
				'', $codes['CODE_JAVASCRIPT']);
		$codes['CODE_HTML'] = preg_replace(
				'/<!--\s*(#if\s+for\s+' . $tag . ')\s+begin\s*-->(.*?)<!--\s*\1\s+end\s*-->/ms', //patterns
				'', $codes['CODE_HTML']);
		return $codes;
	}

	/**
	 *
	 * @param array $codes
	 * @return type
	 */
	public function minCodes(array &$codes) {
		$codes['CODE_BOOTSTRAP'] = $this->minJS(trim($codes['CODE_BOOTSTRAP']));
		$codes['CODE_JAVASCRIPT'] = $this->minJS(trim($codes['CODE_JAVASCRIPT']));
		$codes['CODE_HTML'] = $this->minHTML(trim($codes['CODE_HTML']));
	}

	/**
	 *
	 * @param array $codes
	 */
	public function write(array $codes) {
		// 清理调试代码
		$this->clearCodes($codes, 'debug');
		// 拷贝多份代码
		$all_codes = $codes;
//		$ios_codes = $codes;
		// 清理安卓代码
//		$this->clearCodes($ios_codes, 'android');
		// 压缩大小
		$this->minCodes($all_codes);
//		$this->minCodes($ios_codes);
		// 写入文件
		file_put_contents('src/CODE_BOOTSTRAP.min.js', $all_codes['CODE_BOOTSTRAP']);
		file_put_contents('src/CODE_JAVASCRIPT.min.js', $all_codes['CODE_JAVASCRIPT']);
		file_put_contents('src/CODE_HTML.min.html', $all_codes['CODE_HTML']);
		// 合成脚本
		$format = '%svar sdk_local_codes=%s;for(var i in sdk_local_codes)window[i]=sdk_local_codes[i];';
		$code = $this->getLabraries();
		$all_code = sprintf($format, $code, json_encode($all_codes, JSON_UNESCAPED_UNICODE));
		file_put_contents('index.html', trim(str_replace('/* LOCAL_CODES */', $all_code, static::TPL)));
//		$ios_code = sprintf($format, $code, json_encode($ios_codes, JSON_UNESCAPED_UNICODE));
//		file_put_contents('index.ios.html', trim(str_replace('/* LOCAL_CODES */', $ios_code, static::TPL)));
		// 合成配置
		$v_matches = $c_matches = null;
		preg_match('/this\.version=(\d+);/', $all_codes['CODE_BOOTSTRAP'], $v_matches);
		preg_match('/this\.compatiable=(\d+);/', $all_codes['CODE_BOOTSTRAP'], $c_matches);
		file_put_contents('version.json', sprintf(static::VERSION_FORMAT, $v_matches[1], $c_matches[1]));
	}

	public function writeIos(array $codes) {
		$this->minCodes($codes);
		// 压缩大小
		$local_codes = array_map('trim', $codes);
		// 合成脚本
		$format = 'var sdk_local_codes=%s;for(var i in sdk_local_codes)window[i]=sdk_local_codes[i];';
		$code = $this->getLabraries();
		$code .= sprintf($format, json_encode($local_codes, JSON_UNESCAPED_UNICODE));
		file_put_contents('index.ios.html', trim(str_replace('/* LOCAL_CODES */', $code, static::TPL)));
	}

	/**
	 *
	 * @return string
	 */
	public function getLabraries() {
		$code = '';
		foreach ($this->labraryPaths as $path) {
			$code .= file_get_contents($path);
		}
		return $this->minJS($code);
	}

	/**
	 *
	 * @param array $files
	 * @return string
	 */
	public function loadCode(array $files) {
		$scripts = '';
		foreach ($files as $file) {
			$scripts .= file_get_contents(dirname(__DIR__) . '/' . $file);
			$scripts .= "\r\n";
		}
		return $scripts;
	}

	/**
	 *
	 * @return array
	 */
	public function getVersion() {
		return json_decode(file_get_contents($this->versionPath), true);
	}

	/**
	 *
	 * @param string $code
	 * @return string
	 */
	public function minHTML($code) {
		return preg_replace(['/^\s+/m', '/\s+$/m', '/^\/\/.*?$/m', '/\r/'], '', $code);
	}

	/**
	 *
	 * @param string $code
	 * @return string
	 */
	public function minJS($code) {
		$min = false;
		$params = [];
		$params[] = $this->getJavaPath();
		$params[] = '-jar';
		$params[] = realpath(__DIR__ . '/yuicompressor-2.4.8.jar');
		$params[] = '--type';
		$params[] = 'js';
		$params[] = '--charset';
		$params[] = 'utf-8';
		$params[] = '--preserve-semi';
		$cmd = implode(' ', array_map('escapeshellarg', $params));
		$descriptorspec = array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'));
		$cwd = realpath('.');
		$pipes = null;
		$other_options = null;
		if (strcasecmp(PHP_OS, 'WinNT') === 0) {
			$other_options = array('bypass_shell' => true);
		}
		$process = proc_open($cmd, $descriptorspec, $pipes, $cwd, null, $other_options);
		if (is_resource($process)) {
			fwrite($pipes[0], $code);
//			file_put_contents("code.txt", $code);
			fclose($pipes[0]);
			$min = stream_get_contents($pipes[1]);
			fclose($pipes[1]);
			$num = proc_close($process);
			if ($num !== 0) {
				return '';
			}
		}
		return $min;
	}

	/**
	 *
	 * @return boolean|string
	 */
	public function getJavaPath() {
		if (strcasecmp(PHP_OS, 'WinNT') === 0) {
			$dir = getenv('ProgramFiles') . DIRECTORY_SEPARATOR . 'java';
			if (is_dir($dir) === false) {
				return false;
			}
			$paths = scandir($dir, SCANDIR_SORT_DESCENDING);
			$java = $dir . DIRECTORY_SEPARATOR . $paths[0] . DIRECTORY_SEPARATOR . 'bin' . DIRECTORY_SEPARATOR . 'java.exe';
			if (is_file($java)) {
				return $java;
			}
			return false;
		}
		$output = `whereis -b java`;
		$paths = trim(substr($output, strpos($output, ':') + 1));
		if (empty($paths)) {
			return false;
		}
		$bins = explode(' ', $paths);
		return $bins[0];
	}

	// End Class
}

function toCONF($code) {
	$base64 = base64_encode($code);
	echo sprintf("size:%d, hash:%s\r\n", strlen($base64), md5($base64));
	$fields = [
		'remoteUrl' => 'http://sdk.m.iccgame.com/html5-v2/index.html?game_id=3001&ad_id=0&site_id=2',
		'localCode' => $base64,
	];
	return json_encode($fields, JSON_UNESCAPED_UNICODE);
}
