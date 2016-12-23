import { observe } from './observer.js'
import { Compiler } from './compiler.js'
import { Watcher } from './watcher.js'

class Toy {
    constructor(options) {
        let vm = this

        vm.$options = options
        vm._data = options.data

        Object.keys(vm._data).forEach(key => {
            vm._proxy(key)
        })

        observe(this._data)

        new Compiler(vm.$options.el, vm)
    }
    _proxy(key) {
        let vm = this
        Object.defineProperty(vm, key, {
            get() {
                return vm._data[key]
            },
            set(newVal) {
                vm._data[key] = newVal
            }
        })
    }
    $watch(exp, cb) {
        new Watcher(this, exp, cb)
    }
}

export default Toy