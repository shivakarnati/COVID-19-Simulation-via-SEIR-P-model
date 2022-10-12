Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.open = open;
exports.close = close;
exports.finish = finish;
exports.nextline = nextline;
exports.stepexpr = stepexpr;
exports.stepin = stepin;
exports.stop = stop;
exports.continueForward = continueForward;
exports.toselectedline = toselectedline;
exports.debugFile = debugFile;
exports.debugBlock = debugBlock;
exports.clearbps = clearbps;
exports.togglebp = togglebp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @jsx etch.dom */

var _atom = require('atom');

var _ui = require('../ui');

var _connection = require('../connection');

var _connection2 = _interopRequireDefault(_connection);

var _misc = require('../misc');

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

var _workspace = require('./workspace');

var _workspace2 = _interopRequireDefault(_workspace);

'use babel';
var _client$import = _connection.client['import'](['debugfile', 'module']);

var debugfile = _client$import.debugfile;
var getmodule = _client$import.module;

var active = undefined,
    stepper = undefined,
    subs = undefined,
    breakpoints = undefined,
    debuggerPane = undefined,
    ink = undefined;

var buttonSVGs = {
  'step-in': '\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">\n        <line x1="33.33" y1="20" x2="73.33" y2="20" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="33.33" y1="33.33" x2="73.33" y2="33.33" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="53.33" y1="46.67" x2="73.33" y2="46.67" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polyline points="20 13.33 20 53.33 33.11 53.33" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="29.61 65.3 50.33 53.34 29.61 41.37 29.61 65.3" style="fill:var(--color)"/>\n        <line x1="53.33" y1="60" x2="73.33" y2="60" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n    </svg>\n  ',
  'step-out': '\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">\n        <line x1="40" y1="46.67" x2="73.33" y2="46.67" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="40" y1="60" x2="73.33" y2="60" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="53.33" y1="20" x2="73.33" y2="20" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polyline points="46.67 26.67 20 26.67 20 49.45" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="8.03 45.94 20 66.67 31.97 45.94 8.03 45.94" style="fill:var(--color)"/>\n        <line x1="53.33" y1="33.33" x2="73.33" y2="33.33" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n    </svg>\n  ',
  'step-to-selection': '\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">\n        <line x1="40" y1="20" x2="73.33" y2="20" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="40" y1="33.33" x2="73.33" y2="33.33" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="20" y1="13.33" x2="20" y2="49.44" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="8.03 45.94 20 66.67 31.97 45.94 8.03 45.94" style="fill:var(--color)"/>\n        <line x1="40" y1="46.67" x2="73.33" y2="46.67" style="fill:none;stroke:var(--color-highlight);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="20" y1="13.33" x2="20" y2="49.44" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="8.03 45.94 20 66.67 31.97 45.94 8.03 45.94" style="fill:var(--color)"/>\n        <line x1="73.33" y1="60" x2="40" y2="60" style="fill:none;stroke:var(--color-subtle);stroke-miterlimit:10;stroke-width:8px"/>\n    </svg>\n  ',
  'step-line': '\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">\n        <line x1="40" y1="20" x2="73.33" y2="20" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="40" y1="33.33" x2="73.33" y2="33.33" style="fill:none;stroke:var(--color-subtle);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="40" y1="46.67" x2="73.33" y2="46.67" style="fill:none;stroke:var(--color-subtle);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="20" y1="13.33" x2="20" y2="49.44" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="8.03 45.94 20 66.67 31.97 45.94 8.03 45.94" style="fill:var(--color)"/>\n        <line x1="40" y1="60" x2="73.33" y2="60" style="fill:none;stroke:var(--color-subtle);stroke-miterlimit:10;stroke-width:8px"/>\n        <line x1="20" y1="13.33" x2="20" y2="49.44" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="8.03 45.94 20 66.67 31.97 45.94 8.03 45.94" style="fill:var(--color)"/>\n    </svg>\n  ',
  'step-expr': '\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">\n        <path d="M23.08,35.74V40H8.79V17.26H23.08v4.26H13.66v5.06h8.87V30.5H13.66v5.25Z" style="fill:var(--color)"/>\n        <path d="M33.36,34.33h-.18L30.36,40H25.45l4.94-8.54-4.94-8.68h5.34l2.63,5.63h.19l2.63-5.63h5.11l-5,8.53,5,8.7H36.22Z" style="fill:var(--color)"/>\n        <path d="M53.35,22.54a5.62,5.62,0,0,1,4.79,2.34,10.78,10.78,0,0,1,1.73,6.52,10.86,10.86,0,0,1-1.71,6.5,6,6,0,0,1-7.74,1.55,4.77,4.77,0,0,1-1.88-2.22h-.18v8.42H43.67V22.77h4.61v2.9h.18a5.05,5.05,0,0,1,1.93-2.3A5.36,5.36,0,0,1,53.35,22.54Zm-1.66,13.7a2.85,2.85,0,0,0,2.46-1.29,6.09,6.09,0,0,0,.91-3.55,6.14,6.14,0,0,0-.91-3.55,3,3,0,0,0-4.91,0,6.18,6.18,0,0,0-.93,3.54,6.17,6.17,0,0,0,.92,3.54A2.84,2.84,0,0,0,51.69,36.23Z" style="fill:var(--color)"/>\n        <path d="M62.63,40V22.77h4.55v3h.19a4.3,4.3,0,0,1,1.41-2.35,3.82,3.82,0,0,1,2.52-.87,4.63,4.63,0,0,1,1.52.2v4.37A4.77,4.77,0,0,0,71,26.82a3.5,3.5,0,0,0-2.66,1,3.89,3.89,0,0,0-1,2.81V40Z" style="fill:var(--color)"/>\n        <polyline points="6.67 60 33.33 60 56.69 60" style="fill:none;stroke:var(--color);stroke-miterlimit:10;stroke-width:8px"/>\n        <polygon points="53.3 71.57 73.33 60 53.3 48.43 53.3 71.57" style="fill:var(--color)"/>\n    </svg>\n  '
};

function activate(_ink) {
  ink = _ink;
  var buttons = [{ icon: 'playback-fast-forward', tooltip: 'Debug: Continue', command: 'julia-debug:continue', color: 'success' }, { tooltip: 'Debug: Next Line', command: 'julia-debug:step-to-next-line', svg: buttonSVGs['step-line'] }, { tooltip: 'Debug: Step to Selected Line', command: 'julia-debug:step-to-selected-line', svg: buttonSVGs['step-to-selection'] }, { tooltip: 'Debug: Next Expression', command: 'julia-debug:step-to-next-expression', svg: buttonSVGs['step-expr'] }, { tooltip: 'Debug: Step Into', command: 'julia-debug:step-into', svg: buttonSVGs['step-in'] }, { tooltip: 'Debug: Step Out', command: 'julia-debug:step-out', svg: buttonSVGs['step-out'] }, { icon: 'x', tooltip: 'Debug: Stop Debugging', command: 'julia-debug:stop-debugging', color: 'error' }];
  var startButtons = [{ text: 'Run File', tooltip: 'Debug: Run File', command: 'julia-debug:run-file' }, { text: 'Step Through File', tooltip: 'Debug: Step Through File', command: 'julia-debug:step-through-file' }, { text: 'Run Block', tooltip: 'Debug: Run Block', command: 'julia-debug:run-block' }, { text: 'Step Through Block', tooltip: 'Debug: Step Through Block', command: 'julia-debug:step-through-block' }];
  stepper = new ink.Stepper({
    buttons: buttons,
    pending: !atom.config.get('julia-client.uiOptions.openNewEditorWhenDebugging')
  });
  breakpoints = new ink.breakpoints(atom.config.get('julia-client.juliaSyntaxScopes'), {
    toggle: toggleJuliaBP,
    clear: clearJulia,
    toggleUncaught: toggleUncaughtJulia,
    toggleException: toggleExceptionJulia,
    refresh: getBreakpoints,
    addArgs: addArgsJulia,
    toggleActive: toggleActiveJulia,
    toggleAllActive: toggleAllActiveJulia,
    addCondition: addCondition,
    setLevel: setLevel,
    toggleCompiled: toggleCompiled
  });
  debuggerPane = ink.DebuggerPane.fromId('julia-debugger-pane', stepper, breakpoints, buttons, startButtons);

  subs = new _atom.CompositeDisposable();
  subs.add(atom.config.observe('julia-client.uiOptions.layouts.debuggerPane.defaultLocation', function (defaultLocation) {
    debuggerPane.setDefaultLocation(defaultLocation);
  }));
  subs.add(_connection.client.onDetached(function () {
    debugmode(false);
    breakpoints.clear(true);
  }));
}

function deactivate() {
  breakpoints.destroy();
  subs.dispose();
}

function open() {
  return debuggerPane.open({
    split: atom.config.get('julia-client.uiOptions.layouts.debuggerPane.split')
  });
}

function close() {
  return debuggerPane.close();
}

function activeError(ev) {
  if (!active) {
    // Only show an error when toolbar button or command is used directly. `ev.originalEvent` is
    // a `KeyboardEvent` if this was triggered by a keystroke.
    if (ev.originalEvent === undefined) {
      atom.notifications.addError('You need to be debugging to do that.', {
        description: 'You can start debugging by calling `Juno.@enter f(args...)` from the integrated REPL.',
        dismissable: true
      });
    }
    return true;
  }
  return false;
}

function requireDebugging(ev, f) {
  if (activeError(ev)) {
    ev.abortKeyBinding();
  } else {
    f();
  }
}

function requireNotDebugging(f) {
  if (active) {
    atom.notifications.addError('Can\'t start a debugging session while debugging.', {
      description: 'Please finish the current session first.',
      dismissable: true
    });
  } else {
    f();
  }
}

function debugmode(a) {
  active = a;
  if (!active) {
    stepper.destroy();
    _workspace2['default'].update();
    debuggerPane.reset();
  } else {
    debuggerPane.ensureVisible();
  }
}

_connection.client.handle({
  debugmode: debugmode,
  stepto: function stepto(file, line, text, moreinfo) {
    stepper.step(file, line - 1, _ui.views.render(text), moreinfo);
    _workspace2['default'].update();
  },
  working: function working() {
    _connection.client.ipc.loading.working();
  },
  doneWorking: function doneWorking() {
    _connection.client.ipc.loading.done();
  },
  getFileBreakpoints: function getFileBreakpoints() {
    var bps = breakpoints.getFileBreakpoints();
    return bps.filter(function (bp) {
      return bp.isactive;
    }).map(function (bp) {
      return {
        file: bp.file,
        line: bp.line,
        condition: bp.condition
      };
    });
  }
});

function finish(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('finish')();
  });
}

function nextline(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('nextline')();
  });
}

function stepexpr(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('stepexpr')();
  });
}

function stepin(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('stepin')();
  });
}

function stop(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('stop')();
  });
}

function continueForward(ev) {
  requireDebugging(ev, function () {
    return _connection.client['import']('continue')();
  });
}

function toselectedline(ev) {
  requireDebugging(ev, function () {
    var ed = stepper.edForFile(stepper.file);
    if (ed != null) {
      _connection.client['import']('toline')(ed.getCursorBufferPosition().row + 1);
    }
  });
}

function debugFile(shouldStep, el) {
  requireNotDebugging(function () {
    if (el) {
      var _ret = (function () {
        var path = _misc.paths.getPathFromTreeView(el);
        if (!path) {
          atom.notifications.addError('This file has no path.');
          return {
            v: undefined
          };
        }
        try {
          (function () {
            var code = _misc.paths.readCode(path);
            var data = { path: path, code: code, row: 1, column: 1 };
            getmodule(data).then(function (mod) {
              debugfile(_modules2['default'].current(mod), code, path, shouldStep);
            })['catch'](function (err) {
              console.log(err);
            });
          })();
        } catch (err) {
          atom.notifications.addError('Error happened', {
            detail: err,
            dismissable: true
          });
        }
      })();

      if (typeof _ret === 'object') return _ret.v;
    } else {
      var ed = atom.workspace.getActiveTextEditor();
      if (!(ed && ed.getGrammar && ed.getGrammar().id === 'source.julia')) {
        atom.notifications.addError('Can\'t debug current file.', {
          description: 'Please make sure a Julia file is open in the workspace.'
        });
        return;
      }
      var edpath = _connection.client.editorPath(ed) || 'untitled-' + ed.getBuffer().id;
      var mod = _modules2['default'].current() || 'Main';
      debugfile(mod, ed.getText(), edpath, shouldStep);
    }
  });
}

function debugBlock(shouldStep, cell) {
  requireNotDebugging(function () {
    var ed = atom.workspace.getActiveTextEditor();
    if (!ed) {
      atom.notifications.addError('Can\'t debug current code block.', {
        description: 'Please make sure a file is open in the workspace.'
      });
      return;
    }
    var edpath = _connection.client.editorPath(ed) || 'untitled-' + ed.getBuffer().id;
    var mod = _modules2['default'].current() || 'Main';
    var selector = cell ? _misc.cells : _misc.blocks;
    var blks = selector.get(ed);
    if (blks.length === 0) {
      return;
    }
    var _blks$0 = blks[0];
    var range = _blks$0.range;
    var text = _blks$0.text;
    var line = _blks$0.line;

    var _range = _slicedToArray(range, 2);

    var _range$0 = _slicedToArray(_range[0], 1);

    var start = _range$0[0];

    var _range$1 = _slicedToArray(_range[1], 1);

    var end = _range$1[0];

    ink.highlight(ed, start, end);
    debugfile(mod, text, edpath, shouldStep, line);
  });
}

function clearbps() {
  _connection2['default'].boot();
  breakpoints.clear();
  if (_connection.client.isActive()) _connection.client['import']('clearbps')();
}

function toggleJuliaBP(item) {
  _connection2['default'].boot();
  return _connection.client['import']('toggleBP')(item);
}
function clearJulia() {
  _connection2['default'].boot();
  return _connection.client['import']('clearbps')();
}
function toggleUncaughtJulia() {
  _connection2['default'].boot();
  return _connection.client['import']('toggleUncaught')();
}
function toggleExceptionJulia() {
  _connection2['default'].boot();
  return _connection.client['import']('toggleException')();
}
function toggleCompiled() {
  _connection2['default'].boot();
  return _connection.client['import']('toggleCompiled')();
}
function getBreakpoints() {
  _connection2['default'].boot();
  return _connection.client['import']('getBreakpoints')();
}
function addArgsJulia(args) {
  _connection2['default'].boot();
  return _connection.client['import']('addArgs')(args);
}
function toggleAllActiveJulia(args) {
  _connection2['default'].boot();
  return _connection.client['import']('toggleAllActiveBP')(args);
}
function toggleActiveJulia(item) {
  _connection2['default'].boot();
  return _connection.client['import']('toggleActiveBP')(item);
}
function addCondition(item, cond) {
  _connection2['default'].boot();
  return _connection.client['import']('addConditionById')(item, cond);
}
function setLevel(level) {
  _connection2['default'].boot();
  return _connection.client['import']('setStackLevel')(level);
}

function togglebp() {
  var cond = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
  var ed = arguments.length <= 1 || arguments[1] === undefined ? atom.workspace.getActiveTextEditor() : arguments[1];

  if (!ed || !ed.getPath()) {
    atom.notifications.addError('Need a saved file to add a breakpoint');
    return;
  }
  var file = _connection.client.editorPath(ed);
  ed.getCursors().map(function (cursor) {
    var line = cursor.getBufferPosition().row + 1;
    if (cond) {
      breakpoints.toggleConditionAtSourceLocation({
        file: file,
        line: line
      });
    } else {
      breakpoints.toggleAtSourceLocation({
        file: file,
        line: line
      });
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2RlYnVnZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztrQkFDcEIsT0FBTzs7MEJBQ04sZUFBZTs7OztvQkFFRCxTQUFTOzt1QkFDMUIsV0FBVzs7Ozt5QkFFVCxhQUFhOzs7O0FBVm5DLFdBQVcsQ0FBQTtxQkFZOEIsNEJBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQzs7SUFBdkUsU0FBUyxrQkFBVCxTQUFTO0lBQVUsU0FBUyxrQkFBakIsTUFBTTs7QUFFekIsSUFBSSxNQUFNLFlBQUE7SUFBRSxPQUFPLFlBQUE7SUFBRSxJQUFJLFlBQUE7SUFBRSxXQUFXLFlBQUE7SUFBRSxZQUFZLFlBQUE7SUFBRSxHQUFHLFlBQUEsQ0FBQTs7QUFFekQsSUFBTSxVQUFVLEdBQUc7QUFDakIsV0FBUywyMUJBU1I7QUFDRCxZQUFVLGsxQkFTVDtBQUNELHFCQUFtQiw2akNBV2xCO0FBQ0QsYUFBVyxpa0NBV1Y7QUFDRCxhQUFXLHV2Q0FTVjtDQUNGLENBQUE7O0FBRU0sU0FBUyxRQUFRLENBQUUsSUFBSSxFQUFFO0FBQzlCLEtBQUcsR0FBRyxJQUFJLENBQUE7QUFDVixNQUFNLE9BQU8sR0FBRyxDQUNkLEVBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBQyxFQUM5RyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBQyxFQUNyRyxFQUFDLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxPQUFPLEVBQUUsbUNBQW1D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Q0FBQyxDQUFBO0FBQ3BFLFdBQU07R0FDUDtBQUNELE1BQU0sSUFBSSxHQUFHLG1CQUFPLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNsQyxJQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzlCLFFBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7QUFDL0MsUUFBSSxJQUFJLEVBQUU7QUFDUixpQkFBVyxDQUFDLCtCQUErQixDQUFDO0FBQzFDLFlBQUksRUFBRSxJQUFJO0FBQ1YsWUFBSSxFQUFFLElBQUk7T0FDWCxDQUFDLENBQUE7S0FDSCxNQUFNO0FBQ0wsaUJBQVcsQ0FBQyxzQkFBc0IsQ0FBQztBQUNqQyxZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxJQUFJO09BQ1gsQ0FBQyxDQUFBO0tBQ0g7R0FDRixDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvcnVudGltZS9kZWJ1Z2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHZpZXdzIH0gZnJvbSAnLi4vdWknXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uJ1xuaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCB7IGJsb2NrcywgY2VsbHMsIHBhdGhzIH0gZnJvbSAnLi4vbWlzYydcbmltcG9ydCBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcydcblxuaW1wb3J0IHdvcmtzcGFjZSBmcm9tICcuL3dvcmtzcGFjZSdcblxuY29uc3QgeyBkZWJ1Z2ZpbGUsIG1vZHVsZTogZ2V0bW9kdWxlIH0gPSBjbGllbnQuaW1wb3J0KFsnZGVidWdmaWxlJywgJ21vZHVsZSddKVxuXG5sZXQgYWN0aXZlLCBzdGVwcGVyLCBzdWJzLCBicmVha3BvaW50cywgZGVidWdnZXJQYW5lLCBpbmtcblxuY29uc3QgYnV0dG9uU1ZHcyA9IHtcbiAgJ3N0ZXAtaW4nOiBgXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA4MCA4MFwiPlxuICAgICAgICA8bGluZSB4MT1cIjMzLjMzXCIgeTE9XCIyMFwiIHgyPVwiNzMuMzNcIiB5Mj1cIjIwXCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8bGluZSB4MT1cIjMzLjMzXCIgeTE9XCIzMy4zM1wiIHgyPVwiNzMuMzNcIiB5Mj1cIjMzLjMzXCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8bGluZSB4MT1cIjUzLjMzXCIgeTE9XCI0Ni42N1wiIHgyPVwiNzMuMzNcIiB5Mj1cIjQ2LjY3XCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMjAgMTMuMzMgMjAgNTMuMzMgMzMuMTEgNTMuMzNcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjI5LjYxIDY1LjMgNTAuMzMgNTMuMzQgMjkuNjEgNDEuMzcgMjkuNjEgNjUuM1wiIHN0eWxlPVwiZmlsbDp2YXIoLS1jb2xvcilcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiNTMuMzNcIiB5MT1cIjYwXCIgeDI9XCI3My4zM1wiIHkyPVwiNjBcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgPC9zdmc+XG4gIGAsXG4gICdzdGVwLW91dCc6IGBcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDgwIDgwXCI+XG4gICAgICAgIDxsaW5lIHgxPVwiNDBcIiB5MT1cIjQ2LjY3XCIgeDI9XCI3My4zM1wiIHkyPVwiNDYuNjdcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiNDBcIiB5MT1cIjYwXCIgeDI9XCI3My4zM1wiIHkyPVwiNjBcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiNTMuMzNcIiB5MT1cIjIwXCIgeDI9XCI3My4zM1wiIHkyPVwiMjBcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI0Ni42NyAyNi42NyAyMCAyNi42NyAyMCA0OS40NVwiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiOC4wMyA0NS45NCAyMCA2Ni42NyAzMS45NyA0NS45NCA4LjAzIDQ1Ljk0XCIgc3R5bGU9XCJmaWxsOnZhcigtLWNvbG9yKVwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCI1My4zM1wiIHkxPVwiMzMuMzNcIiB4Mj1cIjczLjMzXCIgeTI9XCIzMy4zM1wiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgJ3N0ZXAtdG8tc2VsZWN0aW9uJzogYFxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgODAgODBcIj5cbiAgICAgICAgPGxpbmUgeDE9XCI0MFwiIHkxPVwiMjBcIiB4Mj1cIjczLjMzXCIgeTI9XCIyMFwiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCI0MFwiIHkxPVwiMzMuMzNcIiB4Mj1cIjczLjMzXCIgeTI9XCIzMy4zM1wiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCIyMFwiIHkxPVwiMTMuMzNcIiB4Mj1cIjIwXCIgeTI9XCI0OS40NFwiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiOC4wMyA0NS45NCAyMCA2Ni42NyAzMS45NyA0NS45NCA4LjAzIDQ1Ljk0XCIgc3R5bGU9XCJmaWxsOnZhcigtLWNvbG9yKVwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCI0MFwiIHkxPVwiNDYuNjdcIiB4Mj1cIjczLjMzXCIgeTI9XCI0Ni42N1wiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvci1oaWdobGlnaHQpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiMjBcIiB5MT1cIjEzLjMzXCIgeDI9XCIyMFwiIHkyPVwiNDkuNDRcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3IpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjguMDMgNDUuOTQgMjAgNjYuNjcgMzEuOTcgNDUuOTQgOC4wMyA0NS45NFwiIHN0eWxlPVwiZmlsbDp2YXIoLS1jb2xvcilcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiNzMuMzNcIiB5MT1cIjYwXCIgeDI9XCI0MFwiIHkyPVwiNjBcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3Itc3VidGxlKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgIDwvc3ZnPlxuICBgLFxuICAnc3RlcC1saW5lJzogYFxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgODAgODBcIj5cbiAgICAgICAgPGxpbmUgeDE9XCI0MFwiIHkxPVwiMjBcIiB4Mj1cIjczLjMzXCIgeTI9XCIyMFwiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCI0MFwiIHkxPVwiMzMuMzNcIiB4Mj1cIjczLjMzXCIgeTI9XCIzMy4zM1wiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvci1zdWJ0bGUpO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo4cHhcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiNDBcIiB5MT1cIjQ2LjY3XCIgeDI9XCI3My4zM1wiIHkyPVwiNDYuNjdcIiBzdHlsZT1cImZpbGw6bm9uZTtzdHJva2U6dmFyKC0tY29sb3Itc3VidGxlKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8bGluZSB4MT1cIjIwXCIgeTE9XCIxMy4zM1wiIHgyPVwiMjBcIiB5Mj1cIjQ5LjQ0XCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8cG9seWdvbiBwb2ludHM9XCI4LjAzIDQ1Ljk0IDIwIDY2LjY3IDMxLjk3IDQ1Ljk0IDguMDMgNDUuOTRcIiBzdHlsZT1cImZpbGw6dmFyKC0tY29sb3IpXCIvPlxuICAgICAgICA8bGluZSB4MT1cIjQwXCIgeTE9XCI2MFwiIHgyPVwiNzMuMzNcIiB5Mj1cIjYwXCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yLXN1YnRsZSk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPGxpbmUgeDE9XCIyMFwiIHkxPVwiMTMuMzNcIiB4Mj1cIjIwXCIgeTI9XCI0OS40NFwiIHN0eWxlPVwiZmlsbDpub25lO3N0cm9rZTp2YXIoLS1jb2xvcik7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjhweFwiLz5cbiAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiOC4wMyA0NS45NCAyMCA2Ni42NyAzMS45NyA0NS45NCA4LjAzIDQ1Ljk0XCIgc3R5bGU9XCJmaWxsOnZhcigtLWNvbG9yKVwiLz5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgJ3N0ZXAtZXhwcic6IGBcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDgwIDgwXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjMuMDgsMzUuNzRWNDBIOC43OVYxNy4yNkgyMy4wOHY0LjI2SDEzLjY2djUuMDZoOC44N1YzMC41SDEzLjY2djUuMjVaXCIgc3R5bGU9XCJmaWxsOnZhcigtLWNvbG9yKVwiLz5cbiAgICAgICAgPHBhdGggZD1cIk0zMy4zNiwzNC4zM2gtLjE4TDMwLjM2LDQwSDI1LjQ1bDQuOTQtOC41NC00Ljk0LTguNjhoNS4zNGwyLjYzLDUuNjNoLjE5bDIuNjMtNS42M2g1LjExbC01LDguNTMsNSw4LjdIMzYuMjJaXCIgc3R5bGU9XCJmaWxsOnZhcigtLWNvbG9yKVwiLz5cbiAgICAgICAgPHBhdGggZD1cIk01My4zNSwyMi41NGE1LjYyLDUuNjIsMCwwLDEsNC43OSwyLjM0LDEwLjc4LDEwLjc4LDAsMCwxLDEuNzMsNi41MiwxMC44NiwxMC44NiwwLDAsMS0xLjcxLDYuNSw2LDYsMCwwLDEtNy43NCwxLjU1LDQuNzcsNC43NywwLDAsMS0xLjg4LTIuMjJoLS4xOHY4LjQySDQzLjY3VjIyLjc3aDQuNjF2Mi45aC4xOGE1LjA1LDUuMDUsMCwwLDEsMS45My0yLjNBNS4zNiw1LjM2LDAsMCwxLDUzLjM1LDIyLjU0Wm0tMS42NiwxMy43YTIuODUsMi44NSwwLDAsMCwyLjQ2LTEuMjksNi4wOSw2LjA5LDAsMCwwLC45MS0zLjU1LDYuMTQsNi4xNCwwLDAsMC0uOTEtMy41NSwzLDMsMCwwLDAtNC45MSwwLDYuMTgsNi4xOCwwLDAsMC0uOTMsMy41NCw2LjE3LDYuMTcsMCwwLDAsLjkyLDMuNTRBMi44NCwyLjg0LDAsMCwwLDUxLjY5LDM2LjIzWlwiIHN0eWxlPVwiZmlsbDp2YXIoLS1jb2xvcilcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNNjIuNjMsNDBWMjIuNzdoNC41NXYzaC4xOWE0LjMsNC4zLDAsMCwxLDEuNDEtMi4zNSwzLjgyLDMuODIsMCwwLDEsMi41Mi0uODcsNC42Myw0LjYzLDAsMCwxLDEuNTIuMnY0LjM3QTQuNzcsNC43NywwLDAsMCw3MSwyNi44MmEzLjUsMy41LDAsMCwwLTIuNjYsMSwzLjg5LDMuODksMCwwLDAtMSwyLjgxVjQwWlwiIHN0eWxlPVwiZmlsbDp2YXIoLS1jb2xvcilcIi8+XG4gICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI2LjY3IDYwIDMzLjMzIDYwIDU2LjY5IDYwXCIgc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWNvbG9yKTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6OHB4XCIvPlxuICAgICAgICA8cG9seWdvbiBwb2ludHM9XCI1My4zIDcxLjU3IDczLjMzIDYwIDUzLjMgNDguNDMgNTMuMyA3MS41N1wiIHN0eWxlPVwiZmlsbDp2YXIoLS1jb2xvcilcIi8+XG4gICAgPC9zdmc+XG4gIGBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlIChfaW5rKSB7XG4gIGluayA9IF9pbmtcbiAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICB7aWNvbjogJ3BsYXliYWNrLWZhc3QtZm9yd2FyZCcsIHRvb2x0aXA6ICdEZWJ1ZzogQ29udGludWUnLCBjb21tYW5kOiAnanVsaWEtZGVidWc6Y29udGludWUnLCBjb2xvcjogJ3N1Y2Nlc3MnfSxcbiAgICB7dG9vbHRpcDogJ0RlYnVnOiBOZXh0IExpbmUnLCBjb21tYW5kOiAnanVsaWEtZGVidWc6c3RlcC10by1uZXh0LWxpbmUnLCBzdmc6IGJ1dHRvblNWR3NbJ3N0ZXAtbGluZSddfSxcbiAgICB7dG9vbHRpcDogJ0RlYnVnOiBTdGVwIHRvIFNlbGVjdGVkIExpbmUnLCBjb21tYW5kOiAnanVsaWEtZGVidWc6c3RlcC10by1zZWxlY3RlZC1saW5lJywgc3ZnOiBidXR0b25TVkdzWydzdGVwLXRvLXNlbGVjdGlvbiddfSxcbiAgICB7dG9vbHRpcDogJ0RlYnVnOiBOZXh0IEV4cHJlc3Npb24nLCBjb21tYW5kOiAnanVsaWEtZGVidWc6c3RlcC10by1uZXh0LWV4cHJlc3Npb24nLCBzdmc6IGJ1dHRvblNWR3NbJ3N0ZXAtZXhwciddfSxcbiAgICB7dG9vbHRpcDogJ0RlYnVnOiBTdGVwIEludG8nLCBjb21tYW5kOiAnanVsaWEtZGVidWc6c3RlcC1pbnRvJywgc3ZnOiBidXR0b25TVkdzWydzdGVwLWluJ119LFxuICAgIHt0b29sdGlwOiAnRGVidWc6IFN0ZXAgT3V0JywgY29tbWFuZDogJ2p1bGlhLWRlYnVnOnN0ZXAtb3V0Jywgc3ZnOiBidXR0b25TVkdzWydzdGVwLW91dCddfSxcbiAgICB7aWNvbjogJ3gnLCB0b29sdGlwOiAnRGVidWc6IFN0b3AgRGVidWdnaW5nJywgY29tbWFuZDogJ2p1bGlhLWRlYnVnOnN0b3AtZGVidWdnaW5nJywgY29sb3I6ICdlcnJvcid9LFxuICBdXG4gIGNvbnN0IHN0YXJ0QnV0dG9ucyA9IFtcbiAgICB7dGV4dDogJ1J1biBGaWxlJywgdG9vbHRpcDogJ0RlYnVnOiBSdW4gRmlsZScsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpydW4tZmlsZSd9LFxuICAgIHt0ZXh0OiAnU3RlcCBUaHJvdWdoIEZpbGUnLCB0b29sdGlwOiAnRGVidWc6IFN0ZXAgVGhyb3VnaCBGaWxlJywgY29tbWFuZDogJ2p1bGlhLWRlYnVnOnN0ZXAtdGhyb3VnaC1maWxlJ30sXG4gICAge3RleHQ6ICdSdW4gQmxvY2snLCB0b29sdGlwOiAnRGVidWc6IFJ1biBCbG9jaycsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpydW4tYmxvY2snfSxcbiAgICB7dGV4dDogJ1N0ZXAgVGhyb3VnaCBCbG9jaycsIHRvb2x0aXA6ICdEZWJ1ZzogU3RlcCBUaHJvdWdoIEJsb2NrJywgY29tbWFuZDogJ2p1bGlhLWRlYnVnOnN0ZXAtdGhyb3VnaC1ibG9jayd9LFxuICBdXG4gIHN0ZXBwZXIgPSBuZXcgaW5rLlN0ZXBwZXIoe1xuICAgIGJ1dHRvbnM6IGJ1dHRvbnMsXG4gICAgcGVuZGluZzogIWF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5vcGVuTmV3RWRpdG9yV2hlbkRlYnVnZ2luZycpXG4gIH0pXG4gIGJyZWFrcG9pbnRzID0gbmV3IGluay5icmVha3BvaW50cyhhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYVN5bnRheFNjb3BlcycpLCB7XG4gICAgdG9nZ2xlOiB0b2dnbGVKdWxpYUJQLFxuICAgIGNsZWFyOiBjbGVhckp1bGlhLFxuICAgIHRvZ2dsZVVuY2F1Z2h0OiB0b2dnbGVVbmNhdWdodEp1bGlhLFxuICAgIHRvZ2dsZUV4Y2VwdGlvbjogdG9nZ2xlRXhjZXB0aW9uSnVsaWEsXG4gICAgcmVmcmVzaDogZ2V0QnJlYWtwb2ludHMsXG4gICAgYWRkQXJnczogYWRkQXJnc0p1bGlhLFxuICAgIHRvZ2dsZUFjdGl2ZTogdG9nZ2xlQWN0aXZlSnVsaWEsXG4gICAgdG9nZ2xlQWxsQWN0aXZlOiB0b2dnbGVBbGxBY3RpdmVKdWxpYSxcbiAgICBhZGRDb25kaXRpb246IGFkZENvbmRpdGlvbixcbiAgICBzZXRMZXZlbDogc2V0TGV2ZWwsXG4gICAgdG9nZ2xlQ29tcGlsZWQ6IHRvZ2dsZUNvbXBpbGVkXG4gIH0pXG4gIGRlYnVnZ2VyUGFuZSA9IGluay5EZWJ1Z2dlclBhbmUuZnJvbUlkKCdqdWxpYS1kZWJ1Z2dlci1wYW5lJywgc3RlcHBlciwgYnJlYWtwb2ludHMsIGJ1dHRvbnMsIHN0YXJ0QnV0dG9ucylcblxuICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZGVidWdnZXJQYW5lLmRlZmF1bHRMb2NhdGlvbicsIChkZWZhdWx0TG9jYXRpb24pID0+IHtcbiAgICBkZWJ1Z2dlclBhbmUuc2V0RGVmYXVsdExvY2F0aW9uKGRlZmF1bHRMb2NhdGlvbilcbiAgfSkpXG4gIHN1YnMuYWRkKGNsaWVudC5vbkRldGFjaGVkKCgpID0+IHtcbiAgICBkZWJ1Z21vZGUoZmFsc2UpXG4gICAgYnJlYWtwb2ludHMuY2xlYXIodHJ1ZSlcbiAgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBicmVha3BvaW50cy5kZXN0cm95KClcbiAgc3Vicy5kaXNwb3NlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW4gKCkge1xuICByZXR1cm4gZGVidWdnZXJQYW5lLm9wZW4oe1xuICAgIHNwbGl0OiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5kZWJ1Z2dlclBhbmUuc3BsaXQnKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2UgKCkge1xuICByZXR1cm4gZGVidWdnZXJQYW5lLmNsb3NlKClcbn1cblxuZnVuY3Rpb24gYWN0aXZlRXJyb3IoZXYpIHtcbiAgaWYgKCFhY3RpdmUpIHtcbiAgICAvLyBPbmx5IHNob3cgYW4gZXJyb3Igd2hlbiB0b29sYmFyIGJ1dHRvbiBvciBjb21tYW5kIGlzIHVzZWQgZGlyZWN0bHkuIGBldi5vcmlnaW5hbEV2ZW50YCBpc1xuICAgIC8vIGEgYEtleWJvYXJkRXZlbnRgIGlmIHRoaXMgd2FzIHRyaWdnZXJlZCBieSBhIGtleXN0cm9rZS5cbiAgICBpZiAoZXYub3JpZ2luYWxFdmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1lvdSBuZWVkIHRvIGJlIGRlYnVnZ2luZyB0byBkbyB0aGF0LicsIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdZb3UgY2FuIHN0YXJ0IGRlYnVnZ2luZyBieSBjYWxsaW5nIGBKdW5vLkBlbnRlciBmKGFyZ3MuLi4pYCBmcm9tIHRoZSBpbnRlZ3JhdGVkIFJFUEwuJyxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVEZWJ1Z2dpbmcoZXYsIGYpIHtcbiAgaWYgKGFjdGl2ZUVycm9yKGV2KSkge1xuICAgIGV2LmFib3J0S2V5QmluZGluZygpXG4gIH0gZWxzZSB7XG4gICAgZigpXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVxdWlyZU5vdERlYnVnZ2luZyhmKSB7XG4gIGlmIChhY3RpdmUpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0NhblxcJ3Qgc3RhcnQgYSBkZWJ1Z2dpbmcgc2Vzc2lvbiB3aGlsZSBkZWJ1Z2dpbmcuJywge1xuICAgICAgZGVzY3JpcHRpb246ICdQbGVhc2UgZmluaXNoIHRoZSBjdXJyZW50IHNlc3Npb24gZmlyc3QuJyxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBmKClcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWJ1Z21vZGUoYSkge1xuICBhY3RpdmUgPSBhXG4gIGlmICghYWN0aXZlKSB7XG4gICAgc3RlcHBlci5kZXN0cm95KClcbiAgICB3b3Jrc3BhY2UudXBkYXRlKClcbiAgICBkZWJ1Z2dlclBhbmUucmVzZXQoKVxuICB9IGVsc2Uge1xuICAgIGRlYnVnZ2VyUGFuZS5lbnN1cmVWaXNpYmxlKClcbiAgfVxufVxuXG5jbGllbnQuaGFuZGxlKHtcbiAgZGVidWdtb2RlLFxuICBzdGVwdG8oZmlsZSwgbGluZSwgdGV4dCwgbW9yZWluZm8pIHtcbiAgICBzdGVwcGVyLnN0ZXAoZmlsZSwgbGluZSAtIDEsIHZpZXdzLnJlbmRlcih0ZXh0KSwgbW9yZWluZm8pXG4gICAgd29ya3NwYWNlLnVwZGF0ZSgpXG4gIH0sXG4gIHdvcmtpbmcoKSB7IGNsaWVudC5pcGMubG9hZGluZy53b3JraW5nKCkgfSxcbiAgZG9uZVdvcmtpbmcoKSB7IGNsaWVudC5pcGMubG9hZGluZy5kb25lKCkgfSxcbiAgZ2V0RmlsZUJyZWFrcG9pbnRzKCkge1xuICAgIGNvbnN0IGJwcyA9IGJyZWFrcG9pbnRzLmdldEZpbGVCcmVha3BvaW50cygpXG4gICAgcmV0dXJuIGJwcy5maWx0ZXIoYnAgPT4gYnAuaXNhY3RpdmUpLm1hcChicCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmaWxlOiBicC5maWxlLFxuICAgICAgICBsaW5lOiBicC5saW5lLFxuICAgICAgICBjb25kaXRpb246IGJwLmNvbmRpdGlvblxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5pc2ggKGV2KSAgIHsgcmVxdWlyZURlYnVnZ2luZyhldiwgKCkgPT4gY2xpZW50LmltcG9ydCgnZmluaXNoJykoKSkgfVxuZXhwb3J0IGZ1bmN0aW9uIG5leHRsaW5lIChldikgeyByZXF1aXJlRGVidWdnaW5nKGV2LCAoKSA9PiBjbGllbnQuaW1wb3J0KCduZXh0bGluZScpKCkpIH1cbmV4cG9ydCBmdW5jdGlvbiBzdGVwZXhwciAoZXYpIHsgcmVxdWlyZURlYnVnZ2luZyhldiwgKCkgPT4gY2xpZW50LmltcG9ydCgnc3RlcGV4cHInKSgpKSB9XG5leHBvcnQgZnVuY3Rpb24gc3RlcGluIChldikgICB7IHJlcXVpcmVEZWJ1Z2dpbmcoZXYsICgpID0+IGNsaWVudC5pbXBvcnQoJ3N0ZXBpbicpKCkpIH1cbmV4cG9ydCBmdW5jdGlvbiBzdG9wIChldikgICAgIHsgcmVxdWlyZURlYnVnZ2luZyhldiwgKCkgPT4gY2xpZW50LmltcG9ydCgnc3RvcCcpKCkpIH1cbmV4cG9ydCBmdW5jdGlvbiBjb250aW51ZUZvcndhcmQgKGV2KSB7IHJlcXVpcmVEZWJ1Z2dpbmcoZXYsICgpID0+IGNsaWVudC5pbXBvcnQoJ2NvbnRpbnVlJykoKSkgfVxuZXhwb3J0IGZ1bmN0aW9uIHRvc2VsZWN0ZWRsaW5lIChldikge1xuICByZXF1aXJlRGVidWdnaW5nKGV2LCAoKSA9PiB7XG4gICAgY29uc3QgZWQgPSBzdGVwcGVyLmVkRm9yRmlsZShzdGVwcGVyLmZpbGUpXG4gICAgaWYgKGVkICE9IG51bGwpIHtcbiAgICAgIGNsaWVudC5pbXBvcnQoJ3RvbGluZScpKGVkLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1Z0ZpbGUoc2hvdWxkU3RlcCwgZWwpIHtcbiAgcmVxdWlyZU5vdERlYnVnZ2luZygoKSA9PiB7XG4gICAgaWYgKGVsKSB7XG4gICAgICBjb25zdCBwYXRoID0gcGF0aHMuZ2V0UGF0aEZyb21UcmVlVmlldyhlbClcbiAgICAgIGlmICghcGF0aCkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1RoaXMgZmlsZSBoYXMgbm8gcGF0aC4nKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBwYXRocy5yZWFkQ29kZShwYXRoKVxuICAgICAgICBjb25zdCBkYXRhID0geyBwYXRoLCBjb2RlLCByb3c6IDEsIGNvbHVtbjogMSB9XG4gICAgICAgIGdldG1vZHVsZShkYXRhKS50aGVuKG1vZCA9PiB7XG4gICAgICAgICAgZGVidWdmaWxlKG1vZHVsZXMuY3VycmVudChtb2QpLCBjb2RlLCBwYXRoLCBzaG91bGRTdGVwKVxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgfSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIGhhcHBlbmVkJywge1xuICAgICAgICAgIGRldGFpbDogZXJyLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVkID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIShlZCAmJiBlZC5nZXRHcmFtbWFyICYmIGVkLmdldEdyYW1tYXIoKS5pZCA9PT0gJ3NvdXJjZS5qdWxpYScpKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQ2FuXFwndCBkZWJ1ZyBjdXJyZW50IGZpbGUuJywge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGxlYXNlIG1ha2Ugc3VyZSBhIEp1bGlhIGZpbGUgaXMgb3BlbiBpbiB0aGUgd29ya3NwYWNlLidcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBlZHBhdGggPSBjbGllbnQuZWRpdG9yUGF0aChlZCkgfHwgJ3VudGl0bGVkLScgKyBlZC5nZXRCdWZmZXIoKS5pZFxuICAgICAgY29uc3QgbW9kID0gbW9kdWxlcy5jdXJyZW50KCkgfHwgJ01haW4nXG4gICAgICBkZWJ1Z2ZpbGUobW9kLCBlZC5nZXRUZXh0KCksIGVkcGF0aCwgc2hvdWxkU3RlcClcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1Z0Jsb2NrKHNob3VsZFN0ZXAsIGNlbGwpIHtcbiAgcmVxdWlyZU5vdERlYnVnZ2luZygoKSA9PiB7XG4gICAgY29uc3QgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0NhblxcJ3QgZGVidWcgY3VycmVudCBjb2RlIGJsb2NrLicsIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdQbGVhc2UgbWFrZSBzdXJlIGEgZmlsZSBpcyBvcGVuIGluIHRoZSB3b3Jrc3BhY2UuJ1xuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBlZHBhdGggPSBjbGllbnQuZWRpdG9yUGF0aChlZCkgfHwgJ3VudGl0bGVkLScgKyBlZC5nZXRCdWZmZXIoKS5pZFxuICAgIGNvbnN0IG1vZCA9IG1vZHVsZXMuY3VycmVudCgpIHx8ICdNYWluJ1xuICAgIGNvbnN0IHNlbGVjdG9yID0gY2VsbCA/IGNlbGxzIDogYmxvY2tzXG4gICAgY29uc3QgYmxrcyA9IHNlbGVjdG9yLmdldChlZClcbiAgICBpZiAoYmxrcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IHJhbmdlLCB0ZXh0LCBsaW5lIH0gPSBibGtzWzBdXG4gICAgY29uc3QgW1tzdGFydF0sIFtlbmRdXSA9IHJhbmdlXG4gICAgaW5rLmhpZ2hsaWdodChlZCwgc3RhcnQsIGVuZClcbiAgICBkZWJ1Z2ZpbGUobW9kLCB0ZXh0LCBlZHBhdGgsIHNob3VsZFN0ZXAsIGxpbmUpXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhcmJwcygpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgYnJlYWtwb2ludHMuY2xlYXIoKVxuICBpZiAoY2xpZW50LmlzQWN0aXZlKCkpIGNsaWVudC5pbXBvcnQoJ2NsZWFyYnBzJykoKVxufVxuXG5mdW5jdGlvbiB0b2dnbGVKdWxpYUJQIChpdGVtKSB7XG4gIGNvbm5lY3Rpb24uYm9vdCgpXG4gIHJldHVybiBjbGllbnQuaW1wb3J0KCd0b2dnbGVCUCcpKGl0ZW0pXG59XG5mdW5jdGlvbiBjbGVhckp1bGlhICgpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ2NsZWFyYnBzJykoKVxufVxuZnVuY3Rpb24gdG9nZ2xlVW5jYXVnaHRKdWxpYSAoKSB7XG4gIGNvbm5lY3Rpb24uYm9vdCgpXG4gIHJldHVybiBjbGllbnQuaW1wb3J0KCd0b2dnbGVVbmNhdWdodCcpKClcbn1cbmZ1bmN0aW9uIHRvZ2dsZUV4Y2VwdGlvbkp1bGlhICgpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ3RvZ2dsZUV4Y2VwdGlvbicpKClcbn1cbmZ1bmN0aW9uIHRvZ2dsZUNvbXBpbGVkICgpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ3RvZ2dsZUNvbXBpbGVkJykoKVxufVxuZnVuY3Rpb24gZ2V0QnJlYWtwb2ludHMgKCkge1xuICBjb25uZWN0aW9uLmJvb3QoKVxuICByZXR1cm4gY2xpZW50LmltcG9ydCgnZ2V0QnJlYWtwb2ludHMnKSgpXG59XG5mdW5jdGlvbiBhZGRBcmdzSnVsaWEgKGFyZ3MpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ2FkZEFyZ3MnKShhcmdzKVxufVxuZnVuY3Rpb24gdG9nZ2xlQWxsQWN0aXZlSnVsaWEgKGFyZ3MpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ3RvZ2dsZUFsbEFjdGl2ZUJQJykoYXJncylcbn1cbmZ1bmN0aW9uIHRvZ2dsZUFjdGl2ZUp1bGlhIChpdGVtKSB7XG4gIGNvbm5lY3Rpb24uYm9vdCgpXG4gIHJldHVybiBjbGllbnQuaW1wb3J0KCd0b2dnbGVBY3RpdmVCUCcpKGl0ZW0pXG59XG5mdW5jdGlvbiBhZGRDb25kaXRpb24gKGl0ZW0sIGNvbmQpIHtcbiAgY29ubmVjdGlvbi5ib290KClcbiAgcmV0dXJuIGNsaWVudC5pbXBvcnQoJ2FkZENvbmRpdGlvbkJ5SWQnKShpdGVtLCBjb25kKVxufVxuZnVuY3Rpb24gc2V0TGV2ZWwgKGxldmVsKSB7XG4gIGNvbm5lY3Rpb24uYm9vdCgpXG4gIHJldHVybiBjbGllbnQuaW1wb3J0KCdzZXRTdGFja0xldmVsJykobGV2ZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVicCAoXG4gIGNvbmQgPSBmYWxzZSxcbiAgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbikge1xuICBpZiAoIWVkIHx8ICFlZC5nZXRQYXRoKCkpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ05lZWQgYSBzYXZlZCBmaWxlIHRvIGFkZCBhIGJyZWFrcG9pbnQnKVxuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGZpbGUgPSBjbGllbnQuZWRpdG9yUGF0aChlZClcbiAgZWQuZ2V0Q3Vyc29ycygpLm1hcCgoY3Vyc29yKSA9PiB7XG4gICAgY29uc3QgbGluZSA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLnJvdyArIDFcbiAgICBpZiAoY29uZCkge1xuICAgICAgYnJlYWtwb2ludHMudG9nZ2xlQ29uZGl0aW9uQXRTb3VyY2VMb2NhdGlvbih7XG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGxpbmU6IGxpbmVcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrcG9pbnRzLnRvZ2dsZUF0U291cmNlTG9jYXRpb24oe1xuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBsaW5lOiBsaW5lXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cbiJdfQ==