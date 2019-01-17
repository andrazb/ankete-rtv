$(document).ready(function() {


  var anketa = {
    pollId: (getAllUrlParams(location.href).pollid == undefined ) ? 7596 : getAllUrlParams(location.href).pollid,

    getPollInit: function() {
      $.ajax({
        url: 'https://api.rtvslo.si/poll/getPollById?client_id=8b6950d87f5b94fc8ee5227d036d27f3&id=' + anketa.pollId + '&callback=?',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(data) {
          $('#poll-container .question-title').html(data.response.question);
          $.each(data.response.answers, function(ind, val) {
            $('.answers-container-init').append('<input type="radio" name="answers-group" value="' + val.id + '" id="' + val.id + '"><label for="' + val.id + '">' + val.answer + '</label>');
          });
        }
      });
    },

    getPollResults: function() {
      $("#poll-container .button-container").addClass("d-none");
      $("#poll-container .answers-container-init").addClass("d-none");
      $.ajax({
        url: 'https://api.rtvslo.si/poll/getPollById?client_id=8b6950d87f5b94fc8ee5227d036d27f3&id=' + anketa.pollId + '&callback=?',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(data) {
          $('#poll-container .question-title').html(data.response.question);
          var sum = 0;
          $.each(data.response.answers, function(ind, val) {
            sum = sum + parseInt(val.times);
          });
          $("#poll-container .sum-votes-container").html("Skupaj število glasov: " + sum);
          $("#poll-container .sum-votes-container").removeClass("d-none");
          $.each(data.response.answers, function(ind, val) {
            $('.answers-container').append(
              '<div class="d-table-row">' +
                '<div class="d-table-cell pr-1">' + Math.round((val.times / sum) * 100) + '%</div>' +
                '<div class="d-table-cell w-100">' +
                  '<div class="progress">' +
                    '<div class="progress-bar" style="width:' + Math.round((val.times / sum) * 100) + '%">' +
                val.answer +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          });
        }
      });
    },

    vote: function() {
      $.ajax({
        url: 'https://api.rtvslo.si/poll/votePoll?client_id=8b6950d87f5b94fc8ee5227d036d27f3',
        type: 'POST',
        data: { 
          answerId: $('#poll-container input[name=questions-group]:checked').val(),
          pollId: anketa.pollId
        },
        success: function(data) {
          localStorage.setItem('Voted' + anketa.pollId, '1');
          anketa.getPollResults();
        },
        error: function(data) {
          console.log('error');
          localStorage.setItem('Voted' + anketa.pollId, '1');
          anketa.getPollResults();
        }
      });
    }

  }

  if(localStorage.getItem('Voted' + anketa.pollId) != 1) {
    $('#poll-container .button-container').removeClass('d-none');
    anketa.getPollInit();
  } else {
    anketa.getPollResults();
  }

  $('#poll-container .button-container').click(function() {
    if ($('#poll-container input[name=answers-group]:checked').val() != undefined) { // odgovor mora biti izbran
      anketa.vote();
    }
  });

});