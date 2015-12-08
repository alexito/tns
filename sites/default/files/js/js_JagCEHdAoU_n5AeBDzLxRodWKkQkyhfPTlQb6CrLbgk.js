Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Hubo un error HTTP AJAX.","HTTP Result Code: !status":"C\u00f3digo de Resultado HTTP: !status","An AJAX HTTP request terminated abnormally.":"Una solicitud HTTP de AJAX termin\u00f3 de manera anormal.","Debugging information follows.":"A continuaci\u00f3n se detalla la informaci\u00f3n de depuraci\u00f3n.","Path: !uri":"Ruta: !uri","StatusText: !statusText":"StatusText: !statusText","ResponseText: !responseText":"ResponseText: !responseText","ReadyState: !readyState":"ReadyState: !readyState","All":"Todo(s)","Show shortcuts":"Mostrar atajos","Hide shortcuts":"Ocultar atajos","Re-order rows by numerical weight instead of dragging.":"Reordenar las filas por peso num\u00e9rico en lugar de arrastrar.","Show row weights":"Mostrar pesos de la fila","Hide row weights":"Ocultar pesos de la fila","Drag to re-order":"Arrastre para reordenar","Changes made in this table will not be saved until the form is submitted.":"Los cambios realizados en esta tabla no se guardar\u00e1n hasta que se env\u00ede el formulario","Hide":"Ocultar","Show":"Mostrar","Edit":"Editar","Add":"Agregar","Default":"Predeterminado","Key":"Clave","Customize dashboard":"Personalizar panel de control","Not published":"No publicado","(active tab)":"(solapa activa)","Enabled":"Activado","Configure":"Configurar","Next":"Siguiente","Cancel":"Cancelar","Remove":"Eliminar","Disabled":"Desactivado","none":"ninguno","Sunday":"Domingo","Monday":"Lunes","Tuesday":"Martes","Wednesday":"Mi\u00e9rcoles","Thursday":"Jueves","Friday":"Viernes","Saturday":"S\u00e1bado","Done":"Hecho","OK":"OK","This field is required.":"Este campo es obligatorio.","Prev":"Previo","Mon":"Lun","Tue":"Mar","Wed":"Mi\u00e9","Thu":"Jue","Fri":"Vie","Sat":"S\u00e1b","Sun":"Dom","January":"Enero","February":"Febrero","March":"Marzo","April":"Abril","May":"Mayo","June":"Junio","July":"Julio","August":"Agosto","September":"Septiembre","October":"Octubre","November":"Noviembre","December":"Diciembre","Select all rows in this table":"Seleccionar todas las filas de esta tabla","Deselect all rows in this table":"Quitar la selecci\u00f3n a todas las filas de esta tabla","Today":"Hoy","Jan":"Ene","Feb":"Feb","Mar":"Mar","Apr":"Abr","Jun":"Jun","Jul":"Jul","Aug":"Ago","Sep":"Sep","Oct":"Oct","Nov":"Nov","Dec":"Dic","Su":"Do","Mo":"Lu","Tu":"Ma","We":"Mi","Th":"Ju","Fr":"Vi","Sa":"Sa","Please wait...":"Espere, por favor...","mm\/dd\/yy":"mm\/dd\/yy","By @name on @date":"Por @name en @date","By @name":"Por @name","Not in menu":"No est\u00e1 en un men\u00fa","Alias: @alias":"Alias: @alias","No alias":"Sin alias","New revision":"Nueva revisi\u00f3n","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"Los cambios sobre estos bloques no se guardar\u00e1n hasta que no pulse el bot\u00f3n \u003Cem\u003EGuardar bloques\u003C\/em\u003E.","No revision":"Sin revisi\u00f3n","@number comments per page":"@number comentarios por p\u00e1gina","Requires a title":"Necesita un t\u00edtulo","Not restricted":"Sin restricci\u00f3n","Not customizable":"No personalizable","Restricted to certain pages":"Restringido a algunas p\u00e1ginas","The block cannot be placed in this region.":"El bloque no se puede colocar en esta regi\u00f3n.","Hide summary":"Ocultar resumen","Edit summary":"Editar resumen","Don\u0027t display post information":"No mostrar informaci\u00f3n del env\u00edo","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"El archivo seleccionado %filename no puede ser subido. Solo se permiten archivos con las siguientes extensiones: %extensions.","Autocomplete popup":"Ventana emergente con autocompletado","Searching for matches...":"Buscando coincidencias","Submit":"Enviar","Value":"Valor","Select":"Seleccionar","Other":"Otro(s)","Loading...":"Cargando...","all":"todo","An error occurred":"Sucedi\u00f3 un error","Add file":"Agregar archivo"}} };;

/* see Issue "autoresize" http://drupal.org/node/360549 */
(function ($) {
  Drupal.behaviors.iframeModule = {
    attach: function(context, settings) {
      $('iframe.autoresize').each(function() {
        try {
          $(this)[0].contentWindow.onload = function() {
            $(this)[0].frameElement.style.height = ($(this)[0].document.body.scrollHeight) + 'px';
            $(this)[0].frameElement.scrolling = 'no';
          };
          $(this)[0].contentWindow.frameElement.style.height = ($(this)[0].contentWindow.document.body.scrollHeight) + 'px';
          $(this)[0].contentWindow.frameElement.scrolling = 'no';
        } catch (e) {
          elem = $(this)[0];
          msg = $('<p><small>(' + Drupal.t('IFrame URL is not from the same domain - autoresize not working.') + ')</small></p>');
          $(elem).after(msg);
        }
      });
    }
  }
})(jQuery);


;
// $Id: jquery.drilldown.js,v 1.1.2.10.2.1 2010/09/16 18:40:02 yhahn Exp $

/**
 * Generic menu drilldown plugin for standard Drupal menu tree markup.
 * The plugin should be inited against a DOM element that *contains*
 * a Drupal ul.menu tree. Example:
 * 
 *   $('div.block-menu').drilldown('init', params);
 * 
 * You must provide the following parameters as settings:
 * 
 *   var params = {
 *     activePath : A drupal menu path that is currently active including the basePath e.g. "/mysite/node"
 *     trail : A jquery selector to the DOM element that should act as the trail container, e.g. "div.my-menu-breadcrumb-trail"
 *     rootTitle : The title to use for the root menu item if the menu does not already possess one. Optional.
 *   }
 *
 */
(function($) {
  $.fn.drilldown = function(method, settings) {
    var menu = this;
    var activePath;
    var rootTitle = settings.rootTitle || 'Home';

    switch (method) {
      case 'goTo':
        // If the passed link refers to the current page, don't follow through
        // the link.
        if (this.activePath && this.activePath === $(settings.activeLink).attr('href')) {
          return false;
        }
        return true;
      case 'setActive':
        var breadcrumb = [];
        var activeMenu;

        $(settings.activeLink).each(function() {
          // Traverse backwards through menu parents and build breadcrumb array.
          $(this).parents('ul.menu').each(function() {
            if ($(this).parents('ul.menu').size() > 0) {
              $(this).siblings('a').each(function() {
                breadcrumb.unshift($(this));
              });
            }
            // If this is a root menu with no root link to accompany it,
            // generate one such that the breadcrumb may reference it.
            else if ($(this).children('li').size() > 1) {
              var root;
              if ($(this).siblings('a.drilldown-root').size() > 0) {
                root = $(this).siblings('a.drilldown-root');
              }
              else {
                root = $('<a href="#" class="drilldown-root" style="display:none">'+rootTitle+'</a>');
                $(this).before(root);
              }
              breadcrumb.unshift(root);
            }
          });

          // If we have a child menu (actually a sibling in the DOM), use it
          // as the active menu. Otherwise treat our direct parent as the
          // active menu.
          if ($(this).next().is('ul.menu')) {
            activeMenu = $(this).next();
            breadcrumb.push($(this));
          }
          else {
            activeMenu = $(this).parents('ul.menu').eq(0);
          }
          if (activeMenu) {
            $('.drilldown-active-trail', menu).removeClass('drilldown-active-trail');
            $('ul.menu', menu).removeClass('drilldown-active-menu').removeClass('clearfix');
            $(activeMenu)
              .addClass('drilldown-active-menu').addClass('clearfix')
              .parents('li').addClass('drilldown-active-trail').show();
          }
        });

        // Render the breadcrumb to the target DOM object
        if (breadcrumb.length > 0) {
          var trail = $(settings.trail);
          trail.empty();
          for (var key in breadcrumb) {
            if (breadcrumb[key]) {
              // We don't use the $().clone() method here because of an
              // IE & jQuery 1.2 bug.
              var clone = $('<a></a>')
                .attr('href', $(breadcrumb[key]).attr('href'))
                .attr('class', $(breadcrumb[key]).attr('class'))
                .html($(breadcrumb[key]).html())
                .addClass('depth-'+key)
                .appendTo(trail);

              // We add a reference to the original link and a click handler
              // that traces back to that instance to set as the active link.
              $('a.depth-'+key, trail)
                .data('original', $(breadcrumb[key]))
                .click(function() {
                  settings.activeLink = $(this).data('original');
                  // If the clicked link does not reference the current
                  // active menu, set it to be active.
                  if (settings.activeLink.siblings('ul.drilldown-active-menu').size() === 0) {
                    menu.drilldown('setActive', settings);
                    return false;
                  }
                  // Otherwise, pass-through and allow the link to be clicked.
                  return menu.drilldown('goTo', settings);
                });
            }
          }
        }

        // Event in case others need to update themselves when a new active
        // link is set.
        $(menu).trigger('refresh.drilldown');
        break;
      case 'init':
        if ($('ul.menu ul.menu', menu).size() > 0) {
          $(menu).addClass('drilldown');
          $(settings.trail).addClass('drilldown-trail');

          // Set initial active menu state.
          var activeLink;
          $('ul.menu a', menu).removeClass('active');
          if (settings.activePath && $('ul.menu a[href='+settings.activePath+']', menu).size() > 0) {
            this.activePath = settings.activePath;
            activeLink = $('ul.menu a[href='+settings.activePath+']', menu).addClass('active');
          }
          if (!activeLink) {
            activeLink = $('ul.menu a.active', menu).size() ? $('ul.menu a.active', menu) : $('ul.menu > li > a', menu);
          }
          if (activeLink) {
            menu.drilldown('setActive', {
              activeLink: $(activeLink[0]),
              trail: settings.trail,
              rootTitle: rootTitle
            });
          }

          // Attach click handlers to menu items
          $('ul.menu li:has(ul.menu)', this).click(function() {
            if ($(this).parent().is('.drilldown-active-menu')) {
              if (menu.data('disableMenu')) {
                return true;
              }
              else {
                var url = $(this).children('a').attr('href');
                var activeLink = $('ul.menu a[href='+url+']', menu);
                menu.drilldown('setActive', {
                  activeLink: activeLink,
                  trail: settings.trail,
                  rootTitle: rootTitle
                });
                return false;
              }
            }
          });
          $('ul.menu li:has(ul.menu) a', menu).click(function() {
            menu.data('disableMenu', true);
          });
        }
        break;
    }
    return this;
  };
})(jQuery);
;
// $Id: admin.toolbar.js,v 1.1.2.9.2.4 2010/12/16 22:47:18 yhahn Exp $
(function($) {

Drupal.behaviors.adminToolbar = {};
Drupal.behaviors.adminToolbar.attach = function(context) {
  $('#admin-toolbar:not(.processed)').each(function() {
    var toolbar = $(this);
    toolbar.addClass('processed');

    // Set initial toolbar state.
    Drupal.adminToolbar.init(toolbar);

    // Admin toggle.
    $('.admin-toggle', this).click(function() { Drupal.adminToolbar.toggle(toolbar); });

    // Admin tabs.
    $('div.admin-tab', this).click(function() { Drupal.adminToolbar.tab(toolbar, $(this), true); });

    $(document).bind('drupalOverlayLoad', {adminToolbar: Drupal.adminToolbar, toolbar: toolbar}, function(event) {
      var body = $(document.body);
      var adminToolbar = event.data.adminToolbar;
      var expand = parseInt(adminToolbar.getState('expanded'));
      if (!expand) {
        $('iframe.overlay-active').contents().find('body').css({marginLeft:0, marginTop: 0});
        return;
      }
      var toolbar = event.data.toolbar;
      var size = adminToolbar.SIZE + 'px';
      if(toolbar.attr('class').split(' ')[1] === 'vertical') {
        $('iframe.overlay-element').contents().find('body').css('marginLeft', size);
      }
      else {
        $('iframe.overlay-element').contents().find('body').css('marginTop', size);
      }
    });
  });
  $('div.admin-panes:not(.processed)').each(function() {
    var panes = $(this);
    panes.addClass('processed');

    $('h2.admin-pane-title a').click(function() {
      var target = $(this).attr('href').split('#')[1];
      var panes = $(this).parents('div.admin-panes')[0];
      $('.admin-pane-active', panes).removeClass('admin-pane-active');
      $('div.admin-pane.' + target, panes).addClass('admin-pane-active');
      $(this).addClass('admin-pane-active');
      return false;
    });
  });
};

/**
 * Admin toolbar methods.
 */
Drupal.adminToolbar = {};

/**
 * The width or height of the toolbar, depending on orientation.
 */
Drupal.adminToolbar.SIZE = 260;

/**
 * Set the initial state of the toolbar.
 */
Drupal.adminToolbar.init = function (toolbar) {
  // Set expanded state.
  var expanded = this.getState('expanded');
  if (!$(document.body).hasClass('admin-ah')) {
    if (expanded == 1) {
      $(document.body).addClass('admin-expanded');
    }
  }

  // Set default tab state.
  var target = this.getState('activeTab');
  if (target) {
    if ($('div.admin-tab.'+target).size() > 0) {
      var tab = $('div.admin-tab.'+target);
      this.tab(toolbar, tab, false);
    }
  }

  // Add layout class to body.
  var classes = toolbar.attr('class').split(' ');
  if (classes[0] === 'nw' || classes[0] === 'ne' || classes[0] === 'se' || classes[0] === 'sw' ) {
    $(document.body).addClass('admin-'+classes[0]);
  }
  if (classes[1] === 'horizontal' || classes[1] === 'vertical') {
    $(document.body).addClass('admin-'+classes[1]);
  }
  if (classes[2] === 'df' || classes[2] === 'ah') {
    $(document.body).addClass('admin-'+classes[2]);
  }
};

/**
 * Set the active tab.
 */
Drupal.adminToolbar.tab = function(toolbar, tab, animate) {
  if (!tab.is('.admin-tab-active')) {
    var target = $('span', tab).attr('id').split('admin-tab-')[1];

    // Vertical
    // Use animations to make the vertical tab transition a bit smoother.
    if (toolbar.is('.vertical') && animate) {
      $('.admin-tab-active', toolbar).fadeOut('fast');
      $(tab).fadeOut('fast', function() {
        $('.admin-tab-active', toolbar).fadeIn('fast').removeClass('admin-tab-active');
        $(tab).slideDown('fast').addClass('admin-tab-active');
        Drupal.adminToolbar.setState('activeTab', target);
      });
    }
    // Horizontal
    // Tabs don't need animation assistance.
    else {
      $('div.admin-tab', toolbar).removeClass('admin-tab-active');
      $(tab, toolbar).addClass('admin-tab-active');
      Drupal.adminToolbar.setState('activeTab', target);
    }

    // Blocks
    $('div.admin-block.admin-active', toolbar).removeClass('admin-active');
    $('#block-'+target, toolbar).addClass('admin-active');
  }
  return false;
};

/**
 * Set the width/height of the of the overlay body based on the state admin toolbar.
 *
 * @param vertical
 *   A boolean indicating if the toolbar is vertical.
 * @param expanded
 *   A boolean indicating if the toolbar is expanded.
 */
Drupal.adminToolbar.setOverlayState = function(vertical, expanded) {
  var width = this.SIZE;
  if (!expanded) {
    width = 0;
  }
  if (vertical) {
    $('iframe.overlay-element').contents().find('body').animate({marginLeft: width+'px'}, 'fast');
  }
  else {
    $('iframe.overlay-element').contents().find('body').animate({marginTop: width+'px'}, 'fast');
  }
};

/**
 * Toggle the toolbar open or closed.
 */
Drupal.adminToolbar.toggle = function (toolbar) {
  var size = '0px';
  if ($(document.body).is('.admin-expanded')) {
    if ($(toolbar).is('.vertical')) {
      $('div.admin-blocks', toolbar).animate({width:size}, 'fast');
      if ($(toolbar).is('.nw') || $(toolbar).is('sw')) {
        $(document.body).animate({marginLeft:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      else {
        $(document.body).animate({marginRight:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      this.setOverlayState(true, false);
    }
    else {
      $('div.admin-blocks', toolbar).animate({height:size}, 'fast');
      if ($(toolbar).is('.nw') || $(toolbar).is('ne')) {
        $(document.body).animate({marginTop:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      else {
        $(document.body).animate({marginBottom:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
    }
    this.setOverlayState(false, false);
    this.setState('expanded', 0);
  }
  else {
    size = this.SIZE + 'px';
    if ($(toolbar).is('.vertical')) {
      $('div.admin-blocks', toolbar).animate({width:size}, 'fast');
      if ($(toolbar).is('.nw') || $(toolbar).is('sw')) {
        $(document.body).animate({marginLeft:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      else {
        $(document.body).animate({marginRight:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      this.setOverlayState(true, true);
    }
    else {
      $('div.admin-blocks', toolbar).animate({height:size}, 'fast');
      if ($(toolbar).is('.nw') || $(toolbar).is('ne')) {
        $(document.body).animate({marginTop:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      else {
        $(document.body).animate({marginBottom:size}, 'fast', function() { $(this).toggleClass('admin-expanded'); });
      }
      this.setOverlayState(false, true);
    }
    if ($(document.body).hasClass('admin-ah')) {
      this.setState('expanded', 0);
    }
    else {
      this.setState('expanded', 1);
    }
  }
};

/**
 * Get the value of a cookie variable.
 */
Drupal.adminToolbar.getState = function(key) {
  if (!Drupal.adminToolbar.state) {
    Drupal.adminToolbar.state = {};
    var cookie = $.cookie('DrupalAdminToolbar');
    var query = cookie ? cookie.split('&') : [];
    if (query) {
      for (var i in query) {
        // Extra check to avoid js errors in Chrome, IE and Safari when
        // combined with JS like twitter's widget.js.
        // See http://drupal.org/node/798764.
        if (typeof(query[i]) == 'string' && query[i].indexOf('=') != -1) {
          var values = query[i].split('=');
          if (values.length === 2) {
            Drupal.adminToolbar.state[values[0]] = values[1];
          }
        }
      }
    }
  }
  return Drupal.adminToolbar.state[key] ? Drupal.adminToolbar.state[key] : false;
};

/**
 * Set the value of a cookie variable.
 */
Drupal.adminToolbar.setState = function(key, value) {
  var existing = Drupal.adminToolbar.getState(key);
  if (existing != value) {
    Drupal.adminToolbar.state[key] = value;
    var query = [];
    for (var i in Drupal.adminToolbar.state) {
      query.push(i + '=' + Drupal.adminToolbar.state[i]);
    }
    $.cookie('DrupalAdminToolbar', query.join('&'), {expires: 7, path: '/'});
  }
};

})(jQuery);;
// $Id: admin.menu.js,v 1.1.2.9.2.2 2010/12/16 21:43:54 yhahn Exp $
(function($) {

Drupal.behaviors.adminToolbarMenu = {};
Drupal.behaviors.adminToolbarMenu.attach = function(context) {
  if (jQuery().drilldown) {
    $('#admin-toolbar div.admin-block:has(ul.menu):not(.admin-toolbar-menu)')
      .addClass('admin-toolbar-menu')
      .each(function() {
        var menu = $(this);
        var trail = '#admin-toolbar div.admin-tab.' + $(this).attr('id').split('block-')[1] + ' span';
        var rootTitle = $(trail).text();

        if ($('a:has(span.menu-description)', menu).size() > 0) {
          menu.addClass('admin-toolbar-menu-hover');
          $('a:has(span.menu-description)', menu).hover(
            function() {
              $('<a></a>')
                .attr('class', $(this).attr('class'))
                .addClass('menu-hover')
                .addClass('overlay-exclude')
                .append($('span.menu-description', this).clone())
                .appendTo(menu)
                .show();
            },
            function() {
              $(menu)
                .children('a.menu-hover')
                .remove();
            }
          );
        }

        // Replace the standard trail click handler with one that only
        // adjusts menu if the admin tab is active. Otherwise, switch
        // to that admin tab.
        menu.bind('refresh.drilldown', function() {
          $(trail + ' a').unbind('click').click(function() {
            if ($(this).parents('div.admin-tab').is('.admin-tab-active')) {
              var settings = {'activeLink': $(this).data('original'), 'trail': trail};

              // If the clicked link does not reference the current
              // active menu, set it to be active.
              if (settings.activeLink.siblings('ul.drilldown-active-menu').size() === 0) {
                menu.drilldown('setActive', settings);
                return false;
              }
              // Otherwise, pass-through and allow the link to be clicked.
              return menu.drilldown('goTo', settings);
            }
            $(this).parents('div.admin-tab').click();
            return false;
          });
        });

        // Init drilldown plugin.
        menu.drilldown('init', {
          activePath: Drupal.settings.activePath,
          trail: trail,
          rootTitle: rootTitle
        });
      });
  }
};

})(jQuery);;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
/**
 * @file
 * Implement a simple, clickable dropbutton menu.
 *
 * See dropbutton.theme.inc for primary documentation.
 *
 * The javascript relies on four classes:
 * - The dropbutton must be fully contained in a div with the class
 *   ctools-dropbutton. It must also contain the class ctools-no-js
 *   which will be immediately removed by the javascript; this allows for
 *   graceful degradation.
 * - The trigger that opens the dropbutton must be an a tag wit hthe class
 *   ctools-dropbutton-link. The href should just be '#' as this will never
 *   be allowed to complete.
 * - The part of the dropbutton that will appear when the link is clicked must
 *   be a div with class ctools-dropbutton-container.
 * - Finally, ctools-dropbutton-hover will be placed on any link that is being
 *   hovered over, so that the browser can restyle the links.
 *
 * This tool isn't meant to replace click-tips or anything, it is specifically
 * meant to work well presenting menus.
 */

(function ($) {
  Drupal.behaviors.CToolsDropbutton = {
    attach: function() {
      // Process buttons. All dropbuttons are buttons.
      $('.ctools-button')
        .once('ctools-button')
        .removeClass('ctools-no-js');

      // Process dropbuttons. Not all buttons are dropbuttons.
      $('.ctools-dropbutton').once('ctools-dropbutton', function() {
        var $dropbutton = $(this);
        var $button = $('.ctools-content', $dropbutton);
        var $secondaryActions = $('li', $button).not(':first');
        var $twisty = $(".ctools-link", $dropbutton);
        var open = false;
        var hovering = false;
        var timerID = 0;

        var toggle = function(close) {
          // if it's open or we're told to close it, close it.
          if (open || close) {
            // If we're just toggling it, close it immediately.
            if (!close) {
              open = false;
              $secondaryActions.slideUp(100);
              $dropbutton.removeClass('open');
            }
            else {
              // If we were told to close it, wait half a second to make
              // sure that's what the user wanted.
              // Clear any previous timer we were using.
              if (timerID) {
                clearTimeout(timerID);
              }
              timerID = setTimeout(function() {
                if (!hovering) {
                  open = false;
                  $secondaryActions.slideUp(100);
                  $dropbutton.removeClass('open');
                }}, 500);
            }
          }
          else {
            // open it.
            open = true;
            $secondaryActions.animate({height: "show", opacity: "show"}, 100);
            $dropbutton.addClass('open');
          }
        }
        // Hide the secondary actions initially.
        $secondaryActions.hide();

        $twisty.click(function() {
            toggle();
            return false;
          });

        $dropbutton.hover(
          function() {
            hovering = true;
          }, // hover in
          function() { // hover out
            hovering = false;
            toggle(true);
            return false;
          }
        );
      });
    }
  }
})(jQuery);
;
(function ($) {

Drupal.ModuleFilter = {};

Drupal.ModuleFilter.explode = function(string) {
  var queryArray = string.match(/([a-zA-Z]+\:(\w+|"[^"]+")*)|\w+|"[^"]+"/g);
  if (!queryArray) {
    queryArray = new Array();
  }
  var i = queryArray.length;
  while (i--) {
    queryArray[i] = queryArray[i].replace(/"/g, "");
  }
  return queryArray;
};

Drupal.ModuleFilter.getState = function(key) {
  if (!Drupal.ModuleFilter.state) {
    Drupal.ModuleFilter.state = {};
    var cookie = $.cookie('DrupalModuleFilter');
    var query = cookie ? cookie.split('&') : [];
    if (query) {
      for (var i in query) {
        // Extra check to avoid js errors in Chrome, IE and Safari when
        // combined with JS like twitter's widget.js.
        // See http://drupal.org/node/798764.
        if (typeof(query[i]) == 'string' && query[i].indexOf('=') != -1) {
          var values = query[i].split('=');
          if (values.length === 2) {
            Drupal.ModuleFilter.state[values[0]] = values[1];
          }
        }
      }
    }
  }
  return Drupal.ModuleFilter.state[key] ? Drupal.ModuleFilter.state[key] : false;
};

Drupal.ModuleFilter.setState = function(key, value) {
  var existing = Drupal.ModuleFilter.getState(key);
  if (existing != value) {
    Drupal.ModuleFilter.state[key] = value;
    var query = [];
    for (var i in Drupal.ModuleFilter.state) {
      query.push(i + '=' + Drupal.ModuleFilter.state[i]);
    }
    $.cookie('DrupalModuleFilter', query.join('&'), { expires: 7, path: '/' });
  }
};

Drupal.ModuleFilter.Filter = function(element, selector, options) {
  var self = this;

  this.element = element;
  this.text = $(this.element).val();

  this.settings = Drupal.settings.moduleFilter;

  this.selector = selector;

  this.options = $.extend({
    delay: 500,
    striping: false,
    childSelector: null,
    empty: Drupal.t('No results'),
    rules: new Array()
  }, options);
  if (this.options.wrapper == undefined) {
    this.options.wrapper = $(self.selector).parent();
  }

  // Add clear button.
  this.element.after('<div class="module-filter-clear"><a href="#" class="js-hide">' + Drupal.t('clear') + '</a></div>');
  if (this.text) {
    $('.module-filter-clear a', this.element.parent()).removeClass('js-hide');
  }
  $('.module-filter-clear a', this.element.parent()).click(function() {
    self.element.val('');
    self.text = '';
    delete self.queries;
    self.applyFilter();
    self.element.focus();
    $(this).addClass('js-hide');
    return false;
  });

  this.updateQueries = function() {
    var queryStrings = Drupal.ModuleFilter.explode(self.text);

    self.queries = new Array();
    for (var i in queryStrings) {
      var query = { operator: 'text', string: queryStrings[i] };

      if (self.operators != undefined) {
        // Check if an operator is possibly used.
        if (queryStrings[i].indexOf(':') > 0) {
          // Determine operator used.
          var args = queryStrings[i].split(':', 2);
          var operator = args.shift();
          if (self.operators[operator] != undefined) {
            query.operator = operator;
            query.string = args.shift();
          }
        }
      }

      query.string = query.string.toLowerCase();

      self.queries.push(query);
    }

    if (self.queries.length <= 0) {
      // Add a blank string query.
      self.queries.push({ operator: 'text', string: '' });
    }
  };

  this.applyFilter = function() {
    self.results = new Array();

    self.updateQueries();

    if (self.index == undefined) {
      self.buildIndex();
    }

    self.element.trigger('moduleFilter:start');

    $.each(self.index, function(key, item) {
      var $item = item.element;

      for (var i in self.queries) {
        var query = self.queries[i];
        if (query.operator == 'text') {
          if (item.text.indexOf(query.string) < 0) {
            continue;
          }
        }
        else {
          var func = self.operators[query.operator];
          if (!(func(query.string, self, item))) {
            continue;
          }
        }

        var rulesResult = self.processRules(item);
        if (rulesResult !== false) {
          return true;
        }
      }

      $item.addClass('js-hide');
    });

    self.element.trigger('moduleFilter:finish', { results: self.results });

    if (self.options.striping) {
      self.stripe();
    }

    if (self.results.length > 0) {
      self.options.wrapper.find('.module-filter-no-results').remove();
    }
    else {
      if (!self.options.wrapper.find('.module-filter-no-results').length) {
        self.options.wrapper.append($('<p class="module-filter-no-results"/>').text(self.options.empty));
      };
    }
  };

  self.element.keyup(function(e) {
    switch (e.which) {
      case 13:
        if (self.timeOut) {
          clearTimeout(self.timeOut);
        }
        self.applyFilter();
        break;
      default:
        if (self.text != $(this).val()) {
          if (self.timeOut) {
            clearTimeout(self.timeOut);
          }

          self.text = $(this).val();

          if (self.text) {
            self.element.parent().find('.module-filter-clear a').removeClass('js-hide');
          }
          else {
            self.element.parent().find('.module-filter-clear a').addClass('js-hide');
          }

          self.element.trigger('moduleFilter:keyup');

          self.timeOut = setTimeout(self.applyFilter, self.options.delay);
        }
        break;
    }
  });

  self.element.keypress(function(e) {
    if (e.which == 13) e.preventDefault();
  });
};

Drupal.ModuleFilter.Filter.prototype.buildIndex = function() {
  var self = this;
  var index = new Array();
  $(this.selector).each(function(i) {
    var text = (self.options.childSelector) ? $(self.options.childSelector, this).text() : $(this).text();
    var item = {
      key: i,
      element: $(this),
      text: text.toLowerCase()
    };
    for (var j in self.options.buildIndex) {
      var func = self.options.buildIndex[j];
      item = $.extend(func(self, item), item);
    }
    $(this).data('indexKey', i);
    index.push(item);
    delete item;
  });
  this.index = index;
};

Drupal.ModuleFilter.Filter.prototype.processRules = function(item) {
  var self = this;
  var $item = item.element;
  var rulesResult = true;
  if (self.options.rules.length > 0) {
    for (var i in self.options.rules) {
      var func = self.options.rules[i];
      rulesResult = func(self, item);
      if (rulesResult === false) {
        break;
      }
    }
  }
  if (rulesResult !== false) {
    $item.removeClass('js-hide');
    self.results.push(item);
  }
  return rulesResult;
};

Drupal.ModuleFilter.Filter.prototype.stripe = function() {
  var self = this;
  var flip = { even: 'odd', odd: 'even' };
  var stripe = 'odd';

  $.each(self.index, function(key, item) {
    if (!item.element.hasClass('js-hide')) {
      item.element.removeClass('odd even')
        .addClass(stripe);
      stripe = flip[stripe];
    }
  });
};

$.fn.moduleFilter = function(selector, options) {
  var filterInput = this;
  filterInput.parents('.module-filter-inputs-wrapper').show();
  if (Drupal.settings.moduleFilter.setFocus) {
    filterInput.focus();
  }
  filterInput.data('moduleFilter', new Drupal.ModuleFilter.Filter(this, selector, options));
};

})(jQuery);
;

/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};
;
(function($) {

Drupal.behaviors.moduleFilter = {
  attach: function(context) {
    $('#system-modules td.description').once('description', function() {
      $('.inner.expand', $(this)).click(function() {
        $(this).toggleClass('expanded');
      });
    });

    $('.module-filter-inputs-wrapper', context).once('module-filter', function() {
      var filterInput = $('input[name="module_filter[name]"]', context);
      var selector = '#system-modules table tbody tr';
      if (Drupal.settings.moduleFilter.tabs) {
        selector += '.module';
      }

      filterInput.moduleFilter(selector, {
        wrapper: $('#module-filter-modules'),
        delay: 500,
        striping: true,
        childSelector: 'td:nth(1)',
        rules: [
          function(moduleFilter, item) {
            if (!item.unavailable) {
              if (moduleFilter.options.showEnabled) {
                if (item.status && !item.disabled) {
                  return true;
                }
              }
              if (moduleFilter.options.showDisabled) {
                if (!item.status && !item.disabled) {
                  return true;
                }
              }
              if (moduleFilter.options.showRequired) {
                if (item.status && item.disabled) {
                  return true;
                }
              }
            }
            if (moduleFilter.options.showUnavailable) {
              if (item.unavailable || (!item.status && item.disabled)) {
                return true;
              }
            }
            return false;
          }
        ],
        buildIndex: [
          function(moduleFilter, item) {
            var $checkbox = $('td.checkbox :checkbox', item.element);
            if ($checkbox.size() > 0) {
              item.status = $checkbox.is(':checked');
              item.disabled = $checkbox.is(':disabled');
            }
            else {
              item.status = false;
              item.disabled = true;
              item.unavailable = true;
            }
            return item;
          }
        ],
        showEnabled: $('#edit-module-filter-show-enabled').is(':checked'),
        showDisabled: $('#edit-module-filter-show-disabled').is(':checked'),
        showRequired: $('#edit-module-filter-show-required').is(':checked'),
        showUnavailable: $('#edit-module-filter-show-unavailable').is(':checked')
      });

      var moduleFilter = filterInput.data('moduleFilter');

      moduleFilter.operators = {
        description: function(string, moduleFilter, item) {
          if (item.description == undefined) {
            var description = $('.description', item.element).clone();
            $('.admin-requirements', description).remove();
            $('.admin-operations', description).remove();
            item.description = description.text().toLowerCase();
          }

          if (item.description.indexOf(string) >= 0) {
            return true;
          }
        },
        requiredBy: function(string, moduleFilter, item) {
          if (item.requiredBy == undefined) {
            var requirements = Drupal.ModuleFilter.getRequirements(item.element);
            item.requires = requirements.requires;
            item.requiredBy = requirements.requiredBy;
          }

          for (var i in item.requiredBy) {
            if (item.requiredBy[i].indexOf(string) >= 0) {
              return true;
            }
          }
        },
        requires: function(string, moduleFilter, item) {
          if (item.requires == undefined) {
            var requirements = Drupal.ModuleFilter.getRequirements(item.element);
            item.requires = requirements.requires;
            item.requiredBy = requirements.requiredBy;
          }

          for (var i in item.requires) {
            if (item.requires[i].indexOf(string) >= 0) {
              return true;
            }
          }
        }
      };

      $('#edit-module-filter-show-enabled', context).change(function() {
        moduleFilter.options.showEnabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-disabled', context).change(function() {
        moduleFilter.options.showDisabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-required', context).change(function() {
        moduleFilter.options.showRequired = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-unavailable', context).change(function() {
        moduleFilter.options.showUnavailable = $(this).is(':checked');
        moduleFilter.applyFilter();
      });

      if (!Drupal.settings.moduleFilter.tabs) {
        moduleFilter.element.bind('moduleFilter:start', function() {
          $('#system-modules fieldset').show();
        });

        moduleFilter.element.bind('moduleFilter:finish', function(e, data) {
          $('#system-modules fieldset').each(function(i) {
            $fieldset = $(this);
            if ($('tbody tr', $fieldset).filter(':visible').length == 0) {
              $fieldset.hide();
            }
          });
        });

        moduleFilter.applyFilter();
      }
    });
  }
};

Drupal.ModuleFilter.getRequirements = function(element) {
  var requires = new Array();
  var requiredBy = new Array();
  $('.admin-requirements', element).each(function() {
    var text = $(this).text();
    if (text.substr(0, 9) == 'Requires:') {
      // Requires element.
      requiresString = text.substr(9);
      requires = requiresString.replace(/\([a-z]*\)/g, '').split(',');
    }
    else if (text.substr(0, 12) == 'Required by:') {
      // Required by element.
      requiredByString = text.substr(12);
      requiredBy = requiredByString.replace(/\([a-z]*\)/g, '').split(',');
    }
  });
  for (var i in requires) {
    requires[i] = $.trim(requires[i].toLowerCase());
  }
  for (var i in requiredBy) {
    requiredBy[i] = $.trim(requiredBy[i].toLowerCase());
  }
  return { requires: requires, requiredBy: requiredBy };
};

})(jQuery);
;

(function ($) {

Drupal.ModuleFilter.tabs = {};
Drupal.ModuleFilter.enabling = {};
Drupal.ModuleFilter.disabling = {};

Drupal.ModuleFilter.jQueryIsNewer = function() {
  if (Drupal.ModuleFilter.jQueryNewer == undefined) {
    var v1parts = $.fn.jquery.split('.');
    var v2parts = new Array('1', '4', '4');

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        Drupal.ModuleFilter.jQueryNewer = true;
        return Drupal.ModuleFilter.jQueryNewer;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      }
      else if (v1parts[i] > v2parts[i]) {
        Drupal.ModuleFilter.jQueryNewer = true;
        return Drupal.ModuleFilter.jQueryNewer;
      }
      else {
        Drupal.ModuleFilter.jQueryNewer = false;
        return Drupal.ModuleFilter.jQueryNewer;
      }
    }

    if (v1parts.length != v2parts.length) {
      Drupal.ModuleFilter.jQueryNewer = false;
      return Drupal.ModuleFilter.jQueryNewer;
    }

    Drupal.ModuleFilter.jQueryNewer = false;
  }
  return Drupal.ModuleFilter.jQueryNewer;
};

Drupal.behaviors.moduleFilterTabs = {
  attach: function(context) {
    if (Drupal.settings.moduleFilter.tabs) {
      $('#module-filter-wrapper table:not(.sticky-header)', context).once('module-filter-tabs', function() {
        var $modules = $('#module-filter-modules');
        var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
        var table = $(this);

        $('thead', table).show();

        // Remove package header rows.
        $('tr.admin-package-header', table).remove();

        var $tabsWrapper = $('<div id="module-filter-tabs"></div>');

        // Build tabs from package title rows.
        var tabs = '<ul>';
        for (var i in Drupal.settings.moduleFilter.packageIDs) {
          var id = Drupal.settings.moduleFilter.packageIDs[i];

          var name = id;
          var tabClass = 'project-tab';
          var title = null;
          var summary = (Drupal.settings.moduleFilter.countEnabled) ? '<span class="count">' + Drupal.ModuleFilter.countSummary(id) + '</span>' : '';

          switch (id) {
            case 'all':
              name = Drupal.t('All');
              break;
            case 'new':
              name = Drupal.t('New');
              title = Drupal.t('Modules installed within the last week.');
              if (Drupal.settings.moduleFilter.enabledCounts['new'].total == 0) {
                tabClass += ' disabled';
                summary += '<span>' + Drupal.t('No modules added within the last week.') + '</span>';
              }
              break;
            case 'recent':
              name = Drupal.t('Recent');
              title = Drupal.t('Modules enabled/disabled within the last week.');
              if (Drupal.settings.moduleFilter.enabledCounts['recent'].total == 0) {
                tabClass += ' disabled';
                summary += '<span>' + Drupal.t('No modules were enabled or disabled within the last week.') + '</span>';
              }
              break;
            default: 
              var $row = $('#' + id + '-package');
              name = $.trim($row.text());
              $row.remove();
              break;
          }

          tabs += '<li id="' + id + '-tab" class="' + tabClass + '"><a href="#' + id + '" class="overlay-exclude"' + (title ? ' title="' + title + '"' : '') + '><strong>' + name + '</strong><span class="summary">' + summary + '</span></a></li>';
        }
        tabs += '</ul>';
        $tabsWrapper.append(tabs);
        $modules.before($tabsWrapper);

        // Index tabs.
        $('#module-filter-tabs li').each(function() {
          var $tab = $(this);
          var id = $tab.attr('id');
          Drupal.ModuleFilter.tabs[id] = new Drupal.ModuleFilter.Tab($tab, id);
        });

        $('tbody td.checkbox input', $modules).change(function() {
          var $checkbox = $(this);
          var key = $checkbox.parents('tr').data('indexKey');

          moduleFilter.index[key].status = $checkbox.is(':checked');

          if (Drupal.settings.moduleFilter.visualAid) {
            var type = ($checkbox.is(':checked')) ? 'enable' : 'disable';
            Drupal.ModuleFilter.updateVisualAid(type, $checkbox.parents('tr'));
          }
        });

        // Sort rows.
        var rows = $('tbody tr.module', table).get();
        rows.sort(function(a, b) {
          var compA = $('td:nth(1)', a).text().toLowerCase();
          var compB = $('td:nth(1)', b).text().toLowerCase();
          return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(rows, function(idx, itm) { table.append(itm); });

        // Re-stripe rows.
        $('tr.module', table)
          .removeClass('odd even')
          .filter(':odd').addClass('even').end()
          .filter(':even').addClass('odd');

        moduleFilter.adjustHeight();

        moduleFilter.element.bind('moduleFilter:start', function() {
          moduleFilter.tabResults = {
            'all-tab': { items: {}, count: 0 },
            'recent-tab': { items: {}, count: 0 },
            'new-tab': { items: {}, count: 0 }
          };

          // Empty result info from tabs.
          for (var i in Drupal.ModuleFilter.tabs) {
            if (Drupal.ModuleFilter.tabs[i].resultInfo != undefined) {
              Drupal.ModuleFilter.tabs[i].resultInfo.empty();
            }
          }
        });

        moduleFilter.element.bind('moduleFilter:finish', function(e, data) {
          $.each(moduleFilter.index, function(key, item) {
            if (!item.element.hasClass('js-hide')) {
              var id = Drupal.ModuleFilter.getTabID(item.element);

              if (moduleFilter.tabResults[id] == undefined) {
                moduleFilter.tabResults[id] = { items: {}, count: 0 };
              }
              if (moduleFilter.tabResults[id].items[item.key] == undefined) {
                // All tab
                moduleFilter.tabResults['all-tab'].count++;

                // Recent tab
                if (item.element.hasClass('recent-module')) {
                  moduleFilter.tabResults['recent-tab'].count++;
                }

                // New tab
                if (item.element.hasClass('new-module')) {
                  moduleFilter.tabResults['new-tab'].count++;
                }

                moduleFilter.tabResults[id].items[item.key] = item;
                moduleFilter.tabResults[id].count++;
              }

              if (Drupal.ModuleFilter.activeTab != undefined && Drupal.ModuleFilter.activeTab.id != 'all-tab') {
                if ((Drupal.ModuleFilter.activeTab.id == 'recent-tab' && !item.element.hasClass('recent-module')) || (Drupal.ModuleFilter.activeTab.id == 'new-tab' && !item.element.hasClass('new-module')) || (Drupal.ModuleFilter.activeTab.id != 'recent-tab' && Drupal.ModuleFilter.activeTab.id != 'new-tab' && id != Drupal.ModuleFilter.activeTab.id)) {
                  // The item is not in the active tab, so hide it.
                  item.element.addClass('js-hide');
                }
              }
            }
          });

          if (Drupal.settings.moduleFilter.visualAid) {
            if (moduleFilter.text) {
              // Add result info to tabs.
              for (var id in moduleFilter.tabResults) {
                var tab = Drupal.ModuleFilter.tabs[id];

                if (tab.resultInfo == undefined) {
                  var resultInfo = '<span class="result-info"></span>'
                  $('a', tab.element).prepend(resultInfo);
                  tab.resultInfo = $('span.result-info', tab.element);
                }

                tab.resultInfo.append(moduleFilter.tabResults[id].count);
              }

              if (Drupal.settings.moduleFilter.hideEmptyTabs) {
                for (var id in Drupal.ModuleFilter.tabs) {
                  if (moduleFilter.tabResults[id] != undefined) {
                    Drupal.ModuleFilter.tabs[id].element.show();
                  }
                  else if (Drupal.ModuleFilter.activeTab == undefined || Drupal.ModuleFilter.activeTab.id != id) {
                    Drupal.ModuleFilter.tabs[id].element.hide();
                  }
                }
              }
            }
            else {
              // Make sure all tabs are visible.
              if (Drupal.settings.moduleFilter.hideEmptyTabs) {
                $('#module-filter-tabs li').show();
              }
            }
          }

          if ((Drupal.ModuleFilter.activeTab != undefined && (moduleFilter.tabResults[Drupal.ModuleFilter.activeTab.id] == undefined || moduleFilter.tabResults[Drupal.ModuleFilter.activeTab.id].count <= 0))) {
            // The current tab contains no results.
            moduleFilter.results = 0;
          }

          moduleFilter.adjustHeight();
        });

        if (Drupal.settings.moduleFilter.useURLFragment) {
          $(window).bind('hashchange.module-filter', $.proxy(Drupal.ModuleFilter, 'eventHandlerOperateByURLFragment')).triggerHandler('hashchange.module-filter');
        }
        else {
          Drupal.ModuleFilter.selectTab();
        }

        if (Drupal.settings.moduleFilter.useSwitch) {
          $('td.checkbox div.form-item').hide();
          $('td.checkbox').each(function(i) {
            var $cell = $(this);
            var $checkbox = $(':checkbox', $cell);
            var $switch = $('.toggle-enable', $cell);
            $switch.removeClass('js-hide').click(function() {
              if (!$(this).hasClass('disabled')) {
                if (Drupal.ModuleFilter.jQueryIsNewer()) {
                  $checkbox.click();
                }
                else {
                  $checkbox.click().change();
                }
              }
            });
            $checkbox.click(function() {
              if (!$switch.hasClass('disabled')) {
                $switch.toggleClass('off');
              }
            });
          });
        }

        var $tabs = $('#module-filter-tabs');

        function getParentTopOffset($obj, offset) {
          var $parent = $obj.offsetParent();
          if ($obj[0] != $parent[0]) {
            offset += $parent.position().top;
            return getParentTopOffset($parent, offset);
          }
          return offset;
        }

        var tabsTopOffset = null;
        function getParentsTopOffset() {
          if (tabsTopOffset === null) {
            tabsTopOffset = getParentTopOffset($tabs.parent(), 0);
          }
          return tabsTopOffset;
        }

        function viewportTop() {
          var top = $(window).scrollTop();
          return top;
        }

        function viewportBottom() {
          var top = $(window).scrollTop();
          var bottom = top + $(window).height();

          bottom -= $('#page-actions').height();

          return bottom;
        }

        function fixToTop(top) {
          if ($tabs.hasClass('bottom-fixed')) {
            $tabs.css({
              'position': 'absolute',
              'top': $tabs.position().top - getParentsTopOffset(),
              'bottom': 'auto'
            });
            $tabs.removeClass('bottom-fixed');
          }

          if (($tabs.css('position') == 'absolute' && $tabs.offset().top - top >= 0) || ($tabs.css('position') != 'absolute' && $tabs.offset().top - top <= 0)) {
            $tabs.addClass('top-fixed');
            $tabs.attr('style', '');
          }
        }

        function fixToBottom(bottom) {
          if ($tabs.hasClass('top-fixed')) {
            $tabs.css({
              'position': 'absolute',
              'top': $tabs.position().top - getParentsTopOffset(),
              'bottom': 'auto'
            });
            $tabs.removeClass('top-fixed');
          }

          if ($tabs.offset().top + $tabs.height() - bottom <= 0) {
            $tabs.addClass('bottom-fixed');
            var style = '';
            var pageActionsHeight = $('#page-actions').height();
            if (pageActionsHeight > 0) {
              style = 'bottom: ' + pageActionsHeight + 'px';
            }
            else if (Drupal.settings.moduleFilter.dynamicPosition) {
              // style = 'bottom: ' + $('#module-filter-submit', $tabs).height() + 'px';
            }
            $tabs.attr('style', style);
          }
        }

        var lastTop = 0;
        $(window).scroll(function() {
          var top = viewportTop();
          var bottom = viewportBottom();

          if ($modules.offset().top >= top) {
            $tabs.removeClass('top-fixed').attr('style', '');
          }
          else {
            if (top > lastTop) { // Downward scroll.
              if ($tabs.height() > bottom - top) {
                fixToBottom(bottom);
              }
              else {
                fixToTop(top);
              }
            }
            else { // Upward scroll.
              fixToTop(top);
            }
          }
          lastTop = top;
        });

        moduleFilter.adjustHeight();
      });
    }
  }
};

Drupal.ModuleFilter.Tab = function(element, id) {
  var self = this;

  this.id = id;
  this.hash = id.substring(0, id.length - 4);
  this.element = element;

  $('a', this.element).click(function() {
    if (!Drupal.settings.moduleFilter.useURLFragment) {
      var hash = (!self.element.hasClass('selected')) ? self.hash : 'all';
      Drupal.ModuleFilter.selectTab(hash);
      return false;
    }

    if (self.element.hasClass('selected')) {
      // Clear the active tab.
      window.location.hash = 'all';
      return false;
    }
  });

  $('tr.' + this.id, $('#system-modules')).hover(
    function() {
      self.element.addClass('suggest');
    },
    function() {
      self.element.removeClass('suggest');
    }
  );
};

Drupal.ModuleFilter.selectTab = function(hash) {
  if (!hash || Drupal.ModuleFilter.tabs[hash + '-tab'] == undefined || Drupal.settings.moduleFilter.enabledCounts[hash].total == 0) {
    if (Drupal.settings.moduleFilter.rememberActiveTab) {
      var activeTab = Drupal.ModuleFilter.getState('activeTab');
      if (activeTab && Drupal.ModuleFilter.tabs[activeTab + '-tab'] != undefined) {
        hash = activeTab;
      }
    }

    if (!hash) {
      hash = 'all';
    }
  }

  if (Drupal.ModuleFilter.activeTab != undefined) {
    Drupal.ModuleFilter.activeTab.element.removeClass('selected');
  }

  Drupal.ModuleFilter.activeTab = Drupal.ModuleFilter.tabs[hash + '-tab'];
  Drupal.ModuleFilter.activeTab.element.addClass('selected');

  var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
  var filter = moduleFilter.applyFilter();

  if (!Drupal.ModuleFilter.modulesTop) {
    Drupal.ModuleFilter.modulesTop = $('#module-filter-modules').offset().top;
  }
  else {
    // Calculate header offset; this is important in case the site is using
    // admin_menu module which has fixed positioning and is on top of everything
    // else.
    var headerOffset = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
    // Scroll back to top of #module-filter-modules.
    $('html, body').animate({
      scrollTop: Drupal.ModuleFilter.modulesTop - headerOffset
    }, 500);
    // $('html, body').scrollTop(Drupal.ModuleFilter.modulesTop);
  }

  Drupal.ModuleFilter.setState('activeTab', hash);
};

Drupal.ModuleFilter.eventHandlerOperateByURLFragment = function(event) {
  var hash = $.param.fragment();
  Drupal.ModuleFilter.selectTab(hash);
};

Drupal.ModuleFilter.countSummary = function(id) {
  return Drupal.t('@enabled of @total', { '@enabled': Drupal.settings.moduleFilter.enabledCounts[id].enabled, '@total': Drupal.settings.moduleFilter.enabledCounts[id].total });
};

Drupal.ModuleFilter.Tab.prototype.updateEnabling = function(name, remove) {
  this.enabling = this.enabling || {};
  if (!remove) {
    this.enabling[name] = name;
  }
  else {
    delete this.enabling[name];
  }
};

Drupal.ModuleFilter.Tab.prototype.updateDisabling = function(name, remove) {
  this.disabling = this.disabling || {};
  if (!remove) {
    this.disabling[name] = name;
  }
  else {
    delete this.disabling[name];
  }
};

Drupal.ModuleFilter.Tab.prototype.updateVisualAid = function() {
  var visualAid = '';
  var enabling = new Array();
  var disabling = new Array();

  if (this.enabling != undefined) {
    for (var i in this.enabling) {
      enabling.push(this.enabling[i]);
    }
    if (enabling.length > 0) {
      enabling.sort();
      visualAid += '<span class="enabling">+' + enabling.join('</span>, <span class="enabling">') + '</span>';
    }
  }
  if (this.disabling != undefined) {
    for (var i in this.disabling) {
      disabling.push(this.disabling[i]);
    }
    if (disabling.length > 0) {
      disabling.sort();
      if (enabling.length > 0) {
        visualAid += '<br />';
      }
      visualAid += '<span class="disabling">-' + disabling.join('</span>, <span class="disabling">') + '</span>';
    }
  }

  if (this.visualAid == undefined) {
    $('a span.summary', this.element).append('<span class="visual-aid"></span>');
    this.visualAid = $('span.visual-aid', this.element);
  }

  this.visualAid.empty().append(visualAid);
};

Drupal.ModuleFilter.getTabID = function($row) {
  var id = $row.data('moduleFilterTabID');
  if (!id) {
    // Find the tab ID.
    var classes = $row.attr('class').split(' ');
    for (var i in classes) {
      if (Drupal.ModuleFilter.tabs[classes[i]] != undefined) {
        id = classes[i];
        break;
      }
    }
    $row.data('moduleFilterTabID', id);
  }
  return id;
};

Drupal.ModuleFilter.updateVisualAid = function(type, $row) {
  var id = Drupal.ModuleFilter.getTabID($row);

  if (!id) {
    return false;
  }

  var tab = Drupal.ModuleFilter.tabs[id];
  var name = $('td:nth(1) strong', $row).text();
  switch (type) {
    case 'enable':
      if (Drupal.ModuleFilter.disabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.disabling[id + name];
        tab.updateDisabling(name, true);
        $row.removeClass('disabling');
      }
      else {
        Drupal.ModuleFilter.enabling[id + name] = name;
        tab.updateEnabling(name);
        $row.addClass('enabling');
      }
      break;
    case 'disable':
      if (Drupal.ModuleFilter.enabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.enabling[id + name];
        tab.updateEnabling(name, true);
        $row.removeClass('enabling');
      }
      else {
        Drupal.ModuleFilter.disabling[id + name] = name;
        tab.updateDisabling(name);
        $row.addClass('disabling');
      }
      break;
  }

  tab.updateVisualAid();
};

Drupal.ModuleFilter.Filter.prototype.adjustHeight = function() {
  // Hack for adjusting the height of the modules section.
  var minHeight = $('#module-filter-tabs ul').height() + 10;
  minHeight += $('#module-filter-tabs #module-filter-submit').height();
  $('#module-filter-modules').css('min-height', minHeight);
  this.element.trigger('moduleFilter:adjustHeight');
}

})(jQuery);
;
(function($) {

Drupal.behaviors.moduleFilterDynamicPosition = {
  attach: function(context) {
    var $window = $(window);

    $('#module-filter-wrapper', context).once('dynamic-position', function() {
      // Move the submit button just below the tabs.
      $('#module-filter-tabs').append($('#module-filter-submit'));

      var positionSubmit = function() {
        var $tabs = $('#module-filter-tabs');
        var $submit = $('#module-filter-submit', $tabs);

        // Vertical movement.
        var bottom = $tabs.offset().top + $tabs.outerHeight();
        if ($submit.hasClass('fixed-bottom')) {
          bottom += $submit.height();
        }
        if (bottom >= $window.height() + $window.scrollTop()) {
          $submit.addClass('fixed fixed-bottom');
          $tabs.css('padding-bottom', $submit.height());
        }
        else {
          $submit.removeClass('fixed fixed-bottom');
          $tabs.css('padding-bottom', 0);
        }

        // Horizontal movement.
        if ($submit.hasClass('fixed-bottom') || $submit.hasClass('fixed-top')) {
          var left = $tabs.offset().left - $window.scrollLeft();
          if (left != $submit.offset().left - $window.scrollLeft()) {
            $submit.css('left', left);
          }
        }
      };

      // Control the positioning.
      $window.scroll(positionSubmit);
      $window.resize(positionSubmit);
      var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
      moduleFilter.element.bind('moduleFilter:adjustHeight', positionSubmit);
      moduleFilter.adjustHeight();
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);
;
(function($) {
  Drupal.behaviors.backupMigrate = {
    attach: function(context) {
      if (Drupal.settings.backup_migrate !== undefined) { 
        if (Drupal.settings.backup_migrate.dependents !== undefined) {
          for (key in Drupal.settings.backup_migrate.dependents) {
            info = Drupal.settings.backup_migrate.dependents[key];
            dependent = $('#edit-' + info['dependent']);
            for (key in info['dependencies']) {
              $('[name="' + key + '"]').each(function() {
                var dependentval = info['dependencies'][key];
                var dependency = $(this);
                (function(dependent, dependency) {
                  var checkval = function(inval) {
                    if (dependency.attr('type') == 'radio') {
                      var val = $('[name="' + dependency.attr('name') + '"]:checked').val();
                      return val == inval;
                    }
                    else if (dependency.attr('type') == 'checkbox') {
                      return dependency.is(':checked') && inval == dependency.val();
                    }
                    else {
                      return dependency.val() == inval;
                    }
                    return false;
                  };
                  if (!checkval(dependentval)) {
                    // Hide doesn't work inside collapsed fieldsets.
                    dependent.css('display', 'none');
                  }
                  dependency.bind('load change click keypress focus', function() {
                    if (checkval(dependentval)) {
                      dependent.slideDown();
                    }
                    else {
                      dependent.slideUp();
                    }
                  }).load();
                })(dependent, dependency);
              });
            }
          }
          for (key in Drupal.settings.backup_migrate.destination_selectors) {
            var info = Drupal.settings.backup_migrate.destination_selectors[key];
            (function(info) {
              var selector = $('#' + info['destination_selector']);
              var copy = $('#' + info['copy'])
              var copy_selector = $('#' + info['copy_destination_selector']);
              var copy_selector_options = {};

              // Store a copy of the secondary selector options.
              copy_selector.find('optgroup').each(function() {
                var label = $(this).attr('label');
                copy_selector_options[label] = [];
                $(this).find('option').each(function() {
                  copy_selector_options[label].push(this); 
                });
                $(this).remove();
              })

              // Assign an action to the main selector to modify the secondary selector
              selector.each(function() {
                $(this).bind('load change click keypress focus', function() {
                  var group = $(this).find('option[value=' + $(this).val() + ']').parents('optgroup').attr('label');
                  if (group) {
                    copy.parent().find('.backup-migrate-destination-copy-label').text(info['labels'][group]);
                    copy_selector.empty();
                    for (var key in copy_selector_options) {
                      if (key != group) {
                        copy_selector.append(copy_selector_options[key]);
                      }
                    }
                  }
                }).load();
              });
            })(info);
          }
          // Add the convert to checkboxes functionality to all multiselects.
          $('#backup-migrate-ui-manual-backup-form select[multiple], #backup-migrate-crud-edit-form select[multiple]').each(function() {
            var self = this;
            $(self).after(
              $('<div class="description backup-migrate-checkbox-link"></div>').append(
                $('<a>'+ Drupal.settings.backup_migrate.checkboxLinkText +'</a>').click(function() {
                  var $select = $(self);
                  var $checkboxes = $('<div></div>').addClass('backup-migrate-tables-checkboxes');
                  $('option', $select).each(function(i) {
                    $checkboxes.append(
                      $('<div class="form-item"></div>').append(
                        $('<label class="option backup-migrate-table-select">' + this.value + '</label>').prepend(
                          $('<input type="checkbox" class="backup-migrate-tables-checkbox" name="'+ $select.attr('name') +'"'+ (this.selected ? 'checked="checked"' : '') +' value="'+ this.value +'"/>')
                            .bind('click change load', function() {
                                if (this.checked) {
                                  $(this).parent().addClass('checked');
                                }
                                else {
                                  $(this).parent().removeClass('checked');
                                }
                              }).load()
                        )
                      )
                    );
                  });
                  $select.parent().find('.backup-migrate-checkbox-link').remove();
                  $select.before($checkboxes);
                  $select.hide();
                })
              )
            );
          });
        }
      }
    }
  }
})(jQuery);
;
