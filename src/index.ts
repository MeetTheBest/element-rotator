import Event from "events";

import { uid, toPrecision } from "./utils";
import { IOptions, IPos, IEvent } from "./interface";

const DEFAULT_TOP = "-26px";

class ElementRotator extends Event {
  centerPos: IPos = { x: 0, y: 0 };
  startPos: IPos = { x: 0, y: 0 };
  originRotate: number = 0;

  target: HTMLElement | null = null;
  container: HTMLElement | null;
  options: IOptions;

  targetClassName = uid();

  isMobile: boolean =
    typeof window.orientation !== "undefined" ||
    "ontouchstart" in document.documentElement ||
    /Mobi|Android|iPhone/i.test(navigator.userAgent);

  constructor(container: HTMLElement, options: IOptions = {}) {
    super();

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

    const node = doc.body.firstChild!;

    if (able instanceof Element) {
      const originAble = doc.body.querySelector("svg");
      node.replaceChild(able, originAble!);
    }

    this.container?.appendChild(node);
    this.target = document.querySelector(`.${this.targetClassName}`);
  }

  setInitStyle() {
    const position = this.container?.style.getPropertyValue("position");
    if (!position) {
      this.container!.style.position = "relative";
    }

    if (this.originRotate) {
      const containerStyle = window.getComputedStyle(this.container!, null);

      let originTransform =
        this.container!.style.transform ||
        containerStyle.getPropertyValue("transform");

      originTransform = originTransform
        .replace(/rotate\((.*)deg\)/g, "")
        .trim();

      originTransform = originTransform === "none" ? "" : originTransform;
      this.container!.style.transform = `${originTransform} rotate(${this.originRotate}deg)`;
    }
  }

  calcCenterPos() {
    const { x, y, width, height } = this.container!.getBoundingClientRect();

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    this.setCenterPos({ x: centerX, y: centerY });
  }

  setCenterPos(pos: IPos) {
    this.centerPos.x = pos.x;
    this.centerPos.y = pos.y;
  }

  destroy() {
    this.target = null;
    this.container = null;
    this.destroyEvents();
  }

  registryEvents() {
    if (this.isMobile) {
      this.target!.addEventListener("touchstart", this.onMouseDown, false);
    } else {
      this.target!.addEventListener("mousedown", this.onMouseDown, false);
    }
  }

  destroyEvents() {
    if (this.isMobile) {
      document.removeEventListener("touchstart", this.onMouseDown, false);
      document.removeEventListener("touchmove", this.onMouseMove, false);
      document.removeEventListener("touchend", this.onMouseUp, false);
    } else {
      document.removeEventListener("mousedown", this.onMouseDown, false);
      document.removeEventListener("mousemove", this.onMouseMove, false);
      document.removeEventListener("mouseup", this.onMouseUp, false);
    }
    return this;
  }

  /**
   * 鼠标按下
   * @param event
   */
  onMouseDown = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();

    this.originRotate = 0;

    this.startPos = this.getClickPos(event);
    this.calcCenterPos();

    const originTransform = this.container!.style.transform;

    const regexp = /rotate\((.*)deg\)/g;
    originTransform.replace(
      regexp,
      (_, $1) => (($1 = +$1), (this.originRotate += $1))
    );

    this.originRotate = (+this.originRotate || 0) % 360;

    const _event = {
      event,
      target: this.container,
      rotate: this.originRotate,
    } as IEvent;
    this.emit("rotateStart", _event);

    if (this.isMobile) {
      document.addEventListener("touchmove", this.onMouseMove, false);
      document.addEventListener("touchend", this.onMouseUp, false);
    } else {
      document.addEventListener("mousemove", this.onMouseMove, false);
      document.addEventListener("mouseup", this.onMouseUp, false);
    }
  };

  /**
   * 鼠标移动
   * @param event
   */
  onMouseMove = (event: MouseEvent | TouchEvent) => {
    const originTransform = this.container!.style.transform || "rotate(0deg)";

    const position = this.getClickPos(event);
    const rotate = toPrecision(
      (this.calcRotate(this.startPos, position) + this.originRotate) % 360
    );
    const regexp = /rotate\(.*deg\)/g;

    const transformRotate = originTransform.replace(
      regexp,
      () => `rotate(${rotate}deg)`
    );

    this.container!.style.transform = transformRotate;
    const _event = { event, target: this.container, rotate } as IEvent;
    this.emit("rotate", _event);
  };

  /**
   * 鼠标抬起
   */
  onMouseUp = (event: MouseEvent | TouchEvent) => {
    const _event = { event, target: this.container } as IEvent;
    this.emit("rotateEnd", _event);

    if (this.isMobile) {
      document.removeEventListener("touchmove", this.onMouseMove, false);
      document.removeEventListener("touchend", this.onMouseUp, false);
    } else {
      document.removeEventListener("mousemove", this.onMouseMove, false);
      document.removeEventListener("mouseup", this.onMouseUp, false);
    }
  };

  getClickPos(event: MouseEvent | TouchEvent) {
    const x = this.isMobile
      ? (event as TouchEvent).touches?.[0]?.pageX
      : (event as MouseEvent).x;

    const y = this.isMobile
      ? (event as TouchEvent).touches?.[0]?.pageY
      : (event as MouseEvent).y;

    return { x, y };
  }

  /**
   * 计算旋转角度
   * @param initialPoint - 开始点位
   * @param finalPoint - 结束点位
   * @returns
   */
  calcRotate(initialPoint: IPos, finalPoint: IPos) {
    const { x: centerX, y: centerY } = this.centerPos;

    // 计算两个向量
    const vector1 = {
      x: initialPoint.x - centerX,
      y: initialPoint.y - centerY,
    };

    const vector2 = {
      x: finalPoint.x - centerX,
      y: finalPoint.y - centerY,
    };

    // 计算向量的点积
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

    // 计算向量的叉乘
    const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;

    // 计算旋转角度
    let angle = Math.atan2(crossProduct, dotProduct);

    // 转换角度到0到2π范围内
    angle = (angle + 2 * Math.PI) % (2 * Math.PI);

    // 返回角度（弧度转度）
    return angle * (180 / Math.PI);
  }
}

export default ElementRotator;

export type { ElementRotator };
