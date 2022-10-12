(function() {
  var CompositeDisposable, client, formatTimePeriod;

  CompositeDisposable = require('atom').CompositeDisposable;

  client = require('../connection').client;

  formatTimePeriod = require('../misc').formatTimePeriod;

  module.exports = {
    progs: {},
    activate: function(ink) {
      var status;
      this.subs = new CompositeDisposable;
      this.ink = ink;
      client.handle({
        'progress': (function(_this) {
          return function(t, id, m) {
            return _this[t](id, m);
          };
        })(this)
      });
      status = [];
      return this.subs.add(client.onWorking((function(_this) {
        return function() {
          return status = _this.ink.progress.add(null, {
            description: 'Julia'
          });
        };
      })(this)), client.onDone((function(_this) {
        return function() {
          return status != null ? status.destroy() : void 0;
        };
      })(this)), client.onAttached((function(_this) {
        return function() {
          return _this.ink.progress.show();
        };
      })(this)), client.onDetached((function(_this) {
        return function() {
          return _this.clear();
        };
      })(this)));
    },
    deactivate: function() {
      this.clear();
      return this.subs.dispose();
    },
    add: function(id) {
      var pr;
      pr = this.ink.progress.add();
      pr.t0 = Date.now();
      pr.showTime = true;
      return this.progs[id] = pr;
    },
    progress: function(id, prog) {
      var pr;
      pr = this.progs[id];
      if (pr == null) {
        return;
      }
      pr.level = prog;
      if (pr.showTime) {
        return this.rightText(id, null);
      }
    },
    message: function(id, m) {
      var ref;
      return (ref = this.progs[id]) != null ? ref.message = m : void 0;
    },
    leftText: function(id, m) {
      var ref;
      return (ref = this.progs[id]) != null ? ref.description = m : void 0;
    },
    rightText: function(id, m) {
      var dt, pr;
      pr = this.progs[id];
      if (pr == null) {
        return;
      }
      if (m != null ? m.length : void 0) {
        pr.rightText = m;
        return pr.showTime = false;
      } else {
        dt = (Date.now() - pr.t0) * (1 / pr.level - 1) / 1000;
        pr.showTime = true;
        return pr.rightText = formatTimePeriod(dt);
      }
    },
    "delete": function(id) {
      var pr;
      pr = this.progs[id];
      if (pr == null) {
        return;
      }
      pr.destroy();
      return delete this.progs[id];
    },
    clear: function() {
      var _, p, ref;
      ref = this.progs;
      for (_ in ref) {
        p = ref[_];
        if (p != null) {
          p.destroy();
        }
      }
      this.progs = {};
      return this.ink.progress.hide();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3VpL3Byb2dyZXNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixTQUFVLE9BQUEsQ0FBUSxlQUFSOztFQUNWLG1CQUFvQixPQUFBLENBQVEsU0FBUjs7RUFFckIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxFQUFQO0lBRUEsUUFBQSxFQUFVLFNBQUMsR0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUk7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFPO01BQ1AsTUFBTSxDQUFDLE1BQVAsQ0FBYztRQUFBLFVBQUEsRUFBWSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsQ0FBUjttQkFBYyxLQUFFLENBQUEsQ0FBQSxDQUFGLENBQUssRUFBTCxFQUFTLENBQVQ7VUFBZDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtPQUFkO01BQ0EsTUFBQSxHQUFTO2FBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQ0UsTUFBTSxDQUFDLFNBQVAsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNoQixNQUFBLEdBQVMsS0FBQyxDQUFBLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFsQixFQUF3QjtZQUFBLFdBQUEsRUFBYSxPQUFiO1dBQXhCO1FBRE87TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLENBREYsRUFHRSxNQUFNLENBQUMsTUFBUCxDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7a0NBQUcsTUFBTSxDQUFFLE9BQVIsQ0FBQTtRQUFI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fSA9IHJlcXVpcmUgJ2F0b20nXG57Y2xpZW50fSA9IHJlcXVpcmUgJy4uL2Nvbm5lY3Rpb24nXG57Zm9ybWF0VGltZVBlcmlvZH0gPSByZXF1aXJlICcuLi9taXNjJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHByb2dzOiB7fVxuXG4gIGFjdGl2YXRlOiAoaW5rKSAtPlxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaW5rID0gaW5rXG4gICAgY2xpZW50LmhhbmRsZSAncHJvZ3Jlc3MnOiAodCwgaWQsIG0pID0+IEBbdF0gaWQsIG1cbiAgICBzdGF0dXMgPSBbXVxuICAgIEBzdWJzLmFkZChcbiAgICAgIGNsaWVudC5vbldvcmtpbmcgID0+XG4gICAgICAgIHN0YXR1cyA9IEBpbmsucHJvZ3Jlc3MuYWRkKG51bGwsIGRlc2NyaXB0aW9uOiAnSnVsaWEnKVxuICAgICAgY2xpZW50Lm9uRG9uZSAgICAgPT4gc3RhdHVzPy5kZXN0cm95KClcbiAgICAgIGNsaWVudC5vbkF0dGFjaGVkID0+IEBpbmsucHJvZ3Jlc3Muc2hvdygpXG4gICAgICBjbGllbnQub25EZXRhY2hlZCA9PiBAY2xlYXIoKVxuICAgIClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBjbGVhcigpXG4gICAgQHN1YnMuZGlzcG9zZSgpXG5cbiAgYWRkOiAoaWQpIC0+XG4gICAgcHIgPSBAaW5rLnByb2dyZXNzLmFkZCgpXG4gICAgcHIudDAgPSBEYXRlLm5vdygpXG4gICAgcHIuc2hvd1RpbWUgPSB0cnVlXG4gICAgQHByb2dzW2lkXSA9IHByXG5cbiAgcHJvZ3Jlc3M6IChpZCwgcHJvZykgLT5cbiAgICBwciA9IEBwcm9nc1tpZF1cbiAgICByZXR1cm4gdW5sZXNzIHByP1xuICAgIHByLmxldmVsID0gcHJvZ1xuICAgIGlmIHByLnNob3dUaW1lIHRoZW4gQHJpZ2h0VGV4dCBpZCwgbnVsbFxuXG4gIG1lc3NhZ2U6ICAoaWQsIG0pIC0+IEBwcm9nc1tpZF0/Lm1lc3NhZ2UgPSBtXG5cbiAgbGVmdFRleHQ6IChpZCwgbSkgLT4gQHByb2dzW2lkXT8uZGVzY3JpcHRpb24gPSBtXG5cbiAgcmlnaHRUZXh0OiAoaWQsIG0pIC0+XG4gICAgcHIgPSBAcHJvZ3NbaWRdXG4gICAgcmV0dXJuIHVubGVzcyBwcj9cbiAgICBpZiBtPy5sZW5ndGhcbiAgICAgIHByLnJpZ2h0VGV4dCA9IG1cbiAgICAgIHByLnNob3dUaW1lID0gZmFsc2VcbiAgICBlbHNlXG4gICAgICBkdCA9IChEYXRlLm5vdygpIC0gcHIudDApKigxL3ByLmxldmVsIC0gMSkvMTAwMFxuICAgICAgcHIuc2hvd1RpbWUgPSB0cnVlXG4gICAgICBwci5yaWdodFRleHQgPSBmb3JtYXRUaW1lUGVyaW9kIGR0XG5cbiAgZGVsZXRlOiAoaWQpIC0+XG4gICAgcHIgPSBAcHJvZ3NbaWRdXG4gICAgcmV0dXJuIHVubGVzcyBwcj9cbiAgICBwci5kZXN0cm95KClcbiAgICBkZWxldGUgQHByb2dzW2lkXVxuXG4gIGNsZWFyOiAtPlxuICAgIGZvciBfLCBwIG9mIEBwcm9nc1xuICAgICAgcD8uZGVzdHJveSgpXG4gICAgQHByb2dzID0ge31cbiAgICBAaW5rLnByb2dyZXNzLmhpZGUoKVxuIl19
