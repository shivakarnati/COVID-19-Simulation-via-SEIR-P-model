(function() {
  var child_process, fs, path, readdir, stat,
    slice = [].slice;

  fs = require('fs');

  path = require('path');

  child_process = require('child_process');

  readdir = function(dir) {
    return new Promise(function(resolve) {
      return fs.readdir(dir, function(err, children) {
        return resolve(children || []);
      });
    });
  };

  stat = function(path) {
    return new Promise(function(resolve) {
      return fs.stat(path, function(err, stat) {
        return resolve(stat);
      });
    });
  };

  module.exports = {
    home: function() {
      var p;
      p = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return path.join.apply(path, [process.env.USERPROFILE || process.env.HOME].concat(slice.call(p)));
    },
    searchpaths: function() {
      if (process.platform === 'darwin') {
        return [['/Applications', /^Julia-([\d\.]+).app$/, 'Contents/Resources/julia/bin/julia'], [this.home(), /^julia/, 'usr/bin/julia']];
      } else if (process.platform === 'linux') {
        return [[this.home(), /^julia/, 'bin/julia'], [this.home(), /^julia/, 'usr/bin/julia']];
      } else if (process.platform === 'win32') {
        return [[this.home('AppData\\Local'), /^Julia-([\d\.]+)$/, 'bin\\julia.exe'], ['C:\\Program Files\\', /^Julia-([\d\.]+)$/, 'bin\\julia.exe']];
      } else {
        return [];
      }
    },
    validpaths: function(arg) {
      var post, pre, r;
      pre = arg[0], r = arg[1], post = arg[2];
      return readdir(pre).then(function(ps) {
        return ps.filter(function(path) {
          return path.match(r);
        }).map(function(path) {
          return {
            path: path,
            version: path.match(r)[1]
          };
        }).map(function(arg1) {
          var p, version;
          p = arg1.path, version = arg1.version;
          return {
            path: path.join(pre, p, post),
            version: version
          };
        });
      }).then(function(ps) {
        return Promise.all(ps.map(function(arg1) {
          var path, version;
          path = arg1.path, version = arg1.version;
          return stat(path).then(function(stat) {
            return {
              path: path,
              version: version,
              file: stat != null ? stat.isFile() : void 0
            };
          });
        }));
      }).then(function(ps) {
        return ps.filter(function(arg1) {
          var file;
          file = arg1.file;
          return file;
        });
      });
    },
    search: function(templates) {
      return Promise.all(templates.map((function(_this) {
        return function(t) {
          return _this.validpaths(t);
        };
      })(this))).then(function(ps) {
        return ps.reduce(function(a, b) {
          return a.concat(b);
        });
      });
    },
    getpath: function() {
      return this.search(this.searchpaths()).then(function(ps) {
        var ref;
        return (ref = ps[0]) != null ? ref.path : void 0;
      });
    },
    juliaShell: function() {
      return new Promise(function(resolve) {
        var proc, which;
        which = process.platform === 'win32' ? 'where' : 'which';
        proc = child_process.spawn(which, ['julia']);
        proc.on('exit', function(status) {
          return resolve(status === 0);
        });
        return proc.on('error', function(err) {
          return resolve(false);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy91YmVyLWp1bm8vbGliL3BhdGguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUjs7RUFFaEIsT0FBQSxHQUFVLFNBQUMsR0FBRDtXQUNSLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRDthQUNWLEVBQUUsQ0FBQyxPQUFILENBQVcsR0FBWCxFQUFnQixTQUFDLEdBQUQsRUFBTSxRQUFOO2VBQ2QsT0FBQSxDQUFRLFFBQUEsSUFBWSxFQUFwQjtNQURjLENBQWhCO0lBRFUsQ0FBWjtFQURROztFQUtWLElBQUEsR0FBTyxTQUFDLElBQUQ7V0FDTCxJQUFJLE9BQUosQ0FBWSxTQUFDLE9BQUQ7YUFDVixFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsRUFBYyxTQUFDLEdBQUQsRUFBTSxJQUFOO2VBQWUsT0FBQSxDQUFRLElBQVI7TUFBZixDQUFkO0lBRFUsQ0FBWjtFQURLOztFQUlQLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxJQUFBLEVBQU0sU0FBQTtBQUNKLFVBQUE7TUFESzthQUNMLElBQUksQ0FBQyxJQUFMLGFBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVosSUFBMkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFPLFNBQUEsV0FBQSxDQUFBLENBQUEsQ0FBekQ7SUFESSxDQUFOO0lBR0EsV0FBQSxFQUFhLFNBQUE7TUFDWCxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFFBQXZCO2VBQ0UsQ0FDRSxDQUFDLGVBQUQsRUFBa0IsdUJBQWxCLEVBQTJDLG9DQUEzQyxDQURG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QUFKLENBQVksU0FBQyxPQUFEO0FBQ1YsWUFBQTtRQUFBLEtBQUEsR0FBVyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QixHQUFvQyxPQUFwQyxHQUFpRDtRQUN6RCxJQUFBLEdBQU8sYUFBYSxDQUFDLEtBQWQsQ0FBb0IsS0FBcEIsRUFBMkIsQ0FBQyxPQUFELENBQTNCO1FBQ1AsSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFNBQUMsTUFBRDtpQkFDZCxPQUFBLENBQVEsTUFBQSxLQUFVLENBQWxCO1FBRGMsQ0FBaEI7ZUFFQSxJQUFJLENBQUMsRUFBTCxDQUFRLE9BQVIsRUFBaUIsU0FBQyxHQUFEO2lCQUNmLE9BQUEsQ0FBUSxLQUFSO1FBRGUsQ0FBakI7TUFMVSxDQUFaO0lBRFUsQ0F6Q1o7O0FBZkYiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jaGlsZF9wcm9jZXNzID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcblxucmVhZGRpciA9IChkaXIpIC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgIGZzLnJlYWRkaXIgZGlyLCAoZXJyLCBjaGlsZHJlbikgLT5cbiAgICAgIHJlc29sdmUgY2hpbGRyZW4gb3IgW11cblxuc3RhdCA9IChwYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICBmcy5zdGF0IHBhdGgsIChlcnIsIHN0YXQpIC0+IHJlc29sdmUgc3RhdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgaG9tZTogKHAuLi4pIC0+XG4gICAgcGF0aC5qb2luIChwcm9jZXNzLmVudi5VU0VSUFJPRklMRSBvciBwcm9jZXNzLmVudi5IT01FKSwgcC4uLlxuXG4gIHNlYXJjaHBhdGhzOiAtPlxuICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ2RhcndpbidcbiAgICAgIFtcbiAgICAgICAgWycvQXBwbGljYXRpb25zJywgL15KdWxpYS0oW1xcZFxcLl0rKS5hcHAkLywgJ0NvbnRlbnRzL1Jlc291cmNlcy9qdWxpYS9iaW4vanVsaWEnXVxuICAgICAgICBbQGhvbWUoKSwgL15qdWxpYS8sICd1c3IvYmluL2p1bGlhJ11cbiAgICAgIF1cbiAgICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ2xpbnV4J1xuICAgICAgW1xuICAgICAgICBbQGhvbWUoKSwgL15qdWxpYS8sICdiaW4vanVsaWEnXVxuICAgICAgICBbQGhvbWUoKSwgL15qdWxpYS8sICd1c3IvYmluL2p1bGlhJ11cbiAgICAgIF1cbiAgICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJ1xuICAgICAgW1xuICAgICAgICBbQGhvbWUoJ0FwcERhdGFcXFxcTG9jYWwnKSwgL15KdWxpYS0oW1xcZFxcLl0rKSQvLCAnYmluXFxcXGp1bGlhLmV4ZSddXG4gICAgICAgIFsnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFwnLCAvXkp1bGlhLShbXFxkXFwuXSspJC8sICdiaW5cXFxcanVsaWEuZXhlJ11cbiAgICAgIF1cbiAgICBlbHNlIFtdXG5cbiAgdmFsaWRwYXRoczogKFtwcmUsIHIsIHBvc3RdKSAtPlxuICAgIHJlYWRkaXIgcHJlXG4gICAgICAudGhlbiAocHMpIC0+XG4gICAgICAgIHBzLmZpbHRlciAocGF0aCkgLT4gcGF0aC5tYXRjaCByXG4gICAgICAgICAgLm1hcCAocGF0aCkgLT4ge3BhdGgsIHZlcnNpb246IHBhdGgubWF0Y2gocilbMV19XG4gICAgICAgICAgLm1hcCAoe3BhdGg6IHAsIHZlcnNpb259KSAtPiB7cGF0aDogcGF0aC5qb2luKHByZSwgcCwgcG9zdCksIHZlcnNpb259XG4gICAgICAudGhlbiAocHMpIC0+XG4gICAgICAgIFByb21pc2UuYWxsIHBzLm1hcCAoe3BhdGgsIHZlcnNpb259KSAtPlxuICAgICAgICAgIHN0YXQocGF0aCkudGhlbiAoc3RhdCkgLT4ge3BhdGgsIHZlcnNpb24sIGZpbGU6IHN0YXQ/LmlzRmlsZSgpfVxuICAgICAgLnRoZW4gKHBzKSAtPiBwcy5maWx0ZXIgKHtmaWxlfSkgLT4gZmlsZVxuXG4gIHNlYXJjaDogKHRlbXBsYXRlcykgLT5cbiAgICBQcm9taXNlLmFsbCB0ZW1wbGF0ZXMubWFwICh0KSA9PiBAdmFsaWRwYXRocyB0XG4gICAgICAudGhlbiAocHMpIC0+IHBzLnJlZHVjZSgoYSwgYikgLT4gYS5jb25jYXQoYikpXG5cbiAgZ2V0cGF0aDogLT5cbiAgICAjIFRPRE86IHNvcnQgYnkgdmVyc2lvblxuICAgIEBzZWFyY2goQHNlYXJjaHBhdGhzKCkpXG4gICAgICAudGhlbiAocHMpIC0+IHBzWzBdPy5wYXRoXG5cbiAganVsaWFTaGVsbDogLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICAgIHdoaWNoID0gaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gJ3doZXJlJyBlbHNlICd3aGljaCdcbiAgICAgIHByb2MgPSBjaGlsZF9wcm9jZXNzLnNwYXduIHdoaWNoLCBbJ2p1bGlhJ11cbiAgICAgIHByb2Mub24gJ2V4aXQnLCAoc3RhdHVzKSAtPlxuICAgICAgICByZXNvbHZlIHN0YXR1cyBpcyAwXG4gICAgICBwcm9jLm9uICdlcnJvcicsIChlcnIpIC0+XG4gICAgICAgIHJlc29sdmUgZmFsc2VcbiJdfQ==
