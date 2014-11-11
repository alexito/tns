<script type="text/javascript">
	jQuery(document).ready(function() {
		jQuery('#b-slider').bslider({'showControles' : false});
		jQuery('#b-slider').bslider('startShow');
	});
</script>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <h1><?= render($title) ?></h1>
  <div class="row">
	<div class="span16">
		<?php
		if(!empty($node->field_photos_photo)){
		?>
		<div id="b-slider">
			<div class="b-slider-preview">
				<ul class="b-slider-grid">
					<?php
						foreach($node->field_photos_photo['und'] as $imgRaw){
							echo '<li><a href="'.image_style_url('bootstrap_large_1280x853', $imgRaw['uri']).'">';
							echo '<img title="'.$imgRaw['title'].'" data-b-slider-main-url="'.image_style_url('bootstrap_large_930x620', $imgRaw['uri']).'" src="'.image_style_url('bootstrap_square_thumbnail_90x90', $imgRaw['uri']).'" />';
							echo '</a></li>';
						}
					?>
				</ul>
			</div>
		</div>
		<?php
		}
		?>
		<?php
			$body = bootstrap_getFieldValue($node, 'body');
			if($body){
				echo $body[0];
		    }
		?>
		<?php
		    // Remove the "Add new comment" link on the teaser page or if the comment
		    // form is being displayed on the same page.
		    if ($teaser || !empty($content['comments']['comment_form'])) {
		      unset($content['links']['comment']['#links']['comment-add']);
		    }
		    // Only display the wrapper div if there are links.
		    $links = render($content['links']);
		    if ($links):
		  ?>
		    <div class="link-wrapper">
		      <?php print $links; ?>
		    </div>
		  <?php endif; ?>

		  <?php print render($content['comments']); ?>
	</div>
  </div>
</div>