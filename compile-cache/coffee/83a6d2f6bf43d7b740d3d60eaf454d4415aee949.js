(function() {
  var SelectListView;

  SelectListView = require('atom-space-pen-views').SelectListView;

  module.exports = {
    show: function(xs, f) {
      var confirmed, panel;
      if (this.selector == null) {
        this.selector = new SelectListView;
      }
      this.selector.setItems([]);
      this.selector.storeFocusedElement();
      this.selector.getFilterKey = (function(_this) {
        return function() {
          return 'text';
        };
      })(this);
      this.selector.viewForItem = (function(_this) {
        return function(item) {
          return "<li>" + item.text + "</li>";
        };
      })(this);
      if (xs.constructor === Promise) {
        this.selector.setLoading("Loading...");
        xs.then((function(_this) {
          return function(xs) {
            return _this.selector.setItems(xs);
          };
        })(this));
      } else {
        this.selector.setItems(xs);
      }
      panel = atom.workspace.addModalPanel({
        item: this.selector
      });
      this.selector.focusFilterEditor();
      confirmed = false;
      this.selector.confirmed = (function(_this) {
        return function(item) {
          f(item);
          confirmed = true;
          return _this.selector.cancel();
        };
      })(this);
      return this.selector.cancelled = (function(_this) {
        return function() {
          panel.destroy();
          if (!confirmed) {
            return f();
          }
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmRlbnQtZGV0ZWN0aXZlL2xpYi9zZWxlY3Rvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxFQUFELEVBQUssQ0FBTDtBQUNKLFVBQUE7O1FBQUEsSUFBQyxDQUFBLFdBQVksSUFBSTs7TUFDakIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLEVBQW5CO01BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLEdBQXlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRztRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUN6QixJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsR0FBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ3RCLE1BQUEsR0FBTyxJQUFJLENBQUMsSUFBWixHQUFpQjtRQURLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUd4QixJQUFHLEVBQUUsQ0FBQyxXQUFILEtBQWtCLE9BQXJCO1FBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLFlBQXJCO1FBQ0EsRUFBRSxDQUFDLElBQUgsQ0FBUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEVBQUQ7bUJBQ04sS0FBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLEVBQW5CO1VBRE07UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFGRjtPQUFBLE1BQUE7UUFLRSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsQ0FBbUIsRUFBbkIsRUFMRjs7TUFPQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxRQUFQO09BQTdCO01BQ1IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUFBO01BRUEsU0FBQSxHQUFZO01BQ1osSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLEdBQXNCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ3BCLENBQUEsQ0FBRSxJQUFGO1VBQ0EsU0FBQSxHQUFZO2lCQUNaLEtBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBO1FBSG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUl0QixJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsR0FBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BCLEtBQUssQ0FBQyxPQUFOLENBQUE7VUFDQSxJQUFBLENBQVcsU0FBWDttQkFBQSxDQUFBLENBQUEsRUFBQTs7UUFGb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBdkJsQixDQUFOOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie1NlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNob3c6ICh4cywgZikgLT5cbiAgICBAc2VsZWN0b3IgPz0gbmV3IFNlbGVjdExpc3RWaWV3XG4gICAgQHNlbGVjdG9yLnNldEl0ZW1zIFtdXG4gICAgQHNlbGVjdG9yLnN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBzZWxlY3Rvci5nZXRGaWx0ZXJLZXkgPSA9PiAndGV4dCdcbiAgICBAc2VsZWN0b3Iudmlld0Zvckl0ZW0gPSAoaXRlbSkgPT5cbiAgICAgIFwiPGxpPiN7aXRlbS50ZXh0fTwvbGk+XCJcblxuICAgIGlmIHhzLmNvbnN0cnVjdG9yID09IFByb21pc2VcbiAgICAgIEBzZWxlY3Rvci5zZXRMb2FkaW5nIFwiTG9hZGluZy4uLlwiXG4gICAgICB4cy50aGVuICh4cykgPT5cbiAgICAgICAgQHNlbGVjdG9yLnNldEl0ZW1zIHhzXG4gICAgZWxzZVxuICAgICAgQHNlbGVjdG9yLnNldEl0ZW1zIHhzXG5cbiAgICBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogQHNlbGVjdG9yKVxuICAgIEBzZWxlY3Rvci5mb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgICBjb25maXJtZWQgPSBmYWxzZVxuICAgIEBzZWxlY3Rvci5jb25maXJtZWQgPSAoaXRlbSkgPT5cbiAgICAgIGYoaXRlbSlcbiAgICAgIGNvbmZpcm1lZCA9IHRydWVcbiAgICAgIEBzZWxlY3Rvci5jYW5jZWwoKVxuICAgIEBzZWxlY3Rvci5jYW5jZWxsZWQgPSA9PlxuICAgICAgcGFuZWwuZGVzdHJveSgpXG4gICAgICBmKCkgdW5sZXNzIGNvbmZpcm1lZFxuIl19
