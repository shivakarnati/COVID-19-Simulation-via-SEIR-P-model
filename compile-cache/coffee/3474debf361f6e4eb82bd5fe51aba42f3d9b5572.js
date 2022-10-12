(function() {
  var CompositeDisposable, Disposable, Emitter, allmodules, client, debounce, getmodule, ismodule, ref, ref1, show;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable, Emitter = ref.Emitter;

  debounce = require('underscore-plus').debounce;

  client = require('../connection').client;

  show = require('../ui/selector').show;

  ref1 = client["import"](['module', 'allmodules', 'ismodule']), getmodule = ref1.module, allmodules = ref1.allmodules, ismodule = ref1.ismodule;

  module.exports = {
    activate: function() {
      this.subs = new CompositeDisposable;
      this.itemSubs = new CompositeDisposable;
      this.subs.add(this.emitter = new Emitter);
      this.subs.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function(item) {
          return _this.updateForItem(item);
        };
      })(this)));
      this.subs.add(client.onAttached((function(_this) {
        return function() {
          return _this.updateForItem();
        };
      })(this)));
      return this.subs.add(client.onDetached((function(_this) {
        return function() {
          return _this.updateForItem();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    _current: null,
    lastEditorModule: null,
    setCurrent: function(_current, editor) {
      this._current = _current;
      if (editor) {
        this.lastEditorModule = this._current;
      }
      return this.emitter.emit('did-change', this._current);
    },
    onDidChange: function(f) {
      return this.emitter.on('did-change', f);
    },
    current: function(m) {
      var inactive, main, sub, subInactive;
      if (m == null) {
        m = this._current;
      }
      if (m == null) {
        return;
      }
      main = m.main, inactive = m.inactive, sub = m.sub, subInactive = m.subInactive;
      if (main === this.follow) {
        return this.current(this.lastEditorModule);
      }
      if (!main || inactive) {
        return "Main";
      } else if (!sub || subInactive) {
        return main;
      } else {
        return main + "." + sub;
      }
    },
    itemSelector: 'atom-text-editor[data-grammar="source julia"], .julia-console.julia, ink-terminal, .ink-workspace',
    isValidItem: function(item) {
      var ref2;
      return (ref2 = atom.views.getView(item)) != null ? ref2.matches(this.itemSelector) : void 0;
    },
    autodetect: 'Auto Detect',
    follow: 'Follow Editor',
    chooseModule: function() {
      var ised, item;
      item = atom.workspace.getActivePaneItem();
      ised = atom.workspace.isTextEditor(item);
      if (!this.isValidItem(item)) {
        return;
      }
      return client.require('change modules', (function(_this) {
        return function() {
          var active, modules;
          if ((item = atom.workspace.getActivePaneItem())) {
            active = item.juliaModule || (ised ? _this.autodetect : 'Main');
            modules = allmodules().then(function(modules) {
              if (ised) {
                modules.unshift(_this.autodetect);
              } else if (_this.lastEditorModule != null) {
                modules.unshift(_this.follow);
              }
              return modules;
            });
            modules["catch"](function(err) {
              return console.log(err);
            });
            return show(modules, {
              active: active
            }).then(function(mod) {
              if (mod == null) {
                return;
              }
              if (mod === _this.autodetect) {
                delete item.juliaModule;
              } else {
                item.juliaModule = mod;
              }
              if (typeof item.setModule === "function") {
                item.setModule(mod !== _this.autodetect ? mod : void 0);
              }
              return _this.updateForItem(item);
            });
          }
        };
      })(this));
    },
    updateForItem: function(item) {
      var mod;
      if (item == null) {
        item = atom.workspace.getActivePaneItem();
      }
      this.itemSubs.dispose();
      if (!this.isValidItem(item)) {
        this.itemSubs.add(item != null ? typeof item.onDidChangeGrammar === "function" ? item.onDidChangeGrammar((function(_this) {
          return function() {
            return _this.updateForItem();
          };
        })(this)) : void 0 : void 0);
        return this.setCurrent();
      } else if (!client.isActive()) {
        return this.setCurrent({
          main: 'Main',
          inactive: true
        });
      } else if (atom.workspace.isTextEditor(item)) {
        return this.updateForEditor(item);
      } else {
        mod = item.juliaModule || 'Main';
        return ismodule(mod).then((function(_this) {
          return function(ismod) {
            return _this.setCurrent({
              main: mod,
              inactive: !ismod
            });
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      }
    },
    updateForEditor: function(editor) {
      this.setCurrent({
        main: editor.juliaModule || 'Main'
      }, true);
      this.setEditorModule(editor);
      return this.itemSubs.add(editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.setEditorModuleLazy(editor);
        };
      })(this)));
    },
    getEditorModule: function(ed, bufferPosition) {
      var column, data, ref2, row, sels;
      if (bufferPosition == null) {
        bufferPosition = null;
      }
      if (!client.isActive()) {
        return;
      }
      if (bufferPosition) {
        row = bufferPosition.row, column = bufferPosition.column;
      } else {
        sels = ed.getSelections();
        ref2 = sels[sels.length - 1].getBufferRange().end, row = ref2.row, column = ref2.column;
      }
      data = {
        path: client.editorPath(ed),
        code: ed.getText(),
        row: row + 1,
        column: column + 1,
        module: ed.juliaModule
      };
      return getmodule(data)["catch"]((function(_this) {
        return function(err) {
          return console.log(err);
        };
      })(this));
    },
    setEditorModule: function(ed) {
      var modulePromise;
      modulePromise = this.getEditorModule(ed);
      if (!modulePromise) {
        return;
      }
      return modulePromise.then((function(_this) {
        return function(mod) {
          if (atom.workspace.getActivePaneItem() === ed) {
            return _this.setCurrent(mod, true);
          }
        };
      })(this));
    },
    setEditorModuleLazy: debounce((function(ed) {
      return this.setEditorModule(ed);
    }), 100),
    activateView: function() {
      var disposable, i, len, ref2, x;
      this.onDidChange((function(_this) {
        return function(c) {
          return _this.updateView(c);
        };
      })(this));
      this.dom = document.createElement('span');
      this.dom.classList.add('julia', 'inline-block');
      this.mainView = document.createElement('a');
      this.dividerView = document.createElement('span');
      this.subView = document.createElement('span');
      ref2 = [this.mainView, this.dividerView, this.subView];
      for (i = 0, len = ref2.length; i < len; i++) {
        x = ref2[i];
        this.dom.appendChild(x);
      }
      this.mainView.onclick = (function(_this) {
        return function() {
          return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePaneItem()), 'julia-client:set-working-module');
        };
      })(this);
      atom.tooltips.add(this.dom, {
        title: (function(_this) {
          return function() {
            return "Currently working in module " + (_this.current());
          };
        })(this)
      });
      this.tile = this.statusBar.addRightTile({
        item: this.dom,
        priority: 5
      });
      disposable = new Disposable((function(_this) {
        return function() {
          _this.tile.destroy();
          return delete _this.tile;
        };
      })(this));
      this.subs.add(disposable);
      return disposable;
    },
    updateView: function(m) {
      var i, inactive, j, len, len1, main, ref2, ref3, results, sub, subInactive, view;
      if (m == null) {
        m = this._current;
      }
      if (this.tile == null) {
        return;
      }
      if (m == null) {
        return this.dom.style.display = 'none';
      } else {
        main = m.main, sub = m.sub, inactive = m.inactive, subInactive = m.subInactive;
        if (main === this.follow) {
          return this.updateView(this.lastEditorModule);
        }
        this.dom.style.display = '';
        this.mainView.innerText = 'Module: ' + (main || 'Main');
        if (sub) {
          this.subView.innerText = sub;
          this.dividerView.innerText = '/';
        } else {
          ref2 = [this.subView, this.dividerView];
          for (i = 0, len = ref2.length; i < len; i++) {
            view = ref2[i];
            view.innerText = '';
          }
        }
        if (inactive) {
          return this.dom.classList.add('fade');
        } else {
          this.dom.classList.remove('fade');
          ref3 = [this.subView, this.dividerView];
          results = [];
          for (j = 0, len1 = ref3.length; j < len1; j++) {
            view = ref3[j];
            if (subInactive) {
              results.push(view.classList.add('fade'));
            } else {
              results.push(view.classList.remove('fade'));
            }
          }
          return results;
        }
      }
    },
    consumeStatusBar: function(bar) {
      var disposable;
      this.statusBar = bar;
      disposable = this.activateView();
      this.updateView(this._current);
      return disposable;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3J1bnRpbWUvbW9kdWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBOztFQUFBLE1BQTZDLE9BQUEsQ0FBUSxNQUFSLENBQTdDLEVBQUMsNkNBQUQsRUFBc0IsMkJBQXRCLEVBQWtDOztFQUNqQyxXQUFZLE9BQUEsQ0FBUSxpQkFBUjs7RUFFWixTQUFVLE9BQUEsQ0FBUSxlQUFSOztFQUNWLE9BQVEsT0FBQSxDQUFRLGdCQUFSOztFQUVULE9BQTRDLE1BQU0sRUFBQyxNQUFELEVBQU4sQ0FBYyxDQUFDLFFBQUQsRUFBVyxZQUFYLEVBQXlCLFVBQXpCLENBQWQsQ0FBNUMsRUFBUyxpQkFBUixNQUFELEVBQW9CLDRCQUFwQixFQUFnQzs7RUFFaEMsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO01BQ1osSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJO01BQ2hCLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxPQUF6QjtNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQVUsS0FBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmO1FBQVY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLENBQVY7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQixDQUFWO2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxhQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsQ0FBVjtJQVBRLENBQVY7SUFTQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBRFUsQ0FUWjtJQVlBLFFBQUEsRUFBVSxJQVpWO0lBYUEsZ0JBQUEsRUFBa0IsSUFibEI7SUFlQSxVQUFBLEVBQVksU0FBQyxRQUFELEVBQVksTUFBWjtNQUFDLElBQUMsQ0FBQSxXQUFEO01BQ1gsSUFBRyxNQUFIO1FBQWUsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxTQUFwQzs7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxZQUFkLEVBQTRCLElBQUMsQ0FBQSxRQUE3QjtJQUZVLENBZlo7SUFtQkEsV0FBQSxFQUFhLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFlBQVosRUFBMEIsQ0FBMUI7SUFBUCxDQW5CYjtJQXFCQSxPQUFBLEVBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTs7UUFEUSxJQUFJLElBQUMsQ0FBQTs7TUFDYixJQUFjLFNBQWQ7QUFBQSxlQUFBOztNQUNDLGFBQUQsRUFBTyxxQkFBUCxFQUFpQixXQUFqQixFQUFzQjtNQUN0QixJQUFHLElBQUEsS0FBUSxJQUFDLENBQUEsTUFBWjtBQUF3QixlQUFPLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLGdCQUFWLEVBQS9COztNQUNBLElBQUcsQ0FBSSxJQUFKLElBQVksUUFBZjtlQUNFLE9BREY7T0FBQSxNQUVLLElBQUcsQ0FBSSxHQUFKLElBQVcsV0FBZDtlQUNILEtBREc7T0FBQSxNQUFBO2VBR0EsSUFBRCxHQUFNLEdBQU4sR0FBUyxJQUhSOztJQU5FLENBckJUO0lBa0NBLFlBQUEsRUFBYyxtR0FsQ2Q7SUFvQ0EsV0FBQSxFQUFhLFNBQUMsSUFBRDtBQUFVLFVBQUE7NkRBQXdCLENBQUUsT0FBMUIsQ0FBa0MsSUFBQyxDQUFBLFlBQW5DO0lBQVYsQ0FwQ2I7SUFzQ0EsVUFBQSxFQUFZLGFBdENaO0lBdUNBLE1BQUEsRUFBUSxlQXZDUjtJQXlDQSxZQUFBLEVBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBO01BQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixJQUE1QjtNQUNQLElBQUEsQ0FBYyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQWIsQ0FBZDtBQUFBLGVBQUE7O2FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDL0IsY0FBQTtVQUFBLElBQUcsQ0FBQyxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVIsQ0FBSDtZQUNFLE1BQUEsR0FBUyxJQUFJLENBQUMsV0FBTCxJQUFvQixDQUFJLElBQUgsR0FBYSxLQUFDLENBQUEsVUFBZCxHQUE4QixNQUEvQjtZQUM3QixPQUFBLEdBQVUsVUFBQSxDQUFBLENBQVksQ0FBQyxJQUFiLENBQWtCLFNBQUMsT0FBRDtjQUMxQixJQUFHLElBQUg7Z0JBQ0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBQyxDQUFBLFVBQWpCLEVBREY7ZUFBQSxNQUVLLElBQUcsOEJBQUg7Z0JBQ0gsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBQyxDQUFBLE1BQWpCLEVBREc7O3FCQUVMO1lBTDBCLENBQWxCO1lBTVYsT0FBTyxFQUFDLEtBQUQsRUFBUCxDQUFjLFNBQUMsR0FBRDtxQkFDWixPQUFPLENBQUMsR0FBUixDQUFZLEdBQVo7WUFEWSxDQUFkO21CQUVBLElBQUEsQ0FBSyxPQUFMLEVBQWM7Y0FBRSxRQUFBLE1BQUY7YUFBZCxDQUF5QixDQUFDLElBQTFCLENBQStCLFNBQUMsR0FBRDtjQUM3QixJQUFjLFdBQWQ7QUFBQSx1QkFBQTs7Y0FDQSxJQUFHLEdBQUEsS0FBTyxLQUFDLENBQUEsVUFBWDtnQkFDRSxPQUFPLElBQUksQ0FBQyxZQURkO2VBQUEsTUFBQTtnQkFHRSxJQUFJLENBQUMsV0FBTCxHQUFtQixJQUhyQjs7O2dCQUlBLElBQUksQ0FBQyxVQUFrQixHQUFBLEtBQVMsS0FBQyxDQUFBLFVBQWpCLEdBQUEsR0FBQSxHQUFBOztxQkFDaEIsS0FBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmO1lBUDZCLENBQS9CLEVBVkY7O1FBRCtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztJQUpZLENBekNkO0lBaUVBLGFBQUEsRUFBZSxTQUFDLElBQUQ7QUFDYixVQUFBOztRQURjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBOztNQUNyQixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQTtNQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQWIsQ0FBUDtRQUNFLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixnRUFBYyxJQUFJLENBQUUsbUJBQW9CLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxvQkFBeEM7ZUFDQSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBRkY7T0FBQSxNQUdLLElBQUcsQ0FBSSxNQUFNLENBQUMsUUFBUCxDQUFBLENBQVA7ZUFDSCxJQUFDLENBQUEsVUFBRCxDQUFZO1VBQUEsSUFBQSxFQUFNLE1BQU47VUFBYyxRQUFBLEVBQVUsSUFBeEI7U0FBWixFQURHO09BQUEsTUFFQSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixJQUE1QixDQUFIO2VBQ0gsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsRUFERztPQUFBLE1BQUE7UUFHSCxHQUFBLEdBQU0sSUFBSSxDQUFDLFdBQUwsSUFBb0I7ZUFDMUIsUUFBQSxDQUFTLEdBQVQsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7bUJBQ0osS0FBQyxDQUFBLFVBQUQsQ0FBWTtjQUFBLElBQUEsRUFBTSxHQUFOO2NBQVcsUUFBQSxFQUFVLENBQUMsS0FBdEI7YUFBWjtVQURJO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSLENBR0UsRUFBQyxLQUFELEVBSEYsQ0FHUyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7bUJBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaO1VBREs7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFQsRUFKRzs7SUFQUSxDQWpFZjtJQWtGQSxlQUFBLEVBQWlCLFNBQUMsTUFBRDtNQUNmLElBQUMsQ0FBQSxVQUFELENBQVk7UUFBQSxJQUFBLEVBQU0sTUFBTSxDQUFDLFdBQVAsSUFBc0IsTUFBNUI7T0FBWixFQUFnRCxJQUFoRDtNQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCO2FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQWMsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDN0MsS0FBQyxDQUFBLG1CQUFELENBQXFCLE1BQXJCO1FBRDZDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxDQUFkO0lBSGUsQ0FsRmpCO0lBd0ZBLGVBQUEsRUFBaUIsU0FBQyxFQUFELEVBQUssY0FBTDtBQUNmLFVBQUE7O1FBRG9CLGlCQUFpQjs7TUFDckMsSUFBQSxDQUFjLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBZDtBQUFBLGVBQUE7O01BQ0EsSUFBRyxjQUFIO1FBQ0csd0JBQUQsRUFBTSwrQkFEUjtPQUFBLE1BQUE7UUFHRSxJQUFBLEdBQU8sRUFBRSxDQUFDLGFBQUgsQ0FBQTtRQUNQLE9BQWdCLElBQUssQ0FBQSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsQ0FBZ0IsQ0FBQyxjQUF0QixDQUFBLENBQXNDLENBQUMsR0FBdkQsRUFBQyxjQUFELEVBQU0scUJBSlI7O01BS0EsSUFBQSxHQUNFO1FBQUEsSUFBQSxFQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEVBQWxCLENBQU47UUFDQSxJQUFBLEVBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUROO1FBRUEsR0FBQSxFQUFLLEdBQUEsR0FBSSxDQUZUO1FBRVksTUFBQSxFQUFRLE1BQUEsR0FBTyxDQUYzQjtRQUdBLE1BQUEsRUFBUSxFQUFFLENBQUMsV0FIWDs7YUFJRixTQUFBLENBQVUsSUFBVixDQUNFLEVBQUMsS0FBRCxFQURGLENBQ1MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7aUJBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFQ7SUFaZSxDQXhGakI7SUF3R0EsZUFBQSxFQUFpQixTQUFDLEVBQUQ7QUFDZixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsZUFBRCxDQUFpQixFQUFqQjtNQUNoQixJQUFBLENBQWMsYUFBZDtBQUFBLGVBQUE7O2FBQ0EsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDakIsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBQSxLQUFzQyxFQUF6QzttQkFDRSxLQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosRUFBaUIsSUFBakIsRUFERjs7UUFEaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0lBSGUsQ0F4R2pCO0lBK0dBLG1CQUFBLEVBQXFCLFFBQUEsQ0FBUyxDQUFDLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxlQUFELENBQWlCLEVBQWpCO0lBQVIsQ0FBRCxDQUFULEVBQXlDLEdBQXpDLENBL0dyQjtJQW1IQSxZQUFBLEVBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxVQUFELENBQVksQ0FBWjtRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO01BRUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsT0FBbkIsRUFBNEIsY0FBNUI7TUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCO01BQ1osSUFBQyxDQUFBLFdBQUQsR0FBZSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNmLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7QUFFWDtBQUFBLFdBQUEsc0NBQUE7O1FBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLENBQWlCLENBQWpCO0FBQUE7TUFFQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsR0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFuQixDQUF2QixFQUN1QixpQ0FEdkI7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BSXBCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsR0FBbkIsRUFDRTtRQUFBLEtBQUEsRUFBTyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLDhCQUFBLEdBQThCLENBQUMsS0FBQyxDQUFBLE9BQUQsQ0FBQSxDQUFEO1VBQWpDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFQO09BREY7TUFLQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxTQUFTLENBQUMsWUFBWCxDQUF3QjtRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsR0FBUDtRQUFZLFFBQUEsRUFBVSxDQUF0QjtPQUF4QjtNQUNSLFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDMUIsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7aUJBQ0EsT0FBTyxLQUFDLENBQUE7UUFGa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7TUFHYixJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxVQUFWO2FBQ0E7SUExQlksQ0FuSGQ7SUErSUEsVUFBQSxFQUFZLFNBQUMsQ0FBRDtBQUNWLFVBQUE7O1FBRFcsSUFBSSxJQUFDLENBQUE7O01BQ2hCLElBQWMsaUJBQWQ7QUFBQSxlQUFBOztNQUNBLElBQU8sU0FBUDtlQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQVgsR0FBcUIsT0FEdkI7T0FBQSxNQUFBO1FBR0csYUFBRCxFQUFPLFdBQVAsRUFBWSxxQkFBWixFQUFzQjtRQUN0QixJQUFHLElBQUEsS0FBUSxJQUFDLENBQUEsTUFBWjtBQUNFLGlCQUFPLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLGdCQUFiLEVBRFQ7O1FBRUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBWCxHQUFxQjtRQUNyQixJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsR0FBc0IsVUFBQSxHQUFhLENBQUMsSUFBQSxJQUFRLE1BQVQ7UUFDbkMsSUFBRyxHQUFIO1VBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO1VBQ3JCLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixHQUF5QixJQUYzQjtTQUFBLE1BQUE7QUFJRTtBQUFBLGVBQUEsc0NBQUE7O1lBQUEsSUFBSSxDQUFDLFNBQUwsR0FBaUI7QUFBakIsV0FKRjs7UUFLQSxJQUFHLFFBQUg7aUJBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixNQUFuQixFQURGO1NBQUEsTUFBQTtVQUdFLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsTUFBdEI7QUFDQTtBQUFBO2VBQUEsd0NBQUE7O1lBQ0UsSUFBRyxXQUFIOzJCQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixNQUFuQixHQURGO2FBQUEsTUFBQTsyQkFHRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsTUFBdEIsR0FIRjs7QUFERjt5QkFKRjtTQWJGOztJQUZVLENBL0laO0lBd0tBLGdCQUFBLEVBQWtCLFNBQUMsR0FBRDtBQUNoQixVQUFBO01BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLFVBQUEsR0FBYSxJQUFDLENBQUEsWUFBRCxDQUFBO01BQ2IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsUUFBYjthQUNBO0lBSmdCLENBeEtsQjs7QUFWRiIsInNvdXJjZXNDb250ZW50IjpbIiMgVE9ETzogdGhpcyBjb2RlIGlzIGF3ZnVsLCByZWZhY3RvclxuXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xue2RlYm91bmNlfSA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxue2NsaWVudH0gPSByZXF1aXJlICcuLi9jb25uZWN0aW9uJ1xue3Nob3d9ID0gcmVxdWlyZSAnLi4vdWkvc2VsZWN0b3InXG5cbnttb2R1bGU6IGdldG1vZHVsZSwgYWxsbW9kdWxlcywgaXNtb2R1bGV9ID0gY2xpZW50LmltcG9ydCBbJ21vZHVsZScsICdhbGxtb2R1bGVzJywgJ2lzbW9kdWxlJ11cblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaXRlbVN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzLmFkZCBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBAc3Vicy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PiBAdXBkYXRlRm9ySXRlbSBpdGVtXG4gICAgQHN1YnMuYWRkIGNsaWVudC5vbkF0dGFjaGVkID0+IEB1cGRhdGVGb3JJdGVtKClcbiAgICBAc3Vicy5hZGQgY2xpZW50Lm9uRGV0YWNoZWQgPT4gQHVwZGF0ZUZvckl0ZW0oKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnMuZGlzcG9zZSgpXG5cbiAgX2N1cnJlbnQ6IG51bGxcbiAgbGFzdEVkaXRvck1vZHVsZTogbnVsbFxuXG4gIHNldEN1cnJlbnQ6IChAX2N1cnJlbnQsIGVkaXRvcikgLT5cbiAgICBpZiBlZGl0b3IgdGhlbiBAbGFzdEVkaXRvck1vZHVsZSA9IEBfY3VycmVudFxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UnLCBAX2N1cnJlbnRcblxuICBvbkRpZENoYW5nZTogKGYpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlJywgZlxuXG4gIGN1cnJlbnQ6IChtID0gQF9jdXJyZW50KSAtPlxuICAgIHJldHVybiB1bmxlc3MgbT9cbiAgICB7bWFpbiwgaW5hY3RpdmUsIHN1Yiwgc3ViSW5hY3RpdmV9ID0gbVxuICAgIGlmIG1haW4gaXMgQGZvbGxvdyB0aGVuIHJldHVybiBAY3VycmVudCBAbGFzdEVkaXRvck1vZHVsZVxuICAgIGlmIG5vdCBtYWluIG9yIGluYWN0aXZlXG4gICAgICBcIk1haW5cIlxuICAgIGVsc2UgaWYgbm90IHN1YiBvciBzdWJJbmFjdGl2ZVxuICAgICAgbWFpblxuICAgIGVsc2VcbiAgICAgIFwiI3ttYWlufS4je3N1Yn1cIlxuXG4gICMgQ2hvb3NpbmcgTW9kdWxlc1xuXG4gIGl0ZW1TZWxlY3RvcjogJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyPVwic291cmNlIGp1bGlhXCJdLCAuanVsaWEtY29uc29sZS5qdWxpYSwgaW5rLXRlcm1pbmFsLCAuaW5rLXdvcmtzcGFjZSdcblxuICBpc1ZhbGlkSXRlbTogKGl0ZW0pIC0+IGF0b20udmlld3MuZ2V0VmlldyhpdGVtKT8ubWF0Y2hlcyBAaXRlbVNlbGVjdG9yXG5cbiAgYXV0b2RldGVjdDogJ0F1dG8gRGV0ZWN0J1xuICBmb2xsb3c6ICdGb2xsb3cgRWRpdG9yJ1xuXG4gIGNob29zZU1vZHVsZTogLT5cbiAgICBpdGVtID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGlzZWQgPSBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IgaXRlbVxuICAgIHJldHVybiB1bmxlc3MgQGlzVmFsaWRJdGVtIGl0ZW1cbiAgICBjbGllbnQucmVxdWlyZSAnY2hhbmdlIG1vZHVsZXMnLCA9PlxuICAgICAgaWYgKGl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgICAgICBhY3RpdmUgPSBpdGVtLmp1bGlhTW9kdWxlIG9yIChpZiBpc2VkIHRoZW4gQGF1dG9kZXRlY3QgZWxzZSAnTWFpbicpXG4gICAgICAgIG1vZHVsZXMgPSBhbGxtb2R1bGVzKCkudGhlbiAobW9kdWxlcykgPT5cbiAgICAgICAgICBpZiBpc2VkXG4gICAgICAgICAgICBtb2R1bGVzLnVuc2hpZnQgQGF1dG9kZXRlY3RcbiAgICAgICAgICBlbHNlIGlmIEBsYXN0RWRpdG9yTW9kdWxlP1xuICAgICAgICAgICAgbW9kdWxlcy51bnNoaWZ0IEBmb2xsb3dcbiAgICAgICAgICBtb2R1bGVzXG4gICAgICAgIG1vZHVsZXMuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICBjb25zb2xlLmxvZyBlcnJcbiAgICAgICAgc2hvdyhtb2R1bGVzLCB7IGFjdGl2ZSB9KS50aGVuIChtb2QpID0+XG4gICAgICAgICAgcmV0dXJuIHVubGVzcyBtb2Q/XG4gICAgICAgICAgaWYgbW9kIGlzIEBhdXRvZGV0ZWN0XG4gICAgICAgICAgICBkZWxldGUgaXRlbS5qdWxpYU1vZHVsZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGl0ZW0uanVsaWFNb2R1bGUgPSBtb2RcbiAgICAgICAgICBpdGVtLnNldE1vZHVsZT8obW9kIGlmIG1vZCBpc250IEBhdXRvZGV0ZWN0KVxuICAgICAgICAgIEB1cGRhdGVGb3JJdGVtIGl0ZW1cblxuICB1cGRhdGVGb3JJdGVtOiAoaXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkpIC0+XG4gICAgQGl0ZW1TdWJzLmRpc3Bvc2UoKVxuICAgIGlmIG5vdCBAaXNWYWxpZEl0ZW0gaXRlbVxuICAgICAgQGl0ZW1TdWJzLmFkZCBpdGVtPy5vbkRpZENoYW5nZUdyYW1tYXI/ID0+IEB1cGRhdGVGb3JJdGVtKClcbiAgICAgIEBzZXRDdXJyZW50KClcbiAgICBlbHNlIGlmIG5vdCBjbGllbnQuaXNBY3RpdmUoKVxuICAgICAgQHNldEN1cnJlbnQgbWFpbjogJ01haW4nLCBpbmFjdGl2ZTogdHJ1ZVxuICAgIGVsc2UgaWYgYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yIGl0ZW1cbiAgICAgIEB1cGRhdGVGb3JFZGl0b3IgaXRlbVxuICAgIGVsc2VcbiAgICAgIG1vZCA9IGl0ZW0uanVsaWFNb2R1bGUgb3IgJ01haW4nXG4gICAgICBpc21vZHVsZShtb2QpXG4gICAgICAgIC50aGVuIChpc21vZCkgPT5cbiAgICAgICAgICBAc2V0Q3VycmVudCBtYWluOiBtb2QsIGluYWN0aXZlOiAhaXNtb2RcbiAgICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgICAgY29uc29sZS5sb2cgZXJyXG5cbiAgdXBkYXRlRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIEBzZXRDdXJyZW50IG1haW46IGVkaXRvci5qdWxpYU1vZHVsZSBvciAnTWFpbicsIHRydWVcbiAgICBAc2V0RWRpdG9yTW9kdWxlIGVkaXRvclxuICAgIEBpdGVtU3Vicy5hZGQgZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24gPT5cbiAgICAgIEBzZXRFZGl0b3JNb2R1bGVMYXp5IGVkaXRvclxuXG4gIGdldEVkaXRvck1vZHVsZTogKGVkLCBidWZmZXJQb3NpdGlvbiA9IG51bGwpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBjbGllbnQuaXNBY3RpdmUoKVxuICAgIGlmIGJ1ZmZlclBvc2l0aW9uXG4gICAgICB7cm93LCBjb2x1bW59ID0gYnVmZmVyUG9zaXRpb25cbiAgICBlbHNlXG4gICAgICBzZWxzID0gZWQuZ2V0U2VsZWN0aW9ucygpXG4gICAgICB7cm93LCBjb2x1bW59ID0gc2Vsc1tzZWxzLmxlbmd0aCAtIDFdLmdldEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgZGF0YSA9XG4gICAgICBwYXRoOiBjbGllbnQuZWRpdG9yUGF0aChlZClcbiAgICAgIGNvZGU6IGVkLmdldFRleHQoKVxuICAgICAgcm93OiByb3crMSwgY29sdW1uOiBjb2x1bW4rMVxuICAgICAgbW9kdWxlOiBlZC5qdWxpYU1vZHVsZVxuICAgIGdldG1vZHVsZShkYXRhKVxuICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgIGNvbnNvbGUubG9nIGVyclxuXG4gIHNldEVkaXRvck1vZHVsZTogKGVkKSAtPlxuICAgIG1vZHVsZVByb21pc2UgPSBAZ2V0RWRpdG9yTW9kdWxlIGVkXG4gICAgcmV0dXJuIHVubGVzcyBtb2R1bGVQcm9taXNlXG4gICAgbW9kdWxlUHJvbWlzZS50aGVuIChtb2QpID0+XG4gICAgICBpZiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpIGlzIGVkXG4gICAgICAgIEBzZXRDdXJyZW50IG1vZCwgdHJ1ZVxuXG4gIHNldEVkaXRvck1vZHVsZUxhenk6IGRlYm91bmNlICgoZWQpIC0+IEBzZXRFZGl0b3JNb2R1bGUoZWQpKSwgMTAwXG5cbiAgIyBUaGUgVmlld1xuXG4gIGFjdGl2YXRlVmlldzogLT5cbiAgICBAb25EaWRDaGFuZ2UgKGMpID0+IEB1cGRhdGVWaWV3IGNcblxuICAgIEBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdzcGFuJ1xuICAgIEBkb20uY2xhc3NMaXN0LmFkZCAnanVsaWEnLCAnaW5saW5lLWJsb2NrJ1xuXG4gICAgQG1haW5WaWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYSdcbiAgICBAZGl2aWRlclZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdzcGFuJ1xuICAgIEBzdWJWaWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnc3BhbidcblxuICAgIEBkb20uYXBwZW5kQ2hpbGQgeCBmb3IgeCBpbiBbQG1haW5WaWV3LCBAZGl2aWRlclZpZXcsIEBzdWJWaWV3XVxuXG4gICAgQG1haW5WaWV3Lm9uY2xpY2sgPSA9PlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdqdWxpYS1jbGllbnQ6c2V0LXdvcmtpbmctbW9kdWxlJ1xuXG4gICAgYXRvbS50b29sdGlwcy5hZGQgQGRvbSxcbiAgICAgIHRpdGxlOiA9PiBcIkN1cnJlbnRseSB3b3JraW5nIGluIG1vZHVsZSAje0BjdXJyZW50KCl9XCJcblxuICAgICMgQE5PVEU6IEdyYW1tYXIgc2VsZWN0b3IgaGFzIGBwcmlvcml0eWAgMTAgYW5kIHRodXMgc2V0IHRoZSBpdCB0byBhIGJpdCBsb3dlclxuICAgICMgICAgICAgIHRoYW4gdGhhdCB0byBhdm9pZCBjb2xsaXNpb24gdGhhdCBtYXkgY2F1c2UgdW5leHBlY3RlZCByZXN1bHQuXG4gICAgQHRpbGUgPSBAc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSBpdGVtOiBAZG9tLCBwcmlvcml0eTogNVxuICAgIGRpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSg9PlxuICAgICAgQHRpbGUuZGVzdHJveSgpXG4gICAgICBkZWxldGUgQHRpbGUpXG4gICAgQHN1YnMuYWRkKGRpc3Bvc2FibGUpXG4gICAgZGlzcG9zYWJsZVxuXG4gIHVwZGF0ZVZpZXc6IChtID0gQF9jdXJyZW50KSAtPlxuICAgIHJldHVybiB1bmxlc3MgQHRpbGU/XG4gICAgaWYgbm90IG0/XG4gICAgICBAZG9tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICBlbHNlXG4gICAgICB7bWFpbiwgc3ViLCBpbmFjdGl2ZSwgc3ViSW5hY3RpdmV9ID0gbVxuICAgICAgaWYgbWFpbiBpcyBAZm9sbG93XG4gICAgICAgIHJldHVybiBAdXBkYXRlVmlldyBAbGFzdEVkaXRvck1vZHVsZVxuICAgICAgQGRvbS5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICAgIEBtYWluVmlldy5pbm5lclRleHQgPSAnTW9kdWxlOiAnICsgKG1haW4gb3IgJ01haW4nKVxuICAgICAgaWYgc3ViXG4gICAgICAgIEBzdWJWaWV3LmlubmVyVGV4dCA9IHN1YlxuICAgICAgICBAZGl2aWRlclZpZXcuaW5uZXJUZXh0ID0gJy8nXG4gICAgICBlbHNlXG4gICAgICAgIHZpZXcuaW5uZXJUZXh0ID0gJycgZm9yIHZpZXcgaW4gW0BzdWJWaWV3LCBAZGl2aWRlclZpZXddXG4gICAgICBpZiBpbmFjdGl2ZVxuICAgICAgICBAZG9tLmNsYXNzTGlzdC5hZGQgJ2ZhZGUnXG4gICAgICBlbHNlXG4gICAgICAgIEBkb20uY2xhc3NMaXN0LnJlbW92ZSAnZmFkZSdcbiAgICAgICAgZm9yIHZpZXcgaW4gW0BzdWJWaWV3LCBAZGl2aWRlclZpZXddXG4gICAgICAgICAgaWYgc3ViSW5hY3RpdmVcbiAgICAgICAgICAgIHZpZXcuY2xhc3NMaXN0LmFkZCAnZmFkZSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2aWV3LmNsYXNzTGlzdC5yZW1vdmUgJ2ZhZGUnXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKGJhcikgLT5cbiAgICBAc3RhdHVzQmFyID0gYmFyXG4gICAgZGlzcG9zYWJsZSA9IEBhY3RpdmF0ZVZpZXcoKVxuICAgIEB1cGRhdGVWaWV3IEBfY3VycmVudFxuICAgIGRpc3Bvc2FibGVcbiJdfQ==
