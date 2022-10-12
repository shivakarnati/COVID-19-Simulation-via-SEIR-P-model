'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = config = {
  'terminal': {
    type: 'object',
    oder: 1,
    title: 'Terminal Colors',
    properties: {
      'selectionAlpha': {
        order: -1,
        type: 'number',
        title: 'Selection Opacity',
        'default': 0.3,
        minimum: 0,
        maximum: 1
      },
      'ansiBlack': {
        order: 0,
        type: 'object',
        title: 'Black',
        properties: {
          light: {
            'default': '#000000',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#000000',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiRed': {
        order: 1,
        type: 'object',
        title: 'Red',
        properties: {
          light: {
            'default': '#cd3131',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#cd3131',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiGreen': {
        order: 2,
        type: 'object',
        title: 'Green',
        properties: {
          light: {
            'default': '#00BC00',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#0DBC79',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiYellow': {
        order: 3,
        type: 'object',
        title: 'Yellow',
        properties: {
          light: {
            'default': '#949800',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#e5e510',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBlue': {
        order: 4,
        type: 'object',
        title: 'Blue',
        properties: {
          light: {
            'default': '#0451a5',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#2472c8',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiMagenta': {
        order: 5,
        type: 'object',
        title: 'Magenta',
        properties: {
          light: {
            'default': '#bc05bc',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#bc3fbc',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiCyan': {
        order: 6,
        type: 'object',
        title: 'Cyan',
        properties: {
          light: {
            'default': '#0598bc',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#11a8cd',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiWhite': {
        order: 7,
        type: 'object',
        title: 'White',
        properties: {
          light: {
            'default': '#555555',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#e5e5e5',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightBlack': {
        order: 8,
        type: 'object',
        title: 'Bright Black',
        properties: {
          light: {
            'default': '#666666',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#666666',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightRed': {
        order: 9,
        type: 'object',
        title: 'Bright Red',
        properties: {
          light: {
            'default': '#cd3131',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#f14c4c',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightGreen': {
        order: 10,
        type: 'object',
        title: 'Bright Green',
        properties: {
          light: {
            'default': '#14CE14',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#19bc3a',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightYellow': {
        order: 11,
        type: 'object',
        title: 'Bright Yellow',
        properties: {
          light: {
            'default': '#b5ba00',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#f5f543',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightBlue': {
        order: 12,
        type: 'object',
        title: 'Bright Blue',
        properties: {
          light: {
            'default': '#0451a5',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#3b8eea',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightMagenta': {
        order: 13,
        type: 'object',
        title: 'Bright Magenta',
        properties: {
          light: {
            'default': '#bc05bc',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#d670d6',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightCyan': {
        order: 14,
        type: 'object',
        title: 'Bright Cyan',
        properties: {
          light: {
            'default': '#0598bc',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#29b8db',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      },
      'ansiBrightWhite': {
        order: 15,
        type: 'object',
        title: 'Bright White',
        properties: {
          light: {
            'default': '#a5a5a5',
            title: 'for light backgrounds',
            type: 'color'
          },
          dark: {
            'default': '#e5e5e5',
            title: 'for dark backgrounds',
            type: 'color'
          }
        }
      }
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaXZha3Jpc2huYWthcm5hdGkvLnZhci9hcHAvaW8uYXRvbS5BdG9tL2RhdGEvcGFja2FnZXMvaW5rL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztxQkFFSSxNQUFNLEdBQUc7QUFDdEIsWUFBVSxFQUFFO0FBQ1YsUUFBSSxFQUFFLFFBQVE7QUFDZCxRQUFJLEVBQUUsQ0FBQztBQUNQLFNBQUssRUFBRSxpQkFBaUI7QUFDeEIsY0FBVSxFQUFFO0FBQ1Ysc0JBQWdCLEVBQUU7QUFDaEIsYUFBSyxFQUFFLENBQUMsQ0FBQztBQUNULFlBQUksRUFBRSxRQUFRO0FBQ2QsYUFBSyxFQUFFLG1CQUFtQjtBQUMxQixtQkFBUyxHQUFHO0FBQ1osZUFBTyxFQUFFLENBQUM7QUFDVixlQUFPLEVBQUUsQ0FBQztPQUNYO0FBQ0QsaUJBQVcsRUFBRTtBQUNYLGFBQUssRUFBRSxDQUFDO0FBQ1IsWUFBSSxFQUFFLFFBQVE7QUFDZCxhQUFLLEVBQUUsT0FBTztBQUNkLGtCQUFVLEVBQUU7QUFDVixlQUFLLEVBQUU7QUFDTCx1QkFBUyxTQUFTO0FBQ2xCLGlCQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGdCQUFJLEVBQUUsT0FBTztXQUNkO0FBQ0QsY0FBSSxFQUFFO0FBQ0osdUJBQVMsU0FBUztBQUNsQixpQkFBSyxFQUFFLHNCQUFzQjtBQUM3QixnQkFBSSxFQUFFLE9BQU87V0FDZDtTQUNGO09BQ0Y7QUFDRCxlQUFTLEVBQUU7QUFDVCxhQUFLLEVBQUUsQ0FBQztBQUNSLFlBQUksRUFBRSxRQUFRO0FBQ2QsYUFBSyxFQUFFLEtBQUs7QUFDWixrQkFBVSxFQUFFO0FBQ1YsZUFBSyxFQUFFO0FBQ0wsdUJBQVMsU0FBUztBQUNsQixpQkFBSyxFQUFFLHVCQUF1QjtBQUM5QixnQkFBSSxFQUFFLE9BQU87V0FDZDtBQUNELGNBQUksRUFBRTtBQUNKLHVCQUFTLFNBQVM7QUFDbEIsaUJBQUssRUFBRSxzQkFBc0I7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LGtCQUFVLEVBQUU7QUFDVixlQUFLLEVBQUU7QUFDTCx1QkFBUyxTQUFTO0FBQ2xCLGlCQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGdCQUFJLEVBQUUsT0FBTztXQUNkO0FBQ0QsY0FBSSxFQUFFO0FBQ0osdUJBQVMsU0FBUztBQUNsQixpQkFBSyxFQUFFLHNCQUFzQjtBQUM3QixnQkFBSSxFQUFFLE9BQU87V0FDZDtTQUNGO09BQ0Y7S0FDRjtHQUNGO0NBQ0YiLCJmaWxlIjoiL2hvbWUvc2hpdmFrcmlzaG5ha2FybmF0aS8udmFyL2FwcC9pby5hdG9tLkF0b20vZGF0YS9wYWNrYWdlcy9pbmsvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZyA9IHtcbiAgJ3Rlcm1pbmFsJzoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIG9kZXI6IDEsXG4gICAgdGl0bGU6ICdUZXJtaW5hbCBDb2xvcnMnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICdzZWxlY3Rpb25BbHBoYSc6IHtcbiAgICAgICAgb3JkZXI6IC0xLFxuICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgdGl0bGU6ICdTZWxlY3Rpb24gT3BhY2l0eScsXG4gICAgICAgIGRlZmF1bHQ6IDAuMyxcbiAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgbWF4aW11bTogMVxuICAgICAgfSxcbiAgICAgICdhbnNpQmxhY2snOiB7XG4gICAgICAgIG9yZGVyOiAwLFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCbGFjaycsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBsaWdodDoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyMwMDAwMDAnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgbGlnaHQgYmFja2dyb3VuZHMnLFxuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhcms6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGRhcmsgYmFja2dyb3VuZHMnLFxuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdhbnNpUmVkJzoge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHRpdGxlOiAnUmVkJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2NkMzEzMScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyNjZDMxMzEnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lHcmVlbic6IHtcbiAgICAgICAgb3JkZXI6IDIsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0dyZWVuJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzAwQkMwMCcsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyMwREJDNzknLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lZZWxsb3cnOiB7XG4gICAgICAgIG9yZGVyOiAzLFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdZZWxsb3cnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjOTQ5ODAwJyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGxpZ2h0IGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2U1ZTUxMCcsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBkYXJrIGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYW5zaUJsdWUnOiB7XG4gICAgICAgIG9yZGVyOiA0LFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCbHVlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzA0NTFhNScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyMyNDcyYzgnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lNYWdlbnRhJzoge1xuICAgICAgICBvcmRlcjogNSxcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHRpdGxlOiAnTWFnZW50YScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBsaWdodDoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyNiYzA1YmMnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgbGlnaHQgYmFja2dyb3VuZHMnLFxuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhcms6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjYmMzZmJjJyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGRhcmsgYmFja2dyb3VuZHMnLFxuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdhbnNpQ3lhbic6IHtcbiAgICAgICAgb3JkZXI6IDYsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0N5YW4nLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjMDU5OGJjJyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGxpZ2h0IGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzExYThjZCcsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBkYXJrIGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYW5zaVdoaXRlJzoge1xuICAgICAgICBvcmRlcjogNyxcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHRpdGxlOiAnV2hpdGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjNTU1NTU1JyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGxpZ2h0IGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2U1ZTVlNScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBkYXJrIGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYW5zaUJyaWdodEJsYWNrJzoge1xuICAgICAgICBvcmRlcjogOCxcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHRpdGxlOiAnQnJpZ2h0IEJsYWNrJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzY2NjY2NicsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyM2NjY2NjYnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRSZWQnOiB7XG4gICAgICAgIG9yZGVyOiA5LFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCcmlnaHQgUmVkJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2NkMzEzMScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyNmMTRjNGMnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRHcmVlbic6IHtcbiAgICAgICAgb3JkZXI6IDEwLFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCcmlnaHQgR3JlZW4nLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjMTRDRTE0JyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGxpZ2h0IGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzE5YmMzYScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBkYXJrIGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYW5zaUJyaWdodFllbGxvdyc6IHtcbiAgICAgICAgb3JkZXI6IDExLFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCcmlnaHQgWWVsbG93JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2I1YmEwMCcsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyNmNWY1NDMnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRCbHVlJzoge1xuICAgICAgICBvcmRlcjogMTIsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0JyaWdodCBCbHVlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzA0NTFhNScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyMzYjhlZWEnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRNYWdlbnRhJzoge1xuICAgICAgICBvcmRlcjogMTMsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0JyaWdodCBNYWdlbnRhJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2JjMDViYycsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyNkNjcwZDYnLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRDeWFuJzoge1xuICAgICAgICBvcmRlcjogMTQsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0JyaWdodCBDeWFuJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGxpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnIzA1OThiYycsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBsaWdodCBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFyazoge1xuICAgICAgICAgICAgZGVmYXVsdDogJyMyOWI4ZGInLFxuICAgICAgICAgICAgdGl0bGU6ICdmb3IgZGFyayBiYWNrZ3JvdW5kcycsXG4gICAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Fuc2lCcmlnaHRXaGl0ZSc6IHtcbiAgICAgICAgb3JkZXI6IDE1LFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICdCcmlnaHQgV2hpdGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjYTVhNWE1JyxcbiAgICAgICAgICAgIHRpdGxlOiAnZm9yIGxpZ2h0IGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnI2U1ZTVlNScsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvciBkYXJrIGJhY2tncm91bmRzJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==