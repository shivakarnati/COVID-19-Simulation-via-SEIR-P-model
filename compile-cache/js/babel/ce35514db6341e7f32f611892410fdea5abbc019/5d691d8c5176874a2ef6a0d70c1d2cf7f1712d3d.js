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

'use babel';
var LinterPane = (function (_PaneItem) {
  _inherits(LinterPane, _PaneItem);

  _createClass(LinterPane, null, [{
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

  function LinterPane(opts) {
    _classCallCheck(this, LinterPane);

    _get(Object.getPrototypeOf(LinterPane.prototype), 'constructor', this).call(this);

    this.name = 'LinterPane';
    this.setTitle('Linter');
    this.elements = [];
    _etch2['default'].initialize(this);
  }

  _createClass(LinterPane, [{
    key: 'setItems',
    value: function setItems(els) {
      this.elements = els;
      _etch2['default'].update(this);
    }
  }, {
    key: 'addItem',
    value: function addItem(el) {
      this.elements.push(el);
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
        { className: 'ink-table-container' },
        _etch2['default'].dom(
          'table',
          { className: 'ink-table' },
          _etch2['default'].dom(
            'thead',
            null,
            _etch2['default'].dom(
              'tr',
              null,
              _etch2['default'].dom(
                'th',
                { className: 'table-cell table-header table-cell-sev' },
                'Type'
              ),
              _etch2['default'].dom(
                'th',
                { className: 'table-cell table-header table-cell-prov' },
                'Provider'
              ),
              _etch2['default'].dom(
                'th',
                { className: 'table-cell table-header table-cell-desc' },
                'Description'
              ),
              _etch2['default'].dom(
                'th',
                { className: 'table-cell table-header table-cell-file' },
                'File'
              ),
              _etch2['default'].dom(
                'th',
                { className: 'table-cell table-header table-cell-line' },
                'Line'
              )
            )
          ),
          _etch2['default'].dom(
            'tbody',
            null,
            this.elements.map(function (item) {
              var line = [item.range[0][0], item.range[1][0]];
              return _etch2['default'].dom(
                'tr',
                null,
                _etch2['default'].dom(
                  'td',
                  { className: 'table-cell table-cell-sev' },
                  item.severity
                ),
                _etch2['default'].dom(
                  'td',
                  { className: 'table-cell table-cell-prov' },
                  item.provider || ''
                ),
                _etch2['default'].dom(
                  'td',
                  { className: 'table-cell table-cell-desc' },
                  item.description || ''
                ),
                _etch2['default'].dom(
                  'td',
                  { className: 'table-cell table-cell-file', onclick: function () {
                      return (0, _utilOpener.open)(item.realpath || item.file, line[0]);
                    } },
                  item.file
                ),
                _etch2['default'].dom(
                  'td',
                  { className: 'table-cell table-cell-line' },
                  '' + (line[0] + 1) + (line[1] != line[0] ? ' - ' + line[1] : '')
                )
              );
            })
          )
        )
      );
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'alert';
    }
  }]);

  return LinterPane;
})(_utilPaneItem2['default']);

exports['default'] = LinterPane;

LinterPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9saW50ZXIvcGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzBCQUNILGlCQUFpQjs7b0JBQ0QsTUFBTTs7NEJBQ3JCLG1CQUFtQjs7OzswQkFDbkIsZ0JBQWdCOztBQVByQyxXQUFXLENBQUE7SUFTVSxVQUFVO1lBQVYsVUFBVTs7ZUFBVixVQUFVOztXQUdiLG9CQUFHO0FBQ2pCLFVBQUksR0FBRywrQkFBeUIsQ0FBQTtLQUNqQzs7O1dBRWlCLHNCQUFHO0FBQ25CLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7QUFFVyxXQVhPLFVBQVUsQ0FXaEIsSUFBSSxFQUFFOzBCQVhBLFVBQVU7O0FBWTNCLCtCQVppQixVQUFVLDZDQVlwQjs7U0FYVCxJQUFJLEdBQUcsWUFBWTtBQWFqQixRQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFqQmtCLFVBQVU7O1dBbUJwQixrQkFBQyxHQUFHLEVBQUU7QUFDYixVQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQTtBQUNuQix3QkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEI7OztXQUVPLGlCQUFDLEVBQUUsRUFBRTtBQUNYLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3RCLHdCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQjs7O1dBRU0sa0JBQUcsRUFBRTs7O1dBRUwsa0JBQUc7QUFDUixhQUFROztVQUFLLFNBQVMsRUFBQyxxQkFBcUI7UUFDcEM7O1lBQU8sU0FBUyxFQUFDLFdBQVc7VUFDMUI7OztZQUNFOzs7Y0FDRTs7a0JBQUksU0FBUyxFQUFDLHdDQUF3Qzs7ZUFBVTtjQUNoRTs7a0JBQUksU0FBUyxFQUFDLHlDQUF5Qzs7ZUFBYztjQUNyRTs7a0JBQUksU0FBUyxFQUFDLHlDQUF5Qzs7ZUFBaUI7Y0FDeEU7O2tCQUFJLFNBQVMsRUFBQyx5Q0FBeUM7O2VBQVU7Y0FDakU7O2tCQUFJLFNBQVMsRUFBQyx5Q0FBeUM7O2VBQVU7YUFDOUQ7V0FDQztVQUNSOzs7WUFDRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN6QixrQkFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQyxxQkFBUTs7O2dCQUNFOztvQkFBSSxTQUFTLEVBQUMsMkJBQTJCO2tCQUFFLElBQUksQ0FBQyxRQUFRO2lCQUFNO2dCQUM5RDs7b0JBQUksU0FBUyxFQUFDLDRCQUE0QjtrQkFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUU7aUJBQU07Z0JBQ3JFOztvQkFBSSxTQUFTLEVBQUMsNEJBQTRCO2tCQUFFLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRTtpQkFBTTtnQkFDeEU7O29CQUFJLFNBQVMsRUFBQyw0QkFBNEIsRUFBQyxPQUFPLEVBQUU7NkJBQU0sc0JBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFBQSxBQUFDO2tCQUFFLElBQUksQ0FBQyxJQUFJO2lCQUFNO2dCQUNySDs7b0JBQUksU0FBUyxFQUFDLDRCQUE0Qjt3QkFBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtpQkFBUTtlQUN6RyxDQUFBO2FBQ2QsQ0FBQztXQUNJO1NBQ0Y7T0FDRixDQUFBO0tBQ2Y7OztXQUVXLHVCQUFHO0FBQ2IsYUFBTyxPQUFPLENBQUE7S0FDZjs7O1NBN0RrQixVQUFVOzs7cUJBQVYsVUFBVTs7QUFnRS9CLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvbGludGVyL3BhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IFJhdyB9IGZyb20gJy4uL3V0aWwvZXRjaC5qcydcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL3V0aWwvcGFuZS1pdGVtJ1xuaW1wb3J0IHsgb3BlbiB9IGZyb20gJy4uL3V0aWwvb3BlbmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJQYW5lIGV4dGVuZHMgUGFuZUl0ZW0ge1xuICBuYW1lID0gJ0xpbnRlclBhbmUnXG5cbiAgc3RhdGljIGFjdGl2YXRlICgpIHtcbiAgICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUgKCkge1xuICAgIHN1YnMuZGlzcG9zZSgpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc2V0VGl0bGUoJ0xpbnRlcicpXG4gICAgdGhpcy5lbGVtZW50cyA9IFtdXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBzZXRJdGVtcyAoZWxzKSB7XG4gICAgdGhpcy5lbGVtZW50cyA9IGVsc1xuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBhZGRJdGVtIChlbCkge1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbClcbiAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwiaW5rLXRhYmxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cImluay10YWJsZVwiPlxuICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRhYmxlLWNlbGwgdGFibGUtaGVhZGVyIHRhYmxlLWNlbGwtc2V2XCI+VHlwZTwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGFibGUtY2VsbCB0YWJsZS1oZWFkZXIgdGFibGUtY2VsbC1wcm92XCI+UHJvdmlkZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRhYmxlLWNlbGwgdGFibGUtaGVhZGVyIHRhYmxlLWNlbGwtZGVzY1wiPkRlc2NyaXB0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0YWJsZS1jZWxsIHRhYmxlLWhlYWRlciB0YWJsZS1jZWxsLWZpbGVcIj5GaWxlPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0YWJsZS1jZWxsIHRhYmxlLWhlYWRlciB0YWJsZS1jZWxsLWxpbmVcIj5MaW5lPC90aD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAge3RoaXMuZWxlbWVudHMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IGxpbmUgPSBbaXRlbS5yYW5nZVswXVswXSwgaXRlbS5yYW5nZVsxXVswXV1cbiAgICAgICAgICAgICAgICAgIHJldHVybiAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0YWJsZS1jZWxsIHRhYmxlLWNlbGwtc2V2XCI+e2l0ZW0uc2V2ZXJpdHl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGFibGUtY2VsbCB0YWJsZS1jZWxsLXByb3ZcIj57aXRlbS5wcm92aWRlciB8fCAnJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0YWJsZS1jZWxsIHRhYmxlLWNlbGwtZGVzY1wiPntpdGVtLmRlc2NyaXB0aW9uIHx8ICcnfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInRhYmxlLWNlbGwgdGFibGUtY2VsbC1maWxlXCIgb25jbGljaz17KCkgPT4gb3BlbihpdGVtLnJlYWxwYXRoIHx8IGl0ZW0uZmlsZSwgbGluZVswXSl9PntpdGVtLmZpbGV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGFibGUtY2VsbCB0YWJsZS1jZWxsLWxpbmVcIj57YCR7bGluZVswXSArIDF9JHtsaW5lWzFdICE9IGxpbmVbMF0gPyAnIC0gJytsaW5lWzFdIDogJyd9YH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICB9XG5cbiAgZ2V0SWNvbk5hbWUgKCkge1xuICAgIHJldHVybiAnYWxlcnQnXG4gIH1cbn1cblxuTGludGVyUGFuZS5yZWdpc3RlclZpZXcoKVxuIl19