<?php ?>
<header id="navbar" role="banner" class="<?php print $navbar_classes; ?>">
  <div class="container">
    <div class="navbar-header">
      <?php if ($logo): ?>
        <a class="logo navbar-btn pull-left" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>">
          <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
        </a>
      <?php endif; ?>

      <div class="container custom-header-buttons col-sm-8 pull-right hidden-xs">
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link cafeteatro"></div></a></div> 
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link casafundacion"></div></a></div>
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link plaza"></div></a></div>
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link ccmc"></div></a></div>
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link variedades"></div></a></div>
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link mexico"></div></a></div>
        <div class="col-sm-1 pull-right"><a href="#"><div class="custom-img-link teatrosucre"></div></a></div>
      </div>
    </div>




  </div>



  <div class="container">
    <div class="navbar-header">
      <?php if (!empty($primary_nav) || !empty($secondary_nav) || !empty($page['navigation'])): ?>
        <div class="navbar-collapse collapse">
          <nav role="navigation">
            <?php if (!empty($primary_nav)): ?>
              <?php print render($primary_nav); ?>
            <?php endif; ?>
            <?php if (!empty($secondary_nav)): ?>
              <?php //print render($secondary_nav); ?>
            <?php endif; ?>
            <?php if (!empty($page['navigation'])): ?>
              <?php print render($page['navigation']); ?>
            <?php endif; ?>
          </nav>
        </div>
      <?php endif; ?>
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
  </div>
</header>

<div class="main-container container">

  <header role="banner" id="page-header">
    <?php if (!empty($site_slogan)): ?>
      <p class="lead"><?php print $site_slogan; ?></p>
    <?php endif; ?>

    <?php print render($page['header']); ?>
  </header> <!-- /#page-header -->

  <div class="row">

    <?php if (!empty($page['sidebar_first'])): ?>
      <aside class="col-sm-3" role="complementary">
        <?php print render($page['sidebar_first']); ?>
      </aside>  <!-- /#sidebar-first -->
    <?php endif; ?>

    <section<?php print $content_column_class; ?>>
      <?php if (!empty($page['highlighted'])): ?>
        <div class="highlighted jumbotron"><?php print render($page['highlighted']); ?></div>
      <?php endif; ?>
      <?php
      if (!empty($breadcrumb)): print $breadcrumb;
      endif;
      ?>
      <a id="main-content"></a>
      <?php print render($title_prefix); ?>
      <?php if (!empty($title)): ?>
        <h1 class="page-header"><?php print $title; ?></h1>
      <?php endif; ?>
      <?php print render($title_suffix); ?>
      <?php print $messages; ?>
      <?php if (!empty($tabs)): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>
      <?php if (!empty($page['help'])): ?>
        <?php print render($page['help']); ?>
      <?php endif; ?>
      <?php if (!empty($action_links)): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>
<?php print render($page['content']); ?>
    </section>

      <?php if (!empty($page['sidebar_second'])): ?>
      <aside class="col-sm-3" role="complementary">
      <?php print render($page['sidebar_second']); ?>
      </aside>  <!-- /#sidebar-second -->
<?php endif; ?>

  </div>
</div>
<footer class="footer container text-center">
<?php //print render($page['footer']);    ?>
  <div class="row">
    <div class="col-sm-12">
      <div class="col-sm-2"><a href="#">¿Cómo llegar?</a></div>
      <div class="col-sm-1"><a href="#"> Nos Apoyan</a></div>
      <div class="col-sm-2"><a href="#"> Convocatorias / Noticias</a></div>
      <div class="col-sm-2"><a href="#"> Mapa del Sitio</a></div>
      <div class="col-sm-1"><a href="#"> RSS</a></div>
      <div class="col-sm-1"><a href="#"> Prensa</a></div>
      <div class="col-sm-1"><a href="#"> Puntos de Venta</a></div>
      <div class="col-sm-2"><a href="#"> Cuentanos tu opinión</a></div>
    </div>
    <hr><br>
    <div class="col-sm-12 copyright">
      Todos los derechos reservados © 2014. Fundación Teatro Nacional Sucre
    </div>
  </div>
</footer>