import React, {Component} from 'react';
import {PopupManager} from 'appy-comps'

import selMan, {SELECTION_MANAGER} from "./SelectionManager";
import HSLUVColorPicker from "./HSLUVColorPicker";
import {TREE_ITEM_PROVIDER} from './TreeItemProvider'

import "../css/propsheet.css"

export const TYPES = {
    STRING:'string',
    NUMBER:'number',
    BOOLEAN:'boolean',
    ENUM:'enum',
    COLOR:'color',
    GROUP:'group',
}

class PropEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // value:props.cluster.getPropertyValue(props.item, props.propKey)
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.def !== nextProps.def) {
            this.setState({value:nextProps.def.getValue()})
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // if(nextProps.def.getType() === 'group') return true
        if(this.state.value !== nextState.value) return true
        /*
        if(this.props.def.getKey() === nextProps.def.getKey()) {
            if(this.props.def.getValue() === nextProps.def.getValue()) {
                return false
            }
        }*/
        return true
    }
    changed = (e) => {
        if(this.props.def.isType(TYPES.STRING)) {
            this.setState({value:e.target.value})
            if(this.props.def.isLive()) {
                this.props.def.setValue(e.target.value)
            }
        }
        if(this.props.def.isType(TYPES.NUMBER)) this.updateNum(e.target.value)
        if(this.props.def.isType(TYPES.BOOLEAN)) this.setState({value:e.target.checked})
    }
    revert = (e) => {
        this.setState({value:this.props.def.getValue()})
    }
    customChanged = value => {
        if(this.props.def.isType(TYPES.COLOR)) return this.colorChanged(value)
        this.setState({value:value})
        this.props.def.setValue(value)
    }
    keypressed = (e) => {
        if(e.charCode === 13) this.commit();
    }
    updateNum = (v) => {
        const def = this.props.def;
        if(def.hasHints()) {
            if(def.getHints().hasOwnProperty('min')) {
                if(v < def.getHints().min) v = def.getHints().min
            }
            if(def.getHints().hasOwnProperty('max')) {
                if (v > def.getHints().max) v = def.getHints().max
            }
        }
        this.setState({value:v})
        if(!isNaN(parseFloat(v))) {
            def.setValue(parseFloat(v))
        }
    }
    numberKeyDown = (e) => {
        if(e.key === 'ArrowUp' && e.shiftKey) {
            e.preventDefault()
            this.updateNum(this.state.value+10)
        }
        if(e.key === 'ArrowDown' && e.shiftKey) {
            e.preventDefault()
            this.updateNum(this.state.value-10)
        }
    }
    booleanChanged = (e) => {
        this.setState({value:e.target.checked});
        this.props.def.setValue(e.target.checked)
    }
    enumChanged = (value) => {
        this.setState({value:value})
        this.props.def.setValue(value)
    }
    arrayChanged = (value) => {
        this.setState({value:value})
        this.props.def.setValue(value)
    }
    colorChanged = (color) => {
        this.setState({value:color});
        this.props.def.setValue(color)
    }
    commit = () => {
        try {
            this.props.def.setValue(this.state.value)
        } catch (e) {
            console.log("commit threw an error",e)
            console.log("message is",e.message)
            this.revert()
        }
    }
    openColorEditor = (e) => {
        PopupManager.show(<HSLUVColorPicker onSelect={this.colorChanged} value={this.state.value}/>, e.target)
    }
    render() {
        // const def = this.props.def;
        // const obj = selMan.getSelection();
        // const provider = this.props.provider
        // if (def.isCustom()) return this.props.provider.createCustomEditor(this.props.item, def, provider, this.state.value, this.customChanged)
        // if (def.isLocked()) return <i>{def.getValue()}</i>
        // if (def.isType(TYPES.STRING))  return <StringEditor value={this.state.value}
        //                          onChange={this.changed}
        //                          onBlur={this.commit} onCommit={this.commit}
        //                          def={def} obj={obj}
        //                          provider={this.props.provider}/>
        // if (def.isType(TYPES.NUMBER))  {
        //     let step = 1
        //     if(def.hasHints()) {
        //         const hints = def.getHints()
        //         if (hints.incrementValue) {
        //             step = hints.incrementValue
        //         }
        //     }
        //     return <input type='number'
        //                   value={this.state.value}
        //                   onChange={this.changed}
        //                   onKeyPress={this.keypressed}
        //                   onKeyDown={this.numberKeyDown}
        //                   onBlur={this.commit}
        //                   step={step}/>
        // }
        // if (def.isType(TYPES.ENUM)) return <EnumEditor value={this.state.value} onChange={this.enumChanged} def={def} obj={obj} provider={this.props.provider}/>
        // if (def.isType(TYPES.COLOR)) return <button style={{ backgroundColor:this.state.value}} onClick={this.openColorEditor}>{this.state.value}</button>
        // if (def.isType('array')) return <ArrayEditor value={this.state.value} onChange={this.arrayChanged} def={def} obj={obj} provider={this.props.provider}/>
        const c = this.props.cluster
        const it = this.props.item
        const key = this.props.propKey
        const prov = this.props.provider
        if(c.isPropertyLocked(it,key)) return <i>{c.getPropertyValue(it,key)}</i>
        if(c.getPropertyType(it,key) === TYPES.BOOLEAN) return <BooleanEditor1 cluster={c} obj={it} name={key}/>
        if(c.getPropertyType(it,key) === TYPES.NUMBER)  return <NumberEditor1 cluster={c} obj={it} name={key}/>
        if(c.getPropertyType(it,key) === TYPES.STRING)  return <StringEditor1 cluster={c} obj={it} name={key}/>
        return <b>{c.getPropertyType(it,key)}:{c.getPropertyValue(it,key)}</b>
    }
}

const NumberEditor1 = ({cluster,obj,name}) => {
    return <input type='number'
                  value={cluster.getPropertyValue(obj,name)}
                  onChange={(e)=>{
                      // if(def.hasHints()) {
                      //     if(def.getHints().hasOwnProperty('min')) {
                      //         if(v < def.getHints().min) v = def.getHints().min
                      //     }
                      //     if(def.getHints().hasOwnProperty('max')) {
                      //         if (v > def.getHints().max) v = def.getHints().max
                      //     }
                      // }
                      let v = e.target.value
                      // if(def.getHints().hasOwnProperty('min')) {
                      //     if(v < def.getHints().min) v = def.getHints().min
                      // }
                      // if(def.getHints().hasOwnProperty('max')) {
                      //     if (v > def.getHints().max) v = def.getHints().max
                      // }
                      if(!isNaN(parseFloat(v))) {
                          if(cluster.hasHints(obj,name)) {
                              const hints = cluster.getHints(obj, name)
                              if('min' in hints) v = Math.max(v,hints.min)
                              if('max' in hints) v = Math.min(v,hints.max)
                          }
                          cluster.setPropertyValue(obj, name, parseFloat(v))
                      }
                  }}
    />
}

const BooleanEditor1 = ({cluster,obj,name}) => {
    return <input type='checkbox'
                  checked={cluster.getPropertyValue(obj,name)}
                  onChange={(e)=>{
                    console.log('changing the checkbox')
                  }}/>

}

const StringEditor1 = ({cluster,obj,name})=>{
    return <input type='string'
                  value={cluster.getPropertyValue(obj,name)}
                  onChange={(e)=>{
                      cluster.setPropertyValue(obj,name,e.target.value)
                      // this.setState({value:e.target.value})
                      // if(this.props.def.isLive()) {
                      //     this.props.def.setValue(e.target.value)
                      // }
                  }}
                  // onChange={this.props.onChange}
                  // onKeyPress={this.keypressed}
                  // onBlur={this.props.onBlur}
    />
}

/*class PaletteColorPicker extends Component {
    chooseColor(c) {
        this.props.onSelect(c);
    }
    render() {
        const style = {
            display:'flex',
            flexDirection:'row',
            flexWrap:'wrap'
        }
        return <div style={style}>
            {Object.keys(COLORS2).map((key,i) => {
                let color = COLORS2[key];
                let scolor = color.toString(16);
                while(scolor.length < 6) scolor = "0"+scolor
                scolor = '#' +scolor
                let style = {
                    backgroundColor:scolor,
                    color:'red'
                }
                return <button key={key}
                               style={style}
                               onClick={this.chooseColor.bind(this, scolor)}
                >&nbsp;</button>
            })}
        </div>
    }
}
*/
export default class PropSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selection:null
        }
    }
    componentDidMount() {
        this.h2 = () => this.setState({selection:selMan.getSelection()})
        this.props.provider.on(TREE_ITEM_PROVIDER.PROPERTY_CHANGED,this.h2)
        this.hand = (s) => this.setState({selection:selMan.getSelection()})
        selMan.on(SELECTION_MANAGER.CHANGED, this.hand)
    }
    componentWillUnmount() {
        selMan.off(SELECTION_MANAGER.CHANGED, this.hand);
        this.props.provider.off(TREE_ITEM_PROVIDER.PROPERTY_CHANGED,this.h2)
    }
    render() {
        const item = selMan.getSelection()
        const prov = this.props.provider
        let clusters = prov.getPropertyClusters(item)
        return <div className="prop-wrapper">{Object.keys(clusters).map(key => {
            return <PropSection key={key} title={key} cluster={clusters[key]} prov={prov} item={item}/>
        })}</div>
    }
    renderIndeterminate(prop, i) {
        if(prop.isIndeterminate()) {
            return <i key={prop.getKey()+'-indeterminate'} className="icon fa fa-exclamation-circle"/>
        } else {
            return ""
        }
    }
    calculateProps() {
        const items = selMan.getFullSelection()
        const first = items[0]
        const prov = this.props.provider
        let props = prov.getProperties(first)
        items.forEach((item)=>{
            props = calculateIntersection(props, prov.getProperties(item))
        })
        return props.map((prop)=>{
            const multi = new MultiPropProxy(prov, prop.key)
            items.forEach((item)=>{
                const p2 = prov.getProperties(item)
                const match = p2.find(def=>def.key === prop.key)
                multi.addSubProxy(new PropProxy(prov,item,match))
            })
            return multi
        });
    }
    calculateGroups(props) {
        const group_defs = props.filter(p => p.getType() === TYPES.GROUP)
        group_defs.forEach(def => {
            const group_keys = def.getGroupKeys()
            //remove any groups in the group keys of a group def
            props = props.filter(p => group_keys.indexOf(p.getKey())<0)
        })
        return props
    }
}



class PropSection extends Component {
    render() {
        return <div className="prop-sheet">
            <header>{this.props.title}</header>
            {
                this.props.cluster.getPropertyKeys(this.props.item).map(key => {
                    return [
                        <label key={key+'-label'}>{key}</label>,
                        this.renderPropEditor(this.props.cluster,this.props.item,key)
                        ]
                })
            }
        </div>
    }

    calculateDefs() {
    }

    renderPropEditor(cluster, item, key) {
        return <PropEditor key={key+'-editor'} propKey={key} provider={this.props.provider} item={item} cluster={cluster}/>
    }
}

//return items from A that are also in B
function calculateIntersection(A,B) {
    return  A.filter((pa)=> B.find((pb)=>pa.key===pb.key))
}


class MultiPropProxy {
    constructor(provider,key) {
        this.provider = provider
        this.key = key
        this.subs = []
    }
    addSubProxy(sub) {
        this.subs.push(sub)
    }
    first() {
        return this.subs[0]
    }
    getName()  { return this.first().getName()  }
    getValue() { return this.first().getValue() }
    isCustom() { return this.first().isCustom() }
    hasHints() { return this.first().hasHints() }
    getHints() { return this.first().getHints() }
    isLocked() { return this.first().isLocked() }
    getType()  { return this.first().getType()  }
    isType(s)  { return this.first().isType(s)  }
    isLive()   { return this.first().isLive()   }
    getKey()   { return this.key                }
    getGroupKeys() { return this.first().getGroupKeys() }
    setValue(v) {
        this.subs.forEach((s)=> s.setValue(v))
    }
    isIndeterminate() {
        let same = true
        let value = this.first().getValue()
        this.subs.forEach((s)=>{
            if(s.getValue() !== value) same = false
        })
        return !same;
    }
}


class PropProxy {
    constructor(provider, item, def) {
        this.provider = provider
        this.item = item
        this.def = def
    }
    getKey() {
        return this.def.key
    }
    getName() {
        return this.def.name
    }
    isCustom() {
        return this.def.custom
    }
    isLocked() {
        return this.def.locked
    }
    getType() {
        return this.def.type
    }
    getValue() {
        return this.def.value
    }
    isLive() {
        return this.def.live
    }
    isType(type) {
        return this.def.type === type
    }
    setValue(value) {
        return this.provider.setPropertyValue(this.item,this.def,value)
    }
    hasHints() {
        return this.def.hints
    }
    getHints() {
        return this.def.hints
    }
    getGroupKeys() {
        return this.def.group
    }
    isIndeterminate() { return false; }
}
