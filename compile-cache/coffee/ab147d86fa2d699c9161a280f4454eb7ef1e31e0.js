(function() {
  var client, net;

  net = require('net');

  client = require('../client');

  module.exports = {
    server: null,
    port: null,
    listeners: [],
    next: function() {
      var conn;
      conn = new Promise((function(_this) {
        return function(resolve) {
          return _this.listeners.push(resolve);
        };
      })(this));
      conn.dispose = (function(_this) {
        return function() {
          return _this.listeners = _this.listeners.filter(function(x) {
            return x === conn;
          });
        };
      })(this);
      return conn;
    },
    connect: function(sock) {
      var message;
      message = function(m) {
        return sock.write(JSON.stringify(m));
      };
      client.readStream(sock);
      sock.on('end', function() {
        return client.detach();
      });
      sock.on('error', function() {
        return client.detach();
      });
      return client.attach({
        message: message
      });
    },
    handle: function(sock) {
      if (this.listeners.length > 0) {
        return this.listeners.shift()(sock);
      } else if (!client.isActive()) {
        return this.connect(sock);
      } else {
        return sock.end();
      }
    },
    listen: function() {
      if (this.port != null) {
        return Promise.resolve(this.port);
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var externalPort, port;
          externalPort = atom.config.get('julia-client.juliaOptions.externalProcessPort');
          if (externalPort === 'random') {
            port = 0;
          } else {
            port = parseInt(externalPort);
          }
          _this.server = net.createServer(function(sock) {
            return _this.handle(sock);
          });
          _this.server.on('error', function(err) {
            var details;
            if (err.code === 'EADDRINUSE') {
              details = '';
              if (port !== 0) {
                details = 'Please change to another port in the settings and try again.';
              }
              atom.notifications.addError("Julia could not be started.", {
                description: ("Port `" + port + "` is already in use.\n") + (details !== '' ? "" + details : "Please try again or set a fixed port that you know is unused."),
                dismissable: true
              });
            }
            return reject(err);
          });
          return _this.server.listen(port, '127.0.0.1', function() {
            _this.port = _this.server.address().port;
            return resolve(_this.port);
          });
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9qdWxpYS1jbGllbnQvbGliL2Nvbm5lY3Rpb24vcHJvY2Vzcy90Y3AuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBQ04sTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsSUFBUjtJQUNBLElBQUEsRUFBTSxJQUROO0lBR0EsU0FBQSxFQUFXLEVBSFg7SUFLQSxJQUFBLEVBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ2pCLEtBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixPQUFoQjtRQURpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtNQUVQLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNiLEtBQUMsQ0FBQSxTQUFELEdBQWEsS0FBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFNBQUMsQ0FBRDttQkFBTyxDQUFBLEtBQUs7VUFBWixDQUFsQjtRQURBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUVmO0lBTEksQ0FMTjtJQVlBLE9BQUEsRUFBUyxTQUFDLElBQUQ7QUFDUCxVQUFBO01BQUEsT0FBQSxHQUFVLFNBQUMsQ0FBRDtlQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmLENBQVg7TUFBUDtNQUNWLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO01BQ0EsSUFBSSxDQUFDLEVBQUwsQ0FBUSxLQUFSLEVBQWUsU0FBQTtlQUFHLE1BQU0sQ0FBQyxNQUFQLENBQUE7TUFBSCxDQUFmO01BQ0EsSUFBSSxDQUFDLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFNBQUE7ZUFBRyxNQUFNLENBQUMsTUFBUCxDQUFBO01BQUgsQ0FBakI7YUFDQSxNQUFNLENBQUMsTUFBUCxDQUFjO1FBQUMsU0FBQSxPQUFEO09BQWQ7SUFMTyxDQVpUO0lBbUJBLE1BQUEsRUFBUSxTQUFDLElBQUQ7TUFDTixJQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQixDQUF2QjtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQUEsQ0FBbUIsSUFBbkIsRUFERjtPQUFBLE1BRUssSUFBRyxDQUFJLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBUDtlQUNILElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQURHO09BQUEsTUFBQTtlQUdILElBQUksQ0FBQyxHQUFMLENBQUEsRUFIRzs7SUFIQyxDQW5CUjtJQTJCQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQWlDLGlCQUFqQztBQUFBLGVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFBLElBQWpCLEVBQVA7O2FBQ0EsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1YsY0FBQTtVQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0NBQWhCO1VBQ2YsSUFBRyxZQUFBLEtBQWdCLFFBQW5CO1lBQ0UsSUFBQSxHQUFPLEVBRFQ7V0FBQSxNQUFBO1lBR0UsSUFBQSxHQUFPLFFBQUEsQ0FBUyxZQUFULEVBSFQ7O1VBSUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxHQUFHLENBQUMsWUFBSixDQUFpQixTQUFDLElBQUQ7bUJBQVUsS0FBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSO1VBQVYsQ0FBakI7VUFDVixLQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLFNBQUMsR0FBRDtBQUNsQixnQkFBQTtZQUFBLElBQUcsR0FBRyxDQUFDLElBQUosS0FBWSxZQUFmO2NBQ0UsT0FBQSxHQUFVO2NBQ1YsSUFBRyxJQUFBLEtBQVEsQ0FBWDtnQkFDRSxPQUFBLEdBQVUsK0RBRFo7O2NBRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qiw2QkFBNUIsRUFDRTtnQkFBQSxXQUFBLEVBQWEsQ0FBQSxRQUFBLEdBQ0wsSUFESyxHQUNBLHdCQURBLENBQUEsR0FHUCxDQUFHLE9BQUEsS0FBYSxFQUFoQixHQUNKLEVBQUEsR0FDRSxPQUZFLEdBS0osK0RBTEksQ0FITjtnQkFTQSxXQUFBLEVBQWEsSUFUYjtlQURGLEVBSkY7O21CQWVBLE1BQUEsQ0FBTyxHQUFQO1VBaEJrQixDQUFwQjtpQkFpQkEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsSUFBZixFQUFxQixXQUFyQixFQUFrQyxTQUFBO1lBQ2hDLEtBQUMsQ0FBQSxJQUFELEdBQVEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQzttQkFDMUIsT0FBQSxDQUFRLEtBQUMsQ0FBQSxJQUFUO1VBRmdDLENBQWxDO1FBeEJVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRk0sQ0EzQlI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJuZXQgPSByZXF1aXJlICduZXQnXG5jbGllbnQgPSByZXF1aXJlICcuLi9jbGllbnQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc2VydmVyOiBudWxsXG4gIHBvcnQ6IG51bGxcblxuICBsaXN0ZW5lcnM6IFtdXG5cbiAgbmV4dDogLT5cbiAgICBjb25uID0gbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICBAbGlzdGVuZXJzLnB1c2ggcmVzb2x2ZVxuICAgIGNvbm4uZGlzcG9zZSA9ID0+XG4gICAgICBAbGlzdGVuZXJzID0gQGxpc3RlbmVycy5maWx0ZXIgKHgpIC0+IHggaXMgY29ublxuICAgIGNvbm5cblxuICBjb25uZWN0OiAoc29jaykgLT5cbiAgICBtZXNzYWdlID0gKG0pIC0+IHNvY2sud3JpdGUgSlNPTi5zdHJpbmdpZnkgbVxuICAgIGNsaWVudC5yZWFkU3RyZWFtIHNvY2tcbiAgICBzb2NrLm9uICdlbmQnLCAtPiBjbGllbnQuZGV0YWNoKClcbiAgICBzb2NrLm9uICdlcnJvcicsIC0+IGNsaWVudC5kZXRhY2goKVxuICAgIGNsaWVudC5hdHRhY2gge21lc3NhZ2V9XG5cbiAgaGFuZGxlOiAoc29jaykgLT5cbiAgICBpZiBAbGlzdGVuZXJzLmxlbmd0aCA+IDBcbiAgICAgIEBsaXN0ZW5lcnMuc2hpZnQoKShzb2NrKVxuICAgIGVsc2UgaWYgbm90IGNsaWVudC5pc0FjdGl2ZSgpXG4gICAgICBAY29ubmVjdCBzb2NrXG4gICAgZWxzZVxuICAgICAgc29jay5lbmQoKVxuXG4gIGxpc3RlbjogLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEBwb3J0KSBpZiBAcG9ydD9cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgZXh0ZXJuYWxQb3J0ID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQuanVsaWFPcHRpb25zLmV4dGVybmFsUHJvY2Vzc1BvcnQnKVxuICAgICAgaWYgZXh0ZXJuYWxQb3J0ID09ICdyYW5kb20nXG4gICAgICAgIHBvcnQgPSAwXG4gICAgICBlbHNlXG4gICAgICAgIHBvcnQgPSBwYXJzZUludChleHRlcm5hbFBvcnQpXG4gICAgICBAc2VydmVyID0gbmV0LmNyZWF0ZVNlcnZlcigoc29jaykgPT4gQGhhbmRsZShzb2NrKSlcbiAgICAgIEBzZXJ2ZXIub24gJ2Vycm9yJywgKGVycikgPT5cbiAgICAgICAgaWYgZXJyLmNvZGUgPT0gJ0VBRERSSU5VU0UnXG4gICAgICAgICAgZGV0YWlscyA9ICcnXG4gICAgICAgICAgaWYgcG9ydCAhPSAwXG4gICAgICAgICAgICBkZXRhaWxzID0gJ1BsZWFzZSBjaGFuZ2UgdG8gYW5vdGhlciBwb3J0IGluIHRoZSBzZXR0aW5ncyBhbmQgdHJ5IGFnYWluLidcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJKdWxpYSBjb3VsZCBub3QgYmUgc3RhcnRlZC5cIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXCJcbiAgICAgICAgICAgIFBvcnQgYCN7cG9ydH1gIGlzIGFscmVhZHkgaW4gdXNlLlxuXG4gICAgICAgICAgICBcIlwiXCIgKyBpZiBkZXRhaWxzIGlzbnQgJydcbiAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICN7ZGV0YWlsc31cbiAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIFwiUGxlYXNlIHRyeSBhZ2FpbiBvciBzZXQgYSBmaXhlZCBwb3J0IHRoYXQgeW91IGtub3cgaXMgdW51c2VkLlwiXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgQHNlcnZlci5saXN0ZW4gcG9ydCwgJzEyNy4wLjAuMScsID0+XG4gICAgICAgIEBwb3J0ID0gQHNlcnZlci5hZGRyZXNzKCkucG9ydFxuICAgICAgICByZXNvbHZlKEBwb3J0KVxuIl19
