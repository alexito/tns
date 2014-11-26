(function($) {
  Drupal.behaviors.tns_main_settings = {
    attach: function(context, settings) {
      $(window).load(function() {
        console.log('okok')
//        $('.carousel').carousel({
//          interval: 1000
//        });
      });
    }
  };
  $(document).ready(function() {

  });
})(jQuery);
