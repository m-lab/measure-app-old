describe('tests for additional $history functions', function() {
  'use strict';
  var historyProvider;

  beforeEach(module('ui.router'));
  beforeEach(module('MeasureApp'));
  beforeEach(inject(function($history) {
    historyProvider = $history;
    historyProvider.push('state1', 'param1');
    historyProvider.push('state2', 'param2');
    historyProvider.push('state3', 'param3');
  }));

  it('should have four elements', function() {
    expect(historyProvider.all().length).toEqual(4);
  });

  it('should provide the most recent state with previous()', function() {
    expect(historyProvider.previous()).toEqual({state: 'state3',
        params: 'param3'});
  });

  it('should fail when go() is sent too far back', function() {
    var historyProviderFailure = function() {
      historyProvider.go(5);
    };
    expect(historyProviderFailure).toThrowError(TypeError);
  });
});
