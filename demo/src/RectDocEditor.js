import TreeItemProvider from '../../src/TreeItemProvider'
import React from 'react'
import {RectDocApp} from './RectDocApp'
import {PROP_TYPES} from '../../src'

export default class RectDocEditor extends TreeItemProvider {
    constructor(options) {
        super(options)
        this.root = this.makeEmptyRoot()
    }
    getApp() {
        return <RectDocApp provider={this}/>
    }

    makeEmptyRoot(doc) {
        const root = {id:'root',type:'root',children:[]}
    }

    getSceneRoot() {
        return this.root
    }

    getProperties(item) {
        let defs = []
        console.log("looking at item",item)
        if(!item) return defs;
        defs.push({
            key:'id',
            name:'ID',
            type:PROP_TYPES.STRING,
            locked:true,
            value:item.id
        })
        return defs;
    }
}
