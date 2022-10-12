Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var DebuggerToolbar = (function () {
  function DebuggerToolbar(buttons) {
    var _this = this;

    _classCallCheck(this, DebuggerToolbar);

    this.currentEditor = null;
    this.subs = new _atom.CompositeDisposable();

    var group = document.createElement('div');
    group.classList.add('btn-group', 'btn-group-sm', 'ink-btn-group-variable-width');
    buttons.forEach(function (b) {
      return group.appendChild(_this.buttonView(b));
    });

    this.view = document.createElement('div');
    this.view.className = 'ink-debug-toolbar';
    this.view.appendChild(group);
  }

  _createClass(DebuggerToolbar, [{
    key: 'buttonView',
    value: function buttonView(_ref) {
      var icon = _ref.icon;
      var text = _ref.text;
      var tooltip = _ref.tooltip;
      var command = _ref.command;
      var color = _ref.color;
      var svg = _ref.svg;

      var btn = document.createElement('button');
      btn.classList.add('btn', 'ink-btn-variable-width');
      if (text) btn.innerText = text;
      if (svg) {
        btn.innerHTML = svg;
        btn.classList.add('custom-svg-icon');
      }
      if (icon) btn.classList.add('icon-' + icon);
      if (color) btn.classList.add('btn-color-' + color);
      btn.onclick = function () {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), command);
      };
      this.subs.add(atom.tooltips.add(btn, {
        title: tooltip,
        placement: 'top',
        'class': 'ink-toolbar-tooltip',
        keyBindingCommand: command
      }));
      return btn;
    }
  }, {
    key: 'attach',
    value: function attach(ed) {
      this.detach();

      this.currentEditor = ed;
      var edView = atom.views.getView(ed);
      edView.appendChild(this.view);
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (this.currentEditor && this.view) {
        atom.views.getView(this.currentEditor).removeChild(this.view);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.detach();
      this.view = null;
      this.subs.dispose();
    }
  }]);

  return DebuggerToolbar;
})();

exports.DebuggerToolbar = DebuggerToolbar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9kZWJ1Z2dlci90b29sYmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVvQyxNQUFNOztBQUYxQyxXQUFXLENBQUE7O0lBSUUsZUFBZTtBQUNkLFdBREQsZUFBZSxDQUNiLE9BQU8sRUFBRTs7OzBCQURYLGVBQWU7O0FBRXhCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsK0JBQXlCLENBQUE7O0FBRXJDLFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2hGLFdBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO2FBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFN0QsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFBO0FBQ3pDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzdCOztlQVpVLGVBQWU7O1dBY2Ysb0JBQUMsSUFBMEMsRUFBRTtVQUEzQyxJQUFJLEdBQUwsSUFBMEMsQ0FBekMsSUFBSTtVQUFFLElBQUksR0FBWCxJQUEwQyxDQUFuQyxJQUFJO1VBQUUsT0FBTyxHQUFwQixJQUEwQyxDQUE3QixPQUFPO1VBQUUsT0FBTyxHQUE3QixJQUEwQyxDQUFwQixPQUFPO1VBQUUsS0FBSyxHQUFwQyxJQUEwQyxDQUFYLEtBQUs7VUFBRSxHQUFHLEdBQXpDLElBQTBDLENBQUosR0FBRzs7QUFDbkQsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMxQyxTQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLENBQUMsQ0FBQTtBQUNsRCxVQUFJLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUM5QixVQUFJLEdBQUcsRUFBRTtBQUNQLFdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFBO0FBQ25CLFdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxtQkFBbUIsQ0FBQTtPQUNyQztBQUNELFVBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFTLElBQUksQ0FBRyxDQUFBO0FBQzNDLFVBQUksS0FBSyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxnQkFBYyxLQUFLLENBQUcsQ0FBQTtBQUNsRCxTQUFHLENBQUMsT0FBTyxHQUFHO2VBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUE7QUFDdkYsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ25DLGFBQUssRUFBRSxPQUFPO0FBQ2QsaUJBQVMsRUFBRSxLQUFLO0FBQ2hCLGlCQUFPLHFCQUFxQjtBQUM1Qix5QkFBaUIsRUFBRSxPQUFPO09BQzNCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsYUFBTyxHQUFHLENBQUE7S0FDWDs7O1dBRU0sZ0JBQUMsRUFBRSxFQUFFO0FBQ1YsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBOztBQUViLFVBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLFlBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzlCOzs7V0FFTSxrQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25DLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzlEO0tBQ0Y7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2IsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNwQjs7O1NBcERVLGVBQWUiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2RlYnVnZ2VyL3Rvb2xiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGNsYXNzIERlYnVnZ2VyVG9vbGJhciB7XG4gIGNvbnN0cnVjdG9yIChidXR0b25zKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdG9yID0gbnVsbFxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnYnRuLWdyb3VwJywgJ2J0bi1ncm91cC1zbScsICdpbmstYnRuLWdyb3VwLXZhcmlhYmxlLXdpZHRoJylcbiAgICBidXR0b25zLmZvckVhY2goKGIpID0+IGdyb3VwLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uVmlldyhiKSkpXG5cbiAgICB0aGlzLnZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMudmlldy5jbGFzc05hbWUgPSAnaW5rLWRlYnVnLXRvb2xiYXInXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKGdyb3VwKVxuICB9XG5cbiAgYnV0dG9uVmlldyAoe2ljb24sIHRleHQsIHRvb2x0aXAsIGNvbW1hbmQsIGNvbG9yLCBzdmd9KSB7XG4gICAgbGV0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bicsICdpbmstYnRuLXZhcmlhYmxlLXdpZHRoJylcbiAgICBpZiAodGV4dCkgYnRuLmlubmVyVGV4dCA9IHRleHRcbiAgICBpZiAoc3ZnKSB7XG4gICAgICBidG4uaW5uZXJIVE1MID0gc3ZnXG4gICAgICBidG4uY2xhc3NMaXN0LmFkZChgY3VzdG9tLXN2Zy1pY29uYClcbiAgICB9XG4gICAgaWYgKGljb24pIGJ0bi5jbGFzc0xpc3QuYWRkKGBpY29uLSR7aWNvbn1gKVxuICAgIGlmIChjb2xvcikgYnRuLmNsYXNzTGlzdC5hZGQoYGJ0bi1jb2xvci0ke2NvbG9yfWApXG4gICAgYnRuLm9uY2xpY2sgPSAoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksIGNvbW1hbmQpXG4gICAgdGhpcy5zdWJzLmFkZChhdG9tLnRvb2x0aXBzLmFkZChidG4sIHtcbiAgICAgIHRpdGxlOiB0b29sdGlwLFxuICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgIGNsYXNzOiAnaW5rLXRvb2xiYXItdG9vbHRpcCcsXG4gICAgICBrZXlCaW5kaW5nQ29tbWFuZDogY29tbWFuZFxuICAgIH0pKVxuICAgIHJldHVybiBidG5cbiAgfVxuXG4gIGF0dGFjaCAoZWQpIHtcbiAgICB0aGlzLmRldGFjaCgpXG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0b3IgPSBlZFxuICAgIGxldCBlZFZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWQpXG4gICAgZWRWaWV3LmFwcGVuZENoaWxkKHRoaXMudmlldylcbiAgfVxuXG4gIGRldGFjaCAoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEVkaXRvciAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmN1cnJlbnRFZGl0b3IpLnJlbW92ZUNoaWxkKHRoaXMudmlldylcbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRldGFjaCgpXG4gICAgdGhpcy52aWV3ID0gbnVsbFxuICAgIHRoaXMuc3Vicy5kaXNwb3NlKClcbiAgfVxufVxuIl19