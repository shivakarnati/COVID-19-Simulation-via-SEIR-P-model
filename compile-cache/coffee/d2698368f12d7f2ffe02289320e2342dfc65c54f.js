(function() {
  var fs, fuzzaldrinPlus, path;

  fs = require('fs');

  path = require('path');

  fuzzaldrinPlus = require('fuzzaldrin-plus');

  module.exports = {
    filterSuggestions: false,
    suggestionPriority: 5,
    inclusionPriority: 5,
    textEditorSelectors: 'atom-text-editor',
    getTextEditorSelector: function() {
      return this.textEditorSelectors;
    },
    completions: {},
    texPattern: /\\([\w:_\+\-\^]*)$/,
    activate: function() {
      return this.disposable = atom.config.observe('latex-completions.boostGreekCharacters', (function(_this) {
        return function(boost) {
          return _this.boostGreek = boost;
        };
      })(this));
    },
    deactivate: function() {
      return this.disposable.dispose();
    },
    load: function(p) {
      this.scopeSelector = atom.config.get("latex-completions.selector");
      this.disableForScopeSelector = atom.config.get("latex-completions.disableForSelector");
      if (p === '') {
        return;
      }
      if (p == null) {
        p = path.resolve(__dirname, '..', 'completions', 'completions.json');
      }
      return fs.readFile(p, (function(_this) {
        return function(error, content) {
          var char, name, ref, results;
          if (error != null) {
            return;
          }
          ref = JSON.parse(content);
          results = [];
          for (name in ref) {
            char = ref[name];
            results.push(_this.completions[name] = char);
          }
          return results;
        };
      })(this));
    },
    score: function(a, b, symbol) {
      var s;
      s = fuzzaldrinPlus.score(a, b);
      if (this.boostGreek && /[Α-ϵ]/.test(symbol)) {
        s = s * 1.4;
        s = s + 0.001;
      }
      return s;
    },
    compare: function(a, b) {
      var diff;
      diff = b.score - a.score;
      if (diff === 0) {
        return a.leftLabel.localeCompare(b.leftLabel);
      } else {
        return diff;
      }
    },
    getSuggestions: function(arg) {
      var bufferPosition, editor, line, prefix, ref;
      bufferPosition = arg.bufferPosition, editor = arg.editor, prefix = arg.prefix;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      prefix = (ref = line.match(this.texPattern)) != null ? ref[1] : void 0;
      return new Promise((function(_this) {
        return function(resolve) {
          var leftLabel, text;
          if (prefix != null) {
            return resolve(((function() {
              var ref1, results;
              ref1 = this.completions;
              results = [];
              for (text in ref1) {
                leftLabel = ref1[text];
                results.push({
                  text: this.completions[text],
                  displayText: text,
                  leftLabel: leftLabel,
                  replacementPrefix: '\\' + prefix,
                  score: this.score(text, prefix, leftLabel)
                });
              }
              return results;
            }).call(_this)).sort(_this.compare));
          } else {
            return resolve([]);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9sYXRleC1jb21wbGV0aW9ucy9saWIvcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGlCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsaUJBQUEsRUFBbUIsS0FBbkI7SUFDQSxrQkFBQSxFQUFvQixDQURwQjtJQUVBLGlCQUFBLEVBQW1CLENBRm5CO0lBSUEsbUJBQUEsRUFBcUIsa0JBSnJCO0lBS0EscUJBQUEsRUFBdUIsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBTHZCO0lBT0EsV0FBQSxFQUFhLEVBUGI7SUFTQSxVQUFBLEVBQVksb0JBVFo7SUFXQSxRQUFBLEVBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdDQUFwQixFQUE4RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDMUUsS0FBQyxDQUFBLFVBQUQsR0FBYztRQUQ0RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQ7SUFETixDQVhWO0lBZUEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQTtJQURVLENBZlo7SUFrQkEsSUFBQSxFQUFNLFNBQUMsQ0FBRDtNQUNKLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7TUFDakIsSUFBQyxDQUFBLHVCQUFELEdBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7TUFDM0IsSUFBVSxDQUFBLEtBQUssRUFBZjtBQUFBLGVBQUE7OztRQUNBLElBQUssSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLGFBQTlCLEVBQTZDLGtCQUE3Qzs7YUFDTCxFQUFFLENBQUMsUUFBSCxDQUFZLENBQVosRUFBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDYixjQUFBO1VBQUEsSUFBVSxhQUFWO0FBQUEsbUJBQUE7O0FBQ0E7QUFBQTtlQUFBLFdBQUE7O3lCQUNFLEtBQUMsQ0FBQSxXQUFZLENBQUEsSUFBQSxDQUFiLEdBQXFCO0FBRHZCOztRQUZhO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0lBTEksQ0FsQk47SUE0QkEsS0FBQSxFQUFPLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxNQUFQO0FBQ0wsVUFBQTtNQUFBLENBQUEsR0FBSSxjQUFjLENBQUMsS0FBZixDQUFxQixDQUFyQixFQUF3QixDQUF4QjtNQUNKLElBQUcsSUFBQyxDQUFBLFVBQUQsSUFBZSxPQUFPLENBQUMsSUFBUixDQUFhLE1BQWIsQ0FBbEI7UUFDRSxDQUFBLEdBQUksQ0FBQSxHQUFJO1FBQ1IsQ0FBQSxHQUFJLENBQUEsR0FBSSxNQUZWOzthQUdBO0lBTEssQ0E1QlA7SUFtQ0EsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDUCxVQUFBO01BQUEsSUFBQSxHQUFPLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDO01BRW5CLElBQUcsSUFBQSxLQUFRLENBQVg7ZUFDRSxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQVosQ0FBMEIsQ0FBQyxDQUFDLFNBQTVCLEVBREY7T0FBQSxNQUFBO2VBR0UsS0FIRjs7SUFITyxDQW5DVDtJQTJDQSxjQUFBLEVBQWdCLFNBQUMsR0FBRDtBQUNkLFVBQUE7TUFEZ0IscUNBQWdCLHFCQUFRO01BQ3hDLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7TUFDUCxNQUFBLG9EQUFrQyxDQUFBLENBQUE7QUFDbEMsYUFBTyxJQUFJLE9BQUosQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtBQUNqQixjQUFBO1VBQUEsSUFBRyxjQUFIO21CQUNFLE9BQUEsQ0FBUTs7QUFBQztBQUFBO21CQUFBLFlBQUE7OzZCQUFBO2tCQUFDLElBQUEsRUFBTSxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBcEI7a0JBQTJCLFdBQUEsRUFBYSxJQUF4QztrQkFBOEMsV0FBQSxTQUE5QztrQkFBeUQsaUJBQUEsRUFBbUIsSUFBQSxHQUFLLE1BQWpGO2tCQUF5RixLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLEVBQWEsTUFBYixFQUFxQixTQUFyQixDQUFoRzs7QUFBQTs7MEJBQUQsQ0FBc0ssQ0FBQyxJQUF2SyxDQUE0SyxLQUFDLENBQUEsT0FBN0ssQ0FBUixFQURGO1dBQUEsTUFBQTttQkFHRSxPQUFBLENBQVEsRUFBUixFQUhGOztRQURpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtJQUhPLENBM0NoQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZ1enphbGRyaW5QbHVzID0gcmVxdWlyZSAnZnV6emFsZHJpbi1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGZpbHRlclN1Z2dlc3Rpb25zOiBmYWxzZVxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IDVcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDVcblxuICB0ZXh0RWRpdG9yU2VsZWN0b3JzOiAnYXRvbS10ZXh0LWVkaXRvcidcbiAgZ2V0VGV4dEVkaXRvclNlbGVjdG9yOiAtPiBAdGV4dEVkaXRvclNlbGVjdG9yc1xuXG4gIGNvbXBsZXRpb25zOiB7fVxuXG4gIHRleFBhdHRlcm46IC9cXFxcKFtcXHc6X1xcK1xcLVxcXl0qKSQvXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2FibGUgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdsYXRleC1jb21wbGV0aW9ucy5ib29zdEdyZWVrQ2hhcmFjdGVycycsIChib29zdCkgPT5cbiAgICAgIEBib29zdEdyZWVrID0gYm9vc3RcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gIGxvYWQ6IChwKSAtPlxuICAgIEBzY29wZVNlbGVjdG9yID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgtY29tcGxldGlvbnMuc2VsZWN0b3JcIilcbiAgICBAZGlzYWJsZUZvclNjb3BlU2VsZWN0b3IgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC1jb21wbGV0aW9ucy5kaXNhYmxlRm9yU2VsZWN0b3JcIilcbiAgICByZXR1cm4gaWYgcCA9PSAnJ1xuICAgIHAgPz0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2NvbXBsZXRpb25zJywgJ2NvbXBsZXRpb25zLmpzb24nKVxuICAgIGZzLnJlYWRGaWxlIHAsIChlcnJvciwgY29udGVudCkgPT5cbiAgICAgIHJldHVybiBpZiBlcnJvcj9cbiAgICAgIGZvciBuYW1lLCBjaGFyIG9mIEpTT04ucGFyc2UoY29udGVudClcbiAgICAgICAgQGNvbXBsZXRpb25zW25hbWVdID0gY2hhclxuXG4gIHNjb3JlOiAoYSwgYiwgc3ltYm9sKSAtPlxuICAgIHMgPSBmdXp6YWxkcmluUGx1cy5zY29yZShhLCBiKVxuICAgIGlmIEBib29zdEdyZWVrICYmIC9bzpEtz7VdLy50ZXN0KHN5bWJvbClcbiAgICAgIHMgPSBzICogMS40XG4gICAgICBzID0gcyArIDAuMDAxXG4gICAgc1xuXG4gIGNvbXBhcmU6IChhLCBiKSAtPlxuICAgIGRpZmYgPSBiLnNjb3JlIC0gYS5zY29yZVxuXG4gICAgaWYgZGlmZiA9PSAwXG4gICAgICBhLmxlZnRMYWJlbC5sb2NhbGVDb21wYXJlKGIubGVmdExhYmVsKVxuICAgIGVsc2VcbiAgICAgIGRpZmZcblxuICBnZXRTdWdnZXN0aW9uczogKHtidWZmZXJQb3NpdGlvbiwgZWRpdG9yLCBwcmVmaXh9KSAtPlxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgcHJlZml4ID0gbGluZS5tYXRjaChAdGV4UGF0dGVybik/WzFdXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgaWYgcHJlZml4P1xuICAgICAgICByZXNvbHZlKCh7dGV4dDogQGNvbXBsZXRpb25zW3RleHRdLCBkaXNwbGF5VGV4dDogdGV4dCwgbGVmdExhYmVsLCByZXBsYWNlbWVudFByZWZpeDogJ1xcXFwnK3ByZWZpeCwgc2NvcmU6IEBzY29yZSh0ZXh0LCBwcmVmaXgsIGxlZnRMYWJlbCl9IGZvciB0ZXh0LCBsZWZ0TGFiZWwgb2YgQGNvbXBsZXRpb25zKS5zb3J0KEBjb21wYXJlKSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZShbXSlcbiJdfQ==
