(function() {
  module.exports = {
    timeout: function(t, f) {
      return setTimeout(f, t);
    },
    highlight: function(ed, start, end, clas) {
      var d, m;
      if (clas == null) {
        clas = 'ink-block';
      }
      m = ed.markBufferRange([[start, 0], [end + 1, 0]]);
      d = ed.decorateMarker(m, {
        type: 'highlight',
        "class": clas
      });
      this.timeout(20, (function(_this) {
        return function() {
          var i, len, ref, region, results;
          ref = atom.views.getView(ed).querySelectorAll(clas);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            region = ref[i];
            results.push(region.classList.add('hidden'));
          }
          return results;
        };
      })(this));
      return this.timeout(220, (function(_this) {
        return function() {
          return m.destroy();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2VkaXRvci9ibG9jay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7YUFBVSxVQUFBLENBQVcsQ0FBWCxFQUFjLENBQWQ7SUFBVixDQUFUO0lBS0EsU0FBQSxFQUFXLFNBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxHQUFaLEVBQWlCLElBQWpCO0FBQ1QsVUFBQTs7UUFEMEIsT0FBTzs7TUFDakMsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxlQUFILENBQW1CLENBQUMsQ0FBQyxLQUFELEVBQVEsQ0FBUixDQUFELEVBQWEsQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFRLENBQVIsQ0FBYixDQUFuQjtNQUNKLENBQUEsR0FBSSxFQUFFLENBQUMsY0FBSCxDQUFrQixDQUFsQixFQUNFO1FBQUEsSUFBQSxFQUFNLFdBQU47UUFDQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLElBRFA7T0FERjtNQUdKLElBQUMsQ0FBQSxPQUFELENBQVMsRUFBVCxFQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNYLGNBQUE7QUFBQTtBQUFBO2VBQUEscUNBQUE7O3lCQUNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsUUFBckI7QUFERjs7UUFEVztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjthQUdBLElBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxFQUFjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDWixDQUFDLENBQUMsT0FBRixDQUFBO1FBRFk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQ7SUFSUyxDQUxYOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB0aW1lb3V0OiAodCwgZikgLT4gc2V0VGltZW91dCBmLCB0XG5cbiAgIyBoaWdobGlnaHRzIHRoZSBzdGFydC1lbmQgcmFuZ2Ugb2YgdGhlIHByb3ZpZGVkIGVkaXRvciBvYmplY3QgZm9yIDIwIG1zXG4gICMgZWQgaXMgYW4gb2JqZWN0IGxpa2UgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLCBzdGFydCBhbmRcbiAgIyBlbmQgYXJlIGludGVnZXJzXG4gIGhpZ2hsaWdodDogKGVkLCBzdGFydCwgZW5kLCBjbGFzID0gJ2luay1ibG9jaycpIC0+XG4gICAgbSA9IGVkLm1hcmtCdWZmZXJSYW5nZSBbW3N0YXJ0LCAwXSwgW2VuZCsxLCAwXV1cbiAgICBkID0gZWQuZGVjb3JhdGVNYXJrZXIgbSxcbiAgICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0J1xuICAgICAgICAgIGNsYXNzOiBjbGFzXG4gICAgQHRpbWVvdXQgMjAsID0+XG4gICAgICBmb3IgcmVnaW9uIGluIGF0b20udmlld3MuZ2V0VmlldyhlZCkucXVlcnlTZWxlY3RvckFsbCBjbGFzXG4gICAgICAgIHJlZ2lvbi5jbGFzc0xpc3QuYWRkICdoaWRkZW4nXG4gICAgQHRpbWVvdXQgMjIwLCA9PlxuICAgICAgbS5kZXN0cm95KClcbiJdfQ==
