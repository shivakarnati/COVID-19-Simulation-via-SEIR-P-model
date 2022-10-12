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
var Workspace = (function (_PaneItem) {
  _inherits(Workspace, _PaneItem);

  function Workspace() {
    var _this = this;

    _classCallCheck(this, Workspace);

    _get(Object.getPrototypeOf(Workspace.prototype), 'constructor', this).call(this);
    this.items = [];
    this.setTitle('Workspace');

    this.searchEd = new _atom.TextEditor({ mini: true, placeholderText: "Filter" });
    this.filteredItems = [];

    this.searchEd.onDidStopChanging(function () {
      return _this.filterItems(_this.searchEd.getText());
    });

    this.subs = new _atom.CompositeDisposable();

    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);
    this.element.classList.add('ink-workspace');
  }

  _createClass(Workspace, [{
    key: 'open',
    value: function open(opts) {
      return _get(Object.getPrototypeOf(Workspace.prototype), 'open', this).call(this, opts).then(function (workspace) {
        workspace.searchEd.getElement().focus();
      });
    }
  }, {
    key: 'setItems',
    value: function setItems(items) {
      this.items = items;
      this.filterItems(this.searchEd.getText());
      _etch2['default'].update(this);
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      console.log("refresh");
      // no-op unless overwritten
    }
  }, {
    key: 'filterItems',
    value: function filterItems(query) {
      var _this2 = this;

      if (query.length == 0) {
        this.filteredItems = this.items;
        _etch2['default'].update(this);
        return;
      }

      this.filteredItems = [];
      this.items.forEach(function (context) {
        var _ctx = {
          context: context.context,
          items: fuzzaldrinPlus.filter(context.items, query, { key: 'name' })
        };
        if (_ctx.items.length > 0) {
          _ctx.items.sort(function (a, b) {
            return b.score - a.score;
          });
          _this2.filteredItems.push(_ctx);
        }
      });

      _etch2['default'].update(this);
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'book';
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _etch2['default'].dom(
        'div',
        null,
        _etch2['default'].dom(
          'div',
          { className: 'workspace-header' },
          _etch2['default'].dom(
            'span',
            { className: 'header-main' },
            _etch2['default'].dom(
              'span',
              { className: 'search-editor' },
              (0, _utilEtch.toView)(this.searchEd.element)
            ),
            _etch2['default'].dom(
              'span',
              { className: 'btn-group' },
              _etch2['default'].dom(_utilEtch.Button, { alt: 'Refresh', icon: 'repo-sync', onclick: function () {
                  return _this3.refresh();
                } }),
              _etch2['default'].dom(_utilEtch.Button, { alt: 'Set Module', icon: 'package', onclick: function () {
                  return _this3.refreshModule();
                } })
            )
          )
        ),
        _etch2['default'].dom(
          'div',
          { className: 'workspace-content' },
          this.filteredItems.map(function (_ref) {
            var context = _ref.context;
            var items = _ref.items;
            return _etch2['default'].dom(
              'div',
              { className: 'context' },
              _etch2['default'].dom(
                'div',
                { className: 'header' },
                context
              ),
              _etch2['default'].dom(
                'table',
                { className: 'items' },
                items.map(function (_ref2) {
                  var name = _ref2.name;
                  var type = _ref2.type;
                  var nativetype = _ref2.nativetype;
                  var icon = _ref2.icon;
                  var value = _ref2.value;
                  var onClick = _ref2.onClick;
                  return _etch2['default'].dom(
                    'tr',
                    { key: context + '-' + name },
                    _etch2['default'].dom(
                      'td',
                      {
                        className: 'icon ' + type,
                        title: nativetype
                      },
                      (0, _utilEtch.makeIcon)(icon)
                    ),
                    _etch2['default'].dom(
                      'td',
                      { className: 'name' },
                      _etch2['default'].dom(
                        'a',
                        { onClick: onClick },
                        name
                      )
                    ),
                    _etch2['default'].dom(
                      'td',
                      { className: 'value' },
                      (0, _utilEtch.toView)(value)
                    )
                  );
                })
              )
            );
          })
        )
      );
    }
  }]);

  return Workspace;
})(_utilPaneItem2['default']);

exports['default'] = Workspace;

Workspace.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi93b3Jrc3BhY2Uvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFHZ0QsTUFBTTs7b0JBQ3JDLE1BQU07Ozs7OEJBQ1MsaUJBQWlCOztJQUFyQyxjQUFjOzs0QkFFTCxtQkFBbUI7Ozs7d0JBQ0MsY0FBYzs7QUFSdkQsV0FBVyxDQUFBO0lBVVUsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxHQUNkOzs7MEJBREssU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRW5CO0FBQ1AsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7QUFDZixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUUxQixRQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFlLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtBQUN2RSxRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQTs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzthQUFNLE1BQUssV0FBVyxDQUFDLE1BQUssUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUVoRixRQUFJLENBQUMsSUFBSSxHQUFHLCtCQUF5QixDQUFBOztBQUVyQyxzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0dBQzVDOztlQWhCa0IsU0FBUzs7V0FrQnhCLGNBQUMsSUFBSSxFQUFFO0FBQ1QsYUFBTywyQkFuQlUsU0FBUyxzQ0FtQlIsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFBLFNBQVMsRUFBSTtBQUN4QyxpQkFBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtPQUN4QyxDQUFDLENBQUE7S0FDSDs7O1dBRU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDekMsd0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xCOzs7V0FFTyxtQkFBRztBQUNULGFBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7O0tBRXhCOzs7V0FFVyxxQkFBQyxLQUFLLEVBQUU7OztBQUNsQixVQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtBQUMvQiwwQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakIsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzVCLFlBQU0sSUFBSSxHQUFHO0FBQ1gsaUJBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztBQUN4QixlQUFLLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQztTQUNsRSxDQUFBO0FBQ0QsWUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzttQkFBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLO1dBQUEsQ0FBQyxDQUFBO0FBQzVDLGlCQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDOUI7T0FDRixDQUFDLENBQUE7O0FBRUYsd0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xCOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVLLGtCQUFHLEVBQUU7OztXQUVMLGtCQUFHOzs7QUFDUCxhQUFPOzs7UUFDTDs7WUFBSyxTQUFTLEVBQUMsa0JBQWtCO1VBQy9COztjQUFNLFNBQVMsRUFBQyxhQUFhO1lBQzNCOztnQkFBTSxTQUFTLEVBQUMsZUFBZTtjQUFFLHNCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQVE7WUFDdEU7O2dCQUFNLFNBQVMsRUFBQyxXQUFXO2NBQ3pCLDBDQUFRLEdBQUcsRUFBQyxTQUFTLEVBQUMsSUFBSSxFQUFDLFdBQVcsRUFBQyxPQUFPLEVBQUU7eUJBQU0sT0FBSyxPQUFPLEVBQUU7aUJBQUEsQUFBQyxHQUFFO2NBQ3ZFLDBDQUFRLEdBQUcsRUFBQyxZQUFZLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUU7eUJBQU0sT0FBSyxhQUFhLEVBQUU7aUJBQUEsQUFBQyxHQUFFO2FBQ3pFO1dBQ0Y7U0FDSDtRQUNOOztZQUFLLFNBQVMsRUFBQyxtQkFBbUI7VUFFOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFnQjtnQkFBZixPQUFPLEdBQVIsSUFBZ0IsQ0FBZixPQUFPO2dCQUFFLEtBQUssR0FBZixJQUFnQixDQUFOLEtBQUs7bUJBQ3JDOztnQkFBSyxTQUFTLEVBQUMsU0FBUztjQUN0Qjs7a0JBQUssU0FBUyxFQUFDLFFBQVE7Z0JBQUUsT0FBTztlQUFPO2NBQ3ZDOztrQkFBTyxTQUFTLEVBQUMsT0FBTztnQkFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQWdEO3NCQUE5QyxJQUFJLEdBQU4sS0FBZ0QsQ0FBOUMsSUFBSTtzQkFBRSxJQUFJLEdBQVosS0FBZ0QsQ0FBeEMsSUFBSTtzQkFBRSxVQUFVLEdBQXhCLEtBQWdELENBQWxDLFVBQVU7c0JBQUUsSUFBSSxHQUE5QixLQUFnRCxDQUF0QixJQUFJO3NCQUFFLEtBQUssR0FBckMsS0FBZ0QsQ0FBaEIsS0FBSztzQkFBRSxPQUFPLEdBQTlDLEtBQWdELENBQVQsT0FBTzt5QkFDeEQ7O3NCQUFJLEdBQUcsRUFBSyxPQUFPLFNBQUksSUFBSSxBQUFHO29CQUM1Qjs7O0FBQ0UsaUNBQVMsWUFBVSxJQUFJLEFBQUc7QUFDMUIsNkJBQUssRUFBRSxVQUFVLEFBQUM7O3NCQUVqQix3QkFBUyxJQUFJLENBQUM7cUJBQ1o7b0JBQ0w7O3dCQUFJLFNBQVMsRUFBQyxNQUFNO3NCQUNsQjs7MEJBQUcsT0FBTyxFQUFFLE9BQU8sQUFBQzt3QkFDakIsSUFBSTt1QkFDSDtxQkFDRDtvQkFDTDs7d0JBQUksU0FBUyxFQUFDLE9BQU87c0JBQUUsc0JBQU8sS0FBSyxDQUFDO3FCQUFNO21CQUN2QztpQkFBQSxDQUNOO2VBQ0s7YUFDSjtXQUFBLENBQ1A7U0FFQztPQUNGLENBQUE7S0FDUDs7O1NBdEdrQixTQUFTOzs7cUJBQVQsU0FBUzs7QUEwRzlCLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvd29ya3NwYWNlL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgeyBUZXh0RWRpdG9yLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBldGNoIGZyb20gXCJldGNoXCJcbmltcG9ydCAqIGFzIGZ1enphbGRyaW5QbHVzIGZyb20gJ2Z1enphbGRyaW4tcGx1cydcblxuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL3V0aWwvcGFuZS1pdGVtJ1xuaW1wb3J0IHsgdG9WaWV3LCBtYWtlSWNvbiwgQnV0dG9uIH0gZnJvbSAnLi4vdXRpbC9ldGNoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3Jrc3BhY2UgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLml0ZW1zID0gW11cbiAgICB0aGlzLnNldFRpdGxlKCdXb3Jrc3BhY2UnKVxuXG4gICAgdGhpcy5zZWFyY2hFZCA9IG5ldyBUZXh0RWRpdG9yKHttaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwiRmlsdGVyXCJ9KVxuICAgIHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdXG5cbiAgICB0aGlzLnNlYXJjaEVkLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IHRoaXMuZmlsdGVySXRlbXModGhpcy5zZWFyY2hFZC5nZXRUZXh0KCkpKVxuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSlcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW5rLXdvcmtzcGFjZScpXG4gIH1cblxuICBvcGVuKG9wdHMpIHtcbiAgICByZXR1cm4gc3VwZXIub3BlbihvcHRzKS50aGVuKHdvcmtzcGFjZSA9PiB7XG4gICAgICB3b3Jrc3BhY2Uuc2VhcmNoRWQuZ2V0RWxlbWVudCgpLmZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICB0aGlzLml0ZW1zID0gaXRlbXNcbiAgICB0aGlzLmZpbHRlckl0ZW1zKHRoaXMuc2VhcmNoRWQuZ2V0VGV4dCgpKVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZWZyZXNoICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hcIik7XG4gICAgLy8gbm8tb3AgdW5sZXNzIG92ZXJ3cml0dGVuXG4gIH1cblxuICBmaWx0ZXJJdGVtcyAocXVlcnkpIHtcbiAgICBpZiAocXVlcnkubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXNcbiAgICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXVxuICAgIHRoaXMuaXRlbXMuZm9yRWFjaChjb250ZXh0ID0+IHtcbiAgICAgIGNvbnN0IF9jdHggPSB7XG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHQuY29udGV4dCxcbiAgICAgICAgaXRlbXM6IGZ1enphbGRyaW5QbHVzLmZpbHRlcihjb250ZXh0Lml0ZW1zLCBxdWVyeSwge2tleTogJ25hbWUnfSlcbiAgICAgIH1cbiAgICAgIGlmIChfY3R4Lml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgX2N0eC5pdGVtcy5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSlcbiAgICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zLnB1c2goX2N0eClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiAnYm9vayc7XG4gIH1cblxuICB1cGRhdGUoKSB7fVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid29ya3NwYWNlLWhlYWRlclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoZWFkZXItbWFpblwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlYXJjaC1lZGl0b3JcIj57dG9WaWV3KHRoaXMuc2VhcmNoRWQuZWxlbWVudCl9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPEJ1dHRvbiBhbHQ9J1JlZnJlc2gnIGljb249XCJyZXBvLXN5bmNcIiBvbmNsaWNrPXsoKSA9PiB0aGlzLnJlZnJlc2goKX0vPlxuICAgICAgICAgICAgPEJ1dHRvbiBhbHQ9J1NldCBNb2R1bGUnIGljb249XCJwYWNrYWdlXCIgb25jbGljaz17KCkgPT4gdGhpcy5yZWZyZXNoTW9kdWxlKCl9Lz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3b3Jrc3BhY2UtY29udGVudFwiPlxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zLm1hcCgoe2NvbnRleHQsIGl0ZW1zfSkgPT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGV4dFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPntjb250ZXh0fTwvZGl2PlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwiaXRlbXNcIj5cbiAgICAgICAgICAgICAgICB7aXRlbXMubWFwKCh7IG5hbWUsIHR5cGUsIG5hdGl2ZXR5cGUsIGljb24sIHZhbHVlLCBvbkNsaWNrIH0pID0+XG4gICAgICAgICAgICAgICAgICA8dHIga2V5PXtgJHtjb250ZXh0fS0ke25hbWV9YH0+XG4gICAgICAgICAgICAgICAgICAgIDx0ZFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGljb24gJHt0eXBlfWB9XG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e25hdGl2ZXR5cGV9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7bWFrZUljb24oaWNvbil9XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJuYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0b1ZpZXcodmFsdWUpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICB9XG5cbn1cblxuV29ya3NwYWNlLnJlZ2lzdGVyVmlldygpO1xuIl19