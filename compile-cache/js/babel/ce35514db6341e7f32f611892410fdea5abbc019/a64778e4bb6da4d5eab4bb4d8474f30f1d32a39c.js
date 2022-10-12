Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilEtch = require('../util/etch');

var _utilBasicModal = require('../util/basic-modal');

var _atom = require('atom');

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilOpener = require('../util/opener');

var _utilViews = require('../util/views');

var _utilViews2 = _interopRequireDefault(_utilViews);

var _toolbar = require('./toolbar');

// pane for side-to-side view of compiled code and source code
'use babel';
var DebuggerPane = (function (_PaneItem) {
  _inherits(DebuggerPane, _PaneItem);

  _createClass(DebuggerPane, null, [{
    key: 'activate',
    value: function activate() {
      DebuggerPane.subs = new _atom.CompositeDisposable();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      DebuggerPane.subs.dispose();
    }
  }]);

  function DebuggerPane(stepper, breakpointManager) {
    var _this = this;

    var buttons = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    var startButtons = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    _classCallCheck(this, DebuggerPane);

    _get(Object.getPrototypeOf(DebuggerPane.prototype), 'constructor', this).call(this);

    this.name = 'DebuggerPane';
    this.compileModeTip = 'Breakpoints not in the current calling scope don\'t work in Compiled Mode';
    this.subs = new _atom.CompositeDisposable();

    this.stepper = stepper;
    this.breakpointManager = breakpointManager;

    this.toolbar = new _toolbar.DebuggerToolbar(buttons);
    this.startButtons = startButtons;

    this.stepper.onStep(function (arg) {
      return _this.updateStepper(arg);
    });
    this.breakpointManager.onUpdate(function (arg) {
      return _this.updateBreakpoints(arg);
    });
    this.toggleCompiled = function () {
      return _this.breakpointManager.toggleCompiled();
    };

    this.stack = [];
    this.activeLevel = undefined;

    this.allActive = true;

    this.info = {};

    this.setTitle('Debugger');
    this.currentlyAtEditor = new _atom.TextEditor({
      showLineNumbers: false,
      readOnly: true
    });

    this.newBreakpointEditor = new _atom.TextEditor({
      mini: true,
      placeholderText: 'Break on...'
    });

    this.subs.add(atom.commands.add('.ink-breakpoint-container .editor', {
      'breakpoint:add': function breakpointAdd() {
        return _this.addBreakpoint();
      }
    }));

    _etch2['default'].initialize(this);
  }

  _createClass(DebuggerPane, [{
    key: 'updateStepper',
    value: function updateStepper(_ref) {
      var file = _ref.file;
      var line = _ref.line;
      var text = _ref.text;
      var info = _ref.info;

      this.currentlyAtEditor.setText(info.moreinfo.code, {
        bypassReadOnly: true
      });
      this.currentlyAtEditor.setGrammar(atom.grammars.grammarForScopeName(this.breakpointManager.scopes));
      var row = info.moreinfo.currentline - info.moreinfo.firstline;
      this.currentlyAtEditor.setCursorBufferPosition([row, 0]);
      this.info = {
        file: file,
        line: line,
        text: text,
        code: info.moreinfo.code
      };
      this.stack = info.stack;
      this.activeLevel = info.level;
      _etch2['default'].update(this);
    }
  }, {
    key: 'updateBreakpoints',
    value: function updateBreakpoints() {
      _etch2['default'].update(this);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.stack = [];

      this.info = {};
      _etch2['default'].updateSync(this);
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'ink-debugger-container' },
        this.toolbarView(),
        _etch2['default'].dom(
          'div',
          { className: 'inner-container' },
          this.currentlyAtView(),
          this.breakpointListView()
        )
      );
    }

    // stepping
  }, {
    key: 'toolbarView',
    value: function toolbarView() {
      var _this2 = this;

      var expressionHidden = !this.info.text;

      var run = function run() {
        var ed = atom.workspace.getActiveTextEditor();
        if (ed) {
          atom.commands.dispatch(atom.views.getView(ed), _this2.refs.runnerSelector.value);
        }
      };

      return _etch2['default'].dom(
        'div',
        { className: 'item toolbar' },
        _etch2['default'].dom(
          'div',
          { className: 'inner-toolbar' },
          _etch2['default'].dom(
            'div',
            { className: 'debugger-runner' },
            _etch2['default'].dom('button', { className: 'btn icon icon-triangle-right btn-color-success', onclick: run }),
            _etch2['default'].dom(
              'select',
              { className: 'input-select', ref: 'runnerSelector' },
              this.startButtons.map(function (btn) {
                return _etch2['default'].dom(
                  'option',
                  { value: btn.command },
                  btn.text || ''
                );
              })
            )
          ),
          (0, _utilEtch.toView)(this.toolbar.view),
          _etch2['default'].dom(
            _utilEtch.Tip,
            { alt: this.compileModeTip },
            _etch2['default'].dom(
              'div',
              { className: 'flex-table-container' },
              _etch2['default'].dom(
                'div',
                { 'class': 'flex-table row' },
                _etch2['default'].dom(
                  'div',
                  { 'class': 'flex-row first' },
                  _etch2['default'].dom('input', {
                    'class': 'input-checkbox',
                    type: 'checkbox',
                    onclick: this.toggleCompiled,
                    checked: this.breakpointManager.compiledMode })
                ),
                _etch2['default'].dom(
                  'div',
                  { 'class': 'flex-row second' },
                  _etch2['default'].dom(
                    'span',
                    null,
                    'Compiled Mode'
                  )
                )
              )
            )
          )
        ),
        _etch2['default'].dom(
          'div',
          { className: "next-expression " + (expressionHidden ? "hidden" : "") },
          _etch2['default'].dom('span', { className: 'icon icon-chevron-right' }),
          _etch2['default'].dom(
            'span',
            { className: 'code' },
            (0, _utilEtch.toView)(_utilViews2['default'].render(_utilViews2['default'].tags.span('stepper-label', this.info.text)))
          )
        )
      );
    }

    // current code + callstack
  }, {
    key: 'currentlyAtView',
    value: function currentlyAtView() {
      var _this3 = this;

      var setLevel = function setLevel(level) {
        _this3.breakpointManager.setLevel(level);
      };

      var codeHidden = !(this.info.code && this.info.code.length > 0);
      var callstackHidden = this.stack.length === 0;
      return _etch2['default'].dom(
        'div',
        { className: "item " + (codeHidden && callstackHidden ? 'hidden' : '') },
        _etch2['default'].dom(
          'div',
          { className: "debugger-editor " + (codeHidden ? "hidden" : "") },
          _etch2['default'].dom(
            'div',
            { className: 'header' },
            _etch2['default'].dom(
              'h4',
              null,
              'Current code'
            )
          ),
          (0, _utilEtch.toView)(this.currentlyAtEditor.element)
        ),
        _etch2['default'].dom(
          'div',
          { className: "ink-callstack-container " + (callstackHidden ? "hidden" : "") },
          _etch2['default'].dom(
            'div',
            { className: 'header' },
            _etch2['default'].dom(
              'h4',
              null,
              'Callstack'
            )
          ),
          _etch2['default'].dom(
            'div',
            { className: 'flex-table-container' },
            this.stack.map(function (item) {
              return _etch2['default'].dom(
                'div',
                { className: 'flex-table row ' + (item.level == _this3.activeLevel ? "active" : "") },
                _etch2['default'].dom(
                  'div',
                  { className: 'flex-row first' },
                  _etch2['default'].dom(
                    'a',
                    { onclick: function () {
                        return setLevel(item.level);
                      } },
                    item.level
                  )
                ),
                _etch2['default'].dom(
                  'div',
                  { className: 'flex-row second code' },
                  item.name
                ),
                _etch2['default'].dom(
                  'div',
                  { className: 'flex-row third' },
                  _etch2['default'].dom(
                    'a',
                    { onclick: function () {
                        return (0, _utilOpener.open)(item.file, item.line - 1, {
                          pending: atom.config.get('core.allowPendingPaneItems')
                        });
                      } },
                    item.shortpath,
                    ':',
                    item.line || '?'
                  )
                )
              );
            })
          )
        )
      );
    }

    // breakpoints
  }, {
    key: 'breakpointListView',
    value: function breakpointListView() {
      var _this4 = this;

      var clearbps = function clearbps() {
        return _this4.breakpointManager.clear();
      };
      var toggleExc = function toggleExc() {
        return _this4.breakpointManager.toggleException();
      };
      var toggleUnExc = function toggleUnExc() {
        return _this4.breakpointManager.toggleUncaughtException();
      };
      var refresh = function refresh() {
        return _this4.breakpointManager.refresh();
      };
      var toggleAllActive = function toggleAllActive() {
        _this4.breakpointManager.toggleAllActive(_this4.allActive);
        _this4.allActive = !_this4.allActive;
      };

      var fileBreakpoints = this.breakpointManager.getFileBreakpoints();
      var funcBreakpoints = this.breakpointManager.getFuncBreakpoints();
      var shouldShowHr = fileBreakpoints.length > 0 && funcBreakpoints.length > 0;

      return _etch2['default'].dom(
        'div',
        { className: 'item ink-breakpoint-container' },
        _etch2['default'].dom(
          'div',
          { className: 'header' },
          _etch2['default'].dom(
            'h4',
            { style: 'flex:1' },
            'Breakpoints'
          ),
          _etch2['default'].dom(
            'div',
            { className: 'btn-group btn-group-sm' },
            _etch2['default'].dom(
              _utilEtch.Button,
              {
                alt: 'Toggle Breakpoints',
                onclick: toggleAllActive
              },
              'Toggle All'
            ),
            _etch2['default'].dom(_utilEtch.Button, { icon: 'repo-sync', alt: 'Refresh', onclick: refresh }),
            _etch2['default'].dom(_utilEtch.Button, { icon: 'circle-slash', alt: 'Clear Breakpoints', onclick: clearbps })
          )
        ),
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-table-container' },
          _etch2['default'].dom(
            'div',
            { 'class': 'flex-table row' },
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row first' },
              _etch2['default'].dom('input', {
                'class': 'input-checkbox',
                type: 'checkbox',
                onclick: toggleExc,
                checked: this.breakpointManager.breakOnException })
            ),
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row second' },
              'Break on Exception'
            ),
            _etch2['default'].dom('div', { 'class': 'flex-row third' })
          ),
          _etch2['default'].dom(
            'div',
            { 'class': 'flex-table row' },
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row first' },
              _etch2['default'].dom('input', {
                'class': 'input-checkbox',
                type: 'checkbox',
                onclick: toggleUnExc,
                checked: this.breakpointManager.breakOnException })
            ),
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row second' },
              'Break on Uncaught Exception'
            ),
            _etch2['default'].dom('div', { 'class': 'flex-row third' })
          ),
          _etch2['default'].dom(
            'div',
            { 'class': 'flex-table row new-bp' },
            _etch2['default'].dom('div', { 'class': 'flex-row first' }),
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row second' },
              (0, _utilEtch.toView)(this.newBreakpointEditor.element)
            ),
            _etch2['default'].dom(
              'div',
              { 'class': 'flex-row third' },
              _etch2['default'].dom(_utilEtch.Button, {
                className: 'btn-xs',
                icon: 'plus',
                alt: 'Add Breakpoint',
                onclick: function () {
                  return _this4.addBreakpoint();
                }
              })
            )
          ),
          fileBreakpoints.map(function (bp) {
            return _this4.breakpointView(bp);
          }),
          _etch2['default'].dom('hr', { className: shouldShowHr ? '' : 'hidden' }),
          funcBreakpoints.map(function (bp) {
            return _this4.breakpointView(bp);
          })
        )
      );
    }
  }, {
    key: 'breakpointView',
    value: function breakpointView(bp) {
      var _this5 = this;

      var item = bp;
      item.toggleActive = function () {
        return _this5.breakpointManager.toggleActive(bp);
      };
      item.onclick = function () {
        return (0, _utilOpener.open)(bp.file, bp.line - 1, {
          pending: atom.config.get('core.allowPendingPaneItems')
        });
      };
      item.remove = function () {
        return _this5.breakpointManager.remove(bp);
      };
      if (item.typ === 'source') {
        item.tooltip = bp.file || '';
        item.condition = bp.condition || '';
        item.description = (bp.shortpath || bp.file || '???') + ':' + (bp.line || '?');
      } else {
        item.condition = bp.condition || '';
        item.tooltip = bp.description || '';
        item.description = bp.description || '';
      }

      return _etch2['default'].dom(
        'div',
        { 'class': 'flex-table row' },
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-row first' },
          _etch2['default'].dom('input', {
            'class': 'input-checkbox',
            type: 'checkbox',
            onclick: item.toggleActive,
            checked: item.isactive })
        ),
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-row second ellipsis-outer' },
          _etch2['default'].dom(
            'div',
            { 'class': 'ellipsis-inner' },
            _etch2['default'].dom(
              _utilEtch.Tip,
              { alt: item.tooltip },
              _etch2['default'].dom(
                'a',
                { onclick: item.onclick },
                ' ' + item.description
              )
            )
          )
        ),
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-row condition ellipsis-outer' },
          _etch2['default'].dom(
            'div',
            { 'class': 'ellipsis-inner' },
            _etch2['default'].dom(
              _utilEtch.Tip,
              { alt: item.condition },
              _etch2['default'].dom(
                'span',
                null,
                ' ' + item.condition
              )
            )
          )
        ),
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-row' },
          _etch2['default'].dom(_utilEtch.Button, {
            className: 'btn-xs',
            icon: 'split', alt: 'Edit Condition',
            onclick: function () {
              return _this5.addCondition(bp);
            }
          })
        ),
        _etch2['default'].dom(
          'div',
          { 'class': 'flex-row' },
          _etch2['default'].dom(_utilEtch.Button, {
            className: 'btn-xs',
            icon: 'x',
            alt: 'Delete Breakpoint',
            onclick: item.remove
          })
        )
      );
    }
  }, {
    key: 'addBreakpoint',
    value: function addBreakpoint() {
      var editorContents = this.newBreakpointEditor.getText();
      this.newBreakpointEditor.setText('');
      this.breakpointManager.addArgsBreakpoint(editorContents);
    }
  }, {
    key: 'addCondition',
    value: function addCondition(bp) {
      var _this6 = this;

      (0, _utilBasicModal.showBasicModal)([{
        name: "Condition",
        value: bp.condition
      }]).then(function (items) {
        var cond = items["Condition"];
        _this6.breakpointManager.addCondition(bp, cond);
      })['catch'](function (err) {
        console.error(err);
      });
    }
  }, {
    key: 'removeBreakpoint',
    value: function removeBreakpoint(item) {
      this.breakpointManager.remove(item);
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'bug';
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return undefined;
    }
  }]);

  return DebuggerPane;
})(_utilPaneItem2['default']);

exports['default'] = DebuggerPane;

DebuggerPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kZWJ1Z2dlci9kZWJ1Z2dlci1wYW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7d0JBQ2lELGNBQWM7OzhCQUN2RCxxQkFBcUI7O29CQUNKLE1BQU07OzRCQUNqQyxtQkFBbUI7Ozs7MEJBQ25CLGdCQUFnQjs7eUJBQ25CLGVBQWU7Ozs7dUJBQ1csV0FBVzs7O0FBVnZELFdBQVcsQ0FBQTtJQWFVLFlBQVk7WUFBWixZQUFZOztlQUFaLFlBQVk7O1dBSWYsb0JBQUc7QUFDakIsa0JBQVksQ0FBQyxJQUFJLEdBQUcsK0JBQXlCLENBQUE7S0FDOUM7OztXQUVpQixzQkFBRztBQUNuQixrQkFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM1Qjs7O0FBRVcsV0FaTyxZQUFZLENBWWxCLE9BQU8sRUFBRSxpQkFBaUIsRUFBK0I7OztRQUE3QixPQUFPLHlEQUFDLEVBQUU7UUFBRSxZQUFZLHlEQUFDLEVBQUU7OzBCQVpqRCxZQUFZOztBQWE3QiwrQkFiaUIsWUFBWSw2Q0FhdEI7O1NBWlQsSUFBSSxHQUFHLGNBQWM7U0FDckIsY0FBYyxHQUFHLDJFQUEyRTtBQWExRixRQUFJLENBQUMsSUFBSSxHQUFHLCtCQUF5QixDQUFBOztBQUVyQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUE7O0FBRTFDLFFBQUksQ0FBQyxPQUFPLEdBQUcsNkJBQW9CLE9BQU8sQ0FBQyxDQUFBO0FBQzNDLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBOztBQUVoQyxRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUc7YUFBSSxNQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUM7S0FBQSxD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QUE7S0FDYjs7O1dBRVMscUJBQUc7QUFDWCxhQUFPLFNBQVMsQ0FBQTtLQUNqQjs7O1NBaFhrQixZQUFZOzs7cUJBQVosWUFBWTs7QUFtWGpDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQSIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvZGVidWdnZXIvZGVidWdnZXItcGFuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgdG9WaWV3LCBUb29sYmFyLCBUaXAsIEJ1dHRvbiwgSWNvbiwgbWFrZWljb24sIEV0Y2gsIFJhdyB9IGZyb20gJy4uL3V0aWwvZXRjaCdcbmltcG9ydCB7IHNob3dCYXNpY01vZGFsIH0gZnJvbSAnLi4vdXRpbC9iYXNpYy1tb2RhbCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL3V0aWwvcGFuZS1pdGVtJ1xuaW1wb3J0IHsgb3BlbiB9IGZyb20gJy4uL3V0aWwvb3BlbmVyJ1xuaW1wb3J0IHZpZXdzIGZyb20gJy4uL3V0aWwvdmlld3MnXG5pbXBvcnQgeyBEZWJ1Z2dlclRvb2xiYXIsIGJ1dHRvblZpZXcgfSBmcm9tICcuL3Rvb2xiYXInXG5cbi8vIHBhbmUgZm9yIHNpZGUtdG8tc2lkZSB2aWV3IG9mIGNvbXBpbGVkIGNvZGUgYW5kIHNvdXJjZSBjb2RlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z2dlclBhbmUgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIG5hbWUgPSAnRGVidWdnZXJQYW5lJ1xuICBjb21waWxlTW9kZVRpcCA9ICdCcmVha3BvaW50cyBub3QgaW4gdGhlIGN1cnJlbnQgY2FsbGluZyBzY29wZSBkb25cXCd0IHdvcmsgaW4gQ29tcGlsZWQgTW9kZSdcblxuICBzdGF0aWMgYWN0aXZhdGUgKCkge1xuICAgIERlYnVnZ2VyUGFuZS5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUgKCkge1xuICAgIERlYnVnZ2VyUGFuZS5zdWJzLmRpc3Bvc2UoKVxuICB9XG5cbiAgY29uc3RydWN0b3IgKHN0ZXBwZXIsIGJyZWFrcG9pbnRNYW5hZ2VyLCBidXR0b25zPVtdLCBzdGFydEJ1dHRvbnM9W10pIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN0ZXBwZXIgPSBzdGVwcGVyXG4gICAgdGhpcy5icmVha3BvaW50TWFuYWdlciA9IGJyZWFrcG9pbnRNYW5hZ2VyXG5cbiAgICB0aGlzLnRvb2xiYXIgPSBuZXcgRGVidWdnZXJUb29sYmFyKGJ1dHRvbnMpXG4gICAgdGhpcy5zdGFydEJ1dHRvbnMgPSBzdGFydEJ1dHRvbnNcblxuICAgIHRoaXMuc3RlcHBlci5vblN0ZXAoYXJnID0+IHRoaXMudXBkYXRlU3RlcHBlcihhcmcpKVxuICAgIHRoaXMuYnJlYWtwb2ludE1hbmFnZXIub25VcGRhdGUoYXJnID0+IHRoaXMudXBkYXRlQnJlYWtwb2ludHMoYXJnKSlcbiAgICB0aGlzLnRvZ2dsZUNvbXBpbGVkID0gKCkgPT4gdGhpcy5icmVha3BvaW50TWFuYWdlci50b2dnbGVDb21waWxlZCgpXG5cbiAgICB0aGlzLnN0YWNrID0gW11cbiAgICB0aGlzLmFjdGl2ZUxldmVsID0gdW5kZWZpbmVkXG5cbiAgICB0aGlzLmFsbEFjdGl2ZSA9IHRydWVcblxuICAgIHRoaXMuaW5mbyA9IHt9XG5cbiAgICB0aGlzLnNldFRpdGxlKCdEZWJ1Z2dlcicpXG4gICAgdGhpcy5jdXJyZW50bHlBdEVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHtcbiAgICAgIHNob3dMaW5lTnVtYmVyczogZmFsc2UsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLm5ld0JyZWFrcG9pbnRFZGl0b3IgPSBuZXcgVGV4dEVkaXRvcih7XG4gICAgICBtaW5pOiB0cnVlLFxuICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnQnJlYWsgb24uLi4nXG4gICAgfSlcblxuICAgIHRoaXMuc3Vicy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJy5pbmstYnJlYWtwb2ludC1jb250YWluZXIgLmVkaXRvcicsIHtcbiAgICAgICdicmVha3BvaW50OmFkZCc6ICgpID0+IHRoaXMuYWRkQnJlYWtwb2ludCgpXG4gICAgfSkpXG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHVwZGF0ZVN0ZXBwZXIgKHtmaWxlLCBsaW5lLCB0ZXh0LCBpbmZvfSkge1xuICAgIHRoaXMuY3VycmVudGx5QXRFZGl0b3Iuc2V0VGV4dChpbmZvLm1vcmVpbmZvLmNvZGUsIHtcbiAgICAgIGJ5cGFzc1JlYWRPbmx5OiB0cnVlXG4gICAgfSlcbiAgICB0aGlzLmN1cnJlbnRseUF0RWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKHRoaXMuYnJlYWtwb2ludE1hbmFnZXIuc2NvcGVzKSlcbiAgICBjb25zdCByb3cgPSBpbmZvLm1vcmVpbmZvLmN1cnJlbnRsaW5lIC0gaW5mby5tb3JlaW5mby5maXJzdGxpbmVcbiAgICB0aGlzLmN1cnJlbnRseUF0RWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtyb3csIDBdKVxuICAgIHRoaXMuaW5mbyA9IHtcbiAgICAgIGZpbGUsXG4gICAgICBsaW5lLFxuICAgICAgdGV4dCxcbiAgICAgIGNvZGU6IGluZm8ubW9yZWluZm8uY29kZVxuICAgIH1cbiAgICB0aGlzLnN0YWNrID0gaW5mby5zdGFja1xuICAgIHRoaXMuYWN0aXZlTGV2ZWwgPSBpbmZvLmxldmVsXG4gICAgZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHVwZGF0ZUJyZWFrcG9pbnRzICgpIHtcbiAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuc3RhY2sgPSBbXVxuXG4gICAgdGhpcy5pbmZvID0ge31cbiAgICBldGNoLnVwZGF0ZVN5bmModGhpcylcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cImluay1kZWJ1Z2dlci1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAge3RoaXMudG9vbGJhclZpZXcoKX1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbm5lci1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5jdXJyZW50bHlBdFZpZXcoKX1cbiAgICAgICAgICAgICAgICB7dGhpcy5icmVha3BvaW50TGlzdFZpZXcoKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgfVxuXG4gIC8vIHN0ZXBwaW5nXG4gIHRvb2xiYXJWaWV3ICgpIHtcbiAgICBjb25zdCBleHByZXNzaW9uSGlkZGVuID0gIXRoaXMuaW5mby50ZXh0XG5cbiAgICBsZXQgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIChlZCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZCksIHRoaXMucmVmcy5ydW5uZXJTZWxlY3Rvci52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwiaXRlbSB0b29sYmFyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubmVyLXRvb2xiYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWJ1Z2dlci1ydW5uZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24tdHJpYW5nbGUtcmlnaHQgYnRuLWNvbG9yLXN1Y2Nlc3NcIiBvbmNsaWNrPXtydW59PlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiaW5wdXQtc2VsZWN0XCIgcmVmPVwicnVubmVyU2VsZWN0b3JcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydEJ1dHRvbnMubWFwKGJ0biA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxvcHRpb24gdmFsdWU9e2J0bi5jb21tYW5kfT5cbiAgICAgICAgICAgICAgICAgIHsgYnRuLnRleHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dG9WaWV3KHRoaXMudG9vbGJhci52aWV3KX1cbiAgICAgICAgPFRpcCBhbHQ9e3RoaXMuY29tcGlsZU1vZGVUaXB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC10YWJsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LXRhYmxlIHJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC1yb3cgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIGNsYXNzPSdpbnB1dC1jaGVja2JveCdcbiAgICAgICAgICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgICAgICAgICAgb25jbGljaz17dGhpcy50b2dnbGVDb21waWxlZH1cbiAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMuYnJlYWtwb2ludE1hbmFnZXIuY29tcGlsZWRNb2RlfT5cbiAgICAgICAgICAgICAgICA8L2lucHV0PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IHNlY29uZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPkNvbXBpbGVkIE1vZGU8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvVGlwPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtcIm5leHQtZXhwcmVzc2lvbiBcIiArIChleHByZXNzaW9uSGlkZGVuID8gXCJoaWRkZW5cIiA6IFwiXCIpfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tcmlnaHRcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvZGVcIj5cbiAgICAgICAgICB7dG9WaWV3KHZpZXdzLnJlbmRlcih2aWV3cy50YWdzLnNwYW4oJ3N0ZXBwZXItbGFiZWwnLCB0aGlzLmluZm8udGV4dCkpKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICAvLyBjdXJyZW50IGNvZGUgKyBjYWxsc3RhY2tcbiAgY3VycmVudGx5QXRWaWV3ICgpIHtcbiAgICBjb25zdCBzZXRMZXZlbCA9IChsZXZlbCkgPT4ge1xuICAgICAgdGhpcy5icmVha3BvaW50TWFuYWdlci5zZXRMZXZlbChsZXZlbClcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlSGlkZGVuID0gISh0aGlzLmluZm8uY29kZSAmJiB0aGlzLmluZm8uY29kZS5sZW5ndGggPiAwKVxuICAgIGNvbnN0IGNhbGxzdGFja0hpZGRlbiA9IHRoaXMuc3RhY2subGVuZ3RoID09PSAwXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtcIml0ZW0gXCIgKyAoY29kZUhpZGRlbiAmJiBjYWxsc3RhY2tIaWRkZW4gPyAnaGlkZGVuJyA6ICcnKSB9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e1wiZGVidWdnZXItZWRpdG9yIFwiICsgKGNvZGVIaWRkZW4gPyBcImhpZGRlblwiIDogXCJcIil9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgIDxoND5DdXJyZW50IGNvZGU8L2g0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RvVmlldyh0aGlzLmN1cnJlbnRseUF0RWRpdG9yLmVsZW1lbnQpfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17XCJpbmstY2FsbHN0YWNrLWNvbnRhaW5lciBcIiArIChjYWxsc3RhY2tIaWRkZW4gPyBcImhpZGRlblwiIDogXCJcIil9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgIDxoND5DYWxsc3RhY2s8L2g0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LXRhYmxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnN0YWNrLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17YGZsZXgtdGFibGUgcm93ICR7aXRlbS5sZXZlbCA9PSB0aGlzLmFjdGl2ZUxldmVsID8gXCJhY3RpdmVcIiA6IFwiXCJ9YH0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1yb3cgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICA8YSBvbmNsaWNrPXsoKSA9PiBzZXRMZXZlbChpdGVtLmxldmVsKX0+XG4gICAgICAgICAgICAgICAgICB7aXRlbS5sZXZlbH1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtcm93IHNlY29uZCBjb2RlXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubmFtZX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1yb3cgdGhpcmRcIj5cbiAgICAgICAgICAgICAgICA8YSBvbmNsaWNrPXsoKSA9PiBvcGVuKGl0ZW0uZmlsZSwgaXRlbS5saW5lIC0gMSwge1xuICAgICAgICAgICAgICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpXG4gICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAge2l0ZW0uc2hvcnRwYXRofTp7aXRlbS5saW5lIHx8ICc/J31cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICAvLyBicmVha3BvaW50c1xuICBicmVha3BvaW50TGlzdFZpZXcgKCkge1xuICAgIGNvbnN0IGNsZWFyYnBzID0gKCkgPT4gdGhpcy5icmVha3BvaW50TWFuYWdlci5jbGVhcigpXG4gICAgY29uc3QgdG9nZ2xlRXhjID0gKCkgPT4gdGhpcy5icmVha3BvaW50TWFuYWdlci50b2dnbGVFeGNlcHRpb24oKVxuICAgIGNvbnN0IHRvZ2dsZVVuRXhjID0gKCkgPT4gdGhpcy5icmVha3BvaW50TWFuYWdlci50b2dnbGVVbmNhdWdodEV4Y2VwdGlvbigpXG4gICAgY29uc3QgcmVmcmVzaCA9ICgpID0+IHRoaXMuYnJlYWtwb2ludE1hbmFnZXIucmVmcmVzaCgpXG4gICAgY29uc3QgdG9nZ2xlQWxsQWN0aXZlID0gKCkgPT4ge1xuICAgICAgdGhpcy5icmVha3BvaW50TWFuYWdlci50b2dnbGVBbGxBY3RpdmUodGhpcy5hbGxBY3RpdmUpXG4gICAgICB0aGlzLmFsbEFjdGl2ZSA9ICF0aGlzLmFsbEFjdGl2ZVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVCcmVha3BvaW50cyA9IHRoaXMuYnJlYWtwb2ludE1hbmFnZXIuZ2V0RmlsZUJyZWFrcG9pbnRzKClcbiAgICBjb25zdCBmdW5jQnJlYWtwb2ludHMgPSB0aGlzLmJyZWFrcG9pbnRNYW5hZ2VyLmdldEZ1bmNCcmVha3BvaW50cygpXG4gICAgY29uc3Qgc2hvdWxkU2hvd0hyID0gZmlsZUJyZWFrcG9pbnRzLmxlbmd0aCA+IDAgJiYgZnVuY0JyZWFrcG9pbnRzLmxlbmd0aCA+IDBcblxuICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJpdGVtIGluay1icmVha3BvaW50LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxoNCBzdHlsZT1cImZsZXg6MVwiPlxuICAgICAgICAgICAgICAgICAgQnJlYWtwb2ludHNcbiAgICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdidG4tZ3JvdXAgYnRuLWdyb3VwLXNtJz5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgYWx0PSdUb2dnbGUgQnJlYWtwb2ludHMnXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9eyB0b2dnbGVBbGxBY3RpdmUgfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBUb2dnbGUgQWxsXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gaWNvbj0ncmVwby1zeW5jJyBhbHQ9J1JlZnJlc2gnIG9uY2xpY2s9e3JlZnJlc2h9Lz5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gaWNvbj0nY2lyY2xlLXNsYXNoJyBhbHQ9J0NsZWFyIEJyZWFrcG9pbnRzJyBvbmNsaWNrPXtjbGVhcmJwc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtdGFibGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtdGFibGUgcm93XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC1yb3cgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9J2lucHV0LWNoZWNrYm94J1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e3RvZ2dsZUV4Y31cbiAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXt0aGlzLmJyZWFrcG9pbnRNYW5hZ2VyLmJyZWFrT25FeGNlcHRpb259PlxuICAgICAgICAgICAgICAgICAgICA8L2lucHV0PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC1yb3cgc2Vjb25kXCI+QnJlYWsgb24gRXhjZXB0aW9uPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC1yb3cgdGhpcmRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC10YWJsZSByb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LXJvdyBmaXJzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz0naW5wdXQtY2hlY2tib3gnXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT0nY2hlY2tib3gnXG4gICAgICAgICAgICAgICAgICAgICAgb25jbGljaz17dG9nZ2xlVW5FeGN9XG4gICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5icmVha3BvaW50TWFuYWdlci5icmVha09uRXhjZXB0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IHNlY29uZFwiPkJyZWFrIG9uIFVuY2F1Z2h0IEV4Y2VwdGlvbjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IHRoaXJkXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtdGFibGUgcm93IG5ldy1icFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IGZpcnN0XCI+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LXJvdyBzZWNvbmRcIj5cbiAgICAgICAgICAgICAgICAgICB7dG9WaWV3KHRoaXMubmV3QnJlYWtwb2ludEVkaXRvci5lbGVtZW50KX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IHRoaXJkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4teHNcIlxuICAgICAgICAgICAgICAgICAgICAgIGljb249J3BsdXMnXG4gICAgICAgICAgICAgICAgICAgICAgYWx0PSdBZGQgQnJlYWtwb2ludCdcbiAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXsoKSA9PiB0aGlzLmFkZEJyZWFrcG9pbnQoKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZpbGVCcmVha3BvaW50cy5tYXAoYnAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5icmVha3BvaW50VmlldyhicClcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDxociBjbGFzc05hbWU9e3Nob3VsZFNob3dIciA/ICcnIDogJ2hpZGRlbid9PjwvaHI+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZnVuY0JyZWFrcG9pbnRzLm1hcChicCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJyZWFrcG9pbnRWaWV3KGJwKVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gIH1cblxuICBicmVha3BvaW50VmlldyAoYnApIHtcbiAgICBjb25zdCBpdGVtID0gYnBcbiAgICBpdGVtLnRvZ2dsZUFjdGl2ZSA9ICgpID0+IHRoaXMuYnJlYWtwb2ludE1hbmFnZXIudG9nZ2xlQWN0aXZlKGJwKVxuICAgIGl0ZW0ub25jbGljayA9ICgpID0+IG9wZW4oYnAuZmlsZSwgYnAubGluZSAtIDEsIHtcbiAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKVxuICAgIH0pXG4gICAgaXRlbS5yZW1vdmUgPSAoKSA9PiB0aGlzLmJyZWFrcG9pbnRNYW5hZ2VyLnJlbW92ZShicClcbiAgICBpZiAoaXRlbS50eXAgPT09ICdzb3VyY2UnKSB7XG4gICAgICBpdGVtLnRvb2x0aXAgPSBicC5maWxlIHx8ICcnXG4gICAgICBpdGVtLmNvbmRpdGlvbiA9IGJwLmNvbmRpdGlvbiB8fCAnJ1xuICAgICAgaXRlbS5kZXNjcmlwdGlvbiA9IChicC5zaG9ydHBhdGggfHwgYnAuZmlsZSB8fCAnPz8/JykrJzonKyhicC5saW5lIHx8ICc/JylcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbS5jb25kaXRpb24gPSBicC5jb25kaXRpb24gfHwgJydcbiAgICAgIGl0ZW0udG9vbHRpcCA9IGJwLmRlc2NyaXB0aW9uIHx8ICcnXG4gICAgICBpdGVtLmRlc2NyaXB0aW9uID0gYnAuZGVzY3JpcHRpb24gfHwgJydcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzcz1cImZsZXgtdGFibGUgcm93XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IGZpcnN0XCI+XG4gICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgY2xhc3M9J2lucHV0LWNoZWNrYm94J1xuICAgICAgICAgICAgICAgICB0eXBlPSdjaGVja2JveCdcbiAgICAgICAgICAgICAgICAgb25jbGljaz17IGl0ZW0udG9nZ2xlQWN0aXZlIH1cbiAgICAgICAgICAgICAgICAgY2hlY2tlZD17IGl0ZW0uaXNhY3RpdmUgfT5cbiAgICAgICAgICAgICAgIDwvaW5wdXQ+XG4gICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93IHNlY29uZCBlbGxpcHNpcy1vdXRlclwiPlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVsbGlwc2lzLWlubmVyXCI+XG4gICAgICAgICAgICAgICAgIDxUaXAgYWx0PXsgaXRlbS50b29sdGlwIH0+XG4gICAgICAgICAgICAgICAgICAgPGEgb25jbGljaz17aXRlbS5vbmNsaWNrfT5cbiAgICAgICAgICAgICAgICAgICAgIHsgJyAnICsgaXRlbS5kZXNjcmlwdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICA8L1RpcD5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LXJvdyBjb25kaXRpb24gZWxsaXBzaXMtb3V0ZXJcIj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlbGxpcHNpcy1pbm5lclwiPlxuICAgICAgICAgICAgICAgICA8VGlwIGFsdD17IGl0ZW0uY29uZGl0aW9uIH0+XG4gICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICB7ICcgJyArIGl0ZW0uY29uZGl0aW9uIH1cbiAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgIDwvVGlwPlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93XCI+XG4gICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi14c1wiXG4gICAgICAgICAgICAgICAgIGljb249J3NwbGl0JyBhbHQ9J0VkaXQgQ29uZGl0aW9uJ1xuICAgICAgICAgICAgICAgICBvbmNsaWNrPXsoKSA9PiB0aGlzLmFkZENvbmRpdGlvbihicCl9XG4gICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LXJvd1wiPlxuICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4teHNcIlxuICAgICAgICAgICAgICAgICBpY29uPSd4J1xuICAgICAgICAgICAgICAgICBhbHQ9J0RlbGV0ZSBCcmVha3BvaW50J1xuICAgICAgICAgICAgICAgICBvbmNsaWNrPXsgaXRlbS5yZW1vdmUgfVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgPC9kaXY+XG4gIH1cblxuICBhZGRCcmVha3BvaW50ICgpIHtcbiAgICBjb25zdCBlZGl0b3JDb250ZW50cyA9IHRoaXMubmV3QnJlYWtwb2ludEVkaXRvci5nZXRUZXh0KClcbiAgICB0aGlzLm5ld0JyZWFrcG9pbnRFZGl0b3Iuc2V0VGV4dCgnJylcbiAgICB0aGlzLmJyZWFrcG9pbnRNYW5hZ2VyLmFkZEFyZ3NCcmVha3BvaW50KGVkaXRvckNvbnRlbnRzKVxuICB9XG5cbiAgYWRkQ29uZGl0aW9uIChicCkge1xuICAgIHNob3dCYXNpY01vZGFsKFt7XG4gICAgICBuYW1lOiBcIkNvbmRpdGlvblwiLFxuICAgICAgdmFsdWU6IGJwLmNvbmRpdGlvblxuICAgIH1dKS50aGVuKGl0ZW1zID0+IHtcbiAgICAgIGNvbnN0IGNvbmQgPSBpdGVtc1tcIkNvbmRpdGlvblwiXVxuICAgICAgdGhpcy5icmVha3BvaW50TWFuYWdlci5hZGRDb25kaXRpb24oYnAsIGNvbmQpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pXG4gIH1cblxuICByZW1vdmVCcmVha3BvaW50IChpdGVtKSB7XG4gICAgdGhpcy5icmVha3BvaW50TWFuYWdlci5yZW1vdmUoaXRlbSlcbiAgfVxuXG4gIGdldEljb25OYW1lICgpIHtcbiAgICByZXR1cm4gJ2J1ZydcbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbkRlYnVnZ2VyUGFuZS5yZWdpc3RlclZpZXcoKVxuIl19