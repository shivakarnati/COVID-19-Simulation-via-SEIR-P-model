'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.updateSettings = updateSettings;
var validSchemes = require('../package/config');
var invalidSchemes = []; // Keeps invalid config schemes to be notified to users

function dispose() {
  validSchemes = null;
  invalidSchemes = null;
}

/**
 * Updates settings by removing deprecated (i.e.: not used anymore) configs so that no one tries to
 * tweak them.
 */

function updateSettings() {
  var currentConfig = atom.config.get('julia-client');
  searchForDeprecated(currentConfig, []);

  if (invalidSchemes.length > 0) {
    (function () {
      var message = atom.notifications.addWarning('Julia-Client: Invalid (deprecated) settings found', {
        detail: invalidSchemes.join('\n'),
        dismissable: true,
        description: 'Remove these invalid settings ?',
        buttons: [{
          text: 'Yes',
          onDidClick: function onDidClick() {
            message.dismiss();
            invalidSchemes.forEach(function (invalidScheme) {
              atom.config.unset(invalidScheme);
            });
            dispose();
          }
        }, {
          text: 'No',
          onDidClick: function onDidClick() {
            message.dismiss();
            dispose();
          }
        }]
      });
    })();
  }
}

/**
 * Recursively search deprecated configs
 */
function searchForDeprecated(config, currentSchemes) {
  Object.entries(config).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var key = _ref2[0];
    var value = _ref2[1];

    // @NOTE: Traverse the current config schemes by post-order in order to push all the invalid
    // config schemes into `invalidSchemes`
    if (Object.prototype.toString.call(value) === '[object Object]') {
      var nextSchemes = currentSchemes.slice(0);
      nextSchemes.push(key);
      searchForDeprecated(value, nextSchemes);
    }

    // Make `validScheme` corresponding to `currentSchemes` path for the validity checking below
    var validScheme = validSchemes;
    currentSchemes.forEach(function (scheme) {
      Object.entries(validScheme).forEach(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var _key = _ref32[0];
        var _value = _ref32[1];

        if (_key === scheme) {
          validScheme = _value;
        } else if (_key === 'properties' && _value[scheme]) {
          validScheme = _value[scheme];
        }
      });
    });

    // Check if the `config` scheme being searched at this recursion is in `validScheme`
    if (!validScheme[key] && (!validScheme.properties || !validScheme.properties[key])) {
      var invalidScheme = 'julia-client.';
      invalidScheme += currentSchemes.length === 0 ? '' : currentSchemes.join('.') + '.';
      invalidScheme += key;
      invalidSchemes.push(invalidScheme);
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvanVsaWEtY2xpZW50L2xpYi9wYWNrYWdlL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7O0FBRVgsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDL0MsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFBOztBQUV2QixTQUFTLE9BQU8sR0FBRztBQUNqQixjQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ25CLGdCQUFjLEdBQUcsSUFBSSxDQUFBO0NBQ3RCOzs7Ozs7O0FBTU0sU0FBUyxjQUFjLEdBQUc7QUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDckQscUJBQW1CLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUV0QyxNQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUM3QixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxtREFBbUQsRUFBRTtBQUNqRyxjQUFNLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDakMsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLG1CQUFXLEVBQUUsaUNBQWlDO0FBQzlDLGVBQU8sRUFBRSxDQUNQO0FBQ0UsY0FBSSxFQUFFLEtBQUs7QUFDWCxvQkFBVSxFQUFFLHNCQUFNO0FBQ2hCLG1CQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDakIsMEJBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxhQUFhLEVBQUs7QUFDeEMsa0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO2FBQ2pDLENBQUMsQ0FBQTtBQUNGLG1CQUFPLEVBQUUsQ0FBQTtXQUNWO1NBQ0YsRUFDRDtBQUNFLGNBQUksRUFBRSxJQUFJO0FBQ1Ysb0JBQVUsRUFBRSxzQkFBTTtBQUNoQixtQkFBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pCLG1CQUFPLEVBQUUsQ0FBQTtXQUNWO1NBQ0YsQ0FDRjtPQUNGLENBQUMsQ0FBQTs7R0FDSDtDQUNGOzs7OztBQUtELFNBQVMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRTtBQUNuRCxRQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVksRUFBSzsrQkFBakIsSUFBWTs7UUFBWCxHQUFHO1FBQUUsS0FBSzs7OztBQUd6QyxRQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsRUFBRTtBQUMvRCxVQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzNDLGlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3JCLHlCQUFtQixDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtLQUN4Qzs7O0FBR0QsUUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFBO0FBQzlCLGtCQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ2pDLFlBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYyxFQUFLO29DQUFuQixLQUFjOztZQUFiLElBQUk7WUFBRSxNQUFNOztBQUNoRCxZQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDbkIscUJBQVcsR0FBRyxNQUFNLENBQUE7U0FDckIsTUFBTSxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2xELHFCQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzdCO09BQ0YsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFDOzs7QUFHSCxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQ2xGLFVBQUksYUFBYSxHQUFHLGVBQWUsQ0FBQTtBQUNuQyxtQkFBYSxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBTSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFHLENBQUE7QUFDbEYsbUJBQWEsSUFBSSxHQUFHLENBQUE7QUFDcEIsb0JBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDbkM7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiIvaG9tZS9zaGl2YWtyaXNobmFrYXJuYXRpLy52YXIvYXBwL2lvLmF0b20uQXRvbS9kYXRhL3BhY2thZ2VzL2p1bGlhLWNsaWVudC9saWIvcGFja2FnZS9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmxldCB2YWxpZFNjaGVtZXMgPSByZXF1aXJlKCcuLi9wYWNrYWdlL2NvbmZpZycpXG5sZXQgaW52YWxpZFNjaGVtZXMgPSBbXSAgLy8gS2VlcHMgaW52YWxpZCBjb25maWcgc2NoZW1lcyB0byBiZSBub3RpZmllZCB0byB1c2Vyc1xuXG5mdW5jdGlvbiBkaXNwb3NlKCkge1xuICB2YWxpZFNjaGVtZXMgPSBudWxsXG4gIGludmFsaWRTY2hlbWVzID0gbnVsbFxufVxuXG4vKipcbiAqIFVwZGF0ZXMgc2V0dGluZ3MgYnkgcmVtb3ZpbmcgZGVwcmVjYXRlZCAoaS5lLjogbm90IHVzZWQgYW55bW9yZSkgY29uZmlncyBzbyB0aGF0IG5vIG9uZSB0cmllcyB0b1xuICogdHdlYWsgdGhlbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKCkge1xuICBjb25zdCBjdXJyZW50Q29uZmlnID0gYXRvbS5jb25maWcuZ2V0KCdqdWxpYS1jbGllbnQnKVxuICBzZWFyY2hGb3JEZXByZWNhdGVkKGN1cnJlbnRDb25maWcsIFtdKVxuXG4gIGlmIChpbnZhbGlkU2NoZW1lcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdKdWxpYS1DbGllbnQ6IEludmFsaWQgKGRlcHJlY2F0ZWQpIHNldHRpbmdzIGZvdW5kJywge1xuICAgICAgZGV0YWlsOiBpbnZhbGlkU2NoZW1lcy5qb2luKCdcXG4nKSxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdSZW1vdmUgdGhlc2UgaW52YWxpZCBzZXR0aW5ncyA/JyxcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdZZXMnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIG1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgICBpbnZhbGlkU2NoZW1lcy5mb3JFYWNoKChpbnZhbGlkU2NoZW1lKSA9PiB7XG4gICAgICAgICAgICAgIGF0b20uY29uZmlnLnVuc2V0KGludmFsaWRTY2hlbWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZGlzcG9zZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ05vJyxcbiAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICBtZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgICAgZGlzcG9zZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHNlYXJjaCBkZXByZWNhdGVkIGNvbmZpZ3NcbiAqL1xuZnVuY3Rpb24gc2VhcmNoRm9yRGVwcmVjYXRlZChjb25maWcsIGN1cnJlbnRTY2hlbWVzKSB7XG4gIE9iamVjdC5lbnRyaWVzKGNvbmZpZykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgLy8gQE5PVEU6IFRyYXZlcnNlIHRoZSBjdXJyZW50IGNvbmZpZyBzY2hlbWVzIGJ5IHBvc3Qtb3JkZXIgaW4gb3JkZXIgdG8gcHVzaCBhbGwgdGhlIGludmFsaWRcbiAgICAvLyBjb25maWcgc2NoZW1lcyBpbnRvIGBpbnZhbGlkU2NoZW1lc2BcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIGNvbnN0IG5leHRTY2hlbWVzID0gY3VycmVudFNjaGVtZXMuc2xpY2UoMClcbiAgICAgIG5leHRTY2hlbWVzLnB1c2goa2V5KVxuICAgICAgc2VhcmNoRm9yRGVwcmVjYXRlZCh2YWx1ZSwgbmV4dFNjaGVtZXMpXG4gICAgfVxuXG4gICAgLy8gTWFrZSBgdmFsaWRTY2hlbWVgIGNvcnJlc3BvbmRpbmcgdG8gYGN1cnJlbnRTY2hlbWVzYCBwYXRoIGZvciB0aGUgdmFsaWRpdHkgY2hlY2tpbmcgYmVsb3dcbiAgICBsZXQgdmFsaWRTY2hlbWUgPSB2YWxpZFNjaGVtZXNcbiAgICBjdXJyZW50U2NoZW1lcy5mb3JFYWNoKChzY2hlbWUpID0+IHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHZhbGlkU2NoZW1lKS5mb3JFYWNoKChbX2tleSwgX3ZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoX2tleSA9PT0gc2NoZW1lKSB7XG4gICAgICAgICAgdmFsaWRTY2hlbWUgPSBfdmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChfa2V5ID09PSAncHJvcGVydGllcycgJiYgX3ZhbHVlW3NjaGVtZV0pIHtcbiAgICAgICAgICB2YWxpZFNjaGVtZSA9IF92YWx1ZVtzY2hlbWVdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgYGNvbmZpZ2Agc2NoZW1lIGJlaW5nIHNlYXJjaGVkIGF0IHRoaXMgcmVjdXJzaW9uIGlzIGluIGB2YWxpZFNjaGVtZWBcbiAgICBpZiAoIXZhbGlkU2NoZW1lW2tleV0gJiYgKCF2YWxpZFNjaGVtZS5wcm9wZXJ0aWVzIHx8ICF2YWxpZFNjaGVtZS5wcm9wZXJ0aWVzW2tleV0pKSB7XG4gICAgICBsZXQgaW52YWxpZFNjaGVtZSA9ICdqdWxpYS1jbGllbnQuJ1xuICAgICAgaW52YWxpZFNjaGVtZSArPSBjdXJyZW50U2NoZW1lcy5sZW5ndGggPT09IDAgPyAnJyA6IGAke2N1cnJlbnRTY2hlbWVzLmpvaW4oJy4nKX0uYFxuICAgICAgaW52YWxpZFNjaGVtZSArPSBrZXlcbiAgICAgIGludmFsaWRTY2hlbWVzLnB1c2goaW52YWxpZFNjaGVtZSlcbiAgICB9XG4gIH0pO1xufVxuIl19