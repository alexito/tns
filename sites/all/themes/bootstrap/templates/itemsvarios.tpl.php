
<div class="itemsvarios row">
  <?php
  foreach ($output as $id => $node):
    ?>
    <?php if($node->type != 'patrocinador' && $node->type != 'fotos_y_videos'){ ?>
    <a href="<?php print url('node/' . $node->nid); ?>">
    <?php }elseif ($node->type == 'fotos_y_videos') {      ?>
    <a href="/<?php print strtolower($node->field_img_vid_tipo[LANGUAGE_NONE][0]['value']); ?>">
    <?php }else{?>
    <a href="<?php print $node->field_url[LANGUAGE_NONE][0]['value']; ?>" target="blank">
    <?php }?>
      <div class="col-sm-3 col-xs-6 item item-<?php print $id; ?>">
        <div class="item-varios-img">
        <?php if($node->type != 'convocatorias_noticias' && $node->type != 'fotos_y_videos') {?>        
          <img height="120" src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">               
        <?php } else { ?>
          <img height="120" src="<?php print file_create_url($node->field_imagen_menu['und'][0]['uri']); ?>" alt="...">
        <?php }?>
        </div>
        <div class="detalles">

        <?php if($node->type != 'patrocinador' && $node->type != 'convocatorias_noticias' && $node->type != 'fotos_y_videos'){ ?>
          <p class="evento-nombre"><?php print (strlen($node->title) > 40) ? substr($node->title, 0, 40) . '...' : $node->title; ?></p>
          <p class="evento-fecha"><b><?php print date('M d · H\hi', strtotime($node->detalle->fecha_desde)) ?></b></p>
          <p class="evento-escenario"><?php print $node->detalle->escenario->title->value(); ?></p>
        <?php }else{?>
          <p class="evento-nombre centrado"><b><?php print (strlen($node->title) > 40) ? substr($node->title, 0, 40) . '...' : $node->title; ?></b></p>
        <?php }?>
        </div>
      </div>
    </a>
<?php endforeach; ?>
</div>