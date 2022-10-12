Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _atom = require('atom');

var _connection = require('../connection');

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _miscScopes = require('../misc/scopes');

var _miscWords = require('../misc/words');

var _miscBlocks = require('../misc/blocks');

var _uiSelector = require('../ui/selector');

var _client$import = _connection.client['import'](['gotosymbol', 'regeneratesymbols', 'clearsymbols']);

var _gotoSymbol = _client$import.gotosymbol;
var regenerateSymbols = _client$import.regeneratesymbols;
var clearSymbols = _client$import.clearsymbols;

var includeRegex = /(include|include_dependency)\(".+\.jl"\)/;
var filePathRegex = /".+\.jl"/;

var Goto = (function () {
  function Goto() {
    _classCallCheck(this, Goto);
  }

  _createClass(Goto, [{
    key: 'activate',
    value: function activate(ink) {
      this.ink = ink;
      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', 'julia-client:regenerate-symbols-cache', function () {
        regenerateSymbols();
      }), atom.commands.add('atom-workspace', 'julia-client:clear-symbols-cache', function () {
        clearSymbols();
      }));
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'getJumpFilePath',
    value: function getJumpFilePath(editor, bufferPosition) {
      var includeRange = (0, _miscWords.getWordRangeAtBufferPosition)(editor, bufferPosition, {
        wordRegex: includeRegex
      });
      if (includeRange.isEmpty()) return false;

      // return if the bufferPosition is not on the path string
      var filePathRange = (0, _miscWords.getWordRangeAtBufferPosition)(editor, bufferPosition, {
        wordRegex: filePathRegex
      });
      if (filePathRange.isEmpty()) return false;

      var filePathText = editor.getTextInBufferRange(filePathRange);
      var filePathBody = filePathText.replace(/"/g, '');
      var dirPath = _path2['default'].dirname(editor.getPath());
      var filePath = _path2['default'].join(dirPath, filePathBody);

      // return if there is not such a file exists
      if (!_fs2['default'].existsSync(filePath)) return false;
      return { range: filePathRange, filePath: filePath };
    }
  }, {
    key: 'isClientAndInkReady',
    value: function isClientAndInkReady() {
      return _connection.client.isActive() && this.ink !== undefined;
    }

    // TODO: handle remote files ?
  }, {
    key: 'selectItemsAndGo',
    value: function selectItemsAndGo(items) {
      var _this = this;

      if (items.length === 0) return;
      if (items.length === 1) {
        var item = items[0];
        return this.ink.Opener.open(item.file, item.line, {
          pending: atom.config.get('core.allowPendingPaneItems')
        });
      }
      items = items.map(function (result) {
        result.primary = result.text;
        result.secondary = result.file + ':' + result.line;
        return result;
      });
      return (0, _uiSelector.show)(items).then(function (item) {
        if (!item) return;
        _this.ink.Opener.open(item.file, item.line, {
          pending: atom.config.get('core.allowPendingPaneItems')
        });
      });
    }
  }, {
    key: 'gotoSymbol',
    value: function gotoSymbol() {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      var bufferPosition = editor.getCursorBufferPosition();

      // file jumps
      var rangeFilePath = this.getJumpFilePath(editor, bufferPosition);
      if (rangeFilePath) {
        var filePath = rangeFilePath.filePath;

        return this.ink.Opener.open(filePath, 0, {
          pending: atom.config.get('core.allowPendingPaneItems')
        });
      }

      if (!this.isClientAndInkReady()) return;

      // get word without trailing dot accessors at the buffer position

      var _getWordAndRange = (0, _miscWords.getWordAndRange)(editor, {
        bufferPosition: bufferPosition
      });

      var word = _getWordAndRange.word;
      var range = _getWordAndRange.range;

      range = (0, _miscWords.getWordRangeWithoutTrailingDots)(word, range, bufferPosition);
      word = editor.getTextInBufferRange(range);

      // check the validity of code to be inspected
      if (!(0, _miscWords.isValidWordToInspect)(word)) return;

      // local context
      var column = bufferPosition.column;
      var row = bufferPosition.row;

      var _getLocalContext = (0, _miscBlocks.getLocalContext)(editor, row);

      var context = _getLocalContext.context;
      var startRow = _getLocalContext.startRow;

      // module context
      var currentModule = _modules2['default'].current();
      var mod = currentModule ? currentModule : 'Main';
      var text = editor.getText(); // buffer text that will be used for fallback entry

      return _gotoSymbol({
        word: word,
        path: editor.getPath() || 'untitled-' + editor.getBuffer().getId(),
        // local context
        column: column + 1,
        row: row + 1,
        startRow: startRow,
        context: context,
        onlyGlobal: false,
        // module context
        mod: mod,
        text: text
      }).then(function (results) {
        if (results.error) return;
        _this2.selectItemsAndGo(results.items);
      })['catch'](function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'provideHyperclick',
    value: function provideHyperclick() {
      var _this3 = this;

      var getSuggestion = _asyncToGenerator(function* (textEditor, bufferPosition) {
        // file jumps -- invoked even if Julia isn't running
        var rangeFilePath = _this3.getJumpFilePath(textEditor, bufferPosition);
        if (rangeFilePath) {
          var _ret = (function () {
            var range = rangeFilePath.range;
            var filePath = rangeFilePath.filePath;

            return {
              v: {
                range: range,
                callback: function callback() {
                  return _this3.ink.Opener.open(filePath, 0, {
                    pending: atom.config.get('core.allowPendingPaneItems')
                  });
                }
              }
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }

        // If Julia is not running, do nothing
        if (!_this3.isClientAndInkReady()) return;

        // If the scope at `bufferPosition` is not valid code scope, do nothing
        if (!(0, _miscScopes.isValidScopeToInspect)(textEditor, bufferPosition)) return;

        // get word without trailing dot accessors at the buffer position

        var _getWordAndRange2 = (0, _miscWords.getWordAndRange)(textEditor, {
          bufferPosition: bufferPosition
        });

        var word = _getWordAndRange2.word;
        var range = _getWordAndRange2.range;

        range = (0, _miscWords.getWordRangeWithoutTrailingDots)(word, range, bufferPosition);
        word = textEditor.getTextInBufferRange(range);

        // check the validity of code to be inspected
        if (!(0, _miscWords.isValidWordToInspect)(word)) return;

        // local context
        var column = bufferPosition.column;
        var row = bufferPosition.row;

        var _getLocalContext2 = (0, _miscBlocks.getLocalContext)(textEditor, row);

        var context = _getLocalContext2.context;
        var startRow = _getLocalContext2.startRow;

        // module context

        var _ref = yield _modules2['default'].getEditorModule(textEditor, bufferPosition);

        var main = _ref.main;
        var sub = _ref.sub;

        var mod = main ? sub ? main + '.' + sub : main : 'Main';
        var text = textEditor.getText(); // buffer text that will be used for fallback entry

        return new Promise(function (resolve) {
          _gotoSymbol({
            word: word,
            path: textEditor.getPath() || 'untitled-' + textEditor.getBuffer().getId(),
            // local context
            column: column + 1,
            row: row + 1,
            startRow: startRow,
            context: context,
            onlyGlobal: false,
            // module context
            mod: mod,
            text: text
          }).then(function (results) {
            // If the `goto` call fails or there is no where to go to, do nothing
            if (results.error) {
              resolve({
                range: new _atom.Range([0, 0], [0, 0]),
                callback: function callback() {}
              });
            }
            resolve({
              range: range,
              callback: function callback() {
                return setTimeout(function () {
                  return _this3.selectItemsAndGo(results.items);
                }, 5);
              }
            });
          })['catch'](function (err) {
            console.log(err);
          });
        });
      });

      return {
        providerName: 'julia-client-hyperclick-provider',
        priority: 100,
        grammarScopes: atom.config.get('julia-client.juliaSyntaxScopes'),
        getSuggestion: getSuggestion
      };
    }
  }]);

  return Goto;
})();

exports['default'] = new Goto();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2dvdG8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztvQkFDd0IsTUFBTTs7MEJBRTFCLGVBQWU7O3VCQUNsQixXQUFXOzs7OzBCQUNPLGdCQUFnQjs7eUJBTS9DLGVBQWU7OzBCQUNVLGdCQUFnQjs7MEJBQzNCLGdCQUFnQjs7cUJBTWpDLDRCQUFhLENBQUMsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7O0lBSHhELFdBQVUsa0JBQXRCLFVBQVU7SUFDUyxpQkFBaUIsa0JBQXBDLGlCQUFpQjtJQUNILFlBQVksa0JBQTFCLFlBQVk7O0FBR2QsSUFBTSxZQUFZLEdBQUcsMENBQTBDLENBQUE7QUFDL0QsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFBOztJQUUxQixJQUFJO1dBQUosSUFBSTswQkFBSixJQUFJOzs7ZUFBSixJQUFJOztXQUNDLGtCQUFDLEdBQUcsRUFBRTtBQUNiLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0FBQ2QsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsdUNBQXVDLEVBQUUsWUFBTTtBQUNqRix5QkFBaUIsRUFBRSxDQUFBO09BQ3BCLENBQUMsRUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxrQ0FBa0MsRUFBRSxZQUFNO0FBQzVFLG9CQUFZLEVBQUUsQ0FBQTtPQUNmLENBQUMsQ0FDSCxDQUFBO0tBQ0Y7OztXQUVVLHNCQUFHO0FBQ1osVUFBSSxDQUFDLGFBQWEsQ0FBQyxP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LFFBQVE7QUFDUixtQkFBTyxFQUFQLE9BQU87QUFDUCxzQkFBVSxFQUFFLEtBQUs7O0FBRWpCLGVBQUcsRUFBSCxHQUFHO0FBQ0gsZ0JBQUksRUFBSixJQUFJO1dBQ0wsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTs7QUFFakIsZ0JBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQixxQkFBTyxDQUFDO0FBQ04scUJBQUssRUFBRSxnQkFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUM5Qix3QkFBUSxFQUFFLG9CQUFNLEVBQUU7ZUFDbkIsQ0FBQyxDQUFBO2FBQ0g7QUFDRCxtQkFBTyxDQUFDO0FBQ04sbUJBQUssRUFBTCxLQUFLO0FBQ0wsc0JBQVEsRUFBRTt1QkFBTSxVQUFVLENBQUM7eUJBQU0sT0FBSyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2lCQUFBLEVBQUUsQ0FBQyxDQUFDO2VBQUE7YUFDMUUsQ0FBQyxDQUFBO1dBQ0gsQ0FBQyxTQUFNLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDZCxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtXQUNqQixDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7T0FDSCxDQUFBLENBQUE7O0FBRUQsYUFBTztBQUNMLG9CQUFZLEVBQUUsa0NBQWtDO0FBQ2hELGdCQUFRLEVBQUUsR0FBRztBQUNiLHFCQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUM7QUFDaEUscUJBQWEsRUFBYixhQUFhO09BQ2QsQ0FBQTtLQUNGOzs7U0F0TUcsSUFBSTs7O3FCQXlNSyxJQUFJLElBQUksRUFBRSIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvcnVudGltZS9nb3RvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uJ1xuaW1wb3J0IG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJ1xuaW1wb3J0IHsgaXNWYWxpZFNjb3BlVG9JbnNwZWN0IH0gZnJvbSAnLi4vbWlzYy9zY29wZXMnXG5pbXBvcnQge1xuICBnZXRXb3JkQW5kUmFuZ2UsXG4gIGdldFdvcmRSYW5nZUF0QnVmZmVyUG9zaXRpb24sXG4gIGdldFdvcmRSYW5nZVdpdGhvdXRUcmFpbGluZ0RvdHMsXG4gIGlzVmFsaWRXb3JkVG9JbnNwZWN0XG59IGZyb20gJy4uL21pc2Mvd29yZHMnXG5pbXBvcnQgeyBnZXRMb2NhbENvbnRleHQgfSBmcm9tICcuLi9taXNjL2Jsb2NrcydcbmltcG9ydCB7IHNob3cgfSBmcm9tICcuLi91aS9zZWxlY3RvcidcblxuY29uc3Qge1xuICBnb3Rvc3ltYm9sOiBnb3RvU3ltYm9sLFxuICByZWdlbmVyYXRlc3ltYm9sczogcmVnZW5lcmF0ZVN5bWJvbHMsXG4gIGNsZWFyc3ltYm9sczogY2xlYXJTeW1ib2xzLFxufSA9IGNsaWVudC5pbXBvcnQoWydnb3Rvc3ltYm9sJywgJ3JlZ2VuZXJhdGVzeW1ib2xzJywgJ2NsZWFyc3ltYm9scyddKVxuXG5jb25zdCBpbmNsdWRlUmVnZXggPSAvKGluY2x1ZGV8aW5jbHVkZV9kZXBlbmRlbmN5KVxcKFwiLitcXC5qbFwiXFwpL1xuY29uc3QgZmlsZVBhdGhSZWdleCA9IC9cIi4rXFwuamxcIi9cblxuY2xhc3MgR290byB7XG4gIGFjdGl2YXRlIChpbmspIHtcbiAgICB0aGlzLmluayA9IGlua1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2p1bGlhLWNsaWVudDpyZWdlbmVyYXRlLXN5bWJvbHMtY2FjaGUnLCAoKSA9PiB7XG4gICAgICAgIHJlZ2VuZXJhdGVTeW1ib2xzKClcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2p1bGlhLWNsaWVudDpjbGVhci1zeW1ib2xzLWNhY2hlJywgKCkgPT4ge1xuICAgICAgICBjbGVhclN5bWJvbHMoKVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBnZXRKdW1wRmlsZVBhdGgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikge1xuICAgIGNvbnN0IGluY2x1ZGVSYW5nZSA9IGdldFdvcmRSYW5nZUF0QnVmZmVyUG9zaXRpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwge1xuICAgICAgd29yZFJlZ2V4OiBpbmNsdWRlUmVnZXhcbiAgICB9KVxuICAgIGlmIChpbmNsdWRlUmFuZ2UuaXNFbXB0eSgpKSByZXR1cm4gZmFsc2VcblxuICAgIC8vIHJldHVybiBpZiB0aGUgYnVmZmVyUG9zaXRpb24gaXMgbm90IG9uIHRoZSBwYXRoIHN0cmluZ1xuICAgIGNvbnN0IGZpbGVQYXRoUmFuZ2UgPSBnZXRXb3JkUmFuZ2VBdEJ1ZmZlclBvc2l0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHtcbiAgICAgIHdvcmRSZWdleDogZmlsZVBhdGhSZWdleFxuICAgIH0pXG4gICAgaWYgKGZpbGVQYXRoUmFuZ2UuaXNFbXB0eSgpKSByZXR1cm4gZmFsc2VcblxuICAgIGNvbnN0IGZpbGVQYXRoVGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShmaWxlUGF0aFJhbmdlKVxuICAgIGNvbnN0IGZpbGVQYXRoQm9keSA9IGZpbGVQYXRoVGV4dC5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICBjb25zdCBkaXJQYXRoID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyUGF0aCwgZmlsZVBhdGhCb2R5KVxuXG4gICAgLy8gcmV0dXJuIGlmIHRoZXJlIGlzIG5vdCBzdWNoIGEgZmlsZSBleGlzdHNcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4geyByYW5nZTogZmlsZVBhdGhSYW5nZSwgZmlsZVBhdGggfVxuICB9XG5cbiAgaXNDbGllbnRBbmRJbmtSZWFkeSAoKSB7XG4gICAgcmV0dXJuIGNsaWVudC5pc0FjdGl2ZSgpICYmIHRoaXMuaW5rICE9PSB1bmRlZmluZWRcbiAgfVxuXG4gIC8vIFRPRE86IGhhbmRsZSByZW1vdGUgZmlsZXMgP1xuICBzZWxlY3RJdGVtc0FuZEdvIChpdGVtcykge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHJldHVyblxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1swXVxuICAgICAgcmV0dXJuIHRoaXMuaW5rLk9wZW5lci5vcGVuKGl0ZW0uZmlsZSwgaXRlbS5saW5lLCB7XG4gICAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKVxuICAgICAgfSlcbiAgICB9XG4gICAgaXRlbXMgPSBpdGVtcy5tYXAocmVzdWx0ID0+IHtcbiAgICAgIHJlc3VsdC5wcmltYXJ5ID0gcmVzdWx0LnRleHRcbiAgICAgIHJlc3VsdC5zZWNvbmRhcnkgPSBgJHtyZXN1bHQuZmlsZX06JHtyZXN1bHQubGluZX1gXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSlcbiAgICByZXR1cm4gc2hvdyhpdGVtcykudGhlbihpdGVtID0+IHtcbiAgICAgIGlmICghaXRlbSkgcmV0dXJuXG4gICAgICB0aGlzLmluay5PcGVuZXIub3BlbihpdGVtLmZpbGUsIGl0ZW0ubGluZSwge1xuICAgICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdvdG9TeW1ib2wgKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIC8vIGZpbGUganVtcHNcbiAgICBjb25zdCByYW5nZUZpbGVQYXRoID0gdGhpcy5nZXRKdW1wRmlsZVBhdGgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICBpZiAocmFuZ2VGaWxlUGF0aCkge1xuICAgICAgY29uc3QgeyBmaWxlUGF0aCB9ID0gcmFuZ2VGaWxlUGF0aFxuICAgICAgcmV0dXJuIHRoaXMuaW5rLk9wZW5lci5vcGVuKGZpbGVQYXRoLCAwLCB7XG4gICAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzQ2xpZW50QW5kSW5rUmVhZHkoKSkgcmV0dXJuXG5cbiAgICAvLyBnZXQgd29yZCB3aXRob3V0IHRyYWlsaW5nIGRvdCBhY2Nlc3NvcnMgYXQgdGhlIGJ1ZmZlciBwb3NpdGlvblxuICAgIGxldCB7IHdvcmQsIHJhbmdlIH0gPSBnZXRXb3JkQW5kUmFuZ2UoZWRpdG9yLCB7XG4gICAgICBidWZmZXJQb3NpdGlvblxuICAgIH0pXG4gICAgcmFuZ2UgPSBnZXRXb3JkUmFuZ2VXaXRob3V0VHJhaWxpbmdEb3RzKHdvcmQsIHJhbmdlLCBidWZmZXJQb3NpdGlvbilcbiAgICB3b3JkID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gICAgLy8gY2hlY2sgdGhlIHZhbGlkaXR5IG9mIGNvZGUgdG8gYmUgaW5zcGVjdGVkXG4gICAgaWYgKCEoaXNWYWxpZFdvcmRUb0luc3BlY3Qod29yZCkpKSByZXR1cm5cblxuICAgIC8vIGxvY2FsIGNvbnRleHRcbiAgICBjb25zdCB7IGNvbHVtbiwgcm93IH0gPSBidWZmZXJQb3NpdGlvblxuICAgIGNvbnN0IHsgY29udGV4dCwgc3RhcnRSb3cgfSA9IGdldExvY2FsQ29udGV4dChlZGl0b3IsIHJvdylcblxuICAgIC8vIG1vZHVsZSBjb250ZXh0XG4gICAgY29uc3QgY3VycmVudE1vZHVsZSA9IG1vZHVsZXMuY3VycmVudCgpXG4gICAgY29uc3QgbW9kID0gY3VycmVudE1vZHVsZSA/IGN1cnJlbnRNb2R1bGUgOiAnTWFpbidcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKSAvLyBidWZmZXIgdGV4dCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgZmFsbGJhY2sgZW50cnlcblxuICAgIHJldHVybiBnb3RvU3ltYm9sKHtcbiAgICAgIHdvcmQsXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpIHx8ICd1bnRpdGxlZC0nICsgZWRpdG9yLmdldEJ1ZmZlcigpLmdldElkKCksXG4gICAgICAvLyBsb2NhbCBjb250ZXh0XG4gICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICByb3c6IHJvdyArIDEsXG4gICAgICBzdGFydFJvdyxcbiAgICAgIGNvbnRleHQsXG4gICAgICBvbmx5R2xvYmFsOiBmYWxzZSxcbiAgICAgIC8vIG1vZHVsZSBjb250ZXh0XG4gICAgICBtb2QsXG4gICAgICB0ZXh0XG4gICAgfSkudGhlbihyZXN1bHRzID0+IHtcbiAgICAgIGlmIChyZXN1bHRzLmVycm9yKSByZXR1cm5cbiAgICAgIHRoaXMuc2VsZWN0SXRlbXNBbmRHbyhyZXN1bHRzLml0ZW1zKVxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSlcbiAgfVxuXG4gIHByb3ZpZGVIeXBlcmNsaWNrICgpIHtcbiAgICBjb25zdCBnZXRTdWdnZXN0aW9uID0gYXN5bmMgKHRleHRFZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSA9PiB7XG4gICAgICAvLyBmaWxlIGp1bXBzIC0tIGludm9rZWQgZXZlbiBpZiBKdWxpYSBpc24ndCBydW5uaW5nXG4gICAgICBjb25zdCByYW5nZUZpbGVQYXRoID0gdGhpcy5nZXRKdW1wRmlsZVBhdGgodGV4dEVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBpZiAocmFuZ2VGaWxlUGF0aCkge1xuICAgICAgICBjb25zdCB7IHJhbmdlLCBmaWxlUGF0aCB9ID0gcmFuZ2VGaWxlUGF0aFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmsuT3BlbmVyLm9wZW4oZmlsZVBhdGgsIDAsIHtcbiAgICAgICAgICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgSnVsaWEgaXMgbm90IHJ1bm5pbmcsIGRvIG5vdGhpbmdcbiAgICAgIGlmICghdGhpcy5pc0NsaWVudEFuZElua1JlYWR5KCkpIHJldHVyblxuXG4gICAgICAvLyBJZiB0aGUgc2NvcGUgYXQgYGJ1ZmZlclBvc2l0aW9uYCBpcyBub3QgdmFsaWQgY29kZSBzY29wZSwgZG8gbm90aGluZ1xuICAgICAgaWYgKCFpc1ZhbGlkU2NvcGVUb0luc3BlY3QodGV4dEVkaXRvciwgYnVmZmVyUG9zaXRpb24pKSByZXR1cm5cblxuICAgICAgLy8gZ2V0IHdvcmQgd2l0aG91dCB0cmFpbGluZyBkb3QgYWNjZXNzb3JzIGF0IHRoZSBidWZmZXIgcG9zaXRpb25cbiAgICAgIGxldCB7IHdvcmQsIHJhbmdlIH0gPSBnZXRXb3JkQW5kUmFuZ2UodGV4dEVkaXRvciwge1xuICAgICAgICBidWZmZXJQb3NpdGlvblxuICAgICAgfSlcbiAgICAgIHJhbmdlID0gZ2V0V29yZFJhbmdlV2l0aG91dFRyYWlsaW5nRG90cyh3b3JkLCByYW5nZSwgYnVmZmVyUG9zaXRpb24pXG4gICAgICB3b3JkID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcblxuICAgICAgLy8gY2hlY2sgdGhlIHZhbGlkaXR5IG9mIGNvZGUgdG8gYmUgaW5zcGVjdGVkXG4gICAgICBpZiAoIShpc1ZhbGlkV29yZFRvSW5zcGVjdCh3b3JkKSkpIHJldHVyblxuXG4gICAgICAvLyBsb2NhbCBjb250ZXh0XG4gICAgICBjb25zdCB7IGNvbHVtbiwgcm93IH0gPSBidWZmZXJQb3NpdGlvblxuICAgICAgY29uc3QgeyBjb250ZXh0LCBzdGFydFJvdyB9ID0gZ2V0TG9jYWxDb250ZXh0KHRleHRFZGl0b3IsIHJvdylcblxuICAgICAgLy8gbW9kdWxlIGNvbnRleHRcbiAgICAgIGNvbnN0IHsgbWFpbiwgc3ViIH0gPSBhd2FpdCBtb2R1bGVzLmdldEVkaXRvck1vZHVsZSh0ZXh0RWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGNvbnN0IG1vZCA9IG1haW4gPyAoc3ViID8gYCR7bWFpbn0uJHtzdWJ9YCA6IG1haW4pIDogJ01haW4nXG4gICAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCkgLy8gYnVmZmVyIHRleHQgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGZhbGxiYWNrIGVudHJ5XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBnb3RvU3ltYm9sKHtcbiAgICAgICAgICB3b3JkLFxuICAgICAgICAgIHBhdGg6IHRleHRFZGl0b3IuZ2V0UGF0aCgpIHx8ICd1bnRpdGxlZC0nICsgdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRJZCgpLFxuICAgICAgICAgIC8vIGxvY2FsIGNvbnRleHRcbiAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAgICAgcm93OiByb3cgKyAxLFxuICAgICAgICAgIHN0YXJ0Um93LFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgb25seUdsb2JhbDogZmFsc2UsXG4gICAgICAgICAgLy8gbW9kdWxlIGNvbnRleHRcbiAgICAgICAgICBtb2QsXG4gICAgICAgICAgdGV4dFxuICAgICAgICB9KS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIC8vIElmIHRoZSBgZ290b2AgY2FsbCBmYWlscyBvciB0aGVyZSBpcyBubyB3aGVyZSB0byBnbyB0bywgZG8gbm90aGluZ1xuICAgICAgICAgIGlmIChyZXN1bHRzLmVycm9yKSB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbMCwwXSwgWzAsMF0pLFxuICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgcmFuZ2UsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbGVjdEl0ZW1zQW5kR28ocmVzdWx0cy5pdGVtcyksIDUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlck5hbWU6ICdqdWxpYS1jbGllbnQtaHlwZXJjbGljay1wcm92aWRlcicsXG4gICAgICBwcmlvcml0eTogMTAwLFxuICAgICAgZ3JhbW1hclNjb3BlczogYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFTeW50YXhTY29wZXMnKSxcbiAgICAgIGdldFN1Z2dlc3Rpb25cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdvdG8oKVxuIl19