let uid = 0

class Dep {
    constructor(){
        this.uid = uid++
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    notify(){
        this.subs.forEach(sub => {
            sub.update()
        })
    }

}

Dep.target = null

export { Dep }