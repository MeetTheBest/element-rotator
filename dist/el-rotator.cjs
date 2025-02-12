"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var events = { exports: {} };
var R = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === "function") {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn)
    console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once2;
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++)
    args.push(arguments[i]);
  var doError = type === "error";
  var events2 = this._events;
  if (events2 !== void 0)
    doError = doError && events2.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  var handler = events2[type];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners2[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events2;
  var existing;
  checkListener(listener);
  events2 = target._events;
  if (events2 === void 0) {
    events2 = target._events = /* @__PURE__ */ Object.create(null);
    target._eventsCount = 0;
  } else {
    if (events2.newListener !== void 0) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );
      events2 = target._events;
    }
    existing = events2[type];
  }
  if (existing === void 0) {
    existing = events2[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      w.name = "MaxListenersExceededWarning";
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: void 0, target, type, listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events2, position, i, originalListener;
  checkListener(listener);
  events2 = this._events;
  if (events2 === void 0)
    return this;
  list = events2[type];
  if (list === void 0)
    return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = /* @__PURE__ */ Object.create(null);
    else {
      delete events2[type];
      if (events2.removeListener)
        this.emit("removeListener", type, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0)
      return this;
    if (position === 0)
      list.shift();
    else {
      spliceOne(list, position);
    }
    if (list.length === 1)
      events2[type] = list[0];
    if (events2.removeListener !== void 0)
      this.emit("removeListener", type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners2, events2, i;
  events2 = this._events;
  if (events2 === void 0)
    return this;
  if (events2.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    } else if (events2[type] !== void 0) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else
        delete events2[type];
    }
    return this;
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events2);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === "removeListener")
        continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners2 = events2[type];
  if (typeof listeners2 === "function") {
    this.removeListener(type, listeners2);
  } else if (listeners2 !== void 0) {
    for (i = listeners2.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners2[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events2 = target._events;
  if (events2 === void 0)
    return [];
  var evlistener = events2[type];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events2 = this._events;
  if (events2 !== void 0) {
    var evlistener = events2[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener !== void 0) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once2(emitter, name) {
  return new Promise(function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === "function") {
        emitter.removeListener("error", errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== "error") {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === "function") {
    eventTargetAgnosticAddListener(emitter, "error", handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === "function") {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === "function") {
    emitter.addEventListener(name, function wrapListener(arg) {
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
var eventsExports = events.exports;
const Event = /* @__PURE__ */ getDefaultExportFromCjs(eventsExports);
const uid = () => {
  return `ID_${Math.floor(Math.random() * 100)}`;
};
const toPrecision = (v, precision = 2) => {
  if (Number.isNaN(+v))
    return v;
  return +(+v).toFixed(precision);
};
const DEFAULT_TOP = "-26px";
class ElementRotator extends Event {
  constructor(container, options = {}) {
    super();
    __publicField(this, "centerPos", { x: 0, y: 0 });
    __publicField(this, "startPos", { x: 0, y: 0 });
    __publicField(this, "originRotate", 0);
    __publicField(this, "target", null);
    __publicField(this, "container");
    __publicField(this, "options");
    __publicField(this, "targetClassName", uid());
    /**
     * 鼠标按下
     * @param event
     */
    __publicField(this, "onMouseDown", (event) => {
      event.stopPropagation();
      this.originRotate = 0;
      this.startPos = { x: event.x, y: event.y };
      this.calcCenterPos();
      const originTransform = this.container.style.transform;
      const regexp = /rotate\((.*)deg\)/g;
      originTransform.replace(
        regexp,
        (_, $1) => ($1 = +$1, this.originRotate += $1)
      );
      this.originRotate = (+this.originRotate || 0) % 360;
      const _event = {
        event,
        target: this.container,
        rotate: this.originRotate
      };
      this.emit("rotateStart", _event);
      document.addEventListener("mousemove", this.onMouseMove, false);
    });
    /**
     * 鼠标移动
     * @param event
     */
    __publicField(this, "onMouseMove", (event) => {
      const originTransform = this.container.style.transform || "rotate(0deg)";
      const rotate = toPrecision(
        (this.calcRotate(this.startPos, event) + this.originRotate) % 360
      );
      const regexp = /rotate\(.*deg\)/g;
      const transformRotate = originTransform.replace(
        regexp,
        () => `rotate(${rotate}deg)`
      );
      this.container.style.transform = transformRotate;
      const _event = { event, target: this.container, rotate };
      this.emit("rotate", _event);
    });
    /**
     * 鼠标抬起
     */
    __publicField(this, "onMouseUp", (event) => {
      const _event = { event, target: this.container };
      this.emit("rotateEnd", _event);
      document.removeEventListener("mousemove", this.onMouseMove);
    });
    if (!container) {
      throw new Error("not found container");
    }
    this.container = container;
    this.options = options;
    this.originRotate = (this.options.rotate || 0) % 360;
    this.createTargetElement();
    this.setInitStyle();
    this.calcCenterPos();
    this.registryEvents();
  }
  createTargetElement() {
    var _a;
    const { top = DEFAULT_TOP, able } = this.options;
    let _top = `${top}`.replace("px", "").trim();
    if (_top.indexOf("%") === -1) {
      _top = Number.isNaN(+_top) ? DEFAULT_TOP : `${_top}px`;
    }
    const targetStyle = `
        position: absolute;
        top: ${_top};
        left: 50%;
        min-width: 14px;
        min-height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
      `;
    const targetElement = `
      <div class="${this.targetClassName}" style="${targetStyle}">
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
              fill="#eb5648"
              fillRule="nonzero"
            />
          </svg>
      </div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(targetElement, "text/html");
    const node = doc.body.firstChild;
    if (able instanceof Element) {
      const originAble = doc.body.querySelector("svg");
      node.replaceChild(able, originAble);
    }
    (_a = this.container) == null ? void 0 : _a.appendChild(node);
    this.target = document.querySelector(`.${this.targetClassName}`);
  }
  setInitStyle() {
    var _a;
    const position = (_a = this.container) == null ? void 0 : _a.style.getPropertyValue("position");
    if (!position) {
      this.container.style.position = "relative";
    }
    if (this.originRotate) {
      const containerStyle = window.getComputedStyle(this.container, null);
      let originTransform = this.container.style.transform || containerStyle.getPropertyValue("transform");
      originTransform = originTransform.replace(/rotate\((.*)deg\)/g, "").trim();
      originTransform = originTransform === "none" ? "" : originTransform;
      this.container.style.transform = `${originTransform} rotate(${this.originRotate}deg)`;
    }
  }
  calcCenterPos() {
    const { x, y, width, height } = this.container.getBoundingClientRect();
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    this.setCenterPos({ x: centerX, y: centerY });
  }
  setCenterPos(pos) {
    this.centerPos.x = pos.x;
    this.centerPos.y = pos.y;
  }
  destroy() {
    this.target = null;
    this.container = null;
    this.destroyEvents();
  }
  registryEvents() {
    this.target.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  destroyEvents() {
    document.removeEventListener("mousedown", this.onMouseDown, false);
    return this;
  }
  /**
   * 计算旋转角度
   * @param initialPoint - 开始点位
   * @param finalPoint - 结束点位
   * @returns
   */
  calcRotate(initialPoint, finalPoint) {
    const { x: centerX, y: centerY } = this.centerPos;
    const vector1 = {
      x: initialPoint.x - centerX,
      y: initialPoint.y - centerY
    };
    const vector2 = {
      x: finalPoint.x - centerX,
      y: finalPoint.y - centerY
    };
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
    let angle = Math.atan2(crossProduct, dotProduct);
    angle = (angle + 2 * Math.PI) % (2 * Math.PI);
    return angle * (180 / Math.PI);
  }
}
module.exports = ElementRotator;
