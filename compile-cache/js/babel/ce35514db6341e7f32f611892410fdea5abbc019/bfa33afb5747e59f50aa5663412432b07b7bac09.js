Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.open = open;
exports.close = close;
exports.deactivate = deactivate;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _connection = require('../connection');

var _connectionProcessBasic = require('../connection/process/basic');

var _atom = require('atom');

var _misc = require('../misc');

var _evaluation = require('./evaluation');

var _evaluation2 = _interopRequireDefault(_evaluation);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _nodePtyPrebuiltMultiarch = require('node-pty-prebuilt-multiarch');

var pty = _interopRequireWildcard(_nodePtyPrebuiltMultiarch);

var _underscorePlus = require('underscore-plus');

var _ui = require('../ui');

var _connectionProcessRemote = require('../connection/process/remote');

var _ssh2 = require('ssh2');

var ssh = _interopRequireWildcard(_ssh2);

'use babel';

var _client$import = _connection.client['import']({ msg: ['changeprompt', 'changemodule'], rpc: ['fullpath'] });

var changeprompt = _client$import.changeprompt;
var changemodule = _client$import.changemodule;
var fullpath = _client$import.fullpath;

var isWindows = process.platform === 'win32';
var uriRegex = isWindows ? /(@ ([^\s]+)\s(.*?)\:(\d+)|((([a-zA-Z]:|\.\.?|\~)|([^\0<>\?\|\/\s!$`&*()\[\]+'":;])+)?((\\|\/)([^\0<>\?\|\/\n\r!$`&*()\[\]+'":;])+)+(\.|\\|\/)[^\0<>\?\|\/\s!$`&*()\[\]+'":;]+)(\:\d+)?)/ : /(@ ([^\s]+)\s(.*?)\:(\d+)|(((\.\.?|\~)|([^\0\s!$`&*()\[\]+'":;\\])+)?(\/([^\0\n\r!$`&*()\[\]+'":;\\])+)+(\.|\/)[^\0\s!$`&*()\[\]+'":;\\]+)(\:\d+)?)/;

var whitelistedKeybindingsREPL = [];
var whitelistedKeybindingsTerminal = [];
var ink = undefined;
var subs = undefined;

var terminal;

exports.terminal = terminal;

function activate(_ink) {
  ink = _ink;
  subs = new _atom.CompositeDisposable();

  process.env['TERM'] = 'xterm-256color';

  subs.add(atom.config.observe('julia-client.consoleOptions.whitelistedKeybindingsREPL', function (kbds) {
    whitelistedKeybindingsREPL = kbds.map(function (s) {
      return s.toLowerCase();
    });
  }), atom.config.observe('julia-client.consoleOptions.whitelistedKeybindingsTerminal', function (kbds) {
    whitelistedKeybindingsTerminal = kbds.map(function (s) {
      return s.toLowerCase();
    });
  }), atom.config.observe('julia-client.consoleOptions.cursorStyle', updateTerminalSettings), atom.config.observe('julia-client.consoleOptions.maximumConsoleSize', updateTerminalSettings), atom.config.observe('julia-client.consoleOptions.macOptionIsMeta', updateTerminalSettings), atom.config.observe('julia-client.consoleOptions.terminalRendererType', updateTerminalSettings), atom.config.observe('julia-client.consoleOptions.cursorBlink', updateTerminalSettings));

  exports.terminal = terminal = ink.InkTerminal.fromId('julia-terminal', terminalOptions());
  terminal.setTitle('REPL', true);
  terminal.onDidOpenLink(hasKeyboardModifier);
  terminal.registerTooltipHandler(showTooltip, hideTooltip);
  terminal['class'] = 'julia-terminal';

  subs.add(atom.config.observe('julia-client.uiOptions.layouts.console.defaultLocation', function (defaultLocation) {
    terminal.setDefaultLocation(defaultLocation);
  }));

  terminal.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r');
  terminal.startRequested = function () {
    _connection.client.boot();
  };

  terminal.attachCustomKeyEventHandler(function (e) {
    return handleKeybinding(e, terminal, whitelistedKeybindingsREPL);
  });

  _modules2['default'].onDidChange((0, _underscorePlus.debounce)(function () {
    return changemodule({ mod: _modules2['default'].current() });
  }, 200));

  _connection.client.handle({
    clearconsole: function clearconsole() {
      return terminal.clear();
    },
    cursorpos: function cursorpos() {
      return terminal.cursorPosition();
    },
    writeToTerminal: function writeToTerminal(str) {
      if (terminal.ty) {
        terminal.ty.write(str);
        return true;
      }
      return false;
    }
  });

  var promptObserver = undefined;
  _connection.client.onBoot(function (proc) {
    terminal.attach(proc.ty);

    if (proc.config) {
      terminal.setTitle('REPL @ ' + proc.config.name, true);
    } else {
      terminal.setTitle('REPL', true);
    }

    if (proc.flush) {
      proc.flush(function (d) {
        return terminal.write(d);
      }, function (d) {
        return terminal.write(d);
      });
    }

    promptObserver = atom.config.observe('julia-client.consoleOptions.prompt', function (prompt) {
      changeprompt(prompt + ' ');
    });

    addLinkHandler(terminal.terminal);
  });

  _connection.client.onDetached(function () {
    terminal.setTitle('REPL', true);
    terminal.detach();
    // make sure to switch to the normal termbuffer, otherwise there might be
    // issues when leaving an xterm session:
    terminal.write('\x1b[?1049h');
    terminal.write('\x1b[?1049l');
    // disable mouse event capturing in case it was left enabled
    terminal.write('\x1b[?1003h');
    terminal.write('\x1b[?1003l');
    // reset focus events
    terminal.write('\x1b[?1004h');
    terminal.write('\x1b[?1004l');
    terminal.write('\n\r\x1b[1m\r\x1b[31mJulia has exited.\n\r\x1b[32mPress Enter to start a new session.\x1b[0m\n\r');
    if (promptObserver) promptObserver.dispose();
  });

  subs.add(
  // repl commands
  atom.commands.add('atom-workspace', {
    'julia-client:open-REPL': function juliaClientOpenREPL() {
      open().then(function () {
        return terminal.show();
      });
    },
    'julia-client:clear-REPL': function juliaClientClearREPL() {
      terminal.clear();
    }
  }), atom.commands.add('.julia-terminal', {
    'julia-client:copy-or-interrupt': function juliaClientCopyOrInterrupt() {
      if (!terminal.copySelection()) {
        atom.commands.dispatch(terminal.view, 'julia-client:interrupt-julia');
      }
    }
  }),
  // terminal commands
  atom.commands.add('atom-workspace', {
    'julia-client:new-terminal': function juliaClientNewTerminal() {
      newTerminal();
    },
    'julia-client:new-terminal-from-current-folder': function juliaClientNewTerminalFromCurrentFolder(ev) {
      var dir = _evaluation2['default'].currentDir(ev.target);
      if (!dir) return;
      newTerminal(dir);
    },
    'julia-client:new-remote-terminal': function juliaClientNewRemoteTerminal() {
      newRemoteTerminal();
    }
  }));

  // handle deserialized terminals
  forEachPane(function (item) {
    if (!item.ty) {
      item.attachCustomKeyEventHandler(function (e) {
        return handleKeybinding(e, item);
      });
      addLinkHandler(item.terminal);
      item.onDidOpenLink(hasKeyboardModifier);
      item.registerTooltipHandler(showTooltip, hideTooltip);
      shellPty(item.persistentState.cwd).then(function (_ref) {
        var pty = _ref.pty;
        var cwd = _ref.cwd;
        return item.attach(pty, true, cwd);
      })['catch'](function () {});
    }
  }, /terminal\-julia\-\d+/);
  forEachPane(function (item) {
    return item.close();
  }, /terminal\-remote\-julia\-\d+/);
}

function open() {
  return terminal.open({
    split: atom.config.get('julia-client.uiOptions.layouts.console.split')
  });
}

function close() {
  return terminal.close();
}

function newTerminal(cwd) {
  var term = ink.InkTerminal.fromId('terminal-julia-' + Math.floor(Math.random() * 10000000), terminalOptions());
  term.attachCustomKeyEventHandler(function (e) {
    return handleKeybinding(e, term);
  });
  term.onDidOpenLink(hasKeyboardModifier);
  term.registerTooltipHandler(showTooltip, hideTooltip);
  addLinkHandler(term.terminal);
  shellPty(cwd).then(function (_ref2) {
    var pty = _ref2.pty;
    var cwd = _ref2.cwd;

    term.attach(pty, true, cwd);
    term.setDefaultLocation(atom.config.get('julia-client.uiOptions.layouts.terminal.defaultLocation'));
    term.open({
      split: atom.config.get('julia-client.uiOptions.layouts.terminal.split')
    }).then(function () {
      return term.show();
    })['catch'](function (err) {
      console.log(err);
    });
  })['catch'](function () {});
}

function newRemoteTerminal() {
  var term = ink.InkTerminal.fromId('terminal-remote-julia-' + Math.floor(Math.random() * 10000000), terminalOptions());
  term.attachCustomKeyEventHandler(function (e) {
    return handleKeybinding(e, term);
  });
  term.onDidOpenLink(hasKeyboardModifier);
  term.registerTooltipHandler(showTooltip, hideTooltip);
  addLinkHandler(term.terminal);
  remotePty().then(function (_ref3) {
    var pty = _ref3.pty;
    var cwd = _ref3.cwd;
    var conf = _ref3.conf;

    term.attach(pty, true, cwd);
    term.setTitle('Terminal @ ' + conf.name);
    term.setDefaultLocation(atom.config.get('julia-client.uiOptions.layouts.terminal.defaultLocation'));
    term.open({
      split: atom.config.get('julia-client.uiOptions.layouts.terminal.split')
    }).then(function () {
      return term.show();
    });
    pty.on('close', function () {
      return term.detach();
    });
  })['catch'](function (e) {
    return console.error(e);
  });
}

function terminalOptions() {
  var opts = {
    scrollback: atom.config.get('julia-client.consoleOptions.maximumConsoleSize'),
    cursorStyle: atom.config.get('julia-client.consoleOptions.cursorStyle'),
    rendererType: atom.config.get('julia-client.consoleOptions.terminalRendererType'),
    cursorBlink: atom.config.get('julia-client.consoleOptions.cursorBlink')
  };
  if (process.platform === 'darwin') {
    opts.macOptionIsMeta = atom.config.get('julia-client.consoleOptions.macOptionIsMeta');
  }
  return opts;
}

function updateTerminalSettings() {
  var settings = terminalOptions();
  forEachPane(function (item) {
    for (var key in settings) {
      item.setOption(key, settings[key]);
    }
  }, /terminal\-julia\-\d+|julia\-terminal|terminal\-remote\-julia\-\d+/);
}

function forEachPane(f) {
  var id = arguments.length <= 1 || arguments[1] === undefined ? /terminal\-julia\-\d+/ : arguments[1];

  atom.workspace.getPaneItems().forEach(function (item) {
    if (item.id && item.name === 'InkTerminal' && item.id.match(id)) {
      f(item);
    }
  });
}

function hasKeyboardModifier(event) {
  if (atom.config.get('julia-client.consoleOptions.linkModifier')) {
    return process.platform == 'darwin' ? event.metaKey : event.ctrlKey;
  }
  return true;
}

function handleLink(event, uri) {
  if (!hasKeyboardModifier(event)) return false;

  if (_connection.client.isActive()) {
    fullpath(uri).then(function (_ref4) {
      var _ref42 = _slicedToArray(_ref4, 2);

      var path = _ref42[0];
      var line = _ref42[1];

      ink.Opener.open(path, line - 1, {
        pending: atom.config.get('core.allowPendingPaneItems')
      });
    });
  } else {
    var urimatch = uri.match(/@ ([^\s]+)\s(.*?)\:(\d+)/);
    if (urimatch) {
      ink.Opener.open(urimatch[1], parseInt(urimatch[2]) - 1, {
        pending: atom.config.get('core.allowPendingPaneItems')
      });
    } else {
      var matchregex = isWindows ? /(([a-zA-Z]\:)?[^\:]+)(?:\:(\d+))?/ : /([^\:]+)(?:\:(\d+))?/;
      urimatch = uri.match(matchregex);
      if (urimatch) {
        var line = urimatch[2] !== null ? parseInt(urimatch[2]) : 0;
        ink.Opener.open(urimatch[1], line - 1, {
          pending: atom.config.get('core.allowPendingPaneItems')
        });
      }
    }
  }
}

function addLinkHandler(terminal) {
  terminal.registerLinkMatcher(uriRegex, handleLink, {
    willLinkActivate: function willLinkActivate(ev) {
      return hasKeyboardModifier(ev);
    },
    tooltipCallback: function tooltipCallback(ev, uri, location) {
      return showTooltip(ev, uri, location, terminal);
    },
    leaveCallback: function leaveCallback() {
      return hideTooltip();
    }
  });
}

var tooltip = null;

function showTooltip(event, uri, location, terminal) {
  hideTooltip();

  if (atom.config.get('julia-client.consoleOptions.linkModifier')) {
    var el = document.createElement('div');
    el.classList.add('terminal-link-tooltip');

    var terminalRect = terminal.element.getBoundingClientRect();
    var colWidth = terminalRect.width / terminal.cols;
    var rowHeight = terminalRect.height / terminal.rows;

    var leftPosition = location.start.x * colWidth + terminalRect.left;
    var topPosition = (location.start.y - 1.5) * rowHeight + terminalRect.top;

    el.style.top = topPosition + 'px';
    el.style.left = leftPosition + 'px';

    el.innerText = (process.platform == 'darwin' ? 'Cmd' : 'Ctrl') + '-Click to open link.';

    tooltip = el;
    document.body.appendChild(el);

    return true;
  } else {
    return false;
  }
}

function hideTooltip() {
  if (tooltip) {
    try {
      document.body.removeChild(tooltip);
    } catch (err) {} finally {
      tooltip = null;
    }
  }
}

function handleKeybinding(e, term) {
  var binds = arguments.length <= 2 || arguments[2] === undefined ? whitelistedKeybindingsTerminal : arguments[2];

  if (process.platform !== 'win32' && e.keyCode === 13 && (e.altKey || e.metaKey) && e.type === 'keydown') {
    // Meta-Enter doesn't work properly with xterm.js atm, so we send the right escape sequence ourselves:
    if (term.ty) {
      term.ty.write('\x1b\x0d');
    }
    return false;
  } else if (binds.indexOf(atom.keymaps.keystrokeForKeyboardEvent(e)) > -1) {
    // let certain user defined key events fall through to Atom's handler
    return false;
  }
  return e;
}

function remotePty() {
  return (0, _connectionProcessRemote.withRemoteConfig)(function (conf) {
    return new Promise(function (resolve, reject) {
      var conn = new ssh.Client();
      conn.on('ready', function () {
        conn.shell({ term: "xterm-256color" }, function (err, stream) {
          if (err) console.error('Error while starting remote shell.');

          stream.on('close', function () {
            conn.end();
          });

          // forward resize handling
          stream.resize = function (cols, rows) {
            return stream.setWindow(rows, cols, 999, 999);
          };

          resolve({ pty: stream, cwd: '~', conf: conf });
        });
      }).connect(conf);
    });
  });
}

function shellPty(cwd) {
  process.env['TERM'] = 'xterm-256color';
  return new Promise(function (resolve, reject) {
    var pr = undefined;
    if (cwd) {
      pr = new Promise(function (resolve) {
        return resolve(cwd);
      });
    } else {
      // show project paths
      pr = _ui.selector.show(atom.project.getPaths(), {
        emptyMessage: 'Enter a custom path above.',
        allowCustom: true
      });
    }
    pr.then(function (cwd) {
      if (cwd) {
        cwd = _misc.paths.expandHome(cwd);
        if (!require('fs').existsSync(cwd)) {
          atom.notifications.addWarning("Path does not exist.", {
            description: "Defaulting to `HOME` for new terminal's working directory."
          });
          cwd = _misc.paths.home();
        }
        var env = (0, _connectionProcessBasic.customEnv)();
        var ty = pty.spawn(atom.config.get("julia-client.consoleOptions.shell"), [], {
          cols: 100,
          rows: 30,
          cwd: cwd,
          env: env,
          useConpty: true,
          handleFlowControl: true
        });
        resolve({
          pty: ty,
          cwd: cwd });
      } else {
        reject();
      }
    });
  });
}

function deactivate() {
  // detach node-pty process from ink terminals; necessary for updates to work cleanly
  forEachPane(function (item) {
    return item.detach();
  }, /terminal\-julia\-\d+/);
  // remote terminals shouldn't be serialized
  forEachPane(function (item) {
    item.detach();
    item.close();
  }, /terminal\-remote\-julia\-\d+/);
  if (terminal) terminal.detach();
  if (subs) subs.dispose();
  subs = null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2NvbnNvbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzBCQUV1QixlQUFlOztzQ0FDWiw2QkFBNkI7O29CQUNuQixNQUFNOztvQkFDcEIsU0FBUzs7MEJBQ1IsY0FBYzs7Ozt1QkFDakIsV0FBVzs7Ozt3Q0FDViw2QkFBNkI7O0lBQXRDLEdBQUc7OzhCQUNVLGlCQUFpQjs7a0JBQ2pCLE9BQU87O3VDQUNDLDhCQUE4Qjs7b0JBQzFDLE1BQU07O0lBQWYsR0FBRzs7QUFaZixXQUFXLENBQUE7O3FCQWVULDRCQUFhLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQzs7SUFEckUsWUFBWSxrQkFBWixZQUFZO0lBQUUsWUFBWSxrQkFBWixZQUFZO0lBQUUsUUFBUSxrQkFBUixRQUFROztBQUc1QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQTtBQUM5QyxJQUFNLFFBQVEsR0FBRyxTQUFTLEdBQ3hCLHlMQUF5TCxHQUN6TCxxSkFBcUosQ0FBQTs7QUFFdkosSUFBSSwwQkFBMEIsR0FBRyxFQUFFLENBQUE7QUFDbkMsSUFBSSw4QkFBOEIsR0FBRyxFQUFFLENBQUE7QUFDdkMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFBO0FBQ25CLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQTs7QUFFYixJQUFJLFFBQVEsQ0FBQTs7OztBQUVaLFNBQVMsUUFBUSxDQUFFLElBQUksRUFBRTtBQUM5QixLQUFHLEdBQUcsSUFBSSxDQUFBO0FBQ1YsTUFBSSxHQUFHLCtCQUF5QixDQUFBOztBQUVoQyxTQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFH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QUFDLEtBQUssRUFBRSxDQUFBO0dBQ2IsRUFBRSw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2xDLE1BQUksUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUMvQixNQUFJLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDeEIsTUFBSSxHQUFHLElBQUksQ0FBQTtDQUNaIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2NvbnNvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uJ1xuaW1wb3J0IHsgY3VzdG9tRW52IH0gZnJvbSAnLi4vY29ubmVjdGlvbi9wcm9jZXNzL2Jhc2ljJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBwYXRocyB9IGZyb20gJy4uL21pc2MnXG5pbXBvcnQgZXZhbHVhdGlvbiBmcm9tICcuL2V2YWx1YXRpb24nXG5pbXBvcnQgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnXG5pbXBvcnQgKiBhcyBwdHkgZnJvbSAnbm9kZS1wdHktcHJlYnVpbHQtbXVsdGlhcmNoJ1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgeyBzZWxlY3RvciB9IGZyb20gJy4uL3VpJ1xuaW1wb3J0IHsgd2l0aFJlbW90ZUNvbmZpZyB9IGZyb20gJy4uL2Nvbm5lY3Rpb24vcHJvY2Vzcy9yZW1vdGUnXG5pbXBvcnQgKiBhcyBzc2ggZnJvbSAnc3NoMidcblxuY29uc3QgeyBjaGFuZ2Vwcm9tcHQsIGNoYW5nZW1vZHVsZSwgZnVsbHBhdGggfSA9XG4gIGNsaWVudC5pbXBvcnQoeyBtc2c6IFsnY2hhbmdlcHJvbXB0JywgJ2NoYW5nZW1vZHVsZSddLCBycGM6IFsnZnVsbHBhdGgnXSB9KVxuXG5jb25zdCBpc1dpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInXG5jb25zdCB1cmlSZWdleCA9IGlzV2luZG93cyA/XG4gIC8oQCAoW15cXHNdKylcXHMoLio/KVxcOihcXGQrKXwoKChbYS16QS1aXTp8XFwuXFwuP3xcXH4pfChbXlxcMDw+XFw/XFx8XFwvXFxzISRgJiooKVxcW1xcXSsnXCI6O10pKyk/KChcXFxcfFxcLykoW15cXDA8PlxcP1xcfFxcL1xcblxcciEkYCYqKClcXFtcXF0rJ1wiOjtdKSspKyhcXC58XFxcXHxcXC8pW15cXDA8PlxcP1xcfFxcL1xccyEkYCYqKClcXFtcXF0rJ1wiOjtdKykoXFw6XFxkKyk/KS8gOlxuICAvKEAgKFteXFxzXSspXFxzKC4qPylcXDooXFxkKyl8KCgoXFwuXFwuP3xcXH4pfChbXlxcMFxccyEkYCYqKClcXFtcXF0rJ1wiOjtcXFxcXSkrKT8oXFwvKFteXFwwXFxuXFxyISRgJiooKVxcW1xcXSsnXCI6O1xcXFxdKSspKyhcXC58XFwvKVteXFwwXFxzISRgJiooKVxcW1xcXSsnXCI6O1xcXFxdKykoXFw6XFxkKyk/KS9cblxudmFyIHdoaXRlbGlzdGVkS2V5YmluZGluZ3NSRVBMID0gW11cbnZhciB3aGl0ZWxpc3RlZEtleWJpbmRpbmdzVGVybWluYWwgPSBbXVxudmFyIGluayA9IHVuZGVmaW5lZFxubGV0IHN1YnMgPSB1bmRlZmluZWRcblxuZXhwb3J0IHZhciB0ZXJtaW5hbFxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKF9pbmspIHtcbiAgaW5rID0gX2lua1xuICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIHByb2Nlc3MuZW52WydURVJNJ10gPSAneHRlcm0tMjU2Y29sb3InXG5cbiAgc3Vicy5hZGQoXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLndoaXRlbGlzdGVkS2V5YmluZGluZ3NSRVBMJywgKGtiZHMpID0+IHtcbiAgICAgIHdoaXRlbGlzdGVkS2V5YmluZGluZ3NSRVBMID0ga2Jkcy5tYXAocyA9PiBzLnRvTG93ZXJDYXNlKCkpXG4gICAgfSksXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLndoaXRlbGlzdGVkS2V5YmluZGluZ3NUZXJtaW5hbCcsIChrYmRzKSA9PiB7XG4gICAgICB3aGl0ZWxpc3RlZEtleWJpbmRpbmdzVGVybWluYWwgPSBrYmRzLm1hcChzID0+IHMudG9Mb3dlckNhc2UoKSlcbiAgICB9KSxcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQuY29uc29sZU9wdGlvbnMuY3Vyc29yU3R5bGUnLCB1cGRhdGVUZXJtaW5hbFNldHRpbmdzKSxcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQuY29uc29sZU9wdGlvbnMubWF4aW11bUNvbnNvbGVTaXplJywgdXBkYXRlVGVybWluYWxTZXR0aW5ncyksXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLm1hY09wdGlvbklzTWV0YScsIHVwZGF0ZVRlcm1pbmFsU2V0dGluZ3MpLFxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy50ZXJtaW5hbFJlbmRlcmVyVHlwZScsIHVwZGF0ZVRlcm1pbmFsU2V0dGluZ3MpLFxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5jdXJzb3JCbGluaycsIHVwZGF0ZVRlcm1pbmFsU2V0dGluZ3MpXG4gIClcblxuICB0ZXJtaW5hbCA9IGluay5JbmtUZXJtaW5hbC5mcm9tSWQoJ2p1bGlhLXRlcm1pbmFsJywgdGVybWluYWxPcHRpb25zKCkpXG4gIHRlcm1pbmFsLnNldFRpdGxlKCdSRVBMJywgdHJ1ZSlcbiAgdGVybWluYWwub25EaWRPcGVuTGluayhoYXNLZXlib2FyZE1vZGlmaWVyKVxuICB0ZXJtaW5hbC5yZWdpc3RlclRvb2x0aXBIYW5kbGVyKHNob3dUb29sdGlwLCBoaWRlVG9vbHRpcClcbiAgdGVybWluYWwuY2xhc3MgPSAnanVsaWEtdGVybWluYWwnXG5cbiAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLmNvbnNvbGUuZGVmYXVsdExvY2F0aW9uJywgKGRlZmF1bHRMb2NhdGlvbikgPT4ge1xuICAgIHRlcm1pbmFsLnNldERlZmF1bHRMb2NhdGlvbihkZWZhdWx0TG9jYXRpb24pXG4gIH0pKVxuXG4gIHRlcm1pbmFsLndyaXRlKCdcXHgxYlsxbVxceDFiWzMybVByZXNzIEVudGVyIHRvIHN0YXJ0IEp1bGlhLiBcXHgxYlswbVxcblxccicpXG4gIHRlcm1pbmFsLnN0YXJ0UmVxdWVzdGVkID0gKCkgPT4ge1xuICAgIGNsaWVudC5ib290KClcbiAgfVxuXG4gIHRlcm1pbmFsLmF0dGFjaEN1c3RvbUtleUV2ZW50SGFuZGxlcigoZSkgPT4gaGFuZGxlS2V5YmluZGluZyhlLCB0ZXJtaW5hbCwgd2hpdGVsaXN0ZWRLZXliaW5kaW5nc1JFUEwpKVxuXG4gIG1vZHVsZXMub25EaWRDaGFuZ2UoZGVib3VuY2UoKCkgPT4gY2hhbmdlbW9kdWxlKHttb2Q6IG1vZHVsZXMuY3VycmVudCgpfSksIDIwMCkpXG5cbiAgY2xpZW50LmhhbmRsZSh7XG4gICAgY2xlYXJjb25zb2xlOiAoKSA9PiB0ZXJtaW5hbC5jbGVhcigpLFxuICAgIGN1cnNvcnBvczogKCkgPT4gdGVybWluYWwuY3Vyc29yUG9zaXRpb24oKSxcbiAgICB3cml0ZVRvVGVybWluYWw6IChzdHIpID0+IHtcbiAgICAgIGlmICh0ZXJtaW5hbC50eSkge1xuICAgICAgICB0ZXJtaW5hbC50eS53cml0ZShzdHIpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgbGV0IHByb21wdE9ic2VydmVyXG4gIGNsaWVudC5vbkJvb3QoKHByb2MpID0+IHtcbiAgICB0ZXJtaW5hbC5hdHRhY2gocHJvYy50eSlcblxuICAgIGlmIChwcm9jLmNvbmZpZykge1xuICAgICAgdGVybWluYWwuc2V0VGl0bGUoJ1JFUEwgQCAnK3Byb2MuY29uZmlnLm5hbWUsIHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRlcm1pbmFsLnNldFRpdGxlKCdSRVBMJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBpZiAocHJvYy5mbHVzaCkge1xuICAgICAgcHJvYy5mbHVzaCgoZCkgPT4gdGVybWluYWwud3JpdGUoZCksIChkKSA9PiB0ZXJtaW5hbC53cml0ZShkKSlcbiAgICB9XG5cbiAgICBwcm9tcHRPYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5wcm9tcHQnLCAocHJvbXB0KSA9PiB7XG4gICAgICBjaGFuZ2Vwcm9tcHQocHJvbXB0ICsgJyAnKVxuICAgIH0pXG5cbiAgICBhZGRMaW5rSGFuZGxlcih0ZXJtaW5hbC50ZXJtaW5hbClcbiAgfSlcblxuICBjbGllbnQub25EZXRhY2hlZCgoKSA9PiB7XG4gICAgdGVybWluYWwuc2V0VGl0bGUoJ1JFUEwnLCB0cnVlKVxuICAgIHRlcm1pbmFsLmRldGFjaCgpXG4gICAgLy8gbWFrZSBzdXJlIHRvIHN3aXRjaCB0byB0aGUgbm9ybWFsIHRlcm1idWZmZXIsIG90aGVyd2lzZSB0aGVyZSBtaWdodCBiZVxuICAgIC8vIGlzc3VlcyB3aGVuIGxlYXZpbmcgYW4geHRlcm0gc2Vzc2lvbjpcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwNDloJylcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwNDlsJylcbiAgICAvLyBkaXNhYmxlIG1vdXNlIGV2ZW50IGNhcHR1cmluZyBpbiBjYXNlIGl0IHdhcyBsZWZ0IGVuYWJsZWRcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwMDNoJylcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwMDNsJylcbiAgICAvLyByZXNldCBmb2N1cyBldmVudHNcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwMDRoJylcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFx4MWJbPzEwMDRsJylcbiAgICB0ZXJtaW5hbC53cml0ZSgnXFxuXFxyXFx4MWJbMW1cXHJcXHgxYlszMW1KdWxpYSBoYXMgZXhpdGVkLlxcblxcclxceDFiWzMybVByZXNzIEVudGVyIHRvIHN0YXJ0IGEgbmV3IHNlc3Npb24uXFx4MWJbMG1cXG5cXHInKVxuICAgIGlmIChwcm9tcHRPYnNlcnZlcikgcHJvbXB0T2JzZXJ2ZXIuZGlzcG9zZSgpXG4gIH0pXG5cbiAgc3Vicy5hZGQoXG4gICAgLy8gcmVwbCBjb21tYW5kc1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdqdWxpYS1jbGllbnQ6b3Blbi1SRVBMJzogKCkgPT4ge1xuICAgICAgICBvcGVuKCkudGhlbigoKSA9PiB0ZXJtaW5hbC5zaG93KCkpXG4gICAgICB9LFxuICAgICAgJ2p1bGlhLWNsaWVudDpjbGVhci1SRVBMJzogKCkgPT4ge1xuICAgICAgICB0ZXJtaW5hbC5jbGVhcigpXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCcuanVsaWEtdGVybWluYWwnLCB7XG4gICAgICAnanVsaWEtY2xpZW50OmNvcHktb3ItaW50ZXJydXB0JzogKCkgPT4ge1xuICAgICAgICBpZiAoIXRlcm1pbmFsLmNvcHlTZWxlY3Rpb24oKSkge1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGVybWluYWwudmlldywgJ2p1bGlhLWNsaWVudDppbnRlcnJ1cHQtanVsaWEnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSksXG4gICAgLy8gdGVybWluYWwgY29tbWFuZHNcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnanVsaWEtY2xpZW50Om5ldy10ZXJtaW5hbCc6ICgpID0+IHtcbiAgICAgICAgbmV3VGVybWluYWwoKVxuICAgICAgfSxcbiAgICAgICdqdWxpYS1jbGllbnQ6bmV3LXRlcm1pbmFsLWZyb20tY3VycmVudC1mb2xkZXInOiBldiA9PiB7XG4gICAgICAgIGNvbnN0IGRpciA9IGV2YWx1YXRpb24uY3VycmVudERpcihldi50YXJnZXQpXG4gICAgICAgIGlmICghZGlyKSByZXR1cm5cbiAgICAgICAgbmV3VGVybWluYWwoZGlyKVxuICAgICAgfSxcbiAgICAgICdqdWxpYS1jbGllbnQ6bmV3LXJlbW90ZS10ZXJtaW5hbCc6ICgpID0+IHtcbiAgICAgICAgbmV3UmVtb3RlVGVybWluYWwoKVxuICAgICAgfVxuICAgIH0pXG4gIClcblxuICAvLyBoYW5kbGUgZGVzZXJpYWxpemVkIHRlcm1pbmFsc1xuICBmb3JFYWNoUGFuZShpdGVtID0+IHtcbiAgICBpZiAoIWl0ZW0udHkpIHtcbiAgICAgIGl0ZW0uYXR0YWNoQ3VzdG9tS2V5RXZlbnRIYW5kbGVyKChlKSA9PiBoYW5kbGVLZXliaW5kaW5nKGUsIGl0ZW0pKVxuICAgICAgYWRkTGlua0hhbmRsZXIoaXRlbS50ZXJtaW5hbClcbiAgICAgIGl0ZW0ub25EaWRPcGVuTGluayhoYXNLZXlib2FyZE1vZGlmaWVyKVxuICAgICAgaXRlbS5yZWdpc3RlclRvb2x0aXBIYW5kbGVyKHNob3dUb29sdGlwLCBoaWRlVG9vbHRpcClcbiAgICAgIHNoZWxsUHR5KGl0ZW0ucGVyc2lzdGVudFN0YXRlLmN3ZClcbiAgICAgICAgLnRoZW4oKHtwdHksIGN3ZH0pID0+IGl0ZW0uYXR0YWNoKHB0eSwgdHJ1ZSwgY3dkKSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHt9KVxuICAgIH1cbiAgfSwgL3Rlcm1pbmFsXFwtanVsaWFcXC1cXGQrLylcbiAgZm9yRWFjaFBhbmUoaXRlbSA9PiBpdGVtLmNsb3NlKCksIC90ZXJtaW5hbFxcLXJlbW90ZVxcLWp1bGlhXFwtXFxkKy8pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuICgpIHtcbiAgcmV0dXJuIHRlcm1pbmFsLm9wZW4oe1xuICAgIHNwbGl0OiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5jb25zb2xlLnNwbGl0JylcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlICgpIHtcbiAgcmV0dXJuIHRlcm1pbmFsLmNsb3NlKClcbn1cblxuZnVuY3Rpb24gbmV3VGVybWluYWwgKGN3ZCkge1xuICBjb25zdCB0ZXJtID0gaW5rLklua1Rlcm1pbmFsLmZyb21JZChgdGVybWluYWwtanVsaWEtJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwMDAwMDApfWAsIHRlcm1pbmFsT3B0aW9ucygpKVxuICB0ZXJtLmF0dGFjaEN1c3RvbUtleUV2ZW50SGFuZGxlcigoZSkgPT4gaGFuZGxlS2V5YmluZGluZyhlLCB0ZXJtKSlcbiAgdGVybS5vbkRpZE9wZW5MaW5rKGhhc0tleWJvYXJkTW9kaWZpZXIpXG4gIHRlcm0ucmVnaXN0ZXJUb29sdGlwSGFuZGxlcihzaG93VG9vbHRpcCwgaGlkZVRvb2x0aXApXG4gIGFkZExpbmtIYW5kbGVyKHRlcm0udGVybWluYWwpXG4gIHNoZWxsUHR5KGN3ZCkudGhlbigoe3B0eSwgY3dkfSkgPT4ge1xuICAgIHRlcm0uYXR0YWNoKHB0eSwgdHJ1ZSwgY3dkKVxuICAgIHRlcm0uc2V0RGVmYXVsdExvY2F0aW9uKGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLnRlcm1pbmFsLmRlZmF1bHRMb2NhdGlvbicpKVxuICAgIHRlcm0ub3Blbih7XG4gICAgICBzcGxpdDogYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMudGVybWluYWwuc3BsaXQnKVxuICAgIH0pLnRoZW4oKCkgPT4gdGVybS5zaG93KCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSlcbiAgfSkuY2F0Y2goKCkgPT4ge30pXG59XG5cbmZ1bmN0aW9uIG5ld1JlbW90ZVRlcm1pbmFsICgpIHtcbiAgY29uc3QgdGVybSA9IGluay5JbmtUZXJtaW5hbC5mcm9tSWQoYHRlcm1pbmFsLXJlbW90ZS1qdWxpYS0ke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDAwMDAwMCl9YCwgdGVybWluYWxPcHRpb25zKCkpXG4gIHRlcm0uYXR0YWNoQ3VzdG9tS2V5RXZlbnRIYW5kbGVyKChlKSA9PiBoYW5kbGVLZXliaW5kaW5nKGUsIHRlcm0pKVxuICB0ZXJtLm9uRGlkT3BlbkxpbmsoaGFzS2V5Ym9hcmRNb2RpZmllcilcbiAgdGVybS5yZWdpc3RlclRvb2x0aXBIYW5kbGVyKHNob3dUb29sdGlwLCBoaWRlVG9vbHRpcClcbiAgYWRkTGlua0hhbmRsZXIodGVybS50ZXJtaW5hbClcbiAgcmVtb3RlUHR5KCkudGhlbigoe3B0eSwgY3dkLCBjb25mfSkgPT4ge1xuICAgIHRlcm0uYXR0YWNoKHB0eSwgdHJ1ZSwgY3dkKVxuICAgIHRlcm0uc2V0VGl0bGUoYFRlcm1pbmFsIEAgJHtjb25mLm5hbWV9YClcbiAgICB0ZXJtLnNldERlZmF1bHRMb2NhdGlvbihhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy50ZXJtaW5hbC5kZWZhdWx0TG9jYXRpb24nKSlcbiAgICB0ZXJtLm9wZW4oe1xuICAgICAgc3BsaXQ6IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLnRlcm1pbmFsLnNwbGl0JylcbiAgICB9KS50aGVuKCgpID0+IHRlcm0uc2hvdygpKVxuICAgIHB0eS5vbignY2xvc2UnLCAoKSA9PiB0ZXJtLmRldGFjaCgpKVxuICB9KS5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihlKSlcbn1cblxuZnVuY3Rpb24gdGVybWluYWxPcHRpb25zICgpIHtcbiAgY29uc3Qgb3B0cyA9IHtcbiAgICBzY3JvbGxiYWNrOiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5tYXhpbXVtQ29uc29sZVNpemUnKSxcbiAgICBjdXJzb3JTdHlsZTogYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuY29uc29sZU9wdGlvbnMuY3Vyc29yU3R5bGUnKSxcbiAgICByZW5kZXJlclR5cGU6IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLnRlcm1pbmFsUmVuZGVyZXJUeXBlJyksXG4gICAgY3Vyc29yQmxpbms6IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLmN1cnNvckJsaW5rJylcbiAgfVxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICBvcHRzLm1hY09wdGlvbklzTWV0YSA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLm1hY09wdGlvbklzTWV0YScpXG4gIH1cbiAgcmV0dXJuIG9wdHNcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGVybWluYWxTZXR0aW5ncyAoKSB7XG4gIGNvbnN0IHNldHRpbmdzID0gdGVybWluYWxPcHRpb25zKClcbiAgZm9yRWFjaFBhbmUoKGl0ZW0pID0+IHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzZXR0aW5ncykge1xuICAgICAgaXRlbS5zZXRPcHRpb24oa2V5LCBzZXR0aW5nc1trZXldKVxuICAgIH1cbiAgfSwgL3Rlcm1pbmFsXFwtanVsaWFcXC1cXGQrfGp1bGlhXFwtdGVybWluYWx8dGVybWluYWxcXC1yZW1vdGVcXC1qdWxpYVxcLVxcZCsvKVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoUGFuZSAoZiwgaWQgPSAvdGVybWluYWxcXC1qdWxpYVxcLVxcZCsvKSB7XG4gIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbS5pZCAmJiBpdGVtLm5hbWUgPT09ICdJbmtUZXJtaW5hbCcgJiYgaXRlbS5pZC5tYXRjaChpZCkpIHtcbiAgICAgIGYoaXRlbSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGhhc0tleWJvYXJkTW9kaWZpZXIgKGV2ZW50KSB7XG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5saW5rTW9kaWZpZXInKSkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09ICdkYXJ3aW4nID8gZXZlbnQubWV0YUtleSA6IGV2ZW50LmN0cmxLZXlcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBoYW5kbGVMaW5rIChldmVudCwgdXJpKSB7XG4gIGlmICghaGFzS2V5Ym9hcmRNb2RpZmllcihldmVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChjbGllbnQuaXNBY3RpdmUoKSkge1xuICAgIGZ1bGxwYXRoKHVyaSkudGhlbigoW3BhdGgsIGxpbmVdKSA9PiB7XG4gICAgICBpbmsuT3BlbmVyLm9wZW4ocGF0aCwgbGluZSAtIDEsIHtcbiAgICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpXG4gICAgICB9KVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgbGV0IHVyaW1hdGNoID0gdXJpLm1hdGNoKC9AIChbXlxcc10rKVxccyguKj8pXFw6KFxcZCspLylcbiAgICBpZiAodXJpbWF0Y2gpIHtcbiAgICAgIGluay5PcGVuZXIub3Blbih1cmltYXRjaFsxXSwgcGFyc2VJbnQodXJpbWF0Y2hbMl0pIC0gMSwge1xuICAgICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJylcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hdGNocmVnZXggPSBpc1dpbmRvd3MgP1xuICAgICAgICAvKChbYS16QS1aXVxcOik/W15cXDpdKykoPzpcXDooXFxkKykpPy8gOlxuICAgICAgICAvKFteXFw6XSspKD86XFw6KFxcZCspKT8vXG4gICAgICB1cmltYXRjaCA9IHVyaS5tYXRjaChtYXRjaHJlZ2V4KVxuICAgICAgaWYgKHVyaW1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSB1cmltYXRjaFsyXSAhPT0gbnVsbCA/IHBhcnNlSW50KHVyaW1hdGNoWzJdKSA6IDBcbiAgICAgICAgaW5rLk9wZW5lci5vcGVuKHVyaW1hdGNoWzFdLCBsaW5lIC0gMSwge1xuICAgICAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRMaW5rSGFuZGxlciAodGVybWluYWwpIHtcbiAgdGVybWluYWwucmVnaXN0ZXJMaW5rTWF0Y2hlcih1cmlSZWdleCwgaGFuZGxlTGluaywge1xuICAgIHdpbGxMaW5rQWN0aXZhdGU6IGV2ID0+IGhhc0tleWJvYXJkTW9kaWZpZXIoZXYpLFxuICAgIHRvb2x0aXBDYWxsYmFjazogKGV2LCB1cmksIGxvY2F0aW9uKSA9PiBzaG93VG9vbHRpcChldiwgdXJpLCBsb2NhdGlvbiwgdGVybWluYWwpLFxuICAgIGxlYXZlQ2FsbGJhY2s6ICgpID0+IGhpZGVUb29sdGlwKClcbiAgfSlcbn1cblxubGV0IHRvb2x0aXAgPSBudWxsXG5cbmZ1bmN0aW9uIHNob3dUb29sdGlwIChldmVudCwgdXJpLCBsb2NhdGlvbiwgdGVybWluYWwpIHtcbiAgaGlkZVRvb2x0aXAoKVxuXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5saW5rTW9kaWZpZXInKSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCd0ZXJtaW5hbC1saW5rLXRvb2x0aXAnKVxuXG4gICAgY29uc3QgdGVybWluYWxSZWN0ID0gdGVybWluYWwuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGNvbFdpZHRoID0gdGVybWluYWxSZWN0LndpZHRoIC8gdGVybWluYWwuY29sc1xuICAgIGNvbnN0IHJvd0hlaWdodCA9IHRlcm1pbmFsUmVjdC5oZWlnaHQgLyB0ZXJtaW5hbC5yb3dzXG5cbiAgICBjb25zdCBsZWZ0UG9zaXRpb24gPSBsb2NhdGlvbi5zdGFydC54ICogY29sV2lkdGggKyB0ZXJtaW5hbFJlY3QubGVmdFxuICAgIGNvbnN0IHRvcFBvc2l0aW9uID0gKGxvY2F0aW9uLnN0YXJ0LnkgLSAxLjUpICogcm93SGVpZ2h0ICsgdGVybWluYWxSZWN0LnRvcFxuXG4gICAgZWwuc3R5bGUudG9wID0gdG9wUG9zaXRpb24gKyAncHgnXG4gICAgZWwuc3R5bGUubGVmdCA9IGxlZnRQb3NpdGlvbiArICdweCdcblxuICAgIGVsLmlubmVyVGV4dCA9IChwcm9jZXNzLnBsYXRmb3JtID09ICdkYXJ3aW4nID8gJ0NtZCcgOiAnQ3RybCcpICsgJy1DbGljayB0byBvcGVuIGxpbmsuJ1xuXG4gICAgdG9vbHRpcCA9IGVsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbClcblxuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gaGlkZVRvb2x0aXAgKCkge1xuICBpZiAodG9vbHRpcCkge1xuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXApXG4gICAgfSBjYXRjaCAoZXJyKSB7XG5cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdG9vbHRpcCA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5YmluZGluZyAoZSwgdGVybSwgYmluZHMgPSB3aGl0ZWxpc3RlZEtleWJpbmRpbmdzVGVybWluYWwpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicgJiYgZS5rZXlDb2RlID09PSAxMyAmJiAoZS5hbHRLZXkgfHwgZS5tZXRhS2V5KSAmJiBlLnR5cGUgPT09ICdrZXlkb3duJykge1xuICAgIC8vIE1ldGEtRW50ZXIgZG9lc24ndCB3b3JrIHByb3Blcmx5IHdpdGggeHRlcm0uanMgYXRtLCBzbyB3ZSBzZW5kIHRoZSByaWdodCBlc2NhcGUgc2VxdWVuY2Ugb3Vyc2VsdmVzOlxuICAgIGlmICh0ZXJtLnR5KSB7XG4gICAgICB0ZXJtLnR5LndyaXRlKCdcXHgxYlxceDBkJylcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSBpZiAoYmluZHMuaW5kZXhPZihhdG9tLmtleW1hcHMua2V5c3Ryb2tlRm9yS2V5Ym9hcmRFdmVudChlKSkgPiAtMSkge1xuICAgIC8vIGxldCBjZXJ0YWluIHVzZXIgZGVmaW5lZCBrZXkgZXZlbnRzIGZhbGwgdGhyb3VnaCB0byBBdG9tJ3MgaGFuZGxlclxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBlXG59XG5cbmZ1bmN0aW9uIHJlbW90ZVB0eSAoKSB7XG4gIHJldHVybiB3aXRoUmVtb3RlQ29uZmlnKGNvbmYgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjb25uID0gbmV3IHNzaC5DbGllbnQoKVxuICAgICAgY29ubi5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICAgIGNvbm4uc2hlbGwoeyB0ZXJtOiBcInh0ZXJtLTI1NmNvbG9yXCIgfSwgKGVyciwgc3RyZWFtKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihgRXJyb3Igd2hpbGUgc3RhcnRpbmcgcmVtb3RlIHNoZWxsLmApXG5cbiAgICAgICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICAgICAgY29ubi5lbmQoKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAvLyBmb3J3YXJkIHJlc2l6ZSBoYW5kbGluZ1xuICAgICAgICAgIHN0cmVhbS5yZXNpemUgPSAoY29scywgcm93cykgPT4gc3RyZWFtLnNldFdpbmRvdyhyb3dzLCBjb2xzLCA5OTksIDk5OSlcblxuICAgICAgICAgIHJlc29sdmUoe3B0eTogc3RyZWFtLCBjd2Q6ICd+JywgY29uZjogY29uZn0pXG4gICAgICAgIH0pXG4gICAgICB9KS5jb25uZWN0KGNvbmYpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gc2hlbGxQdHkgKGN3ZCkge1xuICBwcm9jZXNzLmVudlsnVEVSTSddID0gJ3h0ZXJtLTI1NmNvbG9yJ1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBwclxuICAgIGlmIChjd2QpIHtcbiAgICAgIHByID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHJlc29sdmUoY3dkKSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2hvdyBwcm9qZWN0IHBhdGhzXG4gICAgICBwciA9IHNlbGVjdG9yLnNob3coYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIHtcbiAgICAgICAgZW1wdHlNZXNzYWdlOiAnRW50ZXIgYSBjdXN0b20gcGF0aCBhYm92ZS4nLFxuICAgICAgICBhbGxvd0N1c3RvbTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gICAgcHIudGhlbigoY3dkKSA9PiB7XG4gICAgICBpZiAoY3dkKSB7XG4gICAgICAgIGN3ZCA9IHBhdGhzLmV4cGFuZEhvbWUoY3dkKVxuICAgICAgICBpZiAoIXJlcXVpcmUoJ2ZzJykuZXhpc3RzU3luYyhjd2QpKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJQYXRoIGRvZXMgbm90IGV4aXN0LlwiLCB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEZWZhdWx0aW5nIHRvIGBIT01FYCBmb3IgbmV3IHRlcm1pbmFsJ3Mgd29ya2luZyBkaXJlY3RvcnkuXCJcbiAgICAgICAgICB9KVxuICAgICAgICAgIGN3ZCA9IHBhdGhzLmhvbWUoKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVudiA9IGN1c3RvbUVudigpXG4gICAgICAgIGNvbnN0IHR5ID0gcHR5LnNwYXduKGF0b20uY29uZmlnLmdldChcImp1bGlhLWNsaWVudC5jb25zb2xlT3B0aW9ucy5zaGVsbFwiKSwgW10sIHtcbiAgICAgICAgICBjb2xzOiAxMDAsXG4gICAgICAgICAgcm93czogMzAsXG4gICAgICAgICAgY3dkOiBjd2QsXG4gICAgICAgICAgZW52OiBlbnYsXG4gICAgICAgICAgdXNlQ29ucHR5OiB0cnVlLFxuICAgICAgICAgIGhhbmRsZUZsb3dDb250cm9sOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHB0eTogdHksXG4gICAgICAgICAgY3dkOiBjd2R9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIC8vIGRldGFjaCBub2RlLXB0eSBwcm9jZXNzIGZyb20gaW5rIHRlcm1pbmFsczsgbmVjZXNzYXJ5IGZvciB1cGRhdGVzIHRvIHdvcmsgY2xlYW5seVxuICBmb3JFYWNoUGFuZShpdGVtID0+IGl0ZW0uZGV0YWNoKCksIC90ZXJtaW5hbFxcLWp1bGlhXFwtXFxkKy8pXG4gIC8vIHJlbW90ZSB0ZXJtaW5hbHMgc2hvdWxkbid0IGJlIHNlcmlhbGl6ZWRcbiAgZm9yRWFjaFBhbmUoaXRlbSA9PiB7XG4gICAgaXRlbS5kZXRhY2goKVxuICAgIGl0ZW0uY2xvc2UoKVxuICB9LCAvdGVybWluYWxcXC1yZW1vdGVcXC1qdWxpYVxcLVxcZCsvKVxuICBpZiAodGVybWluYWwpIHRlcm1pbmFsLmRldGFjaCgpXG4gIGlmIChzdWJzKSBzdWJzLmRpc3Bvc2UoKVxuICBzdWJzID0gbnVsbFxufVxuIl19