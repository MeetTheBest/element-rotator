var O = Object.defineProperty;
var N = (t, n, e) => n in t ? O(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var f = (t, n, e) => (N(t, typeof n != "symbol" ? n + "" : n, e), e);
function j(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var m = { exports: {} }, d = typeof Reflect == "object" ? Reflect : null, g = d && typeof d.apply == "function" ? d.apply : function(n, e, r) {
  return Function.prototype.apply.call(n, e, r);
}, v;
d && typeof d.ownKeys == "function" ? v = d.ownKeys : Object.getOwnPropertySymbols ? v = function(n) {
  return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n));
} : v = function(n) {
  return Object.getOwnPropertyNames(n);
};
function A(t) {
  console && console.warn && console.warn(t);
}
var E = Number.isNaN || function(n) {
  return n !== n;
};
function u() {
  u.init.call(this);
}
m.exports = u;
m.exports.once = U;
u.EventEmitter = u;
u.prototype._events = void 0;
u.prototype._eventsCount = 0;
u.prototype._maxListeners = void 0;
var y = 10;
function p(t) {
  if (typeof t != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
}
Object.defineProperty(u, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return y;
  },
  set: function(t) {
    if (typeof t != "number" || t < 0 || E(t))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
    y = t;
  }
});
u.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
u.prototype.setMaxListeners = function(n) {
  if (typeof n != "number" || n < 0 || E(n))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  return this._maxListeners = n, this;
};
function w(t) {
  return t._maxListeners === void 0 ? u.defaultMaxListeners : t._maxListeners;
}
u.prototype.getMaxListeners = function() {
  return w(this);
};
u.prototype.emit = function(n) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e.push(arguments[r]);
  var o = n === "error", i = this._events;
  if (i !== void 0)
    o = o && i.error === void 0;
  else if (!o)
    return !1;
  if (o) {
    var s;
    if (e.length > 0 && (s = e[0]), s instanceof Error)
      throw s;
    var a = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
    throw a.context = s, a;
  }
  var c = i[n];
  if (c === void 0)
    return !1;
  if (typeof c == "function")
    g(c, this, e);
  else
    for (var h = c.length, l = P(c, h), r = 0; r < h; ++r)
      g(l[r], this, e);
  return !0;
};
function M(t, n, e, r) {
  var o, i, s;
  if (p(e), i = t._events, i === void 0 ? (i = t._events = /* @__PURE__ */ Object.create(null), t._eventsCount = 0) : (i.newListener !== void 0 && (t.emit(
    "newListener",
    n,
    e.listener ? e.listener : e
  ), i = t._events), s = i[n]), s === void 0)
    s = i[n] = e, ++t._eventsCount;
  else if (typeof s == "function" ? s = i[n] = r ? [e, s] : [s, e] : r ? s.unshift(e) : s.push(e), o = w(t), o > 0 && s.length > o && !s.warned) {
    s.warned = !0;
    var a = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(n) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    a.name = "MaxListenersExceededWarning", a.emitter = t, a.type = n, a.count = s.length, A(a);
  }
  return t;
}
u.prototype.addListener = function(n, e) {
  return M(this, n, e, !1);
};
u.prototype.on = u.prototype.addListener;
u.prototype.prependListener = function(n, e) {
  return M(this, n, e, !0);
};
function T() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function x(t, n, e) {
  var r = { fired: !1, wrapFn: void 0, target: t, type: n, listener: e }, o = T.bind(r);
  return o.listener = e, r.wrapFn = o, o;
}
u.prototype.once = function(n, e) {
  return p(e), this.on(n, x(this, n, e)), this;
};
u.prototype.prependOnceListener = function(n, e) {
  return p(e), this.prependListener(n, x(this, n, e)), this;
};
u.prototype.removeListener = function(n, e) {
  var r, o, i, s, a;
  if (p(e), o = this._events, o === void 0)
    return this;
  if (r = o[n], r === void 0)
    return this;
  if (r === e || r.listener === e)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete o[n], o.removeListener && this.emit("removeListener", n, r.listener || e));
  else if (typeof r != "function") {
    for (i = -1, s = r.length - 1; s >= 0; s--)
      if (r[s] === e || r[s].listener === e) {
        a = r[s].listener, i = s;
        break;
      }
    if (i < 0)
      return this;
    i === 0 ? r.shift() : S(r, i), r.length === 1 && (o[n] = r[0]), o.removeListener !== void 0 && this.emit("removeListener", n, a || e);
  }
  return this;
};
u.prototype.off = u.prototype.removeListener;
u.prototype.removeAllListeners = function(n) {
  var e, r, o;
  if (r = this._events, r === void 0)
    return this;
  if (r.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : r[n] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete r[n]), this;
  if (arguments.length === 0) {
    var i = Object.keys(r), s;
    for (o = 0; o < i.length; ++o)
      s = i[o], s !== "removeListener" && this.removeAllListeners(s);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (e = r[n], typeof e == "function")
    this.removeListener(n, e);
  else if (e !== void 0)
    for (o = e.length - 1; o >= 0; o--)
      this.removeListener(n, e[o]);
  return this;
};
function b(t, n, e) {
  var r = t._events;
  if (r === void 0)
    return [];
  var o = r[n];
  return o === void 0 ? [] : typeof o == "function" ? e ? [o.listener || o] : [o] : e ? I(o) : P(o, o.length);
}
u.prototype.listeners = function(n) {
  return b(this, n, !0);
};
u.prototype.rawListeners = function(n) {
  return b(this, n, !1);
};
u.listenerCount = function(t, n) {
  return typeof t.listenerCount == "function" ? t.listenerCount(n) : _.call(t, n);
};
u.prototype.listenerCount = _;
function _(t) {
  var n = this._events;
  if (n !== void 0) {
    var e = n[t];
    if (typeof e == "function")
      return 1;
    if (e !== void 0)
      return e.length;
  }
  return 0;
}
u.prototype.eventNames = function() {
  return this._eventsCount > 0 ? v(this._events) : [];
};
function P(t, n) {
  for (var e = new Array(n), r = 0; r < n; ++r)
    e[r] = t[r];
  return e;
}
function S(t, n) {
  for (; n + 1 < t.length; n++)
    t[n] = t[n + 1];
  t.pop();
}
function I(t) {
  for (var n = new Array(t.length), e = 0; e < n.length; ++e)
    n[e] = t[e].listener || t[e];
  return n;
}
function U(t, n) {
  return new Promise(function(e, r) {
    function o(s) {
      t.removeListener(n, i), r(s);
    }
    function i() {
      typeof t.removeListener == "function" && t.removeListener("error", o), e([].slice.call(arguments));
    }
    C(t, n, i, { once: !0 }), n !== "error" && F(t, o, { once: !0 });
  });
}
function F(t, n, e) {
  typeof t.on == "function" && C(t, "error", n, e);
}
function C(t, n, e, r) {
  if (typeof t.on == "function")
    r.once ? t.once(n, e) : t.on(n, e);
  else if (typeof t.addEventListener == "function")
    t.addEventListener(n, function o(i) {
      r.once && t.removeEventListener(n, o), e(i);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
}
var $ = m.exports;
const D = /* @__PURE__ */ j($), K = (t = "uid") => `${t}_${Math.random().toString(16).substring(2)}`, k = (t, n = 2) => Number.isNaN(+t) ? t : +(+t).toFixed(n), L = "-26px";
class V extends D {
  constructor(e, r = {}) {
    super();
    f(this, "centerPos", { x: 0, y: 0 });
    f(this, "startPos", { x: 0, y: 0 });
    f(this, "originRotate", 0);
    f(this, "target", null);
    f(this, "container");
    f(this, "options");
    f(this, "targetClassName", K());
    f(this, "isMobile", typeof window.orientation < "u" || "ontouchstart" in document.documentElement || /Mobi|Android|iPhone/i.test(navigator.userAgent));
    /**
     * 鼠标按下
     * @param event
     */
    f(this, "onMouseDown", (e) => {
      e.stopPropagation(), this.originRotate = 0, this.startPos = this.getClickPos(e), this.calcCenterPos();
      const r = this.container.style.transform, o = /rotate\((.*)deg\)/g;
      r.replace(
        o,
        (s, a) => (a = +a, this.originRotate += a)
      ), this.originRotate = (+this.originRotate || 0) % 360;
      const i = {
        event: e,
        target: this.container,
        rotate: this.originRotate
      };
      this.emit("rotateStart", i), this.isMobile ? (document.addEventListener("touchmove", this.onMouseMove, !1), document.addEventListener("touchend", this.onMouseUp, !1)) : (document.addEventListener("mousemove", this.onMouseMove, !1), document.addEventListener("mouseup", this.onMouseUp, !1));
    });
    /**
     * 鼠标移动
     * @param event
     */
    f(this, "onMouseMove", (e) => {
      const r = this.container.style.transform || "rotate(0deg)", o = this.getClickPos(e), i = k(
        (this.calcRotate(this.startPos, o) + this.originRotate) % 360
      ), s = /rotate\(.*deg\)/g, a = r.replace(
        s,
        () => `rotate(${i}deg)`
      );
      this.container.style.transform = a;
      const c = { event: e, target: this.container, rotate: i };
      this.emit("rotate", c);
    });
    /**
     * 鼠标抬起
     */
    f(this, "onMouseUp", (e) => {
      const r = { event: e, target: this.container };
      this.emit("rotateEnd", r), this.isMobile ? (document.removeEventListener("touchmove", this.onMouseMove, !1), document.removeEventListener("touchend", this.onMouseUp, !1)) : (document.removeEventListener("mousemove", this.onMouseMove, !1), document.removeEventListener("mouseup", this.onMouseUp, !1));
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
      const R = c.body.querySelector("svg");
      h.replaceChild(r, R);
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
    const { x: e, y: r, width: o, height: i } = this.container.getBoundingClientRect(), s = e + o / 2, a = r + i / 2;
    this.setCenterPos({ x: s, y: a });
  }
  setCenterPos(e) {
    this.centerPos.x = e.x, this.centerPos.y = e.y;
  }
  destroy() {
    this.target = null, this.container = null, this.destroyEvents();
  }
  registryEvents() {
    this.isMobile ? this.target.addEventListener("touchstart", this.onMouseDown, !1) : this.target.addEventListener("mousedown", this.onMouseDown, !1);
  }
  destroyEvents() {
    return this.isMobile ? (document.removeEventListener("touchstart", this.onMouseDown, !1), document.removeEventListener("touchmove", this.onMouseMove, !1), document.removeEventListener("touchend", this.onMouseUp, !1)) : (document.removeEventListener("mousedown", this.onMouseDown, !1), document.removeEventListener("mousemove", this.onMouseMove, !1), document.removeEventListener("mouseup", this.onMouseUp, !1)), this;
  }
  getClickPos(e) {
    var i, s, a, c;
    const r = this.isMobile ? (s = (i = e.touches) == null ? void 0 : i[0]) == null ? void 0 : s.pageX : e.x, o = this.isMobile ? (c = (a = e.touches) == null ? void 0 : a[0]) == null ? void 0 : c.pageY : e.y;
    return { x: r, y: o };
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
    }, a = {
      x: r.x - o,
      y: r.y - i
    }, c = s.x * a.x + s.y * a.y, h = s.x * a.y - s.y * a.x;
    let l = Math.atan2(h, c);
    return l = (l + 2 * Math.PI) % (2 * Math.PI), l * (180 / Math.PI);
  }
}
export {
  V as default
};
