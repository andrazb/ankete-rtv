var app = angular.module('ankete', []);

app.controller('main', function($scope, $http, $sce) {

  let pollIdUrlParam = getAllUrlParams(location.href).pollid;
  let pollId = (pollIdUrlParam == undefined ) ? 7596 : pollIdUrlParam;
  $scope.question = '';
  $scope.hasVoted = (localStorage.getItem('Voted' + pollId) != 1) ? false : true;
  let urlGetPoll = 'https://api.rtvslo.si/poll/getPollById?client_id=8b6950d87f5b94fc8ee5227d036d27f3&id=' + pollId;
  let trustedUrlGetPoll = $sce.trustAsResourceUrl(urlGetPoll);
  let urlVote = 'https://api.rtvslo.si/poll/votePoll?client_id=8b6950d87f5b94fc8ee5227d036d27f3';

  // pridobitev ankete
  $scope.getPoll = function() {
    $scope.voteSum = 0;
    $http.jsonp(trustedUrlGetPoll, {jsonpCallbackParam: 'callback'})
    .then(function(data) {
      $scope.responseData = data.data.response;
      for (let i=0; i< data.data.response.answers.length; i++) {
        $scope.voteSum = $scope.voteSum + parseInt(data.data.response.answers[i].times);
      }
    })
    .catch(function (err) {
      console.log("error");
    });
  }

  // glasovanje
  $scope.vote = function () {
    if ($scope.clickedAnswer != undefined) {
      $http({
        method : 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        url : urlVote,
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            return str.join('&');
        },
        data: { answerId: $scope.clickedAnswer, pollId: pollId }
      }).then(function(data) {
        localStorage.setItem('Voted' + pollId, 1);
        $scope.hasVoted = true;
        $scope.getPoll();
      }).catch(function (err) {
        console.log("error");
      });
    }
  }

  $scope.getPoll(); // prvi klic

});