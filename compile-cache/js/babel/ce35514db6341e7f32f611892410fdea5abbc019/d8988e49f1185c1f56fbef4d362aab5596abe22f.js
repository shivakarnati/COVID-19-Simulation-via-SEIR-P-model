'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.closePromises = closePromises;
exports.restoreDefaultLayout = restoreDefaultLayout;
exports.resetDefaultLayoutSettings = resetDefaultLayoutSettings;
exports.queryDefaultLayout = queryDefaultLayout;
var repl = function repl() {
  return require('../runtime').console;
};
var workspace = function workspace() {
  return require('../runtime').workspace;
};
var documentation = function documentation() {
  return require('../ui').docpane;
};
var plotPane = function plotPane() {
  return require('../runtime').plots;
};
var debuggerPane = function debuggerPane() {
  return require('../runtime')['debugger'];
};
var linter = function linter() {
  return require('../runtime').linter;
};
var outline = function outline() {
  return require('../runtime').outline;
};

function specifiedPanes() {
  var panes = [];
  // @NOTE: Push panes in order of their 'importance': Refer to function `openPanesHelper` for why
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.console')) panes.push(repl);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.workspace')) panes.push(workspace);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.documentation')) panes.push(documentation);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.plotPane')) panes.push(plotPane);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.debuggerPane')) panes.push(debuggerPane);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.linter')) panes.push(linter);
  if (atom.config.get('julia-client.uiOptions.layouts.defaultPanes.outline')) panes.push(outline);

  return panes;
}

function closePromises() {
  // Close only specified panes, i.e.: non-specified panes won't be closed/opened
  var panes = specifiedPanes();

  var promises = panes.map(function (pane) {
    return pane().close();
  });

  return promises;
}

function bundlePanes() {
  var containers = [];
  containers.push(atom.workspace.getCenter());
  containers.push(atom.workspace.getLeftDock());
  containers.push(atom.workspace.getBottomDock());
  containers.push(atom.workspace.getRightDock());

  containers.forEach(function (container) {
    var panes = container.getPanes();
    var firstPane = panes[0];
    var otherPanes = panes.slice(1);
    otherPanes.forEach(function (pane) {
      var items = pane.getItems();
      items.forEach(function (item) {
        pane.moveItemToPane(item, firstPane);
      });
    });
  });
}

function openPanes() {
  var panes = specifiedPanes();

  openPanesHelper(panes);
}

function openPanesHelper(panes) {
  if (panes.length === 0) {
    // If there is no more pane to be opened, activate the first item in each pane. This works since
    // Juno-panes are opened in order of their importance as defined in `specifiedPanes` function
    atom.workspace.getPanes().forEach(function (pane) {
      pane.activateItemAtIndex(0);
    });
    // Activate `WorkspaceCenter` at last
    atom.workspace.getCenter().activate();
    return;
  }

  var pane = panes.shift();
  pane().open()['catch'](function (err) {
    // @FIXME: This is a temporal remedy for https://github.com/JunoLab/atom-julia-client/pull/561#issuecomment-500150318
    console.error(err);
    pane().open();
  })['finally'](function () {
    // Re-focus the previously focused pane (i.e. the bundled pane by `bundlePanes`) after each opening
    // This prevents opening multiple panes with the same splitting rule in a same location from
    // ending up in a funny state
    var container = atom.workspace.getActivePaneContainer();
    container.activatePreviousPane();
    openPanesHelper(panes);
  });
}

function restoreDefaultLayout() {
  // Close Juno-specific panes first to reset to default layout
  Promise.all(closePromises()).then(function () {

    // Simplify layouts in each container to prevent funny splitting
    bundlePanes();

    // Open Juno-specific panes again
    openPanes();
  });
}

function resetDefaultLayoutSettings() {
  var onStartup = atom.config.get('julia-client.uiOptions.layouts.openDefaultPanesOnStartUp');
  atom.config.unset('julia-client.uiOptions.layouts');
  atom.config.set('julia-client.uiOptions.layouts.openDefaultPanesOnStartUp', onStartup);
}

function queryDefaultLayout() {
  var message = atom.notifications.addInfo('Julia-Client: Open Juno-specific panes on startup ?', {
    buttons: [{
      text: 'Yes',
      onDidClick: function onDidClick() {
        restoreDefaultLayout();
        message.dismiss();
        atom.config.set('julia-client.firstBoot', false);
        atom.config.set('julia-client.uiOptions.layouts.openDefaultPanesOnStartUp', true);
      }
    }, {
      text: 'No',
      onDidClick: function onDidClick() {
        message.dismiss();
        atom.config.set('julia-client.firstBoot', false);
        atom.config.set('julia-client.uiOptions.layouts.openDefaultPanesOnStartUp', false);
      }
    }],
    description: 'You can specify the panes to be opened and their _default location_ and _splitting rule_ in\n       **`Packages -> Juno -> Settings -> Julia-Client -> UI Options -> Layout Options`**.\n       `Julia-Client: Restore-Default-Layout` command will restore the layout at later point in time.\n       Use `Julia-Client: Reset-Default-Layout-Settings` command to reset the layout settings if it gets messed up.',
    dismissable: true
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi91aS9sYXlvdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7QUFFWCxJQUFNLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNqQixTQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUE7Q0FDckMsQ0FBQTtBQUNELElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxHQUFTO0FBQ3RCLFNBQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQTtDQUN2QyxDQUFBO0FBQ0QsSUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFTO0FBQzFCLFNBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQTtDQUNoQyxDQUFBO0FBQ0QsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsU0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFBO0NBQ25DLENBQUE7QUFDRCxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUN6QixTQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBUyxDQUFBO0NBQ3RDLENBQUE7QUFDRCxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBUztBQUNuQixTQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUE7Q0FDcEMsQ0FBQTtBQUNELElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxHQUFTO0FBQ3BCLFNBQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQTtDQUNyQyxDQUFBOztBQUVELFNBQVMsY0FBYyxHQUFJO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQTs7QUFFaEIsTUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxx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LENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxxREFBcUQsRUFBRTtBQUNoRyxXQUFPLEVBQUUsQ0FDUDtBQUNFLFVBQUksRUFBRSxLQUFLO0FBQ1gsZ0JBQVUsRUFBRSxzQkFBTTtBQUNoQiw0QkFBb0IsRUFBRSxDQUFBO0FBQ3RCLGVBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNqQixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNoRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwREFBMEQsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNsRjtLQUNGLEVBQ0Q7QUFDRSxVQUFJLEVBQUUsSUFBSTtBQUNWLGdCQUFVLEVBQUUsc0JBQU07QUFDaEIsZUFBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pCLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ2hELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBEQUEwRCxFQUFFLEtBQUssQ0FBQyxDQUFBO09BQ25GO0tBQ0YsQ0FDRjtBQUNELGVBQVcsdVpBSXVHO0FBQ2xILGVBQVcsRUFBRSxJQUFJO0dBQ2xCLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi91aS9sYXlvdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCByZXBsID0gKCkgPT4ge1xuICByZXR1cm4gcmVxdWlyZSgnLi4vcnVudGltZScpLmNvbnNvbGVcbn1cbmNvbnN0IHdvcmtzcGFjZSA9ICgpID0+IHtcbiAgcmV0dXJuIHJlcXVpcmUoJy4uL3J1bnRpbWUnKS53b3Jrc3BhY2Vcbn1cbmNvbnN0IGRvY3VtZW50YXRpb24gPSAoKSA9PiB7XG4gIHJldHVybiByZXF1aXJlKCcuLi91aScpLmRvY3BhbmVcbn1cbmNvbnN0IHBsb3RQYW5lID0gKCkgPT4ge1xuICByZXR1cm4gcmVxdWlyZSgnLi4vcnVudGltZScpLnBsb3RzXG59XG5jb25zdCBkZWJ1Z2dlclBhbmUgPSAoKSA9PiB7XG4gIHJldHVybiByZXF1aXJlKCcuLi9ydW50aW1lJykuZGVidWdnZXJcbn1cbmNvbnN0IGxpbnRlciA9ICgpID0+IHtcbiAgcmV0dXJuIHJlcXVpcmUoJy4uL3J1bnRpbWUnKS5saW50ZXJcbn1cbmNvbnN0IG91dGxpbmUgPSAoKSA9PiB7XG4gIHJldHVybiByZXF1aXJlKCcuLi9ydW50aW1lJykub3V0bGluZVxufVxuXG5mdW5jdGlvbiBzcGVjaWZpZWRQYW5lcyAoKSB7XG4gIGNvbnN0IHBhbmVzID0gW11cbiAgLy8gQE5PVEU6IFB1c2ggcGFuZXMgaW4gb3JkZXIgb2YgdGhlaXIgJ2ltcG9ydGFuY2UnOiBSZWZlciB0byBmdW5jdGlvbiBgb3BlblBhbmVzSGVscGVyYCBmb3Igd2h5XG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5kZWZhdWx0UGFuZXMuY29uc29sZScpKSBwYW5lcy5wdXNoKHJlcGwpXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5kZWZhdWx0UGFuZXMud29ya3NwYWNlJykpIHBhbmVzLnB1c2god29ya3NwYWNlKVxuICBpZiAoYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZGVmYXVsdFBhbmVzLmRvY3VtZW50YXRpb24nKSkgcGFuZXMucHVzaChkb2N1bWVudGF0aW9uKVxuICBpZiAoYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZGVmYXVsdFBhbmVzLnBsb3RQYW5lJykpIHBhbmVzLnB1c2gocGxvdFBhbmUpXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5kZWZhdWx0UGFuZXMuZGVidWdnZXJQYW5lJykpIHBhbmVzLnB1c2goZGVidWdnZXJQYW5lKVxuICBpZiAoYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZGVmYXVsdFBhbmVzLmxpbnRlcicpKSBwYW5lcy5wdXNoKGxpbnRlcilcbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLmRlZmF1bHRQYW5lcy5vdXRsaW5lJykpIHBhbmVzLnB1c2gob3V0bGluZSlcblxuICByZXR1cm4gcGFuZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlUHJvbWlzZXMgKCkge1xuICAvLyBDbG9zZSBvbmx5IHNwZWNpZmllZCBwYW5lcywgaS5lLjogbm9uLXNwZWNpZmllZCBwYW5lcyB3b24ndCBiZSBjbG9zZWQvb3BlbmVkXG4gIGNvbnN0IHBhbmVzID0gc3BlY2lmaWVkUGFuZXMoKVxuXG4gIGNvbnN0IHByb21pc2VzID0gcGFuZXMubWFwKHBhbmUgPT4ge1xuICAgIHJldHVybiBwYW5lKCkuY2xvc2UoKVxuICB9KVxuXG4gIHJldHVybiBwcm9taXNlc1xufVxuXG5mdW5jdGlvbiBidW5kbGVQYW5lcyAoKSB7XG4gIGNvbnN0IGNvbnRhaW5lcnMgPSBbXVxuICBjb250YWluZXJzLnB1c2goYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkpXG4gIGNvbnRhaW5lcnMucHVzaChhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpKVxuICBjb250YWluZXJzLnB1c2goYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpKVxuICBjb250YWluZXJzLnB1c2goYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkpXG5cbiAgY29udGFpbmVycy5mb3JFYWNoKGNvbnRhaW5lciA9PiB7XG4gICAgY29uc3QgcGFuZXMgPSBjb250YWluZXIuZ2V0UGFuZXMoKVxuICAgIGNvbnN0IGZpcnN0UGFuZSA9IHBhbmVzWzBdXG4gICAgY29uc3Qgb3RoZXJQYW5lcyA9IHBhbmVzLnNsaWNlKDEpXG4gICAgb3RoZXJQYW5lcy5mb3JFYWNoKHBhbmUgPT4ge1xuICAgICAgY29uc3QgaXRlbXMgPSBwYW5lLmdldEl0ZW1zKClcbiAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIHBhbmUubW92ZUl0ZW1Ub1BhbmUoaXRlbSwgZmlyc3RQYW5lKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBvcGVuUGFuZXMgKCkge1xuICBjb25zdCBwYW5lcyA9IHNwZWNpZmllZFBhbmVzKClcblxuICBvcGVuUGFuZXNIZWxwZXIocGFuZXMpXG59XG5cbmZ1bmN0aW9uIG9wZW5QYW5lc0hlbHBlciAocGFuZXMpIHtcbiAgaWYgKHBhbmVzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIG1vcmUgcGFuZSB0byBiZSBvcGVuZWQsIGFjdGl2YXRlIHRoZSBmaXJzdCBpdGVtIGluIGVhY2ggcGFuZS4gVGhpcyB3b3JrcyBzaW5jZVxuICAgIC8vIEp1bm8tcGFuZXMgYXJlIG9wZW5lZCBpbiBvcmRlciBvZiB0aGVpciBpbXBvcnRhbmNlIGFzIGRlZmluZWQgaW4gYHNwZWNpZmllZFBhbmVzYCBmdW5jdGlvblxuICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkuZm9yRWFjaChwYW5lID0+IHtcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtQXRJbmRleCgwKVxuICAgIH0pXG4gICAgLy8gQWN0aXZhdGUgYFdvcmtzcGFjZUNlbnRlcmAgYXQgbGFzdFxuICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmFjdGl2YXRlKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHBhbmUgPSBwYW5lcy5zaGlmdCgpXG4gIHBhbmUoKS5vcGVuKCkuY2F0Y2goKGVycikgPT4ge1xuICAgIC8vIEBGSVhNRTogVGhpcyBpcyBhIHRlbXBvcmFsIHJlbWVkeSBmb3IgaHR0cHM6Ly9naXRodWIuY29tL0p1bm9MYWIvYXRvbS1qdWxpYS1jbGllbnQvcHVsbC81NjEjaXNzdWVjb21tZW50LTUwMDE1MDMxOFxuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIHBhbmUoKS5vcGVuKClcbiAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgLy8gUmUtZm9jdXMgdGhlIHByZXZpb3VzbHkgZm9jdXNlZCBwYW5lIChpLmUuIHRoZSBidW5kbGVkIHBhbmUgYnkgYGJ1bmRsZVBhbmVzYCkgYWZ0ZXIgZWFjaCBvcGVuaW5nXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBvcGVuaW5nIG11bHRpcGxlIHBhbmVzIHdpdGggdGhlIHNhbWUgc3BsaXR0aW5nIHJ1bGUgaW4gYSBzYW1lIGxvY2F0aW9uIGZyb21cbiAgICAvLyBlbmRpbmcgdXAgaW4gYSBmdW5ueSBzdGF0ZVxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKVxuICAgIGNvbnRhaW5lci5hY3RpdmF0ZVByZXZpb3VzUGFuZSgpXG4gICAgb3BlblBhbmVzSGVscGVyKHBhbmVzKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZURlZmF1bHRMYXlvdXQgKCkge1xuICAvLyBDbG9zZSBKdW5vLXNwZWNpZmljIHBhbmVzIGZpcnN0IHRvIHJlc2V0IHRvIGRlZmF1bHQgbGF5b3V0XG4gIFByb21pc2UuYWxsKGNsb3NlUHJvbWlzZXMoKSkudGhlbigoKSA9PiB7XG5cbiAgICAvLyBTaW1wbGlmeSBsYXlvdXRzIGluIGVhY2ggY29udGFpbmVyIHRvIHByZXZlbnQgZnVubnkgc3BsaXR0aW5nXG4gICAgYnVuZGxlUGFuZXMoKVxuXG4gICAgLy8gT3BlbiBKdW5vLXNwZWNpZmljIHBhbmVzIGFnYWluXG4gICAgb3BlblBhbmVzKClcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGVmYXVsdExheW91dFNldHRpbmdzICgpIHtcbiAgY29uc3Qgb25TdGFydHVwID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMub3BlbkRlZmF1bHRQYW5lc09uU3RhcnRVcCcpXG4gIGF0b20uY29uZmlnLnVuc2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMnKVxuICBhdG9tLmNvbmZpZy5zZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5vcGVuRGVmYXVsdFBhbmVzT25TdGFydFVwJywgb25TdGFydHVwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlEZWZhdWx0TGF5b3V0ICgpIHtcbiAgY29uc3QgbWVzc2FnZSA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdKdWxpYS1DbGllbnQ6IE9wZW4gSnVuby1zcGVjaWZpYyBwYW5lcyBvbiBzdGFydHVwID8nLCB7XG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnWWVzJyxcbiAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgIHJlc3RvcmVEZWZhdWx0TGF5b3V0KClcbiAgICAgICAgICBtZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnanVsaWEtY2xpZW50LmZpcnN0Qm9vdCcsIGZhbHNlKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLm9wZW5EZWZhdWx0UGFuZXNPblN0YXJ0VXAnLCB0cnVlKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnTm8nLFxuICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgbWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2p1bGlhLWNsaWVudC5maXJzdEJvb3QnLCBmYWxzZSlcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5vcGVuRGVmYXVsdFBhbmVzT25TdGFydFVwJywgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdLFxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgYFlvdSBjYW4gc3BlY2lmeSB0aGUgcGFuZXMgdG8gYmUgb3BlbmVkIGFuZCB0aGVpciBfZGVmYXVsdCBsb2NhdGlvbl8gYW5kIF9zcGxpdHRpbmcgcnVsZV8gaW5cbiAgICAgICAqKlxcYFBhY2thZ2VzIC0+IEp1bm8gLT4gU2V0dGluZ3MgLT4gSnVsaWEtQ2xpZW50IC0+IFVJIE9wdGlvbnMgLT4gTGF5b3V0IE9wdGlvbnNcXGAqKi5cbiAgICAgICBcXGBKdWxpYS1DbGllbnQ6IFJlc3RvcmUtRGVmYXVsdC1MYXlvdXRcXGAgY29tbWFuZCB3aWxsIHJlc3RvcmUgdGhlIGxheW91dCBhdCBsYXRlciBwb2ludCBpbiB0aW1lLlxuICAgICAgIFVzZSBcXGBKdWxpYS1DbGllbnQ6IFJlc2V0LURlZmF1bHQtTGF5b3V0LVNldHRpbmdzXFxgIGNvbW1hbmQgdG8gcmVzZXQgdGhlIGxheW91dCBzZXR0aW5ncyBpZiBpdCBnZXRzIG1lc3NlZCB1cC5gLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gIH0pXG59XG4iXX0=