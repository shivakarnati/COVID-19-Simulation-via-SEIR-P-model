Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var subs = new _atom.CompositeDisposable();
var panes = new Set();
var registered = {};

function ensurePaneVisible(pane) {
  if (!pane) return;
  if (pane.getFlexScale && pane.getFlexScale() < 0.2) {
    pane.parent.adjustFlexScale();
    pane.setFlexScale(0.6);
  }
  ensurePaneVisible(pane.parent);
  ensurePaneContainerVisible(pane);
}

function ensurePaneContainerVisible(pane) {
  if (pane.getActiveItem) {
    var container = atom.workspace.paneContainerForItem(pane.getActiveItem());
    if (container.isVisible && !container.isVisible()) container.show();
  }
}

var PaneItem = (function () {
  _createClass(PaneItem, null, [{
    key: 'activate',
    value: function activate() {
      if (subs != null) return;
      subs = new _atom.CompositeDisposable();
      panes.forEach(function (Pane) {
        return Pane.registerView();
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      if (subs != null) subs.dispose();
      subs = null;
    }
  }, {
    key: 'attachView',
    value: function attachView(View) {
      this.View = View;
      this.registerView();
    }
  }, {
    key: 'registerView',
    value: function registerView() {
      var _this = this;

      panes.add(this);

      subs.add(atom.views.addViewProvider(this, function (pane) {
        if (pane.element != null) {
          return pane.element;
        } else {
          return new _this.View().initialize(pane);
        }
      }));

      subs.add(atom.deserializers.add({
        name: 'Ink' + this.name,
        deserialize: function deserialize(state) {
          var opts = {};
          if (state.persistentState && state.persistentState.opts) {
            opts = state.persistentState.opts;
          }
          var pane = _this.fromId(state.id, opts);
          if (state.persistentState) pane.persistentState = state.persistentState;
          if (pane.currentPane()) return;
          return pane;
        }
      }));

      subs.add(atom.workspace.onDidOpen(function (_ref) {
        var uri = _ref.uri;
        var item = _ref.item;

        if (uri && uri.match(new RegExp('atom://ink-' + _this.name.toLowerCase() + '/(.+)'))) {
          if (item.onAttached) item.onAttached();
        }
      }));

      subs.add(atom.workspace.addOpener(function (uri) {
        var match = uri.match(new RegExp('atom://ink-' + _this.name.toLowerCase() + '/(.+)'));
        if (match) {
          var id = match[1];
          return _this.fromId(id);
        }
      }));
    }
  }, {
    key: 'fromId',
    value: function fromId(id) {
      var constructorName = this.name.toLowerCase();
      if (!registered[constructorName]) {
        registered[constructorName] = {};
      }
      var pane = registered[constructorName][id];
      if (pane) {
        return pane;
      } else {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        pane = registered[constructorName][id] = new (_bind.apply(this, [null].concat(args)))();
        pane.id = id;
        return pane;
      }
    }
  }]);

  function PaneItem() {
    _classCallCheck(this, PaneItem);

    this.__emitter = new _atom.Emitter();
  }

  _createClass(PaneItem, [{
    key: 'getURI',
    value: function getURI() {
      return 'atom://ink-' + this.constructor.name.toLowerCase() + '/' + this.id;
    }
  }, {
    key: 'closeAndDestroy',
    value: function closeAndDestroy() {
      this.close();
      delete registered[this.constructor.name.toLowerCase()][this.id];
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      if (this.id) {
        return {
          deserializer: 'Ink' + this.constructor.name,
          id: this.id,
          persistentState: this.persistentState
        };
      }
    }
  }, {
    key: 'currentPane',
    value: function currentPane() {
      for (var pane of atom.workspace.getPanes()) {
        if (pane.getItems().includes(this)) return pane;
      }
    }
  }, {
    key: 'activate',
    value: function activate() {
      var pane = this.currentPane();
      if (pane) {
        pane.activate();
        pane.setActiveItem(this);
        ensurePaneVisible(pane);
        return true;
      }
    }
  }, {
    key: 'open',
    value: function open(opts) {
      if (this.activate()) {
        return Promise.resolve(this);
      }
      if (this.id) {
        return atom.workspace.open('atom://ink-' + this.constructor.name.toLowerCase() + '/' + this.id, opts);
      } else {
        throw new Error('Pane does not have an ID');
      }
    }
  }, {
    key: 'ensureVisible',
    value: function ensureVisible() {
      var _this2 = this;

      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var pane = this.currentPane();
      if (pane) {
        ensurePaneVisible(pane);
        if (pane.getActiveItem() !== this) pane.activateItem(this);
        return new Promise(function (resolve) {
          return resolve();
        });
      } else {
        var _ret = (function () {
          var pane = atom.workspace.getActivePane();
          var p = _this2.open(opts);
          p.then(function () {
            return pane.activate();
          });
          return {
            v: p
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.currentPane()) this.currentPane().removeItem(this);
    }
  }, {
    key: 'setTitle',
    value: function setTitle(title, force) {
      if (this.__forcedTitle) {
        if (force) {
          this.__forcedTitle = true;
          this.__title = title;
          this.__emitter.emit('change-title', title);
        }
      } else {
        this.__forcedTitle = force ? true : false;
        this.__title = title;
        this.__emitter.emit('change-title', title);
      }
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return this.__title;
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return this.__defaultLocation;
    }
  }, {
    key: 'setDefaultLocation',
    value: function setDefaultLocation(defaultLocation) {
      this.__defaultLocation = defaultLocation;
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle(f) {
      return this.__emitter.on('change-title', f);
    }
  }], [{
    key: 'focusEditorPane',
    value: function focusEditorPane() {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        var pane = atom.workspace.paneForItem(editor);
        pane.focus();
        return;
      }
      for (var pane of atom.workspace.getPanes()) {
        if (pane.getActiveItem() instanceof _atom.TextEditor) {
          pane.focus();
          break;
        }
      }
    }
  }]);

  return PaneItem;
})();

exports['default'] = PaneItem;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL3BhbmUtaXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7b0JBRXlELE1BQU07O0FBRi9ELFdBQVcsQ0FBQTs7QUFJWCxJQUFJLElBQUksR0FBRywrQkFBeUIsQ0FBQTtBQUNwQyxJQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBQSxDQUFBO0FBQ3JCLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTs7QUFFckIsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUU7QUFDL0IsTUFBSSxDQUFDLElBQUksRUFBRSxPQUFNO0FBQ2pCLE1BQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsR0FBRyxFQUFFO0FBQ2xELFFBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDN0IsUUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtHQUN2QjtBQUNELG1CQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM5Qiw0QkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtDQUNqQzs7QUFFRCxTQUFTLDBCQUEwQixDQUFDLElBQUksRUFBRTtBQUN4QyxNQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtBQUMzRSxRQUFJLFNBQVMsQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ3BFO0NBQ0Y7O0lBRW9CLFFBQVE7ZUFBUixRQUFROztXQUNaLG9CQUFHO0FBQ2hCLFVBQUksSUFBSSxJQUFJLElBQUksRUFBRSxPQUFNO0FBQ3hC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V0FFaUIsNEJBQUMsZUFBZSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUE7S0FDekM7OztXQUVnQiwwQkFBQyxDQUFDLEVBQUU7QUFDbkIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDNUM7OztXQUVxQiwyQkFBRztBQUN2QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQyxZQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDWixlQUFNO09BQ1A7QUFDRCxXQUFLLElBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDNUMsWUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLDRCQUFzQixFQUFFO0FBQzlDLGNBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNaLGdCQUFLO1NBQ047T0FDRjtLQUNGOzs7U0FyTGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL3BhbmUtaXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRFZGl0b3IsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuXG5sZXQgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbmNvbnN0IHBhbmVzID0gbmV3IFNldFxuY29uc3QgcmVnaXN0ZXJlZCA9IHt9XG5cbmZ1bmN0aW9uIGVuc3VyZVBhbmVWaXNpYmxlKHBhbmUpIHtcbiAgaWYgKCFwYW5lKSByZXR1cm5cbiAgaWYgKHBhbmUuZ2V0RmxleFNjYWxlICYmIHBhbmUuZ2V0RmxleFNjYWxlKCkgPCAwLjIpIHtcbiAgICBwYW5lLnBhcmVudC5hZGp1c3RGbGV4U2NhbGUoKVxuICAgIHBhbmUuc2V0RmxleFNjYWxlKDAuNilcbiAgfVxuICBlbnN1cmVQYW5lVmlzaWJsZShwYW5lLnBhcmVudClcbiAgZW5zdXJlUGFuZUNvbnRhaW5lclZpc2libGUocGFuZSlcbn1cblxuZnVuY3Rpb24gZW5zdXJlUGFuZUNvbnRhaW5lclZpc2libGUocGFuZSkge1xuICBpZiAocGFuZS5nZXRBY3RpdmVJdGVtKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0ocGFuZS5nZXRBY3RpdmVJdGVtKCkpXG4gICAgaWYgKGNvbnRhaW5lci5pc1Zpc2libGUgJiYgIWNvbnRhaW5lci5pc1Zpc2libGUoKSkgY29udGFpbmVyLnNob3coKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVJdGVtIHtcbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIGlmIChzdWJzICE9IG51bGwpIHJldHVyblxuICAgIHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHBhbmVzLmZvckVhY2goUGFuZSA9PiBQYW5lLnJlZ2lzdGVyVmlldygpKVxuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgaWYgKHN1YnMgIT0gbnVsbCkgc3Vicy5kaXNwb3NlKClcbiAgICBzdWJzID0gbnVsbFxuICB9XG5cbiAgc3RhdGljIGF0dGFjaFZpZXcoVmlldykge1xuICAgIHRoaXMuVmlldyA9IFZpZXdcbiAgICB0aGlzLnJlZ2lzdGVyVmlldygpXG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJWaWV3KCkge1xuICAgIHBhbmVzLmFkZCh0aGlzKVxuXG4gICAgc3Vicy5hZGQoYXRvbS52aWV3cy5hZGRWaWV3UHJvdmlkZXIodGhpcywgcGFuZSA9PiB7XG4gICAgICBpZiAocGFuZS5lbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHBhbmUuZWxlbWVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLlZpZXcoKS5pbml0aWFsaXplKHBhbmUpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLmRlc2VyaWFsaXplcnMuYWRkKHtcbiAgICAgIG5hbWU6IGBJbmske3RoaXMubmFtZX1gLFxuICAgICAgZGVzZXJpYWxpemU6IChzdGF0ZSkgPT4ge1xuICAgICAgICBsZXQgb3B0cyA9IHt9XG4gICAgICAgIGlmIChzdGF0ZS5wZXJzaXN0ZW50U3RhdGUgJiYgc3RhdGUucGVyc2lzdGVudFN0YXRlLm9wdHMpIHtcbiAgICAgICAgICBvcHRzID0gc3RhdGUucGVyc2lzdGVudFN0YXRlLm9wdHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYW5lID0gdGhpcy5mcm9tSWQoc3RhdGUuaWQsIG9wdHMpXG4gICAgICAgIGlmIChzdGF0ZS5wZXJzaXN0ZW50U3RhdGUpIHBhbmUucGVyc2lzdGVudFN0YXRlID0gc3RhdGUucGVyc2lzdGVudFN0YXRlXG4gICAgICAgIGlmIChwYW5lLmN1cnJlbnRQYW5lKCkpIHJldHVyblxuICAgICAgICByZXR1cm4gcGFuZVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRPcGVuKCh7dXJpLCBpdGVtfSkgPT4ge1xuICAgICAgaWYgKHVyaSAmJiB1cmkubWF0Y2gobmV3IFJlZ0V4cChgYXRvbTovL2luay0ke3RoaXMubmFtZS50b0xvd2VyQ2FzZSgpfS8oLispYCkpKSB7XG4gICAgICAgIGlmIChpdGVtLm9uQXR0YWNoZWQpIGl0ZW0ub25BdHRhY2hlZCgpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIodXJpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoID0gdXJpLm1hdGNoKG5ldyBSZWdFeHAoYGF0b206Ly9pbmstJHt0aGlzLm5hbWUudG9Mb3dlckNhc2UoKX0vKC4rKWApKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gbWF0Y2hbMV1cbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUlkKGlkKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgc3RhdGljIGZyb21JZChpZCwgLi4uYXJncykge1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yTmFtZSA9IHRoaXMubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFyZWdpc3RlcmVkW2NvbnN0cnVjdG9yTmFtZV0pIHtcbiAgICAgIHJlZ2lzdGVyZWRbY29uc3RydWN0b3JOYW1lXSA9IHt9XG4gICAgfVxuICAgIGxldCBwYW5lID0gcmVnaXN0ZXJlZFtjb25zdHJ1Y3Rvck5hbWVdW2lkXVxuICAgIGlmIChwYW5lKSB7XG4gICAgICByZXR1cm4gcGFuZVxuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lID0gcmVnaXN0ZXJlZFtjb25zdHJ1Y3Rvck5hbWVdW2lkXSA9IG5ldyB0aGlzKC4uLmFyZ3MpXG4gICAgICBwYW5lLmlkID0gaWRcbiAgICAgIHJldHVybiBwYW5lXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX19lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiBgYXRvbTovL2luay0ke3RoaXMuY29uc3RydWN0b3IubmFtZS50b0xvd2VyQ2FzZSgpfS8ke3RoaXMuaWR9YFxuICB9XG5cbiAgY2xvc2VBbmREZXN0cm95ICgpIHtcbiAgICB0aGlzLmNsb3NlKClcbiAgICBkZWxldGUgcmVnaXN0ZXJlZFt0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKV1bdGhpcy5pZF1cbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICBpZiAodGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVzZXJpYWxpemVyOiBgSW5rJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIHBlcnNpc3RlbnRTdGF0ZTogdGhpcy5wZXJzaXN0ZW50U3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjdXJyZW50UGFuZSgpIHtcbiAgICBmb3IgKGNvbnN0IHBhbmUgb2YgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkge1xuICAgICAgaWYgKHBhbmUuZ2V0SXRlbXMoKS5pbmNsdWRlcyh0aGlzKSkgcmV0dXJuIHBhbmVcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICBjb25zdCBwYW5lID0gdGhpcy5jdXJyZW50UGFuZSgpXG4gICAgaWYgKHBhbmUpIHtcbiAgICAgIHBhbmUuYWN0aXZhdGUoKVxuICAgICAgcGFuZS5zZXRBY3RpdmVJdGVtKHRoaXMpXG4gICAgICBlbnN1cmVQYW5lVmlzaWJsZShwYW5lKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBvcGVuKG9wdHMpIHtcbiAgICBpZiAodGhpcy5hY3RpdmF0ZSgpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcykgfVxuICAgIGlmICh0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihgYXRvbTovL2luay0ke3RoaXMuY29uc3RydWN0b3IubmFtZS50b0xvd2VyQ2FzZSgpfS8ke3RoaXMuaWR9YCwgb3B0cylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYW5lIGRvZXMgbm90IGhhdmUgYW4gSUQnKVxuICAgIH1cbiAgfVxuXG4gIGVuc3VyZVZpc2libGUgKG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IHBhbmUgPSB0aGlzLmN1cnJlbnRQYW5lKClcbiAgICBpZiAocGFuZSkge1xuICAgICAgZW5zdXJlUGFuZVZpc2libGUocGFuZSlcbiAgICAgIGlmIChwYW5lLmdldEFjdGl2ZUl0ZW0oKSAhPT0gdGhpcykgcGFuZS5hY3RpdmF0ZUl0ZW0odGhpcylcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gcmVzb2x2ZSgpKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBjb25zdCBwID0gdGhpcy5vcGVuKG9wdHMpXG4gICAgICBwLnRoZW4oKCkgPT4gcGFuZS5hY3RpdmF0ZSgpKVxuICAgICAgcmV0dXJuIHBcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGFuZSgpKSB0aGlzLmN1cnJlbnRQYW5lKCkucmVtb3ZlSXRlbSh0aGlzKVxuICB9XG5cbiAgc2V0VGl0bGUgKHRpdGxlLCBmb3JjZSkge1xuICAgIGlmICh0aGlzLl9fZm9yY2VkVGl0bGUpIHtcbiAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICB0aGlzLl9fZm9yY2VkVGl0bGUgPSB0cnVlXG4gICAgICAgIHRoaXMuX190aXRsZSA9IHRpdGxlXG4gICAgICAgIHRoaXMuX19lbWl0dGVyLmVtaXQoJ2NoYW5nZS10aXRsZScsIHRpdGxlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fZm9yY2VkVGl0bGUgPSBmb3JjZSA/IHRydWUgOiBmYWxzZVxuICAgICAgdGhpcy5fX3RpdGxlID0gdGl0bGVcbiAgICAgIHRoaXMuX19lbWl0dGVyLmVtaXQoJ2NoYW5nZS10aXRsZScsIHRpdGxlKVxuICAgIH1cbiAgfVxuXG4gIGdldFRpdGxlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RpdGxlXG4gIH1cblxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19kZWZhdWx0TG9jYXRpb25cbiAgfVxuXG4gIHNldERlZmF1bHRMb2NhdGlvbihkZWZhdWx0TG9jYXRpb24pIHtcbiAgICB0aGlzLl9fZGVmYXVsdExvY2F0aW9uID0gZGVmYXVsdExvY2F0aW9uXG4gIH1cblxuICBvbkRpZENoYW5nZVRpdGxlIChmKSB7XG4gICAgcmV0dXJuIHRoaXMuX19lbWl0dGVyLm9uKCdjaGFuZ2UtdGl0bGUnLCBmKVxuICB9XG5cbiAgc3RhdGljIGZvY3VzRWRpdG9yUGFuZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yKVxuICAgICAgcGFuZS5mb2N1cygpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZm9yIChjb25zdCBwYW5lIG9mIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkpIHtcbiAgICAgIGlmIChwYW5lLmdldEFjdGl2ZUl0ZW0oKSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHtcbiAgICAgICAgcGFuZS5mb2N1cygpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==