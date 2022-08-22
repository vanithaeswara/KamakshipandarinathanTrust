export interface Properties {
    element: HTMLElement;
    listeners?: 'auto' | 'mouse and touch';
    touchListeners?: any;
    mouseListeners?: any;
    otherListeners?: any;
    resize?: boolean;
}
export declare type EventType = undefined | 'touchend' | 'pan' | 'pinch' | 'horizontal-swipe' | 'vertical-swipe' | 'tap' | 'longtap';
export declare type TouchHandler = 'handleTouchstart' | 'handleTouchmove' | 'handleTouchend';
export declare type MouseHandler = 'handleMousedown' | 'handleMousemove' | 'handleMouseup';
export declare class Touches {
    properties: Properties;
    element: HTMLElement;
    elementPosition: ClientRect;
    eventType: EventType;
    handlers: any;
    startX: number;
    startY: number;
    lastTap: number;
    doubleTapTimeout: any;
    doubleTapMinTimeout: number;
    tapMinTimeout: number;
    touchstartTime: number;
    i: number;
    isMousedown: boolean;
    _touchListeners: any;
    _mouseListeners: any;
    _otherListeners: any;
    get touchListeners(): any;
    get mouseListeners(): any;
    get otherListeners(): any;
    constructor(properties: Properties);
    destroy(): void;
    toggleEventListeners(action: 'addEventListener' | 'removeEventListener'): void;
    addEventListeners(listener: string): void;
    removeEventListeners(listener: string): void;
    handleTouchstart: (event: any) => void;
    handleTouchmove: (event: any) => void;
    handleLinearSwipe(event: any): void;
    handleTouchend: (event: any) => void;
    handleMousedown: (event: any) => void;
    handleMousemove: (event: any) => void;
    handleMouseup: (event: any) => void;
    handleWheel: (event: any) => void;
    handleResize: (event: any) => void;
    runHandler(eventName: any, response: any): void;
    detectPan(touches: any): boolean;
    detectDoubleTap(): true | undefined;
    detectTap(): void;
    detectPinch(event: any): boolean;
    detectLinearSwipe(event: any): "horizontal-swipe" | "vertical-swipe" | undefined;
    getLinearSwipeType(event: any): "horizontal-swipe" | "vertical-swipe";
    getElementPosition(): DOMRect;
    getTouchstartPosition(event: any): void;
    getMousedownPosition(event: any): void;
    moveLeft(index: any, event: any): number;
    moveTop(index: any, event: any): number;
    detectTouchScreen(): boolean;
    on(event: EventType, handler: Function): void;
}
