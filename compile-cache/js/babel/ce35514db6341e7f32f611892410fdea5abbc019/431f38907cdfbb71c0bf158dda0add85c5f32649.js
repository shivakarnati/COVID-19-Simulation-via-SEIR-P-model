Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.setItems = setItems;
exports.addItem = addItem;
exports.clearItems = clearItems;
exports.deactivate = deactivate;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pane = require('./pane');

var _pane2 = _interopRequireDefault(_pane);

var _compiledPane = require('./compiled-pane');

var _compiledPane2 = _interopRequireDefault(_compiledPane);

var _inline = require('./inline');

var LinterDecorations = _interopRequireWildcard(_inline);

'use babel';

var lintItems = [];
var lintPane;

exports.lintPane = lintPane;
exports.CompiledPane = _compiledPane2['default'];

function activate() {
  _pane2['default'].activate();
  _compiledPane2['default'].activate();
  LinterDecorations.activate();

  exports.lintPane = lintPane = _pane2['default'].fromId('default');
}

function setItems(items) {
  lintItems = items;
  lintPane.setItems(items);
  LinterDecorations.setItems(items);
}

function addItem(item) {
  lintItems.push(item);
  lintPane.addItem(item);
  LinterDecorations.addItem(item);
}

function clearItems(provider) {
  if (!provider) {
    lintItems = [];
    lintPane.setItems([]);
    LinterDecorations.setItems([]);
  } else {
    lintItems = lintItems.filter(function (i) {
      return i.provider == provider;
    });
    lintPane.setItems(lintItems);
    LinterDecorations.setItems(lintItems);
  }
}

function deactivate() {
  clearItems();
  _pane2['default'].deactivate();
  _compiledPane2['default'].deactivate();
  LinterDecorations.deactivate();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9saW50ZXIvbGludGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7b0JBRXVCLFFBQVE7Ozs7NEJBQ04saUJBQWlCOzs7O3NCQUNQLFVBQVU7O0lBQWpDLGlCQUFpQjs7QUFKN0IsV0FBVyxDQUFBOztBQU1YLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQTtBQUNYLElBQUksUUFBUSxDQUFBOzs7UUFFWCxZQUFZOztBQUViLFNBQVMsUUFBUSxHQUFJO0FBQzFCLG9CQUFXLFFBQVEsRUFBRSxDQUFBO0FBQ3JCLDRCQUFhLFFBQVEsRUFBRSxDQUFBO0FBQ3ZCLG1CQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFBOztBQUU1QixVQVRTLFFBQVEsR0FTakIsUUFBUSxHQUFHLGtCQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtDQUN4Qzs7QUFFTSxTQUFTLFFBQVEsQ0FBRSxLQUFLLEVBQUU7QUFDL0IsV0FBUyxHQUFHLEtBQUssQ0FBQTtBQUNqQixVQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3hCLG1CQUFpQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUNsQzs7QUFFTSxTQUFTLE9BQU8sQ0FBRSxJQUFJLEVBQUU7QUFDN0IsV0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNwQixVQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3RCLG1CQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtDQUNoQzs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxRQUFRLEVBQUU7QUFDcEMsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQVMsR0FBRyxFQUFFLENBQUE7QUFDZCxZQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3JCLHFCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUMvQixNQUFNO0FBQ0wsYUFBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRO0tBQUEsQ0FBQyxDQUFBO0FBQ3pELFlBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDNUIscUJBQWlCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBQ3RDO0NBQ0Y7O0FBRU0sU0FBUyxVQUFVLEdBQUk7QUFDNUIsWUFBVSxFQUFFLENBQUE7QUFDWixvQkFBVyxVQUFVLEVBQUUsQ0FBQTtBQUN2Qiw0QkFBYSxVQUFVLEVBQUUsQ0FBQTtBQUN6QixtQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtDQUMvQiIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvbGludGVyL2xpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBMaW50ZXJQYW5lIGZyb20gJy4vcGFuZSdcbmltcG9ydCBDb21waWxlZFBhbmUgZnJvbSAnLi9jb21waWxlZC1wYW5lJ1xuaW1wb3J0ICogYXMgTGludGVyRGVjb3JhdGlvbnMgZnJvbSAnLi9pbmxpbmUnXG5cbnZhciBsaW50SXRlbXMgPSBbXVxuZXhwb3J0IHZhciBsaW50UGFuZVxuXG5leHBvcnQge0NvbXBpbGVkUGFuZX1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlICgpIHtcbiAgTGludGVyUGFuZS5hY3RpdmF0ZSgpXG4gIENvbXBpbGVkUGFuZS5hY3RpdmF0ZSgpXG4gIExpbnRlckRlY29yYXRpb25zLmFjdGl2YXRlKClcblxuICBsaW50UGFuZSA9IExpbnRlclBhbmUuZnJvbUlkKCdkZWZhdWx0Jylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEl0ZW1zIChpdGVtcykge1xuICBsaW50SXRlbXMgPSBpdGVtc1xuICBsaW50UGFuZS5zZXRJdGVtcyhpdGVtcylcbiAgTGludGVyRGVjb3JhdGlvbnMuc2V0SXRlbXMoaXRlbXMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRJdGVtIChpdGVtKSB7XG4gIGxpbnRJdGVtcy5wdXNoKGl0ZW0pXG4gIGxpbnRQYW5lLmFkZEl0ZW0oaXRlbSlcbiAgTGludGVyRGVjb3JhdGlvbnMuYWRkSXRlbShpdGVtKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJJdGVtcyAocHJvdmlkZXIpIHtcbiAgaWYgKCFwcm92aWRlcikge1xuICAgIGxpbnRJdGVtcyA9IFtdXG4gICAgbGludFBhbmUuc2V0SXRlbXMoW10pXG4gICAgTGludGVyRGVjb3JhdGlvbnMuc2V0SXRlbXMoW10pXG4gIH0gZWxzZSB7XG4gICAgbGludEl0ZW1zID0gbGludEl0ZW1zLmZpbHRlcihpID0+IGkucHJvdmlkZXIgPT0gcHJvdmlkZXIpXG4gICAgbGludFBhbmUuc2V0SXRlbXMobGludEl0ZW1zKVxuICAgIExpbnRlckRlY29yYXRpb25zLnNldEl0ZW1zKGxpbnRJdGVtcylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIGNsZWFySXRlbXMoKVxuICBMaW50ZXJQYW5lLmRlYWN0aXZhdGUoKVxuICBDb21waWxlZFBhbmUuZGVhY3RpdmF0ZSgpXG4gIExpbnRlckRlY29yYXRpb25zLmRlYWN0aXZhdGUoKVxufVxuIl19