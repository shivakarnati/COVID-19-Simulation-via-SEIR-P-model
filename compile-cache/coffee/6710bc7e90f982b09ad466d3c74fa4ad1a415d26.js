(function() {
  var views,
    slice = [].slice;

  module.exports = views = {
    dom: function(arg) {
      var attrs, child, contents, i, k, len, tag, v, view;
      tag = arg.tag, attrs = arg.attrs, contents = arg.contents;
      view = document.createElement(tag);
      for (k in attrs) {
        v = attrs[k];
        view.setAttribute(k, v);
      }
      if (contents != null) {
        if (contents.constructor !== Array) {
          contents = [contents];
        }
        for (i = 0, len = contents.length; i < len; i++) {
          child = contents[i];
          view.appendChild(this.render(child));
        }
      }
      return view;
    },
    views: {
      dom: function() {
        var a;
        a = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return views.dom.apply(views, a);
      }
    },
    render: function(data) {
      if (this.views.hasOwnProperty(data.type)) {
        return this.views[data.type](data);
      } else if ((data != null ? data.constructor : void 0) === String) {
        return new Text(data);
      } else {
        return data;
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

  ['div', 'span', 'a', 'strong', 'table', 'tr', 'td'].forEach(function(tag) {
    return views.tags[tag] = function(attrs, contents) {
      return views.tag(tag, attrs, contents);
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL3V0aWwvdmlld3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxHQUNmO0lBQUEsR0FBQSxFQUFLLFNBQUMsR0FBRDtBQUNILFVBQUE7TUFESyxlQUFLLG1CQUFPO01BQ2pCLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QjtBQUNQLFdBQUEsVUFBQTs7UUFDRSxJQUFJLENBQUMsWUFBTCxDQUFrQixDQUFsQixFQUFxQixDQUFyQjtBQURGO01BRUEsSUFBRyxnQkFBSDtRQUNFLElBQUcsUUFBUSxDQUFDLFdBQVQsS0FBMEIsS0FBN0I7VUFDRSxRQUFBLEdBQVcsQ0FBQyxRQUFELEVBRGI7O0FBRUEsYUFBQSwwQ0FBQTs7VUFDRSxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsQ0FBakI7QUFERixTQUhGOzthQUtBO0lBVEcsQ0FBTDtJQVdBLEtBQUEsRUFDRTtNQUFBLEdBQUEsRUFBSyxTQUFBO0FBQVUsWUFBQTtRQUFUO2VBQVMsS0FBSyxDQUFDLEdBQU4sY0FBVyxDQUFYO01BQVYsQ0FBTDtLQVpGO0lBY0EsTUFBQSxFQUFRLFNBQUMsSUFBRDtNQUNOLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxjQUFQLENBQXNCLElBQUksQ0FBQyxJQUEzQixDQUFIO2VBQ0UsSUFBQyxDQUFBLEtBQU0sQ0FBQSxJQUFJLENBQUMsSUFBTCxDQUFQLENBQWtCLElBQWxCLEVBREY7T0FBQSxNQUVLLG9CQUFHLElBQUksQ0FBRSxxQkFBTixLQUFxQixNQUF4QjtlQUNILElBQUksSUFBSixDQUFTLElBQVQsRUFERztPQUFBLE1BQUE7ZUFHSCxLQUhHOztJQUhDLENBZFI7SUFzQkEsR0FBQSxFQUFLLFNBQUMsR0FBRCxFQUFNLEtBQU4sRUFBYSxRQUFiO0FBQ0gsVUFBQTtNQUFBLHFCQUFHLEtBQUssQ0FBRSxxQkFBUCxLQUFzQixNQUF6QjtRQUNFLEtBQUEsR0FBUTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBUDtVQURWOztNQUVBLHFCQUFHLEtBQUssQ0FBRSxxQkFBUCxLQUF3QixNQUEzQjtRQUNFLE1BQW9CLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBcEIsRUFBQyxpQkFBRCxFQUFXLGVBRGI7O2FBRUE7UUFBQSxJQUFBLEVBQU0sS0FBTjtRQUNBLEdBQUEsRUFBSyxHQURMO1FBRUEsS0FBQSxFQUFPLEtBRlA7UUFHQSxRQUFBLEVBQVUsUUFIVjs7SUFMRyxDQXRCTDtJQWdDQSxJQUFBLEVBQU0sRUFoQ047OztFQWtDRixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEdBQWhCLEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CLEVBQXdDLElBQXhDLEVBQThDLElBQTlDLENBQW1ELENBQUMsT0FBcEQsQ0FBNEQsU0FBQyxHQUFEO1dBQzFELEtBQUssQ0FBQyxJQUFLLENBQUEsR0FBQSxDQUFYLEdBQWtCLFNBQUMsS0FBRCxFQUFRLFFBQVI7YUFDaEIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxHQUFWLEVBQWUsS0FBZixFQUFzQixRQUF0QjtJQURnQjtFQUR3QyxDQUE1RDtBQW5DQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gdmlld3MgPVxyXG4gIGRvbTogKHt0YWcsIGF0dHJzLCBjb250ZW50c30pIC0+XHJcbiAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCB0YWdcclxuICAgIGZvciBrLCB2IG9mIGF0dHJzXHJcbiAgICAgIHZpZXcuc2V0QXR0cmlidXRlIGssIHZcclxuICAgIGlmIGNvbnRlbnRzP1xyXG4gICAgICBpZiBjb250ZW50cy5jb25zdHJ1Y3RvciBpc250IEFycmF5XHJcbiAgICAgICAgY29udGVudHMgPSBbY29udGVudHNdXHJcbiAgICAgIGZvciBjaGlsZCBpbiBjb250ZW50c1xyXG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQgQHJlbmRlciBjaGlsZFxyXG4gICAgdmlld1xyXG5cclxuICB2aWV3czpcclxuICAgIGRvbTogKGEuLi4pIC0+IHZpZXdzLmRvbSAgYS4uLlxyXG5cclxuICByZW5kZXI6IChkYXRhKSAtPlxyXG4gICAgaWYgQHZpZXdzLmhhc093blByb3BlcnR5KGRhdGEudHlwZSlcclxuICAgICAgQHZpZXdzW2RhdGEudHlwZV0oZGF0YSlcclxuICAgIGVsc2UgaWYgZGF0YT8uY29uc3RydWN0b3IgaXMgU3RyaW5nXHJcbiAgICAgIG5ldyBUZXh0IGRhdGFcclxuICAgIGVsc2VcclxuICAgICAgZGF0YVxyXG5cclxuICB0YWc6ICh0YWcsIGF0dHJzLCBjb250ZW50cykgLT5cclxuICAgIGlmIGF0dHJzPy5jb25zdHJ1Y3RvciBpcyBTdHJpbmdcclxuICAgICAgYXR0cnMgPSBjbGFzczogYXR0cnNcclxuICAgIGlmIGF0dHJzPy5jb25zdHJ1Y3RvciBpc250IE9iamVjdFxyXG4gICAgICBbY29udGVudHMsIGF0dHJzXSA9IFthdHRycywgdW5kZWZpbmVkXVxyXG4gICAgdHlwZTogJ2RvbSdcclxuICAgIHRhZzogdGFnXHJcbiAgICBhdHRyczogYXR0cnNcclxuICAgIGNvbnRlbnRzOiBjb250ZW50c1xyXG5cclxuICB0YWdzOiB7fVxyXG5cclxuWydkaXYnLCAnc3BhbicsICdhJywgJ3N0cm9uZycsICd0YWJsZScsICd0cicsICd0ZCddLmZvckVhY2ggKHRhZykgLT5cclxuICB2aWV3cy50YWdzW3RhZ10gPSAoYXR0cnMsIGNvbnRlbnRzKSAtPlxyXG4gICAgdmlld3MudGFnIHRhZywgYXR0cnMsIGNvbnRlbnRzXHJcbiJdfQ==
