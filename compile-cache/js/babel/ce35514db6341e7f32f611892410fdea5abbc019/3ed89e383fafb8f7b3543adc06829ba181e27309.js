Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = debuginfo;

var _connection = require('../connection');

'use babel';

var _client$import = _connection.client['import'](['reportinfo']);

var reportinfo = _client$import.reportinfo;

function debuginfo() {
  var atomReport = '# Atom:\nVersion: ' + atom.getVersion() + '\nDev Mode: ' + atom.inDevMode() + '\nOfficial Release: ' + atom.isReleasedVersion() + '\n' + JSON.stringify(process.versions, null, 2) + '\n';
  var atomPkgs = ['julia-client', 'ink', 'uber-juno', 'language-julia', 'language-weave', 'indent-detective', 'latex-completions'];
  atomPkgs.forEach(function (pkg, ind) {
    atomReport += '# ' + atomPkgs[ind] + ':';
    var activePkg = atom.packages.getActivePackage(pkg);
    if (activePkg) {
      atomReport += '\nVersion: ' + activePkg.metadata.version + '\nConfig:\n' + JSON.stringify(activePkg.config.settings[pkg], null, 2) + '\n';
    } else {
      atomReport += 'not installed\n';
    }
    atomReport += '\n\n';
  });

  reportinfo().then(function (info) {
    atomReport += "# versioninfo():\n";
    atomReport += info;
    showNotification(atomReport);
  })['catch'](function (err) {
    atomReport += 'Could not connect to Julia.';
    showNotification(atomReport);
  });
}

function showNotification(atomReport) {
  atom.notifications.addInfo('Juno Debug Info', {
    description: 'Please provide the info above when you report an issue. ' + 'Make sure to strip it of any kind of sensitive info you might ' + 'not want to share.',
    detail: atomReport,
    dismissable: true,
    buttons: [{
      text: 'Copy to Clipboard',
      onDidClick: function onDidClick() {
        atom.clipboard.write(atomReport);
      }
    }]
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2RlYnVnaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBTXdCLFNBQVM7OzBCQUpWLGVBQWU7O0FBRnRDLFdBQVcsQ0FBQTs7cUJBSVksNEJBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDOztJQUE1QyxVQUFVLGtCQUFWLFVBQVU7O0FBRUgsU0FBUyxTQUFTLEdBQUk7QUFDbkMsTUFBSSxVQUFVLDBCQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsb0JBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsNEJBQ1IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQzFDLENBQUE7QUFDQyxNQUFNLFFBQVEsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUN0RSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO0FBQzFELFVBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQzdCLGNBQVUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtBQUN4QyxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ25ELFFBQUksU0FBUyxFQUFFO0FBQ2IsZ0JBQVUsb0JBRUwsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLG1CQUVuQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsT0FDeEQsQ0FBQTtLQUNJLE1BQU07QUFDTCxnQkFBVSxJQUFJLGlCQUFpQixDQUFBO0tBQ2hDO0FBQ0QsY0FBVSxJQUFJLE1BQU0sQ0FBQTtHQUNyQixDQUFDLENBQUE7O0FBRUYsWUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3hCLGNBQVUsSUFBSSxvQkFBb0IsQ0FBQTtBQUNsQyxjQUFVLElBQUksSUFBSSxDQUFBO0FBQ2xCLG9CQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQzdCLENBQUMsU0FBTSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2QsY0FBVSxJQUFJLDZCQUE2QixDQUFBO0FBQzNDLG9CQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQzdCLENBQUMsQ0FBQTtDQUNIOztBQUVELFNBQVMsZ0JBQWdCLENBQUUsVUFBVSxFQUFFO0FBQ3JDLE1BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO0FBQzVDLGVBQVcsRUFBRSwwREFBMEQsR0FDMUQsZ0VBQWdFLEdBQ2hFLG9CQUFvQjtBQUNqQyxVQUFNLEVBQUUsVUFBVTtBQUNsQixlQUFXLEVBQUUsSUFBSTtBQUNqQixXQUFPLEVBQUUsQ0FDUDtBQUNFLFVBQUksRUFBRSxtQkFBbUI7QUFDekIsZ0JBQVUsRUFBRSxzQkFBTTtBQUNoQixZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUNqQztLQUNGLENBQ0Y7R0FDRixDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvcnVudGltZS9kZWJ1Z2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uJ1xuXG5jb25zdCB7IHJlcG9ydGluZm8gfSA9IGNsaWVudC5pbXBvcnQoWydyZXBvcnRpbmZvJ10pXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYnVnaW5mbyAoKSB7XG4gIGxldCBhdG9tUmVwb3J0ID0gYCMgQXRvbTpcblZlcnNpb246ICR7YXRvbS5nZXRWZXJzaW9uKCl9XG5EZXYgTW9kZTogJHthdG9tLmluRGV2TW9kZSgpfVxuT2ZmaWNpYWwgUmVsZWFzZTogJHthdG9tLmlzUmVsZWFzZWRWZXJzaW9uKCl9XG4ke0pTT04uc3RyaW5naWZ5KHByb2Nlc3MudmVyc2lvbnMsIG51bGwsIDIpfVxuYFxuICBjb25zdCBhdG9tUGtncyA9IFsnanVsaWEtY2xpZW50JywgJ2luaycsICd1YmVyLWp1bm8nLCAnbGFuZ3VhZ2UtanVsaWEnLCAnbGFuZ3VhZ2Utd2VhdmUnLFxuICAgICAgICAgICAgICAgICAgICAnaW5kZW50LWRldGVjdGl2ZScsICdsYXRleC1jb21wbGV0aW9ucyddXG4gIGF0b21Qa2dzLmZvckVhY2goKHBrZywgaW5kKSA9PiB7XG4gICAgYXRvbVJlcG9ydCArPSAnIyAnICsgYXRvbVBrZ3NbaW5kXSArICc6J1xuICAgIGxldCBhY3RpdmVQa2cgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UocGtnKVxuICAgIGlmIChhY3RpdmVQa2cpIHtcbiAgICAgIGF0b21SZXBvcnQgKz1cbiAgICAgIGBcblZlcnNpb246ICR7YWN0aXZlUGtnLm1ldGFkYXRhLnZlcnNpb259XG5Db25maWc6XG4ke0pTT04uc3RyaW5naWZ5KGFjdGl2ZVBrZy5jb25maWcuc2V0dGluZ3NbcGtnXSwgbnVsbCwgMil9XG5gXG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b21SZXBvcnQgKz0gJ25vdCBpbnN0YWxsZWRcXG4nXG4gICAgfVxuICAgIGF0b21SZXBvcnQgKz0gJ1xcblxcbidcbiAgfSlcblxuICByZXBvcnRpbmZvKCkudGhlbihpbmZvID0+IHtcbiAgICBhdG9tUmVwb3J0ICs9IFwiIyB2ZXJzaW9uaW5mbygpOlxcblwiXG4gICAgYXRvbVJlcG9ydCArPSBpbmZvXG4gICAgc2hvd05vdGlmaWNhdGlvbihhdG9tUmVwb3J0KVxuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIGF0b21SZXBvcnQgKz0gJ0NvdWxkIG5vdCBjb25uZWN0IHRvIEp1bGlhLidcbiAgICBzaG93Tm90aWZpY2F0aW9uKGF0b21SZXBvcnQpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24gKGF0b21SZXBvcnQpIHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0p1bm8gRGVidWcgSW5mbycsIHtcbiAgICBkZXNjcmlwdGlvbjogJ1BsZWFzZSBwcm92aWRlIHRoZSBpbmZvIGFib3ZlIHdoZW4geW91IHJlcG9ydCBhbiBpc3N1ZS4gJyArXG4gICAgICAgICAgICAgICAgICdNYWtlIHN1cmUgdG8gc3RyaXAgaXQgb2YgYW55IGtpbmQgb2Ygc2Vuc2l0aXZlIGluZm8geW91IG1pZ2h0ICcgK1xuICAgICAgICAgICAgICAgICAnbm90IHdhbnQgdG8gc2hhcmUuJyxcbiAgICBkZXRhaWw6IGF0b21SZXBvcnQsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnQ29weSB0byBDbGlwYm9hcmQnLFxuICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoYXRvbVJlcG9ydClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSlcbn1cbiJdfQ==