(function() {
  var config, terminal;

  terminal = require('../connection').terminal;

  config = {
    juliaPath: {
      type: 'string',
      "default": 'julia',
      description: 'The location of the Julia binary.',
      order: 1
    },
    juliaOptions: {
      type: 'object',
      order: 2,
      collapsed: true,
      properties: {
        bootMode: {
          title: 'Boot Mode',
          type: 'string',
          description: '`Basic` spins up a local Julia process on demand and is the most robust option. The `Cycler` will keep a few local Julia processes around at all times to reduce downtime when a process exits. `External Terminal` opens an external terminal and connects it to Juno, much like the `Julia Client: Connect Terminal` command. `Remote` is similar to the `Julia Client: Start Remote Julia Process` command but changes the default, so that evaluating a line in the editor or pressing `Enter` in the REPL tab will start a remote Julia process instead of a local one.',
          "enum": ['Basic', 'Cycler', 'External Terminal', 'Remote'],
          "default": 'Basic',
          radio: true,
          order: 1
        },
        packageServer: {
          title: 'Package Server',
          type: 'string',
          description: 'Julia package server. Set\'s the `JULIA_PKG_SERVER` environment variable *before* starting a Julia process. Leave this empty to use the systemwide default. Requires a restart of the Julia process.',
          "default": '',
          order: 1.5
        },
        optimisationLevel: {
          title: 'Optimisation Level',
          description: 'Higher levels take longer to compile, but produce faster code.',
          type: 'integer',
          "enum": [0, 1, 2, 3],
          "default": 2,
          radio: true,
          order: 2
        },
        deprecationWarnings: {
          title: 'Deprecation Warnings',
          type: 'boolean',
          description: 'If disabled, hides deprecation warnings.',
          "default": true,
          order: 3
        },
        numberOfThreads: {
          title: 'Number of Threads',
          type: 'string',
          description: '`global` will use global setting, `auto` sets it to number of cores.',
          "default": 'auto',
          order: 4
        },
        startupArguments: {
          title: 'Additional Julia Startup Arguments',
          type: 'array',
          description: '`-i`, `-O`, and `--depwarn` will be set by the above options automatically, but can be overwritten here. Arguments are comma-separated, and you should never need to quote anything (even e.g. paths with spaces in them).',
          "default": [],
          items: {
            type: 'string'
          },
          order: 5
        },
        externalProcessPort: {
          title: 'Port for Communicating with the Julia Process',
          type: 'string',
          description: '`random` will use a new port each time, or enter an integer to set the port statically.',
          "default": 'random',
          order: 6
        },
        "arguments": {
          title: 'Arguments',
          type: 'array',
          description: 'Set `ARGS` to the following entries (comma-separated). Requires restart of Julia process.',
          "default": [],
          items: {
            type: 'string'
          },
          order: 7
        },
        persistWorkingDir: {
          title: 'Persist Working Directory',
          type: 'boolean',
          "default": false,
          order: 8
        },
        workingDir: {
          title: 'Working Directory',
          type: 'string',
          "default": '',
          order: 9
        },
        fuzzyCompletionMode: {
          title: 'Fuzzy Completion Mode',
          description: 'If `true`, in-editor auto-completions are generated based on fuzzy (i.e. more permissive) matches,\notherwise based on strict matches as in REPL.\n***NOTE***: this setting doesn\'t affect completions in REPL,\nand so in-REPL completions will still work as usual (i.e. based on strict matches and will complete eagerly).',
          type: 'boolean',
          "default": true,
          order: 10
        },
        autoCompletionSuggestionPriority: {
          title: 'Auto-Completion Suggestion Priority',
          description: 'Specify the sort order of auto-completion suggestions provided by Juno.\nNote the default providers like snippets have priority of `1`.\nRequires Atom restart to take an effect.',
          type: 'integer',
          "default": 3,
          order: 11
        },
        noAutoParenthesis: {
          title: 'Don\'t Insert Parenthesis on Function Auto-completion',
          description: 'If enabled, Juno will not insert parenthesis after completing a function.',
          type: 'boolean',
          "default": false,
          order: 12
        },
        formatOnSave: {
          title: 'Format the current editor when saving',
          description: 'If enabled, Juno will format the current editor on save if a Julia session is running.',
          type: 'boolean',
          "default": false,
          order: 13
        },
        formattingOptions: {
          title: 'Formatting Options',
          description: '⚠ This config is deprecated. In order to specify\n[Formatting Options](https://domluna.github.io/JuliaFormatter.jl/dev/#Formatting-Options-1),\nuse `.JuliaFormatter.toml` configuration file instead.\nSee the ["Configuration File" section](https://domluna.github.io/JuliaFormatter.jl/stable/config/)\nin JuliaFormatter.jl\'s documentation for more details.',
          type: 'object',
          order: 14,
          collapsed: true,
          properties: {
            mock: {
              title: "mock (doesn't have any effect)",
              type: 'boolean',
              "default": false
            }
          }
        }
      }
    },
    uiOptions: {
      title: 'UI Options',
      type: 'object',
      order: 3,
      collapsed: true,
      properties: {
        resultsDisplayMode: {
          title: 'Result Display Mode',
          type: 'string',
          "default": 'inline',
          "enum": [
            {
              value: 'inline',
              description: 'Float results next to code'
            }, {
              value: 'block',
              description: 'Display results under code'
            }, {
              value: 'console',
              description: 'Display results in the REPL'
            }
          ],
          order: 1
        },
        scrollToResult: {
          title: 'Scroll to Inline Results',
          type: 'boolean',
          "default": false,
          order: 2
        },
        docsDisplayMode: {
          title: 'Documentation Display Mode',
          type: 'string',
          "default": 'pane',
          "enum": [
            {
              value: 'inline',
              description: 'Show documentation in the editor'
            }, {
              value: 'pane',
              description: 'Show documentation in the documentation pane'
            }
          ],
          order: 3
        },
        errorNotifications: {
          title: 'Error Notifications',
          type: 'boolean',
          "default": true,
          description: 'When evaluating a script, show errors in a notification as well as in the REPL.',
          order: 4
        },
        errorInRepl: {
          title: 'Show Errors in REPL (Inline Evaluation)',
          type: 'boolean',
          "default": false,
          description: 'If enabled, Juno always shows errors in the REPL when using inline evaluation.',
          order: 5
        },
        enableMenu: {
          title: 'Enable Menu',
          type: 'boolean',
          "default": false,
          description: 'Show a Julia menu in the menu bar (requires restart).',
          order: 6
        },
        enableToolBar: {
          title: 'Enable Toolbar',
          type: 'boolean',
          "default": false,
          description: 'Show Julia icons in the tool bar (requires restart).',
          order: 7
        },
        usePlotPane: {
          title: 'Enable Plot Pane',
          type: 'boolean',
          "default": true,
          description: 'Show plots in Atom.',
          order: 8
        },
        maxNumberPlots: {
          title: 'Maximum Number of Plots in History',
          type: 'number',
          "default": 50,
          description: 'Increasing this number may lead to high memory consumption and poor performance.',
          order: 9
        },
        openNewEditorWhenDebugging: {
          title: 'Open New Editor When Debugging',
          type: 'boolean',
          "default": false,
          description: 'Opens a new editor tab when stepping into a new file instead of reusing the current one (requires restart).',
          order: 10
        },
        cellDelimiter: {
          title: 'Cell Delimiter',
          type: 'array',
          "default": ['##(?!#)', '#---', '#\\s?%%'],
          description: 'Regular expressions for determining cell delimiters.',
          order: 11
        },
        highlightCells: {
          title: 'Highlight Cells',
          type: 'boolean',
          description: 'Customize the appearence of Juno\'s cell highlighting by adding styles for `.line.julia-current-cell` or `.line-number.julia-current-cell` to your personal stylesheet.',
          "default": true,
          order: 12
        },
        layouts: {
          title: 'Layout Options',
          type: 'object',
          order: 13,
          collapsed: true,
          properties: {
            console: {
              title: 'REPL',
              type: 'object',
              order: 1,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of REPL Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'bottom',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of REPL Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'no split',
                  radio: true,
                  order: 2
                }
              }
            },
            terminal: {
              title: 'Terminal',
              type: 'object',
              order: 2,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Terminal Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'bottom',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Terminal Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'no split',
                  radio: true,
                  order: 2
                }
              }
            },
            workspace: {
              title: 'Workspace',
              type: 'object',
              order: 3,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Workspace Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'center',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Workspace Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'right',
                  radio: true,
                  order: 2
                }
              }
            },
            documentation: {
              title: 'Documentation Browser',
              type: 'object',
              order: 4,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Documentation Browser Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'center',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Documentation Browser Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'right',
                  radio: true,
                  order: 2
                }
              }
            },
            plotPane: {
              title: 'Plot Pane',
              type: 'object',
              order: 5,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Plot Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'center',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Plot Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'right',
                  radio: true,
                  order: 2
                }
              }
            },
            debuggerPane: {
              title: 'Debugger Pane',
              type: 'object',
              order: 6,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Debugger Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'right',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Debugger Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'no split',
                  radio: true,
                  order: 2
                }
              }
            },
            profiler: {
              title: 'Profiler',
              type: 'object',
              order: 7,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Profiler Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'center',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Profiler Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'right',
                  radio: true,
                  order: 2
                }
              }
            },
            linter: {
              title: 'Linter',
              type: 'object',
              order: 8,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Linter Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'bottom',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Linter Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'no split',
                  radio: true,
                  order: 2
                }
              }
            },
            outline: {
              title: 'Outline',
              type: 'object',
              order: 9,
              collapsed: true,
              properties: {
                defaultLocation: {
                  title: 'Default location of Outline Pane',
                  type: 'string',
                  "enum": ['center', 'left', 'bottom', 'right'],
                  "default": 'left',
                  radio: true,
                  order: 1
                },
                split: {
                  title: 'Splitting rule of Outline Pane',
                  type: 'string',
                  "enum": ['no split', 'left', 'up', 'right', 'down'],
                  "default": 'down',
                  radio: true,
                  order: 2
                }
              }
            },
            defaultPanes: {
              title: 'Default Panes',
              description: 'Specify panes that are opened by `Julia Client: Restore Default Layout`. The location and splitting rule of each pane follow the settings above.',
              type: 'object',
              order: 10,
              properties: {
                console: {
                  title: 'REPL',
                  type: 'boolean',
                  "default": true,
                  order: 1
                },
                workspace: {
                  title: 'Workspace',
                  type: 'boolean',
                  "default": true,
                  order: 2
                },
                documentation: {
                  title: 'Documentation Browser',
                  type: 'boolean',
                  "default": true,
                  order: 3
                },
                plotPane: {
                  title: 'Plot Pane',
                  type: 'boolean',
                  "default": true,
                  order: 4
                },
                debuggerPane: {
                  title: 'Debugger Pane',
                  type: 'boolean',
                  "default": false,
                  order: 5
                },
                linter: {
                  title: 'Linter',
                  type: 'boolean',
                  "default": false,
                  order: 6
                },
                outline: {
                  title: 'Outline',
                  type: 'boolean',
                  "default": false,
                  order: 7
                }
              }
            },
            openDefaultPanesOnStartUp: {
              title: 'Open Default Panes on Startup',
              description: 'If enabled, opens panes specified above on startup. Note a layout deserialized from a previous window state would be modified by that, i.e.: disable this if you want to keep the deserialized layout.',
              type: 'boolean',
              "default": true,
              order: 11
            }
          }
        }
      }
    },
    consoleOptions: {
      type: 'object',
      title: 'Terminal Options',
      order: 4,
      collapsed: true,
      properties: {
        maximumConsoleSize: {
          title: 'Scrollback Buffer Size',
          type: 'integer',
          "default": 10000,
          order: 1
        },
        prompt: {
          title: 'Terminal Prompt',
          type: 'string',
          "default": 'julia>',
          order: 2
        },
        shell: {
          title: 'Shell',
          type: 'string',
          "default": terminal.defaultShell(),
          description: 'The location of an executable shell. Set to `$SHELL` by default, and if `$SHELL` isn\'t set then fallback to `bash` or `powershell.exe` (on Windows).',
          order: 3
        },
        terminal: {
          title: 'Terminal',
          type: 'string',
          "default": terminal.defaultTerminal(),
          description: 'Command used to open an external terminal.',
          order: 4
        },
        whitelistedKeybindingsREPL: {
          title: 'Whitelisted Keybindings for the Julia REPL',
          type: 'array',
          "default": ['Ctrl-C', 'Ctrl-S', 'F5', 'F8', 'F9', 'F10', 'F11', 'Shift-F5', 'Shift-F8', 'Shift-F9', 'Shift-F10', 'Shift-F11'],
          description: 'The listed keybindings are not handled by the REPL and instead directly passed to Atom.',
          order: 5
        },
        whitelistedKeybindingsTerminal: {
          title: 'Whitelisted Keybindings for Terminals',
          type: 'array',
          "default": [],
          description: 'The listed keybindings are not handled by any terminals and instead directly passed to Atom.',
          order: 6
        },
        cursorStyle: {
          title: 'Cursor Style',
          type: 'string',
          "enum": ['block', 'underline', 'bar'],
          "default": 'block',
          radio: true,
          order: 7
        },
        cursorBlink: {
          title: 'Cursor Blink',
          type: 'boolean',
          "default": false,
          order: 8
        },
        terminalRendererType: {
          title: 'Terminal Renderer',
          type: 'string',
          "enum": ['webgl', 'canvas', 'dom'],
          "default": 'webgl',
          radio: true,
          description: 'The `webgl` renderer is fastest, but is still experimental. `canvas` performs well in many cases, while `dom` is a slow falback. Note that it\'s not possible to hot-swap to the `webgl` renderer.',
          order: 9
        },
        linkModifier: {
          title: 'Ctrl/Cmd modifier for link activation',
          type: 'boolean',
          "default": true,
          order: 10
        }
      }
    },
    remoteOptions: {
      type: 'object',
      order: 5,
      collapsed: true,
      properties: {
        remoteJulia: {
          title: 'Command to execute Julia on the remote server',
          type: 'string',
          "default": 'julia',
          order: 1
        },
        tmux: {
          title: 'Use a persistent tmux session',
          description: 'Requires tmux to be installed on the server you\'re connecting to.',
          type: 'boolean',
          "default": false,
          order: 2
        },
        tmuxName: {
          title: 'tmux session name',
          type: 'string',
          "default": 'juno_tmux_session',
          order: 3
        },
        agentAuth: {
          title: 'Use SSH agent',
          description: 'Requires `$SSH_AUTH_SOCKET` to be set. Defaults to putty\'s pageant on Windows.',
          type: 'boolean',
          "default": true,
          order: 4
        },
        forwardAgent: {
          title: 'Forward SSH agent',
          type: 'boolean',
          "default": true,
          order: 5
        }
      }
    },
    juliaSyntaxScopes: {
      title: 'Julia Syntax Scopes',
      description: 'The listed syntax scopes (comma separated) will be recoginized as Julia files. You may have to restart Atom to take an effect.\n **DO NOT** edit this unless you\'re sure about the effect.',
      type: 'array',
      "default": ['source.julia', 'source.weave.md', 'source.weave.latex'],
      order: 6
    },
    disableProxy: {
      title: 'Disable System Proxy for Child Processes',
      description: 'This unsets the `HTTP_PROXY` and `HTTPS_PROXY` environment variables in all integrated terminals. Try this option if you\'re experiencing issues when installing Julia packages in Juno.',
      type: 'boolean',
      "default": false,
      order: 7
    },
    firstBoot: {
      type: 'boolean',
      "default": true,
      order: 99
    },
    currentVersion: {
      type: 'string',
      "default": '0.0.0',
      order: 100
    }
  };

  if (process.platform !== 'darwin') {
    config.consoleOptions.properties.whitelistedKeybindingsREPL["default"] = ['Ctrl-C', 'Ctrl-J', 'Ctrl-K', 'Ctrl-E', 'Ctrl-V', 'Ctrl-M', 'F5', 'F8', 'F9', 'F10', 'F11', 'Shift-F5', 'Shift-F8', 'Shift-F9', 'Shift-F10', 'Shift-F11'];
  }

  if (process.platform === 'darwin') {
    config.consoleOptions.properties.macOptionIsMeta = {
      title: 'Use Option as Meta',
      type: 'boolean',
      "default": false,
      order: 5.5
    };
  }

  module.exports = config;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3BhY2thZ2UvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsV0FBWSxPQUFBLENBQVEsZUFBUjs7RUFFYixNQUFBLEdBQ0U7SUFBQSxTQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtNQUVBLFdBQUEsRUFBYSxtQ0FGYjtNQUdBLEtBQUEsRUFBTyxDQUhQO0tBREY7SUFNQSxZQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsU0FBQSxFQUFXLElBRlg7TUFHQSxVQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sV0FBUDtVQUNBLElBQUEsRUFBTSxRQUROO1VBRUEsV0FBQSxFQUFhLDhpQkFGYjtVQVdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixtQkFBcEIsRUFBeUMsUUFBekMsQ0FYTjtVQVlBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FaVDtVQWFBLEtBQUEsRUFBTyxJQWJQO1VBY0EsS0FBQSxFQUFPLENBZFA7U0FERjtRQWdCQSxhQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sZ0JBQVA7VUFDQSxJQUFBLEVBQU0sUUFETjtVQUVBLFdBQUEsRUFBYSxzTUFGYjtVQU1BLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFOVDtVQU9BLEtBQUEsRUFBTyxHQVBQO1NBakJGO1FBeUJBLGlCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sb0JBQVA7VUFDQSxXQUFBLEVBQWEsZ0VBRGI7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0s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O01BR0EsS0FBQSxFQUFPLEdBSFA7TUFGSjs7O0VBT0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUEzbUJqQiIsInNvdXJjZXNDb250ZW50IjpbInt0ZXJtaW5hbH0gPSByZXF1aXJlICcuLi9jb25uZWN0aW9uJ1xuXG5jb25maWcgPVxuICBqdWxpYVBhdGg6XG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnanVsaWEnXG4gICAgZGVzY3JpcHRpb246ICdUaGUgbG9jYXRpb24gb2YgdGhlIEp1bGlhIGJpbmFyeS4nXG4gICAgb3JkZXI6IDFcblxuICBqdWxpYU9wdGlvbnM6XG4gICAgdHlwZTogJ29iamVjdCdcbiAgICBvcmRlcjogMlxuICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgIHByb3BlcnRpZXM6XG4gICAgICBib290TW9kZTpcbiAgICAgICAgdGl0bGU6ICdCb290IE1vZGUnXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYEJhc2ljYCBzcGlucyB1cCBhIGxvY2FsIEp1bGlhIHByb2Nlc3Mgb24gZGVtYW5kIGFuZCBpcyB0aGUgbW9zdFxuICAgICAgICAgICAgICAgICAgICAgIHJvYnVzdCBvcHRpb24uIFRoZSBgQ3ljbGVyYCB3aWxsIGtlZXAgYSBmZXcgbG9jYWwgSnVsaWEgcHJvY2Vzc2VzXG4gICAgICAgICAgICAgICAgICAgICAgYXJvdW5kIGF0IGFsbCB0aW1lcyB0byByZWR1Y2UgZG93bnRpbWUgd2hlbiBhIHByb2Nlc3MgZXhpdHMuXG4gICAgICAgICAgICAgICAgICAgICAgYEV4dGVybmFsIFRlcm1pbmFsYCBvcGVucyBhbiBleHRlcm5hbCB0ZXJtaW5hbCBhbmQgY29ubmVjdHMgaXQgdG8gSnVubyxcbiAgICAgICAgICAgICAgICAgICAgICBtdWNoIGxpa2UgdGhlIGBKdWxpYSBDbGllbnQ6IENvbm5lY3QgVGVybWluYWxgIGNvbW1hbmQuXG4gICAgICAgICAgICAgICAgICAgICAgYFJlbW90ZWAgaXMgc2ltaWxhciB0byB0aGUgYEp1bGlhIENsaWVudDogU3RhcnQgUmVtb3RlIEp1bGlhIFByb2Nlc3NgXG4gICAgICAgICAgICAgICAgICAgICAgY29tbWFuZCBidXQgY2hhbmdlcyB0aGUgZGVmYXVsdCwgc28gdGhhdCBldmFsdWF0aW5nIGEgbGluZVxuICAgICAgICAgICAgICAgICAgICAgIGluIHRoZSBlZGl0b3Igb3IgcHJlc3NpbmcgYEVudGVyYCBpbiB0aGUgUkVQTCB0YWIgd2lsbCBzdGFydFxuICAgICAgICAgICAgICAgICAgICAgIGEgcmVtb3RlIEp1bGlhIHByb2Nlc3MgaW5zdGVhZCBvZiBhIGxvY2FsIG9uZS4nXG4gICAgICAgIGVudW06IFsnQmFzaWMnLCAnQ3ljbGVyJywgJ0V4dGVybmFsIFRlcm1pbmFsJywgJ1JlbW90ZSddXG4gICAgICAgIGRlZmF1bHQ6ICdCYXNpYydcbiAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgIHBhY2thZ2VTZXJ2ZXI6XG4gICAgICAgIHRpdGxlOiAnUGFja2FnZSBTZXJ2ZXInXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSnVsaWEgcGFja2FnZSBzZXJ2ZXIuIFNldFxcJ3MgdGhlIGBKVUxJQV9QS0dfU0VSVkVSYCBlbnZpcm9ubWVudFxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlICpiZWZvcmUqIHN0YXJ0aW5nIGEgSnVsaWEgcHJvY2Vzcy4gTGVhdmUgdGhpcyBlbXB0eSB0b1xuICAgICAgICAgICAgICAgICAgICAgIHVzZSB0aGUgc3lzdGVtd2lkZSBkZWZhdWx0LlxuICAgICAgICAgICAgICAgICAgICAgIFJlcXVpcmVzIGEgcmVzdGFydCBvZiB0aGUgSnVsaWEgcHJvY2Vzcy4nXG4gICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIG9yZGVyOiAxLjVcbiAgICAgIG9wdGltaXNhdGlvbkxldmVsOlxuICAgICAgICB0aXRsZTogJ09wdGltaXNhdGlvbiBMZXZlbCdcbiAgICAgICAgZGVzY3JpcHRpb246ICdIaWdoZXIgbGV2ZWxzIHRha2UgbG9uZ2VyIHRvIGNvbXBpbGUsIGJ1dCBwcm9kdWNlIGZhc3RlciBjb2RlLidcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgIGVudW06IFswLCAxLCAyLCAzXVxuICAgICAgICBkZWZhdWx0OiAyXG4gICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgIG9yZGVyOiAyXG4gICAgICBkZXByZWNhdGlvbldhcm5pbmdzOlxuICAgICAgICB0aXRsZTogJ0RlcHJlY2F0aW9uIFdhcm5pbmdzJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVzY3JpcHRpb246ICdJZiBkaXNhYmxlZCwgaGlkZXMgZGVwcmVjYXRpb24gd2FybmluZ3MuJ1xuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIG9yZGVyOiAzXG4gICAgICBudW1iZXJPZlRocmVhZHM6XG4gICAgICAgIHRpdGxlOiAnTnVtYmVyIG9mIFRocmVhZHMnXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYGdsb2JhbGAgd2lsbCB1c2UgZ2xvYmFsIHNldHRpbmcsIGBhdXRvYCBzZXRzIGl0IHRvIG51bWJlciBvZiBjb3Jlcy4nXG4gICAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xuICAgICAgICBvcmRlcjogNFxuICAgICAgc3RhcnR1cEFyZ3VtZW50czpcbiAgICAgICAgdGl0bGU6ICdBZGRpdGlvbmFsIEp1bGlhIFN0YXJ0dXAgQXJndW1lbnRzJ1xuICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYC1pYCwgYC1PYCwgYW5kIGAtLWRlcHdhcm5gIHdpbGwgYmUgc2V0IGJ5IHRoZSBhYm92ZSBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgYXV0b21hdGljYWxseSwgYnV0IGNhbiBiZSBvdmVyd3JpdHRlbiBoZXJlLiBBcmd1bWVudHMgYXJlXG4gICAgICAgICAgICAgICAgICAgICAgY29tbWEtc2VwYXJhdGVkLCBhbmQgeW91IHNob3VsZCBuZXZlciBuZWVkIHRvIHF1b3RlXG4gICAgICAgICAgICAgICAgICAgICAgYW55dGhpbmcgKGV2ZW4gZS5nLiBwYXRocyB3aXRoIHNwYWNlcyBpbiB0aGVtKS4nXG4gICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIGl0ZW1zOlxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIG9yZGVyOiA1XG4gICAgICBleHRlcm5hbFByb2Nlc3NQb3J0OlxuICAgICAgICB0aXRsZTogJ1BvcnQgZm9yIENvbW11bmljYXRpbmcgd2l0aCB0aGUgSnVsaWEgUHJvY2VzcydcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgZGVzY3JpcHRpb246ICdgcmFuZG9tYCB3aWxsIHVzZSBhIG5ldyBwb3J0IGVhY2ggdGltZSwgb3IgZW50ZXIgYW4gaW50ZWdlciB0byBzZXQgdGhlIHBvcnQgc3RhdGljYWxseS4nXG4gICAgICAgIGRlZmF1bHQ6ICdyYW5kb20nXG4gICAgICAgIG9yZGVyOiA2XG4gICAgICBhcmd1bWVudHM6XG4gICAgICAgIHRpdGxlOiAnQXJndW1lbnRzJ1xuICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IGBBUkdTYCB0byB0aGUgZm9sbG93aW5nIGVudHJpZXMgKGNvbW1hLXNlcGFyYXRlZCkuIFJlcXVpcmVzIHJlc3RhcnQgb2YgSnVsaWEgcHJvY2Vzcy4nXG4gICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIGl0ZW1zOlxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIG9yZGVyOiA3XG4gICAgICBwZXJzaXN0V29ya2luZ0RpcjpcbiAgICAgICAgdGl0bGU6ICdQZXJzaXN0IFdvcmtpbmcgRGlyZWN0b3J5J1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDhcbiAgICAgIHdvcmtpbmdEaXI6XG4gICAgICAgIHRpdGxlOiAnV29ya2luZyBEaXJlY3RvcnknXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIG9yZGVyOiA5XG4gICAgICBmdXp6eUNvbXBsZXRpb25Nb2RlOlxuICAgICAgICB0aXRsZTogJ0Z1enp5IENvbXBsZXRpb24gTW9kZSdcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgJycnXG4gICAgICAgICAgSWYgYHRydWVgLCBpbi1lZGl0b3IgYXV0by1jb21wbGV0aW9ucyBhcmUgZ2VuZXJhdGVkIGJhc2VkIG9uIGZ1enp5IChpLmUuIG1vcmUgcGVybWlzc2l2ZSkgbWF0Y2hlcyxcbiAgICAgICAgICBvdGhlcndpc2UgYmFzZWQgb24gc3RyaWN0IG1hdGNoZXMgYXMgaW4gUkVQTC5cbiAgICAgICAgICAqKipOT1RFKioqOiB0aGlzIHNldHRpbmcgZG9lc24ndCBhZmZlY3QgY29tcGxldGlvbnMgaW4gUkVQTCxcbiAgICAgICAgICBhbmQgc28gaW4tUkVQTCBjb21wbGV0aW9ucyB3aWxsIHN0aWxsIHdvcmsgYXMgdXN1YWwgKGkuZS4gYmFzZWQgb24gc3RyaWN0IG1hdGNoZXMgYW5kIHdpbGwgY29tcGxldGUgZWFnZXJseSkuXG4gICAgICAgICAgJycnXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIG9yZGVyOiAxMFxuICAgICAgYXV0b0NvbXBsZXRpb25TdWdnZXN0aW9uUHJpb3JpdHk6XG4gICAgICAgIHRpdGxlOiAnQXV0by1Db21wbGV0aW9uIFN1Z2dlc3Rpb24gUHJpb3JpdHknXG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICcnJ1xuICAgICAgICAgIFNwZWNpZnkgdGhlIHNvcnQgb3JkZXIgb2YgYXV0by1jb21wbGV0aW9uIHN1Z2dlc3Rpb25zIHByb3ZpZGVkIGJ5IEp1bm8uXG4gICAgICAgICAgTm90ZSB0aGUgZGVmYXVsdCBwcm92aWRlcnMgbGlrZSBzbmlwcGV0cyBoYXZlIHByaW9yaXR5IG9mIGAxYC5cbiAgICAgICAgICBSZXF1aXJlcyBBdG9tIHJlc3RhcnQgdG8gdGFrZSBhbiBlZmZlY3QuXG4gICAgICAgICAgJycnXG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICBkZWZhdWx0OiAzXG4gICAgICAgIG9yZGVyOiAxMVxuICAgICAgbm9BdXRvUGFyZW50aGVzaXM6XG4gICAgICAgIHRpdGxlOiAnRG9uXFwndCBJbnNlcnQgUGFyZW50aGVzaXMgb24gRnVuY3Rpb24gQXV0by1jb21wbGV0aW9uJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQsIEp1bm8gd2lsbCBub3QgaW5zZXJ0IHBhcmVudGhlc2lzIGFmdGVyIGNvbXBsZXRpbmcgYSBmdW5jdGlvbi4nXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBvcmRlcjogMTJcbiAgICAgIGZvcm1hdE9uU2F2ZTpcbiAgICAgICAgdGl0bGU6ICdGb3JtYXQgdGhlIGN1cnJlbnQgZWRpdG9yIHdoZW4gc2F2aW5nJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQsIEp1bm8gd2lsbCBmb3JtYXQgdGhlIGN1cnJlbnQgZWRpdG9yIG9uIHNhdmUgaWYgYSBKdWxpYSBzZXNzaW9uIGlzIHJ1bm5pbmcuJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDEzXG4gICAgICBmb3JtYXR0aW5nT3B0aW9uczpcbiAgICAgICAgdGl0bGU6ICdGb3JtYXR0aW5nIE9wdGlvbnMnXG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICcnJ1xuICAgICAgICAgIOKaoCBUaGlzIGNvbmZpZyBpcyBkZXByZWNhdGVkLiBJbiBvcmRlciB0byBzcGVjaWZ5XG4gICAgICAgICAgW0Zvcm1hdHRpbmcgT3B0aW9uc10oaHR0cHM6Ly9kb21sdW5hLmdpdGh1Yi5pby9KdWxpYUZvcm1hdHRlci5qbC9kZXYvI0Zvcm1hdHRpbmctT3B0aW9ucy0xKSxcbiAgICAgICAgICB1c2UgYC5KdWxpYUZvcm1hdHRlci50b21sYCBjb25maWd1cmF0aW9uIGZpbGUgaW5zdGVhZC5cbiAgICAgICAgICBTZWUgdGhlIFtcIkNvbmZpZ3VyYXRpb24gRmlsZVwiIHNlY3Rpb25dKGh0dHBzOi8vZG9tbHVuYS5naXRodWIuaW8vSnVsaWFGb3JtYXR0ZXIuamwvc3RhYmxlL2NvbmZpZy8pXG4gICAgICAgICAgaW4gSnVsaWFGb3JtYXR0ZXIuamwncyBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICAgICAgJycnXG4gICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgIG9yZGVyOiAxNFxuICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICBtb2NrOiAjIE5PVEU6IG90aGVyd2lzZSB0aGUgZGVwcmVjYXRlZCBkZXNjcmlwdGlvbiBkb2Vzbid0IHNob3cgdXBcbiAgICAgICAgICAgIHRpdGxlOiBcIm1vY2sgKGRvZXNuJ3QgaGF2ZSBhbnkgZWZmZWN0KVwiXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG5cbiAgdWlPcHRpb25zOlxuICAgIHRpdGxlOiAnVUkgT3B0aW9ucydcbiAgICB0eXBlOiAnb2JqZWN0J1xuICAgIG9yZGVyOiAzXG4gICAgY29sbGFwc2VkOiB0cnVlXG4gICAgcHJvcGVydGllczpcbiAgICAgIHJlc3VsdHNEaXNwbGF5TW9kZTpcbiAgICAgICAgdGl0bGU6ICdSZXN1bHQgRGlzcGxheSBNb2RlJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnaW5saW5lJ1xuICAgICAgICBlbnVtOiBbXG4gICAgICAgICAge3ZhbHVlOidpbmxpbmUnLCBkZXNjcmlwdGlvbjonRmxvYXQgcmVzdWx0cyBuZXh0IHRvIGNvZGUnfVxuICAgICAgICAgIHt2YWx1ZTonYmxvY2snLCBkZXNjcmlwdGlvbjonRGlzcGxheSByZXN1bHRzIHVuZGVyIGNvZGUnfVxuICAgICAgICAgIHt2YWx1ZTonY29uc29sZScsIGRlc2NyaXB0aW9uOidEaXNwbGF5IHJlc3VsdHMgaW4gdGhlIFJFUEwnfVxuICAgICAgICBdXG4gICAgICAgIG9yZGVyOiAxXG4gICAgICBzY3JvbGxUb1Jlc3VsdDpcbiAgICAgICAgdGl0bGU6ICdTY3JvbGwgdG8gSW5saW5lIFJlc3VsdHMnXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBvcmRlcjogMlxuICAgICAgZG9jc0Rpc3BsYXlNb2RlOlxuICAgICAgICB0aXRsZTogJ0RvY3VtZW50YXRpb24gRGlzcGxheSBNb2RlJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAncGFuZSdcbiAgICAgICAgZW51bTogW1xuICAgICAgICAgIHt2YWx1ZTogJ2lubGluZScsIGRlc2NyaXB0aW9uOiAnU2hvdyBkb2N1bWVudGF0aW9uIGluIHRoZSBlZGl0b3InfVxuICAgICAgICAgIHt2YWx1ZTogJ3BhbmUnLCBkZXNjcmlwdGlvbjogJ1Nob3cgZG9jdW1lbnRhdGlvbiBpbiB0aGUgZG9jdW1lbnRhdGlvbiBwYW5lJ31cbiAgICAgICAgXVxuICAgICAgICBvcmRlcjogM1xuICAgICAgZXJyb3JOb3RpZmljYXRpb25zOlxuICAgICAgICB0aXRsZTogJ0Vycm9yIE5vdGlmaWNhdGlvbnMnXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBldmFsdWF0aW5nIGEgc2NyaXB0LCBzaG93IGVycm9ycyBpbiBhIG5vdGlmaWNhdGlvbiBhc1xuICAgICAgICAgICAgICAgICAgICAgIHdlbGwgYXMgaW4gdGhlIFJFUEwuJ1xuICAgICAgICBvcmRlcjogNFxuICAgICAgZXJyb3JJblJlcGw6XG4gICAgICAgIHRpdGxlOiAnU2hvdyBFcnJvcnMgaW4gUkVQTCAoSW5saW5lIEV2YWx1YXRpb24pJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkLCBKdW5vIGFsd2F5cyBzaG93cyBlcnJvcnMgaW4gdGhlIFJFUEwgd2hlbiB1c2luZyBpbmxpbmUgZXZhbHVhdGlvbi4nXG4gICAgICAgIG9yZGVyOiA1XG4gICAgICBlbmFibGVNZW51OlxuICAgICAgICB0aXRsZTogJ0VuYWJsZSBNZW51J1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246ICdTaG93IGEgSnVsaWEgbWVudSBpbiB0aGUgbWVudSBiYXIgKHJlcXVpcmVzIHJlc3RhcnQpLidcbiAgICAgICAgb3JkZXI6IDZcbiAgICAgIGVuYWJsZVRvb2xCYXI6XG4gICAgICAgIHRpdGxlOiAnRW5hYmxlIFRvb2xiYXInXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgSnVsaWEgaWNvbnMgaW4gdGhlIHRvb2wgYmFyIChyZXF1aXJlcyByZXN0YXJ0KS4nXG4gICAgICAgIG9yZGVyOiA3XG4gICAgICB1c2VQbG90UGFuZTpcbiAgICAgICAgdGl0bGU6ICdFbmFibGUgUGxvdCBQYW5lJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgcGxvdHMgaW4gQXRvbS4nXG4gICAgICAgIG9yZGVyOiA4XG4gICAgICBtYXhOdW1iZXJQbG90czpcbiAgICAgICAgdGl0bGU6ICdNYXhpbXVtIE51bWJlciBvZiBQbG90cyBpbiBIaXN0b3J5J1xuICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICBkZWZhdWx0OiA1MFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0luY3JlYXNpbmcgdGhpcyBudW1iZXIgbWF5IGxlYWQgdG8gaGlnaCBtZW1vcnkgY29uc3VtcHRpb24gYW5kIHBvb3IgcGVyZm9ybWFuY2UuJ1xuICAgICAgICBvcmRlcjogOVxuICAgICAgb3Blbk5ld0VkaXRvcldoZW5EZWJ1Z2dpbmc6XG4gICAgICAgIHRpdGxlOiAnT3BlbiBOZXcgRWRpdG9yIFdoZW4gRGVidWdnaW5nJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246ICdPcGVucyBhIG5ldyBlZGl0b3IgdGFiIHdoZW4gc3RlcHBpbmcgaW50byBhIG5ldyBmaWxlIGluc3RlYWRcbiAgICAgICAgICAgICAgICAgICAgICBvZiByZXVzaW5nIHRoZSBjdXJyZW50IG9uZSAocmVxdWlyZXMgcmVzdGFydCkuJ1xuICAgICAgICBvcmRlcjogMTBcbiAgICAgIGNlbGxEZWxpbWl0ZXI6XG4gICAgICAgIHRpdGxlOiAnQ2VsbCBEZWxpbWl0ZXInXG4gICAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgICAgZGVmYXVsdDogWycjIyg/ISMpJywgJyMtLS0nLCAnI1xcXFxzPyUlJ11cbiAgICAgICAgZGVzY3JpcHRpb246ICdSZWd1bGFyIGV4cHJlc3Npb25zIGZvciBkZXRlcm1pbmluZyBjZWxsIGRlbGltaXRlcnMuJ1xuICAgICAgICBvcmRlcjogMTFcbiAgICAgIGhpZ2hsaWdodENlbGxzOlxuICAgICAgICB0aXRsZTogJ0hpZ2hsaWdodCBDZWxscydcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ3VzdG9taXplIHRoZSBhcHBlYXJlbmNlIG9mIEp1bm9cXCdzIGNlbGwgaGlnaGxpZ2h0aW5nIGJ5XG4gICAgICAgICAgICAgICAgICAgICAgYWRkaW5nIHN0eWxlcyBmb3IgYC5saW5lLmp1bGlhLWN1cnJlbnQtY2VsbGAgb3JcbiAgICAgICAgICAgICAgICAgICAgICBgLmxpbmUtbnVtYmVyLmp1bGlhLWN1cnJlbnQtY2VsbGAgdG8geW91ciBwZXJzb25hbFxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQuJ1xuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIG9yZGVyOiAxMlxuICAgICAgbGF5b3V0czpcbiAgICAgICAgdGl0bGU6ICdMYXlvdXQgT3B0aW9ucydcbiAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgb3JkZXI6IDEzXG4gICAgICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIGNvbnNvbGU6XG4gICAgICAgICAgICB0aXRsZTogJ1JFUEwnXG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uOlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCBsb2NhdGlvbiBvZiBSRVBMIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2NlbnRlcicsICdsZWZ0JywgJ2JvdHRvbScsICdyaWdodCddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2JvdHRvbSdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAxXG4gICAgICAgICAgICAgIHNwbGl0OlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU3BsaXR0aW5nIHJ1bGUgb2YgUkVQTCBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydubyBzcGxpdCcsICdsZWZ0JywgJ3VwJywgJ3JpZ2h0JywgJ2Rvd24nXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdubyBzcGxpdCdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAyXG4gICAgICAgICAgdGVybWluYWw6XG4gICAgICAgICAgICB0aXRsZTogJ1Rlcm1pbmFsJ1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICAgIG9yZGVyOiAyXG4gICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICAgICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgIGRlZmF1bHRMb2NhdGlvbjpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQgbG9jYXRpb24gb2YgVGVybWluYWwgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnY2VudGVyJywgJ2xlZnQnLCAnYm90dG9tJywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnYm90dG9tJ1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICAgICAgc3BsaXQ6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTcGxpdHRpbmcgcnVsZSBvZiBUZXJtaW5hbCBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydubyBzcGxpdCcsICdsZWZ0JywgJ3VwJywgJ3JpZ2h0JywgJ2Rvd24nXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdubyBzcGxpdCdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAyXG4gICAgICAgICAgd29ya3NwYWNlOlxuICAgICAgICAgICAgdGl0bGU6ICdXb3Jrc3BhY2UnXG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uOlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCBsb2NhdGlvbiBvZiBXb3Jrc3BhY2UgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnY2VudGVyJywgJ2xlZnQnLCAnYm90dG9tJywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnY2VudGVyJ1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICAgICAgc3BsaXQ6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTcGxpdHRpbmcgcnVsZSBvZiBXb3Jrc3BhY2UgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnbm8gc3BsaXQnLCAnbGVmdCcsICd1cCcsICdyaWdodCcsICdkb3duJ11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgICAgICAgICBvcmRlcjogMlxuICAgICAgICAgIGRvY3VtZW50YXRpb246XG4gICAgICAgICAgICB0aXRsZTogJ0RvY3VtZW50YXRpb24gQnJvd3NlcidcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgICAgICBvcmRlcjogNFxuICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICBkZWZhdWx0TG9jYXRpb246XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdEZWZhdWx0IGxvY2F0aW9uIG9mIERvY3VtZW50YXRpb24gQnJvd3NlciBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydjZW50ZXInLCAnbGVmdCcsICdib3R0b20nLCAncmlnaHQnXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdjZW50ZXInXG4gICAgICAgICAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgICAgICAgICBvcmRlcjogMVxuICAgICAgICAgICAgICBzcGxpdDpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1NwbGl0dGluZyBydWxlIG9mIERvY3VtZW50YXRpb24gQnJvd3NlciBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydubyBzcGxpdCcsICdsZWZ0JywgJ3VwJywgJ3JpZ2h0JywgJ2Rvd24nXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdyaWdodCdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAyXG4gICAgICAgICAgcGxvdFBhbmU6XG4gICAgICAgICAgICB0aXRsZTogJ1Bsb3QgUGFuZSdcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgICAgICBvcmRlcjogNVxuICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICBkZWZhdWx0TG9jYXRpb246XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdEZWZhdWx0IGxvY2F0aW9uIG9mIFBsb3QgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnY2VudGVyJywgJ2xlZnQnLCAnYm90dG9tJywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnY2VudGVyJ1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICAgICAgc3BsaXQ6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTcGxpdHRpbmcgcnVsZSBvZiBQbG90IFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ25vIHNwbGl0JywgJ2xlZnQnLCAndXAnLCAncmlnaHQnLCAnZG93biddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ3JpZ2h0J1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgICBkZWJ1Z2dlclBhbmU6XG4gICAgICAgICAgICB0aXRsZTogJ0RlYnVnZ2VyIFBhbmUnXG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICAgICAgb3JkZXI6IDZcbiAgICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uOlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCBsb2NhdGlvbiBvZiBEZWJ1Z2dlciBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydjZW50ZXInLCAnbGVmdCcsICdib3R0b20nLCAncmlnaHQnXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdyaWdodCdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAxXG4gICAgICAgICAgICAgIHNwbGl0OlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU3BsaXR0aW5nIHJ1bGUgb2YgRGVidWdnZXIgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnbm8gc3BsaXQnLCAnbGVmdCcsICd1cCcsICdyaWdodCcsICdkb3duJ11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnbm8gc3BsaXQnXG4gICAgICAgICAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgICAgICAgICBvcmRlcjogMlxuICAgICAgICAgIHByb2ZpbGVyOlxuICAgICAgICAgICAgdGl0bGU6ICdQcm9maWxlcidcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgICAgICBvcmRlcjogN1xuICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICBkZWZhdWx0TG9jYXRpb246XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdEZWZhdWx0IGxvY2F0aW9uIG9mIFByb2ZpbGVyIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2NlbnRlcicsICdsZWZ0JywgJ2JvdHRvbScsICdyaWdodCddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2NlbnRlcidcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAxXG4gICAgICAgICAgICAgIHNwbGl0OlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU3BsaXR0aW5nIHJ1bGUgb2YgUHJvZmlsZXIgUGFuZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGVudW06IFsnbm8gc3BsaXQnLCAnbGVmdCcsICd1cCcsICdyaWdodCcsICdkb3duJ11cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgICAgICAgICBvcmRlcjogMlxuICAgICAgICAgIGxpbnRlcjpcbiAgICAgICAgICAgIHRpdGxlOiAnTGludGVyJ1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICAgIG9yZGVyOiA4XG4gICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICAgICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgIGRlZmF1bHRMb2NhdGlvbjpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQgbG9jYXRpb24gb2YgTGludGVyIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2NlbnRlcicsICdsZWZ0JywgJ2JvdHRvbScsICdyaWdodCddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2JvdHRvbSdcbiAgICAgICAgICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAxXG4gICAgICAgICAgICAgIHNwbGl0OlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU3BsaXR0aW5nIHJ1bGUgb2YgTGludGVyIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ25vIHNwbGl0JywgJ2xlZnQnLCAndXAnLCAncmlnaHQnLCAnZG93biddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ25vIHNwbGl0J1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgICBvdXRsaW5lOlxuICAgICAgICAgICAgdGl0bGU6ICdPdXRsaW5lJ1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICAgIG9yZGVyOiA5XG4gICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICAgICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgIGRlZmF1bHRMb2NhdGlvbjpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQgbG9jYXRpb24gb2YgT3V0bGluZSBQYW5lJ1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgZW51bTogWydjZW50ZXInLCAnbGVmdCcsICdib3R0b20nLCAncmlnaHQnXVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdsZWZ0J1xuICAgICAgICAgICAgICAgIHJhZGlvOiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICAgICAgc3BsaXQ6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTcGxpdHRpbmcgcnVsZSBvZiBPdXRsaW5lIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ25vIHNwbGl0JywgJ2xlZnQnLCAndXAnLCAncmlnaHQnLCAnZG93biddXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2Rvd24nXG4gICAgICAgICAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgICAgICAgICBvcmRlcjogMlxuICAgICAgICAgIGRlZmF1bHRQYW5lczpcbiAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCBQYW5lcydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmeSBwYW5lcyB0aGF0IGFyZSBvcGVuZWQgYnkgYEp1bGlhIENsaWVudDogUmVzdG9yZSBEZWZhdWx0IExheW91dGAuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBsb2NhdGlvbiBhbmQgc3BsaXR0aW5nIHJ1bGUgb2YgZWFjaCBwYW5lIGZvbGxvdyB0aGUgc2V0dGluZ3MgYWJvdmUuJ1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICAgIG9yZGVyOiAxMFxuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgY29uc29sZTpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JFUEwnXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiAxXG4gICAgICAgICAgICAgIHdvcmtzcGFjZTpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1dvcmtzcGFjZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgICAgICAgZG9jdW1lbnRhdGlvbjpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RvY3VtZW50YXRpb24gQnJvd3NlcidcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgICAgICAgcGxvdFBhbmU6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQbG90IFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgIG9yZGVyOiA0XG4gICAgICAgICAgICAgIGRlYnVnZ2VyUGFuZTpcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RlYnVnZ2VyIFBhbmUnXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgICAgICBvcmRlcjogNVxuICAgICAgICAgICAgICBsaW50ZXI6XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdMaW50ZXInXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgICAgICBvcmRlcjogNlxuICAgICAgICAgICAgICBvdXRsaW5lOlxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3V0bGluZSdcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgICAgIG9yZGVyOiA3XG4gICAgICAgICAgb3BlbkRlZmF1bHRQYW5lc09uU3RhcnRVcDpcbiAgICAgICAgICAgIHRpdGxlOiAnT3BlbiBEZWZhdWx0IFBhbmVzIG9uIFN0YXJ0dXAnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQsIG9wZW5zIHBhbmVzIHNwZWNpZmllZCBhYm92ZSBvbiBzdGFydHVwLlxuICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RlIGEgbGF5b3V0IGRlc2VyaWFsaXplZCBmcm9tIGEgcHJldmlvdXMgd2luZG93IHN0YXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkIGJlIG1vZGlmaWVkIGJ5IHRoYXQsIGkuZS46IGRpc2FibGUgdGhpcyBpZiB5b3Ugd2FudFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0byBrZWVwIHRoZSBkZXNlcmlhbGl6ZWQgbGF5b3V0LidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgb3JkZXI6IDExXG5cbiAgY29uc29sZU9wdGlvbnM6XG4gICAgdHlwZTogJ29iamVjdCdcbiAgICB0aXRsZTogJ1Rlcm1pbmFsIE9wdGlvbnMnXG4gICAgb3JkZXI6IDRcbiAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgbWF4aW11bUNvbnNvbGVTaXplOlxuICAgICAgICB0aXRsZTogJ1Njcm9sbGJhY2sgQnVmZmVyIFNpemUnXG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICBkZWZhdWx0OiAxMDAwMFxuICAgICAgICBvcmRlcjogMVxuICAgICAgcHJvbXB0OlxuICAgICAgICB0aXRsZTogJ1Rlcm1pbmFsIFByb21wdCdcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdDogJ2p1bGlhPidcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgIHNoZWxsOlxuICAgICAgICB0aXRsZTogJ1NoZWxsJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiB0ZXJtaW5hbC5kZWZhdWx0U2hlbGwoKVxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBsb2NhdGlvbiBvZiBhbiBleGVjdXRhYmxlIHNoZWxsLiBTZXQgdG8gYCRTSEVMTGAgYnkgZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICBhbmQgaWYgYCRTSEVMTGAgaXNuXFwndCBzZXQgdGhlbiBmYWxsYmFjayB0byBgYmFzaGAgb3IgYHBvd2Vyc2hlbGwuZXhlYCAob24gV2luZG93cykuJ1xuICAgICAgICBvcmRlcjogM1xuICAgICAgdGVybWluYWw6XG4gICAgICAgIHRpdGxlOiAnVGVybWluYWwnXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQ6IHRlcm1pbmFsLmRlZmF1bHRUZXJtaW5hbCgpXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29tbWFuZCB1c2VkIHRvIG9wZW4gYW4gZXh0ZXJuYWwgdGVybWluYWwuJ1xuICAgICAgICBvcmRlcjogNFxuICAgICAgd2hpdGVsaXN0ZWRLZXliaW5kaW5nc1JFUEw6XG4gICAgICAgIHRpdGxlOiAnV2hpdGVsaXN0ZWQgS2V5YmluZGluZ3MgZm9yIHRoZSBKdWxpYSBSRVBMJ1xuICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgIGRlZmF1bHQ6IFsnQ3RybC1DJywgJ0N0cmwtUycsICdGNScsICdGOCcsICdGOScsICdGMTAnLCAnRjExJywgJ1NoaWZ0LUY1JywgJ1NoaWZ0LUY4JywgJ1NoaWZ0LUY5JywgJ1NoaWZ0LUYxMCcsICdTaGlmdC1GMTEnXVxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBsaXN0ZWQga2V5YmluZGluZ3MgYXJlIG5vdCBoYW5kbGVkIGJ5IHRoZSBSRVBMIGFuZCBpbnN0ZWFkIGRpcmVjdGx5IHBhc3NlZCB0byBBdG9tLidcbiAgICAgICAgb3JkZXI6IDVcbiAgICAgIHdoaXRlbGlzdGVkS2V5YmluZGluZ3NUZXJtaW5hbDpcbiAgICAgICAgdGl0bGU6ICdXaGl0ZWxpc3RlZCBLZXliaW5kaW5ncyBmb3IgVGVybWluYWxzJ1xuICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGxpc3RlZCBrZXliaW5kaW5ncyBhcmUgbm90IGhhbmRsZWQgYnkgYW55IHRlcm1pbmFscyBhbmQgaW5zdGVhZCBkaXJlY3RseSBwYXNzZWQgdG8gQXRvbS4nXG4gICAgICAgIG9yZGVyOiA2XG4gICAgICBjdXJzb3JTdHlsZTpcbiAgICAgICAgdGl0bGU6ICdDdXJzb3IgU3R5bGUnXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGVudW06IFsnYmxvY2snLCAndW5kZXJsaW5lJywgJ2JhciddXG4gICAgICAgIGRlZmF1bHQ6ICdibG9jaydcbiAgICAgICAgcmFkaW86IHRydWVcbiAgICAgICAgb3JkZXI6IDdcbiAgICAgIGN1cnNvckJsaW5rOlxuICAgICAgICB0aXRsZTogJ0N1cnNvciBCbGluaydcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIG9yZGVyOiA4XG4gICAgICB0ZXJtaW5hbFJlbmRlcmVyVHlwZTpcbiAgICAgICAgdGl0bGU6ICdUZXJtaW5hbCBSZW5kZXJlcidcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgZW51bTogWyd3ZWJnbCcsICdjYW52YXMnLCAnZG9tJ11cbiAgICAgICAgZGVmYXVsdDogJ3dlYmdsJ1xuICAgICAgICByYWRpbzogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBgd2ViZ2xgIHJlbmRlcmVyIGlzIGZhc3Rlc3QsIGJ1dCBpcyBzdGlsbCBleHBlcmltZW50YWwuIGBjYW52YXNgIHBlcmZvcm1zIHdlbGxcbiAgICAgICAgICAgICAgICAgICAgICBpbiBtYW55IGNhc2VzLCB3aGlsZSBgZG9tYCBpcyBhIHNsb3cgZmFsYmFjay4gTm90ZSB0aGF0IGl0XFwncyBub3QgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgICB0byBob3Qtc3dhcCB0byB0aGUgYHdlYmdsYCByZW5kZXJlci4nXG4gICAgICAgIG9yZGVyOiA5XG4gICAgICBsaW5rTW9kaWZpZXI6XG4gICAgICAgIHRpdGxlOiAnQ3RybC9DbWQgbW9kaWZpZXIgZm9yIGxpbmsgYWN0aXZhdGlvbidcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDEwXG5cbiAgcmVtb3RlT3B0aW9uczpcbiAgICB0eXBlOiAnb2JqZWN0J1xuICAgIG9yZGVyOiA1XG4gICAgY29sbGFwc2VkOiB0cnVlXG4gICAgcHJvcGVydGllczpcbiAgICAgIHJlbW90ZUp1bGlhOlxuICAgICAgICB0aXRsZTogJ0NvbW1hbmQgdG8gZXhlY3V0ZSBKdWxpYSBvbiB0aGUgcmVtb3RlIHNlcnZlcidcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdDogJ2p1bGlhJ1xuICAgICAgICBvcmRlcjogMVxuICAgICAgdG11eDpcbiAgICAgICAgdGl0bGU6ICdVc2UgYSBwZXJzaXN0ZW50IHRtdXggc2Vzc2lvbidcbiAgICAgICAgZGVzY3JpcHRpb246ICdSZXF1aXJlcyB0bXV4IHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgc2VydmVyIHlvdVxcJ3JlIGNvbm5lY3RpbmcgdG8uJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgIHRtdXhOYW1lOlxuICAgICAgICB0aXRsZTogJ3RtdXggc2Vzc2lvbiBuYW1lJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnanVub190bXV4X3Nlc3Npb24nXG4gICAgICAgIG9yZGVyOiAzXG4gICAgICBhZ2VudEF1dGg6XG4gICAgICAgIHRpdGxlOiAnVXNlIFNTSCBhZ2VudCdcbiAgICAgICAgZGVzY3JpcHRpb246ICdSZXF1aXJlcyBgJFNTSF9BVVRIX1NPQ0tFVGAgdG8gYmUgc2V0LiBEZWZhdWx0cyB0byBwdXR0eVxcJ3MgcGFnZWFudCBvbiBXaW5kb3dzLidcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDRcbiAgICAgIGZvcndhcmRBZ2VudDpcbiAgICAgICAgdGl0bGU6ICdGb3J3YXJkIFNTSCBhZ2VudCdcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDVcblxuICBqdWxpYVN5bnRheFNjb3BlczpcbiAgICB0aXRsZTogJ0p1bGlhIFN5bnRheCBTY29wZXMnXG4gICAgZGVzY3JpcHRpb246XG4gICAgICAnVGhlIGxpc3RlZCBzeW50YXggc2NvcGVzIChjb21tYSBzZXBhcmF0ZWQpIHdpbGwgYmUgcmVjb2dpbml6ZWQgYXMgSnVsaWEgZmlsZXMuXG4gICAgICAgWW91IG1heSBoYXZlIHRvIHJlc3RhcnQgQXRvbSB0byB0YWtlIGFuIGVmZmVjdC5cXG5cbiAgICAgICAqKkRPIE5PVCoqIGVkaXQgdGhpcyB1bmxlc3MgeW91XFwncmUgc3VyZSBhYm91dCB0aGUgZWZmZWN0LidcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogWydzb3VyY2UuanVsaWEnLCAnc291cmNlLndlYXZlLm1kJywgJ3NvdXJjZS53ZWF2ZS5sYXRleCddXG4gICAgb3JkZXI6IDZcblxuICBkaXNhYmxlUHJveHk6XG4gICAgdGl0bGU6ICdEaXNhYmxlIFN5c3RlbSBQcm94eSBmb3IgQ2hpbGQgUHJvY2Vzc2VzJ1xuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgJ1RoaXMgdW5zZXRzIHRoZSBgSFRUUF9QUk9YWWAgYW5kIGBIVFRQU19QUk9YWWAgZW52aXJvbm1lbnQgdmFyaWFibGVzIGluIGFsbCBpbnRlZ3JhdGVkXG4gICAgICAgdGVybWluYWxzLiBUcnkgdGhpcyBvcHRpb24gaWYgeW91XFwncmUgZXhwZXJpZW5jaW5nIGlzc3VlcyB3aGVuIGluc3RhbGxpbmcgSnVsaWEgcGFja2FnZXNcbiAgICAgICBpbiBKdW5vLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG9yZGVyOiA3XG5cbiAgZmlyc3RCb290OlxuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogOTlcblxuICBjdXJyZW50VmVyc2lvbjpcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICcwLjAuMCdcbiAgICBvcmRlcjogMTAwXG5cbmlmIHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbidcbiAgY29uZmlnLmNvbnNvbGVPcHRpb25zLnByb3BlcnRpZXMud2hpdGVsaXN0ZWRLZXliaW5kaW5nc1JFUEwuZGVmYXVsdCA9XG4gICAgWydDdHJsLUMnLCAnQ3RybC1KJywgJ0N0cmwtSycsICdDdHJsLUUnLCAnQ3RybC1WJywgJ0N0cmwtTScsICdGNScsICdGOCcsICdGOScsXG4gICAgICdGMTAnLCAnRjExJywgJ1NoaWZ0LUY1JywgJ1NoaWZ0LUY4JywgJ1NoaWZ0LUY5JywgJ1NoaWZ0LUYxMCcsICdTaGlmdC1GMTEnXVxuXG5pZiBwcm9jZXNzLnBsYXRmb3JtID09ICdkYXJ3aW4nXG4gIGNvbmZpZy5jb25zb2xlT3B0aW9ucy5wcm9wZXJ0aWVzLm1hY09wdGlvbklzTWV0YSA9XG4gICAgdGl0bGU6ICdVc2UgT3B0aW9uIGFzIE1ldGEnXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBvcmRlcjogNS41XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnXG4iXX0=
