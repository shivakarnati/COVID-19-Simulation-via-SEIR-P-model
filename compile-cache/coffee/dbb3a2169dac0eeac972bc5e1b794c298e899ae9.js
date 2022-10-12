(function() {
  var Emitter, IPC, throttle,
    slice = [].slice;

  throttle = require('underscore-plus').throttle;

  Emitter = require('atom').Emitter;

  IPC = require('./ipc');

  module.exports = {
    ipc: new IPC,
    handle: function() {
      var a, ref;
      a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = this.ipc).handle.apply(ref, a);
    },
    input: function(m) {
      return this.ipc.input(m);
    },
    readStream: function(s) {
      return this.ipc.readStream(s);
    },
    "import": function() {
      var a, ref;
      a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = this.ipc)["import"].apply(ref, a);
    },
    activate: function() {
      var plotpane;
      this.emitter = new Emitter;
      this.bootMode = atom.config.get('julia-client.juliaOptions.bootMode');
      this.ipc.writeMsg = (function(_this) {
        return function(msg) {
          var base;
          if (_this.isActive() && (typeof (base = _this.conn).ready === "function" ? base.ready() : void 0) !== false) {
            return _this.conn.message(msg);
          } else {
            return _this.ipc.queue.push(msg);
          }
        };
      })(this);
      this.handle('error', (function(_this) {
        return function(options) {
          if (atom.config.get('julia-client.uiOptions.errorNotifications')) {
            atom.notifications.addError(options.msg, options);
          }
          console.error(options.detail);
          return atom.beep();
        };
      })(this));
      plotpane = null;
      this.onAttached((function(_this) {
        return function() {
          var args;
          args = atom.config.get('julia-client.juliaOptions.arguments');
          _this["import"]('connected')();
          if (args.length > 0) {
            _this["import"]('args')(args);
          }
          return plotpane = atom.config.observe('julia-client.uiOptions.usePlotPane', function(use) {
            return _this["import"]('enableplotpane')(use);
          });
        };
      })(this));
      this.onDetached((function(_this) {
        return function() {
          return plotpane != null ? plotpane.dispose() : void 0;
        };
      })(this));
      return this.onBoot((function(_this) {
        return function(proc) {
          return _this.remoteConfig = proc.config;
        };
      })(this));
    },
    setBootMode: function(bootMode) {
      this.bootMode = bootMode;
    },
    editorPath: function(ed) {
      var ind, path;
      if (ed == null) {
        return ed;
      }
      if (this.bootMode === 'Remote' && (this.remoteConfig != null)) {
        path = ed.getPath();
        if (path == null) {
          return path;
        }
        ind = path.indexOf(this.remoteConfig.host);
        if (ind > -1) {
          path = path.slice(ind + this.remoteConfig.host.length, path.length);
          path = path.replace(/\\/g, '/');
          return path;
        } else {
          return path;
        }
      } else {
        return ed.getPath();
      }
    },
    deactivate: function() {
      this.emitter.dispose();
      if (this.isActive()) {
        return this.detach();
      }
    },
    basicHandlers: {},
    basicHandler: function(s) {
      var base, match, name1;
      if ((match = s.toString().match(/juno-msg-(.*)/))) {
        if (typeof (base = this.basicHandlers)[name1 = match[1]] === "function") {
          base[name1]();
        }
        return true;
      }
    },
    handleBasic: function(msg, f) {
      return this.basicHandlers[msg] = f;
    },
    emitter: new Emitter,
    onAttached: function(cb) {
      return this.emitter.on('attached', cb);
    },
    onDetached: function(cb) {
      return this.emitter.on('detached', cb);
    },
    onceAttached: function(cb) {
      var f;
      return f = this.onAttached(function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        f.dispose();
        return cb.call.apply(cb, [this].concat(slice.call(args)));
      });
    },
    isActive: function() {
      return this.conn != null;
    },
    attach: function(conn) {
      var base;
      this.conn = conn;
      if ((typeof (base = this.conn).ready === "function" ? base.ready() : void 0) !== false) {
        this.flush();
      }
      return this.emitter.emit('attached');
    },
    detach: function() {
      delete this.conn;
      this.ipc.reset();
      return this.emitter.emit('detached');
    },
    flush: function() {
      return this.ipc.flush();
    },
    isWorking: function() {
      return this.ipc.isWorking();
    },
    onWorking: function(f) {
      return this.ipc.onWorking(f);
    },
    onDone: function(f) {
      return this.ipc.onDone(f);
    },
    onceDone: function(f) {
      return this.ipc.onceDone(f);
    },
    onStdout: function(f) {
      return this.emitter.on('stdout', f);
    },
    onStderr: function(f) {
      return this.emitter.on('stderr', f);
    },
    onInfo: function(f) {
      return this.emitter.on('info', f);
    },
    onBoot: function(f) {
      return this.emitter.on('boot', f);
    },
    stdout: function(data) {
      return this.emitter.emit('stdout', data);
    },
    stderr: function(data) {
      if (!this.basicHandler(data)) {
        return this.emitter.emit('stderr', data);
      }
    },
    info: function(data) {
      return this.emitter.emit('info', data);
    },
    clientCall: function() {
      var args, f, name, ref;
      name = arguments[0], f = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      if (this.conn[f] == null) {
        return atom.notifications.addError("This client doesn't support " + name + ".");
      } else {
        return (ref = this.conn[f]).call.apply(ref, [this.conn].concat(slice.call(args)));
      }
    },
    stdin: function(data) {
      return this.clientCall('STDIN', 'stdin', data);
    },
    interrupt: function() {
      if (this.isActive()) {
        return this.clientCall('interrupts', 'interrupt');
      }
    },
    disconnect: function() {
      if (this.isActive()) {
        return this.clientCall('disconnecting', 'disconnect');
      }
    },
    kill: function() {
      if (this.isActive()) {
        if (!this.isWorking()) {
          return this["import"]('exit')()["catch"](function() {});
        } else {
          return this.clientCall('kill', 'kill');
        }
      } else {
        return this.ipc.reset();
      }
    },
    clargs: function() {
      var as, deprecationWarnings, optimisationLevel, ref, startupArgs;
      ref = atom.config.get('julia-client.juliaOptions'), optimisationLevel = ref.optimisationLevel, deprecationWarnings = ref.deprecationWarnings;
      as = [];
      as.push("--depwarn=" + (deprecationWarnings ? 'yes' : 'no'));
      if (optimisationLevel !== 2) {
        as.push("-O" + optimisationLevel);
      }
      as.push("--color=yes");
      as.push("-i");
      startupArgs = atom.config.get('julia-client.juliaOptions.startupArguments');
      if (startupArgs.length > 0) {
        as = as.concat(startupArgs);
      }
      as = as.map((function(_this) {
        return function(arg) {
          return arg.trim();
        };
      })(this));
      as = as.filter((function(_this) {
        return function(arg) {
          return arg.length > 0;
        };
      })(this));
      return as;
    },
    connectedError: function(action) {
      if (action == null) {
        action = 'do that';
      }
      if (this.isActive()) {
        atom.notifications.addError("Can't " + action + " with a Julia client running.", {
          description: "Stop the current client with `Packages -> Juno -> Stop Julia`."
        });
        return true;
      } else {
        return false;
      }
    },
    notConnectedError: function(action) {
      if (action == null) {
        action = 'do that';
      }
      if (!this.isActive()) {
        atom.notifications.addError("Can't " + action + " without a Julia client running.", {
          description: "Start a client with `Packages -> Juno -> Start Julia`."
        });
        return true;
      } else {
        return false;
      }
    },
    require: function(a, f) {
      var ref;
            if (f != null) {
        f;
      } else {
        ref = [null, a], a = ref[0], f = ref[1];
      };
      return this.notConnectedError(a) || f();
    },
    disrequire: function(a, f) {
      var ref;
            if (f != null) {
        f;
      } else {
        ref = [null, a], a = ref[0], f = ref[1];
      };
      return this.connectedError(a) || f();
    },
    withCurrent: function(f) {
      var current;
      current = this.conn;
      return (function(_this) {
        return function() {
          var a;
          a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (current !== _this.conn) {
            return;
          }
          return f.apply(null, a);
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vY2xpZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7RUFBQyxXQUFZLE9BQUEsQ0FBUSxpQkFBUjs7RUFDWixVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVaLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQVlFO0lBQUEsR0FBQSxFQUFLLElBQUksR0FBVDtJQUVBLE1BQUEsRUFBUSxTQUFBO0FBQVUsVUFBQTtNQUFUO2FBQVMsT0FBQSxJQUFDLENBQUEsR0FBRCxDQUFJLENBQUMsTUFBTCxZQUFZLENBQVo7SUFBVixDQUZSO0lBR0EsS0FBQSxFQUFPLFNBQUMsQ0FBRDthQUFRLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFXLENBQVg7SUFBUixDQUhQO0lBSUEsVUFBQSxFQUFZLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixDQUFoQjtJQUFQLENBSlo7SUFLQSxDQUFBLE1BQUEsQ0FBQSxFQUFRLFNBQUE7QUFBVSxVQUFBO01BQVQ7YUFBUyxPQUFBLElBQUMsQ0FBQSxHQUFELENBQUksRUFBQyxNQUFELEVBQUosWUFBWSxDQUFaO0lBQVYsQ0FMUjtJQU9BLFFBQUEsRUFBVSxTQUFBO0FBRVIsVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUVmLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQjtNQUVaLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxHQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUNkLGNBQUE7VUFB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O2FBQ1IsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBaEIsQ0FBQSxJQUFzQixDQUFBLENBQUE7SUFGWixDQTlLWjtJQWtMQSxXQUFBLEVBQWEsU0FBQyxDQUFEO0FBQ1gsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUE7YUFDWCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDRSxjQUFBO1VBREQ7VUFDQyxJQUFjLE9BQUEsS0FBVyxLQUFDLENBQUEsSUFBMUI7QUFBQSxtQkFBQTs7aUJBQ0EsQ0FBQSxhQUFFLENBQUY7UUFGRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUFGVyxDQWxMYjs7QUFqQkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7dGhyb3R0bGV9ID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxuSVBDID0gcmVxdWlyZSAnLi9pcGMnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAjIENvbm5lY3Rpb24gbG9naWMgaW5qZWN0cyBhIGNvbm5lY3Rpb24gdmlhIGBhdHRhY2hgLlxuICAjIyBSZXF1aXJlZCBpbnRlcmZhY2U6XG4gICMgLm1lc3NhZ2UoanNvbilcbiAgIyMgT3B0aW9uYWwgaW50ZXJmYWNlOlxuICAjIC5zdGRpbihkYXRhKVxuICAjIC5pbnRlcnJ1cHQoKVxuICAjIC5raWxsKClcblxuICAjIE1lc3NhZ2luZ1xuXG4gIGlwYzogbmV3IElQQ1xuXG4gIGhhbmRsZTogKGEuLi4pIC0+IEBpcGMuaGFuZGxlIGEuLi5cbiAgaW5wdXQ6IChtKSAgLT4gQGlwYy5pbnB1dCBtXG4gIHJlYWRTdHJlYW06IChzKSAtPiBAaXBjLnJlYWRTdHJlYW0gc1xuICBpbXBvcnQ6IChhLi4uKSAtPiBAaXBjLmltcG9ydCBhLi4uXG5cbiAgYWN0aXZhdGU6IC0+XG5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBAYm9vdE1vZGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYU9wdGlvbnMuYm9vdE1vZGUnKVxuXG4gICAgQGlwYy53cml0ZU1zZyA9IChtc2cpID0+XG4gICAgICBpZiBAaXNBY3RpdmUoKSBhbmQgQGNvbm4ucmVhZHk/KCkgaXNudCBmYWxzZVxuICAgICAgICBAY29ubi5tZXNzYWdlIG1zZ1xuICAgICAgZWxzZVxuICAgICAgICBAaXBjLnF1ZXVlLnB1c2ggbXNnXG5cbiAgICBAaGFuZGxlICdlcnJvcicsIChvcHRpb25zKSA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0ICdqdWxpYS1jbGllbnQudWlPcHRpb25zLmVycm9yTm90aWZpY2F0aW9ucydcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIG9wdGlvbnMubXNnLCBvcHRpb25zXG4gICAgICBjb25zb2xlLmVycm9yIG9wdGlvbnMuZGV0YWlsXG4gICAgICBhdG9tLmJlZXAoKVxuXG4gICAgcGxvdHBhbmUgPSBudWxsXG5cbiAgICBAb25BdHRhY2hlZCA9PlxuICAgICAgYXJncyA9IGF0b20uY29uZmlnLmdldCAnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy5hcmd1bWVudHMnXG4gICAgICBAaW1wb3J0KCdjb25uZWN0ZWQnKSgpXG4gICAgICBpZiBhcmdzLmxlbmd0aCA+IDBcbiAgICAgICAgQGltcG9ydCgnYXJncycpIGFyZ3NcblxuICAgICAgcGxvdHBhbmUgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdqdWxpYS1jbGllbnQudWlPcHRpb25zLnVzZVBsb3RQYW5lJywgKHVzZSkgPT5cbiAgICAgICAgQGltcG9ydCgnZW5hYmxlcGxvdHBhbmUnKSh1c2UpXG5cbiAgICBAb25EZXRhY2hlZCA9PlxuICAgICAgcGxvdHBhbmU/LmRpc3Bvc2UoKVxuXG4gICAgQG9uQm9vdCAocHJvYykgPT5cbiAgICAgIEByZW1vdGVDb25maWcgPSBwcm9jLmNvbmZpZ1xuXG4gIHNldEJvb3RNb2RlOiAoQGJvb3RNb2RlKSAtPlxuXG4gIGVkaXRvclBhdGg6IChlZCkgLT5cbiAgICBpZiBub3QgZWQ/IHRoZW4gcmV0dXJuIGVkXG4gICAgaWYgQGJvb3RNb2RlIGlzICdSZW1vdGUnIGFuZCBAcmVtb3RlQ29uZmlnP1xuICAgICAgcGF0aCA9IGVkLmdldFBhdGgoKVxuICAgICAgaWYgbm90IHBhdGg/IHRoZW4gcmV0dXJuIHBhdGhcbiAgICAgIGluZCA9IHBhdGguaW5kZXhPZihAcmVtb3RlQ29uZmlnLmhvc3QpXG4gICAgICBpZiBpbmQgPiAtMVxuICAgICAgICBwYXRoID0gcGF0aC5zbGljZShpbmQgKyBAcmVtb3RlQ29uZmlnLmhvc3QubGVuZ3RoLCBwYXRoLmxlbmd0aClcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpXG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGVkLmdldFBhdGgoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGVtaXR0ZXIuZGlzcG9zZSgpXG4gICAgaWYgQGlzQWN0aXZlKCkgdGhlbiBAZGV0YWNoKClcblxuICAjIEJhc2ljIGhhbmRsZXJzIChjb21tdW5pY2F0aW9uIHRocm91Z2ggc3RkZXJyKVxuXG4gIGJhc2ljSGFuZGxlcnM6IHt9XG5cbiAgYmFzaWNIYW5kbGVyOiAocykgLT5cbiAgICBpZiAobWF0Y2ggPSBzLnRvU3RyaW5nKCkubWF0Y2ggL2p1bm8tbXNnLSguKikvKVxuICAgICAgQGJhc2ljSGFuZGxlcnNbbWF0Y2hbMV1dPygpXG4gICAgICB0cnVlXG5cbiAgaGFuZGxlQmFzaWM6IChtc2csIGYpIC0+IEBiYXNpY0hhbmRsZXJzW21zZ10gPSBmXG5cbiAgIyBDb25uZWN0aW5nICYgQm9vdGluZ1xuXG4gIGVtaXR0ZXI6IG5ldyBFbWl0dGVyXG5cbiAgb25BdHRhY2hlZDogKGNiKSAtPiBAZW1pdHRlci5vbiAnYXR0YWNoZWQnLCBjYlxuICBvbkRldGFjaGVkOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkZXRhY2hlZCcsIGNiXG5cbiAgb25jZUF0dGFjaGVkOiAoY2IpIC0+XG4gICAgZiA9IEBvbkF0dGFjaGVkIChhcmdzLi4uKSAtPlxuICAgICAgZi5kaXNwb3NlKClcbiAgICAgIGNiLmNhbGwgdGhpcywgYXJncy4uLlxuXG4gIGlzQWN0aXZlOiAtPiBAY29ubj9cblxuICBhdHRhY2g6IChAY29ubikgLT5cbiAgICBAZmx1c2goKSB1bmxlc3MgQGNvbm4ucmVhZHk/KCkgaXMgZmFsc2VcbiAgICBAZW1pdHRlci5lbWl0ICdhdHRhY2hlZCdcblxuICBkZXRhY2g6IC0+XG4gICAgZGVsZXRlIEBjb25uXG4gICAgQGlwYy5yZXNldCgpXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGV0YWNoZWQnXG5cbiAgZmx1c2g6IC0+IEBpcGMuZmx1c2goKVxuXG4gIGlzV29ya2luZzogLT4gQGlwYy5pc1dvcmtpbmcoKVxuICBvbldvcmtpbmc6IChmKSAtPiBAaXBjLm9uV29ya2luZyBmXG4gIG9uRG9uZTogKGYpIC0+IEBpcGMub25Eb25lIGZcbiAgb25jZURvbmU6IChmKSAtPiBAaXBjLm9uY2VEb25lIGZcblxuICAjIE1hbmFnZW1lbnQgJiBVSVxuXG4gIG9uU3Rkb3V0OiAoZikgLT4gQGVtaXR0ZXIub24gJ3N0ZG91dCcsIGZcbiAgb25TdGRlcnI6IChmKSAtPiBAZW1pdHRlci5vbiAnc3RkZXJyJywgZlxuICBvbkluZm86IChmKSAtPiBAZW1pdHRlci5vbiAnaW5mbycsIGZcbiAgb25Cb290OiAoZikgLT4gQGVtaXR0ZXIub24gJ2Jvb3QnLCBmXG4gIHN0ZG91dDogKGRhdGEpIC0+IEBlbWl0dGVyLmVtaXQgJ3N0ZG91dCcsIGRhdGFcbiAgc3RkZXJyOiAoZGF0YSkgLT4gQGVtaXR0ZXIuZW1pdCAnc3RkZXJyJywgZGF0YSB1bmxlc3MgQGJhc2ljSGFuZGxlciBkYXRhXG4gIGluZm86IChkYXRhKSAtPiBAZW1pdHRlci5lbWl0ICdpbmZvJywgZGF0YVxuXG4gIGNsaWVudENhbGw6IChuYW1lLCBmLCBhcmdzLi4uKSAtPlxuICAgIGlmIG5vdCBAY29ubltmXT9cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIlRoaXMgY2xpZW50IGRvZXNuJ3Qgc3VwcG9ydCAje25hbWV9LlwiXG4gICAgZWxzZVxuICAgICAgQGNvbm5bZl0uY2FsbCBAY29ubiwgYXJncy4uLlxuXG4gIHN0ZGluOiAoZGF0YSkgLT4gQGNsaWVudENhbGwgJ1NURElOJywgJ3N0ZGluJywgZGF0YVxuXG4gIGludGVycnVwdDogLT5cbiAgICBpZiBAaXNBY3RpdmUoKVxuICAgICAgQGNsaWVudENhbGwgJ2ludGVycnVwdHMnLCAnaW50ZXJydXB0J1xuXG4gIGRpc2Nvbm5lY3Q6IC0+XG4gICAgaWYgQGlzQWN0aXZlKClcbiAgICAgIEBjbGllbnRDYWxsICdkaXNjb25uZWN0aW5nJywgJ2Rpc2Nvbm5lY3QnXG5cbiAga2lsbDogLT5cbiAgICBpZiBAaXNBY3RpdmUoKVxuICAgICAgaWYgbm90IEBpc1dvcmtpbmcoKVxuICAgICAgICBAaW1wb3J0KCdleGl0JykoKS5jYXRjaCAtPlxuICAgICAgZWxzZVxuICAgICAgICBAY2xpZW50Q2FsbCAna2lsbCcsICdraWxsJ1xuICAgIGVsc2VcbiAgICAgIEBpcGMucmVzZXQoKVxuXG4gIGNsYXJnczogLT5cbiAgICB7b3B0aW1pc2F0aW9uTGV2ZWwsIGRlcHJlY2F0aW9uV2FybmluZ3N9ID1cbiAgICAgIGF0b20uY29uZmlnLmdldCAnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucydcbiAgICBhcyA9IFtdXG4gICAgYXMucHVzaCBcIi0tZGVwd2Fybj0je2lmIGRlcHJlY2F0aW9uV2FybmluZ3MgdGhlbiAneWVzJyBlbHNlICdubyd9XCJcbiAgICBhcy5wdXNoIFwiLU8je29wdGltaXNhdGlvbkxldmVsfVwiIHVubGVzcyBvcHRpbWlzYXRpb25MZXZlbCBpcyAyXG4gICAgYXMucHVzaCBcIi0tY29sb3I9eWVzXCJcbiAgICBhcy5wdXNoIFwiLWlcIlxuICAgIHN0YXJ0dXBBcmdzID0gYXRvbS5jb25maWcuZ2V0ICdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLnN0YXJ0dXBBcmd1bWVudHMnXG4gICAgaWYgc3RhcnR1cEFyZ3MubGVuZ3RoID4gMFxuICAgICAgYXMgPSBhcy5jb25jYXQgc3RhcnR1cEFyZ3NcbiAgICBhcyA9IGFzLm1hcCAoYXJnKSA9PiBhcmcudHJpbSgpXG4gICAgYXMgPSBhcy5maWx0ZXIgKGFyZykgPT4gYXJnLmxlbmd0aCA+IDBcbiAgICBhc1xuXG4gIGNvbm5lY3RlZEVycm9yOiAoYWN0aW9uID0gJ2RvIHRoYXQnKSAtPlxuICAgIGlmIEBpc0FjdGl2ZSgpXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJDYW4ndCAje2FjdGlvbn0gd2l0aCBhIEp1bGlhIGNsaWVudCBydW5uaW5nLlwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdG9wIHRoZSBjdXJyZW50IGNsaWVudCB3aXRoIGBQYWNrYWdlcyAtPiBKdW5vIC0+IFN0b3AgSnVsaWFgLlwiXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBub3RDb25uZWN0ZWRFcnJvcjogKGFjdGlvbiA9ICdkbyB0aGF0JykgLT5cbiAgICBpZiBub3QgQGlzQWN0aXZlKClcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkNhbid0ICN7YWN0aW9ufSB3aXRob3V0IGEgSnVsaWEgY2xpZW50IHJ1bm5pbmcuXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YXJ0IGEgY2xpZW50IHdpdGggYFBhY2thZ2VzIC0+IEp1bm8gLT4gU3RhcnQgSnVsaWFgLlwiXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICByZXF1aXJlOiAoYSwgZikgLT5cbiAgICBmID8gW2EsIGZdID0gW251bGwsIGFdXG4gICAgQG5vdENvbm5lY3RlZEVycm9yKGEpIG9yIGYoKVxuXG4gIGRpc3JlcXVpcmU6IChhLCBmKSAtPlxuICAgIGYgPyBbYSwgZl0gPSBbbnVsbCwgYV1cbiAgICBAY29ubmVjdGVkRXJyb3IoYSkgb3IgZigpXG5cbiAgd2l0aEN1cnJlbnQ6IChmKSAtPlxuICAgIGN1cnJlbnQgPSBAY29ublxuICAgIChhLi4uKSA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBjdXJyZW50IGlzIEBjb25uXG4gICAgICBmKGEuLi4pXG4iXX0=
