Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

var _connection = require('../connection');

var _atom = require('atom');

var _electron = require('electron');

'use babel';

var pane = undefined,
    subs = undefined;

var _client$import = _connection.client['import']({ msg: ['loadProfileTrace', 'saveProfileTrace'] });

var loadProfileTrace = _client$import.loadProfileTrace;
var saveProfileTrace = _client$import.saveProfileTrace;

function activate(ink) {
  pane = ink.PlotPane.fromId('Profile');
  pane.getTitle = function () {
    return 'Profiler';
  };
  subs = new _atom.CompositeDisposable();

  subs.add(_connection.client.onDetached(function () {
    return clear();
  }));
  subs.add(atom.config.observe('julia-client.uiOptions.layouts.profiler.defaultLocation', function (defaultLocation) {
    pane.setDefaultLocation(defaultLocation);
  }));

  _connection.client.handle({
    profile: function profile(data) {
      var save = function save(path) {
        return saveProfileTrace(path, data);
      };
      var profile = new ink.Profiler.ProfileViewer({ data: data, save: save, customClass: 'julia-profile' });
      pane.ensureVisible({
        split: atom.config.get('julia-client.uiOptions.layouts.profiler.split')
      });
      pane.show(new ink.Pannable(profile, { zoomstrategy: 'width', minScale: 0.5 }));
    }
  });

  subs.add(atom.commands.add('atom-workspace', 'julia-client:clear-profile', function () {
    clear();
    pane.close();
  }));

  subs.add(atom.commands.add('atom-workspace', 'julia-client:load-profile-trace', function () {
    var path = _electron.remote.dialog.showOpenDialog({ title: 'Load Profile Trace', properties: ['openFile'] });
    loadProfileTrace(path);
  }));
}

function clear() {
  pane.teardown();
}

function deactivate() {
  subs.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL3Byb2ZpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFdUIsZUFBZTs7b0JBQ0YsTUFBTTs7d0JBQ25CLFVBQVU7O0FBSmpDLFdBQVcsQ0FBQTs7QUFNWCxJQUFJLElBQUksWUFBQTtJQUFFLElBQUksWUFBQSxDQUFBOztxQkFDNkIsNEJBQWEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLEVBQUMsQ0FBQzs7SUFBcEcsZ0JBQWdCLGtCQUFoQixnQkFBZ0I7SUFBRSxnQkFBZ0Isa0JBQWhCLGdCQUFnQjs7QUFFaEMsU0FBUyxRQUFRLENBQUUsR0FBRyxFQUFFO0FBQzdCLE1BQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxNQUFJLENBQUMsUUFBUSxHQUFHLFlBQU07QUFBQyxXQUFPLFVBQVUsQ0FBQTtHQUFDLENBQUE7QUFDekMsTUFBSSxHQUFHLCtCQUF5QixDQUFBOztBQUVoQyxNQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFPLFVBQVUsQ0FBQztXQUFNLEtBQUssRUFBRTtHQUFBLENBQUMsQ0FBQyxDQUFBO0FBQzFDLE1BQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseURBQXlELEVBQUUsVUFBQyxlQUFlLEVBQUs7QUFDM0csUUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFBO0dBQ3pDLENBQUMsQ0FBQyxDQUFBOztBQUVILHFCQUFPLE1BQU0sQ0FBQztBQUNaLFdBQU8sRUFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixVQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxJQUFJO2VBQUssZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztPQUFBLENBQUE7QUFDbkQsVUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQTtBQUMxRixVQUFJLENBQUMsYUFBYSxDQUFDO0FBQ2pCLGFBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQztPQUN4RSxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUE7S0FDN0U7R0FDRixDQUFDLENBQUE7O0FBRUYsTUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSw0QkFBNEIsRUFBRSxZQUFNO0FBQy9FLFNBQUssRUFBRSxDQUFBO0FBQ1AsUUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0dBQ2IsQ0FBQyxDQUFDLENBQUE7O0FBRUgsTUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQ0FBaUMsRUFBRSxZQUFNO0FBQ3BGLFFBQU0sSUFBSSxHQUFHLGlCQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsVUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ2xHLG9CQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3ZCLENBQUMsQ0FBQyxDQUFBO0NBQ0o7O0FBRUQsU0FBUyxLQUFLLEdBQUk7QUFDaEIsTUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0NBQ2hCOztBQUVNLFNBQVMsVUFBVSxHQUFJO0FBQzVCLE1BQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUNmIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL3Byb2ZpbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgcmVtb3RlIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmxldCBwYW5lLCBzdWJzXG52YXIge2xvYWRQcm9maWxlVHJhY2UsIHNhdmVQcm9maWxlVHJhY2V9ID0gY2xpZW50LmltcG9ydCh7bXNnOiBbJ2xvYWRQcm9maWxlVHJhY2UnLCAnc2F2ZVByb2ZpbGVUcmFjZSddfSlcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlIChpbmspIHtcbiAgcGFuZSA9IGluay5QbG90UGFuZS5mcm9tSWQoJ1Byb2ZpbGUnKVxuICBwYW5lLmdldFRpdGxlID0gKCkgPT4ge3JldHVybiAnUHJvZmlsZXInfVxuICBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIHN1YnMuYWRkKGNsaWVudC5vbkRldGFjaGVkKCgpID0+IGNsZWFyKCkpKVxuICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMucHJvZmlsZXIuZGVmYXVsdExvY2F0aW9uJywgKGRlZmF1bHRMb2NhdGlvbikgPT4ge1xuICAgIHBhbmUuc2V0RGVmYXVsdExvY2F0aW9uKGRlZmF1bHRMb2NhdGlvbilcbiAgfSkpXG5cbiAgY2xpZW50LmhhbmRsZSh7XG4gICAgcHJvZmlsZShkYXRhKSB7XG4gICAgICBjb25zdCBzYXZlID0gKHBhdGgpID0+IHNhdmVQcm9maWxlVHJhY2UocGF0aCwgZGF0YSlcbiAgICAgIGNvbnN0IHByb2ZpbGUgPSBuZXcgaW5rLlByb2ZpbGVyLlByb2ZpbGVWaWV3ZXIoe2RhdGEsIHNhdmUsIGN1c3RvbUNsYXNzOiAnanVsaWEtcHJvZmlsZSd9KVxuICAgICAgcGFuZS5lbnN1cmVWaXNpYmxlKHtcbiAgICAgICAgc3BsaXQ6IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLnByb2ZpbGVyLnNwbGl0JylcbiAgICAgIH0pXG4gICAgICBwYW5lLnNob3cobmV3IGluay5QYW5uYWJsZShwcm9maWxlLCB7em9vbXN0cmF0ZWd5OiAnd2lkdGgnLCBtaW5TY2FsZTogMC41fSkpXG4gICAgfVxuICB9KVxuXG4gIHN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqdWxpYS1jbGllbnQ6Y2xlYXItcHJvZmlsZScsICgpID0+IHtcbiAgICBjbGVhcigpXG4gICAgcGFuZS5jbG9zZSgpXG4gIH0pKVxuXG4gIHN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqdWxpYS1jbGllbnQ6bG9hZC1wcm9maWxlLXRyYWNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nKHt0aXRsZTogJ0xvYWQgUHJvZmlsZSBUcmFjZScsIHByb3BlcnRpZXM6IFsnb3BlbkZpbGUnXX0pXG4gICAgbG9hZFByb2ZpbGVUcmFjZShwYXRoKVxuICB9KSlcbn1cblxuZnVuY3Rpb24gY2xlYXIgKCkge1xuICBwYW5lLnRlYXJkb3duKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBzdWJzLmRpc3Bvc2UoKVxufVxuIl19