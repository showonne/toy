(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Toy = factory());
}(this, (function () { 'use strict';

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

var Observer = function () {
    function Observer() {
        classCallCheck(this, Observer);
    }

    createClass(Observer, [{
        key: 'constrctor',
        value: function constrctor(data) {
            this.data = data;
            this.track(data);
        }
    }, {
        key: 'track',
        value: function track(data) {
            var that = this;
            Object.keys(data).forEach(function (key) {
                that.defineReactive(that.value, key, data[key]);
            });
        }
    }, {
        key: 'defineReactive',
        value: function defineReactive(target, key, value) {

            ovserve(value);

            Object.defineProperty(target, key, {
                configurable: false,
                enumerable: true,
                get: function get() {
                    return value;
                },
                set: function set(newVal) {
                    value = newVal;
                }
            });
        }
    }]);
    return Observer;
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

        ovserve(this._data);

        new Compiler(vm.$options.el, vm);
    }

    createClass(Toy, [{
        key: '_proxy',
        value: function _proxy(key) {
            var vm = this;
            Object.defineProperty(vm, key, {
                get: function get() {
                    return vm._data[key];
                },
                set: function set(newVal) {
                    vm._data[key] = newVal;
                }
            });
        }
    }]);
    return Toy;
}();

return Toy;

})));
