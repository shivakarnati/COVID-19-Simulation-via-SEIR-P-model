(function() {
  var CompositeDisposable, cells, shell;

  shell = require('shell');

  cells = require('../misc/cells');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(juno) {
      var boot, cancelComplete, disrequireClient, i, len, ref, requireClient, scope;
      requireClient = function(a, f) {
        return juno.connection.client.require(a, f);
      };
      disrequireClient = function(a, f) {
        return juno.connection.client.disrequire(a, f);
      };
      boot = function() {
        return juno.connection.boot();
      };
      cancelComplete = function(e) {
        return atom.commands.dispatch(e.currentTarget, 'autocomplete-plus:cancel');
      };
      this.subs = new CompositeDisposable();
      ref = atom.config.get('julia-client.juliaSyntaxScopes');
      for (i = 0, len = ref.length; i < len; i++) {
        scope = ref[i];
        this.subs.add(atom.commands.add("atom-text-editor[data-grammar='" + (scope.replace(/\./g, ' ')) + "']", {
          'julia-client:run-block': (function(_this) {
            return function(event) {
              cancelComplete(event);
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation["eval"]();
              });
            };
          })(this),
          'julia-client:run-and-move': (function(_this) {
            return function(event) {
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation["eval"]({
                  move: true
                });
              });
            };
          })(this),
          'julia-client:run-all': (function(_this) {
            return function(event) {
              cancelComplete(event);
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation.evalAll();
              });
            };
          })(this),
          'julia-client:run-cell': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation["eval"]({
                  cell: true
                });
              });
            };
          })(this),
          'julia-client:run-cell-and-move': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation["eval"]({
                  cell: true,
                  move: true
                });
              });
            };
          })(this),
          'julia-client:select-block': (function(_this) {
            return function() {
              return juno.misc.blocks.select();
            };
          })(this),
          'julia-client:next-cell': (function(_this) {
            return function() {
              return cells.moveNext();
            };
          })(this),
          'julia-client:prev-cell': (function(_this) {
            return function() {
              return cells.movePrev();
            };
          })(this),
          'julia-client:goto-symbol': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime.goto.gotoSymbol();
              });
            };
          })(this),
          'julia-client:show-documentation': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime.evaluation.toggleDocs();
              });
            };
          })(this),
          'julia-client:send-to-stdin': (function(_this) {
            return function(e) {
              return requireClient(function() {
                var done, ed, j, len1, ref1, s;
                ed = e.currentTarget.getModel();
                done = false;
                ref1 = ed.getSelections();
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  s = ref1[j];
                  if (!s.getText()) {
                    continue;
                  }
                  done = true;
                  juno.connection.client.stdin(s.getText());
                }
                if (!done) {
                  return juno.connection.client.stdin(ed.getText());
                }
              });
            };
          })(this),
          'julia-debug:run-block': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].debugBlock(false, false);
              });
            };
          })(this),
          'julia-debug:step-through-block': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].debugBlock(true, false);
              });
            };
          })(this),
          'julia-debug:run-cell': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].debugBlock(false, true);
              });
            };
          })(this),
          'julia-debug:step-through-cell': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].debugBlock(true, true);
              });
            };
          })(this),
          'julia-debug:toggle-breakpoint': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].togglebp();
              });
            };
          })(this),
          'julia-debug:toggle-conditional-breakpoint': (function(_this) {
            return function() {
              return _this.withInk(function() {
                boot();
                return juno.runtime["debugger"].togglebp(true);
              });
            };
          })(this)
        }));
      }
      this.subs.add(atom.commands.add('atom-text-editor[data-grammar="source julia"]', {
        'julia-client:format-code': (function(_this) {
          return function() {
            return _this.withInk(function() {
              boot();
              return juno.runtime.formatter.formatCode();
            });
          };
        })(this)
      }));
      this.subs.add(atom.commands.add('atom-text-editor[data-grammar="source julia"], .julia-terminal, .ink-workspace', {
        'julia-client:set-working-module': function() {
          return juno.runtime.modules.chooseModule();
        }
      }));
      this.subs.add(atom.commands.add('.tree-view', {
        'julia-client:run-all': (function(_this) {
          return function(ev) {
            cancelComplete(ev);
            return _this.withInk(function() {
              boot();
              return juno.runtime.evaluation.evalAll(ev.target);
            });
          };
        })(this),
        'julia-debug:run-file': (function(_this) {
          return function(ev) {
            return _this.withInk(function() {
              boot();
              return juno.runtime["debugger"].debugFile(false, ev.target);
            });
          };
        })(this),
        'julia-debug:step-through-file': (function(_this) {
          return function(ev) {
            return _this.withInk(function() {
              boot();
              return juno.runtime["debugger"].debugFile(true, ev.target);
            });
          };
        })(this)
      }));
      return this.subs.add(atom.commands.add('atom-workspace', {
        'julia-client:open-external-REPL': function() {
          return juno.connection.terminal.repl();
        },
        'julia-client:start-julia': function() {
          return disrequireClient('boot Julia', function() {
            return boot();
          });
        },
        'julia-client:start-remote-julia-process': function() {
          return disrequireClient('boot a remote Julia process', function() {
            return juno.connection.bootRemote();
          });
        },
        'julia-client:kill-julia': function() {
          return juno.connection.client.kill();
        },
        'julia-client:interrupt-julia': (function(_this) {
          return function() {
            return requireClient('interrupt Julia', function() {
              return juno.connection.client.interrupt();
            });
          };
        })(this),
        'julia-client:disconnect-julia': (function(_this) {
          return function() {
            return requireClient('disconnect Julia', function() {
              return juno.connection.client.disconnect();
            });
          };
        })(this),
        'julia-client:connect-external-process': function() {
          return disrequireClient(function() {
            return juno.connection.messages.connectExternal();
          });
        },
        'julia-client:connect-terminal': function() {
          return disrequireClient(function() {
            return juno.connection.terminal.connectedRepl();
          });
        },
        'julia-client:open-plot-pane': (function(_this) {
          return function() {
            return _this.withInk(function() {
              return juno.runtime.plots.open();
            });
          };
        })(this),
        'julia-client:open-outline-pane': (function(_this) {
          return function() {
            return _this.withInk(function() {
              return juno.runtime.outline.open();
            });
          };
        })(this),
        'julia-client:open-workspace': (function(_this) {
          return function() {
            return _this.withInk(function() {
              return juno.runtime.workspace.open();
            });
          };
        })(this),
        'julia-client:restore-default-layout': function() {
          return juno.ui.layout.restoreDefaultLayout();
        },
        'julia-client:close-juno-panes': function() {
          return juno.ui.layout.closePromises();
        },
        'julia-client:reset-default-layout-settings': function() {
          return juno.ui.layout.resetDefaultLayoutSettings();
        },
        'julia-client:settings': function() {
          return atom.workspace.open('atom://config/packages/julia-client');
        },
        'julia-debug:run-file': (function(_this) {
          return function() {
            return _this.withInk(function() {
              boot();
              return juno.runtime["debugger"].debugFile(false);
            });
          };
        })(this),
        'julia-debug:step-through-file': (function(_this) {
          return function() {
            return _this.withInk(function() {
              boot();
              return juno.runtime["debugger"].debugFile(true);
            });
          };
        })(this),
        'julia-debug:clear-all-breakpoints': (function(_this) {
          return function() {
            return juno.runtime["debugger"].clearbps();
          };
        })(this),
        'julia-debug:step-to-next-line': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].nextline(ev);
          };
        })(this),
        'julia-debug:step-to-selected-line': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].toselectedline(ev);
          };
        })(this),
        'julia-debug:step-to-next-expression': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].stepexpr(ev);
          };
        })(this),
        'julia-debug:step-into': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].stepin(ev);
          };
        })(this),
        'julia-debug:stop-debugging': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].stop(ev);
          };
        })(this),
        'julia-debug:step-out': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].finish(ev);
          };
        })(this),
        'julia-debug:continue': (function(_this) {
          return function(ev) {
            return juno.runtime["debugger"].continueForward(ev);
          };
        })(this),
        'julia-debug:open-debugger-pane': (function(_this) {
          return function() {
            return juno.runtime["debugger"].open();
          };
        })(this),
        'julia:new-julia-file': (function(_this) {
          return function() {
            return atom.workspace.open().then(function(ed) {
              var gr;
              gr = atom.grammars.grammarForScopeName('source.julia');
              if (gr) {
                return ed.setGrammar(gr);
              }
            });
          };
        })(this),
        'julia:open-julia-startup-file': function() {
          return atom.workspace.open(juno.misc.paths.home('.julia', 'config', 'startup.jl'));
        },
        'julia:open-juno-startup-file': function() {
          return atom.workspace.open(juno.misc.paths.home('.julia', 'config', 'juno_startup.jl'));
        },
        'julia:open-julia-home': function() {
          return shell.openItem(juno.misc.paths.juliaHome());
        },
        'julia:open-package-in-new-window': function() {
          return requireClient('get packages', function() {
            return juno.runtime.packages.openPackage();
          });
        },
        'julia:open-package-as-project-folder': function() {
          return requireClient('get packages', function() {
            return juno.runtime.packages.openPackage(false);
          });
        },
        'julia:get-help': function() {
          return shell.openExternal('http://discourse.julialang.org');
        },
        'julia-client:debug-info': (function(_this) {
          return function() {
            boot();
            return juno.runtime.debuginfo();
          };
        })(this),
        'julia-client:work-in-current-folder': function(ev) {
          return requireClient('change working folder', function() {
            return juno.runtime.evaluation.cdHere(ev.target);
          });
        },
        'julia-client:work-in-project-folder': function() {
          return requireClient('change working folder', function() {
            return juno.runtime.evaluation.cdProject();
          });
        },
        'julia-client:work-in-home-folder': function() {
          return requireClient('change working folder', function() {
            return juno.runtime.evaluation.cdHome();
          });
        },
        'julia-client:select-working-folder': function() {
          return requireClient('change working folder', function() {
            return juno.runtime.evaluation.cdSelect();
          });
        },
        'julia-client:activate-environment-in-current-folder': function(ev) {
          return requireClient('activate an environment', function() {
            return juno.runtime.evaluation.activateProject(ev.target);
          });
        },
        'julia-client:activate-environment-in-parent-folder': function(ev) {
          return requireClient('activate an environment', function() {
            return juno.runtime.evaluation.activateParentProject(ev.target);
          });
        },
        'julia-client:activate-default-environment': function(ev) {
          return requireClient('activate an environment', function() {
            return juno.runtime.evaluation.activateDefaultProject();
          });
        },
        'julia-client:set-working-environment': function(ev) {
          return juno.runtime.environments.chooseEnvironment();
        }
      }));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    withInk: function(f, err) {
      if (this.ink != null) {
        return f();
      } else if (err) {
        return atom.notifications.addError('Please install the Ink package.', {
          detail: 'Julia Client requires the Ink package to run. You can install it via `File -> Settings -> Install`.',
          dismissable: true
        });
      } else {
        return setTimeout(((function(_this) {
          return function() {
            return _this.withInk(f, true);
          };
        })(this)), 100);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3BhY2thZ2UvY29tbWFuZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQXdCLE9BQUEsQ0FBUSxPQUFSOztFQUN4QixLQUFBLEdBQXdCLE9BQUEsQ0FBUSxlQUFSOztFQUN2QixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFEO0FBQ1IsVUFBQTtNQUFBLGFBQUEsR0FBbUIsU0FBQyxDQUFELEVBQUksQ0FBSjtlQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLENBQS9CLEVBQWtDLENBQWxDO01BQVY7TUFDbkIsZ0JBQUEsR0FBbUIsU0FBQyxDQUFELEVBQUksQ0FBSjtlQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQXZCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDO01BQVY7TUFDbkIsSUFBQSxHQUFPLFNBQUE7ZUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWhCLENBQUE7TUFBSDtNQUVQLGNBQUEsR0FBaUIsU0FBQyxDQUFEO2VBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLENBQUMsQ0FBQyxhQUF6QixFQUF3QywwQkFBeEM7TUFEZTtNQUdqQixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksbUJBQUosQ0FBQTtBQUdSO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsaUNBQUEsR0FBaUMsQ0FBQyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIs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REc7T0FBQSxNQUFBO2VBTUgsVUFBQSxDQUFXLENBQUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLENBQVQsRUFBWSxJQUFaO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQsQ0FBWCxFQUFrQyxHQUFsQyxFQU5HOztJQUhFLENBck1UOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsic2hlbGwgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnc2hlbGwnXG5jZWxscyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi9taXNjL2NlbGxzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKGp1bm8pIC0+XG4gICAgcmVxdWlyZUNsaWVudCAgICA9IChhLCBmKSAtPiBqdW5vLmNvbm5lY3Rpb24uY2xpZW50LnJlcXVpcmUgYSwgZlxuICAgIGRpc3JlcXVpcmVDbGllbnQgPSAoYSwgZikgLT4ganVuby5jb25uZWN0aW9uLmNsaWVudC5kaXNyZXF1aXJlIGEsIGZcbiAgICBib290ID0gLT4ganVuby5jb25uZWN0aW9uLmJvb3QoKVxuXG4gICAgY2FuY2VsQ29tcGxldGUgPSAoZSkgLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZS5jdXJyZW50VGFyZ2V0LCAnYXV0b2NvbXBsZXRlLXBsdXM6Y2FuY2VsJylcblxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgIyBhdG9tLXRleHQtZWRpdG9ycyB3aXRoIEp1bGlhIHNjb3Blc1xuICAgIGZvciBzY29wZSBpbiBhdG9tLmNvbmZpZy5nZXQoJ2p1bGlhLWNsaWVudC5qdWxpYVN5bnRheFNjb3BlcycpXG4gICAgICBAc3Vicy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj0nI3tzY29wZS5yZXBsYWNlIC9cXC4vZywgJyAnfSddXCIsXG4gICAgICAgICdqdWxpYS1jbGllbnQ6cnVuLWJsb2NrJzogKGV2ZW50KSA9PlxuICAgICAgICAgIGNhbmNlbENvbXBsZXRlIGV2ZW50XG4gICAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgICAganVuby5ydW50aW1lLmV2YWx1YXRpb24uZXZhbCgpXG4gICAgICAgICdqdWxpYS1jbGllbnQ6cnVuLWFuZC1tb3ZlJzogKGV2ZW50KSA9PlxuICAgICAgICAgIEB3aXRoSW5rIC0+XG4gICAgICAgICAgICBib290KClcbiAgICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLmV2YWwobW92ZTogdHJ1ZSlcbiAgICAgICAgJ2p1bGlhLWNsaWVudDpydW4tYWxsJzogKGV2ZW50KSA9PlxuICAgICAgICAgIGNhbmNlbENvbXBsZXRlIGV2ZW50XG4gICAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgICAganVuby5ydW50aW1lLmV2YWx1YXRpb24uZXZhbEFsbCgpXG4gICAgICAgICdqdWxpYS1jbGllbnQ6cnVuLWNlbGwnOiA9PlxuICAgICAgICAgIEB3aXRoSW5rIC0+XG4gICAgICAgICAgICBib290KClcbiAgICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLmV2YWwoY2VsbDogdHJ1ZSlcbiAgICAgICAgJ2p1bGlhLWNsaWVudDpydW4tY2VsbC1hbmQtbW92ZSc6ID0+XG4gICAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgICAganVuby5ydW50aW1lLmV2YWx1YXRpb24uZXZhbChjZWxsOiB0cnVlLCBtb3ZlOiB0cnVlKVxuICAgICAgICAnanVsaWEtY2xpZW50OnNlbGVjdC1ibG9jayc6ID0+XG4gICAgICAgICAganVuby5taXNjLmJsb2Nrcy5zZWxlY3QoKVxuICAgICAgICAnanVsaWEtY2xpZW50Om5leHQtY2VsbCc6ID0+XG4gICAgICAgICAgY2VsbHMubW92ZU5leHQoKVxuICAgICAgICAnanVsaWEtY2xpZW50OnByZXYtY2VsbCc6ID0+XG4gICAgICAgICAgY2VsbHMubW92ZVByZXYoKVxuICAgICAgICAnanVsaWEtY2xpZW50OmdvdG8tc3ltYm9sJzogPT5cbiAgICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgICAgYm9vdCgpXG4gICAgICAgICAgICBqdW5vLnJ1bnRpbWUuZ290by5nb3RvU3ltYm9sKClcbiAgICAgICAgJ2p1bGlhLWNsaWVudDpzaG93LWRvY3VtZW50YXRpb24nOiA9PlxuICAgICAgICAgIEB3aXRoSW5rIC0+XG4gICAgICAgICAgICBib290KClcbiAgICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLnRvZ2dsZURvY3MoKVxuICAgICAgICAjIEBOT1RFOiBgJ2NsZWFyLXdvcmtzcGFjZSdgIGlzIG5vdyBub3QgaGFuZGxlZCBieSBBdG9tLmpsXG4gICAgICAgICMgJ2p1bGlhLWNsaWVudDpyZXNldC13b3Jrc3BhY2UnOiA9PlxuICAgICAgICAjICAgcmVxdWlyZUNsaWVudCAncmVzZXQgdGhlIHdvcmtzcGFjZScsIC0+XG4gICAgICAgICMgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAjICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnaW5saW5lLXJlc3VsdHM6Y2xlYXItYWxsJ1xuICAgICAgICAjICAgICBqdW5vLmNvbm5lY3Rpb24uY2xpZW50LmltcG9ydCgnY2xlYXItd29ya3NwYWNlJykoKVxuICAgICAgICAnanVsaWEtY2xpZW50OnNlbmQtdG8tc3RkaW4nOiAoZSkgPT5cbiAgICAgICAgICByZXF1aXJlQ2xpZW50IC0+XG4gICAgICAgICAgICBlZCA9IGUuY3VycmVudFRhcmdldC5nZXRNb2RlbCgpXG4gICAgICAgICAgICBkb25lID0gZmFsc2VcbiAgICAgICAgICAgIGZvciBzIGluIGVkLmdldFNlbGVjdGlvbnMoKVxuICAgICAgICAgICAgICBjb250aW51ZSB1bmxlc3Mgcy5nZXRUZXh0KClcbiAgICAgICAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgICAgICAganVuby5jb25uZWN0aW9uLmNsaWVudC5zdGRpbiBzLmdldFRleHQoKVxuICAgICAgICAgICAganVuby5jb25uZWN0aW9uLmNsaWVudC5zdGRpbiBlZC5nZXRUZXh0KCkgdW5sZXNzIGRvbmVcbiAgICAgICAgJ2p1bGlhLWRlYnVnOnJ1bi1ibG9jayc6ID0+XG4gICAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgICAganVuby5ydW50aW1lLmRlYnVnZ2VyLmRlYnVnQmxvY2soZmFsc2UsIGZhbHNlKVxuICAgICAgICAnanVsaWEtZGVidWc6c3RlcC10aHJvdWdoLWJsb2NrJzogPT5cbiAgICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgICAgYm9vdCgpXG4gICAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdCbG9jayh0cnVlLCBmYWxzZSlcbiAgICAgICAgJ2p1bGlhLWRlYnVnOnJ1bi1jZWxsJzogPT5cbiAgICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgICAgYm9vdCgpXG4gICAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdCbG9jayhmYWxzZSwgdHJ1ZSlcbiAgICAgICAgJ2p1bGlhLWRlYnVnOnN0ZXAtdGhyb3VnaC1jZWxsJzogPT5cbiAgICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgICAgYm9vdCgpXG4gICAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdCbG9jayh0cnVlLCB0cnVlKVxuICAgICAgICAnanVsaWEtZGVidWc6dG9nZ2xlLWJyZWFrcG9pbnQnOiA9PlxuICAgICAgICAgIEB3aXRoSW5rIC0+XG4gICAgICAgICAgICBib290KClcbiAgICAgICAgICAgIGp1bm8ucnVudGltZS5kZWJ1Z2dlci50b2dnbGVicCgpXG4gICAgICAgICdqdWxpYS1kZWJ1Zzp0b2dnbGUtY29uZGl0aW9uYWwtYnJlYWtwb2ludCc6ID0+XG4gICAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgICAganVuby5ydW50aW1lLmRlYnVnZ2VyLnRvZ2dsZWJwKHRydWUpXG5cbiAgICAjIGF0b20tdGV4dC1lZGl0b3Igd2l0aCBKdWxpYSBncmFtbWFyIHNjb3BlXG4gICAgQHN1YnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj1cInNvdXJjZSBqdWxpYVwiXScsXG4gICAgICAnanVsaWEtY2xpZW50OmZvcm1hdC1jb2RlJzogPT5cbiAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICBib290KClcbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZm9ybWF0dGVyLmZvcm1hdENvZGUoKVxuXG4gICAgIyBXaGVyZSBcIm1vZHVsZVwiIG1hdHRlcnNcbiAgICBAc3Vicy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyPVwic291cmNlIGp1bGlhXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmp1bGlhLXRlcm1pbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluay13b3Jrc3BhY2UnLFxuICAgICAgJ2p1bGlhLWNsaWVudDpzZXQtd29ya2luZy1tb2R1bGUnOiAtPiBqdW5vLnJ1bnRpbWUubW9kdWxlcy5jaG9vc2VNb2R1bGUoKVxuXG4gICAgIyB0cmVlLXZpZXdcbiAgICBAc3Vicy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLFxuICAgICAgJ2p1bGlhLWNsaWVudDpydW4tYWxsJzogKGV2KSA9PlxuICAgICAgICBjYW5jZWxDb21wbGV0ZSBldlxuICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLmV2YWxBbGwoZXYudGFyZ2V0KVxuICAgICAgJ2p1bGlhLWRlYnVnOnJ1bi1maWxlJzogKGV2KSA9PlxuICAgICAgICBAd2l0aEluayAtPlxuICAgICAgICAgIGJvb3QoKVxuICAgICAgICAgIGp1bm8ucnVudGltZS5kZWJ1Z2dlci5kZWJ1Z0ZpbGUoZmFsc2UsIGV2LnRhcmdldClcbiAgICAgICdqdWxpYS1kZWJ1ZzpzdGVwLXRocm91Z2gtZmlsZSc6IChldikgPT5cbiAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICBib290KClcbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdGaWxlKHRydWUsIGV2LnRhcmdldClcblxuICAgICMgYXRvbS13b3JrLXNwYWNlXG4gICAgQHN1YnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnanVsaWEtY2xpZW50Om9wZW4tZXh0ZXJuYWwtUkVQTCc6IC0+IGp1bm8uY29ubmVjdGlvbi50ZXJtaW5hbC5yZXBsKClcbiAgICAgICdqdWxpYS1jbGllbnQ6c3RhcnQtanVsaWEnOiAtPiBkaXNyZXF1aXJlQ2xpZW50ICdib290IEp1bGlhJywgLT4gYm9vdCgpXG4gICAgICAnanVsaWEtY2xpZW50OnN0YXJ0LXJlbW90ZS1qdWxpYS1wcm9jZXNzJzogLT4gZGlzcmVxdWlyZUNsaWVudCAnYm9vdCBhIHJlbW90ZSBKdWxpYSBwcm9jZXNzJywgLT4ganVuby5jb25uZWN0aW9uLmJvb3RSZW1vdGUoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpraWxsLWp1bGlhJzogLT4ganVuby5jb25uZWN0aW9uLmNsaWVudC5raWxsKClcbiAgICAgICdqdWxpYS1jbGllbnQ6aW50ZXJydXB0LWp1bGlhJzogPT4gcmVxdWlyZUNsaWVudCAnaW50ZXJydXB0IEp1bGlhJywgLT4ganVuby5jb25uZWN0aW9uLmNsaWVudC5pbnRlcnJ1cHQoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpkaXNjb25uZWN0LWp1bGlhJzogPT4gcmVxdWlyZUNsaWVudCAnZGlzY29ubmVjdCBKdWxpYScsIC0+IGp1bm8uY29ubmVjdGlvbi5jbGllbnQuZGlzY29ubmVjdCgpXG4gICAgICAjICdqdWxpYS1jbGllbnQ6cmVzZXQtanVsaWEtc2VydmVyJzogLT4ganVuby5jb25uZWN0aW9uLmxvY2FsLnNlcnZlci5yZXNldCgpICMgc2VydmVyIG1vZGUgbm90IGZ1bmN0aW9uYWxcbiAgICAgICdqdWxpYS1jbGllbnQ6Y29ubmVjdC1leHRlcm5hbC1wcm9jZXNzJzogLT4gZGlzcmVxdWlyZUNsaWVudCAtPiBqdW5vLmNvbm5lY3Rpb24ubWVzc2FnZXMuY29ubmVjdEV4dGVybmFsKClcbiAgICAgICdqdWxpYS1jbGllbnQ6Y29ubmVjdC10ZXJtaW5hbCc6IC0+IGRpc3JlcXVpcmVDbGllbnQgLT4ganVuby5jb25uZWN0aW9uLnRlcm1pbmFsLmNvbm5lY3RlZFJlcGwoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpvcGVuLXBsb3QtcGFuZSc6ID0+IEB3aXRoSW5rIC0+IGp1bm8ucnVudGltZS5wbG90cy5vcGVuKClcbiAgICAgICdqdWxpYS1jbGllbnQ6b3Blbi1vdXRsaW5lLXBhbmUnOiA9PiBAd2l0aEluayAtPiBqdW5vLnJ1bnRpbWUub3V0bGluZS5vcGVuKClcbiAgICAgICdqdWxpYS1jbGllbnQ6b3Blbi13b3Jrc3BhY2UnOiA9PiBAd2l0aEluayAtPiBqdW5vLnJ1bnRpbWUud29ya3NwYWNlLm9wZW4oKVxuICAgICAgJ2p1bGlhLWNsaWVudDpyZXN0b3JlLWRlZmF1bHQtbGF5b3V0JzogLT4ganVuby51aS5sYXlvdXQucmVzdG9yZURlZmF1bHRMYXlvdXQoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpjbG9zZS1qdW5vLXBhbmVzJzogLT4ganVuby51aS5sYXlvdXQuY2xvc2VQcm9taXNlcygpXG4gICAgICAnanVsaWEtY2xpZW50OnJlc2V0LWRlZmF1bHQtbGF5b3V0LXNldHRpbmdzJzogLT4ganVuby51aS5sYXlvdXQucmVzZXREZWZhdWx0TGF5b3V0U2V0dGluZ3MoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpzZXR0aW5ncyc6IC0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvanVsaWEtY2xpZW50JylcblxuICAgICAgJ2p1bGlhLWRlYnVnOnJ1bi1maWxlJzogPT5cbiAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICBib290KClcbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdGaWxlKGZhbHNlKVxuICAgICAgJ2p1bGlhLWRlYnVnOnN0ZXAtdGhyb3VnaC1maWxlJzogPT5cbiAgICAgICAgQHdpdGhJbmsgLT5cbiAgICAgICAgICBib290KClcbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuZGVidWdGaWxlKHRydWUpXG4gICAgICAnanVsaWEtZGVidWc6Y2xlYXItYWxsLWJyZWFrcG9pbnRzJzogPT4ganVuby5ydW50aW1lLmRlYnVnZ2VyLmNsZWFyYnBzKClcbiAgICAgICdqdWxpYS1kZWJ1ZzpzdGVwLXRvLW5leHQtbGluZSc6IChldikgPT4ganVuby5ydW50aW1lLmRlYnVnZ2VyLm5leHRsaW5lKGV2KVxuICAgICAgJ2p1bGlhLWRlYnVnOnN0ZXAtdG8tc2VsZWN0ZWQtbGluZSc6IChldikgPT4ganVuby5ydW50aW1lLmRlYnVnZ2VyLnRvc2VsZWN0ZWRsaW5lKGV2KVxuICAgICAgJ2p1bGlhLWRlYnVnOnN0ZXAtdG8tbmV4dC1leHByZXNzaW9uJzogKGV2KSA9PiBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuc3RlcGV4cHIoZXYpXG4gICAgICAnanVsaWEtZGVidWc6c3RlcC1pbnRvJzogKGV2KSA9PiBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuc3RlcGluKGV2KVxuICAgICAgJ2p1bGlhLWRlYnVnOnN0b3AtZGVidWdnaW5nJzogKGV2KSA9PiBqdW5vLnJ1bnRpbWUuZGVidWdnZXIuc3RvcChldilcbiAgICAgICdqdWxpYS1kZWJ1ZzpzdGVwLW91dCc6IChldikgPT4ganVuby5ydW50aW1lLmRlYnVnZ2VyLmZpbmlzaChldilcbiAgICAgICdqdWxpYS1kZWJ1Zzpjb250aW51ZSc6IChldikgPT4ganVuby5ydW50aW1lLmRlYnVnZ2VyLmNvbnRpbnVlRm9yd2FyZChldilcbiAgICAgICdqdWxpYS1kZWJ1ZzpvcGVuLWRlYnVnZ2VyLXBhbmUnOiA9PiBqdW5vLnJ1bnRpbWUuZGVidWdnZXIub3BlbigpXG5cbiAgICAgICdqdWxpYTpuZXctanVsaWEtZmlsZSc6ID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKS50aGVuKChlZCkgPT5cbiAgICAgICAgICBnciA9IGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmp1bGlhJylcbiAgICAgICAgICBlZC5zZXRHcmFtbWFyKGdyKSBpZiBnclxuICAgICAgICApXG4gICAgICAnanVsaWE6b3Blbi1qdWxpYS1zdGFydHVwLWZpbGUnOiAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGp1bm8ubWlzYy5wYXRocy5ob21lKCcuanVsaWEnLCAnY29uZmlnJywgJ3N0YXJ0dXAuamwnKSlcbiAgICAgICdqdWxpYTpvcGVuLWp1bm8tc3RhcnR1cC1maWxlJzogLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihqdW5vLm1pc2MucGF0aHMuaG9tZSgnLmp1bGlhJywgJ2NvbmZpZycsICdqdW5vX3N0YXJ0dXAuamwnKSlcbiAgICAgICdqdWxpYTpvcGVuLWp1bGlhLWhvbWUnOiAtPiBzaGVsbC5vcGVuSXRlbSBqdW5vLm1pc2MucGF0aHMuanVsaWFIb21lKClcbiAgICAgICdqdWxpYTpvcGVuLXBhY2thZ2UtaW4tbmV3LXdpbmRvdyc6IC0+IHJlcXVpcmVDbGllbnQgJ2dldCBwYWNrYWdlcycsIC0+IGp1bm8ucnVudGltZS5wYWNrYWdlcy5vcGVuUGFja2FnZSgpXG4gICAgICAnanVsaWE6b3Blbi1wYWNrYWdlLWFzLXByb2plY3QtZm9sZGVyJzogLT4gcmVxdWlyZUNsaWVudCAnZ2V0IHBhY2thZ2VzJywgLT4ganVuby5ydW50aW1lLnBhY2thZ2VzLm9wZW5QYWNrYWdlKGZhbHNlKVxuICAgICAgJ2p1bGlhOmdldC1oZWxwJzogLT4gc2hlbGwub3BlbkV4dGVybmFsICdodHRwOi8vZGlzY291cnNlLmp1bGlhbGFuZy5vcmcnXG4gICAgICAnanVsaWEtY2xpZW50OmRlYnVnLWluZm8nOiA9PlxuICAgICAgICBib290KClcbiAgICAgICAganVuby5ydW50aW1lLmRlYnVnaW5mbygpXG5cbiAgICAgICdqdWxpYS1jbGllbnQ6d29yay1pbi1jdXJyZW50LWZvbGRlcic6IChldikgLT5cbiAgICAgICAgcmVxdWlyZUNsaWVudCAnY2hhbmdlIHdvcmtpbmcgZm9sZGVyJywgLT5cbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZXZhbHVhdGlvbi5jZEhlcmUoZXYudGFyZ2V0KVxuICAgICAgJ2p1bGlhLWNsaWVudDp3b3JrLWluLXByb2plY3QtZm9sZGVyJzogLT5cbiAgICAgICAgcmVxdWlyZUNsaWVudCAnY2hhbmdlIHdvcmtpbmcgZm9sZGVyJywgLT5cbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZXZhbHVhdGlvbi5jZFByb2plY3QoKVxuICAgICAgJ2p1bGlhLWNsaWVudDp3b3JrLWluLWhvbWUtZm9sZGVyJzogLT5cbiAgICAgICAgcmVxdWlyZUNsaWVudCAnY2hhbmdlIHdvcmtpbmcgZm9sZGVyJywgLT5cbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZXZhbHVhdGlvbi5jZEhvbWUoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpzZWxlY3Qtd29ya2luZy1mb2xkZXInOiAtPlxuICAgICAgICByZXF1aXJlQ2xpZW50ICdjaGFuZ2Ugd29ya2luZyBmb2xkZXInLCAtPlxuICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLmNkU2VsZWN0KClcbiAgICAgICdqdWxpYS1jbGllbnQ6YWN0aXZhdGUtZW52aXJvbm1lbnQtaW4tY3VycmVudC1mb2xkZXInOiAoZXYpIC0+XG4gICAgICAgIHJlcXVpcmVDbGllbnQgJ2FjdGl2YXRlIGFuIGVudmlyb25tZW50JywgLT5cbiAgICAgICAgICBqdW5vLnJ1bnRpbWUuZXZhbHVhdGlvbi5hY3RpdmF0ZVByb2plY3QoZXYudGFyZ2V0KVxuICAgICAgJ2p1bGlhLWNsaWVudDphY3RpdmF0ZS1lbnZpcm9ubWVudC1pbi1wYXJlbnQtZm9sZGVyJzogKGV2KSAtPlxuICAgICAgICByZXF1aXJlQ2xpZW50ICdhY3RpdmF0ZSBhbiBlbnZpcm9ubWVudCcsIC0+XG4gICAgICAgICAganVuby5ydW50aW1lLmV2YWx1YXRpb24uYWN0aXZhdGVQYXJlbnRQcm9qZWN0KGV2LnRhcmdldClcbiAgICAgICdqdWxpYS1jbGllbnQ6YWN0aXZhdGUtZGVmYXVsdC1lbnZpcm9ubWVudCc6IChldikgLT5cbiAgICAgICAgcmVxdWlyZUNsaWVudCAnYWN0aXZhdGUgYW4gZW52aXJvbm1lbnQnLCAtPlxuICAgICAgICAgIGp1bm8ucnVudGltZS5ldmFsdWF0aW9uLmFjdGl2YXRlRGVmYXVsdFByb2plY3QoKVxuICAgICAgJ2p1bGlhLWNsaWVudDpzZXQtd29ya2luZy1lbnZpcm9ubWVudCc6IChldikgLT5cbiAgICAgICAganVuby5ydW50aW1lLmVudmlyb25tZW50cy5jaG9vc2VFbnZpcm9ubWVudCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vicy5kaXNwb3NlKClcblxuICB3aXRoSW5rOiAoZiwgZXJyKSAtPlxuICAgIGlmIEBpbms/XG4gICAgICBmKClcbiAgICBlbHNlIGlmIGVyclxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yICdQbGVhc2UgaW5zdGFsbCB0aGUgSW5rIHBhY2thZ2UuJyxcbiAgICAgICAgZGV0YWlsOiAnSnVsaWEgQ2xpZW50IHJlcXVpcmVzIHRoZSBJbmsgcGFja2FnZSB0byBydW4uXG4gICAgICAgICAgICAgICAgIFlvdSBjYW4gaW5zdGFsbCBpdCB2aWEgYEZpbGUgLT4gU2V0dGluZ3MgLT4gSW5zdGFsbGAuJ1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHNldFRpbWVvdXQgKD0+IEB3aXRoSW5rIGYsIHRydWUpLCAxMDBcbiJdfQ==
