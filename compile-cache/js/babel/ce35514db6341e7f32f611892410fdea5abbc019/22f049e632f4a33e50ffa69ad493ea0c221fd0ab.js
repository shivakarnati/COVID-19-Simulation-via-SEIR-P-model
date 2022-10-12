Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _resultView = require('./result-view');

var _resultView2 = _interopRequireDefault(_resultView);

'use babel';

var layers = {};

var Result = (function () {
  function Result(editor, lineRange) {
    var _this = this;

    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Result);

    this.emitter = new _atom.Emitter();
    this.disposables = new _atom.CompositeDisposable();
    this.editor = editor;
    this.range = lineRange;
    this.invalid = false;

    opts.scope = opts.scope != null ? opts.scope : 'noscope';
    opts.type = opts.type != null ? opts.type : 'inline';
    opts.fade = opts.fade != null ? opts.fade : !Result.removeLines(this.editor, this.range[0], this.range[1]);
    opts.loading = opts.loading != null ? opts.content : !opts.content;
    opts.goto = opts.goto != null ? opts.goto : true;
    opts.buttons = this.buttons();

    this.type = opts.type;

    this.view = new _resultView2['default'](this, opts);
    this.attach();
    if (opts.goto) {
      editor.scrollToBufferPosition([this.range[1], 0]);
    }
    this.disposables.add(atom.commands.add(this.view.getView(), { 'inline-results:clear': function inlineResultsClear() {
        return _this.remove();
      } }));

    this.text = this.getMarkerText();

    this.disposables.add(this.editor.onDidChange(function () {
      return _this.validateText();
    }));
  }

  // stopgap for https://github.com/atom/atom/issues/16454

  _createClass(Result, [{
    key: 'setContent',
    value: function setContent(view, opts) {
      this.view.setContent(view, opts);
    }
  }, {
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      if (!layers.hasOwnProperty(uniqueEditorID(this.editor))) {
        layers[uniqueEditorID(this.editor)] = this.editor.addMarkerLayer();
      }

      this.marker = layers[uniqueEditorID(this.editor)].markBufferRange([[this.range[0], 0], [this.range[1], this.editor.lineTextForBufferRow(this.range[1]).length]]);
      this.marker.result = this;

      this.decorateMarker();

      this.disposables.add(this.marker.onDidChange(function (e) {
        return _this2.checkMarker(e);
      }));
    }
  }, {
    key: 'buttons',
    value: function buttons() {
      return function (result) {
        return [{
          icon: 'icon-unfold',
          onclick: function onclick() {
            return result.toggle();
          }
        }, {
          icon: 'icon-x',
          onclick: function onclick() {
            return result.remove();
          }
        }];
      };
    }
  }, {
    key: 'decorateMarker',
    value: function decorateMarker() {
      var _this3 = this;

      var decr = { item: this.view.getView(), avoidOverflow: false };
      if (this.type === 'inline') {
        decr.type = 'overlay';
        decr['class'] = 'ink-overlay';
      } else if (this.type === 'block') {
        decr.type = 'block';
        decr.position = 'after';
      }
      this.decoration = this.editor.decorateMarker(this.marker, decr);

      setTimeout(function () {
        return _this3.emitter.emit('did-attach');
      }, 50);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.type !== 'inline') return;
      this.expanded ? this.collapse() : this.expand();
    }
  }, {
    key: 'expand',
    value: function expand() {
      this.expanded = true;
      if (this.decoration) this.decoration.destroy();
      var row = this.marker.getEndBufferPosition().row;
      this.expMarker = this.editor.markBufferRange([[row, 0], [row, 1]]);
      var decr = {
        item: this.view.getView(),
        avoidOverflow: false,
        type: 'overlay',
        'class': 'ink-underlay',
        invalidate: 'never'
      };
      this.expDecoration = this.editor.decorateMarker(this.expMarker, decr);
      this.emitter.emit('did-update');
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      this.expanded = false;
      if (this.expMarker) this.expMarker.destroy();
      this.decorateMarker();
      this.emitter.emit('did-update');
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(f) {
      this.emitter.on('did-destroy', f);
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(f) {
      this.emitter.on('did-update', f);
    }
  }, {
    key: 'onDidValidate',
    value: function onDidValidate(f) {
      this.emitter.on('did-validate', f);
    }
  }, {
    key: 'onDidInvalidate',
    value: function onDidInvalidate(f) {
      this.emitter.on('did-invalidate', f);
    }
  }, {
    key: 'onDidAttach',
    value: function onDidAttach(f) {
      this.emitter.on('did-attach', f);
    }
  }, {
    key: 'onDidRemove',
    value: function onDidRemove(f) {
      this.emitter.on('did-remove', f);
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this4 = this;

      this.emitter.emit('did-remove');
      this.isDestroyed = true;
      setTimeout(function () {
        return _this4.destroy();
      }, 200);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.marker.destroy();
      if (this.expMarker) this.expMarker.destroy();
      this.disposables.dispose();
    }
  }, {
    key: 'validate',
    value: function validate() {
      this.invalid = false;
      this.emitter.emit('did-validate');
    }
  }, {
    key: 'invalidate',
    value: function invalidate() {
      this.invalid = true;
      this.emitter.emit('did-invalidate');
    }
  }, {
    key: 'validateText',
    value: function validateText(ed) {
      var text = this.getMarkerText();
      if (this.text === text && this.invalid) {
        this.validate();
      } else if (this.text !== text && !this.invalid) {
        this.invalidate();
      }
    }
  }, {
    key: 'checkMarker',
    value: function checkMarker(e) {
      if (!e.isValid || this.marker.getBufferRange().isEmpty()) {
        this.remove();
      } else if (e.textChanged) {
        var old = this.editor.bufferPositionForScreenPosition(e.oldHeadScreenPosition);
        var nu = this.editor.bufferPositionForScreenPosition(e.newHeadScreenPosition);
        if (old.isLessThan(nu)) {
          var text = this.editor.getTextInBufferRange([old, nu]);
          if (text.match(/^\r?\n\s*$/)) {
            this.marker.setHeadBufferPosition(old);
          }
        }
      }
    }
  }, {
    key: 'getMarkerText',
    value: function getMarkerText() {
      return this.editor.getTextInBufferRange(this.marker.getBufferRange()).trim();
    }

    // static methods

  }], [{
    key: 'all',
    value: function all() {
      var results = [];
      for (var item of atom.workspace.getPaneItems()) {
        if (!atom.workspace.isTextEditor(item) || !layers[uniqueEditorID(item)]) continue;
        layers[uniqueEditorID(item)].getMarkers().forEach(function (m) {
          return results.push(m.result);
        });
      }
      return results;
    }
  }, {
    key: 'invalidateAll',
    value: function invalidateAll() {
      for (var result of Result.all()) {
        result.text = '';
        result.invalidate();
      }
    }
  }, {
    key: 'forLines',
    value: function forLines(ed, start, end) {
      var type = arguments.length <= 3 || arguments[3] === undefined ? 'any' : arguments[3];

      if (!layers[uniqueEditorID(ed)]) return;
      return layers[uniqueEditorID(ed)].findMarkers({ intersectsBufferRowRange: [start, end] }).filter(function (m) {
        return type === 'any' || m.result.type === type;
      }).map(function (m) {
        return m.result;
      });
    }
  }, {
    key: 'removeLines',
    value: function removeLines(ed, start, end) {
      var type = arguments.length <= 3 || arguments[3] === undefined ? 'any' : arguments[3];

      var rs = Result.forLines(ed, start, end, type);
      if (!rs) return;
      rs.map(function (r) {
        return r.remove();
      });
      rs.length > 0;
    }
  }, {
    key: 'removeAll',
    value: function removeAll() {
      var ed = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      if (!layers[uniqueEditorID(ed)]) return;
      layers[uniqueEditorID(ed)].getMarkers().forEach(function (m) {
        return m.result.remove();
      });
    }
  }, {
    key: 'removeCurrent',
    value: function removeCurrent(e) {
      var ed = atom.workspace.getActiveTextEditor();
      var done = false;
      if (ed) {
        for (var sel of ed.getSelections()) {
          var _sel$getBufferRowRange = sel.getBufferRowRange();

          var _sel$getBufferRowRange2 = _slicedToArray(_sel$getBufferRowRange, 2);

          var start = _sel$getBufferRowRange2[0];
          var end = _sel$getBufferRowRange2[1];

          if (Result.removeLines(ed, start, end)) {
            done = true;
          }
        }
      }
      if (!done) e.abortKeyBinding();
    }
  }, {
    key: 'toggleCurrent',
    value: function toggleCurrent() {
      var ed = atom.workspace.getActiveTextEditor();
      for (var sel of ed.getSelections()) {
        var rs = Result.forLines(ed, sel.getHeadBufferPosition().row, sel.getTailBufferPosition().row);
        if (!rs) continue;
        rs.forEach(function (r) {
          return r.toggle();
        });
      }
    }

    // Commands

  }, {
    key: 'activate',
    value: function activate() {
      this.subs = new _atom.CompositeDisposable();
      this.subs.add(atom.commands.add('atom-text-editor:not([mini])', {
        'inline:clear-current': function inlineClearCurrent(e) {
          return Result.removeCurrent(e);
        },
        'inline-results:clear-all': function inlineResultsClearAll() {
          return Result.removeAll();
        },
        'inline-results:toggle': function inlineResultsToggle() {
          return Result.toggleCurrent();
        }
      }));

      var listener = function listener() {
        var allresults = [];

        var _loop = function (edid) {
          var res = layers[edid].getMarkers().map(function (m) {
            return m.result;
          });
          res = res.filter(function (r) {
            return r.type === 'inline';
          });
          if (res.length === 0) return 'continue';
          // DOM reads
          var rect = res[0].editor.element.getBoundingClientRect();
          if (rect.width == 0 || rect.height == 0) {
            return 'continue';
          }
          var winWidth = window.innerWidth;

          res.forEach(function (r) {
            return r.view.decideUpdateWidth(rect, winWidth);
          });
          allresults.push.apply(allresults, _toConsumableArray(res));
        };

        for (var edid in layers) {
          var _ret = _loop(edid);

          if (_ret === 'continue') continue;
        }

        // DOM writes
        allresults.forEach(function (r) {
          return r.view.updateWidth();
        });

        setTimeout(function () {
          process.nextTick(function () {
            return window.requestAnimationFrame(listener);
          });
        }, 400);
      };

      window.requestAnimationFrame(listener);
      return;
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subs.dispose();
    }
  }]);

  return Result;
})();

exports['default'] = Result;
function uniqueEditorID(editor) {
  return editor.id;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9lZGl0b3IvcmVzdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUMyQyxNQUFNOzswQkFDMUIsZUFBZTs7OztBQUZ0QyxXQUFXLENBQUE7O0FBSVgsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBOztJQUVNLE1BQU07QUFDYixXQURPLE1BQU0sQ0FDWixNQUFNLEVBQUUsU0FBUyxFQUFhOzs7UUFBWCxJQUFJLHlEQUFHLEVBQUU7OzBCQUR0QixNQUFNOztBQUV2QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTs7QUFFcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN4RCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFBO0FBQ3BELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFBO0FBQzVHLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFB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Q0FBQyxRQUFRLENBQUM7V0FBQSxDQUFDLENBQUE7U0FDL0QsRUFBRSxHQUFHLENBQUMsQ0FBQTtPQUNSLENBQUE7O0FBRUQsWUFBTSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3RDLGFBQU07S0FDUDs7O1dBRWlCLHNCQUFHO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDcEI7OztTQTNSa0IsTUFBTTs7O3FCQUFOLE1BQU07QUErUjNCLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUM5QixTQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUE7Q0FDakIiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2VkaXRvci9yZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFJlc3VsdFZpZXcgZnJvbSAnLi9yZXN1bHQtdmlldydcblxubGV0IGxheWVycyA9IHt9XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yIChlZGl0b3IsIGxpbmVSYW5nZSwgb3B0cyA9IHt9KSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLnJhbmdlID0gbGluZVJhbmdlXG4gICAgdGhpcy5pbnZhbGlkID0gZmFsc2VcblxuICAgIG9wdHMuc2NvcGUgPSBvcHRzLnNjb3BlICE9IG51bGwgPyBvcHRzLnNjb3BlIDogJ25vc2NvcGUnXG4gICAgb3B0cy50eXBlID0gb3B0cy50eXBlICE9IG51bGwgPyBvcHRzLnR5cGUgOiAnaW5saW5lJ1xuICAgIG9wdHMuZmFkZSA9IG9wdHMuZmFkZSAhPSBudWxsID8gb3B0cy5mYWRlIDogIShSZXN1bHQucmVtb3ZlTGluZXModGhpcy5lZGl0b3IsIHRoaXMucmFuZ2VbMF0sIHRoaXMucmFuZ2VbMV0pKVxuICAgIG9wdHMubG9hZGluZyA9IG9wdHMubG9hZGluZyAhPSBudWxsID8gb3B0cy5jb250ZW50IDogIShvcHRzLmNvbnRlbnQpXG4gICAgb3B0cy5nb3RvID0gb3B0cy5nb3RvICE9IG51bGwgPyBvcHRzLmdvdG8gOiB0cnVlXG4gICAgb3B0cy5idXR0b25zID0gdGhpcy5idXR0b25zKClcblxuICAgIHRoaXMudHlwZSA9IG9wdHMudHlwZVxuXG4gICAgdGhpcy52aWV3ID0gbmV3IFJlc3VsdFZpZXcodGhpcywgb3B0cylcbiAgICB0aGlzLmF0dGFjaCgpXG4gICAgaWYgKG9wdHMuZ290bykge1xuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oW3RoaXMucmFuZ2VbMV0sIDBdKVxuICAgIH1cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLnZpZXcuZ2V0VmlldygpLCB7J2lubGluZS1yZXN1bHRzOmNsZWFyJzogKCkgPT4gdGhpcy5yZW1vdmUoKX0pKVxuXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5nZXRNYXJrZXJUZXh0KClcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkQ2hhbmdlKCgpID0+IHRoaXMudmFsaWRhdGVUZXh0KCkpKVxuICB9XG5cbiAgc2V0Q29udGVudCAodmlldywgb3B0cykge1xuICAgIHRoaXMudmlldy5zZXRDb250ZW50KHZpZXcsIG9wdHMpXG4gIH1cblxuICBhdHRhY2ggKCkge1xuICAgIGlmICghbGF5ZXJzLmhhc093blByb3BlcnR5KHVuaXF1ZUVkaXRvcklEKHRoaXMuZWRpdG9yKSkpIHtcbiAgICAgIGxheWVyc1t1bmlxdWVFZGl0b3JJRCh0aGlzLmVkaXRvcildID0gdGhpcy5lZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgIH1cblxuICAgIHRoaXMubWFya2VyID0gbGF5ZXJzW3VuaXF1ZUVkaXRvcklEKHRoaXMuZWRpdG9yKV0ubWFya0J1ZmZlclJhbmdlKFtbdGhpcy5yYW5nZVswXSwgMF0sXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLnJhbmdlWzFdLCB0aGlzLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyh0aGlzLnJhbmdlWzFdKS5sZW5ndGhdXSlcbiAgICB0aGlzLm1hcmtlci5yZXN1bHQgPSB0aGlzXG5cbiAgICB0aGlzLmRlY29yYXRlTWFya2VyKClcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMubWFya2VyLm9uRGlkQ2hhbmdlKChlKSA9PiB0aGlzLmNoZWNrTWFya2VyKGUpKSlcbiAgfVxuXG4gIGJ1dHRvbnMgKCkge1xuICAgIHJldHVybiAocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogJ2ljb24tdW5mb2xkJyxcbiAgICAgICAgICBvbmNsaWNrOiAoKSA9PiByZXN1bHQudG9nZ2xlKClcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGljb246ICdpY29uLXgnLFxuICAgICAgICAgIG9uY2xpY2s6ICgpID0+IHJlc3VsdC5yZW1vdmUoKVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9XG5cbiAgZGVjb3JhdGVNYXJrZXIgKCkge1xuICAgIGxldCBkZWNyID0ge2l0ZW06IHRoaXMudmlldy5nZXRWaWV3KCksIGF2b2lkT3ZlcmZsb3c6IGZhbHNlfVxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICBkZWNyLnR5cGUgPSAnb3ZlcmxheSdcbiAgICAgIGRlY3IuY2xhc3MgPSAnaW5rLW92ZXJsYXknXG4gICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdibG9jaycpIHtcbiAgICAgIGRlY3IudHlwZSA9ICdibG9jaydcbiAgICAgIGRlY3IucG9zaXRpb24gPSAnYWZ0ZXInXG4gICAgfVxuICAgIHRoaXMuZGVjb3JhdGlvbiA9IHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCBkZWNyKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWF0dGFjaCcpLCA1MClcbiAgfVxuXG4gIHRvZ2dsZSAoKSB7XG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2lubGluZScpIHJldHVyblxuICAgIHRoaXMuZXhwYW5kZWQgPyB0aGlzLmNvbGxhcHNlKCkgOiB0aGlzLmV4cGFuZCgpXG4gIH1cblxuICBleHBhbmQgKCkge1xuICAgIHRoaXMuZXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbikgdGhpcy5kZWNvcmF0aW9uLmRlc3Ryb3koKVxuICAgIGxldCByb3cgPSB0aGlzLm1hcmtlci5nZXRFbmRCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgIHRoaXMuZXhwTWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbcm93LCAwXSwgW3JvdywgMV1dKVxuICAgIGxldCBkZWNyID0ge1xuICAgICAgaXRlbTogdGhpcy52aWV3LmdldFZpZXcoKSxcbiAgICAgIGF2b2lkT3ZlcmZsb3c6IGZhbHNlLFxuICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgY2xhc3M6ICdpbmstdW5kZXJsYXknLFxuICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJ1xuICAgIH1cbiAgICB0aGlzLmV4cERlY29yYXRpb24gPSB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLmV4cE1hcmtlciwgZGVjcilcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gIH1cblxuICBjb2xsYXBzZSAoKSB7XG4gICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuZXhwTWFya2VyKSB0aGlzLmV4cE1hcmtlci5kZXN0cm95KClcbiAgICB0aGlzLmRlY29yYXRlTWFya2VyKClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gIH1cblxuICBvbkRpZERlc3Ryb3kgKGYpIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgZilcbiAgfVxuXG4gIG9uRGlkVXBkYXRlIChmKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgZilcbiAgfVxuXG4gIG9uRGlkVmFsaWRhdGUgKGYpIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC12YWxpZGF0ZScsIGYpXG4gIH1cblxuICBvbkRpZEludmFsaWRhdGUgKGYpIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC1pbnZhbGlkYXRlJywgZilcbiAgfVxuXG4gIG9uRGlkQXR0YWNoIChmKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtYXR0YWNoJywgZilcbiAgfVxuXG4gIG9uRGlkUmVtb3ZlIChmKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtcmVtb3ZlJywgZilcbiAgfVxuXG4gIHJlbW92ZSAoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZW1vdmUnKVxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRlc3Ryb3koKSwgMjAwKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gICAgdGhpcy5tYXJrZXIuZGVzdHJveSgpXG4gICAgaWYgKHRoaXMuZXhwTWFya2VyKSB0aGlzLmV4cE1hcmtlci5kZXN0cm95KClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICB9XG5cbiAgdmFsaWRhdGUgKCkge1xuICAgIHRoaXMuaW52YWxpZCA9IGZhbHNlXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC12YWxpZGF0ZScpXG4gIH1cblxuICBpbnZhbGlkYXRlICgpIHtcbiAgICB0aGlzLmludmFsaWQgPSB0cnVlXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1pbnZhbGlkYXRlJylcbiAgfVxuXG4gIHZhbGlkYXRlVGV4dCAoZWQpIHtcbiAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0TWFya2VyVGV4dCgpXG4gICAgaWYgKHRoaXMudGV4dCA9PT0gdGV4dCAmJiB0aGlzLmludmFsaWQpIHtcbiAgICAgIHRoaXMudmFsaWRhdGUoKVxuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0ICE9PSB0ZXh0ICYmICF0aGlzLmludmFsaWQpIHtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZSgpXG4gICAgfVxuICB9XG5cbiAgY2hlY2tNYXJrZXIgKGUpIHtcbiAgICBpZiAoIWUuaXNWYWxpZCB8fCB0aGlzLm1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5yZW1vdmUoKVxuICAgIH0gZWxzZSBpZiAoZS50ZXh0Q2hhbmdlZCkge1xuICAgICAgbGV0IG9sZCA9IHRoaXMuZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oZS5vbGRIZWFkU2NyZWVuUG9zaXRpb24pXG4gICAgICBsZXQgbnUgPSB0aGlzLmVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKGUubmV3SGVhZFNjcmVlblBvc2l0aW9uKVxuICAgICAgaWYgKG9sZC5pc0xlc3NUaGFuKG51KSkge1xuICAgICAgICBsZXQgdGV4dCA9IHRoaXMuZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtvbGQsIG51XSlcbiAgICAgICAgaWYgKHRleHQubWF0Y2goL15cXHI/XFxuXFxzKiQvKSkge1xuICAgICAgICAgIHRoaXMubWFya2VyLnNldEhlYWRCdWZmZXJQb3NpdGlvbihvbGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRNYXJrZXJUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UodGhpcy5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSkudHJpbSgpXG4gIH1cblxuICAvLyBzdGF0aWMgbWV0aG9kc1xuXG4gIHN0YXRpYyBhbGwgKCkge1xuICAgIGxldCByZXN1bHRzID0gW11cbiAgICBmb3IgKGxldCBpdGVtIG9mIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpKSB7XG4gICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihpdGVtKSB8fCAhbGF5ZXJzW3VuaXF1ZUVkaXRvcklEKGl0ZW0pXSkgY29udGludWVcbiAgICAgIGxheWVyc1t1bmlxdWVFZGl0b3JJRChpdGVtKV0uZ2V0TWFya2VycygpLmZvckVhY2gobSA9PiByZXN1bHRzLnB1c2gobS5yZXN1bHQpKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgc3RhdGljIGludmFsaWRhdGVBbGwgKCkge1xuICAgIGZvciAobGV0IHJlc3VsdCBvZiBSZXN1bHQuYWxsKCkpIHtcbiAgICAgIHJlc3VsdC50ZXh0ID0gJydcbiAgICAgIHJlc3VsdC5pbnZhbGlkYXRlKClcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZm9yTGluZXMgKGVkLCBzdGFydCwgZW5kLCB0eXBlID0gJ2FueScpIHtcbiAgICBpZiAoIWxheWVyc1t1bmlxdWVFZGl0b3JJRChlZCldKSByZXR1cm5cbiAgICByZXR1cm4gbGF5ZXJzW3VuaXF1ZUVkaXRvcklEKGVkKV0uZmluZE1hcmtlcnMoe2ludGVyc2VjdHNCdWZmZXJSb3dSYW5nZTogW3N0YXJ0LCBlbmRdfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKG0pID0+ICh0eXBlID09PSAnYW55JyB8fCBtLnJlc3VsdC50eXBlID09PSB0eXBlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKG0pID0+IG0ucmVzdWx0KVxuICB9XG5cbiAgc3RhdGljIHJlbW92ZUxpbmVzIChlZCwgc3RhcnQsIGVuZCwgdHlwZSA9ICdhbnknKSB7XG4gICAgbGV0IHJzID0gUmVzdWx0LmZvckxpbmVzKGVkLCBzdGFydCwgZW5kLCB0eXBlKVxuICAgIGlmICghcnMpIHJldHVyblxuICAgIHJzLm1hcCgocikgPT4gci5yZW1vdmUoKSlcbiAgICBycy5sZW5ndGggPiAwXG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQWxsIChlZCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkge1xuICAgIGlmICghbGF5ZXJzW3VuaXF1ZUVkaXRvcklEKGVkKV0pIHJldHVyblxuICAgIGxheWVyc1t1bmlxdWVFZGl0b3JJRChlZCldLmdldE1hcmtlcnMoKS5mb3JFYWNoKChtKSA9PiBtLnJlc3VsdC5yZW1vdmUoKSlcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDdXJyZW50IChlKSB7XG4gICAgY29uc3QgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBsZXQgZG9uZSA9IGZhbHNlXG4gICAgaWYgKGVkKSB7XG4gICAgICBmb3IgKGxldCBzZWwgb2YgZWQuZ2V0U2VsZWN0aW9ucygpKSB7XG4gICAgICAgIGxldCBbc3RhcnQsIGVuZF0gPSBzZWwuZ2V0QnVmZmVyUm93UmFuZ2UoKVxuICAgICAgICBpZiAoUmVzdWx0LnJlbW92ZUxpbmVzKGVkLCBzdGFydCwgZW5kKSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFkb25lKSBlLmFib3J0S2V5QmluZGluZygpXG4gIH1cblxuICBzdGF0aWMgdG9nZ2xlQ3VycmVudCAoKSB7XG4gICAgY29uc3QgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBlZC5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgIGNvbnN0IHJzID0gUmVzdWx0LmZvckxpbmVzKGVkLCBzZWwuZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKCkucm93LCBzZWwuZ2V0VGFpbEJ1ZmZlclBvc2l0aW9uKCkucm93KVxuICAgICAgaWYgKCFycykgY29udGludWVcbiAgICAgIHJzLmZvckVhY2goKHIpID0+IHIudG9nZ2xlKCkpXG4gICAgfVxuICB9XG5cbiAgLy8gQ29tbWFuZHNcblxuICBzdGF0aWMgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJyxcbiAgICAgIHtcbiAgICAgICAgJ2lubGluZTpjbGVhci1jdXJyZW50JzogKGUpID0+IFJlc3VsdC5yZW1vdmVDdXJyZW50KGUpLFxuICAgICAgICAnaW5saW5lLXJlc3VsdHM6Y2xlYXItYWxsJzogKCkgPT4gUmVzdWx0LnJlbW92ZUFsbCgpLFxuICAgICAgICAnaW5saW5lLXJlc3VsdHM6dG9nZ2xlJzogKCkgPT4gUmVzdWx0LnRvZ2dsZUN1cnJlbnQoKVxuICAgICAgfSkpXG5cbiAgICBsZXQgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICBsZXQgYWxscmVzdWx0cyA9IFtdXG4gICAgICBmb3IgKGxldCBlZGlkIGluIGxheWVycykge1xuICAgICAgICBsZXQgcmVzID0gbGF5ZXJzW2VkaWRdLmdldE1hcmtlcnMoKS5tYXAoKG0pID0+IG0ucmVzdWx0KVxuICAgICAgICByZXMgPSByZXMuZmlsdGVyKChyKSA9PiByLnR5cGUgPT09ICdpbmxpbmUnKVxuICAgICAgICBpZiAocmVzLmxlbmd0aCA9PT0gMCkgY29udGludWVcbiAgICAgICAgLy8gRE9NIHJlYWRzXG4gICAgICAgIGxldCByZWN0ID0gcmVzWzBdLmVkaXRvci5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGlmIChyZWN0LndpZHRoID09IDAgfHwgcmVjdC5oZWlnaHQgPT0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHdpbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgcmVzLmZvckVhY2goKHIpID0+IHIudmlldy5kZWNpZGVVcGRhdGVXaWR0aChyZWN0LCB3aW5XaWR0aCkpXG4gICAgICAgIGFsbHJlc3VsdHMucHVzaCguLi5yZXMpXG4gICAgICB9XG5cbiAgICAgIC8vIERPTSB3cml0ZXNcbiAgICAgIGFsbHJlc3VsdHMuZm9yRWFjaCgocikgPT4gci52aWV3LnVwZGF0ZVdpZHRoKCkpXG5cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsaXN0ZW5lcikpXG4gICAgICB9LCA0MDApXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsaXN0ZW5lcilcbiAgICByZXR1cm5cbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuLy8gc3RvcGdhcCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvMTY0NTRcbmZ1bmN0aW9uIHVuaXF1ZUVkaXRvcklEKGVkaXRvcikge1xuICByZXR1cm4gZWRpdG9yLmlkXG59XG4iXX0=