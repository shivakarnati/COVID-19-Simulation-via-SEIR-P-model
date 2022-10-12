(function() {
  var BrowserWindow, activateDefaultProject, activateParentProject, activateProject, blocks, cd, cells, clearLazy, client, dialog, docpane, evalall, evalshow, evaluate, getmodule, modules, notifications, path, paths, processLinks, ref, ref1, ref2, ref3, searchDoc, selector, views, weave, words, workspace;

  path = require('path');

  ref = require('electron').remote, dialog = ref.dialog, BrowserWindow = ref.BrowserWindow;

  client = require('../connection').client;

  ref1 = require('../ui'), notifications = ref1.notifications, views = ref1.views, selector = ref1.selector, docpane = ref1.docpane;

  ref2 = require('../misc'), paths = ref2.paths, blocks = ref2.blocks, cells = ref2.cells, words = ref2.words, weave = ref2.weave;

  processLinks = require('../ui/docs').processLinks;

  workspace = require('./workspace');

  modules = require('./modules');

  ref3 = client["import"]({
    rpc: ['eval', 'evalall', 'evalshow', 'module'],
    msg: ['cd', 'clearLazy', 'activateProject', 'activateParentProject', 'activateDefaultProject']
  }), evaluate = ref3["eval"], evalall = ref3.evalall, evalshow = ref3.evalshow, getmodule = ref3.module, cd = ref3.cd, clearLazy = ref3.clearLazy, activateProject = ref3.activateProject, activateParentProject = ref3.activateParentProject, activateDefaultProject = ref3.activateDefaultProject;

  searchDoc = client["import"]('docs');

  module.exports = {
    _currentContext: function() {
      var editor, edpath, mod;
      editor = atom.workspace.getActiveTextEditor();
      mod = modules.current() || 'Main';
      edpath = client.editorPath(editor) || 'untitled-' + editor.getBuffer().id;
      return {
        editor: editor,
        mod: mod,
        edpath: edpath
      };
    },
    _showError: function(r, lines) {
      var file, lights, line, ref4;
      if ((ref4 = this.errorLines) != null) {
        ref4.lights.destroy();
      }
      lights = this.ink.highlights.errorLines((function() {
        var i, len, ref5, results;
        results = [];
        for (i = 0, len = lines.length; i < len; i++) {
          ref5 = lines[i], file = ref5.file, line = ref5.line;
          results.push({
            file: file,
            line: line - 1
          });
        }
        return results;
      })());
      this.errorLines = {
        r: r,
        lights: lights
      };
      return r.onDidDestroy((function(_this) {
        return function() {
          var ref5;
          if (((ref5 = _this.errorLines) != null ? ref5.r : void 0) === r) {
            return _this.errorLines.lights.destroy();
          }
        };
      })(this));
    },
    "eval": function(arg) {
      var cell, codeSelector, editor, edpath, errorInRepl, mod, move, ref4, ref5, resultsDisplayMode, scrollToResult;
      ref4 = arg != null ? arg : {}, move = ref4.move, cell = ref4.cell;
      ref5 = this._currentContext(), editor = ref5.editor, mod = ref5.mod, edpath = ref5.edpath;
      codeSelector = cell != null ? cells : blocks;
      resultsDisplayMode = atom.config.get('julia-client.uiOptions.resultsDisplayMode');
      errorInRepl = atom.config.get('julia-client.uiOptions.errorInRepl');
      scrollToResult = atom.config.get('julia-client.uiOptions.scrollToResult');
      return Promise.all(codeSelector.get(editor).map((function(_this) {
        return function(arg1) {
          var end, line, r, range, ref6, ref7, rtype, selection, start, text;
          range = arg1.range, line = arg1.line, text = arg1.text, selection = arg1.selection;
          if (move) {
            codeSelector.moveNext(editor, selection, range);
          }
          (ref6 = range[0], start = ref6[0]), (ref7 = range[1], end = ref7[0]);
          _this.ink.highlight(editor, start, end);
          rtype = resultsDisplayMode;
          if (cell && !(rtype === 'console')) {
            rtype = 'block';
          }
          if (rtype === 'console') {
            evalshow({
              text: text,
              line: line + 1,
              mod: mod,
              path: edpath
            });
            notifications.show("Evaluation Finished");
            return workspace.update();
          } else {
            r = null;
            setTimeout((function() {
              return r != null ? r : r = new _this.ink.Result(editor, [start, end], {
                type: rtype,
                scope: 'julia',
                goto: scrollToResult
              });
            }), 0.1);
            return evaluate({
              text: text,
              line: line + 1,
              mod: mod,
              path: edpath,
              errorInRepl: errorInRepl
            })["catch"](function() {
              return r != null ? r.destroy() : void 0;
            }).then(function(result) {
              var error, registerLazy, view;
              if (result == null) {
                if (r != null) {
                  r.destroy();
                }
                console.error('Error: Something went wrong while evaluating.');
                return;
              }
              error = result.type === 'error';
              view = error ? result.view : result;
              if ((r == null) || r.isDestroyed) {
                r = new _this.ink.Result(editor, [start, end], {
                  type: rtype,
                  scope: 'julia',
                  goto: scrollToResult
                });
              }
              registerLazy = function(id) {
                r.onDidDestroy(client.withCurrent(function() {
                  return clearLazy([id]);
                }));
                return editor.onDidDestroy(client.withCurrent(function() {
                  return clearLazy(id);
                }));
              };
              r.setContent(views.render(view, {
                registerLazy: registerLazy
              }), {
                error: error
              });
              if (error) {
                if (error) {
                  atom.beep();
                }
                _this.ink.highlight(editor, start, end, 'error-line');
                if (result.highlights != null) {
                  _this._showError(r, result.highlights);
                }
              }
              notifications.show("Evaluation Finished");
              workspace.update();
              return result;
            });
          }
        };
      })(this)));
    },
    evalAll: function(el) {
      var code, data, editor, edpath, error, mod, module, ref4, scope, weaveScopes;
      if (el) {
        path = paths.getPathFromTreeView(el);
        if (!path) {
          return atom.notifications.addError('This file has no path.');
        }
        try {
          code = paths.readCode(path);
          data = {
            path: path,
            code: code,
            row: 1,
            column: 1
          };
          return getmodule(data).then((function(_this) {
            return function(mod) {
              return evalall({
                path: path,
                module: modules.current(mod),
                code: code
              }).then(function(result) {
                notifications.show("Evaluation Finished");
                return workspace.update();
              })["catch"](function(err) {
                return console.log(err);
              });
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              return console.log(err);
            };
          })(this));
        } catch (error1) {
          error = error1;
          return atom.notifications.addError('Error happened', {
            detail: error,
            dismissable: true
          });
        }
      } else {
        ref4 = this._currentContext(), editor = ref4.editor, mod = ref4.mod, edpath = ref4.edpath;
        atom.commands.dispatch(atom.views.getView(editor), 'inline-results:clear-all');
        scope = editor.getRootScopeDescriptor().getScopesArray()[0];
        weaveScopes = ['source.weave.md', 'source.weave.latex'];
        module = weaveScopes.includes(scope) ? mod : editor.juliaModule;
        code = weaveScopes.includes(scope) ? weave.getCode(editor) : editor.getText();
        return evalall({
          path: edpath,
          module: module,
          code: code
        }).then(function(result) {
          notifications.show("Evaluation Finished");
          return workspace.update();
        })["catch"]((function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      }
    },
    toggleDocs: function() {
      var bufferPosition, editor, edpath, mod, range, ref4, ref5, word;
      ref4 = this._currentContext(), editor = ref4.editor, mod = ref4.mod, edpath = ref4.edpath;
      bufferPosition = editor.getLastCursor().getBufferPosition();
      ref5 = words.getWordAndRange(editor, {
        bufferPosition: bufferPosition
      }), word = ref5.word, range = ref5.range;
      range = words.getWordRangeWithoutTrailingDots(word, range, bufferPosition);
      word = editor.getTextInBufferRange(range);
      if (!words.isValidWordToInspect(word)) {
        return;
      }
      return searchDoc({
        word: word,
        mod: mod
      }).then((function(_this) {
        return function(result) {
          var d, v;
          if (result.error) {
            return;
          }
          v = views.render(result);
          processLinks(v.getElementsByTagName('a'));
          if (atom.config.get('julia-client.uiOptions.docsDisplayMode') === 'inline') {
            d = new _this.ink.InlineDoc(editor, range, {
              content: v,
              highlight: true
            });
            return d.view.classList.add('julia');
          } else {
            docpane.ensureVisible();
            return docpane.showDocument(v, []);
          }
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          return console.log(err);
        };
      })(this));
    },
    _cd: function(dir) {
      if (atom.config.get('julia-client.juliaOptions.persistWorkingDir')) {
        atom.config.set('julia-client.juliaOptions.workingDir', dir);
      }
      return cd(dir);
    },
    cdHere: function(el) {
      var dir;
      dir = this.currentDir(el);
      if (dir) {
        return this._cd(dir);
      }
    },
    activateProject: function(el) {
      var dir;
      dir = this.currentDir(el);
      if (dir) {
        return activateProject(dir);
      }
    },
    activateParentProject: function(el) {
      var dir;
      dir = this.currentDir(el);
      if (dir) {
        return activateParentProject(dir);
      }
    },
    activateDefaultProject: function() {
      return activateDefaultProject();
    },
    currentDir: function(el) {
      var dirPath, file;
      dirPath = paths.getDirPathFromTreeView(el);
      if (dirPath) {
        return dirPath;
      }
      file = client.editorPath(atom.workspace.getCenter().getActiveTextEditor());
      if (file) {
        return path.dirname(file);
      }
      atom.notifications.addError('This file has no path.');
      return null;
    },
    cdProject: function() {
      var dirs;
      dirs = atom.project.getPaths();
      if (dirs.length < 1) {
        return atom.notifications.addError('This project has no folders.');
      } else if (dirs.length === 1) {
        return this._cd(dirs[0]);
      } else {
        return selector.show(dirs, {
          infoMessage: 'Select project to work in'
        }).then((function(_this) {
          return function(dir) {
            if (dir == null) {
              return;
            }
            return _this._cd(dir);
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      }
    },
    cdHome: function() {
      return this._cd(paths.home());
    },
    cdSelect: function() {
      var opts;
      opts = {
        properties: ['openDirectory']
      };
      return dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), opts, (function(_this) {
        return function(path) {
          if (path != null) {
            return _this._cd(path[0]);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3J1bnRpbWUvZXZhbHVhdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUEwQixPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDLE1BQTlDLEVBQUMsbUJBQUQsRUFBUzs7RUFFUixTQUFXLE9BQUEsQ0FBUSxlQUFSOztFQUNaLE9BQTRDLE9BQUEsQ0FBUSxPQUFSLENBQTVDLEVBQUMsa0NBQUQsRUFBZ0Isa0JBQWhCLEVBQXVCLHdCQUF2QixFQUFpQzs7RUFDakMsT0FBdUMsT0FBQSxDQUFRLFNBQVIsQ0FBdkMsRUFBQyxrQkFBRCxFQUFRLG9CQUFSLEVBQWdCLGtCQUFoQixFQUF1QixrQkFBdkIsRUFBOEI7O0VBQzdCLGVBQWdCLE9BQUEsQ0FBUSxZQUFSOztFQUNqQixTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVI7O0VBQ1osT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUNWLE9BR0ksTUFBTSxFQUFDLE1BQUQsRUFBTixDQUNGO0lBQUEsR0FBQSxFQUFLLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsVUFBcEIsRUFBZ0MsUUFBaEMsQ0FBTDtJQUNBLEdBQUEsRUFBSyxDQUFDLElBQUQsRUFBTyxXQUFQLEVBQW9CLGlCQUFwQixFQUF1Qyx1QkFBdkMsRUFBZ0Usd0JBQWhFLENBREw7R0FERSxDQUhKLEVBQ1EsaUJBQU4sTUFERixFQUNrQixzQkFEbEIsRUFDMkIsd0JBRDNCLEVBQzZDLGlCQUFSLE1BRHJDLEVBRUUsWUFGRixFQUVNLDBCQUZOLEVBRWlCLHNDQUZqQixFQUVrQyxrREFGbEMsRUFFeUQ7O0VBSXpELFNBQUEsR0FBWSxNQUFNLEVBQUMsTUFB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dGVudCI6WyIjIFRPRE86IHRoaXMgaXMgdmVyeSBob3JyaWJsZSwgcmVmYWN0b3JcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue2RpYWxvZywgQnJvd3NlcldpbmRvd30gPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZVxuXG57Y2xpZW50fSA9ICByZXF1aXJlICcuLi9jb25uZWN0aW9uJ1xue25vdGlmaWNhdGlvbnMsIHZpZXdzLCBzZWxlY3RvciwgZG9jcGFuZX0gPSByZXF1aXJlICcuLi91aSdcbntwYXRocywgYmxvY2tzLCBjZWxscywgd29yZHMsIHdlYXZlfSA9IHJlcXVpcmUgJy4uL21pc2MnXG57cHJvY2Vzc0xpbmtzfSA9IHJlcXVpcmUgJy4uL3VpL2RvY3MnXG53b3Jrc3BhY2UgPSByZXF1aXJlICcuL3dvcmtzcGFjZSdcbm1vZHVsZXMgPSByZXF1aXJlICcuL21vZHVsZXMnXG57XG4gIGV2YWw6IGV2YWx1YXRlLCBldmFsYWxsLCBldmFsc2hvdywgbW9kdWxlOiBnZXRtb2R1bGUsXG4gIGNkLCBjbGVhckxhenksIGFjdGl2YXRlUHJvamVjdCwgYWN0aXZhdGVQYXJlbnRQcm9qZWN0LCBhY3RpdmF0ZURlZmF1bHRQcm9qZWN0XG59ID0gY2xpZW50LmltcG9ydFxuICBycGM6IFsnZXZhbCcsICdldmFsYWxsJywgJ2V2YWxzaG93JywgJ21vZHVsZSddLFxuICBtc2c6IFsnY2QnLCAnY2xlYXJMYXp5JywgJ2FjdGl2YXRlUHJvamVjdCcsICdhY3RpdmF0ZVBhcmVudFByb2plY3QnLCAnYWN0aXZhdGVEZWZhdWx0UHJvamVjdCddXG5zZWFyY2hEb2MgPSBjbGllbnQuaW1wb3J0KCdkb2NzJylcblxubW9kdWxlLmV4cG9ydHMgPVxuICBfY3VycmVudENvbnRleHQ6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgbW9kID0gbW9kdWxlcy5jdXJyZW50KCkgfHwgJ01haW4nXG4gICAgZWRwYXRoID0gY2xpZW50LmVkaXRvclBhdGgoZWRpdG9yKSB8fCAndW50aXRsZWQtJyArIGVkaXRvci5nZXRCdWZmZXIoKS5pZFxuICAgIHtlZGl0b3IsIG1vZCwgZWRwYXRofVxuXG4gIF9zaG93RXJyb3I6IChyLCBsaW5lcykgLT5cbiAgICBAZXJyb3JMaW5lcz8ubGlnaHRzLmRlc3Ryb3koKVxuICAgIGxpZ2h0cyA9IEBpbmsuaGlnaGxpZ2h0cy5lcnJvckxpbmVzIChmaWxlOiBmaWxlLCBsaW5lOiBsaW5lLTEgZm9yIHtmaWxlLCBsaW5lfSBpbiBsaW5lcylcbiAgICBAZXJyb3JMaW5lcyA9IHtyLCBsaWdodHN9XG4gICAgci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIGlmIEBlcnJvckxpbmVzPy5yID09IHIgdGhlbiBAZXJyb3JMaW5lcy5saWdodHMuZGVzdHJveSgpXG5cbiAgZXZhbDogKHttb3ZlLCBjZWxsfT17fSkgLT5cbiAgICB7ZWRpdG9yLCBtb2QsIGVkcGF0aH0gPSBAX2N1cnJlbnRDb250ZXh0KClcbiAgICBjb2RlU2VsZWN0b3IgPSBpZiBjZWxsPyB0aGVuIGNlbGxzIGVsc2UgYmxvY2tzXG4gICAgIyBnbG9iYWwgb3B0aW9uc1xuICAgIHJlc3VsdHNEaXNwbGF5TW9kZSA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5yZXN1bHRzRGlzcGxheU1vZGUnKVxuICAgIGVycm9ySW5SZXBsID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQudWlPcHRpb25zLmVycm9ySW5SZXBsJylcbiAgICBzY3JvbGxUb1Jlc3VsdCA9IGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5zY3JvbGxUb1Jlc3VsdCcpXG5cbiAgICBQcm9taXNlLmFsbCBjb2RlU2VsZWN0b3IuZ2V0KGVkaXRvcikubWFwICh7cmFuZ2UsIGxpbmUsIHRleHQsIHNlbGVjdGlvbn0pID0+XG4gICAgICBjb2RlU2VsZWN0b3IubW92ZU5leHQgZWRpdG9yLCBzZWxlY3Rpb24sIHJhbmdlIGlmIG1vdmVcbiAgICAgIFtbc3RhcnRdLCBbZW5kXV0gPSByYW5nZVxuICAgICAgQGluay5oaWdobGlnaHQgZWRpdG9yLCBzdGFydCwgZW5kXG4gICAgICBydHlwZSA9IHJlc3VsdHNEaXNwbGF5TW9kZVxuICAgICAgaWYgY2VsbCBhbmQgbm90IChydHlwZSBpcyAnY29uc29sZScpXG4gICAgICAgICAgcnR5cGUgPSAnYmxvY2snXG4gICAgICBpZiBydHlwZSBpcyAnY29uc29sZSdcbiAgICAgICAgZXZhbHNob3coe3RleHQsIGxpbmU6IGxpbmUrMSwgbW9kLCBwYXRoOiBlZHBhdGh9KVxuICAgICAgICBub3RpZmljYXRpb25zLnNob3cgXCJFdmFsdWF0aW9uIEZpbmlzaGVkXCJcbiAgICAgICAgd29ya3NwYWNlLnVwZGF0ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIHIgPSBudWxsXG4gICAgICAgIHNldFRpbWVvdXQgKD0+IHIgPz0gbmV3IEBpbmsuUmVzdWx0IGVkaXRvciwgW3N0YXJ0LCBlbmRdLCB7dHlwZTogcnR5cGUsIHNjb3BlOiAnanVsaWEnLCBnb3RvOiBzY3JvbGxUb1Jlc3VsdH0pLCAwLjFcbiAgICAgICAgZXZhbHVhdGUoe3RleHQsIGxpbmU6IGxpbmUrMSwgbW9kLCBwYXRoOiBlZHBhdGgsIGVycm9ySW5SZXBsfSlcbiAgICAgICAgICAuY2F0Y2ggLT4gcj8uZGVzdHJveSgpXG4gICAgICAgICAgLnRoZW4gKHJlc3VsdCkgPT5cbiAgICAgICAgICAgIGlmIG5vdCByZXN1bHQ/XG4gICAgICAgICAgICAgIHI/LmRlc3Ryb3koKVxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yICdFcnJvcjogU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2hpbGUgZXZhbHVhdGluZy4nXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgZXJyb3IgPSByZXN1bHQudHlwZSA9PSAnZXJyb3InXG4gICAgICAgICAgICB2aWV3ID0gaWYgZXJyb3IgdGhlbiByZXN1bHQudmlldyBlbHNlIHJlc3VsdFxuICAgICAgICAgICAgaWYgbm90IHI/IG9yIHIuaXNEZXN0cm95ZWQgdGhlbiByID0gbmV3IEBpbmsuUmVzdWx0IGVkaXRvciwgW3N0YXJ0LCBlbmRdLCB7dHlwZTogcnR5cGUsIHNjb3BlOiAnanVsaWEnLCBnb3RvOiBzY3JvbGxUb1Jlc3VsdH1cbiAgICAgICAgICAgIHJlZ2lzdGVyTGF6eSA9IChpZCkgLT5cbiAgICAgICAgICAgICAgci5vbkRpZERlc3Ryb3kgY2xpZW50LndpdGhDdXJyZW50IC0+IGNsZWFyTGF6eSBbaWRdXG4gICAgICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgY2xpZW50LndpdGhDdXJyZW50IC0+IGNsZWFyTGF6eSBpZFxuICAgICAgICAgICAgci5zZXRDb250ZW50IHZpZXdzLnJlbmRlcih2aWV3LCB7cmVnaXN0ZXJMYXp5fSksIHtlcnJvcn1cbiAgICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICAgIGF0b20uYmVlcCgpIGlmIGVycm9yXG4gICAgICAgICAgICAgIEBpbmsuaGlnaGxpZ2h0IGVkaXRvciwgc3RhcnQsIGVuZCwgJ2Vycm9yLWxpbmUnXG4gICAgICAgICAgICAgIGlmIHJlc3VsdC5oaWdobGlnaHRzP1xuICAgICAgICAgICAgICAgIEBfc2hvd0Vycm9yIHIsIHJlc3VsdC5oaWdobGlnaHRzXG4gICAgICAgICAgICBub3RpZmljYXRpb25zLnNob3cgXCJFdmFsdWF0aW9uIEZpbmlzaGVkXCJcbiAgICAgICAgICAgIHdvcmtzcGFjZS51cGRhdGUoKVxuICAgICAgICAgICAgcmVzdWx0XG5cbiAgZXZhbEFsbDogKGVsKSAtPlxuICAgIGlmIGVsXG4gICAgICBwYXRoID0gcGF0aHMuZ2V0UGF0aEZyb21UcmVlVmlldyBlbFxuICAgICAgaWYgbm90IHBhdGhcbiAgICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciAnVGhpcyBmaWxlIGhhcyBubyBwYXRoLidcbiAgICAgIHRyeVxuICAgICAgICBjb2RlID0gcGF0aHMucmVhZENvZGUocGF0aClcbiAgICAgICAgZGF0YSA9XG4gICAgICAgICAgcGF0aDogcGF0aFxuICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgICByb3c6IDFcbiAgICAgICAgICBjb2x1bW46IDFcbiAgICAgICAgZ2V0bW9kdWxlKGRhdGEpXG4gICAgICAgICAgLnRoZW4gKG1vZCkgPT5cbiAgICAgICAgICAgIGV2YWxhbGwoe1xuICAgICAgICAgICAgICBwYXRoOiBwYXRoXG4gICAgICAgICAgICAgIG1vZHVsZTogbW9kdWxlcy5jdXJyZW50IG1vZFxuICAgICAgICAgICAgICBjb2RlOiBjb2RlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAudGhlbiAocmVzdWx0KSAtPlxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbnMuc2hvdyBcIkV2YWx1YXRpb24gRmluaXNoZWRcIlxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZS51cGRhdGUoKVxuICAgICAgICAgICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG5cbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciAnRXJyb3IgaGFwcGVuZWQnLFxuICAgICAgICAgIGRldGFpbDogZXJyb3JcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHtlZGl0b3IsIG1vZCwgZWRwYXRofSA9IEBfY3VycmVudENvbnRleHQoKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2lubGluZS1yZXN1bHRzOmNsZWFyLWFsbCdcbiAgICAgIFtzY29wZV0gPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLmdldFNjb3Blc0FycmF5KClcbiAgICAgIHdlYXZlU2NvcGVzID0gWydzb3VyY2Uud2VhdmUubWQnLCAnc291cmNlLndlYXZlLmxhdGV4J11cbiAgICAgIG1vZHVsZSA9IGlmIHdlYXZlU2NvcGVzLmluY2x1ZGVzIHNjb3BlIHRoZW4gbW9kIGVsc2UgZWRpdG9yLmp1bGlhTW9kdWxlXG4gICAgICBjb2RlID0gaWYgd2VhdmVTY29wZXMuaW5jbHVkZXMgc2NvcGUgdGhlbiB3ZWF2ZS5nZXRDb2RlIGVkaXRvciBlbHNlIGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGV2YWxhbGwoe1xuICAgICAgICBwYXRoOiBlZHBhdGhcbiAgICAgICAgbW9kdWxlOiBtb2R1bGVcbiAgICAgICAgY29kZTogY29kZVxuICAgICAgfSlcbiAgICAgICAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgICAgICBub3RpZmljYXRpb25zLnNob3cgXCJFdmFsdWF0aW9uIEZpbmlzaGVkXCJcbiAgICAgICAgICB3b3Jrc3BhY2UudXBkYXRlKClcbiAgICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuXG4gIHRvZ2dsZURvY3M6ICgpIC0+XG4gICAgeyBlZGl0b3IsIG1vZCwgZWRwYXRoIH0gPSBAX2N1cnJlbnRDb250ZXh0KClcbiAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICMgZ2V0IHdvcmQgd2l0aG91dCB0cmFpbGluZyBkb3QgYWNjZXNzb3JzIGF0IHRoZSBidWZmZXIgcG9zaXRpb25cbiAgICB7IHdvcmQsIHJhbmdlIH0gPSB3b3Jkcy5nZXRXb3JkQW5kUmFuZ2UoZWRpdG9yLCB7IGJ1ZmZlclBvc2l0aW9uIH0pXG4gICAgcmFuZ2UgPSB3b3Jkcy5nZXRXb3JkUmFuZ2VXaXRob3V0VHJhaWxpbmdEb3RzKHdvcmQsIHJhbmdlLCBidWZmZXJQb3NpdGlvbilcbiAgICB3b3JkID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gICAgcmV0dXJuIHVubGVzcyB3b3Jkcy5pc1ZhbGlkV29yZFRvSW5zcGVjdCh3b3JkKVxuICAgIHNlYXJjaERvYyh7d29yZDogd29yZCwgbW9kOiBtb2R9KVxuICAgICAgLnRoZW4gKHJlc3VsdCkgPT5cbiAgICAgICAgaWYgcmVzdWx0LmVycm9yIHRoZW4gcmV0dXJuXG4gICAgICAgIHYgPSB2aWV3cy5yZW5kZXIgcmVzdWx0XG4gICAgICAgIHByb2Nlc3NMaW5rcyh2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJykpXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5kb2NzRGlzcGxheU1vZGUnKSA9PSAnaW5saW5lJ1xuICAgICAgICAgIGQgPSBuZXcgQGluay5JbmxpbmVEb2MgZWRpdG9yLCByYW5nZSxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHZcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxuICAgICAgICAgIGQudmlldy5jbGFzc0xpc3QuYWRkICdqdWxpYSdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRvY3BhbmUuZW5zdXJlVmlzaWJsZSgpXG4gICAgICAgICAgZG9jcGFuZS5zaG93RG9jdW1lbnQodiwgW10pXG4gICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuXG4gICMgV29ya2luZyBEaXJlY3RvcnlcblxuICBfY2Q6IChkaXIpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLnBlcnNpc3RXb3JraW5nRGlyJylcbiAgICAgIGF0b20uY29uZmlnLnNldCgnanVsaWEtY2xpZW50Lmp1bGlhT3B0aW9ucy53b3JraW5nRGlyJywgZGlyKVxuICAgIGNkKGRpcilcblxuICBjZEhlcmU6IChlbCkgLT5cbiAgICBkaXIgPSBAY3VycmVudERpcihlbClcbiAgICBpZiBkaXJcbiAgICAgIEBfY2QoZGlyKVxuXG4gIGFjdGl2YXRlUHJvamVjdDogKGVsKSAtPlxuICAgIGRpciA9IEBjdXJyZW50RGlyKGVsKVxuICAgIGlmIGRpclxuICAgICAgYWN0aXZhdGVQcm9qZWN0KGRpcilcblxuICBhY3RpdmF0ZVBhcmVudFByb2plY3Q6IChlbCkgLT5cbiAgICBkaXIgPSBAY3VycmVudERpcihlbClcbiAgICBpZiBkaXJcbiAgICAgIGFjdGl2YXRlUGFyZW50UHJvamVjdChkaXIpXG5cbiAgYWN0aXZhdGVEZWZhdWx0UHJvamVjdDogLT5cbiAgICBhY3RpdmF0ZURlZmF1bHRQcm9qZWN0KClcblxuICBjdXJyZW50RGlyOiAoZWwpIC0+XG4gICAgZGlyUGF0aCA9IHBhdGhzLmdldERpclBhdGhGcm9tVHJlZVZpZXcgZWxcbiAgICByZXR1cm4gZGlyUGF0aCBpZiBkaXJQYXRoXG4gICAgIyBpbnZva2VkIGZyb20gbm9ybWFsIGNvbW1hbmQgdXNhZ2VcbiAgICBmaWxlID0gY2xpZW50LmVkaXRvclBhdGgoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZmlsZSkgaWYgZmlsZVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciAnVGhpcyBmaWxlIGhhcyBubyBwYXRoLidcbiAgICByZXR1cm4gbnVsbFxuXG4gIGNkUHJvamVjdDogLT5cbiAgICBkaXJzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBpZiBkaXJzLmxlbmd0aCA8IDFcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciAnVGhpcyBwcm9qZWN0IGhhcyBubyBmb2xkZXJzLidcbiAgICBlbHNlIGlmIGRpcnMubGVuZ3RoID09IDFcbiAgICAgIEBfY2QgZGlyc1swXVxuICAgIGVsc2VcbiAgICAgIHNlbGVjdG9yLnNob3coZGlycywgeyBpbmZvTWVzc2FnZTogJ1NlbGVjdCBwcm9qZWN0IHRvIHdvcmsgaW4nIH0pXG4gICAgICAgIC50aGVuIChkaXIpID0+XG4gICAgICAgICAgcmV0dXJuIHVubGVzcyBkaXI/XG4gICAgICAgICAgQF9jZCBkaXJcbiAgICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuXG4gIGNkSG9tZTogLT5cbiAgICBAX2NkIHBhdGhzLmhvbWUoKVxuXG4gIGNkU2VsZWN0OiAtPlxuICAgIG9wdHMgPSBwcm9wZXJ0aWVzOiBbJ29wZW5EaXJlY3RvcnknXVxuICAgIGRpYWxvZy5zaG93T3BlbkRpYWxvZyBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKSwgb3B0cywgKHBhdGgpID0+XG4gICAgICBpZiBwYXRoPyB0aGVuIEBfY2QgcGF0aFswXVxuIl19
