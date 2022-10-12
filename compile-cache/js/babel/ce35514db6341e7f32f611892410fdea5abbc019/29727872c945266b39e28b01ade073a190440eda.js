Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.open = open;
exports.ensureVisible = ensureVisible;
exports.close = close;
exports.processItem = processItem;
exports.processLinks = processLinks;
exports.showDocument = showDocument;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _connection = require('../connection');

var _runtimeGoto = require('../runtime/goto');

var _runtimeGoto2 = _interopRequireDefault(_runtimeGoto);

'use babel';

var views = require('./views');

var _client$import = _connection.client['import']({ rpc: ['searchdocs', 'gotosymbol', 'moduleinfo'], msg: ['regeneratedocs'] });

var searchDocs = _client$import.searchdocs;
var gotoSymbol = _client$import.gotosymbol;
var moduleInfo = _client$import.moduleinfo;
var regenerateDocs = _client$import.regeneratedocs;

var ink = undefined,
    subs = undefined,
    pane = undefined;

function activate(_ink) {
  ink = _ink;

  pane = ink.DocPane.fromId('Documentation');

  pane.search = function (text, mod, exportedOnly, allPackages, nameOnly) {
    _connection.client.boot();
    return new Promise(function (resolve) {
      searchDocs({ query: text, mod: mod, exportedOnly: exportedOnly, allPackages: allPackages, nameOnly: nameOnly }).then(function (res) {
        if (!res.error) {
          for (var i = 0; i < res.items.length; i += 1) {
            res.items[i].score = res.scores[i];
            res.items[i] = processItem(res.items[i]);
          }
          // erase module input if the actual searched module has been changed
          if (res.shoulderase) {
            pane.modEd.setText('');
          }
        }
        resolve(res);
      });
    });
  };

  pane.regenerateCache = function () {
    regenerateDocs();
  };

  subs = new _atom.CompositeDisposable();
  subs.add(atom.commands.add('atom-workspace', 'julia-client:open-documentation-browser', open));
  subs.add(atom.commands.add('atom-workspace', 'julia-client:regenerate-doc-cache', function () {
    regenerateDocs();
  }));
  subs.add(atom.config.observe('julia-client.uiOptions.layouts.documentation.defaultLocation', function (defaultLocation) {
    pane.setDefaultLocation(defaultLocation);
  }));
}

function open() {
  return pane.open({
    split: atom.config.get('julia-client.uiOptions.layouts.documentation.split')
  });
}

function ensureVisible() {
  return pane.ensureVisible({
    split: atom.config.get('julia-client.uiOptions.layouts.documentation.split')
  });
}

function close() {
  return pane.close();
}

function processItem(item) {
  item.html = views.render(item.html);

  processLinks(item.html.getElementsByTagName('a'));

  item.onClickName = function () {
    gotoSymbol({
      word: item.name,
      mod: item.mod
    }).then(function (results) {
      if (results.error) return;
      return _runtimeGoto2['default'].selectItemsAndGo(results.items);
    });
  };

  item.onClickModule = function () {
    moduleInfo({ mod: item.mod }).then(function (_ref) {
      var doc = _ref.doc;
      var items = _ref.items;

      items.map(function (x) {
        return processItem(x);
      });
      showDocument(views.render(doc), items);
    });
  };

  return item;
}

function processLinks(links) {
  var _loop = function (i) {
    var link = links[i];
    if (link.attributes['href'].value == '@ref') {
      links[i].onclick = function () {
        return pane.kwsearch(link.innerText);
      };
    }
  };

  for (var i = 0; i < links.length; i++) {
    _loop(i);
  }
}

function showDocument(view, items) {
  pane.showDocument(view, items);
}

function deactivate() {
  subs.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi91aS9kb2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOzswQkFDbkIsZUFBZTs7MkJBRXJCLGlCQUFpQjs7OztBQUxsQyxXQUFXLENBQUE7O0FBSVgsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBOztxQkFRNUIsNEJBQWEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxDQUFDOztJQUovRSxVQUFVLGtCQUF0QixVQUFVO0lBQ0UsVUFBVSxrQkFBdEIsVUFBVTtJQUNFLFVBQVUsa0JBQXRCLFVBQVU7SUFDTSxjQUFjLGtCQUE5QixjQUFjOztBQUdoQixJQUFJLEdBQUcsWUFBQTtJQUFFLElBQUksWUFBQTtJQUFFLElBQUksWUFBQSxDQUFBOztBQUVaLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUM3QixLQUFHLEdBQUcsSUFBSSxDQUFBOztBQUVWLE1BQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTs7QUFFMUMsTUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUs7QUFDaEUsdUJBQU8sSUFBSSxFQUFFLENBQUE7QUFDYixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLGdCQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLFFBQVEsRUFBUixRQUFR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YWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3VpL2RvY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGNsaWVudCB9IGZyb20gJy4uL2Nvbm5lY3Rpb24nXG5jb25zdCB2aWV3cyA9IHJlcXVpcmUoJy4vdmlld3MnKVxuaW1wb3J0IGdvdG8gZnJvbSAnLi4vcnVudGltZS9nb3RvJ1xuXG5jb25zdCB7XG4gIHNlYXJjaGRvY3M6IHNlYXJjaERvY3MsXG4gIGdvdG9zeW1ib2w6IGdvdG9TeW1ib2wsXG4gIG1vZHVsZWluZm86IG1vZHVsZUluZm8sXG4gIHJlZ2VuZXJhdGVkb2NzOiByZWdlbmVyYXRlRG9jc1xufSA9IGNsaWVudC5pbXBvcnQoe3JwYzogWydzZWFyY2hkb2NzJywgJ2dvdG9zeW1ib2wnLCAnbW9kdWxlaW5mbyddLCBtc2c6IFsncmVnZW5lcmF0ZWRvY3MnXX0pXG5cbmxldCBpbmssIHN1YnMsIHBhbmVcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKF9pbmspIHtcbiAgaW5rID0gX2lua1xuXG4gIHBhbmUgPSBpbmsuRG9jUGFuZS5mcm9tSWQoJ0RvY3VtZW50YXRpb24nKVxuXG4gIHBhbmUuc2VhcmNoID0gKHRleHQsIG1vZCwgZXhwb3J0ZWRPbmx5LCBhbGxQYWNrYWdlcywgbmFtZU9ubHkpID0+IHtcbiAgICBjbGllbnQuYm9vdCgpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBzZWFyY2hEb2NzKHtxdWVyeTogdGV4dCwgbW9kLCBleHBvcnRlZE9ubHksIGFsbFBhY2thZ2VzLCBuYW1lT25seX0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBpZiAoIXJlcy5lcnJvcikge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLml0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICByZXMuaXRlbXNbaV0uc2NvcmUgPSByZXMuc2NvcmVzW2ldXG4gICAgICAgICAgICByZXMuaXRlbXNbaV0gPSBwcm9jZXNzSXRlbShyZXMuaXRlbXNbaV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVyYXNlIG1vZHVsZSBpbnB1dCBpZiB0aGUgYWN0dWFsIHNlYXJjaGVkIG1vZHVsZSBoYXMgYmVlbiBjaGFuZ2VkXG4gICAgICAgICAgaWYgKHJlcy5zaG91bGRlcmFzZSkge1xuICAgICAgICAgICAgcGFuZS5tb2RFZC5zZXRUZXh0KCcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHJlcylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHBhbmUucmVnZW5lcmF0ZUNhY2hlID0gKCkgPT4ge1xuICAgIHJlZ2VuZXJhdGVEb2NzKClcbiAgfVxuXG4gIHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIHN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqdWxpYS1jbGllbnQ6b3Blbi1kb2N1bWVudGF0aW9uLWJyb3dzZXInLCBvcGVuKSlcbiAgc3Vicy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2p1bGlhLWNsaWVudDpyZWdlbmVyYXRlLWRvYy1jYWNoZScsICgpID0+IHtcbiAgICByZWdlbmVyYXRlRG9jcygpXG4gIH0pKVxuICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZG9jdW1lbnRhdGlvbi5kZWZhdWx0TG9jYXRpb24nLCAoZGVmYXVsdExvY2F0aW9uKSA9PiB7XG4gICAgcGFuZS5zZXREZWZhdWx0TG9jYXRpb24oZGVmYXVsdExvY2F0aW9uKVxuICB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW4gKCkge1xuICByZXR1cm4gcGFuZS5vcGVuKHtcbiAgICBzcGxpdDogYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmxheW91dHMuZG9jdW1lbnRhdGlvbi5zcGxpdCcpXG4gIH0pXG59XG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlVmlzaWJsZSAoKSB7XG4gIHJldHVybiBwYW5lLmVuc3VyZVZpc2libGUoe1xuICAgIHNwbGl0OiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC51aU9wdGlvbnMubGF5b3V0cy5kb2N1bWVudGF0aW9uLnNwbGl0JylcbiAgfSlcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZSAoKSB7XG4gIHJldHVybiBwYW5lLmNsb3NlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NJdGVtIChpdGVtKSB7XG4gIGl0ZW0uaHRtbCA9IHZpZXdzLnJlbmRlcihpdGVtLmh0bWwpXG5cbiAgcHJvY2Vzc0xpbmtzKGl0ZW0uaHRtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpKVxuXG4gIGl0ZW0ub25DbGlja05hbWUgPSAoKSA9PiB7XG4gICAgZ290b1N5bWJvbCh7XG4gICAgICB3b3JkOiBpdGVtLm5hbWUsXG4gICAgICBtb2Q6IGl0ZW0ubW9kXG4gICAgfSkudGhlbihyZXN1bHRzID0+IHtcbiAgICAgIGlmIChyZXN1bHRzLmVycm9yKSByZXR1cm5cbiAgICAgIHJldHVybiBnb3RvLnNlbGVjdEl0ZW1zQW5kR28ocmVzdWx0cy5pdGVtcylcbiAgICB9KVxuICB9XG5cbiAgaXRlbS5vbkNsaWNrTW9kdWxlID0gKCkgPT4ge1xuICAgIG1vZHVsZUluZm8oe21vZDogaXRlbS5tb2R9KS50aGVuKCh7ZG9jLCBpdGVtc30pID0+IHtcbiAgICAgIGl0ZW1zLm1hcCgoeCkgPT4gcHJvY2Vzc0l0ZW0oeCkpXG4gICAgICBzaG93RG9jdW1lbnQodmlld3MucmVuZGVyKGRvYyksIGl0ZW1zKVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gaXRlbVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0xpbmtzIChsaW5rcykge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbGluayA9IGxpbmtzW2ldXG4gICAgaWYgKGxpbmsuYXR0cmlidXRlc1snaHJlZiddLnZhbHVlID09ICdAcmVmJykge1xuICAgICAgbGlua3NbaV0ub25jbGljayA9ICgpID0+IHBhbmUua3dzZWFyY2gobGluay5pbm5lclRleHQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93RG9jdW1lbnQgKHZpZXcsIGl0ZW1zKSB7XG4gIHBhbmUuc2hvd0RvY3VtZW50KHZpZXcsIGl0ZW1zKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIHN1YnMuZGlzcG9zZSgpXG59XG4iXX0=