<hr>
<div class="itemsvarios container">
  <?php
  $i = 1;
  foreach ($output as $id => $node):
    if($i == 1){
      $i++;
      continue;
    }
    ?>
    <a href="<?php print url('node/' . $node->nid); ?>">
      <div class="col-sm-3 col-xs-6 item item-<?php print $i++; ?>">
        <div>        
          <img height="120" src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">               
        </div>
        <div class="detalles">
          <p class="evento-nombre"><?php print $node->title; ?></p>
          <p class="evento-fecha"><b><?php print date('M d · H\hi', strtotime($node->detalle->fecha_desde)) ?></b></p>
          <p class="evento-escenario"><?php print $node->detalle->escenario->title->value(); ?></p>
        </div>
      </div>
    </a>
    <?php
    if ($i == 4) {
      break;
    }
    ?>
<?php endforeach; ?>
  <a href="#">
    <div class="col-sm-3 col-xs-6 item">
      <i class="fa fa-camera"></i>
      <div class="detalles">
        <p class="evento-nombre">Galería de Imágenes</p>
      </div>
    </div>
  </a>
  <a href="#">
    <div class="col-sm-3 col-xs-6 item">
      <i class="fa fa-video-camera"></i>
      <div class="detalles">
        <p class="evento-nombre">Galería de Videos</p>
      </div>
    </div>
  </a>
</div>