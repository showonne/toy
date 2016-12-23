import { Watcher } from './watcher.js'

const mustacheReg = /\{\{(.*)\}\}/

const updater = {
    text(node, value){
        node.textContent = value === undefined ? '' : value
    },
    html(node, value){
        node.innerHTML = value === undefined ? '' : value
    },
    model(node, value){
        node.value = value === undefined ? '' : value
    }

}

const compileUtil = {
    bind(node, vm, expression, directive){
        let updateFn = updater[directive]
        updateFn && updateFn(node, this._getVmVal(vm, expression))

        new Watcher(vm, expression, (value, oldValue) => {
            updateFn && updateFn(node, value, oldValue)
        })
    },
    text(node, vm, expression){
        this.bind(node, vm, expression, 'text')
    },
    html(node, vm, expression){
        this.bind(node, vm, expression, 'html')
    },
    model(node, vm, expression){
        this.bind(node, vm, expression, 'model')
        let self = this
        let value = this._getVmVal(vm, expression)
        node.addEventListener('input', e => {
            let newValue = e.target.value
            if(newValue === value) return
            self._setVmVal(vm, expression, newValue)
            //???
            value = newValue
        })
    },
    eventHandle(node, vm, expression, directive){
        let eventType = directive.split(':')[1]
        let fn = vm.$options.methods && vm.$options.methods[expression]
        if(eventType && fn){
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },
    _getVmVal(vm, expression){
        let keyPath = expression.split('.')
        let val = vm._data
        keyPath.forEach(key => {
            val = val[key]
        })
        return val
    },
    _setVmVal(vm, expression, value){
        let keyPath = expression.split('.')
        let val = vm._data
        keyPath.forEach((key, index) => {
            if(index < keyPath.length - 1){
                val = val[key]
            }
            val[key] = value
        })
    }
}

class Compiler {
    constructor(el, vm) {
        this.$vm = vm
        let _el = this.isElement(el) ? el : document.querySelector(el)
        if(_el){
            let _fragment = this.node2Fragment(_el)
            this.compileElement(_fragment)
            _el.appendChild(_fragment)
        }
    }
    isElement(node) {
        return node.nodeType === 1
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    node2Fragment(el){
        let fragment = document.createDocumentFragment()
        let child
        while(child = el.firstChild){
            fragment.appendChild(child)
        }
        return fragment
    }
    compileElement(el){
        let self = this
        let childNodes = el.childNodes

        Array.prototype.slice.call(childNodes).forEach(node => {
            let text = node.textContent
            if(self.isElement(node)){
                self.compile(node)
            }else if(self.isTextNode && mustacheReg.test(text)){
                self.compileText(node, RegExp.$1)
            }
            if(node.childNodes && node.childNodes.length){
                self.compileElement(node)
            }
        })
    }
    compile(node){
        let self = this
        let nodeAttrs = node.attributes
        Array.prototype.slice.call(nodeAttrs).forEach(attr => {
            if(self.isDirective(attr.name)){
                let expression = attr.value
                let directive = attr.name.substring(2)
                if(self.isEventDirective(directive)){
                    compileUtil.eventHandle(node, self.$vm, expression, directive)
                }else{
                    compileUtil[directive] && compileUtil[directive](node, self.$vm, expression)
                }
            }
        })
    }
    compileText(node, exp){
        compileUtil.text(node, this.$vm, exp)
    }
    isDirective(attr){
        return /^v-.*/.test(attr)
    }
    isEventDirective(attr){
        return /^on.*/.test(attr)
    }
}

export { Compiler }