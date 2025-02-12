export interface IOptions {
  rotate?: number; // 单位 deg
  top?: number | string; // 旋转点位置a
  able?: Element; // 控制点元素
}

export interface IPos {
  x: number;
  y: number;
}

export interface IEvent {
  event: MouseEvent;
  target: Element;
  rotate?: number;
}
