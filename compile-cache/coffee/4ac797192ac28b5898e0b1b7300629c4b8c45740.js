(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function() {
      var menu;
      this.subs = new CompositeDisposable;
      this.subs.add(atom.menu.add([
        {
          label: 'Packages',
          submenu: this.menu
        }
      ]));
      if (atom.config.get('julia-client.uiOptions.enableMenu')) {
        this.subs.add = atom.menu.add(this.menu);
        menu = atom.menu.template.pop();
        return atom.menu.template.splice(3, 0, menu);
      }
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    menu: [
      {
        label: 'Juno',
        submenu: [
          {
            label: 'Start Julia',
            command: 'julia-client:start-julia'
          }, {
            label: 'Start Remote Julia Process',
            command: 'julia-client:start-remote-julia-process'
          }, {
            label: 'Interrupt Julia',
            command: 'julia-client:interrupt-julia'
          }, {
            label: 'Stop Julia',
            command: 'julia-client:kill-julia'
          }, {
            type: 'separator'
          }, {
            label: 'Open REPL',
            command: 'julia-client:open-REPL'
          }, {
            label: 'Clear REPL',
            command: 'julia-client:clear-REPL'
          }, {
            label: 'Open External REPL',
            command: 'julia-client:open-external-REPL'
          }, {
            label: 'Working Directory',
            submenu: [
              {
                label: 'Current File\'s Folder',
                command: 'julia-client:work-in-current-folder'
              }, {
                label: 'Select Project Folder',
                command: 'julia-client:work-in-project-folder'
              }, {
                label: 'Home Folder',
                command: 'julia-client:work-in-home-folder'
              }, {
                label: 'Select...',
                command: 'julia-client:select-working-folder'
              }
            ]
          }, {
            label: 'Environment',
            submenu: [
              {
                label: 'Environment in Current File\'s Folder',
                command: 'julia-client:activate-environment-in-current-folder'
              }, {
                label: 'Environment in Parent Folder',
                command: 'julia-client:activate-environment-in-parent-folder'
              }, {
                label: 'Default Environment',
                command: 'julia-client:activate-default-environment'
              }, {
                label: 'Set Working Environment',
                command: 'julia-client:set-working-environment'
              }
            ]
          }, {
            label: 'Set Working Module',
            command: 'julia-client:set-working-module'
          }, {
            type: 'separator'
          }, {
            label: 'Run Block',
            command: 'julia-client:run-block'
          }, {
            label: 'Run All',
            command: 'julia-client:run-all'
          }, {
            type: 'separator'
          }, {
            label: 'Format Code',
            command: 'julia-client:format-code'
          }, {
            type: 'separator'
          }, {
            label: 'Debug: Run Block',
            command: 'julia-debug:run-block'
          }, {
            label: 'Debug: Step through Block',
            command: 'julia-debug:step-through-block'
          }, {
            label: 'Debug: Run File',
            command: 'julia-debug:run-file'
          }, {
            label: 'Debug: Step through File',
            command: 'julia-debug:step-through-file'
          }, {
            type: 'separator'
          }, {
            label: 'Open Workspace',
            command: 'julia-client:open-workspace'
          }, {
            label: 'Open Outline Pane',
            command: 'julia-client:open-outline-pane'
          }, {
            label: 'Open Documentation Browser',
            command: 'julia-client:open-documentation-browser'
          }, {
            label: 'Open Plot Pane',
            command: 'julia-client:open-plot-pane'
          }, {
            label: 'Open Debugger Pane',
            command: 'julia-debug:open-debugger-pane'
          }, {
            type: 'separator'
          }, {
            label: 'Open New Julia File',
            command: 'julia:new-julia-file'
          }, {
            label: 'Open Julia Startup File',
            command: 'julia:open-julia-startup-file'
          }, {
            label: 'Open Juno Startup File',
            command: 'julia:open-juno-startup-file'
          }, {
            label: 'Open Julia Home',
            command: 'julia:open-julia-home'
          }, {
            label: 'Open Package in New Window...',
            command: 'julia:open-package-in-new-window'
          }, {
            label: 'Open Package as Project Folder...',
            command: 'julia:open-package-as-project-folder'
          }, {
            type: 'separator'
          }, {
            label: 'New Terminal',
            submenu: [
              {
                label: 'Current File\'s Folder',
                command: 'julia-client:new-terminal-from-current-folder'
              }, {
                label: 'Select Project Folder',
                command: 'julia-client:new-terminal'
              }
            ]
          }, {
            label: 'New Remote Terminal',
            command: 'julia-client:new-remote-terminal'
          }, {
            type: 'separator'
          }, {
            label: 'Debug Information',
            command: 'julia-client:debug-info'
          }, {
            label: 'Release Note...',
            command: 'julia-client:open-release-note'
          }, {
            label: 'Help...',
            command: 'julia:get-help'
          }, {
            label: 'Settings...',
            command: 'julia-client:settings'
          }
        ]
      }
    ]
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3BhY2thZ2UvbWVudS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSTtNQUVaLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBVixDQUFjO1FBQUM7VUFDdkIsS0FBQSxFQUFPLFVBRGdCO1VBRXZCLE9BQUEsRUFBUyxJQUFDLENBQUEsSUFGYTtTQUFEO09BQWQsQ0FBVjtNQU1BLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFWLENBQWMsSUFBQyxDQUFBLElBQWY7UUFFWixJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBbkIsQ0FBQTtlQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQW5CLENBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDLElBQWhDLEVBSkY7O0lBVFEsQ0FBVjtJQWVBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFEVSxDQWZaO0lBa0JBLElBQUEsRUFBTTtNQUFDO1FBQ0wsS0FBQSxFQUFPLE1BREY7UUFFTCxPQUFBLEVBQVM7VUFDUDtZQUFDLEtBQUEsRUFBTyxhQUFSO1lBQXVCLE9BQUEsRUFBUywwQkFBaEM7V0FETyxF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J2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgQHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICMgUGFja2FnZSBzdWJtZW51XG4gICAgQHN1YnMuYWRkIGF0b20ubWVudS5hZGQgW3tcbiAgICAgIGxhYmVsOiAnUGFja2FnZXMnLFxuICAgICAgc3VibWVudTogQG1lbnVcbiAgICB9XVxuXG4gICAgIyBBcHAgTWVudVxuICAgIGlmIGF0b20uY29uZmlnLmdldCAnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5lbmFibGVNZW51J1xuICAgICAgQHN1YnMuYWRkID0gYXRvbS5tZW51LmFkZCBAbWVudVxuICAgICAgIyBUT0RPOiBmaW5kIGEgbGVzcyBoYWNreSB3YXkgdG8gZG8gdGhpc1xuICAgICAgbWVudSA9IGF0b20ubWVudS50ZW1wbGF0ZS5wb3AoKVxuICAgICAgYXRvbS5tZW51LnRlbXBsYXRlLnNwbGljZSAzLCAwLCBtZW51XG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vicy5kaXNwb3NlKClcblxuICBtZW51OiBbe1xuICAgIGxhYmVsOiAnSnVubydcbiAgICBzdWJtZW51OiBbXG4gICAgICB7bGFiZWw6ICdTdGFydCBKdWxpYScsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6c3RhcnQtanVsaWEnfVxuICAgICAge2xhYmVsOiAnU3RhcnQgUmVtb3RlIEp1bGlhIFByb2Nlc3MnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OnN0YXJ0LXJlbW90ZS1qdWxpYS1wcm9jZXNzJ31cbiAgICAgIHtsYWJlbDogJ0ludGVycnVwdCBKdWxpYScsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6aW50ZXJydXB0LWp1bGlhJ31cbiAgICAgIHtsYWJlbDogJ1N0b3AgSnVsaWEnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OmtpbGwtanVsaWEnfVxuXG4gICAgICB7dHlwZTogJ3NlcGFyYXRvcid9XG5cbiAgICAgIHtsYWJlbDogJ09wZW4gUkVQTCcsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6b3Blbi1SRVBMJ31cbiAgICAgIHtsYWJlbDogJ0NsZWFyIFJFUEwnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OmNsZWFyLVJFUEwnfVxuICAgICAge2xhYmVsOiAnT3BlbiBFeHRlcm5hbCBSRVBMJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpvcGVuLWV4dGVybmFsLVJFUEwnfVxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1dvcmtpbmcgRGlyZWN0b3J5J1xuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge2xhYmVsOiAnQ3VycmVudCBGaWxlXFwncyBGb2xkZXInLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OndvcmstaW4tY3VycmVudC1mb2xkZXInfVxuICAgICAgICAgIHtsYWJlbDogJ1NlbGVjdCBQcm9qZWN0IEZvbGRlcicsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6d29yay1pbi1wcm9qZWN0LWZvbGRlcid9XG4gICAgICAgICAge2xhYmVsOiAnSG9tZSBGb2xkZXInLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OndvcmstaW4taG9tZS1mb2xkZXInfVxuICAgICAgICAgIHtsYWJlbDogJ1NlbGVjdC4uLicsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6c2VsZWN0LXdvcmtpbmctZm9sZGVyJ31cbiAgICAgICAgXVxuICAgICAgfVxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0Vudmlyb25tZW50JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtsYWJlbDogJ0Vudmlyb25tZW50IGluIEN1cnJlbnQgRmlsZVxcJ3MgRm9sZGVyJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDphY3RpdmF0ZS1lbnZpcm9ubWVudC1pbi1jdXJyZW50LWZvbGRlcid9XG4gICAgICAgICAge2xhYmVsOiAnRW52aXJvbm1lbnQgaW4gUGFyZW50IEZvbGRlcicsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6YWN0aXZhdGUtZW52aXJvbm1lbnQtaW4tcGFyZW50LWZvbGRlcid9XG4gICAgICAgICAge2xhYmVsOiAnRGVmYXVsdCBFbnZpcm9ubWVudCcsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6YWN0aXZhdGUtZGVmYXVsdC1lbnZpcm9ubWVudCd9XG4gICAgICAgICAge2xhYmVsOiAnU2V0IFdvcmtpbmcgRW52aXJvbm1lbnQnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OnNldC13b3JraW5nLWVudmlyb25tZW50J31cbiAgICAgICAgXVxuICAgICAgfVxuICAgICAge2xhYmVsOiAnU2V0IFdvcmtpbmcgTW9kdWxlJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpzZXQtd29ya2luZy1tb2R1bGUnfVxuXG4gICAgICB7dHlwZTogJ3NlcGFyYXRvcid9XG5cbiAgICAgIHtsYWJlbDogJ1J1biBCbG9jaycsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6cnVuLWJsb2NrJ31cbiAgICAgIHtsYWJlbDogJ1J1biBBbGwnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OnJ1bi1hbGwnfVxuXG4gICAgICB7dHlwZTogJ3NlcGFyYXRvcid9XG5cbiAgICAgIHtsYWJlbDogJ0Zvcm1hdCBDb2RlJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpmb3JtYXQtY29kZSd9XG5cbiAgICAgIHt0eXBlOiAnc2VwYXJhdG9yJ31cblxuICAgICAge2xhYmVsOiAnRGVidWc6IFJ1biBCbG9jaycsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpydW4tYmxvY2snfVxuICAgICAge2xhYmVsOiAnRGVidWc6IFN0ZXAgdGhyb3VnaCBCbG9jaycsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpzdGVwLXRocm91Z2gtYmxvY2snfVxuICAgICAge2xhYmVsOiAnRGVidWc6IFJ1biBGaWxlJywgY29tbWFuZDogJ2p1bGlhLWRlYnVnOnJ1bi1maWxlJ31cbiAgICAgIHtsYWJlbDogJ0RlYnVnOiBTdGVwIHRocm91Z2ggRmlsZScsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpzdGVwLXRocm91Z2gtZmlsZSd9XG5cbiAgICAgIHt0eXBlOiAnc2VwYXJhdG9yJ31cblxuICAgICAge2xhYmVsOiAnT3BlbiBXb3Jrc3BhY2UnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50Om9wZW4td29ya3NwYWNlJ31cbiAgICAgIHtsYWJlbDogJ09wZW4gT3V0bGluZSBQYW5lJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpvcGVuLW91dGxpbmUtcGFuZSd9XG4gICAgICB7bGFiZWw6ICdPcGVuIERvY3VtZW50YXRpb24gQnJvd3NlcicsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6b3Blbi1kb2N1bWVudGF0aW9uLWJyb3dzZXInfVxuICAgICAge2xhYmVsOiAnT3BlbiBQbG90IFBhbmUnLCBjb21tYW5kOiAnanVsaWEtY2xpZW50Om9wZW4tcGxvdC1wYW5lJ31cbiAgICAgIHtsYWJlbDogJ09wZW4gRGVidWdnZXIgUGFuZScsIGNvbW1hbmQ6ICdqdWxpYS1kZWJ1ZzpvcGVuLWRlYnVnZ2VyLXBhbmUnfVxuXG4gICAgICB7dHlwZTogJ3NlcGFyYXRvcid9XG5cbiAgICAgIHtsYWJlbDogJ09wZW4gTmV3IEp1bGlhIEZpbGUnLCBjb21tYW5kOiAnanVsaWE6bmV3LWp1bGlhLWZpbGUnfVxuICAgICAge2xhYmVsOiAnT3BlbiBKdWxpYSBTdGFydHVwIEZpbGUnLCBjb21tYW5kOiAnanVsaWE6b3Blbi1qdWxpYS1zdGFydHVwLWZpbGUnfVxuICAgICAge2xhYmVsOiAnT3BlbiBKdW5vIFN0YXJ0dXAgRmlsZScsIGNvbW1hbmQ6ICdqdWxpYTpvcGVuLWp1bm8tc3RhcnR1cC1maWxlJ31cbiAgICAgIHtsYWJlbDogJ09wZW4gSnVsaWEgSG9tZScsIGNvbW1hbmQ6ICdqdWxpYTpvcGVuLWp1bGlhLWhvbWUnfVxuICAgICAge2xhYmVsOiAnT3BlbiBQYWNrYWdlIGluIE5ldyBXaW5kb3cuLi4nLCBjb21tYW5kOiAnanVsaWE6b3Blbi1wYWNrYWdlLWluLW5ldy13aW5kb3cnfVxuICAgICAge2xhYmVsOiAnT3BlbiBQYWNrYWdlIGFzIFByb2plY3QgRm9sZGVyLi4uJywgY29tbWFuZDogJ2p1bGlhOm9wZW4tcGFja2FnZS1hcy1wcm9qZWN0LWZvbGRlcid9XG5cbiAgICAgIHt0eXBlOiAnc2VwYXJhdG9yJ31cblxuICAgICAge1xuICAgICAgICBsYWJlbDogJ05ldyBUZXJtaW5hbCdcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtsYWJlbDogJ0N1cnJlbnQgRmlsZVxcJ3MgRm9sZGVyJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpuZXctdGVybWluYWwtZnJvbS1jdXJyZW50LWZvbGRlcid9XG4gICAgICAgICAge2xhYmVsOiAnU2VsZWN0IFByb2plY3QgRm9sZGVyJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpuZXctdGVybWluYWwnfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgICB7bGFiZWw6ICdOZXcgUmVtb3RlIFRlcm1pbmFsJywgY29tbWFuZDogJ2p1bGlhLWNsaWVudDpuZXctcmVtb3RlLXRlcm1pbmFsJ31cblxuICAgICAge3R5cGU6ICdzZXBhcmF0b3InfVxuXG4gICAgICB7bGFiZWw6ICdEZWJ1ZyBJbmZvcm1hdGlvbicsIGNvbW1hbmQ6ICdqdWxpYS1jbGllbnQ6ZGVidWctaW5mbyd9XG4gICAgICB7bGFiZWw6ICdSZWxlYXNlIE5vdGUuLi4nLCBjb21tYW5kOiAnanVsaWEtY2xpZW50Om9wZW4tcmVsZWFzZS1ub3RlJ31cbiAgICAgIHtsYWJlbDogJ0hlbHAuLi4nLCBjb21tYW5kOiAnanVsaWE6Z2V0LWhlbHAnfVxuICAgICAge2xhYmVsOiAnU2V0dGluZ3MuLi4nLCBjb21tYW5kOiAnanVsaWEtY2xpZW50OnNldHRpbmdzJ31cbiAgICBdXG4gIH1dXG4iXX0=
