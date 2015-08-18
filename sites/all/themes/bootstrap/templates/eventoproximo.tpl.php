  <?php
  $i = 1;
  foreach ($output as $id => $node):
    ?>
   <h3 class="no-top-margin no-bottom-margin"><?php print 'En ' . t(date('F', strtotime($node->detalle->fecha_desde))) ?></h3>
  <?php
    $i++;
    if ($i == 2) {
      break;
    }
    ?>
<?php endforeach; ?>  


<div class=" eventoproximo ">
  <?php
  $i = 1;
  foreach ($output as $id => $node):
    ?>
    <a href="<?php print url('node/' . $node->nid); ?>">
      <div class="col-sm-12 col-xs-6 item item-<?php print $i++; ?>">
        <div class="item-proximo-img">        
          <img height="100" src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">               
        </div>
        <div class="detalles">
          <p class="evento-nombre"><?php print $node->title; ?></p>
          <p class="evento-fecha-escenario">
            <b><?php print date('M d · H\hi', strtotime($node->detalle->fecha_desde)) ?></b>
            <?php print $node->detalle->escenario->title; ?>
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