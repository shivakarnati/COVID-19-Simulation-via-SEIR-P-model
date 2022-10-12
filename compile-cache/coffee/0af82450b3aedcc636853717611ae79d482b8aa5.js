(function() {
  var CompositeDisposable, MIN_RESULT_WIDTH, RESULT_OFFSET, StepperView;

  CompositeDisposable = require('atom').CompositeDisposable;

  MIN_RESULT_WIDTH = 30;

  RESULT_OFFSET = 20;

  module.exports = StepperView = (function() {
    StepperView.prototype.createView = function() {
      this.disposables = new CompositeDisposable;
      this.view = document.createElement('div');
      this.view.classList.add('ink', 'stepper');
      this.view.addEventListener('click', (function(_this) {
        return function() {
          return _this.view.parentNode.parentNode.appendChild(_this.view.parentNode);
        };
      })(this));
      return this.onReady(this.editor, (function(_this) {
        return function() {
          return _this.disposables.add(atom.config.observe('editor.lineHeight', function(h) {
            return _this.view.style.top = -h + 'em';
          }));
        };
      })(this));
    };

    StepperView.prototype.buttonView = function(arg) {
      var btn, command, icon, text, tooltip;
      icon = arg.icon, text = arg.text, tooltip = arg.tooltip, command = arg.command;
      btn = document.createElement('button');
      btn.classList.add('btn', 'btn-primary');
      if (text != null) {
        btn.innerText = text;
      }
      if (icon != null) {
        btn.classList.add("icon-" + icon);
      }
      btn.onclick = (function(_this) {
        return function() {
          return atom.commands.dispatch(atom.views.getView(_this.editor), command);
        };
      })(this);
      return btn;
    };

    StepperView.prototype.buttonGroup = function(buttons) {
      var grp;
      grp = document.createElement('div');
      grp.classList.add('btn-group', 'btn-group-xs');
      buttons.forEach((function(_this) {
        return function(b) {
          return grp.appendChild(_this.buttonView(b));
        };
      })(this));
      this.disposables.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function(h) {
          return grp.style.maxHeight = h + 'em';
        };
      })(this)));
      return grp;
    };

    StepperView.prototype.appendChild = function(c) {
      return this.view.appendChild(c);
    };

    StepperView.prototype.clear = function() {
      var results;
      results = [];
      while (this.view.firstChild != null) {
        results.push(this.view.removeChild(this.view.firstChild));
      }
      return results;
    };

    StepperView.prototype.edAndTab = function(ed) {
      var edView, tabs, workspace;
      edView = atom.views.getView(ed);
      workspace = atom.views.getView(atom.workspace);
      tabs = workspace.querySelectorAll(".pane > .tab-bar > .tab");
      tabs = [].filter.call(tabs, function(tab) {
        return (tab != null ? tab.item : void 0) === ed;
      });
      if (!(tabs.length <= 1)) {
        error("assertion: more than one tab");
      }
      return [edView, tabs[0]];
    };

    StepperView.prototype.onReady = function(ed, f) {
      return setTimeout(f, 0);
    };

    StepperView.prototype.addClass = function(ed) {
      return this.onReady(ed, (function(_this) {
        return function() {
          var i, len, ref, ref1, results, tab, x;
          ref = _this.edAndTab(ed), ed = ref[0], tab = ref[1];
          ref1 = [ed, tab];
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            x = ref1[i];
            results.push(x != null ? x.classList.toggle('debug') : void 0);
          }
          return results;
        };
      })(this));
    };

    StepperView.prototype.rmClass = function(ed) {
      var i, len, ref, ref1, results, tab, x;
      ref = this.edAndTab(ed), ed = ref[0], tab = ref[1];
      ref1 = [ed, tab];
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        x = ref1[i];
        results.push(x != null ? x.classList.toggle('debug') : void 0);
      }
      return results;
    };

    StepperView.prototype.attach = function() {
      this.marker = this.editor.markBufferPosition([this.line, 2e308]);
      this.editor.decorateMarker(this.marker, {
        type: 'overlay',
        item: this.view,
        "class": 'ink-overlay',
        avoidOverflow: false
      });
      this.widthListener = (function(_this) {
        return function() {
          var ed, edRect, ref, thisLeft, w;
          ed = atom.views.getView(_this.editor);
          if (ed == null) {
            return;
          }
          if (((ref = _this.view) != null ? ref.parentElement : void 0) != null) {
            edRect = ed.getBoundingClientRect();
            thisLeft = parseInt(_this.view.parentElement.style.left);
            w = edRect.right - RESULT_OFFSET - 10 - thisLeft;
            if (w < MIN_RESULT_WIDTH) {
              w = MIN_RESULT_WIDTH;
            }
            if (edRect.width > 0 && thisLeft + RESULT_OFFSET + w > edRect.right) {
              _this.view.style.left = (edRect.right - w - 10 - thisLeft) + 'px';
              _this.view.style.opacity = 0.75;
            } else {
              _this.view.style.left = RESULT_OFFSET + 'px';
              _this.view.style.opacity = 1.0;
            }
            _this.view.parentElement.style.maxWidth = (window.innerWidth - RESULT_OFFSET - 10 - _this.left) + 'px';
            _this.view.style.maxWidth = w + 'px';
          }
          return setTimeout((function() {
            return process.nextTick(function() {
              return window.requestAnimationFrame(_this.widthListener);
            });
          }), 300);
        };
      })(this);
      window.requestAnimationFrame(this.widthListener);
      this.editor.gutterWithName('line-number').decorateMarker(this.marker, {
        type: 'line-number',
        "class": 'ink-stepper-line-gutter'
      });
      return this.editor.decorateMarker(this.marker, {
        type: 'line',
        "class": 'ink-stepper-line'
      });
    };

    function StepperView(editor, line1) {
      this.editor = editor;
      this.line = line1;
      this.createView();
      this.addClass(this.editor);
      this.fadeIn();
      this.attach();
    }

    StepperView.prototype.fadeIn = function() {
      this.view.classList.add('ink-hide');
      return setTimeout(((function(_this) {
        return function() {
          return _this.view.classList.remove('ink-hide');
        };
      })(this)), 20);
    };

    StepperView.prototype.fadeOut = function(f) {
      this.view.classList.add('ink-hide');
      return setTimeout(f, 200);
    };

    StepperView.prototype.animate = function(f) {
      var ref;
      clearTimeout(this.at);
      if ((ref = this.view.parentElement) != null) {
        ref.style.transition = 'all 0.3s';
      }
      this.at = setTimeout(((function(_this) {
        return function() {
          var ref1;
          return (ref1 = _this.view.parentElement) != null ? ref1.style.transition = '' : void 0;
        };
      })(this)), 300);
      return setTimeout(f, 0);
    };

    StepperView.prototype.goto = function(line) {
      return this.animate((function(_this) {
        return function() {
          return _this.marker.setHeadBufferPosition([line, 2e308]);
        };
      })(this));
    };

    StepperView.prototype.destroy = function() {
      this.destroyed = true;
      this.widthListener = (function(_this) {
        return function() {};
      })(this);
      this.disposables.dispose();
      this.rmClass(this.editor);
      return this.fadeOut((function(_this) {
        return function() {
          return _this.marker.destroy();
        };
      })(this));
    };

    return StepperView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2RlYnVnZ2VyL3N0ZXBwZXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsZ0JBQUEsR0FBbUI7O0VBQ25CLGFBQUEsR0FBZ0I7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007MEJBRUosVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCO01BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUF1QixPQUF2QixFQUFnQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzlCLEtBQUMsQ0FBQSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUE1QixDQUF3QyxLQUFDLENBQUEsSUFBSSxDQUFDLFVBQTlDO1FBRDhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQzthQUVBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLE1BQVYsRUFBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNoQixLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1CQUFwQixFQUF5QyxTQUFDLENBQUQ7bUJBQ3hELEtBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVosR0FBa0IsQ0FBQyxDQUFELEdBQUs7VUFEaUMsQ0FBekMsQ0FBakI7UUFEZ0I7TUFB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QUFXLENBQUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQUcsY0FBQTtpRUFBbUIsQ0FBRSxLQUFLLENBQUMsVUFBM0IsR0FBd0M7UUFBM0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQsQ0FBWCxFQUE0RCxHQUE1RDthQUNOLFVBQUEsQ0FBVyxDQUFYLEVBQWMsQ0FBZDtJQUpPOzswQkFNVCxJQUFBLEdBQU0sU0FBQyxJQUFEO2FBQ0osSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUE4QixDQUFDLElBQUQsRUFBTyxLQUFQLENBQTlCO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFESTs7MEJBR04sT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsU0FBRCxHQUFhO01BQ2IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBLEdBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BQ2pCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsTUFBVjthQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNQLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO1FBRE87TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFMTzs7Ozs7QUExSFgiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5NSU5fUkVTVUxUX1dJRFRIID0gMzBcblJFU1VMVF9PRkZTRVQgPSAyMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdGVwcGVyVmlld1xuXG4gIGNyZWF0ZVZpZXc6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBAdmlldy5jbGFzc0xpc3QuYWRkICdpbmsnLCAnc3RlcHBlcidcbiAgICAjIGNsaWNraW5nIG9uIGl0IHdpbGwgYnJpbmcgdGhlIGN1cnJlbnQgdmlldyB0byB0aGUgdG9wIG9mIHRoZSBzdGFja1xuICAgIEB2aWV3LmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgPT5cbiAgICAgIEB2aWV3LnBhcmVudE5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCBAdmlldy5wYXJlbnROb2RlXG4gICAgQG9uUmVhZHkgQGVkaXRvciwgPT5cbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnZWRpdG9yLmxpbmVIZWlnaHQnLCAoaCkgPT5cbiAgICAgICAgQHZpZXcuc3R5bGUudG9wID0gLWggKyAnZW0nO1xuXG4gIGJ1dHRvblZpZXc6ICh7aWNvbiwgdGV4dCwgdG9vbHRpcCwgY29tbWFuZH0pIC0+XG4gICAgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYnV0dG9uJ1xuICAgIGJ0bi5jbGFzc0xpc3QuYWRkICdidG4nLCAnYnRuLXByaW1hcnknXG4gICAgaWYgdGV4dD8gdGhlbiBidG4uaW5uZXJUZXh0ID0gdGV4dFxuICAgIGlmIGljb24/IHRoZW4gYnRuLmNsYXNzTGlzdC5hZGQgXCJpY29uLSN7aWNvbn1cIlxuICAgIGJ0bi5vbmNsaWNrID0gPT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYXRvbS52aWV3cy5nZXRWaWV3KEBlZGl0b3IpLCBjb21tYW5kXG4gICAgYnRuXG5cbiAgYnV0dG9uR3JvdXA6IChidXR0b25zKSAtPlxuICAgIGdycCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBncnAuY2xhc3NMaXN0LmFkZCAnYnRuLWdyb3VwJywgJ2J0bi1ncm91cC14cydcbiAgICBidXR0b25zLmZvckVhY2ggKGIpID0+IGdycC5hcHBlbmRDaGlsZCBAYnV0dG9uVmlldyBiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdlZGl0b3IubGluZUhlaWdodCcsIChoKSA9PlxuICAgICAgZ3JwLnN0eWxlLm1heEhlaWdodCA9IGggKyAnZW0nO1xuICAgIGdycFxuXG4gIGFwcGVuZENoaWxkOiAoYykgLT4gQHZpZXcuYXBwZW5kQ2hpbGQgY1xuXG4gIGNsZWFyOiAtPlxuICAgIHdoaWxlIEB2aWV3LmZpcnN0Q2hpbGQ/XG4gICAgICBAdmlldy5yZW1vdmVDaGlsZCBAdmlldy5maXJzdENoaWxkXG5cbiAgZWRBbmRUYWI6IChlZCkgLT5cbiAgICBlZFZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgZWRcbiAgICB3b3Jrc3BhY2UgPSBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2VcbiAgICB0YWJzID0gd29ya3NwYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFuZSA+IC50YWItYmFyID4gLnRhYlwiKVxuICAgIHRhYnMgPSBbXS5maWx0ZXIuY2FsbCB0YWJzLCAodGFiKSAtPiB0YWI/Lml0ZW0gaXMgZWRcbiAgICBlcnJvcihcImFzc2VydGlvbjogbW9yZSB0aGFuIG9uZSB0YWJcIikgdW5sZXNzIHRhYnMubGVuZ3RoIDw9IDFcbiAgICBbZWRWaWV3LCB0YWJzWzBdXVxuXG4gIG9uUmVhZHk6IChlZCwgZikgLT5cbiAgICBzZXRUaW1lb3V0IGYsIDBcblxuICBhZGRDbGFzczogKGVkKSAtPlxuICAgIEBvblJlYWR5IGVkLCA9PlxuICAgICAgW2VkLCB0YWJdID0gQGVkQW5kVGFiIGVkXG4gICAgICB4Py5jbGFzc0xpc3QudG9nZ2xlKCdkZWJ1ZycpIGZvciB4IGluIFtlZCwgdGFiXVxuXG4gIHJtQ2xhc3M6IChlZCkgLT5cbiAgICBbZWQsIHRhYl0gPSBAZWRBbmRUYWIgZWRcbiAgICB4Py5jbGFzc0xpc3QudG9nZ2xlKCdkZWJ1ZycpIGZvciB4IGluIFtlZCwgdGFiXVxuXG4gIGF0dGFjaDogLT5cbiAgICBAbWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUG9zaXRpb24gW0BsaW5lLCBJbmZpbml0eV1cbiAgICBAZWRpdG9yLmRlY29yYXRlTWFya2VyIEBtYXJrZXIsXG4gICAgICB0eXBlOiAnb3ZlcmxheSdcbiAgICAgIGl0ZW06IEB2aWV3XG4gICAgICBjbGFzczogJ2luay1vdmVybGF5J1xuICAgICAgYXZvaWRPdmVyZmxvdzogZmFsc2VcbiAgICBAd2lkdGhMaXN0ZW5lciA9ICgpID0+XG4gICAgICBlZCA9IGF0b20udmlld3MuZ2V0VmlldyhAZWRpdG9yKVxuICAgICAgcmV0dXJuIHVubGVzcyBlZD9cbiAgICAgIGlmIEB2aWV3Py5wYXJlbnRFbGVtZW50P1xuICAgICAgICBlZFJlY3QgPSBlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICB0aGlzTGVmdCA9IHBhcnNlSW50KEB2aWV3LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdClcbiAgICAgICAgdyA9IGVkUmVjdC5yaWdodCAtIFJFU1VMVF9PRkZTRVQgLSAxMCAtIHRoaXNMZWZ0XG4gICAgICAgIGlmIHcgPCBNSU5fUkVTVUxUX1dJRFRIXG4gICAgICAgICAgdyA9IE1JTl9SRVNVTFRfV0lEVEhcbiAgICAgICAgaWYgZWRSZWN0LndpZHRoID4gMCAmJiB0aGlzTGVmdCArIFJFU1VMVF9PRkZTRVQgKyB3ID4gZWRSZWN0LnJpZ2h0XG4gICAgICAgICAgQHZpZXcuc3R5bGUubGVmdCA9IChlZFJlY3QucmlnaHQgLSB3IC0gMTAgLSB0aGlzTGVmdCkgKyAncHgnXG4gICAgICAgICAgQHZpZXcuc3R5bGUub3BhY2l0eSA9IDAuNzVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEB2aWV3LnN0eWxlLmxlZnQgPSBSRVNVTFRfT0ZGU0VUICsgJ3B4J1xuICAgICAgICAgIEB2aWV3LnN0eWxlLm9wYWNpdHkgPSAxLjBcblxuICAgICAgICBAdmlldy5wYXJlbnRFbGVtZW50LnN0eWxlLm1heFdpZHRoID0gKHdpbmRvdy5pbm5lcldpZHRoIC0gUkVTVUxUX09GRlNFVCAtIDEwIC0gdGhpcy5sZWZ0KSArICdweCdcbiAgICAgICAgQHZpZXcuc3R5bGUubWF4V2lkdGggPSB3ICsgJ3B4J1xuICAgICAgc2V0VGltZW91dCgoKCkgPT4gcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEB3aWR0aExpc3RlbmVyKSkpLCAzMDApXG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEB3aWR0aExpc3RlbmVyKVxuXG4gICAgQGVkaXRvci5ndXR0ZXJXaXRoTmFtZSgnbGluZS1udW1iZXInKS5kZWNvcmF0ZU1hcmtlciBAbWFya2VyLFxuICAgICAgdHlwZTogJ2xpbmUtbnVtYmVyJ1xuICAgICAgY2xhc3M6ICdpbmstc3RlcHBlci1saW5lLWd1dHRlcidcblxuICAgIEBlZGl0b3IuZGVjb3JhdGVNYXJrZXIgQG1hcmtlcixcbiAgICAgIHR5cGU6ICdsaW5lJ1xuICAgICAgY2xhc3M6ICdpbmstc3RlcHBlci1saW5lJ1xuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQGxpbmUpIC0+XG4gICAgQGNyZWF0ZVZpZXcoKVxuICAgIEBhZGRDbGFzcyBAZWRpdG9yXG4gICAgQGZhZGVJbigpXG4gICAgQGF0dGFjaCgpXG5cbiAgZmFkZUluOiAtPlxuICAgIEB2aWV3LmNsYXNzTGlzdC5hZGQgJ2luay1oaWRlJ1xuICAgIHNldFRpbWVvdXQgKD0+IEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUgJ2luay1oaWRlJyksIDIwXG5cbiAgZmFkZU91dDogKGYpIC0+XG4gICAgQHZpZXcuY2xhc3NMaXN0LmFkZCAnaW5rLWhpZGUnXG4gICAgc2V0VGltZW91dCBmLCAyMDBcblxuICBhbmltYXRlOiAoZikgLT5cbiAgICBjbGVhclRpbWVvdXQgQGF0XG4gICAgQHZpZXcucGFyZW50RWxlbWVudD8uc3R5bGUudHJhbnNpdGlvbiA9ICdhbGwgMC4zcydcbiAgICBAYXQgPSBzZXRUaW1lb3V0ICg9PiBAdmlldy5wYXJlbnRFbGVtZW50Py5zdHlsZS50cmFuc2l0aW9uID0gJycpLCAzMDBcbiAgICBzZXRUaW1lb3V0IGYsIDBcblxuICBnb3RvOiAobGluZSkgLT5cbiAgICBAYW5pbWF0ZSA9PiBAbWFya2VyLnNldEhlYWRCdWZmZXJQb3NpdGlvbiBbbGluZSwgSW5maW5pdHldXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGVzdHJveWVkID0gdHJ1ZVxuICAgIEB3aWR0aExpc3RlbmVyID0gKCkgPT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQHJtQ2xhc3MgQGVkaXRvclxuICAgIEBmYWRlT3V0ID0+XG4gICAgICBAbWFya2VyLmRlc3Ryb3koKVxuIl19
