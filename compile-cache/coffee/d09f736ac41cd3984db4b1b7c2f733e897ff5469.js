(function() {
  var IPC, Loading, bufferLines, lwaits, withLoading,
    slice = [].slice;

  Loading = null;

  lwaits = [];

  withLoading = function(f) {
    if (Loading != null) {
      return f();
    } else {
      return lwaits.push(f);
    }
  };

  bufferLines = require('../misc').bufferLines;

  module.exports = IPC = (function() {
    IPC.consumeInk = function(ink) {
      var f, i, len, results;
      Loading = ink.Loading;
      results = [];
      for (i = 0, len = lwaits.length; i < len; i++) {
        f = lwaits[i];
        results.push(f());
      }
      return results;
    };

    function IPC(stream) {
      withLoading((function(_this) {
        return function() {
          return _this.loading = new Loading;
        };
      })(this));
      this.handlers = {};
      this.callbacks = {};
      this.queue = [];
      this.id = 0;
      if (stream != null) {
        this.setStream(stream);
      }
      this.handle({
        cb: (function(_this) {
          return function(id, result) {
            var ref;
            if ((ref = _this.callbacks[id]) != null) {
              ref.resolve(result);
            }
            return delete _this.callbacks[id];
          };
        })(this),
        cancelCallback: (function(_this) {
          return function(id, e) {
            return _this.callbacks[id].reject(e);
          };
        })(this)
      });
    }

    IPC.prototype.handle = function(type, f) {
      var results, t;
      if (f != null) {
        return this.handlers[type] = f;
      } else {
        results = [];
        for (t in type) {
          f = type[t];
          results.push(this.handle(t, f));
        }
        return results;
      }
    };

    IPC.prototype.writeMsg = function() {
      throw new Error('msg not implemented');
    };

    IPC.prototype.msg = function() {
      var args, type;
      type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return this.writeMsg([type].concat(slice.call(args)));
    };

    IPC.prototype.rpc = function() {
      var args, p, ref, type;
      type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      p = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.id += 1;
          _this.callbacks[_this.id] = {
            resolve: resolve,
            reject: reject
          };
          return _this.msg.apply(_this, [{
            type: type,
            callback: _this.id
          }].concat(slice.call(args)));
        };
      })(this));
      return (ref = this.loading) != null ? ref.monitor(p) : void 0;
    };

    IPC.prototype.flush = function() {
      var i, len, msg, ref;
      ref = this.queue;
      for (i = 0, len = ref.length; i < len; i++) {
        msg = ref[i];
        this.writeMsg(msg);
      }
      return this.queue = [];
    };

    IPC.prototype.reset = function() {
      var cb, id, ref, ref1;
      if ((ref = this.loading) != null) {
        ref.reset();
      }
      this.queue = [];
      ref1 = this.callbacks;
      for (id in ref1) {
        cb = ref1[id];
        cb.reject('disconnected');
      }
      return this.callbacks = {};
    };

    IPC.prototype.input = function(arg) {
      var args, callback, ref, result, type;
      type = arg[0], args = 2 <= arg.length ? slice.call(arg, 1) : [];
      if (type.constructor === Object) {
        ref = type, type = ref.type, callback = ref.callback;
      }
      if (this.handlers.hasOwnProperty(type)) {
        result = Promise.resolve().then((function(_this) {
          return function() {
            var ref1;
            return (ref1 = _this.handlers)[type].apply(ref1, args);
          };
        })(this));
        if (callback) {
          return result.then((function(_this) {
            return function(result) {
              return _this.msg('cb', callback, result);
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              console.error(err);
              return _this.msg('cancelCallback', callback, _this.errJson(err));
            };
          })(this));
        }
      } else {
        return console.log("julia-client: unrecognised message " + type, args);
      }
    };

    IPC.prototype["import"] = function(fs, rpc, mod) {
      if (rpc == null) {
        rpc = true;
      }
      if (mod == null) {
        mod = {};
      }
      if (fs == null) {
        return;
      }
      if (fs.constructor === String) {
        return this["import"]([fs], rpc, mod)[fs];
      }
      if ((fs.rpc != null) || (fs.msg != null)) {
        mod = {};
        this["import"](fs.rpc, true, mod);
        this["import"](fs.msg, false, mod);
      } else {
        fs.forEach((function(_this) {
          return function(f) {
            return mod[f] = function() {
              var args;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              if (rpc) {
                return _this.rpc.apply(_this, [f].concat(slice.call(args)));
              } else {
                return _this.msg.apply(_this, [f].concat(slice.call(args)));
              }
            };
          };
        })(this));
      }
      return mod;
    };

    IPC.prototype.isWorking = function() {
      var ref;
      return (ref = this.loading) != null ? ref.isWorking() : void 0;
    };

    IPC.prototype.onWorking = function(f) {
      var ref;
      return (ref = this.loading) != null ? ref.onWorking(f) : void 0;
    };

    IPC.prototype.onDone = function(f) {
      var ref;
      return (ref = this.loading) != null ? ref.onDone(f) : void 0;
    };

    IPC.prototype.onceDone = function(f) {
      var ref;
      return (ref = this.loading) != null ? ref.onceDone(f) : void 0;
    };

    IPC.prototype.errJson = function(obj) {
      if (!(obj instanceof Error)) {
        return;
      }
      return {
        type: 'error',
        message: obj.message,
        stack: obj.stack
      };
    };

    IPC.prototype.readStream = function(s) {
      var cb;
      s.on('data', cb = bufferLines((function(_this) {
        return function(m) {
          if (m) {
            return _this.input(JSON.parse(m));
          }
        };
      })(this)));
      return this.unreadStream = function() {
        return s.removeListener('data', cb);
      };
    };

    IPC.prototype.writeStream = function(s) {
      return this.writeMsg = function(m) {
        s.write(JSON.stringify(m));
        return s.write('\n');
      };
    };

    IPC.prototype.setStream = function(stream1) {
      this.stream = stream1;
      this.readStream(this.stream);
      this.writeStream(this.stream);
      return this.stream.on('end', (function(_this) {
        return function() {
          return _this.reset();
        };
      })(this));
    };

    return IPC;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vaXBjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7RUFBQSxPQUFBLEdBQVU7O0VBQ1YsTUFBQSxHQUFTOztFQUNULFdBQUEsR0FBYyxTQUFDLENBQUQ7SUFBTyxJQUFHLGVBQUg7YUFBaUIsQ0FBQSxDQUFBLEVBQWpCO0tBQUEsTUFBQTthQUEwQixNQUFNLENBQUMsSUFBUCxDQUFZLENBQVosRUFBMUI7O0VBQVA7O0VBRWIsY0FBZSxPQUFBLENBQVEsU0FBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVKLEdBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQUFBLE9BQUEsR0FBVSxHQUFHLENBQUM7QUFDZDtXQUFBLHdDQUFBOztxQkFBQSxDQUFBLENBQUE7QUFBQTs7SUFGVzs7SUFJQSxhQUFDLE1BQUQ7TUFDWCxXQUFBLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNWLEtBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtRQURMO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO01BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLEVBQUQsR0FBTTtNQUVOLElBQUcsY0FBSDtRQUFnQixJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBaEI7O01BRUEsSUFBQyxDQUFBLE1BQUQsQ0FDRTtRQUFBLEVBQUEsRUFBSSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEVBQUQsRUFBSyxNQUFMO0FBQ0YsZ0JBQUE7O2lCQUFjLENBQUUsT0FB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QWpCLEVBQXlCLEVBQXpCO01BQUg7SUFGTjs7a0JBSVosV0FBQSxHQUFhLFNBQUMsQ0FBRDthQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksU0FBQyxDQUFEO1FBQ1YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsQ0FBUjtlQUNBLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUjtNQUZVO0lBREQ7O2tCQUtiLFNBQUEsR0FBVyxTQUFDLE9BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNWLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE1BQWI7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxNQUFkO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsS0FBWCxFQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQjtJQUhTOzs7OztBQXZHYiIsInNvdXJjZXNDb250ZW50IjpbIkxvYWRpbmcgPSBudWxsXG5sd2FpdHMgPSBbXVxud2l0aExvYWRpbmcgPSAoZikgLT4gaWYgTG9hZGluZz8gdGhlbiBmKCkgZWxzZSBsd2FpdHMucHVzaCBmXG5cbntidWZmZXJMaW5lc30gPSByZXF1aXJlICcuLi9taXNjJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJUENcblxuICBAY29uc3VtZUluazogKGluaykgLT5cbiAgICBMb2FkaW5nID0gaW5rLkxvYWRpbmdcbiAgICBmKCkgZm9yIGYgaW4gbHdhaXRzXG5cbiAgY29uc3RydWN0b3I6IChzdHJlYW0pIC0+XG4gICAgd2l0aExvYWRpbmcgPT5cbiAgICAgIEBsb2FkaW5nID0gbmV3IExvYWRpbmdcbiAgICBAaGFuZGxlcnMgPSB7fVxuICAgIEBjYWxsYmFja3MgPSB7fVxuICAgIEBxdWV1ZSA9IFtdXG4gICAgQGlkID0gMFxuXG4gICAgaWYgc3RyZWFtPyB0aGVuIEBzZXRTdHJlYW0gc3RyZWFtXG5cbiAgICBAaGFuZGxlXG4gICAgICBjYjogKGlkLCByZXN1bHQpID0+XG4gICAgICAgIEBjYWxsYmFja3NbaWRdPy5yZXNvbHZlIHJlc3VsdFxuICAgICAgICBkZWxldGUgQGNhbGxiYWNrc1tpZF1cblxuICAgICAgY2FuY2VsQ2FsbGJhY2s6IChpZCwgZSkgPT5cbiAgICAgICAgQGNhbGxiYWNrc1tpZF0ucmVqZWN0IGVcblxuICBoYW5kbGU6ICh0eXBlLCBmKSAtPlxuICAgIGlmIGY/XG4gICAgICBAaGFuZGxlcnNbdHlwZV0gPSBmXG4gICAgZWxzZVxuICAgICAgQGhhbmRsZSB0LCBmIGZvciB0LCBmIG9mIHR5cGVcblxuICB3cml0ZU1zZzogLT4gdGhyb3cgbmV3IEVycm9yICdtc2cgbm90IGltcGxlbWVudGVkJ1xuXG4gIG1zZzogKHR5cGUsIGFyZ3MuLi4pIC0+IEB3cml0ZU1zZyBbdHlwZSwgYXJncy4uLl1cblxuICBycGM6ICh0eXBlLCBhcmdzLi4uKSAtPlxuICAgIHAgPSBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQGlkICs9IDFcbiAgICAgIEBjYWxsYmFja3NbQGlkXSA9IHtyZXNvbHZlLCByZWplY3R9XG4gICAgICBAbXNnIHt0eXBlLCBjYWxsYmFjazogQGlkfSwgYXJncy4uLlxuICAgIEBsb2FkaW5nPy5tb25pdG9yIHBcblxuICBmbHVzaDogLT5cbiAgICBAd3JpdGVNc2cgbXNnIGZvciBtc2cgaW4gQHF1ZXVlXG4gICAgQHF1ZXVlID0gW11cblxuICByZXNldDogLT5cbiAgICBAbG9hZGluZz8ucmVzZXQoKVxuICAgIEBxdWV1ZSA9IFtdXG4gICAgY2IucmVqZWN0ICdkaXNjb25uZWN0ZWQnIGZvciBpZCwgY2Igb2YgQGNhbGxiYWNrc1xuICAgIEBjYWxsYmFja3MgPSB7fVxuXG4gIGlucHV0OiAoW3R5cGUsIGFyZ3MuLi5dKSAtPlxuICAgIGlmIHR5cGUuY29uc3RydWN0b3IgPT0gT2JqZWN0XG4gICAgICB7dHlwZSwgY2FsbGJhY2t9ID0gdHlwZVxuICAgIGlmIEBoYW5kbGVycy5oYXNPd25Qcm9wZXJ0eSB0eXBlXG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+IEBoYW5kbGVyc1t0eXBlXSBhcmdzLi4uXG4gICAgICBpZiBjYWxsYmFja1xuICAgICAgICByZXN1bHRcbiAgICAgICAgICAudGhlbiAocmVzdWx0KSA9PiBAbXNnICdjYicsIGNhbGxiYWNrLCByZXN1bHRcbiAgICAgICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICAgICAgQG1zZyAnY2FuY2VsQ2FsbGJhY2snLCBjYWxsYmFjaywgQGVyckpzb24gZXJyXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2cgXCJqdWxpYS1jbGllbnQ6IHVucmVjb2duaXNlZCBtZXNzYWdlICN7dHlwZX1cIiwgYXJnc1xuXG4gIGltcG9ydDogKGZzLCBycGMgPSB0cnVlLCBtb2QgPSB7fSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGZzP1xuICAgIGlmIGZzLmNvbnN0cnVjdG9yID09IFN0cmluZyB0aGVuIHJldHVybiBAaW1wb3J0KFtmc10sIHJwYywgbW9kKVtmc11cbiAgICBpZiBmcy5ycGM/IG9yIGZzLm1zZz9cbiAgICAgIG1vZCA9IHt9XG4gICAgICBAaW1wb3J0IGZzLnJwYywgdHJ1ZSwgIG1vZFxuICAgICAgQGltcG9ydCBmcy5tc2csIGZhbHNlLCBtb2RcbiAgICBlbHNlXG4gICAgICBmcy5mb3JFYWNoIChmKSA9PlxuICAgICAgICBtb2RbZl0gPSAoYXJncy4uLikgPT5cbiAgICAgICAgICBpZiBycGMgdGhlbiBAcnBjIGYsIGFyZ3MuLi4gZWxzZSBAbXNnIGYsIGFyZ3MuLi5cbiAgICBtb2RcblxuICBpc1dvcmtpbmc6IC0+IEBsb2FkaW5nPy5pc1dvcmtpbmcoKVxuICBvbldvcmtpbmc6IChmKSAtPiBAbG9hZGluZz8ub25Xb3JraW5nIGZcbiAgb25Eb25lOiAoZikgLT4gQGxvYWRpbmc/Lm9uRG9uZSBmXG4gIG9uY2VEb25lOiAoZikgLT4gQGxvYWRpbmc/Lm9uY2VEb25lIGZcblxuICBlcnJKc29uOiAob2JqKSAtPlxuICAgIHJldHVybiB1bmxlc3Mgb2JqIGluc3RhbmNlb2YgRXJyb3JcbiAgICB7dHlwZTogJ2Vycm9yJywgbWVzc2FnZTogb2JqLm1lc3NhZ2UsIHN0YWNrOiBvYmouc3RhY2t9XG5cbiAgcmVhZFN0cmVhbTogKHMpIC0+XG4gICAgcy5vbiAnZGF0YScsIGNiID0gYnVmZmVyTGluZXMgKG0pID0+IGlmIG0gdGhlbiBAaW5wdXQgSlNPTi5wYXJzZSBtXG4gICAgQHVucmVhZFN0cmVhbSA9IC0+IHMucmVtb3ZlTGlzdGVuZXIgJ2RhdGEnLCBjYlxuXG4gIHdyaXRlU3RyZWFtOiAocykgLT5cbiAgICBAd3JpdGVNc2cgPSAobSkgLT5cbiAgICAgIHMud3JpdGUgSlNPTi5zdHJpbmdpZnkgbVxuICAgICAgcy53cml0ZSAnXFxuJ1xuXG4gIHNldFN0cmVhbTogKEBzdHJlYW0pIC0+XG4gICAgQHJlYWRTdHJlYW0gQHN0cmVhbVxuICAgIEB3cml0ZVN0cmVhbSBAc3RyZWFtXG4gICAgQHN0cmVhbS5vbiAnZW5kJywgPT4gQHJlc2V0KClcbiJdfQ==
