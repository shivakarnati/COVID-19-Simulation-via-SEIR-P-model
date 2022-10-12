Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _uiSelector = require('../ui/selector');

var _miscPaths = require('../misc/paths');

var subs = undefined;
var RELEASE_NOTE_DIR = _path2['default'].join(__dirname, '..', '..', 'release-notes');

function activate(ink, startupNoteVersion) {
  var pane = ink.NotePane.fromId('Note');
  subs = new _atom.CompositeDisposable();

  var showNote = function showNote(version) {
    var p = _path2['default'].join(RELEASE_NOTE_DIR, version + '.md');
    var markdown = (0, _miscPaths.readCode)(p);
    pane.setNote(markdown);
    pane.setTitle('Juno release note – v' + version);
    pane.ensureVisible({
      split: 'right'
    });
  };

  subs.add(atom.commands.add('atom-workspace', 'julia-client:open-release-note', function () {
    var versions = _fs2['default'].readdirSync(RELEASE_NOTE_DIR).filter(function (path) {
      return path !== 'README.md';
    }).map(function (path) {
      return path.replace(/(.+)\.md/, 'v $1');
    });
    (0, _uiSelector.show)(versions).then(function (version) {
      return showNote(version.replace(/v\s(.+)/, '$1'));
    })['catch'](function (err) {
      return console.log(err);
    });
  }));
  if (startupNoteVersion) showNote(startupNoteVersion);
}

function deactivate() {
  if (subs) subs.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9wYWNrYWdlL3JlbGVhc2Utbm90ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVnRCxNQUFNOztvQkFDckMsTUFBTTs7OztrQkFDUixJQUFJOzs7OzBCQUNFLGdCQUFnQjs7eUJBQ1osZUFBZTs7QUFFeEMsSUFBSSxJQUFJLFlBQUEsQ0FBQTtBQUNSLElBQU0sZ0JBQWdCLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFBOztBQUVuRSxTQUFTLFFBQVEsQ0FBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7QUFDakQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDeEMsTUFBSSxHQUFHLCtCQUF5QixDQUFBOztBQUVoQyxNQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxPQUFPLEVBQUs7QUFDNUIsUUFBTSxDQUFDLEdBQUcsa0JBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQTtBQUN0RCxRQUFNLFFBQVEsR0FBRyx5QkFBUyxDQUFDLENBQUMsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLDJCQUF5QixPQUFPLENBQUcsQ0FBQTtBQUNoRCxRQUFJLENBQUMsYUFBYSxDQUFDO0FBQ2pCLFdBQUssRUFBRSxPQUFPO0tBQ2YsQ0FBQyxDQUFBO0dBQ0gsQ0FBQTs7QUFFRCxNQUFJLENBQUMsR0FBRyxDQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGdDQUFnQyxFQUFFLFlBQU07QUFDMUUsUUFBTSxRQUFRLEdBQUcsZ0JBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQzlDLE1BQU0sQ0FBQyxVQUFBLElBQUk7YUFBSSxJQUFJLEtBQUssV0FBVztLQUFBLENBQUMsQ0FDcEMsR0FBRyxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUNoRCwwQkFBSyxRQUFRLENBQUMsQ0FDWCxJQUFJLENBQUMsVUFBQSxPQUFPO2FBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQUEsQ0FBQyxTQUN0RCxDQUFDLFVBQUEsR0FBRzthQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FDSCxDQUFBO0FBQ0QsTUFBSSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtDQUNyRDs7QUFFTSxTQUFTLFVBQVUsR0FBSTtBQUM1QixNQUFJLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7Q0FDekIiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3BhY2thZ2UvcmVsZWFzZS1ub3RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBzaG93IH0gZnJvbSAnLi4vdWkvc2VsZWN0b3InXG5pbXBvcnQgeyByZWFkQ29kZSB9IGZyb20gJy4uL21pc2MvcGF0aHMnXG5cbmxldCBzdWJzXG5jb25zdCBSRUxFQVNFX05PVEVfRElSID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ3JlbGVhc2Utbm90ZXMnKVxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKGluaywgc3RhcnR1cE5vdGVWZXJzaW9uKSB7XG4gIGNvbnN0IHBhbmUgPSBpbmsuTm90ZVBhbmUuZnJvbUlkKCdOb3RlJylcbiAgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdCBzaG93Tm90ZSA9ICh2ZXJzaW9uKSA9PiB7XG4gICAgY29uc3QgcCA9IHBhdGguam9pbihSRUxFQVNFX05PVEVfRElSLCB2ZXJzaW9uICsgJy5tZCcpXG4gICAgY29uc3QgbWFya2Rvd24gPSByZWFkQ29kZShwKVxuICAgIHBhbmUuc2V0Tm90ZShtYXJrZG93bilcbiAgICBwYW5lLnNldFRpdGxlKGBKdW5vIHJlbGVhc2Ugbm90ZSDigJMgdiR7dmVyc2lvbn1gKVxuICAgIHBhbmUuZW5zdXJlVmlzaWJsZSh7XG4gICAgICBzcGxpdDogJ3JpZ2h0J1xuICAgIH0pXG4gIH1cblxuICBzdWJzLmFkZChcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnanVsaWEtY2xpZW50Om9wZW4tcmVsZWFzZS1ub3RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmVyc2lvbnMgPSBmcy5yZWFkZGlyU3luYyhSRUxFQVNFX05PVEVfRElSKVxuICAgICAgICAuZmlsdGVyKHBhdGggPT4gcGF0aCAhPT0gJ1JFQURNRS5tZCcpXG4gICAgICAgIC5tYXAocGF0aCA9PiBwYXRoLnJlcGxhY2UoLyguKylcXC5tZC8sICd2ICQxJykpXG4gICAgICBzaG93KHZlcnNpb25zKVxuICAgICAgICAudGhlbih2ZXJzaW9uID0+IHNob3dOb3RlKHZlcnNpb24ucmVwbGFjZSgvdlxccyguKykvLCAnJDEnKSkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICB9KVxuICApXG4gIGlmIChzdGFydHVwTm90ZVZlcnNpb24pIHNob3dOb3RlKHN0YXJ0dXBOb3RlVmVyc2lvbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBpZiAoc3Vicykgc3Vicy5kaXNwb3NlKClcbn1cbiJdfQ==