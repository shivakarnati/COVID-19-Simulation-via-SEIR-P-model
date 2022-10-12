(function() {
  var CompositeDisposable, Disposable, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  module.exports = {
    notifications: require('./ui/notifications'),
    selector: require('./ui/selector'),
    views: require('./ui/views'),
    progress: require('./ui/progress'),
    layout: require('./ui/layout'),
    docpane: require('./ui/docs'),
    focusutils: require('./ui/focusutils'),
    cellhighlighter: require('./ui/cellhighlighter'),
    activate: function(client) {
      this.client = client;
      this.subs = new CompositeDisposable;
      this.notifications.activate();
      this.subs.add(atom.config.observe('julia-client.uiOptions.highlightCells', (function(_this) {
        return function(val) {
          if (val) {
            return _this.cellhighlighter.activate();
          } else {
            return _this.cellhighlighter.deactivate();
          }
        };
      })(this)));
      this.subs.add(new Disposable((function(_this) {
        return function() {
          return _this.cellhighlighter.deactivate();
        };
      })(this)));
      this.subs.add(this.client.onAttached((function(_this) {
        return function() {
          return _this.notifications.show("Client Connected");
        };
      })(this)));
      return this.subs.add(this.client.onDetached((function(_this) {
        return function() {
          var ref1;
          return (ref1 = _this.ink) != null ? ref1.Result.invalidateAll() : void 0;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    consumeInk: function(ink) {
      this.ink = ink;
      this.views.ink = this.ink;
      this.selector.activate(this.ink);
      this.docpane.activate(this.ink);
      this.progress.activate(this.ink);
      this.focusutils.activate(this.ink);
      return this.subs.add(new Disposable((function(_this) {
        return function() {
          _this.docpane.deactivate();
          _this.progress.deactivate();
          return _this.focusutils.deactivate();
        };
      })(this)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3VpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxPQUFBLENBQVEsb0JBQVIsQ0FBZjtJQUNBLFFBQUEsRUFBZSxPQUFBLENBQVEsZUFBUixDQURmO0lBRUEsS0FBQSxFQUFlLE9BQUEsQ0FBUSxZQUFSLENBRmY7SUFHQSxRQUFBLEVBQWUsT0FBQSxDQUFRLGVBQVIsQ0FIZjtJQUlBLE1BQUEsRUFBZSxPQUFBLENBQVEsYUFBUixDQUpmO0lBS0EsT0FBQSxFQUFlLE9BQUEsQ0FBUSxXQUFSLENBTGY7SUFNQSxVQUFBLEVBQWUsT0FBQSxDQUFRLGlCQUFSLENBTmY7SUFPQSxlQUFBLEVBQW9CLE9BQUEsQ0FBUSxzQkFBUixDQVBwQjtJQVNBLFFBQUEsRUFBVSxTQUFDLE1BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNULElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSTtNQUVaLElBQUMsQ0FBQSxhQUFhLENBQUMsUUFBZixDQUFBO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHVDQUFwQixFQUE2RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUNyRSxJQUFHLEdBQUg7bUJBQ0UsS0FBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFlLENBQUMsVUFBakIsQ0FBQSxFQUhGOztRQURxRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0QsQ0FBVjtNQUtBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksVUFBSixDQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDdkIsS0FBQyxDQUFBLGVBQWUsQ0FBQyxVQUFqQixDQUFBO1FBRHVCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLENBQVY7TUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUMzQixLQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0Isa0JBQXBCO1FBRDJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQUFWO2FBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUMzQixjQUFBO2tEQUFJLENBQUUsTUFBTSxDQUFDLGFBQWIsQ0FBQTtRQUQyQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkIsQ0FBVjtJQWRRLENBVFY7SUEwQkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQURVLENBMUJaO0lBNkJBLFVBQUEsRUFBWSxTQUFDLEdBQUQ7TUFBQyxJQUFDLENBQUEsTUFBRDtNQUNYLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxHQUFhLElBQUMsQ0FBQTtNQUNkLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixDQUFtQixJQUFDLENBQUEsR0FBcEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsSUFBQyxDQUFBLEdBQW5CO01BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLElBQUMsQ0FBQSxHQUFwQjtNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFxQixJQUFDLENBQUEsR0FBdEI7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFJLFVBQUosQ0FBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDdkIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxVQUFULENBQUE7VUFDQSxLQUFDLENBQUEsUUFBUSxDQUFDLFVBQVYsQ0FBQTtpQkFDQSxLQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBQTtRQUh1QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixDQUFWO0lBTlUsQ0E3Qlo7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIG5vdGlmaWNhdGlvbnM6IHJlcXVpcmUgJy4vdWkvbm90aWZpY2F0aW9ucydcbiAgc2VsZWN0b3I6ICAgICAgcmVxdWlyZSAnLi91aS9zZWxlY3RvcidcbiAgdmlld3M6ICAgICAgICAgcmVxdWlyZSAnLi91aS92aWV3cydcbiAgcHJvZ3Jlc3M6ICAgICAgcmVxdWlyZSAnLi91aS9wcm9ncmVzcydcbiAgbGF5b3V0OiAgICAgICAgcmVxdWlyZSAnLi91aS9sYXlvdXQnXG4gIGRvY3BhbmU6ICAgICAgIHJlcXVpcmUgJy4vdWkvZG9jcydcbiAgZm9jdXN1dGlsczogICAgcmVxdWlyZSAnLi91aS9mb2N1c3V0aWxzJ1xuICBjZWxsaGlnaGxpZ2h0ZXI6ICAgIHJlcXVpcmUgJy4vdWkvY2VsbGhpZ2hsaWdodGVyJ1xuXG4gIGFjdGl2YXRlOiAoQGNsaWVudCkgLT5cbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAbm90aWZpY2F0aW9ucy5hY3RpdmF0ZSgpXG4gICAgQHN1YnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMuaGlnaGxpZ2h0Q2VsbHMnLCAodmFsKSA9PlxuICAgICAgaWYgdmFsXG4gICAgICAgIEBjZWxsaGlnaGxpZ2h0ZXIuYWN0aXZhdGUoKVxuICAgICAgZWxzZVxuICAgICAgICBAY2VsbGhpZ2hsaWdodGVyLmRlYWN0aXZhdGUoKVxuICAgIEBzdWJzLmFkZCBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgQGNlbGxoaWdobGlnaHRlci5kZWFjdGl2YXRlKClcblxuICAgIEBzdWJzLmFkZCBAY2xpZW50Lm9uQXR0YWNoZWQgPT5cbiAgICAgIEBub3RpZmljYXRpb25zLnNob3coXCJDbGllbnQgQ29ubmVjdGVkXCIpXG4gICAgQHN1YnMuYWRkIEBjbGllbnQub25EZXRhY2hlZCA9PlxuICAgICAgQGluaz8uUmVzdWx0LmludmFsaWRhdGVBbGwoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnMuZGlzcG9zZSgpXG5cbiAgY29uc3VtZUluazogKEBpbmspIC0+XG4gICAgQHZpZXdzLmluayA9IEBpbmtcbiAgICBAc2VsZWN0b3IuYWN0aXZhdGUoQGluaylcbiAgICBAZG9jcGFuZS5hY3RpdmF0ZShAaW5rKVxuICAgIEBwcm9ncmVzcy5hY3RpdmF0ZShAaW5rKVxuICAgIEBmb2N1c3V0aWxzLmFjdGl2YXRlKEBpbmspXG4gICAgQHN1YnMuYWRkKG5ldyBEaXNwb3NhYmxlKD0+XG4gICAgICBAZG9jcGFuZS5kZWFjdGl2YXRlKClcbiAgICAgIEBwcm9ncmVzcy5kZWFjdGl2YXRlKClcbiAgICAgIEBmb2N1c3V0aWxzLmRlYWN0aXZhdGUoKSkpXG4iXX0=
