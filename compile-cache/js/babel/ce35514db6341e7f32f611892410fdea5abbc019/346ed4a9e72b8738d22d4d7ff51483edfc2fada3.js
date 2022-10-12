Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = handleURI;

var _connection = require('../connection');

var _ui = require('../ui');

"use babel";

var _client$import = _connection.client['import']({ rpc: ['moduleinfo'] });

var moduleinfo = _client$import.moduleinfo;

var docs = _connection.client['import']('docs');

function handleURI(parsedURI) {
  var query = parsedURI.query;

  if (query.open) {
    // open a file
    atom.workspace.open(query.file, {
      initialLine: Number(query.line),
      pending: atom.config.get('core.allowPendingPaneItems')
    });
  } else if (query.docs) {
    // show docs
    var word = query.word;
    var mod = query.mod;

    docs({ word: word, mod: mod }).then(function (result) {
      if (result.error) return;
      var view = _ui.views.render(result);
      _ui.docpane.processLinks(view.getElementsByTagName('a'));
      _ui.docpane.ensureVisible();
      _ui.docpane.showDocument(view, []);
    })['catch'](function (err) {
      console.log(err);
    });
  } else if (query.moduleinfo) {
    // show module info
    var mod = query.mod;

    moduleinfo({ mod: mod }).then(function (_ref) {
      var doc = _ref.doc;
      var items = _ref.items;

      items.map(function (item) {
        _ui.docpane.processItem(item);
      });
      var view = _ui.views.render(doc);
      _ui.docpane.ensureVisible();
      _ui.docpane.showDocument(view, items);
    })['catch'](function (err) {
      console.log(err);
    });
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9ydW50aW1lL3VyaWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQVF3QixTQUFTOzswQkFOVixlQUFlOztrQkFDUCxPQUFPOztBQUh0QyxXQUFXLENBQUE7O3FCQUtZLDRCQUFhLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDOztJQUFyRCxVQUFVLGtCQUFWLFVBQVU7O0FBQ2xCLElBQU0sSUFBSSxHQUFHLDRCQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRW5CLFNBQVMsU0FBUyxDQUFFLFNBQVMsRUFBRTtNQUNwQyxLQUFLLEdBQUssU0FBUyxDQUFuQixLQUFLOztBQUViLE1BQUksS0FBSyxDQUFDLElBQUksRUFBRTs7QUFDZCxRQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQzlCLGlCQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDL0IsYUFBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO0tBQ3ZELENBQUMsQ0FBQTtHQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFOztRQUNiLElBQUksR0FBVSxLQUFLLENBQW5CLElBQUk7UUFBRSxHQUFHLEdBQUssS0FBSyxDQUFiLEdBQUc7O0FBQ2pCLFFBQUksQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2pDLFVBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFNO0FBQ3hCLFVBQU0sSUFBSSxHQUFHLFVBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pDLGtCQUFRLFlBQVksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNwRCxrQkFBUSxhQUFhLEVBQUUsQ0FBQTtBQUN2QixrQkFBUSxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQy9CLENBQUMsU0FBTSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNqQixDQUFDLENBQUE7R0FDSCxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBQzs7UUFDbEIsR0FBRyxHQUFLLEtBQUssQ0FBYixHQUFHOztBQUNYLGNBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQWMsRUFBSztVQUFqQixHQUFHLEdBQUwsSUFBYyxDQUFaLEdBQUc7VUFBRSxLQUFLLEdBQVosSUFBYyxDQUFQLEtBQUs7O0FBQ3BDLFdBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDaEIsb0JBQVEsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzFCLENBQUMsQ0FBQTtBQUNGLFVBQU0sSUFBSSxHQUFHLFVBQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzlCLGtCQUFRLGFBQWEsRUFBRSxDQUFBO0FBQ3ZCLGtCQUFRLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDbEMsQ0FBQyxTQUFNLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ2pCLENBQUMsQ0FBQTtHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3J1bnRpbWUvdXJpaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcblxuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbidcbmltcG9ydCB7IGRvY3BhbmUsIHZpZXdzIH0gZnJvbSAnLi4vdWknXG5cbmNvbnN0IHsgbW9kdWxlaW5mbyB9ID0gY2xpZW50LmltcG9ydCh7IHJwYzogWydtb2R1bGVpbmZvJ10gfSlcbmNvbnN0IGRvY3MgPSBjbGllbnQuaW1wb3J0KCdkb2NzJylcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlVVJJIChwYXJzZWRVUkkpIHtcbiAgY29uc3QgeyBxdWVyeSB9ID0gcGFyc2VkVVJJXG5cbiAgaWYgKHF1ZXJ5Lm9wZW4pIHsgLy8gb3BlbiBhIGZpbGVcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHF1ZXJ5LmZpbGUsIHtcbiAgICAgIGluaXRpYWxMaW5lOiBOdW1iZXIocXVlcnkubGluZSksXG4gICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJylcbiAgICB9KVxuICB9IGVsc2UgaWYgKHF1ZXJ5LmRvY3MpIHsgLy8gc2hvdyBkb2NzXG4gICAgY29uc3QgeyB3b3JkLCBtb2QgfSA9IHF1ZXJ5XG4gICAgZG9jcyh7IHdvcmQsIG1vZCB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSByZXR1cm5cbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3cy5yZW5kZXIocmVzdWx0KVxuICAgICAgZG9jcGFuZS5wcm9jZXNzTGlua3Modmlldy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpKVxuICAgICAgZG9jcGFuZS5lbnN1cmVWaXNpYmxlKClcbiAgICAgIGRvY3BhbmUuc2hvd0RvY3VtZW50KHZpZXcsIFtdKVxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChxdWVyeS5tb2R1bGVpbmZvKXsgLy8gc2hvdyBtb2R1bGUgaW5mb1xuICAgIGNvbnN0IHsgbW9kIH0gPSBxdWVyeVxuICAgIG1vZHVsZWluZm8oeyBtb2QgfSkudGhlbigoeyBkb2MsIGl0ZW1zIH0pID0+IHtcbiAgICAgIGl0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgICAgZG9jcGFuZS5wcm9jZXNzSXRlbShpdGVtKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3cy5yZW5kZXIoZG9jKVxuICAgICAgZG9jcGFuZS5lbnN1cmVWaXNpYmxlKClcbiAgICAgIGRvY3BhbmUuc2hvd0RvY3VtZW50KHZpZXcsIGl0ZW1zKVxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSlcbiAgfVxufVxuIl19