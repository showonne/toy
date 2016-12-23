import { Dep } from './dep.js'

class Watcher {
    constructor(vm, exp, cb){
        this.vm = vm
        this.exp = exp
        this.cb = cb
        this.deps = {}
        this.value = this.get()
    }
    get(){
        Dep.target = this
        let value = this.getVmValue()
        Dep.target = null
        return value
    }
    update(){
        let oldValue = this.value,
            value = this.get()
        if(oldValue === value) return
        this.cb.call(this.vm, value, oldValue)
    }
    addDep(dep){
        if(!this.deps.hasOwnProperty(dep.uid)){
            dep.addSub(this)
            this.deps[dep.uid] = dep
        }
    }
    getVmValue(){
        let keyPath = this.exp.split('.')
        let val = this.vm._data

        keyPath.forEach(key => {
            val = val[key]
        })

        return val
    }
}

export { Watcher }