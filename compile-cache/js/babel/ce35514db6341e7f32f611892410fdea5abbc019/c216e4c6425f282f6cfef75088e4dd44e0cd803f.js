Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilEtchJs = require('../util/etch.js');

var _atom = require('atom');

var _xterm = require('xterm');

var _xtermAddonSearch = require('xterm-addon-search');

var _xtermAddonWebLinks = require('xterm-addon-web-links');

var _xtermAddonUnicode11 = require('xterm-addon-unicode11');

var _xtermAddonFit = require('xterm-addon-fit');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _underscorePlus = require('underscore-plus');

var _helpers = require('./helpers');

var _shell = require('shell');

var _searchui = require('./searchui');

var _searchui2 = _interopRequireDefault(_searchui);

'use babel';

var getTerminal = function getTerminal(el) {
  return (0, _helpers.closest)(el, 'ink-terminal').getModel();
};

var subs = undefined;

var InkTerminal = (function (_PaneItem) {
  _inherits(InkTerminal, _PaneItem);

  _createClass(InkTerminal, null, [{
    key: 'activate',
    value: function activate() {
      subs = new _atom.CompositeDisposable();
      subs.add(atom.commands.add('ink-terminal', {
        'ink-terminal:copy': function inkTerminalCopy(_ref) {
          var target = _ref.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.copySelection();
          }
        },
        'ink-terminal:paste': function inkTerminalPaste(_ref2) {
          var target = _ref2.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.paste(process.platform != 'win32');
          }
        },
        'ink-terminal:show-search': function inkTerminalShowSearch(_ref3) {
          var target = _ref3.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.searchui.show();
          }
        },
        'ink-terminal:find-next': function inkTerminalFindNext(_ref4) {
          var target = _ref4.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.searchui.find(true);
          }
        },
        'ink-terminal:find-previous': function inkTerminalFindPrevious(_ref5) {
          var target = _ref5.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.searchui.find(false);
          }
        },
        'ink-terminal:close-search': function inkTerminalCloseSearch(_ref6) {
          var target = _ref6.target;

          var term = getTerminal(target);
          if (term != undefined) {
            term.searchui.hide();
          }
        }
      }));

      subs.add(atom.workspace.onDidChangeActivePaneItem(function (item) {
        if (item instanceof InkTerminal) {
          item.view.initialize(item);
          item.terminal.focus();
          if (item.ty) {
            item.resize();
          }
        }
      }));
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      subs.dispose();
      subs = null;
    }
  }]);

  function InkTerminal(opts) {
    var _this = this;

    _classCallCheck(this, InkTerminal);

    _get(Object.getPrototypeOf(InkTerminal.prototype), 'constructor', this).call(this);

    // default options
    this.name = 'InkTerminal';
    opts = Object.assign({}, {
      cursorBlink: false,
      cols: 100,
      rows: 30,
      scrollback: 5000,
      tabStopWidth: 4
    }, opts);

    if (process.platform === 'win32') {
      opts.windowsMode = true;
    }

    this.persistentState = {};
    this.persistentState.opts = opts;

    if (opts.rendererType === 'webgl') {
      this.isWebgl = true;
      opts.rendererType = 'canvas';
    }

    this.terminal = new _xterm.Terminal(opts);
    var webLinksAddon = new _xtermAddonWebLinks.WebLinksAddon(function (ev, uri) {
      if (!_this.shouldOpenLink(ev)) return false;
      (0, _shell.openExternal)(uri);
    }, {
      willLinkActivate: function willLinkActivate(ev) {
        return _this.shouldOpenLink(ev);
      },
      tooltipCallback: function tooltipCallback(ev, uri, location) {
        return _this.tooltipCallback(ev, uri, location);
      },
      leaveCallback: function leaveCallback() {
        return _this.closeTooltip();
      }
    });
    this.terminal.loadAddon(webLinksAddon);

    this.searchAddon = new _xtermAddonSearch.SearchAddon();
    this.terminal.loadAddon(this.searchAddon);

    this.unicode11Addon = new _xtermAddonUnicode11.Unicode11Addon();
    this.terminal.loadAddon(this.unicode11Addon);
    this.terminal.activeVersion = '11';

    this.fitAddon = new _xtermAddonFit.FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.setTitle('Terminal');

    this.classname = '';

    this.enterhandler = function (e) {
      if (!_this.ty && e.keyCode == 13) {
        if (_this.startRequested) {
          _this.startRequested();
        }
        return false;
      }
      return e;
    };

    this.terminal.attachCustomKeyEventHandler(this.enterhandler);

    this.view = new _view2['default']();

    this.searchui = new _searchui2['default'](this.terminal, this.searchAddon);

    _etch2['default'].initialize(this);
    _etch2['default'].update(this).then(function () {
      _this.view.initialize(_this);
    });

    this.terminal.onTitleChange(function (t) {
      return _this.setTitle(t);
    });
  }

  _createClass(InkTerminal, [{
    key: 'shouldOpenLink',
    value: function shouldOpenLink(ev) {
      return true;
    }
  }, {
    key: 'tooltipCallback',
    value: function tooltipCallback(ev, uri, location) {
      return false;
    }
  }, {
    key: 'closeTooltip',
    value: function closeTooltip() {
      return false;
    }
  }, {
    key: 'onDidOpenLink',
    value: function onDidOpenLink(f) {
      this.shouldOpenLink = f;
    }
  }, {
    key: 'registerTooltipHandler',
    value: function registerTooltipHandler(open, close) {
      var _this2 = this;

      this.tooltipCallback = function (ev, uri, location) {
        return open(ev, uri, location, _this2.terminal);
      };
      this.closeTooltip = close;
    }
  }, {
    key: 'cursorPosition',
    value: function cursorPosition() {
      this.write('\x1b[0m');
      return [this.terminal.buffer.active.cursorX, this.terminal.buffer.active.cursorY];
    }
  }, {
    key: 'setOption',
    value: function setOption(key, val) {
      if (!this.persistentState) {
        this.persistentState = { opts: {} };
      }
      if (!this.persistentState.opts) {
        this.persistentState.opts = {};
      }

      if (key === 'rendererType' && !this.element.initialized) {
        return;
      }
      try {
        if (key === 'rendererType' && val === 'webgl') {
          this.persistentState.opts[key] = val;
          val = 'canvas';
        } else {
          this.persistentState.opts[key] = val;
        }
        this.terminal.setOption(key, val);
      } catch (err) {
        console.warn('Error while applying settings for terminal:', this, err);
      }
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        _utilEtchJs.Raw,
        null,
        this.view
      );
    }
  }, {
    key: 'onAttached',
    value: function onAttached() {
      this.view.initialize(this);
      // force resize
      if (this.ty) this.resize();
    }
  }, {
    key: 'attachCustomKeyEventHandler',
    value: function attachCustomKeyEventHandler(f) {
      var _this3 = this;

      var keepDefault = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.terminal.attachCustomKeyEventHandler(function (e) {
        var custom = f(e);
        if (custom) {
          return _this3.enterhandler(e);
        } else {
          return false;
        }
      });
    }
  }, {
    key: 'attach',
    value: function attach(ty) {
      var _this4 = this;

      var clear = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var cwd = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      if (!ty || !ty.on || !ty.resize || !ty.write) {
        throw new Error('Tried attaching invalid pty.');
      }

      if (cwd) {
        this.persistentState.cwd = cwd;
      }

      this.detach();

      this.ty = ty;

      this.onData = this.terminal.onData(function (data) {
        return _this4.ty.write(data);
      });
      this.ty.on('data', function (data) {
        return _this4.terminal.write(data.toString());
      });

      if (this.element.parentElement) {
        this.resize();
      }

      if (clear) this.clear();
    }
  }, {
    key: 'detach',
    value: function detach() {
      var keepTy = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.ty != undefined) {
        if (this.onData != undefined) {
          this.onData.dispose();
          this.onData = undefined;
        }

        if (keepTy) this.ty.destroy();

        this.ty = undefined;
      }
    }
  }, {
    key: 'execute',
    value: function execute(text) {
      if (this.ty === undefined) {
        throw new Error('Need to attach a pty before executing code.');
      }

      this.ty.write(text);
    }
  }, {
    key: 'resize',
    value: function resize() {
      var _fitAddon$proposeDimensions = this.fitAddon.proposeDimensions();

      var cols = _fitAddon$proposeDimensions.cols;
      var rows = _fitAddon$proposeDimensions.rows;

      // slightly narrower terminal looks better:
      cols -= 1;
      if (cols < 1) cols = 1;
      if (this.terminal && !isNaN(cols) && !isNaN(rows)) {
        this.terminal.resize(cols, rows);
        if (this.ty && this.ty.resize) {
          try {
            this.ty.resize(cols, rows);
          } catch (err) {
            // the pty can apparently die before the resize event goes through (https://github.com/JunoLab/atom-julia-client/issues/687)
            console.error(err);
          }
        }
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      var hidePrompt = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.terminal.clear();
      hidePrompt && this.terminal.write('\r' + ' '.repeat(this.terminal.cols - 3) + '\r');
    }
  }, {
    key: 'copySelection',
    value: function copySelection() {
      if (this.terminal.hasSelection()) {
        atom.clipboard.write(this.terminal.getSelection());
        this.terminal.clearSelection();
        return true;
      }
      return false;
    }
  }, {
    key: 'paste',
    value: function paste() {
      var bracketed = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (this.ty === undefined) {
        throw new Error('Need to attach a pty before pasting.');
      }

      var clip = atom.clipboard.read();

      bracketed = bracketed && /\n/.test(clip);

      bracketed && this.ty.write('\x1b[200~'); // enable bracketed paste mode
      this.ty.write(clip);
      bracketed && this.ty.write('\x1b[201~'); // disable bracketed paste mode
    }
  }, {
    key: 'show',
    value: function show() {
      this.terminal.focus();
    }
  }, {
    key: 'write',
    value: function write(str) {
      this.terminal.write(str);
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return "terminal";
    }
  }, {
    key: 'class',
    set: function set(name) {
      this.classname = name;
      this.view.className = name;
    }
  }]);

  return InkTerminal;
})(_utilPaneItem2['default']);

exports['default'] = InkTerminal;

InkTerminal.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9jb25zb2xlL2NvbnNvbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OzswQkFDSCxpQkFBaUI7O29CQUNELE1BQU07O3FCQUNqQixPQUFPOztnQ0FDSixvQkFBb0I7O2tDQUNsQix1QkFBdUI7O21DQUN0Qix1QkFBdUI7OzZCQUM3QixpQkFBaUI7O29CQUNkLFFBQVE7Ozs7NEJBQ2YsbUJBQW1COzs7OzhCQUNMLGlCQUFpQjs7dUJBQzVCLFdBQVc7O3FCQUNOLE9BQU87O3dCQUNmLFlBQVk7Ozs7QUFoQmpDLFdBQVcsQ0FBQTs7QUFrQlgsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUcsRUFBRTtTQUFJLHNCQUFRLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FBQSxDQUFBOztBQUU5RCxJQUFJLElBQUksWUFBQSxDQUFBOztJQUVhLFdBQVc7WUFBWCxXQUFXOztlQUFYLFdBQVc7O1dBQ2Qsb0JBQUc7QUFDakIsVUFBSSxHQUFHLCtCQUF5QixDQUFBO0FBQ2hDLFVBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO0FBQ3pDLDJCQUFtQixFQUFHLHlCQUFDLElBQVEsRUFBSztjQUFaLE1BQU0sR0FBUCxJQUFRLENBQVAsTUFBTTs7QUFDNUIsY0FBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLGNBQUksSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUNyQixnQkFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO1dBQ3JCO1NBQUM7QUFDSiw0QkFBb0IsRUFBRSwwQkFBQyxLQUFRLEVBQUs7Y0FBWixNQUFNLEdBQVAsS0FBUSxDQUFQLE1BQU07O0FBQzVCLGNBQU0sSUFBSSxHQUFH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QVMsR0FBRyxJQUFJLENBQUE7S0FDM0I7OztTQWxJa0IsV0FBVzs7O3FCQUFYLFdBQVc7O0FBb1RoQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUEiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2NvbnNvbGUvY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgUmF3IH0gZnJvbSAnLi4vdXRpbC9ldGNoLmpzJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBUZXJtaW5hbCB9IGZyb20gJ3h0ZXJtJ1xuaW1wb3J0IHsgU2VhcmNoQWRkb24gfSBmcm9tICd4dGVybS1hZGRvbi1zZWFyY2gnXG5pbXBvcnQgeyBXZWJMaW5rc0FkZG9uIH0gZnJvbSAneHRlcm0tYWRkb24td2ViLWxpbmtzJ1xuaW1wb3J0IHsgVW5pY29kZTExQWRkb24gfSBmcm9tICd4dGVybS1hZGRvbi11bmljb2RlMTEnXG5pbXBvcnQgeyBGaXRBZGRvbiB9IGZyb20gJ3h0ZXJtLWFkZG9uLWZpdCdcbmltcG9ydCBUZXJtaW5hbEVsZW1lbnQgZnJvbSAnLi92aWV3J1xuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL3V0aWwvcGFuZS1pdGVtJ1xuaW1wb3J0IHsgZGVib3VuY2UsIHRocm90dGxlIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IHsgY2xvc2VzdCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IG9wZW5FeHRlcm5hbCB9IGZyb20gJ3NoZWxsJ1xuaW1wb3J0IFNlYXJjaFVJIGZyb20gJy4vc2VhcmNodWknXG5cbmxldCBnZXRUZXJtaW5hbCA9IGVsID0+IGNsb3Nlc3QoZWwsICdpbmstdGVybWluYWwnKS5nZXRNb2RlbCgpXG5cbmxldCBzdWJzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElua1Rlcm1pbmFsIGV4dGVuZHMgUGFuZUl0ZW0ge1xuICBzdGF0aWMgYWN0aXZhdGUgKCkge1xuICAgIHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgc3Vicy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2luay10ZXJtaW5hbCcsIHtcbiAgICAgICdpbmstdGVybWluYWw6Y29weSc6ICAoe3RhcmdldH0pID0+IHtcbiAgICAgICAgY29uc3QgdGVybSA9IGdldFRlcm1pbmFsKHRhcmdldClcbiAgICAgICAgaWYgKHRlcm0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGVybS5jb3B5U2VsZWN0aW9uKClcbiAgICAgICAgfX0sXG4gICAgICAnaW5rLXRlcm1pbmFsOnBhc3RlJzogKHt0YXJnZXR9KSA9PiB7XG4gICAgICAgIGNvbnN0IHRlcm0gPSBnZXRUZXJtaW5hbCh0YXJnZXQpXG4gICAgICAgIGlmICh0ZXJtICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRlcm0ucGFzdGUocHJvY2Vzcy5wbGF0Zm9ybSAhPSAnd2luMzInKVxuICAgICAgICB9fSxcbiAgICAgICdpbmstdGVybWluYWw6c2hvdy1zZWFyY2gnOiAoe3RhcmdldH0pID0+IHtcbiAgICAgICAgY29uc3QgdGVybSA9IGdldFRlcm1pbmFsKHRhcmdldClcbiAgICAgICAgaWYgKHRlcm0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGVybS5zZWFyY2h1aS5zaG93KClcbiAgICAgICAgfX0sXG4gICAgICAnaW5rLXRlcm1pbmFsOmZpbmQtbmV4dCc6ICh7dGFyZ2V0fSkgPT4ge1xuICAgICAgICBjb25zdCB0ZXJtID0gZ2V0VGVybWluYWwodGFyZ2V0KVxuICAgICAgICBpZiAodGVybSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0ZXJtLnNlYXJjaHVpLmZpbmQodHJ1ZSlcbiAgICAgICAgfX0sXG4gICAgICAnaW5rLXRlcm1pbmFsOmZpbmQtcHJldmlvdXMnOiAoe3RhcmdldH0pID0+IHtcbiAgICAgICAgY29uc3QgdGVybSA9IGdldFRlcm1pbmFsKHRhcmdldClcbiAgICAgICAgaWYgKHRlcm0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGVybS5zZWFyY2h1aS5maW5kKGZhbHNlKVxuICAgICAgICB9fSxcbiAgICAgICdpbmstdGVybWluYWw6Y2xvc2Utc2VhcmNoJzogKHt0YXJnZXR9KSA9PiB7XG4gICAgICAgIGNvbnN0IHRlcm0gPSBnZXRUZXJtaW5hbCh0YXJnZXQpXG4gICAgICAgIGlmICh0ZXJtICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRlcm0uc2VhcmNodWkuaGlkZSgpXG4gICAgICAgIH19XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIElua1Rlcm1pbmFsKSB7XG4gICAgICAgIGl0ZW0udmlldy5pbml0aWFsaXplKGl0ZW0pXG4gICAgICAgIGl0ZW0udGVybWluYWwuZm9jdXMoKVxuICAgICAgICBpZiAoaXRlbS50eSkge1xuICAgICAgICAgIGl0ZW0ucmVzaXplKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUgKCkge1xuICAgIHN1YnMuZGlzcG9zZSgpXG4gICAgc3VicyA9IG51bGxcbiAgfVxuXG4gIG5hbWUgPSAnSW5rVGVybWluYWwnXG5cbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICBzdXBlcigpXG5cbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgY3Vyc29yQmxpbms6IGZhbHNlLFxuICAgICAgY29sczogMTAwLFxuICAgICAgcm93czogMzAsXG4gICAgICBzY3JvbGxiYWNrOiA1MDAwLFxuICAgICAgdGFiU3RvcFdpZHRoOiA0LFxuICAgIH0sIG9wdHMpXG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgb3B0cy53aW5kb3dzTW9kZSA9IHRydWVcbiAgICB9XG5cbiAgICB0aGlzLnBlcnNpc3RlbnRTdGF0ZSA9IHt9XG4gICAgdGhpcy5wZXJzaXN0ZW50U3RhdGUub3B0cyA9IG9wdHNcblxuICAgIGlmIChvcHRzLnJlbmRlcmVyVHlwZSA9PT0gJ3dlYmdsJykge1xuICAgICAgdGhpcy5pc1dlYmdsID0gdHJ1ZVxuICAgICAgb3B0cy5yZW5kZXJlclR5cGUgPSAnY2FudmFzJ1xuICAgIH1cblxuICAgIHRoaXMudGVybWluYWwgPSBuZXcgVGVybWluYWwob3B0cylcbiAgICBjb25zdCB3ZWJMaW5rc0FkZG9uID0gbmV3IFdlYkxpbmtzQWRkb24oKGV2LCB1cmkpID0+IHtcbiAgICAgIGlmICghdGhpcy5zaG91bGRPcGVuTGluayhldikpIHJldHVybiBmYWxzZVxuICAgICAgb3BlbkV4dGVybmFsKHVyaSlcbiAgICB9LCB7XG4gICAgICB3aWxsTGlua0FjdGl2YXRlOiBldiA9PiB0aGlzLnNob3VsZE9wZW5MaW5rKGV2KSxcbiAgICAgIHRvb2x0aXBDYWxsYmFjazogKGV2LCB1cmksIGxvY2F0aW9uKSA9PiB0aGlzLnRvb2x0aXBDYWxsYmFjayhldiwgdXJpLCBsb2NhdGlvbiksXG4gICAgICBsZWF2ZUNhbGxiYWNrOiAoKSA9PiB0aGlzLmNsb3NlVG9vbHRpcCgpXG4gICAgfSlcbiAgICB0aGlzLnRlcm1pbmFsLmxvYWRBZGRvbih3ZWJMaW5rc0FkZG9uKVxuXG4gICAgdGhpcy5zZWFyY2hBZGRvbiA9IG5ldyBTZWFyY2hBZGRvbigpXG4gICAgdGhpcy50ZXJtaW5hbC5sb2FkQWRkb24odGhpcy5zZWFyY2hBZGRvbilcblxuICAgIHRoaXMudW5pY29kZTExQWRkb24gPSBuZXcgVW5pY29kZTExQWRkb24oKVxuICAgIHRoaXMudGVybWluYWwubG9hZEFkZG9uKHRoaXMudW5pY29kZTExQWRkb24pXG4gICAgdGhpcy50ZXJtaW5hbC5hY3RpdmVWZXJzaW9uID0gJzExJ1xuXG4gICAgdGhpcy5maXRBZGRvbiA9IG5ldyBGaXRBZGRvbigpXG4gICAgdGhpcy50ZXJtaW5hbC5sb2FkQWRkb24odGhpcy5maXRBZGRvbilcblxuICAgIHRoaXMuc2V0VGl0bGUoJ1Rlcm1pbmFsJylcblxuICAgIHRoaXMuY2xhc3NuYW1lID0gJydcblxuICAgIHRoaXMuZW50ZXJoYW5kbGVyID0gKGUpID0+IHtcbiAgICAgIGlmICghdGhpcy50eSAmJiBlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRSZXF1ZXN0ZWQpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0UmVxdWVzdGVkKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiBlXG4gICAgfVxuXG4gICAgdGhpcy50ZXJtaW5hbC5hdHRhY2hDdXN0b21LZXlFdmVudEhhbmRsZXIodGhpcy5lbnRlcmhhbmRsZXIpXG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgVGVybWluYWxFbGVtZW50KClcblxuICAgIHRoaXMuc2VhcmNodWkgPSBuZXcgU2VhcmNoVUkodGhpcy50ZXJtaW5hbCwgdGhpcy5zZWFyY2hBZGRvbilcblxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcylcbiAgICB9KVxuXG4gICAgdGhpcy50ZXJtaW5hbC5vblRpdGxlQ2hhbmdlKCh0KSA9PiB0aGlzLnNldFRpdGxlKHQpKVxuICB9XG5cbiAgc2V0IGNsYXNzIChuYW1lKSB7XG4gICAgdGhpcy5jbGFzc25hbWUgPSBuYW1lXG4gICAgdGhpcy52aWV3LmNsYXNzTmFtZSA9IG5hbWVcbiAgfVxuXG4gIHNob3VsZE9wZW5MaW5rIChldikge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0b29sdGlwQ2FsbGJhY2sgKGV2LCB1cmksIGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjbG9zZVRvb2x0aXAgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgb25EaWRPcGVuTGluayAoZikge1xuICAgIHRoaXMuc2hvdWxkT3BlbkxpbmsgPSBmXG4gIH1cblxuICByZWdpc3RlclRvb2x0aXBIYW5kbGVyIChvcGVuLCBjbG9zZSkge1xuICAgIHRoaXMudG9vbHRpcENhbGxiYWNrID0gKGV2LCB1cmksIGxvY2F0aW9uKSA9PiBvcGVuKGV2LCB1cmksIGxvY2F0aW9uLCB0aGlzLnRlcm1pbmFsKVxuICAgIHRoaXMuY2xvc2VUb29sdGlwID0gY2xvc2VcbiAgfVxuXG4gIGN1cnNvclBvc2l0aW9uICgpIHtcbiAgICB0aGlzLndyaXRlKCdcXHgxYlswbScpXG4gICAgcmV0dXJuIFt0aGlzLnRlcm1pbmFsLmJ1ZmZlci5hY3RpdmUuY3Vyc29yWCwgdGhpcy50ZXJtaW5hbC5idWZmZXIuYWN0aXZlLmN1cnNvclldXG4gIH1cblxuICBzZXRPcHRpb24gKGtleSwgdmFsKSB7XG4gICAgaWYgKCF0aGlzLnBlcnNpc3RlbnRTdGF0ZSkge1xuICAgICAgdGhpcy5wZXJzaXN0ZW50U3RhdGUgPSB7IG9wdHM6IHt9IH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLnBlcnNpc3RlbnRTdGF0ZS5vcHRzKSB7XG4gICAgICB0aGlzLnBlcnNpc3RlbnRTdGF0ZS5vcHRzID0ge31cbiAgICB9XG5cbiAgICBpZiAoa2V5ID09PSAncmVuZGVyZXJUeXBlJyAmJiAhdGhpcy5lbGVtZW50LmluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW5kZXJlclR5cGUnICYmIHZhbCA9PT0gJ3dlYmdsJykge1xuICAgICAgICB0aGlzLnBlcnNpc3RlbnRTdGF0ZS5vcHRzW2tleV0gPSB2YWxcbiAgICAgICAgdmFsID0gJ2NhbnZhcydcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGVyc2lzdGVudFN0YXRlLm9wdHNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgICAgdGhpcy50ZXJtaW5hbC5zZXRPcHRpb24oa2V5LCB2YWwpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHdoaWxlIGFwcGx5aW5nIHNldHRpbmdzIGZvciB0ZXJtaW5hbDonLCB0aGlzLCBlcnIpXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gPFJhdz57dGhpcy52aWV3fTwvUmF3PlxuICB9XG5cbiAgb25BdHRhY2hlZCAoKSB7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcylcbiAgICAvLyBmb3JjZSByZXNpemVcbiAgICBpZiAodGhpcy50eSkgdGhpcy5yZXNpemUoKVxuICB9XG5cbiAgYXR0YWNoQ3VzdG9tS2V5RXZlbnRIYW5kbGVyIChmLCBrZWVwRGVmYXVsdCA9IHRydWUpIHtcbiAgICB0aGlzLnRlcm1pbmFsLmF0dGFjaEN1c3RvbUtleUV2ZW50SGFuZGxlcigoZSkgPT4ge1xuICAgICAgY29uc3QgY3VzdG9tID0gZihlKVxuICAgICAgaWYgKGN1c3RvbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRlcmhhbmRsZXIoZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhdHRhY2ggKHR5LCBjbGVhciA9IGZhbHNlLCBjd2QgPSAnJykge1xuICAgIGlmICghdHkgfHwgISh0eS5vbikgfHwgISh0eS5yZXNpemUpIHx8ICEodHkud3JpdGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyaWVkIGF0dGFjaGluZyBpbnZhbGlkIHB0eS4nKVxuICAgIH1cblxuICAgIGlmIChjd2QpIHtcbiAgICAgIHRoaXMucGVyc2lzdGVudFN0YXRlLmN3ZCA9IGN3ZFxuICAgIH1cblxuICAgIHRoaXMuZGV0YWNoKClcblxuICAgIHRoaXMudHkgPSB0eVxuXG4gICAgdGhpcy5vbkRhdGEgPSB0aGlzLnRlcm1pbmFsLm9uRGF0YShkYXRhID0+IHRoaXMudHkud3JpdGUoZGF0YSkpXG4gICAgdGhpcy50eS5vbignZGF0YScsIGRhdGEgPT4gdGhpcy50ZXJtaW5hbC53cml0ZShkYXRhLnRvU3RyaW5nKCkpKVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLnJlc2l6ZSgpXG4gICAgfVxuXG4gICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyKClcbiAgfVxuXG4gIGRldGFjaCAoa2VlcFR5ID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLm9uRGF0YSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEuZGlzcG9zZSgpXG4gICAgICAgIHRoaXMub25EYXRhID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmIChrZWVwVHkpIHRoaXMudHkuZGVzdHJveSgpXG5cbiAgICAgIHRoaXMudHkgPSB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICBleGVjdXRlICh0ZXh0KSB7XG4gICAgaWYgKHRoaXMudHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIHRvIGF0dGFjaCBhIHB0eSBiZWZvcmUgZXhlY3V0aW5nIGNvZGUuJylcbiAgICB9XG5cbiAgICB0aGlzLnR5LndyaXRlKHRleHQpXG4gIH1cblxuICByZXNpemUgKCkge1xuICAgIGxldCB7Y29scywgcm93c30gPSB0aGlzLmZpdEFkZG9uLnByb3Bvc2VEaW1lbnNpb25zKClcbiAgICAvLyBzbGlnaHRseSBuYXJyb3dlciB0ZXJtaW5hbCBsb29rcyBiZXR0ZXI6XG4gICAgY29scyAtPSAxXG4gICAgaWYgKGNvbHMgPCAxKSBjb2xzID0gMVxuICAgIGlmICh0aGlzLnRlcm1pbmFsICYmICFpc05hTihjb2xzKSAmJiAhaXNOYU4ocm93cykpIHtcbiAgICAgIHRoaXMudGVybWluYWwucmVzaXplKGNvbHMsIHJvd3MpXG4gICAgICBpZiAodGhpcy50eSAmJiB0aGlzLnR5LnJlc2l6ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMudHkucmVzaXplKGNvbHMsIHJvd3MpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIHRoZSBwdHkgY2FuIGFwcGFyZW50bHkgZGllIGJlZm9yZSB0aGUgcmVzaXplIGV2ZW50IGdvZXMgdGhyb3VnaCAoaHR0cHM6Ly9naXRodWIuY29tL0p1bm9MYWIvYXRvbS1qdWxpYS1jbGllbnQvaXNzdWVzLzY4NylcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyIChoaWRlUHJvbXB0ID0gZmFsc2UpIHtcbiAgICB0aGlzLnRlcm1pbmFsLmNsZWFyKClcbiAgICBoaWRlUHJvbXB0ICYmIHRoaXMudGVybWluYWwud3JpdGUoJ1xccicgKyAnICcucmVwZWF0KHRoaXMudGVybWluYWwuY29scyAtIDMpICsgJ1xccicpXG4gIH1cblxuICBjb3B5U2VsZWN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50ZXJtaW5hbC5oYXNTZWxlY3Rpb24oKSkge1xuICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUodGhpcy50ZXJtaW5hbC5nZXRTZWxlY3Rpb24oKSlcbiAgICAgIHRoaXMudGVybWluYWwuY2xlYXJTZWxlY3Rpb24oKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBwYXN0ZSAoYnJhY2tldGVkID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmVlZCB0byBhdHRhY2ggYSBwdHkgYmVmb3JlIHBhc3RpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCBjbGlwID0gYXRvbS5jbGlwYm9hcmQucmVhZCgpXG5cbiAgICBicmFja2V0ZWQgPSBicmFja2V0ZWQgJiYgL1xcbi8udGVzdChjbGlwKVxuXG4gICAgYnJhY2tldGVkICYmIHRoaXMudHkud3JpdGUoJ1xceDFiWzIwMH4nKSAvLyBlbmFibGUgYnJhY2tldGVkIHBhc3RlIG1vZGVcbiAgICB0aGlzLnR5LndyaXRlKGNsaXApXG4gICAgYnJhY2tldGVkICYmIHRoaXMudHkud3JpdGUoJ1xceDFiWzIwMX4nKSAvLyBkaXNhYmxlIGJyYWNrZXRlZCBwYXN0ZSBtb2RlXG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLnRlcm1pbmFsLmZvY3VzKClcbiAgfVxuXG4gIHdyaXRlIChzdHIpIHtcbiAgICB0aGlzLnRlcm1pbmFsLndyaXRlKHN0cilcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiBcInRlcm1pbmFsXCJcbiAgfVxufVxuXG5JbmtUZXJtaW5hbC5yZWdpc3RlclZpZXcoKVxuIl19