Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _atom = require('atom');

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var fuzzaldrinPlus = _interopRequireWildcard(_fuzzaldrinPlus);

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilEtch = require('../util/etch');

'use babel';
var Outline = (function (_PaneItem) {
  _inherits(Outline, _PaneItem);

  function Outline() {
    var _this = this;

    _classCallCheck(this, Outline);

    _get(Object.getPrototypeOf(Outline.prototype), 'constructor', this).call(this);
    this.items = [];
    this.setTitle('Outline');

    this.searchEd = new _atom.TextEditor({ mini: true, placeholderText: "Filter" });
    this.filteredItems = [];

    this.searchEd.onDidStopChanging(function () {
      return _this.filterItems(_this.searchEd.getText());
    });

    this.subs = new _atom.CompositeDisposable();

    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);
  }

  _createClass(Outline, [{
    key: 'setItems',
    value: function setItems(items) {
      this.items = items;
      this.filterItems(this.searchEd.getText());

      _etch2['default'].update(this);
    }
  }, {
    key: 'filterItems',
    value: function filterItems(query) {
      if (query.length == 0) {
        this.filteredItems = this.items;
      } else {
        this.filteredItems = [];
        var _items = fuzzaldrinPlus.filter(this.items, query, { key: 'name' });
        if (_items.length > 0) {
          _items.sort(function (a, b) {
            return b.score - a.score;
          });
          this.filteredItems = _items;
        }
      }

      _etch2['default'].update(this);
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'list-unordered';
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      var hasItems = this.items.length > 0;
      return _etch2['default'].dom(
        'div',
        { className: 'ink-outline' },
        _etch2['default'].dom(
          'div',
          { className: 'outline-header' },
          _etch2['default'].dom(
            'span',
            { className: 'header-main' },
            _etch2['default'].dom(
              'span',
              { className: 'search-editor' },
              (0, _utilEtch.toView)(this.searchEd.element)
            )
          )
        ),
        _etch2['default'].dom(
          'div',
          { className: 'outline-content' },
          _etch2['default'].dom(
            'table',
            { className: 'items' },
            this.filteredItems.map(function (_ref) {
              var name = _ref.name;
              var icon = _ref.icon;
              var type = _ref.type;
              var onClick = _ref.onClick;
              var isActive = _ref.isActive;
              return _etch2['default'].dom(
                'tr',
                {
                  className: isActive ? 'isactive' : '',
                  ref: isActive ? "activeElement" : "",
                  onClick: onClick
                },
                _etch2['default'].dom(
                  'td',
                  { className: 'icon ' + type },
                  (0, _utilEtch.makeIcon)(icon)
                ),
                _etch2['default'].dom(
                  'td',
                  { className: 'name' },
                  name
                )
              );
            })
          ),
          _etch2['default'].dom(
            'ul',
            { className: hasItems ? 'hidden' : 'background-message centered' },
            _etch2['default'].dom(
              'li',
              null,
              'No outline for this editor.'
            )
          )
        )
      );
    }
  }, {
    key: 'writeAfterUpdate',
    value: function writeAfterUpdate() {
      if (this.refs.activeElement) {
        this.refs.activeElement.scrollIntoView();
      }
    }
  }]);

  return Outline;
})(_utilPaneItem2['default']);

exports['default'] = Outline;

Outline.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9vdXRsaW5lL291dGxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdnRCxNQUFNOztvQkFDckMsTUFBTTs7Ozs4QkFDUyxpQkFBaUI7O0lBQXJDLGNBQWM7OzRCQUVMLG1CQUFtQjs7Ozt3QkFDQyxjQUFjOztBQVJ2RCxXQUFXLENBQUE7SUFVVSxPQUFPO1lBQVAsT0FBTzs7QUFDZCxXQURPLE9BQU8sR0FDWDs7OzBCQURJLE9BQU87O0FBRXhCLCtCQUZpQixPQUFPLDZDQUVqQjtBQUNQLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0FBQ2YsUUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxxQkFBZSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDdkUsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUE7O0FBRXZCLFFBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUM7YUFBTSxNQUFLLFdBQVcsQ0FBQyxNQUFLLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFaEYsUUFBSSxDQUFDLElBQUksR0FBRywrQkFBeUIsQ0FBQTs7QUFFckMsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzFDOztlQWZrQixPQUFPOztXQWlCakIsa0JBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7O0FBRXpDLHdCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQjs7O1dBRVcscUJBQUMsS0FBSyxFQUFFO0FBQ2xCLFVBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDckIsWUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO09BQ2hDLE1BQU07QUFDTCxZQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQTtBQUN2QixZQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7QUFDcEUsWUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQixnQkFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO21CQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUs7V0FBQSxDQUFDLENBQUE7QUFDeEMsY0FBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUE7U0FDNUI7T0FDRjs7QUFFRCx3QkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEI7OztXQUVXLHVCQUFHO0FBQ2IsYUFBTyxnQkFBZ0IsQ0FBQztLQUN6Qjs7O1dBRU0sa0JBQUcsRUFBRTs7O1dBRUwsa0JBQUc7QUFDUixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7QUFDdEMsYUFBTzs7VUFBSyxTQUFTLEVBQUMsYUFBYTtRQUNqQzs7WUFBSyxTQUFTLEVBQUMsZ0JBQWdCO1VBQzdCOztjQUFNLFNBQVMsRUFBQyxhQUFhO1lBQzNCOztnQkFBTSxTQUFTLEVBQUMsZUFBZTtjQUFFLHNCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQVE7V0FDakU7U0FDSDtRQUNOOztZQUFLLFNBQVMsRUFBQyxpQkFBaUI7VUFDOUI7O2NBQU8sU0FBUyxFQUFDLE9BQU87WUFFcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFxQztrQkFBcEMsSUFBSSxHQUFMLElBQXFDLENBQXBDLElBQUk7a0JBQUUsSUFBSSxHQUFYLElBQXFDLENBQTlCLElBQUk7a0JBQUUsSUFBSSxHQUFqQixJQUFxQyxDQUF4QixJQUFJO2tCQUFFLE9BQU8sR0FBMUIsSUFBcUMsQ0FBbEIsT0FBTztrQkFBRSxRQUFRLEdBQXBDLElBQXFDLENBQVQsUUFBUTtxQkFDMUQ7OztBQUNFLDJCQUFTLEVBQUUsUUFBUSxHQUFHLFVBQVUsR0FBRyxFQUFFLEFBQUM7QUFDdEMscUJBQUcsRUFBRSxRQUFRLEdBQUcsZUFBZSxHQUFHLEVBQUUsQUFBQztBQUNyQyx5QkFBTyxFQUFFLE9BQU8sQUFBQzs7Z0JBRWpCOztvQkFBSSxTQUFTLFlBQVUsSUFBSSxBQUFHO2tCQUFFLHdCQUFTLElBQUksQ0FBQztpQkFBTTtnQkFDcEQ7O29CQUFJLFNBQVMsRUFBQyxNQUFNO2tCQUFFLElBQUk7aUJBQU07ZUFDN0I7YUFBQSxDQUNOO1dBRUc7VUFDUjs7Y0FBSSxTQUFTLEVBQUUsUUFBUSxHQUFHLFFBQVEsR0FBRyw2QkFBNkIsQUFBQztZQUNqRTs7OzthQUFvQztXQUNqQztTQUNEO09BQ0YsQ0FBQTtLQUNQOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUMzQixZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtPQUN6QztLQUNGOzs7U0EvRWtCLE9BQU87OztxQkFBUCxPQUFPOztBQW1GNUIsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9vdXRsaW5lL291dGxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IHsgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZXRjaCBmcm9tIFwiZXRjaFwiXG5pbXBvcnQgKiBhcyBmdXp6YWxkcmluUGx1cyBmcm9tICdmdXp6YWxkcmluLXBsdXMnXG5cbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcbmltcG9ydCB7IHRvVmlldywgbWFrZUljb24sIEJ1dHRvbiB9IGZyb20gJy4uL3V0aWwvZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0bGluZSBleHRlbmRzIFBhbmVJdGVtIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLml0ZW1zID0gW11cbiAgICB0aGlzLnNldFRpdGxlKCdPdXRsaW5lJylcblxuICAgIHRoaXMuc2VhcmNoRWQgPSBuZXcgVGV4dEVkaXRvcih7bWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIkZpbHRlclwifSlcbiAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXVxuXG4gICAgdGhpcy5zZWFyY2hFZC5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB0aGlzLmZpbHRlckl0ZW1zKHRoaXMuc2VhcmNoRWQuZ2V0VGV4dCgpKSlcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpXG4gIH1cblxuICBzZXRJdGVtcyAoaXRlbXMpIHtcbiAgICB0aGlzLml0ZW1zID0gaXRlbXNcbiAgICB0aGlzLmZpbHRlckl0ZW1zKHRoaXMuc2VhcmNoRWQuZ2V0VGV4dCgpKVxuXG4gICAgZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIGZpbHRlckl0ZW1zIChxdWVyeSkge1xuICAgIGlmIChxdWVyeS5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtc1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXVxuICAgICAgbGV0IF9pdGVtcyA9IGZ1enphbGRyaW5QbHVzLmZpbHRlcih0aGlzLml0ZW1zLCBxdWVyeSwge2tleTogJ25hbWUnfSlcbiAgICAgIGlmIChfaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfaXRlbXMuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpXG4gICAgICAgIHRoaXMuZmlsdGVyZWRJdGVtcyA9IF9pdGVtc1xuICAgICAgfVxuICAgIH1cblxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBnZXRJY29uTmFtZSAoKSB7XG4gICAgcmV0dXJuICdsaXN0LXVub3JkZXJlZCc7XG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGhhc0l0ZW1zID0gdGhpcy5pdGVtcy5sZW5ndGggPiAwXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW5rLW91dGxpbmVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3V0bGluZS1oZWFkZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGVhZGVyLW1haW5cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzZWFyY2gtZWRpdG9yXCI+e3RvVmlldyh0aGlzLnNlYXJjaEVkLmVsZW1lbnQpfTwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm91dGxpbmUtY29udGVudFwiPlxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwiaXRlbXNcIj5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkSXRlbXMubWFwKCh7bmFtZSwgaWNvbiwgdHlwZSwgb25DbGljaywgaXNBY3RpdmV9KSA9PlxuICAgICAgICAgICAgICA8dHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2lzQWN0aXZlID8gJ2lzYWN0aXZlJyA6ICcnfVxuICAgICAgICAgICAgICAgIHJlZj17aXNBY3RpdmUgPyBcImFjdGl2ZUVsZW1lbnRcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2BpY29uICR7dHlwZX1gfT57bWFrZUljb24oaWNvbil9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibmFtZVwiPntuYW1lfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtoYXNJdGVtcyA/ICdoaWRkZW4nIDogJ2JhY2tncm91bmQtbWVzc2FnZSBjZW50ZXJlZCd9PlxuICAgICAgICAgIDxsaT5ObyBvdXRsaW5lIGZvciB0aGlzIGVkaXRvci48L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICB3cml0ZUFmdGVyVXBkYXRlICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVmcy5hY3RpdmVFbGVtZW50LnNjcm9sbEludG9WaWV3KClcbiAgICB9XG4gIH1cblxufVxuXG5PdXRsaW5lLnJlZ2lzdGVyVmlldygpO1xuIl19