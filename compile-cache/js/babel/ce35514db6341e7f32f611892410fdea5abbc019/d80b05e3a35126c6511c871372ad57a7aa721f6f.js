Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

/**
 * @TODO: Custom sorting?
 * @TODO: Complete quotes for strings
 */

var _atom = require('atom');

var _connection = require('../connection');

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _miscBlocks = require('../misc/blocks');

var bracketScope = 'meta.bracket.julia';
var baselineCompletionAdapter = _connection.client['import']('completions');
var completionDetail = _connection.client['import']('completiondetail');

var AutoCompleteProvider = (function () {
  function AutoCompleteProvider() {
    _classCallCheck(this, AutoCompleteProvider);

    this.selector = '.source.julia';
    this.disableForSelector = '.source.julia .comment';
    this.excludeLowerPriority = true;
    this.inclusionPriority = 1;
    this.suggestionPriority = atom.config.get('julia-client.juliaOptions.autoCompletionSuggestionPriority');
    this.filterSuggestions = false;
  }

  _createClass(AutoCompleteProvider, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.config.observe('julia-client.juliaOptions.fuzzyCompletionMode', function (v) {
        _this.fuzzyCompletionMode = v;
      }), atom.config.observe('julia-client.juliaOptions.noAutoParenthesis', function (v) {
        _this.noAutoParenthesis = v;
      }));
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(data) {
      if (!_connection.client.isActive()) return [];
      var editor = data.editor;
      var bufferPosition = data.bufferPosition;
      var activatedManually = data.activatedManually;
      var row = bufferPosition.row;
      var column = bufferPosition.column;

      var startPoint = new _atom.Point(row, 0);
      var endPoint = new _atom.Point(row, column);
      var lineRange = new _atom.Range(startPoint, endPoint);
      var line = editor.getTextInBufferRange(lineRange);

      // suppress completions if an whitespace precedes, except the special cases below
      // - activatedManually (i.e. an user forces completions)
      // - the current position is in function call: show method completions
      // - after `using`/`import` keyword: show package completions
      if (!activatedManually) {
        if (column === 0) return [];
        var prevCharPosition = new _atom.Point(row, column - 1);
        var charRange = new _atom.Range(prevCharPosition, bufferPosition);
        var char = editor.getTextInBufferRange(charRange);

        var _editor$scopeDescriptorForBufferPosition = editor.scopeDescriptorForBufferPosition(bufferPosition);

        var scopes = _editor$scopeDescriptorForBufferPosition.scopes;

        if (!scopes.includes(bracketScope) && !/\b(import|using)\b/.test(line) && char === ' ') return [];
      }

      var baselineCompletions = this.baselineCompletions(data, line);
      return Promise.race([baselineCompletions, this.sleep()]);
    }
  }, {
    key: 'baselineCompletions',
    value: function baselineCompletions(data, line) {
      var _this2 = this;

      var editor = data.editor;
      var _data$bufferPosition = data.bufferPosition;
      var row = _data$bufferPosition.row;
      var column = _data$bufferPosition.column;
      var activatedManually = data.activatedManually;

      var _getLocalContext = (0, _miscBlocks.getLocalContext)(editor, row);

      var context = _getLocalContext.context;
      var startRow = _getLocalContext.startRow;

      return baselineCompletionAdapter({
        // general
        line: line,
        path: editor.getPath(),
        mod: _modules2['default'].current(),
        // local context
        context: context,
        row: row + 1,
        startRow: startRow,
        column: column + 1,
        // configurations
        is_fuzzy: this.fuzzyCompletionMode,
        force: activatedManually || false
      }).then(function (completions) {
        return completions.map(function (completion) {
          return _this2.toCompletion(completion);
        });
      })['catch'](function () {
        return [];
      });
    }
  }, {
    key: 'toCompletion',
    value: function toCompletion(completion) {
      var icon = this.makeIcon(completion.icon);
      if (icon) completion.iconHTML = icon;
      // workaround https://github.com/atom/autocomplete-plus/issues/868
      if (!completion.description && completion.descriptionMoreURL) {
        completion.description = ' ';
      }
      return completion;
    }

    // should sync with atom-ink/lib/workspace/workspace.js
  }, {
    key: 'makeIcon',
    value: function makeIcon(icon) {
      // if not specified, just fallback to `completion.type`
      if (!icon) return '';
      if (icon.startsWith('icon-')) return '<span class="' + icon + '"}></span>';
      return icon.length === 1 ? icon : '';
    }
  }, {
    key: 'sleep',
    value: function sleep() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(null);
        }, 1000);
      });
    }
  }, {
    key: 'getSuggestionDetailsOnSelect',
    value: function getSuggestionDetailsOnSelect(_completion) {
      var completionWithDetail = completionDetail(_completion).then(function (completion) {
        // workaround https://github.com/atom/autocomplete-plus/issues/868
        if (!completion.description && completion.descriptionMoreURL) {
          completion.description = ' ';
        }
        return completion;
      })['catch'](function (err) {
        console.log(err);
      });
      return Promise.race([completionWithDetail, this.sleep()]);
    }
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion(_ref) {
      var editor = _ref.editor;
      var type = _ref.suggestion.type;

      if (type !== 'function' || this.noAutoParenthesis) return;
      editor.mutateSelectedText(function (selection) {
        if (!selection.isEmpty()) return;
        var _selection$getBufferRange$start = selection.getBufferRange().start;
        var row = _selection$getBufferRange$start.row;
        var column = _selection$getBufferRange$start.column;

        var currentPoint = new _atom.Point(row, column);
        var nextPoint = new _atom.Point(row, column + 1);
        var range = new _atom.Range(currentPoint, nextPoint);
        var finishRange = new _atom.Range(nextPoint, nextPoint);
        if (editor.getTextInBufferRange(range) !== '(') {
          selection.insertText('()');
        }
        selection.setBufferRange(finishRange);
      });
    }
  }]);

  return AutoCompleteProvider;
})();

exports['default'] = new AutoCompleteProvider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2NvbXBsZXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQU9rRCxNQUFNOzswQkFFakMsZUFBZTs7dUJBQ2xCLFdBQVc7Ozs7MEJBRUMsZ0JBQWdCOztBQUVoRCxJQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQTtBQUN6QyxJQUFNLHlCQUF5QixHQUFHLDRCQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDOUQsSUFBTSxnQkFBZ0IsR0FBRyw0QkFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUE7O0lBRXBELG9CQUFvQjtXQUFwQixvQkFBb0I7MEJBQXBCLG9CQUFvQjs7U0FDeEIsUUFBUSxHQUFHLGVBQWU7U0FDMUIsa0JBQWtCO1NBQ2xCLG9CQUFvQixHQUFHLElBQUk7U0FDM0IsaUJBQWlCLEdBQUcsQ0FBQztTQUNyQixrQkFBa0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0REFBNEQsQ0FBQztTQUNsRyxpQkFBaUIsR0FBRyxLQUFLOzs7ZUFOckIsb0JBQW9COztXQVFmLG9CQUFHOzs7QUFDVixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQ0FBK0MsRUFBRSxVQUFBLENBQUMsRUFBSTtBQUN4RSxjQUFLLG1CQUFtQixHQUFHLENBQUMsQ0FBQTtPQUM3QixDQUFDLEVBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkNBQTZDLEVBQUUsVUFBQSxDQUFDLEVBQUk7QUFDdEUsY0FBSyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7T0FDM0IsQ0FBQyxDQUNILENBQUE7S0FDRjs7O1dBRVUsc0JBQUc7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QkFBb0I7OztxQkF1SVgsSUFBSSxvQkFBb0IsRUFBRSIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvcnVudGltZS9jb21wbGV0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLyoqXG4gKiBAVE9ETzogQ3VzdG9tIHNvcnRpbmc/XG4gKiBAVE9ETzogQ29tcGxldGUgcXVvdGVzIGZvciBzdHJpbmdzXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUG9pbnQsIFJhbmdlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcydcblxuaW1wb3J0IHsgZ2V0TG9jYWxDb250ZXh0IH0gZnJvbSAnLi4vbWlzYy9ibG9ja3MnXG5cbmNvbnN0IGJyYWNrZXRTY29wZSA9ICdtZXRhLmJyYWNrZXQuanVsaWEnXG5jb25zdCBiYXNlbGluZUNvbXBsZXRpb25BZGFwdGVyID0gY2xpZW50LmltcG9ydCgnY29tcGxldGlvbnMnKVxuY29uc3QgY29tcGxldGlvbkRldGFpbCA9IGNsaWVudC5pbXBvcnQoJ2NvbXBsZXRpb25kZXRhaWwnKVxuXG5jbGFzcyBBdXRvQ29tcGxldGVQcm92aWRlciB7XG4gIHNlbGVjdG9yID0gJy5zb3VyY2UuanVsaWEnXG4gIGRpc2FibGVGb3JTZWxlY3RvciA9IGAuc291cmNlLmp1bGlhIC5jb21tZW50YFxuICBleGNsdWRlTG93ZXJQcmlvcml0eSA9IHRydWVcbiAgaW5jbHVzaW9uUHJpb3JpdHkgPSAxXG4gIHN1Z2dlc3Rpb25Qcmlvcml0eSA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy5hdXRvQ29tcGxldGlvblN1Z2dlc3Rpb25Qcmlvcml0eScpXG4gIGZpbHRlclN1Z2dlc3Rpb25zID0gZmFsc2VcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLmZ1enp5Q29tcGxldGlvbk1vZGUnLCB2ID0+IHtcbiAgICAgICAgdGhpcy5mdXp6eUNvbXBsZXRpb25Nb2RlID0gdlxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLm5vQXV0b1BhcmVudGhlc2lzJywgdiA9PiB7XG4gICAgICAgIHRoaXMubm9BdXRvUGFyZW50aGVzaXMgPSB2XG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIGdldFN1Z2dlc3Rpb25zIChkYXRhKSB7XG4gICAgaWYgKCFjbGllbnQuaXNBY3RpdmUoKSkgcmV0dXJuIFtdXG4gICAgY29uc3QgeyBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBhY3RpdmF0ZWRNYW51YWxseSB9ID0gZGF0YVxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IGJ1ZmZlclBvc2l0aW9uXG4gICAgY29uc3Qgc3RhcnRQb2ludCA9IG5ldyBQb2ludChyb3csIDApXG4gICAgY29uc3QgZW5kUG9pbnQgPSBuZXcgUG9pbnQocm93LCBjb2x1bW4pXG4gICAgY29uc3QgbGluZVJhbmdlID0gbmV3IFJhbmdlKHN0YXJ0UG9pbnQsIGVuZFBvaW50KVxuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UobGluZVJhbmdlKVxuXG4gICAgLy8gc3VwcHJlc3MgY29tcGxldGlvbnMgaWYgYW4gd2hpdGVzcGFjZSBwcmVjZWRlcywgZXhjZXB0IHRoZSBzcGVjaWFsIGNhc2VzIGJlbG93XG4gICAgLy8gLSBhY3RpdmF0ZWRNYW51YWxseSAoaS5lLiBhbiB1c2VyIGZvcmNlcyBjb21wbGV0aW9ucylcbiAgICAvLyAtIHRoZSBjdXJyZW50IHBvc2l0aW9uIGlzIGluIGZ1bmN0aW9uIGNhbGw6IHNob3cgbWV0aG9kIGNvbXBsZXRpb25zXG4gICAgLy8gLSBhZnRlciBgdXNpbmdgL2BpbXBvcnRgIGtleXdvcmQ6IHNob3cgcGFja2FnZSBjb21wbGV0aW9uc1xuICAgIGlmICghYWN0aXZhdGVkTWFudWFsbHkpIHtcbiAgICAgIGlmIChjb2x1bW4gPT09IDApIHJldHVybiBbXVxuICAgICAgY29uc3QgcHJldkNoYXJQb3NpdGlvbiA9IG5ldyBQb2ludChyb3csIGNvbHVtbiAtIDEpXG4gICAgICBjb25zdCBjaGFyUmFuZ2UgPSBuZXcgUmFuZ2UocHJldkNoYXJQb3NpdGlvbiwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBjb25zdCBjaGFyID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKGNoYXJSYW5nZSlcbiAgICAgIGNvbnN0IHsgc2NvcGVzIH0gPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pXG4gICAgICBpZiAoXG4gICAgICAgICFzY29wZXMuaW5jbHVkZXMoYnJhY2tldFNjb3BlKSAmJlxuICAgICAgICAhKC9cXGIoaW1wb3J0fHVzaW5nKVxcYi8udGVzdChsaW5lKSkgJiZcbiAgICAgICAgY2hhciA9PT0gJyAnXG4gICAgICApIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IGJhc2VsaW5lQ29tcGxldGlvbnMgPSB0aGlzLmJhc2VsaW5lQ29tcGxldGlvbnMoZGF0YSwgbGluZSlcbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtiYXNlbGluZUNvbXBsZXRpb25zLCB0aGlzLnNsZWVwKCldKVxuICB9XG5cbiAgYmFzZWxpbmVDb21wbGV0aW9ucyAoZGF0YSwgbGluZSkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBidWZmZXJQb3NpdGlvbjogeyByb3csIGNvbHVtbiB9LCBhY3RpdmF0ZWRNYW51YWxseSB9ID0gZGF0YVxuICAgIGNvbnN0IHsgY29udGV4dCwgc3RhcnRSb3cgfSA9IGdldExvY2FsQ29udGV4dChlZGl0b3IsIHJvdylcbiAgICByZXR1cm4gYmFzZWxpbmVDb21wbGV0aW9uQWRhcHRlcih7XG4gICAgICAvLyBnZW5lcmFsXG4gICAgICBsaW5lLFxuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKSxcbiAgICAgIG1vZDogbW9kdWxlcy5jdXJyZW50KCksXG4gICAgICAvLyBsb2NhbCBjb250ZXh0XG4gICAgICBjb250ZXh0LFxuICAgICAgcm93OiByb3cgKyAxLFxuICAgICAgc3RhcnRSb3csXG4gICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAvLyBjb25maWd1cmF0aW9uc1xuICAgICAgaXNfZnV6enk6IHRoaXMuZnV6enlDb21wbGV0aW9uTW9kZSxcbiAgICAgIGZvcmNlOiBhY3RpdmF0ZWRNYW51YWxseSB8fCBmYWxzZSxcbiAgICB9KS50aGVuKGNvbXBsZXRpb25zID0+IHtcbiAgICAgIHJldHVybiBjb21wbGV0aW9ucy5tYXAoY29tcGxldGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQ29tcGxldGlvbihjb21wbGV0aW9uKVxuICAgICAgfSlcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICByZXR1cm4gW11cbiAgICB9KVxuICB9XG5cbiAgdG9Db21wbGV0aW9uIChjb21wbGV0aW9uKSB7XG4gICAgY29uc3QgaWNvbiA9IHRoaXMubWFrZUljb24oY29tcGxldGlvbi5pY29uKVxuICAgIGlmIChpY29uKSBjb21wbGV0aW9uLmljb25IVE1MID0gaWNvblxuICAgIC8vIHdvcmthcm91bmQgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXV0b2NvbXBsZXRlLXBsdXMvaXNzdWVzLzg2OFxuICAgIGlmICghY29tcGxldGlvbi5kZXNjcmlwdGlvbiAmJiBjb21wbGV0aW9uLmRlc2NyaXB0aW9uTW9yZVVSTCkge1xuICAgICAgY29tcGxldGlvbi5kZXNjcmlwdGlvbiA9ICcgJ1xuICAgIH1cbiAgICByZXR1cm4gY29tcGxldGlvblxuICB9XG5cbiAgLy8gc2hvdWxkIHN5bmMgd2l0aCBhdG9tLWluay9saWIvd29ya3NwYWNlL3dvcmtzcGFjZS5qc1xuICBtYWtlSWNvbihpY29uKSB7XG4gICAgLy8gaWYgbm90IHNwZWNpZmllZCwganVzdCBmYWxsYmFjayB0byBgY29tcGxldGlvbi50eXBlYFxuICAgIGlmICghaWNvbikgcmV0dXJuICcnXG4gICAgaWYgKGljb24uc3RhcnRzV2l0aCgnaWNvbi0nKSkgcmV0dXJuIGA8c3BhbiBjbGFzcz1cIiR7aWNvbn1cIn0+PC9zcGFuPmBcbiAgICByZXR1cm4gaWNvbi5sZW5ndGggPT09IDEgPyBpY29uIDogJydcbiAgfVxuXG4gIHNsZWVwICgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbkRldGFpbHNPblNlbGVjdCAoX2NvbXBsZXRpb24pIHtcbiAgICBjb25zdCBjb21wbGV0aW9uV2l0aERldGFpbCA9IGNvbXBsZXRpb25EZXRhaWwoX2NvbXBsZXRpb24pLnRoZW4oY29tcGxldGlvbiA9PiB7XG4gICAgICAvLyB3b3JrYXJvdW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F1dG9jb21wbGV0ZS1wbHVzL2lzc3Vlcy84NjhcbiAgICAgIGlmICghY29tcGxldGlvbi5kZXNjcmlwdGlvbiAmJiBjb21wbGV0aW9uLmRlc2NyaXB0aW9uTW9yZVVSTCkge1xuICAgICAgICBjb21wbGV0aW9uLmRlc2NyaXB0aW9uID0gJyAnXG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcGxldGlvblxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSlcbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtjb21wbGV0aW9uV2l0aERldGFpbCwgdGhpcy5zbGVlcCgpXSlcbiAgfVxuXG4gIG9uRGlkSW5zZXJ0U3VnZ2VzdGlvbiAoeyBlZGl0b3IsIHN1Z2dlc3Rpb246IHsgdHlwZSB9IH0pIHtcbiAgICBpZiAodHlwZSAhPT0gJ2Z1bmN0aW9uJyB8fCB0aGlzLm5vQXV0b1BhcmVudGhlc2lzKSByZXR1cm5cbiAgICBlZGl0b3IubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbiA9PiB7XG4gICAgICBpZiAoIXNlbGVjdGlvbi5pc0VtcHR5KCkpIHJldHVyblxuICAgICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICAgIGNvbnN0IGN1cnJlbnRQb2ludCA9IG5ldyBQb2ludChyb3csIGNvbHVtbilcbiAgICAgIGNvbnN0IG5leHRQb2ludCA9IG5ldyBQb2ludChyb3csIGNvbHVtbiArIDEpXG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBSYW5nZShjdXJyZW50UG9pbnQsIG5leHRQb2ludClcbiAgICAgIGNvbnN0IGZpbmlzaFJhbmdlID0gbmV3IFJhbmdlKG5leHRQb2ludCwgbmV4dFBvaW50KVxuICAgICAgaWYgKGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkgIT09ICcoJykge1xuICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dCgnKCknKVxuICAgICAgfVxuICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKGZpbmlzaFJhbmdlKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEF1dG9Db21wbGV0ZVByb3ZpZGVyKClcbiJdfQ==