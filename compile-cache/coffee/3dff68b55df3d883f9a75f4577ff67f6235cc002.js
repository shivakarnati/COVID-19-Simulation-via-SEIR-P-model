(function() {
  var div, ref, span, views;

  views = require('./util/views');

  ref = views.tags, div = ref.div, span = ref.span;

  module.exports = {
    treeView: function(head, children, arg) {
      var expand, i, len, onToggle, ref1, ref2, sel, view;
      ref1 = arg != null ? arg : {}, expand = ref1.expand, onToggle = ref1.onToggle;
      view = views.render(div('ink tree', [span('icon icon-chevron-right open'), div('header gutted', head), div('body gutted', children)]));
      ref2 = [':scope > .header', ':scope > .icon'];
      for (i = 0, len = ref2.length; i < len; i++) {
        sel = ref2[i];
        view.querySelector(sel).addEventListener('click', (function(_this) {
          return function() {
            if (typeof onToggle === "function") {
              onToggle();
            }
            return window.requestAnimationFrame(function() {
              return _this.toggle(view);
            });
          };
        })(this));
      }
      view.onToggle = onToggle;
      if (!expand) {
        this.toggle(view);
      }
      return view;
    },
    toggle: function(view) {
      var body, head, icon;
      head = view.querySelector(':scope > .header');
      body = view.querySelector(':scope > .body');
      icon = view.querySelector(':scope > .icon');
      if (body == null) {
        return;
      }
      if (body.style.display === '') {
        body.style.display = 'none';
        head.classList.add('closed');
        return icon.classList.remove('open');
      } else {
        body.style.display = '';
        head.classList.remove('closed');
        return icon.classList.add('open');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3RyZWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0VBRVIsTUFBYyxLQUFLLENBQUMsSUFBcEIsRUFBQyxhQUFELEVBQU07O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLEdBQWpCO0FBQ1IsVUFBQTsyQkFEeUIsTUFBbUIsSUFBbEIsc0JBQVE7TUFDbEMsSUFBQSxHQUFPLEtBQUssQ0FBQyxNQUFOLENBQWEsR0FBQSxDQUFJLFVBQUosRUFBZ0IsQ0FDbEMsSUFBQSxDQUFLLDhCQUFMLENBRGtDLEVBRWxDLEdBQUEsQ0FBSSxlQUFKLEVBQXFCLElBQXJCLENBRmtDLEVBR2xDLEdBQUEsQ0FBSSxhQUFKLEVBQW1CLFFBQW5CLENBSGtDLENBQWhCLENBQWI7QUFLUDtBQUFBLFdBQUEsc0NBQUE7O1FBQ0UsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsR0FBbkIsQ0FBdUIsQ0FBQyxnQkFBeEIsQ0FBeUMsT0FBekMsRUFBa0QsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTs7Y0FDaEQ7O21CQUNBLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixTQUFBO3FCQUFHLEtBQUMsQ0FBQSxNQUFELENBQVEsSUFBUjtZQUFILENBQTdCO1VBRmdEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRDtBQURGO01BSUEsSUFBSSxDQUFDLFFBQUwsR0FBZ0I7TUFDaEIsSUFBQSxDQUFvQixNQUFwQjtRQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQUFBOzthQUNBO0lBWlEsQ0FBVjtJQWNBLE1BQUEsRUFBUSxTQUFDLElBQUQ7QUFDTixVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxhQUFMLENBQW1CLGtCQUFuQjtNQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsYUFBTCxDQUFtQixnQkFBbkI7TUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBbUIsZ0JBQW5CO01BQ1AsSUFBYyxZQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxLQUFzQixFQUF6QjtRQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxHQUFxQjtRQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsUUFBbkI7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsTUFBdEIsRUFIRjtPQUFBLE1BQUE7UUFLRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsR0FBcUI7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFmLENBQXNCLFFBQXRCO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFmLENBQW1CLE1BQW5CLEVBUEY7O0lBTE0sQ0FkUjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbInZpZXdzID0gcmVxdWlyZSAnLi91dGlsL3ZpZXdzJ1xuXG57ZGl2LCBzcGFufSA9IHZpZXdzLnRhZ3NcblxubW9kdWxlLmV4cG9ydHMgPVxuICB0cmVlVmlldzogKGhlYWQsIGNoaWxkcmVuLCB7ZXhwYW5kLCBvblRvZ2dsZX09e30pIC0+XG4gICAgdmlldyA9IHZpZXdzLnJlbmRlciBkaXYgJ2luayB0cmVlJywgW1xuICAgICAgc3BhbiAnaWNvbiBpY29uLWNoZXZyb24tcmlnaHQgb3BlbidcbiAgICAgIGRpdiAnaGVhZGVyIGd1dHRlZCcsIGhlYWRcbiAgICAgIGRpdiAnYm9keSBndXR0ZWQnLCBjaGlsZHJlblxuICAgIF1cbiAgICBmb3Igc2VsIGluIFsnOnNjb3BlID4gLmhlYWRlcicsICc6c2NvcGUgPiAuaWNvbiddXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3Ioc2VsKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsICgpID0+XG4gICAgICAgIG9uVG9nZ2xlPygpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gQHRvZ2dsZSB2aWV3XG4gICAgdmlldy5vblRvZ2dsZSA9IG9uVG9nZ2xlXG4gICAgQHRvZ2dsZSB2aWV3IHVubGVzcyBleHBhbmRcbiAgICB2aWV3XG5cbiAgdG9nZ2xlOiAodmlldykgLT5cbiAgICBoZWFkID0gdmlldy5xdWVyeVNlbGVjdG9yICc6c2NvcGUgPiAuaGVhZGVyJ1xuICAgIGJvZHkgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IgJzpzY29wZSA+IC5ib2R5J1xuICAgIGljb24gPSB2aWV3LnF1ZXJ5U2VsZWN0b3IgJzpzY29wZSA+IC5pY29uJ1xuICAgIHJldHVybiB1bmxlc3MgYm9keT9cbiAgICBpZiBib2R5LnN0eWxlLmRpc3BsYXkgPT0gJydcbiAgICAgIGJvZHkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgaGVhZC5jbGFzc0xpc3QuYWRkICdjbG9zZWQnXG4gICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUgJ29wZW4nXG4gICAgZWxzZVxuICAgICAgYm9keS5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICAgIGhlYWQuY2xhc3NMaXN0LnJlbW92ZSAnY2xvc2VkJ1xuICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkICdvcGVuJ1xuIl19
