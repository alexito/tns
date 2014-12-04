<h3 class="no-top-margin">Evento:</h3>
<div class="container eventoproximo no-padding">
  <?php
  $i = 1;
  foreach ($output as $id => $node):
    ?>
    <a href="<?php print url('node/' . $node->nid); ?>">
      <div class="col-sm-12 col-xs-6 item item-<?php print $i++; ?>">
        <div>        
          <img height="100" src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">               
        </div>
        <div class="detalles">
          <p class="evento-nombre"><?php print $node->title; ?></p>
          <p class="evento-fecha-escenario">
            <b><?php print date('M d · H\hi', strtotime($node->detalle->fecha_desde)) ?></b>
            <?php print $node->detalle->escenario->title->value(); ?>
          </p>          
        </div>
      </div>
    </a>
    <?php
    if ($i == 2) {
      break;
    }
    ?>
<?php endforeach; ?>  
</div>