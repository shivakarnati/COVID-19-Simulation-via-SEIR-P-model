Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _atom = require('atom');

var _utilBasicModal = require('../util/basic-modal');

var _utilEtch = require('../util/etch');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

'use babel';

function editorsForFile(file) {
  return atom.workspace.getTextEditors().filter(function (ed) {
    return ed.getPath() === file;
  });
}

var BreakpointView = (function (_Etch) {
  _inherits(BreakpointView, _Etch);

  function BreakpointView() {
    _classCallCheck(this, BreakpointView);

    _get(Object.getPrototypeOf(BreakpointView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BreakpointView, [{
    key: 'render',
    value: function render() {
      var status = this.props.breakpoint.isactive ? "active" : "inactive";
      status += this.props.breakpoint.condition ? " conditional" : "";
      return _etch2['default'].dom('span', { className: 'ink-bp icon icon-primitive-dot ' + status });
    }
  }]);

  return BreakpointView;
})(_utilEtch.Etch);

var Breakpoint = (function () {
  function Breakpoint(_ref) {
    var file = _ref.file;
    var line = _ref.line;
    var condition = _ref.condition;
    var isactive = _ref.isactive;
    var description = _ref.description;
    var typ = _ref.typ;
    var id = _ref.id;

    _classCallCheck(this, Breakpoint);

    this.file = file || '';
    this.line = line || '';
    this.description = description || '';
    this.condition = condition || '';
    this.isactive = isactive;
    this.typ = typ || 'source';
    this.id = id;
    this.views = [];
  }

  _createClass(Breakpoint, [{
    key: 'updateLine',
    value: function updateLine(line) {
      this.line = line + 1;
      for (var view of this.views) {
        view.marker.setBufferRange([[line, 0], [line, 0]]);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.views.forEach(function (v) {
        v.destroy();
      });
    }
  }]);

  return Breakpoint;
})();

var BreakpointManager = (function () {
  function BreakpointManager(scopes, _ref2) {
    var _this = this;

    var toggle = _ref2.toggle;
    var clear = _ref2.clear;
    var toggleUncaught = _ref2.toggleUncaught;
    var toggleException = _ref2.toggleException;
    var refresh = _ref2.refresh;
    var addArgs = _ref2.addArgs;
    var toggleAllActive = _ref2.toggleAllActive;
    var toggleActive = _ref2.toggleActive;
    var addCondition = _ref2.addCondition;
    var setLevel = _ref2.setLevel;
    var toggleCompiled = _ref2.toggleCompiled;

    _classCallCheck(this, BreakpointManager);

    this.subs = new _atom.CompositeDisposable();
    this.scopes = scopes;
    this.name = 'ink-breakpoints-' + scopes;
    this.breakpoints = [];
    this.fileBreakpoints = [];
    this.emitter = new _atom.Emitter();
    this._toggle = toggle;
    this._clear = clear;
    this._toggleUncaught = toggleUncaught;
    this._toggleException = toggleException;
    this._refresh = refresh;
    this._addArgs = addArgs;
    this._toggleAllActive = toggleAllActive;
    this._toggleActive = toggleActive;
    this._addCondition = addCondition;
    this._setLevel = setLevel;
    this._toggleCompiled = toggleCompiled;

    this.onException = false;
    this.onUncaught = false;
    this.compiledMode = false;

    this.subs.add(atom.workspace.observeActiveTextEditor(function (ed) {
      if (ed && ed.observeGrammar) {
        _this.subs.add(ed.observeGrammar(function () {
          if (_this.appliesToEditor(ed)) {
            _this.init(ed);
          } else {
            _this.deinit(ed);
          }
        }));
      }
    }));
  }

  _createClass(BreakpointManager, [{
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.subs.dispose();
      atom.workspace.getTextEditors().forEach(function (ed) {
        return _this2.deinit(ed);
      });
    }
  }, {
    key: 'getForFile',
    value: function getForFile(path) {
      return this.fileBreakpoints.filter(function (_ref3) {
        var file = _ref3.file;
        return file === path;
      });
    }
  }, {
    key: 'get',
    value: function get(file, l) {
      return this.getForFile(file).filter(function (_ref4) {
        var line = _ref4.line;
        return line === l;
      })[0];
    }
  }, {
    key: 'appliesToEditor',
    value: function appliesToEditor(ed) {
      var grammarName = ed.getGrammar().scopeName;
      return this.scopes.some(function (scope) {
        return scope.indexOf(grammarName) > -1;
      });
    }
  }, {
    key: 'init',
    value: function init(ed) {
      var _this3 = this;

      if (ed.gutterWithName(this.name) !== null) return;
      ed.addGutter({
        name: this.name,
        priority: 0
      });

      var editorElement = atom.views.getView(ed);
      var hasListener = false;

      // click on gutter creates new bp
      var addClickListener = function addClickListener() {
        if (hasListener) return;

        var gutterElement = editorElement.querySelector('.gutter[gutter-name="' + _this3.name + '"]');

        if (gutterElement == null) {
          setTimeout(function () {
            process.nextTick(function () {
              return window.requestAnimationFrame(addClickListener);
            });
          }, 1000);

          return;
        }

        hasListener = true;
        gutterElement.addEventListener('click', function (event) {
          if (!ed || !ed.getPath()) {
            atom.notifications.addError('Need a saved file to add a breakpoint');
            return;
          }
          var row = ed.component.screenPositionForMouseEvent(event);
          row = ed.bufferPositionForScreenPosition(row).row;
          _this3.toggleAtSourceLocation({
            file: ed.getPath(),
            line: row + 1
          });
        });
      };
      addClickListener();

      this.getForFile(ed.getPath()).map(function (bp) {
        return _this3.insertView(ed, bp);
      });
    }
  }, {
    key: 'deinit',
    value: function deinit(ed) {
      var gutter = ed.gutterWithName(this.name);
      if (gutter) gutter.destroy();
    }
  }, {
    key: 'insertView',
    value: function insertView(ed, bp) {
      var _this4 = this;

      if (!this.appliesToEditor(ed)) return;
      if (!Number.isInteger(bp.line)) return;
      var marker = ed.markBufferRange([[bp.line - 1, 0], [bp.line - 1, 0]], { invalidate: 'never' });
      // TODO: remove bps if they are past the end of a file
      marker.onDidChange(function (ev) {
        var newLine = ev.newHeadBufferPosition.row;
        bp.updateLine(newLine);

        _this4.emitter.emit('update');
      });
      var gutter = ed.gutterWithName(this.name);

      var view = new BreakpointView({ breakpoint: bp });
      this.emitter.on('update', function () {
        return view.update();
      });
      var decoration = gutter.decorateMarker(marker, { item: view.element });
      bp.views.push({
        destroy: function destroy() {
          view.destroy();
          marker.destroy();
          decoration.destroy();
        },
        marker: marker
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(f) {
      this.emitter.on('update', f);
    }
  }, {
    key: 'setFuncBreakpoints',
    value: function setFuncBreakpoints(bps) {
      var _this5 = this;

      while (this.breakpoints.length > 0) {
        this.breakpoints.pop().destroy();
      }
      if (!bps) {
        bps = [];
      }
      bps.forEach(function (bp) {
        bp.typ = 'func';
        _this5.add(bp);
      });

      this.emitter.emit('update');
    }
  }, {
    key: 'add',
    value: function add(opts) {
      var _this6 = this;

      var bp = new Breakpoint(opts);
      if (opts.typ == 'source') {
        editorsForFile(opts.file).forEach(function (ed) {
          return _this6.insertView(ed, bp);
        });
        this.fileBreakpoints.push(bp);
      } else {
        this.breakpoints.push(bp);
      }

      this.emitter.emit('update');
      return bp;
    }
  }, {
    key: 'remove',
    value: function remove(bp) {
      var _this7 = this;

      if (bp.typ === 'source') {
        this.fileBreakpoints.splice(this.fileBreakpoints.indexOf(bp), 1);
      } else {
        this._toggle(bp).then(function (_ref5) {
          var response = _ref5.response;
          var error = _ref5.error;

          if (error) {
            _this7.showError(error);
          } else {
            _this7.setFuncBreakpoints(response);
          }
        });
      }

      bp.destroy();
      this.emitter.emit('update');
    }
  }, {
    key: 'getFileBreakpoints',
    value: function getFileBreakpoints() {
      return this.fileBreakpoints;
    }
  }, {
    key: 'getFuncBreakpoints',
    value: function getFuncBreakpoints() {
      return this.breakpoints;
    }
  }, {
    key: 'toggleAtSourceLocation',
    value: function toggleAtSourceLocation(_ref6) {
      var _this8 = this;

      var file = _ref6.file;
      var line = _ref6.line;

      var found = false;
      var ind = 0;
      this.fileBreakpoints.forEach(function (bp) {
        if (bp.file === file && bp.line === line) {
          _this8.fileBreakpoints.splice(ind, 1)[0].destroy();
          found = true;
        }
        ind += 1;
      });
      if (!found) {
        this.add({
          file: file,
          line: line,
          isactive: true,
          condition: null,
          typ: 'source'
        });
      }

      this.emitter.emit('update');
    }
  }, {
    key: 'toggleConditionAtSourceLocation',
    value: function toggleConditionAtSourceLocation(_ref7) {
      var _this9 = this;

      var file = _ref7.file;
      var line = _ref7.line;

      var activePane = atom.workspace.getActivePane();

      var found = false;
      this.fileBreakpoints.forEach(function (bp) {
        if (bp.file !== file || bp.line !== line) return;
        (0, _utilBasicModal.showBasicModal)([{
          name: 'Condition',
          value: bp.condition
        }]).then(function (items) {
          var condition = items['Condition'];
          _this9.addCondition(bp, condition);
          _this9.emitter.emit('update');
          activePane.activate(); // Re-activate previously active pane
        });
        found = true;
      });

      if (!found) {
        (0, _utilBasicModal.showBasicModal)([{
          name: 'Condition',
          value: ''
        }]).then(function (items) {
          var condition = items['Condition'];
          _this9.add({
            file: file,
            line: line,
            isactive: true,
            condition: condition,
            typ: 'source'
          });
          _this9.emitter.emit('update');
          activePane.activate(); // Re-activate previously active pane
        });
      }
    }
  }, {
    key: 'toggleActive',
    value: function toggleActive(bp) {
      var _this10 = this;

      if (bp.typ === 'source') {
        var ind = this.fileBreakpoints.indexOf(bp);
        if (ind > -1) {
          this.fileBreakpoints[ind].isactive = !this.fileBreakpoints[ind].isactive;
        }
      } else {
        this._toggleActive(bp).then(function (_ref8) {
          var response = _ref8.response;
          var error = _ref8.error;

          if (error) {
            _this10.showError(error);
          } else {
            _this10.setFuncBreakpoints(response);
          }
        });
      }
      this.emitter.emit('update');
    }
  }, {
    key: 'toggleAllActive',
    value: function toggleAllActive(state) {
      var _this11 = this;

      this.fileBreakpoints.forEach(function (bp) {
        bp.isactive = !state;
      });
      this._toggleAllActive(state).then(function (_ref9) {
        var response = _ref9.response;
        var error = _ref9.error;

        if (error) {
          _this11.showError(error);
        } else {
          _this11.setFuncBreakpoints(response);
        }
      });
      this.emitter.emit('update');
    }
  }, {
    key: 'addArgsBreakpoint',
    value: function addArgsBreakpoint(args) {
      var _this12 = this;

      this._addArgs(args).then(function (_ref10) {
        var response = _ref10.response;
        var error = _ref10.error;

        if (error) {
          _this12.showError(error);
        } else {
          _this12.setFuncBreakpoints(response);
        }
      });
      this.emitter.emit('update');
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this13 = this;

      var uiOnly = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.fileBreakpoints.reverse().forEach(function (bp) {
        return bp.destroy();
      });
      this.fileBreakpoints = [];

      if (!uiOnly) {
        this._clear().then(function (_ref11) {
          var response = _ref11.response;
          var error = _ref11.error;

          if (error) {
            _this13.showError(error);
          } else {
            _this13.setFuncBreakpoints(response);
          }
        });
      }
      this.setFuncBreakpoints();
      this.emitter.emit('update');
    }
  }, {
    key: 'toggleCompiled',
    value: function toggleCompiled() {
      var _this14 = this;

      this._toggleCompiled().then(function (_ref12) {
        var response = _ref12.response;
        var error = _ref12.error;

        if (error) {
          _this14.showError(error);
        } else {
          _this14.compiledMode = response;
        }
        _this14.emitter.emit('update');
      });
    }
  }, {
    key: 'toggleException',
    value: function toggleException() {
      var _this15 = this;

      this._toggleException().then(function (_ref13) {
        var response = _ref13.response;
        var error = _ref13.error;

        if (error) {
          _this15.showError(error);
        } else {
          _this15.onException = response;
        }
        _this15.emitter.emit('update');
      });
    }
  }, {
    key: 'toggleUncaughtException',
    value: function toggleUncaughtException() {
      var _this16 = this;

      this._toggleUncaught().then(function (_ref14) {
        var response = _ref14.response;
        var error = _ref14.error;

        if (error) {
          _this16.showError(error);
        } else {
          _this16.onUncaught = response;
        }
        _this16.emitter.emit('update');
      });
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var _this17 = this;

      this._refresh().then(function (_ref15) {
        var _ref15$response = _ref15.response;
        var response = _ref15$response === undefined ? [] : _ref15$response;
        var error = _ref15.error;

        if (error) {
          _this17.showError(error);
        } else {
          if (response && response.breakpoints) {
            _this17.setFuncBreakpoints(response.breakpoints);
            _this17.onUncaught = response.onUncaught;
            _this17.onException = response.onException;
          } else {
            _this17.setFuncBreakpoints(response);
          }
        }
        _this17.emitter.emit('update');
      });
    }
  }, {
    key: 'addCondition',
    value: function addCondition(bp, cond) {
      var _this18 = this;

      if (bp.typ === 'source') {
        var ind = this.fileBreakpoints.indexOf(bp);
        if (ind > -1) {
          this.fileBreakpoints[ind].condition = cond;
        }
      } else {
        this._addCondition(bp, cond).then(function (_ref16) {
          var _ref16$response = _ref16.response;
          var response = _ref16$response === undefined ? [] : _ref16$response;
          var error = _ref16.error;

          if (error) {
            _this18.showError(error);
          } else {
            _this18.setFuncBreakpoints(response);
          }
        });
      }
      this.emitter.emit('update');
    }
  }, {
    key: 'setLevel',
    value: function setLevel(level) {
      var _this19 = this;

      this._setLevel(level).then(function (_ref17) {
        var response = _ref17.response;
        var error = _ref17.error;

        if (error) {
          _this19.showError(error);
        }
        _this19.emitter.emit('update');
      });
    }
  }, {
    key: 'showError',
    value: function showError(err) {
      atom.notifications.addError('Error in Debugger', {
        detail: err
      });
    }
  }]);

  return BreakpointManager;
})();

exports['default'] = BreakpointManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kZWJ1Z2dlci9icmVha3BvaW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUcyQyxNQUFNOzs4QkFDbEIscUJBQXFCOzt3QkFDakMsY0FBYzs7b0JBRWhCLE1BQU07Ozs7QUFQdkIsV0FBVyxDQUFBOztBQVNYLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUM1QixTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTtXQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJO0dBQUEsQ0FBQyxDQUFBO0NBQzNFOztJQUVLLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7O2VBQWQsY0FBYzs7V0FDWixrQkFBRztBQUNQLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFBO0FBQ25FLFlBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsY0FBYyxHQUFHLEVBQUUsQ0FBQTtBQUMvRCxhQUFPLGdDQUFNLFNBQVMsRUFBRSxpQ0FBaUMsR0FBRyxNQUFNLEFBQUMsR0FBRyxDQUFBO0tBQ3ZFOzs7U0FMRyxjQUFjOzs7SUFRZCxVQUFVO0FBQ0gsV0FEUCxVQUFVLENBQ0YsSUFBdUQsRUFBRTtRQUF4RCxJQUFJLEdBQUwsSUFBdUQsQ0FBdEQsSUFBSTtRQUFFLElBQUksR0FBWCxJQUF1RCxDQUFoRCxJQUFJO1FBQUUsU0FBUyxHQUF0QixJQUF1RCxDQUExQyxTQUFTO1FBQUUsUUFBUSxHQUFoQyxJQUF1RCxDQUEvQixRQUFRO1FBQUUsV0FBVyxHQUE3QyxJQUF1RCxDQUFyQixX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QkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUNsQztTQUNGLENBQUMsQ0FBQTtPQUNIO0FBQ0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDNUI7OztXQUVRLGtCQUFDLEtBQUssRUFBRTs7O0FBQ2YsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFpQixFQUFLO1lBQXJCLFFBQVEsR0FBVCxNQUFpQixDQUFoQixRQUFRO1lBQUUsS0FBSyxHQUFoQixNQUFpQixDQUFOLEtBQUs7O0FBQzFDLFlBQUksS0FBSyxFQUFFO0FBQ1Qsa0JBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3RCO0FBQ0QsZ0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM1QixDQUFDLENBQUE7S0FDSDs7O1dBRVMsbUJBQUMsR0FBRyxFQUFFO0FBQ2QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7QUFDL0MsY0FBTSxFQUFFLEdBQUc7T0FDWixDQUFDLENBQUE7S0FDSDs7O1NBdllrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kZWJ1Z2dlci9icmVha3BvaW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBzaG93QmFzaWNNb2RhbCB9IGZyb20gJy4uL3V0aWwvYmFzaWMtbW9kYWwnXG5pbXBvcnQge0V0Y2h9IGZyb20gJy4uL3V0aWwvZXRjaCdcblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZnVuY3Rpb24gZWRpdG9yc0ZvckZpbGUoZmlsZSkge1xuICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5maWx0ZXIoZWQgPT4gZWQuZ2V0UGF0aCgpID09PSBmaWxlKVxufVxuXG5jbGFzcyBCcmVha3BvaW50VmlldyBleHRlbmRzIEV0Y2gge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRoaXMucHJvcHMuYnJlYWtwb2ludC5pc2FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJcbiAgICBzdGF0dXMgKz0gdGhpcy5wcm9wcy5icmVha3BvaW50LmNvbmRpdGlvbiA/IFwiIGNvbmRpdGlvbmFsXCIgOiBcIlwiXG4gICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17J2luay1icCBpY29uIGljb24tcHJpbWl0aXZlLWRvdCAnICsgc3RhdHVzfSAvPlxuICB9XG59XG5cbmNsYXNzIEJyZWFrcG9pbnQge1xuICBjb25zdHJ1Y3Rvcih7ZmlsZSwgbGluZSwgY29uZGl0aW9uLCBpc2FjdGl2ZSwgZGVzY3JpcHRpb24sIHR5cCwgaWR9KSB7XG4gICAgdGhpcy5maWxlID0gZmlsZSB8fCAnJ1xuICAgIHRoaXMubGluZSA9IGxpbmUgfHwgJydcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gfHwgJydcbiAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbiB8fCAnJ1xuICAgIHRoaXMuaXNhY3RpdmUgPSBpc2FjdGl2ZVxuICAgIHRoaXMudHlwID0gdHlwIHx8ICdzb3VyY2UnXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy52aWV3cyA9IFtdXG4gIH1cblxuICB1cGRhdGVMaW5lIChsaW5lKSB7XG4gICAgdGhpcy5saW5lID0gbGluZSArIDFcbiAgICBmb3IgKGNvbnN0IHZpZXcgb2YgdGhpcy52aWV3cykge1xuICAgICAgdmlldy5tYXJrZXIuc2V0QnVmZmVyUmFuZ2UoW1tsaW5lLCAwXSwgW2xpbmUsIDBdXSlcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCh2ID0+IHtcbiAgICAgIHYuZGVzdHJveSgpXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHNjb3Blcywge3RvZ2dsZSwgY2xlYXIsIHRvZ2dsZVVuY2F1Z2h0LCB0b2dnbGVFeGNlcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2gsIGFkZEFyZ3MsIHRvZ2dsZUFsbEFjdGl2ZSwgdG9nZ2xlQWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAgICBhZGRDb25kaXRpb24sIHNldExldmVsLCB0b2dnbGVDb21waWxlZH0pIHtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zY29wZXMgPSBzY29wZXNcbiAgICB0aGlzLm5hbWUgPSBgaW5rLWJyZWFrcG9pbnRzLSR7c2NvcGVzfWBcbiAgICB0aGlzLmJyZWFrcG9pbnRzID0gW11cbiAgICB0aGlzLmZpbGVCcmVha3BvaW50cyA9IFtdXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuX3RvZ2dsZSA9IHRvZ2dsZVxuICAgIHRoaXMuX2NsZWFyID0gY2xlYXJcbiAgICB0aGlzLl90b2dnbGVVbmNhdWdodCA9IHRvZ2dsZVVuY2F1Z2h0XG4gICAgdGhpcy5fdG9nZ2xlRXhjZXB0aW9uID0gdG9nZ2xlRXhjZXB0aW9uXG4gICAgdGhpcy5fcmVmcmVzaCA9IHJlZnJlc2hcbiAgICB0aGlzLl9hZGRBcmdzID0gYWRkQXJnc1xuICAgIHRoaXMuX3RvZ2dsZUFsbEFjdGl2ZSA9IHRvZ2dsZUFsbEFjdGl2ZVxuICAgIHRoaXMuX3RvZ2dsZUFjdGl2ZSA9IHRvZ2dsZUFjdGl2ZVxuICAgIHRoaXMuX2FkZENvbmRpdGlvbiA9IGFkZENvbmRpdGlvblxuICAgIHRoaXMuX3NldExldmVsID0gc2V0TGV2ZWxcbiAgICB0aGlzLl90b2dnbGVDb21waWxlZCA9IHRvZ2dsZUNvbXBpbGVkXG5cbiAgICB0aGlzLm9uRXhjZXB0aW9uID0gZmFsc2VcbiAgICB0aGlzLm9uVW5jYXVnaHQgPSBmYWxzZVxuICAgIHRoaXMuY29tcGlsZWRNb2RlID0gZmFsc2VcblxuICAgIHRoaXMuc3Vicy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IoZWQgPT4ge1xuICAgICAgaWYgKGVkICYmIGVkLm9ic2VydmVHcmFtbWFyKSB7XG4gICAgICAgIHRoaXMuc3Vicy5hZGQoZWQub2JzZXJ2ZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmFwcGxpZXNUb0VkaXRvcihlZCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdChlZClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWluaXQoZWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKVxuICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChlZCA9PiB0aGlzLmRlaW5pdChlZCkpXG4gIH1cblxuICBnZXRGb3JGaWxlKHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlQnJlYWtwb2ludHMuZmlsdGVyKCh7ZmlsZX0pID0+IGZpbGUgPT09IHBhdGgpXG4gIH1cblxuICBnZXQoZmlsZSwgbCkge1xuICAgIHJldHVybiB0aGlzLmdldEZvckZpbGUoZmlsZSkuZmlsdGVyKCh7bGluZX0pID0+IGxpbmUgPT09IGwpWzBdXG4gIH1cblxuICBhcHBsaWVzVG9FZGl0b3IoZWQpIHtcbiAgICBjb25zdCBncmFtbWFyTmFtZSA9IGVkLmdldEdyYW1tYXIoKS5zY29wZU5hbWVcbiAgICByZXR1cm4gdGhpcy5zY29wZXMuc29tZShzY29wZSA9PiB7XG4gICAgICByZXR1cm4gc2NvcGUuaW5kZXhPZihncmFtbWFyTmFtZSkgPiAtMVxuICAgIH0pXG4gIH1cblxuICBpbml0KGVkKSB7XG4gICAgaWYgKGVkLmd1dHRlcldpdGhOYW1lKHRoaXMubmFtZSkgIT09IG51bGwpIHJldHVyblxuICAgIGVkLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBwcmlvcml0eTogMFxuICAgIH0pXG5cbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkKVxuICAgIGxldCBoYXNMaXN0ZW5lciA9IGZhbHNlXG5cbiAgICAvLyBjbGljayBvbiBndXR0ZXIgY3JlYXRlcyBuZXcgYnBcbiAgICBjb25zdCBhZGRDbGlja0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgaWYgKGhhc0xpc3RlbmVyKSByZXR1cm5cblxuICAgICAgY29uc3QgZ3V0dGVyRWxlbWVudCA9IGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcihgLmd1dHRlcltndXR0ZXItbmFtZT1cIiR7dGhpcy5uYW1lfVwiXWApXG5cbiAgICAgIGlmIChndXR0ZXJFbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFkZENsaWNrTGlzdGVuZXIpKVxuICAgICAgICB9LCAxMDAwKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBoYXNMaXN0ZW5lciA9IHRydWVcbiAgICAgIGd1dHRlckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIGlmICghZWQgfHwgIWVkLmdldFBhdGgoKSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTmVlZCBhIHNhdmVkIGZpbGUgdG8gYWRkIGEgYnJlYWtwb2ludCcpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJvdyA9IGVkLmNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZvck1vdXNlRXZlbnQoZXZlbnQpXG4gICAgICAgIHJvdyA9IGVkLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24ocm93KS5yb3dcbiAgICAgICAgdGhpcy50b2dnbGVBdFNvdXJjZUxvY2F0aW9uKHtcbiAgICAgICAgICBmaWxlOiBlZC5nZXRQYXRoKCksXG4gICAgICAgICAgbGluZTogcm93ICsgMVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gICAgYWRkQ2xpY2tMaXN0ZW5lcigpXG5cbiAgICB0aGlzLmdldEZvckZpbGUoZWQuZ2V0UGF0aCgpKS5tYXAoYnAgPT4gdGhpcy5pbnNlcnRWaWV3KGVkLCBicCkpXG4gIH1cblxuICBkZWluaXQoZWQpIHtcbiAgICBjb25zdCBndXR0ZXIgPSBlZC5ndXR0ZXJXaXRoTmFtZSh0aGlzLm5hbWUpXG4gICAgaWYgKGd1dHRlcikgZ3V0dGVyLmRlc3Ryb3koKVxuICB9XG5cbiAgaW5zZXJ0VmlldyhlZCwgYnApIHtcbiAgICBpZiAoIXRoaXMuYXBwbGllc1RvRWRpdG9yKGVkKSkgcmV0dXJuXG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGJwLmxpbmUpKSByZXR1cm5cbiAgICBjb25zdCBtYXJrZXIgPSBlZC5tYXJrQnVmZmVyUmFuZ2UoW1ticC5saW5lLTEsIDBdLCBbYnAubGluZS0xLCAwXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSlcbiAgICAvLyBUT0RPOiByZW1vdmUgYnBzIGlmIHRoZXkgYXJlIHBhc3QgdGhlIGVuZCBvZiBhIGZpbGVcbiAgICBtYXJrZXIub25EaWRDaGFuZ2UoKGV2KSA9PiB7XG4gICAgICBjb25zdCBuZXdMaW5lID0gZXYubmV3SGVhZEJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgYnAudXBkYXRlTGluZShuZXdMaW5lKVxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndXBkYXRlJylcbiAgICB9KVxuICAgIGNvbnN0IGd1dHRlciA9IGVkLmd1dHRlcldpdGhOYW1lKHRoaXMubmFtZSlcblxuICAgIGNvbnN0IHZpZXcgPSBuZXcgQnJlYWtwb2ludFZpZXcoe2JyZWFrcG9pbnQ6IGJwfSlcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3VwZGF0ZScsICgpID0+IHZpZXcudXBkYXRlKCkpXG4gICAgY29uc3QgZGVjb3JhdGlvbiA9IGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtpdGVtOiB2aWV3LmVsZW1lbnR9KVxuICAgIGJwLnZpZXdzLnB1c2goe1xuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgdmlldy5kZXN0cm95KClcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKVxuICAgICAgfSxcbiAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgfSlcbiAgfVxuXG4gIG9uVXBkYXRlIChmKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCd1cGRhdGUnLCBmKVxuICB9XG5cbiAgc2V0RnVuY0JyZWFrcG9pbnRzIChicHMpIHtcbiAgICB3aGlsZSAodGhpcy5icmVha3BvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmJyZWFrcG9pbnRzLnBvcCgpLmRlc3Ryb3koKVxuICAgIH1cbiAgICBpZiAoIWJwcykge1xuICAgICAgYnBzID0gW11cbiAgICB9XG4gICAgYnBzLmZvckVhY2goYnAgPT4ge1xuICAgICAgYnAudHlwID0gJ2Z1bmMnXG4gICAgICB0aGlzLmFkZChicClcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gIH1cblxuICBhZGQgKG9wdHMpIHtcbiAgICBjb25zdCBicCA9IG5ldyBCcmVha3BvaW50KG9wdHMpXG4gICAgaWYgKG9wdHMudHlwID09ICdzb3VyY2UnKSB7XG4gICAgICBlZGl0b3JzRm9yRmlsZShvcHRzLmZpbGUpLmZvckVhY2goZWQgPT4gdGhpcy5pbnNlcnRWaWV3KGVkLCBicCkpXG4gICAgICB0aGlzLmZpbGVCcmVha3BvaW50cy5wdXNoKGJwKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJyZWFrcG9pbnRzLnB1c2goYnApXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gICAgcmV0dXJuIGJwXG4gIH1cblxuICByZW1vdmUgKGJwKSB7XG4gICAgaWYgKGJwLnR5cCA9PT0gJ3NvdXJjZScpIHtcbiAgICAgIHRoaXMuZmlsZUJyZWFrcG9pbnRzLnNwbGljZSh0aGlzLmZpbGVCcmVha3BvaW50cy5pbmRleE9mKGJwKSwgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdG9nZ2xlKGJwKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEZ1bmNCcmVha3BvaW50cyhyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBicC5kZXN0cm95KClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndXBkYXRlJylcbiAgfVxuXG4gIGdldEZpbGVCcmVha3BvaW50cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZUJyZWFrcG9pbnRzXG4gIH1cblxuICBnZXRGdW5jQnJlYWtwb2ludHMgKCkge1xuICAgIHJldHVybiB0aGlzLmJyZWFrcG9pbnRzXG4gIH1cblxuICB0b2dnbGVBdFNvdXJjZUxvY2F0aW9uICh7ZmlsZSwgbGluZX0pIHtcbiAgICBsZXQgZm91bmQgPSBmYWxzZVxuICAgIGxldCBpbmQgPSAwXG4gICAgdGhpcy5maWxlQnJlYWtwb2ludHMuZm9yRWFjaChicCA9PiB7XG4gICAgICBpZiAoYnAuZmlsZSA9PT0gZmlsZSAmJiBicC5saW5lID09PSBsaW5lKSB7XG4gICAgICAgIHRoaXMuZmlsZUJyZWFrcG9pbnRzLnNwbGljZShpbmQsIDEpWzBdLmRlc3Ryb3koKVxuICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGluZCArPSAxXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICB0aGlzLmFkZCh7XG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGxpbmU6IGxpbmUsXG4gICAgICAgIGlzYWN0aXZlOiB0cnVlLFxuICAgICAgICBjb25kaXRpb246IG51bGwsXG4gICAgICAgIHR5cDogJ3NvdXJjZSdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gIH1cblxuICB0b2dnbGVDb25kaXRpb25BdFNvdXJjZUxvY2F0aW9uICh7ZmlsZSwgbGluZX0pIHtcbiAgICBjb25zdCBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICBsZXQgZm91bmQgPSBmYWxzZVxuICAgIHRoaXMuZmlsZUJyZWFrcG9pbnRzLmZvckVhY2goYnAgPT4ge1xuICAgICAgaWYgKGJwLmZpbGUgIT09IGZpbGUgfHwgYnAubGluZSAhPT0gbGluZSkgcmV0dXJuXG4gICAgICBzaG93QmFzaWNNb2RhbChbe1xuICAgICAgICBuYW1lOiAnQ29uZGl0aW9uJyxcbiAgICAgICAgdmFsdWU6IGJwLmNvbmRpdGlvblxuICAgICAgfV0pLnRoZW4oaXRlbXMgPT4ge1xuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBpdGVtc1snQ29uZGl0aW9uJ11cbiAgICAgICAgdGhpcy5hZGRDb25kaXRpb24oYnAsIGNvbmRpdGlvbilcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gICAgICAgIGFjdGl2ZVBhbmUuYWN0aXZhdGUoKSAvLyBSZS1hY3RpdmF0ZSBwcmV2aW91c2x5IGFjdGl2ZSBwYW5lXG4gICAgICB9KVxuICAgICAgZm91bmQgPSB0cnVlXG4gICAgfSlcblxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHNob3dCYXNpY01vZGFsKFt7XG4gICAgICAgIG5hbWU6ICdDb25kaXRpb24nLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICB9XSkudGhlbihpdGVtcyA9PiB7XG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IGl0ZW1zWydDb25kaXRpb24nXVxuICAgICAgICB0aGlzLmFkZCh7XG4gICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGlzYWN0aXZlOiB0cnVlLFxuICAgICAgICAgIGNvbmRpdGlvbjogY29uZGl0aW9uLFxuICAgICAgICAgIHR5cDogJ3NvdXJjZSdcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gICAgICAgIGFjdGl2ZVBhbmUuYWN0aXZhdGUoKSAvLyBSZS1hY3RpdmF0ZSBwcmV2aW91c2x5IGFjdGl2ZSBwYW5lXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUFjdGl2ZSAoYnApIHtcbiAgICBpZiAoYnAudHlwID09PSAnc291cmNlJykge1xuICAgICAgY29uc3QgaW5kID0gdGhpcy5maWxlQnJlYWtwb2ludHMuaW5kZXhPZihicClcbiAgICAgIGlmIChpbmQgPiAtMSkge1xuICAgICAgICB0aGlzLmZpbGVCcmVha3BvaW50c1tpbmRdLmlzYWN0aXZlID0gIXRoaXMuZmlsZUJyZWFrcG9pbnRzW2luZF0uaXNhY3RpdmVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdG9nZ2xlQWN0aXZlKGJwKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEZ1bmNCcmVha3BvaW50cyhyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gIH1cblxuICB0b2dnbGVBbGxBY3RpdmUgKHN0YXRlKSB7XG4gICAgdGhpcy5maWxlQnJlYWtwb2ludHMuZm9yRWFjaChicCA9PiB7XG4gICAgICBicC5pc2FjdGl2ZSA9ICFzdGF0ZVxuICAgIH0pXG4gICAgdGhpcy5fdG9nZ2xlQWxsQWN0aXZlKHN0YXRlKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRGdW5jQnJlYWtwb2ludHMocmVzcG9uc2UpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndXBkYXRlJylcbiAgfVxuXG4gIGFkZEFyZ3NCcmVha3BvaW50IChhcmdzKSB7XG4gICAgdGhpcy5fYWRkQXJncyhhcmdzKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRGdW5jQnJlYWtwb2ludHMocmVzcG9uc2UpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndXBkYXRlJylcbiAgfVxuXG4gIGNsZWFyICh1aU9ubHkgPSBmYWxzZSkge1xuICAgIHRoaXMuZmlsZUJyZWFrcG9pbnRzLnJldmVyc2UoKS5mb3JFYWNoKGJwID0+IGJwLmRlc3Ryb3koKSlcbiAgICB0aGlzLmZpbGVCcmVha3BvaW50cyA9IFtdXG5cbiAgICBpZiAoIXVpT25seSkge1xuICAgICAgdGhpcy5fY2xlYXIoKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEZ1bmNCcmVha3BvaW50cyhyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5zZXRGdW5jQnJlYWtwb2ludHMoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnKVxuICB9XG5cbiAgdG9nZ2xlQ29tcGlsZWQgKCkge1xuICAgIHRoaXMuX3RvZ2dsZUNvbXBpbGVkKCkudGhlbigoe3Jlc3BvbnNlLCBlcnJvcn0pID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGlsZWRNb2RlID0gcmVzcG9uc2VcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnKVxuICAgIH0pXG4gIH1cblxuICB0b2dnbGVFeGNlcHRpb24gKCkge1xuICAgIHRoaXMuX3RvZ2dsZUV4Y2VwdGlvbigpLnRoZW4oKHtyZXNwb25zZSwgZXJyb3J9KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5zaG93RXJyb3IoZXJyb3IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uRXhjZXB0aW9uID0gcmVzcG9uc2VcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnKVxuICAgIH0pXG4gIH1cblxuICB0b2dnbGVVbmNhdWdodEV4Y2VwdGlvbiAoKSB7XG4gICAgdGhpcy5fdG9nZ2xlVW5jYXVnaHQoKS50aGVuKCh7cmVzcG9uc2UsIGVycm9yfSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vblVuY2F1Z2h0ID0gcmVzcG9uc2VcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnKVxuICAgIH0pXG4gIH1cblxuICByZWZyZXNoICgpIHtcbiAgICB0aGlzLl9yZWZyZXNoKCkudGhlbigoe3Jlc3BvbnNlPVtdLCBlcnJvcn0pID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5icmVha3BvaW50cykge1xuICAgICAgICAgIHRoaXMuc2V0RnVuY0JyZWFrcG9pbnRzKHJlc3BvbnNlLmJyZWFrcG9pbnRzKVxuICAgICAgICAgIHRoaXMub25VbmNhdWdodCA9IHJlc3BvbnNlLm9uVW5jYXVnaHRcbiAgICAgICAgICB0aGlzLm9uRXhjZXB0aW9uID0gcmVzcG9uc2Uub25FeGNlcHRpb25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEZ1bmNCcmVha3BvaW50cyhyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gICAgfSlcbiAgfVxuXG4gIGFkZENvbmRpdGlvbiAoYnAsIGNvbmQpIHtcbiAgICBpZiAoYnAudHlwID09PSAnc291cmNlJykge1xuICAgICAgY29uc3QgaW5kID0gdGhpcy5maWxlQnJlYWtwb2ludHMuaW5kZXhPZihicClcbiAgICAgIGlmIChpbmQgPiAtMSkge1xuICAgICAgICB0aGlzLmZpbGVCcmVha3BvaW50c1tpbmRdLmNvbmRpdGlvbiA9IGNvbmRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGJwLCBjb25kKS50aGVuKCh7cmVzcG9uc2U9W10sIGVycm9yfSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEZ1bmNCcmVha3BvaW50cyhyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZScpXG4gIH1cblxuICBzZXRMZXZlbCAobGV2ZWwpIHtcbiAgICB0aGlzLl9zZXRMZXZlbChsZXZlbCkudGhlbigoe3Jlc3BvbnNlLCBlcnJvcn0pID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihlcnJvcilcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGUnKVxuICAgIH0pXG4gIH1cblxuICBzaG93RXJyb3IgKGVycikge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3IgaW4gRGVidWdnZXInLCB7XG4gICAgICBkZXRhaWw6IGVyclxuICAgIH0pXG4gIH1cbn1cbiJdfQ==