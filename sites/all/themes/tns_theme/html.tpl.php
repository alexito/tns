<!DOCTYPE html>
<html>
	<head>
		<?= $head ?>
		<title><?= $head_title ?></title>
		<?= $styles ?>
		<?= $scripts ?>
		<script type="text/javascript">
			jQuery(document).ready(function() {
				jQuery('.showlogin').click(function(){
					jQuery('.showlogin').hide();
					jQuery('#horizontal-login-block').show();
				});
			});
		</script>
		<?php if(theme_get_setting('ga_use') and theme_get_setting('ga_ua')){
			if($user->uid == 0 or theme_get_setting('ga_login')){
				?>
				<script type="text/javascript">

				  var _gaq = _gaq || [];
				  _gaq.push(['_setAccount', '<?= theme_get_setting('ga_ua') ?>']);
				  _gaq.push(['_trackPageview']);

				  (function() {
				    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
				  })();

				</script>
				<?php	
			}
		} ?>
	</head>
	<body class="<?= $classes ?>" <?= $attributes ?>>
		<?= $page_top ?>
		<?= $page ?>
		<?= $page_bottom ?>
	</body>
</html>