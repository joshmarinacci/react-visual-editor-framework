import React, {Component} from 'react'
import {Dialog} from './Dialog'
export TreeTable from './TreeTable'
export {Dialog} from './Dialog'
export {Spacer, ToggleButton, MenuPopup} from "./GridEditorApp"
export QRCanvas from "./QRCanvas"
export InputManager from "./InputManager"
export SelectionManager, {SELECTION_MANAGER} from "./SelectionManager"
export PropSheet, {TYPES as PROP_TYPES} from "./PropSheet"
export TreeItemProvider, {getLoginURL, TREE_ITEM_PROVIDER, getDocsURL, getScriptsURL, getAssetsURL, getInfoURL, getUserURL} from "./TreeItemProvider"

export {toQueryString, makePoint, setQuery, parseOptions, on, genID} from "./utils"

export default class extends Component {
  render() {
    return <div>
      <h2>This is the editor</h2>
      <Dialog visible={true}>
        <header>dialog header</header>
        <div>dialog body</div>
        <footer>dialog footer</footer>
      </Dialog>
    </div>
  }
}
