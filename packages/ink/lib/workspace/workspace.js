'use babel'
/** @jsx etch.dom */

import { TextEditor, CompositeDisposable } from 'atom'
import etch from "etch"
import * as fuzzaldrinPlus from 'fuzzaldrin-plus'

import PaneItem from '../util/pane-item'
import { toView, makeIcon, Button } from '../util/etch'

export default class Workspace extends PaneItem {
  constructor() {
    super()
    this.items = []
    this.setTitle('Workspace')

    this.searchEd = new TextEditor({mini: true, placeholderText: "Filter"})
    this.filteredItems = []

    this.searchEd.onDidStopChanging(() => this.filterItems(this.searchEd.getText()))

    this.subs = new CompositeDisposable()

    etch.initialize(this)
    this.element.setAttribute('tabindex', -1)
    this.element.classList.add('ink-workspace')
  }

  open(opts) {
    return super.open(opts).then(workspace => {
      workspace.searchEd.getElement().focus()
    })
  }

  setItems(items) {
    this.items = items
    this.filterItems(this.searchEd.getText())
    etch.update(this)
  }

  refresh () {
    console.log("refresh");
    // no-op unless overwritten
  }

  filterItems (query) {
    if (query.length == 0) {
      this.filteredItems = this.items
      etch.update(this)
      return
    }

    this.filteredItems = []
    this.items.forEach(context => {
      const _ctx = {
        context: context.context,
        items: fuzzaldrinPlus.filter(context.items, query, {key: 'name'})
      }
      if (_ctx.items.length > 0) {
        _ctx.items.sort((a, b) => b.score - a.score)
        this.filteredItems.push(_ctx)
      }
    })

    etch.update(this)
  }

  getIconName() {
    return 'book';
  }

  update() {}

  render() {
    return <div>
      <div className="workspace-header">
        <span className="header-main">
          <span className="search-editor">{toView(this.searchEd.element)}</span>
          <span className="btn-group">
            <Button alt='Refresh' icon="repo-sync" onclick={() => this.refresh()}/>
            <Button alt='Set Module' icon="package" onclick={() => this.refreshModule()}/>
          </span>
        </span>
      </div>
      <div className="workspace-content">
        {
          this.filteredItems.map(({context, items}) =>
            <div className="context">
              <div className="header">{context}</div>
              <table className="items">
                {items.map(({ name, type, nativetype, icon, value, onClick }) =>
                  <tr key={`${context}-${name}`}>
                    <td
                      className={`icon ${type}`}
                      title={nativetype}
                    >
                      {makeIcon(icon)}
                    </td>
                    <td className="name">
                      <a onClick={onClick}>
                        {name}
                      </a>
                    </td>
                    <td className="value">{toView(value)}</td>
                  </tr>
                )}
              </table>
            </div>
          )
        }
      </div>
    </div>
  }

}

Workspace.registerView();
