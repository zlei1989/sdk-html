<?php

$resources_path = __DIR__ . '/resources/';

if (is_dir($resources_path) == false) {
	exit('folder not exists');
}

$fields = [];
if ($dh = opendir($resources_path)) {
	while (($file = readdir($dh)) !== false) {
		$filename = $resources_path . $file;
		if (is_file($filename) === false) {
			continue;
		}
		$base64 = base64_encode(file_get_contents($filename));
		file_put_contents($filename.'.base64' ,$base64);
	}
	closedir($dh);
}