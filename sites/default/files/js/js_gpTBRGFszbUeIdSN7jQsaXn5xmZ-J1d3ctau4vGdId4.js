(function ($) {
  Drupal.behaviors.tns_main_settings = {
    attach: function (context, settings) {
      $(window).load(function () {
        //Accordion
        $('.accordion-group').each(function(i, e){
          $(this).parent().prepend(this);  
        });
        $('.accordion-group').each(function(i, e){
          $(this).find('h3').click(function(){
            $(this).parent().find('ul').slideToggle();
          })
          if(i > 0) {
            $(this).find('h3').parent().find('ul').slideToggle();
          }
        });
        
        //Main page Carrousel row
        $('body.page-inicio .main-container #block-system-main .bootstrap-twocol-stacked .row').first().remove();
        $('body.page-inicio .main-container #block-system-main .bootstrap-twocol-stacked .row').first().addClass('row-carrousel');
        // AGENDA ELENCOS
        $('body.page-agenda-elencos .view-agenda-elencos .view-content > .view-grouping > .view-grouping-header').addClass('col-sm-5 col-md-5');
        $('body.page-agenda-elencos .view-agenda-elencos .view-content > .view-grouping > .view-grouping-content').addClass('col-sm-7 col-md-7');
        
        $('.custom-colorbox.fotos-mini a').addClass('col-md-3 col-sm-4 col-xs-6');
        $('.view-fotos-y-video .field-content iframe').addClass('col-sm-6');
        
        // CALENDARIO
        var d = new Date(), day, month, year;
        
        fecha = location.pathname.split('/');
        if (fecha.length > 0 && fecha[1] == 'lista-eventos') {
          fecha = fecha[2].split('-');
          year = fecha[0];
          month = fecha[1] - 1;
          day = fecha[2] ;
          
        }else{
          day = d.getDate();
          month = d.getMonth();
          year = d.getFullYear();
        }
        
        if ($("#calendar").length > 0){
          $("#calendar").calendarWidget({
            day: day,
            month: month,
            year: year
          });
        }
      });

      //--------CALENDAR WIDGET
      function calendarWidget(el, params) {

        var now = new Date();
        var thismonth = now.getMonth();
        var thisyear = now.getYear() + 1900;
        var day = now.getDate();
        
        var opts = {
          month: thismonth,
          year: thisyear,
          day: day
        };
        
       $('#calendar').addClass('loading');

        $.extend(opts, params);

        var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        month = i = parseInt(opts.month);
        year = parseInt(opts.year);
        var m = 0;
        var table = '';
        
        // next month
        if (month == 11) {
          n_month = (year+1) + '-1';
          var next_month = '<a href="?month=' + 1 + '&amp;year=' + (year + 1) + '" title="' + monthNames[0] + ' ' + (year + 1) + '">' + monthNames[0] + ' ' + (year + 1) + '</a>';
        } else {
          n_month = (year) + '-' + (month + 2);
          var next_month = '<a href="?month=' + (month + 2) + '&amp;year=' + (year) + '" title="' + monthNames[month + 1] + ' ' + (year) + '">' + monthNames[month + 1] + ' ' + (year) + '</a>';
        }

        // previous month
        if (month == 0) {
          p_month = (year - 1) + '-12';
          var prev_month = '<a href="?month=' + 12 + '&amp;year=' + (year - 1) + '" title="' + monthNames[11] + ' ' + (year - 1) + '">' + monthNames[11] + ' ' + (year - 1) + '</a>';
        } else {
          p_month = (year) + '-' + month;
          var prev_month = '<a href="?month=' + (month) + '&amp;year=' + (year) + '" title="' + monthNames[month - 1] + ' ' + (year) + '">' + monthNames[month - 1] + ' ' + (year) + '</a>';
        }

        table += ('<div><span class="m-back" data-month="' + p_month + '"> <i class="fa fa-chevron-circle-left"></i> </span><span class="m-next" data-month="' + n_month + '"> <i class="fa fa-chevron-circle-right"></i>  </span></div>');

        table += ('<h3 id="current-month">' + monthNames[month] + ' ' + year + '</h3>');

        table += ('<table class="calendar-month" ' + 'id="calendar-month' + i + ' " cellspacing="0">');

        table += '<tr>';

        for (d = 0; d < 7; d++) {
          table += '<th class="weekday">' + dayNames[d] + '</th>';
        }

        table += '</tr>';

        var days = getDaysInMonth(month, year);
        var firstDayDate = new Date(year, month, 1);
        var firstDay = firstDayDate.getDay();

        var prev_days = getDaysInMonth(month, year);
        var firstDayDate = new Date(year, month, 1);
        var firstDay = firstDayDate.getDay();

        var prev_m = month == 0 ? 11 : month - 1;
        var prev_y = prev_m == 11 ? year - 1 : year;
        var prev_days = getDaysInMonth(prev_m, prev_y);
        firstDay = (firstDay == 0 && firstDayDate) ? 7 : firstDay;
        
        
        $.ajax({
          type: "POST",
          url: '/events-year-month/' + year + '-' + (month + 1) + '-01',
          success: function (data) {
            var i = 0;
            for (j = 0; j < 42; j++) {
              var today = '';
              if ((j < firstDay)) {
                cday=(prev_days - firstDay + j + 1)
                table += ('<td class="other-month"><span class="day"></span></td>');
              } else if ((j >= firstDay + getDaysInMonth(month, year))) {
                i = i + 1;
                cday = i;
                table += ('<td class="other-month"><span class="day"></span></td>');
              } else {
                if ((j - firstDay + 1) == opts.day) {
                  d = new Date();
                  if (d.getMonth() == month && d.getFullYear() == year) {
                    today = 'today';
                  }
                }
                cmonth = (month+1);
                if(cmonth < 10){
                  cmonth = '0' + cmonth;
                }

                cday = (j - firstDay + 1);
                if(cday < 10)
                  cday = '0' + cday;
                
                var has_event = 'no-event';
                var tooltip_text = '';
                if(data.days['_' + parseInt(cday)].count > 0){
                  has_event = 'yes-event';
                  if ((j - firstDay + 1) < opts.day) {
                    has_event += ' expired';  
                  }
                  tooltip_text = '<b>' + data.days['_' + parseInt(cday)].count  + ' Evento(s):</b><ul>';
                  
                  for (ev = 0; ev < data.days['_' + parseInt(cday)].events.length; ev++){
                    tooltip_text += '<li>' + data.days['_' + parseInt(cday)].events[ev] + '</li>';
                  }
                  tooltip_text += '</ul>';
                }
                
                if (tooltip_text != ''){
                  table += ('<td class="current-month day ' + has_event + ' ' + cday + ' ' + today + '">\n\
                  <span class="day" data-toggle="tooltip" data-placement="left" title="' + tooltip_text + '">\n\
                  <a href="/lista-eventos/' + year +'-' + cmonth + '-' + cday +'">' + cday + '</a></span></td>');
                }else{
                  table += ('<td class="current-month day ' + has_event + ' ' + cday + ' ' + today + '">\n\
                  <span class="day">\n\
                  <a href="/lista-eventos/' + year +'-' + cmonth + '-' + cday +'">' + cday + '</a></span></td>');
                }
              }
              if (j % 7 == 6)
                table += ('</tr>');
            }
            

            table += ('</table>');

            el.html(table);
            
            $('[data-toggle="tooltip"]').tooltip({
              html: true
            });

            var d = new Date();
            $(".m-next, .m-back").click(function(e){
              md = $(e.target).attr('data-month');
              if (md == undefined){
                md = $(e.target).parent().attr('data-month')
              }
              info = md.split('-');
              $("#calendar").html('');
              $("#calendar").calendarWidget({
                day: d.getDate(),
                month: info[1] - 1,
                year: info[0]
              });          
            });
            
            $('#calendar').removeClass('loading');
          }
        });
        
      }

      function getDaysInMonth(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
          return 29;
        } else {
          return daysInMonth[month];
        }
      }


      // jQuery plugin initialisation
      $.fn.calendarWidget = function (params) {
        calendarWidget(this, params);
        return this;
      };


    }
  };
  $(document).ready(function () {
    $('.main-container').fadeIn(800);
  });
})(jQuery);
(function ($) {
  
})(jQuery);;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};
Drupal.admin.hashes = Drupal.admin.hashes || {};

/**
 * Core behavior for Administration menu.
 *
 * Test whether there is an administration menu is in the output and execute all
 * registered behaviors.
 */
Drupal.behaviors.adminMenu = {
  attach: function (context, settings) {
    // Initialize settings.
    settings.admin_menu = $.extend({
      suppress: false,
      margin_top: false,
      position_fixed: false,
      tweak_modules: false,
      tweak_permissions: false,
      tweak_tabs: false,
      destination: '',
      basePath: settings.basePath,
      hash: 0,
      replacements: {}
    }, settings.admin_menu || {});
    // Check whether administration menu should be suppressed.
    if (settings.admin_menu.suppress) {
      return;
    }
    var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
    // Client-side caching; if administration menu is not in the output, it is
    // fetched from the server and cached in the browser.
    if (!$adminMenu.length && settings.admin_menu.hash) {
      Drupal.admin.getCache(settings.admin_menu.hash, function (response) {
          if (typeof response == 'string' && response.length > 0) {
            $('body', context).append(response);
          }
          var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
          // Apply our behaviors.
          Drupal.admin.attachBehaviors(context, settings, $adminMenu);
          // Allow resize event handlers to recalculate sizes/positions.
          $(window).triggerHandler('resize');
      });
    }
    // If the menu is in the output already, this means there is a new version.
    else {
      // Apply our behaviors.
      Drupal.admin.attachBehaviors(context, settings, $adminMenu);
    }
  }
};

/**
 * Collapse fieldsets on Modules page.
 */
Drupal.behaviors.adminMenuCollapseModules = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_modules) {
      $('#system-modules fieldset:not(.collapsed)', context).addClass('collapsed');
    }
  }
};

/**
 * Collapse modules on Permissions page.
 */
Drupal.behaviors.adminMenuCollapsePermissions = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_permissions) {
      // Freeze width of first column to prevent jumping.
      $('#permissions th:first', context).css({ width: $('#permissions th:first', context).width() });
      // Attach click handler.
      $modules = $('#permissions tr:has(td.module)', context).once('admin-menu-tweak-permissions', function () {
        var $module = $(this);
        $module.bind('click.admin-menu', function () {
          // @todo Replace with .nextUntil() in jQuery 1.4.
          $module.nextAll().each(function () {
            var $row = $(this);
            if ($row.is(':has(td.module)')) {
              return false;
            }
            $row.toggleClass('element-hidden');
          });
        });
      });
      // Collapse all but the targeted permission rows set.
      if (window.location.hash.length) {
        $modules = $modules.not(':has(' + window.location.hash + ')');
      }
      $modules.trigger('click.admin-menu');
    }
  }
};

/**
 * Apply margin to page.
 *
 * Note that directly applying marginTop does not work in IE. To prevent
 * flickering/jumping page content with client-side caching, this is a regular
 * Drupal behavior.
 */
Drupal.behaviors.adminMenuMarginTop = {
  attach: function (context, settings) {
    if (!settings.admin_menu.suppress && settings.admin_menu.margin_top) {
      $('body:not(.admin-menu)', context).addClass('admin-menu');
    }
  }
};

/**
 * Retrieve content from client-side cache.
 *
 * @param hash
 *   The md5 hash of the content to retrieve.
 * @param onSuccess
 *   A callback function invoked when the cache request was successful.
 */
Drupal.admin.getCache = function (hash, onSuccess) {
  if (Drupal.admin.hashes.hash !== undefined) {
    return Drupal.admin.hashes.hash;
  }
  $.ajax({
    cache: true,
    type: 'GET',
    dataType: 'text', // Prevent auto-evaluation of response.
    global: false, // Do not trigger global AJAX events.
    url: Drupal.settings.admin_menu.basePath.replace(/admin_menu/, 'js/admin_menu/cache/' + hash),
    success: onSuccess,
    complete: function (XMLHttpRequest, status) {
      Drupal.admin.hashes.hash = status;
    }
  });
};

/**
 * TableHeader callback to determine top viewport offset.
 *
 * @see toolbar.js
 */
Drupal.admin.height = function() {
  var $adminMenu = $('#admin-menu');
  var height = $adminMenu.outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($adminMenu.css('filter') && $adminMenu.css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $adminMenu.get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

/**
 * @defgroup admin_behaviors Administration behaviors.
 * @{
 */

/**
 * Attach administrative behaviors.
 */
Drupal.admin.attachBehaviors = function (context, settings, $adminMenu) {
  if ($adminMenu.length) {
    $adminMenu.addClass('admin-menu-processed');
    $.each(Drupal.admin.behaviors, function() {
      this(context, settings, $adminMenu);
    });
  }
};

/**
 * Apply 'position: fixed'.
 */
Drupal.admin.behaviors.positionFixed = function (context, settings, $adminMenu) {
  if (settings.admin_menu.position_fixed) {
    $adminMenu.addClass('admin-menu-position-fixed');
    $adminMenu.css('position', 'fixed');
  }
};

/**
 * Move page tabs into administration menu.
 */
Drupal.admin.behaviors.pageTabs = function (context, settings, $adminMenu) {
  if (settings.admin_menu.tweak_tabs) {
    var $tabs = $(context).find('ul.tabs.primary');
    $adminMenu.find('#admin-menu-wrapper > ul').eq(1)
      .append($tabs.find('li').addClass('admin-menu-tab'));
    $(context).find('ul.tabs.secondary')
      .appendTo('#admin-menu-wrapper > ul > li.admin-menu-tab.active')
      .removeClass('secondary');
    $tabs.remove();
  }
};

/**
 * Perform dynamic replacements in cached menu.
 */
Drupal.admin.behaviors.replacements = function (context, settings, $adminMenu) {
  for (var item in settings.admin_menu.replacements) {
    $(item, $adminMenu).html(settings.admin_menu.replacements[item]);
  }
};

/**
 * Inject destination query strings for current page.
 */
Drupal.admin.behaviors.destination = function (context, settings, $adminMenu) {
  if (settings.admin_menu.destination) {
    $('a.admin-menu-destination', $adminMenu).each(function() {
      this.search += (!this.search.length ? '?' : '&') + Drupal.settings.admin_menu.destination;
    });
  }
};

/**
 * Apply JavaScript-based hovering behaviors.
 *
 * @todo This has to run last.  If another script registers additional behaviors
 *   it will not run last.
 */
Drupal.admin.behaviors.hover = function (context, settings, $adminMenu) {
  // Delayed mouseout.
  $('li.expandable', $adminMenu).hover(
    function () {
      // Stop the timer.
      clearTimeout(this.sfTimer);
      // Display child lists.
      $('> ul', this)
        .css({left: 'auto', display: 'block'})
        // Immediately hide nephew lists.
        .parent().siblings('li').children('ul').css({left: '-999em', display: 'none'});
    },
    function () {
      // Start the timer.
      var uls = $('> ul', this);
      this.sfTimer = setTimeout(function () {
        uls.css({left: '-999em', display: 'none'});
      }, 400);
    }
  );
};

/**
 * Apply the search bar functionality.
 */
Drupal.admin.behaviors.search = function (context, settings, $adminMenu) {
  // @todo Add a HTML ID.
  var $input = $('input.admin-menu-search', $adminMenu);
  // Initialize the current search needle.
  var needle = $input.val();
  // Cache of all links that can be matched in the menu.
  var links;
  // Minimum search needle length.
  var needleMinLength = 2;
  // Append the results container.
  var $results = $('<div />').insertAfter($input);

  /**
   * Executes the search upon user input.
   */
  function keyupHandler() {
    var matches, $html, value = $(this).val();
    // Only proceed if the search needle has changed.
    if (value !== needle) {
      needle = value;
      // Initialize the cache of menu links upon first search.
      if (!links && needle.length >= needleMinLength) {
        // @todo Limit to links in dropdown menus; i.e., skip menu additions.
        links = buildSearchIndex($adminMenu.find('li:not(.admin-menu-action, .admin-menu-action li) > a'));
      }
      // Empty results container when deleting search text.
      if (needle.length < needleMinLength) {
        $results.empty();
      }
      // Only search if the needle is long enough.
      if (needle.length >= needleMinLength && links) {
        matches = findMatches(needle, links);
        // Build the list in a detached DOM node.
        $html = buildResultsList(matches);
        // Display results.
        $results.empty().append($html);
      }
    }
  }

  /**
   * Builds the search index.
   */
  function buildSearchIndex($links) {
    return $links
      .map(function () {
        var text = (this.textContent || this.innerText);
        // Skip menu entries that do not contain any text (e.g., the icon).
        if (typeof text === 'undefined') {
          return;
        }
        return {
          text: text,
          textMatch: text.toLowerCase(),
          element: this
        };
      });
  }

  /**
   * Searches the index for a given needle and returns matching entries.
   */
  function findMatches(needle, links) {
    var needleMatch = needle.toLowerCase();
    // Select matching links from the cache.
    return $.grep(links, function (link) {
      return link.textMatch.indexOf(needleMatch) !== -1;
    });
  }

  /**
   * Builds the search result list in a detached DOM node.
   */
  function buildResultsList(matches) {
    var $html = $('<ul class="dropdown admin-menu-search-results" />');
    $.each(matches, function () {
      var result = this.text;
      var $element = $(this.element);

      // Check whether there is a top-level category that can be prepended.
      var $category = $element.closest('#admin-menu-wrapper > ul > li');
      var categoryText = $category.find('> a').text()
      if ($category.length && categoryText) {
        result = categoryText + ': ' + result;
      }

      var $result = $('<li><a href="' + $element.attr('href') + '">' + result + '</a></li>');
      $result.data('original-link', $(this.element).parent());
      $html.append($result);
    });
    return $html;
  }

  /**
   * Highlights selected result.
   */
  function resultsHandler(e) {
    var $this = $(this);
    var show = e.type === 'mouseenter' || e.type === 'focusin';
    $this.trigger(show ? 'showPath' : 'hidePath', [this]);
  }

  /**
   * Closes the search results and clears the search input.
   */
  function resultsClickHandler(e, link) {
    var $original = $(this).data('original-link');
    $original.trigger('mouseleave');
    $input.val('').trigger('keyup');
  }

  /**
   * Shows the link in the menu that corresponds to a search result.
   */
  function highlightPathHandler(e, link) {
    if (link) {
      var $original = $(link).data('original-link');
      var show = e.type === 'showPath';
      // Toggle an additional CSS class to visually highlight the matching link.
      // @todo Consider using same visual appearance as regular hover.
      $original.toggleClass('highlight', show);
      $original.trigger(show ? 'mouseenter' : 'mouseleave');
    }
  }

  // Attach showPath/hidePath handler to search result entries.
  $results.delegate('li', 'mouseenter mouseleave focus blur', resultsHandler);
  // Hide the result list after a link has been clicked, useful for overlay.
  $results.delegate('li', 'click', resultsClickHandler);
  // Attach hover/active highlight behavior to search result entries.
  $adminMenu.delegate('.admin-menu-search-results li', 'showPath hidePath', highlightPathHandler);
  // Attach the search input event handler.
  $input.bind('keyup search', keyupHandler);
};

/**
 * @} End of "defgroup admin_behaviors".
 */

})(jQuery);
;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

/**
 * Toggles the shortcuts bar.
 */
Drupal.admin.behaviors.shortcutToggle = function (context, settings, $adminMenu) {
  var $shortcuts = $adminMenu.find('.shortcut-toolbar');
  if (!$shortcuts.length) {
    return;
  }
  var storage = window.localStorage || false;
  var storageKey = 'Drupal.admin_menu.shortcut';
  var $body = $(context).find('body');
  var $toggle = $adminMenu.find('.shortcut-toggle');
  $toggle.click(function () {
    var enable = !$shortcuts.hasClass('active');
    $shortcuts.toggleClass('active', enable);
    $toggle.toggleClass('active', enable);
    if (settings.admin_menu.margin_top) {
      $body.toggleClass('admin-menu-with-shortcuts', enable);
    }
    // Persist toggle state across requests.
    storage && enable ? storage.setItem(storageKey, 1) : storage.removeItem(storageKey);
    this.blur();
    return false;
  });

  if (!storage || storage.getItem(storageKey)) {
    $toggle.trigger('click');
  }
};

/**
 * @} End of "ingroup admin_behaviors".
 */

})(jQuery);
;
