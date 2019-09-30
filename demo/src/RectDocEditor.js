import TreeItemProvider, {TREE_ITEM_PROVIDER} from '../../src/TreeItemProvider'
import React from 'react'
import {RectDocApp} from './RectDocApp'
import {PROP_TYPES} from '../../src'
import {ClusterDelegate} from '../../src/PropSheet'


const ColorValueRenderer = ({object, key, value}) => {
    return <b style={{
        backgroundColor:value,
        border:'black',
        padding: '0.5em',
    }}>{value}</b>
}


function makeClusterDef(provider,json) {
    const obj = {}
    Object.keys(json).map(clusterKey => {
        obj[clusterKey] = new ClusterDelegate(provider,clusterKey,json[clusterKey])
    })
    return obj
}

const GroupDef = {
    base: {
        id: {
            type: PROP_TYPES.STRING,
            name: 'ID',
            locked: true,
        },
        type: {
            type: PROP_TYPES.STRING,
            name:'type',
            locked:true,
            default:'group',
        },
        title: {
            type: PROP_TYPES.STRING,
            name:'title',
        }
    }
}

const SquareDef = {
    base: { //the base cluster
        id: {
            type: PROP_TYPES.STRING,
            name: 'ID',
            locked: true,
        },
        type: {
            type: PROP_TYPES.STRING,
            name:'type',
            locked:true,
            default:'square',
        }
    },
    geom:{
        x:{
            type:PROP_TYPES.NUMBER,
            default:0,
            live:true,
            hints: {
                incrementValue:1,
            }
        },
        y:{
            type:PROP_TYPES.NUMBER,
            default:0,
            live:true,
            hints: {
                incrementValue:1,
            }
        },
        w: {
            type: PROP_TYPES.NUMBER,
            default: 100,
            live:true,
            hints: {
                incrementValue:1,
                min:1,
            },
        },
        h: {
            type: PROP_TYPES.NUMBER,
            default: 100,
            live:true,
            hints: {
                incrementValue:1,
                min:1,
            }
        },
    },
    style: {
        color: {
            type: PROP_TYPES.ENUM,
            default: 'blue',
            live:false,
            values:['red','green','blue'],
            renderer: ColorValueRenderer,
        },
    }
}




function makeFromDef(clusters, override) {
    const obj = {}
    Object.keys(clusters).forEach(cKey => {
        const cluster = clusters[cKey]
        cluster.getPropertyKeys().forEach(key => {
            console.log(key)
            if(key in override) {
                obj[key] = override[key]
            } else {
                obj[key] = cluster.getPropertyDefaultValue(key)
            }
        })
    })
    return obj
}

export default class RectDocEditor extends TreeItemProvider {
    constructor(options) {
        super(options)
        this.squareClusters = makeClusterDef(this,SquareDef)
        this.groupClusters = makeClusterDef(this,GroupDef)
        this.root = this.makeEmptyRoot()
    }

    makeEmptyRoot(doc) {
        const root = {id:'root',type:'root',children:[]}
        const square1 = makeFromDef(this.squareClusters,{id:'sq1',w:50})
        root.children.push(square1)
        const square2 = makeFromDef(this.squareClusters,{id:'sq2',x:150,y:20,w:30,h:30,color:'red'})
        root.children.push(square2)
        const square3 = makeFromDef(this.squareClusters,{id:'sq3',x:30,y:220,w:30,h:30,color:'green'})
        root.children.push(square3)
        const g1 = makeFromDef(this.groupClusters,{id:'g1'})
        root.children.push(g1)
        return root
    }

    getSceneRoot() {
        return this.root
    }
    getPropertyClusters(item) {
        if(item) {
            if (item.type === 'square') return this.squareClusters
            if (item.type === 'group') return this.groupClusters
        }
        return {}
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
        const cmds = []
        cmds.push({
            title:'do thing',
            icon:"boo",
            fun:()=>console.log("doing a function")
        })
        cmds.push({divider: true})
        return cmds
    }
}
