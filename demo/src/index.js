import React, {Component} from 'react'
import {render} from 'react-dom'

import RectDocEditor from './RectDocEditor'

class Demo extends Component {
  constructor(props) {
    super(props)
    this.provider = new RectDocEditor(this.props.options)
  }
  render() {
    return <div>
      {this.provider.getApp()}
    </div>
  }
}


render(<Demo options={{}}/>, document.querySelector('#demo'))
