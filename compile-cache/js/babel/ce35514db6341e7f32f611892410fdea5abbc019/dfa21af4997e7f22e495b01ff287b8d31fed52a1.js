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

var _atom = require('atom');

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilEtch = require('../util/etch');

'use babel';
var HTMLPane = (function (_PaneItem) {
  _inherits(HTMLPane, _PaneItem);

  function HTMLPane() {
    _classCallCheck(this, HTMLPane);

    _get(Object.getPrototypeOf(HTMLPane.prototype), 'constructor', this).call(this);

    this.emitter = new _atom.Emitter();

    this.setTitle('HTMLPane');
    this.item = undefined;
    this.icon = 'graph';

    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);
  }

  _createClass(HTMLPane, [{
    key: 'show',
    value: function show(opts) {
      if (opts.item) this.item = opts.item;
      if (opts.title) {
        this.setTitle(opts.title);
      }
      if (opts.icon) {
        this.icon = opts.icon;
        this.emitter.emit('change-icon', opts.icon);
      }

      this.update();
    }
  }, {
    key: 'onDidChangeIcon',
    value: function onDidChangeIcon(f) {
      return this.emitter.on('change-icon', f);
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'span',
        { className: 'ink-plot-pane' },
        _etch2['default'].dom(
          'div',
          { className: 'ink-plot-pane-container fill' },
          (0, _utilEtch.toView)(this.item)
        )
      );
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return this.icon;
    }

    // prevent serialization
  }, {
    key: 'serialize',
    value: function serialize() {
      return undefined;
    }
  }]);

  return HTMLPane;
})(_utilPaneItem2['default']);

exports['default'] = HTMLPane;

HTMLPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9wbG90cy9odG1scGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUVDLE1BQU07OzRCQUNULG1CQUFtQjs7Ozt3QkFDakIsY0FBYzs7QUFQckMsV0FBVyxDQUFBO0lBU1UsUUFBUTtZQUFSLFFBQVE7O0FBQ2hCLFdBRFEsUUFBUSxHQUNiOzBCQURLLFFBQVE7O0FBRXpCLCtCQUZpQixRQUFRLDZDQUVsQjs7QUFFUCxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7O0FBRTVCLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUE7QUFDckIsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7O0FBRW5CLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNyQixRQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMxQzs7ZUFaa0IsUUFBUTs7V0FjdEIsY0FBQyxJQUFJLEVBQUU7QUFDVixVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3BDLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzFCO0FBQ0QsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDNUM7O0FBRUQsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ2Q7OztXQUVlLHlCQUFDLENBQUMsRUFBRTtBQUNsQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtLQUN6Qzs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPOztVQUFNLFNBQVMsRUFBQyxlQUFlO1FBQzdCOztZQUFLLFNBQVMsRUFBQyw4QkFBOEI7VUFDMUMsc0JBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNkO09BQ0QsQ0FBQTtLQUNmOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtLQUNqQjs7Ozs7V0FHUyxxQkFBRztBQUNYLGFBQU8sU0FBUyxDQUFBO0tBQ2pCOzs7U0FsRGtCLFFBQVE7OztxQkFBUixRQUFROztBQXFEN0IsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFBIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9wbG90cy9odG1scGFuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5pbXBvcnQgeyBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcbmltcG9ydCB7IHRvVmlldyB9IGZyb20gJy4uL3V0aWwvZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFRNTFBhbmUgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMuc2V0VGl0bGUoJ0hUTUxQYW5lJylcbiAgICB0aGlzLml0ZW0gPSB1bmRlZmluZWRcbiAgICB0aGlzLmljb24gPSAnZ3JhcGgnXG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKVxuICB9XG5cbiAgc2hvdyAob3B0cykge1xuICAgIGlmIChvcHRzLml0ZW0pIHRoaXMuaXRlbSA9IG9wdHMuaXRlbVxuICAgIGlmIChvcHRzLnRpdGxlKSB7XG4gICAgICB0aGlzLnNldFRpdGxlKG9wdHMudGl0bGUpXG4gICAgfVxuICAgIGlmIChvcHRzLmljb24pIHtcbiAgICAgIHRoaXMuaWNvbiA9IG9wdHMuaWNvblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NoYW5nZS1pY29uJywgb3B0cy5pY29uKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlKClcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlSWNvbiAoZikge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NoYW5nZS1pY29uJywgZilcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSdpbmstcGxvdC1wYW5lJz5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluay1wbG90LXBhbmUtY29udGFpbmVyIGZpbGxcIj5cbiAgICAgICAgICAgICAgIHt0b1ZpZXcodGhpcy5pdGVtKX1cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgPC9zcGFuPlxuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWNvblxuICB9XG5cbiAgLy8gcHJldmVudCBzZXJpYWxpemF0aW9uXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbkhUTUxQYW5lLnJlZ2lzdGVyVmlldygpXG4iXX0=