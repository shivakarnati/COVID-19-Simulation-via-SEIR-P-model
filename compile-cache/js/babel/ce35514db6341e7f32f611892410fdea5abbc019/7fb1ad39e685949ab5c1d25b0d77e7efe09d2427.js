Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.consumeInk = consumeInk;
exports.consumeStatusBar = consumeStatusBar;
exports.chooseEnvironment = chooseEnvironment;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _connection = require('../connection');

var _uiSelector = require('../ui/selector');

var _client$import = _connection.client['import']({ rpc: ['allProjects'], msg: ['activateProject'] });

var allProjects = _client$import.allProjects;
var activateProject = _client$import.activateProject;

var ink = undefined;

function consumeInk(_ink) {
  ink = _ink;
}

function consumeStatusBar(statusBar) {
  var subs = new _atom.CompositeDisposable();

  var dom = document.createElement('a');
  var tileDom = document.createElement('span'); // only `span` element can be hide completely
  tileDom.classList.add('julia', 'inline-block');
  tileDom.appendChild(dom);
  var tile = statusBar.addRightTile({
    item: tileDom,
    priority: 10
  });

  var projectName = '';
  var projectPath = '';

  var showTile = function showTile() {
    return tileDom.style.display = '';
  };
  var hideTile = function hideTile() {
    return tileDom.style.display = 'none';
  };
  var updateTile = function updateTile(proj) {
    if (!proj) return hideTile();
    projectName = proj.name;
    dom.innerText = 'Env: ' + projectName;
    projectPath = proj.path;
    showTile();
  };
  _connection.client.handle({ updateProject: updateTile });

  var onClick = function onClick(event) {
    if (process.platform === 'darwin' ? event.metaKey : event.ctrlKey) {
      if (!_fs2['default'].existsSync(projectPath)) return;
      var pending = atom.config.get('core.allowPendingPaneItems');
      if (ink) {
        ink.Opener.open(projectPath, {
          pending: pending
        });
      } else {
        atom.workspace.open(projectPath, {
          pending: pending,
          searchAllPanes: true
        });
      }
    } else {
      chooseEnvironment();
    }
  };

  var modifiler = process.platform == 'darwin' ? 'Cmd' : 'Ctrl';
  var title = function title() {
    return 'Currently working in environment ' + projectName + ' at ' + projectPath + '<br >' + 'Click to choose an environment<br >' + (modifiler + '-Click to open project file');
  };

  dom.addEventListener('click', onClick);
  subs.add(_connection.client.onDetached(hideTile), atom.tooltips.add(dom, { title: title }), new _atom.Disposable(function () {
    dom.removeEventListener('click', onClick);
    tile.destroy();
  }));

  hideTile();
  return subs;
}

function chooseEnvironment() {
  _connection.client.require('choose environment', function () {
    allProjects().then(function (_ref) {
      var projects = _ref.projects;
      var active = _ref.active;

      if (!projects) throw '`allProject` handler unsupported';
      if (projects.length === 0) throw 'no environment found';
      projects = projects.map(function (proj) {
        proj.primary = proj.name;
        proj.secondary = proj.path;
        return proj;
      });
      return { projects: projects, active: active };
    }).then(function (_ref2) {
      var projects = _ref2.projects;
      var active = _ref2.active;

      (0, _uiSelector.show)(projects, { active: active }).then(function (proj) {
        if (!proj) return;
        var dir = _path2['default'].dirname(proj.path);
        activateProject(dir);
      });
    })['catch'](function (err) {
      return console.log(err);
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2Vudmlyb25tZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ3lCLE1BQU07OzBCQUMvQixlQUFlOzswQkFDakIsZ0JBQWdCOztxQkFFSSw0QkFBYSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDOztJQUFsRyxXQUFXLGtCQUFYLFdBQVc7SUFBRSxlQUFlLGtCQUFmLGVBQWU7O0FBRXBDLElBQUksR0FBRyxZQUFBLENBQUE7O0FBQ0EsU0FBUyxVQUFVLENBQUUsSUFBSSxFQUFFO0FBQ2hDLEtBQUcsR0FBRyxJQUFJLENBQUE7Q0FDWDs7QUFFTSxTQUFTLGdCQUFnQixDQUFFLFNBQVMsRUFBRTtBQUMzQyxNQUFNLElBQUksR0FBRywrQkFBeUIsQ0FBQTs7QUFFdEMsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN2QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzlDLFNBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUM5QyxTQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDbEMsUUFBSSxFQUFFLE9BQU87QUFDYixZQUFRLEVBQUUsRUFBRTtHQUNiLENBQUMsQ0FBQTs7QUFFRixNQUFJLFdBQVcsR0FBRyxFQUFFLENBQUE7QUFDcEIsTUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFBOztBQUVw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QUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUM5QixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDeEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQzFCLGVBQU8sSUFBSSxDQUFBO09BQ1osQ0FBQyxDQUFBO0FBQ0YsYUFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFBO0tBQzVCLENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBQyxLQUFvQixFQUFLO1VBQXZCLFFBQVEsR0FBVixLQUFvQixDQUFsQixRQUFRO1VBQUUsTUFBTSxHQUFsQixLQUFvQixDQUFSLE1BQU07O0FBQ3ZCLDRCQUFLLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN0QyxZQUFJLENBQUMsSUFBSSxFQUFFLE9BQU07QUFDakIsWUFBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQyx1QkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO09BQ3JCLENBQUMsQ0FBQTtLQUNILENBQUMsU0FDSSxDQUFDLFVBQUEsR0FBRzthQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2Vudmlyb25tZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCB7IHNob3cgfSBmcm9tICcuLi91aS9zZWxlY3RvcidcblxuY29uc3QgeyBhbGxQcm9qZWN0cywgYWN0aXZhdGVQcm9qZWN0IH0gPSBjbGllbnQuaW1wb3J0KHsgcnBjOiBbJ2FsbFByb2plY3RzJ10sIG1zZzogWydhY3RpdmF0ZVByb2plY3QnXSB9KVxuXG5sZXQgaW5rXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZUluayAoX2luaykge1xuICBpbmsgPSBfaW5rXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgY29uc3Qgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdCBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgY29uc3QgdGlsZURvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSAvLyBvbmx5IGBzcGFuYCBlbGVtZW50IGNhbiBiZSBoaWRlIGNvbXBsZXRlbHlcbiAgdGlsZURvbS5jbGFzc0xpc3QuYWRkKCdqdWxpYScsICdpbmxpbmUtYmxvY2snKVxuICB0aWxlRG9tLmFwcGVuZENoaWxkKGRvbSlcbiAgY29uc3QgdGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgIGl0ZW06IHRpbGVEb20sXG4gICAgcHJpb3JpdHk6IDEwXG4gIH0pXG5cbiAgbGV0IHByb2plY3ROYW1lID0gJydcbiAgbGV0IHByb2plY3RQYXRoID0gJydcblxuICBjb25zdCBzaG93VGlsZSA9ICgpID0+IHRpbGVEb20uc3R5bGUuZGlzcGxheSA9ICcnXG4gIGNvbnN0IGhpZGVUaWxlID0gKCkgPT4gdGlsZURvbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIGNvbnN0IHVwZGF0ZVRpbGUgPSAocHJvaikgPT4ge1xuICAgIGlmICghcHJvaikgcmV0dXJuIGhpZGVUaWxlKClcbiAgICBwcm9qZWN0TmFtZSA9IHByb2oubmFtZVxuICAgIGRvbS5pbm5lclRleHQgPSAnRW52OiAnICsgcHJvamVjdE5hbWVcbiAgICBwcm9qZWN0UGF0aCA9IHByb2oucGF0aFxuICAgIHNob3dUaWxlKClcbiAgfVxuICBjbGllbnQuaGFuZGxlKHsgdXBkYXRlUHJvamVjdDogdXBkYXRlVGlsZSB9KVxuXG4gIGNvbnN0IG9uQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyBldmVudC5tZXRhS2V5IDogZXZlbnQuY3RybEtleSkge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHByb2plY3RQYXRoKSkgcmV0dXJuXG4gICAgICBjb25zdCBwZW5kaW5nID0gYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpXG4gICAgICBpZiAoaW5rKSB7XG4gICAgICAgIGluay5PcGVuZXIub3Blbihwcm9qZWN0UGF0aCwge1xuICAgICAgICAgIHBlbmRpbmcsXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHByb2plY3RQYXRoLCB7XG4gICAgICAgICAgcGVuZGluZyxcbiAgICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjaG9vc2VFbnZpcm9ubWVudCgpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbW9kaWZpbGVyID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PSAnZGFyd2luJyA/ICdDbWQnIDogJ0N0cmwnXG4gIGNvbnN0IHRpdGxlID0gKCkgPT4ge1xuICAgIHJldHVybiBgQ3VycmVudGx5IHdvcmtpbmcgaW4gZW52aXJvbm1lbnQgJHtwcm9qZWN0TmFtZX0gYXQgJHtwcm9qZWN0UGF0aH08YnIgPmAgK1xuICAgICAgYENsaWNrIHRvIGNob29zZSBhbiBlbnZpcm9ubWVudDxiciA+YCArXG4gICAgICBgJHttb2RpZmlsZXJ9LUNsaWNrIHRvIG9wZW4gcHJvamVjdCBmaWxlYFxuICB9XG5cbiAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaylcbiAgc3Vicy5hZGQoXG4gICAgY2xpZW50Lm9uRGV0YWNoZWQoaGlkZVRpbGUpLFxuICAgIGF0b20udG9vbHRpcHMuYWRkKGRvbSwgeyB0aXRsZSB9KSxcbiAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrKVxuICAgICAgdGlsZS5kZXN0cm95KClcbiAgICB9KVxuICApXG5cbiAgaGlkZVRpbGUoKVxuICByZXR1cm4gc3Vic1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hvb3NlRW52aXJvbm1lbnQgKCkge1xuICBjbGllbnQucmVxdWlyZSgnY2hvb3NlIGVudmlyb25tZW50JywgKCkgPT4ge1xuICAgIGFsbFByb2plY3RzKClcbiAgICAgIC50aGVuKCh7IHByb2plY3RzLCBhY3RpdmUgfSkgPT4ge1xuICAgICAgICBpZiAoIXByb2plY3RzKSB0aHJvdyAnYGFsbFByb2plY3RgIGhhbmRsZXIgdW5zdXBwb3J0ZWQnXG4gICAgICAgIGlmIChwcm9qZWN0cy5sZW5ndGggPT09IDApIHRocm93ICdubyBlbnZpcm9ubWVudCBmb3VuZCdcbiAgICAgICAgcHJvamVjdHMgPSBwcm9qZWN0cy5tYXAocHJvaiA9PiB7XG4gICAgICAgICAgcHJvai5wcmltYXJ5ID0gcHJvai5uYW1lXG4gICAgICAgICAgcHJvai5zZWNvbmRhcnkgPSBwcm9qLnBhdGhcbiAgICAgICAgICByZXR1cm4gcHJvalxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4geyBwcm9qZWN0cywgYWN0aXZlIH1cbiAgICAgIH0pXG4gICAgICAudGhlbigoeyBwcm9qZWN0cywgYWN0aXZlIH0pID0+IHtcbiAgICAgICAgc2hvdyhwcm9qZWN0cywgeyBhY3RpdmUgfSkudGhlbihwcm9qID0+IHtcbiAgICAgICAgICBpZiAoIXByb2opIHJldHVyblxuICAgICAgICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShwcm9qLnBhdGgpXG4gICAgICAgICAgYWN0aXZhdGVQcm9qZWN0KGRpcilcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG4gIH0pXG59XG4iXX0=