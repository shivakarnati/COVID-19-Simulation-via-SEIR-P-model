Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilEtchJs = require('../util/etch.js');

var _atom = require('atom');

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilOpener = require('../util/opener');

// pane for side-to-side view of compiled code and source code
'use babel';
var CompiledPane = (function (_PaneItem) {
  _inherits(CompiledPane, _PaneItem);

  _createClass(CompiledPane, null, [{
    key: 'activate',
    value: function activate() {
      subs = new _atom.CompositeDisposable();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      subs.dispose();
    }
  }]);

  function CompiledPane(opts) {
    _classCallCheck(this, CompiledPane);

    _get(Object.getPrototypeOf(CompiledPane.prototype), 'constructor', this).call(this);

    this.name = 'CompiledPane';
    this.setTitle('Compiled Code');
    this.code = [];
    this.header = "";

    _etch2['default'].initialize(this);
  }

  _createClass(CompiledPane, [{
    key: 'showCode',
    value: function showCode(name, header, code) {
      this.getTitle = function () {
        return name;
      };
      this.header = header;
      this.code = code;
      _etch2['default'].update(this);
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'ink-compiled-code-container' },
        _etch2['default'].dom(
          'div',
          { className: 'ink-compiled-header' },
          this.header || ''
        ),
        _etch2['default'].dom(
          'div',
          { className: 'ink-compiled-code' },
          this.code.map(function (line) {
            return _etch2['default'].dom(
              'div',
              { className: 'ink-compiled-line' },
              _etch2['default'].dom(
                'div',
                { className: 'ink-compiled-line-number' },
                line[0]
              ),
              _etch2['default'].dom(
                'div',
                { className: 'ink-compiled-line-content' },
                line[1]
              )
            );
          })
        )
      );
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'alert';
    }
  }]);

  return CompiledPane;
})(_utilPaneItem2['default']);

exports['default'] = CompiledPane;

CompiledPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9saW50ZXIvY29tcGlsZWQtcGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzBCQUNILGlCQUFpQjs7b0JBQ0QsTUFBTTs7NEJBQ3JCLG1CQUFtQjs7OzswQkFDbkIsZ0JBQWdCOzs7QUFQckMsV0FBVyxDQUFBO0lBVVUsWUFBWTtZQUFaLFlBQVk7O2VBQVosWUFBWTs7V0FHZixvQkFBRztBQUNqQixVQUFJLEdBQUcsK0JBQXlCLENBQUE7S0FDakM7OztXQUVpQixzQkFBRztBQUNuQixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDZjs7O0FBRVcsV0FYTyxZQUFZLENBV2xCLElBQUksRUFBRTswQkFYQSxZQUFZOztBQVk3QiwrQkFaaUIsWUFBWSw2Q0FZdEI7O1NBWFQsSUFBSSxHQUFHLGNBQWM7QUFhbkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM5QixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUNkLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBOztBQUVoQixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBbkJrQixZQUFZOztXQXFCdEIsa0JBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDNUIsVUFBSSxDQUFDLFFBQVEsR0FBRztlQUFNLElBQUk7T0FBQSxDQUFBO0FBQzFCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLHdCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQjs7O1dBRU0sa0JBQUcsRUFBRTs7O1dBRUwsa0JBQUc7QUFDUixhQUFROztVQUFLLFNBQVMsRUFBQyw2QkFBNkI7UUFDMUM7O1lBQUssU0FBUyxFQUFDLHFCQUFxQjtVQUNoQyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUU7U0FDZjtRQUNOOztZQUFLLFNBQVMsRUFBQyxtQkFBbUI7VUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDcEIsbUJBQVE7O2dCQUFLLFNBQVMsRUFBQyxtQkFBbUI7Y0FDaEM7O2tCQUFLLFNBQVMsRUFBQywwQkFBMEI7Z0JBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztlQUFPO2NBQ3pEOztrQkFBSyxTQUFTLEVBQUMsMkJBQTJCO2dCQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7ZUFBTzthQUN0RCxDQUFBO1dBQ2YsQ0FBQztTQUVBO09BQ0YsQ0FBQTtLQUNmOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sT0FBTyxDQUFBO0tBQ2Y7OztTQWxEa0IsWUFBWTs7O3FCQUFaLFlBQVk7O0FBcURqQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUEiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2xpbnRlci9jb21waWxlZC1wYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBSYXcgfSBmcm9tICcuLi91dGlsL2V0Y2guanMnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcbmltcG9ydCB7IG9wZW4gfSBmcm9tICcuLi91dGlsL29wZW5lcidcblxuLy8gcGFuZSBmb3Igc2lkZS10by1zaWRlIHZpZXcgb2YgY29tcGlsZWQgY29kZSBhbmQgc291cmNlIGNvZGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVkUGFuZSBleHRlbmRzIFBhbmVJdGVtIHtcbiAgbmFtZSA9ICdDb21waWxlZFBhbmUnXG5cbiAgc3RhdGljIGFjdGl2YXRlICgpIHtcbiAgICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUgKCkge1xuICAgIHN1YnMuZGlzcG9zZSgpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc2V0VGl0bGUoJ0NvbXBpbGVkIENvZGUnKVxuICAgIHRoaXMuY29kZSA9IFtdXG4gICAgdGhpcy5oZWFkZXIgPSBcIlwiXG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHNob3dDb2RlIChuYW1lLCBoZWFkZXIsIGNvZGUpIHtcbiAgICB0aGlzLmdldFRpdGxlID0gKCkgPT4gbmFtZVxuICAgIHRoaXMuaGVhZGVyID0gaGVhZGVyXG4gICAgdGhpcy5jb2RlID0gY29kZVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJpbmstY29tcGlsZWQtY29kZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmstY29tcGlsZWQtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgIHt0aGlzLmhlYWRlciB8fCAnJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5rLWNvbXBpbGVkLWNvZGVcIj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNvZGUubWFwKGxpbmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwiaW5rLWNvbXBpbGVkLWxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5rLWNvbXBpbGVkLWxpbmUtbnVtYmVyXCI+e2xpbmVbMF19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluay1jb21waWxlZC1saW5lLWNvbnRlbnRcIj57bGluZVsxXX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICB9XG5cbiAgZ2V0SWNvbk5hbWUgKCkge1xuICAgIHJldHVybiAnYWxlcnQnXG4gIH1cbn1cblxuQ29tcGlsZWRQYW5lLnJlZ2lzdGVyVmlldygpXG4iXX0=