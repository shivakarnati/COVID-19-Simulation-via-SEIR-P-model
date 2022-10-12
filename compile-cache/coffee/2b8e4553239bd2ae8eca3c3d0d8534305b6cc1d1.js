(function() {
  var INK_LINK, INK_VERSION_COMPAT, JuliaClient, LANGUAGE_JULIA_LINK, LATEST_RELEASE_NOTE_VERSION, commands, config, etch, menu, release, semver, settings, toolbar;

  etch = require('etch');

  commands = require('./package/commands');

  config = require('./package/config');

  menu = require('./package/menu');

  settings = require('./package/settings');

  release = require('./package/release-note');

  toolbar = require('./package/toolbar');

  semver = require('semver');

  INK_VERSION_COMPAT = "^0.12.4";

  LATEST_RELEASE_NOTE_VERSION = "0.12.6";

  INK_LINK = '[`ink`](https://github.com/JunoLab/atom-ink)';

  LANGUAGE_JULIA_LINK = '[`language-julia`](https://github.com/JuliaEditorSupport/atom-language-julia)';

  module.exports = JuliaClient = {
    misc: require('./misc'),
    ui: require('./ui'),
    connection: require('./connection'),
    runtime: require('./runtime'),
    activate: function(state) {
      var i, len, ref, x;
      etch.setScheduler(atom.views);
      process.env['TERM'] = 'xterm-256color';
      commands.activate(this);
      ref = [menu, this.connection, this.runtime];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        x.activate();
      }
      this.ui.activate(this.connection.client);
      return this.requireDeps((function(_this) {
        return function() {
          settings.updateSettings();
          if (atom.config.get('julia-client.firstBoot')) {
            return _this.ui.layout.queryDefaultLayout();
          } else {
            if (atom.config.get('julia-client.uiOptions.layouts.openDefaultPanesOnStartUp')) {
              return setTimeout((function() {
                return _this.ui.layout.restoreDefaultLayout();
              }), 150);
            }
          }
        };
      })(this));
    },
    requireDeps: function(fn) {
      var isLoaded;
      isLoaded = atom.packages.isPackageLoaded("ink") && atom.packages.isPackageLoaded("language-julia");
      if (isLoaded) {
        return fn();
      } else {
        return require('atom-package-deps').install('julia-client').then((function(_this) {
          return function() {
            return _this.enableDeps(fn);
          };
        })(this))["catch"](function(err) {
          console.error(err);
          return atom.notifications.addError('Installing Juno\'s dependencies failed.', {
            description: "Juno requires the packages " + INK_LINK + " and " + LANGUAGE_JULIA_LINK + " to run.\nPlease install them manually via `File -> Settings -> Packages`,\nor open a terminal and run\n\n    apm install ink\n    apm install language-julia\n\nand then restart Atom.",
            dismissable: true
          });
        });
      }
    },
    enableDeps: function(fn) {
      var inkVersion, isEnabled;
      isEnabled = atom.packages.isPackageLoaded("ink") && atom.packages.isPackageLoaded("language-julia");
      if (isEnabled) {
        return fn();
      } else {
        atom.packages.enablePackage('ink');
        atom.packages.enablePackage('language-julia');
        if (atom.packages.isPackageLoaded("ink") && atom.packages.isPackageLoaded("language-julia")) {
          atom.notifications.addSuccess("Automatically enabled Juno's dependencies.", {
            description: "Juno requires the " + INK_LINK + " and " + LANGUAGE_JULIA_LINK + " packages.\nWe've automatically enabled them for you.",
            dismissable: true
          });
          inkVersion = atom.packages.loadedPackages["ink"].metadata.version;
          if (!atom.devMode && !semver.satisfies(inkVersion, INK_VERSION_COMPAT)) {
            atom.notifications.addWarning("Potentially incompatible `ink` version detected.", {
              description: "Please make sure to upgrade " + INK_LINK + " to a version compatible with `" + INK_VERSION_COMPAT + "`.\nThe currently installed version is `" + inkVersion + "`.\n\nIf you cannot install an appropriate version via via `File -> Settings -> Packages`,\nopen a terminal and run\n\n    apm install ink@x.y.z\n\nwhere `x.y.z` is satisfies `" + INK_VERSION_COMPAT + "`.",
              dismissable: true
            });
          }
          return fn();
        } else {
          return atom.notifications.addError("Failed to enable Juno's dependencies.", {
            description: "Juno requires the " + INK_LINK + " and " + LANGUAGE_JULIA_LINK + " packages.\nPlease install them manually via `File -> Settings -> Packages`,\nor open a terminal and run\n\n    apm install ink\n    apm install language-julia\n\nand then restart Atom.",
            dismissable: true
          });
        }
      }
    },
    config: config,
    deactivate: function() {
      var i, len, ref, results, x;
      ref = [commands, menu, toolbar, release, this.connection, this.runtime, this.ui];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push(x.deactivate());
      }
      return results;
    },
    consumeInk: function(ink) {
      var err, i, len, ref, v, x;
      commands.ink = ink;
      ref = [this.connection, this.runtime, this.ui];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        x.consumeInk(ink);
      }
      try {
        v = atom.config.get('julia-client.currentVersion');
        if (v !== LATEST_RELEASE_NOTE_VERSION) {
          return release.activate(ink, LATEST_RELEASE_NOTE_VERSION);
        } else {
          return release.activate(ink);
        }
      } catch (error) {
        err = error;
        return console.log(err);
      } finally {
        atom.config.set('julia-client.currentVersion', LATEST_RELEASE_NOTE_VERSION);
      }
    },
    consumeStatusBar: function(bar) {
      return this.runtime.consumeStatusBar(bar);
    },
    consumeToolBar: function(bar) {
      return toolbar.consumeToolBar(bar);
    },
    consumeGetServerConfig: function(conf) {
      return this.connection.consumeGetServerConfig(conf);
    },
    consumeGetServerName: function(name) {
      return this.connection.consumeGetServerName(name);
    },
    consumeDatatip: function(datatipService) {
      return this.runtime.consumeDatatip(datatipService);
    },
    provideClient: function() {
      return this.connection.client;
    },
    provideAutoComplete: function() {
      return this.runtime.provideAutoComplete();
    },
    provideHyperclick: function() {
      return this.runtime.provideHyperclick();
    },
    handleURI: function(parsedURI) {
      return this.runtime.handleURI(parsedURI);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2p1bGlhLWNsaWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSOztFQUNYLE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxnQkFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSOztFQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsd0JBQVI7O0VBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxtQkFBUjs7RUFDVixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBR1Qsa0JBQUEsR0FBc0I7O0VBQ3RCLDJCQUFBLEdBQStCOztFQUUvQixRQUFBLEdBQXNCOztFQUN0QixtQkFBQSxHQUFzQjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsV0FBQSxHQUNmO0lBQUEsSUFBQSxFQUFZLE9BQUEsQ0FBUSxRQUFSLENBQVo7SUFDQSxFQUFBLEVBQVksT0FBQSxDQUFRLE1BQVIsQ0FEWjtJQUVBLFVBQUEsRUFBWSxPQUFBLENBQVEsY0FBUixDQUZaO0lBR0EsT0FBQSxFQUFZLE9BQUEsQ0FBUSxXQUFSLENBSFo7SUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLElBQUksQ0FBQyxZQUFMLENBQWtCLElBQUksQ0FBQyxLQUF2QjtNQUNBLE9BQU8sQ0FBQyxHQUFJLENBQUEsTUFBQSxDQUFaLEdBQXNCO01BQ3RCLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCO0FBQ0E7QUFBQSxXQUFBLHFDQUFBOztRQUFBLENBQUMsQ0FBQyxRQUFGLENBQUE7QUFBQTtN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YUFBUyxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLEdBQTFCO0lBQVQsQ0FuSGxCO0lBcUhBLGNBQUEsRUFBZ0IsU0FBQyxHQUFEO2FBQVMsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsR0FBdkI7SUFBVCxDQXJIaEI7SUF1SEEsc0JBQUEsRUFBd0IsU0FBQyxJQUFEO2FBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxzQkFBWixDQUFtQyxJQUFuQztJQUFWLENBdkh4QjtJQXlIQSxvQkFBQSxFQUFzQixTQUFDLElBQUQ7YUFBVSxJQUFDLENBQUEsVUFBVSxDQUFDLG9CQUFaLENBQWlDLElBQWpDO0lBQVYsQ0F6SHRCO0lBMkhBLGNBQUEsRUFBZ0IsU0FBQyxjQUFEO2FBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixjQUF4QjtJQUFwQixDQTNIaEI7SUE2SEEsYUFBQSxFQUFlLFNBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDO0lBQWYsQ0E3SGY7SUErSEEsbUJBQUEsRUFBcUIsU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsbUJBQVQsQ0FBQTtJQUFILENBL0hyQjtJQWlJQSxpQkFBQSxFQUFtQixTQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxpQkFBVCxDQUFBO0lBQUgsQ0FqSW5CO0lBbUlBLFNBQUEsRUFBVyxTQUFDLFNBQUQ7YUFBZSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsU0FBbkI7SUFBZixDQW5JWDs7QUFsQkYiLCJzb3VyY2VzQ29udGVudCI6WyJldGNoID0gcmVxdWlyZSAnZXRjaCdcblxuY29tbWFuZHMgPSByZXF1aXJlICcuL3BhY2thZ2UvY29tbWFuZHMnXG5jb25maWcgPSByZXF1aXJlICcuL3BhY2thZ2UvY29uZmlnJ1xubWVudSA9IHJlcXVpcmUgJy4vcGFja2FnZS9tZW51J1xuc2V0dGluZ3MgPSByZXF1aXJlICcuL3BhY2thZ2Uvc2V0dGluZ3MnXG5yZWxlYXNlID0gcmVxdWlyZSAnLi9wYWNrYWdlL3JlbGVhc2Utbm90ZSdcbnRvb2xiYXIgPSByZXF1aXJlICcuL3BhY2thZ2UvdG9vbGJhcidcbnNlbXZlciA9IHJlcXVpcmUgJ3NlbXZlcidcblxuIyBUT0RPOiBVcGRhdGUgbWUgd2hlbiB0YWdnaW5nIGEgbmV3IHJlbGFzZSAoYW5kIHJlbGVhc2Ugbm90ZSlcbklOS19WRVJTSU9OX0NPTVBBVCAgPSBcIl4wLjEyLjRcIlxuTEFURVNUX1JFTEVBU0VfTk9URV9WRVJTSU9OICA9IFwiMC4xMi42XCJcblxuSU5LX0xJTksgICAgICAgICAgICA9ICdbYGlua2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9KdW5vTGFiL2F0b20taW5rKSdcbkxBTkdVQUdFX0pVTElBX0xJTksgPSAnW2BsYW5ndWFnZS1qdWxpYWBdKGh0dHBzOi8vZ2l0aHViLmNvbS9KdWxpYUVkaXRvclN1cHBvcnQvYXRvbS1sYW5ndWFnZS1qdWxpYSknXG5cbm1vZHVsZS5leHBvcnRzID0gSnVsaWFDbGllbnQgPVxuICBtaXNjOiAgICAgICByZXF1aXJlICcuL21pc2MnXG4gIHVpOiAgICAgICAgIHJlcXVpcmUgJy4vdWknXG4gIGNvbm5lY3Rpb246IHJlcXVpcmUgJy4vY29ubmVjdGlvbidcbiAgcnVudGltZTogICAgcmVxdWlyZSAnLi9ydW50aW1lJ1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgZXRjaC5zZXRTY2hlZHVsZXIoYXRvbS52aWV3cylcbiAgICBwcm9jZXNzLmVudlsnVEVSTSddID0gJ3h0ZXJtLTI1NmNvbG9yJ1xuICAgIGNvbW1hbmRzLmFjdGl2YXRlIEBcbiAgICB4LmFjdGl2YXRlKCkgZm9yIHggaW4gW21lbnUsIEBjb25uZWN0aW9uLCBAcnVudGltZV1cbiAgICBAdWkuYWN0aXZhdGUgQGNvbm5lY3Rpb24uY2xpZW50XG5cbiAgICBAcmVxdWlyZURlcHMgPT5cbiAgICAgIHNldHRpbmdzLnVwZGF0ZVNldHRpbmdzKClcblxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuZmlyc3RCb290JylcbiAgICAgICAgQHVpLmxheW91dC5xdWVyeURlZmF1bHRMYXlvdXQoKVxuICAgICAgZWxzZVxuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5vcGVuRGVmYXVsdFBhbmVzT25TdGFydFVwJylcbiAgICAgICAgICBzZXRUaW1lb3V0ICg9PiBAdWkubGF5b3V0LnJlc3RvcmVEZWZhdWx0TGF5b3V0KCkpLCAxNTBcblxuICByZXF1aXJlRGVwczogKGZuKSAtPlxuICAgIGlzTG9hZGVkID0gYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoXCJpbmtcIikgYW5kIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwibGFuZ3VhZ2UtanVsaWFcIilcblxuICAgIGlmIGlzTG9hZGVkXG4gICAgICBmbigpXG4gICAgZWxzZVxuICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdqdWxpYS1jbGllbnQnKVxuICAgICAgICAudGhlbiAgPT4gQGVuYWJsZURlcHMgZm5cbiAgICAgICAgLmNhdGNoIChlcnIpIC0+XG4gICAgICAgICAgY29uc29sZS5lcnJvciBlcnJcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgJ0luc3RhbGxpbmcgSnVub1xcJ3MgZGVwZW5kZW5jaWVzIGZhaWxlZC4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICBKdW5vIHJlcXVpcmVzIHRoZSBwYWNrYWdlcyAje0lOS19MSU5LfSBhbmQgI3tMQU5HVUFHRV9KVUxJQV9MSU5LfSB0byBydW4uXG4gICAgICAgICAgICAgIFBsZWFzZSBpbnN0YWxsIHRoZW0gbWFudWFsbHkgdmlhIGBGaWxlIC0+IFNldHRpbmdzIC0+IFBhY2thZ2VzYCxcbiAgICAgICAgICAgICAgb3Igb3BlbiBhIHRlcm1pbmFsIGFuZCBydW5cblxuICAgICAgICAgICAgICAgICAgYXBtIGluc3RhbGwgaW5rXG4gICAgICAgICAgICAgICAgICBhcG0gaW5zdGFsbCBsYW5ndWFnZS1qdWxpYVxuXG4gICAgICAgICAgICAgIGFuZCB0aGVuIHJlc3RhcnQgQXRvbS5cbiAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gIGVuYWJsZURlcHM6IChmbikgLT5cbiAgICBpc0VuYWJsZWQgPSBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZChcImlua1wiKSBhbmQgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoXCJsYW5ndWFnZS1qdWxpYVwiKVxuXG4gICAgaWYgaXNFbmFibGVkXG4gICAgICBmbigpXG4gICAgZWxzZVxuICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKCdpbmsnKVxuICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKCdsYW5ndWFnZS1qdWxpYScpXG5cbiAgICAgIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwiaW5rXCIpIGFuZCBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZChcImxhbmd1YWdlLWp1bGlhXCIpXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiQXV0b21hdGljYWxseSBlbmFibGVkIEp1bm8ncyBkZXBlbmRlbmNpZXMuXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIEp1bm8gcmVxdWlyZXMgdGhlICN7SU5LX0xJTkt9IGFuZCAje0xBTkdVQUdFX0pVTElBX0xJTkt9IHBhY2thZ2VzLlxuICAgICAgICAgICAgV2UndmUgYXV0b21hdGljYWxseSBlbmFibGVkIHRoZW0gZm9yIHlvdS5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG5cbiAgICAgICAgaW5rVmVyc2lvbiA9IGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbXCJpbmtcIl0ubWV0YWRhdGEudmVyc2lvblxuICAgICAgICBpZiBub3QgYXRvbS5kZXZNb2RlIGFuZCBub3Qgc2VtdmVyLnNhdGlzZmllcyhpbmtWZXJzaW9uLCBJTktfVkVSU0lPTl9DT01QQVQpXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgXCJQb3RlbnRpYWxseSBpbmNvbXBhdGlibGUgYGlua2AgdmVyc2lvbiBkZXRlY3RlZC5cIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgUGxlYXNlIG1ha2Ugc3VyZSB0byB1cGdyYWRlICN7SU5LX0xJTkt9IHRvIGEgdmVyc2lvbiBjb21wYXRpYmxlIHdpdGggYCN7SU5LX1ZFUlNJT05fQ09NUEFUfWAuXG4gICAgICAgICAgICAgIFRoZSBjdXJyZW50bHkgaW5zdGFsbGVkIHZlcnNpb24gaXMgYCN7aW5rVmVyc2lvbn1gLlxuXG4gICAgICAgICAgICAgIElmIHlvdSBjYW5ub3QgaW5zdGFsbCBhbiBhcHByb3ByaWF0ZSB2ZXJzaW9uIHZpYSB2aWEgYEZpbGUgLT4gU2V0dGluZ3MgLT4gUGFja2FnZXNgLFxuICAgICAgICAgICAgICBvcGVuIGEgdGVybWluYWwgYW5kIHJ1blxuXG4gICAgICAgICAgICAgICAgICBhcG0gaW5zdGFsbCBpbmtAeC55LnpcblxuICAgICAgICAgICAgICB3aGVyZSBgeC55LnpgIGlzIHNhdGlzZmllcyBgI3tJTktfVkVSU0lPTl9DT01QQVR9YC5cbiAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gICAgICAgIGZuKClcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiRmFpbGVkIHRvIGVuYWJsZSBKdW5vJ3MgZGVwZW5kZW5jaWVzLlwiLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICBKdW5vIHJlcXVpcmVzIHRoZSAje0lOS19MSU5LfSBhbmQgI3tMQU5HVUFHRV9KVUxJQV9MSU5LfSBwYWNrYWdlcy5cbiAgICAgICAgICAgIFBsZWFzZSBpbnN0YWxsIHRoZW0gbWFudWFsbHkgdmlhIGBGaWxlIC0+IFNldHRpbmdzIC0+IFBhY2thZ2VzYCxcbiAgICAgICAgICAgIG9yIG9wZW4gYSB0ZXJtaW5hbCBhbmQgcnVuXG5cbiAgICAgICAgICAgICAgICBhcG0gaW5zdGFsbCBpbmtcbiAgICAgICAgICAgICAgICBhcG0gaW5zdGFsbCBsYW5ndWFnZS1qdWxpYVxuXG4gICAgICAgICAgICBhbmQgdGhlbiByZXN0YXJ0IEF0b20uXG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gIGNvbmZpZzogY29uZmlnXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICB4LmRlYWN0aXZhdGUoKSBmb3IgeCBpbiBbY29tbWFuZHMsIG1lbnUsIHRvb2xiYXIsIHJlbGVhc2UsIEBjb25uZWN0aW9uLCBAcnVudGltZSwgQHVpXVxuXG4gIGNvbnN1bWVJbms6IChpbmspIC0+XG4gICAgY29tbWFuZHMuaW5rID0gaW5rXG4gICAgeC5jb25zdW1lSW5rIGluayBmb3IgeCBpbiBbQGNvbm5lY3Rpb24sIEBydW50aW1lLCBAdWldXG4gICAgdHJ5XG4gICAgICB2ID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuY3VycmVudFZlcnNpb24nKVxuICAgICAgaWYgdiBpc250IExBVEVTVF9SRUxFQVNFX05PVEVfVkVSU0lPTlxuICAgICAgICByZWxlYXNlLmFjdGl2YXRlKGluaywgTEFURVNUX1JFTEVBU0VfTk9URV9WRVJTSU9OKVxuICAgICAgZWxzZVxuICAgICAgICByZWxlYXNlLmFjdGl2YXRlKGluaylcbiAgICBjYXRjaCBlcnJcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICBmaW5hbGx5XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2p1bGlhLWNsaWVudC5jdXJyZW50VmVyc2lvbicsIExBVEVTVF9SRUxFQVNFX05PVEVfVkVSU0lPTilcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoYmFyKSAtPiBAcnVudGltZS5jb25zdW1lU3RhdHVzQmFyIGJhclxuXG4gIGNvbnN1bWVUb29sQmFyOiAoYmFyKSAtPiB0b29sYmFyLmNvbnN1bWVUb29sQmFyIGJhclxuXG4gIGNvbnN1bWVHZXRTZXJ2ZXJDb25maWc6IChjb25mKSAtPiBAY29ubmVjdGlvbi5jb25zdW1lR2V0U2VydmVyQ29uZmlnKGNvbmYpXG5cbiAgY29uc3VtZUdldFNlcnZlck5hbWU6IChuYW1lKSAtPiBAY29ubmVjdGlvbi5jb25zdW1lR2V0U2VydmVyTmFtZShuYW1lKVxuXG4gIGNvbnN1bWVEYXRhdGlwOiAoZGF0YXRpcFNlcnZpY2UpIC0+IEBydW50aW1lLmNvbnN1bWVEYXRhdGlwIGRhdGF0aXBTZXJ2aWNlXG5cbiAgcHJvdmlkZUNsaWVudDogLT4gQGNvbm5lY3Rpb24uY2xpZW50XG5cbiAgcHJvdmlkZUF1dG9Db21wbGV0ZTogLT4gQHJ1bnRpbWUucHJvdmlkZUF1dG9Db21wbGV0ZSgpXG5cbiAgcHJvdmlkZUh5cGVyY2xpY2s6IC0+IEBydW50aW1lLnByb3ZpZGVIeXBlcmNsaWNrKClcblxuICBoYW5kbGVVUkk6IChwYXJzZWRVUkkpIC0+IEBydW50aW1lLmhhbmRsZVVSSSBwYXJzZWRVUklcbiJdfQ==
