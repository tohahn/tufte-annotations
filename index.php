<!DOCTYPE html>
<html>
	<head>
		<!-- technical -->
		<link rel="stylesheet" href="tufte.css"/>
		<meta charset="UTF-8">
	</head>
	<body>
	<article>
		<h1>Mitschriften, Notizen, Protokolle etc.</h1>
		<h2>Artikel</h2>
		<?php
			$dir = "./artikel";
			$files = array_diff(scandir($dir), array('..', '.'));

			$metas = array();
			foreach ($files as $file) {
				$meta = get_meta_tags($dir . "/" . $file);
				$meta['filename'] = $dir . "/" . $file;
				$metas[] = $meta;
			}

			function compare_date($a, $b) {
				return strnatcmp($a['date'], $b['date']);
			}

			usort($metas, 'compare_date');

			foreach ($metas as $meta) {
				echo 	"<p>
					<a href='" . $meta['filename'] . "'>" . $meta['date'] . " - " . $meta['title'] . "</a>
					</p>";
			}
		?>
	</article>
	</body>
</html>
