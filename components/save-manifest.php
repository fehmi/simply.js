<?php
	$name = $_GET["name"];
	$manifest = $_GET["manifest"];
	$manifest = json_decode($manifest);
	$manifest = json_encode($manifest, JSON_PRETTY_PRINT);
	file_put_contents($name . ".json", $manifest);
	echo "saved";
?>