Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.highlightMatches = highlightMatches;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var fuzzaldrinPlus = _interopRequireWildcard(_fuzzaldrinPlus);

'use babel';

function highlightMatches(text, filterQuery) {
  var offsetIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var matches = fuzzaldrinPlus.match(text, filterQuery);
  var lastIndex = 0;
  var matchedChars = [];

  var output = document.createElement('span');

  for (var matchIndex of matches) {
    matchIndex -= offsetIndex;
    if (matchIndex < 0) continue;
    var unmatched = text.substring(lastIndex, matchIndex);
    if (unmatched) {
      if (matchedChars.length > 0) {
        var s = document.createElement('span');
        s.classList.add('character-match');
        s.innerText = matchedChars.join('');
        output.appendChild(s);
      }
      matchedChars = [];
      var _t = document.createElement('span');
      _t.innerText = unmatched;
      output.appendChild(_t);
    }
    matchedChars.push(text[matchIndex]);
    lastIndex = matchIndex + 1;
  }

  if (matchedChars.length > 0) {
    var s = document.createElement('span');
    s.classList.add('character-match');
    s.innerText = matchedChars.join('');
    output.appendChild(s);
  }

  var t = document.createElement('span');
  t.innerText = text.substring(lastIndex);
  output.appendChild(t);

  return output;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL21hdGNoSGlnaGxpZ2h0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs4QkFFZ0MsaUJBQWlCOztJQUFyQyxjQUFjOztBQUYxQixXQUFXLENBQUE7O0FBSUosU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFtQjtNQUFqQixXQUFXLHlEQUFHLENBQUM7O0FBQ2pFLE1BQUksT0FBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ3JELE1BQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixNQUFJLFlBQVksR0FBRyxFQUFFLENBQUE7O0FBRXJCLE1BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRTNDLE9BQUssSUFBSSxVQUFVLElBQUksT0FBTyxFQUFFO0FBQzlCLGNBQVUsSUFBSSxXQUFXLENBQUE7QUFDekIsUUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFNBQVE7QUFDNUIsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDckQsUUFBSSxTQUFTLEVBQUU7QUFDYixVQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLFlBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEMsU0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNsQyxTQUFDLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDbkMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUN0QjtBQUNELGtCQUFZLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFVBQUksRUFBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEMsUUFBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDdkIsWUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFDLENBQUMsQ0FBQTtLQUN0QjtBQUNELGdCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQ25DLGFBQVMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFBO0dBQzNCOztBQUVELE1BQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0IsUUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0QyxLQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ2xDLEtBQUMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3RCOztBQUVELE1BQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEMsR0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZDLFFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXJCLFNBQU8sTUFBTSxDQUFBO0NBQ2QiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvbWF0Y2hIaWdobGlnaHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIGZ1enphbGRyaW5QbHVzIGZyb20gJ2Z1enphbGRyaW4tcGx1cydcblxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hsaWdodE1hdGNoZXModGV4dCwgZmlsdGVyUXVlcnksIG9mZnNldEluZGV4ID0gMCkge1xuICBsZXQgbWF0Y2hlcyA9IGZ1enphbGRyaW5QbHVzLm1hdGNoKHRleHQsIGZpbHRlclF1ZXJ5KVxuICBsZXQgbGFzdEluZGV4ID0gMFxuICBsZXQgbWF0Y2hlZENoYXJzID0gW11cblxuICBsZXQgb3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgZm9yIChsZXQgbWF0Y2hJbmRleCBvZiBtYXRjaGVzKSB7XG4gICAgbWF0Y2hJbmRleCAtPSBvZmZzZXRJbmRleFxuICAgIGlmIChtYXRjaEluZGV4IDwgMCkgY29udGludWVcbiAgICBsZXQgdW5tYXRjaGVkID0gdGV4dC5zdWJzdHJpbmcobGFzdEluZGV4LCBtYXRjaEluZGV4KVxuICAgIGlmICh1bm1hdGNoZWQpIHtcbiAgICAgIGlmIChtYXRjaGVkQ2hhcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBzLmNsYXNzTGlzdC5hZGQoJ2NoYXJhY3Rlci1tYXRjaCcpXG4gICAgICAgIHMuaW5uZXJUZXh0ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgICAgIG91dHB1dC5hcHBlbmRDaGlsZChzKVxuICAgICAgfVxuICAgICAgbWF0Y2hlZENoYXJzID0gW11cbiAgICAgIGxldCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICB0LmlubmVyVGV4dCA9IHVubWF0Y2hlZFxuICAgICAgb3V0cHV0LmFwcGVuZENoaWxkKHQpXG4gICAgfVxuICAgIG1hdGNoZWRDaGFycy5wdXNoKHRleHRbbWF0Y2hJbmRleF0pXG4gICAgbGFzdEluZGV4ID0gbWF0Y2hJbmRleCArIDFcbiAgfVxuXG4gIGlmIChtYXRjaGVkQ2hhcnMubGVuZ3RoID4gMCkge1xuICAgIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgcy5jbGFzc0xpc3QuYWRkKCdjaGFyYWN0ZXItbWF0Y2gnKVxuICAgIHMuaW5uZXJUZXh0ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgb3V0cHV0LmFwcGVuZENoaWxkKHMpXG4gIH1cblxuICBsZXQgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICB0LmlubmVyVGV4dCA9IHRleHQuc3Vic3RyaW5nKGxhc3RJbmRleClcbiAgb3V0cHV0LmFwcGVuZENoaWxkKHQpXG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIl19