(function() {
  var CompositeDisposable, JuliaFolding, Point, Range, TextBuffer, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point, Range = ref.Range, TextBuffer = ref.TextBuffer;

  module.exports = JuliaFolding = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'language-julia:toggle-docstrings': (function(_this) {
          return function(event) {
            return _this.toggledocstrings(event);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'language-julia:toggle-all-docstrings': (function(_this) {
          return function() {
            return _this.togglealldocstrings();
          };
        })(this)
      }));
      return this.foldnext = true;
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    isdocstring: function(scopes) {
      var i, len, ref1, str;
      ref1 = scopes.getScopesArray();
      for (i = 0, len = ref1.length; i < len; i++) {
        str = ref1[i];
        if (str.match(/string\.docstring/)) {
          return true;
        }
      }
      return false;
    },
    toggledocstrings: function(event) {
      var editor, firstrow, isdoc, lastrow, row, shouldunfold, startpos, startrow;
      editor = atom.workspace.getActiveTextEditor();
      startpos = editor.getCursorBufferPosition();
      startrow = startpos.row;
      isdoc = this.isdocstring(editor.scopeDescriptorForBufferPosition(startpos));
      if (!isdoc) {
        event.abortKeyBinding();
        return;
      }
      shouldunfold = editor.isFoldedAtBufferRow(startrow + 1);
      if (shouldunfold) {
        editor.unfoldBufferRow(startrow);
        return;
      }
      row = startrow;
      while (row >= 0 && this.isdocstring(editor.scopeDescriptorForBufferPosition([row, 0]))) {
        row--;
      }
      firstrow = row + 1;
      row = startrow;
      while (row < editor.getLastBufferRow() && this.isdocstring(editor.scopeDescriptorForBufferPosition([row, 0]))) {
        row++;
      }
      lastrow = row - 1;
      if (lastrow > firstrow) {
        editor.setSelectedBufferRange(new Range(new Point(firstrow, 0), new Point(lastrow, 0)));
        editor.foldSelectedLines();
        return editor.moveUp();
      }
    },
    togglealldocstrings: function() {
      var editor, firstrow, i, isdoc, lookingforfirst, ref1, row, startpos;
      editor = atom.workspace.getActiveTextEditor();
      startpos = editor.getCursorBufferPosition();
      if (!this.foldnext) {
        editor.unfoldAll();
        editor.scrollToCursorPosition();
      } else {
        lookingforfirst = true;
        for (row = i = 0, ref1 = editor.getLastBufferRow(); 0 <= ref1 ? i <= ref1 : i >= ref1; row = 0 <= ref1 ? ++i : --i) {
          isdoc = this.isdocstring(editor.scopeDescriptorForBufferPosition([row, 0]));
          if (lookingforfirst && isdoc) {
            firstrow = row;
            lookingforfirst = false;
          } else if (!lookingforfirst && !isdoc) {
            lookingforfirst = true;
            if (row > firstrow) {
              editor.setSelectedBufferRange(new Range(new Point(firstrow, 0), new Point(row - 1, 0)));
              editor.foldSelectedLines();
            }
          }
        }
      }
      this.foldnext = !this.foldnext;
      return editor.setCursorBufferPosition(startpos);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9sYW5ndWFnZS1qdWxpYS9saWIvanVsaWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFrRCxPQUFBLENBQVEsTUFBUixDQUFsRCxFQUFDLDZDQUFELEVBQXNCLGlCQUF0QixFQUE2QixpQkFBN0IsRUFBb0M7O0VBRXBDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBQUEsR0FDZjtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxrQ0FBQSxFQUFvQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7bUJBQVcsS0FBQyxDQUFBLGdCQUFELENBQWtCLEtBQWxCO1VBQVg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDO09BQXBDLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxzQ0FBQSxFQUF3QyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxtQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDO09BQXBDLENBQW5CO2FBRUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQVJKLENBRlY7SUFZQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FaWjtJQWVBLFdBQUEsRUFBYSxTQUFDLE1BQUQ7QUFDWCxVQUFBO0FBQUE7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQUcsR0FBRyxDQUFDLEtBQUosQ0FBVSxtQkFBVixDQUFIO0FBQ0UsaUJBQU8sS0FEVDs7QUFERjtBQUdBLGFBQU87SUFKSSxDQWZiO0lBcUJBLGdCQUFBLEVBQWtCLFNBQUMsS0FBRDtBQUNoQixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULFFBQUEsR0FBVyxNQUFNLENBQUMsdUJBQVAsQ0FBQTtNQUNYLFFBQUEsR0FBVyxRQUFRLENBQUM7TUFDcEIsS0FBQSxHQUFRLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBTSxDQUFDLGdDQUFQLENBQXdDLFFBQXhDLENBQWI7TUFDUixJQUFHLENBQUMsS0FBSjtRQUNFLEtBQUssQ0FBQyxlQUFOLENBQUE7QUFDQSxlQUZGOztNQUdBLFlBQUEsR0FBZSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsUUFBQSxHQUFXLENBQXRDO01BQ2YsSUFBRyxZQUFIO1FBQ0UsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsUUFBdkI7QUFDQSxlQUZGOztNQUdBLEdBQUEsR0FBTTtBQUNBLGFBQU0sR0FBQSxJQUFPLENBQVAsSUFBWSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxDQUFDLEdBQUQsRUFBTSxDQUFOLENBQXhDLENBQWIsQ0FBbEI7UUFBTixHQUFBO01BQU07TUFDTixRQUFBLEdBQVcsR0FBQSxHQUFNO01BQ2pCLEdBQUEsR0FBTTtBQUNBLGFBQU0sR0FBQSxHQUFNLE1BQU0sQ0FBQyxnQkFBUCxDQUFBLENBQU4sSUFBbUMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFNLENBQUMsZ0NBQVAsQ0FBd0MsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUF4QyxDQUFiLENBQXpDO1FBQU4sR0FBQTtNQUFNO01BQ04sT0FBQSxHQUFVLEdBQUEsR0FBTTtNQUNoQixJQUFHLE9BQUEsR0FBVSxRQUFiO1FBQ0UsTUFBTSxDQUFDLHNCQUFQLENBQThCLElBQUksS0FBSixDQUFVLElBQUksS0FBSixDQUFVLFFBQVYsRUFBb0IsQ0FBcEIsQ0FBVixFQUFrQyxJQUFJLEtBQUosQ0FBVSxPQUFWLEVBQW1CLENBQW5CLENBQWxDLENBQTlCO1FBQ0EsTUFBTSxDQUFDLGlCQUFQLENBQUE7ZUFDQSxNQUFNLENBQUMsTUFBUCxDQUFBLEVBSEY7O0lBbEJnQixDQXJCbEI7SUE0Q0EsbUJBQUEsRUFBcUIsU0FBQTtBQUNuQixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULFFBQUEsR0FBVyxNQUFNLENBQUMsdUJBQVAsQ0FBQTtNQUNYLElBQUcsQ0FBQyxJQUFDLENBQUEsUUFBTDtRQUNFLE1BQU0sQ0FBQyxTQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBQSxFQUZGO09BQUEsTUFBQTtRQUlFLGVBQUEsR0FBa0I7QUFDbEIsYUFBVyw2R0FBWDtVQUNFLEtBQUEsR0FBUSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxDQUFDLEdBQUQsRUFBTSxDQUFOLENBQXhDLENBQWI7VUFDUixJQUFHLGVBQUEsSUFBbUIsS0FBdEI7WUFDSSxRQUFBLEdBQVc7WUFDWCxlQUFBLEdBQWtCLE1BRnRCO1dBQUEsTUFHSyxJQUFHLENBQUMsZUFBRCxJQUFvQixDQUFDLEtBQXhCO1lBQ0QsZUFBQSxHQUFrQjtZQUNsQixJQUFHLEdBQUEsR0FBTSxRQUFUO2NBQ0UsTUFBTSxDQUFDLHNCQUFQLENBQThCLElBQUksS0FBSixDQUFVLElBQUksS0FBSixDQUFVLFFBQVYsRUFBb0IsQ0FBcEIsQ0FBVixFQUFrQyxJQUFJLEtBQUosQ0FBVSxHQUFBLEdBQUksQ0FBZCxFQUFpQixDQUFqQixDQUFsQyxDQUE5QjtjQUNBLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLEVBRkY7YUFGQzs7QUFMUCxTQUxGOztNQWVBLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQyxJQUFDLENBQUE7YUFFZCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBL0I7SUFwQm1CLENBNUNyQjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBQb2ludCwgUmFuZ2UsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBKdWxpYUZvbGRpbmcgPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhlIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2xhbmd1YWdlLWp1bGlhOnRvZ2dsZS1kb2NzdHJpbmdzJzogKGV2ZW50KSA9PiBAdG9nZ2xlZG9jc3RyaW5ncyhldmVudClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2xhbmd1YWdlLWp1bGlhOnRvZ2dsZS1hbGwtZG9jc3RyaW5ncyc6ID0+IEB0b2dnbGVhbGxkb2NzdHJpbmdzKClcblxuICAgIEBmb2xkbmV4dCA9IHRydWVcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIGlzZG9jc3RyaW5nOiAoc2NvcGVzKSAtPlxuICAgIGZvciBzdHIgaW4gc2NvcGVzLmdldFNjb3Blc0FycmF5KClcbiAgICAgIGlmIHN0ci5tYXRjaCAvc3RyaW5nXFwuZG9jc3RyaW5nL1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHRvZ2dsZWRvY3N0cmluZ3M6IChldmVudCkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBzdGFydHBvcyA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgc3RhcnRyb3cgPSBzdGFydHBvcy5yb3dcbiAgICBpc2RvYyA9IEBpc2RvY3N0cmluZyhlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oc3RhcnRwb3MpKVxuICAgIGlmICFpc2RvY1xuICAgICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIHNob3VsZHVuZm9sZCA9IGVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KHN0YXJ0cm93ICsgMSlcbiAgICBpZiBzaG91bGR1bmZvbGRcbiAgICAgIGVkaXRvci51bmZvbGRCdWZmZXJSb3coc3RhcnRyb3cpXG4gICAgICByZXR1cm5cbiAgICByb3cgPSBzdGFydHJvd1xuICAgIHJvdy0tIHdoaWxlIHJvdyA+PSAwICYmIEBpc2RvY3N0cmluZyhlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgMF0pKVxuICAgIGZpcnN0cm93ID0gcm93ICsgMVxuICAgIHJvdyA9IHN0YXJ0cm93XG4gICAgcm93Kysgd2hpbGUgcm93IDwgZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSAmJiBAaXNkb2NzdHJpbmcoZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtyb3csIDBdKSlcbiAgICBsYXN0cm93ID0gcm93IC0gMVxuICAgIGlmIGxhc3Ryb3cgPiBmaXJzdHJvd1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UobmV3IFJhbmdlKG5ldyBQb2ludChmaXJzdHJvdywgMCksIG5ldyBQb2ludChsYXN0cm93LCAwKSkpXG4gICAgICBlZGl0b3IuZm9sZFNlbGVjdGVkTGluZXMoKVxuICAgICAgZWRpdG9yLm1vdmVVcCgpXG5cbiAgdG9nZ2xlYWxsZG9jc3RyaW5nczogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBzdGFydHBvcyA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgIUBmb2xkbmV4dFxuICAgICAgZWRpdG9yLnVuZm9sZEFsbCgpXG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG4gICAgZWxzZSAjIGZvbGRcbiAgICAgIGxvb2tpbmdmb3JmaXJzdCA9IHRydWVcbiAgICAgIGZvciByb3cgaW4gWzAuLmVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCldXG4gICAgICAgIGlzZG9jID0gQGlzZG9jc3RyaW5nKGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbcm93LCAwXSkpXG4gICAgICAgIGlmIGxvb2tpbmdmb3JmaXJzdCAmJiBpc2RvY1xuICAgICAgICAgICAgZmlyc3Ryb3cgPSByb3dcbiAgICAgICAgICAgIGxvb2tpbmdmb3JmaXJzdCA9IGZhbHNlXG4gICAgICAgIGVsc2UgaWYgIWxvb2tpbmdmb3JmaXJzdCAmJiAhaXNkb2NcbiAgICAgICAgICAgIGxvb2tpbmdmb3JmaXJzdCA9IHRydWVcbiAgICAgICAgICAgIGlmIHJvdyA+IGZpcnN0cm93XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5ldyBSYW5nZShuZXcgUG9pbnQoZmlyc3Ryb3csIDApLCBuZXcgUG9pbnQocm93LTEsIDApKSlcbiAgICAgICAgICAgICAgZWRpdG9yLmZvbGRTZWxlY3RlZExpbmVzKClcbiAgICBAZm9sZG5leHQgPSAhQGZvbGRuZXh0XG4gICAgIyByZXR1cm4gY3Vyc29yIHRvIGluaXRpYWwgcG9zaXRpb25cbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oc3RhcnRwb3MpXG4iXX0=
