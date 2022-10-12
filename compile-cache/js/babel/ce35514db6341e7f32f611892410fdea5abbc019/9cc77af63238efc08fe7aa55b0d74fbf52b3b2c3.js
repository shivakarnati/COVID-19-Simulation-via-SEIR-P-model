Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.showBasicModal = showBasicModal;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etch3 = require('./etch');

var _atom = require('atom');

'use babel';
function showBasicModal(queries) {
  return new Promise(function (resolve, reject) {
    subs = new _atom.CompositeDisposable();

    _resolve = function () {
      panel.destroy();
      subs.dispose();
      resolve.apply(undefined, arguments);
    };
    _reject = function () {
      panel.destroy();
      subs.dispose();
      reject.apply(undefined, arguments);
    };
    var view = new BasicModalView(queries, _resolve, _reject);

    subs.add(atom.commands.add('.basic-modal .editor', {
      'basic-modal:confirm': function basicModalConfirm() {
        return view.confirm();
      }
    }));
    subs.add(atom.commands.add('.basic-modal .editor', {
      'basic-modal:cancel': function basicModalCancel() {
        return view.cancel();
      }
    }));
    var panel = atom.workspace.addModalPanel({
      item: view,
      autoFocus: true
    });
    // focus first editor
    if (view.queries.length > 0) {
      view.models[view.queries[0].name].element.focus();
    }
  });
}

var BasicModalView = (function () {
  function BasicModalView(queries, resolve, reject) {
    _classCallCheck(this, BasicModalView);

    this.resolve = resolve;
    this.reject = reject;
    this.models = {};
    this.queries = queries;
    for (var query of this.queries) {
      this.models[query.name] = new _atom.TextEditor({
        mini: true,
        placeholderText: query.placeholder || ''
      });
      if (query.value) {
        this.models[query.name].setText(query.value);
      }
    }

    _etch2['default'].initialize(this);
  }

  _createClass(BasicModalView, [{
    key: 'confirm',
    value: function confirm() {
      var ret = {};
      for (var query of this.queries) {
        ret[query.name] = this.models[query.name].getText();
      }
      this.resolve(ret);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.reject();
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var queryViews = this.queries.map(function (query) {
        return _etch2['default'].dom(
          'div',
          { className: 'flex-table row' },
          _etch2['default'].dom(
            'div',
            { className: 'flex-row' },
            query.name || ''
          ),
          _etch2['default'].dom(
            'div',
            { className: 'flex-row second' },
            (0, _etch3.toView)(_this.models[query.name].element)
          )
        );
      });
      return _etch2['default'].dom(
        'div',
        { className: 'basic-modal flex-table-container' },
        queryViews,
        _etch2['default'].dom(
          'div',
          { className: 'confirm-cancel flex-table' },
          _etch2['default'].dom(
            'div',
            { className: 'flex-row' },
            _etch2['default'].dom(
              _etch3.Button,
              {
                className: 'btn-success',
                onclick: function () {
                  return _this.confirm();
                } },
              'Confirm'
            )
          ),
          _etch2['default'].dom(
            'div',
            { className: 'flex-row' },
            _etch2['default'].dom(
              _etch3.Button,
              {
                className: 'btn-error',
                onclick: function () {
                  return _this.cancel();
                } },
              'Cancel'
            )
          )
        )
      );
    }
  }]);

  return BasicModalView;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL2Jhc2ljLW1vZGFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O3FCQUM0QyxRQUFROztvQkFDM0IsTUFBTTs7QUFMdEQsV0FBVyxDQUFBO0FBT0osU0FBUyxjQUFjLENBQUMsT0FBTyxFQUFFO0FBQ3RDLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFFBQUksR0FBRywrQkFBeUIsQ0FBQTs7QUFFaEMsWUFBUSxHQUFHLFlBQWE7QUFDdEIsV0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2YsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2QsYUFBTyw0QkFBUyxDQUFBO0tBQ2pCLENBQUE7QUFDRCxXQUFPLEdBQUcsWUFBYTtBQUNyQixXQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDZixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDZCxZQUFNLDRCQUFTLENBQUE7S0FDaEIsQ0FBQTtBQUNELFFBQUksSUFBSSxHQUFHLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRXpELFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUU7QUFDakQsMkJBQXFCLEVBQUU7ZUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFO09BQUE7S0FDNUMsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFO0FBQ2pELDBCQUFvQixFQUFFO2VBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtPQUFBO0tBQzFDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFB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LCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvYmFzaWMtbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IHRvVmlldywgVG9vbGJhciwgQnV0dG9uLCBJY29uLCBtYWtlaWNvbiwgRXRjaCwgUmF3IH0gZnJvbSAnLi9ldGNoJ1xuaW1wb3J0IHsgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93QmFzaWNNb2RhbChxdWVyaWVzKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIF9yZXNvbHZlID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIHBhbmVsLmRlc3Ryb3koKVxuICAgICAgc3Vicy5kaXNwb3NlKClcbiAgICAgIHJlc29sdmUoLi4uYXJncylcbiAgICB9XG4gICAgX3JlamVjdCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICBwYW5lbC5kZXN0cm95KClcbiAgICAgIHN1YnMuZGlzcG9zZSgpXG4gICAgICByZWplY3QoLi4uYXJncylcbiAgICB9XG4gICAgbGV0IHZpZXcgPSBuZXcgQmFzaWNNb2RhbFZpZXcocXVlcmllcywgX3Jlc29sdmUsIF9yZWplY3QpXG5cbiAgICBzdWJzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnLmJhc2ljLW1vZGFsIC5lZGl0b3InLCB7XG4gICAgICAnYmFzaWMtbW9kYWw6Y29uZmlybSc6ICgpID0+IHZpZXcuY29uZmlybSgpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJy5iYXNpYy1tb2RhbCAuZWRpdG9yJywge1xuICAgICAgJ2Jhc2ljLW1vZGFsOmNhbmNlbCc6ICgpID0+IHZpZXcuY2FuY2VsKClcbiAgICB9KSlcbiAgICBsZXQgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgIGl0ZW06IHZpZXcsXG4gICAgICBhdXRvRm9jdXM6IHRydWVcbiAgICB9KVxuICAgIC8vIGZvY3VzIGZpcnN0IGVkaXRvclxuICAgIGlmICh2aWV3LnF1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdmlldy5tb2RlbHNbdmlldy5xdWVyaWVzWzBdLm5hbWVdLmVsZW1lbnQuZm9jdXMoKVxuICAgIH1cbiAgfSlcbn1cblxuY2xhc3MgQmFzaWNNb2RhbFZpZXcge1xuICBjb25zdHJ1Y3RvciAocXVlcmllcywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZVxuICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0XG4gICAgdGhpcy5tb2RlbHMgPSB7fVxuICAgIHRoaXMucXVlcmllcyA9IHF1ZXJpZXNcbiAgICBmb3IgKGxldCBxdWVyeSBvZiB0aGlzLnF1ZXJpZXMpIHtcbiAgICAgIHRoaXMubW9kZWxzW3F1ZXJ5Lm5hbWVdID0gbmV3IFRleHRFZGl0b3Ioe1xuICAgICAgICBtaW5pOiB0cnVlLFxuICAgICAgICBwbGFjZWhvbGRlclRleHQ6IHF1ZXJ5LnBsYWNlaG9sZGVyIHx8ICcnXG4gICAgICB9KVxuICAgICAgaWYgKHF1ZXJ5LnZhbHVlKSB7XG4gICAgICAgIHRoaXMubW9kZWxzW3F1ZXJ5Lm5hbWVdLnNldFRleHQocXVlcnkudmFsdWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBjb25maXJtICgpIHtcbiAgICBsZXQgcmV0ID0ge31cbiAgICBmb3IgKGxldCBxdWVyeSBvZiB0aGlzLnF1ZXJpZXMpIHtcbiAgICAgIHJldFtxdWVyeS5uYW1lXSA9IHRoaXMubW9kZWxzW3F1ZXJ5Lm5hbWVdLmdldFRleHQoKVxuICAgIH1cbiAgICB0aGlzLnJlc29sdmUocmV0KVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICB0aGlzLnJlamVjdCgpXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICByZW5kZXIgKCkge1xuICAgIGxldCBxdWVyeVZpZXdzID0gdGhpcy5xdWVyaWVzLm1hcChxdWVyeSA9PiB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmbGV4LXRhYmxlIHJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtcm93XCI+XG4gICAgICAgICAge3F1ZXJ5Lm5hbWUgfHwgJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtcm93IHNlY29uZFwiPlxuICAgICAgICAgIHt0b1ZpZXcodGhpcy5tb2RlbHNbcXVlcnkubmFtZV0uZWxlbWVudCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgfSlcbiAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwiYmFzaWMtbW9kYWwgZmxleC10YWJsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAge3F1ZXJ5Vmlld3N9XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29uZmlybS1jYW5jZWwgZmxleC10YWJsZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLXN1Y2Nlc3NcIlxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXsoKSA9PiB0aGlzLmNvbmZpcm0oKX0+XG4gICAgICAgICAgICAgICAgICAgIENvbmZpcm1cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz17KCkgPT4gdGhpcy5jYW5jZWwoKX0+XG4gICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gIH1cbn1cbiJdfQ==