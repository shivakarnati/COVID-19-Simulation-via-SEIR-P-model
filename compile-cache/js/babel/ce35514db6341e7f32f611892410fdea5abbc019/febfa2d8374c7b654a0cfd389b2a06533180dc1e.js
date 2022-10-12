Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.home = home;
exports.juliaHome = juliaHome;
exports.jlpath = jlpath;
exports.expandHome = expandHome;
exports.fullPath = fullPath;
exports.getVersion = getVersion;
exports.projectDir = projectDir;
exports.getPathFromTreeView = getPathFromTreeView;
exports.getDirPathFromTreeView = getDirPathFromTreeView;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function home() {
  var key = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';

  for (var _len = arguments.length, p = Array(_len), _key = 0; _key < _len; _key++) {
    p[_key] = arguments[_key];
  }

  return _path2['default'].join.apply(_path2['default'], [process.env[key]].concat(p));
}

function juliaHome() {
  var juliaHome = process.env.JULIA_HOME || home('.julia');

  for (var _len2 = arguments.length, p = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    p[_key2] = arguments[_key2];
  }

  return _path2['default'].join.apply(_path2['default'], [juliaHome].concat(p));
}

function jlpath() {
  return expandHome(atom.config.get('julia-client.juliaPath'));
}

function expandHome(p) {
  return p.startsWith('~') ? p.replace('~', home()) : p;
}

function fullPath(p) {
  return new Promise(function (resolve, reject) {
    if (_fs2['default'].existsSync(p)) {
      return resolve(_fs2['default'].realpathSync(p));
    }
    var current_dir = process.cwd();
    var exepath = _path2['default'].dirname(process.execPath);

    try {
      process.chdir(exepath);
      var realpath = _fs2['default'].realpathSync(p);
      if (_fs2['default'].existsSync(realpath)) {
        resolve(realpath);
      }
    } catch (err) {
      console.log(err);
    } finally {
      try {
        process.chdir(current_dir);
      } catch (err) {
        console.error(err);
      }
    }
    if (process.platform === 'win32') {
      if (/[a-zA-Z]\:/.test(p)) return reject("Couldn't resolve path.");
    }
    var which = process.platform === 'win32' ? 'where' : 'which';
    _child_process2['default'].exec(which + ' "' + p + '"', function (err, stdout, stderr) {
      if (err) return reject(stderr);
      var p = stdout.trim();
      if (_fs2['default'].existsSync(p)) return resolve(p);
      return reject('Couldn\'t resolve path.');
    });
  });
}

function getVersion() {
  var path = arguments.length <= 0 || arguments[0] === undefined ? jlpath() : arguments[0];

  return new Promise(function (resolve, reject) {
    fullPath(path).then(function (path) {
      _child_process2['default'].exec('"' + path + '" --version', function (err, stdout, stderr) {
        if (err) return reject(stderr);
        var res = stdout.match(/(\d+)\.(\d+)\.(\d+)/);
        if (!res) return reject('Couldn\'t resolve version.');

        var _res = _slicedToArray(res, 4);

        var _ = _res[0];
        var major = _res[1];
        var minor = _res[2];
        var patch = _res[3];

        return resolve({ major: major, minor: minor, patch: patch });
      });
    })['catch'](function (e) {
      reject('Couldn\'t resolve version.');
    });
  });
}

function projectDir() {
  if (atom.config.get('julia-client.juliaOptions.persistWorkingDir')) {
    return new Promise(function (resolve) {
      var p = atom.config.get('julia-client.juliaOptions.workingDir');
      try {
        _fs2['default'].stat(p, function (err, stats) {
          if (err) {
            return resolve(atomProjectDir());
          } else {
            return resolve(p);
          }
        });
      } catch (err) {
        return resolve(atomProjectDir());
      }
    });
  } else {
    return atomProjectDir();
  }
}

function atomProjectDir() {
  var dirs = atom.workspace.project.getDirectories();
  var ws = process.env.HOME;
  if (!ws) {
    ws = process.env.USERPROFILE;
  }
  if (dirs.length === 0 || dirs[0].path.match('app.asar')) {
    return Promise.resolve(ws);
  }
  return new Promise(function (resolve) {
    // use the first open project folder (or its parent folder for files) if
    // it is valid
    try {
      _fs2['default'].stat(dirs[0].path, function (err, stats) {
        if (err) return resolve(ws);
        if (stats.isFile()) return resolve(_path2['default'].dirname(dirs[0].path));
        return resolve(dirs[0].path);
      });
    } catch (err) {
      return resolve(ws);
    }
  });
}

function packageDir() {
  var packageRoot = _path2['default'].resolve(__dirname, '..', '..');

  for (var _len3 = arguments.length, s = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    s[_key3] = arguments[_key3];
  }

  return _path2['default'].join.apply(_path2['default'], [packageRoot].concat(s));
}

var script = function script() {
  for (var _len4 = arguments.length, s = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    s[_key4] = arguments[_key4];
  }

  return packageDir.apply(undefined, ['script'].concat(s));
};

exports.script = script;

function getPathFromTreeView(el) {
  // invoked from tree-view context menu
  var pathEl = el.closest('[data-path]');
  if (!pathEl) {
    // invoked from command with focusing on tree-view
    var activeEl = el.querySelector('.tree-view .selected');
    if (activeEl) pathEl = activeEl.querySelector('[data-path]');
  }
  if (pathEl) return pathEl.dataset.path;
  return null;
}

function getDirPathFromTreeView(el) {
  // invoked from tree-view context menu
  var dirEl = el.closest('.directory');
  if (!dirEl) {
    // invoked from command with focusing on tree-view
    var activeEl = el.querySelector('.tree-view .selected');
    if (activeEl) dirEl = activeEl.closest('.directory');
  }
  if (dirEl) {
    var pathEl = dirEl.querySelector('[data-path]');
    if (pathEl) return pathEl.dataset.path;
  }
  return null;
}

var readCode = function readCode(path) {
  return _fs2['default'].readFileSync(path, 'utf-8');
};
exports.readCode = readCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9taXNjL3BhdGhzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7NkJBQ08sZUFBZTs7OztBQUVsQyxTQUFTLElBQUksR0FBUTtBQUMxQixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FBRyxhQUFhLEdBQUcsTUFBTSxDQUFBOztvQ0FEMUMsQ0FBQztBQUFELEtBQUM7OztBQUV4QixTQUFPLGtCQUFLLElBQUksTUFBQSxxQkFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFLLENBQUMsRUFBQyxDQUFBO0NBQ3pDOztBQUVNLFNBQVMsU0FBUyxHQUFRO0FBQy9CLE1BQU0sU0FBUyxHQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQUFBQyxDQUFBOztxQ0FEaEMsQ0FBQztBQUFELEtBQUM7OztBQUU3QixTQUFPLGtCQUFLLElBQUksTUFBQSxxQkFBQyxTQUFTLFNBQUssQ0FBQyxFQUFDLENBQUE7Q0FDbEM7O0FBRU0sU0FBUyxNQUFNLEdBQUk7QUFDeEIsU0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO0NBQzdEOztBQUVNLFNBQVMsVUFBVSxDQUFFLENBQUMsRUFBRTtBQUM3QixTQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7Q0FDdEQ7O0FBRU0sU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sSUFBSSxPQUFPLENB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LENBQUE7QUFDekQsUUFBSSxRQUFRLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDN0Q7QUFDRCxNQUFJLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFBO0FBQ3RDLFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0FBRU0sU0FBUyxzQkFBc0IsQ0FBRSxFQUFFLEVBQUU7O0FBRTFDLE1BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDcEMsTUFBSSxDQUFDLEtBQUssRUFBRTs7QUFFVixRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDekQsUUFBSSxRQUFRLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7R0FDckQ7QUFDRCxNQUFJLEtBQUssRUFBRTtBQUNULFFBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDakQsUUFBSSxNQUFNLEVBQUUsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQTtHQUN2QztBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0FBRU0sSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksSUFBSTtTQUFLLGdCQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO0NBQUEsQ0FBQSIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvbWlzYy9wYXRocy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBob21lICguLi5wKSB7XG4gIGNvbnN0IGtleSA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyAnVVNFUlBST0ZJTEUnIDogJ0hPTUUnXG4gIHJldHVybiBwYXRoLmpvaW4ocHJvY2Vzcy5lbnZba2V5XSwgLi4ucClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGp1bGlhSG9tZSAoLi4ucCkge1xuICBjb25zdCBqdWxpYUhvbWUgPSAocHJvY2Vzcy5lbnYuSlVMSUFfSE9NRSB8fCBob21lKCcuanVsaWEnKSlcbiAgcmV0dXJuIHBhdGguam9pbihqdWxpYUhvbWUsIC4uLnApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBqbHBhdGggKCkge1xuICByZXR1cm4gZXhwYW5kSG9tZShhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYVBhdGgnKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZEhvbWUgKHApIHtcbiAgcmV0dXJuIHAuc3RhcnRzV2l0aCgnficpID8gcC5yZXBsYWNlKCd+JywgaG9tZSgpKSA6IHBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1bGxQYXRoIChwKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocCkpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGZzLnJlYWxwYXRoU3luYyhwKSlcbiAgICB9XG4gICAgY29uc3QgY3VycmVudF9kaXIgPSBwcm9jZXNzLmN3ZCgpXG4gICAgY29uc3QgZXhlcGF0aCA9IHBhdGguZGlybmFtZShwcm9jZXNzLmV4ZWNQYXRoKVxuXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3MuY2hkaXIoZXhlcGF0aClcbiAgICAgIGNvbnN0IHJlYWxwYXRoID0gZnMucmVhbHBhdGhTeW5jKHApXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhyZWFscGF0aCkpIHtcbiAgICAgICAgcmVzb2x2ZShyZWFscGF0aClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvY2Vzcy5jaGRpcihjdXJyZW50X2RpcilcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGlmICgvW2EtekEtWl1cXDovLnRlc3QocCkpIHJldHVybiByZWplY3QoXCJDb3VsZG4ndCByZXNvbHZlIHBhdGguXCIpXG4gICAgfVxuICAgIGNvbnN0IHdoaWNoID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICd3aGVyZScgOiAnd2hpY2gnXG4gICAgY2hpbGRfcHJvY2Vzcy5leGVjKGAke3doaWNofSBcIiR7cH1cImAsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KHN0ZGVycilcbiAgICAgIGNvbnN0IHAgPSBzdGRvdXQudHJpbSgpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwKSkgcmV0dXJuIHJlc29sdmUocClcbiAgICAgIHJldHVybiByZWplY3QoJ0NvdWxkblxcJ3QgcmVzb2x2ZSBwYXRoLicpXG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnNpb24gKHBhdGggPSBqbHBhdGgoKSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZ1bGxQYXRoKHBhdGgpLnRoZW4ocGF0aCA9PiB7XG4gICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoYFwiJHtwYXRofVwiIC0tdmVyc2lvbmAsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3Qoc3RkZXJyKVxuICAgICAgICBjb25zdCByZXMgPSBzdGRvdXQubWF0Y2goLyhcXGQrKVxcLihcXGQrKVxcLihcXGQrKS8pXG4gICAgICAgIGlmICghcmVzKSByZXR1cm4gcmVqZWN0KCdDb3VsZG5cXCd0IHJlc29sdmUgdmVyc2lvbi4nKVxuICAgICAgICBjb25zdCBbXywgbWFqb3IsIG1pbm9yLCBwYXRjaF0gPSByZXNcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoeyBtYWpvciwgbWlub3IsIHBhdGNoIH0pXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgcmVqZWN0KCdDb3VsZG5cXCd0IHJlc29sdmUgdmVyc2lvbi4nKVxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0RGlyICgpIHtcbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy5wZXJzaXN0V29ya2luZ0RpcicpKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3QgcCA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy53b3JraW5nRGlyJylcbiAgICAgIHRyeSB7XG4gICAgICAgIGZzLnN0YXQocCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShhdG9tUHJvamVjdERpcigpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShhdG9tUHJvamVjdERpcigpKVxuICAgICAgfVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF0b21Qcm9qZWN0RGlyKClcbiAgfVxufVxuXG5mdW5jdGlvbiBhdG9tUHJvamVjdERpciAoKSB7XG4gIGNvbnN0IGRpcnMgPSBhdG9tLndvcmtzcGFjZS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgbGV0IHdzID0gcHJvY2Vzcy5lbnYuSE9NRVxuICBpZiAoIXdzKSB7XG4gICAgd3MgPSBwcm9jZXNzLmVudi5VU0VSUFJPRklMRVxuICB9XG4gIGlmIChkaXJzLmxlbmd0aCA9PT0gMCB8fCBkaXJzWzBdLnBhdGgubWF0Y2goJ2FwcC5hc2FyJykpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHdzKVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAvLyB1c2UgdGhlIGZpcnN0IG9wZW4gcHJvamVjdCBmb2xkZXIgKG9yIGl0cyBwYXJlbnQgZm9sZGVyIGZvciBmaWxlcykgaWZcbiAgICAvLyBpdCBpcyB2YWxpZFxuICAgIHRyeSB7XG4gICAgICBmcy5zdGF0KGRpcnNbMF0ucGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlc29sdmUod3MpXG4gICAgICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkgcmV0dXJuIHJlc29sdmUocGF0aC5kaXJuYW1lKGRpcnNbMF0ucGF0aCkpXG4gICAgICAgIHJldHVybiByZXNvbHZlKGRpcnNbMF0ucGF0aClcbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh3cylcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHBhY2thZ2VEaXIgKC4uLnMpIHtcbiAgY29uc3QgcGFja2FnZVJvb3QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nKVxuICByZXR1cm4gcGF0aC5qb2luKHBhY2thZ2VSb290LCAuLi5zKVxufVxuXG5leHBvcnQgY29uc3Qgc2NyaXB0ID0gKC4uLnMpID0+IHBhY2thZ2VEaXIoJ3NjcmlwdCcsIC4uLnMpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXRoRnJvbVRyZWVWaWV3IChlbCkge1xuICAvLyBpbnZva2VkIGZyb20gdHJlZS12aWV3IGNvbnRleHQgbWVudVxuICBsZXQgcGF0aEVsID0gZWwuY2xvc2VzdCgnW2RhdGEtcGF0aF0nKVxuICBpZiAoIXBhdGhFbCkge1xuICAgIC8vIGludm9rZWQgZnJvbSBjb21tYW5kIHdpdGggZm9jdXNpbmcgb24gdHJlZS12aWV3XG4gICAgY29uc3QgYWN0aXZlRWwgPSBlbC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3IC5zZWxlY3RlZCcpXG4gICAgaWYgKGFjdGl2ZUVsKSBwYXRoRWwgPSBhY3RpdmVFbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYXRoXScpXG4gIH1cbiAgaWYgKHBhdGhFbCkgcmV0dXJuIHBhdGhFbC5kYXRhc2V0LnBhdGhcbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpclBhdGhGcm9tVHJlZVZpZXcgKGVsKSB7XG4gIC8vIGludm9rZWQgZnJvbSB0cmVlLXZpZXcgY29udGV4dCBtZW51XG4gIGxldCBkaXJFbCA9IGVsLmNsb3Nlc3QoJy5kaXJlY3RvcnknKVxuICBpZiAoIWRpckVsKSB7XG4gICAgLy8gaW52b2tlZCBmcm9tIGNvbW1hbmQgd2l0aCBmb2N1c2luZyBvbiB0cmVlLXZpZXdcbiAgICBjb25zdCBhY3RpdmVFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy50cmVlLXZpZXcgLnNlbGVjdGVkJylcbiAgICBpZiAoYWN0aXZlRWwpIGRpckVsID0gYWN0aXZlRWwuY2xvc2VzdCgnLmRpcmVjdG9yeScpXG4gIH1cbiAgaWYgKGRpckVsKSB7XG4gICAgY29uc3QgcGF0aEVsID0gZGlyRWwucXVlcnlTZWxlY3RvcignW2RhdGEtcGF0aF0nKVxuICAgIGlmIChwYXRoRWwpIHJldHVybiBwYXRoRWwuZGF0YXNldC5wYXRoXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWRDb2RlID0gKHBhdGgpID0+IGZzLnJlYWRGaWxlU3luYyhwYXRoLCAndXRmLTgnKVxuIl19