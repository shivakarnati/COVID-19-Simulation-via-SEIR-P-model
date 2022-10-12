Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.open = _open;
exports.onDidOpen = onDidOpen;
exports.editorMatchesFile = editorMatchesFile;
exports.isUntitled = isUntitled;
exports.getUntitledId = getUntitledId;
exports.consumeRemoteFileOpener = consumeRemoteFileOpener;
exports.allowRemoteFiles = allowRemoteFiles;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _paneItem = require('./pane-item');

var _fs = require('fs');

var _path = require('path');

var _atom = require('atom');

'use babel';

var remoteFileOpener = undefined;
var allowremote = false;
var emitter = undefined;

function activate() {
  emitter = new _atom.Emitter();
}

function deactivate() {
  emitter.dispose();
}

var EditorLocation = (function () {
  function EditorLocation(file, line, opts) {
    _classCallCheck(this, EditorLocation);

    this.file = file;
    this.line = line;
    this.opts = opts;
  }

  _createClass(EditorLocation, [{
    key: 'open',
    value: function open() {
      _open(this.file, this.line, this.opts);
    }
  }]);

  return EditorLocation;
})();

function _open(pathOrId, line) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$pending = _ref.pending;
  var pending = _ref$pending === undefined ? false : _ref$pending;
  var _ref$existingOnly = _ref.existingOnly;
  var existingOnly = _ref$existingOnly === undefined ? true : _ref$existingOnly;

  var id = getUntitledId(pathOrId);

  var oldLocation = undefined;
  var activeItem = atom.workspace.getActivePaneItem();
  if (activeItem instanceof _atom.TextEditor) {
    var path = activeItem.getPath() || 'untitled-' + activeItem.buffer.getId();
    var _line = activeItem.getCursorBufferPosition().row;
    oldLocation = new EditorLocation(path, _line, { pending: pending, existingOnly: existingOnly });
  }

  if (id) {
    (0, _paneItem.focusEditorPane)();
    return openEditorById(id, line).then(function (ed) {
      var edloc = new EditorLocation(pathOrId, line, { pending: pending, existingOnly: existingOnly });
      emitter.emit('didOpen', {
        oldLocation: oldLocation,
        newLocation: edloc
      });
    });
  } else if (allowremote && remoteFileOpener) {
    (0, _paneItem.focusEditorPane)();
    return new Promise(function (resolve, reject) {
      var disposable = atom.workspace.observeActiveTextEditor(function (ed) {
        if (editorMatchesFile(ed, pathOrId)) {
          var edloc = new EditorLocation(pathOrId, line, { pending: pending, existingOnly: existingOnly });
          emitter.emit('didOpen', {
            oldLocation: oldLocation,
            newLocation: edloc
          });
          ed.setCursorBufferPosition([line, 0]);
          if (disposable) disposable.dispose();
        }
      });
      if (remoteFileOpener(pathOrId)) {
        resolve(true);
      } else {
        resolve(false);
        if (disposable) disposable.dispose();
      }
    });
  } else if (!existingOnly || (0, _fs.existsSync)(pathOrId)) {
    (0, _paneItem.focusEditorPane)();
    return atom.workspace.open(pathOrId, { initialLine: line, searchAllPanes: true, pending: pending }).then(function (ed) {
      var edloc = new EditorLocation(pathOrId, line, { pending: pending, existingOnly: existingOnly });
      emitter.emit('didOpen', {
        oldLocation: oldLocation,
        newLocation: edloc
      });
    });
  } else {
    return Promise.resolve(false);
  }
}

function onDidOpen(f) {
  emitter.on('didOpen', f);
}

function editorMatchesFile(ed, pathOrId) {
  if (!ed || !pathOrId) {
    return false;
  }
  var id = getUntitledId(pathOrId);
  var ep = ed.getPath();
  if (id) {
    return ed.getBuffer().id == id;
  } else if (allowremote && remoteFileOpener) {
    if (ep) {
      ep = ep.replace(/\\/g, '/');
      var path = (0, _path.normalize)(pathOrId);
      path = path.replace(/\\/g, '/');
      if (ep.indexOf(path) > -1) {
        return true;
      }
    }
  } else {
    if (ep) {
      return ep == pathOrId;
    }
  }
  return false;
}

function isUntitled(pathOrId) {
  return !!getUntitledId(pathOrId);
}

function getUntitledId(file) {
  var id = file.match(/untitled-([\d\w]+)$/);
  return id != null ? id[1] : false;
}

function consumeRemoteFileOpener(o) {
  remoteFileOpener = o;
}

function allowRemoteFiles(val) {
  allowremote = val;
}

function openEditorById(id, line) {
  return new Promise(function (resolve) {
    for (var pane of atom.workspace.getPanes()) {
      // handle docks properly:
      var items = undefined;
      if (pane.getItems == null) {
        if (pane.getPaneItems == null) {
          continue;
        } else {
          items = pane.getPaneItems();
        }
      } else {
        items = pane.getItems();
      }
      for (var item of items) {
        if (item.constructor.name === "TextEditor" && item.getBuffer().id === id) {
          pane.setActiveItem(item);
          item.setCursorBufferPosition([line, 0]);
          item.scrollToCursorPosition();
          resolve(item);
        }
      }
    }
    resolve(false);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL29wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQzhCLGFBQWE7O2tCQUNsQixJQUFJOztvQkFDTCxNQUFNOztvQkFDSSxNQUFNOztBQUp4QyxXQUFXLENBQUE7O0FBTVgsSUFBSSxnQkFBZ0IsR0FBRyxTQUFTLENBQUE7QUFDaEMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLElBQUksT0FBTyxZQUFBLENBQUE7O0FBRUosU0FBUyxRQUFRLEdBQUk7QUFDMUIsU0FBTyxHQUFHLG1CQUFhLENBQUE7Q0FDeEI7O0FBRU0sU0FBUyxVQUFVLEdBQUk7QUFDNUIsU0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0NBQ2xCOztJQUVLLGNBQWM7QUFDTixXQURSLGNBQWMsQ0FDTCxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTswQkFEM0IsY0FBYzs7QUFFaEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7R0FDakI7O2VBTEcsY0FBYzs7V0FPYixnQkFBRztBQUNOLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3RDOzs7U0FURyxjQUFjOzs7QUFZYixTQUFTLEtBQUksQ0FBRSxRQUFRLEVBQUUsSUFBSSxFQUFpRDttRUFBSixFQUFFOzswQkFBM0MsT0FBTztNQUFQLE9BQU8sZ0NBQUcsS0FBSzsrQkFBRSxZQUFZO01BQVosWUFBWSxxQ0FBRyxJQUFJOztBQUMxRSxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O0FB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RUFBRTtBQUN4RSxjQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLGNBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3ZDLGNBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO0FBQzdCLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDZDtPQUNGO0tBQ0Y7QUFDRCxXQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDZixDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvdXRpbC9vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtmb2N1c0VkaXRvclBhbmV9IGZyb20gJy4vcGFuZS1pdGVtJ1xuaW1wb3J0IHtleGlzdHNTeW5jfSBmcm9tICdmcydcbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHtFbWl0dGVyLCBUZXh0RWRpdG9yfSBmcm9tICdhdG9tJ1xuXG5sZXQgcmVtb3RlRmlsZU9wZW5lciA9IHVuZGVmaW5lZFxubGV0IGFsbG93cmVtb3RlID0gZmFsc2VcbmxldCBlbWl0dGVyXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSAoKSB7XG4gIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlICgpIHtcbiAgZW1pdHRlci5kaXNwb3NlKClcbn1cblxuY2xhc3MgRWRpdG9yTG9jYXRpb24ge1xuICBjb25zdHJ1Y3RvciAoZmlsZSwgbGluZSwgb3B0cykge1xuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLmxpbmUgPSBsaW5lXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgb3BlbiAoKSB7XG4gICAgb3Blbih0aGlzLmZpbGUsIHRoaXMubGluZSwgdGhpcy5vcHRzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuIChwYXRoT3JJZCwgbGluZSwgeyBwZW5kaW5nID0gZmFsc2UsIGV4aXN0aW5nT25seSA9IHRydWUgfSA9IHt9KSB7XG4gIGNvbnN0IGlkID0gZ2V0VW50aXRsZWRJZChwYXRoT3JJZClcblxuICBsZXQgb2xkTG9jYXRpb24gPSB1bmRlZmluZWRcbiAgY29uc3QgYWN0aXZlSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgaWYgKGFjdGl2ZUl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSB7XG4gICAgY29uc3QgcGF0aCA9IGFjdGl2ZUl0ZW0uZ2V0UGF0aCgpIHx8ICd1bnRpdGxlZC0nICsgYWN0aXZlSXRlbS5idWZmZXIuZ2V0SWQoKVxuICAgIGNvbnN0IGxpbmUgPSBhY3RpdmVJdGVtLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93XG4gICAgb2xkTG9jYXRpb24gPSBuZXcgRWRpdG9yTG9jYXRpb24ocGF0aCwgbGluZSwgeyBwZW5kaW5nLCBleGlzdGluZ09ubHkgfSlcbiAgfVxuXG4gIGlmIChpZCkge1xuICAgIGZvY3VzRWRpdG9yUGFuZSgpXG4gICAgcmV0dXJuIG9wZW5FZGl0b3JCeUlkKGlkLCBsaW5lKS50aGVuKChlZCkgPT4ge1xuICAgICAgY29uc3QgZWRsb2MgPSBuZXcgRWRpdG9yTG9jYXRpb24ocGF0aE9ySWQsIGxpbmUsIHsgcGVuZGluZywgZXhpc3RpbmdPbmx5IH0pXG4gICAgICBlbWl0dGVyLmVtaXQoJ2RpZE9wZW4nLCB7XG4gICAgICAgIG9sZExvY2F0aW9uOiBvbGRMb2NhdGlvbixcbiAgICAgICAgbmV3TG9jYXRpb246IGVkbG9jXG4gICAgICB9KVxuICAgIH0pXG4gIH0gZWxzZSBpZiAoYWxsb3dyZW1vdGUgJiYgcmVtb3RlRmlsZU9wZW5lcikge1xuICAgIGZvY3VzRWRpdG9yUGFuZSgpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvcihlZCA9PiB7XG4gICAgICAgIGlmIChlZGl0b3JNYXRjaGVzRmlsZShlZCwgcGF0aE9ySWQpKSB7XG4gICAgICAgICAgY29uc3QgZWRsb2MgPSBuZXcgRWRpdG9yTG9jYXRpb24ocGF0aE9ySWQsIGxpbmUsIHsgcGVuZGluZywgZXhpc3RpbmdPbmx5IH0pXG4gICAgICAgICAgZW1pdHRlci5lbWl0KCdkaWRPcGVuJywge1xuICAgICAgICAgICAgb2xkTG9jYXRpb246IG9sZExvY2F0aW9uLFxuICAgICAgICAgICAgbmV3TG9jYXRpb246IGVkbG9jXG4gICAgICAgICAgfSlcbiAgICAgICAgICBlZC5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGluZSwgMF0pXG4gICAgICAgICAgaWYgKGRpc3Bvc2FibGUpIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBpZiAocmVtb3RlRmlsZU9wZW5lcihwYXRoT3JJZCkpIHtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShmYWxzZSlcbiAgICAgICAgaWYgKGRpc3Bvc2FibGUpIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSBlbHNlIGlmICghZXhpc3RpbmdPbmx5IHx8IGV4aXN0c1N5bmMocGF0aE9ySWQpKSB7XG4gICAgZm9jdXNFZGl0b3JQYW5lKClcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoT3JJZCwge2luaXRpYWxMaW5lOiBsaW5lLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSwgcGVuZGluZ30pLnRoZW4oKGVkKSA9PiB7XG4gICAgICBjb25zdCBlZGxvYyA9IG5ldyBFZGl0b3JMb2NhdGlvbihwYXRoT3JJZCwgbGluZSwgeyBwZW5kaW5nLCBleGlzdGluZ09ubHkgfSlcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZGlkT3BlbicsIHtcbiAgICAgICAgb2xkTG9jYXRpb246IG9sZExvY2F0aW9uLFxuICAgICAgICBuZXdMb2NhdGlvbjogZWRsb2NcbiAgICAgIH0pXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkRpZE9wZW4oZikge1xuICBlbWl0dGVyLm9uKCdkaWRPcGVuJywgZilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRvck1hdGNoZXNGaWxlIChlZCwgcGF0aE9ySWQpIHtcbiAgaWYgKCFlZCB8fCAhcGF0aE9ySWQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBpZCA9IGdldFVudGl0bGVkSWQocGF0aE9ySWQpXG4gIGxldCBlcCA9IGVkLmdldFBhdGgoKVxuICBpZiAoaWQpIHtcbiAgICByZXR1cm4gZWQuZ2V0QnVmZmVyKCkuaWQgPT0gaWRcbiAgfSBlbHNlIGlmIChhbGxvd3JlbW90ZSAmJiByZW1vdGVGaWxlT3BlbmVyKSB7XG4gICAgaWYgKGVwKSB7XG4gICAgICBlcCA9IGVwLnJlcGxhY2UoL1xcXFwvZywgJy8nKVxuICAgICAgbGV0IHBhdGggPSBub3JtYWxpemUocGF0aE9ySWQpXG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJylcbiAgICAgIGlmIChlcC5pbmRleE9mKHBhdGgpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVwKSB7XG4gICAgICByZXR1cm4gZXAgPT0gcGF0aE9ySWRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VudGl0bGVkKHBhdGhPcklkKSB7XG4gIHJldHVybiAhIWdldFVudGl0bGVkSWQocGF0aE9ySWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbnRpdGxlZElkIChmaWxlKSB7XG4gIGNvbnN0IGlkID0gZmlsZS5tYXRjaCgvdW50aXRsZWQtKFtcXGRcXHddKykkLylcbiAgcmV0dXJuIGlkICE9IG51bGwgPyBpZFsxXSA6IGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lUmVtb3RlRmlsZU9wZW5lciAobykge1xuICByZW1vdGVGaWxlT3BlbmVyID0gb1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dSZW1vdGVGaWxlcyAodmFsKSB7XG4gIGFsbG93cmVtb3RlID0gdmFsXG59XG5cbmZ1bmN0aW9uIG9wZW5FZGl0b3JCeUlkIChpZCwgbGluZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBmb3IgKGNvbnN0IHBhbmUgb2YgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkge1xuICAgICAgLy8gaGFuZGxlIGRvY2tzIHByb3Blcmx5OlxuICAgICAgbGV0IGl0ZW1zXG4gICAgICBpZiAocGFuZS5nZXRJdGVtcyA9PSBudWxsKSB7XG4gICAgICAgIGlmIChwYW5lLmdldFBhbmVJdGVtcyA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtcyA9IHBhbmUuZ2V0UGFuZUl0ZW1zKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXMgPSBwYW5lLmdldEl0ZW1zKClcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICBpZiAoaXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIlRleHRFZGl0b3JcIiAmJiBpdGVtLmdldEJ1ZmZlcigpLmlkID09PSBpZCkge1xuICAgICAgICAgIHBhbmUuc2V0QWN0aXZlSXRlbShpdGVtKVxuICAgICAgICAgIGl0ZW0uc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2xpbmUsIDBdKVxuICAgICAgICAgIGl0ZW0uc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG4gICAgICAgICAgcmVzb2x2ZShpdGVtKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlc29sdmUoZmFsc2UpXG4gIH0pXG59XG4iXX0=