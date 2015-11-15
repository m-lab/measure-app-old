// Measure.app

angular.module('MeasureApp', [], function($provide) {
  // Prevent Angular from sniffing for the history API
  // since it's not supported in packaged apps.
  $provide.decorator('$window', function($delegate) {
    $delegate.history.pushState = null;
    return $delegate;
  });
})

/*
  Add chrome-extension addresses to angular's whitelist to avoid issues
  encountered after the packaging of extensions.
  Reference: http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page
*/
.config(['$compileProvider', function($compileProvider) {
  if (window.chrome && chrome.app && chrome.app.runtime) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  }
}])

/*
  Help service and rootScope listener to properly manage $history when window
  is not available.
*/

.service('$history', function($state) {
  var history = [];

  angular.extend(this, {
    push: function(state, params) {
      history.push({state: state, params: params});
    },
    all: function() {
      return history;
    },
    go: function(step) {
      var prev = this.previous(step || -1);
      return $state.go(prev.state, prev.params);
    },
    previous: function(step) {
      return history[history.length - Math.abs(step || 1)];
    },
    back: function() {
      return this.go(-1);
    }
  });
})

/*
  When a state is changed, push it to the history.
*/

.run(function($history, $state, $rootScope) {
  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from,
      fromParams) {
    if (!from.abstract) {
      $history.push(from, fromParams);
    }
  });
  $history.push($state.current, $state.params);
});
