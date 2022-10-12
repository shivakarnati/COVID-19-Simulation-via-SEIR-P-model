(function() {
  var child_process, client, disrequireClient, net, paths, tcp;

  child_process = require('child_process');

  net = require('net');

  tcp = require('./process/tcp');

  client = require('./client');

  paths = require('../misc').paths;

  disrequireClient = function(a, f) {
    return client.disrequire(a, f);
  };

  module.exports = {
    escpath: function(p) {
      return '"' + p + '"';
    },
    escape: function(sh) {
      return sh.replace(/"/g, '\\"');
    },
    exec: function(sh) {
      return child_process.exec(sh, function(err, stdout, stderr) {
        if (err != null) {
          return console.log(err);
        }
      });
    },
    term: function(sh) {
      switch (process.platform) {
        case "darwin":
          this.exec("osascript -e 'tell application \"Terminal\" to activate'");
          return this.exec("osascript -e 'tell application \"Terminal\" to do script \"" + (this.escape(sh)) + "\"'");
        case "win32":
          return this.exec((this.terminal()) + " \"" + sh + "\"");
        default:
          return this.exec((this.terminal()) + " \"" + (this.escape(sh)) + "\"");
      }
    },
    terminal: function() {
      return atom.config.get("julia-client.consoleOptions.terminal");
    },
    defaultShell: function() {
      var sh;
      sh = process.env["SHELL"];
      if (sh != null) {
        return sh;
      } else if (process.platform === 'win32') {
        return 'powershell.exe';
      } else {
        return 'bash';
      }
    },
    defaultTerminal: function() {
      if (process.platform === 'win32') {
        return 'cmd /C start cmd /C';
      } else {
        return 'x-terminal-emulator -e';
      }
    },
    repl: function() {
      return this.term("" + (this.escpath(paths.jlpath())));
    },
    connectCommand: function() {
      return tcp.listen().then((function(_this) {
        return function(port) {
          return (_this.escpath(paths.jlpath())) + " " + (client.clargs().join(' ')) + " " + (paths.script('boot_repl.jl')) + " " + port;
        };
      })(this));
    },
    connectedRepl: function() {
      return this.connectCommand().then((function(_this) {
        return function(cmd) {
          return _this.term(cmd);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vdGVybWluYWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSOztFQUNoQixHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBRU4sR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNOLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFDUixRQUFTLE9BQUEsQ0FBUSxTQUFSOztFQUVWLGdCQUFBLEdBQW1CLFNBQUMsQ0FBRCxFQUFJLENBQUo7V0FBVSxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixFQUFxQixDQUFyQjtFQUFWOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsT0FBQSxFQUFTLFNBQUMsQ0FBRDthQUFPLEdBQUEsR0FBTSxDQUFOLEdBQVU7SUFBakIsQ0FBVDtJQUNBLE1BQUEsRUFBUSxTQUFDLEVBQUQ7YUFBUSxFQUFFLENBQUMsT0FBSCxDQUFXLElBQVgsRUFBaUIsS0FBakI7SUFBUixDQURSO0lBR0EsSUFBQSxFQUFNLFNBQUMsRUFBRDthQUNKLGFBQWEsQ0FBQyxJQUFkLENBQW1CLEVBQW5CLEVBQXVCLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxNQUFkO1FBQ3JCLElBQUcsV0FBSDtpQkFDRSxPQUFPLENBQUMsR0FBUixDQUFZLEdBQVosRUFERjs7TUFEcUIsQ0FBdkI7SUFESSxDQUhOO0lBUUEsSUFBQSxFQUFNLFNBQUMsRUFBRDtBQUNKLGNBQU8sT0FBTyxDQUFDLFFBQWY7QUFBQSxhQUNPLFFBRFA7VUFFSSxJQUFDLENBQUEsSUFBRCxDQUFNLDBEQUFOO2lCQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sNkRBQUEsR0FBNkQsQ0FBQyxJQUFDLENBQUEsTUFBRCxDQUFRLEVBQVIsQ0FBRCxDQUE3RCxHQUEwRSxLQUFoRjtBQUhKLGFBSU8sT0FKUDtpQkFLSSxJQUFDLENBQUEsSUFBRCxDQUFRLENBQUMsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFELENBQUEsR0FBYSxLQUFiLEdBQWtCLEVBQWxCLEdBQXFCLElBQTdCO0FBTEo7aUJBT0ksSUFBQyxDQUFBLElBQUQsQ0FBUSxDQUFDLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBRCxDQUFBLEdBQWEsS0FBYixHQUFpQixDQUFDLElBQUMsQ0FBQSxNQUFELENBQVEsRUFBUixDQUFELENBQWpCLEdBQThCLElBQXRDO0FBUEo7SUFESSxDQVJOO0lBa0JBLFFBQUEsRUFBVSxTQUFBO2FBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQjtJQUFILENBbEJWO0lBb0JBLFlBQUEsRUFBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLEVBQUEsR0FBSyxPQUFPLENBQUMsR0FBSSxDQUFBLE9BQUE7TUFDakIsSUFBRyxVQUFIO2VBQ0UsR0FERjtPQUFBLE1BRUssSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtlQUNILGlCQURHO09BQUEsTUFBQTtlQUdILE9BSEc7O0lBSk8sQ0FwQmQ7SUE2QkEsZUFBQSxFQUFpQixTQUFBO01BQ2YsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtlQUNFLHNCQURGO09BQUEsTUFBQTtlQUdFLHlCQUhGOztJQURlLENBN0JqQjtJQW1DQSxJQUFBLEVBQU0sU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQU0sRUFBQSxHQUFFLENBQUMsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFLLENBQUMsTUFBTixDQUFBLENBQVQsQ0FBRCxDQUFSO0lBQUgsQ0FuQ047SUFxQ0EsY0FBQSxFQUFnQixTQUFBO2FBQ2QsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUFZLENBQUMsSUFBYixDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDZCxDQUFDLEtBQUMsQ0FBQSxPQUFELENBQVMsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFULENBQUQsQ0FBQSxHQUF5QixHQUF6QixHQUEyQixDQUFDLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBZSxDQUFDLElBQWhCLENBQXFCLEdBQXJCLENBQUQsQ0FBM0IsR0FBc0QsR0FBdEQsR0FBd0QsQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLGNBQWIsQ0FBRCxDQUF4RCxHQUFzRixHQUF0RixHQUF5RjtRQUQzRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7SUFEYyxDQXJDaEI7SUF5Q0EsYUFBQSxFQUFlLFNBQUE7YUFBRyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7aUJBQVMsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBQUgsQ0F6Q2Y7O0FBWEYiLCJzb3VyY2VzQ29udGVudCI6WyJjaGlsZF9wcm9jZXNzID0gcmVxdWlyZSAnY2hpbGRfcHJvY2Vzcydcbm5ldCA9IHJlcXVpcmUgJ25ldCdcblxudGNwID0gcmVxdWlyZSAnLi9wcm9jZXNzL3RjcCdcbmNsaWVudCA9IHJlcXVpcmUgJy4vY2xpZW50J1xue3BhdGhzfSA9IHJlcXVpcmUgJy4uL21pc2MnXG5cbmRpc3JlcXVpcmVDbGllbnQgPSAoYSwgZikgLT4gY2xpZW50LmRpc3JlcXVpcmUgYSwgZlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgZXNjcGF0aDogKHApIC0+ICdcIicgKyBwICsgJ1wiJ1xuICBlc2NhcGU6IChzaCkgLT4gc2gucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpXG5cbiAgZXhlYzogKHNoKSAtPlxuICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyBzaCwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICBpZiBlcnI/XG4gICAgICAgIGNvbnNvbGUubG9nIGVyclxuXG4gIHRlcm06IChzaCkgLT5cbiAgICBzd2l0Y2ggcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgd2hlbiBcImRhcndpblwiXG4gICAgICAgIEBleGVjIFwib3Nhc2NyaXB0IC1lICd0ZWxsIGFwcGxpY2F0aW9uIFxcXCJUZXJtaW5hbFxcXCIgdG8gYWN0aXZhdGUnXCJcbiAgICAgICAgQGV4ZWMgXCJvc2FzY3JpcHQgLWUgJ3RlbGwgYXBwbGljYXRpb24gXFxcIlRlcm1pbmFsXFxcIiB0byBkbyBzY3JpcHQgXFxcIiN7QGVzY2FwZShzaCl9XFxcIidcIlxuICAgICAgd2hlbiBcIndpbjMyXCJcbiAgICAgICAgQGV4ZWMgXCIje0B0ZXJtaW5hbCgpfSBcXFwiI3tzaH1cXFwiXCJcbiAgICAgIGVsc2VcbiAgICAgICAgQGV4ZWMgXCIje0B0ZXJtaW5hbCgpfSBcXFwiI3tAZXNjYXBlKHNoKX1cXFwiXCJcblxuICB0ZXJtaW5hbDogLT4gYXRvbS5jb25maWcuZ2V0KFwianVsaWEtY2xpZW50LmNvbnNvbGVPcHRpb25zLnRlcm1pbmFsXCIpXG5cbiAgZGVmYXVsdFNoZWxsOiAtPlxuICAgIHNoID0gcHJvY2Vzcy5lbnZbXCJTSEVMTFwiXVxuICAgIGlmIHNoP1xuICAgICAgc2hcbiAgICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJ1xuICAgICAgJ3Bvd2Vyc2hlbGwuZXhlJ1xuICAgIGVsc2VcbiAgICAgICdiYXNoJ1xuXG4gIGRlZmF1bHRUZXJtaW5hbDogLT5cbiAgICBpZiBwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMidcbiAgICAgICdjbWQgL0Mgc3RhcnQgY21kIC9DJ1xuICAgIGVsc2VcbiAgICAgICd4LXRlcm1pbmFsLWVtdWxhdG9yIC1lJ1xuXG4gIHJlcGw6IC0+IEB0ZXJtIFwiI3tAZXNjcGF0aCBwYXRocy5qbHBhdGgoKX1cIlxuXG4gIGNvbm5lY3RDb21tYW5kOiAtPlxuICAgIHRjcC5saXN0ZW4oKS50aGVuIChwb3J0KSA9PlxuICAgICAgXCIje0Blc2NwYXRoIHBhdGhzLmpscGF0aCgpfSAje2NsaWVudC5jbGFyZ3MoKS5qb2luKCcgJyl9ICN7cGF0aHMuc2NyaXB0KCdib290X3JlcGwuamwnKX0gI3twb3J0fVwiXG5cbiAgY29ubmVjdGVkUmVwbDogLT4gQGNvbm5lY3RDb21tYW5kKCkudGhlbiAoY21kKSA9PiBAdGVybSBjbWRcbiJdfQ==
