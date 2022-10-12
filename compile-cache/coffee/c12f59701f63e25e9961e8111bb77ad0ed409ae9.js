(function() {
  var editorMatchesFile;

  editorMatchesFile = require('../util/opener').editorMatchesFile;

  module.exports = {
    observeLines: function(ls, f) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(ed) {
          var i, l, len, results;
          results = [];
          for (i = 0, len = ls.length; i < len; i++) {
            l = ls[i];
            if (editorMatchesFile(ed, l.file)) {
              results.push(f(ed, l));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    },
    errorLines: function(ls) {
      var markers, watch;
      markers = [];
      watch = this.observeLines(ls, (function(_this) {
        return function(ed, arg) {
          var line, m;
          line = arg.line;
          m = ed.markBufferRange([[line, 0], [line + 1, 0]], {
            invalidate: 'touch'
          });
          markers.push(m);
          return ed.decorateMarker(m, {
            type: 'highlight',
            "class": 'error-line'
          });
        };
      })(this));
      return {
        destroy: function() {
          var i, len, m, results;
          watch.dispose();
          results = [];
          for (i = 0, len = markers.length; i < len; i++) {
            m = markers[i];
            results.push(m.destroy());
          }
          return results;
        }
      };
    },
    profileLineView: function(ed, count, classes) {
      var cl, i, len, v;
      v = document.createElement('div');
      v.classList.add('ink-profile-line');
      for (i = 0, len = classes.length; i < len; i++) {
        cl = classes[i];
        v.classList.add(cl);
      }
      v.style.width = 0.1 + count * ed.preferredLineLength + 'em';
      return v;
    },
    profileLines: function(ls) {
      var markers, watch;
      markers = [];
      watch = this.observeLines(ls, (function(_this) {
        return function(ed, arg) {
          var classes, count, line, m;
          line = arg.line, count = arg.count, classes = arg.classes;
          if (line < 0 || line > ed.getLineCount()) {
            return;
          }
          m = ed.markBufferRange([[line, 0], [line, 0]], {
            invalidate: 'never'
          });
          markers.push(m);
          return ed.decorateMarker(m, {
            type: 'overlay',
            item: _this.profileLineView(ed, count, classes),
            "class": 'ink-profile-overlay',
            avoidOverflow: false
          });
        };
      })(this));
      return {
        destroy: (function(_this) {
          return function() {
            var i, len, m, results;
            watch.dispose();
            results = [];
            for (i = 0, len = markers.length; i < len; i++) {
              m = markers[i];
              results.push(m.destroy());
            }
            return results;
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2VkaXRvci9oaWdobGlnaHRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsb0JBQXFCLE9BQUEsQ0FBUSxnQkFBUjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFlBQUEsRUFBYyxTQUFDLEVBQUQsRUFBSyxDQUFMO2FBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsRUFBRDtBQUNoQyxjQUFBO0FBQUE7ZUFBQSxvQ0FBQTs7WUFDRSxJQUFHLGlCQUFBLENBQWtCLEVBQWxCLEVBQXNCLENBQUMsQ0FBQyxJQUF4QixDQUFIOzJCQUNFLENBQUEsQ0FBRSxFQUFGLEVBQU0sQ0FBTixHQURGO2FBQUEsTUFBQTttQ0FBQTs7QUFERjs7UUFEZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO0lBRFksQ0FBZDtJQVVBLFVBQUEsRUFBWSxTQUFDLEVBQUQ7QUFDVixVQUFBO01BQUEsT0FBQSxHQUFVO01BQ1YsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFELENBQWMsRUFBZCxFQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDeEIsY0FBQTtVQUQ4QixPQUFEO1VBQzdCLENBQUEsR0FBSSxFQUFFLENBQUMsZUFBSCxDQUFtQixDQUFDLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBRCxFQUFZLENBQUMsSUFBQSxHQUFLLENBQU4sRUFBUyxDQUFULENBQVosQ0FBbkIsRUFDRjtZQUFBLFVBQUEsRUFBWSxPQUFaO1dBREU7VUFFSixPQUFPLENBQUMsSUFBUixDQUFhLENBQWI7aUJBQ0EsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsQ0FBbEIsRUFDRTtZQUFBLElBQUEsRUFBTSxXQUFOO1lBQ0EsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQURQO1dBREY7UUFKd0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO2FBT1I7UUFBQSxPQUFBLEVBQVMsU0FBQTtBQUNQLGNBQUE7VUFBQSxLQUFLLENBQUMsT0FBTixDQUFBO0FBQ0E7ZUFBQSx5Q0FBQTs7eUJBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQTtBQUFBOztRQUZPLENBQVQ7O0lBVFUsQ0FWWjtJQXVCQSxlQUFBLEVBQWlCLFNBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxPQUFaO0FBQ2YsVUFBQTtNQUFBLENBQUEsR0FBSSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNKLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBWixDQUFnQixrQkFBaEI7QUFDQSxXQUFBLHlDQUFBOztRQUFBLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBWixDQUFnQixFQUFoQjtBQUFBO01BR0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFSLEdBQWdCLEdBQUEsR0FBTSxLQUFBLEdBQU0sRUFBRSxDQUFDLG1CQUFmLEdBQXFDO2FBQ3JEO0lBUGUsQ0F2QmpCO0lBZ0NBLFlBQUEsRUFBYyxTQUFDLEVBQUQ7QUFDWixVQUFBO01BQUEsT0FBQSxHQUFVO01BQ1YsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFELENBQWMsRUFBZCxFQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDeEIsY0FBQTtVQUQ4QixpQkFBTSxtQkFBTztVQUMzQyxJQUFHLElBQUEsR0FBTyxDQUFQLElBQVksSUFBQSxHQUFPLEVBQUUsQ0FBQyxZQUFILENBQUEsQ0FBdEI7QUFDRSxtQkFERjs7VUFFQSxDQUFBLEdBQUksRUFBRSxDQUFDLGVBQUgsQ0FBbUIsQ0FBQyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQUQsRUFBWSxDQUFDLElBQUQsRUFBTyxDQUFQLENBQVosQ0FBbkIsRUFDRjtZQUFBLFVBQUEsRUFBWSxPQUFaO1dBREU7VUFFSixPQUFPLENBQUMsSUFBUixDQUFhLENBQWI7aUJBQ0EsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsQ0FBbEIsRUFDRTtZQUFBLElBQUEsRUFBTSxTQUFOO1lBQ0EsSUFBQSxFQUFNLEtBQUMsQ0FBQSxlQUFELENBQWlCLEVBQWpCLEVBQXFCLEtBQXJCLEVBQTRCLE9BQTVCLENBRE47WUFFQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHFCQUZQO1lBR0EsYUFBQSxFQUFlLEtBSGY7V0FERjtRQU53QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7YUFZUjtRQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ1AsZ0JBQUE7WUFBQSxLQUFLLENBQUMsT0FBTixDQUFBO0FBQ0E7aUJBQUEseUNBQUE7OzJCQUFBLENBQUMsQ0FBQyxPQUFGLENBQUE7QUFBQTs7VUFGTztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDs7SUFkWSxDQWhDZDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntlZGl0b3JNYXRjaGVzRmlsZX0gPSByZXF1aXJlICcuLi91dGlsL29wZW5lcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBvYnNlcnZlTGluZXM6IChscywgZikgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkKSA9PlxuICAgICAgZm9yIGwgaW4gbHNcbiAgICAgICAgaWYgZWRpdG9yTWF0Y2hlc0ZpbGUoZWQsIGwuZmlsZSlcbiAgICAgICAgICBmIGVkLCBsXG5cbiMgQWRkcyBhIHJlZCBiYWNrZ3JvdW5kIGNvbG9yIHRvIHRoZSBwcm92aWRlZCBsaW5lIHNwZWNpZmljYXRpb25zXG4jIGxzIGlzIGEgdmVjdG9yIG9mIHtmaWxlOiAnZnVsbC1wYXRoLXRvLWZpbGUnLCBsaW5lOiBpbnRlZ2VyfVxuIyBmdWxsLXBhdGggYXMgdmlhOiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpXG4jIE5PVEU6IHRoaXMgZG9lc24ndCBjaGVjayB3aGV0aGVyIG9yIG5vdCB0aGUgbGluZXMgYWxyZWFkeSBoYWQgYSBiYWNrZ3JvdW5kIGNvbG9yXG4gIGVycm9yTGluZXM6IChscykgLT5cbiAgICBtYXJrZXJzID0gW11cbiAgICB3YXRjaCA9IEBvYnNlcnZlTGluZXMgbHMsIChlZCwge2xpbmV9KSA9PlxuICAgICAgbSA9IGVkLm1hcmtCdWZmZXJSYW5nZSBbW2xpbmUsIDBdLCBbbGluZSsxLCAwXV0sXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIG1hcmtlcnMucHVzaCBtXG4gICAgICBlZC5kZWNvcmF0ZU1hcmtlciBtLFxuICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0J1xuICAgICAgICBjbGFzczogJ2Vycm9yLWxpbmUnXG4gICAgZGVzdHJveTogLT5cbiAgICAgIHdhdGNoLmRpc3Bvc2UoKVxuICAgICAgbS5kZXN0cm95KCkgZm9yIG0gaW4gbWFya2Vyc1xuXG4gIHByb2ZpbGVMaW5lVmlldzogKGVkLCBjb3VudCwgY2xhc3NlcykgLT5cbiAgICB2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIHYuY2xhc3NMaXN0LmFkZCgnaW5rLXByb2ZpbGUtbGluZScpXG4gICAgdi5jbGFzc0xpc3QuYWRkKGNsKSBmb3IgY2wgaW4gY2xhc3Nlc1xuXG4gICAgIyBjYW4ndCB1c2UgZWQuZGVmYXVsdENoYXJXaWR0aCBoZXJlIGJlY2F1c2UgdGhhdCBzb21ldGltZXMgc2VlbXMgdG8gYmUgMFxuICAgIHYuc3R5bGUud2lkdGggPSAwLjEgKyBjb3VudCplZC5wcmVmZXJyZWRMaW5lTGVuZ3RoICsgJ2VtJ1xuICAgIHZcblxuICBwcm9maWxlTGluZXM6IChscykgLT5cbiAgICBtYXJrZXJzID0gW11cbiAgICB3YXRjaCA9IEBvYnNlcnZlTGluZXMgbHMsIChlZCwge2xpbmUsIGNvdW50LCBjbGFzc2VzfSkgPT5cbiAgICAgIGlmIGxpbmUgPCAwIHx8IGxpbmUgPiBlZC5nZXRMaW5lQ291bnQoKVxuICAgICAgICByZXR1cm5cbiAgICAgIG0gPSBlZC5tYXJrQnVmZmVyUmFuZ2UgW1tsaW5lLCAwXSwgW2xpbmUsIDBdXSxcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJ1xuICAgICAgbWFya2Vycy5wdXNoIG1cbiAgICAgIGVkLmRlY29yYXRlTWFya2VyIG0sXG4gICAgICAgIHR5cGU6ICdvdmVybGF5J1xuICAgICAgICBpdGVtOiBAcHJvZmlsZUxpbmVWaWV3IGVkLCBjb3VudCwgY2xhc3Nlc1xuICAgICAgICBjbGFzczogJ2luay1wcm9maWxlLW92ZXJsYXknXG4gICAgICAgIGF2b2lkT3ZlcmZsb3c6IGZhbHNlXG5cbiAgICBkZXN0cm95OiA9PlxuICAgICAgd2F0Y2guZGlzcG9zZSgpXG4gICAgICBtLmRlc3Ryb3koKSBmb3IgbSBpbiBtYXJrZXJzXG4iXX0=
