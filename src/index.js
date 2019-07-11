import React, {Component} from 'react'
import {Dialog} from './Dialog'

export {Dialog} from './Dialog'
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
