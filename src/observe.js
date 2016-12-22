import { Dep } from './dep.js'

const observe = data => {
    if(!data || typeof data !== 'object') return
    new Observer(data)
}

class Observer {
    constructor(data) {
        this.data = data
        this.track(data)
    }
    track(data) {
        let that = this
        Object.keys(data).forEach(key => {
            that.defineReactive(that.value, key, data[key])
        })
    }
    defineReactive(target, key, value) {
        let dep = new Dep()
        
        observe(value)

        Object.defineProperty(target, key, {
            configurable: false,
            enumerable: true,
            get() {
                return value
            },
            set(newVal) {
                value = newVal
            }
        })
    }
}




export { observe }