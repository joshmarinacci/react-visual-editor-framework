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
        const square2 = {
            type:'square',
            id:'sq2',
            x:150,
            y:20,
            w:30,
            h:30,
            color:'red',
        }
        root.children.push(square2)
        const square3 = {
            type:'square',
            id:'sq3',
            x:30,
            y:220,
            w:30,
            h:30,
            color:'green',
        }
        root.children.push(square3)

        const g1 = {
            type:'group',
            id:'g1',
        }
        root.children.push(g1)
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

    canAddChild(item,target) {
        console.log("target is",item.type)
        if(item.type === 'root') return true
        return false
    }
    canBeSibling(item,target) {
        if(target.type === 'square' && item.type === 'square') return true
        return false
    }
    moveChildAfterSibling(src,dst) {
        const nold = this.root.children.indexOf(src)
        this.root.children.splice(nold,1)

        const nnew = this.root.children.indexOf(dst)
        this.root.children.splice(nnew+1,0,src)
    }
    moveChildToNewParent(src,dst) {
        const nold = this.root.children.indexOf(src)
        this.root.children.splice(nold,1)
        this.root.children.push(src)
    }


    getRendererForItem(item) {
        return <label>{item.type} {item.id}</label>
    }

    getApp() {
        return <RectDocApp provider={this}/>
    }

    calculateContextMenu(item) {
        console.log("doing it")
        const cmds = []
        cmds.push({divider: true})
        return cmds
    }
}
