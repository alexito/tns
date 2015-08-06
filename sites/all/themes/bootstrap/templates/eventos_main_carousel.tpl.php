<div class="home-slider">
  <!--<div id="home-slider" class="carousel slide" data-ride="carousel">-->
  <div id="home-slider" class="carousel slide" data-ride="carousel" data-interval="8000">
    <!-- Indicators -->
    <ol class="carousel-indicators">
      <?php $i = 0;
      foreach ($nodes as $id => $node):
        ?>
        <li data-target="#home-slider" data-slide-to="<?php print $i++; ?>" class=""></li>
        <?php if ($i == 7) {
          break;
        } ?>
<?php endforeach; ?>
    </ol>
    <!-- Wrapper for slides -->
    <div class="carousel-inner">
      <!-- Slide #1 -->
<?php
$i = 1;
foreach ($nodes as $id => $node):
  ?>
        <div class="item <?php if ($i == 1) {
    print 'active';
  } ?>" id="item-<?php print $i++; ?>">

          <div class="container">
            <div class="row">
              <div class="col-sm-4 col-lg-3">
                <div class="home-slider__content">
                  <h1 class="first-child animated slideInDown delay-2 hidden-sm hidden-md hidden-lg slider-title"><?php
                  print l((strlen($node->title) > 60) ? substr($node->title, 0, 60) . '...' : $node->title, 'node/' . $node->nid);
                  ?></h1>
                  <h1 class="first-child animated slideInDown delay-2 hidden-xs slider-title"><?php
                  print l((strlen($node->title) > 30) ? substr($node->title, 0, 30) . '...' : $node->title, 'node/' . $node->nid);
                  ?></h1>
                  <h3 class="animated slideInDown delay-3 slider-escenario"><?php print $node->detalle->escenario->title->value(); ?></h3>
                  <h5 class="animated slideInDown delay-3 slider-direccion"><?php print $node->detalle->escenario->field_ubicacion->value(); ?></h5>
                    <?php
                    $detalle_evento = strip_tags($node->body[LANGUAGE_NONE][0]['value']);
                    ?>
                  <p class="text-muted animated slideInLeft delay-4 hidden-sm hidden-md hidden-lg slider-descripcion">
                    <?php
                    print (strlen($detalle_evento) > 300) ? substr($detalle_evento, 0, 300) . '...' : $detalle_evento;
                    ?>
                  </p>
                  <p class="text-muted animated slideInLeft delay-4 hidden-xs slider-descripcion">
                    <?php
                    print (strlen($detalle_evento) > 150) ? substr($detalle_evento, 0, 150) . '...' : $detalle_evento;
                    ?>
                  </p>

  <?php print l('Ver más', 'node/' . $node->nid, array('attributes' => array('class' => 'btn btn-lg btn-theme-primary animated fadeInUpBig delay-4'))); ?>
                </div>
              </div>
            </div> <!-- / .row -->
          </div> <!-- / .container -->
          <div class="bg-img hidden-xs">
            <a href="/node/<?php print($node->nid) ?>">
              <img src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">
            </a>
          </div>

        </div> <!-- / .item -->
  <?php if ($i == 7) {
    break;
  } ?>
<?php endforeach; ?>
    </div> <!-- / .carousel -->
    <!-- Controls -->
    <a class="carousel-arrow carousel-arrow-prev" href="#home-slider" data-slide="prev">
      <i class="fa fa-angle-left"></i>
    </a>
    <a class="carousel-arrow carousel-arrow-next" href="#home-slider" data-slide="next">
      <i class="fa fa-angle-right"></i>
    </a>
  </div>
</div>