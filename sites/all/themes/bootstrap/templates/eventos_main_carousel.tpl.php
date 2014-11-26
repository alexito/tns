<div class="home-slider">
  <div id="home-slider" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <?php $i = 0; 
    foreach ($nodes as $id => $node): ?>
    <li data-target="#home-slider" data-slide-to="<?php print $i++; ?>" class=""></li>
    <?php endforeach; ?>
  </ol>
  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <!-- Slide #1 -->
    <?php
    $i = 1;
    foreach ($nodes as $id => $node): ?>
    <div class="item <?php if($i == 1) {print 'active';} ?>" id="item-<?php print $i++; ?>">
      
        <div class="container">
          <div class="row">
            <div class="col-sm-4">
              <div class="home-slider__content">
                <h1 class="first-child animated slideInDown delay-2"><?php print $node->title; ?></h1>
                <h3 class="animated slideInDown delay-3">Beautiful Theme That Works Out Of The Box</h3>
                <p class="text-muted animated slideInLeft delay-4"><?php print $node->body[LANGUAGE_NONE][0]['value']; ?></p>
                <!--<a href="#" class="btn btn-lg btn-theme-primary animated fadeInUpBig delay-5">Purchase Now</a>-->
              </div>
            </div>
          </div> <!-- / .row -->
        </div> <!-- / .container -->
        <div class="bg-img hidden-xs">
          <img src="<?php print file_create_url($node->field_imagen_del_evento['und'][0]['uri']); ?>" alt="...">
        </div>
      
    </div> <!-- / .item -->
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