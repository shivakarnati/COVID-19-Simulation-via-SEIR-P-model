Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.withWord = withWord;
exports.getWordAndRange = getWordAndRange;
exports.getWordRangeAtBufferPosition = getWordRangeAtBufferPosition;
exports.getWordRangeWithoutTrailingDots = getWordRangeWithoutTrailingDots;
exports.isValidWordToInspect = isValidWordToInspect;
/** @babel */

var _atom = require('atom');

var wordRegex = /[\u00A0-\uFFFF\w_!´\.]*@?[\u00A0-\uFFFF\w_!´]+/;

exports.wordRegex = wordRegex;
/**
 * Takes an `editor` and gets the word at current cursor position. If that is nonempty, call
 * function `fn` with arguments `word` and `range`.
 */

function withWord(editor, fn) {
  var _getWordAndRange = getWordAndRange(editor);

  var word = _getWordAndRange.word;
  var range = _getWordAndRange.range;

  // If we only find numbers or nothing, return prematurely
  if (!isValidWordToInspect(word)) return;
  fn(word, range);
}

/**
 * Returns the word and its range in the `editor`.
 *
 * `options`
 * - `bufferPosition` {Point}: If given returns the word at the `bufferPosition`, returns the word at the current cursor otherwise.
 * - `wordRegex` {RegExp} : A RegExp indicating what constitutes a “word” (default: `wordRegex`).
 */

function getWordAndRange(editor) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {
    bufferPosition: undefined,
    wordRegex: wordRegex
  } : arguments[1];

  // @TODO?:
  // The following lines are kinda iffy: The regex may or may not be well chosen
  // and it duplicates the efforts from atom-language-julia.
  // It might be better to select the current word via finding the smallest <span>
  // containing the bufferPosition/cursor which also has `function` or `macro` as its class.
  var bufferPosition = options.bufferPosition ? options.bufferPosition : editor.getLastCursor().getBufferPosition();
  var range = getWordRangeAtBufferPosition(editor, bufferPosition, {
    wordRegex: options.wordRegex ? options.wordRegex : wordRegex
  });
  var word = editor.getTextInBufferRange(range);
  return { word: word, range: range };
}

/**
 * Returns the range of a word containing the `bufferPosition` in `editor`.
 *
 * `options`
 * - `wordRegex` {RegExp}: A RegExp indicating what constitutes a “word” (default: `wordRegex`).
 */

function getWordRangeAtBufferPosition(editor, bufferPosition) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {
    wordRegex: wordRegex
  } : arguments[2];

  // adapted from https://github.com/atom/atom/blob/v1.38.2/src/cursor.js#L606-L616
  var row = bufferPosition.row;
  var column = bufferPosition.column;

  var ranges = editor.getBuffer().findAllInRangeSync(options.wordRegex ? options.wordRegex : wordRegex, new _atom.Range(new _atom.Point(row, 0), new _atom.Point(row, Infinity)));
  var range = ranges.find(function (range) {
    return range.end.column >= column && range.start.column <= column;
  });
  return range ? _atom.Range.fromObject(range) : new _atom.Range(bufferPosition, bufferPosition);
}

/**
 * Examples: `|` represents `bufferPosition`:
 * - `"he|ad.word.foot"` => `Range` of `"head"`
 * - `"head|.word.foot"` => `Range` of `"head"`
 * - `"head.|word.foot"` => `Range` of `"head.word"`
 * - `"head.word.fo|ot"` => `Range` of `"head.word.field"`
 */

function getWordRangeWithoutTrailingDots(word, range, bufferPosition) {
  var start = range.start;
  var startColumn = start.column;
  var endRow = range.end.row;

  var endColumn = startColumn;

  var column = bufferPosition.column;

  var elements = word.split('.');
  for (var element of elements) {
    endColumn += element.length;
    if (column <= endColumn) {
      break;
    } else {
      endColumn += 1;
    }
  }

  var end = new _atom.Point(endRow, endColumn);
  return new _atom.Range(start, end);
}

/**
 * Returns `true` if `word` is valid word to be inspected.
 */

function isValidWordToInspect(word) {
  return word.length > 0 && isNaN(word);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9taXNjL3dvcmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZCLE1BQU07O0FBRTVCLElBQU0sU0FBUyxHQUFHLGdEQUFnRCxDQUFBOzs7Ozs7OztBQU1sRSxTQUFTLFFBQVEsQ0FBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO3lCQUNaLGVBQWUsQ0FBQyxNQUFNLENBQUM7O01BQXZDLElBQUksb0JBQUosSUFBSTtNQUFFLEtBQUssb0JBQUwsS0FBSzs7O0FBRW5CLE1BQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFNO0FBQ3ZDLElBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7Q0FDaEI7Ozs7Ozs7Ozs7QUFTTSxTQUFTLGVBQWUsQ0FBRSxNQUFNLEVBR3BDO01BSHNDLE9BQU8seURBQUc7QUFDakQsa0JBQWMsRUFBRSxTQUFTO0FBQ3pCLGFBQVMsRUFBRSxTQUFTO0dBQ3JCOzs7Ozs7O0FBTUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsR0FDM0MsT0FBTyxDQUFDLGNBQWMsR0FDdEIsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUE7QUFDNUMsTUFBTSxLQUFLLEdBQUcsNEJBQTRCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRTtBQUNqRSxhQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVM7R0FDN0QsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9DLFNBQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQTtDQUN2Qjs7Ozs7Ozs7O0FBUU0sU0FBUyw0QkFBNEIsQ0FBRSxNQUFNLEVBQUUsY0FBYyxFQUVqRTtNQUZtRSxPQUFPLHlEQUFHO0FBQzlFLGFBQVMsRUFBRSxTQUFTO0dBQ3JCOzs7TUFFUyxHQUFHLEdBQWEsY0FBYyxDQUE5QixHQUFHO01BQUUsTUFBTSxHQUFLLGNBQWMsQ0FBekIsTUFBTTs7QUFDbkIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUNsRCxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxFQUNqRCxnQkFBVSxnQkFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsZ0JBQVUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ3ZELENBQUE7QUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztXQUM3QixLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksTUFBTTtHQUFBLENBQzNELENBQUE7QUFDRCxTQUFPLEtBQUssR0FBRyxZQUFNLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxnQkFBVSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUE7Q0FDbkY7Ozs7Ozs7Ozs7QUFTTSxTQUFTLCtCQUErQixDQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO01BQ3BFLEtBQUssR0FBSyxLQUFLLENBQWYsS0FBSztNQUNHLFdBQVcsR0FBSyxLQUFLLENBQTdCLE1BQU07TUFDRCxNQUFNLEdBQUssS0FBSyxDQUFDLEdBQUcsQ0FBekIsR0FBRzs7QUFDWCxNQUFJLFNBQVMsR0FBRyxXQUFXLENBQUE7O01BRW5CLE1BQU0sR0FBSyxjQUFjLENBQXpCLE1BQU07O0FBRWQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNoQyxPQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM5QixhQUFTLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQTtBQUMzQixRQUFJLE1BQU0sSUFBSSxTQUFTLEVBQUU7QUFDdkIsWUFBSztLQUNOLE1BQU07QUFDTCxlQUFTLElBQUksQ0FBQyxDQUFBO0tBQ2Y7R0FDRjs7QUFFRCxNQUFNLEdBQUcsR0FBRyxnQkFBVSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDeEMsU0FBTyxnQkFBVSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7Q0FDN0I7Ozs7OztBQUtNLFNBQVMsb0JBQW9CLENBQUUsSUFBSSxFQUFFO0FBQzFDLFNBQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQ3RDIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9taXNjL3dvcmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBQb2ludCwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgY29uc3Qgd29yZFJlZ2V4ID0gL1tcXHUwMEEwLVxcdUZGRkZcXHdfIcK0XFwuXSpAP1tcXHUwMEEwLVxcdUZGRkZcXHdfIcK0XSsvXG5cbi8qKlxuICogVGFrZXMgYW4gYGVkaXRvcmAgYW5kIGdldHMgdGhlIHdvcmQgYXQgY3VycmVudCBjdXJzb3IgcG9zaXRpb24uIElmIHRoYXQgaXMgbm9uZW1wdHksIGNhbGxcbiAqIGZ1bmN0aW9uIGBmbmAgd2l0aCBhcmd1bWVudHMgYHdvcmRgIGFuZCBgcmFuZ2VgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aFdvcmQgKGVkaXRvciwgZm4pIHtcbiAgY29uc3QgeyB3b3JkLCByYW5nZSB9ID0gZ2V0V29yZEFuZFJhbmdlKGVkaXRvcilcbiAgLy8gSWYgd2Ugb25seSBmaW5kIG51bWJlcnMgb3Igbm90aGluZywgcmV0dXJuIHByZW1hdHVyZWx5XG4gIGlmICghaXNWYWxpZFdvcmRUb0luc3BlY3Qod29yZCkpIHJldHVyblxuICBmbih3b3JkLCByYW5nZSlcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB3b3JkIGFuZCBpdHMgcmFuZ2UgaW4gdGhlIGBlZGl0b3JgLlxuICpcbiAqIGBvcHRpb25zYFxuICogLSBgYnVmZmVyUG9zaXRpb25gIHtQb2ludH06IElmIGdpdmVuIHJldHVybnMgdGhlIHdvcmQgYXQgdGhlIGBidWZmZXJQb3NpdGlvbmAsIHJldHVybnMgdGhlIHdvcmQgYXQgdGhlIGN1cnJlbnQgY3Vyc29yIG90aGVyd2lzZS5cbiAqIC0gYHdvcmRSZWdleGAge1JlZ0V4cH0gOiBBIFJlZ0V4cCBpbmRpY2F0aW5nIHdoYXQgY29uc3RpdHV0ZXMgYSDigJx3b3Jk4oCdIChkZWZhdWx0OiBgd29yZFJlZ2V4YCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JkQW5kUmFuZ2UgKGVkaXRvciwgb3B0aW9ucyA9IHtcbiAgYnVmZmVyUG9zaXRpb246IHVuZGVmaW5lZCxcbiAgd29yZFJlZ2V4OiB3b3JkUmVnZXhcbn0pIHtcbiAgLy8gQFRPRE8/OlxuICAvLyBUaGUgZm9sbG93aW5nIGxpbmVzIGFyZSBraW5kYSBpZmZ5OiBUaGUgcmVnZXggbWF5IG9yIG1heSBub3QgYmUgd2VsbCBjaG9zZW5cbiAgLy8gYW5kIGl0IGR1cGxpY2F0ZXMgdGhlIGVmZm9ydHMgZnJvbSBhdG9tLWxhbmd1YWdlLWp1bGlhLlxuICAvLyBJdCBtaWdodCBiZSBiZXR0ZXIgdG8gc2VsZWN0IHRoZSBjdXJyZW50IHdvcmQgdmlhIGZpbmRpbmcgdGhlIHNtYWxsZXN0IDxzcGFuPlxuICAvLyBjb250YWluaW5nIHRoZSBidWZmZXJQb3NpdGlvbi9jdXJzb3Igd2hpY2ggYWxzbyBoYXMgYGZ1bmN0aW9uYCBvciBgbWFjcm9gIGFzIGl0cyBjbGFzcy5cbiAgY29uc3QgYnVmZmVyUG9zaXRpb24gPSBvcHRpb25zLmJ1ZmZlclBvc2l0aW9uID9cbiAgICBvcHRpb25zLmJ1ZmZlclBvc2l0aW9uIDpcbiAgICBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgY29uc3QgcmFuZ2UgPSBnZXRXb3JkUmFuZ2VBdEJ1ZmZlclBvc2l0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHtcbiAgICB3b3JkUmVnZXg6IG9wdGlvbnMud29yZFJlZ2V4ID8gb3B0aW9ucy53b3JkUmVnZXggOiB3b3JkUmVnZXhcbiAgfSlcbiAgY29uc3Qgd29yZCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgcmV0dXJuIHsgd29yZCwgcmFuZ2UgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJhbmdlIG9mIGEgd29yZCBjb250YWluaW5nIHRoZSBgYnVmZmVyUG9zaXRpb25gIGluIGBlZGl0b3JgLlxuICpcbiAqIGBvcHRpb25zYFxuICogLSBgd29yZFJlZ2V4YCB7UmVnRXhwfTogQSBSZWdFeHAgaW5kaWNhdGluZyB3aGF0IGNvbnN0aXR1dGVzIGEg4oCcd29yZOKAnSAoZGVmYXVsdDogYHdvcmRSZWdleGApLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29yZFJhbmdlQXRCdWZmZXJQb3NpdGlvbiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgb3B0aW9ucyA9IHtcbiAgd29yZFJlZ2V4OiB3b3JkUmVnZXhcbn0pIHtcbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vYmxvYi92MS4zOC4yL3NyYy9jdXJzb3IuanMjTDYwNi1MNjE2XG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IGJ1ZmZlclBvc2l0aW9uXG4gIGNvbnN0IHJhbmdlcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5maW5kQWxsSW5SYW5nZVN5bmMoXG4gICAgb3B0aW9ucy53b3JkUmVnZXggPyBvcHRpb25zLndvcmRSZWdleCA6IHdvcmRSZWdleCxcbiAgICBuZXcgUmFuZ2UobmV3IFBvaW50KHJvdywgMCksIG5ldyBQb2ludChyb3csIEluZmluaXR5KSlcbiAgKVxuICBjb25zdCByYW5nZSA9IHJhbmdlcy5maW5kKHJhbmdlID0+XG4gICAgcmFuZ2UuZW5kLmNvbHVtbiA+PSBjb2x1bW4gJiYgcmFuZ2Uuc3RhcnQuY29sdW1uIDw9IGNvbHVtblxuICApXG4gIHJldHVybiByYW5nZSA/IFJhbmdlLmZyb21PYmplY3QocmFuZ2UpIDogbmV3IFJhbmdlKGJ1ZmZlclBvc2l0aW9uLCBidWZmZXJQb3NpdGlvbilcbn1cblxuLyoqXG4gKiBFeGFtcGxlczogYHxgIHJlcHJlc2VudHMgYGJ1ZmZlclBvc2l0aW9uYDpcbiAqIC0gYFwiaGV8YWQud29yZC5mb290XCJgID0+IGBSYW5nZWAgb2YgYFwiaGVhZFwiYFxuICogLSBgXCJoZWFkfC53b3JkLmZvb3RcImAgPT4gYFJhbmdlYCBvZiBgXCJoZWFkXCJgXG4gKiAtIGBcImhlYWQufHdvcmQuZm9vdFwiYCA9PiBgUmFuZ2VgIG9mIGBcImhlYWQud29yZFwiYFxuICogLSBgXCJoZWFkLndvcmQuZm98b3RcImAgPT4gYFJhbmdlYCBvZiBgXCJoZWFkLndvcmQuZmllbGRcImBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmRSYW5nZVdpdGhvdXRUcmFpbGluZ0RvdHMgKHdvcmQsIHJhbmdlLCBidWZmZXJQb3NpdGlvbikge1xuICBjb25zdCB7IHN0YXJ0IH0gPSByYW5nZVxuICBjb25zdCB7IGNvbHVtbjogc3RhcnRDb2x1bW4gfSA9IHN0YXJ0XG4gIGNvbnN0IHsgcm93OiBlbmRSb3cgfSA9IHJhbmdlLmVuZFxuICBsZXQgZW5kQ29sdW1uID0gc3RhcnRDb2x1bW5cblxuICBjb25zdCB7IGNvbHVtbiB9ID0gYnVmZmVyUG9zaXRpb25cblxuICBjb25zdCBlbGVtZW50cyA9IHdvcmQuc3BsaXQoJy4nKVxuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICBlbmRDb2x1bW4gKz0gZWxlbWVudC5sZW5ndGhcbiAgICBpZiAoY29sdW1uIDw9IGVuZENvbHVtbikge1xuICAgICAgYnJlYWtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kQ29sdW1uICs9IDFcbiAgICB9XG4gIH1cblxuICBjb25zdCBlbmQgPSBuZXcgUG9pbnQoZW5kUm93LCBlbmRDb2x1bW4pXG4gIHJldHVybiBuZXcgUmFuZ2Uoc3RhcnQsIGVuZClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiBgd29yZGAgaXMgdmFsaWQgd29yZCB0byBiZSBpbnNwZWN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkV29yZFRvSW5zcGVjdCAod29yZCkge1xuICByZXR1cm4gd29yZC5sZW5ndGggPiAwICYmIGlzTmFOKHdvcmQpXG59XG4iXX0=