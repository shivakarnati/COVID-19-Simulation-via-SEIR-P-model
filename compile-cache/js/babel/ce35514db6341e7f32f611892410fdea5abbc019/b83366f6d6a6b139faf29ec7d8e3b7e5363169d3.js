Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ansiToHTML;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ansi_up = require('ansi_up');

var _ansi_up2 = _interopRequireDefault(_ansi_up);

'use babel';

var converter = new _ansi_up2['default']();
converter.escape_for_html = false;

// this wraps all plain text nodes in a span, which makes sure they can be picked
// up by querySelectorAll later
function wrapTextNodes(view) {
  if (view.hasChildNodes()) {
    var nodes = view.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeType == 3) {
        // text nodes
        var span = document.createElement('span');
        span.innerText = node.textContent;
        node.parentElement.insertBefore(span, node);
        node.parentElement.removeChild(node);
      } else if (node.nodeType == 1) {
        // normal HTML nodes
        wrapTextNodes(node);
      }
    }
  }
}

function ansiToHTML(view) {
  if (typeof view === 'string' || view instanceof String) {
    return converter.ansi_to_html(view);
  } else {
    wrapTextNodes(view);

    if (view.childElementCount == 0) {
      view.innerHTML = converter.ansi_to_html(view.innerText);
    } else if (view.querySelectorAll) {
      var allElements = view.querySelectorAll('*');
      for (var i = 0; i < allElements.length; i++) {
        if (allElements[i].childElementCount == 0) {
          allElements[i].innerHTML = converter.ansi_to_html(allElements[i].innerHTML);
        }
      }
    }

    // reset color stream
    converter.ansi_to_html('\x1b[0m');

    return view;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi91dGlsL2Fuc2l0b2h0bWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQXlCd0IsVUFBVTs7Ozt1QkF2QmYsU0FBUzs7OztBQUY1QixXQUFXLENBQUE7O0FBR1gsSUFBSSxTQUFTLEdBQUcsMEJBQVksQ0FBQTtBQUM1QixTQUFTLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQTs7OztBQUlqQyxTQUFTLGFBQWEsQ0FBRSxJQUFJLEVBQUU7QUFDNUIsTUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUU7QUFDeEIsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTtBQUMzQixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbkIsVUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTs7QUFDdEIsWUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN6QyxZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7QUFDakMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzNDLFlBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3JDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTs7QUFDN0IscUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNwQjtLQUNGO0dBQ0Y7Q0FDRjs7QUFFYyxTQUFTLFVBQVUsQ0FBRSxJQUFJLEVBQUU7QUFDeEMsTUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxZQUFZLE1BQU0sRUFBRTtBQUN0RCxXQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDcEMsTUFBTTtBQUNMLGlCQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRW5CLFFBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMsRUFBRTtBQUMvQixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQ3hELE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDaEMsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzVDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLFlBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixJQUFJLENBQUMsRUFBRTtBQUN6QyxxQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUM1RTtPQUNGO0tBQ0Y7OztBQUdELGFBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRWpDLFdBQU8sSUFBSSxDQUFBO0dBQ1o7Q0FDRiIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2luay9saWIvdXRpbC9hbnNpdG9odG1sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IEFuc2lVcCBmcm9tICdhbnNpX3VwJ1xubGV0IGNvbnZlcnRlciA9IG5ldyBBbnNpVXAoKVxuY29udmVydGVyLmVzY2FwZV9mb3JfaHRtbCA9IGZhbHNlXG5cbi8vIHRoaXMgd3JhcHMgYWxsIHBsYWluIHRleHQgbm9kZXMgaW4gYSBzcGFuLCB3aGljaCBtYWtlcyBzdXJlIHRoZXkgY2FuIGJlIHBpY2tlZFxuLy8gdXAgYnkgcXVlcnlTZWxlY3RvckFsbCBsYXRlclxuZnVuY3Rpb24gd3JhcFRleHROb2RlcyAodmlldykge1xuICBpZiAodmlldy5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICBsZXQgbm9kZXMgPSB2aWV3LmNoaWxkTm9kZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IG5vZGVzW2ldXG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PSAzKSB7IC8vIHRleHQgbm9kZXNcbiAgICAgICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgc3Bhbi5pbm5lclRleHQgPSBub2RlLnRleHRDb250ZW50XG4gICAgICAgIG5vZGUucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoc3Bhbiwgbm9kZSlcbiAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG5vZGUpXG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT0gMSkgeyAvLyBub3JtYWwgSFRNTCBub2Rlc1xuICAgICAgICB3cmFwVGV4dE5vZGVzKG5vZGUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFuc2lUb0hUTUwgKHZpZXcpIHtcbiAgaWYgKHR5cGVvZiB2aWV3ID09PSAnc3RyaW5nJyB8fCB2aWV3IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRlci5hbnNpX3RvX2h0bWwodmlldylcbiAgfSBlbHNlIHtcbiAgICB3cmFwVGV4dE5vZGVzKHZpZXcpXG5cbiAgICBpZiAodmlldy5jaGlsZEVsZW1lbnRDb3VudCA9PSAwKSB7XG4gICAgICB2aWV3LmlubmVySFRNTCA9IGNvbnZlcnRlci5hbnNpX3RvX2h0bWwodmlldy5pbm5lclRleHQpXG4gICAgfSBlbHNlIGlmICh2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgIGxldCBhbGxFbGVtZW50cyA9IHZpZXcucXVlcnlTZWxlY3RvckFsbCgnKicpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxFbGVtZW50c1tpXS5jaGlsZEVsZW1lbnRDb3VudCA9PSAwKSB7XG4gICAgICAgICAgYWxsRWxlbWVudHNbaV0uaW5uZXJIVE1MID0gY29udmVydGVyLmFuc2lfdG9faHRtbChhbGxFbGVtZW50c1tpXS5pbm5lckhUTUwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXNldCBjb2xvciBzdHJlYW1cbiAgICBjb252ZXJ0ZXIuYW5zaV90b19odG1sKCdcXHgxYlswbScpXG5cbiAgICByZXR1cm4gdmlld1xuICB9XG59XG4iXX0=