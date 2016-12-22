let uid = 0

class Dep {
    constructor(){
        this.uid = uid++
        this.subs = []
    }

}

export { Dep }