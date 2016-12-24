import { Dep } from './dep.js'

const observe = data => {
    if(!data || typeof data !== 'object') return
    new Observer(data)
}

class Observer {
    constructor(data){
        this.walk(data)
    }
    walk(data){
        let self = this
        Object.keys(data).forEach(key => {
            self.defineReactive(data, key, data[key])
        })
    }
    defineReactive(target, key, value){
        let dep = new Dep()
        
        observe(value)

        Object.defineProperty(target, key, {
            configurable: false,
            enumerable: true,
            get(){
                if(Dep.target){
                    Dep.target.addDep(dep)
                }
                return value
            },
            set(newValue){
                if(newValue === value) return
                value = newValue
                observe(newValue)
                dep.notify()
            }
        })
    }
}

export { observe }