(function() {
  var debounce,
    slice = [].slice;

  debounce = require('underscore-plus').debounce;

  module.exports = {
    paths: require('./misc/paths'),
    blocks: require('./misc/blocks'),
    cells: require('./misc/cells'),
    words: require('./misc/words'),
    weave: require('./misc/weave'),
    colors: require('./misc/colors'),
    scopes: require('./misc/scopes'),
    bufferLines: function(t, f) {
      var buffer, flush, ref;
      if (f == null) {
        ref = [null, t], t = ref[0], f = ref[1];
      }
      buffer = [''];
      flush = t == null ? function() {} : debounce((function() {
        if (buffer[0] !== '') {
          f(buffer[0], false);
          return buffer[0] = '';
        }
      }), t);
      return function(data) {
        var lines;
        lines = data.toString().split('\n');
        buffer[0] += lines.shift();
        buffer.push.apply(buffer, lines);
        while (buffer.length > 1) {
          f(buffer.shift(), true);
        }
        return flush();
      };
    },
    time: function(desc, p) {
      var s, t;
      s = function() {
        return new Date().getTime() / 1000;
      };
      t = s();
      p.then(function() {
        return console.log(desc + ": " + ((s() - t).toFixed(2)) + "s");
      })["catch"](function() {});
      return p;
    },
    hook: function(obj, method, f) {
      var souper;
      souper = obj[method].bind(obj);
      return obj[method] = function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return f.apply(null, [souper].concat(slice.call(a)));
      };
    },
    once: function(f) {
      var done;
      done = false;
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (done) {
          return;
        }
        done = true;
        return f.call.apply(f, [this].concat(slice.call(args)));
      };
    },
    mutex: function() {
      var wait;
      wait = Promise.resolve();
      return function(f) {
        var current, release;
        current = wait;
        release = null;
        wait = new Promise(function(resolve) {
          return release = resolve;
        })["catch"](function() {});
        return current.then((function(_this) {
          return function() {
            return f.call(_this, release);
          };
        })(this));
      };
    },
    exclusive: function(f) {
      var lock;
      lock = module.exports.mutex();
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return lock((function(_this) {
          return function(release) {
            var result;
            result = f.call.apply(f, [_this].concat(slice.call(args)));
            release(result);
            return result;
          };
        })(this));
      };
    },
    formatTimePeriod: function(dt) {
      var h, i, m, parts, s;
      if (!(dt > 1)) {
        return;
      }
      h = Math.floor(dt / (60 * 60));
      m = Math.floor((dt -= h * 60 * 60) / 60);
      s = Math.round(dt - m * 60);
      parts = [h, m, s];
      for (i in parts) {
        dt = parts[i];
        parts[i] = dt < 10 ? "0" + dt : "" + dt;
      }
      return parts.join(':');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL21pc2MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUE7O0VBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBUyxPQUFBLENBQVEsY0FBUixDQUFUO0lBQ0EsTUFBQSxFQUFTLE9BQUEsQ0FBUSxlQUFSLENBRFQ7SUFFQSxLQUFBLEVBQVMsT0FBQSxDQUFRLGNBQVIsQ0FGVDtJQUdBLEtBQUEsRUFBUyxPQUFBLENBQVEsY0FBUixDQUhUO0lBSUEsS0FBQSxFQUFTLE9BQUEsQ0FBUSxjQUFSLENBSlQ7SUFLQSxNQUFBLEVBQVMsT0FBQSxDQUFRLGVBQVIsQ0FMVDtJQU1BLE1BQUEsRUFBUyxPQUFBLENBQVEsZUFBUixDQU5UO0lBUUEsV0FBQSxFQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDWCxVQUFBO01BQUEsSUFBTyxTQUFQO1FBQWUsTUFBUyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQVQsRUFBQyxVQUFELEVBQUksV0FBbkI7O01BQ0EsTUFBQSxHQUFTLENBQUMsRUFBRDtNQUNULEtBQUEsR0FBZSxTQUFQLEdBQWUsU0FBQSxHQUFBLENBQWYsR0FBdUIsUUFBQSxDQUFTLENBQUMsU0FBQTtRQUN2QyxJQUFHLE1BQU8sQ0FBQSxDQUFBLENBQVAsS0FBZSxFQUFsQjtVQUNFLENBQUEsQ0FBRSxNQUFPLENBQUEsQ0FBQSxDQUFULEVBQWEsS0FBYjtpQkFDQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVksR0FGZDs7TUFEdUMsQ0FBRCxDQUFULEVBR1YsQ0FIVTthQUkvQixTQUFDLElBQUQ7QUFDRSxZQUFBO1FBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxR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QTtBQUFBLGVBQUE7O01BQ0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBQSxHQUFHLENBQUMsRUFBQSxHQUFHLEVBQUosQ0FBZDtNQUNKLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsRUFBQSxJQUFNLENBQUEsR0FBRSxFQUFGLEdBQUssRUFBWixDQUFBLEdBQWdCLEVBQTNCO01BQ0osQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVksRUFBQSxHQUFLLENBQUEsR0FBRSxFQUFuQjtNQUNKLEtBQUEsR0FBUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNSLFdBQUEsVUFBQTs7UUFDRSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQWMsRUFBQSxHQUFLLEVBQVIsR0FBZ0IsR0FBQSxHQUFJLEVBQXBCLEdBQThCLEVBQUEsR0FBRztBQUQ5QzthQUVBLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWDtJQVJnQixDQTFEbEI7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7ZGVib3VuY2V9ID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHBhdGhzOiAgIHJlcXVpcmUgJy4vbWlzYy9wYXRocydcbiAgYmxvY2tzOiAgcmVxdWlyZSAnLi9taXNjL2Jsb2NrcydcbiAgY2VsbHM6ICAgcmVxdWlyZSAnLi9taXNjL2NlbGxzJ1xuICB3b3JkczogICByZXF1aXJlICcuL21pc2Mvd29yZHMnXG4gIHdlYXZlOiAgIHJlcXVpcmUgJy4vbWlzYy93ZWF2ZSdcbiAgY29sb3JzOiAgcmVxdWlyZSAnLi9taXNjL2NvbG9ycydcbiAgc2NvcGVzOiAgcmVxdWlyZSAnLi9taXNjL3Njb3BlcydcblxuICBidWZmZXJMaW5lczogKHQsIGYpIC0+XG4gICAgaWYgbm90IGY/IHRoZW4gW3QsIGZdID0gW251bGwsIHRdXG4gICAgYnVmZmVyID0gWycnXVxuICAgIGZsdXNoID0gaWYgbm90IHQ/IHRoZW4gLT4gZWxzZSBkZWJvdW5jZSAoLT5cbiAgICAgIGlmIGJ1ZmZlclswXSBpc250ICcnXG4gICAgICAgIGYgYnVmZmVyWzBdLCBmYWxzZVxuICAgICAgICBidWZmZXJbMF0gPSAnJyksIHRcbiAgICAoZGF0YSkgLT5cbiAgICAgIGxpbmVzID0gZGF0YS50b1N0cmluZygpLnNwbGl0ICdcXG4nXG4gICAgICBidWZmZXJbMF0gKz0gbGluZXMuc2hpZnQoKVxuICAgICAgYnVmZmVyLnB1c2ggbGluZXMuLi5cbiAgICAgIHdoaWxlIGJ1ZmZlci5sZW5ndGggPiAxXG4gICAgICAgIGYgYnVmZmVyLnNoaWZ0KCksIHRydWVcbiAgICAgIGZsdXNoKClcblxuICB0aW1lOiAoZGVzYywgcCkgLT5cbiAgICBzID0gLT4gbmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMFxuICAgIHQgPSBzKClcbiAgICBwLnRoZW4gLT4gY29uc29sZS5sb2cgXCIje2Rlc2N9OiAjeyhzKCktdCkudG9GaXhlZCgyKX1zXCJcbiAgICAgIC5jYXRjaCAtPlxuICAgIHBcblxuICBob29rOiAob2JqLCBtZXRob2QsIGYpIC0+XG4gICAgc291cGVyID0gb2JqW21ldGhvZF0uYmluZCBvYmpcbiAgICBvYmpbbWV0aG9kXSA9IChhLi4uKSAtPiBmIHNvdXBlciwgYS4uLlxuXG4gIG9uY2U6IChmKSAtPlxuICAgIGRvbmUgPSBmYWxzZVxuICAgIChhcmdzLi4uKSAtPlxuICAgICAgcmV0dXJuIGlmIGRvbmVcbiAgICAgIGRvbmUgPSB0cnVlXG4gICAgICBmLmNhbGwgQCwgYXJncy4uLlxuXG4gIG11dGV4OiAtPlxuICAgIHdhaXQgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIChmKSAtPlxuICAgICAgY3VycmVudCA9IHdhaXRcbiAgICAgIHJlbGVhc2UgPSBudWxsXG4gICAgICB3YWl0ID0gbmV3IFByb21pc2UoKHJlc29sdmUpIC0+IHJlbGVhc2UgPSByZXNvbHZlKS5jYXRjaCAtPlxuICAgICAgY3VycmVudC50aGVuID0+IGYuY2FsbCBALCByZWxlYXNlXG5cbiAgZXhjbHVzaXZlOiAoZikgLT5cbiAgICBsb2NrID0gbW9kdWxlLmV4cG9ydHMubXV0ZXgoKVxuICAgIChhcmdzLi4uKSAtPlxuICAgICAgbG9jayAocmVsZWFzZSkgPT5cbiAgICAgICAgcmVzdWx0ID0gZi5jYWxsIEAsIGFyZ3MuLi5cbiAgICAgICAgcmVsZWFzZSByZXN1bHRcbiAgICAgICAgcmVzdWx0XG5cbiAgIyB0YWtlcyBhIHRpbWUgcGVyaW9kIGluIHNlY29uZHMgYW5kIGZvcm1hdHMgaXQgYXMgaGg6bW06c3NcbiAgZm9ybWF0VGltZVBlcmlvZDogKGR0KSAtPlxuICAgIHJldHVybiB1bmxlc3MgZHQgPiAxXG4gICAgaCA9IE1hdGguZmxvb3IgZHQvKDYwKjYwKVxuICAgIG0gPSBNYXRoLmZsb29yIChkdCAtPSBoKjYwKjYwKS82MFxuICAgIHMgPSBNYXRoLnJvdW5kIChkdCAtIG0qNjApXG4gICAgcGFydHMgPSBbaCwgbSwgc11cbiAgICBmb3IgaSwgZHQgb2YgcGFydHNcbiAgICAgIHBhcnRzW2ldID0gaWYgZHQgPCAxMCB0aGVuIFwiMCN7ZHR9XCIgZWxzZSBcIiN7ZHR9XCJcbiAgICBwYXJ0cy5qb2luICc6J1xuIl19
