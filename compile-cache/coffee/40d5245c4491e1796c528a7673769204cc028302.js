(function() {
  var CompositeDisposable, clearLazy, client, goto, gotoSymbol, modules, ref, views, workspace;

  CompositeDisposable = require('atom').CompositeDisposable;

  client = require('../connection').client;

  views = require('../ui').views;

  goto = require('./goto');

  modules = require('./modules');

  ref = client["import"]({
    rpc: ['workspace', 'gotosymbol'],
    msg: 'clearLazy'
  }), workspace = ref.workspace, gotoSymbol = ref.gotosymbol, clearLazy = ref.clearLazy;

  module.exports = {
    activate: function() {
      this.create();
      client.handle({
        updateWorkspace: (function(_this) {
          return function() {
            return _this.update();
          };
        })(this)
      });
      client.onDetached((function(_this) {
        return function() {
          _this.ws.setItems([]);
          return _this.lazyTrees = [];
        };
      })(this));
      return atom.config.observe('julia-client.uiOptions.layouts.workspace.defaultLocation', (function(_this) {
        return function(defaultLocation) {
          return _this.ws.setDefaultLocation(defaultLocation);
        };
      })(this));
    },
    lazyTrees: [],
    update: function() {
      var mod, p, registerLazy;
      if (!(client.isActive() && this.ws.currentPane())) {
        return this.ws.setItems([]);
      }
      clearLazy(this.lazyTrees);
      registerLazy = (function(_this) {
        return function(id) {
          return _this.lazyTrees.push(id);
        };
      })(this);
      mod = this.mod === modules.follow ? modules.current() : this.mod || 'Main';
      p = workspace(mod).then((function(_this) {
        return function(ws) {
          var i, item, items, j, len, len1;
          for (i = 0, len = ws.length; i < len; i++) {
            items = ws[i].items;
            for (j = 0, len1 = items.length; j < len1; j++) {
              item = items[j];
              item.value = views.render(item.value, {
                registerLazy: registerLazy
              });
              item.onClick = _this.onClick(item.name);
            }
          }
          return _this.ws.setItems(ws);
        };
      })(this));
      return p["catch"](function(err) {
        if (err !== 'disconnected') {
          console.error('Error refreshing workspace');
          return console.error(err);
        }
      });
    },
    onClick: function(name) {
      return (function(_this) {
        return function() {
          var mod;
          mod = _this.mod === modules.follow ? modules.current() : _this.mod || 'Main';
          return gotoSymbol({
            word: name,
            mod: mod
          }).then(function(results) {
            if (results.error) {
              return;
            }
            return goto.selectItemsAndGo(results.items);
          });
        };
      })(this);
    },
    create: function() {
      this.ws = this.ink.Workspace.fromId('julia');
      this.ws.setModule = (function(_this) {
        return function(mod) {
          return _this.mod = mod;
        };
      })(this);
      this.ws.refresh = (function(_this) {
        return function() {
          return _this.update();
        };
      })(this);
      return this.ws.refreshModule = (function(_this) {
        return function() {
          var m;
          m = modules.chooseModule();
          if ((m != null ? m.then : void 0) != null) {
            return m.then(function() {
              return _this.update();
            });
          }
        };
      })(this);
    },
    open: function() {
      return this.ws.open({
        split: atom.config.get('julia-client.uiOptions.layouts.workspace.split')
      });
    },
    close: function() {
      return this.ws.close();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL3J1bnRpbWUvd29ya3NwYWNlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV2QixTQUFVLE9BQUEsQ0FBUSxlQUFSOztFQUNWLFFBQVMsT0FBQSxDQUFRLE9BQVI7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7RUFFVixNQUFtRCxNQUFNLEVBQUMsTUFBRCxFQUFOLENBQWM7SUFBQSxHQUFBLEVBQUssQ0FBQyxXQUFELEVBQWMsWUFBZCxDQUFMO0lBQWtDLEdBQUEsRUFBSyxXQUF2QztHQUFkLENBQW5ELEVBQUUseUJBQUYsRUFBeUIsaUJBQVosVUFBYixFQUFxQzs7RUFFckMsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUVBLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFBRSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtPQUFkO01BQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2hCLEtBQUMsQ0FBQSxFQUFFLENBQUMsUUFBSixDQUFhLEVBQWI7aUJBQ0EsS0FBQyxDQUFBLFNBQUQsR0FBYTtRQUZHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQjthQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwwREFBcEIsRUFBZ0YsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLGVBQUQ7aUJBQzlFLEtBQUMsQ0FBQSxFQUFFLENBQUMsa0JBQUosQ0FBdUIsZUFBdkI7UUFEOEU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhGO0lBUlEsQ0FBVjtJQVdBLFNBQUEsRUFBVyxFQVhYO0lBYUEsTUFBQSxFQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBQSxDQUFBLENBQThCLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBQSxJQUFzQixJQUFDLENBQUEsRUFBRSxDQUFDLFdBQUosQ0FBQSxDQUFwRCxDQUFBO0FBQUEsZUFBTyxJQUFDLENBQUEsRUFBRSxDQUFDLFFBQUosQ0FBYSxFQUFiLEVBQVA7O01BQ0EsU0FBQSxDQUFVLElBQUMsQ0FBQSxTQUFYO01BQ0EsWUFBQSxHQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxFQUFEO2lCQUFRLEtBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixFQUFoQjtRQUFSO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUNmLEdBQUEsR0FBUyxJQUFDLENBQUEsR0FBRCxLQUFRLE9BQU8sQ0FBQyxNQUFuQixHQUErQixPQUFPLENBQUMsT0FBUixDQUFBLENBQS9CLEdBQXVELElBQUMsQ0FBQSxHQUFELElBQVE7TUFDckUsQ0FBQSxHQUFJLFNBQUEsQ0FBVSxHQUFWLENBQWMsQ0FBQyxJQUFmLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxFQUFEO0FBQ3RCLGNBQUE7QUFBQSxlQUFBLG9DQUFBO1lBQUs7QUFDSCxpQkFBQSx5Q0FBQTs7Y0FDRSxJQUFJLENBQUMsS0FBTCxHQUFhLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLEtBQWxCLEVBQXlCO2dCQUFDLGNBQUEsWUFBRDtlQUF6QjtjQUNiLElBQUksQ0FBQyxPQUFMLEdBQWUsS0FBQyxDQUFBLE9BQUQsQ0FBUyxJQUFJLENBQUMsSUFBZDtBQUZqQjtBQURGO2lCQUlBLEtBQUMsQ0FBQSxFQUFFLENBQUMsUUFBSixDQUFhLEVBQWI7UUFMc0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCO2FBTUosQ0FBQyxFQUFDLEtBQUQsRUFBRCxDQUFRLFNBQUMsR0FBRDtRQUNOLElBQUcsR0FBQSxLQUFTLGNBQVo7VUFDRSxPQUFPLENBQUMsS0FBUixDQUFjLDRCQUFkO2lCQUNBLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZCxFQUZGOztNQURNLENBQVI7SUFYTSxDQWJSO0lBNkJBLE9BQUEsRUFBUyxTQUFDLElBQUQ7YUFDUCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDRSxjQUFBO1VBQUEsR0FBQSxHQUFTLEtBQUMsQ0FBQSxHQUFELEtBQVEsT0FBTyxDQUFDLE1BQW5CLEdBQStCLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBL0IsR0FBdUQsS0FBQyxDQUFBLEdBQUQsSUFBUTtpQkFDckUsVUFBQSxDQUNFO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxHQUFBLEVBQUssR0FETDtXQURGLENBR0EsQ0FBQyxJQUhELENBR00sU0FBQyxPQUFEO1lBQ0osSUFBVSxPQUFPLENBQUMsS0FBbEI7QUFBQSxxQkFBQTs7bUJBQ0EsSUFBSSxDQUFDLGdCQUFMLENBQXNCLE9BQU8sQ0FBQyxLQUE5QjtVQUZJLENBSE47UUFGRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUFETyxDQTdCVDtJQXVDQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBZixDQUFzQixPQUF0QjtNQUNOLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBSixHQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFBUyxLQUFDLENBQUEsR0FBRCxHQUFPO1FBQWhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUNoQixJQUFDLENBQUEsRUFBRSxDQUFDLE9BQUosR0FBYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQU0sS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFOO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUNkLElBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixHQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDbEIsY0FBQTtVQUFBLENBQUEsR0FBSSxPQUFPLENBQUMsWUFBUixDQUFBO1VBQ0osSUFBRyxxQ0FBSDttQkFDRSxDQUFDLENBQUMsSUFBRixDQUFPLFNBQUE7cUJBQU0sS0FBQyxDQUFBLE1BQUQsQ0FBQTtZQUFOLENBQVAsRUFERjs7UUFGa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBSmQsQ0F2Q1I7SUFnREEsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FDRTtRQUFBLEtBQUEsRUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0RBQWhCLENBQVA7T0FERjtJQURJLENBaEROO0lBb0RBLEtBQUEsRUFBTyxTQUFBO2FBQ0wsSUFBQyxDQUFBLEVBQUUsQ0FBQyxLQUFKLENBQUE7SUFESyxDQXBEUDs7QUFWRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbntjbGllbnR9ID0gcmVxdWlyZSAnLi4vY29ubmVjdGlvbidcbnt2aWV3c30gPSByZXF1aXJlICcuLi91aSdcbmdvdG8gPSByZXF1aXJlICcuL2dvdG8nXG5tb2R1bGVzID0gcmVxdWlyZSAnLi9tb2R1bGVzJ1xuXG57IHdvcmtzcGFjZSwgZ290b3N5bWJvbDogZ290b1N5bWJvbCwgY2xlYXJMYXp5IH0gPSBjbGllbnQuaW1wb3J0IHJwYzogWyd3b3Jrc3BhY2UnLCAnZ290b3N5bWJvbCddLCBtc2c6ICdjbGVhckxhenknXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGNyZWF0ZSgpXG5cbiAgICBjbGllbnQuaGFuZGxlIHsgdXBkYXRlV29ya3NwYWNlOiA9PiBAdXBkYXRlKCkgfVxuICAgIGNsaWVudC5vbkRldGFjaGVkID0+XG4gICAgICBAd3Muc2V0SXRlbXMgW11cbiAgICAgIEBsYXp5VHJlZXMgPSBbXVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLndvcmtzcGFjZS5kZWZhdWx0TG9jYXRpb24nLCAoZGVmYXVsdExvY2F0aW9uKSA9PlxuICAgICAgQHdzLnNldERlZmF1bHRMb2NhdGlvbiBkZWZhdWx0TG9jYXRpb25cblxuICBsYXp5VHJlZXM6IFtdXG5cbiAgdXBkYXRlOiAtPlxuICAgIHJldHVybiBAd3Muc2V0SXRlbXMgW10gdW5sZXNzIGNsaWVudC5pc0FjdGl2ZSgpIGFuZCBAd3MuY3VycmVudFBhbmUoKVxuICAgIGNsZWFyTGF6eSBAbGF6eVRyZWVzXG4gICAgcmVnaXN0ZXJMYXp5ID0gKGlkKSA9PiBAbGF6eVRyZWVzLnB1c2ggaWRcbiAgICBtb2QgPSBpZiBAbW9kID09IG1vZHVsZXMuZm9sbG93IHRoZW4gbW9kdWxlcy5jdXJyZW50KCkgZWxzZSAoQG1vZCBvciAnTWFpbicpXG4gICAgcCA9IHdvcmtzcGFjZShtb2QpLnRoZW4gKHdzKSA9PlxuICAgICAgZm9yIHtpdGVtc30gaW4gd3NcbiAgICAgICAgZm9yIGl0ZW0gaW4gaXRlbXNcbiAgICAgICAgICBpdGVtLnZhbHVlID0gdmlld3MucmVuZGVyIGl0ZW0udmFsdWUsIHtyZWdpc3Rlckxhenl9XG4gICAgICAgICAgaXRlbS5vbkNsaWNrID0gQG9uQ2xpY2soaXRlbS5uYW1lKVxuICAgICAgQHdzLnNldEl0ZW1zIHdzXG4gICAgcC5jYXRjaCAoZXJyKSAtPlxuICAgICAgaWYgZXJyIGlzbnQgJ2Rpc2Nvbm5lY3RlZCdcbiAgICAgICAgY29uc29sZS5lcnJvciAnRXJyb3IgcmVmcmVzaGluZyB3b3Jrc3BhY2UnXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZXJyXG5cbiAgb25DbGljazogKG5hbWUpIC0+XG4gICAgKCkgPT5cbiAgICAgIG1vZCA9IGlmIEBtb2QgPT0gbW9kdWxlcy5mb2xsb3cgdGhlbiBtb2R1bGVzLmN1cnJlbnQoKSBlbHNlIChAbW9kIG9yICdNYWluJylcbiAgICAgIGdvdG9TeW1ib2xcbiAgICAgICAgd29yZDogbmFtZSxcbiAgICAgICAgbW9kOiBtb2RcbiAgICAgIC50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgICByZXR1cm4gaWYgcmVzdWx0cy5lcnJvclxuICAgICAgICBnb3RvLnNlbGVjdEl0ZW1zQW5kR28ocmVzdWx0cy5pdGVtcylcblxuICBjcmVhdGU6IC0+XG4gICAgQHdzID0gQGluay5Xb3Jrc3BhY2UuZnJvbUlkICdqdWxpYSdcbiAgICBAd3Muc2V0TW9kdWxlID0gKG1vZCkgPT4gQG1vZCA9IG1vZFxuICAgIEB3cy5yZWZyZXNoID0gKCkgPT4gQHVwZGF0ZSgpXG4gICAgQHdzLnJlZnJlc2hNb2R1bGUgPSAoKSA9PlxuICAgICAgbSA9IG1vZHVsZXMuY2hvb3NlTW9kdWxlKClcbiAgICAgIGlmIG0/LnRoZW4/XG4gICAgICAgIG0udGhlbigoKSA9PiBAdXBkYXRlKCkpXG5cbiAgb3BlbjogLT5cbiAgICBAd3Mub3BlblxuICAgICAgc3BsaXQ6IGF0b20uY29uZmlnLmdldCAnanVsaWEtY2xpZW50LnVpT3B0aW9ucy5sYXlvdXRzLndvcmtzcGFjZS5zcGxpdCdcblxuICBjbG9zZTogLT5cbiAgICBAd3MuY2xvc2UoKVxuIl19
