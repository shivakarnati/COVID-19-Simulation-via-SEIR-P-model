(function() {
  var Highlighter, client, getlazy, once, views,
    slice = [].slice;

  Highlighter = require('./highlighter');

  client = require('../connection').client;

  once = require('../misc').once;

  getlazy = client["import"]('getlazy');

  module.exports = views = {
    dom: function(arg, opts) {
      var attrs, child, contents, i, k, len, tag, v, view;
      tag = arg.tag, attrs = arg.attrs, contents = arg.contents;
      view = document.createElement(tag);
      for (k in attrs) {
        v = attrs[k];
        if (v instanceof Array) {
          v = v.join(' ');
        }
        view.setAttribute(k, v);
      }
      if (contents != null) {
        if (contents.constructor !== Array) {
          contents = [contents];
        }
        for (i = 0, len = contents.length; i < len; i++) {
          child = contents[i];
          view.appendChild(this.render(child, opts));
        }
      }
      return view;
    },
    html: function(arg) {
      var block, content, ref, view;
      content = arg.content, block = (ref = arg.block) != null ? ref : false;
      view = this.render(block ? this.tags.div() : this.tags.span());
      view.innerHTML = content;
      return view = view.children.length === 1 ? view.children[0] : view;
    },
    tree: function(arg, opts) {
      var children, expand, head;
      head = arg.head, children = arg.children, expand = arg.expand;
      return this.ink.tree.treeView(this.render(head, opts), children.map((function(_this) {
        return function(x) {
          return _this.render(_this.tags.div([x]), opts);
        };
      })(this)), {
        expand: expand
      });
    },
    lazy: function(arg, opts) {
      var conn, head, id, view;
      head = arg.head, id = arg.id;
      conn = client.conn;
      if (opts.registerLazy != null) {
        opts.registerLazy(id);
      } else {
        console.warn('Unregistered lazy view');
      }
      return view = this.ink.tree.treeView(this.render(head, opts), [], {
        onToggle: once((function(_this) {
          return function() {
            if (client.conn !== conn) {
              return;
            }
            return getlazy(id).then(function(children) {
              var body;
              body = view.querySelector(':scope > .body');
              return children.map(function(x) {
                return _this.render(_this.tags.div([x]), opts);
              }).forEach(function(x) {
                return body.appendChild(_this.ink.ansiToHTML(x));
              });
            });
          };
        })(this))
      });
    },
    subtree: function(arg, opts) {
      var child, label;
      label = arg.label, child = arg.child;
      return this.render((child.type === "tree" ? {
        type: "tree",
        head: this.tags.span([label, child.head]),
        children: child.children
      } : this.tags.span("gutted", [label, child])), opts);
    },
    copy: function(arg, opts) {
      var text, view;
      view = arg.view, text = arg.text;
      view = this.render(view, opts);
      atom.commands.add(view, {
        'core:copy': function(e) {
          atom.clipboard.write(text);
          return e.stopPropagation();
        }
      });
      return view;
    },
    link: function(arg) {
      var contents, file, line, tt, view;
      file = arg.file, line = arg.line, contents = arg.contents;
      view = this.render(this.tags.a({
        href: '#'
      }, contents));
      if (this.ink.Opener.isUntitled(file)) {
        tt = atom.tooltips.add(view, {
          title: function() {
            return 'untitled';
          }
        });
      } else {
        tt = atom.tooltips.add(view, {
          title: function() {
            return file;
          }
        });
      }
      view.onclick = (function(_this) {
        return function(e) {
          _this.ink.Opener.open(file, line, {
            pending: atom.config.get('core.allowPendingPaneItems')
          });
          return e.stopPropagation();
        };
      })(this);
      view.addEventListener('DOMNodeRemovedFromDocument', (function(_this) {
        return function() {
          return tt.dispose();
        };
      })(this));
      return view;
    },
    number: function(arg) {
      var full, isfull, rounded, value, view;
      value = arg.value, full = arg.full;
      rounded = value.toPrecision(3);
      if (!(rounded.toString().length >= full.length)) {
        rounded += '…';
      }
      view = this.render(this.tags.span('syntax--constant syntax--numeric', rounded));
      isfull = false;
      view.onclick = function(e) {
        view.innerText = !isfull ? full : rounded;
        isfull = !isfull;
        return e.stopPropagation();
      };
      return view;
    },
    code: function(arg) {
      var attrs, block, grammar, highlighted, scope, text;
      text = arg.text, attrs = arg.attrs, scope = arg.scope;
      grammar = atom.grammars.grammarForScopeName("source.julia");
      block = (attrs != null ? attrs.block : void 0) || false;
      highlighted = Highlighter.highlight(text, grammar, {
        scopePrefix: 'syntax--',
        block: block
      });
      return this.render({
        type: 'html',
        block: block,
        content: highlighted
      });
    },
    latex: function(arg) {
      var attrs, block, latex, text;
      attrs = arg.attrs, text = arg.text;
      block = (attrs != null ? attrs.block : void 0) || false;
      latex = this.ink.KaTeX.texify(text, block);
      return this.render({
        type: 'html',
        block: block,
        content: latex
      });
    },
    views: {
      dom: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.dom.apply(views, a);
      },
      html: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.html.apply(views, a);
      },
      tree: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.tree.apply(views, a);
      },
      lazy: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.lazy.apply(views, a);
      },
      subtree: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.subtree.apply(views, a);
      },
      link: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.link.apply(views, a);
      },
      copy: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.copy.apply(views, a);
      },
      number: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.number.apply(views, a);
      },
      code: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.code.apply(views, a);
      },
      latex: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.latex.apply(views, a);
      }
    },
    render: function(data, opts) {
      var r;
      if (opts == null) {
        opts = {};
      }
      if (this.views.hasOwnProperty(data.type)) {
        r = this.views[data.type](data, opts);
        this.ink.ansiToHTML(r);
        return r;
      } else if ((data != null ? data.constructor : void 0) === String) {
        return new Text(data);
      } else {
        return this.render("julia-client: can't render " + (data != null ? data.type : void 0));
      }
    },
    tag: function(tag, attrs, contents) {
      var ref;
      if ((attrs != null ? attrs.constructor : void 0) === String) {
        attrs = {
          "class": attrs
        };
      }
      if ((attrs != null ? attrs.constructor : void 0) !== Object) {
        ref = [attrs, void 0], contents = ref[0], attrs = ref[1];
      }
      return {
        type: 'dom',
        tag: tag,
        attrs: attrs,
        contents: contents
      };
    },
    tags: {}
  };

  ['div', 'span', 'a', 'strong', 'table', 'tr', 'td', 'webview'].forEach(function(tag) {
    return views.tags[tag] = function(attrs, contents) {
      return views.tag(tag, attrs, contents);
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3VpL3ZpZXdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0VBRWIsU0FBVSxPQUFBLENBQVEsZUFBUjs7RUFDVixPQUFRLE9BQUEsQ0FBUSxTQUFSOztFQUVULE9BQUEsR0FBVSxNQUFNLEVBQUMsTUFBRCxFQUFOLENBQWMsU0FBZDs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLEdBQ2Y7SUFBQSxHQUFBLEVBQUssU0FBQyxHQUFELEVBQXlCLElBQXpCO0FBQ0gsVUFBQTtNQURLLGVBQUssbUJBQU87TUFDakIsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCO0FBQ1AsV0FBQSxVQUFBOztRQUNFLElBQUcsQ0FBQSxZQUFhLEtBQWhCO1VBQTJCLENBQUEsR0FBSSxDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsRUFBL0I7O1FBQ0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7QUFGRjtNQUdBLElBQUcsZ0JBQUg7UUFDRSxJQUFHLFFBQVEsQ0FBQyxXQUFULEtBQTBCLEtBQTdCO1VBQ0UsUUFBQSxHQUFXLENBQUMsUUFBRCxFQURiOztBQUVBLGFBQUEsMENBQUE7O1VBQ0UsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBQWUsSUFBZixDQUFqQjtBQURGLFNBSEY7O2FBS0E7SUFWRyxDQUFMO0lBWUEsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLFVBQUE7TUFETSx1QkFBUywwQ0FBUTtNQUN2QixJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQUQsQ0FBVyxLQUFILEdBQWMs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S0FBTjtRQUNBLEdBQUEsRUFBSyxHQURMO1FBRUEsS0FBQSxFQUFPLEtBRlA7UUFHQSxRQUFBLEVBQVUsUUFIVjs7SUFMRyxDQWxITDtJQTRIQSxJQUFBLEVBQU0sRUE1SE47OztFQThIRixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEdBQWhCLEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CLEVBQXdDLElBQXhDLEVBQThDLElBQTlDLEVBQW9ELFNBQXBELENBQThELENBQUMsT0FBL0QsQ0FBdUUsU0FBQyxHQUFEO1dBQ3JFLEtBQUssQ0FBQyxJQUFLLENBQUEsR0FBQSxDQUFYLEdBQWtCLFNBQUMsS0FBRCxFQUFRLFFBQVI7YUFDaEIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxHQUFWLEVBQWUsS0FBZixFQUFzQixRQUF0QjtJQURnQjtFQURtRCxDQUF2RTtBQXRJQSIsInNvdXJjZXNDb250ZW50IjpbIkhpZ2hsaWdodGVyID0gcmVxdWlyZSAnLi9oaWdobGlnaHRlcidcblxue2NsaWVudH0gPSByZXF1aXJlICcuLi9jb25uZWN0aW9uJ1xue29uY2V9ID0gcmVxdWlyZSAnLi4vbWlzYydcblxuZ2V0bGF6eSA9IGNsaWVudC5pbXBvcnQgJ2dldGxhenknXG5cbm1vZHVsZS5leHBvcnRzID0gdmlld3MgPVxuICBkb206ICh7dGFnLCBhdHRycywgY29udGVudHN9LCBvcHRzKSAtPlxuICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IHRhZ1xuICAgIGZvciBrLCB2IG9mIGF0dHJzXG4gICAgICBpZiB2IGluc3RhbmNlb2YgQXJyYXkgdGhlbiB2ID0gdi5qb2luICcgJ1xuICAgICAgdmlldy5zZXRBdHRyaWJ1dGUgaywgdlxuICAgIGlmIGNvbnRlbnRzP1xuICAgICAgaWYgY29udGVudHMuY29uc3RydWN0b3IgaXNudCBBcnJheVxuICAgICAgICBjb250ZW50cyA9IFtjb250ZW50c11cbiAgICAgIGZvciBjaGlsZCBpbiBjb250ZW50c1xuICAgICAgICB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXIgY2hpbGQsIG9wdHNcbiAgICB2aWV3XG5cbiAgaHRtbDogKHtjb250ZW50LCBibG9jayA9IGZhbHNlfSkgLT5cbiAgICB2aWV3ID0gQHJlbmRlciBpZiBibG9jayB0aGVuIEB0YWdzLmRpdigpIGVsc2UgQHRhZ3Muc3BhbigpXG4gICAgdmlldy5pbm5lckhUTUwgPSBjb250ZW50XG4gICAgdmlldyA9IGlmIHZpZXcuY2hpbGRyZW4ubGVuZ3RoID09IDEgdGhlbiB2aWV3LmNoaWxkcmVuWzBdIGVsc2Ugdmlld1xuXG4gIHRyZWU6ICh7aGVhZCwgY2hpbGRyZW4sIGV4cGFuZH0sIG9wdHMpIC0+XG4gICAgQGluay50cmVlLnRyZWVWaWV3KEByZW5kZXIoaGVhZCwgb3B0cyksXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLm1hcCgoeCk9PkByZW5kZXIoQHRhZ3MuZGl2KFt4XSksIG9wdHMpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kOiBleHBhbmQpXG5cbiAgbGF6eTogKHtoZWFkLCBpZH0sIG9wdHMpIC0+XG4gICAgY29ubiA9IGNsaWVudC5jb25uXG4gICAgaWYgb3B0cy5yZWdpc3Rlckxhenk/XG4gICAgICBvcHRzLnJlZ2lzdGVyTGF6eSBpZFxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnVW5yZWdpc3RlcmVkIGxhenkgdmlldydcbiAgICB2aWV3ID0gQGluay50cmVlLnRyZWVWaWV3IEByZW5kZXIoaGVhZCwgb3B0cyksIFtdLFxuICAgICAgb25Ub2dnbGU6IG9uY2UgPT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBjbGllbnQuY29ubiA9PSBjb25uXG4gICAgICAgIGdldGxhenkoaWQpLnRoZW4gKGNoaWxkcmVuKSA9PlxuICAgICAgICAgIGJvZHkgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IgJzpzY29wZSA+IC5ib2R5J1xuICAgICAgICAgIGNoaWxkcmVuLm1hcCgoeCkgPT4gQHJlbmRlcihAdGFncy5kaXYoW3hdKSwgb3B0cykpLmZvckVhY2ggKHgpID0+XG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKEBpbmsuYW5zaVRvSFRNTCh4KSlcblxuICBzdWJ0cmVlOiAoe2xhYmVsLCBjaGlsZH0sIG9wdHMpIC0+XG4gICAgQHJlbmRlciAoaWYgY2hpbGQudHlwZSA9PSBcInRyZWVcIlxuICAgICAgdHlwZTogXCJ0cmVlXCJcbiAgICAgIGhlYWQ6IEB0YWdzLnNwYW4gW2xhYmVsLCBjaGlsZC5oZWFkXVxuICAgICAgY2hpbGRyZW46IGNoaWxkLmNoaWxkcmVuXG4gICAgICAjIGNoaWxkcmVuOiBjaGlsZC5jaGlsZHJlbi5tYXAoKHgpID0+IEB0YWdzLnNwYW4gXCJndXR0ZWRcIiwgeClcbiAgICBlbHNlXG4gICAgICBAdGFncy5zcGFuIFwiZ3V0dGVkXCIsIFtsYWJlbCwgY2hpbGRdKSwgb3B0c1xuXG4gIGNvcHk6ICh7dmlldywgdGV4dH0sIG9wdHMpIC0+XG4gICAgdmlldyA9IEByZW5kZXIgdmlldywgb3B0c1xuICAgIGF0b20uY29tbWFuZHMuYWRkIHZpZXcsXG4gICAgICAnY29yZTpjb3B5JzogKGUpIC0+XG4gICAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlIHRleHRcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZpZXdcblxuICBsaW5rOiAoe2ZpbGUsIGxpbmUsIGNvbnRlbnRzfSkgLT5cbiAgICB2aWV3ID0gQHJlbmRlciBAdGFncy5hIHtocmVmOiAnIyd9LCBjb250ZW50c1xuICAgICMgVE9ETzogbWF5YmUgbmVlZCB0byBkaXNwb3NlIG9mIHRoZSB0b29sdGlwIG9uY2xpY2sgYW5kIHJlYWRkIHRoZW0sIGJ1dFxuICAgICMgdGhhdCBkb2Vzbid0IHNlZW0gdG8gYmUgbmVjZXNzYXJ5XG4gICAgaWYgQGluay5PcGVuZXIuaXNVbnRpdGxlZChmaWxlKVxuICAgICAgdHQgPSBhdG9tLnRvb2x0aXBzLmFkZCB2aWV3LCB0aXRsZTogLT4gJ3VudGl0bGVkJ1xuICAgIGVsc2VcbiAgICAgIHR0ID0gYXRvbS50b29sdGlwcy5hZGQgdmlldywgdGl0bGU6IC0+IGZpbGVcbiAgICB2aWV3Lm9uY2xpY2sgPSAoZSkgPT5cbiAgICAgIEBpbmsuT3BlbmVyLm9wZW4oZmlsZSwgbGluZSwge1xuICAgICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJylcbiAgICAgIH0pXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmlldy5hZGRFdmVudExpc3RlbmVyICdET01Ob2RlUmVtb3ZlZEZyb21Eb2N1bWVudCcsID0+XG4gICAgICB0dC5kaXNwb3NlKClcbiAgICB2aWV3XG5cbiAgbnVtYmVyOiAoe3ZhbHVlLCBmdWxsfSkgLT5cbiAgICByb3VuZGVkID0gdmFsdWUudG9QcmVjaXNpb24oMylcbiAgICByb3VuZGVkICs9ICfigKYnIHVubGVzcyByb3VuZGVkLnRvU3RyaW5nKCkubGVuZ3RoID49IGZ1bGwubGVuZ3RoXG4gICAgdmlldyA9IEByZW5kZXIgQHRhZ3Muc3BhbiAnc3ludGF4LS1jb25zdGFudCBzeW50YXgtLW51bWVyaWMnLCByb3VuZGVkXG4gICAgaXNmdWxsID0gZmFsc2VcbiAgICB2aWV3Lm9uY2xpY2sgPSAoZSkgLT5cbiAgICAgIHZpZXcuaW5uZXJUZXh0ID0gaWYgIWlzZnVsbCB0aGVuIGZ1bGwgZWxzZSByb3VuZGVkXG4gICAgICBpc2Z1bGwgPSAhaXNmdWxsXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmlld1xuXG4gIGNvZGU6ICh7dGV4dCwgYXR0cnMsIHNjb3BlfSkgLT5cbiAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLmp1bGlhXCIpXG4gICAgYmxvY2sgPSBhdHRycz8uYmxvY2sgfHwgZmFsc2VcbiAgICBoaWdobGlnaHRlZCA9IEhpZ2hsaWdodGVyLmhpZ2hsaWdodCh0ZXh0LCBncmFtbWFyLCB7c2NvcGVQcmVmaXg6ICdzeW50YXgtLScsIGJsb2NrfSlcbiAgICBAcmVuZGVyIHt0eXBlOiAnaHRtbCcsIGJsb2NrLCBjb250ZW50OiBoaWdobGlnaHRlZH1cblxuICBsYXRleDogKHthdHRycywgdGV4dH0pIC0+XG4gICAgYmxvY2sgPSBhdHRycz8uYmxvY2sgfHwgZmFsc2VcbiAgICBsYXRleCA9IEBpbmsuS2FUZVgudGV4aWZ5KHRleHQsIGJsb2NrKVxuICAgIEByZW5kZXIge3R5cGU6ICdodG1sJywgYmxvY2ssIGNvbnRlbnQ6IGxhdGV4fVxuXG4gIHZpZXdzOlxuICAgIGRvbTogICAgIChhLi4uKSAtPiB2aWV3cy5kb20gIGEuLi5cbiAgICBodG1sOiAgICAoYS4uLikgLT4gdmlld3MuaHRtbCBhLi4uXG4gICAgdHJlZTogICAgKGEuLi4pIC0+IHZpZXdzLnRyZWUgYS4uLlxuICAgIGxhenk6ICAgIChhLi4uKSAtPiB2aWV3cy5sYXp5IGEuLi5cbiAgICBzdWJ0cmVlOiAoYS4uLikgLT4gdmlld3Muc3VidHJlZSBhLi4uXG4gICAgbGluazogICAgKGEuLi4pIC0+IHZpZXdzLmxpbmsgYS4uLlxuICAgIGNvcHk6ICAgIChhLi4uKSAtPiB2aWV3cy5jb3B5IGEuLi5cbiAgICBudW1iZXI6ICAoYS4uLikgLT4gdmlld3MubnVtYmVyIGEuLi5cbiAgICBjb2RlOiAgICAoYS4uLikgLT4gdmlld3MuY29kZSBhLi4uXG4gICAgbGF0ZXg6ICAgKGEuLi4pIC0+IHZpZXdzLmxhdGV4IGEuLi5cblxuICByZW5kZXI6IChkYXRhLCBvcHRzID0ge30pIC0+XG4gICAgaWYgQHZpZXdzLmhhc093blByb3BlcnR5KGRhdGEudHlwZSlcbiAgICAgIHIgPSBAdmlld3NbZGF0YS50eXBlXShkYXRhLCBvcHRzKVxuICAgICAgQGluay5hbnNpVG9IVE1MKHIpXG4gICAgICByXG4gICAgZWxzZSBpZiBkYXRhPy5jb25zdHJ1Y3RvciBpcyBTdHJpbmdcbiAgICAgIG5ldyBUZXh0IGRhdGFcbiAgICBlbHNlXG4gICAgICBAcmVuZGVyIFwianVsaWEtY2xpZW50OiBjYW4ndCByZW5kZXIgI3tkYXRhPy50eXBlfVwiXG5cbiAgdGFnOiAodGFnLCBhdHRycywgY29udGVudHMpIC0+XG4gICAgaWYgYXR0cnM/LmNvbnN0cnVjdG9yIGlzIFN0cmluZ1xuICAgICAgYXR0cnMgPSBjbGFzczogYXR0cnNcbiAgICBpZiBhdHRycz8uY29uc3RydWN0b3IgaXNudCBPYmplY3RcbiAgICAgIFtjb250ZW50cywgYXR0cnNdID0gW2F0dHJzLCB1bmRlZmluZWRdXG4gICAgdHlwZTogJ2RvbSdcbiAgICB0YWc6IHRhZ1xuICAgIGF0dHJzOiBhdHRyc1xuICAgIGNvbnRlbnRzOiBjb250ZW50c1xuXG4gIHRhZ3M6IHt9XG5cblsnZGl2JywgJ3NwYW4nLCAnYScsICdzdHJvbmcnLCAndGFibGUnLCAndHInLCAndGQnLCAnd2VidmlldyddLmZvckVhY2ggKHRhZykgLT5cbiAgdmlld3MudGFnc1t0YWddID0gKGF0dHJzLCBjb250ZW50cykgLT5cbiAgICB2aWV3cy50YWcgdGFnLCBhdHRycywgY29udGVudHNcbiJdfQ==
