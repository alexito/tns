
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
