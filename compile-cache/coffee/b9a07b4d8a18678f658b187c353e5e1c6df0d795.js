(function() {
  var _;

  _ = require('underscore-plus');

  module.exports = {
    highlight: function(text, grammar, arg) {
      var block, html, k, l, lastLineTokens, len, len1, lineTokens, ref, ref1, scopePrefix, scopeStack, scopes, tokens, value;
      ref = arg != null ? arg : {}, scopePrefix = ref.scopePrefix, block = ref.block;
      if (scopePrefix == null) {
        scopePrefix = '';
      }
      if (block == null) {
        block = false;
      }
      lineTokens = grammar.tokenizeLines(text);
      if (lineTokens.length > 0) {
        lastLineTokens = lineTokens[lineTokens.length - 1];
        if (lastLineTokens.length === 1 && lastLineTokens[0].value === '') {
          lineTokens.pop();
        }
      }
      html = '<code class="editor editor-colors">';
      for (k = 0, len = lineTokens.length; k < len; k++) {
        tokens = lineTokens[k];
        scopeStack = [];
        html += "<" + (block ? "div" : "span") + " class=\"line\">";
        for (l = 0, len1 = tokens.length; l < len1; l++) {
          ref1 = tokens[l], value = ref1.value, scopes = ref1.scopes;
          if (!value) {
            value = ' ';
          }
          html = this.updateScopeStack(scopeStack, scopes, html, scopePrefix);
          html += "<span>" + (this.escapeString(value)) + "</span>";
        }
        while (scopeStack.length > 0) {
          html = this.popScope(scopeStack, html);
        }
        html += "</" + (block ? "div" : "span") + ">";
      }
      html += '</code>';
      return html;
    },
    escapeString: function(string) {
      return string.replace(/[&"'<> ]/g, function(match) {
        switch (match) {
          case '&':
            return '&amp;';
          case '"':
            return '&quot;';
          case "'":
            return '&#39;';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          case ' ':
            return '&nbsp;';
          default:
            return match;
        }
      });
    },
    updateScopeStack: function(scopeStack, desiredScopes, html, scopePrefix) {
      var excessScopes, i, j, k, l, ref, ref1, ref2;
      excessScopes = scopeStack.length - desiredScopes.length;
      if (excessScopes > 0) {
        while (excessScopes--) {
          html = this.popScope(scopeStack, html);
        }
      }
      for (i = k = ref = scopeStack.length; ref <= 0 ? k <= 0 : k >= 0; i = ref <= 0 ? ++k : --k) {
        if (_.isEqual(scopeStack.slice(0, i), desiredScopes.slice(0, i))) {
          break;
        }
        html = this.popScope(scopeStack, html);
      }
      for (j = l = ref1 = i, ref2 = desiredScopes.length; ref1 <= ref2 ? l < ref2 : l > ref2; j = ref1 <= ref2 ? ++l : --l) {
        html = this.pushScope(scopeStack, desiredScopes[j], html, scopePrefix);
      }
      return html;
    },
    pushScope: function(scopeStack, scope, html, scopePrefix) {
      var className;
      scopeStack.push(scope);
      className = scopePrefix + scope.replace(/\.+/g, " " + scopePrefix);
      return html += "<span class=\"" + className + "\">";
    },
    popScope: function(scopeStack, html) {
      scopeStack.pop();
      return html += '</span>';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3VpL2hpZ2hsaWdodGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFJSixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsU0FBQSxFQUFXLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsR0FBaEI7QUFDVCxVQUFBOzBCQUR5QixNQUFxQixJQUFwQiwrQkFBYTs7UUFDdkMsY0FBZTs7O1FBQ2YsUUFBUzs7TUFDVCxVQUFBLEdBQWEsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsSUFBdEI7TUFHYixJQUFHLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQXZCO1FBQ0UsY0FBQSxHQUFpQixVQUFXLENBQUEsVUFBVSxDQUFDLE1BQVgsR0FBb0IsQ0FBcEI7UUFFNUIsSUFBRyxjQUFjLENBQUMsTUFBZixLQUF5QixDQUF6QixJQUErQixjQUFlLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBbEIsS0FBMkIsRUFBN0Q7VUFDRSxVQUFVLENBQUMsR0FBWCxDQUFBLEVBREY7U0FIRjs7TUFNQSxJQUFBLEdBQU87QUFDUCxXQUFBLDRDQUFBOztRQUNFLFVBQUEsR0FBYTtRQUNiLElBQUEsSUFBUSxHQUFBLEdBQUcsQ0FBSSxLQUFILEdBQWMsS0FBZCxHQUF5QixNQUExQixDQUFILEdBQW9DO0FBQzVDLGFBQUEsMENBQUE7NEJBQUssb0JBQU87VUFDVixJQUFBLENBQW1CLEtBQW5CO1lBQUEsS0FBQSxHQUFRLElBQVI7O1VBQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixVQUFsQixFQUE4QixNQUE5QixFQUFzQyxJQUF0QyxFQUE0QyxXQUE1QztVQUNQLElBQUEsSUFBUSxRQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQWQsQ0FBRCxDQUFSLEdBQThCO0FBSHhDO0FBSW1DLGVBQU0sVUFBVSxDQUFDLE1BQVgsR0FBb0IsQ0FBMUI7VUFBbkMsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVixFQUFzQixJQUF0QjtRQUE0QjtRQUNuQyxJQUFBLElBQVEsSUFBQSxHQUFJLENBQUksS0FBSCxHQUFjLEtBQWQsR0FBeUIsTUFBMUIsQ0FBSixHQUFxQztBQVIvQztNQVNBLElBQUEsSUFBUTthQUNSO0lBdkJTLENBQVg7SUF5QkEsWUFBQSxFQUFjLFNBQUMsTUFBRDthQUNaLE1BQU0sQ0FBQyxPQUFQLENBQWUsV0FBZixFQUE0QixTQUFDLEtBQUQ7QUFDMUIsZ0JBQU8sS0FBUDtBQUFBLGVBQ08sR0FEUDttQkFDZ0I7QUFEaEIsZUFFTyxHQUZQO21CQUVnQjtBQUZoQixlQUdPLEdBSFA7bUJBR2dCO0FBSGhCLGVBSU8sR0FKUDttQkFJZ0I7QUFKaEIsZUFLTyxHQUxQO21CQUtnQjtBQUxoQixlQU1PLEdBTlA7bUJBTWdCO0FBTmhCO21CQU9PO0FBUFA7TUFEMEIsQ0FBNUI7SUFEWSxDQXpCZDtJQW9DQSxnQkFBQSxFQUFrQixTQUFDLFVBQUQsRUFBYSxhQUFiLEVBQTRCLElBQTVCLEVBQWtDLFdBQWxDO0FBQ2hCLFVBQUE7TUFBQSxZQUFBLEdBQWUsVUFBVSxDQUFDLE1BQVgsR0FBb0IsYUFBYSxDQUFDO01BQ2pELElBQUcsWUFBQSxHQUFlLENBQWxCO0FBQ3FDLGVBQU0sWUFBQSxFQUFOO1VBQW5DLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBRCxDQUFVLFVBQVYsRUFBc0IsSUFBdEI7UUFBNEIsQ0FEckM7O0FBSUEsV0FBUyxxRkFBVDtRQUNFLElBQVMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxVQUFXLFlBQXJCLEVBQTZCLGFBQWMsWUFBM0MsQ0FBVDtBQUFBLGdCQUFBOztRQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBRCxDQUFVLFVBQVYsRUFBc0IsSUFBdEI7QUFGVDtBQUtBLFdBQVMsK0dBQVQ7UUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYLEVBQXVCLGFBQWMsQ0FBQSxDQUFBLENBQXJDLEVBQXlDLElBQXpDLEVBQStDLFdBQS9DO0FBRFQ7YUFHQTtJQWRnQixDQXBDbEI7SUFvREEsU0FBQSxFQUFXLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsV0FBMUI7QUFDVCxVQUFBO01BQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsS0FBaEI7TUFDQSxTQUFBLEdBQVksV0FBQSxHQUFjLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZCxFQUFzQixHQUFBLEdBQUksV0FBMUI7YUFDMUIsSUFBQSxJQUFRLGdCQUFBLEdBQWlCLFNBQWpCLEdBQTJCO0lBSDFCLENBcERYO0lBeURBLFFBQUEsRUFBVSxTQUFDLFVBQUQsRUFBYSxJQUFiO01BQ1IsVUFBVSxDQUFDLEdBQVgsQ0FBQTthQUNBLElBQUEsSUFBUTtJQUZBLENBekRWOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxuIyBJbXBsZW1lbnRhdGlvbiBpZGVudGljYWwgdG8gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vaGlnaGxpZ2h0cy9ibG9iL21hc3Rlci9zcmMvaGlnaGxpZ2h0cy5jb2ZmZWUsXG4jIGJ1dCB1c2VzIGFuIGV4dGVybmFsbHkgcHJvdmlkZWQgZ3JhbW1hci5cbm1vZHVsZS5leHBvcnRzID1cbiAgIyBIaWdobGlnaHRzIHNvbWUgYHRleHRgIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGBncmFtbWFyYC5cbiAgaGlnaGxpZ2h0OiAodGV4dCwgZ3JhbW1hciwge3Njb3BlUHJlZml4LCBibG9ja309e30pIC0+XG4gICAgc2NvcGVQcmVmaXggPz0gJydcbiAgICBibG9jayA/PSBmYWxzZVxuICAgIGxpbmVUb2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXModGV4dClcblxuICAgICMgUmVtb3ZlIHRyYWlsaW5nIG5ld2xpbmVcbiAgICBpZiBsaW5lVG9rZW5zLmxlbmd0aCA+IDBcbiAgICAgIGxhc3RMaW5lVG9rZW5zID0gbGluZVRva2Vuc1tsaW5lVG9rZW5zLmxlbmd0aCAtIDFdXG5cbiAgICAgIGlmIGxhc3RMaW5lVG9rZW5zLmxlbmd0aCBpcyAxIGFuZCBsYXN0TGluZVRva2Vuc1swXS52YWx1ZSBpcyAnJ1xuICAgICAgICBsaW5lVG9rZW5zLnBvcCgpXG5cbiAgICBodG1sID0gJzxjb2RlIGNsYXNzPVwiZWRpdG9yIGVkaXRvci1jb2xvcnNcIj4nXG4gICAgZm9yIHRva2VucyBpbiBsaW5lVG9rZW5zXG4gICAgICBzY29wZVN0YWNrID0gW11cbiAgICAgIGh0bWwgKz0gXCI8I3tpZiBibG9jayB0aGVuIFwiZGl2XCIgZWxzZSBcInNwYW5cIn0gY2xhc3M9XFxcImxpbmVcXFwiPlwiXG4gICAgICBmb3Ige3ZhbHVlLCBzY29wZXN9IGluIHRva2Vuc1xuICAgICAgICB2YWx1ZSA9ICcgJyB1bmxlc3MgdmFsdWVcbiAgICAgICAgaHRtbCA9IEB1cGRhdGVTY29wZVN0YWNrKHNjb3BlU3RhY2ssIHNjb3BlcywgaHRtbCwgc2NvcGVQcmVmaXgpXG4gICAgICAgIGh0bWwgKz0gXCI8c3Bhbj4je0Blc2NhcGVTdHJpbmcodmFsdWUpfTwvc3Bhbj5cIlxuICAgICAgaHRtbCA9IEBwb3BTY29wZShzY29wZVN0YWNrLCBodG1sKSB3aGlsZSBzY29wZVN0YWNrLmxlbmd0aCA+IDBcbiAgICAgIGh0bWwgKz0gXCI8LyN7aWYgYmxvY2sgdGhlbiBcImRpdlwiIGVsc2UgXCJzcGFuXCJ9PlwiXG4gICAgaHRtbCArPSAnPC9jb2RlPidcbiAgICBodG1sXG5cbiAgZXNjYXBlU3RyaW5nOiAoc3RyaW5nKSAtPlxuICAgIHN0cmluZy5yZXBsYWNlIC9bJlwiJzw+IF0vZywgKG1hdGNoKSAtPlxuICAgICAgc3dpdGNoIG1hdGNoXG4gICAgICAgIHdoZW4gJyYnIHRoZW4gJyZhbXA7J1xuICAgICAgICB3aGVuICdcIicgdGhlbiAnJnF1b3Q7J1xuICAgICAgICB3aGVuIFwiJ1wiIHRoZW4gJyYjMzk7J1xuICAgICAgICB3aGVuICc8JyB0aGVuICcmbHQ7J1xuICAgICAgICB3aGVuICc+JyB0aGVuICcmZ3Q7J1xuICAgICAgICB3aGVuICcgJyB0aGVuICcmbmJzcDsnXG4gICAgICAgIGVsc2UgbWF0Y2hcblxuICB1cGRhdGVTY29wZVN0YWNrOiAoc2NvcGVTdGFjaywgZGVzaXJlZFNjb3BlcywgaHRtbCwgc2NvcGVQcmVmaXgpIC0+XG4gICAgZXhjZXNzU2NvcGVzID0gc2NvcGVTdGFjay5sZW5ndGggLSBkZXNpcmVkU2NvcGVzLmxlbmd0aFxuICAgIGlmIGV4Y2Vzc1Njb3BlcyA+IDBcbiAgICAgIGh0bWwgPSBAcG9wU2NvcGUoc2NvcGVTdGFjaywgaHRtbCkgd2hpbGUgZXhjZXNzU2NvcGVzLS1cblxuICAgICMgcG9wIHVudGlsIGNvbW1vbiBwcmVmaXhcbiAgICBmb3IgaSBpbiBbc2NvcGVTdGFjay5sZW5ndGguLjBdXG4gICAgICBicmVhayBpZiBfLmlzRXF1YWwoc2NvcGVTdGFja1swLi4uaV0sIGRlc2lyZWRTY29wZXNbMC4uLmldKVxuICAgICAgaHRtbCA9IEBwb3BTY29wZShzY29wZVN0YWNrLCBodG1sKVxuXG4gICAgIyBwdXNoIG9uIHRvcCBvZiBjb21tb24gcHJlZml4IHVudGlsIHNjb3BlU3RhY2sgaXMgZGVzaXJlZFNjb3Blc1xuICAgIGZvciBqIGluIFtpLi4uZGVzaXJlZFNjb3Blcy5sZW5ndGhdXG4gICAgICBodG1sID0gQHB1c2hTY29wZShzY29wZVN0YWNrLCBkZXNpcmVkU2NvcGVzW2pdLCBodG1sLCBzY29wZVByZWZpeClcblxuICAgIGh0bWxcblxuICBwdXNoU2NvcGU6IChzY29wZVN0YWNrLCBzY29wZSwgaHRtbCwgc2NvcGVQcmVmaXgpIC0+XG4gICAgc2NvcGVTdGFjay5wdXNoKHNjb3BlKVxuICAgIGNsYXNzTmFtZSA9IHNjb3BlUHJlZml4ICsgc2NvcGUucmVwbGFjZSgvXFwuKy9nLCBcIiAje3Njb3BlUHJlZml4fVwiKVxuICAgIGh0bWwgKz0gXCI8c3BhbiBjbGFzcz1cXFwiI3tjbGFzc05hbWV9XFxcIj5cIlxuXG4gIHBvcFNjb3BlOiAoc2NvcGVTdGFjaywgaHRtbCkgLT5cbiAgICBzY29wZVN0YWNrLnBvcCgpXG4gICAgaHRtbCArPSAnPC9zcGFuPidcbiJdfQ==
