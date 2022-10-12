(function() {
  var path, requirements;

  path = require('path');

  requirements = ['tool-bar', 'indent-detective', 'latex-completions', 'hyperclick', 'language-julia', 'ink', 'julia-client'];

  module.exports = {
    setup: function(cb) {
      return atom.packages.activatePackage('settings-view').then((function(_this) {
        return function(p) {
          var PackageManager;
          if (p == null) {
            return _this.settingsError();
          }
          PackageManager = require(path.join(p.path, 'lib', 'package-manager'));
          _this.packageManager = new PackageManager;
          if (_this.allInstalled(requirements)) {
            return cb();
          }
          _this.setupInfo();
          return _this.installAll(requirements.slice(), cb);
        };
      })(this));
    },
    allInstalled: function(pkgs) {
      var i, len, pkg;
      for (i = 0, len = pkgs.length; i < len; i++) {
        pkg = pkgs[i];
        if (!this.packageManager.isPackageInstalled(pkg)) {
          return false;
        }
      }
      return true;
    },
    install: function(name, cb) {
      if (this.packageManager.isPackageInstalled(name)) {
        return typeof cb === "function" ? cb() : void 0;
      }
      atom.notifications.addInfo("Installing `" + name + "`");
      return this.packageManager.getPackage(name).then((function(_this) {
        return function(pkg) {
          return _this.packageManager.install(pkg, function(err) {
            if (err != null) {
              return _this.installError(name, err);
            } else {
              atom.notifications.addSuccess("Juno: Installed package `" + name + "`");
              return typeof cb === "function" ? cb() : void 0;
            }
          });
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          return _this.retreiveError(name, err);
        };
      })(this));
    },
    installAll: function(pkgs, cb) {
      var pkg;
      if ((pkg = pkgs.shift()) != null) {
        return this.install(pkg, (function(_this) {
          return function() {
            return _this.installAll(pkgs, cb);
          };
        })(this));
      } else {
        this.setupnote.dismiss();
        atom.notifications.addSuccess("Juno: Success!", {
          description: "We've set up the Atom packages for you."
        });
        return typeof cb === "function" ? cb() : void 0;
      }
    },
    setupInfo: function() {
      return this.setupnote = atom.notifications.addInfo("Juno: Installing Atom packages", {
        description: "This will take a moment -- hang tight ! We'll let you know once it's done.",
        dismissable: true
      });
    },
    settingsError: function() {
      return atom.notifications.addError("Juno: Couldn't find `settings-view` package.", {
        dismissable: true
      });
    },
    retreiveError: function(name, err) {
      this.setupnote.dismiss();
      return atom.notifications.addError("Juno: Error downloading package info for `" + name + "`", {
        description: "Please check your internet connection, or report this to\nhttps://github.com/JunoLab/Juno.jl/issues or https://discourse.julialang.org\nand we'll try to help.\n\n    " + err,
        dismissable: true
      });
    },
    installError: function(name, err) {
      this.setupnote.dismiss();
      return atom.notifications.addError("Juno: Error installing package `" + name + "`", {
        description: "Please check your internet connection, or report this to\nhttps://github.com/JunoLab/Juno.jl/issues or https://discourse.julialang.org\nand we'll try to help.\n\n    " + err,
        dismissable: true
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy91YmVyLWp1bm8vbGliL3BhY2thZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLFlBQUEsR0FBZSxDQUNiLFVBRGEsRUFFYixrQkFGYSxFQUdiLG1CQUhhLEVBSWIsWUFKYSxFQUtiLGdCQUxhLEVBTWIsS0FOYSxFQU9iLGNBUGE7O0VBVWYsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxTQUFDLEVBQUQ7YUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUNsRCxjQUFBO1VBQUEsSUFBK0IsU0FBL0I7QUFBQSxtQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQVA7O1VBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFDLENBQUMsSUFBWixFQUFrQixLQUFsQixFQUF5QixpQkFBekIsQ0FBUjtVQUNqQixLQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJO1VBRXRCLElBQWUsS0FBQyxDQUFBLFlBQUQsQ0FBYyxZQUFkLENBQWY7QUFBQSxtQkFBTyxFQUFBLENBQUEsRUFBUDs7VUFDQSxLQUFDLENBQUEsU0FBRCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxVQUFELENBQVksWUFBWSxDQUFDLEtBQWIsQ0FBQSxDQUFaLEVBQWtDLEVBQWxDO1FBUGtEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRDtJQURLLENBQVA7SUFVQSxZQUFBLEVBQWMsU0FBQyxJQUFEO0FBQ1osVUFBQTtBQUFBLFdBQUEsc0NBQUE7O1FBQ0UsSUFB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Q29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblxucmVxdWlyZW1lbnRzID0gW1xuICAndG9vbC1iYXInXG4gICdpbmRlbnQtZGV0ZWN0aXZlJ1xuICAnbGF0ZXgtY29tcGxldGlvbnMnXG4gICdoeXBlcmNsaWNrJ1xuICAnbGFuZ3VhZ2UtanVsaWEnXG4gICdpbmsnXG4gICdqdWxpYS1jbGllbnQnXG5dXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc2V0dXA6IChjYikgLT5cbiAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnc2V0dGluZ3MtdmlldycpLnRoZW4gKHApID0+XG4gICAgICByZXR1cm4gQHNldHRpbmdzRXJyb3IoKSB1bmxlc3MgcD9cbiAgICAgIFBhY2thZ2VNYW5hZ2VyID0gcmVxdWlyZSBwYXRoLmpvaW4gcC5wYXRoLCAnbGliJywgJ3BhY2thZ2UtbWFuYWdlcidcbiAgICAgIEBwYWNrYWdlTWFuYWdlciA9IG5ldyBQYWNrYWdlTWFuYWdlclxuXG4gICAgICByZXR1cm4gY2IoKSBpZiBAYWxsSW5zdGFsbGVkIHJlcXVpcmVtZW50c1xuICAgICAgQHNldHVwSW5mbygpXG4gICAgICBAaW5zdGFsbEFsbCByZXF1aXJlbWVudHMuc2xpY2UoKSwgY2JcblxuICBhbGxJbnN0YWxsZWQ6IChwa2dzKSAtPlxuICAgIGZvciBwa2cgaW4gcGtnc1xuICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBAcGFja2FnZU1hbmFnZXIuaXNQYWNrYWdlSW5zdGFsbGVkIHBrZ1xuICAgIHJldHVybiB0cnVlXG5cbiAgaW5zdGFsbDogKG5hbWUsIGNiKSAtPlxuICAgIHJldHVybiBjYj8oKSBpZiBAcGFja2FnZU1hbmFnZXIuaXNQYWNrYWdlSW5zdGFsbGVkIG5hbWVcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcIkluc3RhbGxpbmcgYCN7bmFtZX1gXCJcbiAgICBAcGFja2FnZU1hbmFnZXIuZ2V0UGFja2FnZShuYW1lKVxuICAgICAgLnRoZW4gKHBrZykgPT5cbiAgICAgICAgQHBhY2thZ2VNYW5hZ2VyLmluc3RhbGwgcGtnLCAoZXJyKSA9PlxuICAgICAgICAgIGlmIGVycj9cbiAgICAgICAgICAgIEBpbnN0YWxsRXJyb3IgbmFtZSwgZXJyXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJKdW5vOiBJbnN0YWxsZWQgcGFja2FnZSBgI3tuYW1lfWBcIlxuICAgICAgICAgICAgY2I/KClcbiAgICAgIC5jYXRjaCAoZXJyKSA9PiBAcmV0cmVpdmVFcnJvciBuYW1lLCBlcnJcblxuICBpbnN0YWxsQWxsOiAocGtncywgY2IpIC0+XG4gICAgaWYgKHBrZyA9IHBrZ3Muc2hpZnQoKSk/XG4gICAgICBAaW5zdGFsbCBwa2csID0+XG4gICAgICAgIEBpbnN0YWxsQWxsIHBrZ3MsIGNiXG4gICAgZWxzZVxuICAgICAgQHNldHVwbm90ZS5kaXNtaXNzKClcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiSnVubzogU3VjY2VzcyFcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2UndmUgc2V0IHVwIHRoZSBBdG9tIHBhY2thZ2VzIGZvciB5b3UuXCJcbiAgICAgIGNiPygpXG5cbiAgc2V0dXBJbmZvOiAtPlxuICAgIEBzZXR1cG5vdGUgPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcIkp1bm86IEluc3RhbGxpbmcgQXRvbSBwYWNrYWdlc1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGhpcyB3aWxsIHRha2UgYSBtb21lbnQgLS0gaGFuZyB0aWdodCAhIFdlJ2xsIGxldCB5b3Uga25vdyBvbmNlIGl0J3MgZG9uZS5cIlxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcblxuICBzZXR0aW5nc0Vycm9yOiAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkp1bm86IENvdWxkbid0IGZpbmQgYHNldHRpbmdzLXZpZXdgIHBhY2thZ2UuXCIsXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gIHJldHJlaXZlRXJyb3I6IChuYW1lLCBlcnIpIC0+XG4gICAgQHNldHVwbm90ZS5kaXNtaXNzKClcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJKdW5vOiBFcnJvciBkb3dubG9hZGluZyBwYWNrYWdlIGluZm8gZm9yIGAje25hbWV9YFwiLFxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgXCJcIlwiXG4gICAgICBQbGVhc2UgY2hlY2sgeW91ciBpbnRlcm5ldCBjb25uZWN0aW9uLCBvciByZXBvcnQgdGhpcyB0b1xuICAgICAgaHR0cHM6Ly9naXRodWIuY29tL0p1bm9MYWIvSnVuby5qbC9pc3N1ZXMgb3IgaHR0cHM6Ly9kaXNjb3Vyc2UuanVsaWFsYW5nLm9yZ1xuICAgICAgYW5kIHdlJ2xsIHRyeSB0byBoZWxwLlxuXG4gICAgICAgICAgI3tlcnJ9XG4gICAgICBcIlwiXCJcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gIGluc3RhbGxFcnJvcjogKG5hbWUsIGVycikgLT5cbiAgICBAc2V0dXBub3RlLmRpc21pc3MoKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkp1bm86IEVycm9yIGluc3RhbGxpbmcgcGFja2FnZSBgI3tuYW1lfWBcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiXCJcIlxuICAgICAgUGxlYXNlIGNoZWNrIHlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbiwgb3IgcmVwb3J0IHRoaXMgdG9cbiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9KdW5vTGFiL0p1bm8uamwvaXNzdWVzIG9yIGh0dHBzOi8vZGlzY291cnNlLmp1bGlhbGFuZy5vcmdcbiAgICAgIGFuZCB3ZSdsbCB0cnkgdG8gaGVscC5cblxuICAgICAgICAgICN7ZXJyfVxuICAgICAgXCJcIlwiXG4gICAgZGlzbWlzc2FibGU6IHRydWVcbiJdfQ==
