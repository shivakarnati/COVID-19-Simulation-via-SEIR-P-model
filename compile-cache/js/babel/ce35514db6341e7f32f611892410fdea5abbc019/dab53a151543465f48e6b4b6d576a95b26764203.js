Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.get = get;
exports.withRemoteConfig = withRemoteConfig;
exports.consumeGetServerConfig = consumeGetServerConfig;
exports.consumeGetServerName = consumeGetServerName;
exports.get_ = get_;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcp = require('./tcp');

var _tcp2 = _interopRequireDefault(_tcp);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _misc = require('../../misc');

var _ssh2 = require('ssh2');

var ssh = _interopRequireWildcard(_ssh2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var lock = (0, _misc.mutex)();

exports.lock = lock;
var getRemoteConf = undefined;
var getRemoteName = undefined;
var serversettings = {};
var currentServer = undefined;

function get(path, args) {
  return lock(function (release) {
    var p = get_(path, args);
    release(p.then(function (_ref) {
      var socket = _ref.socket;
      return socket;
    }));
    p['catch'](function () {
      return release();
    });
    return p;
  });
}

function getConnectionSettings() {
  return new Promise(function (resolve, reject) {
    if (getRemoteConf) {
      var conf = getRemoteConf('Juno requests access to your server configuration to open a terminal.');
      conf.then(function (conf) {
        return resolve(conf);
      })['catch'](function (reason) {
        return reject(reason);
      });
    } else {
      reject('nopackage');
    }
  });
}

function withRemoteConfig(f) {
  return new Promise(function (resolve, reject) {
    if (getRemoteName === undefined) {
      reject();
    } else {
      getRemoteName().then(function (name) {
        name = name.toString();
        var cachedSettings = serversettings[name];
        if (cachedSettings) {
          resolve(f(maybe_add_agent(cachedSettings)));
        } else {
          getConnectionSettings().then(function (conf) {
            serversettings[name] = conf;
            resolve(f(maybe_add_agent(conf)));
          })['catch'](function (reason) {
            showRemoteError(reason);
            reject();
          });
        }
      })['catch'](function (reason) {
        showRemoteError(reason);
        reject();
      });
    }
  });
}

function maybe_add_agent(conf) {
  if (conf && atom.config.get('julia-client.remoteOptions.agentAuth')) {
    var sshsock = ssh_socket();
    if (!conf.agent && sshsock) {
      conf.agent = sshsock;
    }
    if (!conf.agentForward) {
      conf.agentForward = atom.config.get('julia-client.remoteOptions.forwardAgent');
    }
  }
  return conf;
}

function ssh_socket() {
  var sock = process.env['SSH_AUTH_SOCK'];
  if (sock) {
    return sock;
  } else {
    if (process.platform == 'win32') {
      return 'pageant';
    } else {
      return '';
    }
  }
}

var storageKey = 'juno_remote_server_exec_key';

function setRemoteExec(server, command) {
  var store = getRemoteStore();
  store[server] = command;
  setRemoteStore(store);
}

function getRemoteExec(server) {
  var store = getRemoteStore();
  return store[server];
}

function setRemoteStore(store) {
  localStorage[storageKey] = JSON.stringify(store);
}

function getRemoteStore() {
  var store = localStorage[storageKey];
  if (store == undefined) {
    store = [];
  } else {
    store = JSON.parse(store);
  }
  return store;
}

function showRemoteError(reason) {
  if (reason == 'nopackage') {
    atom.notifications.addInfo('ftp-remote-edit not installed');
  } else if (reason == 'noservers') {
    (function () {
      var notif = atom.notifications.addInfo('Please select a project', {
        description: 'Connect to a server in the ftp-remote-edit tree view.',
        dismissable: true,
        buttons: [{
          text: 'Toggle Remote Tree View',
          onDidClick: function onDidClick() {
            var edview = atom.views.getView(atom.workspace);
            atom.commands.dispatch(edview, 'ftp-remote-edit:toggle');
            notif.dismiss();
          }
        }]
      });
    })();
  } else {
    atom.notifications.addError('Remote Connection Failed', {
      details: 'Unknown Error: \n\n ' + reason
    });
  }
}

function consumeGetServerConfig(getconf) {
  getRemoteConf = getconf;
}

function consumeGetServerName(name) {
  getRemoteName = name;
}

function get_(path, args) {
  return withRemoteConfig(function (conf) {
    var execs = getRemoteExec(conf.name);
    if (!execs) {
      console.log("open a dialog and get config here");
    }
    return new Promise(function (resolve, reject) {
      _tcp2['default'].listen().then(function (port) {
        var conn = new ssh.Client();

        conn.on('ready', function () {
          conn.forwardIn('127.0.0.1', port, function (err) {
            if (err) {
              console.error('Error while forwarding remote connection from ' + port + ': ' + err);
              atom.notifications.addError('Port in use', {
                description: 'Port ' + port + ' on the remote server already in use.\n                              Try again with another port.'
              });
              reject();
            }
          });
          var jlpath = atom.config.get('julia-client.remoteOptions.remoteJulia');

          // construct something like
          //
          // /bin/sh -c 'tmux new -s sessionname '\'' julia -i -e '\'\\\'\''startup_repl'\'\\\'\'' '\''port'\'' '\'' '
          //
          // with properly escaped single quotes.

          var exec = '';
          if (atom.config.get('julia-client.remoteOptions.tmux')) {
            var sessionName = atom.config.get('julia-client.remoteOptions.tmuxName');
            exec += '/bin/sh -c \'';
            exec += 'tmux new -s ' + sessionName + ' \'\\\'\'';
            if (pkgServer()) {
              exec += ' JULIA_PKG_SERVER="' + pkgServer() + '" ';
            }
            if (threadCount() !== undefined) {
              exec += ' JULIA_NUM_THREADS="' + threadCount() + '" ';
            }
            exec += jlpath;
            exec += ' ' + args.join(' ') + ' -e \'\\\'\\\\\\\'\\\'\'';
            // could automatically escape single quotes with `replace(/'/, `'\\'\\\\\\'\\\\\\\\\\\\\\'\\\\\\'\\''`)`,
            // but that's so ugly I'd rather not do that
            exec += _fs2['default'].readFileSync(_misc.paths.script('boot_repl.jl')).toString();
            exec += '\'\\\'\\\\\\\'\\\'\' ' + port + ' \'\\\'\' ';
            exec += '|| tmux send-keys -t ' + sessionName + '.left ^A ^K ^H \'\\\'\'Juno.connect(' + port + ')\'\\\'\' ENTER ';
            exec += '&& tmux attach -t ' + sessionName + ' ';
            exec += '\'';
          } else {
            exec += '/bin/sh -c \'';
            if (pkgServer()) {
              exec += ' JULIA_PKG_SERVER="' + pkgServer() + '" ';
            }
            if (threadCount() !== undefined) {
              exec += ' JULIA_NUM_THREADS="' + threadCount() + '" ';
            }
            exec += jlpath + ' ' + args.join(' ') + ' -e \'\\\'\'';
            // could automatically escape single quotes with `replace(/'/, `'\\'\\\\\\'\\''`)`,
            // but that's so ugly I'd rather not do that
            exec += _fs2['default'].readFileSync(_misc.paths.script('boot_repl.jl')).toString();
            exec += '\'\\\'\' ' + port;
            exec += '\'';
          }

          conn.exec(exec, { pty: { term: "xterm-256color" } }, function (err, stream) {
            if (err) console.error('Error while executing command \n`' + exec + '`\n on remote server.');

            stream.on('close', function (err) {
              if (err) {
                var description = 'We tried to launch Julia ';
                if (atom.config.get('julia-client.remoteOptions.tmux')) {
                  description += 'in a `tmux` session named `' + atom.config.get('julia-client.remoteOptions.tmuxName') + '` ';
                }
                description += 'from `' + jlpath + '` but the process failed with `' + err + '`.\n\n';
                description += 'Please make sure your settings are correct.';
                atom.notifications.addError("Remote Julia session could not be started.", {
                  description: description,
                  dismissable: true
                });
              }
              conn.end();
            });
            stream.on('error', function () {
              conn.end();
            });
            stream.on('finish', function () {
              conn.end();
            });

            var sock = socket(stream);

            // forward resize handling
            stream.resize = function (cols, rows) {
              return stream.setWindow(rows, cols, 999, 999);
            };
            var proc = {
              ty: stream,
              kill: function kill() {
                return stream.signal('KILL');
              },
              disconnect: function disconnect() {
                return stream.close();
              },
              interrupt: function interrupt() {
                return stream.write('\x03');
              }, // signal handling doesn't seem to work :/
              socket: sock,
              onExit: function onExit(f) {
                return stream.on('close', f);
              },
              onStderr: function onStderr(f) {
                return stream.stderr.on('data', function (data) {
                  return f(data.toString());
                });
              },
              onStdout: function onStdout(f) {
                return stream.on('data', function (data) {
                  return f(data.toString());
                });
              },
              config: conf
            };
            resolve(proc);
          });
        }).on('tcp connection', function (info, accept, reject) {
          var stream = accept(); // connect to forwarded connection
          stream.on('close', function () {
            conn.end();
          });
          stream.on('error', function () {
            conn.end();
          });
          stream.on('finish', function () {
            conn.end();
          });
          // start server that the julia server can connect to
          var sock = _net2['default'].createConnection({ port: port }, function () {
            stream.pipe(sock).pipe(stream);
          });
          sock.on('close', function () {
            conn.end();
          });
          sock.on('error', function () {
            conn.end();
          });
          sock.on('finish', function () {
            conn.end();
          });
        }).connect(conf);
      })['catch'](function (err) {
        var description = 'The following error occured when trying to open a tcp ';
        description += 'connection: ';
        description += '`' + err + '`';
        atom.notifications.addError("Error while connecting to remote Julia session.", {
          description: description,
          dismissable: true
        });
        reject();
      });
    });
  });
}

function pkgServer() {
  return atom.config.get('julia-client.juliaOptions.packageServer');
}

function threadCount() {
  var confnt = atom.config.get('julia-client.juliaOptions.numberOfThreads');
  var confntInt = parseInt(confnt);
  if (confntInt != 0 && isFinite(confntInt)) {
    return confntInt;
  } else {
    return undefined;
  }
}

function socket(stream) {
  conn = _tcp2['default'].next();
  failure = new Promise(function (resolve, reject) {
    stream.on('close', function (err) {
      conn.dispose();
      reject(err);
    });
  });
  return Promise.race([conn, failure]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9jb25uZWN0aW9uL3Byb2Nlc3MvcmVtb3RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7bUJBRWdCLE9BQU87Ozs7bUJBQ1AsS0FBSzs7OztvQkFDUSxZQUFZOztvQkFDcEIsTUFBTTs7SUFBZixHQUFHOztrQkFDQSxJQUFJOzs7O0FBTm5CLFdBQVcsQ0FBQTs7QUFRSixJQUFJLElBQUksR0FBRyxrQkFBTyxDQUFBOzs7QUFFekIsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFBO0FBQzdCLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQTtBQUM3QixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDdkIsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFBOztBQUV0QixTQUFTLEdBQUcsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQy9CLFNBQU8sSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ3ZCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDeEIsV0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFRO1VBQVAsTUFBTSxHQUFQLElBQVEsQ0FBUCxNQUFNO2FBQU0sTUFBTTtLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQ3JDLEtBQUMsU0FBTSxDQUFDO2FBQU0sT0FBTyxFQUFFO0tBQUEsQ0FBQyxDQUFBO0FBQ3hCLFdBQU8sQ0FBQyxDQUFBO0dBQ1QsQ0FBQyxDQUFBO0NBQ0g7O0FBRUQsU0FBUyxxQkFBcUIsR0FBSTtBQUNoQyxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxRQUFJLGFBQWEsRUFBRTtBQUNqQixVQUFJLElBQUksR0FBRyxhQUFhLENBQUMsdUVBQXVFLENBQUMsQ0FBQTtB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QU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNaLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtBQUNGLFNBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0NBQ3JDIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9jb25uZWN0aW9uL3Byb2Nlc3MvcmVtb3RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHRjcCBmcm9tICcuL3RjcCdcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuaW1wb3J0IHsgcGF0aHMsIG11dGV4IH0gZnJvbSAnLi4vLi4vbWlzYydcbmltcG9ydCAqIGFzIHNzaCBmcm9tICdzc2gyJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5leHBvcnQgdmFyIGxvY2sgPSBtdXRleCgpXG5cbmxldCBnZXRSZW1vdGVDb25mID0gdW5kZWZpbmVkXG5sZXQgZ2V0UmVtb3RlTmFtZSA9IHVuZGVmaW5lZFxubGV0IHNlcnZlcnNldHRpbmdzID0ge31cbmxldCBjdXJyZW50U2VydmVyID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQgKHBhdGgsIGFyZ3MpIHtcbiAgcmV0dXJuIGxvY2soKHJlbGVhc2UpID0+IHtcbiAgICBsZXQgcCA9IGdldF8ocGF0aCwgYXJncylcbiAgICByZWxlYXNlKHAudGhlbigoe3NvY2tldH0pID0+IHNvY2tldCkpXG4gICAgcC5jYXRjaCgoKSA9PiByZWxlYXNlKCkpXG4gICAgcmV0dXJuIHBcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0Q29ubmVjdGlvblNldHRpbmdzICgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBpZiAoZ2V0UmVtb3RlQ29uZikge1xuICAgICAgbGV0IGNvbmYgPSBnZXRSZW1vdGVDb25mKCdKdW5vIHJlcXVlc3RzIGFjY2VzcyB0byB5b3VyIHNlcnZlciBjb25maWd1cmF0aW9uIHRvIG9wZW4gYSB0ZXJtaW5hbC4nKVxuICAgICAgY29uZi50aGVuKGNvbmYgPT4gcmVzb2x2ZShjb25mKSkuY2F0Y2gocmVhc29uID0+IHJlamVjdChyZWFzb24pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZWplY3QoJ25vcGFja2FnZScpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlbW90ZUNvbmZpZyAoZikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmIChnZXRSZW1vdGVOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlamVjdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGdldFJlbW90ZU5hbWUoKS50aGVuKG5hbWUgPT4ge1xuICAgICAgICBuYW1lID0gbmFtZS50b1N0cmluZygpXG4gICAgICAgIGxldCBjYWNoZWRTZXR0aW5ncyA9IHNlcnZlcnNldHRpbmdzW25hbWVdXG4gICAgICAgIGlmIChjYWNoZWRTZXR0aW5ncykge1xuICAgICAgICAgIHJlc29sdmUoZihtYXliZV9hZGRfYWdlbnQoY2FjaGVkU2V0dGluZ3MpKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnZXRDb25uZWN0aW9uU2V0dGluZ3MoKS50aGVuKGNvbmYgPT4ge1xuICAgICAgICAgICAgc2VydmVyc2V0dGluZ3NbbmFtZV0gPSBjb25mXG4gICAgICAgICAgICByZXNvbHZlKGYobWF5YmVfYWRkX2FnZW50KGNvbmYpKSlcbiAgICAgICAgICB9KS5jYXRjaChyZWFzb24gPT4ge1xuICAgICAgICAgICAgc2hvd1JlbW90ZUVycm9yKHJlYXNvbilcbiAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2gocmVhc29uID0+IHtcbiAgICAgICAgc2hvd1JlbW90ZUVycm9yKHJlYXNvbilcbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBtYXliZV9hZGRfYWdlbnQgKGNvbmYpIHtcbiAgaWYgKGNvbmYgJiYgYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQucmVtb3RlT3B0aW9ucy5hZ2VudEF1dGgnKSkge1xuICAgIGxldCBzc2hzb2NrID0gc3NoX3NvY2tldCgpXG4gICAgaWYgKCFjb25mLmFnZW50ICYmIHNzaHNvY2spIHtcbiAgICAgIGNvbmYuYWdlbnQgPSBzc2hzb2NrXG4gICAgfVxuICAgIGlmICghY29uZi5hZ2VudEZvcndhcmQpIHtcbiAgICAgIGNvbmYuYWdlbnRGb3J3YXJkID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQucmVtb3RlT3B0aW9ucy5mb3J3YXJkQWdlbnQnKVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZlxufVxuXG5mdW5jdGlvbiBzc2hfc29ja2V0ICgpIHtcbiAgbGV0IHNvY2sgPSBwcm9jZXNzLmVudlsnU1NIX0FVVEhfU09DSyddXG4gIGlmIChzb2NrKSB7XG4gICAgcmV0dXJuIHNvY2tcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PSAnd2luMzInKSB7XG4gICAgICByZXR1cm4gJ3BhZ2VhbnQnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBzdG9yYWdlS2V5ID0gJ2p1bm9fcmVtb3RlX3NlcnZlcl9leGVjX2tleSdcblxuZnVuY3Rpb24gc2V0UmVtb3RlRXhlYyAoc2VydmVyLCBjb21tYW5kKSB7XG4gIGxldCBzdG9yZSA9IGdldFJlbW90ZVN0b3JlKClcbiAgc3RvcmVbc2VydmVyXSA9IGNvbW1hbmRcbiAgc2V0UmVtb3RlU3RvcmUoc3RvcmUpXG59XG5cbmZ1bmN0aW9uIGdldFJlbW90ZUV4ZWMgKHNlcnZlcikge1xuICBsZXQgc3RvcmUgPSBnZXRSZW1vdGVTdG9yZSgpXG4gIHJldHVybiBzdG9yZVtzZXJ2ZXJdXG59XG5cbmZ1bmN0aW9uIHNldFJlbW90ZVN0b3JlIChzdG9yZSkge1xuICBsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBKU09OLnN0cmluZ2lmeShzdG9yZSlcbn1cblxuZnVuY3Rpb24gZ2V0UmVtb3RlU3RvcmUgKCkge1xuICBsZXQgc3RvcmUgPSBsb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV1cbiAgaWYgKHN0b3JlID09IHVuZGVmaW5lZCkge1xuICAgIHN0b3JlID0gW11cbiAgfSBlbHNlIHtcbiAgICBzdG9yZSA9IEpTT04ucGFyc2Uoc3RvcmUpXG4gIH1cbiAgcmV0dXJuIHN0b3JlXG59XG5cbmZ1bmN0aW9uIHNob3dSZW1vdGVFcnJvciAocmVhc29uKSB7XG4gIGlmIChyZWFzb24gPT0gJ25vcGFja2FnZScpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZnRwLXJlbW90ZS1lZGl0IG5vdCBpbnN0YWxsZWQnKVxuICB9IGVsc2UgaWYgKHJlYXNvbiA9PSAnbm9zZXJ2ZXJzJykge1xuICAgIGxldCBub3RpZiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdQbGVhc2Ugc2VsZWN0IGEgcHJvamVjdCcsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ29ubmVjdCB0byBhIHNlcnZlciBpbiB0aGUgZnRwLXJlbW90ZS1lZGl0IHRyZWUgdmlldy5gLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnVG9nZ2xlIFJlbW90ZSBUcmVlIFZpZXcnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBlZHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkdmlldywgJ2Z0cC1yZW1vdGUtZWRpdDp0b2dnbGUnKVxuICAgICAgICAgICAgbm90aWYuZGlzbWlzcygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBDb25uZWN0aW9uIEZhaWxlZCcsIHtcbiAgICAgIGRldGFpbHM6IGBVbmtub3duIEVycm9yOiBcXG5cXG4gJHtyZWFzb259YFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVHZXRTZXJ2ZXJDb25maWcgKGdldGNvbmYpIHtcbiAgZ2V0UmVtb3RlQ29uZiA9IGdldGNvbmZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVHZXRTZXJ2ZXJOYW1lIChuYW1lKSB7XG4gIGdldFJlbW90ZU5hbWUgPSBuYW1lXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRfIChwYXRoLCBhcmdzKSB7XG4gIHJldHVybiB3aXRoUmVtb3RlQ29uZmlnKGNvbmYgPT4ge1xuICAgIGxldCBleGVjcyA9IGdldFJlbW90ZUV4ZWMoY29uZi5uYW1lKVxuICAgIGlmICghZXhlY3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwib3BlbiBhIGRpYWxvZyBhbmQgZ2V0IGNvbmZpZyBoZXJlXCIpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0Y3AubGlzdGVuKCkudGhlbigocG9ydCkgPT4ge1xuICAgICAgICBsZXQgY29ubiA9IG5ldyBzc2guQ2xpZW50KClcblxuICAgICAgICBjb25uLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgICAgICBjb25uLmZvcndhcmRJbignMTI3LjAuMC4xJywgcG9ydCwgZXJyID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igd2hpbGUgZm9yd2FyZGluZyByZW1vdGUgY29ubmVjdGlvbiBmcm9tICR7cG9ydH06ICR7ZXJyfWApXG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgUG9ydCBpbiB1c2VgLCB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGBQb3J0ICR7cG9ydH0gb24gdGhlIHJlbW90ZSBzZXJ2ZXIgYWxyZWFkeSBpbiB1c2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcnkgYWdhaW4gd2l0aCBhbm90aGVyIHBvcnQuYFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZWplY3QoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbGV0IGpscGF0aCA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnJlbW90ZU9wdGlvbnMucmVtb3RlSnVsaWEnKVxuXG4gICAgICAgICAgLy8gY29uc3RydWN0IHNvbWV0aGluZyBsaWtlXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyAvYmluL3NoIC1jICd0bXV4IG5ldyAtcyBzZXNzaW9ubmFtZSAnXFwnJyBqdWxpYSAtaSAtZSAnXFwnXFxcXFxcJ1xcJydzdGFydHVwX3JlcGwnXFwnXFxcXFxcJ1xcJycgJ1xcJydwb3J0J1xcJycgJ1xcJycgJ1xuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gd2l0aCBwcm9wZXJseSBlc2NhcGVkIHNpbmdsZSBxdW90ZXMuXG5cbiAgICAgICAgICBsZXQgZXhlYyA9ICcnXG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnJlbW90ZU9wdGlvbnMudG11eCcpKSB7XG4gICAgICAgICAgICBsZXQgc2Vzc2lvbk5hbWUgPSBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5yZW1vdGVPcHRpb25zLnRtdXhOYW1lJylcbiAgICAgICAgICAgIGV4ZWMgKz0gYC9iaW4vc2ggLWMgJ2BcbiAgICAgICAgICAgIGV4ZWMgKz0gYHRtdXggbmV3IC1zICR7c2Vzc2lvbk5hbWV9ICdcXFxcJydgXG4gICAgICAgICAgICBpZiAocGtnU2VydmVyKCkpIHtcbiAgICAgICAgICAgICAgZXhlYyArPSBgIEpVTElBX1BLR19TRVJWRVI9XCIke3BrZ1NlcnZlcigpfVwiIGBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aHJlYWRDb3VudCgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgZXhlYyArPSBgIEpVTElBX05VTV9USFJFQURTPVwiJHt0aHJlYWRDb3VudCgpfVwiIGBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4ZWMgKz0gamxwYXRoXG4gICAgICAgICAgICBleGVjICs9IGAgJHthcmdzLmpvaW4oJyAnKX0gLWUgJ1xcXFwnXFxcXFxcXFxcXFxcJ1xcXFwnJ2BcbiAgICAgICAgICAgIC8vIGNvdWxkIGF1dG9tYXRpY2FsbHkgZXNjYXBlIHNpbmdsZSBxdW90ZXMgd2l0aCBgcmVwbGFjZSgvJy8sIGAnXFxcXCdcXFxcXFxcXFxcXFwnXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCdcXFxcXFxcXFxcXFwnXFxcXCcnYClgLFxuICAgICAgICAgICAgLy8gYnV0IHRoYXQncyBzbyB1Z2x5IEknZCByYXRoZXIgbm90IGRvIHRoYXRcbiAgICAgICAgICAgIGV4ZWMgKz0gZnMucmVhZEZpbGVTeW5jKHBhdGhzLnNjcmlwdCgnYm9vdF9yZXBsLmpsJykpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIGV4ZWMgKz0gYCdcXFxcJ1xcXFxcXFxcXFxcXCdcXFxcJycgJHtwb3J0fSAnXFxcXCcnIGBcbiAgICAgICAgICAgIGV4ZWMgKz0gYHx8IHRtdXggc2VuZC1rZXlzIC10ICR7c2Vzc2lvbk5hbWV9LmxlZnQgXkEgXksgXkggJ1xcXFwnJ0p1bm8uY29ubmVjdCgke3BvcnR9KSdcXFxcJycgRU5URVIgYFxuICAgICAgICAgICAgZXhlYyArPSBgJiYgdG11eCBhdHRhY2ggLXQgJHtzZXNzaW9uTmFtZX0gYFxuICAgICAgICAgICAgZXhlYyArPSBgJ2BcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhlYyArPSBgL2Jpbi9zaCAtYyAnYFxuICAgICAgICAgICAgaWYgKHBrZ1NlcnZlcigpKSB7XG4gICAgICAgICAgICAgIGV4ZWMgKz0gYCBKVUxJQV9QS0dfU0VSVkVSPVwiJHtwa2dTZXJ2ZXIoKX1cIiBgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhyZWFkQ291bnQoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGV4ZWMgKz0gYCBKVUxJQV9OVU1fVEhSRUFEUz1cIiR7dGhyZWFkQ291bnQoKX1cIiBgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleGVjICs9IGAke2pscGF0aH0gJHthcmdzLmpvaW4oJyAnKX0gLWUgJ1xcXFwnJ2BcbiAgICAgICAgICAgIC8vIGNvdWxkIGF1dG9tYXRpY2FsbHkgZXNjYXBlIHNpbmdsZSBxdW90ZXMgd2l0aCBgcmVwbGFjZSgvJy8sIGAnXFxcXCdcXFxcXFxcXFxcXFwnXFxcXCcnYClgLFxuICAgICAgICAgICAgLy8gYnV0IHRoYXQncyBzbyB1Z2x5IEknZCByYXRoZXIgbm90IGRvIHRoYXRcbiAgICAgICAgICAgIGV4ZWMgKz0gZnMucmVhZEZpbGVTeW5jKHBhdGhzLnNjcmlwdCgnYm9vdF9yZXBsLmpsJykpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIGV4ZWMgKz0gYCdcXFxcJycgJHtwb3J0fWBcbiAgICAgICAgICAgIGV4ZWMgKz0gYCdgXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29ubi5leGVjKGV4ZWMsIHsgcHR5OiB7IHRlcm06IFwieHRlcm0tMjU2Y29sb3JcIiB9IH0sIChlcnIsIHN0cmVhbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihgRXJyb3Igd2hpbGUgZXhlY3V0aW5nIGNvbW1hbmQgXFxuXFxgJHtleGVjfVxcYFxcbiBvbiByZW1vdGUgc2VydmVyLmApXG5cbiAgICAgICAgICAgIHN0cmVhbS5vbignY2xvc2UnLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSAnV2UgdHJpZWQgdG8gbGF1bmNoIEp1bGlhICdcbiAgICAgICAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQucmVtb3RlT3B0aW9ucy50bXV4JykpIHtcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IGBpbiBhIFxcYHRtdXhcXGAgc2Vzc2lvbiBuYW1lZCBcXGAke2F0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnJlbW90ZU9wdGlvbnMudG11eE5hbWUnKX1cXGAgYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBgZnJvbSBcXGAke2pscGF0aH1cXGAgYnV0IHRoZSBwcm9jZXNzIGZhaWxlZCB3aXRoIFxcYCR7ZXJyfVxcYC5cXG5cXG5gXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gJ1BsZWFzZSBtYWtlIHN1cmUgeW91ciBzZXR0aW5ncyBhcmUgY29ycmVjdC4nXG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiUmVtb3RlIEp1bGlhIHNlc3Npb24gY291bGQgbm90IGJlIHN0YXJ0ZWQuXCIsIHtcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25uLmVuZCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgc3RyZWFtLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgICAgY29ubi5lbmQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHN0cmVhbS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25uLmVuZCgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBsZXQgc29jayA9IHNvY2tldChzdHJlYW0pXG5cbiAgICAgICAgICAgIC8vIGZvcndhcmQgcmVzaXplIGhhbmRsaW5nXG4gICAgICAgICAgICBzdHJlYW0ucmVzaXplID0gKGNvbHMsIHJvd3MpID0+IHN0cmVhbS5zZXRXaW5kb3cocm93cywgY29scywgOTk5LCA5OTkpXG4gICAgICAgICAgICBsZXQgcHJvYyA9IHtcbiAgICAgICAgICAgICAgdHk6IHN0cmVhbSxcbiAgICAgICAgICAgICAga2lsbDogKCkgPT4gc3RyZWFtLnNpZ25hbCgnS0lMTCcpLFxuICAgICAgICAgICAgICBkaXNjb25uZWN0OiAoKSA9PiBzdHJlYW0uY2xvc2UoKSxcbiAgICAgICAgICAgICAgaW50ZXJydXB0OiAoKSA9PiBzdHJlYW0ud3JpdGUoJ1xceDAzJyksIC8vIHNpZ25hbCBoYW5kbGluZyBkb2Vzbid0IHNlZW0gdG8gd29yayA6L1xuICAgICAgICAgICAgICBzb2NrZXQ6IHNvY2ssXG4gICAgICAgICAgICAgIG9uRXhpdDogKGYpID0+IHN0cmVhbS5vbignY2xvc2UnLCBmKSxcbiAgICAgICAgICAgICAgb25TdGRlcnI6IChmKSA9PiBzdHJlYW0uc3RkZXJyLm9uKCdkYXRhJywgZGF0YSA9PiBmKGRhdGEudG9TdHJpbmcoKSkpLFxuICAgICAgICAgICAgICBvblN0ZG91dDogKGYpID0+IHN0cmVhbS5vbignZGF0YScsIGRhdGEgPT4gZihkYXRhLnRvU3RyaW5nKCkpKSxcbiAgICAgICAgICAgICAgY29uZmlnOiBjb25mXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKHByb2MpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSkub24oJ3RjcCBjb25uZWN0aW9uJywgKGluZm8sIGFjY2VwdCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgbGV0IHN0cmVhbSA9IGFjY2VwdCgpIC8vIGNvbm5lY3QgdG8gZm9yd2FyZGVkIGNvbm5lY3Rpb25cbiAgICAgICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICAgICAgY29ubi5lbmQoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgc3RyZWFtLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgIGNvbm4uZW5kKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHN0cmVhbS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgY29ubi5lbmQoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLy8gc3RhcnQgc2VydmVyIHRoYXQgdGhlIGp1bGlhIHNlcnZlciBjYW4gY29ubmVjdCB0b1xuICAgICAgICAgIGxldCBzb2NrID0gbmV0LmNyZWF0ZUNvbm5lY3Rpb24oeyBwb3J0OiBwb3J0IH0sICgpID0+IHtcbiAgICAgICAgICAgIHN0cmVhbS5waXBlKHNvY2spLnBpcGUoc3RyZWFtKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgc29jay5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25uLmVuZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBzb2NrLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgIGNvbm4uZW5kKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNvY2sub24oJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbm4uZW5kKClcbiAgICAgICAgICB9KVxuICAgICAgICB9KS5jb25uZWN0KGNvbmYpXG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9ICdUaGUgZm9sbG93aW5nIGVycm9yIG9jY3VyZWQgd2hlbiB0cnlpbmcgdG8gb3BlbiBhIHRjcCAnXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICdjb25uZWN0aW9uOiAnXG4gICAgICAgIGRlc2NyaXB0aW9uICs9IGBcXGAke2Vycn1cXGBgXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkVycm9yIHdoaWxlIGNvbm5lY3RpbmcgdG8gcmVtb3RlIEp1bGlhIHNlc3Npb24uXCIsIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gcGtnU2VydmVyICgpIHtcbiAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy5wYWNrYWdlU2VydmVyJylcbn1cblxuZnVuY3Rpb24gdGhyZWFkQ291bnQgKCkge1xuICBsZXQgY29uZm50ID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLm51bWJlck9mVGhyZWFkcycpXG4gIGxldCBjb25mbnRJbnQgPSBwYXJzZUludChjb25mbnQpXG4gIGlmIChjb25mbnRJbnQgIT0gMCAmJiBpc0Zpbml0ZShjb25mbnRJbnQpKSB7XG4gICAgcmV0dXJuIGNvbmZudEludFxuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxufVxuXG5mdW5jdGlvbiBzb2NrZXQgKHN0cmVhbSkge1xuICBjb25uID0gdGNwLm5leHQoKVxuICBmYWlsdXJlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHN0cmVhbS5vbignY2xvc2UnLCAoZXJyKSA9PiB7XG4gICAgICBjb25uLmRpc3Bvc2UoKVxuICAgICAgcmVqZWN0KGVycilcbiAgICB9KVxuICB9KVxuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtjb25uLCBmYWlsdXJlXSlcbn1cbiJdfQ==