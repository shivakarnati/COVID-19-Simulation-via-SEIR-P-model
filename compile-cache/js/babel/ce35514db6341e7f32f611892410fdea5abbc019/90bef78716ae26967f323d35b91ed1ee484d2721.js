Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utilViews = require('../util/views');

var _utilViews2 = _interopRequireDefault(_utilViews);

var _utilAnsitohtml = require('../util/ansitohtml');

var _utilAnsitohtml2 = _interopRequireDefault(_utilAnsitohtml);

'use babel';
var _views$tags = _utilViews2['default'].tags;
var span = _views$tags.span;
var div = _views$tags.div;

var MIN_RESULT_WIDTH = 30;
var RESULT_OFFSET = 20;
var RESULT_HIDE_OFFSET = 3;

var ResultView = (function () {
  function ResultView(model) {
    var _this = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ResultView);

    this.model = model;
    this.disposables = new _atom.CompositeDisposable();
    this.completeView(opts);

    this.model.onDidRemove(function () {
      return _this.destroy();
    });
    this.model.onDidUpdate(function () {
      return _this.modelUpdated = true;
    });
    this.model.onDidInvalidate(function () {
      return _this.view.classList.add('invalid');
    });
    this.model.onDidValidate(function () {
      return _this.view.classList.remove('invalid');
    });
    this.model.onDidAttach(function () {
      return _this.overlayElement = _this.complete.parentElement;
    });

    this.lastEdWidth = -1;

    this.isVisible = true;

    // HACK: compatibility to proto-repl:
    this.classList = { add: function add() {} };

    return this;
  }

  _createClass(ResultView, [{
    key: 'getView',
    value: function getView() {
      return this.model.type == 'inline' ? this.complete : this.view;
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.view;
    }
  }, {
    key: 'getRawContent',
    value: function getRawContent() {
      return this.rawContent;
    }
  }, {
    key: 'completeView',
    value: function completeView(opts) {
      var _this2 = this;

      this.complete = document.createElement('div');
      this.complete.classList.add('ink-result-container');
      if (!opts.noTB && opts.type === 'inline') {
        this.toolbarView = this.toolbar(opts.buttons, opts.customButtons);
        this.complete.appendChild(this.toolbarView);
      }

      this.complete.appendChild(this.content(opts));

      this.disposables.add(atom.config.observe('editor.lineHeight', function (h) {
        _this2.complete.style.top = -h + 'em';
        _this2.complete.style.minHeight = h + 'em';
      }));
    }
  }, {
    key: 'content',
    value: function content(opts) {
      var _this3 = this;

      var content = opts.content;
      var fade = opts.fade;
      var loading = opts.loading;
      var type = opts.type;

      this.view = document.createElement('div');
      this.view.setAttribute('tabindex', '-1');
      this.view.classList.add('ink', 'result', opts.scope);
      if (type === 'inline') {
        this.view.classList.add('inline');
      } else if (type === 'block') {
        this.view.classList.add('under');
      }

      this.view.addEventListener('mousewheel', function (e) {
        if ((_this3.view.offsetHeight < _this3.view.scrollHeight || _this3.view.offsetWidth < _this3.view.scrollWidth) && (e.deltaY > 0 && _this3.view.scrollHeight - _this3.view.scrollTop > _this3.view.clientHeight || e.deltaY < 0 && _this3.view.scrollTop > 0 || e.deltaX > 0 && _this3.view.scrollWidth - _this3.view.scrollLeft > _this3.view.clientWidth || e.deltaX < 0 && _this3.view.scrollLeft > 0)) {
          e.stopPropagation();
        }
      });

      this.view.addEventListener('mouseup', function (ev) {
        if (ev.button === 1) {
          // middle mouse button
          _this3.model.remove();
          _this3.focusPrevious();
        } else if (document.getSelection().toString().length === 0) {
          _this3.focusPrevious();
        }
      });

      this.view.addEventListener('mousedown', function (ev) {
        _this3.blurEditor();
        _this3.previousFocus = document.activeElement;
      });

      this.view.addEventListener('mouseleave', function (ev) {
        _this3.focusPrevious();
      });

      if (fade) this.fadeIn();
      if (content != null) this.setContent(content, opts);
      if (loading) this.setContent(_utilViews2['default'].render(span('loading icon icon-gear')), opts);

      return this.view;
    }
  }, {
    key: 'blurEditor',
    value: function blurEditor(ed) {
      // const c = this.model.editor.component
      // if (c && c.didBlurHiddenInput) {
      //   c.didBlurHiddenInput({
      //     relatedTarget: null
      //   })
      // }
    }
  }, {
    key: 'focusPrevious',
    value: function focusPrevious() {
      // if (this.previousFocus && this.previousFocus.focus) {
      //   this.previousFocus.focus()
      // }
    }
  }, {
    key: 'fadeIn',
    value: function fadeIn() {
      var _this4 = this;

      this.view.classList.add('ink-hide');
      setTimeout(function () {
        return _this4.view.classList.remove('ink-hide');
      }, 20);
    }
  }, {
    key: 'setContent',
    value: function setContent(view, _ref) {
      var _ref$error = _ref.error;
      var error = _ref$error === undefined ? false : _ref$error;
      var _ref$loading = _ref.loading;
      var loading = _ref$loading === undefined ? false : _ref$loading;

      this.rawContent = [view, { error: error, loading: loading }];
      while (this.view.firstChild != null) {
        this.view.removeChild(this.view.firstChild);
      }
      error ? this.view.classList.add('error') : this.view.classList.remove('error');
      loading ? this.view.classList.add('loading') : this.view.classList.remove('loading');

      (0, _utilAnsitohtml2['default'])(view);

      this.view.appendChild(view);

      // HACK: don't display toolbar for "small" results
      if (this.toolbarView) {
        if (this.model.type === 'inline' && view.innerHTML && view.innerHTML.length < 100) {
          this.toolbarView.classList.add('hide');
        } else {
          this.toolbarView.classList.remove('hide');
        }
      }
    }
  }, {
    key: 'toolbar',
    value: function toolbar(buttons, customButtons) {
      var _this5 = this;

      var tb = _utilViews2['default'].render(div('btn-group'));
      var addButtons = function addButtons(buttons) {
        var _loop = function (b) {
          var v = document.createElement('button');
          v.classList.add('btn', b.icon);
          v.addEventListener('mouseup', function (ev) {
            b.onclick();
            _this5.focusPrevious();
          });

          v.addEventListener('mousedown', function (ev) {
            _this5.blurEditor();
            _this5.previousFocus = document.activeElement;
          });

          v.addEventListener('mouseleave', function (ev) {
            _this5.focusPrevious();
          });
          tb.appendChild(v);
        };

        for (var b of buttons(_this5.model)) {
          _loop(b);
        }
      };
      if (customButtons) addButtons(customButtons);
      addButtons(buttons);
      return _utilViews2['default'].render(div('ink-result-toolbar', tb));
    }

    // only read from the DOM
  }, {
    key: 'decideUpdateWidth',
    value: function decideUpdateWidth(edRect, winWidth) {
      this.edRect = edRect;
      this.winWidth = winWidth;
      this.isVisible = false;
      this.left = 0;
      this.shouldRedraw = false;
      this.overlayElement = this.complete.parentElement;
      if (this.overlayElement) {
        var rect = this.getView().getBoundingClientRect();
        var parentRect = this.getView().parentElement.getBoundingClientRect();
        this.left = parseInt(this.getView().parentElement.style.left);
        this.isVisible = parentRect.top - RESULT_HIDE_OFFSET < edRect.bottom && rect.top + RESULT_HIDE_OFFSET > edRect.top && rect.left > edRect.left;
        this.shouldRedraw = true;
      }
    }

    // only write to the DOM
  }, {
    key: 'updateWidth',
    value: function updateWidth() {
      if (!!this.isVisible || this.model.expanded) {
        this.getView().style.visibility = 'visible';
        this.getView().style.pointerEvents = 'auto';
      } else {
        this.getView().style.visibility = 'hidden';
        this.getView().style.pointerEvents = 'none';
      }
      if (!!this.isVisible && (this.shouldRedraw || this.modelUpdated)) {
        var w = this.edRect.right - RESULT_OFFSET - 10 - this.left;
        if (w < MIN_RESULT_WIDTH) w = MIN_RESULT_WIDTH;
        if (this.edRect.width > 0 && this.left + RESULT_OFFSET + w > this.edRect.right) {
          this.getView().style.left = this.edRect.right - w - 10 - this.left + 'px';
          this.getView().style.opacity = 0.75;
        } else {
          this.getView().style.left = RESULT_OFFSET + 'px';
          this.getView().style.opacity = 1.0;
        }
        this.getView().parentElement.style.maxWidth = this.winWidth - RESULT_OFFSET - 10 - this.left + 'px';
        this.getView().style.maxWidth = w + 'px';
        this.modelUpdated = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.view.classList.add('ink-hide');
      this.disposables.dispose();
    }
  }]);

  return ResultView;
})();

exports['default'] = ResultView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9lZGl0b3IvcmVzdWx0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFDb0MsTUFBTTs7eUJBQ3hCLGVBQWU7Ozs7OEJBQ1Ysb0JBQW9COzs7O0FBSDNDLFdBQVcsQ0FBQTtrQkFLUyx1QkFBTSxJQUFJO0lBQXhCLElBQUksZUFBSixJQUFJO0lBQUUsR0FBRyxlQUFILEdBQUc7O0FBRWYsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUE7QUFDM0IsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLElBQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFBOztJQUVQLFVBQVU7QUFDakIsV0FETyxVQUFVLENBQ2hCLEtBQUssRUFBYTs7O1FBQVgsSUFBSSx5REFBRyxFQUFFOzswQkFEVixVQUFVOztBQUUzQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXZCLFFBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQU0sTUFBSyxPQUFPLEVBQUU7S0FBQSxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7YUFBTSxNQUFLLFlBQVksR0FBRyxJQUFJO0tBQUEsQ0FBQyxDQUFBO0FBQ3RELFFBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2FBQU0sTUFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDcEUsUUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7YUFBTSxNQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUFB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LElBQUksR0FBSSxJQUFJLENBQUE7QUFDckcsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtBQUN4QyxZQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQTtPQUMxQjtLQUNGOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzNCOzs7U0F0TmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9lZGl0b3IvcmVzdWx0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdmlld3MgZnJvbSAnLi4vdXRpbC92aWV3cydcbmltcG9ydCBhbnNpVG9IVE1MIGZyb20gJy4uL3V0aWwvYW5zaXRvaHRtbCdcblxubGV0IHsgc3BhbiwgZGl2IH0gPSB2aWV3cy50YWdzXG5cbmNvbnN0IE1JTl9SRVNVTFRfV0lEVEggPSAzMFxuY29uc3QgUkVTVUxUX09GRlNFVCA9IDIwXG5jb25zdCBSRVNVTFRfSElERV9PRkZTRVQgPSAzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdFZpZXcge1xuICBjb25zdHJ1Y3RvciAobW9kZWwsIG9wdHMgPSB7fSkge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbFxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5jb21wbGV0ZVZpZXcob3B0cylcblxuICAgIHRoaXMubW9kZWwub25EaWRSZW1vdmUoKCkgPT4gdGhpcy5kZXN0cm95KCkpXG4gICAgdGhpcy5tb2RlbC5vbkRpZFVwZGF0ZSgoKSA9PiB0aGlzLm1vZGVsVXBkYXRlZCA9IHRydWUpXG4gICAgdGhpcy5tb2RlbC5vbkRpZEludmFsaWRhdGUoKCkgPT4gdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKSlcbiAgICB0aGlzLm1vZGVsLm9uRGlkVmFsaWRhdGUoKCkgPT4gdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKSlcbiAgICB0aGlzLm1vZGVsLm9uRGlkQXR0YWNoKCgpID0+IHRoaXMub3ZlcmxheUVsZW1lbnQgPSB0aGlzLmNvbXBsZXRlLnBhcmVudEVsZW1lbnQpXG5cbiAgICB0aGlzLmxhc3RFZFdpZHRoID0gLTFcblxuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZVxuXG4gICAgLy8gSEFDSzogY29tcGF0aWJpbGl0eSB0byBwcm90by1yZXBsOlxuICAgIHRoaXMuY2xhc3NMaXN0ID0ge2FkZCgpIHt9fVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGdldFZpZXcgKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnR5cGUgPT0gJ2lubGluZScgPyB0aGlzLmNvbXBsZXRlIDogdGhpcy52aWV3XG4gIH1cblxuICBnZXRDb250ZW50ICgpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3XG4gIH1cblxuICBnZXRSYXdDb250ZW50ICgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXdDb250ZW50XG4gIH1cblxuICBjb21wbGV0ZVZpZXcgKG9wdHMpIHtcbiAgICB0aGlzLmNvbXBsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmNvbXBsZXRlLmNsYXNzTGlzdC5hZGQoJ2luay1yZXN1bHQtY29udGFpbmVyJylcbiAgICBpZiAoIW9wdHMubm9UQiAmJiBvcHRzLnR5cGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICB0aGlzLnRvb2xiYXJWaWV3ID0gdGhpcy50b29sYmFyKG9wdHMuYnV0dG9ucywgb3B0cy5jdXN0b21CdXR0b25zKVxuICAgICAgdGhpcy5jb21wbGV0ZS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXJWaWV3KVxuICAgIH1cblxuICAgIHRoaXMuY29tcGxldGUuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KG9wdHMpKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLmxpbmVIZWlnaHQnLCAoaCkgPT4ge1xuICAgICAgdGhpcy5jb21wbGV0ZS5zdHlsZS50b3AgPSAtaCArICdlbSdcbiAgICAgIHRoaXMuY29tcGxldGUuc3R5bGUubWluSGVpZ2h0ID0gaCArICdlbSdcbiAgICB9KSlcbiAgfVxuXG4gIGNvbnRlbnQgKG9wdHMpIHtcbiAgICBsZXQge2NvbnRlbnQsIGZhZGUsIGxvYWRpbmcsIHR5cGV9ID0gb3B0c1xuICAgIHRoaXMudmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy52aWV3LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKVxuICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKCdpbmsnLCAncmVzdWx0Jywgb3B0cy5zY29wZSlcbiAgICBpZiAodHlwZSA9PT0gJ2lubGluZScpIHtcbiAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKCdpbmxpbmUnKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2Jsb2NrJykge1xuICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoJ3VuZGVyJylcbiAgICB9XG5cbiAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIChlKSA9PiB7XG4gICAgICBpZiAoKHRoaXMudmlldy5vZmZzZXRIZWlnaHQgPCB0aGlzLnZpZXcuc2Nyb2xsSGVpZ2h0IHx8XG4gICAgICAgICAgIHRoaXMudmlldy5vZmZzZXRXaWR0aCAgPCB0aGlzLnZpZXcuc2Nyb2xsV2lkdGgpICYmXG4gICAgICAgICAgKChlLmRlbHRhWSA+IDAgJiYgdGhpcy52aWV3LnNjcm9sbEhlaWdodCAtIHRoaXMudmlldy5zY3JvbGxUb3AgPiB0aGlzLnZpZXcuY2xpZW50SGVpZ2h0KSB8fFxuICAgICAgICAgICAoZS5kZWx0YVkgPCAwICYmIHRoaXMudmlldy5zY3JvbGxUb3AgPiAwKSB8fFxuICAgICAgICAgICAoZS5kZWx0YVggPiAwICYmIHRoaXMudmlldy5zY3JvbGxXaWR0aCAtIHRoaXMudmlldy5zY3JvbGxMZWZ0ID4gdGhpcy52aWV3LmNsaWVudFdpZHRoKSB8fFxuICAgICAgICAgICAoZS5kZWx0YVggPCAwICYmIHRoaXMudmlldy5zY3JvbGxMZWZ0ID4gMCkpKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldiA9PiB7XG4gICAgICBpZiAoZXYuYnV0dG9uID09PSAxKSB7XG4gICAgICAgIC8vIG1pZGRsZSBtb3VzZSBidXR0b25cbiAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmUoKVxuICAgICAgICB0aGlzLmZvY3VzUHJldmlvdXMoKVxuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmZvY3VzUHJldmlvdXMoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4ge1xuICAgICAgdGhpcy5ibHVyRWRpdG9yKClcbiAgICAgIHRoaXMucHJldmlvdXNGb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICB9KVxuXG4gICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBldiA9PiB7XG4gICAgICB0aGlzLmZvY3VzUHJldmlvdXMoKVxuICAgIH0pXG5cbiAgICBpZiAoZmFkZSkgdGhpcy5mYWRlSW4oKVxuICAgIGlmIChjb250ZW50ICE9IG51bGwpIHRoaXMuc2V0Q29udGVudChjb250ZW50LCBvcHRzKVxuICAgIGlmIChsb2FkaW5nKSB0aGlzLnNldENvbnRlbnQodmlld3MucmVuZGVyKHNwYW4oJ2xvYWRpbmcgaWNvbiBpY29uLWdlYXInKSksIG9wdHMpXG5cbiAgICByZXR1cm4gdGhpcy52aWV3XG4gIH1cblxuICBibHVyRWRpdG9yIChlZCkge1xuICAgIC8vIGNvbnN0IGMgPSB0aGlzLm1vZGVsLmVkaXRvci5jb21wb25lbnRcbiAgICAvLyBpZiAoYyAmJiBjLmRpZEJsdXJIaWRkZW5JbnB1dCkge1xuICAgIC8vICAgYy5kaWRCbHVySGlkZGVuSW5wdXQoe1xuICAgIC8vICAgICByZWxhdGVkVGFyZ2V0OiBudWxsXG4gICAgLy8gICB9KVxuICAgIC8vIH1cbiAgfVxuXG4gIGZvY3VzUHJldmlvdXMgKCkge1xuICAgIC8vIGlmICh0aGlzLnByZXZpb3VzRm9jdXMgJiYgdGhpcy5wcmV2aW91c0ZvY3VzLmZvY3VzKSB7XG4gICAgLy8gICB0aGlzLnByZXZpb3VzRm9jdXMuZm9jdXMoKVxuICAgIC8vIH1cbiAgfVxuXG4gIGZhZGVJbiAoKSB7XG4gICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoJ2luay1oaWRlJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudmlldy5jbGFzc0xpc3QucmVtb3ZlKCdpbmstaGlkZScpLCAyMClcbiAgfVxuXG4gIHNldENvbnRlbnQgKHZpZXcsIHtlcnJvciA9IGZhbHNlLCBsb2FkaW5nID0gZmFsc2V9KSB7XG4gICAgdGhpcy5yYXdDb250ZW50ICA9IFt2aWV3LCB7ZXJyb3IsIGxvYWRpbmd9XVxuICAgIHdoaWxlICh0aGlzLnZpZXcuZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQ2hpbGQodGhpcy52aWV3LmZpcnN0Q2hpbGQpXG4gICAgfVxuICAgIGVycm9yID8gdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJykgOiB0aGlzLnZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKVxuICAgIGxvYWRpbmcgPyB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpIDogdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKVxuXG4gICAgYW5zaVRvSFRNTCh2aWV3KVxuXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHZpZXcpXG5cbiAgICAvLyBIQUNLOiBkb24ndCBkaXNwbGF5IHRvb2xiYXIgZm9yIFwic21hbGxcIiByZXN1bHRzXG4gICAgaWYgKHRoaXMudG9vbGJhclZpZXcpIHtcbiAgICAgIGlmICh0aGlzLm1vZGVsLnR5cGUgPT09ICdpbmxpbmUnICYmIHZpZXcuaW5uZXJIVE1MICYmIHZpZXcuaW5uZXJIVE1MLmxlbmd0aCA8IDEwMCApIHtcbiAgICAgICAgdGhpcy50b29sYmFyVmlldy5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudG9vbGJhclZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9vbGJhciAoYnV0dG9ucywgY3VzdG9tQnV0dG9ucykge1xuICAgIGxldCB0YiA9IHZpZXdzLnJlbmRlcihkaXYoJ2J0bi1ncm91cCcpKVxuICAgIGxldCBhZGRCdXR0b25zID0gKGJ1dHRvbnMpID0+IHtcbiAgICAgIGZvciAobGV0IGIgb2YgYnV0dG9ucyh0aGlzLm1vZGVsKSkge1xuICAgICAgICBsZXQgdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgICAgIHYuY2xhc3NMaXN0LmFkZCgnYnRuJywgYi5pY29uKVxuICAgICAgICB2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldiA9PiB7XG4gICAgICAgICAgYi5vbmNsaWNrKClcbiAgICAgICAgICB0aGlzLmZvY3VzUHJldmlvdXMoKVxuICAgICAgICB9KVxuXG4gICAgICAgIHYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4ge1xuICAgICAgICAgIHRoaXMuYmx1ckVkaXRvcigpXG4gICAgICAgICAgdGhpcy5wcmV2aW91c0ZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICB9KVxuXG4gICAgICAgIHYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGV2ID0+IHtcbiAgICAgICAgICB0aGlzLmZvY3VzUHJldmlvdXMoKVxuICAgICAgICB9KVxuICAgICAgICB0Yi5hcHBlbmRDaGlsZCh2KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY3VzdG9tQnV0dG9ucykgYWRkQnV0dG9ucyhjdXN0b21CdXR0b25zKVxuICAgIGFkZEJ1dHRvbnMoYnV0dG9ucylcbiAgICByZXR1cm4gdmlld3MucmVuZGVyKGRpdignaW5rLXJlc3VsdC10b29sYmFyJywgdGIpKVxuICB9XG5cbiAgLy8gb25seSByZWFkIGZyb20gdGhlIERPTVxuICBkZWNpZGVVcGRhdGVXaWR0aCAoZWRSZWN0LCB3aW5XaWR0aCkge1xuICAgIHRoaXMuZWRSZWN0ID0gZWRSZWN0XG4gICAgdGhpcy53aW5XaWR0aCA9IHdpbldpZHRoXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZVxuICAgIHRoaXMubGVmdCA9IDBcbiAgICB0aGlzLnNob3VsZFJlZHJhdyA9IGZhbHNlXG4gICAgdGhpcy5vdmVybGF5RWxlbWVudCA9IHRoaXMuY29tcGxldGUucGFyZW50RWxlbWVudFxuICAgIGlmICh0aGlzLm92ZXJsYXlFbGVtZW50KSB7XG4gICAgICBsZXQgcmVjdCA9IHRoaXMuZ2V0VmlldygpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBsZXQgcGFyZW50UmVjdCA9IHRoaXMuZ2V0VmlldygpLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHRoaXMubGVmdCA9IHBhcnNlSW50KHRoaXMuZ2V0VmlldygpLnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdClcbiAgICAgIHRoaXMuaXNWaXNpYmxlID0gcGFyZW50UmVjdC50b3AgLSBSRVNVTFRfSElERV9PRkZTRVQgPCBlZFJlY3QuYm90dG9tICYmXG4gICAgICAgICAgICAgICAgICAgICAgIHJlY3QudG9wICsgUkVTVUxUX0hJREVfT0ZGU0VUID4gZWRSZWN0LnRvcCAmJlxuICAgICAgICAgICAgICAgICAgICAgICByZWN0LmxlZnQgPiBlZFJlY3QubGVmdFxuICAgICAgdGhpcy5zaG91bGRSZWRyYXcgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLy8gb25seSB3cml0ZSB0byB0aGUgRE9NXG4gIHVwZGF0ZVdpZHRoICgpIHtcbiAgICBpZiAoISF0aGlzLmlzVmlzaWJsZSB8fCB0aGlzLm1vZGVsLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLmdldFZpZXcoKS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnXG4gICAgICB0aGlzLmdldFZpZXcoKS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ2V0VmlldygpLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuICAgICAgdGhpcy5nZXRWaWV3KCkuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuICAgIH1cbiAgICBpZiAoISF0aGlzLmlzVmlzaWJsZSAmJiAodGhpcy5zaG91bGRSZWRyYXcgfHwgdGhpcy5tb2RlbFVwZGF0ZWQpKSB7XG4gICAgICBsZXQgdyA9IHRoaXMuZWRSZWN0LnJpZ2h0IC0gUkVTVUxUX09GRlNFVCAtIDEwIC0gdGhpcy5sZWZ0XG4gICAgICBpZiAodyA8IE1JTl9SRVNVTFRfV0lEVEgpIHcgPSBNSU5fUkVTVUxUX1dJRFRIXG4gICAgICBpZiAodGhpcy5lZFJlY3Qud2lkdGggPiAwICYmIHRoaXMubGVmdCArIFJFU1VMVF9PRkZTRVQgKyB3ID4gdGhpcy5lZFJlY3QucmlnaHQpIHtcbiAgICAgICAgdGhpcy5nZXRWaWV3KCkuc3R5bGUubGVmdCA9ICh0aGlzLmVkUmVjdC5yaWdodCAtIHcgLSAxMCAtIHRoaXMubGVmdCkgKyAncHgnXG4gICAgICAgIHRoaXMuZ2V0VmlldygpLnN0eWxlLm9wYWNpdHkgPSAwLjc1XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldFZpZXcoKS5zdHlsZS5sZWZ0ID0gUkVTVUxUX09GRlNFVCArICdweCdcbiAgICAgICAgdGhpcy5nZXRWaWV3KCkuc3R5bGUub3BhY2l0eSA9IDEuMFxuICAgICAgfVxuICAgICAgdGhpcy5nZXRWaWV3KCkucGFyZW50RWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9ICh0aGlzLndpbldpZHRoIC0gUkVTVUxUX09GRlNFVCAtIDEwIC0gdGhpcy5sZWZ0KSArICdweCdcbiAgICAgIHRoaXMuZ2V0VmlldygpLnN0eWxlLm1heFdpZHRoID0gdyArICdweCdcbiAgICAgIHRoaXMubW9kZWxVcGRhdGVkID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZCgnaW5rLWhpZGUnKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==