var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var uid = 0;

var Dep = function () {
    function Dep() {
        classCallCheck(this, Dep);

        this.uid = uid++;
        this.subs = [];
    }

    createClass(Dep, [{
        key: "addSub",
        value: function addSub(sub) {
            this.subs.push(sub);
        }
    }, {
        key: "notify",
        value: function notify() {
            this.subs.forEach(function (sub) {
                sub.update();
            });
        }
    }]);
    return Dep;
}();

Dep.target = null;

var observe = function observe(data) {
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return;
    new Observer(data);
};

var Observer = function () {
    function Observer(data) {
        classCallCheck(this, Observer);

        this.data = data;
        this.track(data);
    }

    createClass(Observer, [{
        key: 'track',
        value: function track(data) {
            var that = this;
            Object.keys(data).forEach(function (key) {
                that.defineReactive(that.data, key, data[key]);
            });
        }
    }, {
        key: 'defineReactive',
        value: function defineReactive(target, key, value) {
            var dep = new Dep();

            observe(value);

            Object.defineProperty(target, key, {
                configurable: false,
                enumerable: true,
                get: function get() {
                    if (Dep.target) {
                        Dep.target.addDep(dep);
                    }
                    return value;
                },
                set: function set(newValue) {
                    if (newValue === value) return;
                    value = newValue;
                    observe(newValue);
                    dep.notify();
                }
            });
        }
    }]);
    return Observer;
}();

var Watcher = function () {
    function Watcher(vm, exp, cb) {
        classCallCheck(this, Watcher);

        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.deps = {};
        this.value = this.get();
    }

    createClass(Watcher, [{
        key: 'get',
        value: function get() {
            Dep.target = this;
            var value = this.getVmValue();
            Dep.target = null;
            return value;
        }
    }, {
        key: 'update',
        value: function update() {
            var oldValue = this.value,
                value = this.get();
            if (oldValue === value) return;
            this.cb.call(this.vm, value, oldValue);
        }
    }, {
        key: 'addDep',
        value: function addDep(dep) {
            if (!this.deps.hasOwnProperty(dep.uid)) {
                dep.addSub(this);
                this.deps[dep.uid] = dep;
            }
        }
    }, {
        key: 'getVmValue',
        value: function getVmValue() {
            var keyPath = this.exp.split('.');
            var val = this.vm._data;

            keyPath.forEach(function (key) {
                val = val[key];
            });

            return val;
        }
    }]);
    return Watcher;
}();

var mustacheReg = /\{\{(.*)\}\}/;

var updater = {
    text: function text(node, value) {
        node.textContent = value === undefined ? '' : value;
    },
    html: function html(node, value) {
        node.innerHTML = value === undefined ? '' : value;
    },
    model: function model(node, value) {
        node.value = value === undefined ? '' : value;
    }
};

var compileUtil = {
    bind: function bind(node, vm, exp, directive) {
        var updateFn = updater[directive];

        //initial compile
        updateFn && updateFn(node, this._getVmVal(vm, exp));

        new Watcher(vm, exp, function (value, oldValue) {
            updateFn && updateFn(node, value, oldValue);
        });
    },
    text: function text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    html: function html(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    model: function model(node, vm, exp) {
        this.bind(node, vm, exp, 'model');
        var self = this;
        //initial value
        var value = this._getVmVal(vm, exp);

        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (newValue === value) return;
            self._setVmVal(vm, exp, newValue);
            //update old value
            value = newValue;
        });
    },
    eventHandle: function eventHandle(node, vm, exp, directive) {
        var eventType = directive.split(':')[1];
        var fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    _getVmVal: function _getVmVal(vm, exp) {
        var keyPath = exp.split('.');
        var val = vm._data;
        keyPath.forEach(function (key) {
            val = val[key];
        });
        return val;
    },
    _setVmVal: function _setVmVal(vm, exp, value) {
        var keyPath = exp.split('.');
        var val = vm._data;
        keyPath.forEach(function (key, index) {
            if (index < keyPath.length - 1) {
                val = val[key];
            }
            val[key] = value;
        });
    }
};

var Compiler = function () {
    function Compiler(el, vm) {
        classCallCheck(this, Compiler);

        this.$vm = vm;
        var _el = this.isElement(el) ? el : document.querySelector(el);
        if (_el) {
            var _fragment = this.node2Fragment(_el);
            this.compileElement(_fragment);
            _el.appendChild(_fragment);
        }
    }

    createClass(Compiler, [{
        key: 'isElement',
        value: function isElement(node) {
            return node.nodeType === 1;
        }
    }, {
        key: 'isTextNode',
        value: function isTextNode(node) {
            return node.nodeType === 3;
        }
    }, {
        key: 'node2Fragment',
        value: function node2Fragment(el) {
            var fragment = document.createDocumentFragment();
            var child = void 0;
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }
            return fragment;
        }
    }, {
        key: 'compileElement',
        value: function compileElement(el) {
            var self = this;
            var childNodes = el.childNodes;

            Array.prototype.slice.call(childNodes).forEach(function (node) {
                var text = node.textContent;
                if (self.isElement(node)) {
                    self.compile(node);
                } else if (self.isTextNode && mustacheReg.test(text)) {
                    self.compileText(node, RegExp.$1);
                }
                if (node.childNodes && node.childNodes.length) {
                    self.compileElement(node);
                }
            });
        }
    }, {
        key: 'compile',
        value: function compile(node) {
            var self = this;
            var nodeAttrs = node.attributes;
            Array.prototype.slice.call(nodeAttrs).forEach(function (attr) {
                if (self.isDirective(attr.name)) {
                    var exp = attr.value;
                    var directive = attr.name.substring(2);
                    if (self.isEventDirective(directive)) {
                        compileUtil.eventHandle(node, self.$vm, exp, directive);
                    } else {
                        compileUtil[directive] && compileUtil[directive](node, self.$vm, exp);
                    }
                }
            });
        }
    }, {
        key: 'compileText',
        value: function compileText(node, exp) {
            compileUtil.text(node, this.$vm, exp);
        }
    }, {
        key: 'isDirective',
        value: function isDirective(attr) {
            return (/^v-.*/.test(attr)
            );
        }
    }, {
        key: 'isEventDirective',
        value: function isEventDirective(attr) {
            return (/^on.*/.test(attr)
            );
        }
    }]);
    return Compiler;
}();

var Toy = function () {
    function Toy(options) {
        classCallCheck(this, Toy);

        var vm = this;

        vm.$options = options;
        vm._data = options.data;

        Object.keys(vm._data).forEach(function (key) {
            vm._proxy(key);
        });

        observe(vm._data);

        new Compiler(vm.$options.el, vm);
    }

    createClass(Toy, [{
        key: '_proxy',
        value: function _proxy(key) {
            var vm = this;
            Object.defineProperty(vm, key, {
                configurable: false,
                enumerable: true,
                get: function get() {
                    return vm._data[key];
                },
                set: function set(newVal) {
                    vm._data[key] = newVal;
                }
            });
        }
    }, {
        key: '$watch',
        value: function $watch(exp, cb) {
            new Watcher(this, exp, cb);
        }
    }]);
    return Toy;
}();

export default Toy;
