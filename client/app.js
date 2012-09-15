// Generated by CoffeeScript 1.3.3
(function() {
  'use strict';

  var MAIN_FRAME_SELECTOR, inbox, payment;

  console.log('extension script loaded with jquery and underscore');

  window.addEventListener('hashchange', function() {
    console.log(window.location.hash);
    if (window.location.hash.match(/compose/)) {
      return payment.renderButton();
    }
  });

  MAIN_FRAME_SELECTOR = '#canvas_frame';

  payment = {
    renderButton: function() {
      var $actions;
      $actions = $(MAIN_FRAME_SELECTOR).contents().find('div[role=navigation]').last().children().first();
      return $actions.append('<div class="J-J5-Ji">$</div>').children('span').remove();
    }
  };

  inbox = {
    sort: function() {
      var $emails, emails;
      $emails = $('#canvas_frame').contents().find('table > colgroup').eq(1).parent().find('tr');
      emails = _(emails).map(function(email, i) {
        var subject, value;
        subject = email.find('td[role=link] div > span:first-child').text();
        value = subject.match(/^\$[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?\$/);
        if (value != null) {
          value = parseFloat(value[0][{
            1: -2
          }]);
        } else {
          value = 0;
        }
        return {
          subject: subject,
          value: value,
          index: i
        };
      });
      return console.log(emails);
    }
  };

  $(MAIN_FRAME_SELECTOR).load(function() {
    console.log('loaded');
    return inbox.sort();
  });

  $(function() {
    return $(window).trigger('hashchange');
  });

}).call(this);
