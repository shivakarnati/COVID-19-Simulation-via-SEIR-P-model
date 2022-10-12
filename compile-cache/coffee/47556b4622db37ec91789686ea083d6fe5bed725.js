(function() {
  var CompositeDisposable, Disposable, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  module.exports = {
    modules: require('./runtime/modules'),
    environments: require('./runtime/environments'),
    evaluation: require('./runtime/evaluation'),
    console: require('./runtime/console'),
    completions: require('./runtime/completions'),
    workspace: require('./runtime/workspace'),
    plots: require('./runtime/plots'),
    frontend: require('./runtime/frontend'),
    "debugger": require('./runtime/debugger'),
    profiler: require('./runtime/profiler'),
    outline: require('./runtime/outline'),
    linter: require('./runtime/linter'),
    packages: require('./runtime/packages'),
    debuginfo: require('./runtime/debuginfo'),
    formatter: require('./runtime/formatter'),
    goto: require('./runtime/goto'),
    activate: function() {
      this.subs = new CompositeDisposable();
      this.modules.activate();
      this.completions.activate();
      this.subs.add(atom.config.observe('julia-client.juliaOptions.formatOnSave', (function(_this) {
        return function(val) {
          if (val) {
            return _this.formatter.activate();
          } else {
            return _this.formatter.deactivate();
          }
        };
      })(this)));
      return this.subs.add(new Disposable((function(_this) {
        return function() {
          var i, len, mod, ref1, results;
          ref1 = [_this.modules, _this.completions, _this.formatter];
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            mod = ref1[i];
            results.push(mod.deactivate());
          }
          return results;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    consumeInk: function(ink) {
      var i, j, len, len1, mod, ref1, ref2;
      this.evaluation.ink = ink;
      ref1 = [this.console, this["debugger"], this.profiler, this.linter, this.goto, this.outline, this.frontend];
      for (i = 0, len = ref1.length; i < len; i++) {
        mod = ref1[i];
        mod.activate(ink);
      }
      ref2 = [this.workspace, this.plots];
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        mod = ref2[j];
        mod.ink = ink;
        mod.activate();
      }
      this.subs.add(new Disposable((function(_this) {
        return function() {
          var k, len2, ref3, results;
          ref3 = [_this.console, _this["debugger"], _this.profiler, _this.linter, _this.goto, _this.outline];
          results = [];
          for (k = 0, len2 = ref3.length; k < len2; k++) {
            mod = ref3[k];
            results.push(mod.deactivate());
          }
          return results;
        };
      })(this)));
      return this.environments.consumeInk(ink);
    },
    provideAutoComplete: function() {
      return this.completions;
    },
    provideHyperclick: function() {
      return this.goto.provideHyperclick();
    },
    consumeStatusBar: function(bar) {
      var d, e, m;
      m = this.modules.consumeStatusBar(bar);
      e = this.environments.consumeStatusBar(bar);
      d = new Disposable((function(_this) {
        return function() {
          m.dispose();
          return e.dispose();
        };
      })(this));
      this.subs.add(d);
      return d;
    },
    consumeDatatip: function(datatipService) {
      var datatipDisposable, datatipProvider;
      datatipProvider = require('./runtime/datatip');
      if (datatipService.constructor.name === 'DatatipManager') {
        datatipProvider.useAtomIDEUI = true;
      } else {
        atom.config.set('atom-ide-datatip', {
          showDataTipOnCursorMove: false,
          showDataTipOnMouseMove: true
        });
      }
      datatipDisposable = datatipService.addProvider(datatipProvider);
      this.subs.add(datatipDisposable);
      return datatipDisposable;
    },
    handleURI: require('./runtime/urihandler')
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3J1bnRpbWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFzQyxPQUFBLENBQVEsTUFBUixDQUF0QyxFQUFFLDZDQUFGLEVBQXVCOztFQUV2QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUFjLE9BQUEsQ0FBUSxtQkFBUixDQUFkO0lBQ0EsWUFBQSxFQUFjLE9BQUEsQ0FBUSx3QkFBUixDQURkO0lBRUEsVUFBQSxFQUFjLE9BQUEsQ0FBUSxzQkFBUixDQUZkO0lBR0EsT0FBQSxFQUFjLE9BQUEsQ0FBUSxtQkFBUixDQUhkO0lBSUEsV0FBQSxFQUFjLE9BQUEsQ0FBUSx1QkFBUixDQUpkO0lBS0EsU0FBQSxFQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUxkO0lBTUEsS0FBQSxFQUFjLE9BQUEsQ0FBUSxpQkFBUixDQU5kO0lBT0EsUUFBQSxFQUFjLE9BQUEsQ0FBUSxvQkFBUixDQVBkO0lBUUEsQ0FBQSxRQUFBLENBQUEsRUFBYyxPQUFBLENBQVEsb0JBQVIsQ0FSZDtJQVNBLFFBQUEsRUFBYyxPQUFBLENBQVEsb0JBQVIsQ0FUZDtJQVVBLE9BQUEsRUFBYyxPQUFBLENBQVEsbUJBQVIsQ0FWZDtJQVdBLE1BQUEsRUFBYyxPQUFBLENBQVEsa0JBQVIsQ0FYZDtJQVlBLFFBQUEsRUFBYyxPQUFBLENBQVEsb0JBQVIsQ0FaZDtJQWFBLFNBQUEsRUFBYyxPQUFBLENBQVEscUJBQVIsQ0FiZDtJQWNBLFNBQUEsRUFBYyxPQUFBLENBQVEscUJBQVIsQ0FkZDtJQWVBLElBQUEsRUFBYyxPQUFBLENBQVEsZ0JBQVIsQ0FmZDtJQWlCQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxt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Q0FBQyxXQUFmLENBQTJCLGVBQTNCO01BQ3BCLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLGlCQUFWO2FBQ0E7SUFiYyxDQTFEaEI7SUF5RUEsU0FBQSxFQUFXLE9BQUEsQ0FBUSxzQkFBUixDQXpFWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbInsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBtb2R1bGVzOiAgICAgIHJlcXVpcmUgJy4vcnVudGltZS9tb2R1bGVzJ1xuICBlbnZpcm9ubWVudHM6IHJlcXVpcmUgJy4vcnVudGltZS9lbnZpcm9ubWVudHMnXG4gIGV2YWx1YXRpb246ICAgcmVxdWlyZSAnLi9ydW50aW1lL2V2YWx1YXRpb24nXG4gIGNvbnNvbGU6ICAgICAgcmVxdWlyZSAnLi9ydW50aW1lL2NvbnNvbGUnXG4gIGNvbXBsZXRpb25zOiAgcmVxdWlyZSAnLi9ydW50aW1lL2NvbXBsZXRpb25zJ1xuICB3b3Jrc3BhY2U6ICAgIHJlcXVpcmUgJy4vcnVudGltZS93b3Jrc3BhY2UnXG4gIHBsb3RzOiAgICAgICAgcmVxdWlyZSAnLi9ydW50aW1lL3Bsb3RzJ1xuICBmcm9udGVuZDogICAgIHJlcXVpcmUgJy4vcnVudGltZS9mcm9udGVuZCdcbiAgZGVidWdnZXI6ICAgICByZXF1aXJlICcuL3J1bnRpbWUvZGVidWdnZXInXG4gIHByb2ZpbGVyOiAgICAgcmVxdWlyZSAnLi9ydW50aW1lL3Byb2ZpbGVyJ1xuICBvdXRsaW5lOiAgICAgIHJlcXVpcmUgJy4vcnVudGltZS9vdXRsaW5lJ1xuICBsaW50ZXI6ICAgICAgIHJlcXVpcmUgJy4vcnVudGltZS9saW50ZXInXG4gIHBhY2thZ2VzOiAgICAgcmVxdWlyZSAnLi9ydW50aW1lL3BhY2thZ2VzJ1xuICBkZWJ1Z2luZm86ICAgIHJlcXVpcmUgJy4vcnVudGltZS9kZWJ1Z2luZm8nXG4gIGZvcm1hdHRlcjogICAgcmVxdWlyZSAnLi9ydW50aW1lL2Zvcm1hdHRlcidcbiAgZ290bzogICAgICAgICByZXF1aXJlICcuL3J1bnRpbWUvZ290bydcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIEBtb2R1bGVzLmFjdGl2YXRlKClcbiAgICBAY29tcGxldGlvbnMuYWN0aXZhdGUoKVxuICAgIEBzdWJzLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLmZvcm1hdE9uU2F2ZScsICh2YWwpID0+XG4gICAgICBpZiB2YWxcbiAgICAgICAgQGZvcm1hdHRlci5hY3RpdmF0ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBmb3JtYXR0ZXIuZGVhY3RpdmF0ZSgpXG5cbiAgICBAc3Vicy5hZGQgbmV3IERpc3Bvc2FibGUoPT5cbiAgICAgIG1vZC5kZWFjdGl2YXRlKCkgZm9yIG1vZCBpbiBbQG1vZHVsZXMsIEBjb21wbGV0aW9ucywgQGZvcm1hdHRlcl0pXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vicy5kaXNwb3NlKClcblxuICBjb25zdW1lSW5rOiAoaW5rKSAtPlxuICAgIEBldmFsdWF0aW9uLmluayA9IGlua1xuICAgIGZvciBtb2QgaW4gW0Bjb25zb2xlLCBAZGVidWdnZXIsIEBwcm9maWxlciwgQGxpbnRlciwgQGdvdG8sIEBvdXRsaW5lLCBAZnJvbnRlbmRdXG4gICAgICBtb2QuYWN0aXZhdGUoaW5rKVxuICAgIGZvciBtb2QgaW4gW0B3b3Jrc3BhY2UsIEBwbG90c11cbiAgICAgIG1vZC5pbmsgPSBpbmtcbiAgICAgIG1vZC5hY3RpdmF0ZSgpXG4gICAgQHN1YnMuYWRkIG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBtb2QuZGVhY3RpdmF0ZSgpIGZvciBtb2QgaW4gW0Bjb25zb2xlLCBAZGVidWdnZXIsIEBwcm9maWxlciwgQGxpbnRlciwgQGdvdG8sIEBvdXRsaW5lXVxuICAgIEBlbnZpcm9ubWVudHMuY29uc3VtZUluayhpbmspXG5cbiAgcHJvdmlkZUF1dG9Db21wbGV0ZTogLT4gQGNvbXBsZXRpb25zXG5cbiAgcHJvdmlkZUh5cGVyY2xpY2s6IC0+IEBnb3RvLnByb3ZpZGVIeXBlcmNsaWNrKClcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoYmFyKSAtPlxuICAgIG0gPSBAbW9kdWxlcy5jb25zdW1lU3RhdHVzQmFyIGJhclxuICAgIGUgPSBAZW52aXJvbm1lbnRzLmNvbnN1bWVTdGF0dXNCYXIgYmFyXG4gICAgZCA9IG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBtLmRpc3Bvc2UoKVxuICAgICAgZS5kaXNwb3NlKClcbiAgICBAc3Vicy5hZGQgZFxuICAgIHJldHVybiBkXG5cbiAgY29uc3VtZURhdGF0aXA6IChkYXRhdGlwU2VydmljZSkgLT5cbiAgICBkYXRhdGlwUHJvdmlkZXIgPSByZXF1aXJlICcuL3J1bnRpbWUvZGF0YXRpcCdcbiAgICAjIEBOT1RFOiBDaGVjayBpZiB0aGUgc2VydmljZSBpcyBwYXNzZWQgYnkgQXRvbS1JREUtVUkncyBkYXRhdGlwIHNlcnZpY2U6XG4gICAgIyAgICAgICAgICBjdXJyZW50bHkgYXRvbS1pZGUtZGF0YXRpcCBjYW4ndCByZW5kZXIgY29kZSBzbmlwcGV0cyBjb3JyZWN0bHkuXG4gICAgaWYgZGF0YXRpcFNlcnZpY2UuY29uc3RydWN0b3IubmFtZSA9PSAnRGF0YXRpcE1hbmFnZXInXG4gICAgICBkYXRhdGlwUHJvdmlkZXIudXNlQXRvbUlERVVJID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgICMgQE5PVEU6IE92ZXJ3cml0ZSB0aGUgd2VpcmQgZGVmYXVsdCBjb25maWcgc2V0dGluZ3Mgb2YgYXRvbS1pZGUtZGF0YXRpcFxuICAgICAgYXRvbS5jb25maWcuc2V0ICdhdG9tLWlkZS1kYXRhdGlwJyxcbiAgICAgICAgc2hvd0RhdGFUaXBPbkN1cnNvck1vdmU6IGZhbHNlXG4gICAgICAgIHNob3dEYXRhVGlwT25Nb3VzZU1vdmU6IHRydWVcbiAgICBkYXRhdGlwRGlzcG9zYWJsZSA9IGRhdGF0aXBTZXJ2aWNlLmFkZFByb3ZpZGVyKGRhdGF0aXBQcm92aWRlcilcbiAgICBAc3Vicy5hZGQoZGF0YXRpcERpc3Bvc2FibGUpXG4gICAgZGF0YXRpcERpc3Bvc2FibGVcblxuICBoYW5kbGVVUkk6IHJlcXVpcmUgJy4vcnVudGltZS91cmloYW5kbGVyJ1xuIl19
