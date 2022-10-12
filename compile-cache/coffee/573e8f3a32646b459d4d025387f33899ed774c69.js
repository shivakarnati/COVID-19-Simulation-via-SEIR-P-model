(function() {
  var IPC, basic, hash, isEqual,
    slice = [].slice;

  isEqual = require('underscore-plus').isEqual;

  hash = require('object-hash');

  basic = require('./basic');

  IPC = require('../ipc');

  module.exports = {
    provider: function() {
      return basic;
    },
    cacheLength: 1,
    procs: {},
    key: function(path, args) {
      return hash([path].concat(slice.call(args)).join(' ').trim());
    },
    cache: function(path, args) {
      var base, name;
      return (base = this.procs)[name = this.key(path, args)] != null ? base[name] : base[name] = [];
    },
    removeFromCache: function(path, args, obj) {
      var key;
      key = this.key(path, args);
      return this.procs[key] = this.procs[key].filter(function(x) {
        return x !== obj;
      });
    },
    toCache: function(path, args, proc) {
      proc.cached = true;
      return this.cache(path, args).push(proc);
    },
    fromCache: function(path, args) {
      var p, ps;
      ps = this.cache(path, args);
      p = ps.shift();
      if (p == null) {
        return;
      }
      p.cached = false;
      return p.init.then((function(_this) {
        return function() {
          _this.start(path, args);
          return p.proc;
        };
      })(this));
    },
    start: function(path, args) {
      var allArgs;
      allArgs = [args, atom.config.get('julia-client.juliaOptions')];
      this.provider().lock((function(_this) {
        return function(release) {
          var p;
          if (_this.cache(path, allArgs).length < _this.cacheLength) {
            p = _this.provider().get_(path, args).then(function(proc) {
              var obj;
              obj = {
                path: path,
                allArgs: allArgs,
                proc: proc
              };
              _this.monitor(proc);
              _this.warmup(obj);
              _this.toCache(path, allArgs, obj);
              proc.socket.then(function() {
                return _this.start(path, allArgs);
              })["catch"](function(e) {
                return _this.removeFromCache(path, allArgs, obj);
              });
              return release(proc.socket);
            });
            return p["catch"](function(err) {
              return release();
            });
          } else {
            return release();
          }
        };
      })(this));
    },
    flush: function(events, out, err) {
      var data, i, len, ref, results, type;
      results = [];
      for (i = 0, len = events.length; i < len; i++) {
        ref = events[i], type = ref.type, data = ref.data;
        results.push((type === 'stdout' ? out : err)(data));
      }
      return results;
    },
    monitor: function(proc) {
      proc.events = [];
      proc.wasCached = true;
      proc.onStdout(function(data) {
        var ref;
        return (ref = proc.events) != null ? ref.push({
          type: 'stdout',
          data: data
        }) : void 0;
      });
      proc.onStderr(function(data) {
        var ref;
        return (ref = proc.events) != null ? ref.push({
          type: 'stderr',
          data: data
        }) : void 0;
      });
      return proc.flush = (function(_this) {
        return function(out, err) {
          _this.flush(proc.events, out, err);
          return delete proc.events;
        };
      })(this);
    },
    boot: function(ipc) {
      return ipc.rpc('ping');
    },
    repl: function(ipc) {
      return ipc.rpc('changemodule', {
        mod: 'Main'
      });
    },
    warmup: function(obj) {
      obj.init = Promise.resolve();
      return obj.proc.socket.then((function(_this) {
        return function(sock) {
          var ipc;
          if (!obj.cached) {
            return;
          }
          ipc = new IPC(sock);
          [_this.boot, _this.repl].forEach(function(f) {
            return obj.init = obj.init.then(function() {
              if (obj.cached) {
                return f(ipc);
              }
            });
          });
          obj.init = obj.init["catch"](function(err) {
            return console.warn('julia warmup error:', err);
          }).then(function() {
            return ipc.unreadStream();
          });
        };
      })(this))["catch"](function() {});
    },
    get: function(path, args) {
      var allArgs, p, proc;
      allArgs = [args, atom.config.get('julia-client.juliaOptions')];
      if ((proc = this.fromCache(path, allArgs))) {
        p = proc;
      } else {
        p = this.provider().get(path, args);
      }
      this.start(path, args);
      return p;
    },
    reset: function() {
      var key, p, ps, ref, results;
      ref = this.procs;
      results = [];
      for (key in ref) {
        ps = ref[key];
        results.push((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = ps.length; i < len; i++) {
            p = ps[i];
            results1.push(p.proc.kill());
          }
          return results1;
        })());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vcHJvY2Vzcy9jeWNsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBOztFQUFDLFVBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNaLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUjs7RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0VBRVIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUNSO0lBRFEsQ0FBVjtJQUdBLFdBQUEsRUFBYSxDQUhiO0lBS0EsS0FBQSxFQUFPLEVBTFA7SUFPQSxHQUFBLEVBQUssU0FBQyxJQUFELEVBQU8sSUFBUDthQUFnQixJQUFBLENBQU0sQ0FBQSxJQUFNLFNBQUEsV0FBQSxJQUFBLENBQUEsQ0FBUSxDQUFDLElBQWhCLENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBMUIsQ0FBQSxDQUFMO0lBQWhCLENBUEw7SUFTQSxLQUFBLEVBQU8sU0FBQyxJQUFELEVBQU8sSUFBUDtBQUFnQixVQUFBO2tHQUE0QjtJQUE1QyxDQVRQO0lBV0EsZUFBQSxFQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsR0FBYjtBQUNmLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBQVcsSUFBWDthQUNOLElBQUMsQ0FBQSxLQUFNLENBQUEsR0FBQSxDQUFQLEdBQWMsSUFBQyxDQUFBLEtBQU0sQ0FBQSxHQUFBLENBQUksQ0FBQyxNQUFaLENBQW1CLFNBQUMsQ0FBRDtlQUFPLENBQUEsS0FBSztNQUFaLENBQW5CO0lBRkMsQ0FYakI7SUFlQSxPQUFBLEVBQVMs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QW1CLENBQUEsQ0FBRSxHQUFGLEVBQW5COztZQUR1QixDQUFkO1VBRFUsQ0FBdkI7VUFHQSxHQUFHLENBQUMsSUFBSixHQUFXLEdBQUcsQ0FBQyxJQUNiLEVBQUMsS0FBRCxFQURTLENBQ0YsU0FBQyxHQUFEO21CQUFTLE9BQU8sQ0FBQyxJQUFSLENBQWEscUJBQWIsRUFBb0MsR0FBcEM7VUFBVCxDQURFLENBRVQsQ0FBQyxJQUZRLENBRUgsU0FBQTttQkFBRyxHQUFHLENBQUMsWUFBSixDQUFBO1VBQUgsQ0FGRztRQU5QO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSLENBV0UsRUFBQyxLQUFELEVBWEYsQ0FXUyxTQUFBLEdBQUEsQ0FYVDtJQUZNLENBL0RSO0lBOEVBLEdBQUEsRUFBSyxTQUFDLElBQUQsRUFBTyxJQUFQO0FBQ0gsVUFBQTtNQUFBLE9BQUEsR0FBVSxDQUFDLElBQUQsRUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLENBQVA7TUFDVixJQUFHLENBQUMsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixPQUFqQixDQUFSLENBQUg7UUFBMEMsQ0FBQSxHQUFJLEtBQTlDO09BQUEsTUFBQTtRQUNLLENBQUEsR0FBSSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVcsQ0FBQyxHQUFaLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBRFQ7O01BRUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLEVBQWEsSUFBYjthQUNBO0lBTEcsQ0E5RUw7SUFxRkEsS0FBQSxFQUFPLFNBQUE7QUFDTCxVQUFBO0FBQUE7QUFBQTtXQUFBLFVBQUE7Ozs7QUFDRTtlQUFBLG9DQUFBOzswQkFDRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQVAsQ0FBQTtBQURGOzs7QUFERjs7SUFESyxDQXJGUDs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIntpc0VxdWFsfSA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbmhhc2ggPSByZXF1aXJlICdvYmplY3QtaGFzaCdcbmJhc2ljID0gcmVxdWlyZSAnLi9iYXNpYydcblxuSVBDID0gcmVxdWlyZSAnLi4vaXBjJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHByb3ZpZGVyOiAtPlxuICAgIGJhc2ljXG5cbiAgY2FjaGVMZW5ndGg6IDFcblxuICBwcm9jczoge31cblxuICBrZXk6IChwYXRoLCBhcmdzKSAtPiBoYXNoKFtwYXRoLCBhcmdzLi4uXS5qb2luKCcgJykudHJpbSgpKVxuXG4gIGNhY2hlOiAocGF0aCwgYXJncykgLT4gQHByb2NzW0BrZXkocGF0aCwgYXJncyldID89IFtdXG5cbiAgcmVtb3ZlRnJvbUNhY2hlOiAocGF0aCwgYXJncywgb2JqKSAtPlxuICAgIGtleSA9IEBrZXkgcGF0aCwgYXJnc1xuICAgIEBwcm9jc1trZXldID0gQHByb2NzW2tleV0uZmlsdGVyICh4KSAtPiB4ICE9IG9ialxuXG4gIHRvQ2FjaGU6IChwYXRoLCBhcmdzLCBwcm9jKSAtPlxuICAgIHByb2MuY2FjaGVkID0gdHJ1ZVxuICAgIEBjYWNoZShwYXRoLCBhcmdzKS5wdXNoIHByb2NcblxuICBmcm9tQ2FjaGU6IChwYXRoLCBhcmdzKSAtPlxuICAgIHBzID0gQGNhY2hlIHBhdGgsIGFyZ3NcbiAgICBwID0gcHMuc2hpZnQoKVxuICAgIHJldHVybiB1bmxlc3MgcD9cbiAgICBwLmNhY2hlZCA9IGZhbHNlXG4gICAgcC5pbml0LnRoZW4gPT5cbiAgICAgIEBzdGFydCBwYXRoLCBhcmdzXG4gICAgICBwLnByb2NcblxuICBzdGFydDogKHBhdGgsIGFyZ3MpIC0+XG4gICAgYWxsQXJncyA9IFthcmdzLCBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYU9wdGlvbnMnKV1cbiAgICBAcHJvdmlkZXIoKS5sb2NrIChyZWxlYXNlKSA9PlxuICAgICAgaWYgQGNhY2hlKHBhdGgsIGFsbEFyZ3MpLmxlbmd0aCA8IEBjYWNoZUxlbmd0aFxuICAgICAgICBwID0gQHByb3ZpZGVyKCkuZ2V0XyhwYXRoLCBhcmdzKS50aGVuIChwcm9jKSA9PlxuICAgICAgICAgIG9iaiA9IHtwYXRoLCBhbGxBcmdzLCBwcm9jOiBwcm9jfVxuICAgICAgICAgIEBtb25pdG9yIHByb2NcbiAgICAgICAgICBAd2FybXVwIG9ialxuICAgICAgICAgIEB0b0NhY2hlIHBhdGgsIGFsbEFyZ3MsIG9ialxuICAgICAgICAgIHByb2Muc29ja2V0XG4gICAgICAgICAgICAudGhlbiA9PiBAc3RhcnQgcGF0aCwgYWxsQXJnc1xuICAgICAgICAgICAgLmNhdGNoIChlKSA9PiBAcmVtb3ZlRnJvbUNhY2hlIHBhdGgsIGFsbEFyZ3MsIG9ialxuICAgICAgICAgIHJlbGVhc2UgcHJvYy5zb2NrZXRcbiAgICAgICAgcC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICAgIHJlbGVhc2UoKVxuICAgICAgZWxzZVxuICAgICAgICByZWxlYXNlKClcbiAgICByZXR1cm5cblxuICBmbHVzaDogKGV2ZW50cywgb3V0LCBlcnIpIC0+XG4gICAgZm9yIHt0eXBlLCBkYXRhfSBpbiBldmVudHNcbiAgICAgIChpZiB0eXBlID09ICdzdGRvdXQnIHRoZW4gb3V0IGVsc2UgZXJyKSBkYXRhXG5cbiAgbW9uaXRvcjogKHByb2MpIC0+XG4gICAgcHJvYy5ldmVudHMgPSBbXVxuICAgIHByb2Mud2FzQ2FjaGVkID0gdHJ1ZVxuICAgIHByb2Mub25TdGRvdXQgKGRhdGEpIC0+IHByb2MuZXZlbnRzPy5wdXNoIHt0eXBlOiAnc3Rkb3V0JywgZGF0YX1cbiAgICBwcm9jLm9uU3RkZXJyIChkYXRhKSAtPiBwcm9jLmV2ZW50cz8ucHVzaCB7dHlwZTogJ3N0ZGVycicsIGRhdGF9XG4gICAgcHJvYy5mbHVzaCA9IChvdXQsIGVycikgPT5cbiAgICAgIEBmbHVzaCBwcm9jLmV2ZW50cywgb3V0LCBlcnJcbiAgICAgIGRlbGV0ZSBwcm9jLmV2ZW50c1xuXG4gIGJvb3Q6IChpcGMpIC0+IGlwYy5ycGMgJ3BpbmcnXG4gIHJlcGw6IChpcGMpIC0+IGlwYy5ycGMgJ2NoYW5nZW1vZHVsZScsIHttb2Q6ICdNYWluJ31cblxuICB3YXJtdXA6IChvYmopIC0+XG4gICAgb2JqLmluaXQgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIG9iai5wcm9jLnNvY2tldFxuICAgICAgLnRoZW4gKHNvY2spID0+XG4gICAgICAgIHJldHVybiB1bmxlc3Mgb2JqLmNhY2hlZFxuICAgICAgICBpcGMgPSBuZXcgSVBDIHNvY2tcbiAgICAgICAgW0Bib290LCBAcmVwbF0uZm9yRWFjaCAoZikgLT5cbiAgICAgICAgICBvYmouaW5pdCA9IG9iai5pbml0LnRoZW4gLT5cbiAgICAgICAgICAgIGlmIG9iai5jYWNoZWQgdGhlbiBmIGlwY1xuICAgICAgICBvYmouaW5pdCA9IG9iai5pbml0XG4gICAgICAgICAgLmNhdGNoIChlcnIpIC0+IGNvbnNvbGUud2FybiAnanVsaWEgd2FybXVwIGVycm9yOicsIGVyclxuICAgICAgICAgIC50aGVuIC0+IGlwYy51bnJlYWRTdHJlYW0oKVxuICAgICAgICByZXR1cm5cbiAgICAgIC5jYXRjaCAtPlxuXG4gIGdldDogKHBhdGgsIGFyZ3MpIC0+XG4gICAgYWxsQXJncyA9IFthcmdzLCBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYU9wdGlvbnMnKV1cbiAgICBpZiAocHJvYyA9IEBmcm9tQ2FjaGUgcGF0aCwgYWxsQXJncykgdGhlbiBwID0gcHJvY1xuICAgIGVsc2UgcCA9IEBwcm92aWRlcigpLmdldCBwYXRoLCBhcmdzXG4gICAgQHN0YXJ0IHBhdGgsIGFyZ3NcbiAgICBwXG5cbiAgcmVzZXQ6IC0+XG4gICAgZm9yIGtleSwgcHMgb2YgQHByb2NzXG4gICAgICBmb3IgcCBpbiBwc1xuICAgICAgICBwLnByb2Mua2lsbCgpXG4iXX0=
