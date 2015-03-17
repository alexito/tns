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
		<p>Skrevet den <?= date( "j/n Y H:i",$node->created) ?> af <?= $node->name ?></p>
		<?php
		$tag_list = array();
		if($node->field_blog_tags['und']){
			foreach($node->field_blog_tags['und'] as $term){
				$tag_list[] = $term["taxonomy_term"]->name;
			}
		}
		?>
		<p><strong>Tags:</strong> <?= implode(', ', $tag_list) ?></p>
	</div>
  </div>
  <div class="row">
	<div class="span16">
		<?php
			$body = bootstrap_getFieldValue($node, 'body');
			if($body){
				echo $body[0];
		    }
		?>
	</div>
  </div>
  <div class="row">
	<div class="span16">
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