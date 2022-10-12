Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var NotePane = (function (_PaneItem) {
  _inherits(NotePane, _PaneItem);

  function NotePane() {
    _classCallCheck(this, NotePane);

    _get(Object.getPrototypeOf(NotePane.prototype), 'constructor', this).call(this);
    this.note = '';
    this.setTitle('Note');
    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);
  }

  _createClass(NotePane, [{
    key: 'open',
    value: function open(opts) {
      return _get(Object.getPrototypeOf(NotePane.prototype), 'open', this).call(this, opts);
    }
  }, {
    key: 'setNote',
    value: function setNote(note) {
      this.note = note;
      _etch2['default'].update(this);
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom('div', { innerHTML: (0, _marked2['default'])(this.note), className: 'ink notepane' });
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'book';
    }
  }]);

  return NotePane;
})(_utilPaneItem2['default']);

exports['default'] = NotePane;

NotePane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9ub3RlL25vdGVwYW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O3NCQUNKLFFBQVE7Ozs7NEJBRU4sbUJBQW1COzs7O0lBRW5CLFFBQVE7WUFBUixRQUFROztBQUNmLFdBRE8sUUFBUSxHQUNaOzBCQURJLFFBQVE7O0FBRXpCLCtCQUZpQixRQUFRLDZDQUVsQjtBQUNQLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2QsUUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyQixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDMUM7O2VBUGtCLFFBQVE7O1dBU3RCLGNBQUMsSUFBSSxFQUFFO0FBQ1Ysd0NBVmlCLFFBQVEsc0NBVVAsSUFBSSxFQUFDO0tBQ3hCOzs7V0FFTyxpQkFBQyxJQUFJLEVBQUU7QUFDYixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQix3QkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEI7OztXQUVNLGtCQUFHLEVBQUU7OztXQUVMLGtCQUFHO0FBQ1IsYUFBTywrQkFBSyxTQUFTLEVBQUUseUJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGNBQWMsR0FBTyxDQUFBO0tBQzFFOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztTQTFCa0IsUUFBUTs7O3FCQUFSLFFBQVE7O0FBNkI3QixRQUFRLENBQUMsWUFBWSxFQUFFLENBQUEiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL25vdGUvbm90ZXBhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5cbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90ZVBhbmUgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ub3RlID0gJydcbiAgICB0aGlzLnNldFRpdGxlKCdOb3RlJylcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKVxuICB9XG5cbiAgb3BlbiAob3B0cykge1xuICAgIHJldHVybiBzdXBlci5vcGVuKG9wdHMpXG4gIH1cblxuICBzZXROb3RlIChub3RlKSB7XG4gICAgdGhpcy5ub3RlID0gbm90ZVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiA8ZGl2IGlubmVySFRNTD17bWFya2VkKHRoaXMubm90ZSl9IGNsYXNzTmFtZT1cImluayBub3RlcGFuZVwiPjwvZGl2PlxuICB9XG5cbiAgZ2V0SWNvbk5hbWUgKCkge1xuICAgIHJldHVybiAnYm9vaydcbiAgfVxufVxuXG5Ob3RlUGFuZS5yZWdpc3RlclZpZXcoKVxuIl19