Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _atom = require('atom');

var _utilPaneItem = require('../util/pane-item');

var _utilPaneItem2 = _interopRequireDefault(_utilPaneItem);

var _utilEtch = require('../util/etch');

'use babel';
var DocPane = (function (_PaneItem) {
  _inherits(DocPane, _PaneItem);

  function DocPane() {
    var _this = this;

    _classCallCheck(this, DocPane);

    _get(Object.getPrototypeOf(DocPane.prototype), 'constructor', this).call(this);

    this.setTitle('Documentation');
    this.content = [];
    this.items = [];
    this.mode = 'empty';
    this.exportedOnly = false;
    this.allPackages = false;
    this.namesOnly = false;
    this.searchEd = new _atom.TextEditor({ mini: true, placeholderText: "Search Documentation" });
    this.modEd = new _atom.TextEditor({ mini: true, placeholderText: "in all modules" });

    this.subs = new _atom.CompositeDisposable();
    this.subs.add(atom.commands.add('.docpane .header .editor', {
      'docpane:search': function docpaneSearch() {
        return _this._search();
      }
    }));

    _etch2['default'].initialize(this);
    this.element.setAttribute('tabindex', -1);
  }

  _createClass(DocPane, [{
    key: 'open',
    value: function open(opts) {
      return _get(Object.getPrototypeOf(DocPane.prototype), 'open', this).call(this, opts).then(function (docPane) {
        docPane.searchEd.getElement().focus();
      });
    }
  }, {
    key: '_search',
    value: function _search() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? this.searchEd.getText() : arguments[0];
      var mod = arguments.length <= 1 || arguments[1] === undefined ? this.modEd.getText() : arguments[1];
      var eo = arguments.length <= 2 || arguments[2] === undefined ? this.exportedOnly : arguments[2];

      var _this2 = this;

      var ap = arguments.length <= 3 || arguments[3] === undefined ? this.allPackages : arguments[3];
      var np = arguments.length <= 4 || arguments[4] === undefined ? this.namesOnly : arguments[4];

      this.setContent('loading');
      this.search(query, mod || "Main", eo, ap, np).then(function (res) {
        if (res.error) {
          _this2.setContent('error', { content: res.errmsg });
        } else {
          _this2.setContent('search', { items: res.items });
        }
      });
    }
  }, {
    key: 'search',
    value: function search() {
      console.error('`search` must be overwritten with something useful');
    }
  }, {
    key: 'regenerateCache',
    value: function regenerateCache() {
      console.error('`regenerateCache` must be overwritten with something useful');
    }

    // search for query without changing any other options
  }, {
    key: 'kwsearch',
    value: function kwsearch(query) {
      this.searchEd.setText(query);
      this._search(query);
    }
  }, {
    key: 'showDocument',
    value: function showDocument(doc, items) {
      this.setContent('document', { content: doc, items: items });
    }
  }, {
    key: 'setContent',
    value: function setContent(mode) {
      var obj = arguments.length <= 1 || arguments[1] === undefined ? { content: [], items: [] } : arguments[1];

      this.mode = mode;
      this.content = obj.content;
      this.items = obj.items;
      _etch2['default'].update(this);
    }
  }, {
    key: 'toggleExported',
    value: function toggleExported() {
      this.exportedOnly = !this.exportedOnly;
      this.refs.toggleExported.element.classList.toggle("selected");
    }
  }, {
    key: 'toggleAllLoaded',
    value: function toggleAllLoaded() {
      this.allPackages = !this.allPackages;
      this.refs.toggleLoaded.element.classList.toggle("selected");
    }
  }, {
    key: 'toggleLocation',
    value: function toggleLocation() {
      this.namesOnly = !this.namesOnly;
      this.refs.toggleLocation.element.classList.toggle("selected");
    }
  }, {
    key: 'toggleOptions',
    value: function toggleOptions() {
      this.refs.headerOptions.classList.toggle('hidden');
      this.refs.options.element.classList.toggle("selected");
    }
  }, {
    key: 'headerView',
    value: function headerView() {
      var _this3 = this;

      return _etch2['default'].dom(
        'div',
        { className: 'header' },
        _etch2['default'].dom(
          'span',
          { className: 'header-main' },
          _etch2['default'].dom(
            'span',
            { className: 'search-editor' },
            (0, _utilEtch.toView)(this.searchEd.element)
          ),
          _etch2['default'].dom(
            'span',
            { className: 'btn-group search-button' },
            _etch2['default'].dom(_utilEtch.Button, { alt: 'Search documentation', icon: 'search', onclick: function () {
                return _this3._search();
              } })
          ),
          _etch2['default'].dom(
            'span',
            { className: 'btn-group options-button' },
            _etch2['default'].dom(_utilEtch.Button, { alt: 'Show search options', ref: 'options', icon: 'three-bars', onclick: function () {
                return _this3.toggleOptions();
              } })
          )
        ),
        _etch2['default'].dom(
          'span',
          { ref: 'headerOptions', className: 'header-options hidden' },
          _etch2['default'].dom(
            'span',
            { className: 'module-editor' },
            (0, _utilEtch.toView)(this.modEd.element)
          ),
          _etch2['default'].dom(
            'span',
            { className: 'options-btngroup' },
            _etch2['default'].dom(
              'div',
              { className: 'btn-group' },
              _etch2['default'].dom(
                _utilEtch.Button,
                { ref: 'toggleLocation', alt: 'Search in variable names only', onclick: function () {
                    return _this3.toggleLocation();
                  } },
                'names'
              ),
              _etch2['default'].dom(
                _utilEtch.Button,
                { ref: 'toggleExported', alt: 'Search in exported variables only', onclick: function () {
                    return _this3.toggleExported();
                  } },
                'exported'
              ),
              _etch2['default'].dom(
                _utilEtch.Button,
                { ref: 'toggleLoaded', alt: 'Search in loaded modules only', icon: 'foo selected', onclick: function () {
                    return _this3.toggleAllLoaded();
                  } },
                'loaded'
              ),
              _etch2['default'].dom(_utilEtch.Button, { alt: 'Regenerate documentation cache', icon: 'repo-sync', onclick: function () {
                  return _this3.regenerateCache();
                } })
            )
          )
        )
      );
    }
  }, {
    key: 'contentView',
    value: function contentView() {
      var content = undefined;
      switch (this.mode) {
        case 'loading':
          content = _etch2['default'].dom(
            'div',
            { className: 'content' },
            _etch2['default'].dom('span', { className: 'loading loading-spinner-large' })
          );
          break;
        case 'search':
          content = _etch2['default'].dom(
            'div',
            { className: 'content' },
            this.items.map(function (item) {
              return (0, _utilEtch.toView)(new DocItem({ item: item }));
            })
          );
          break;
        case 'document':
          content = _etch2['default'].dom(
            'div',
            { className: 'content' },
            (0, _utilEtch.toView)(this.content),
            this.items.map(function (item) {
              return (0, _utilEtch.toView)(new DocItem({ item: item }));
            })
          );
          break;
        case 'error':
          content = _etch2['default'].dom(
            'div',
            { className: 'content' },
            (0, _utilEtch.toView)(this.content)
          );
          break;
        default:
          content = _etch2['default'].dom('div', null);
      }
      return content;
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'ink docpane' },
        this.headerView(),
        this.contentView()
      );
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'info';
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subs.dispose();
      this.subs = null;
    }
  }]);

  return DocPane;
})(_utilPaneItem2['default']);

exports['default'] = DocPane;

var DocItem = (function (_Etch) {
  _inherits(DocItem, _Etch);

  function DocItem() {
    _classCallCheck(this, DocItem);

    _get(Object.getPrototypeOf(DocItem.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocItem, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _etch2['default'].dom(
        'div',
        { className: 'item' },
        _etch2['default'].dom(
          'div',
          { className: 'item-header' },
          _etch2['default'].dom(
            'span',
            { className: 'typ', title: this.props.item.nativetype },
            _etch2['default'].dom(
              'span',
              { className: 'icon ' + this.props.item.typ },
              (0, _utilEtch.makeIcon)(this.props.item.icon)
            )
          ),
          _etch2['default'].dom(
            'span',
            { className: 'name', onclick: this.props.item.onClickName },
            this.props.item.name
          ),
          _etch2['default'].dom('span', {
            className: 'exported icon icon-eye ' + (this.props.item.exported ? "is-exported" : ""),
            title: this.props.item.exported ? "exported" : "not exported"
          }),
          _etch2['default'].dom(
            'span',
            { className: 'module', onclick: this.props.item.onClickModule },
            this.props.item.mod
          )
        ),
        _etch2['default'].dom(
          'div',
          { ref: 'itemBody', className: 'item-body collapsed' },
          _etch2['default'].dom(
            'div',
            { className: 'docs' },
            (0, _utilEtch.toView)(this.props.item.html)
          ),
          _etch2['default'].dom(
            'span',
            { className: 'expander', onclick: function () {
                return _this4.expand();
              } },
            '...'
          )
        )
      );
    }
  }, {
    key: 'expand',
    value: function expand() {
      this.refs.itemBody.classList.toggle('collapsed');
    }
  }]);

  return DocItem;
})(_utilEtch.Etch);

DocPane.registerView();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kb2NzL2RvY3BhbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztvQkFFeUIsTUFBTTs7NEJBQ2pDLG1CQUFtQjs7Ozt3QkFDc0IsY0FBYzs7QUFQNUUsV0FBVyxDQUFBO0lBU1UsT0FBTztZQUFQLE9BQU87O0FBQ2QsV0FETyxPQUFPLEdBQ1g7OzswQkFESSxPQUFPOztBQUV4QiwrQkFGaUIsT0FBTyw2Q0FFakI7O0FBRVAsUUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM5QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNmLFFBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFBO0FBQ25CLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcscUJBQWUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsRUFBQyxDQUFDLENBQUE7QUFDckYsUUFBSSxDQUFDLEtBQUssR0FBRyxxQkFBZSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQTs7QUFFNUUsUUFBSSxDQUFDLElBQUksR0FBRywrQkFBeUIsQ0FBQTtBQUNyQyxRQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRTtBQUMxRCxzQkFBZ0IsRUFBRTtlQUFNLE1BQUssT0FBTyxFQUFFO09BQUE7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RyxPQUFPOzs7QUEyQmIsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFBIiwiZmlsZSI6Ii9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kb2NzL2RvY3BhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuaW1wb3J0IHsgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgUGFuZUl0ZW0gZnJvbSAnLi4vdXRpbC9wYW5lLWl0ZW0nXG5pbXBvcnQgeyB0b1ZpZXcsIFRvb2xiYXIsIEJ1dHRvbiwgSWNvbiwgbWFrZUljb24sIEV0Y2ggfSBmcm9tICcuLi91dGlsL2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY1BhbmUgZXh0ZW5kcyBQYW5lSXRlbSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLnNldFRpdGxlKCdEb2N1bWVudGF0aW9uJylcbiAgICB0aGlzLmNvbnRlbnQgPSBbXVxuICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgIHRoaXMubW9kZSA9ICdlbXB0eSdcbiAgICB0aGlzLmV4cG9ydGVkT25seSA9IGZhbHNlXG4gICAgdGhpcy5hbGxQYWNrYWdlcyA9IGZhbHNlXG4gICAgdGhpcy5uYW1lc09ubHkgPSBmYWxzZVxuICAgIHRoaXMuc2VhcmNoRWQgPSBuZXcgVGV4dEVkaXRvcih7bWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIlNlYXJjaCBEb2N1bWVudGF0aW9uXCJ9KVxuICAgIHRoaXMubW9kRWQgPSBuZXcgVGV4dEVkaXRvcih7bWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcImluIGFsbCBtb2R1bGVzXCJ9KVxuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vicy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJy5kb2NwYW5lIC5oZWFkZXIgLmVkaXRvcicsIHtcbiAgICAgICdkb2NwYW5lOnNlYXJjaCc6ICgpID0+IHRoaXMuX3NlYXJjaCgpXG4gICAgfSkpXG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKVxuICB9XG5cbiAgb3BlbihvcHRzKSB7XG4gICAgcmV0dXJuIHN1cGVyLm9wZW4ob3B0cykudGhlbihkb2NQYW5lID0+IHtcbiAgICAgIGRvY1BhbmUuc2VhcmNoRWQuZ2V0RWxlbWVudCgpLmZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgX3NlYXJjaCAocXVlcnkgPSB0aGlzLnNlYXJjaEVkLmdldFRleHQoKSwgbW9kID0gdGhpcy5tb2RFZC5nZXRUZXh0KCksXG4gICAgICAgICAgIGVvID0gdGhpcy5leHBvcnRlZE9ubHksIGFwID0gdGhpcy5hbGxQYWNrYWdlcywgbnAgPSB0aGlzLm5hbWVzT25seSkge1xuICAgIHRoaXMuc2V0Q29udGVudCgnbG9hZGluZycpXG4gICAgdGhpcy5zZWFyY2gocXVlcnksIG1vZCB8fCBcIk1haW5cIiwgZW8sIGFwLCBucClcbiAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgaWYgKHJlcy5lcnJvcikge1xuICAgICAgICAgIHRoaXMuc2V0Q29udGVudCgnZXJyb3InLCB7Y29udGVudDogcmVzLmVycm1zZ30pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRDb250ZW50KCdzZWFyY2gnLCB7aXRlbXM6IHJlcy5pdGVtc30pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICBzZWFyY2ggKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2BzZWFyY2hgIG11c3QgYmUgb3ZlcndyaXR0ZW4gd2l0aCBzb21ldGhpbmcgdXNlZnVsJylcbiAgfVxuXG4gIHJlZ2VuZXJhdGVDYWNoZSAoKSB7XG4gICAgY29uc29sZS5lcnJvcignYHJlZ2VuZXJhdGVDYWNoZWAgbXVzdCBiZSBvdmVyd3JpdHRlbiB3aXRoIHNvbWV0aGluZyB1c2VmdWwnKVxuICB9XG5cbiAgLy8gc2VhcmNoIGZvciBxdWVyeSB3aXRob3V0IGNoYW5naW5nIGFueSBvdGhlciBvcHRpb25zXG4gIGt3c2VhcmNoIChxdWVyeSkge1xuICAgIHRoaXMuc2VhcmNoRWQuc2V0VGV4dChxdWVyeSlcbiAgICB0aGlzLl9zZWFyY2gocXVlcnkpXG4gIH1cblxuICBzaG93RG9jdW1lbnQgKGRvYywgaXRlbXMpIHtcbiAgICB0aGlzLnNldENvbnRlbnQoJ2RvY3VtZW50Jywge2NvbnRlbnQ6IGRvYywgaXRlbXM6IGl0ZW1zfSlcbiAgfVxuXG4gIHNldENvbnRlbnQgKG1vZGUsIG9iaiA9IHtjb250ZW50OiBbXSwgaXRlbXM6IFtdfSkge1xuICAgIHRoaXMubW9kZSA9IG1vZGVcbiAgICB0aGlzLmNvbnRlbnQgPSBvYmouY29udGVudFxuICAgIHRoaXMuaXRlbXMgPSBvYmouaXRlbXNcbiAgICBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgdG9nZ2xlRXhwb3J0ZWQgKCkge1xuICAgIHRoaXMuZXhwb3J0ZWRPbmx5ID0gIXRoaXMuZXhwb3J0ZWRPbmx5XG4gICAgdGhpcy5yZWZzLnRvZ2dsZUV4cG9ydGVkLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInNlbGVjdGVkXCIpXG4gIH1cblxuICB0b2dnbGVBbGxMb2FkZWQgKCkge1xuICAgIHRoaXMuYWxsUGFja2FnZXMgPSAhdGhpcy5hbGxQYWNrYWdlc1xuICAgIHRoaXMucmVmcy50b2dnbGVMb2FkZWQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwic2VsZWN0ZWRcIilcbiAgfVxuXG4gIHRvZ2dsZUxvY2F0aW9uICgpIHtcbiAgICB0aGlzLm5hbWVzT25seSA9ICF0aGlzLm5hbWVzT25seVxuICAgIHRoaXMucmVmcy50b2dnbGVMb2NhdGlvbi5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJzZWxlY3RlZFwiKVxuICB9XG5cbiAgdG9nZ2xlT3B0aW9ucyAoKSB7XG4gICAgdGhpcy5yZWZzLmhlYWRlck9wdGlvbnMuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJylcbiAgICB0aGlzLnJlZnMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJzZWxlY3RlZFwiKVxuICB9XG5cbiAgaGVhZGVyVmlldyAoKSB7XG4gICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGVhZGVyLW1haW5cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2VhcmNoLWVkaXRvclwiPnt0b1ZpZXcodGhpcy5zZWFyY2hFZC5lbGVtZW50KX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJ0bi1ncm91cCBzZWFyY2gtYnV0dG9uXCI+PEJ1dHRvbiBhbHQ9J1NlYXJjaCBkb2N1bWVudGF0aW9uJyBpY29uPVwic2VhcmNoXCIgb25jbGljaz17KCkgPT4gdGhpcy5fc2VhcmNoKCl9Lz48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJ0bi1ncm91cCBvcHRpb25zLWJ1dHRvblwiPjxCdXR0b24gYWx0PSdTaG93IHNlYXJjaCBvcHRpb25zJyByZWY9XCJvcHRpb25zXCIgaWNvbj1cInRocmVlLWJhcnNcIiBvbmNsaWNrPXsoKSA9PiB0aGlzLnRvZ2dsZU9wdGlvbnMoKX0vPjwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIHJlZj1cImhlYWRlck9wdGlvbnNcIiBjbGFzc05hbWU9XCJoZWFkZXItb3B0aW9ucyBoaWRkZW5cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9kdWxlLWVkaXRvclwiPnt0b1ZpZXcodGhpcy5tb2RFZC5lbGVtZW50KX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9wdGlvbnMtYnRuZ3JvdXBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPEJ1dHRvbiByZWY9XCJ0b2dnbGVMb2NhdGlvblwiIGFsdD0nU2VhcmNoIGluIHZhcmlhYmxlIG5hbWVzIG9ubHknIG9uY2xpY2s9eygpID0+IHRoaXMudG9nZ2xlTG9jYXRpb24oKX0+bmFtZXM8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gcmVmPVwidG9nZ2xlRXhwb3J0ZWRcIiBhbHQ9J1NlYXJjaCBpbiBleHBvcnRlZCB2YXJpYWJsZXMgb25seScgb25jbGljaz17KCkgPT4gdGhpcy50b2dnbGVFeHBvcnRlZCgpfT5leHBvcnRlZDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiByZWY9XCJ0b2dnbGVMb2FkZWRcIiBhbHQ9J1NlYXJjaCBpbiBsb2FkZWQgbW9kdWxlcyBvbmx5JyBpY29uPVwiZm9vIHNlbGVjdGVkXCIgb25jbGljaz17KCkgPT4gdGhpcy50b2dnbGVBbGxMb2FkZWQoKX0+bG9hZGVkPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFsdD0nUmVnZW5lcmF0ZSBkb2N1bWVudGF0aW9uIGNhY2hlJyBpY29uPVwicmVwby1zeW5jXCIgb25jbGljaz17KCkgPT4gdGhpcy5yZWdlbmVyYXRlQ2FjaGUoKX0+PC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIGNvbnRlbnRWaWV3ICgpIHtcbiAgICBsZXQgY29udGVudFxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlICdsb2FkaW5nJzpcbiAgICAgICAgY29udGVudCA9IDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPjxzcGFuIGNsYXNzTmFtZT1cImxvYWRpbmcgbG9hZGluZy1zcGlubmVyLWxhcmdlXCIvPjwvZGl2PlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnc2VhcmNoJzpcbiAgICAgICAgY29udGVudCA9IDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgIHt0aGlzLml0ZW1zLm1hcCgoaXRlbSkgPT4gdG9WaWV3KG5ldyBEb2NJdGVtKHtpdGVtfSkpKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgIGNvbnRlbnQgPSA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICB7dG9WaWV3KHRoaXMuY29udGVudCl9XG4gICAgICAgICAge3RoaXMuaXRlbXMubWFwKChpdGVtKSA9PiB0b1ZpZXcobmV3IERvY0l0ZW0oe2l0ZW19KSkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgY29udGVudCA9IDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPnt0b1ZpZXcodGhpcy5jb250ZW50KX08L2Rpdj5cbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnRlbnQgPSA8ZGl2Lz5cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW5rIGRvY3BhbmVcIj5cbiAgICAgIHt0aGlzLmhlYWRlclZpZXcoKX1cbiAgICAgIHt0aGlzLmNvbnRlbnRWaWV3KCl9XG4gICAgPC9kaXY+XG4gIH1cblxuICBnZXRJY29uTmFtZSAoKSB7XG4gICAgcmV0dXJuICdpbmZvJ1xuICB9XG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKVxuICAgIHRoaXMuc3VicyA9IG51bGxcbiAgfVxufVxuXG5jbGFzcyBEb2NJdGVtIGV4dGVuZHMgRXRjaCB7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInR5cFwiIHRpdGxlPXt0aGlzLnByb3BzLml0ZW0ubmF0aXZldHlwZX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiAke3RoaXMucHJvcHMuaXRlbS50eXB9YH0+e21ha2VJY29uKHRoaXMucHJvcHMuaXRlbS5pY29uKX08L3NwYW4+XG4gICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJuYW1lXCIgb25jbGljaz17dGhpcy5wcm9wcy5pdGVtLm9uQ2xpY2tOYW1lfT57dGhpcy5wcm9wcy5pdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgZXhwb3J0ZWQgaWNvbiBpY29uLWV5ZSAke3RoaXMucHJvcHMuaXRlbS5leHBvcnRlZCA/IFwiaXMtZXhwb3J0ZWRcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuaXRlbS5leHBvcnRlZCA/IFwiZXhwb3J0ZWRcIiA6IFwibm90IGV4cG9ydGVkXCJ9XG4gICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9kdWxlXCIgb25jbGljaz17dGhpcy5wcm9wcy5pdGVtLm9uQ2xpY2tNb2R1bGV9Pnt0aGlzLnByb3BzLml0ZW0ubW9kfTwvc3Bhbj5cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICA8ZGl2IHJlZj0naXRlbUJvZHknIGNsYXNzTmFtZT1cIml0ZW0tYm9keSBjb2xsYXBzZWRcIj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZG9jc1wiPnt0b1ZpZXcodGhpcy5wcm9wcy5pdGVtLmh0bWwpfTwvZGl2PlxuICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdleHBhbmRlcicgb25jbGljaz17KCkgPT4gdGhpcy5leHBhbmQoKX0+Li4uPC9zcGFuPlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgfVxuXG4gIGV4cGFuZCAoKSB7XG4gICAgdGhpcy5yZWZzLml0ZW1Cb2R5LmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpXG4gIH1cbn1cblxuXG5Eb2NQYW5lLnJlZ2lzdGVyVmlldygpXG4iXX0=