(function ($) {
  Drupal.behaviors.tns_main_settings = {
    attach: function (context, settings) {
      $(window).load(function () {
        //Accordion
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
        //$('body .main-container').fadeIn(800);
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

  });
})(jQuery);
(function ($) {
  function hola() {
    console.log('hola')
  }
})(jQuery);