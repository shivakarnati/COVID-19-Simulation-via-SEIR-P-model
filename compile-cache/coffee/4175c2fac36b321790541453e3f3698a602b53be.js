(function() {
  var CompositeDisposable, InlineDoc;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = InlineDoc = (function() {
    function InlineDoc(editor, range, opts) {
      this.editor = editor;
      if (opts == null) {
        opts = {};
      }
      this.disposables = new CompositeDisposable;
      InlineDoc.removeRangeRows(this.editor, range);
      this.createView(opts);
      this.initMarker(range, opts);
    }

    InlineDoc.prototype.remove = function() {
      this.marker.destroy();
      return this.disposables.dispose();
    };

    InlineDoc.prototype.createView = function(arg) {
      var content;
      content = arg.content;
      this.view = document.createElement('div');
      this.view.classList.add('ink', 'docs', 'under');
      this.view.setAttribute('tabindex', '-1');
      this.view.style.pointerEvents = 'auto';
      this.disposables.add(atom.commands.add(this.view, {
        'inline-docs:clear': (function(_this) {
          return function(e) {
            return _this.remove();
          };
        })(this)
      }));
      if (content != null) {
        return this.view.appendChild(content);
      }
    };

    InlineDoc.prototype.initMarker = function(range, arg) {
      var highlight;
      highlight = arg.highlight;
      this.marker = this.editor.markBufferRange(range, {
        persistent: false,
        invalidate: 'touch'
      });
      this.marker.model = this;
      this.editor.decorateMarker(this.marker, {
        item: this.view,
        type: 'block',
        position: 'after'
      });
      if (highlight) {
        this.editor.decorateMarker(this.marker, {
          type: 'highlight',
          "class": 'doc-highlight'
        });
      }
      return this.disposables.add(this.marker.onDidChange((function(_this) {
        return function(e) {
          return _this.checkMarker(e);
        };
      })(this)));
    };

    InlineDoc.prototype.checkMarker = function(e) {
      if (!e.isValid || this.marker.getBufferRange().isEmpty() || e.textChanged) {
        return this.remove();
      }
    };

    InlineDoc.removeRangeRows = function(ed, range) {
      return this.removeLines(ed, range.start.row, range.end.row);
    };

    InlineDoc.removeLines = function(ed, start, end) {
      var ms;
      ms = ed.findMarkers().filter(function(x) {
        return (x.model != null) && x.model instanceof InlineDoc && x.getBufferRange().intersectsRowRange(start, end);
      }).map(function(x) {
        return x.model.remove();
      });
      return ms.length > 0;
    };

    InlineDoc.removeCurrent = function(e) {
      var done, ed, i, len, ref, sel;
      if ((ed = atom.workspace.getActiveTextEditor())) {
        ref = ed.getSelections();
        for (i = 0, len = ref.length; i < len; i++) {
          sel = ref[i];
          if (this.removeLines(ed, sel.getHeadBufferPosition().row, sel.getTailBufferPosition().row)) {
            done = true;
          }
        }
      }
      if (!done) {
        return e.abortKeyBinding();
      }
    };

    InlineDoc.activate = function() {
      this.subs = new CompositeDisposable;
      return this.subs.add(atom.commands.add('atom-text-editor:not([mini])', {
        'inline:clear-current': (function(_this) {
          return function(e) {
            return _this.removeCurrent(e);
          };
        })(this)
      }));
    };

    InlineDoc.deactivate = function() {
      return this.subs.dispose();
    };

    return InlineDoc;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2VkaXRvci9kb2NzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsbUJBQUMsTUFBRCxFQUFVLEtBQVYsRUFBaUIsSUFBakI7TUFBQyxJQUFDLENBQUEsU0FBRDs7UUFBZ0IsT0FBSzs7TUFDakMsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLFNBQVMsQ0FBQyxlQUFWLENBQTBCLElBQUMsQ0FBQSxNQUEzQixFQUFtQyxLQUFuQztNQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtNQUNBLElBQUMsQ0FBQSxVQUFELENBQVksS0FBWixFQUFtQixJQUFuQjtJQUpXOzt3QkFNYixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFGTTs7d0JBSVIsVUFBQSxHQUFZLFNBQUMsR0FBRDtBQUNWLFVBQUE7TUFEWSxVQUFEO01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBQW1DLE9BQW5DO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFOLENBQW1CLFVBQW5CLEVBQStCLElBQS9CO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBWixHQUE0QjtNQUM1QixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxH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QixDQUFDLEdBQTlFLENBQUg7WUFDRSxJQUFBLEdBQU8sS0FEVDs7QUFERixTQURGOztNQUlBLElBQUEsQ0FBMkIsSUFBM0I7ZUFBQSxDQUFDLENBQUMsZUFBRixDQUFBLEVBQUE7O0lBTGM7O0lBT2hCLFNBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQTtNQUNULElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSTthQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw4QkFBbEIsRUFDUjtRQUFBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWY7VUFBUDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7T0FEUSxDQUFWO0lBRlM7O0lBS1gsU0FBQyxDQUFBLFVBQUQsR0FBYSxTQUFBO2FBQ1gsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFEVzs7Ozs7QUFoRWYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbmxpbmVEb2NcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCByYW5nZSwgb3B0cz17fSkgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIElubGluZURvYy5yZW1vdmVSYW5nZVJvd3MgQGVkaXRvciwgcmFuZ2VcbiAgICBAY3JlYXRlVmlldyBvcHRzXG4gICAgQGluaXRNYXJrZXIgcmFuZ2UsIG9wdHNcblxuICByZW1vdmU6IC0+XG4gICAgQG1hcmtlci5kZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgY3JlYXRlVmlldzogKHtjb250ZW50fSkgLT5cbiAgICBAdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBAdmlldy5jbGFzc0xpc3QuYWRkICdpbmsnLCAnZG9jcycsICd1bmRlcidcbiAgICBAdmlldy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcbiAgICBAdmlldy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAdmlldyxcbiAgICAgICdpbmxpbmUtZG9jczpjbGVhcic6IChlKSA9PiBAcmVtb3ZlKClcbiAgICBpZiBjb250ZW50PyB0aGVuIEB2aWV3LmFwcGVuZENoaWxkIGNvbnRlbnRcblxuICBpbml0TWFya2VyOiAocmFuZ2UsIHtoaWdobGlnaHR9KSAtPlxuICAgIEBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSByYW5nZSxcbiAgICAgIHBlcnNpc3RlbnQ6IGZhbHNlLFxuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIEBtYXJrZXIubW9kZWwgPSB0aGlzXG4gICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBAbWFya2VyLFxuICAgICAgaXRlbTogQHZpZXcsXG4gICAgICB0eXBlOiAnYmxvY2snLFxuICAgICAgcG9zaXRpb246ICdhZnRlcidcbiAgICBpZiBoaWdobGlnaHQgdGhlbiBAZWRpdG9yLmRlY29yYXRlTWFya2VyIEBtYXJrZXIsXG4gICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgIGNsYXNzOiAnZG9jLWhpZ2hsaWdodCdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBtYXJrZXIub25EaWRDaGFuZ2UgKGUpID0+IEBjaGVja01hcmtlciBlXG5cbiAgY2hlY2tNYXJrZXI6IChlKSAtPlxuICAgIGlmICFlLmlzVmFsaWQgb3IgQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmlzRW1wdHkoKSBvciBlLnRleHRDaGFuZ2VkXG4gICAgICBAcmVtb3ZlKClcblxuICBAcmVtb3ZlUmFuZ2VSb3dzOiAoZWQsIHJhbmdlKSAtPlxuICAgIEByZW1vdmVMaW5lcyBlZCwgcmFuZ2Uuc3RhcnQucm93LCByYW5nZS5lbmQucm93XG5cbiAgQHJlbW92ZUxpbmVzOiAoZWQsIHN0YXJ0LCBlbmQpIC0+XG4gICAgbXMgPSBlZC5maW5kTWFya2VycygpXG4gICAgICAgICAgIC5maWx0ZXIoKHgpIC0+ICh4Lm1vZGVsPyAmJlxuICAgICAgICAgICAgICAgICAgICAgIHgubW9kZWwgaW5zdGFuY2VvZiBJbmxpbmVEb2MgJiZcbiAgICAgICAgICAgICAgICAgICAgICB4LmdldEJ1ZmZlclJhbmdlKCkuaW50ZXJzZWN0c1Jvd1JhbmdlKHN0YXJ0LCBlbmQpKSlcbiAgICAgICAgICAgLm1hcCgoeCkgLT4geC5tb2RlbC5yZW1vdmUoKSlcbiAgICBtcy5sZW5ndGggPiAwXG5cbiAgQHJlbW92ZUN1cnJlbnQ6IChlKSAtPlxuICAgIGlmIChlZCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgIGZvciBzZWwgaW4gZWQuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgIGlmIEByZW1vdmVMaW5lcyhlZCwgc2VsLmdldEhlYWRCdWZmZXJQb3NpdGlvbigpLnJvdywgc2VsLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpLnJvdylcbiAgICAgICAgICBkb25lID0gdHJ1ZVxuICAgIGUuYWJvcnRLZXlCaW5kaW5nKCkgdW5sZXNzIGRvbmVcblxuICBAYWN0aXZhdGU6IC0+XG4gICAgQHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsXG4gICAgICAnaW5saW5lOmNsZWFyLWN1cnJlbnQnOiAoZSkgPT4gQHJlbW92ZUN1cnJlbnQgZVxuXG4gIEBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzLmRpc3Bvc2UoKVxuIl19
