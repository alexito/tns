<hr>
<div class="row">
  <div class="col-sm-12">
    <h4>Galería</h4>
    <?php foreach ($output as $id => $img): ?>
      <div class="col-md-3 col-sm-4 col-xs-6 fotos-mini">
        <a href="<?php print file_create_url($img['rendered']['#item']['uri']); ?>" data-lightbox="fotos">
          <img  src="<?php print file_create_url($img['rendered']['#item']['uri']); ?>" class="img-responsive" alt="...">
        </a>
      </div>
    <?php endforeach; ?>
  </div>
</div>