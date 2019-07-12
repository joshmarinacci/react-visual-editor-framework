import TreeItemProvider, {TREE_ITEM_PROVIDER} from '../../src/TreeItemProvider'
import React from 'react'
import {RectDocApp} from './RectDocApp'
import {PROP_TYPES} from '../../src'

export default class RectDocEditor extends TreeItemProvider {
    constructor(options) {
        super(options)
        this.root = this.makeEmptyRoot()
    }

    makeEmptyRoot(doc) {
        const root = {id:'root',type:'root',children:[]}
        const square1 = {
            type:'square',
            id:'sq1',
            x:100,
            y:100,
            w:100,
            h:100,
            color:'blue',
        }
        root.children.push(square1)
        return root
    }

    getSceneRoot() {
        return this.root
    }

    getProperties(item) {
        let defs = []
        if(!item) return defs;
        defs.push({
            key:'id',
            name:'ID',
            type:PROP_TYPES.STRING,
            locked:true,
            value:item.id
        })
        if(item.type === 'square') {
            defs.push({key:'x',name:'X',type:PROP_TYPES.NUMBER, value:item.x})
            defs.push({key:'y',name:'Y',type:PROP_TYPES.NUMBER, value:item.y})
            defs.push({key:'w',name:'Width',type:PROP_TYPES.NUMBER, value:item.w})
            defs.push({key:'h',name:'Height',type:PROP_TYPES.NUMBER, value:item.h})
        }

        return defs;
    }

    setPropertyValue(item, def, value) {
        item[def.key] = value
        this.fire(TREE_ITEM_PROVIDER.PROPERTY_CHANGED,{
            provider: this,
            child:item,
            propKey:def.key,
            oldValue:def.value,
            newValue:value
        })
    }


    getRendererForItem(item) {
        return <label>{item.type} {item.id}</label>
    }

    getApp() {
        return <RectDocApp provider={this}/>
    }
}
