Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.activate = activate;
exports.setItems = setItems;
exports.addItem = addItem;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilEtchJs = require('../util/etch.js');

var _atom = require('atom');

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilOpener = require('../util/opener');

'use babel';

var subs;

var markerLayers = new Map();
var lintDecorations = [];

var GUTTERNAME = 'ink-linter-gutter';

function activate() {
  subs = new _atom.CompositeDisposable();
}

function setItems(items) {
  lintDecorations.forEach(function (item) {
    item.destroy();
  });
  lintDecorations = [];
  items.forEach(function (item) {
    lintDecorations.push(new LintDecoration(item));
  });
}

function addItem(item) {
  lintDecorations.push(new LintDecoration(item));
}

var LintDecoration = (function () {
  function LintDecoration(item) {
    var _this = this;

    _classCallCheck(this, LintDecoration);

    this.item = item;
    this.markers = [];

    this.subs = new _atom.CompositeDisposable();

    var path = item.realpath || item.file;

    this.subs.add(atom.workspace.observeTextEditors(function (ed) {
      if (path == ed.getPath()) {
        (function () {
          var edid = ed.id;
          if (!markerLayers.get(edid)) {
            markerLayers.set(edid, ed.addMarkerLayer());
          }
          var gutter = undefined;
          if (!(gutter = ed.gutterWithName(GUTTERNAME))) {
            gutter = ed.addGutter({
              name: GUTTERNAME,
              priority: -1
            });
          }

          var marker = markerLayers.get(edid).markBufferRange(item.range);

          _this.markers.push(marker);

          attachUnderlineDecoration(ed, marker, item);
          attachGutterDecoration(gutter, ed, marker, item);

          ed.onDidDestroy(function (ev) {
            markerLayers.get(edid).destroy();
          });
        })();
      }
    }));
  }

  _createClass(LintDecoration, [{
    key: 'destroy',
    value: function destroy() {
      this.markers.forEach(function (m) {
        return m.destroy();
      });
      this.subs.dispose();
    }
  }]);

  return LintDecoration;
})();

exports.LintDecoration = LintDecoration;

var InlineDecorationView = (function (_Etch) {
  _inherits(InlineDecorationView, _Etch);

  function InlineDecorationView() {
    _classCallCheck(this, InlineDecorationView);

    _get(Object.getPrototypeOf(InlineDecorationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InlineDecorationView, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'ink-lint-inline' },
        _etch2['default'].dom('div', { className: 'ink-lint-arrow-up' }),
        _etch2['default'].dom(
          'div',
          { className: 'ink-lint-description-container', tabindex: '-1' },
          this.props.items.map(function (item) {
            return _etch2['default'].dom(
              'div',
              { className: 'ink-lint-line' },
              item.item.description
            );
          })
        )
      );
    }
  }]);

  return InlineDecorationView;
})(_utilEtchJs.Etch);

function showInlineDecoration(ed, item, parent) {
  var line = item.range[0][0];
  var marker = markerLayers.get(ed.id).markBufferRange([[line, 0], [line, 0]]);

  var items = lintDecorations.filter(function (item) {
    return item.item.range[0][0] === line;
  });

  var hideTimer = null;
  var el = new InlineDecorationView({ items: items });
  ed.decorateMarker(marker, {
    type: 'overlay',
    'class': 'ink-result-container',
    item: el,
    position: 'tail'
  });

  parent.addEventListener('mouseout', function (e) {
    hideTimer = setTimeout(function (e) {
      return marker.destroy();
    }, 300);
  });

  el.element.addEventListener('mouseover', function (e) {
    clearTimeout(hideTimer);
  });

  el.element.addEventListener('mouseout', function (e) {
    hideTimer = setTimeout(function (e) {
      return marker.destroy();
    }, 300);
  });
}

function attachUnderlineDecoration(ed, marker, item) {
  ed.decorateMarker(marker, {
    type: 'highlight',
    'class': 'ink-linter-' + item.severity.toLowerCase()
  });
}

var GutterItemView = (function (_Etch2) {
  _inherits(GutterItemView, _Etch2);

  function GutterItemView() {
    _classCallCheck(this, GutterItemView);

    _get(Object.getPrototypeOf(GutterItemView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GutterItemView, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _etch2['default'].dom('span', { className: 'ink-linter-gutter-' + this.props.item.severity.toLowerCase() + ' icon icon-primitive-dot',
        onMouseOver: function (ev) {
          return showInlineDecoration(_this2.props.editor, _this2.props.item, _this2.element);
        } });
    }
  }]);

  return GutterItemView;
})(_utilEtchJs.Etch);

function attachGutterDecoration(gutter, editor, marker, item) {
  gutter.decorateMarker(marker, {
    type: 'gutter',
    item: new GutterItemView({ editor: editor, marker: marker, item: item })
  });
}

function deactivate() {
  markerLayers.forEach(function (layer, id) {
    layer.destroy();
  });
  subs.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9saW50ZXIvaW5saW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OzswQkFDVyxpQkFBaUI7O29CQUNmLE1BQU07OzRCQUNyQixtQkFBbUI7Ozs7MEJBQ25CLGdCQUFnQjs7QUFQckMsV0FBVyxDQUFBOztBQVNYLElBQUksSUFBSSxDQUFBOztBQUVSLElBQUksWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDNUIsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFBOztBQUV4QixJQUFJLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQTs7QUFFN0IsU0FBUyxRQUFRLEdBQUk7QUFDMUIsTUFBSSxHQUFHLCtCQUF5QixDQUFBO0NBQ2pDOztBQUVNLFNBQVMsUUFBUSxDQUFFLEtBQUssRUFBRTtBQUMvQixpQkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUM5QixRQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDZixDQUFDLENBQUE7QUFDRixpQkFBZSxHQUFHLEVBQUUsQ0FBQTtBQUNwQixPQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3BCLG1CQUFlLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBO0NBQ0g7O0FBRU0sU0FBUyxPQUFPLENBQUUsSUFBSSxFQUFFO0FBQzdCLGlCQUFlLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Q0FDL0M7O0lBRVksY0FBYztBQUNiLFdBREQsY0FBYyxDQUNaLElBQUksRUFBRTs7OzBCQURSLGNBQWM7O0FBRXZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFFBQUks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YXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvbGludGVyL2lubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgUmF3LCB0b1ZpZXcsIEV0Y2ggfSBmcm9tICcuLi91dGlsL2V0Y2guanMnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcbmltcG9ydCB7IG9wZW4gfSBmcm9tICcuLi91dGlsL29wZW5lcidcblxudmFyIHN1YnNcblxudmFyIG1hcmtlckxheWVycyA9IG5ldyBNYXAoKVxudmFyIGxpbnREZWNvcmF0aW9ucyA9IFtdXG5cbnZhciBHVVRURVJOQU1FID0gJ2luay1saW50ZXItZ3V0dGVyJ1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKCkge1xuICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SXRlbXMgKGl0ZW1zKSB7XG4gIGxpbnREZWNvcmF0aW9ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uZGVzdHJveSgpXG4gIH0pXG4gIGxpbnREZWNvcmF0aW9ucyA9IFtdXG4gIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgbGludERlY29yYXRpb25zLnB1c2gobmV3IExpbnREZWNvcmF0aW9uKGl0ZW0pKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkSXRlbSAoaXRlbSkge1xuICBsaW50RGVjb3JhdGlvbnMucHVzaChuZXcgTGludERlY29yYXRpb24oaXRlbSkpXG59XG5cbmV4cG9ydCBjbGFzcyBMaW50RGVjb3JhdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChpdGVtKSB7XG4gICAgdGhpcy5pdGVtID0gaXRlbVxuICAgIHRoaXMubWFya2VycyA9IFtdXG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBsZXQgcGF0aCA9IGl0ZW0ucmVhbHBhdGggfHwgaXRlbS5maWxlXG5cbiAgICB0aGlzLnN1YnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZCA9PiB7XG4gICAgICBpZiAocGF0aCA9PSBlZC5nZXRQYXRoKCkpIHtcbiAgICAgICAgbGV0IGVkaWQgPSBlZC5pZFxuICAgICAgICBpZiAoIW1hcmtlckxheWVycy5nZXQoZWRpZCkpIHtcbiAgICAgICAgICBtYXJrZXJMYXllcnMuc2V0KGVkaWQsIGVkLmFkZE1hcmtlckxheWVyKCkpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGd1dHRlclxuICAgICAgICBpZiAoIShndXR0ZXIgPSBlZC5ndXR0ZXJXaXRoTmFtZShHVVRURVJOQU1FKSkpIHtcbiAgICAgICAgICBndXR0ZXIgPSBlZC5hZGRHdXR0ZXIoe1xuICAgICAgICAgICAgbmFtZTogR1VUVEVSTkFNRSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAtMVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWFya2VyID0gbWFya2VyTGF5ZXJzLmdldChlZGlkKS5tYXJrQnVmZmVyUmFuZ2UoaXRlbS5yYW5nZSlcblxuICAgICAgICB0aGlzLm1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICAgICAgYXR0YWNoVW5kZXJsaW5lRGVjb3JhdGlvbihlZCwgbWFya2VyLCBpdGVtKVxuICAgICAgICBhdHRhY2hHdXR0ZXJEZWNvcmF0aW9uKGd1dHRlciwgZWQsIG1hcmtlciwgaXRlbSlcblxuICAgICAgICBlZC5vbkRpZERlc3Ryb3koKGV2KSA9PiB7XG4gICAgICAgICAgbWFya2VyTGF5ZXJzLmdldChlZGlkKS5kZXN0cm95KClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKG0gPT4gbS5kZXN0cm95KCkpXG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKVxuICB9XG59XG5cbmNsYXNzIElubGluZURlY29yYXRpb25WaWV3IGV4dGVuZHMgRXRjaCB7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cImluay1saW50LWlubGluZVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluay1saW50LWFycm93LXVwXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5rLWxpbnQtZGVzY3JpcHRpb24tY29udGFpbmVyXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuaXRlbXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwiaW5rLWxpbnQtbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaXRlbS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICB9XG59XG5cbmZ1bmN0aW9uIHNob3dJbmxpbmVEZWNvcmF0aW9uIChlZCwgaXRlbSwgcGFyZW50KSB7XG4gIGxldCBsaW5lID0gaXRlbS5yYW5nZVswXVswXVxuICBsZXQgbWFya2VyID0gbWFya2VyTGF5ZXJzLmdldChlZC5pZCkubWFya0J1ZmZlclJhbmdlKFtbbGluZSwgMF0sIFtsaW5lLCAwXV0pXG5cbiAgbGV0IGl0ZW1zID0gbGludERlY29yYXRpb25zLmZpbHRlcihpdGVtID0+IGl0ZW0uaXRlbS5yYW5nZVswXVswXSA9PT0gbGluZSlcblxuICBsZXQgaGlkZVRpbWVyID0gbnVsbFxuICBsZXQgZWwgPSBuZXcgSW5saW5lRGVjb3JhdGlvblZpZXcoe2l0ZW1zfSlcbiAgZWQuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgdHlwZTogJ292ZXJsYXknLFxuICAgIGNsYXNzOiAnaW5rLXJlc3VsdC1jb250YWluZXInLFxuICAgIGl0ZW06IGVsLFxuICAgIHBvc2l0aW9uOiAndGFpbCdcbiAgfSlcblxuICBwYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBlID0+IHtcbiAgICBoaWRlVGltZXIgPSBzZXRUaW1lb3V0KGUgPT4gbWFya2VyLmRlc3Ryb3koKSwgMzAwKVxuICB9KVxuXG4gIGVsLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZSA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KGhpZGVUaW1lcilcbiAgfSlcblxuICBlbC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZSA9PiB7XG4gICAgaGlkZVRpbWVyID0gc2V0VGltZW91dChlID0+IG1hcmtlci5kZXN0cm95KCksIDMwMClcbiAgfSlcbn1cblxuZnVuY3Rpb24gYXR0YWNoVW5kZXJsaW5lRGVjb3JhdGlvbiAoZWQsIG1hcmtlciwgaXRlbSkge1xuICBlZC5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICBjbGFzczogYGluay1saW50ZXItJHtpdGVtLnNldmVyaXR5LnRvTG93ZXJDYXNlKCl9YFxuICB9KVxufVxuXG5jbGFzcyBHdXR0ZXJJdGVtVmlldyBleHRlbmRzIEV0Y2gge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17YGluay1saW50ZXItZ3V0dGVyLSR7dGhpcy5wcm9wcy5pdGVtLnNldmVyaXR5LnRvTG93ZXJDYXNlKCl9IGljb24gaWNvbi1wcmltaXRpdmUtZG90YH1cbiAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e2V2ID0+IHNob3dJbmxpbmVEZWNvcmF0aW9uKHRoaXMucHJvcHMuZWRpdG9yLCB0aGlzLnByb3BzLml0ZW0sIHRoaXMuZWxlbWVudCl9Lz5cbiAgfVxufVxuXG5mdW5jdGlvbiBhdHRhY2hHdXR0ZXJEZWNvcmF0aW9uIChndXR0ZXIsIGVkaXRvciwgbWFya2VyLCBpdGVtKSB7XG4gIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICB0eXBlOiAnZ3V0dGVyJyxcbiAgICBpdGVtOiBuZXcgR3V0dGVySXRlbVZpZXcoe2VkaXRvciwgbWFya2VyLCBpdGVtfSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBtYXJrZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIsIGlkKSA9PiB7XG4gICAgbGF5ZXIuZGVzdHJveSgpXG4gIH0pXG4gIHN1YnMuZGlzcG9zZSgpXG59XG4iXX0=