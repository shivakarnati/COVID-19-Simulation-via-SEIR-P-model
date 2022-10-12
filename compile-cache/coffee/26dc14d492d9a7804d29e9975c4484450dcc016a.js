(function() {
  var Emitter, Stepper, StepperView, editorMatchesFile, focusEditorPane, getUntitledId, isUntitled, open, ref, span, views;

  StepperView = require('./stepper-view');

  views = require('../util/views');

  Emitter = require('atom').Emitter;

  focusEditorPane = require('../util/pane-item').focusEditorPane;

  span = views.tags.span;

  ref = require('../util/opener'), open = ref.open, isUntitled = ref.isUntitled, getUntitledId = ref.getUntitledId, editorMatchesFile = ref.editorMatchesFile;

  module.exports = Stepper = (function() {
    function Stepper(arg) {
      this.buttons = arg.buttons, this.pending = arg.pending;
      this.views = [];
      this.text = "Grand Steppin'";
      this.emitter = new Emitter();
      if (this.pending == null) {
        this.pending = true;
      }
      if (this.buttons == null) {
        this.buttons = [
          {
            icon: 'arrow-down'
          }, {
            icon: 'link-external'
          }, {
            icon: 'chevron-right'
          }
        ];
      }
    }

    Stepper.prototype.attach = function(ed) {
      var s;
      if (!ed) {
        return;
      }
      s = new StepperView(ed, this.line);
      this.views.push(s);
      ed.onDidDestroy((function(_this) {
        return function() {
          s.destroy();
          return _this.views = _this.views.filter(function(x) {
            return x !== s;
          });
        };
      })(this));
      return this.setViewText(s);
    };

    Stepper.prototype.setViewText = function(view) {
      view.clear();
      return view.appendChild(views.render(span('stepper-label', this.text)));
    };

    Stepper.prototype.setText = function(text1) {
      this.text = text1;
      return this.views.forEach((function(_this) {
        return function(view) {
          return _this.setViewText(view);
        };
      })(this));
    };

    Stepper.prototype.edForFile = function(file) {
      return atom.workspace.getTextEditors().filter(function(ed) {
        return editorMatchesFile(ed, file);
      })[0];
    };

    Stepper.prototype.activate = function(file, line) {
      var active;
      active = atom.workspace.getActiveTextEditor();
      if (editorMatchesFile(active, file)) {
        active.setCursorBufferPosition([line, 0]);
        return Promise.resolve();
      } else {
        focusEditorPane();
        return open(file, line, {
          pending: this.pending
        });
      }
    };

    Stepper.prototype.goto = function(file, line1) {
      this.line = line1;
      if (this.listener == null) {
        this.listener = atom.workspace.observeTextEditors((function(_this) {
          return function(ed) {
            if (editorMatchesFile(ed, file)) {
              return _this.attach(ed);
            }
          };
        })(this));
      }
      return this.activate(file, this.line).then((function(_this) {
        return function() {
          var i, len, ref1, results, view;
          if (file === _this.file) {
            ref1 = _this.views;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              view = ref1[i];
              results.push(view.goto(_this.line));
            }
            return results;
          } else {
            _this.file = file;
            _this.detach();
            _this.attach(_this.edForFile(file));
            return _this.setText(_this.text);
          }
        };
      })(this));
    };

    Stepper.prototype.step = function(file, line, text, info) {
      this.goto(file, line);
      this.setText(text);
      return this.emitter.emit('step', {
        file: file,
        line: line,
        text: text.cloneNode(true),
        info: info
      });
    };

    Stepper.prototype.onStep = function(f) {
      return this.emitter.on('step', f);
    };

    Stepper.prototype.detach = function() {
      var i, len, ref1, view;
      ref1 = this.views;
      for (i = 0, len = ref1.length; i < len; i++) {
        view = ref1[i];
        view.destroy();
      }
      return this.views = [];
    };

    Stepper.prototype.destroy = function() {
      var ref1;
      this.detach();
      if ((ref1 = this.listener) != null) {
        ref1.dispose();
      }
      delete this.listener;
      delete this.file;
      return delete this.line;
    };

    return Stepper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2RlYnVnZ2VyL3N0ZXBwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUVkLEtBQUEsR0FBUSxPQUFBLENBQVEsZUFBUjs7RUFDUCxVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUNYLGtCQUFtQixPQUFBLENBQVEsbUJBQVI7O0VBQ25CLE9BQVEsS0FBSyxDQUFDOztFQUNmLE1BQXVELE9BQUEsQ0FBUSxnQkFBUixDQUF2RCxFQUFDLGVBQUQsRUFBTywyQkFBUCxFQUFtQixpQ0FBbkIsRUFBa0M7O0VBRWxDLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxpQkFBQyxHQUFEO01BQUUsSUFBQyxDQUFBLGNBQUEsU0FBUyxJQUFDLENBQUEsY0FBQTtNQUN4QixJQUFDLENBQUEsS0FBRCxHQUFTO01BRVQsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxPQUFKLENBQUE7O1FBQ1gsSUFBQyxDQUFBLFVBQVc7OztRQUNaLElBQUMsQ0FBQSxVQUFXO1VBQ1Y7WUFBQyxJQUFBLEVBQU0sWUFBUDtXQURVLEVBRVY7WUFBQyxJQUFBLEVBQU0sZUFBUDtXQUZVLEVBR1Y7WUFBQyxJQUFBLEVBQU0sZUFBUDtXQUhVOzs7SUFORDs7c0JBWWIsTUFBQSxHQUFRLFNBQUMsRUFBRDtBQUNOLFVBQUE7TUFBQSxJQUFBLENBQWMsRUFBZDtBQUFBLGVBQUE7O01BQ0EsQ0FBQSxHQUFJLElBQUksV0FBSixDQUFnQixFQUFoQixFQUFvQixJQUFDLENBQUEsSUFBckI7TUFHSixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxDQUFaO01BRUEsRUFBRSxDQUFDLFlBQUgs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QSxJQUFELENBQU0sSUFBTixFQUFZLElBQVo7TUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkLEVBQXNCO1FBQUMsTUFBQSxJQUFEO1FBQU8sTUFBQSxJQUFQO1FBQWEsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFuQjtRQUF5QyxNQUFBLElBQXpDO09BQXRCO0lBSEk7O3NCQUtOLE1BQUEsR0FBUSxTQUFDLENBQUQ7YUFDTixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxNQUFaLEVBQW9CLENBQXBCO0lBRE07O3NCQUdSLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7UUFBQSxJQUFJLENBQUMsT0FBTCxDQUFBO0FBQUE7YUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBSEg7O3NCQU1SLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUMsQ0FBQSxNQUFELENBQUE7O1lBQ1MsQ0FBRSxPQUFYLENBQUE7O01BQ0EsT0FBTyxJQUFDLENBQUE7TUFDUixPQUFPLElBQUMsQ0FBQTthQUNSLE9BQU8sSUFBQyxDQUFBO0lBTEQ7Ozs7O0FBckZYIiwic291cmNlc0NvbnRlbnQiOlsiU3RlcHBlclZpZXcgPSByZXF1aXJlICcuL3N0ZXBwZXItdmlldydcbiMge0RlYnVnZ2VyVG9vbGJhcn0gPSByZXF1aXJlKCcuL3Rvb2xiYXInKVxudmlld3MgPSByZXF1aXJlICcuLi91dGlsL3ZpZXdzJ1xue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntmb2N1c0VkaXRvclBhbmV9ID0gcmVxdWlyZSAnLi4vdXRpbC9wYW5lLWl0ZW0nXG57c3Bhbn0gPSB2aWV3cy50YWdzXG57b3BlbiwgaXNVbnRpdGxlZCwgZ2V0VW50aXRsZWRJZCwgZWRpdG9yTWF0Y2hlc0ZpbGV9ID0gcmVxdWlyZSAnLi4vdXRpbC9vcGVuZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0ZXBwZXJcbiAgY29uc3RydWN0b3I6ICh7QGJ1dHRvbnMsIEBwZW5kaW5nfSkgLT5cbiAgICBAdmlld3MgPSBbXVxuICAgICMgQGJhcnMgPSBbXVxuICAgIEB0ZXh0ID0gXCJHcmFuZCBTdGVwcGluJ1wiXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgQHBlbmRpbmcgPz0gdHJ1ZVxuICAgIEBidXR0b25zID89IFtcbiAgICAgIHtpY29uOiAnYXJyb3ctZG93bid9XG4gICAgICB7aWNvbjogJ2xpbmstZXh0ZXJuYWwnfVxuICAgICAge2ljb246ICdjaGV2cm9uLXJpZ2h0J31cbiAgICBdXG5cbiAgYXR0YWNoOiAoZWQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZFxuICAgIHMgPSBuZXcgU3RlcHBlclZpZXcgZWQsIEBsaW5lXG4gICAgIyB0b29sYmFyID0gbmV3IERlYnVnZ2VyVG9vbGJhcihAYnV0dG9ucylcbiAgICAjIHRvb2xiYXIuYXR0YWNoKGVkKVxuICAgIEB2aWV3cy5wdXNoIHNcbiAgICAjIEBiYXJzLnB1c2ggdG9vbGJhclxuICAgIGVkLm9uRGlkRGVzdHJveSA9PlxuICAgICAgcy5kZXN0cm95KClcbiAgICAgICMgdG9vbGJhci5kZXN0cm95KClcbiAgICAgIEB2aWV3cyA9IEB2aWV3cy5maWx0ZXIoKHgpID0+IHggIT0gcylcbiAgICAgICMgQGJhcnMgPSBAYmFycy5maWx0ZXIoKHgpID0+IHggIT0gcylcbiAgICBAc2V0Vmlld1RleHQgc1xuXG4gIHNldFZpZXdUZXh0OiAodmlldykgLT5cbiAgICB2aWV3LmNsZWFyKClcbiAgICB2aWV3LmFwcGVuZENoaWxkIHZpZXdzLnJlbmRlciBzcGFuICdzdGVwcGVyLWxhYmVsJywgQHRleHRcbiAgICAjIHZpZXcuYXBwZW5kQ2hpbGQgdmlldy5idXR0b25Hcm91cCBAYnV0dG9uc1xuXG4gIHNldFRleHQ6IChAdGV4dCkgLT5cbiAgICBAdmlld3MuZm9yRWFjaCAodmlldykgPT4gQHNldFZpZXdUZXh0KHZpZXcpXG5cbiAgZWRGb3JGaWxlOiAoZmlsZSkgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICAuZmlsdGVyKChlZCkgLT4gZWRpdG9yTWF0Y2hlc0ZpbGUoZWQsIGZpbGUpKVswXVxuXG4gIGFjdGl2YXRlOiAoZmlsZSwgbGluZSkgLT5cbiAgICBhY3RpdmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBlZGl0b3JNYXRjaGVzRmlsZShhY3RpdmUsIGZpbGUpXG4gICAgICBhY3RpdmUuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW2xpbmUsIDBdXG4gICAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgIGVsc2VcbiAgICAgIGZvY3VzRWRpdG9yUGFuZSgpXG4gICAgICBvcGVuKGZpbGUsIGxpbmUsIHtwZW5kaW5nOiBAcGVuZGluZ30pXG5cbiAgZ290bzogKGZpbGUsIEBsaW5lKSAtPlxuICAgIEBsaXN0ZW5lciA/PSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkKSA9PlxuICAgICAgaWYgZWRpdG9yTWF0Y2hlc0ZpbGUoZWQsIGZpbGUpXG4gICAgICAgIEBhdHRhY2goZWQpXG5cbiAgICBAYWN0aXZhdGUoZmlsZSwgQGxpbmUpLnRoZW4gPT5cbiAgICAgIGlmIGZpbGUgPT0gQGZpbGVcbiAgICAgICAgdmlldy5nb3RvIEBsaW5lIGZvciB2aWV3IGluIEB2aWV3c1xuICAgICAgZWxzZVxuICAgICAgICBAZmlsZSA9IGZpbGVcbiAgICAgICAgQGRldGFjaCgpXG4gICAgICAgIEBhdHRhY2goQGVkRm9yRmlsZShmaWxlKSlcbiAgICAgICAgQHNldFRleHQgQHRleHRcblxuICBzdGVwOiAoZmlsZSwgbGluZSwgdGV4dCwgaW5mbykgLT5cbiAgICBAZ290byhmaWxlLCBsaW5lKVxuICAgIEBzZXRUZXh0KHRleHQpXG4gICAgQGVtaXR0ZXIuZW1pdCgnc3RlcCcsIHtmaWxlLCBsaW5lLCB0ZXh0OiB0ZXh0LmNsb25lTm9kZSh0cnVlKSwgaW5mb30pXG5cbiAgb25TdGVwOiAoZikgLT5cbiAgICBAZW1pdHRlci5vbignc3RlcCcsIGYpXG5cbiAgZGV0YWNoOiAtPlxuICAgIHZpZXcuZGVzdHJveSgpIGZvciB2aWV3IGluIEB2aWV3c1xuICAgICMgYmFyLmRlc3Ryb3koKSBmb3IgYmFyIGluIEBiYXJzXG4gICAgQHZpZXdzID0gW11cbiAgICAjIEBiYXJzID0gW11cblxuICBkZXN0cm95OiAtPlxuICAgIEBkZXRhY2goKVxuICAgIEBsaXN0ZW5lcj8uZGlzcG9zZSgpXG4gICAgZGVsZXRlIEBsaXN0ZW5lclxuICAgIGRlbGV0ZSBAZmlsZVxuICAgIGRlbGV0ZSBAbGluZVxuIl19
