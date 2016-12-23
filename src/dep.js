let uid = 0

class Dep {
    constructor(){
        this.uid = uid++
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
        sub.addDep()
    }

}

Dep.target = null

export { Dep }