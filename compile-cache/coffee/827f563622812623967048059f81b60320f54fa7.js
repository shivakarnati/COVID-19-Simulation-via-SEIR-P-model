(function() {
  module.exports = {
    consumeToolBar: function(bar) {
      if (!atom.config.get('julia-client.uiOptions.enableToolBar')) {
        return;
      }
      this.bar = bar('julia-client');
      this.bar.addButton({
        icon: 'file-code',
        iconset: 'fa',
        tooltip: 'New Julia File',
        callback: 'julia:new-julia-file'
      });
      this.bar.addButton({
        icon: 'save',
        iconset: 'fa',
        tooltip: 'Save',
        callback: 'core:save'
      });
      this.bar.addButton({
        icon: 'folder-open',
        iconset: 'fa',
        tooltip: 'Open File...',
        callback: 'application:open-file'
      });
      this.bar.addSpacer();
      this.bar.addButton({
        icon: 'globe',
        tooltip: 'Start Local Julia Process',
        callback: 'julia-client:start-julia'
      });
      this.bar.addButton({
        iconset: 'ion',
        icon: 'md-planet',
        tooltip: 'Start Remote Julia Process',
        callback: 'julia-client:start-remote-julia-process'
      });
      this.bar.addButton({
        icon: 'md-pause',
        iconset: 'ion',
        tooltip: 'Interrupt Julia',
        callback: 'julia-client:interrupt-julia'
      });
      this.bar.addButton({
        icon: 'md-square',
        iconset: 'ion',
        tooltip: 'Stop Julia',
        callback: 'julia-client:kill-julia'
      });
      this.bar.addSpacer();
      this.bar.addButton({
        icon: 'zap',
        tooltip: 'Run Block',
        callback: 'julia-client:run-and-move'
      });
      this.bar.addButton({
        icon: 'md-play',
        iconset: 'ion',
        tooltip: 'Run All',
        callback: 'julia-client:run-all'
      });
      this.bar.addButton({
        icon: 'format-float-none',
        iconset: 'mdi',
        tooltip: 'Format Code',
        callback: 'julia-client:format-code'
      });
      this.bar.addSpacer();
      this.bar.addButton({
        icon: 'terminal',
        tooltip: 'Show REPL',
        callback: 'julia-client:open-REPL'
      });
      this.bar.addButton({
        icon: 'book',
        tooltip: 'Show Workspace',
        callback: 'julia-client:open-workspace'
      });
      this.bar.addButton({
        icon: 'list-unordered',
        tooltip: 'Show Outline',
        callback: 'julia-client:open-outline-pane'
      });
      this.bar.addButton({
        icon: 'info',
        tooltip: 'Show Documentation Browser',
        callback: 'julia-client:open-documentation-browser'
      });
      this.bar.addButton({
        icon: 'graph',
        tooltip: 'Show Plot Pane',
        callback: 'julia-client:open-plot-pane'
      });
      return this.bar.addButton({
        icon: 'bug',
        tooltip: 'Show Debugger Pane',
        callback: 'julia-debug:open-debugger-pane'
      });
    },
    deactivate: function() {
      var ref;
      return (ref = this.bar) != null ? ref.removeItems() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3BhY2thZ2UvdG9vbGJhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsY0FBQSxFQUFnQixTQUFDLEdBQUQ7TUFDZCxJQUFBLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFkO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsR0FBRCxHQUFPLEdBQUEsQ0FBSSxjQUFKO01BSVAsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sV0FBTjtRQUNBLE9BQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLGdCQUZUO1FBR0EsUUFBQSxFQUFVLHNCQUhWO09BREY7TUFNQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FDRTtRQUFBLElBQUEsRUFBTSxNQUFOO1FBQ0EsT0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsTUFGVDtRQUdBLFFBQUEsRUFBVSxXQUhWO09BREY7TUFNQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FDRTtRQUFBLElBQUEsRUFBTSxhQUFOO1FBQ0EsT0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsY0FGVDtRQUdBLFFBQUEsRUFBVSx1QkFIVjtPQURGO01BUUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQUE7TUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FDRTtRQUFBLElBQUEsRUFBTSxPQUFOO1FBQ0EsT0FBQSxFQUFTLDJCQURUO1FBRUEsUUFBQSxFQUFVLDBCQUZWO09BREY7TUFLQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FDRTtRQUFBLE9BQUEsRUFBUyxLQUFUO1FBQ0EsSUFBQSxFQUFNLFdBRE47UUFFQSxPQUFBLEVBQVMsNEJBRlQ7UUFHQSxRQUFBLEVBQVUseUNBSFY7T0FERjtNQU1BLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUNFO1FBQUEsSUFBQSxFQUFNLFVBQU47UUFDQSxPQUFBLEVBQVMsS0FEVDtRQUVBLE9BQUEsRUFBUyxpQkFGVDtRQUdBLFFBQUEsRUFBVSw4QkFIVjtPQURGO01BTUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sV0FBTjtRQUNBLE9BQUEsRUFBUyxLQURUO1FBRUEsT0FBQSxFQUFTLFlBRlQ7UUFHQSxRQUFBLEVBQVUseUJBSFY7T0FERjtNQVFBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO01BRUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sS0FBTjtRQUNBLE9BQUEsRUFBUyxXQURUO1FBRUEsUUFBQSxFQUFVLDJCQUZWO09BREY7TUFLQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsT0FBQSxFQUFTLEtBRFQ7UUFFQSxPQUFBLEVBQVMsU0FGVDtRQUdBLFFBQUEsRUFBVSxzQkFIVjtPQURGO01BTUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sbUJBQU47UUFDQSxPQUFBLEVBQVMsS0FEVDtRQUVBLE9BQUEsRUFBUyxhQUZUO1FBR0EsUUFBQSxFQUFVLDBCQUhWO09BREY7TUFRQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtNQUVBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUNFO1FBQUEsSUFBQSxFQUFNLFVBQU47UUFDQSxPQUFBLEVBQVMsV0FEVDtRQUVBLFFBQUEsRUFBVSx3QkFGVjtPQURGO01BS0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sTUFBTjtRQUNBLE9BQUEsRUFBUyxnQkFEVDtRQUVBLFFBQUEsRUFBVSw2QkFGVjtPQURGO01BS0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sZ0JBQU47UUFDQSxPQUFBLEVBQVMsY0FEVDtRQUVBLFFBQUEsRUFBVSxnQ0FGVjtPQURGO01BS0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sTUFBTjtRQUNBLE9BQUEsRUFBUyw0QkFEVDtRQUVBLFFBQUEsRUFBVSx5Q0FGVjtPQURGO01BS0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLE9BQUEsRUFBUyxnQkFEVDtRQUVBLFFBQUEsRUFBVSw2QkFGVjtPQURGO2FBS0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQ0U7UUFBQSxJQUFBLEVBQU0sS0FBTjtRQUNBLE9BQUEsRUFBUyxvQkFEVDtRQUVBLFFBQUEsRUFBVSxnQ0FGVjtPQURGO0lBdEdjLENBQWhCO0lBMkdBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTsyQ0FBSSxDQUFFLFdBQU4sQ0FBQTtJQURVLENBM0daOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBjb25zdW1lVG9vbEJhcjogKGJhcikgLT5cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCAnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5lbmFibGVUb29sQmFyJ1xuXG4gICAgQGJhciA9IGJhciAnanVsaWEtY2xpZW50J1xuXG4gICAgIyBGaWxlcyAmIEZvbGRlcnNcblxuICAgIEBiYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnZmlsZS1jb2RlJ1xuICAgICAgaWNvbnNldDogJ2ZhJ1xuICAgICAgdG9vbHRpcDogJ05ldyBKdWxpYSBGaWxlJ1xuICAgICAgY2FsbGJhY2s6ICdqdWxpYTpuZXctanVsaWEtZmlsZSdcblxuICAgIEBiYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnc2F2ZSdcbiAgICAgIGljb25zZXQ6ICdmYSdcbiAgICAgIHRvb2x0aXA6ICdTYXZlJ1xuICAgICAgY2FsbGJhY2s6ICdjb3JlOnNhdmUnXG5cbiAgICBAYmFyLmFkZEJ1dHRvblxuICAgICAgaWNvbjogJ2ZvbGRlci1vcGVuJ1xuICAgICAgaWNvbnNldDogJ2ZhJ1xuICAgICAgdG9vbHRpcDogJ09wZW4gRmlsZS4uLidcbiAgICAgIGNhbGxiYWNrOiAnYXBwbGljYXRpb246b3Blbi1maWxlJ1xuXG4gICAgIyBKdWxpYSBwcm9jZXNzXG5cbiAgICBAYmFyLmFkZFNwYWNlcigpXG5cbiAgICBAYmFyLmFkZEJ1dHRvblxuICAgICAgaWNvbjogJ2dsb2JlJ1xuICAgICAgdG9vbHRpcDogJ1N0YXJ0IExvY2FsIEp1bGlhIFByb2Nlc3MnXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpzdGFydC1qdWxpYSdcblxuICAgIEBiYXIuYWRkQnV0dG9uXG4gICAgICBpY29uc2V0OiAnaW9uJ1xuICAgICAgaWNvbjogJ21kLXBsYW5ldCdcbiAgICAgIHRvb2x0aXA6ICdTdGFydCBSZW1vdGUgSnVsaWEgUHJvY2VzcydcbiAgICAgIGNhbGxiYWNrOiAnanVsaWEtY2xpZW50OnN0YXJ0LXJlbW90ZS1qdWxpYS1wcm9jZXNzJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdtZC1wYXVzZSdcbiAgICAgIGljb25zZXQ6ICdpb24nXG4gICAgICB0b29sdGlwOiAnSW50ZXJydXB0IEp1bGlhJ1xuICAgICAgY2FsbGJhY2s6ICdqdWxpYS1jbGllbnQ6aW50ZXJydXB0LWp1bGlhJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdtZC1zcXVhcmUnXG4gICAgICBpY29uc2V0OiAnaW9uJ1xuICAgICAgdG9vbHRpcDogJ1N0b3AgSnVsaWEnXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpraWxsLWp1bGlhJ1xuXG4gICAgIyBFdmFsdWF0aW9uXG5cbiAgICBAYmFyLmFkZFNwYWNlcigpXG5cbiAgICBAYmFyLmFkZEJ1dHRvblxuICAgICAgaWNvbjogJ3phcCdcbiAgICAgIHRvb2x0aXA6ICdSdW4gQmxvY2snXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpydW4tYW5kLW1vdmUnXG5cbiAgICBAYmFyLmFkZEJ1dHRvblxuICAgICAgaWNvbjogJ21kLXBsYXknXG4gICAgICBpY29uc2V0OiAnaW9uJ1xuICAgICAgdG9vbHRpcDogJ1J1biBBbGwnXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpydW4tYWxsJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdmb3JtYXQtZmxvYXQtbm9uZSdcbiAgICAgIGljb25zZXQ6ICdtZGknXG4gICAgICB0b29sdGlwOiAnRm9ybWF0IENvZGUnXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpmb3JtYXQtY29kZSdcblxuICAgICMgV2luZG93cyAmIFBhbmVzXG5cbiAgICBAYmFyLmFkZFNwYWNlcigpXG5cbiAgICBAYmFyLmFkZEJ1dHRvblxuICAgICAgaWNvbjogJ3Rlcm1pbmFsJ1xuICAgICAgdG9vbHRpcDogJ1Nob3cgUkVQTCdcbiAgICAgIGNhbGxiYWNrOiAnanVsaWEtY2xpZW50Om9wZW4tUkVQTCdcblxuICAgIEBiYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnYm9vaydcbiAgICAgIHRvb2x0aXA6ICdTaG93IFdvcmtzcGFjZSdcbiAgICAgIGNhbGxiYWNrOiAnanVsaWEtY2xpZW50Om9wZW4td29ya3NwYWNlJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdsaXN0LXVub3JkZXJlZCdcbiAgICAgIHRvb2x0aXA6ICdTaG93IE91dGxpbmUnXG4gICAgICBjYWxsYmFjazogJ2p1bGlhLWNsaWVudDpvcGVuLW91dGxpbmUtcGFuZSdcblxuICAgIEBiYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnaW5mbydcbiAgICAgIHRvb2x0aXA6ICdTaG93IERvY3VtZW50YXRpb24gQnJvd3NlcidcbiAgICAgIGNhbGxiYWNrOiAnanVsaWEtY2xpZW50Om9wZW4tZG9jdW1lbnRhdGlvbi1icm93c2VyJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdncmFwaCdcbiAgICAgIHRvb2x0aXA6ICdTaG93IFBsb3QgUGFuZSdcbiAgICAgIGNhbGxiYWNrOiAnanVsaWEtY2xpZW50Om9wZW4tcGxvdC1wYW5lJ1xuXG4gICAgQGJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdidWcnXG4gICAgICB0b29sdGlwOiAnU2hvdyBEZWJ1Z2dlciBQYW5lJ1xuICAgICAgY2FsbGJhY2s6ICdqdWxpYS1kZWJ1ZzpvcGVuLWRlYnVnZ2VyLXBhbmUnXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAYmFyPy5yZW1vdmVJdGVtcygpXG4iXX0=
