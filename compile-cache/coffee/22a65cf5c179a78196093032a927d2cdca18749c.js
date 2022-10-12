(function() {
  var CompositeDisposable, provider;

  CompositeDisposable = require('atom').CompositeDisposable;

  provider = require('./provider');

  module.exports = {
    config: {
      customAliases: {
        type: 'string',
        "default": '',
        description: 'Path to a custom set of completions. Multiple paths may be comma-seperated.',
        order: 1
      },
      enableDefaultCompletions: {
        type: 'boolean',
        "default": true,
        description: 'Disable this to use only custom completions.',
        order: 2
      },
      selector: {
        type: 'string',
        "default": '.source, .text',
        description: 'Enable completions under these scopes:',
        order: 3
      },
      disableForSelector: {
        type: 'string',
        "default": '.tex, .latex',
        description: 'Disable completions under these scopes:',
        order: 4
      },
      boostGreekCharacters: {
        type: 'boolean',
        "default": true,
        description: 'Make common greek characters easier to complete by moving them higher in the list of completions.'
      }
    },
    activate: function() {
      atom.config.get("latex-completions.enableDefaultCompletions") && provider.load();
      provider.activate();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.config.observe('latex-completions.customAliases', (function(_this) {
        return function(path) {
          var i, len, ref, results;
          ref = path.split(',');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            path = ref[i];
            results.push(provider.load(path));
          }
          return results;
        };
      })(this)));
    },
    provide: function() {
      return provider;
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return provider.deactivate();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9sYXRleC1jb21wbGV0aW9ucy9saWIvbGF0ZXgtY29tcGxldGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxXQUFBLEVBQWEsNkVBRmI7UUFHQSxLQUFBLEVBQU8sQ0FIUDtPQURGO01BS0Esd0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLDhDQUZiO1FBR0EsS0FBQSxFQUFPLENBSFA7T0FORjtNQVVBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxnQkFEVDtRQUVBLFdBQUEsRUFBYSx3Q0FGYjtRQUdBLEtBQUEsRUFBTyxDQUhQO09BWEY7TUFlQSxrQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGNBRFQ7UUFFQSxXQUFBLEVBQWEseUNBRmI7UUFHQSxLQUFBLEVBQU8sQ0FIUDtPQWhCRjtNQW9CQSxvQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsbUdBRmI7T0FyQkY7S0FERjtJQTBCQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0Q0FBaEIsQ0FBQSxJQUFpRSxRQUFRLENBQUMsSUFBVCxDQUFBO01BRWpFLFFBQVEsQ0FBQyxRQUFULENBQUE7TUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQXVELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO0FBQ3hFLGNBQUE7QUFBQTtBQUFBO2VBQUEscUNBQUE7O3lCQUNFLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZDtBQURGOztRQUR3RTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsQ0FBbkI7SUFQUSxDQTFCVjtJQXFDQSxPQUFBLEVBQVMsU0FBQTthQUFHO0lBQUgsQ0FyQ1Q7SUF1Q0EsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTthQUNBLFFBQVEsQ0FBQyxVQUFULENBQUE7SUFGVSxDQXZDWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGN1c3RvbUFsaWFzZXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCB0byBhIGN1c3RvbSBzZXQgb2YgY29tcGxldGlvbnMuIE11bHRpcGxlIHBhdGhzIG1heSBiZSBjb21tYS1zZXBlcmF0ZWQuJ1xuICAgICAgb3JkZXI6IDFcbiAgICBlbmFibGVEZWZhdWx0Q29tcGxldGlvbnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSB0aGlzIHRvIHVzZSBvbmx5IGN1c3RvbSBjb21wbGV0aW9ucy4nXG4gICAgICBvcmRlcjogMlxuICAgIHNlbGVjdG9yOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcuc291cmNlLCAudGV4dCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlIGNvbXBsZXRpb25zIHVuZGVyIHRoZXNlIHNjb3BlczonXG4gICAgICBvcmRlcjogM1xuICAgIGRpc2FibGVGb3JTZWxlY3RvcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnLnRleCwgLmxhdGV4J1xuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIGNvbXBsZXRpb25zIHVuZGVyIHRoZXNlIHNjb3BlczonXG4gICAgICBvcmRlcjogNFxuICAgIGJvb3N0R3JlZWtDaGFyYWN0ZXJzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ01ha2UgY29tbW9uIGdyZWVrIGNoYXJhY3RlcnMgZWFzaWVyIHRvIGNvbXBsZXRlIGJ5IG1vdmluZyB0aGVtIGhpZ2hlciBpbiB0aGUgbGlzdCBvZiBjb21wbGV0aW9ucy4nXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgtY29tcGxldGlvbnMuZW5hYmxlRGVmYXVsdENvbXBsZXRpb25zXCIpICYmIHByb3ZpZGVyLmxvYWQoKVxuXG4gICAgcHJvdmlkZXIuYWN0aXZhdGUoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2xhdGV4LWNvbXBsZXRpb25zLmN1c3RvbUFsaWFzZXMnLCAocGF0aCkgPT5cbiAgICAgIGZvciBwYXRoIGluIHBhdGguc3BsaXQoJywnKVxuICAgICAgICBwcm92aWRlci5sb2FkKHBhdGgpXG5cbiAgcHJvdmlkZTogLT4gcHJvdmlkZXJcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHByb3ZpZGVyLmRlYWN0aXZhdGUoKVxuIl19
