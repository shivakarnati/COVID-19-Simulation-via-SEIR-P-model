Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilEtchJs = require('../util/etch.js');

var _atom = require('atom');

'use babel';
var TerminalSearchUI = (function () {
  function TerminalSearchUI(terminal, searcher) {
    _classCallCheck(this, TerminalSearchUI);

    this.terminal = terminal;
    this.searcher = searcher;
    this.editor = new _atom.TextEditor({ mini: true, placeholderText: 'Find in Terminal' });

    this.useRegex = false;
    this.matchCase = false;
    this.wholeWord = false;

    this.initialized = false;
    this.errorMessage = '';

    _etch2['default'].initialize(this);
  }

  _createClass(TerminalSearchUI, [{
    key: 'update',
    value: function update() {}
  }, {
    key: 'toggleRegex',
    value: function toggleRegex() {
      this.useRegex = !this.useRegex;
      this.refs.toggleRegex.element.classList.toggle('selected');
    }
  }, {
    key: 'toggleCase',
    value: function toggleCase() {
      this.matchCase = !this.matchCase;
      this.refs.toggleCase.element.classList.toggle('selected');
    }
  }, {
    key: 'toggleWhole',
    value: function toggleWhole() {
      this.wholeWord = !this.wholeWord;
      this.refs.toggleWhole.element.classList.toggle('selected');
    }
  }, {
    key: 'toggleError',
    value: function toggleError(show) {
      var el = this.refs.errorMessage;
      show ? el.classList.remove('hidden') : el.classList.add('hidden');
      _etch2['default'].update(this);
    }
  }, {
    key: 'find',
    value: function find(next) {

      var text = this.editor.getText();
      if (this.useRegex) {
        var msg = null;
        try {
          new RegExp(text);
        } catch (err) {
          msg = err.message;
        }

        if (msg !== null) {
          this.errorMessage = msg;
          this.toggleError(true);
          this.blinkRed();
          return false;
        }
      }
      this.toggleError(false);

      var found = undefined;
      if (next) {
        found = this.searcher.findNext(text, {
          regex: this.useRegex,
          wholeWord: this.wholeWord,
          caseSensitive: this.matchCase,
          incremental: false
        });
      } else {
        found = this.searcher.findPrevious(text, {
          regex: this.useRegex,
          wholeWord: this.wholeWord,
          caseSensitive: this.matchCase
        });
      }

      if (!found) this.blinkRed();
    }
  }, {
    key: 'blinkRed',
    value: function blinkRed() {
      var _this = this;

      this.element.classList.add('nothingfound');
      setTimeout(function () {
        return _this.element.classList.remove('nothingfound');
      }, 200);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _etch2['default'].dom(
        'div',
        { className: 'ink search hidden' },
        _etch2['default'].dom(
          'div',
          { className: 'inputs' },
          _etch2['default'].dom(
            'span',
            { className: 'searchinput' },
            (0, _utilEtchJs.toView)(this.editor.element)
          ),
          _etch2['default'].dom(
            'div',
            { className: 'btn-group searchoptions' },
            _etch2['default'].dom(
              _utilEtchJs.Button,
              { className: 'btn-sm',
                ref: 'toggleRegex',
                alt: 'Use Regex',
                onclick: function () {
                  return _this2.toggleRegex();
                } },
              '.*'
            ),
            _etch2['default'].dom(
              _utilEtchJs.Button,
              { className: 'btn-sm',
                ref: 'toggleCase',
                alt: 'Match Case',
                onclick: function () {
                  return _this2.toggleCase();
                } },
              'Aa'
            ),
            _etch2['default'].dom(
              _utilEtchJs.Button,
              { className: 'btn-sm',
                ref: 'toggleWhole',
                alt: 'Whole Word',
                onclick: function () {
                  return _this2.toggleWhole();
                } },
              '\\b'
            )
          ),
          _etch2['default'].dom(
            'div',
            { className: 'btn-group nextprev' },
            _etch2['default'].dom(_utilEtchJs.Button, { className: 'btn-sm',
              alt: 'Find Previous',
              icon: 'chevron-left',
              onclick: function () {
                return _this2.find(false);
              } }),
            _etch2['default'].dom(_utilEtchJs.Button, { className: 'btn-sm',
              alt: 'Find Next',
              icon: 'chevron-right',
              onclick: function () {
                return _this2.find(true);
              } })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'btn-group closebutton' },
            _etch2['default'].dom(_utilEtchJs.Button, { className: 'btn-sm',
              alt: 'Close',
              icon: 'x',
              onclick: function () {
                return _this2.hide();
              } })
          )
        ),
        _etch2['default'].dom(
          'div',
          { className: 'errormessage hidden',
            ref: 'errorMessage' },
          this.errorMessage
        )
      );
    }
  }, {
    key: 'attach',
    value: function attach(element) {
      if (!this.initialized) {
        element.appendChild(this.element);
        this.initialized = true;
      }
    }
  }, {
    key: 'show',
    value: function show() {
      this.element.classList.remove('hidden');
      this.editor.element.focus();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.element.classList.add('hidden');
      this.terminal.focus();
    }
  }]);

  return TerminalSearchUI;
})();

exports['default'] = TerminalSearchUI;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9jb25zb2xlL3NlYXJjaHVpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OzswQkFDYSxpQkFBaUI7O29CQUNJLE1BQU07O0FBTC9ELFdBQVcsQ0FBQTtJQU9VLGdCQUFnQjtBQUN2QixXQURPLGdCQUFnQixDQUN0QixRQUFRLEVBQUUsUUFBUSxFQUFFOzBCQURkLGdCQUFnQjs7QUFFakMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxxQkFBZ0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBQyxDQUFFLENBQUE7O0FBRWpGLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBOztBQUV0QixRQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN4QixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTs7QUFFdEIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3RCOztlQWRrQixnQkFBZ0I7O1dBZ0I1QixrQkFBRyxFQUFFOzs7V0FFQSx1QkFBRztBQUNiLFVBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQzNEOzs7V0FFVSxzQkFBRztBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENB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RU0sZ0JBQUMsT0FBTyxFQUFFO0FBQ2YsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsZUFBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakMsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7T0FDeEI7S0FDRjs7O1dBRUksZ0JBQUc7QUFDTixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdkMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDNUI7OztXQUVJLGdCQUFHO0FBQ04sVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdEI7OztTQXJKa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvY29uc29sZS9zZWFyY2h1aS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgUmF3LCBCdXR0b24sIHRvVmlldyB9IGZyb20gJy4uL3V0aWwvZXRjaC5qcydcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtaW5hbFNlYXJjaFVJIHtcbiAgY29uc3RydWN0b3IgKHRlcm1pbmFsLCBzZWFyY2hlcikge1xuICAgIHRoaXMudGVybWluYWwgPSB0ZXJtaW5hbFxuICAgIHRoaXMuc2VhcmNoZXIgPSBzZWFyY2hlclxuICAgIHRoaXMuZWRpdG9yID0gbmV3IFRleHRFZGl0b3IoIHttaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdGaW5kIGluIFRlcm1pbmFsJ30gKVxuXG4gICAgdGhpcy51c2VSZWdleCA9IGZhbHNlXG4gICAgdGhpcy5tYXRjaENhc2UgPSBmYWxzZVxuICAgIHRoaXMud2hvbGVXb3JkID0gZmFsc2VcblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZVxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gJydcblxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgdG9nZ2xlUmVnZXggKCkge1xuICAgIHRoaXMudXNlUmVnZXggPSAhdGhpcy51c2VSZWdleFxuICAgIHRoaXMucmVmcy50b2dnbGVSZWdleC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJylcbiAgfVxuXG4gIHRvZ2dsZUNhc2UgKCkge1xuICAgIHRoaXMubWF0Y2hDYXNlID0gIXRoaXMubWF0Y2hDYXNlXG4gICAgdGhpcy5yZWZzLnRvZ2dsZUNhc2UuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcpXG4gIH1cblxuICB0b2dnbGVXaG9sZSAoKSB7XG4gICAgdGhpcy53aG9sZVdvcmQgPSAhdGhpcy53aG9sZVdvcmRcbiAgICB0aGlzLnJlZnMudG9nZ2xlV2hvbGUuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcpXG4gIH1cblxuICB0b2dnbGVFcnJvciAoc2hvdykge1xuICAgIGxldCBlbCA9IHRoaXMucmVmcy5lcnJvck1lc3NhZ2VcbiAgICBzaG93ID8gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJykgOiBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBmaW5kIChuZXh0KSB7XG5cbiAgICBsZXQgdGV4dCA9IHRoaXMuZWRpdG9yLmdldFRleHQoKVxuICAgIGlmICh0aGlzLnVzZVJlZ2V4KSB7XG4gICAgICBsZXQgbXNnID0gbnVsbFxuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IFJlZ0V4cCh0ZXh0KVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIG1zZyA9IGVyci5tZXNzYWdlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc2cgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBtc2dcbiAgICAgICAgdGhpcy50b2dnbGVFcnJvcih0cnVlKVxuICAgICAgICB0aGlzLmJsaW5rUmVkKClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudG9nZ2xlRXJyb3IoZmFsc2UpXG5cbiAgICBsZXQgZm91bmRcbiAgICBpZiAobmV4dCkge1xuICAgICAgZm91bmQgPSB0aGlzLnNlYXJjaGVyLmZpbmROZXh0KHRleHQsIHtcbiAgICAgICAgcmVnZXg6IHRoaXMudXNlUmVnZXgsXG4gICAgICAgIHdob2xlV29yZDogdGhpcy53aG9sZVdvcmQsXG4gICAgICAgIGNhc2VTZW5zaXRpdmU6IHRoaXMubWF0Y2hDYXNlLFxuICAgICAgICBpbmNyZW1lbnRhbDogZmFsc2VcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvdW5kID0gdGhpcy5zZWFyY2hlci5maW5kUHJldmlvdXModGV4dCwge1xuICAgICAgICByZWdleDogdGhpcy51c2VSZWdleCxcbiAgICAgICAgd2hvbGVXb3JkOiB0aGlzLndob2xlV29yZCxcbiAgICAgICAgY2FzZVNlbnNpdGl2ZTogdGhpcy5tYXRjaENhc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCkgdGhpcy5ibGlua1JlZCgpXG4gIH1cblxuICBibGlua1JlZCAoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25vdGhpbmdmb3VuZCcpXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm90aGluZ2ZvdW5kJyksIDIwMClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdpbmsgc2VhcmNoIGhpZGRlbic+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0naW5wdXRzJz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdzZWFyY2hpbnB1dCc+eyB0b1ZpZXcodGhpcy5lZGl0b3IuZWxlbWVudCkgfTwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2J0bi1ncm91cCBzZWFyY2hvcHRpb25zJz5cbiAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT0nYnRuLXNtJ1xuICAgICAgICAgICAgICAgICAgcmVmPSd0b2dnbGVSZWdleCdcbiAgICAgICAgICAgICAgICAgIGFsdD0nVXNlIFJlZ2V4J1xuICAgICAgICAgICAgICAgICAgb25jbGljaz17KCkgPT4gdGhpcy50b2dnbGVSZWdleCgpfT5cbiAgICAgICAgICAuKlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPSdidG4tc20nXG4gICAgICAgICAgICAgICAgICByZWY9J3RvZ2dsZUNhc2UnXG4gICAgICAgICAgICAgICAgICBhbHQ9J01hdGNoIENhc2UnXG4gICAgICAgICAgICAgICAgICBvbmNsaWNrPXsoKSA9PiB0aGlzLnRvZ2dsZUNhc2UoKX0+XG4gICAgICAgICAgQWFcbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT0nYnRuLXNtJ1xuICAgICAgICAgICAgICAgICAgcmVmPSd0b2dnbGVXaG9sZSdcbiAgICAgICAgICAgICAgICAgIGFsdD0nV2hvbGUgV29yZCdcbiAgICAgICAgICAgICAgICAgIG9uY2xpY2s9eygpID0+IHRoaXMudG9nZ2xlV2hvbGUoKX0+XG4gICAgICAgICAgXFxiXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYnRuLWdyb3VwIG5leHRwcmV2Jz5cbiAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT0nYnRuLXNtJ1xuICAgICAgICAgICAgICAgICAgYWx0PSdGaW5kIFByZXZpb3VzJ1xuICAgICAgICAgICAgICAgICAgaWNvbj0nY2hldnJvbi1sZWZ0J1xuICAgICAgICAgICAgICAgICAgb25jbGljaz17KCkgPT4gdGhpcy5maW5kKGZhbHNlKX0+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9J2J0bi1zbSdcbiAgICAgICAgICAgICAgICAgIGFsdD0nRmluZCBOZXh0J1xuICAgICAgICAgICAgICAgICAgaWNvbj0nY2hldnJvbi1yaWdodCdcbiAgICAgICAgICAgICAgICAgIG9uY2xpY2s9eygpID0+IHRoaXMuZmluZCh0cnVlKX0+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYnRuLWdyb3VwIGNsb3NlYnV0dG9uJz5cbiAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT0nYnRuLXNtJ1xuICAgICAgICAgICAgICAgICAgYWx0PSdDbG9zZSdcbiAgICAgICAgICAgICAgICAgIGljb249J3gnXG4gICAgICAgICAgICAgICAgICBvbmNsaWNrPXsoKSA9PiB0aGlzLmhpZGUoKX0+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZXJyb3JtZXNzYWdlIGhpZGRlbidcbiAgICAgICAgICAgcmVmPSdlcnJvck1lc3NhZ2UnPlxuICAgICAgICB7dGhpcy5lcnJvck1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIGF0dGFjaCAoZWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIHRoaXMuZWRpdG9yLmVsZW1lbnQuZm9jdXMoKVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgdGhpcy50ZXJtaW5hbC5mb2N1cygpXG4gIH1cbn1cbiJdfQ==