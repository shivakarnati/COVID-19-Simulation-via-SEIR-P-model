(function() {
  var basic, client, cycler, junorc, messages, paths, ssh;

  paths = require('../misc').paths;

  messages = require('./messages');

  client = require('./client');

  junorc = client["import"]('junorc', false);

  cycler = require('./process/cycler');

  ssh = require('./process/remote');

  basic = require('./process/basic');

  module.exports = {
    consumeGetServerConfig: function(getconf) {
      return ssh.consumeGetServerConfig(getconf);
    },
    consumeGetServerName: function(name) {
      return ssh.consumeGetServerName(name);
    },
    provider: function(p) {
      var bootMode;
      bootMode = void 0;
      if (p != null) {
        bootMode = p;
      } else {
        bootMode = atom.config.get('julia-client.juliaOptions.bootMode');
      }
      switch (bootMode) {
        case 'Cycler':
          return cycler;
        case 'Remote':
          return ssh;
        case 'Basic':
          return basic;
      }
    },
    activate: function() {
      if (process.platform === 'win32') {
        process.env.JULIA_EDITOR = "\"" + process.execPath + "\" " + (atom.devMode ? '-d' : '') + " -a";
      } else {
        process.env.JULIA_EDITOR = "atom " + (atom.devMode ? '-d' : '') + " -a";
      }
      return paths.getVersion().then((function(_this) {
        return function() {
          var base;
          return typeof (base = _this.provider()).start === "function" ? base.start(paths.jlpath(), client.clargs()) : void 0;
        };
      })(this))["catch"](function() {});
    },
    monitor: function(proc) {
      client.emitter.emit('boot', proc);
      proc.ready = function() {
        return false;
      };
      client.attach(proc);
      return proc;
    },
    connect: function(proc, sock) {
      proc.message = function(m) {
        return sock.write(JSON.stringify(m));
      };
      client.readStream(sock);
      sock.on('end', function() {
        proc.kill();
        return client.detach();
      });
      sock.on('error', function() {
        proc.kill();
        return client.detach();
      });
      proc.ready = function() {
        return true;
      };
      client.flush();
      return proc;
    },
    start: function(provider) {
      var args, check, path, proc, ref;
      ref = [paths.jlpath(), client.clargs()], path = ref[0], args = ref[1];
      check = paths.getVersion();
      if (provider === 'Remote') {
        check = Promise.resolve();
      } else {
        check["catch"]((function(_this) {
          return function(err) {
            return messages.jlNotFound(paths.jlpath(), err);
          };
        })(this));
      }
      proc = check.then((function(_this) {
        return function() {
          return _this.spawnJulia(path, args, provider);
        };
      })(this)).then((function(_this) {
        return function(proc) {
          return _this.monitor(proc);
        };
      })(this));
      if (provider === 'Remote') {
        ssh.withRemoteConfig(function(conf) {
          return junorc(conf.remote);
        })["catch"](function() {});
      } else {
        paths.projectDir().then(function(dir) {
          return junorc(dir);
        });
      }
      proc.then((function(_this) {
        return function(proc) {
          return Promise.all([proc, proc.socket]);
        };
      })(this)).then((function(_this) {
        return function(arg) {
          var proc, sock;
          proc = arg[0], sock = arg[1];
          return _this.connect(proc, sock);
        };
      })(this))["catch"](function(e) {
        client.detach();
        return console.error("Julia exited with " + e + ".");
      });
      return proc;
    },
    spawnJulia: function(path, args, provider) {
      return this.provider(provider).get(path, args);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vbG9jYWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxTQUFSOztFQUNWLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFDWCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsTUFBQSxHQUFTLE1BQU0sRUFBQyxNQUFELEVBQU4sQ0FBYyxRQUFkLEVBQXdCLEtBQXhCOztFQUVULE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVI7O0VBQ1QsR0FBQSxHQUFNLE9BQUEsQ0FBUSxrQkFBUjs7RUFDTixLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxzQkFBQSxFQUF3QixTQUFDLE9BQUQ7YUFDdEIsR0FBRyxDQUFDLHNCQUFKLENBQTJCLE9BQTNCO0lBRHNCLENBQXhCO0lBR0Esb0JBQUEsRUFBc0IsU0FBQyxJQUFEO2FBQ3BCLEdBQUcsQ0FBQyxvQkFBSixDQUF5QixJQUF6QjtJQURvQixDQUh0QjtJQU1BLFFBQUEsRUFBVSxTQUFDLENBQUQ7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXO01BQ1gsSUFBRyxTQUFIO1FBQ0UsUUFBQSxHQUFXLEVBRGI7T0FBQSxNQUFBO1FBR0UsUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsRUFIYjs7QUFJQSxjQUFPLFFBQVA7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCO0FBRHJCLGFBRU8sUUFGUDtpQkFFcUI7QUFGckIsYUFHTyxPQUhQO2lCQUdxQjtBQUhyQjtJQU5RLENBTlY7SUFpQkEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFHLE9BQU8sQ0FB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SUFBRyxRQUFBLEtBQVksUUFBZjtRQUNFLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixTQUFDLElBQUQ7aUJBQVUsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFaO1FBQVYsQ0FBckIsQ0FBa0QsRUFBQyxLQUFELEVBQWxELENBQXlELFNBQUEsR0FBQSxDQUF6RCxFQURGO09BQUEsTUFBQTtRQUdFLEtBQUssQ0FBQyxVQUFOLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLEdBQUQ7aUJBQVMsTUFBQSxDQUFPLEdBQVA7UUFBVCxDQUF4QixFQUhGOztNQUtBLElBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFJLENBQUMsTUFBWixDQUFaO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUNKLGNBQUE7VUFETSxlQUFNO2lCQUNaLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLElBQWY7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUixDQUtFLEVBQUMsS0FBRCxFQUxGLENBS1MsU0FBQyxDQUFEO1FBQ0wsTUFBTSxDQUFDLE1BQVAsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxLQUFSLENBQWMsb0JBQUEsR0FBcUIsQ0FBckIsR0FBdUIsR0FBckM7TUFGSyxDQUxUO2FBUUE7SUE1QkssQ0EvQ1A7SUE2RUEsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxRQUFiO2FBQ1YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLENBQW1CLENBQUMsR0FBcEIsQ0FBd0IsSUFBeEIsRUFBOEIsSUFBOUI7SUFEVSxDQTdFWjs7QUFYRiIsInNvdXJjZXNDb250ZW50IjpbIntwYXRoc30gPSByZXF1aXJlICcuLi9taXNjJ1xubWVzc2FnZXMgPSByZXF1aXJlICcuL21lc3NhZ2VzJ1xuY2xpZW50ID0gcmVxdWlyZSAnLi9jbGllbnQnXG5cbmp1bm9yYyA9IGNsaWVudC5pbXBvcnQgJ2p1bm9yYycsIGZhbHNlXG5cbmN5Y2xlciA9IHJlcXVpcmUgJy4vcHJvY2Vzcy9jeWNsZXInXG5zc2ggPSByZXF1aXJlICcuL3Byb2Nlc3MvcmVtb3RlJ1xuYmFzaWMgPSByZXF1aXJlICcuL3Byb2Nlc3MvYmFzaWMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uc3VtZUdldFNlcnZlckNvbmZpZzogKGdldGNvbmYpIC0+XG4gICAgc3NoLmNvbnN1bWVHZXRTZXJ2ZXJDb25maWcoZ2V0Y29uZilcblxuICBjb25zdW1lR2V0U2VydmVyTmFtZTogKG5hbWUpIC0+XG4gICAgc3NoLmNvbnN1bWVHZXRTZXJ2ZXJOYW1lKG5hbWUpXG5cbiAgcHJvdmlkZXI6IChwKSAtPlxuICAgIGJvb3RNb2RlID0gdW5kZWZpbmVkXG4gICAgaWYgcD9cbiAgICAgIGJvb3RNb2RlID0gcFxuICAgIGVsc2VcbiAgICAgIGJvb3RNb2RlID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLmJvb3RNb2RlJylcbiAgICBzd2l0Y2ggYm9vdE1vZGVcbiAgICAgIHdoZW4gJ0N5Y2xlcicgdGhlbiBjeWNsZXJcbiAgICAgIHdoZW4gJ1JlbW90ZScgdGhlbiBzc2hcbiAgICAgIHdoZW4gJ0Jhc2ljJyAgdGhlbiBiYXNpY1xuXG4gIGFjdGl2YXRlOiAtPlxuICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJ1xuICAgICAgcHJvY2Vzcy5lbnYuSlVMSUFfRURJVE9SID0gXCJcXFwiI3twcm9jZXNzLmV4ZWNQYXRofVxcXCIgI3tpZiBhdG9tLmRldk1vZGUgdGhlbiAnLWQnIGVsc2UgJyd9IC1hXCJcbiAgICBlbHNlXG4gICAgICBwcm9jZXNzLmVudi5KVUxJQV9FRElUT1IgPSBcImF0b20gI3tpZiBhdG9tLmRldk1vZGUgdGhlbiAnLWQnIGVsc2UgJyd9IC1hXCJcblxuICAgIHBhdGhzLmdldFZlcnNpb24oKVxuICAgICAgLnRoZW4gPT5cbiAgICAgICAgQHByb3ZpZGVyKCkuc3RhcnQ/IHBhdGhzLmpscGF0aCgpLCBjbGllbnQuY2xhcmdzKClcbiAgICAgIC5jYXRjaCAtPlxuXG4gIG1vbml0b3I6IChwcm9jKSAtPlxuICAgIGNsaWVudC5lbWl0dGVyLmVtaXQoJ2Jvb3QnLCBwcm9jKVxuICAgIHByb2MucmVhZHkgPSAtPiBmYWxzZVxuICAgIGNsaWVudC5hdHRhY2gocHJvYylcbiAgICByZXR1cm4gcHJvY1xuXG4gIGNvbm5lY3Q6IChwcm9jLCBzb2NrKSAtPlxuICAgIHByb2MubWVzc2FnZSA9IChtKSAtPiBzb2NrLndyaXRlIEpTT04uc3RyaW5naWZ5IG1cbiAgICBjbGllbnQucmVhZFN0cmVhbSBzb2NrXG4gICAgc29jay5vbiAnZW5kJywgLT5cbiAgICAgIHByb2Mua2lsbCgpXG4gICAgICBjbGllbnQuZGV0YWNoKClcbiAgICBzb2NrLm9uICdlcnJvcicsIC0+XG4gICAgICBwcm9jLmtpbGwoKVxuICAgICAgY2xpZW50LmRldGFjaCgpXG4gICAgcHJvYy5yZWFkeSA9IC0+IHRydWVcbiAgICBjbGllbnQuZmx1c2goKVxuICAgIHByb2NcblxuICBzdGFydDogKHByb3ZpZGVyKSAtPlxuICAgIFtwYXRoLCBhcmdzXSA9IFtwYXRocy5qbHBhdGgoKSwgY2xpZW50LmNsYXJncygpXVxuICAgIGNoZWNrID0gcGF0aHMuZ2V0VmVyc2lvbigpXG5cbiAgICBpZiBwcm92aWRlciBpcyAnUmVtb3RlJ1xuICAgICAgY2hlY2sgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIGVsc2VcbiAgICAgIGNoZWNrLmNhdGNoIChlcnIpID0+XG4gICAgICAgIG1lc3NhZ2VzLmpsTm90Rm91bmQgcGF0aHMuamxwYXRoKCksIGVyclxuXG4gICAgcHJvYyA9IGNoZWNrXG4gICAgICAudGhlbiA9PiBAc3Bhd25KdWxpYShwYXRoLCBhcmdzLCBwcm92aWRlcilcbiAgICAgIC50aGVuIChwcm9jKSA9PiBAbW9uaXRvcihwcm9jKVxuXG4gICAgIyBzZXQgd29ya2luZyBkaXJlY3RvcnkgaGVyZSwgc28gd2UgcXVldWUgdGhpcyB0YXNrIGJlZm9yZSBhbnl0aGluZyBlbHNlXG4gICAgaWYgcHJvdmlkZXIgaXMgJ1JlbW90ZSdcbiAgICAgIHNzaC53aXRoUmVtb3RlQ29uZmlnKChjb25mKSAtPiBqdW5vcmMgY29uZi5yZW1vdGUpLmNhdGNoIC0+XG4gICAgZWxzZVxuICAgICAgcGF0aHMucHJvamVjdERpcigpLnRoZW4gKGRpcikgLT4ganVub3JjIGRpclxuXG4gICAgcHJvY1xuICAgICAgLnRoZW4gKHByb2MpID0+XG4gICAgICAgIFByb21pc2UuYWxsIFtwcm9jLCBwcm9jLnNvY2tldF1cbiAgICAgIC50aGVuIChbcHJvYywgc29ja10pID0+XG4gICAgICAgIEBjb25uZWN0IHByb2MsIHNvY2tcbiAgICAgIC5jYXRjaCAoZSkgLT5cbiAgICAgICAgY2xpZW50LmRldGFjaCgpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJKdWxpYSBleGl0ZWQgd2l0aCAje2V9LlwiKVxuICAgIHByb2NcblxuICBzcGF3bkp1bGlhOiAocGF0aCwgYXJncywgcHJvdmlkZXIpIC0+XG4gICAgQHByb3ZpZGVyKHByb3ZpZGVyKS5nZXQocGF0aCwgYXJncylcbiJdfQ==
