(function() {
  var CompositeDisposable, Emitter, Tooltip, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  module.exports = Tooltip = (function() {
    function Tooltip(parent, content, arg) {
      var ref1;
      this.parent = parent;
      ref1 = arg != null ? arg : {}, this.cond = ref1.cond, this.showDelay = ref1.showDelay, this.hideDelay = ref1.hideDelay, this.className = ref1.className, this.position = ref1.position;
      if (this.cond == null) {
        this.cond = (function() {
          return true;
        });
      }
      if (this.showDelay == null) {
        this.showDelay = 150;
      }
      if (this.hideDelay == null) {
        this.hideDelay = 150;
      }
      if (this.position == null) {
        this.position = 'left';
      }
      this.emitter = new Emitter();
      this.view = this.tooltipView(content);
      document.body.appendChild(this.view);
      this.oldOnMouseOver = this.parent.onmouseover;
      this.oldOnMouseOut = this.parent.onmouseout;
      this.showOnHover();
      this;
    }

    Tooltip.prototype.onDidShow = function(f) {
      return this.emitter.on('didShow', f);
    };

    Tooltip.prototype.onDidHide = function(f) {
      return this.emitter.on('didHide', f);
    };

    Tooltip.prototype.hide_ = function() {
      this.view.classList.add('dontshow');
      return this.view.style.display = 'none';
    };

    Tooltip.prototype.hide = function() {
      this.view.classList.add('dontshow');
      this.emitter.emit('didHide');
      return setTimeout(((function(_this) {
        return function() {
          return _this.hide_();
        };
      })(this)), 100);
    };

    Tooltip.prototype.show = function() {
      this.view.style.display = 'block';
      this.emitter.emit('didShow');
      return setTimeout(((function(_this) {
        return function() {
          _this.positionOverlay();
          return _this.view.classList.remove('dontshow');
        };
      })(this)), 20);
    };

    Tooltip.prototype.destroy = function() {
      if (document.body.contains(this.view)) {
        document.body.removeChild(this.view);
      }
      this.parent.onmouseover = this.oldOnMouseOver;
      return this.parent.onmouseout = this.oldOnMouseOut;
    };

    Tooltip.prototype.tooltipView = function(content) {
      var tt;
      tt = document.createElement('div');
      tt.classList.add('ink-tooltip', 'dontshow');
      if (this.clas) {
        tt.classList.add(this.className);
      }
      tt.style.display = 'none';
      if (content) {
        tt.appendChild(content);
      }
      return tt;
    };

    Tooltip.prototype.showOnHover = function() {
      var hideTimer, showTimer;
      hideTimer = null;
      showTimer = null;
      this.parent.onmouseover = (function(_this) {
        return function() {
          clearTimeout(hideTimer);
          if (_this.cond()) {
            return showTimer = setTimeout((function() {
              return _this.show();
            }), _this.showDelay);
          }
        };
      })(this);
      this.parent.onmouseout = (function(_this) {
        return function() {
          clearTimeout(showTimer);
          return hideTimer = setTimeout((function() {
            return _this.hide();
          }), _this.hideDelay);
        };
      })(this);
      this.view.onmouseover = (function(_this) {
        return function() {
          return clearTimeout(hideTimer);
        };
      })(this);
      return this.view.onmouseout = (function(_this) {
        return function() {
          return hideTimer = setTimeout((function() {
            return _this.hide();
          }), _this.hideDelay);
        };
      })(this);
    };

    Tooltip.prototype.positionOverlay = function() {
      var bounding;
      bounding = this.parent.getBoundingClientRect();
      this.view.style.bottom = document.documentElement.clientHeight - bounding.top + 'px';
      return this.view.style.left = (function() {
        switch (this.position) {
          case 'left':
            return bounding.left + 'px';
          case 'right':
            return bounding.left + bounding.width - this.view.offsetWidth + 'px';
        }
      }).call(this);
    };

    return Tooltip;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvdG9vbHRpcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBMkJ0QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsaUJBQUMsTUFBRCxFQUFVLE9BQVYsRUFBbUIsR0FBbkI7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLFNBQUQ7MkJBQWtCLE1BQXVELElBQXRELElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLGlCQUFBLFdBQVcsSUFBQyxDQUFBLGlCQUFBLFdBQVcsSUFBQyxDQUFBLGlCQUFBLFdBQVcsSUFBQyxDQUFBLGdCQUFBO01BQzNFLElBQTJCLGlCQUEzQjtRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVMsQ0FBQyxTQUFBO2lCQUFHO1FBQUgsQ0FBRCxFQUFUOztNQUNBLElBQTJCLHNCQUEzQjtRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYjs7TUFDQSxJQUEyQixzQkFBM0I7UUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQWI7O01BQ0EsSUFBMkIscUJBQTNCO1FBQUEsSUFBQyxDQUFBLFFBQUQsR0FBYSxPQUFiOztNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxPQUFKLENBQUE7TUFDWCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBYjtNQUNSLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixJQUFDLENBQUEsSUFBM0I7TUFHQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDO01BQzFCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxNQUFNLENB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aXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG4jIFRvb2x0aXBcbiNcbiMgVG9vbHRpcHMgdGhhdCBzdXBwb3J0IGFyYml0cmFyeSBIVE1MIGNvbnRlbnQuXG4jXG4jIG5ldyBUb29sdGlwKHBhcmVudCwgY29udGVudCwgb3B0aW9ucylcbiMgICAgIENyZWF0ZSBhIG5ldyBUb29sdGlwIGF0dGFjaGVkIHRvIGBwYXJlbnRgIHdpdGggY29udGVudCBgY29udGVudGAsIHdoaWNoXG4jICAgICB3aWxsIGJlIHNob3duIG9uIG1vdXNlb3Zlci5cbiMgICAgIG9wdGlvbnM6XG4jICAgICAgICBjb25kOiAgRnVuY3Rpb24uIElmIGl0IGV2YWx1YXRlcyB0byBmYWxzZSB3aGVuIGhvdmVyaW5nIG92ZXIgdGhlIHBhcmVudCxcbiMgICAgICAgICAgICAgICB0aGUgdG9vbHRpcCB3aWxsIG5vdCBiZSBzaG93bi4gRGVmYXVsdHMgdG8gYC0+IHRydWVgLlxuIyAgICAgICAgaGlkZURlbGF5OiBUaW1lIGluIG1zIGFmdGVyIHdoaWNoIHRoZSB0b29sdGlwIGlzIGhpZGRlbi4gRGVmYXVsdHMgdG8gMTUwbXMuXG4jICAgICAgICBzaG93RGVsYXk6IFRpbWUgaW4gbXMgYWZ0ZXIgd2hpY2ggdGhlIHRvb2x0aXAgaXMgc2hvd24uIERlZmF1bHRzIHRvIDE1MG1zLlxuIyAgICAgICAgY2xhc3NOYW1lOiBDdXN0b20gQ1NTIGNsYXNzIGZvciB0aGUgdG9vbHRpcC5cbiMgICAgICAgIHBvc2l0aW9uOiBEZXRlcm1pbmVzIHRoZSB0b29sdGlwJ3MgcG9zaXRpb24gcmVsYXRpdmUgdG8gaXRzIHBhcmVudC5cbiMgICAgICAgICAgICAgICAgICBDYW4gYmUgYGxlZnRgIG9yIGByaWdodGAuXG4jXG4jIC5zaG93KClcbiMgICAgIFNob3cgdGhlIHRvb2x0aXAuXG4jXG4jIC5oaWRlKClcbiMgICAgIEhpZGUgdGhlIHRvb2x0aXAuXG4jXG4jIC5kZXN0cm95KClcbiMgICAgIERlc3Ryb3kgdGhlIHRvb2x0aXAuXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRvb2x0aXBcbiAgY29uc3RydWN0b3I6IChAcGFyZW50LCBjb250ZW50LCB7QGNvbmQsIEBzaG93RGVsYXksIEBoaWRlRGVsYXksIEBjbGFzc05hbWUsIEBwb3NpdGlvbn09e30pIC0+XG4gICAgQGNvbmQgID0gKC0+IHRydWUpICB1bmxlc3MgQGNvbmQ/XG4gICAgQHNob3dEZWxheSA9IDE1MCAgICB1bmxlc3MgQHNob3dEZWxheT9cbiAgICBAaGlkZURlbGF5ID0gMTUwICAgIHVubGVzcyBAaGlkZURlbGF5P1xuICAgIEBwb3NpdGlvbiAgPSAnbGVmdCcgdW5sZXNzIEBwb3NpdGlvbj9cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICBAdmlldyA9IEB0b29sdGlwVmlldyBjb250ZW50XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAdmlld1xuXG4gICAgIyByZW1lbWJlciBvbGQgbW91c2UgbGlzdGVuZXJzXG4gICAgQG9sZE9uTW91c2VPdmVyID0gQHBhcmVudC5vbm1vdXNlb3ZlclxuICAgIEBvbGRPbk1vdXNlT3V0ID0gQHBhcmVudC5vbm1vdXNlb3V0XG5cbiAgICBAc2hvd09uSG92ZXIoKVxuICAgIHRoaXNcblxuICBvbkRpZFNob3c6IChmKSAtPlxuICAgIEBlbWl0dGVyLm9uKCdkaWRTaG93JywgZilcblxuICBvbkRpZEhpZGU6IChmKSAtPlxuICAgIEBlbWl0dGVyLm9uKCdkaWRIaWRlJywgZilcblxuICBoaWRlXzogLT5cbiAgICBAdmlldy5jbGFzc0xpc3QuYWRkICdkb250c2hvdydcbiAgICBAdmlldy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgaGlkZTogLT5cbiAgICBAdmlldy5jbGFzc0xpc3QuYWRkICdkb250c2hvdydcbiAgICBAZW1pdHRlci5lbWl0ICdkaWRIaWRlJ1xuICAgIHNldFRpbWVvdXQgKD0+IEBoaWRlXygpKSwgMTAwXG5cbiAgc2hvdzogLT5cbiAgICBAdmlldy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZFNob3cnXG4gICAgc2V0VGltZW91dCAoID0+XG4gICAgICBAcG9zaXRpb25PdmVybGF5KClcbiAgICAgIEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUgJ2RvbnRzaG93JyksIDIwXG5cbiAgZGVzdHJveTogLT5cbiAgICBpZiBkb2N1bWVudC5ib2R5LmNvbnRhaW5zIEB2aWV3XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkIEB2aWV3XG4gICAgQHBhcmVudC5vbm1vdXNlb3ZlciA9IEBvbGRPbk1vdXNlT3ZlclxuICAgIEBwYXJlbnQub25tb3VzZW91dCA9IEBvbGRPbk1vdXNlT3V0XG5cbiAgdG9vbHRpcFZpZXc6IChjb250ZW50KSAtPlxuICAgIHR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIHR0LmNsYXNzTGlzdC5hZGQgJ2luay10b29sdGlwJywgJ2RvbnRzaG93J1xuICAgIGlmIEBjbGFzIHRoZW4gdHQuY2xhc3NMaXN0LmFkZCBAY2xhc3NOYW1lXG4gICAgdHQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIGlmIGNvbnRlbnQgdGhlbiB0dC5hcHBlbmRDaGlsZCBjb250ZW50XG4gICAgdHRcblxuICBzaG93T25Ib3ZlcjogLT5cbiAgICBoaWRlVGltZXIgPSBudWxsXG4gICAgc2hvd1RpbWVyID0gbnVsbFxuICAgIEBwYXJlbnQub25tb3VzZW92ZXIgPSA9PlxuICAgICAgY2xlYXJUaW1lb3V0IGhpZGVUaW1lclxuICAgICAgaWYgQGNvbmQoKSB0aGVuIHNob3dUaW1lciA9IHNldFRpbWVvdXQgKD0+IEBzaG93KCkpLCBAc2hvd0RlbGF5XG4gICAgQHBhcmVudC5vbm1vdXNlb3V0ID0gPT5cbiAgICAgIGNsZWFyVGltZW91dCBzaG93VGltZXJcbiAgICAgIGhpZGVUaW1lciA9IHNldFRpbWVvdXQgKD0+IEBoaWRlKCkpLCBAaGlkZURlbGF5XG4gICAgQHZpZXcub25tb3VzZW92ZXIgID0gPT5cbiAgICAgIGNsZWFyVGltZW91dCBoaWRlVGltZXJcbiAgICBAdmlldy5vbm1vdXNlb3V0ICAgPSA9PlxuICAgICAgaGlkZVRpbWVyID0gc2V0VGltZW91dCAoPT4gQGhpZGUoKSksIEBoaWRlRGVsYXlcblxuICBwb3NpdGlvbk92ZXJsYXk6IC0+XG4gICAgYm91bmRpbmcgPSBAcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgQHZpZXcuc3R5bGUuYm90dG9tID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIGJvdW5kaW5nLnRvcCArICdweCdcbiAgICBAdmlldy5zdHlsZS5sZWZ0ID0gc3dpdGNoIEBwb3NpdGlvblxuICAgICAgd2hlbiAnbGVmdCdcbiAgICAgICAgYm91bmRpbmcubGVmdCArICdweCdcbiAgICAgIHdoZW4gJ3JpZ2h0J1xuICAgICAgICBib3VuZGluZy5sZWZ0ICsgYm91bmRpbmcud2lkdGggLSBAdmlldy5vZmZzZXRXaWR0aCArICdweCdcbiJdfQ==
