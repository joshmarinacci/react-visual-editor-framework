import React, {Component} from 'react'
import "../../css/grid.css"
import TreeTable from '../../src/TreeTable'
import PropSheet from '../../src/PropSheet'
import {Spacer} from 'appy-comps'
import SelectionManager, {SELECTION_MANAGER} from '../../src/SelectionManager'
import {TREE_ITEM_PROVIDER} from '../../src/TreeItemProvider'
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
                <RectCanvas provider={this.props.provider}/>
            </div>

            <Resizer onMouseDown={this.resizeRight}/>

            <div className={'panel high-2'} style={{ backgroundColor: '#ecf0f1'}}>
                <PropSheet provider={this.props.provider}/>
            </div>



            <Resizer onMouseDown={this.resizeLeft}/>
            <div className="toolbar">
                <button onClick={this.toggleLeftPane}>toggle left</button>
                <Spacer/>
                <label>status bar</label>
                <Spacer/>
                <button onClick={this.toggleRightPane}>toggle right</button>
            </div>
            <Resizer onMouseDown={this.resizeRight}/>

        </div>

    }


    //event handlers
    resizeLeft = (e) => {
        window.addEventListener('mousemove',this.resizeLeftWindow)
        window.addEventListener('mouseup', this.endResizeLeftWindow)
    }
    resizeLeftWindow =(e) => {
        this.setState({leftDivider:e.clientX+'px'})
    }
    endResizeLeftWindow = (e) => {
        window.removeEventListener('mousemove', this.resizeLeftWindow)
        window.removeEventListener('mouseup', this.endResizeLeftWindow)
    }


    resizeRight = (e) => {
        window.addEventListener('mousemove', this.resizeRightWindow)
        window.addEventListener('mouseup', this.endResizeRightWindow)
    }
    resizeRightWindow = (e)=>{
        const size = document.querySelector('.grid').getBoundingClientRect()
        this.setState({rightDivider:(size.width-e.clientX)+'px'})
    }
    endResizeRightWindow = (e) => {
        window.removeEventListener('mousemove', this.resizeRightWindow)
        window.removeEventListener('mouseup', this.endResizeRightWindow)
    }

    toggleLeftPane = (e) => {
        if(this.state.leftDivider === '0px') {
            this.setState({leftDivider:'250px'})
        } else {
            this.setState({leftDivider:'0px'})
        }
    }
    toggleRightPane = (e) => {
        if(this.state.rightDivider === '0px') {
            this.setState({rightDivider:'250px'})
        } else {
            this.setState({rightDivider:'0px'})
        }
    }
    toggleBottomPane = (e) => {
        if(this.state.bottomDivider === '0px') {
            this.setState({bottomDivider:'250px'})
        } else {
            this.setState({bottomDivider:'0px'})
        }
    }

}

const Resizer = (props) => {
    return <div className="resizer" {...props}/>
}


class RectCanvas extends Component {
    componentWillMount() {
        console.log('this.props.provider',this.props.provider)
        SelectionManager.on(SELECTION_MANAGER.CHANGED, this.redraw)
        this.props.provider.on(TREE_ITEM_PROVIDER.STRUCTURE_CHANGED, this.redraw)
        this.props.provider.on(TREE_ITEM_PROVIDER.PROPERTY_CHANGED, this.redraw)
    }
    componentDidMount() {
        this.redraw()
    }

    redraw = (e) => {
        if(!this.canvas) return
        const c = this.canvas.getContext('2d')
        c.fillStyle = 'white'
        c.fillRect(0, 0, this.canvas.width, this.canvas.height)
        c.save()
        this.props.provider.getSceneRoot().children.forEach(ch => {
            c.fillStyle = ch.color
            c.fillRect(ch.x,ch.y,ch.w,ch.h)
        })
        c.restore()
    }

    render() {
        return <div className="panel">
        <canvas style={{border: '1px solid red', width:'300px', height:'300px'}}
                    width={300} height={300} ref={(e) => this.canvas = e}
                    onClick={this.onClick}
                    onMouseDown={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onMouseMove={this.mouseMove}
            />
        </div>
    }
}