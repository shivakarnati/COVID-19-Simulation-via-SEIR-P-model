Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getCode = getCode;
exports.getCursorCellRanges = getCursorCellRanges;
exports.moveNext = moveNext;
exports.movePrev = movePrev;
exports.get = get;

require('atom');

'use babel';

function getCode(ed) {
  var text = ed.getText();
  var lines = text.split("\n");
  var N = ed.getLineCount();
  var code = "";

  for (var i = 0; i < N; i++) {
    var scopes = ed.scopeDescriptorForBufferPosition([i, 0]).scopes;
    if (scopes.length > 1) {
      if (scopes.indexOf("source.embedded.julia") > -1) {
        code += lines[i] + "\n";
      }
    }
  }
  return code;
}

function getEmbeddedScope(cursor) {
  var scopes = cursor.getScopeDescriptor().scopes;
  var targetScope = null;
  for (var scope of scopes) {
    if (scope.startsWith('source.embedded.')) {
      targetScope = scope;
      break;
    }
  }
  return targetScope;
}

function getCurrentCellRange(ed, cursor) {
  var scope = getEmbeddedScope(cursor);
  if (scope === null) return null;

  var start = cursor.getBufferRow();
  var end = start;
  while (start - 1 >= 0 && ed.scopeDescriptorForBufferPosition([start - 1, 0]).scopes.indexOf(scope) > -1) {
    start -= 1;
  }
  while (end + 1 <= ed.getLastBufferRow() && ed.scopeDescriptorForBufferPosition([end + 1, 0]).scopes.indexOf(scope) > -1) {
    end += 1;
  }
  return [[start, 0], [end, Infinity]];
}

function getCursorCellRanges(ed) {
  var ranges = [];
  for (var cursor of ed.getCursors()) {
    var range = getCurrentCellRange(ed, cursor);
    if (range !== null) {
      ranges.push(range);
    }
  }
  return ranges;
}

function moveNext(ed) {
  for (var cursor of ed.getCursors()) {
    var scope = getEmbeddedScope(cursor);
    if (scope === null) return null;

    var range = getCurrentCellRange(ed, cursor);
    var endRow = range[1][0] + 1;
    while (endRow + 1 <= ed.getLastBufferRow() && ed.scopeDescriptorForBufferPosition([endRow + 1, 0]).scopes.indexOf(scope) === -1) {
      endRow += 1;
    }
    cursor.setBufferPosition([endRow + 1, Infinity]);
  }
}

function movePrev(ed) {
  for (var cursor of ed.getCursors()) {
    var scope = getEmbeddedScope(cursor);
    if (scope === null) return null;

    var range = getCurrentCellRange(ed, cursor);
    var startRow = range[0][0] - 1;
    while (startRow - 1 >= 0 && ed.scopeDescriptorForBufferPosition([startRow - 1, 0]).scopes.indexOf(scope) === -1) {
      startRow -= 1;
    }
    cursor.setBufferPosition([startRow - 1, Infinity]);
  }
}

function get(ed) {
  var ranges = getCursorCellRanges(ed);
  if (ranges.length === 0) return [];

  var processedRanges = [];
  for (var range of ranges) {
    var text = ed.getTextInBufferRange(range);
    range[1][0] += 1; // move result one line down
    processedRanges.push({
      range: range,
      selection: ed.getSelections()[0],
      line: range[0][0],
      text: text || ' '
    });
  }
  return processedRanges;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9taXNjL3dlYXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQUVPLE1BQU07O0FBRmIsV0FBVyxDQUFBOztBQUlKLFNBQVMsT0FBTyxDQUFFLEVBQUUsRUFBRTtBQUMzQixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM5QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDM0IsTUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUViLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekIsUUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO0FBQy9ELFFBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbkIsVUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDOUMsWUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7T0FDMUI7S0FDSjtHQUNIO0FBQ0QsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFRCxTQUFTLGdCQUFnQixDQUFFLE1BQU0sRUFBRTtBQUNqQyxNQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLENBQUE7QUFDL0MsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLE9BQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFF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QUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsVUFBSSxFQUFFLElBQUksSUFBSSxHQUFHO0tBQ2xCLENBQUMsQ0FBQTtHQUNIO0FBQ0QsU0FBTyxlQUFlLENBQUE7Q0FDdkIiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL21pc2Mvd2VhdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJ2F0b20nXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2RlIChlZCkge1xuICBjb25zdCB0ZXh0ID0gZWQuZ2V0VGV4dCgpXG4gIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKVxuICBjb25zdCBOID0gZWQuZ2V0TGluZUNvdW50KClcbiAgbGV0IGNvZGUgPSBcIlwiXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgbGV0IHNjb3BlcyA9IGVkLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtpLCAwXSkuc2NvcGVzXG4gICAgIGlmIChzY29wZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgaWYgKHNjb3Blcy5pbmRleE9mKFwic291cmNlLmVtYmVkZGVkLmp1bGlhXCIpID4gLTEpIHtcbiAgICAgICAgICAgICBjb2RlICs9IGxpbmVzW2ldICsgXCJcXG5cIlxuICAgICAgICAgfVxuICAgICB9XG4gIH1cbiAgcmV0dXJuIGNvZGVcbn1cblxuZnVuY3Rpb24gZ2V0RW1iZWRkZWRTY29wZSAoY3Vyc29yKSB7XG4gIGxldCBzY29wZXMgPSBjdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzXG4gIGxldCB0YXJnZXRTY29wZSA9IG51bGxcbiAgZm9yIChsZXQgc2NvcGUgb2Ygc2NvcGVzKSB7XG4gICAgaWYgKHNjb3BlLnN0YXJ0c1dpdGgoJ3NvdXJjZS5lbWJlZGRlZC4nKSkge1xuICAgICAgdGFyZ2V0U2NvcGUgPSBzY29wZVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldFNjb3BlXG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDZWxsUmFuZ2UgKGVkLCBjdXJzb3IpIHtcbiAgbGV0IHNjb3BlID0gZ2V0RW1iZWRkZWRTY29wZShjdXJzb3IpXG4gIGlmIChzY29wZSA9PT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICBsZXQgc3RhcnQgPSBjdXJzb3IuZ2V0QnVmZmVyUm93KClcbiAgbGV0IGVuZCA9IHN0YXJ0XG4gIHdoaWxlIChzdGFydCAtIDEgPj0gMCAmJlxuICAgICAgICAgZWQuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3N0YXJ0IC0gMSwgMF0pLnNjb3Blcy5pbmRleE9mKHNjb3BlKSA+IC0xKSB7XG4gICAgc3RhcnQgLT0gMVxuICB9XG4gIHdoaWxlIChlbmQgKyAxIDw9IGVkLmdldExhc3RCdWZmZXJSb3coKSAmJlxuICAgICAgICAgZWQuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW2VuZCArIDEsIDBdKS5zY29wZXMuaW5kZXhPZihzY29wZSkgPiAtMSkge1xuICAgIGVuZCArPSAxXG4gIH1cbiAgcmV0dXJuIFtbc3RhcnQsIDBdLCBbZW5kLCBJbmZpbml0eV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJzb3JDZWxsUmFuZ2VzIChlZCkge1xuICBsZXQgcmFuZ2VzID0gW11cbiAgZm9yIChjb25zdCBjdXJzb3Igb2YgZWQuZ2V0Q3Vyc29ycygpKSB7XG4gICAgbGV0IHJhbmdlID0gZ2V0Q3VycmVudENlbGxSYW5nZShlZCwgY3Vyc29yKVxuICAgIGlmIChyYW5nZSAhPT0gbnVsbCkge1xuICAgICAgcmFuZ2VzLnB1c2gocmFuZ2UpXG4gICAgfVxuICB9XG4gIHJldHVybiByYW5nZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmVOZXh0IChlZCkge1xuICBmb3IgKGNvbnN0IGN1cnNvciBvZiBlZC5nZXRDdXJzb3JzKCkpIHtcbiAgICBsZXQgc2NvcGUgPSBnZXRFbWJlZGRlZFNjb3BlKGN1cnNvcilcbiAgICBpZiAoc2NvcGUgPT09IG51bGwpIHJldHVybiBudWxsXG5cbiAgICBsZXQgcmFuZ2UgPSBnZXRDdXJyZW50Q2VsbFJhbmdlKGVkLCBjdXJzb3IpXG4gICAgbGV0IGVuZFJvdyA9IHJhbmdlWzFdWzBdICsgMVxuICAgIHdoaWxlIChlbmRSb3cgKyAxIDw9IGVkLmdldExhc3RCdWZmZXJSb3coKSAmJlxuICAgICAgICAgICBlZC5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbZW5kUm93ICsgMSwgMF0pLnNjb3Blcy5pbmRleE9mKHNjb3BlKSA9PT0gLTEpIHtcbiAgICAgIGVuZFJvdyArPSAxXG4gICAgfVxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbZW5kUm93KzEsIEluZmluaXR5XSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZVByZXYgKGVkKSB7XG4gIGZvciAoY29uc3QgY3Vyc29yIG9mIGVkLmdldEN1cnNvcnMoKSkge1xuICAgIGxldCBzY29wZSA9IGdldEVtYmVkZGVkU2NvcGUoY3Vyc29yKVxuICAgIGlmIChzY29wZSA9PT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICAgIGxldCByYW5nZSA9IGdldEN1cnJlbnRDZWxsUmFuZ2UoZWQsIGN1cnNvcilcbiAgICBsZXQgc3RhcnRSb3cgPSByYW5nZVswXVswXSAtIDFcbiAgICB3aGlsZSAoc3RhcnRSb3cgLSAxID49IDAgJiZcbiAgICAgICAgICAgZWQuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3N0YXJ0Um93IC0gMSwgMF0pLnNjb3Blcy5pbmRleE9mKHNjb3BlKSA9PT0gLTEpIHtcbiAgICAgIHN0YXJ0Um93IC09IDFcbiAgICB9XG4gICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtzdGFydFJvdy0xLCBJbmZpbml0eV0pXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldCAoZWQpIHtcbiAgbGV0IHJhbmdlcyA9IGdldEN1cnNvckNlbGxSYW5nZXMoZWQpXG4gIGlmIChyYW5nZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW11cblxuICBsZXQgcHJvY2Vzc2VkUmFuZ2VzID0gW11cbiAgZm9yIChsZXQgcmFuZ2Ugb2YgcmFuZ2VzKSB7XG4gICAgbGV0IHRleHQgPSBlZC5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICByYW5nZVsxXVswXSArPSAxIC8vIG1vdmUgcmVzdWx0IG9uZSBsaW5lIGRvd25cbiAgICBwcm9jZXNzZWRSYW5nZXMucHVzaCh7XG4gICAgICByYW5nZTogcmFuZ2UsXG4gICAgICBzZWxlY3Rpb246IGVkLmdldFNlbGVjdGlvbnMoKVswXSxcbiAgICAgIGxpbmU6IHJhbmdlWzBdWzBdLFxuICAgICAgdGV4dDogdGV4dCB8fCAnICdcbiAgICB9KVxuICB9XG4gIHJldHVybiBwcm9jZXNzZWRSYW5nZXNcbn1cbiJdfQ==