import {observe} from './observe.js'

class Toy {
    constructor(options) {
        let vm = this

        vm.$options = options
        vm._data = options.data

        Object.keys(vm._data).forEach(key => {
            vm._proxy(key)
        })

        ovserve(this._data)

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
}

export default Toy