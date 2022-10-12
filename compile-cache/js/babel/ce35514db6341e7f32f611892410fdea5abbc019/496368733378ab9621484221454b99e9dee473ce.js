Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _treeJs = require('./tree.js');

var _utilEtchJs = require('../util/etch.js');

'use babel';

function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

function maprange(_ref, _ref3, x) {
  var _ref2 = _slicedToArray(_ref, 2);

  var x1 = _ref2[0];
  var x2 = _ref2[1];

  var _ref32 = _slicedToArray(_ref3, 2);

  var y1 = _ref32[0];
  var y2 = _ref32[1];

  return (x - x1) / (x2 - x1) * (y2 - y1) + y1;
}

function dims(tree) {
  var _ref4 = [1, 1];
  tree.height = _ref4[0];
  tree.width = _ref4[1];
  var _ref5 = [0, 0];
  tree.top = _ref5[0];
  tree.left = _ref5[1];

  (0, _treeJs.prewalk)(tree, function (parent) {
    var left = parent.left;
    parent.children.forEach(function (ch) {
      ch.width = ch.count / parent.count * parent.width;
      ch.height = maprange([0, 1], [1 / 5, 1], ch.count / parent.count) * parent.height;
      ch.left = left;
      ch.top = parent.top + parent.height;
      left += ch.width;
    });
    // Centre align children
    chwidth = parent.children.map(function (_ref6) {
      var width = _ref6.width;
      return width;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    parent.children.forEach(function (ch) {
      return ch.left += (parent.width - chwidth) / 2;
    });
    return parent;
  });
  // Scale total height to 100%
  var max = (0, _treeJs.postwalk)(tree, function (_ref7) {
    var height = _ref7.height;
    var children = _ref7.children;
    return Math.max.apply(Math, [height].concat(_toConsumableArray(children.map(function (x) {
      return x + height;
    }))));
  });
  (0, _treeJs.prewalk)(tree, function (node) {
    node.top /= max;
    node.height /= max;
    return node;
  });
  return tree;
}

var Clickable = (function (_Etch) {
  _inherits(Clickable, _Etch);

  function Clickable() {
    _classCallCheck(this, Clickable);

    _get(Object.getPrototypeOf(Clickable.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Clickable, [{
    key: 'hypot',
    value: function hypot(_ref8, _ref9) {
      var _ref82 = _slicedToArray(_ref8, 2);

      var x1 = _ref82[0];
      var x2 = _ref82[1];

      var _ref92 = _slicedToArray(_ref9, 2);

      var y1 = _ref92[0];
      var y2 = _ref92[1];

      return Math.sqrt(Math.pow(y1 - x1, 2) + Math.pow(y2 - x2, 2));
    }
  }, {
    key: 'onclick',
    value: function onclick(e) {
      if (!this.clickStart) return;
      if (this.hypot(this.clickStart, [e.clientX, e.clientY]) < 5) this.props.onclick(e);
      this.clickStart = null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _etch2['default'].dom(
        'span',
        { onmousedown: function (e) {
            return _this.clickStart = [e.clientX, e.clientY];
          },
          onclick: function (e) {
            return _this.onclick(e);
          },
          onmouseleave: function (e) {
            return _this.clickStart = null;
          } },
        this.children
      );
    }
  }]);

  return Clickable;
})(_utilEtchJs.Etch);

var Pannable = (function (_Etch2) {
  _inherits(Pannable, _Etch2);

  function Pannable(item, opts) {
    var _this2 = this;

    _classCallCheck(this, Pannable);

    opts = Object.assign({}, {
      zoomstrategy: 'transform',
      minScale: 0.001,
      maxScale: 500
    }, opts);

    _get(Object.getPrototypeOf(Pannable.prototype), 'constructor', this).call(this);

    this.item = item;
    this.zoomstrategy = opts.zoomstrategy;
    this.minScale = opts.minScale;
    this.maxScale = opts.maxScale;
    this.left = 0;
    this.top = 0;

    this.isLoaded = false;

    if (item && item.nodeName && item.nodeName.toLowerCase() === 'img') {
      item.onload = function () {
        _etch2['default'].update(_this2).then(function () {
          _this2.setInitialScale(item);
          _this2.isLoaded = true;
          _etch2['default'].update(_this2);
        });
      };
    } else {
      _etch2['default'].update(this).then(function () {
        _this2.setInitialScale(item);
        _this2.isLoaded = true;
        _etch2['default'].update(_this2);
      });
    }
    _etch2['default'].update(this);
  }

  _createClass(Pannable, [{
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      this.innerContainerRect = this.refs.innerContainer.getBoundingClientRect();
      this.outerContainerRect = this.refs.outerContainer.getBoundingClientRect();
    }
  }, {
    key: 'setInitialScale',
    value: function setInitialScale(item) {
      this.initialScale = 1;
      if (item.naturalHeight && item.naturalWidth && this.outerContainerRect) {
        // only scale down, not up:
        this.initialScale = Math.min(this.outerContainerRect.width / item.naturalWidth, this.outerContainerRect.height / item.naturalHeight, 1);
      }
    }
  }, {
    key: 'resetAll',
    value: function resetAll() {
      this.setInitialScale(this.item);
      this.scale = this.initialScale;
      this.left = 0;
      this.top = 0;

      _etch2['default'].update(this);
    }
  }, {
    key: 'ondrag',
    value: function ondrag(_ref10) {
      var movementX = _ref10.movementX;
      var movementY = _ref10.movementY;

      if (!this.dragging) return;

      this.left += movementX;
      this.top += movementY;
      _etch2['default'].update(this);
    }
  }, {
    key: 'zoom',
    value: function zoom(e, amount) {
      var zoom = amount || Math.pow(e.shiftKey ? 0.99 : 0.999, e.deltaY);

      if (zoom * this.scale > this.maxScale || zoom * this.scale < this.minScale) return;

      this.scale *= zoom;

      if (this.innerContainerRect) {
        var x = undefined,
            y = undefined;
        if (amount) {
          x = this.innerContainerRect.width / 2;
          y = this.innerContainerRect.height / 2;
        } else {
          x = clamp(e.clientX - this.innerContainerRect.left, 0, this.innerContainerRect.width);
          y = clamp(e.clientY - this.innerContainerRect.top, 0, this.innerContainerRect.height);
        }

        this.left -= x * zoom - x;
        this.top -= y * zoom - y;
      }
      _etch2['default'].update(this);
    }
  }, {
    key: 'toolbarView',
    value: function toolbarView() {
      var _this3 = this;

      return _etch2['default'].dom(
        'div',
        { className: 'btn-group' },
        _etch2['default'].dom(_utilEtchJs.Button, { icon: 'plus', alt: 'Zoom In', onclick: function () {
            return _this3.zoom(null, 1.1);
          } }),
        _etch2['default'].dom(_utilEtchJs.Button, { icon: 'dash', alt: 'Zoom Out', onclick: function () {
            return _this3.zoom(null, 0.9);
          } }),
        _etch2['default'].dom(_utilEtchJs.Button, { icon: 'screen-normal', alt: 'Reset Plot', onclick: function () {
            return _this3.resetAll();
          } })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (!this.scale) this.scale = this.initialScale;
      var scale = this.scale * 100 + '%';

      this.toolbar = [this.toolbarView()];

      if (this.item && this.item.toolbar) {
        this.toolbar = this.toolbar.concat(this.item.toolbar);
      }

      var style = { position: 'relative', height: 'inherit', width: 'inherit', transformOrigin: '0px 0px' };

      if (this.zoomstrategy == 'width') {
        style.transform = 'translate(' + this.left + 'px,' + this.top + 'px)';
        style.height = scale;
        style.width = scale;
      } else if (this.zoomstrategy == 'transform') {
        style.transform = 'translate(' + this.left + 'px,' + this.top + 'px) scale(' + this.scale + ')';
      }
      if (this.isLoaded) {
        style.visibility = 'initial';
      } else {
        style.visibility = 'hidden';
      }

      return _etch2['default'].dom(
        'div',
        { style: { height: '100%', width: '100%' },
          onmousedown: function (e) {
            return _this4.dragging = true;
          },
          onmouseup: function (e) {
            return _this4.dragging = false;
          },
          onmouseleave: function (e) {
            return _this4.dragging = false;
          },
          onmousemove: function (e) {
            return _this4.ondrag(e);
          },
          onmousewheel: function (e) {
            return _this4.zoom(e);
          },
          ondblclick: function (e) {
            return _this4.resetAll();
          },
          ref: 'outerContainer' },
        _etch2['default'].dom(
          'div',
          { style: style, className: 'ink-pannable', ref: 'innerContainer' },
          (0, _utilEtchJs.toView)(this.item)
        )
      );
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.item && this.item.teardown) this.item.teardown();
      _etch2['default'].update(this);
    }
  }, {
    key: 'build',
    value: function build() {
      if (this.item && this.item.build) this.item.build();
      _etch2['default'].update(this);
    }
  }]);

  return Pannable;
})(_utilEtchJs.Etch);

exports.Pannable = Pannable;

var NodeView = (function (_Etch3) {
  _inherits(NodeView, _Etch3);

  function NodeView() {
    _classCallCheck(this, NodeView);

    _get(Object.getPrototypeOf(NodeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(NodeView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var height = _props.height;
      var width = _props.width;
      var top = _props.top;
      var left = _props.left;
      var onclick = _props.onclick;
      var classes = _props.classes;
      var onmouseover = _props.onmouseover;
      var onmouseout = _props.onmouseout;

      return _etch2['default'].dom(
        Clickable,
        { onclick: onclick },
        _etch2['default'].dom(
          'div',
          _extends({ className: 'node ' + classes.join(' ') }, { onmouseover: onmouseover, onmouseout: onmouseout }, { style: {
              height: 100 * height + '%',
              width: 100 * width + '%',
              top: 100 * top + '%',
              left: 100 * left + '%'
            } }),
          _etch2['default'].dom(
            'div',
            null,
            _etch2['default'].dom('div', null)
          )
        )
      );
    }
  }]);

  return NodeView;
})(_utilEtchJs.Etch);

var Canopy = (function (_Etch4) {
  _inherits(Canopy, _Etch4);

  function Canopy() {
    _classCallCheck(this, Canopy);

    _get(Object.getPrototypeOf(Canopy.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Canopy, [{
    key: 'update',
    value: function update(_ref11) {
      var data = _ref11.data;
      var className = _ref11.className;
    }
  }, {
    key: 'render',
    value: function render() {
      var nodes = [];
      var className = this.props.className || '';
      (0, _treeJs.prefor)(dims(this.props.data), function (node) {
        return nodes.push(_etch2['default'].dom(NodeView, node));
      });
      return _etch2['default'].dom(
        'div',
        { className: "ink-canopy " + className },
        nodes
      );
    }
  }]);

  return Canopy;
})(_utilEtchJs.Etch);

exports['default'] = Canopy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9wbG90cy9jYW5vcHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztzQkFDbUIsV0FBVzs7MEJBQ1gsaUJBQWlCOztBQUwzRCxXQUFXLENBQUM7O0FBT1osU0FBUyxLQUFLLENBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDM0IsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0NBQ3ZDOztBQUVELFNBQVMsUUFBUSxDQUFDLElBQVEsRUFBRSxLQUFRLEVBQUUsQ0FBQyxFQUFFOzZCQUF2QixJQUFROztNQUFQLEVBQUU7TUFBRSxFQUFFOzs4QkFBRyxLQUFROztNQUFQLEVBQUU7TUFBRSxFQUFFOztBQUNqQyxTQUFPLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxJQUFHLEVBQUUsR0FBQyxFQUFFLENBQUEsQUFBQyxJQUFFLEVBQUUsR0FBQyxFQUFFLENBQUEsQUFBQyxHQUFDLEVBQUUsQ0FBQztDQUNsQzs7QUFFRCxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUU7Y0FDVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFBakMsTUFBSSxDQUFDLE1BQU07QUFBRSxNQUFJLENBQUMsS0FBSztjQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUE3QixNQUFJLENBQUMsR0FBRztBQUFFLE1BQUksQ0FBQyxJQUFJOztBQUNwQix1QkFBUSxJQUFJLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDeEIsUUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixVQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsRUFB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QVMsR0FBaEIsTUFBaUIsQ0FBVixTQUFTO0tBQUs7OztXQUN0QixrQkFBRztBQUNQLFVBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNoQixVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUE7QUFDNUMsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBQSxJQUFJO2VBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxzQkFBQyxRQUFRLEVBQUssSUFBSSxDQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDekUsYUFBTzs7VUFBSyxTQUFTLEVBQUUsYUFBYSxHQUFHLFNBQVMsQUFBQztRQUM5QyxLQUFLO09BQ0YsQ0FBQTtLQUNQOzs7U0FUa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3Bsb3RzL2Nhbm9weS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5pbXBvcnQgeyBwcmV3YWxrLCBwb3N0d2FsaywgcHJlZm9yIH0gZnJvbSAnLi90cmVlLmpzJztcbmltcG9ydCB7IEV0Y2gsIFRpcCwgQnV0dG9uLCB0b1ZpZXcgfSBmcm9tICcuLi91dGlsL2V0Y2guanMnO1xuXG5mdW5jdGlvbiBjbGFtcCAoeCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHgsIG1pbiksIG1heClcbn1cblxuZnVuY3Rpb24gbWFwcmFuZ2UoW3gxLCB4Ml0sIFt5MSwgeTJdLCB4KSB7XG4gIHJldHVybiAoeC14MSkvKHgyLXgxKSooeTIteTEpK3kxO1xufVxuXG5mdW5jdGlvbiBkaW1zKHRyZWUpIHtcbiAgW3RyZWUuaGVpZ2h0LCB0cmVlLndpZHRoXSA9IFsxLCAxXTtcbiAgW3RyZWUudG9wLCB0cmVlLmxlZnRdID0gWzAsIDBdO1xuICBwcmV3YWxrKHRyZWUsIChwYXJlbnQpID0+IHtcbiAgICBsZXQgbGVmdCA9IHBhcmVudC5sZWZ0O1xuICAgIHBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKGNoID0+IHtcbiAgICAgIGNoLndpZHRoID0gY2guY291bnQgLyBwYXJlbnQuY291bnQgKiBwYXJlbnQud2lkdGg7XG4gICAgICBjaC5oZWlnaHQgPSBtYXByYW5nZShbMCwxXSxbMS81LDFdLGNoLmNvdW50L3BhcmVudC5jb3VudCkqcGFyZW50LmhlaWdodDtcbiAgICAgIGNoLmxlZnQgPSBsZWZ0O1xuICAgICAgY2gudG9wID0gcGFyZW50LnRvcCArIHBhcmVudC5oZWlnaHQ7XG4gICAgICBsZWZ0ICs9IGNoLndpZHRoO1xuICAgIH0pO1xuICAgIC8vIENlbnRyZSBhbGlnbiBjaGlsZHJlblxuICAgIGNod2lkdGggPSBwYXJlbnQuY2hpbGRyZW4ubWFwKCh7d2lkdGh9KT0+d2lkdGgpLnJlZHVjZSgoYSxiKT0+YStiLCAwKTtcbiAgICBwYXJlbnQuY2hpbGRyZW4uZm9yRWFjaChjaCA9PiBjaC5sZWZ0ICs9IChwYXJlbnQud2lkdGgtY2h3aWR0aCkvMik7XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfSk7XG4gIC8vIFNjYWxlIHRvdGFsIGhlaWdodCB0byAxMDAlXG4gIGxldCBtYXggPSBwb3N0d2Fsayh0cmVlLCAoe2hlaWdodCwgY2hpbGRyZW59KSA9PlxuICAgIE1hdGgubWF4KGhlaWdodCwgLi4uY2hpbGRyZW4ubWFwKHg9PngraGVpZ2h0KSkpO1xuICBwcmV3YWxrKHRyZWUsIChub2RlKSA9PiB7XG4gICAgbm9kZS50b3AgLz0gbWF4O1xuICAgIG5vZGUuaGVpZ2h0IC89IG1heDtcbiAgICByZXR1cm4gbm9kZTtcbiAgfSk7XG4gIHJldHVybiB0cmVlO1xufVxuXG5jbGFzcyBDbGlja2FibGUgZXh0ZW5kcyBFdGNoIHtcbiAgaHlwb3QoW3gxLCB4Ml0sIFt5MSwgeTJdKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh5MS14MSwyKStNYXRoLnBvdyh5Mi14MiwyKSk7XG4gIH1cbiAgb25jbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLmNsaWNrU3RhcnQpIHJldHVybjtcbiAgICBpZiAodGhpcy5oeXBvdCh0aGlzLmNsaWNrU3RhcnQsIFtlLmNsaWVudFgsIGUuY2xpZW50WV0pIDwgNSlcbiAgICAgIHRoaXMucHJvcHMub25jbGljayhlKTtcbiAgICB0aGlzLmNsaWNrU3RhcnQgPSBudWxsO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPHNwYW4gb25tb3VzZWRvd249e2U9PnRoaXMuY2xpY2tTdGFydD1bZS5jbGllbnRYLGUuY2xpZW50WV19XG4gICAgICAgICAgICAgICAgIG9uY2xpY2s9e2U9PnRoaXMub25jbGljayhlKX1cbiAgICAgICAgICAgICAgICAgb25tb3VzZWxlYXZlPXtlPT50aGlzLmNsaWNrU3RhcnQ9bnVsbH0+e1xuICAgICAgdGhpcy5jaGlsZHJlblxuICAgIH08L3NwYW4+O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYW5uYWJsZSBleHRlbmRzIEV0Y2gge1xuICBjb25zdHJ1Y3RvciAoaXRlbSwgb3B0cykge1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB6b29tc3RyYXRlZ3k6ICd0cmFuc2Zvcm0nLFxuICAgICAgbWluU2NhbGU6IDAuMDAxLFxuICAgICAgbWF4U2NhbGU6IDUwMFxuICAgIH0sIG9wdHMpXG5cbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgdGhpcy56b29tc3RyYXRlZ3kgPSBvcHRzLnpvb21zdHJhdGVneVxuICAgIHRoaXMubWluU2NhbGUgPSBvcHRzLm1pblNjYWxlXG4gICAgdGhpcy5tYXhTY2FsZSA9IG9wdHMubWF4U2NhbGVcbiAgICB0aGlzLmxlZnQgPSAwXG4gICAgdGhpcy50b3AgPSAwXG5cbiAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2VcblxuICAgIGlmIChpdGVtICYmIGl0ZW0ubm9kZU5hbWUgJiYgaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW1nJykge1xuICAgICAgaXRlbS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGV0Y2gudXBkYXRlKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbFNjYWxlKGl0ZW0pXG4gICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWVcbiAgICAgICAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldGNoLnVwZGF0ZSh0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU2NhbGUoaXRlbSlcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWVcbiAgICAgICAgZXRjaC51cGRhdGUodGhpcylcbiAgICAgIH0pXG4gICAgfVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUgKCkge1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJSZWN0ID0gdGhpcy5yZWZzLmlubmVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5vdXRlckNvbnRhaW5lclJlY3QgPSB0aGlzLnJlZnMub3V0ZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgfVxuXG4gIHNldEluaXRpYWxTY2FsZSAoaXRlbSkge1xuICAgIHRoaXMuaW5pdGlhbFNjYWxlID0gMVxuICAgIGlmIChpdGVtLm5hdHVyYWxIZWlnaHQgJiYgaXRlbS5uYXR1cmFsV2lkdGggJiYgdGhpcy5vdXRlckNvbnRhaW5lclJlY3QpIHtcbiAgICAgIC8vIG9ubHkgc2NhbGUgZG93biwgbm90IHVwOlxuICAgICAgdGhpcy5pbml0aWFsU2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgdGhpcy5vdXRlckNvbnRhaW5lclJlY3Qud2lkdGgvaXRlbS5uYXR1cmFsV2lkdGgsXG4gICAgICAgIHRoaXMub3V0ZXJDb250YWluZXJSZWN0LmhlaWdodC9pdGVtLm5hdHVyYWxIZWlnaHQsXG4gICAgICAgIDFcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZXNldEFsbCAoKSB7XG4gICAgdGhpcy5zZXRJbml0aWFsU2NhbGUodGhpcy5pdGVtKVxuICAgIHRoaXMuc2NhbGUgPSB0aGlzLmluaXRpYWxTY2FsZVxuICAgIHRoaXMubGVmdCA9IDBcbiAgICB0aGlzLnRvcCA9IDBcblxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBvbmRyYWcoe21vdmVtZW50WCwgbW92ZW1lbnRZfSkge1xuICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG4gICAgdGhpcy5sZWZ0ICs9IG1vdmVtZW50WFxuICAgIHRoaXMudG9wICs9IG1vdmVtZW50WVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpO1xuICB9XG5cbiAgem9vbShlLCBhbW91bnQpIHtcbiAgICBjb25zdCB6b29tID0gYW1vdW50IHx8IE1hdGgucG93KGUuc2hpZnRLZXkgPyAwLjk5IDogMC45OTksIGUuZGVsdGFZKVxuXG4gICAgaWYgKHpvb20qdGhpcy5zY2FsZSA+IHRoaXMubWF4U2NhbGUgfHwgem9vbSp0aGlzLnNjYWxlIDwgdGhpcy5taW5TY2FsZSkgcmV0dXJuXG5cbiAgICB0aGlzLnNjYWxlICo9IHpvb21cblxuICAgIGlmICh0aGlzLmlubmVyQ29udGFpbmVyUmVjdCkge1xuICAgICAgbGV0IHgsIHlcbiAgICAgIGlmIChhbW91bnQpIHtcbiAgICAgICAgeCA9IHRoaXMuaW5uZXJDb250YWluZXJSZWN0LndpZHRoLzJcbiAgICAgICAgeSA9IHRoaXMuaW5uZXJDb250YWluZXJSZWN0LmhlaWdodC8yXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gY2xhbXAoZS5jbGllbnRYIC0gdGhpcy5pbm5lckNvbnRhaW5lclJlY3QubGVmdCwgMCwgdGhpcy5pbm5lckNvbnRhaW5lclJlY3Qud2lkdGgpXG4gICAgICAgIHkgPSBjbGFtcChlLmNsaWVudFkgLSB0aGlzLmlubmVyQ29udGFpbmVyUmVjdC50b3AsIDAsIHRoaXMuaW5uZXJDb250YWluZXJSZWN0LmhlaWdodClcbiAgICAgIH1cblxuICAgICAgdGhpcy5sZWZ0IC09IHgqem9vbSAtIHhcbiAgICAgIHRoaXMudG9wIC09IHkqem9vbSAtIHlcbiAgICB9XG4gICAgZXRjaC51cGRhdGUodGhpcyk7XG4gIH1cblxuICB0b29sYmFyVmlldyAoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdidG4tZ3JvdXAnPlxuICAgICAgPEJ1dHRvbiBpY29uPSdwbHVzJyBhbHQ9J1pvb20gSW4nIG9uY2xpY2s9eygpID0+IHRoaXMuem9vbShudWxsLCAxLjEpfS8+XG4gICAgICA8QnV0dG9uIGljb249J2Rhc2gnIGFsdD0nWm9vbSBPdXQnIG9uY2xpY2s9eygpID0+IHRoaXMuem9vbShudWxsLCAwLjkpfS8+XG4gICAgICA8QnV0dG9uIGljb249J3NjcmVlbi1ub3JtYWwnIGFsdD0nUmVzZXQgUGxvdCcgb25jbGljaz17KCkgPT4gdGhpcy5yZXNldEFsbCgpfS8+XG4gICAgPC9kaXY+XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnNjYWxlKSB0aGlzLnNjYWxlID0gdGhpcy5pbml0aWFsU2NhbGVcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMuc2NhbGUqMTAwKyclJ1xuXG4gICAgdGhpcy50b29sYmFyID0gW3RoaXMudG9vbGJhclZpZXcoKV1cblxuICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLnRvb2xiYXIpIHtcbiAgICAgIHRoaXMudG9vbGJhciA9IHRoaXMudG9vbGJhci5jb25jYXQodGhpcy5pdGVtLnRvb2xiYXIpXG4gICAgfVxuXG4gICAgbGV0IHN0eWxlID0ge3Bvc2l0aW9uOidyZWxhdGl2ZScsIGhlaWdodDonaW5oZXJpdCcsIHdpZHRoOidpbmhlcml0JywgdHJhbnNmb3JtT3JpZ2luOiAnMHB4IDBweCd9XG5cbiAgICBpZiAodGhpcy56b29tc3RyYXRlZ3kgPT0gJ3dpZHRoJykge1xuICAgICAgc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnK3RoaXMubGVmdCsncHgsJyt0aGlzLnRvcCsncHgpJ1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc2NhbGVcbiAgICAgIHN0eWxlLndpZHRoID0gc2NhbGVcbiAgICB9IGVsc2UgaWYgKHRoaXMuem9vbXN0cmF0ZWd5ID09ICd0cmFuc2Zvcm0nKSB7XG4gICAgICBzdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcrdGhpcy5sZWZ0KydweCwnK3RoaXMudG9wKydweCkgc2NhbGUoJyt0aGlzLnNjYWxlKycpJ1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xuICAgICAgc3R5bGUudmlzaWJpbGl0eSA9ICdpbml0aWFsJ1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBzdHlsZT17e2hlaWdodDonMTAwJScsd2lkdGg6JzEwMCUnfX1cbiAgICAgICAgICAgICAgICBvbm1vdXNlZG93bj17ZT0+dGhpcy5kcmFnZ2luZz10cnVlfVxuICAgICAgICAgICAgICAgIG9ubW91c2V1cD17ZT0+dGhpcy5kcmFnZ2luZz1mYWxzZX1cbiAgICAgICAgICAgICAgICBvbm1vdXNlbGVhdmU9e2U9PnRoaXMuZHJhZ2dpbmc9ZmFsc2V9XG4gICAgICAgICAgICAgICAgb25tb3VzZW1vdmU9e2U9PnRoaXMub25kcmFnKGUpfVxuICAgICAgICAgICAgICAgIG9ubW91c2V3aGVlbD17ZT0+dGhpcy56b29tKGUpfVxuICAgICAgICAgICAgICAgIG9uZGJsY2xpY2s9e2U9PnRoaXMucmVzZXRBbGwoKX1cbiAgICAgICAgICAgICAgICByZWY9J291dGVyQ29udGFpbmVyJz5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBjbGFzc05hbWU9J2luay1wYW5uYWJsZScgcmVmPSdpbm5lckNvbnRhaW5lcic+XG4gICAgICAgIHt0b1ZpZXcodGhpcy5pdGVtKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PjtcbiAgfVxuXG4gIHRlYXJkb3duICgpIHtcbiAgICBpZiAodGhpcy5pdGVtICYmIHRoaXMuaXRlbS50ZWFyZG93bikgdGhpcy5pdGVtLnRlYXJkb3duKClcbiAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgYnVpbGQgKCkge1xuICAgIGlmICh0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLmJ1aWxkKSB0aGlzLml0ZW0uYnVpbGQoKVxuICAgIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cblxuY2xhc3MgTm9kZVZpZXcgZXh0ZW5kcyBFdGNoIHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtoZWlnaHQsIHdpZHRoLCB0b3AsIGxlZnQsIG9uY2xpY2ssIGNsYXNzZXMsIG9ubW91c2VvdmVyLCBvbm1vdXNlb3V0fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIDxDbGlja2FibGUgb25jbGljaz17b25jbGlja30+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YG5vZGUgJHtjbGFzc2VzLmpvaW4oJyAnKX1gfSB7Li4ue29ubW91c2VvdmVyLCBvbm1vdXNlb3V0fX0gc3R5bGU9e3tcbiAgICAgICAgaGVpZ2h0OiAxMDAqaGVpZ2h0KyclJyxcbiAgICAgICAgd2lkdGg6ICAxMDAqd2lkdGggKyclJyxcbiAgICAgICAgdG9wOiAgICAxMDAqdG9wICAgKyclJyxcbiAgICAgICAgbGVmdDogICAxMDAqbGVmdCAgKyclJ1xuICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0NsaWNrYWJsZT47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2Fub3B5IGV4dGVuZHMgRXRjaCB7XG4gIHVwZGF0ZSh7ZGF0YSwgY2xhc3NOYW1lfSkge31cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG5vZGVzID0gW11cbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnJ1xuICAgIHByZWZvcihkaW1zKHRoaXMucHJvcHMuZGF0YSksIG5vZGUgPT4gbm9kZXMucHVzaCg8Tm9kZVZpZXcgey4uLm5vZGV9IC8+KSlcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e1wiaW5rLWNhbm9weSBcIiArIGNsYXNzTmFtZX0+XG4gICAgICB7bm9kZXN9XG4gICAgPC9kaXY+XG4gIH1cbn1cbiJdfQ==