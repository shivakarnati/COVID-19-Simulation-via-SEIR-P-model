'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.checkIncompatible = checkIncompatible;

function checkIncompatible() {
  var incompat = [];
  for (var package of atom.packages.getLoadedPackages()) {
    if (!package.isCompatible()) {
      incompat.push(package);
    }
  }

  if (incompat.length > 0) {
    showNotification(incompat);
  }
}

function showNotification(incompat) {
  var packageNames = incompat.map(function (p) {
    return p.name;
  });
  var warn = atom.notifications.addWarning('Incompatible packages detected.', {
    buttons: [{
      text: 'Rebuild packages',
      onDidClick: function onDidClick() {
        warn.dismiss();
        atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'incompatible-packages:view');
      }
    }],
    description: 'The above packages are incompatible with the current version\n                    of Atom and have been deactivated. Juno will not work properly\n                    until they are rebuilt.',
    detail: '\n' + packageNames.join('\n'),
    dismissable: true
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvdWJlci1qdW5vL2xpYi9pbmNvbXBhdGlibGUtcGFja2FnZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7O0FBRUosU0FBUyxpQkFBaUIsR0FBSTtBQUNuQyxNQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDakIsT0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7QUFDckQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRTtBQUMzQixjQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3ZCO0dBQ0Y7O0FBRUQsTUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2QixvQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMzQjtDQUNGOztBQUVELFNBQVMsZ0JBQWdCLENBQUUsUUFBUSxFQUFFO0FBQ25DLE1BQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1dBQUssQ0FBQyxDQUFDLElBQUk7R0FBQSxDQUFDLENBQUE7QUFDOUMsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLEVBQ3hFO0FBQ0UsV0FBTyxFQUFFLENBQ1A7QUFDRSxVQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLGdCQUFVLEVBQUUsc0JBQU07QUFDaEIsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLDRCQUE0QixDQUFDLENBQUE7T0FDekc7S0FDRixDQUNGO0FBQ0QsZUFBVyxpTUFFMkI7QUFDdEMsVUFBTSxFQUFFLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN0QyxlQUFXLEVBQUUsSUFBSTtHQUNsQixDQUNGLENBQUE7Q0FDRiIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL3ViZXItanVuby9saWIvaW5jb21wYXRpYmxlLXBhY2thZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSW5jb21wYXRpYmxlICgpIHtcbiAgbGV0IGluY29tcGF0ID0gW11cbiAgZm9yIChsZXQgcGFja2FnZSBvZiBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2VzKCkpIHtcbiAgICBpZiAoIXBhY2thZ2UuaXNDb21wYXRpYmxlKCkpIHtcbiAgICAgIGluY29tcGF0LnB1c2gocGFja2FnZSlcbiAgICB9XG4gIH1cblxuICBpZiAoaW5jb21wYXQubGVuZ3RoID4gMCkge1xuICAgIHNob3dOb3RpZmljYXRpb24oaW5jb21wYXQpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvd05vdGlmaWNhdGlvbiAoaW5jb21wYXQpIHtcbiAgbGV0IHBhY2thZ2VOYW1lcyA9IGluY29tcGF0Lm1hcCgocCkgPT4gcC5uYW1lKVxuICBsZXQgd2FybiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdJbmNvbXBhdGlibGUgcGFja2FnZXMgZGV0ZWN0ZWQuJyxcbiAgICB7XG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnUmVidWlsZCBwYWNrYWdlcycsXG4gICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgd2Fybi5kaXNtaXNzKClcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSksICdpbmNvbXBhdGlibGUtcGFja2FnZXM6dmlldycpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246IGBUaGUgYWJvdmUgcGFja2FnZXMgYXJlIGluY29tcGF0aWJsZSB3aXRoIHRoZSBjdXJyZW50IHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgb2YgQXRvbSBhbmQgaGF2ZSBiZWVuIGRlYWN0aXZhdGVkLiBKdW5vIHdpbGwgbm90IHdvcmsgcHJvcGVybHlcbiAgICAgICAgICAgICAgICAgICAgdW50aWwgdGhleSBhcmUgcmVidWlsdC5gLFxuICAgICAgZGV0YWlsOiAnXFxuJyArIHBhY2thZ2VOYW1lcy5qb2luKCdcXG4nKSxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfVxuICApXG59XG4iXX0=