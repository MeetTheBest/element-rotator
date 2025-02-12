var O = Object.defineProperty;
var N = (n, t, e) => t in n ? O(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var f = (n, t, e) => (N(n, typeof t != "symbol" ? t + "" : t, e), e);
function j(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var m = { exports: {} }, d = typeof Reflect == "object" ? Reflect : null, g = d && typeof d.apply == "function" ? d.apply : function(t, e, r) {
  return Function.prototype.apply.call(t, e, r);
}, p;
d && typeof d.ownKeys == "function" ? p = d.ownKeys : Object.getOwnPropertySymbols ? p = function(t) {
  return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t));
} : p = function(t) {
  return Object.getOwnPropertyNames(t);
};
function A(n) {
  console && console.warn && console.warn(n);
}
var w = Number.isNaN || function(t) {
  return t !== t;
};
function a() {
  a.init.call(this);
}
m.exports = a;
m.exports.once = F;
a.EventEmitter = a;
a.prototype._events = void 0;
a.prototype._eventsCount = 0;
a.prototype._maxListeners = void 0;
var y = 10;
function v(n) {
  if (typeof n != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof n);
}
Object.defineProperty(a, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return y;
  },
  set: function(n) {
    if (typeof n != "number" || n < 0 || w(n))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + n + ".");
    y = n;
  }
});
a.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
a.prototype.setMaxListeners = function(t) {
  if (typeof t != "number" || t < 0 || w(t))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
  return this._maxListeners = t, this;
};
function x(n) {
  return n._maxListeners === void 0 ? a.defaultMaxListeners : n._maxListeners;
}
a.prototype.getMaxListeners = function() {
  return x(this);
};
a.prototype.emit = function(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e.push(arguments[r]);
  var o = t === "error", i = this._events;
  if (i !== void 0)
    o = o && i.error === void 0;
  else if (!o)
    return !1;
  if (o) {
    var s;
    if (e.length > 0 && (s = e[0]), s instanceof Error)
      throw s;
    var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
    throw u.context = s, u;
  }
  var c = i[t];
  if (c === void 0)
    return !1;
  if (typeof c == "function")
    g(c, this, e);
  else
    for (var h = c.length, l = P(c, h), r = 0; r < h; ++r)
      g(l[r], this, e);
  return !0;
};
function _(n, t, e, r) {
  var o, i, s;
  if (v(e), i = n._events, i === void 0 ? (i = n._events = /* @__PURE__ */ Object.create(null), n._eventsCount = 0) : (i.newListener !== void 0 && (n.emit(
    "newListener",
    t,
    e.listener ? e.listener : e
  ), i = n._events), s = i[t]), s === void 0)
    s = i[t] = e, ++n._eventsCount;
  else if (typeof s == "function" ? s = i[t] = r ? [e, s] : [s, e] : r ? s.unshift(e) : s.push(e), o = x(n), o > 0 && s.length > o && !s.warned) {
    s.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = n, u.type = t, u.count = s.length, A(u);
  }
  return n;
}
a.prototype.addListener = function(t, e) {
  return _(this, t, e, !1);
};
a.prototype.on = a.prototype.addListener;
a.prototype.prependListener = function(t, e) {
  return _(this, t, e, !0);
};
function T() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function E(n, t, e) {
  var r = { fired: !1, wrapFn: void 0, target: n, type: t, listener: e }, o = T.bind(r);
  return o.listener = e, r.wrapFn = o, o;
}
a.prototype.once = function(t, e) {
  return v(e), this.on(t, E(this, t, e)), this;
};
a.prototype.prependOnceListener = function(t, e) {
  return v(e), this.prependListener(t, E(this, t, e)), this;
};
a.prototype.removeListener = function(t, e) {
  var r, o, i, s, u;
  if (v(e), o = this._events, o === void 0)
    return this;
  if (r = o[t], r === void 0)
    return this;
  if (r === e || r.listener === e)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete o[t], o.removeListener && this.emit("removeListener", t, r.listener || e));
  else if (typeof r != "function") {
    for (i = -1, s = r.length - 1; s >= 0; s--)
      if (r[s] === e || r[s].listener === e) {
        u = r[s].listener, i = s;
        break;
      }
    if (i < 0)
      return this;
    i === 0 ? r.shift() : S(r, i), r.length === 1 && (o[t] = r[0]), o.removeListener !== void 0 && this.emit("removeListener", t, u || e);
  }
  return this;
};
a.prototype.off = a.prototype.removeListener;
a.prototype.removeAllListeners = function(t) {
  var e, r, o;
  if (r = this._events, r === void 0)
    return this;
  if (r.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : r[t] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete r[t]), this;
  if (arguments.length === 0) {
    var i = Object.keys(r), s;
    for (o = 0; o < i.length; ++o)
      s = i[o], s !== "removeListener" && this.removeAllListeners(s);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (e = r[t], typeof e == "function")
    this.removeListener(t, e);
  else if (e !== void 0)
    for (o = e.length - 1; o >= 0; o--)
      this.removeListener(t, e[o]);
  return this;
};
function b(n, t, e) {
  var r = n._events;
  if (r === void 0)
    return [];
  var o = r[t];
  return o === void 0 ? [] : typeof o == "function" ? e ? [o.listener || o] : [o] : e ? I(o) : P(o, o.length);
}
a.prototype.listeners = function(t) {
  return b(this, t, !0);
};
a.prototype.rawListeners = function(t) {
  return b(this, t, !1);
};
a.listenerCount = function(n, t) {
  return typeof n.listenerCount == "function" ? n.listenerCount(t) : M.call(n, t);
};
a.prototype.listenerCount = M;
function M(n) {
  var t = this._events;
  if (t !== void 0) {
    var e = t[n];
    if (typeof e == "function")
      return 1;
    if (e !== void 0)
      return e.length;
  }
  return 0;
}
a.prototype.eventNames = function() {
  return this._eventsCount > 0 ? p(this._events) : [];
};
function P(n, t) {
  for (var e = new Array(t), r = 0; r < t; ++r)
    e[r] = n[r];
  return e;
}
function S(n, t) {
  for (; t + 1 < n.length; t++)
    n[t] = n[t + 1];
  n.pop();
}
function I(n) {
  for (var t = new Array(n.length), e = 0; e < t.length; ++e)
    t[e] = n[e].listener || n[e];
  return t;
}
function F(n, t) {
  return new Promise(function(e, r) {
    function o(s) {
      n.removeListener(t, i), r(s);
    }
    function i() {
      typeof n.removeListener == "function" && n.removeListener("error", o), e([].slice.call(arguments));
    }
    R(n, t, i, { once: !0 }), t !== "error" && $(n, o, { once: !0 });
  });
}
function $(n, t, e) {
  typeof n.on == "function" && R(n, "error", t, e);
}
function R(n, t, e, r) {
  if (typeof n.on == "function")
    r.once ? n.once(t, e) : n.on(t, e);
  else if (typeof n.addEventListener == "function")
    n.addEventListener(t, function o(i) {
      r.once && n.removeEventListener(t, o), e(i);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof n);
}
var D = m.exports;
const K = /* @__PURE__ */ j(D), U = () => `ID_${Math.floor(Math.random() * 100)}`, W = (n, t = 2) => Number.isNaN(+n) ? n : +(+n).toFixed(t), L = "-26px";
class q extends K {
  constructor(e, r = {}) {
    super();
    f(this, "centerPos", { x: 0, y: 0 });
    f(this, "startPos", { x: 0, y: 0 });
    f(this, "originRotate", 0);
    f(this, "target", null);
    f(this, "container");
    f(this, "options");
    f(this, "targetClassName", U());
    /**
     * 鼠标按下
     * @param event
     */
    f(this, "onMouseDown", (e) => {
      e.stopPropagation(), this.originRotate = 0, this.startPos = { x: e.x, y: e.y }, this.calcCenterPos();
      const r = this.container.style.transform, o = /rotate\((.*)deg\)/g;
      r.replace(
        o,
        (s, u) => (u = +u, this.originRotate += u)
      ), this.originRotate = (+this.originRotate || 0) % 360;
      const i = {
        event: e,
        target: this.container,
        rotate: this.originRotate
      };
      this.emit("rotateStart", i), document.addEventListener("mousemove", this.onMouseMove, !1);
    });
    /**
     * 鼠标移动
     * @param event
     */
    f(this, "onMouseMove", (e) => {
      const r = this.container.style.transform || "rotate(0deg)", o = W(
        (this.calcRotate(this.startPos, e) + this.originRotate) % 360
      ), i = /rotate\(.*deg\)/g, s = r.replace(
        i,
        () => `rotate(${o}deg)`
      );
      this.container.style.transform = s;
      const u = { event: e, target: this.container, rotate: o };
      this.emit("rotate", u);
    });
    /**
     * 鼠标抬起
     */
    f(this, "onMouseUp", (e) => {
      const r = { event: e, target: this.container };
      this.emit("rotateEnd", r), document.removeEventListener("mousemove", this.onMouseMove);
    });
    if (!e)
      throw new Error("not found container");
    this.container = e, this.options = r, this.originRotate = (this.options.rotate || 0) % 360, this.createTargetElement(), this.setInitStyle(), this.calcCenterPos(), this.registryEvents();
  }
  createTargetElement() {
    var l;
    const { top: e = L, able: r } = this.options;
    let o = `${e}`.replace("px", "").trim();
    o.indexOf("%") === -1 && (o = Number.isNaN(+o) ? L : `${o}px`);
    const i = `
        position: absolute;
        top: ${o};
        left: 50%;
        min-width: 14px;
        min-height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
      `, s = `
      <div class="${this.targetClassName}" style="${i}">
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
              fill="#eb5648"
              fillRule="nonzero"
            />
          </svg>
      </div>`, c = new DOMParser().parseFromString(s, "text/html"), h = c.body.firstChild;
    if (r instanceof Element) {
      const C = c.body.querySelector("svg");
      h.replaceChild(r, C);
    }
    (l = this.container) == null || l.appendChild(h), this.target = document.querySelector(`.${this.targetClassName}`);
  }
  setInitStyle() {
    var r;
    if (((r = this.container) == null ? void 0 : r.style.getPropertyValue("position")) || (this.container.style.position = "relative"), this.originRotate) {
      const o = window.getComputedStyle(this.container, null);
      let i = this.container.style.transform || o.getPropertyValue("transform");
      i = i.replace(/rotate\((.*)deg\)/g, "").trim(), i = i === "none" ? "" : i, this.container.style.transform = `${i} rotate(${this.originRotate}deg)`;
    }
  }
  calcCenterPos() {
    const { x: e, y: r, width: o, height: i } = this.container.getBoundingClientRect(), s = e + o / 2, u = r + i / 2;
    this.setCenterPos({ x: s, y: u });
  }
  setCenterPos(e) {
    this.centerPos.x = e.x, this.centerPos.y = e.y;
  }
  destroy() {
    this.target = null, this.container = null, this.destroyEvents();
  }
  registryEvents() {
    this.target.addEventListener("mousedown", this.onMouseDown, !1), document.addEventListener("mouseup", this.onMouseUp);
  }
  destroyEvents() {
    return document.removeEventListener("mousedown", this.onMouseDown, !1), this;
  }
  /**
   * 计算旋转角度
   * @param initialPoint - 开始点位
   * @param finalPoint - 结束点位
   * @returns
   */
  calcRotate(e, r) {
    const { x: o, y: i } = this.centerPos, s = {
      x: e.x - o,
      y: e.y - i
    }, u = {
      x: r.x - o,
      y: r.y - i
    }, c = s.x * u.x + s.y * u.y, h = s.x * u.y - s.y * u.x;
    let l = Math.atan2(h, c);
    return l = (l + 2 * Math.PI) % (2 * Math.PI), l * (180 / Math.PI);
  }
}
export {
  q as default
};
