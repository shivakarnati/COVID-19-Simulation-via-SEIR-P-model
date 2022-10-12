(function() {
  var compat, packages, pathfinder;

  packages = require('./packages');

  pathfinder = require('./path');

  compat = require('./incompatible-packages');

  module.exports = {
    config: {
      disable: {
        type: 'boolean',
        "default": false,
        description: "Don't run installation on Atom startup. (This option is set automatically once the installation is complete.)"
      }
    },
    activate: function() {
      compat.checkIncompatible();
      if (atom.config.get('uber-juno.disable')) {
        return;
      }
      this.configSetup();
      return packages.setup(function() {
        return atom.config.set('uber-juno.disable', true);
      });
    },
    defaultConfig: {
      'tool-bar.position': 'Left',
      'julia-client.uiOptions.enableMenu': true,
      'julia-client.uiOptions.enableToolBar': true,
      'editor.scrollPastEnd': true,
      'autocomplete-plus.confirmCompletion': "tab always, enter when suggestion explicitly selected"
    },
    configSetup: function() {
      var k, ref, v;
      ref = this.defaultConfig;
      for (k in ref) {
        v = ref[k];
        atom.config.set(k, v);
      }
      return this.setupPath();
    },
    setupPath: function() {
      var current;
      current = atom.config.get('julia-client.juliaPath');
      if ((current != null) && current !== 'julia') {
        return;
      }
      return pathfinder.juliaShell().then(function(valid) {
        if (!valid) {
          return pathfinder.getpath().then(function(p) {
            if (p != null) {
              atom.config.set('julia-client.juliaPath', p);
              return atom.notifications.addInfo("We found Julia on your system", {
                description: "Juno is configured to boot Julia from: `" + p + "`\nThis path can be changed from `Juno → Settings…`."
              });
            }
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy91YmVyLWp1bm8vbGliL3ViZXItanVuby5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVI7O0VBQ2IsTUFBQSxHQUFTLE9BQUEsQ0FBUSx5QkFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsT0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsK0dBRmI7T0FERjtLQURGO0lBTUEsUUFBQSxFQUFVLFNBQUE7TUFDUixNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUNBLElBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUFWO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO2FBQ0EsUUFBUSxDQUFDLEtBQVQsQ0FBZSxTQUFBO2VBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxJQUFyQztNQURhLENBQWY7SUFKUSxDQU5WO0lBYUEsYUFBQSxFQUNFO01BQUEsbUJBQUEsRUFBcUIsTUFBckI7TUFDQSxtQ0FBQSxFQUFxQyxJQURyQztNQUVBLHNDQUFBLEVBQXdDLElBRnhDO01BR0Esc0JBQUEsRUFBd0IsSUFIeEI7TUFJQSxxQ0FBQSxFQUF1Qyx1REFKdkM7S0FkRjtJQW9CQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFVBQUE7QUFBQTtBQUFBLFdBQUEsUUFBQTs7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7QUFERjthQUVBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFIVyxDQXBCYjtJQXlCQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQjtNQUNWLElBQVUsaUJBQUEsSUFBYSxPQUFBLEtBQWEsT0FBcEM7QUFBQSxlQUFBOzthQUNBLFVBQVUsQ0FBQyxVQUFYLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUFDLEtBQUQ7UUFDM0IsSUFBRyxDQUFJLEtBQVA7aUJBQ0UsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQUMsQ0FBRDtZQUN4QixJQUFHLFNBQUg7Y0FDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLENBQTFDO3FCQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsK0JBQTNCLEVBQ0U7Z0JBQUEsV0FBQSxFQUNFLDBDQUFBLEdBQzBDLENBRDFDLEdBQzRDLHNEQUY5QztlQURGLEVBRkY7O1VBRHdCLENBQTFCLEVBREY7O01BRDJCLENBQTdCO0lBSFMsQ0F6Qlg7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJwYWNrYWdlcyA9IHJlcXVpcmUgJy4vcGFja2FnZXMnXG5wYXRoZmluZGVyID0gcmVxdWlyZSAnLi9wYXRoJ1xuY29tcGF0ID0gcmVxdWlyZSAnLi9pbmNvbXBhdGlibGUtcGFja2FnZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGRpc2FibGU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJEb24ndCBydW4gaW5zdGFsbGF0aW9uIG9uIEF0b20gc3RhcnR1cC4gKFRoaXMgb3B0aW9uIGlzIHNldCBhdXRvbWF0aWNhbGx5IG9uY2UgdGhlIGluc3RhbGxhdGlvbiBpcyBjb21wbGV0ZS4pXCJcblxuICBhY3RpdmF0ZTogLT5cbiAgICBjb21wYXQuY2hlY2tJbmNvbXBhdGlibGUoKVxuICAgIHJldHVybiBpZiBhdG9tLmNvbmZpZy5nZXQgJ3ViZXItanVuby5kaXNhYmxlJ1xuICAgIEBjb25maWdTZXR1cCgpXG4gICAgcGFja2FnZXMuc2V0dXAgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndWJlci1qdW5vLmRpc2FibGUnLCB0cnVlXG5cbiAgZGVmYXVsdENvbmZpZzpcbiAgICAndG9vbC1iYXIucG9zaXRpb24nOiAnTGVmdCdcbiAgICAnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5lbmFibGVNZW51JzogdHJ1ZVxuICAgICdqdWxpYS1jbGllbnQudWlPcHRpb25zLmVuYWJsZVRvb2xCYXInOiB0cnVlXG4gICAgJ2VkaXRvci5zY3JvbGxQYXN0RW5kJzogdHJ1ZVxuICAgICdhdXRvY29tcGxldGUtcGx1cy5jb25maXJtQ29tcGxldGlvbic6IFwidGFiIGFsd2F5cywgZW50ZXIgd2hlbiBzdWdnZXN0aW9uIGV4cGxpY2l0bHkgc2VsZWN0ZWRcIlxuXG4gIGNvbmZpZ1NldHVwOiAtPlxuICAgIGZvciBrLCB2IG9mIEBkZWZhdWx0Q29uZmlnXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgaywgdlxuICAgIEBzZXR1cFBhdGgoKVxuXG4gIHNldHVwUGF0aDogLT5cbiAgICBjdXJyZW50ID0gYXRvbS5jb25maWcuZ2V0ICdqdWxpYS1jbGllbnQuanVsaWFQYXRoJ1xuICAgIHJldHVybiBpZiBjdXJyZW50PyBhbmQgY3VycmVudCBpc250ICdqdWxpYSdcbiAgICBwYXRoZmluZGVyLmp1bGlhU2hlbGwoKS50aGVuICh2YWxpZCkgLT5cbiAgICAgIGlmIG5vdCB2YWxpZFxuICAgICAgICBwYXRoZmluZGVyLmdldHBhdGgoKS50aGVuIChwKSAtPlxuICAgICAgICAgIGlmIHA/XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2p1bGlhLWNsaWVudC5qdWxpYVBhdGgnLCBwXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcIldlIGZvdW5kIEp1bGlhIG9uIHlvdXIgc3lzdGVtXCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIEp1bm8gaXMgY29uZmlndXJlZCB0byBib290IEp1bGlhIGZyb206IGAje3B9YFxuICAgICAgICAgICAgICAgIFRoaXMgcGF0aCBjYW4gYmUgY2hhbmdlZCBmcm9tIGBKdW5vIOKGkiBTZXR0aW5nc+KApmAuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4iXX0=
