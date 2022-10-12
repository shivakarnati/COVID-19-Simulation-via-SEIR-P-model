Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.openPackage = openPackage;

var _connection = require('../connection');

var _ui = require('../ui');

'use babel';

var _client$import = _connection.client['import']({ rpc: ['packages'] });

var packages = _client$import.packages;

function openPackage() {
  var newWindow = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  var pkgs = packages();
  pkgs.then(function (pkgs) {
    var ps = [];
    for (var pkg in pkgs) {
      ps.push({ primary: pkg, secondary: pkgs[pkg] });
    }
    _ui.selector.show(ps, { infoMessage: 'Select package to open' }).then(function (pkg) {
      if (pkg) {
        if (newWindow) {
          atom.open({ pathsToOpen: [pkgs[pkg.primary]] });
        } else {
          atom.project.addPath(pkgs[pkg.primary], {
            mustExist: true,
            exact: true
          });
        }
      }
    });
  })['catch'](function () {
    atom.notifications.addError("Couldn't find your Julia packages.");
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL3BhY2thZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzBCQUV1QixlQUFlOztrQkFDYixPQUFPOztBQUhoQyxXQUFXLENBQUE7O3FCQUtRLDRCQUFhLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDOztJQUFqRCxRQUFRLGtCQUFSLFFBQVE7O0FBRVAsU0FBUyxXQUFXLEdBQW9CO01BQWxCLFNBQVMseURBQUcsSUFBSTs7QUFDM0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxFQUFFLENBQUE7QUFDdkIsTUFBSSxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNoQixRQUFNLEVBQUUsR0FBSSxFQUFFLENBQUE7QUFDZCxTQUFLLElBQU0sR0FBRyxJQUFJLElBQUksRUFBRTtBQUN0QixRQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUNoRDtBQUNELGlCQUFTLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUcsRUFBSTtBQUN4RSxVQUFJLEdBQUcsRUFBRTtBQUNQLFlBQUksU0FBUyxFQUFFO0FBQ2IsY0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7U0FDL0MsTUFBTTtBQUNMLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDdEMscUJBQVMsRUFBRSxJQUFJO0FBQ2YsaUJBQUssRUFBRSxJQUFJO1dBQ1osQ0FBQyxDQUFBO1NBQ0g7T0FDRjtLQUNGLENBQUMsQ0FBQTtHQUNILENBQUMsU0FBTSxDQUFDLFlBQU07QUFDYixRQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0dBQ2xFLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL3BhY2thZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCB7IHNlbGVjdG9yIH0gZnJvbSAnLi4vdWknXG5cbnZhciB7IHBhY2thZ2VzIH0gPSBjbGllbnQuaW1wb3J0KHsgcnBjOiBbJ3BhY2thZ2VzJ10gfSlcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5QYWNrYWdlIChuZXdXaW5kb3cgPSB0cnVlKSB7XG4gIGNvbnN0IHBrZ3MgPSBwYWNrYWdlcygpXG4gIHBrZ3MudGhlbihwa2dzID0+IHtcbiAgICBjb25zdCBwcyA9ICBbXVxuICAgIGZvciAoY29uc3QgcGtnIGluIHBrZ3MpIHtcbiAgICAgIHBzLnB1c2goeyBwcmltYXJ5OiBwa2csIHNlY29uZGFyeTogcGtnc1twa2ddIH0pXG4gICAgfVxuICAgIHNlbGVjdG9yLnNob3cocHMsIHsgaW5mb01lc3NhZ2U6ICdTZWxlY3QgcGFja2FnZSB0byBvcGVuJyB9KS50aGVuKCBwa2cgPT4ge1xuICAgICAgaWYgKHBrZykge1xuICAgICAgICBpZiAobmV3V2luZG93KSB7XG4gICAgICAgICAgYXRvbS5vcGVuKHsgcGF0aHNUb09wZW46IFtwa2dzW3BrZy5wcmltYXJ5XV19KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoKHBrZ3NbcGtnLnByaW1hcnldLCB7XG4gICAgICAgICAgICBtdXN0RXhpc3Q6IHRydWUsXG4gICAgICAgICAgICBleGFjdDogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQ291bGRuJ3QgZmluZCB5b3VyIEp1bGlhIHBhY2thZ2VzLlwiKVxuICB9KVxufVxuIl19