(function() {
  var Emitter, Loading;

  Emitter = require('atom').Emitter;

  module.exports = Loading = (function() {
    Loading.prototype.status = 0;

    function Loading() {
      this.emitter = new Emitter;
    }

    Loading.prototype.onWorking = function(f) {
      return this.emitter.on('working', f);
    };

    Loading.prototype.onDone = function(f) {
      return this.emitter.on('done', f);
    };

    Loading.prototype.isWorking = function() {
      return this.status > 0;
    };

    Loading.prototype.onceDone = function(f) {
      var sub;
      if (!this.isWorking()) {
        return f();
      }
      return sub = this.onDone(function() {
        sub.dispose();
        return f();
      });
    };

    Loading.prototype.working = function() {
      this.status++;
      if (this.status === 1) {
        return this.emitter.emit('working');
      }
    };

    Loading.prototype.done = function() {
      if (this.isWorking()) {
        this.status--;
        if (!this.isWorking()) {
          return this.emitter.emit('done');
        }
      }
    };

    Loading.prototype.monitor = function(p) {
      var done;
      this.working();
      done = (function(_this) {
        return function() {
          return _this.done();
        };
      })(this);
      p.then(done, done);
      return p;
    };

    Loading.prototype.reset = function() {
      if (this.isWorking()) {
        this.status = 0;
        return this.emitter.emit('done');
      }
    };

    return Loading;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvbG9hZGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtzQkFFSixNQUFBLEdBQVE7O0lBRUssaUJBQUE7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7SUFESjs7c0JBR2IsU0FBQSxHQUFXLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsQ0FBdkI7SUFBUDs7c0JBQ1gsTUFBQSxHQUFRLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE1BQVosRUFBb0IsQ0FBcEI7SUFBUDs7c0JBQ1IsU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQWI7O3NCQUVYLFFBQUEsR0FBVSxTQUFDLENBQUQ7QUFDUixVQUFBO01BQUEsSUFBQSxDQUFrQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQWxCO0FBQUEsZUFBTyxDQUFBLENBQUEsRUFBUDs7YUFDQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBUSxTQUFBO1FBQUksR0FBRyxDQUFDLE9BQUosQ0FBQTtlQUFlLENBQUEsQ0FBQTtNQUFuQixDQUFSO0lBRkU7O3NCQUlWLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE1BQUQ7TUFDQSxJQUFHLElBQUMsQ0FBQSxNQUFELEtBQVcsQ0FBZDtlQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFNBQWQsRUFERjs7SUFGTzs7c0JBS1QsSUFBQSxHQUFNLFNBQUE7TUFDSixJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtRQUNFLElBQUMsQ0FBQSxNQUFEO1FBQ0EsSUFBRyxDQUFJLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBUDtpQkFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkLEVBREY7U0FGRjs7SUFESTs7c0JBTU4sT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxDQUFBO01BQ0EsSUFBQSxHQUFPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BQ1AsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFQLEVBQWEsSUFBYjthQUNBO0lBSk87O3NCQU1ULEtBQUEsR0FBTyxTQUFBO01BQ0wsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7UUFDRSxJQUFDLENBQUEsTUFBRCxHQUFVO2VBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxFQUZGOztJQURLOzs7OztBQW5DVCIsInNvdXJjZXNDb250ZW50IjpbIntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIExvYWRpbmdcclxuXHJcbiAgc3RhdHVzOiAwXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxyXG5cclxuICBvbldvcmtpbmc6IChmKSAtPiBAZW1pdHRlci5vbiAnd29ya2luZycsIGZcclxuICBvbkRvbmU6IChmKSAtPiBAZW1pdHRlci5vbiAnZG9uZScsIGZcclxuICBpc1dvcmtpbmc6IC0+IEBzdGF0dXMgPiAwXHJcblxyXG4gIG9uY2VEb25lOiAoZikgLT5cclxuICAgIHJldHVybiBmKCkgdW5sZXNzIEBpc1dvcmtpbmcoKVxyXG4gICAgc3ViID0gQG9uRG9uZSAtPiAoc3ViLmRpc3Bvc2UoKTsgZigpKVxyXG5cclxuICB3b3JraW5nOiAtPlxyXG4gICAgQHN0YXR1cysrXHJcbiAgICBpZiBAc3RhdHVzIGlzIDFcclxuICAgICAgQGVtaXR0ZXIuZW1pdCAnd29ya2luZydcclxuXHJcbiAgZG9uZTogLT5cclxuICAgIGlmIEBpc1dvcmtpbmcoKVxyXG4gICAgICBAc3RhdHVzLS1cclxuICAgICAgaWYgbm90IEBpc1dvcmtpbmcoKVxyXG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RvbmUnXHJcblxyXG4gIG1vbml0b3I6IChwKSAtPlxyXG4gICAgQHdvcmtpbmcoKVxyXG4gICAgZG9uZSA9ID0+IEBkb25lKClcclxuICAgIHAudGhlbiBkb25lLCBkb25lXHJcbiAgICBwXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgaWYgQGlzV29ya2luZygpXHJcbiAgICAgIEBzdGF0dXMgPSAwXHJcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RvbmUnXHJcbiJdfQ==
