Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.consumeStatusBar = consumeStatusBar;
exports.add = add;
exports.watch = watch;
exports.show = show;
exports.hide = hide;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx dom */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etch3 = require('./etch');

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

// Progress Bars
//
// This module provides an API for displaying progress bars in Atom. The methods
// below allow modifing the stack of progress bars, which is represented by
// corresponding UI elements:
//    - A "global" progress bar is shown in the status bar. In pratice, this is
//      the first determinate progress bar in the stack. If there is none, the
//      first element (which then is indeterminate) will be shown instead. If the
//      stack is empty, an empty progress bar will be shown instead.
//    - Hovering over that status bar element will show the complete stack as
//      an overlay.
//    - Hovering over the actual progress bar of one such stack element will show
//      the message correesponding to that progress bar, if there is any.
//
// Methods:
//
// add(p = {progress: 0})
//    Create and return a ProgressBar with the initial properties specified by `p`,
//    which has the following methods available to it:
//
//    p.level
//        Updates `p`s progress. `prog` is a number between 0 and 1 or `null`; if
//        it is `null`, an indeterminate progress bar will be displayed.
//
//    p.description
//        Sets the text displayed to the left of the progress bar.
//
//    p.destroy()
//        Destroys `p` and removes it from the display stack.

'use babel';var stack = [];
var subs = undefined,
    activated = undefined,
    overlay = undefined,
    tileView = undefined,
    tooltip = undefined,
    tile = undefined;

function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

var ProgressBar = (function () {
  function ProgressBar(level) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var description = _ref.description;

    _classCallCheck(this, ProgressBar);

    this._level = level;
    this._description = description;
  }

  _createClass(ProgressBar, [{
    key: 'destroy',
    value: function destroy() {
      var i = stack.indexOf(this);
      if (i < 0) return;
      stack.splice(i, 1);
      update();
    }
  }]);

  return ProgressBar;
})();

['level', 'description', 'rightText', 'message'].forEach(function (key) {
  Object.defineProperty(ProgressBar.prototype, key, {
    get: function get() {
      return this['_' + key];
    },
    set: function set(val) {
      this['_' + key] = val;
      update();
    }
  });
});

var StackView = (function (_Etch) {
  _inherits(StackView, _Etch);

  function StackView() {
    _classCallCheck(this, StackView);

    _get(Object.getPrototypeOf(StackView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(StackView, [{
    key: 'update',
    value: function update(stack) {
      if (stack && stack.length > 0) this._stack = stack;
      _etch2['default'].update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return (0, _etch3.dom)(
        'table',
        null,
        this.stack.slice().reverse().map(function (_ref2) {
          var _ref2$description = _ref2.description;
          var description = _ref2$description === undefined ? '' : _ref2$description;
          var _ref2$rightText = _ref2.rightText;
          var rightText = _ref2$rightText === undefined ? '' : _ref2$rightText;
          var _ref2$level = _ref2.level;
          var level = _ref2$level === undefined ? 0 : _ref2$level;
          var _ref2$message = _ref2.message;
          var message = _ref2$message === undefined ? "" : _ref2$message;
          return (0, _etch3.dom)(
            'tr',
            null,
            (0, _etch3.dom)(
              'td',
              { className: 'progress-tr' },
              description
            ),
            (0, _etch3.dom)(
              'td',
              { className: 'progress-tr' },
              (0, _etch3.dom)(_etch3.Progress, { level: level, message: message })
            ),
            (0, _etch3.dom)(
              'td',
              { className: 'progress-tr' },
              rightText
            )
          );
        })
      );
    }
  }, {
    key: 'stack',
    get: function get() {
      if (this._stack) {
        return this._stack;
      } else {
        return [];
      }
    }
  }]);

  return StackView;
})(_etch3.Etch);

function globalLevel() {
  if (stack.length === 0) return 0;
  var global = stack.find(function (_ref3) {
    var level = _ref3.level;
    return level != null;
  });
  if (global && global.level > 0.01) return global.level;
}

function update() {
  if (stack.length === 0) tooltip.hide();
  overlay.update(stack);
  tileView.update();
}

function consumeStatusBar(statusBar) {
  subs = new _atom.CompositeDisposable();
  tileView = (0, _etch3.view)(function () {
    return (0, _etch3.dom)(
      'span',
      { className: 'inline-block', style: 'display: none' },
      (0, _etch3.dom)(_etch3.Progress, { level: globalLevel() })
    );
  });
  overlay = new StackView();
  tooltip = new _tooltip2['default'](tileView.element, overlay.element, {
    cond: function cond() {
      return stack.length;
    }
  });
  tile = statusBar.addLeftTile({
    item: tileView.element,
    priority: -1
  });
  subs.add(new _atom.Disposable(function () {
    for (var t of [overlay, tileView, tooltip, tile]) {
      if (t) t.destroy();
    }
    activated = false;
  }));
  activated = true;
  return subs;
}

function add(prog, opts) {
  if (!activated) return;
  show();
  var p = new ProgressBar(prog, opts);
  stack.push(p);
  update();
  return p;
}

function watch(p, opts) {
  var prog = add(null, opts);
  p['catch'](function () {}).then(function () {
    return prog.destroy();
  });
  return prog;
}

function show() {
  tileView.element.style.display = '';
}

function hide() {
  tileView.element.style.display = 'none';
}

function deactivate() {
  if (subs) subs.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL3Byb2dyZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdnRCxNQUFNOztvQkFDckMsTUFBTTs7OztxQkFDbUIsUUFBUTs7dUJBQzlCLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFOL0IsV0FBVyxDQUFBLEFBc0NYLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNkLElBQUksSUFBSSxZQUFBO0lBQUUsU0FBUyxZQUFBO0lBQUUsT0FBTyxZQUFBO0lBQUUsUUFBUSxZQUFBO0lBQUUsT0FBTyxZQUFBO0lBQUUsSUFBSSxZQUFBLENBQUE7O0FBRXJELFNBQVMsS0FBSyxDQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQzNCLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtDQUN2Qzs7SUFFSyxXQUFXO0FBQ0gsV0FEUixXQUFXLENBQ0YsS0FBSyxFQUFzQjtxRUFBSixFQUFFOztRQUFqQixXQUFXLFFBQVgsV0FBVzs7MEJBRDVCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsUUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUE7R0FDaEM7O2VBSkcsV0FBVzs7V0FNUCxtQkFBRztBQUNULFVBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU07QUFDakIsV0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDbEIsWUFBTSxFQUFFLENBQUE7S0FDVDs7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QU0sQ0FBQyxZQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztXQUFNLElBQUksQ0FBQyxPQUFPLEVBQUU7R0FBQSxDQUFDLENBQUE7QUFDNUMsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFTSxTQUFTLElBQUksR0FBSTtBQUN0QixVQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0NBQ3BDOztBQUVNLFNBQVMsSUFBSSxHQUFJO0FBQ3RCLFVBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7Q0FDeEM7O0FBRU0sU0FBUyxVQUFVLEdBQUk7QUFDNUIsTUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0NBQ3pCIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL3Byb2dyZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGRvbSAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBFdGNoLCBQcm9ncmVzcywgdmlldywgZG9tIH0gZnJvbSAnLi9ldGNoJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vdG9vbHRpcCc7XG5cbi8vIFByb2dyZXNzIEJhcnNcbi8vXG4vLyBUaGlzIG1vZHVsZSBwcm92aWRlcyBhbiBBUEkgZm9yIGRpc3BsYXlpbmcgcHJvZ3Jlc3MgYmFycyBpbiBBdG9tLiBUaGUgbWV0aG9kc1xuLy8gYmVsb3cgYWxsb3cgbW9kaWZpbmcgdGhlIHN0YWNrIG9mIHByb2dyZXNzIGJhcnMsIHdoaWNoIGlzIHJlcHJlc2VudGVkIGJ5XG4vLyBjb3JyZXNwb25kaW5nIFVJIGVsZW1lbnRzOlxuLy8gICAgLSBBIFwiZ2xvYmFsXCIgcHJvZ3Jlc3MgYmFyIGlzIHNob3duIGluIHRoZSBzdGF0dXMgYmFyLiBJbiBwcmF0aWNlLCB0aGlzIGlzXG4vLyAgICAgIHRoZSBmaXJzdCBkZXRlcm1pbmF0ZSBwcm9ncmVzcyBiYXIgaW4gdGhlIHN0YWNrLiBJZiB0aGVyZSBpcyBub25lLCB0aGVcbi8vICAgICAgZmlyc3QgZWxlbWVudCAod2hpY2ggdGhlbiBpcyBpbmRldGVybWluYXRlKSB3aWxsIGJlIHNob3duIGluc3RlYWQuIElmIHRoZVxuLy8gICAgICBzdGFjayBpcyBlbXB0eSwgYW4gZW1wdHkgcHJvZ3Jlc3MgYmFyIHdpbGwgYmUgc2hvd24gaW5zdGVhZC5cbi8vICAgIC0gSG92ZXJpbmcgb3ZlciB0aGF0IHN0YXR1cyBiYXIgZWxlbWVudCB3aWxsIHNob3cgdGhlIGNvbXBsZXRlIHN0YWNrIGFzXG4vLyAgICAgIGFuIG92ZXJsYXkuXG4vLyAgICAtIEhvdmVyaW5nIG92ZXIgdGhlIGFjdHVhbCBwcm9ncmVzcyBiYXIgb2Ygb25lIHN1Y2ggc3RhY2sgZWxlbWVudCB3aWxsIHNob3dcbi8vICAgICAgdGhlIG1lc3NhZ2UgY29ycmVlc3BvbmRpbmcgdG8gdGhhdCBwcm9ncmVzcyBiYXIsIGlmIHRoZXJlIGlzIGFueS5cbi8vXG4vLyBNZXRob2RzOlxuLy9cbi8vIGFkZChwID0ge3Byb2dyZXNzOiAwfSlcbi8vICAgIENyZWF0ZSBhbmQgcmV0dXJuIGEgUHJvZ3Jlc3NCYXIgd2l0aCB0aGUgaW5pdGlhbCBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSBgcGAsXG4vLyAgICB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBtZXRob2RzIGF2YWlsYWJsZSB0byBpdDpcbi8vXG4vLyAgICBwLmxldmVsXG4vLyAgICAgICAgVXBkYXRlcyBgcGBzIHByb2dyZXNzLiBgcHJvZ2AgaXMgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxIG9yIGBudWxsYDsgaWZcbi8vICAgICAgICBpdCBpcyBgbnVsbGAsIGFuIGluZGV0ZXJtaW5hdGUgcHJvZ3Jlc3MgYmFyIHdpbGwgYmUgZGlzcGxheWVkLlxuLy9cbi8vICAgIHAuZGVzY3JpcHRpb25cbi8vICAgICAgICBTZXRzIHRoZSB0ZXh0IGRpc3BsYXllZCB0byB0aGUgbGVmdCBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuLy9cbi8vICAgIHAuZGVzdHJveSgpXG4vLyAgICAgICAgRGVzdHJveXMgYHBgIGFuZCByZW1vdmVzIGl0IGZyb20gdGhlIGRpc3BsYXkgc3RhY2suXG5cbmxldCBzdGFjayA9IFtdXG5sZXQgc3VicywgYWN0aXZhdGVkLCBvdmVybGF5LCB0aWxlVmlldywgdG9vbHRpcCwgdGlsZVxuXG5mdW5jdGlvbiBjbGFtcCAoeCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHgsIG1pbiksIG1heClcbn1cblxuY2xhc3MgUHJvZ3Jlc3NCYXIge1xuICBjb25zdHJ1Y3RvciAobGV2ZWwsIHtkZXNjcmlwdGlvbn0gPSB7fSkge1xuICAgIHRoaXMuX2xldmVsID0gbGV2ZWxcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBsZXQgaSA9IHN0YWNrLmluZGV4T2YodGhpcylcbiAgICBpZiAoaSA8IDApIHJldHVyblxuICAgIHN0YWNrLnNwbGljZShpLCAxKVxuICAgIHVwZGF0ZSgpXG4gIH1cbn1cblxuWydsZXZlbCcsICdkZXNjcmlwdGlvbicsICdyaWdodFRleHQnLCAnbWVzc2FnZSddLmZvckVhY2goa2V5ID0+IHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2dyZXNzQmFyLnByb3RvdHlwZSwga2V5LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWydfJyArIGtleV0gfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHRoaXNbJ18nICsga2V5XSA9IHZhbFxuICAgICAgdXBkYXRlKClcbiAgICB9XG4gIH0pXG59KVxuXG5jbGFzcyBTdGFja1ZpZXcgZXh0ZW5kcyBFdGNoIHtcbiAgZ2V0IHN0YWNrICgpIHtcbiAgICBpZiAodGhpcy5fc3RhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFja1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICB1cGRhdGUgKHN0YWNrKSB7XG4gICAgaWYgKHN0YWNrICYmIHN0YWNrLmxlbmd0aCA+IDApIHRoaXMuX3N0YWNrID0gc3RhY2tcbiAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gPHRhYmxlPntcbiAgICAgIHRoaXMuc3RhY2suc2xpY2UoKS5yZXZlcnNlKCkubWFwKCh7ZGVzY3JpcHRpb249JycsIHJpZ2h0VGV4dD0nJywgbGV2ZWw9MCwgbWVzc2FnZT1cIlwifSkgPT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0ZCBjbGFzc05hbWU9J3Byb2dyZXNzLXRyJz57ZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICA8dGQgY2xhc3NOYW1lPSdwcm9ncmVzcy10cic+PFByb2dyZXNzIGxldmVsPXtsZXZlbH0gbWVzc2FnZT17bWVzc2FnZX0vPjwvdGQ+XG4gICAgICAgICAgPHRkIGNsYXNzTmFtZT0ncHJvZ3Jlc3MtdHInPntyaWdodFRleHR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgIClcbiAgICB9PC90YWJsZT5cbiAgfVxufVxuXG5mdW5jdGlvbiBnbG9iYWxMZXZlbCAoKSB7XG4gIGlmIChzdGFjay5sZW5ndGggPT09IDApIHJldHVybiAwXG4gIGxldCBnbG9iYWwgPSBzdGFjay5maW5kKCh7bGV2ZWx9KSA9PiBsZXZlbCAhPSBudWxsKVxuICBpZiAoZ2xvYmFsICYmIGdsb2JhbC5sZXZlbCA+IDAuMDEpIHJldHVybiBnbG9iYWwubGV2ZWxcbn1cblxuZnVuY3Rpb24gdXBkYXRlICgpIHtcbiAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkgdG9vbHRpcC5oaWRlKClcbiAgb3ZlcmxheS51cGRhdGUoc3RhY2spXG4gIHRpbGVWaWV3LnVwZGF0ZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgdGlsZVZpZXcgPSB2aWV3KCgpID0+IChcbiAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jaycgc3R5bGU9J2Rpc3BsYXk6IG5vbmUnPlxuICAgICAgPFByb2dyZXNzIGxldmVsPXtnbG9iYWxMZXZlbCgpfSAvPlxuICAgIDwvc3Bhbj5cbiAgKSlcbiAgb3ZlcmxheSA9IG5ldyBTdGFja1ZpZXcoKVxuICB0b29sdGlwID0gbmV3IFRvb2x0aXAodGlsZVZpZXcuZWxlbWVudCwgb3ZlcmxheS5lbGVtZW50LCB7XG4gICAgY29uZDogKCkgPT4gc3RhY2subGVuZ3RoXG4gIH0pXG4gIHRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoe1xuICAgIGl0ZW06IHRpbGVWaWV3LmVsZW1lbnQsXG4gICAgcHJpb3JpdHk6IC0xXG4gIH0pXG4gIHN1YnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICBmb3IgKGxldCB0IG9mIFtvdmVybGF5LCB0aWxlVmlldywgdG9vbHRpcCwgdGlsZV0pIHtcbiAgICAgIGlmICh0KSB0LmRlc3Ryb3koKVxuICAgIH1cbiAgICBhY3RpdmF0ZWQgPSBmYWxzZVxuICB9KSlcbiAgYWN0aXZhdGVkID0gdHJ1ZVxuICByZXR1cm4gc3Vic1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkIChwcm9nLCBvcHRzKSB7XG4gIGlmICghYWN0aXZhdGVkKSByZXR1cm5cbiAgc2hvdygpXG4gIGxldCBwID0gbmV3IFByb2dyZXNzQmFyKHByb2csIG9wdHMpXG4gIHN0YWNrLnB1c2gocClcbiAgdXBkYXRlKClcbiAgcmV0dXJuIHBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoIChwLCBvcHRzKSB7XG4gIGxldCBwcm9nID0gYWRkKG51bGwsIG9wdHMpXG4gIHAuY2F0Y2goKCkgPT4ge30pLnRoZW4oKCkgPT4gcHJvZy5kZXN0cm95KCkpXG4gIHJldHVybiBwcm9nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93ICgpIHtcbiAgdGlsZVZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGUgKCkge1xuICB0aWxlVmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBpZiAoc3Vicykgc3Vicy5kaXNwb3NlKClcbn1cbiJdfQ==