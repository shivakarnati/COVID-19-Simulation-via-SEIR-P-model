Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
/** @babel */

var _connection = require('../connection');

var _ui = require('../ui');

var _misc = require('../misc');

function activate(ink) {
  _connection.client.handle({
    select: function select(items) {
      return _ui.selector.show(items);
    },
    input: function input() {
      return _ui.selector.show([], { allowCustom: true });
    },
    syntaxcolors: function syntaxcolors(selectors) {
      return _misc.colors.getColors(selectors);
    },
    openFile: function openFile(file, line) {
      ink.Opener.open(file, line, {
        pending: atom.config.get('core.allowPendingPaneItems')
      });
    },
    versionwarning: function versionwarning(msg) {
      atom.notifications.addWarning("Outdated version of Atom.jl detected.", {
        description: msg,
        dismissable: true
      });
    },
    notify: function notify(msg) {
      return _ui.notifications.show(msg, true);
    },
    notification: function notification(message) {
      var kind = arguments.length <= 1 || arguments[1] === undefined ? 'Info' : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      try {
        atom.notifications['add' + kind](message, options);
      } catch (err) {
        console.log(err);
      }
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2Zyb250ZW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFdUIsZUFBZTs7a0JBQ0UsT0FBTzs7b0JBQ3hCLFNBQVM7O0FBRXpCLFNBQVMsUUFBUSxDQUFFLEdBQUcsRUFBRTtBQUM3QixxQkFBTyxNQUFNLENBQUM7QUFDWixVQUFNLEVBQUUsZ0JBQUMsS0FBSzthQUFLLGFBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUFBO0FBQ3ZDLFNBQUssRUFBRTthQUFNLGFBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUFBO0FBQ3JELGdCQUFZLEVBQUUsc0JBQUMsU0FBUzthQUFLLGFBQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQztLQUFBO0FBQ3hELFlBQVEsRUFBRSxrQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQ3hCLFNBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDMUIsZUFBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO09BQ3ZELENBQUMsQ0FBQTtLQUNIO0FBQ0Qsa0JBQWMsRUFBRSx3QkFBQyxHQUFHLEVBQUs7QUFDdkIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsdUNBQXVDLEVBQUU7QUFDckUsbUJBQVcsRUFBRSxHQUFHO0FBQ2hCLG1CQUFXLEVBQUUsSUFBSTtPQUNsQixDQUFDLENBQUE7S0FDSDtBQUNELFVBQU0sRUFBRSxnQkFBQyxHQUFHO2FBQUssa0JBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FBQTtBQUM5QyxnQkFBWSxFQUFFLHNCQUFDLE9BQU8sRUFBa0M7VUFBaEMsSUFBSSx5REFBRyxNQUFNO1VBQUUsT0FBTyx5REFBRyxFQUFFOztBQUNqRCxVQUFJO0FBQ0YsWUFBSSxDQUFDLGFBQWEsU0FBTyxJQUFJLENBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7T0FDbkQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLGVBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7T0FDakI7S0FDRjtHQUNGLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL2Zyb250ZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uJ1xuaW1wb3J0IHsgc2VsZWN0b3IsIG5vdGlmaWNhdGlvbnMgfSBmcm9tICcuLi91aSdcbmltcG9ydCB7IGNvbG9ycyB9IGZyb20gJy4uL21pc2MnXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSAoaW5rKSB7XG4gIGNsaWVudC5oYW5kbGUoe1xuICAgIHNlbGVjdDogKGl0ZW1zKSA9PiBzZWxlY3Rvci5zaG93KGl0ZW1zKSxcbiAgICBpbnB1dDogKCkgPT4gc2VsZWN0b3Iuc2hvdyhbXSwgeyBhbGxvd0N1c3RvbTogdHJ1ZSB9KSxcbiAgICBzeW50YXhjb2xvcnM6IChzZWxlY3RvcnMpID0+IGNvbG9ycy5nZXRDb2xvcnMoc2VsZWN0b3JzKSxcbiAgICBvcGVuRmlsZTogKGZpbGUsIGxpbmUpID0+IHtcbiAgICAgIGluay5PcGVuZXIub3BlbihmaWxlLCBsaW5lLCB7XG4gICAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHZlcnNpb253YXJuaW5nOiAobXNnKSA9PiB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcIk91dGRhdGVkIHZlcnNpb24gb2YgQXRvbS5qbCBkZXRlY3RlZC5cIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogbXNnLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9LFxuICAgIG5vdGlmeTogKG1zZykgPT4gbm90aWZpY2F0aW9ucy5zaG93KG1zZywgdHJ1ZSksXG4gICAgbm90aWZpY2F0aW9uOiAobWVzc2FnZSwga2luZCA9ICdJbmZvJywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnNbYGFkZCR7a2luZH1gXShtZXNzYWdlLCBvcHRpb25zKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG4iXX0=