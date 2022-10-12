Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.toView = toView;
exports.view = view;
exports.toButtons = toButtons;
exports.makeIcon = makeIcon;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError('Cannot destructure undefined'); }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

'use babel';var dom = _etch2['default'].dom;

exports.dom = dom;

var Raw = (function () {
  function Raw(_ref, _ref2) {
    _objectDestructuringEmpty(_ref);

    var _ref22 = _slicedToArray(_ref2, 1);

    var child = _ref22[0];

    _classCallCheck(this, Raw);

    this.update({}, [child]);
  }

  _createClass(Raw, [{
    key: 'update',
    value: function update(_ref3, _ref4) {
      _objectDestructuringEmpty(_ref3);

      var _ref42 = _slicedToArray(_ref4, 1);

      var child = _ref42[0];
      this.element = child;
    }
  }]);

  return Raw;
})();

exports.Raw = Raw;

var Etch = (function () {
  function Etch(props, children) {
    _classCallCheck(this, Etch);

    this.props = props;
    this.children = children;
    _etch2['default'].initialize(this);
  }

  _createClass(Etch, [{
    key: 'update',
    value: function update(props, children) {
      if (props == null) return _etch2['default'].update(this);
      this.props = props;
      this.children = children;
      _etch2['default'].update(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _etch2['default'].destroy(this);
    }
  }]);

  return Etch;
})();

exports.Etch = Etch;

function toView(elem) {
  if (elem == null) {
    return _etch2['default'].dom('div', null);
  } else if (elem instanceof HTMLElement || elem instanceof SVGElement) {
    return _etch2['default'].dom(
      Raw,
      null,
      elem
    );
  } else if (elem && elem.element) {
    return _etch2['default'].dom(
      Raw,
      null,
      elem.element
    );
  } else if (elem instanceof Array) {
    return elem.map(function (e) {
      return toView(e);
    });
  } else {
    return elem;
  }
}

function view(f) {
  var anon = {
    update: function update() {
      return _etch2['default'].update(this);
    },
    render: function render() {
      return f();
    },
    destroy: function destroy() {
      return _etch2['default'].destroy(this);
    }
  };
  _etch2['default'].initialize(anon);
  return anon;
}

var Progress = (function (_Etch) {
  _inherits(Progress, _Etch);

  function Progress(props, children) {
    _classCallCheck(this, Progress);

    _get(Object.getPrototypeOf(Progress.prototype), 'constructor', this).call(this, props, children);

    this.tt = null;
  }

  _createClass(Progress, [{
    key: 'render',
    value: function render() {
      var vals = undefined;
      if (this.props.level == null || isNaN(this.props.level)) {
        vals = {};
      } else {
        vals = { value: this.props.level };
      }

      return _etch2['default'].dom('progress', { className: 'ink', attributes: vals });
    }
  }, {
    key: 'writeAfterUpdate',
    value: function writeAfterUpdate() {
      var _this = this;

      if (this.props.level == null) {
        this.element.removeAttribute('value');
      }

      if (this.props.message) {
        if (!this.tt) {
          this.tt = atom.tooltips.add(this.element, { title: this.props.message });
        } else {
          atom.tooltips.findTooltips(this.element).forEach(function (tooltip) {
            tooltip.options.title = _this.props.message;
            tooltip.setContent();
          });
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.tt) this.tt.dispose();
    }
  }]);

  return Progress;
})(Etch);

exports.Progress = Progress;

var Tip = (function () {
  function Tip(_ref5, _ref6) {
    var _this2 = this;

    var alt = _ref5.alt;

    var _ref62 = _slicedToArray(_ref6, 1);

    var child = _ref62[0];

    _classCallCheck(this, Tip);

    this.text = alt;
    this.child = child;
    _etch2['default'].initialize(this);
    this.tooltip = atom.tooltips.add(this.element, { title: function title() {
        return _this2.text;
      } });
  }

  _createClass(Tip, [{
    key: 'destroy',
    value: function destroy() {
      _etch2['default'].destroy(this);
      if (this.tooltip) this.tooltip.dispose();
    }
  }, {
    key: 'update',
    value: function update(_ref7, _ref8) {
      var _this3 = this;

      var alt = _ref7.alt;

      var _ref82 = _slicedToArray(_ref8, 1);

      var child = _ref82[0];

      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltip = atom.tooltips.add(this.element, { title: function title() {
            return _this3.text;
          } });
      }

      this.text = alt;
      this.child = child;
      _etch2['default'].update(this, false);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.child;
    }
  }]);

  return Tip;
})();

exports.Tip = Tip;

var Icon = (function (_Etch2) {
  _inherits(Icon, _Etch2);

  function Icon() {
    _classCallCheck(this, Icon);

    _get(Object.getPrototypeOf(Icon.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Icon, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom('span', { className: 'icon icon-' + this.props.name });
    }
  }]);

  return Icon;
})(Etch);

exports.Icon = Icon;

var Badge = (function (_Etch3) {
  _inherits(Badge, _Etch3);

  function Badge() {
    _classCallCheck(this, Badge);

    _get(Object.getPrototypeOf(Badge.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Badge, [{
    key: 'render',
    value: function render() {
      var iconClass = this.props.icon ? ' icon icon-' + this.props.icon : '';
      var sizeClass = this.props.size ? ' badge-' + this.props.size : '';
      return _etch2['default'].dom(
        'span',
        { className: 'badge' + iconClass + sizeClass },
        this.children
      );
    }
  }]);

  return Badge;
})(Etch);

exports.Badge = Badge;

var Button = (function (_Etch4) {
  _inherits(Button, _Etch4);

  function Button() {
    _classCallCheck(this, Button);

    _get(Object.getPrototypeOf(Button.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var iconclass = this.props.icon ? ' icon icon-' + this.props.icon : '';
      var classname = this.props.className || '';
      return _etch2['default'].dom(
        Tip,
        { alt: this.props.alt },
        _etch2['default'].dom(
          'button',
          { className: 'btn' + iconclass + ' ' + classname, disabled: this.props.disabled, onclick: this.props.onclick },
          this.children
        )
      );
    }
  }]);

  return Button;
})(Etch);

exports.Button = Button;

function toButtons(btns) {
  return btns.map(function (btn) {
    return btn.type == 'group' ? _etch2['default'].dom(
      'div',
      { className: 'btn-group' },
      toButtons(btn.children)
    ) : btn.icon ? _etch2['default'].dom(Button, { icon: btn.icon, alt: btn.alt, onclick: btn.onclick }) : btn;
  });
}

function makeIcon(icon) {
  if (!icon) return 'v';
  if (icon.startsWith('icon-')) return _etch2['default'].dom('span', { className: 'icon ' + icon });
  return icon.length === 1 ? icon : 'v';
}

var Toolbar = (function (_Etch5) {
  _inherits(Toolbar, _Etch5);

  function Toolbar() {
    _classCallCheck(this, Toolbar);

    _get(Object.getPrototypeOf(Toolbar.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Toolbar, [{
    key: 'render',
    value: function render() {
      var items = this.props.items || [];
      items = toButtons(items).map(function (x) {
        return _etch2['default'].dom(
          'span',
          { className: 'inline-block' },
          x
        );
      });
      return _etch2['default'].dom(
        'div',
        { className: 'ink-toolbar' },
        _etch2['default'].dom(
          'div',
          { className: 'bar' },
          items
        ),
        this.children
      );
    }
  }]);

  return Toolbar;
})(Etch);

exports.Toolbar = Toolbar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL2V0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztBQUh2QixXQUFXLENBQUEsQUFLSixJQUFNLEdBQUcsR0FBRyxrQkFBSyxHQUFHLENBQUM7Ozs7SUFFZixHQUFHO0FBQ0gsV0FEQSxHQUFHLENBQ0YsSUFBRSxFQUFFLEtBQU8sRUFBRTs4QkFBYixJQUFFOztnQ0FBRSxLQUFPOztRQUFOLEtBQUs7OzBCQURYLEdBQUc7O0FBQ2EsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQUU7O2VBRDNDLEdBQUc7O1dBRVIsZ0JBQUMsS0FBRSxFQUFFLEtBQU8sRUFBRTtnQ0FBYixLQUFFOztrQ0FBRSxLQUFPOztVQUFOLEtBQUs7QUFBSyxVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUFFOzs7U0FGbEMsR0FBRzs7Ozs7SUFLSCxJQUFJO0FBQ0osV0FEQSxJQUFJLENBQ0gsS0FBSyxFQUFFLFFBQVEsRUFBRTswQkFEbEIsSUFBSTs7QUFFYixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDdkI7O2VBTFUsSUFBSTs7V0FNVCxnQkFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ3RCLFVBQUksS0FBSyxJQUFJLElBQUksRUFBRSxPQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6Qix3QkFBSyxNQUFN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RUFBRSxPQUFPLGdDQUFNLFNBQVMsWUFBVSxJQUFJLEFBQUcsR0FBRSxDQUFBO0FBQ3ZFLFNBQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQTtDQUN0Qzs7SUFFWSxPQUFPO1lBQVAsT0FBTzs7V0FBUCxPQUFPOzBCQUFQLE9BQU87OytCQUFQLE9BQU87OztlQUFQLE9BQU87O1dBQ1osa0JBQUc7QUFDUCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUE7QUFDbEMsV0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUk7O1lBQU0sU0FBUyxFQUFDLGNBQWM7VUFBRSxDQUFDO1NBQVE7T0FBQSxDQUFDLENBQUM7QUFDN0UsYUFBTzs7VUFBSyxTQUFTLEVBQUMsYUFBYTtRQUNqQzs7WUFBSyxTQUFTLEVBQUMsS0FBSztVQUFFLEtBQUs7U0FBTztRQUNqQyxJQUFJLENBQUMsUUFBUTtPQUNWLENBQUE7S0FDUDs7O1NBUlUsT0FBTztHQUFTLElBQUkiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvZXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJztcblxuZXhwb3J0IGNvbnN0IGRvbSA9IGV0Y2guZG9tO1xuXG5leHBvcnQgY2xhc3MgUmF3IHtcbiAgY29uc3RydWN0b3Ioe30sIFtjaGlsZF0pIHsgdGhpcy51cGRhdGUoe30sIFtjaGlsZF0pOyB9XG4gIHVwZGF0ZSh7fSwgW2NoaWxkXSkgeyB0aGlzLmVsZW1lbnQgPSBjaGlsZDsgfVxufVxuXG5leHBvcnQgY2xhc3MgRXRjaCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjaGlsZHJlbikge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpO1xuICB9XG4gIHVwZGF0ZShwcm9wcywgY2hpbGRyZW4pIHtcbiAgICBpZiAocHJvcHMgPT0gbnVsbCkgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgZXRjaC51cGRhdGUodGhpcyk7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICBldGNoLmRlc3Ryb3kodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmlldyhlbGVtKSB7XG4gIGlmIChlbGVtID09IG51bGwpIHtcbiAgICByZXR1cm4gPGRpdi8+XG4gIH0gZWxzZSBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IGVsZW0gaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgcmV0dXJuIDxSYXc+e2VsZW19PC9SYXc+O1xuICB9IGVsc2UgaWYgKGVsZW0gJiYgZWxlbS5lbGVtZW50KSB7XG4gICAgcmV0dXJuIDxSYXc+e2VsZW0uZWxlbWVudH08L1Jhdz47XG4gIH0gZWxzZSBpZiAoZWxlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGVsZW0ubWFwKChlKSA9PiB0b1ZpZXcoZSkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsZW07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpZXcoZikge1xuICBjb25zdCBhbm9uID0ge1xuICAgIHVwZGF0ZSgpIHsgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpOyB9LFxuICAgIHJlbmRlcigpIHsgcmV0dXJuIGYoKTsgfSxcbiAgICBkZXN0cm95KCkgeyByZXR1cm4gZXRjaC5kZXN0cm95KHRoaXMpOyB9XG4gIH07XG4gIGV0Y2guaW5pdGlhbGl6ZShhbm9uKTtcbiAgcmV0dXJuIGFub247XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9ncmVzcyBleHRlbmRzIEV0Y2gge1xuICBjb25zdHJ1Y3RvciAocHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgc3VwZXIocHJvcHMsIGNoaWxkcmVuKVxuXG4gICAgdGhpcy50dCA9IG51bGxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgdmFsc1xuICAgIGlmICh0aGlzLnByb3BzLmxldmVsID09IG51bGwgfHwgaXNOYU4odGhpcy5wcm9wcy5sZXZlbCkpIHtcbiAgICAgIHZhbHMgPSB7fVxuICAgIH0gZWxzZSB7XG4gICAgICB2YWxzID0ge3ZhbHVlOiB0aGlzLnByb3BzLmxldmVsfVxuICAgIH1cblxuICAgIHJldHVybiA8cHJvZ3Jlc3MgY2xhc3NOYW1lPVwiaW5rXCIgYXR0cmlidXRlcz17dmFsc30vPlxuICB9XG5cbiAgd3JpdGVBZnRlclVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5sZXZlbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm1lc3NhZ2UpIHtcbiAgICAgIGlmICghdGhpcy50dCkge1xuICAgICAgICB0aGlzLnR0ID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7dGl0bGU6IHRoaXMucHJvcHMubWVzc2FnZX0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLnRvb2x0aXBzLmZpbmRUb29sdGlwcyh0aGlzLmVsZW1lbnQpLmZvckVhY2godG9vbHRpcCA9PiB7XG4gICAgICAgICAgdG9vbHRpcC5vcHRpb25zLnRpdGxlID0gdGhpcy5wcm9wcy5tZXNzYWdlXG4gICAgICAgICAgdG9vbHRpcC5zZXRDb250ZW50KClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy50dCkgdGhpcy50dC5kaXNwb3NlKClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGlwIHtcbiAgY29uc3RydWN0b3Ioe2FsdH0sIFtjaGlsZF0pIHtcbiAgICB0aGlzLnRleHQgPSBhbHQ7XG4gICAgdGhpcy5jaGlsZCA9IGNoaWxkO1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHt0aXRsZTogKCkgPT4gdGhpcy50ZXh0fSk7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICBldGNoLmRlc3Ryb3kodGhpcyk7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgfVxuICB1cGRhdGUoe2FsdH0sIFtjaGlsZF0pIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuZGlzcG9zZSgpXG4gICAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHt0aXRsZTogKCkgPT4gdGhpcy50ZXh0fSk7XG4gICAgfVxuXG5cbiAgICB0aGlzLnRleHQgPSBhbHQ7XG4gICAgdGhpcy5jaGlsZCA9IGNoaWxkO1xuICAgIGV0Y2gudXBkYXRlKHRoaXMsIGZhbHNlKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEljb24gZXh0ZW5kcyBFdGNoIHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLnByb3BzLm5hbWV9YH0gLz47XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJhZGdlIGV4dGVuZHMgRXRjaCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBpY29uQ2xhc3MgPSB0aGlzLnByb3BzLmljb24gPyBgIGljb24gaWNvbi0ke3RoaXMucHJvcHMuaWNvbn1gIDogJyc7XG4gICAgY29uc3Qgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gYCBiYWRnZS0ke3RoaXMucHJvcHMuc2l6ZX1gIDogJyc7XG4gICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17J2JhZGdlJytpY29uQ2xhc3Mrc2l6ZUNsYXNzfT57dGhpcy5jaGlsZHJlbn08L3NwYW4+O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBFdGNoIHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGljb25jbGFzcyA9IHRoaXMucHJvcHMuaWNvbiA/IGAgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5pY29ufWAgOiAnJztcbiAgICBjb25zdCBjbGFzc25hbWUgPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnJ1xuICAgIHJldHVybiA8VGlwIGFsdD17dGhpcy5wcm9wcy5hbHR9PlxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9eydidG4nICsgaWNvbmNsYXNzICsgJyAnICsgY2xhc3NuYW1lfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0gb25jbGljaz17dGhpcy5wcm9wcy5vbmNsaWNrfT57XG4gICAgICAgIHRoaXMuY2hpbGRyZW5cbiAgICAgIH08L2J1dHRvbj5cbiAgICA8L1RpcD47XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQnV0dG9ucyhidG5zKSB7XG4gIHJldHVybiBidG5zLm1hcChidG4gPT5cbiAgICBidG4udHlwZSA9PSAnZ3JvdXAnID8gPGRpdiBjbGFzc05hbWU9J2J0bi1ncm91cCc+e3RvQnV0dG9ucyhidG4uY2hpbGRyZW4pfTwvZGl2PiA6XG4gICAgYnRuLmljb24gPyAgPEJ1dHRvbiBpY29uPXtidG4uaWNvbn0gYWx0PXtidG4uYWx0fSBvbmNsaWNrPXtidG4ub25jbGlja30gLz4gOlxuICAgIGJ0blxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSWNvbihpY29uKSB7XG4gIGlmICghaWNvbikgcmV0dXJuICd2J1xuICBpZiAoaWNvbi5zdGFydHNXaXRoKCdpY29uLScpKSByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiAke2ljb259YH0vPlxuICByZXR1cm4gaWNvbi5sZW5ndGggPT09IDEgPyBpY29uIDogJ3YnXG59XG5cbmV4cG9ydCBjbGFzcyBUb29sYmFyIGV4dGVuZHMgRXRjaCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zIHx8IFtdXG4gICAgaXRlbXMgPSB0b0J1dHRvbnMoaXRlbXMpLm1hcCh4ID0+IDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrJz57eH08L3NwYW4+KTtcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2luay10b29sYmFyJz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXInPntpdGVtc308L2Rpdj5cbiAgICAgIHt0aGlzLmNoaWxkcmVufVxuICAgIDwvZGl2PlxuICB9XG59XG4iXX0=