import React, {Component} from 'react'
import "../../css/grid.css"
import TreeTable from '../../src/TreeTable'
import PropSheet from '../../src/PropSheet'
import {Spacer} from 'appy-comps'
export class RectDocApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftDivider: '250px',
            rightDivider: '250px',
            bottomDivider:'0px',
        }
    }
    render() {
        const gridStyle = {
            gridTemplateColumns: `${this.state.leftDivider} 0px 1fr 0px ${this.state.rightDivider}`,
            gridTemplateRows: `2rem 1fr 2rem 0px ${this.state.bottomDivider}`,
        }
        return <div className="grid" style={gridStyle}>


            <div className="toolbar gray">
                <button onClick={() => this.props.provider.save()} title={'save project'}>save</button>
            </div>

            <Resizer onMouseDown={this.resizeLeft}/>

            <div className="toolbar gray">
                <button onClick={(e)=>showAddPopup(e,this.props.provider)}>add</button>
            </div>

            <Resizer onMouseDown={this.resizeRight}/>

            <div className="toolbar gray">
                <label>My Cool Editor</label>
            </div>


            <div className={'panel high-2'}>
                <TreeTable root={this.props.provider.getSceneRoot()} provider={this.props.provider}/>
            </div>


            <Resizer onMouseDown={this.resizeLeft}/>

            <div className="panel">
                <div>center canvas</div>
            </div>

            <Resizer onMouseDown={this.resizeRight}/>

            <div className={'panel high-2'} style={{ backgroundColor: '#ecf0f1'}}>
                <PropSheet provider={this.props.provider}/>
            </div>



            <Resizer onMouseDown={this.resizeLeft}/>
            <div className="toolbar">
                <Spacer/>
                <label>status bar</label>
                <Spacer/>
            </div>
            <Resizer onMouseDown={this.resizeRight}/>

        </div>

    }

}

const Resizer = (props) => {
    return <div className="resizer" {...props}/>
}
