(function() {
  var externalTerminal, time;

  time = require('./misc').time;

  externalTerminal = require('./connection/terminal');

  module.exports = {
    IPC: require('./connection/ipc'),
    messages: require('./connection/messages'),
    client: require('./connection/client'),
    local: require('./connection/local'),
    terminal: require('./connection/terminal'),
    activate: function() {
      this.messages.activate();
      this.client.activate();
      this.client.boot = (function(_this) {
        return function() {
          return _this.boot();
        };
      })(this);
      this.local.activate();
      return this.booting = false;
    },
    deactivate: function() {
      return this.client.deactivate();
    },
    consumeInk: function(ink) {
      this.IPC.consumeInk(ink);
      return this.ink = ink;
    },
    consumeGetServerConfig: function(getconf) {
      return this.local.consumeGetServerConfig(getconf);
    },
    consumeGetServerName: function(name) {
      return this.local.consumeGetServerName(name);
    },
    _boot: function(provider) {
      var p;
      if (!this.client.isActive() && !this.booting) {
        this.booting = true;
        this.client.setBootMode(provider);
        if (provider === 'External Terminal') {
          p = externalTerminal.connectedRepl();
        } else {
          p = this.local.start(provider);
        }
        if (this.ink != null) {
          this.ink.Opener.allowRemoteFiles(provider === 'Remote');
        }
        p.then((function(_this) {
          return function() {
            return _this.booting = false;
          };
        })(this));
        p["catch"]((function(_this) {
          return function() {
            return _this.booting = false;
          };
        })(this));
        return time("Julia Boot", this.client["import"]('ping')());
      }
    },
    bootRemote: function() {
      return this._boot('Remote');
    },
    boot: function() {
      return this._boot(atom.config.get('julia-client.juliaOptions.bootMode'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxRQUFSOztFQUNULGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSx1QkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEdBQUEsRUFBVSxPQUFBLENBQVEsa0JBQVIsQ0FBVjtJQUNBLFFBQUEsRUFBVSxPQUFBLENBQVEsdUJBQVIsQ0FEVjtJQUVBLE1BQUEsRUFBVSxPQUFBLENBQVEscUJBQVIsQ0FGVjtJQUdBLEtBQUEsRUFBVSxPQUFBLENBQVEsb0JBQVIsQ0FIVjtJQUlBLFFBQUEsRUFBVSxPQUFBLENBQVEsdUJBQVIsQ0FKVjtJQU1BLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQUE7TUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BQ2YsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBTEgsQ0FOVjtJQWFBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUE7SUFEVSxDQWJaO0lBZ0JBLFVBQUEsRUFBWSxTQUFDLEdBQUQ7TUFDVixJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEI7YUFDQSxJQUFDLENBQUEsR0FBRCxHQUFPO0lBRkcsQ0FoQlo7SUFvQkEsc0JBQUEsRUFBd0IsU0FBQyxPQUFEO2FBQ3RCLElBQUMsQ0FBQSxLQUFLLENBQUMsc0JBQVAsQ0FBOEIsT0FBOUI7SUFEc0IsQ0FwQnhCO0lBdUJBLG9CQUFBLEVBQXNCLFNBQUMsSUFBRDthQUNwQixJQUFDLENBQUEsS0FBSyxDQUFDLG9CQUFQLENBQTRCLElBQTVCO0lBRG9CLENBdkJ0QjtJQTBCQSxLQUFBLEVBQU8sU0FBQyxRQUFEO0FBQ0wsVUFBQTtNQUFBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBQSxDQUFKLElBQTJCLENBQUksSUFBQyxDQUFBLE9BQW5DO1FBQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixRQUFwQjtRQUNBLElBQUcsUUFBQSxLQUFZLG1CQUFmO1VBQ0UsQ0FBQSxHQUFJLGdCQUFnQixDQUFDLGFBQWpCLENBQUEsRUFETjtTQUFBLE1BQUE7VUFHRSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQWEsUUFBYixFQUhOOztRQUtBLElBQUcsZ0JBQUg7VUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBWixDQUE2QixRQUFBLEtBQVksUUFBekMsRUFERjs7UUFFQSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0wsS0FBQyxDQUFBLE9BQUQsR0FBVztVQUROO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFQO1FBRUEsQ0FBQyxFQUFDLEtBQUQsRUFBRCxDQUFRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ04sS0FBQyxDQUFBLE9BQUQsR0FBVztVQURMO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO2VBRUEsSUFBQSxDQUFLLFlBQUwsRUFBbUIsSUFBQyxDQUFBLE1BQU0sRUFBQyxNQUFELEVBQVAsQ0FBZSxNQUFmLENBQUEsQ0FBQSxDQUFuQixFQWRGOztJQURLLENBMUJQO0lBMkNBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLEtBQUQsQ0FBTyxRQUFQO0lBRFUsQ0EzQ1o7SUE4Q0EsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsS0FBRCxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsQ0FBUDtJQURJLENBOUNOOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie3RpbWV9ID0gcmVxdWlyZSAnLi9taXNjJ1xuZXh0ZXJuYWxUZXJtaW5hbCA9IHJlcXVpcmUgJy4vY29ubmVjdGlvbi90ZXJtaW5hbCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBJUEM6ICAgICAgcmVxdWlyZSAnLi9jb25uZWN0aW9uL2lwYydcbiAgbWVzc2FnZXM6IHJlcXVpcmUgJy4vY29ubmVjdGlvbi9tZXNzYWdlcydcbiAgY2xpZW50OiAgIHJlcXVpcmUgJy4vY29ubmVjdGlvbi9jbGllbnQnXG4gIGxvY2FsOiAgICByZXF1aXJlICcuL2Nvbm5lY3Rpb24vbG9jYWwnXG4gIHRlcm1pbmFsOiByZXF1aXJlICcuL2Nvbm5lY3Rpb24vdGVybWluYWwnXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQG1lc3NhZ2VzLmFjdGl2YXRlKClcbiAgICBAY2xpZW50LmFjdGl2YXRlKClcbiAgICBAY2xpZW50LmJvb3QgPSA9PiBAYm9vdCgpXG4gICAgQGxvY2FsLmFjdGl2YXRlKClcbiAgICBAYm9vdGluZyA9IGZhbHNlXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAY2xpZW50LmRlYWN0aXZhdGUoKVxuXG4gIGNvbnN1bWVJbms6IChpbmspIC0+XG4gICAgQElQQy5jb25zdW1lSW5rIGlua1xuICAgIEBpbmsgPSBpbmtcblxuICBjb25zdW1lR2V0U2VydmVyQ29uZmlnOiAoZ2V0Y29uZikgLT5cbiAgICBAbG9jYWwuY29uc3VtZUdldFNlcnZlckNvbmZpZyhnZXRjb25mKVxuXG4gIGNvbnN1bWVHZXRTZXJ2ZXJOYW1lOiAobmFtZSkgLT5cbiAgICBAbG9jYWwuY29uc3VtZUdldFNlcnZlck5hbWUobmFtZSlcblxuICBfYm9vdDogKHByb3ZpZGVyKSAtPlxuICAgIGlmIG5vdCBAY2xpZW50LmlzQWN0aXZlKCkgYW5kIG5vdCBAYm9vdGluZ1xuICAgICAgQGJvb3RpbmcgPSB0cnVlXG4gICAgICBAY2xpZW50LnNldEJvb3RNb2RlKHByb3ZpZGVyKVxuICAgICAgaWYgcHJvdmlkZXIgaXMgJ0V4dGVybmFsIFRlcm1pbmFsJ1xuICAgICAgICBwID0gZXh0ZXJuYWxUZXJtaW5hbC5jb25uZWN0ZWRSZXBsKClcbiAgICAgIGVsc2VcbiAgICAgICAgcCA9IEBsb2NhbC5zdGFydChwcm92aWRlcilcblxuICAgICAgaWYgQGluaz9cbiAgICAgICAgQGluay5PcGVuZXIuYWxsb3dSZW1vdGVGaWxlcyhwcm92aWRlciA9PSAnUmVtb3RlJylcbiAgICAgIHAudGhlbiA9PlxuICAgICAgICBAYm9vdGluZyA9IGZhbHNlXG4gICAgICBwLmNhdGNoID0+XG4gICAgICAgIEBib290aW5nID0gZmFsc2VcbiAgICAgIHRpbWUgXCJKdWxpYSBCb290XCIsIEBjbGllbnQuaW1wb3J0KCdwaW5nJykoKVxuXG4gIGJvb3RSZW1vdGU6IC0+XG4gICAgQF9ib290KCdSZW1vdGUnKVxuXG4gIGJvb3Q6IC0+XG4gICAgQF9ib290KGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy5ib290TW9kZScpKVxuIl19
