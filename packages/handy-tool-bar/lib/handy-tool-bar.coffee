# Copyright (c) 2020 <Diego Mariño>
#
# MIT License
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
################################################################################
# This is a fork from https://atom.io/packages/tool-bar-basic
# I've left some of the original buttons commented below in case they are useful
# for your workflow
################################################################################

module.exports =
  deactivate: ->
    @toolBar?.removeItems()

  consumeToolBar: (toolBar) ->
    @toolBar = toolBar 'handy-tool-bar'

    @toolBar.addSpacer()

    # @toolBar.addButton
    #   icon: 'file-empty'
    #   callback: 'application:new-file'
    #   tooltip: 'New File'
    #   iconset: 'icomoon'

    @toolBar.addButton
      callback: 'application:open-file'
      icon: 'file-text'
      iconset: 'icomoon'
      tooltip: 'Open File'

    @toolBar.addButton
      'callback': 'application:open-folder'
      'icon': 'folder-open'
      'iconset': 'icomoon'
      'tooltip': 'Open Folder'

    # @toolBar.addButton
    #   'icon': 'floppy-disk'
    #   'callback': 'core:save'
    #   'tooltip': 'Save File'
    #   'iconset': 'icomoon'

    if atom.packages.loadedPackages['project-manager']
      @toolBar.addButton
        'icon': 'file-submodule'
        'tooltip': 'List projects'
        'callback': 'project-manager:list-projects'

    # @toolBar.addSpacer()
    #
    # @toolBar.addButton
    #   'icon': 'search'
    #   'iconset': 'fa'
    #   'tooltip': 'Find in Buffer'
    #   'callback': 'find-and-replace:toggle'

    @toolBar.addSpacer()

    @toolBar.addButton
      'callback': 'pane:split-right'
      'icon': 'columns'
      'iconset': 'fa'
      'tooltip': 'Split Right'

    btn = @toolBar.addButton
      'callback': 'pane:split-down'
      'icon': 'columns'
      'iconset': 'fa'
      'tooltip': 'Split Down'
    btn.element.classList.add 'fa-rotate-270'

    @toolBar.addSpacer()

    @toolBar.addButton
      'callback': 'window:toggle-full-screen'
      'icon': 'screen-full'
      'tooltip': 'Toggle Fullscreen'

    @toolBar.addButton
      'callback': 'tree-view:toggle'
      'icon': 'move-down'
      'iconset': 'icomoon'
      'tooltip': 'Toggle Sidebar'

    if atom.packages.loadedPackages['minimap']
      @toolBar.addButton
        'callback': 'minimap:toggle'
        'icon': 'map-marker-alt'
        'iconset': 'fa'
        'tooltip': 'Toggle Minimap'

    if atom.packages.loadedPackages['expose']
      @toolBar.addButton
        'callback': 'expose:toggle'
        'icon': 'window-restore'
        'iconset': 'fa'
        'tooltip': 'Toggle Exposé'

    @toolBar.addSpacer()

    @toolBar.addButton
      'callback': 'editor:auto-indent'
      'icon': 'indent'
      'iconset': 'fa'
      'tooltip': 'Auto indent (selection)'

    # @toolBar.addButton
    #   'icon': 'level-up-alt'
    #   'callback': 'editor:fold-all'
    #   'tooltip': 'Fold all'
    #   'iconset': 'fa'

    @toolBar.addButton
      'callback': 'editor:unfold-all'
      'icon': 'level-down-alt'
      'iconset': 'fa'
      'tooltip': 'Unfold all blocks'


    if atom.packages.loadedPackages['atom-beautify']
      @toolBar.addButton
        'callback': 'atom-beautify:beautify-editor'
        'icon': 'star'
        'iconset': 'fa'
        'tooltip': 'Beautify code'

    if atom.packages.loadedPackages['terminal-plus']
      @toolBar.addSpacer()
      @toolBar.addButton
        'callback': 'terminal-plus:toggle'
        'icon': 'terminal'
        'tooltip': 'Toggle Terminal-plus'

    # else if atom.packages.loadedPackages['term2']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'term2:open-split-down'
    #     'tooltip': 'Term2 Split Down'
    # else if atom.packages.loadedPackages['term3']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'term3:open-split-down'
    #     'tooltip': 'Term3 Split Down'
    # else if atom.packages.loadedPackages['platformio-ide-terminal']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'platformio-ide-terminal:toggle'
    #     'tooltip': 'Toggle platformio-ide-terminal'

    if atom.inDevMode()
      @toolBar.addButton
        'callback': 'window:reload'
        'icon': 'redo'
        'iconset': 'fa'
        'tooltip': 'Reload Window'

      @toolBar.addButton
        'callback': 'window:toggle-dev-tools'
        'icon': 'tools'
        'tooltip': 'Toggle Developer Tools'

    if atom.packages.loadedPackages['git-plus']
      @toolBar.addSpacer()
      @toolBar.addButton
        'callback' : 'git-plus:menu'
        'icon' : 'git-plain'
        'iconset' : 'devicon'
        'tooltip' : 'Git plus'

    if atom.packages.loadedPackages['script']
      @toolBar.addSpacer()
      @toolBar.addButton
        'callback': 'script:run'
        'icon': 'play'
        'iconset': 'fa'
        'tooltip': 'Run script'
      @toolBar.addButton
        'callback': 'script:kill-process'
        'icon': 'stop'
        'iconset': 'fa'
        'tooltip': 'Stop script'
      @toolBar.addButton
        'callback': 'script:run-options'
        'icon': 'cogs'
        'iconset': 'fa'
        'tooltip': 'Configure script'

    @toolBar.addSpacer()

    if atom.packages.loadedPackages['markdown-preview-plus']
      @toolBar.addButton
        'callback': 'markdown-preview-plus:toggle'
        'icon': 'markdown'
        'tooltip': 'Markdown Preview'
    else
      @toolBar.addButton
        'callback': 'markdown-preview:toggle'
        'icon': 'markdown'
        'tooltip': 'Markdown Preview'

    if atom.packages.loadedPackages['atom-html-preview']
      @toolBar.addButton
        'callback': 'atom-html-preview:toggle'
        'icon': 'logo-html5'
        'iconset': 'ion'
        'tooltip': 'HTML Preview'

    if atom.packages.loadedPackages['atom-live-server']
      @toolBar.addButton
        'callback': 'atom-live-server:start-3000'
        'icon': 'sync'
        'tooltip': 'HTML Live Server'

    # @toolBar.addSpacer()
  #
    # @toolBar.addButton
    #   'icon': 'code-branch'
    #   'callback': 'github:toggle-github-tab'
    #   'tooltip': 'Toggle GitHub Tab'
    #   'iconset': 'fa'

    @toolBar.addSpacer()

    @toolBar.addButton
      'callback': 'command-palette:toggle'
      'icon': 'palette'
      'iconset': 'fa'
      'tooltip': 'Toggle Command Palette'
