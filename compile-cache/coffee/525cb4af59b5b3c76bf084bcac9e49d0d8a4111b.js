(function() {
  var client, tcp;

  client = require('./client');

  tcp = require('./process/tcp');

  module.exports = {
    activate: function() {
      client.handleBasic('install', (function(_this) {
        return function() {
          var ref;
          if ((ref = _this.note) != null) {
            ref.dismiss();
          }
          return atom.notifications.addError("Error installing Atom.jl package", {
            description: "Go to the `Packages -> Juno -> Open REPL` menu and\nrun `Pkg.add(\"Atom\")` in Julia, then try again.\nIf you still see an issue, please report it to:\n\nhttps://discourse.julialang.org/",
            dismissable: true
          });
        };
      })(this));
      client.handleBasic('load', (function(_this) {
        return function() {
          var ref;
          if ((ref = _this.note) != null) {
            ref.dismiss();
          }
          return atom.notifications.addError("Error loading Atom.jl package", {
            description: "Go to the `Packages -> Juno -> Open REPL` menu and\nrun `Pkg.update()` in Julia, then try again.\nIf you still see an issue, please report it to:\n\nhttps://discourse.julialang.org/",
            dismissable: true
          });
        };
      })(this));
      client.handleBasic('installing', (function(_this) {
        return function() {
          var ref;
          if ((ref = _this.note) != null) {
            ref.dismiss();
          }
          _this.note = atom.notifications.addInfo("Installing Julia packages...", {
            description: "Julia's first run will take a couple of minutes.\nSee the REPL below for progress.",
            dismissable: true
          });
          return _this.openConsole();
        };
      })(this));
      client.handleBasic('precompiling', (function(_this) {
        return function() {
          var ref;
          if ((ref = _this.note) != null) {
            ref.dismiss();
          }
          _this.note = atom.notifications.addInfo("Compiling Julia packages...", {
            description: "Julia's first run will take a couple of minutes.\nSee the REPL below for progress.",
            dismissable: true
          });
          return _this.openConsole();
        };
      })(this));
      return client.handle({
        welcome: (function(_this) {
          return function() {
            var ref;
            if ((ref = _this.note) != null) {
              ref.dismiss();
            }
            atom.notifications.addSuccess("Welcome to Juno!", {
              description: "Success! Juno is set up and ready to roll.\nTry entering `2+2` in the REPL below.",
              dismissable: true
            });
            return _this.openConsole();
          };
        })(this)
      });
    },
    openConsole: function() {
      return atom.commands.dispatch(atom.views.getView(atom.workspace), 'julia-client:open-REPL');
    },
    jlNotFound: function(path, details) {
      if (details == null) {
        details = '';
      }
      return atom.notifications.addError("Julia could not be started.", {
        description: "We tried to launch Julia from: `" + path + "`\nThis path can be changed in the settings.",
        detail: details,
        dismissable: true
      });
    },
    connectExternal: function() {
      return tcp.listen().then(function(port) {
        var code, msg;
        code = "using Atom; using Juno; Juno.connect(" + port + ")";
        msg = atom.notifications.addInfo("Connect an external process", {
          description: "To connect a Julia process running in the terminal, run the command:\n\n    " + code,
          dismissable: true,
          buttons: [
            {
              text: 'Copy',
              onDidClick: function() {
                return atom.clipboard.write(code);
              }
            }
          ]
        });
        return client.onceAttached(function() {
          if (!msg.isDismissed()) {
            msg.dismiss();
          }
          return atom.notifications.addSuccess("Julia is connected.");
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vbWVzc2FnZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUVSLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFNBQW5CLEVBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUM1QixjQUFBOztlQUFLLENBQUUsT0FBUCxDQUFBOztpQkFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLGtDQUE1QixFQUNFO1lBQUEsV0FBQSxFQUNFLDRMQURGO1lBUUEsV0FBQSxFQUFhLElBUmI7V0FERjtRQUY0QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7TUFhQSxNQUFNLENBQUMsV0FBUCxDQUFtQixNQUFuQixFQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDekIsY0FBQTs7ZUFBSyxDQUFFLE9BQVAsQ0FBQTs7aUJBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QiwrQkFBNUIsRUFDRTtZQUFBLFdBQUEsRUFDRSx1TEFERjtZQVFBLFdBQUEsRUFBYSxJQVJiO1dBREY7UUFGeUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCO01BYUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsWUFBbkIsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQy9CLGNBQUE7O2VBQUssQ0FBRSxPQUFQLENBQUE7O1VBQ0EsS0FBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDhCQUEzQixFQUNOO1lBQUEsV0FBQSxFQUNFLG9GQURGO1lBS0EsV0FBQSxFQUFhLElBTGI7V0FETTtpQkFPUixLQUFDLENBQUEsV0FBRCxDQUFBO1FBVCtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztNQVdBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CLEVBQW1DLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNqQyxjQUFBOztlQUFLLENBQUUsT0FBUCxDQUFBOztVQUNBLEtBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw2QkFBM0IsRUFDTjtZQUFBLFdBQUEsRUFDRSxvRkFERjtZQUtBLFdBQUEsRUFBYSxJQUxiO1dBRE07aUJBT1IsS0FBQyxDQUFBLFdBQUQsQ0FBQTtRQVRpQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7YUFXQSxNQUFNLENBQUMsTUFBUCxDQUFjO1FBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7QUFDckIsZ0JBQUE7O2lCQUFLLENBQUUsT0FBUCxDQUFBOztZQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsa0JBQTlCLEVBQ0U7Y0FBQSxXQUFBLEVBQ0UsbUZBREY7Y0FLQSxXQUFBLEVBQWEsSUFMYjthQURGO21CQU9BLEtBQUMsQ0FBQSxXQUFELENBQUE7VUFUcUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7T0FBZDtJQWxEUSxDQUFWO0lBNkRBLFdBQUEsRUFBYSxTQUFBO2FBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFDRSx3QkFERjtJQURXLENBN0RiO0lBaUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsRUFBTyxPQUFQOztRQUFPLFVBQVU7O2FBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsNkJBQTVCLEVBQ0U7UUFBQSxXQUFBLEVBQ0Usa0NBQUEsR0FDa0MsSUFEbEMsR0FDdUMsOENBRnpDO1FBS0EsTUFBQSxFQUFRLE9BTFI7UUFNQSxXQUFBLEVBQWEsSUFOYjtPQURGO0lBRFUsQ0FqRVo7SUEyRUEsZUFBQSxFQUFpQixTQUFBO2FBQ2YsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUFZLENBQUMsSUFBYixDQUFrQixTQUFDLElBQUQ7QUFDaEIsWUFBQTtRQUFBLElBQUEsR0FBTyx1Q0FBQSxHQUF3QyxJQUF4QyxHQUE2QztRQUNwRCxHQUFBLEdBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw2QkFBM0IsRUFDSjtVQUFBLFdBQUEsRUFDRSw4RUFBQSxHQUdNLElBSlI7VUFNQSxXQUFBLEVBQWEsSUFOYjtVQU9BLE9BQUEsRUFBUztZQUFDO2NBQUMsSUFBQSxFQUFNLE1BQVA7Y0FBZSxVQUFBLEVBQVksU0FBQTt1QkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsSUFBckI7Y0FBSCxDQUEzQjthQUFEO1dBUFQ7U0FESTtlQVNOLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQUE7VUFDbEIsSUFBRyxDQUFJLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBUDtZQUNFLEdBQUcsQ0FBQyxPQUFKLENBQUEsRUFERjs7aUJBRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixxQkFBOUI7UUFIa0IsQ0FBcEI7TUFYZ0IsQ0FBbEI7SUFEZSxDQTNFakI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJjbGllbnQgPSByZXF1aXJlICcuL2NsaWVudCdcbnRjcCA9IHJlcXVpcmUgJy4vcHJvY2Vzcy90Y3AnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG5cbiAgICBjbGllbnQuaGFuZGxlQmFzaWMgJ2luc3RhbGwnLCA9PlxuICAgICAgQG5vdGU/LmRpc21pc3MoKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiRXJyb3IgaW5zdGFsbGluZyBBdG9tLmpsIHBhY2thZ2VcIixcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgR28gdG8gdGhlIGBQYWNrYWdlcyAtPiBKdW5vIC0+IE9wZW4gUkVQTGAgbWVudSBhbmRcbiAgICAgICAgICBydW4gYFBrZy5hZGQoXCJBdG9tXCIpYCBpbiBKdWxpYSwgdGhlbiB0cnkgYWdhaW4uXG4gICAgICAgICAgSWYgeW91IHN0aWxsIHNlZSBhbiBpc3N1ZSwgcGxlYXNlIHJlcG9ydCBpdCB0bzpcblxuICAgICAgICAgIGh0dHBzOi8vZGlzY291cnNlLmp1bGlhbGFuZy5vcmcvXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG5cbiAgICBjbGllbnQuaGFuZGxlQmFzaWMgJ2xvYWQnLCA9PlxuICAgICAgQG5vdGU/LmRpc21pc3MoKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiRXJyb3IgbG9hZGluZyBBdG9tLmpsIHBhY2thZ2VcIixcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgR28gdG8gdGhlIGBQYWNrYWdlcyAtPiBKdW5vIC0+IE9wZW4gUkVQTGAgbWVudSBhbmRcbiAgICAgICAgICBydW4gYFBrZy51cGRhdGUoKWAgaW4gSnVsaWEsIHRoZW4gdHJ5IGFnYWluLlxuICAgICAgICAgIElmIHlvdSBzdGlsbCBzZWUgYW4gaXNzdWUsIHBsZWFzZSByZXBvcnQgaXQgdG86XG5cbiAgICAgICAgICBodHRwczovL2Rpc2NvdXJzZS5qdWxpYWxhbmcub3JnL1xuICAgICAgICAgIFwiXCJcIlxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gICAgY2xpZW50LmhhbmRsZUJhc2ljICdpbnN0YWxsaW5nJywgPT5cbiAgICAgIEBub3RlPy5kaXNtaXNzKClcbiAgICAgIEBub3RlID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJJbnN0YWxsaW5nIEp1bGlhIHBhY2thZ2VzLi4uXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIEp1bGlhJ3MgZmlyc3QgcnVuIHdpbGwgdGFrZSBhIGNvdXBsZSBvZiBtaW51dGVzLlxuICAgICAgICAgIFNlZSB0aGUgUkVQTCBiZWxvdyBmb3IgcHJvZ3Jlc3MuXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBAb3BlbkNvbnNvbGUoKVxuXG4gICAgY2xpZW50LmhhbmRsZUJhc2ljICdwcmVjb21waWxpbmcnLCA9PlxuICAgICAgQG5vdGU/LmRpc21pc3MoKVxuICAgICAgQG5vdGUgPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcIkNvbXBpbGluZyBKdWxpYSBwYWNrYWdlcy4uLlwiLFxuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICBKdWxpYSdzIGZpcnN0IHJ1biB3aWxsIHRha2UgYSBjb3VwbGUgb2YgbWludXRlcy5cbiAgICAgICAgICBTZWUgdGhlIFJFUEwgYmVsb3cgZm9yIHByb2dyZXNzLlxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgQG9wZW5Db25zb2xlKClcblxuICAgIGNsaWVudC5oYW5kbGUgd2VsY29tZTogPT5cbiAgICAgIEBub3RlPy5kaXNtaXNzKClcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiV2VsY29tZSB0byBKdW5vIVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICBTdWNjZXNzISBKdW5vIGlzIHNldCB1cCBhbmQgcmVhZHkgdG8gcm9sbC5cbiAgICAgICAgICBUcnkgZW50ZXJpbmcgYDIrMmAgaW4gdGhlIFJFUEwgYmVsb3cuXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBAb3BlbkNvbnNvbGUoKVxuXG4gIG9wZW5Db25zb2xlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSxcbiAgICAgICdqdWxpYS1jbGllbnQ6b3Blbi1SRVBMJ1xuXG4gIGpsTm90Rm91bmQ6IChwYXRoLCBkZXRhaWxzID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiSnVsaWEgY291bGQgbm90IGJlIHN0YXJ0ZWQuXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIFdlIHRyaWVkIHRvIGxhdW5jaCBKdWxpYSBmcm9tOiBgI3twYXRofWBcbiAgICAgICAgVGhpcyBwYXRoIGNhbiBiZSBjaGFuZ2VkIGluIHRoZSBzZXR0aW5ncy5cbiAgICAgICAgXCJcIlwiXG4gICAgICBkZXRhaWw6IGRldGFpbHNcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG5cbiAgY29ubmVjdEV4dGVybmFsOiAtPlxuICAgIHRjcC5saXN0ZW4oKS50aGVuIChwb3J0KSAtPlxuICAgICAgY29kZSA9IFwidXNpbmcgQXRvbTsgdXNpbmcgSnVubzsgSnVuby5jb25uZWN0KCN7cG9ydH0pXCJcbiAgICAgIG1zZyA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwiQ29ubmVjdCBhbiBleHRlcm5hbCBwcm9jZXNzXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIFRvIGNvbm5lY3QgYSBKdWxpYSBwcm9jZXNzIHJ1bm5pbmcgaW4gdGhlIHRlcm1pbmFsLCBydW4gdGhlIGNvbW1hbmQ6XG5cbiAgICAgICAgICAgICAgI3tjb2RlfVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICBidXR0b25zOiBbe3RleHQ6ICdDb3B5Jywgb25EaWRDbGljazogLT4gYXRvbS5jbGlwYm9hcmQud3JpdGUgY29kZX1dXG4gICAgICBjbGllbnQub25jZUF0dGFjaGVkIC0+XG4gICAgICAgIGlmIG5vdCBtc2cuaXNEaXNtaXNzZWQoKVxuICAgICAgICAgIG1zZy5kaXNtaXNzKClcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJKdWxpYSBpcyBjb25uZWN0ZWQuXCJcbiJdfQ==
