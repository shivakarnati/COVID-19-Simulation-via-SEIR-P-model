Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _elementResizeDetector = require('element-resize-detector');

var _elementResizeDetector2 = _interopRequireDefault(_elementResizeDetector);

var _underscorePlus = require('underscore-plus');

var _utilEtch = require('../util/etch');

'use babel';

var defaultPane = undefined;
var MAX_SIZE = 50;

var PlotPane = (function (_PaneItem) {
  _inherits(PlotPane, _PaneItem);

  _createClass(PlotPane, null, [{
    key: 'activate',
    value: function activate() {
      defaultPane = PlotPane.fromId('default');
      atom.workspace.addOpener(function (uri) {
        if (uri.startsWith('atom://ink/plots')) {
          return defaultPane;
        }
      });
    }
  }]);

  function PlotPane(opts) {
    var _this = this;

    _classCallCheck(this, PlotPane);

    _get(Object.getPrototypeOf(PlotPane.prototype), 'constructor', this).call(this);

    this.setTitle('Plots');

    this.counter = 0;
    this.items = [];
    this.ids = [];
    this.currentItem = -1;

    this.resizer = new _elementResizeDetector2['default']();

    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);

    this.resizer.listenTo(this.element, (0, _underscorePlus.throttle)(function () {
      return _this.resizing(true);
    }, 150));
    this.resizerTimeout = null;
  }

  _createClass(PlotPane, [{
    key: 'resizing',
    value: function resizing(isResizing) {
      var _this2 = this;

      if (this.resizerTimeout) {
        clearTimeout(this.resizerTimeout);
      }

      var shouldUpdate = isResizing !== this.isResizing;
      this.isResizing = isResizing;
      if (shouldUpdate) {
        _etch2['default'].update(this);
      }

      if (isResizing) {
        this.resizerTimeout = setTimeout(function () {
          return _this2.resizing(false);
        }, 200);
      } else {
        clearTimeout(this.resizerTimeout);
        this.resizerTimeout = null;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var currentItem = undefined;
      if (this.currentItem > -1 && this.currentItem < this.items.length) {
        currentItem = this.items[this.currentItem];
      } else {
        currentItem = undefined;
      }

      var buttons = [_etch2['default'].dom(
        'div',
        { className: 'btn-group' },
        _etch2['default'].dom(_utilEtch.Button, { icon: 'move-left', alt: 'First', disabled: this.currentItem <= 0, onclick: function () {
            return _this3.activateItem(0);
          } }),
        _etch2['default'].dom(_utilEtch.Button, { icon: 'arrow-left', alt: 'Previous', disabled: this.currentItem <= 0, onclick: function () {
            return _this3.previousPlot();
          } }),
        _etch2['default'].dom(_utilEtch.Button, { icon: 'arrow-right', alt: 'Next', disabled: this.currentItem >= this.items.length - 1, onclick: function () {
            return _this3.nextPlot();
          } }),
        _etch2['default'].dom(_utilEtch.Button, { icon: 'move-right', alt: 'Last', disabled: this.currentItem >= this.items.length - 1, onclick: function () {
            return _this3.activateItem(_this3.items.length - 1);
          } })
      ), _etch2['default'].dom(
        'div',
        { className: 'btn-group' },
        _etch2['default'].dom(_utilEtch.Button, { icon: 'x', alt: 'Forget Plot', disabled: currentItem == undefined, onclick: function () {
            return _this3.teardown();
          } }),
        _etch2['default'].dom(_utilEtch.Button, { icon: 'circle-slash', alt: 'Forget All Plots', disabled: currentItem == undefined, onclick: function () {
            return _this3.clearAll();
          } })
      )];
      if (currentItem && currentItem.toolbar) buttons = buttons.concat((0, _utilEtch.toView)(currentItem.toolbar));

      var els = [];
      for (var i = 0; i < this.items.length; i++) {
        els.push(_etch2['default'].dom(
          'div',
          { className: 'fill',
            style: 'display:' + (i == this.currentItem ? 'initial' : 'none'),
            key: this.ids[i] },
          (0, _utilEtch.toView)(this.items[i])
        ));
      }

      var cn = 'ink-plot-pane';
      if (this.isResizing) {
        cn += ' is-resizing';
      }

      return _etch2['default'].dom(
        'span',
        { className: cn },
        _etch2['default'].dom(
          _utilEtch.Toolbar,
          { items: buttons },
          _etch2['default'].dom(
            'div',
            { className: 'ink-plot-pane-container fill' },
            els
          )
        )
      );
    }
  }, {
    key: 'deactivateCurrentItem',
    value: function deactivateCurrentItem() {
      if (this.currentItem > -1 && this.currentItem < this.items.length) {
        var currentItem = this.items[this.currentItem];
        if (currentItem.teardown) currentItem.teardown();
      }
    }
  }, {
    key: 'activateCurrentItem',
    value: function activateCurrentItem() {
      if (this.currentItem > -1 && this.currentItem < this.items.length) {
        var currentItem = this.items[this.currentItem];
        if (currentItem.build) currentItem.build();
      }
    }
  }, {
    key: 'activateItem',
    value: function activateItem(ind) {
      this.deactivateCurrentItem();
      this.currentItem = ind;
      this.activateCurrentItem();

      _etch2['default'].update(this, false);
    }
  }, {
    key: 'previousPlot',
    value: function previousPlot() {
      if (this.currentItem > 0) {
        this.activateItem(this.currentItem - 1);
      } else {
        this.activateItem(this.currentItem);
      }
    }
  }, {
    key: 'nextPlot',
    value: function nextPlot() {
      if (this.currentItem < this.items.length - 1) {
        this.activateItem(this.currentItem + 1);
      } else {
        this.activateItem(this.currentItem);
      }
    }
  }, {
    key: 'show',
    value: function show(view) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? { maxSize: MAX_SIZE } : arguments[1];

      var maxSize = _ref.maxSize;

      if (view) {
        this.ids.push(this.counter += 1);
        this.items.push(view);
        this.prune(maxSize);
        this.activateItem(this.items.length - 1);
      }
      _etch2['default'].update(this, false);
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.items[this.currentItem] && this.items[this.currentItem].teardown) this.items[this.currentItem].teardown();

      this.ids.splice(this.currentItem, 1);
      this.items.splice(this.currentItem, 1);

      if (!(this.currentItem < this.items.length - 1)) {
        this.activateItem(this.items.length - 1);
      } else {
        this.activateItem(this.currentItem);
      }
    }
  }, {
    key: 'prune',
    value: function prune(maxSize) {
      var numItems = this.items.length;
      if (numItems <= maxSize) return;

      var startInd = numItems - maxSize;
      this.items.forEach(function (item, ind) {
        if (ind < startInd && item.teardown) {
          item.teardown();
        }
      });

      this.ids = this.ids.slice(startInd, numItems);
      this.items = this.items.slice(startInd, numItems);
    }
  }, {
    key: 'clearAll',
    value: function clearAll() {
      this.items.forEach(function (item) {
        return item.teardown && item.teardown();
      });
      this.ids = [];
      this.items = [];

      this.activateItem(-1);
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'graph';
    }
  }, {
    key: 'size',
    value: function size() {
      var view = this.element;
      var bar = view.querySelector('.bar');
      return [view.clientWidth, view.clientHeight - bar.clientHeight];
    }
  }]);

  return PlotPane;
})(_utilPaneItem2['default']);

exports['default'] = PlotPane;

PlotPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9wbG90cy9wYW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NEJBRUYsbUJBQW1COzs7O3FDQUNiLHlCQUF5Qjs7Ozs4QkFDM0IsaUJBQWlCOzt3QkFDdUIsY0FBYzs7QUFSL0UsV0FBVyxDQUFBOztBQVVYLElBQUksV0FBVyxZQUFBLENBQUE7QUFDZixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7O0lBRUUsUUFBUTtZQUFSLFFBQVE7O2VBQVIsUUFBUTs7V0FDWixvQkFBRztBQUNoQixpQkFBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDeEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDOUIsWUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7QUFDdEMsaUJBQU8sV0FBVyxDQUFBO1NBQ25CO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztBQUVVLFdBVlEsUUFBUSxDQVVmLElBQUksRUFBRTs7OzBCQVZDLFFBQVE7O0FBV3pCLCtCQVhpQixRQUFRLDZDQVdsQjs7QUFFUCxRQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUV0QixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNmLFFBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFBO0FBQ2IsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLE9BQU8sR0FBRyx3Q0FBb0IsQ0FBQTs7QUFFbkMsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLENB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QUssR0FBRyxFQUFFLENBQUE7O0FBRWYsVUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3RCOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sT0FBTyxDQUFBO0tBQ2Y7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtBQUN2QixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQ2hFOzs7U0E5TGtCLFFBQVE7OztxQkFBUixRQUFROztBQWlNN0IsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFBIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9wbG90cy9wYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi91dGlsL3BhbmUtaXRlbSdcbmltcG9ydCBSZXNpemVEZXRlY3RvciBmcm9tICdlbGVtZW50LXJlc2l6ZS1kZXRlY3RvcidcbmltcG9ydCB7IHRocm90dGxlIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IHsgdG9WaWV3LCBUb29sYmFyLCBCdXR0b24sIEljb24sIEJhY2tncm91bmRNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbC9ldGNoJ1xuXG5sZXQgZGVmYXVsdFBhbmVcbmNvbnN0IE1BWF9TSVpFID0gNTBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxvdFBhbmUgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICBkZWZhdWx0UGFuZSA9IFBsb3RQYW5lLmZyb21JZCgnZGVmYXVsdCcpXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKHVyaSA9PiB7XG4gICAgICBpZiAodXJpLnN0YXJ0c1dpdGgoJ2F0b206Ly9pbmsvcGxvdHMnKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFBhbmVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc2V0VGl0bGUoJ1Bsb3RzJylcblxuICAgIHRoaXMuY291bnRlciA9IDBcbiAgICB0aGlzLml0ZW1zID0gW11cbiAgICB0aGlzLmlkcyA9IFtdXG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IC0xXG5cbiAgICB0aGlzLnJlc2l6ZXIgPSBuZXcgUmVzaXplRGV0ZWN0b3IoKVxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSlcblxuICAgIHRoaXMucmVzaXplci5saXN0ZW5Ubyh0aGlzLmVsZW1lbnQsIHRocm90dGxlKCgpID0+IHRoaXMucmVzaXppbmcodHJ1ZSksIDE1MCkpXG4gICAgdGhpcy5yZXNpemVyVGltZW91dCA9IG51bGxcbiAgfVxuXG4gIHJlc2l6aW5nKGlzUmVzaXppbmcpIHtcbiAgICBpZiAodGhpcy5yZXNpemVyVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplclRpbWVvdXQpXG4gICAgfVxuXG4gICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gaXNSZXNpemluZyAhPT0gdGhpcy5pc1Jlc2l6aW5nXG4gICAgdGhpcy5pc1Jlc2l6aW5nID0gaXNSZXNpemluZ1xuICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gICAgfVxuXG4gICAgaWYgKGlzUmVzaXppbmcpIHtcbiAgICAgIHRoaXMucmVzaXplclRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVzaXppbmcoZmFsc2UpLCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZXJUaW1lb3V0KVxuICAgICAgdGhpcy5yZXNpemVyVGltZW91dCA9IG51bGxcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGN1cnJlbnRJdGVtXG4gICAgaWYgKHRoaXMuY3VycmVudEl0ZW0gPiAtMSAmJiB0aGlzLmN1cnJlbnRJdGVtIDwgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIGN1cnJlbnRJdGVtID0gdGhpcy5pdGVtc1t0aGlzLmN1cnJlbnRJdGVtXVxuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50SXRlbSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGxldCBidXR0b25zID0gW1xuICAgICAgPGRpdiBjbGFzc05hbWU9J2J0bi1ncm91cCc+XG4gICAgICAgIDxCdXR0b24gaWNvbj0nbW92ZS1sZWZ0JyBhbHQ9J0ZpcnN0JyBkaXNhYmxlZCA9IHt0aGlzLmN1cnJlbnRJdGVtIDw9IDB9IG9uY2xpY2s9eygpID0+IHRoaXMuYWN0aXZhdGVJdGVtKDApfS8+XG4gICAgICAgIDxCdXR0b24gaWNvbj0nYXJyb3ctbGVmdCcgYWx0PSdQcmV2aW91cycgZGlzYWJsZWQgPSB7dGhpcy5jdXJyZW50SXRlbSA8PSAwfSBvbmNsaWNrPXsoKSA9PiB0aGlzLnByZXZpb3VzUGxvdCgpfS8+XG4gICAgICAgIDxCdXR0b24gaWNvbj0nYXJyb3ctcmlnaHQnIGFsdD0nTmV4dCcgIGRpc2FibGVkID0ge3RoaXMuY3VycmVudEl0ZW0gPj0gKHRoaXMuaXRlbXMubGVuZ3RoIC0gMSl9IG9uY2xpY2s9eygpID0+IHRoaXMubmV4dFBsb3QoKX0vPlxuICAgICAgICA8QnV0dG9uIGljb249J21vdmUtcmlnaHQnIGFsdD0nTGFzdCcgIGRpc2FibGVkID0ge3RoaXMuY3VycmVudEl0ZW0gPj0gKHRoaXMuaXRlbXMubGVuZ3RoIC0gMSl9IG9uY2xpY2s9eygpID0+IHRoaXMuYWN0aXZhdGVJdGVtKHRoaXMuaXRlbXMubGVuZ3RoIC0gMSl9Lz5cbiAgICAgIDwvZGl2PixcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdidG4tZ3JvdXAnPlxuICAgICAgICA8QnV0dG9uIGljb249J3gnIGFsdD0nRm9yZ2V0IFBsb3QnIGRpc2FibGVkID0ge2N1cnJlbnRJdGVtID09IHVuZGVmaW5lZH0gb25jbGljaz17KCkgPT4gdGhpcy50ZWFyZG93bigpfSAvPlxuICAgICAgICA8QnV0dG9uIGljb249J2NpcmNsZS1zbGFzaCcgYWx0PSdGb3JnZXQgQWxsIFBsb3RzJyBkaXNhYmxlZCA9IHtjdXJyZW50SXRlbSA9PSB1bmRlZmluZWR9IG9uY2xpY2s9eygpID0+IHRoaXMuY2xlYXJBbGwoKX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIF07XG4gICAgaWYgKGN1cnJlbnRJdGVtICYmIGN1cnJlbnRJdGVtLnRvb2xiYXIpIGJ1dHRvbnMgPSBidXR0b25zLmNvbmNhdCh0b1ZpZXcoY3VycmVudEl0ZW0udG9vbGJhcikpXG5cbiAgICBsZXQgZWxzID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICBlbHMucHVzaChcbiAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsbFwiXG4gICAgICAgICAgICAgIHN0eWxlPXtgZGlzcGxheToke2kgPT0gdGhpcy5jdXJyZW50SXRlbSA/ICdpbml0aWFsJyA6ICdub25lJ31gfVxuICAgICAgICAgICAgICBrZXkgPSB7dGhpcy5pZHNbaV19PlxuICAgICAgICAgICB7dG9WaWV3KHRoaXMuaXRlbXNbaV0pfVxuICAgICAgICAgPC9kaXY+KVxuICAgICB9XG5cbiAgICAgbGV0IGNuID0gJ2luay1wbG90LXBhbmUnXG4gICAgIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICBjbiArPSAnIGlzLXJlc2l6aW5nJ1xuICAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtjbn0+XG4gICAgICAgICAgICAgPFRvb2xiYXIgaXRlbXM9e2J1dHRvbnN9PlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmstcGxvdC1wYW5lLWNvbnRhaW5lciBmaWxsXCI+XG4gICAgICAgICAgICAgICAgIHtlbHN9XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICA8L1Rvb2xiYXI+XG4gICAgICAgICAgIDwvc3Bhbj5cbiAgfVxuXG4gIGRlYWN0aXZhdGVDdXJyZW50SXRlbSAoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEl0ZW0gPiAtMSAmJiB0aGlzLmN1cnJlbnRJdGVtIDwgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIGxldCBjdXJyZW50SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50SXRlbV1cbiAgICAgIGlmIChjdXJyZW50SXRlbS50ZWFyZG93bikgY3VycmVudEl0ZW0udGVhcmRvd24oKVxuICAgIH1cbiAgfVxuXG4gIGFjdGl2YXRlQ3VycmVudEl0ZW0gKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtID4gLTEgJiYgdGhpcy5jdXJyZW50SXRlbSA8IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICBsZXQgY3VycmVudEl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuY3VycmVudEl0ZW1dXG4gICAgICBpZiAoY3VycmVudEl0ZW0uYnVpbGQpIGN1cnJlbnRJdGVtLmJ1aWxkKClcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZUl0ZW0gKGluZCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZUN1cnJlbnRJdGVtKClcbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gaW5kXG4gICAgdGhpcy5hY3RpdmF0ZUN1cnJlbnRJdGVtKClcblxuICAgIGV0Y2gudXBkYXRlKHRoaXMsIGZhbHNlKVxuICB9XG5cbiAgcHJldmlvdXNQbG90ICgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50SXRlbSA+IDApIHtcbiAgICAgIHRoaXMuYWN0aXZhdGVJdGVtKHRoaXMuY3VycmVudEl0ZW0gLSAxKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2YXRlSXRlbSh0aGlzLmN1cnJlbnRJdGVtKVxuICAgIH1cbiAgfVxuXG4gIG5leHRQbG90ICgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50SXRlbSA8IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5hY3RpdmF0ZUl0ZW0odGhpcy5jdXJyZW50SXRlbSArIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZhdGVJdGVtKHRoaXMuY3VycmVudEl0ZW0pXG4gICAgfVxuICB9XG5cbiAgc2hvdyAodmlldywge21heFNpemU6IG1heFNpemV9ID0ge21heFNpemU6IE1BWF9TSVpFfSkge1xuICAgIGlmICh2aWV3KSB7XG4gICAgICB0aGlzLmlkcy5wdXNoKHRoaXMuY291bnRlciArPSAxKVxuICAgICAgdGhpcy5pdGVtcy5wdXNoKHZpZXcpXG4gICAgICB0aGlzLnBydW5lKG1heFNpemUpXG4gICAgICB0aGlzLmFjdGl2YXRlSXRlbSh0aGlzLml0ZW1zLmxlbmd0aCAtIDEpXG4gICAgfVxuICAgIGV0Y2gudXBkYXRlKHRoaXMsIGZhbHNlKVxuICB9XG5cbiAgdGVhcmRvd24gKCkge1xuICAgIGlmICh0aGlzLml0ZW1zW3RoaXMuY3VycmVudEl0ZW1dICYmIHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50SXRlbV0udGVhcmRvd24pIHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50SXRlbV0udGVhcmRvd24oKVxuXG4gICAgdGhpcy5pZHMuc3BsaWNlKHRoaXMuY3VycmVudEl0ZW0sIDEpXG4gICAgdGhpcy5pdGVtcy5zcGxpY2UodGhpcy5jdXJyZW50SXRlbSwgMSlcblxuICAgIGlmICghKHRoaXMuY3VycmVudEl0ZW0gPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpKSB7XG4gICAgICB0aGlzLmFjdGl2YXRlSXRlbSh0aGlzLml0ZW1zLmxlbmd0aCAtIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZhdGVJdGVtKHRoaXMuY3VycmVudEl0ZW0pXG4gICAgfVxuICB9XG5cbiAgcHJ1bmUgKG1heFNpemUpIHtcbiAgICBjb25zdCBudW1JdGVtcyA9IHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgaWYgKG51bUl0ZW1zIDw9IG1heFNpemUpIHJldHVyblxuXG4gICAgY29uc3Qgc3RhcnRJbmQgPSBudW1JdGVtcyAtIG1heFNpemVcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZCkgPT4ge1xuICAgICAgaWYgKGluZCA8IHN0YXJ0SW5kICYmIGl0ZW0udGVhcmRvd24pIHtcbiAgICAgICAgaXRlbS50ZWFyZG93bigpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuaWRzID0gdGhpcy5pZHMuc2xpY2Uoc3RhcnRJbmQsIG51bUl0ZW1zKVxuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHN0YXJ0SW5kLCBudW1JdGVtcylcbiAgfVxuXG4gIGNsZWFyQWxsICgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLnRlYXJkb3duICYmIGl0ZW0udGVhcmRvd24oKSlcbiAgICB0aGlzLmlkcyA9IFtdXG4gICAgdGhpcy5pdGVtcyA9IFtdXG5cbiAgICB0aGlzLmFjdGl2YXRlSXRlbSgtMSlcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiAnZ3JhcGgnXG4gIH1cblxuICBzaXplKCkge1xuICAgIGxldCB2aWV3ID0gdGhpcy5lbGVtZW50XG4gICAgbGV0IGJhciA9IHZpZXcucXVlcnlTZWxlY3RvcignLmJhcicpXG4gICAgcmV0dXJuIFt2aWV3LmNsaWVudFdpZHRoLCB2aWV3LmNsaWVudEhlaWdodCAtIGJhci5jbGllbnRIZWlnaHRdXG4gIH1cbn1cblxuUGxvdFBhbmUucmVnaXN0ZXJWaWV3KClcbiJdfQ==