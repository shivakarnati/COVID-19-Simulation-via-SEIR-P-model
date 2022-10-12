Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.activate = activate;
exports.deactivate = deactivate;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var lastEditor = undefined;
var lastTerminal = undefined;
var subs = undefined;

var FocusHistory = (function () {
  function FocusHistory(size) {
    _classCallCheck(this, FocusHistory);

    this.size = size;
    this.history = [];
    this.openedItem = undefined;
  }

  _createClass(FocusHistory, [{
    key: 'push',
    value: function push(item) {
      if (this.openedItem && this.openedItem.file && this.openedItem.line && item.file == this.openedItem.file && item.line == this.openedItem.line) {
        return;
      }

      this.history.push(item);
      while (this.history.length > this.size) {
        this.history.shift();
      }
      return;
    }
  }, {
    key: 'moveBack',
    value: function moveBack() {
      var item = this.history.pop();
      if (item && item.open) {
        var activeItem = atom.workspace.getActivePaneItem();
        if (activeItem instanceof _atom.TextEditor) {
          var file = activeItem.getPath() || 'untitled-' + activeItem.buffer.getId();
          var line = activeItem.getCursorBufferPosition().row;
          this.openedItem = { file: file, line: line };
        }
        item.open();
      }
    }
  }]);

  return FocusHistory;
})();

function activate(ink) {
  subs = new _atom.CompositeDisposable();

  subs.add(atom.workspace.onDidStopChangingActivePaneItem(function (item) {
    if (item instanceof _atom.TextEditor) {
      lastEditor = item;
    } else if (item instanceof ink.InkTerminal) {
      lastTerminal = item;
    }
  }), atom.packages.onDidActivateInitialPackages(function () {
    lastEditor = atom.workspace.getActiveTextEditor();
    atom.workspace.getPanes().forEach(function (pane) {
      var item = pane.getActiveItem();
      if (item instanceof ink.InkTerminal) {
        lastTerminal = item;
      }
    });
  }));

  var history = new FocusHistory(30);
  ink.Opener.onDidOpen(function (_ref) {
    var newLocation = _ref.newLocation;
    var oldLocation = _ref.oldLocation;

    if (oldLocation) history.push(oldLocation);
  });

  subs.add(atom.commands.add('atom-workspace', {
    'julia-client:focus-last-editor': function juliaClientFocusLastEditor() {
      return focusLastEditor();
    },
    'julia-client:focus-last-terminal': function juliaClientFocusLastTerminal() {
      return focusLastTerminal();
    },
    'julia-client:return-from-goto': function juliaClientReturnFromGoto() {
      return history.moveBack();
    }
  }));
}

function deactivate() {
  lastEditor = null;
  lastTerminal = null;
  subs.dispose();
  subs = null;
}

function focusLastEditor() {
  var pane = atom.workspace.paneForItem(lastEditor);
  if (pane) {
    pane.activate();
    pane.activateItem(lastEditor);
  }
}

function focusLastTerminal() {
  if (lastTerminal && lastTerminal.open) lastTerminal.open();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi91aS9mb2N1c3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O29CQUU4QyxNQUFNOztBQUZwRCxXQUFXLENBQUE7O0FBSVgsSUFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLElBQUksWUFBWSxZQUFBLENBQUE7QUFDaEIsSUFBSSxJQUFJLFlBQUEsQ0FBQTs7SUFFRixZQUFZO0FBQ0osV0FEUixZQUFZLENBQ0gsSUFBSSxFQUFFOzBCQURmLFlBQVk7O0FBRWQsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUE7R0FDNUI7O2VBTEcsWUFBWTs7V0FPWCxjQUFDLElBQUksRUFBRTtBQUNWLFVBQUksSUFBSSxDQUFDLFVBQVUsSUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQ3BCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQ2pDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDckMsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRTtBQUN0QyxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO09BQ3JCO0FBQ0QsYUFBTTtLQUNQOzs7V0FFUSxvQkFBRztBQUNWLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FB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Rjs7QUFFRCxTQUFTLGlCQUFpQixHQUFJO0FBQzVCLE1BQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFBO0NBQzNEIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi91aS9mb2N1c3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtUZXh0RWRpdG9yLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5sZXQgbGFzdEVkaXRvclxubGV0IGxhc3RUZXJtaW5hbFxubGV0IHN1YnNcblxuY2xhc3MgRm9jdXNIaXN0b3J5IHtcbiAgY29uc3RydWN0b3IgKHNpemUpIHtcbiAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgdGhpcy5oaXN0b3J5ID0gW11cbiAgICB0aGlzLm9wZW5lZEl0ZW0gPSB1bmRlZmluZWRcbiAgfVxuXG4gIHB1c2ggKGl0ZW0pIHtcbiAgICBpZiAodGhpcy5vcGVuZWRJdGVtICYmXG4gICAgICAgIHRoaXMub3BlbmVkSXRlbS5maWxlICYmXG4gICAgICAgIHRoaXMub3BlbmVkSXRlbS5saW5lICYmXG4gICAgICAgIGl0ZW0uZmlsZSA9PSB0aGlzLm9wZW5lZEl0ZW0uZmlsZSAmJlxuICAgICAgICBpdGVtLmxpbmUgPT0gdGhpcy5vcGVuZWRJdGVtLmxpbmUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuaGlzdG9yeS5wdXNoKGl0ZW0pXG4gICAgd2hpbGUgKHRoaXMuaGlzdG9yeS5sZW5ndGggPiB0aGlzLnNpemUpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gICAgfVxuICAgIHJldHVyblxuICB9XG5cbiAgbW92ZUJhY2sgKCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmhpc3RvcnkucG9wKClcbiAgICBpZiAoaXRlbSAmJiBpdGVtLm9wZW4pIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICBpZiAoYWN0aXZlSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFjdGl2ZUl0ZW0uZ2V0UGF0aCgpIHx8ICd1bnRpdGxlZC0nICsgYWN0aXZlSXRlbS5idWZmZXIuZ2V0SWQoKVxuICAgICAgICBjb25zdCBsaW5lID0gYWN0aXZlSXRlbS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgICAgICB0aGlzLm9wZW5lZEl0ZW0gPSB7ZmlsZSwgbGluZX1cbiAgICAgIH1cbiAgICAgIGl0ZW0ub3BlbigpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSAoaW5rKSB7XG4gIHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgc3Vicy5hZGQoXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbShpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcikge1xuICAgICAgICBsYXN0RWRpdG9yID0gaXRlbVxuICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgaW5rLklua1Rlcm1pbmFsKSB7XG4gICAgICAgIGxhc3RUZXJtaW5hbCA9IGl0ZW1cbiAgICAgIH1cbiAgICB9KSxcbiAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMoKCkgPT4ge1xuICAgICAgbGFzdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKS5mb3JFYWNoKHBhbmUgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gcGFuZS5nZXRBY3RpdmVJdGVtKClcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBpbmsuSW5rVGVybWluYWwpIHtcbiAgICAgICAgICBsYXN0VGVybWluYWwgPSBpdGVtXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgKVxuXG4gIGNvbnN0IGhpc3RvcnkgPSBuZXcgRm9jdXNIaXN0b3J5KDMwKVxuICBpbmsuT3BlbmVyLm9uRGlkT3Blbigoe25ld0xvY2F0aW9uLCBvbGRMb2NhdGlvbn0pID0+IHtcbiAgICBpZiAob2xkTG9jYXRpb24pIGhpc3RvcnkucHVzaChvbGRMb2NhdGlvbilcbiAgfSlcblxuICBzdWJzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgJ2p1bGlhLWNsaWVudDpmb2N1cy1sYXN0LWVkaXRvcic6ICgpID0+IGZvY3VzTGFzdEVkaXRvcigpLFxuICAgICdqdWxpYS1jbGllbnQ6Zm9jdXMtbGFzdC10ZXJtaW5hbCc6ICgpID0+IGZvY3VzTGFzdFRlcm1pbmFsKCksXG4gICAgJ2p1bGlhLWNsaWVudDpyZXR1cm4tZnJvbS1nb3RvJzogKCkgPT4gaGlzdG9yeS5tb3ZlQmFjaygpXG4gIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIGxhc3RFZGl0b3IgPSBudWxsXG4gIGxhc3RUZXJtaW5hbCA9IG51bGxcbiAgc3Vicy5kaXNwb3NlKClcbiAgc3VicyA9IG51bGxcbn1cblxuZnVuY3Rpb24gZm9jdXNMYXN0RWRpdG9yICgpIHtcbiAgY29uc3QgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGxhc3RFZGl0b3IpXG4gIGlmIChwYW5lKSB7XG4gICAgcGFuZS5hY3RpdmF0ZSgpXG4gICAgcGFuZS5hY3RpdmF0ZUl0ZW0obGFzdEVkaXRvcilcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2N1c0xhc3RUZXJtaW5hbCAoKSB7XG4gIGlmIChsYXN0VGVybWluYWwgJiYgbGFzdFRlcm1pbmFsLm9wZW4pIGxhc3RUZXJtaW5hbC5vcGVuKClcbn1cbiJdfQ==