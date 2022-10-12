(function() {
  var CompositeDisposable, DebuggerPane, DocPane, HTMLPane, Ink, InkTerminal, Linter, NotePane, Outline, PaneItem, PlotPane, Workspace, etch, exportables, once;

  CompositeDisposable = require('atom').CompositeDisposable;

  etch = require('etch');

  once = require('underscore-plus').once;

  PaneItem = require('./util/pane-item');

  PlotPane = require('./plots/pane');

  HTMLPane = require('./plots/htmlpane');

  DocPane = require('./docs/docpane');

  NotePane = require('./note/notepane');

  DebuggerPane = require('./debugger/debugger-pane');

  InkTerminal = require('./console/console');

  Workspace = require('./workspace/workspace');

  Outline = require('./outline/outline');

  Linter = require('./linter/linter');

  exportables = {
    PaneItem: once((function(_this) {
      return function() {
        return PaneItem;
      };
    })(this)),
    PlotPane: once((function(_this) {
      return function() {
        return PlotPane;
      };
    })(this)),
    DocPane: once((function(_this) {
      return function() {
        return DocPane;
      };
    })(this)),
    NotePane: once((function(_this) {
      return function() {
        return NotePane;
      };
    })(this)),
    DebuggerPane: once((function(_this) {
      return function() {
        return DebuggerPane;
      };
    })(this)),
    InkTerminal: once((function(_this) {
      return function() {
        return InkTerminal;
      };
    })(this)),
    Workspace: once((function(_this) {
      return function() {
        return Workspace;
      };
    })(this)),
    Outline: once((function(_this) {
      return function() {
        return Outline;
      };
    })(this)),
    Linter: once((function(_this) {
      return function() {
        return Linter;
      };
    })(this)),
    HTMLPane: once((function(_this) {
      return function() {
        return HTMLPane;
      };
    })(this)),
    Loading: once((function(_this) {
      return function() {
        return require('./util/loading');
      };
    })(this)),
    progress: once((function(_this) {
      return function() {
        return require('./util/progress');
      };
    })(this)),
    Tooltip: once((function(_this) {
      return function() {
        return require('./util/tooltip');
      };
    })(this)),
    block: once((function(_this) {
      return function() {
        return require('./editor/block');
      };
    })(this)),
    highlights: once((function(_this) {
      return function() {
        return require('./editor/highlights');
      };
    })(this)),
    Result: once((function(_this) {
      return function() {
        return require('./editor/result');
      };
    })(this)),
    InlineDoc: once((function(_this) {
      return function() {
        return require('./editor/docs');
      };
    })(this)),
    Stepper: once((function(_this) {
      return function() {
        return require('./debugger/stepper');
      };
    })(this)),
    breakpoints: once((function(_this) {
      return function() {
        return require('./debugger/breakpoints');
      };
    })(this)),
    Pannable: once((function(_this) {
      return function() {
        return require('./plots/canopy').Pannable;
      };
    })(this)),
    KaTeX: once((function(_this) {
      return function() {
        return require('./util/katexify');
      };
    })(this)),
    Profiler: once((function(_this) {
      return function() {
        return require('./plots/profiler');
      };
    })(this)),
    tree: once((function(_this) {
      return function() {
        return require('./tree');
      };
    })(this)),
    Opener: once((function(_this) {
      return function() {
        return require('./util/opener');
      };
    })(this)),
    matchHighlighter: once((function(_this) {
      return function() {
        return require('./util/matchHighlighter');
      };
    })(this)),
    ansiToHTML: once((function(_this) {
      return function() {
        return require('./util/ansitohtml');
      };
    })(this))
  };

  module.exports = Ink = {
    activate: function() {
      var i, len, mod, ref, results;
      etch.setScheduler(atom.views);
      ref = [exportables.Opener(), exportables.PaneItem(), exportables.Result(), exportables.InlineDoc(), exportables.PlotPane(), exportables.InkTerminal(), exportables.Linter()];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        mod = ref[i];
        results.push(mod.activate());
      }
      return results;
    },
    deactivate: function() {
      var i, len, mod, ref, results;
      ref = [exportables.Opener(), exportables.PaneItem(), exportables.Result(), exportables.DocPane(), exportables.InlineDoc(), exportables.PlotPane(), exportables.InkTerminal(), exportables.Linter()];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        mod = ref[i];
        results.push(mod.deactivate());
      }
      return results;
    },
    config: require('./config'),
    consumeStatusBar: function(bar) {
      return exportables.progress().consumeStatusBar(bar);
    },
    consumeRemoteFileOpener: function(opener) {
      return exportables.Opener().consumeRemoteFileOpener(opener);
    },
    provide: function() {
      var fn, key, obj, val;
      obj = {
        util: {
          focusEditorPane: function() {
            return exportables.PaneItem().focusEditorPane();
          }
        },
        highlight: (function(_this) {
          return function(ed, start, end, clas) {
            return exportables.block().highlight(ed, start, end, clas);
          };
        })(this)
      };
      fn = function(val) {
        return Object.defineProperty(obj, key, {
          get: function() {
            return val();
          }
        });
      };
      for (key in exportables) {
        val = exportables[key];
        fn(val);
      }
      return obj;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2luay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLE9BQVEsT0FBQSxDQUFRLGlCQUFSOztFQUdULFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVI7O0VBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxjQUFSOztFQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVI7O0VBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUjs7RUFDVixRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLFlBQUEsR0FBZSxPQUFBLENBQVEsMEJBQVI7O0VBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSxtQkFBUjs7RUFDZCxTQUFBLEdBQVksT0FBQSxDQUFRLHVCQUFSOztFQUNaLE9BQUEsR0FBVSxPQUFBLENBQVEsbUJBQVI7O0VBQ1YsTUFBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUjs7RUFFVCxXQUFBLEdBQ0U7SUFBQSxRQUFBLEVBQVUsSUFBQSxDQUFLLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUFHO01BQUg7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUwsQ0FBVjtJQUNBLFFBQUEsRUFBVSxJQUFBLENBQUssQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO2VBQUc7TUFBSDtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxDQURWO0lBRUEsT0FBQSxFQUFTLElBQUEsQ0FBSyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFBRztNQUFIO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLENBRlQ7SUFHQSxRQUFBLEVBQVUsSUFBQSxD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Q0FBQTtBQUFBOztJQUhVLENBSlo7SUFTQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FUUjtJQVdBLGdCQUFBLEVBQWtCLFNBQUMsR0FBRDthQUNoQixXQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsZ0JBQXZCLENBQXdDLEdBQXhDO0lBRGdCLENBWGxCO0lBY0EsdUJBQUEsRUFBeUIsU0FBQyxNQUFEO2FBQ3ZCLFdBQVcsQ0FBQyxNQUFaLENBQUEsQ0FBb0IsQ0FBQyx1QkFBckIsQ0FBNkMsTUFBN0M7SUFEdUIsQ0FkekI7SUFpQkEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsR0FBQSxHQUNFO1FBQUEsSUFBQSxFQUNFO1VBQUEsZUFBQSxFQUFpQixTQUFBO21CQUFNLFdBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBc0IsQ0FBQyxlQUF2QixDQUFBO1VBQU4sQ0FBakI7U0FERjtRQUVBLFNBQUEsRUFBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksR0FBWixFQUFpQixJQUFqQjttQkFDVCxXQUFXLENBQUMsS0FBWixDQUFBLENBQW1CLENBQUMsU0FBcEIsQ0FBOEIsRUFBOUIsRUFBa0MsS0FBbEMsRUFBeUMsR0FBekMsRUFBOEMsSUFBOUM7VUFEUztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGWDs7V0FNRyxTQUFDLEdBQUQ7ZUFDRCxNQUFNLENBQUMsY0FBUCxDQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQztVQUM5QixHQUFBLEVBQUssU0FBQTttQkFBRyxHQUFBLENBQUE7VUFBSCxDQUR5QjtTQUFoQztNQURDO0FBREwsV0FBQSxrQkFBQTs7V0FDTTtBQUROO2FBS0E7SUFaTyxDQWpCVDs7QUE3Q0YiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZXRjaCA9IHJlcXVpcmUgJ2V0Y2gnXG57b25jZX0gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbiMgdGhlc2UgbmVlZCB0byBiZSBsb2FkZWQgZmlyc3Qgc28gZGVzZXJpYWxpemF0aW9uIHdvcmtzIGZpbmVcblBhbmVJdGVtID0gcmVxdWlyZSAnLi91dGlsL3BhbmUtaXRlbSdcblBsb3RQYW5lID0gcmVxdWlyZSAnLi9wbG90cy9wYW5lJ1xuSFRNTFBhbmUgPSByZXF1aXJlICcuL3Bsb3RzL2h0bWxwYW5lJ1xuRG9jUGFuZSA9IHJlcXVpcmUoJy4vZG9jcy9kb2NwYW5lJylcbk5vdGVQYW5lID0gcmVxdWlyZSgnLi9ub3RlL25vdGVwYW5lJylcbkRlYnVnZ2VyUGFuZSA9IHJlcXVpcmUoJy4vZGVidWdnZXIvZGVidWdnZXItcGFuZScpXG5JbmtUZXJtaW5hbCA9IHJlcXVpcmUoJy4vY29uc29sZS9jb25zb2xlJylcbldvcmtzcGFjZSA9IHJlcXVpcmUgJy4vd29ya3NwYWNlL3dvcmtzcGFjZSdcbk91dGxpbmUgPSByZXF1aXJlICcuL291dGxpbmUvb3V0bGluZSdcbkxpbnRlciA9IHJlcXVpcmUgJy4vbGludGVyL2xpbnRlcidcblxuZXhwb3J0YWJsZXMgPVxuICBQYW5lSXRlbTogb25jZSg9PiBQYW5lSXRlbSlcbiAgUGxvdFBhbmU6IG9uY2UoPT4gUGxvdFBhbmUpXG4gIERvY1BhbmU6IG9uY2UoPT4gRG9jUGFuZSlcbiAgTm90ZVBhbmU6IG9uY2UoPT4gTm90ZVBhbmUpXG4gIERlYnVnZ2VyUGFuZTogb25jZSg9PiBEZWJ1Z2dlclBhbmUpXG4gIElua1Rlcm1pbmFsOiBvbmNlKD0+IElua1Rlcm1pbmFsKVxuICBXb3Jrc3BhY2U6IG9uY2UoPT4gV29ya3NwYWNlKVxuICBPdXRsaW5lOiBvbmNlKD0+IE91dGxpbmUpXG4gIExpbnRlcjogb25jZSg9PiBMaW50ZXIpXG4gIEhUTUxQYW5lOiBvbmNlKD0+IEhUTUxQYW5lKVxuICBMb2FkaW5nOiBvbmNlKD0+IHJlcXVpcmUgJy4vdXRpbC9sb2FkaW5nJylcbiAgcHJvZ3Jlc3M6IG9uY2UoPT4gcmVxdWlyZSAnLi91dGlsL3Byb2dyZXNzJylcbiAgVG9vbHRpcDogb25jZSg9PiByZXF1aXJlICcuL3V0aWwvdG9vbHRpcCcpXG4gIGJsb2NrOiBvbmNlKD0+IHJlcXVpcmUgJy4vZWRpdG9yL2Jsb2NrJylcbiAgaGlnaGxpZ2h0czogb25jZSg9PiByZXF1aXJlICcuL2VkaXRvci9oaWdobGlnaHRzJylcbiAgUmVzdWx0OiBvbmNlKD0+IHJlcXVpcmUgJy4vZWRpdG9yL3Jlc3VsdCcpXG4gIElubGluZURvYzogb25jZSg9PiByZXF1aXJlICcuL2VkaXRvci9kb2NzJylcbiAgU3RlcHBlcjogb25jZSg9PiByZXF1aXJlICcuL2RlYnVnZ2VyL3N0ZXBwZXInKVxuICBicmVha3BvaW50czogb25jZSg9PiByZXF1aXJlICcuL2RlYnVnZ2VyL2JyZWFrcG9pbnRzJylcbiAgUGFubmFibGU6IG9uY2UoPT4gcmVxdWlyZSgnLi9wbG90cy9jYW5vcHknKS5QYW5uYWJsZSlcbiAgS2FUZVg6IG9uY2UoPT4gcmVxdWlyZSgnLi91dGlsL2thdGV4aWZ5JykpXG4gIFByb2ZpbGVyOiBvbmNlKD0+IHJlcXVpcmUgJy4vcGxvdHMvcHJvZmlsZXInKVxuICB0cmVlOiBvbmNlKD0+IHJlcXVpcmUgJy4vdHJlZScpXG4gIE9wZW5lcjogb25jZSg9PiByZXF1aXJlKCcuL3V0aWwvb3BlbmVyJykpXG4gIG1hdGNoSGlnaGxpZ2h0ZXI6IG9uY2UoPT4gcmVxdWlyZSAnLi91dGlsL21hdGNoSGlnaGxpZ2h0ZXInKVxuICBhbnNpVG9IVE1MOiBvbmNlKD0+IHJlcXVpcmUgJy4vdXRpbC9hbnNpdG9odG1sJylcblxubW9kdWxlLmV4cG9ydHMgPSBJbmsgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBldGNoLnNldFNjaGVkdWxlcihhdG9tLnZpZXdzKVxuICAgIG1vZC5hY3RpdmF0ZSgpIGZvciBtb2QgaW4gW2V4cG9ydGFibGVzLk9wZW5lcigpLCBleHBvcnRhYmxlcy5QYW5lSXRlbSgpLCBleHBvcnRhYmxlcy5SZXN1bHQoKSwgZXhwb3J0YWJsZXMuSW5saW5lRG9jKCksIGV4cG9ydGFibGVzLlBsb3RQYW5lKCksIGV4cG9ydGFibGVzLklua1Rlcm1pbmFsKCksIGV4cG9ydGFibGVzLkxpbnRlcigpXVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgIyBwa2cgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UgJ2luaydcbiAgICAjIGxvY2FsU3RvcmFnZS5zZXRJdGVtIHBrZy5nZXRDYW5EZWZlck1haW5Nb2R1bGVSZXF1aXJlU3RvcmFnZUtleSgpLCBleHBvcnRhYmxlcy5mYWxzZSgpXG4gICAgbW9kLmRlYWN0aXZhdGUoKSBmb3IgbW9kIGluIFtleHBvcnRhYmxlcy5PcGVuZXIoKSwgZXhwb3J0YWJsZXMuUGFuZUl0ZW0oKSwgZXhwb3J0YWJsZXMuUmVzdWx0KCksIGV4cG9ydGFibGVzLkRvY1BhbmUoKSwgZXhwb3J0YWJsZXMuSW5saW5lRG9jKCksIGV4cG9ydGFibGVzLlBsb3RQYW5lKCksIGV4cG9ydGFibGVzLklua1Rlcm1pbmFsKCksIGV4cG9ydGFibGVzLkxpbnRlcigpXVxuXG4gIGNvbmZpZzogcmVxdWlyZSgnLi9jb25maWcnKVxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChiYXIpIC0+XG4gICAgZXhwb3J0YWJsZXMucHJvZ3Jlc3MoKS5jb25zdW1lU3RhdHVzQmFyIGJhclxuXG4gIGNvbnN1bWVSZW1vdGVGaWxlT3BlbmVyOiAob3BlbmVyKSAtPlxuICAgIGV4cG9ydGFibGVzLk9wZW5lcigpLmNvbnN1bWVSZW1vdGVGaWxlT3BlbmVyKG9wZW5lcilcblxuICBwcm92aWRlOiAtPlxuICAgIG9iaiA9XG4gICAgICB1dGlsOlxuICAgICAgICBmb2N1c0VkaXRvclBhbmU6ICgpIC0+IGV4cG9ydGFibGVzLlBhbmVJdGVtKCkuZm9jdXNFZGl0b3JQYW5lKClcbiAgICAgIGhpZ2hsaWdodDogKGVkLCBzdGFydCwgZW5kLCBjbGFzKSA9PlxuICAgICAgICBleHBvcnRhYmxlcy5ibG9jaygpLmhpZ2hsaWdodCBlZCwgc3RhcnQsIGVuZCwgY2xhc1xuXG4gICAgZm9yIGtleSwgdmFsIG9mIGV4cG9ydGFibGVzXG4gICAgICBkbyAodmFsKSAtPlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgICBnZXQ6IC0+IHZhbCgpXG4gICAgICAgIH0pXG4gICAgb2JqXG4iXX0=
