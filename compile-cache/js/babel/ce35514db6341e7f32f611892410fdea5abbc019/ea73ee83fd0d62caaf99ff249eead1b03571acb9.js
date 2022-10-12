var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _xtermAddonWebgl = require('xterm-addon-webgl');

var _elementResizeDetector = require('element-resize-detector');

var _elementResizeDetector2 = _interopRequireDefault(_elementResizeDetector);

var _underscorePlus = require('underscore-plus');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

'use babel';

var TerminalElement = (function (_HTMLElement) {
  _inherits(TerminalElement, _HTMLElement);

  function TerminalElement() {
    _classCallCheck(this, TerminalElement);

    _get(Object.getPrototypeOf(TerminalElement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TerminalElement, [{
    key: 'initialize',
    value: function initialize(model) {
      var _this = this;

      if (this.initialized) return this;

      // check if element is visible, because `terminal.open(this)` will fail otherwise
      var rect = this.getBoundingClientRect();
      if (rect.width == 0 || rect.height == 0) {
        return;
      }

      this.subs = new _atom.CompositeDisposable();

      this.initialized = true;

      this.model = model;
      this.resizer = new _elementResizeDetector2['default']();

      this.model.terminal.open(this);

      if (this.model.isWebgl) {
        try {
          this.model.terminal.loadAddon(new _xtermAddonWebgl.WebglAddon());
        } catch (err) {
          console.error('Tried to start terminal with WebGL backend, but encountered the following error:');
          console.error(err);
        }
      }

      this.subs.add(atom.config.observe('editor.fontSize', function (val) {
        _this.model.terminal.setOption('fontSize', val);
      }));

      this.subs.add(atom.config.observe('editor.fontFamily', function (val) {
        // default fonts as of Atom 1.26
        val = val ? val : 'Menlo, Consolas, "DejaVu Sans Mono", monospace';
        _this.model.terminal.setOption('fontFamily', val);
      }));

      this.subs.add(atom.themes.onDidChangeActiveThemes(function () {
        setTimeout(function () {
          return _this.themeTerminal();
        }, 0);
      }));

      this.subs.add(atom.config.observe('ink.terminal', function (val) {
        _this.ansiColors = val;
        _this.themeTerminal();
      }));

      this.resizer.listenTo(this, (0, _underscorePlus.debounce)(function () {
        return _this.resize();
      }, 100));

      this.themeTerminal();
      this.initMouseHandling();

      this.model.searchui.attach(this);

      return this;
    }
  }, {
    key: 'deinitialize',
    value: function deinitialize() {
      this.subs.dispose();
    }
  }, {
    key: 'getModel',
    value: function getModel() {
      if (this.initialized) {
        return this.model;
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.model.resize();
    }
  }, {
    key: 'initMouseHandling',
    value: function initMouseHandling() {
      var isMouseOver = false;

      this.addEventListener('mouseover', function (e) {
        isMouseOver = true;
      });

      this.addEventListener('mouseout', function (e) {
        isMouseOver = false;
      });

      this.addEventListener('paste', function (e) {
        if (!isMouseOver) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    }
  }, {
    key: 'themeTerminal',
    value: function themeTerminal() {
      var _this2 = this;

      var cs = window.getComputedStyle(this);
      if (!cs['backgroundColor']) {
        setTimeout(function () {
          return _this2.themeTerminal();
        }, 100);
        return;
      }
      var isDarkTheme = (0, _chromaJs2['default'])(cs['backgroundColor']).luminance() < 0.5;
      var bg = rgb2hex(cs['backgroundColor']);
      var fg = rgb2hex(cs['color']);
      var selection = (0, _chromaJs2['default'])(fg).alpha(this.ansiColors['selectionAlpha']);

      var modifier = isDarkTheme ? 'dark' : 'light';

      this.model.terminal.setOption('theme', {
        'background': bg,
        'selection': selection.hex('rgba'), // transparent foreground color
        'foreground': fg,
        'cursor': fg,
        'cursorAccent': bg,

        'black': this.ansiColors['ansiBlack'][modifier].toHexString(),
        'red': this.ansiColors['ansiRed'][modifier].toHexString(),
        'green': this.ansiColors['ansiGreen'][modifier].toHexString(),
        'yellow': this.ansiColors['ansiYellow'][modifier].toHexString(),
        'blue': this.ansiColors['ansiBlue'][modifier].toHexString(),
        'magenta': this.ansiColors['ansiMagenta'][modifier].toHexString(),
        'cyan': this.ansiColors['ansiCyan'][modifier].toHexString(),
        'white': this.ansiColors['ansiWhite'][modifier].toHexString(),

        'brightBlack': this.ansiColors['ansiBrightBlack'][modifier].toHexString(),
        'brightRed': this.ansiColors['ansiBrightRed'][modifier].toHexString(),
        'brightGreen': this.ansiColors['ansiBrightGreen'][modifier].toHexString(),
        'brightYellow': this.ansiColors['ansiBrightYellow'][modifier].toHexString(),
        'brightBlue': this.ansiColors['ansiBrightBlue'][modifier].toHexString(),
        'brightMagenta': this.ansiColors['ansiBrightMagenta'][modifier].toHexString(),
        'brightCyan': this.ansiColors['ansiBrightCyan'][modifier].toHexString(),
        'brightWhite': this.ansiColors['ansiBrightWhite'][modifier].toHexString()
      });

      this.resize();
    }
  }]);

  return TerminalElement;
})(HTMLElement);

function hex(x) {
  return ("0" + parseInt(x).toString(16)).slice(-2);
}
function rgb2hex(rgb) {
  if (rgb.search("rgb") == -1) {
    return rgb;
  } else {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
}

module.exports = TerminalElement = document.registerElement('ink-terminal', { prototype: TerminalElement.prototype });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9jb25zb2xlL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7K0JBQ2YsbUJBQW1COztxQ0FDbkIseUJBQXlCOzs7OzhCQUNqQixpQkFBaUI7O3dCQUNqQyxXQUFXOzs7O0FBTjlCLFdBQVcsQ0FBQTs7SUFRTCxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ1Isb0JBQUMsS0FBSyxFQUFFOzs7QUFDakIsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFBOzs7QUFHakMsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdkMsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUN2QyxlQUFNO09BQ1A7O0FBRUQsVUFBSSxDQUFDLElBQUksR0FBRywrQkFBdUIsQ0FBQTs7QUFFbkMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7O0FBRXZCLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEdBQUcsd0NBQW9CLENBQUE7O0FBRW5DLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFOUIsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUN0QixZQUFJO0FBQ0YsY0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGlDQUFnQixDQUFDLENBQUE7U0FDaEQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLGlCQUFPLENBQUMsS0FBSyxDQUFDLGtGQUFrRixDQUFD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QVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRTtPQUMxRSxDQUFDLENBQUE7O0FBRUYsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ2Q7OztTQWxJRyxlQUFlO0dBQVMsV0FBVzs7QUFxSXpDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNkLFNBQU8sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ25EO0FBQ0QsU0FBUyxPQUFPLENBQUUsR0FBRyxFQUFFO0FBQ3JCLE1BQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMzQixXQUFPLEdBQUcsQ0FBQTtHQUNYLE1BQU07QUFDTCxPQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO0FBQ25FLFdBQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3REO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2NvbnNvbGUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgV2ViZ2xBZGRvbiB9IGZyb20gJ3h0ZXJtLWFkZG9uLXdlYmdsJ1xuaW1wb3J0IFJlc2l6ZURldGVjdG9yIGZyb20gJ2VsZW1lbnQtcmVzaXplLWRldGVjdG9yJ1xuaW1wb3J0IHsgZGVib3VuY2UsIHRocm90dGxlIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IGNocm9tYSBmcm9tICdjaHJvbWEtanMnXG5cbmNsYXNzIFRlcm1pbmFsRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgaW5pdGlhbGl6ZSAobW9kZWwpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkgcmV0dXJuIHRoaXNcblxuICAgIC8vIGNoZWNrIGlmIGVsZW1lbnQgaXMgdmlzaWJsZSwgYmVjYXVzZSBgdGVybWluYWwub3Blbih0aGlzKWAgd2lsbCBmYWlsIG90aGVyd2lzZVxuICAgIGxldCByZWN0ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChyZWN0LndpZHRoID09IDAgfHwgcmVjdC5oZWlnaHQgPT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlXG5cbiAgICB0aGlzLm1vZGVsID0gbW9kZWxcbiAgICB0aGlzLnJlc2l6ZXIgPSBuZXcgUmVzaXplRGV0ZWN0b3IoKVxuXG4gICAgdGhpcy5tb2RlbC50ZXJtaW5hbC5vcGVuKHRoaXMpXG5cbiAgICBpZiAodGhpcy5tb2RlbC5pc1dlYmdsKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLm1vZGVsLnRlcm1pbmFsLmxvYWRBZGRvbihuZXcgV2ViZ2xBZGRvbigpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RyaWVkIHRvIHN0YXJ0IHRlcm1pbmFsIHdpdGggV2ViR0wgYmFja2VuZCwgYnV0IGVuY291bnRlcmVkIHRoZSBmb2xsb3dpbmcgZXJyb3I6JylcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3IuZm9udFNpemUnLCAodmFsKSA9PiB7XG4gICAgICAgIHRoaXMubW9kZWwudGVybWluYWwuc2V0T3B0aW9uKCdmb250U2l6ZScsIHZhbClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLmZvbnRGYW1pbHknLCAodmFsKSA9PiB7XG4gICAgICAgIC8vIGRlZmF1bHQgZm9udHMgYXMgb2YgQXRvbSAxLjI2XG4gICAgICAgIHZhbCA9IHZhbCA/IHZhbCA6ICdNZW5sbywgQ29uc29sYXMsIFwiRGVqYVZ1IFNhbnMgTW9ub1wiLCBtb25vc3BhY2UnXG4gICAgICAgIHRoaXMubW9kZWwudGVybWluYWwuc2V0T3B0aW9uKCdmb250RmFtaWx5JywgdmFsKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzLmFkZChhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lcygoKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGhlbWVUZXJtaW5hbCgpLCAwKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdpbmsudGVybWluYWwnLCAodmFsKSA9PiB7XG4gICAgICB0aGlzLmFuc2lDb2xvcnMgPSB2YWxcbiAgICAgIHRoaXMudGhlbWVUZXJtaW5hbCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnJlc2l6ZXIubGlzdGVuVG8odGhpcywgZGVib3VuY2UoKCkgPT4gdGhpcy5yZXNpemUoKSwgMTAwKSlcblxuICAgIHRoaXMudGhlbWVUZXJtaW5hbCgpXG4gICAgdGhpcy5pbml0TW91c2VIYW5kbGluZygpXG5cbiAgICB0aGlzLm1vZGVsLnNlYXJjaHVpLmF0dGFjaCh0aGlzKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGRlaW5pdGlhbGl6ZSAoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKVxuICB9XG5cbiAgZ2V0TW9kZWwgKCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbFxuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZSAoKSB7XG4gICAgdGhpcy5tb2RlbC5yZXNpemUoKVxuICB9XG5cbiAgaW5pdE1vdXNlSGFuZGxpbmcgKCkge1xuICAgIGxldCBpc01vdXNlT3ZlciA9IGZhbHNlXG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGUgPT4ge1xuICAgICAgaXNNb3VzZU92ZXIgPSB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBlID0+IHtcbiAgICAgIGlzTW91c2VPdmVyID0gZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGUgPT4ge1xuICAgICAgaWYgKCFpc01vdXNlT3Zlcikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgICAgfVxuICAgIH0sIHRydWUpXG4gIH1cblxuICB0aGVtZVRlcm1pbmFsICgpIHtcbiAgICBsZXQgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKVxuICAgIGlmICghY3NbJ2JhY2tncm91bmRDb2xvciddKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGhlbWVUZXJtaW5hbCgpLCAxMDApXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IGlzRGFya1RoZW1lID0gY2hyb21hKGNzWydiYWNrZ3JvdW5kQ29sb3InXSkubHVtaW5hbmNlKCkgPCAwLjVcbiAgICBsZXQgYmcgPSByZ2IyaGV4KGNzWydiYWNrZ3JvdW5kQ29sb3InXSlcbiAgICBsZXQgZmcgPSByZ2IyaGV4KGNzWydjb2xvciddKVxuICAgIGxldCBzZWxlY3Rpb24gPSBjaHJvbWEoZmcpLmFscGhhKHRoaXMuYW5zaUNvbG9yc1snc2VsZWN0aW9uQWxwaGEnXSlcblxuICAgIGxldCBtb2RpZmllciA9IGlzRGFya1RoZW1lID8gJ2RhcmsnIDogJ2xpZ2h0J1xuXG4gICAgdGhpcy5tb2RlbC50ZXJtaW5hbC5zZXRPcHRpb24oJ3RoZW1lJywge1xuICAgICAgJ2JhY2tncm91bmQnOiBiZyxcbiAgICAgICdzZWxlY3Rpb24nOiBzZWxlY3Rpb24uaGV4KCdyZ2JhJyksIC8vIHRyYW5zcGFyZW50IGZvcmVncm91bmQgY29sb3JcbiAgICAgICdmb3JlZ3JvdW5kJzogZmcsXG4gICAgICAnY3Vyc29yJzogZmcsXG4gICAgICAnY3Vyc29yQWNjZW50JzogYmcsXG5cbiAgICAgICdibGFjayc6IHRoaXMuYW5zaUNvbG9yc1snYW5zaUJsYWNrJ11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAncmVkJzogdGhpcy5hbnNpQ29sb3JzWydhbnNpUmVkJ11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAnZ3JlZW4nOiB0aGlzLmFuc2lDb2xvcnNbJ2Fuc2lHcmVlbiddW21vZGlmaWVyXS50b0hleFN0cmluZygpLFxuICAgICAgJ3llbGxvdyc6IHRoaXMuYW5zaUNvbG9yc1snYW5zaVllbGxvdyddW21vZGlmaWVyXS50b0hleFN0cmluZygpLFxuICAgICAgJ2JsdWUnOiB0aGlzLmFuc2lDb2xvcnNbJ2Fuc2lCbHVlJ11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAnbWFnZW50YSc6IHRoaXMuYW5zaUNvbG9yc1snYW5zaU1hZ2VudGEnXVttb2RpZmllcl0udG9IZXhTdHJpbmcoKSxcbiAgICAgICdjeWFuJzogdGhpcy5hbnNpQ29sb3JzWydhbnNpQ3lhbiddW21vZGlmaWVyXS50b0hleFN0cmluZygpLFxuICAgICAgJ3doaXRlJzogdGhpcy5hbnNpQ29sb3JzWydhbnNpV2hpdGUnXVttb2RpZmllcl0udG9IZXhTdHJpbmcoKSxcblxuICAgICAgJ2JyaWdodEJsYWNrJzogdGhpcy5hbnNpQ29sb3JzWydhbnNpQnJpZ2h0QmxhY2snXVttb2RpZmllcl0udG9IZXhTdHJpbmcoKSxcbiAgICAgICdicmlnaHRSZWQnOiB0aGlzLmFuc2lDb2xvcnNbJ2Fuc2lCcmlnaHRSZWQnXVttb2RpZmllcl0udG9IZXhTdHJpbmcoKSxcbiAgICAgICdicmlnaHRHcmVlbic6IHRoaXMuYW5zaUNvbG9yc1snYW5zaUJyaWdodEdyZWVuJ11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAnYnJpZ2h0WWVsbG93JzogdGhpcy5hbnNpQ29sb3JzWydhbnNpQnJpZ2h0WWVsbG93J11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAnYnJpZ2h0Qmx1ZSc6IHRoaXMuYW5zaUNvbG9yc1snYW5zaUJyaWdodEJsdWUnXVttb2RpZmllcl0udG9IZXhTdHJpbmcoKSxcbiAgICAgICdicmlnaHRNYWdlbnRhJzogdGhpcy5hbnNpQ29sb3JzWydhbnNpQnJpZ2h0TWFnZW50YSddW21vZGlmaWVyXS50b0hleFN0cmluZygpLFxuICAgICAgJ2JyaWdodEN5YW4nOiB0aGlzLmFuc2lDb2xvcnNbJ2Fuc2lCcmlnaHRDeWFuJ11bbW9kaWZpZXJdLnRvSGV4U3RyaW5nKCksXG4gICAgICAnYnJpZ2h0V2hpdGUnOiB0aGlzLmFuc2lDb2xvcnNbJ2Fuc2lCcmlnaHRXaGl0ZSddW21vZGlmaWVyXS50b0hleFN0cmluZygpLFxuICAgIH0pXG5cbiAgICB0aGlzLnJlc2l6ZSgpXG4gIH1cbn1cblxuZnVuY3Rpb24gaGV4KHgpIHtcbiAgcmV0dXJuIChcIjBcIiArIHBhcnNlSW50KHgpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xufVxuZnVuY3Rpb24gcmdiMmhleCAocmdiKSB7XG4gIGlmIChyZ2Iuc2VhcmNoKFwicmdiXCIpID09IC0xKSB7XG4gICAgcmV0dXJuIHJnYlxuICB9IGVsc2Uge1xuICAgIHJnYiA9IHJnYi5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKSg/OixcXHMqKFxcZCspKT9cXCkkLylcbiAgICByZXR1cm4gXCIjXCIgKyBoZXgocmdiWzFdKSArIGhleChyZ2JbMl0pICsgaGV4KHJnYlszXSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXJtaW5hbEVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luay10ZXJtaW5hbCcsIHtwcm90b3R5cGU6IFRlcm1pbmFsRWxlbWVudC5wcm90b3R5cGV9KVxuIl19