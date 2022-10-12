Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.get = get;
exports.get_ = get_;
exports.customEnv = customEnv;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _tcp = require('./tcp');

var _tcp2 = _interopRequireDefault(_tcp);

var _nodePtyPrebuiltMultiarch = require('node-pty-prebuilt-multiarch');

var pty = _interopRequireWildcard(_nodePtyPrebuiltMultiarch);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _misc = require('../../misc');

var _messages = require('../messages');

'use babel';

var lock = (0, _misc.mutex)();

exports.lock = lock;

function get(path, args) {
  return lock(function (release) {
    var p = get_(path, args);
    p['catch'](function (err) {
      release();
    });
    release(p.then(function (_ref) {
      var socket = _ref.socket;
      return socket;
    }));
    return p;
  });
}

function get_(path, args) {
  var env = customEnv();
  return getProcess(path, args, env);
}

function customEnv() {
  var env = arguments.length <= 0 || arguments[0] === undefined ? process.env : arguments[0];

  var confnt = atom.config.get('julia-client.juliaOptions.numberOfThreads');
  var pkgServer = atom.config.get('julia-client.juliaOptions.packageServer');
  var confntInt = parseInt(confnt);

  if (confnt == 'auto') {
    env.JULIA_NUM_THREADS = require('physical-cpu-count');
  } else if (confntInt != 0 && isFinite(confntInt)) {
    env.JULIA_NUM_THREADS = confntInt;
  }

  if (pkgServer) {
    env.JULIA_PKG_SERVER = pkgServer;
  }

  if (atom.config.get('julia-client.disableProxy')) {
    delete env.HTTP_PROXY;
    delete env.HTTPS_PROXY;
    delete env.http_proxy;
    delete env.https_proxy;
  }

  return env;
}

function getProcess(path, args, env) {
  return new Promise(function (resolve, reject) {
    _tcp2['default'].listen().then(function (port) {
      _misc.paths.fullPath(path).then(function (path) {
        _misc.paths.projectDir().then(function (cwd) {
          // space before port needed for pty.js on windows:
          var ty = pty.spawn(path, [].concat(_toConsumableArray(args), [_misc.paths.script('boot_repl.jl'), ' ' + port]), {
            cols: 100,
            rows: 30,
            env: env,
            cwd: cwd,
            useConpty: true,
            handleFlowControl: true
          });

          var sock = socket(ty);

          sock['catch'](function (err) {
            reject(err);
          });

          // catch errors when interacting with ty, just to be safe (errors might crash Atom)
          var proc = {
            ty: ty,
            kill: function kill() {
              // only kill pty if it's still alive:
              if (ty._readable || ty._writable) {
                try {
                  ty.kill();
                } catch (err) {
                  console.log('Terminal:');
                  console.log(err);
                }
              }
            },
            interrupt: function interrupt() {
              try {
                ty.write('\x03');
              } catch (err) {
                console.log('Terminal:');
                console.log(err);
              }
            },
            socket: sock,
            onExit: function onExit(f) {
              try {
                ty.on('exit', f);
              } catch (err) {
                console.log('Terminal:');
                console.log(err);
              }
            },
            onStderr: function onStderr(f) {},
            onStdout: function onStdout(f) {
              try {
                ty.on('data', f);
              } catch (err) {
                console.log('Terminal:');
                console.log(err);
              }
            }
          };

          resolve(proc);
        })['catch'](function (err) {
          reject(err);
        });
      })['catch'](function (err) {
        (0, _messages.jlNotFound)(path, err);
        reject(err);
      });
    })['catch'](function (err) {
      reject(err);
    });
  });
}

function socket(ty) {
  conn = _tcp2['default'].next();
  failure = new Promise(function (resolve, reject) {
    ty.on('exit', function (err) {
      conn.dispose();
      reject(err);
    });
  });
  return Promise.race([conn, failure]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9jb25uZWN0aW9uL3Byb2Nlc3MvYmFzaWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzttQkFFZ0IsT0FBTzs7Ozt3Q0FDRiw2QkFBNkI7O0lBQXRDLEdBQUc7O21CQUNDLEtBQUs7Ozs7b0JBQ1EsWUFBWTs7d0JBQ2QsYUFBYTs7QUFOeEMsV0FBVyxDQUFBOztBQVFKLElBQUksSUFBSSxHQUFHLGtCQUFPLENBQUE7Ozs7QUFFbEIsU0FBUyxHQUFHLENBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUMvQixTQUFPLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN2QixRQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3hCLEtBQUMsU0FBTSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2YsYUFBTyxFQUFFLENBQUE7S0FDVixDQUFDLENBQUE7QUFDRixXQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQVE7VUFBUCxNQUFNLEdBQVAsSUFBUSxDQUFQLE1BQU07YUFBTSxNQUFNO0tBQUEsQ0FBQyxDQUFDLENBQUE7QUFDckMsV0FBTyxDQUFDLENBQUE7R0FDVCxDQUFDLENBQUE7Q0FDSDs7QUFFTSxTQUFTLElBQUksQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLE1BQU0sR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFBO0FBQ3ZCLFNBQU8sVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUE7Q0FDbkM7O0FBRU0sU0FBUyxTQUFTLEdBQXFCO01BQW5CLEdBQUcseURBQUcsT0FBTyxDQUFDLEdBQUc7O0FBQzFDLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJDQUEy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QU0sRUFBRSxVQUFDLEdBQUcsRUFBSztBQUNyQixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDZCxZQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDWixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7QUFDRixTQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtDQUNyQyIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvY29ubmVjdGlvbi9wcm9jZXNzL2Jhc2ljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHRjcCBmcm9tICcuL3RjcCdcbmltcG9ydCAqIGFzIHB0eSBmcm9tICdub2RlLXB0eS1wcmVidWlsdC1tdWx0aWFyY2gnXG5pbXBvcnQgbmV0IGZyb20gJ25ldCdcbmltcG9ydCB7IHBhdGhzLCBtdXRleCB9IGZyb20gJy4uLy4uL21pc2MnXG5pbXBvcnQgeyBqbE5vdEZvdW5kIH0gZnJvbSAnLi4vbWVzc2FnZXMnXG5cbmV4cG9ydCB2YXIgbG9jayA9IG11dGV4KClcblxuZXhwb3J0IGZ1bmN0aW9uIGdldCAocGF0aCwgYXJncykge1xuICByZXR1cm4gbG9jaygocmVsZWFzZSkgPT4ge1xuICAgIGxldCBwID0gZ2V0XyhwYXRoLCBhcmdzKVxuICAgIHAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmVsZWFzZSgpXG4gICAgfSlcbiAgICByZWxlYXNlKHAudGhlbigoe3NvY2tldH0pID0+IHNvY2tldCkpXG4gICAgcmV0dXJuIHBcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF8gKHBhdGgsIGFyZ3MpIHtcbiAgY29uc3QgZW52ID0gY3VzdG9tRW52KClcbiAgcmV0dXJuIGdldFByb2Nlc3MocGF0aCwgYXJncywgZW52KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRW52IChlbnYgPSBwcm9jZXNzLmVudikge1xuICBsZXQgY29uZm50ID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLm51bWJlck9mVGhyZWFkcycpXG4gIGxldCBwa2dTZXJ2ZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYU9wdGlvbnMucGFja2FnZVNlcnZlcicpXG4gIGxldCBjb25mbnRJbnQgPSBwYXJzZUludChjb25mbnQpXG5cbiAgaWYgKGNvbmZudCA9PSAnYXV0bycpIHtcbiAgICBlbnYuSlVMSUFfTlVNX1RIUkVBRFMgPSByZXF1aXJlKCdwaHlzaWNhbC1jcHUtY291bnQnKVxuICB9IGVsc2UgaWYgKGNvbmZudEludCAhPSAwICYmIGlzRmluaXRlKGNvbmZudEludCkpIHtcbiAgICBlbnYuSlVMSUFfTlVNX1RIUkVBRFMgPSBjb25mbnRJbnRcbiAgfVxuXG4gIGlmIChwa2dTZXJ2ZXIpIHtcbiAgICBlbnYuSlVMSUFfUEtHX1NFUlZFUiA9IHBrZ1NlcnZlclxuICB9XG5cbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LmRpc2FibGVQcm94eScpKSB7XG4gICAgZGVsZXRlIGVudi5IVFRQX1BST1hZXG4gICAgZGVsZXRlIGVudi5IVFRQU19QUk9YWVxuICAgIGRlbGV0ZSBlbnYuaHR0cF9wcm94eVxuICAgIGRlbGV0ZSBlbnYuaHR0cHNfcHJveHlcbiAgfVxuXG4gIHJldHVybiBlbnZcbn1cblxuZnVuY3Rpb24gZ2V0UHJvY2VzcyAocGF0aCwgYXJncywgZW52KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdGNwLmxpc3RlbigpLnRoZW4oKHBvcnQpID0+IHtcbiAgICAgIHBhdGhzLmZ1bGxQYXRoKHBhdGgpLnRoZW4oKHBhdGgpID0+IHtcbiAgICAgICAgcGF0aHMucHJvamVjdERpcigpLnRoZW4oKGN3ZCkgPT4ge1xuICAgICAgICAgIC8vIHNwYWNlIGJlZm9yZSBwb3J0IG5lZWRlZCBmb3IgcHR5LmpzIG9uIHdpbmRvd3M6XG4gICAgICAgICAgbGV0IHR5ID0gcHR5LnNwYXduKHBhdGgsIFsuLi5hcmdzLCBwYXRocy5zY3JpcHQoJ2Jvb3RfcmVwbC5qbCcpLCBgICR7cG9ydH1gXSwge1xuICAgICAgICAgICAgY29sczogMTAwLFxuICAgICAgICAgICAgcm93czogMzAsXG4gICAgICAgICAgICBlbnY6IGVudixcbiAgICAgICAgICAgIGN3ZDogY3dkLFxuICAgICAgICAgICAgdXNlQ29ucHR5OiB0cnVlLFxuICAgICAgICAgICAgaGFuZGxlRmxvd0NvbnRyb2w6IHRydWVcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgbGV0IHNvY2sgPSBzb2NrZXQodHkpXG5cbiAgICAgICAgICBzb2NrLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vIGNhdGNoIGVycm9ycyB3aGVuIGludGVyYWN0aW5nIHdpdGggdHksIGp1c3QgdG8gYmUgc2FmZSAoZXJyb3JzIG1pZ2h0IGNyYXNoIEF0b20pXG4gICAgICAgICAgbGV0IHByb2MgPSB7XG4gICAgICAgICAgICB0eTogdHksXG4gICAgICAgICAgICBraWxsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIG9ubHkga2lsbCBwdHkgaWYgaXQncyBzdGlsbCBhbGl2ZTpcbiAgICAgICAgICAgICAgaWYgKHR5Ll9yZWFkYWJsZSB8fCB0eS5fd3JpdGFibGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdHkua2lsbCgpXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGVybWluYWw6JylcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW50ZXJydXB0OiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHkud3JpdGUoJ1xceDAzJylcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1Rlcm1pbmFsOicpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNvY2tldDogc29jayxcbiAgICAgICAgICAgIG9uRXhpdDogKGYpID0+IHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0eS5vbignZXhpdCcsIGYpXG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUZXJtaW5hbDonKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblN0ZGVycjogKGYpID0+IHt9LFxuICAgICAgICAgICAgb25TdGRvdXQ6IChmKSA9PiB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHkub24oJ2RhdGEnLCBmKVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGVybWluYWw6JylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShwcm9jKVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgamxOb3RGb3VuZChwYXRoLCBlcnIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gc29ja2V0ICh0eSkge1xuICBjb25uID0gdGNwLm5leHQoKVxuICBmYWlsdXJlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHR5Lm9uKCdleGl0JywgKGVycikgPT4ge1xuICAgICAgY29ubi5kaXNwb3NlKClcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIFByb21pc2UucmFjZShbY29ubiwgZmFpbHVyZV0pXG59XG4iXX0=