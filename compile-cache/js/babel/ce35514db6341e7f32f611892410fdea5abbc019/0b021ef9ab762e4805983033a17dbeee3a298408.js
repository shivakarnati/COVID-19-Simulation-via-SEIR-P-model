'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.closest = closest;

function closest(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var element = _x,
        selector = _x2;
    _again = false;
    if (element == null || element.matches(selector)) {
      return element;
    } else {
      _x = element.parentElement;
      _x2 = selector;
      _again = true;
      continue _function;
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9jb25zb2xlL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7O0FBRUosU0FBUyxPQUFPOzs7NEJBQW9CO1FBQW5CLE9BQU87UUFBRSxRQUFROztBQUNoQyxRQUFBLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFBRyxPQUFPOztXQUNuRCxPQUFPLENBQUMsYUFBYTtZQUFFLFFBQVE7OztLQUFDO0dBQzNDO0NBQUEiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2NvbnNvbGUvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBlbGVtZW50ID09IG51bGwgfHwgZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSA/IGVsZW1lbnQgOlxuICAgIGNsb3Nlc3QoZWxlbWVudC5wYXJlbnRFbGVtZW50LCBzZWxlY3Rvcilcbn1cbiJdfQ==