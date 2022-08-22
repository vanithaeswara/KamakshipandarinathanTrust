(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-responsive-carousel', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['angular-responsive-carousel'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var Touches = /** @class */ (function () {
        function Touches(properties) {
            var _this = this;
            this.eventType = undefined;
            this.handlers = {};
            this.startX = 0;
            this.startY = 0;
            this.lastTap = 0;
            this.doubleTapMinTimeout = 300;
            this.tapMinTimeout = 200;
            this.touchstartTime = 0;
            this.i = 0;
            this.isMousedown = false;
            this._touchListeners = {
                "touchstart": "handleTouchstart",
                "touchmove": "handleTouchmove",
                "touchend": "handleTouchend"
            };
            this._mouseListeners = {
                "mousedown": "handleMousedown",
                "mousemove": "handleMousemove",
                "mouseup": "handleMouseup",
                "wheel": "handleWheel"
            };
            this._otherListeners = {
                "resize": "handleResize"
            };
            /*
             * Listeners
             */
            /* Touchstart */
            this.handleTouchstart = function (event) {
                _this.elementPosition = _this.getElementPosition();
                _this.touchstartTime = new Date().getTime();
                if (_this.eventType === undefined) {
                    _this.getTouchstartPosition(event);
                }
                _this.runHandler("touchstart", event);
            };
            /* Touchmove */
            this.handleTouchmove = function (event) {
                var touches = event.touches;
                // Pan
                if (_this.detectPan(touches)) {
                    _this.runHandler("pan", event);
                }
                // Pinch
                if (_this.detectPinch(event)) {
                    _this.runHandler("pinch", event);
                }
                // Linear swipe
                switch (_this.detectLinearSwipe(event)) {
                    case "horizontal-swipe":
                        event.swipeType = "horizontal-swipe";
                        _this.runHandler("horizontal-swipe", event);
                        break;
                    case "vertical-swipe":
                        event.swipeType = "vertical-swipe";
                        _this.runHandler("vertical-swipe", event);
                        break;
                }
                // Linear swipe
                if (_this.detectLinearSwipe(event) ||
                    _this.eventType === 'horizontal-swipe' ||
                    _this.eventType === 'vertical-swipe') {
                    _this.handleLinearSwipe(event);
                }
            };
            /* Touchend */
            this.handleTouchend = function (event) {
                var touches = event.touches;
                // Double Tap
                if (_this.detectDoubleTap()) {
                    _this.runHandler("double-tap", event);
                }
                // Tap
                _this.detectTap();
                _this.runHandler("touchend", event);
                _this.eventType = 'touchend';
                if (touches && touches.length === 0) {
                    _this.eventType = undefined;
                    _this.i = 0;
                }
            };
            /* Mousedown */
            this.handleMousedown = function (event) {
                _this.isMousedown = true;
                _this.elementPosition = _this.getElementPosition();
                _this.touchstartTime = new Date().getTime();
                if (_this.eventType === undefined) {
                    _this.getMousedownPosition(event);
                }
                _this.runHandler("mousedown", event);
            };
            /* Mousemove */
            this.handleMousemove = function (event) {
                //event.preventDefault();
                if (!_this.isMousedown) {
                    return;
                }
                // Pan
                _this.runHandler("pan", event);
                // Linear swipe
                switch (_this.detectLinearSwipe(event)) {
                    case "horizontal-swipe":
                        event.swipeType = "horizontal-swipe";
                        _this.runHandler("horizontal-swipe", event);
                        break;
                    case "vertical-swipe":
                        event.swipeType = "vertical-swipe";
                        _this.runHandler("vertical-swipe", event);
                        break;
                }
                // Linear swipe
                if (_this.detectLinearSwipe(event) ||
                    _this.eventType === 'horizontal-swipe' ||
                    _this.eventType === 'vertical-swipe') {
                    _this.handleLinearSwipe(event);
                }
            };
            /* Mouseup */
            this.handleMouseup = function (event) {
                // Tap
                _this.detectTap();
                _this.isMousedown = false;
                _this.runHandler("mouseup", event);
                _this.eventType = undefined;
                _this.i = 0;
            };
            /* Wheel */
            this.handleWheel = function (event) {
                _this.runHandler("wheel", event);
            };
            /* Resize */
            this.handleResize = function (event) {
                _this.runHandler("resize", event);
            };
            this.properties = properties;
            this.element = this.properties.element;
            this.elementPosition = this.getElementPosition();
            this.toggleEventListeners('addEventListener');
        }
        Object.defineProperty(Touches.prototype, "touchListeners", {
            get: function () {
                return this.properties.touchListeners ? this.properties.touchListeners : this._touchListeners;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Touches.prototype, "mouseListeners", {
            get: function () {
                return this.properties.mouseListeners ? this.properties.mouseListeners : this._mouseListeners;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Touches.prototype, "otherListeners", {
            get: function () {
                return this.properties.otherListeners ? this.properties.otherListeners : this._otherListeners;
            },
            enumerable: false,
            configurable: true
        });
        Touches.prototype.destroy = function () {
            this.toggleEventListeners('removeEventListener');
        };
        Touches.prototype.toggleEventListeners = function (action) {
            var listeners;
            if (this.properties.listeners === 'mouse and touch') {
                listeners = Object.assign(this.touchListeners, this.mouseListeners);
            }
            else {
                listeners = this.detectTouchScreen() ? this.touchListeners : this.mouseListeners;
            }
            if (this.properties.resize) {
                listeners = Object.assign(listeners, this.otherListeners);
            }
            for (var listener in listeners) {
                var handler = listeners[listener];
                // Window
                if (listener === "resize") {
                    if (action === 'addEventListener') {
                        window.addEventListener(listener, this[handler], false);
                    }
                    if (action === 'removeEventListener') {
                        window.removeEventListener(listener, this[handler], false);
                    }
                    // Document
                }
                else if (listener === 'mouseup' || listener === "mousemove") {
                    if (action === 'addEventListener') {
                        document.addEventListener(listener, this[handler], { passive: false });
                    }
                    if (action === 'removeEventListener') {
                        document.removeEventListener(listener, this[handler], false);
                    }
                    // Element
                }
                else {
                    if (action === 'addEventListener') {
                        this.element.addEventListener(listener, this[handler], false);
                    }
                    if (action === 'removeEventListener') {
                        this.element.removeEventListener(listener, this[handler], false);
                    }
                }
            }
        };
        Touches.prototype.addEventListeners = function (listener) {
            var handler = this._mouseListeners[listener];
            window.addEventListener(listener, this[handler], false);
        };
        Touches.prototype.removeEventListeners = function (listener) {
            var handler = this._mouseListeners[listener];
            window.removeEventListener(listener, this[handler], false);
        };
        Touches.prototype.handleLinearSwipe = function (event) {
            //event.preventDefault();
            this.i++;
            if (this.i > 3) {
                this.eventType = this.getLinearSwipeType(event);
            }
            if (this.eventType === 'horizontal-swipe') {
                this.runHandler('horizontal-swipe', event);
            }
            if (this.eventType === 'vertical-swipe') {
                this.runHandler('vertical-swipe', event);
            }
        };
        Touches.prototype.runHandler = function (eventName, response) {
            if (this.handlers[eventName]) {
                this.handlers[eventName](response);
            }
        };
        /*
         * Detection
         */
        Touches.prototype.detectPan = function (touches) {
            return touches.length === 1 && !this.eventType || this.eventType === 'pan';
        };
        Touches.prototype.detectDoubleTap = function () {
            var _this = this;
            if (this.eventType != undefined) {
                return;
            }
            var currentTime = new Date().getTime();
            var tapLength = currentTime - this.lastTap;
            clearTimeout(this.doubleTapTimeout);
            if (tapLength < this.doubleTapMinTimeout && tapLength > 0) {
                return true;
            }
            else {
                this.doubleTapTimeout = setTimeout(function () {
                    clearTimeout(_this.doubleTapTimeout);
                }, this.doubleTapMinTimeout);
            }
            this.lastTap = currentTime;
            return undefined;
        };
        Touches.prototype.detectTap = function () {
            if (this.eventType != undefined) {
                return;
            }
            var currentTime = new Date().getTime();
            var tapLength = currentTime - this.touchstartTime;
            if (tapLength > 0) {
                if (tapLength < this.tapMinTimeout) {
                    this.runHandler("tap", event);
                }
                else {
                    this.runHandler("longtap", event);
                }
            }
        };
        Touches.prototype.detectPinch = function (event) {
            var touches = event.touches;
            return (touches.length === 2 && this.eventType === undefined) || this.eventType === 'pinch';
        };
        Touches.prototype.detectLinearSwipe = function (event) {
            var touches = event.touches;
            if (touches) {
                if (touches.length === 1 && !this.eventType || this.eventType === 'horizontal-swipe' || this.eventType === 'vertical-swipe') {
                    return this.getLinearSwipeType(event);
                }
            }
            else {
                if (!this.eventType || this.eventType === 'horizontal-swipe' || this.eventType === 'vertical-swipe') {
                    return this.getLinearSwipeType(event);
                }
            }
            return undefined;
        };
        Touches.prototype.getLinearSwipeType = function (event) {
            if (this.eventType !== 'horizontal-swipe' && this.eventType !== 'vertical-swipe') {
                var movementX = Math.abs(this.moveLeft(0, event) - this.startX);
                var movementY = Math.abs(this.moveTop(0, event) - this.startY);
                if ((movementY * 3) > movementX) {
                    return 'vertical-swipe';
                }
                else {
                    return 'horizontal-swipe';
                }
            }
            else {
                return this.eventType;
            }
        };
        Touches.prototype.getElementPosition = function () {
            return this.element.getBoundingClientRect();
        };
        Touches.prototype.getTouchstartPosition = function (event) {
            this.startX = event.touches[0].clientX - this.elementPosition.left;
            this.startY = event.touches[0].clientY - this.elementPosition.top;
        };
        Touches.prototype.getMousedownPosition = function (event) {
            this.startX = event.clientX - this.elementPosition.left;
            this.startY = event.clientY - this.elementPosition.top;
        };
        Touches.prototype.moveLeft = function (index, event) {
            var touches = event.touches;
            if (touches) {
                return touches[index].clientX - this.elementPosition.left;
            }
            else {
                return event.clientX - this.elementPosition.left;
            }
        };
        Touches.prototype.moveTop = function (index, event) {
            var touches = event.touches;
            if (touches) {
                return touches[index].clientY - this.elementPosition.top;
            }
            else {
                return event.clientY - this.elementPosition.top;
            }
        };
        Touches.prototype.detectTouchScreen = function () {
            var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            var mq = function (query) {
                return window.matchMedia(query).matches;
            };
            if (('ontouchstart' in window)) {
                return true;
            }
            // include the 'heartz' as a way to have a non matching MQ to help terminate the join
            // https://git.io/vznFH
            var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
            return mq(query);
        };
        /* Public properties and methods */
        Touches.prototype.on = function (event, handler) {
            if (event) {
                this.handlers[event] = handler;
            }
        };
        return Touches;
    }());

    var Carousel = /** @class */ (function () {
        function Carousel(properties, utils, cells, container, slide) {
            var _this = this;
            this.properties = properties;
            this.utils = utils;
            this.cells = cells;
            this.container = container;
            this.slide = slide;
            /* The slide length has been limited by the limitSlideLength() method */
            this.isSlideLengthLimited = false;
            this.isContentImages = true;
            this.isLazyLoad = true;
            this.isContainerLocked = true;
            this.alignCells = "left";
            this.initialContainerPosition = 0;
            this.containerPullLimit = 100;
            this.handleTouchstart = function (event) {
                _this.container.handleTouchstart();
                _this.slide.handleTouchstart(event);
            };
            this.handleHorizontalSwipe = function (event) {
                _this.container.handleHorizontalSwipe();
            };
            this.handleTouchend = function (event) {
                if (_this.properties.freeScroll) {
                    _this.container.handleTouchend();
                }
                else {
                    _this.container.handleTouchend(true);
                    _this.slide.handleTouchend(event);
                }
            };
            this.isNextArrowDisabled = function () {
                return _this.slide.isNextArrowDisabled();
            };
            this.isPrevArrowDisabled = function () {
                return _this.slide.isPrevArrowDisabled();
            };
            this.init();
        }
        Object.defineProperty(Carousel.prototype, "cellLength", {
            get: function () {
                return this.cells.cellLength;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "cellLengthInLightDOMMode", {
            get: function () {
                if (this.images) {
                    var cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
                    if (cellLength > this.images.length) {
                        cellLength = this.images.length;
                    }
                    return cellLength;
                }
                else {
                    return this.cellLength;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "lastCellIndex", {
            get: function () {
                return this.images.length ? (this.images.length - 1) : (this.cells.cellLength - 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "overflowCellsLimit", {
            get: function () {
                return this.utils.overflowCellsLimit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "cellLimit", {
            get: function () {
                if (this.isLightDOM) {
                    var cellLimit = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
                    if (cellLimit < this.numberOfVisibleCells) {
                        cellLimit = this.numberOfVisibleCells;
                    }
                    return cellLimit;
                }
                else {
                    return this.properties.images.length;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "isLightDOM", {
            get: function () {
                return this.properties.lightDOM || this.properties.loop;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "images", {
            get: function () {
                return this.properties.images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "margin", {
            get: function () {
                return this.properties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "minSwipeDistance", {
            get: function () {
                return this.properties.minSwipeDistance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "transitionDuration", {
            get: function () {
                return this.properties.transitionDuration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "transitionTimingFunction", {
            get: function () {
                return this.properties.transitionTimingFunction;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "fullCellWidth", {
            get: function () {
                return this.properties.cellWidth + this.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "numberOfVisibleCells", {
            get: function () {
                return this.utils.numberOfVisibleCells;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "lapCounter", {
            get: function () {
                return Math.floor(this.slide.counter / this.cellLengthInLightDOMMode);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Carousel.prototype, "slideCounter", {
            get: function () {
                return this.slide.counter;
            },
            enumerable: false,
            configurable: true
        });
        Carousel.prototype.updateProperties = function (properties) {
            this.properties = properties;
        };
        Carousel.prototype.init = function () {
            this.cellsElement = this.properties.cellsElement;
            this.visibleWidth = this.properties.visibleWidth || this.cellsElement.parentElement.clientWidth;
        };
        Carousel.prototype.destroy = function () {
            clearInterval(this.autoplayId);
        };
        Carousel.prototype.lineUpCells = function () {
            this.cells.lineUp();
        };
        Carousel.prototype.handleTransitionend = function () {
            this.slide.handleTransitionend();
        };
        Carousel.prototype.getImage = function (index) {
            return this.cells.getImage(index);
        };
        Carousel.prototype.next = function (length) {
            if (length === void 0) { length = 1; }
            if (!this.isNextArrowDisabled()) {
                this.slide.next(length);
            }
        };
        Carousel.prototype.prev = function (length) {
            if (length === void 0) { length = 1; }
            this.slide.prev(length);
        };
        Carousel.prototype.autoplay = function () {
            var _this = this;
            this.autoplayId = setInterval(function () {
                _this.next();
            }, this.properties.autoplayInterval);
        };
        Carousel.prototype.stopAutoplay = function () {
            if (this.autoplayId) {
                clearInterval(this.autoplayId);
            }
        };
        return Carousel;
    }());

    var Container = /** @class */ (function () {
        function Container(carouselProperties, utils, cells) {
            this.carouselProperties = carouselProperties;
            this.utils = utils;
            this.cells = cells;
            /* The index of the new position relative to
             * the active index, for example -1 or +1
             */
            this.newPositionIndex = 0;
            this.isPositionCorrection = false;
            this.initialPositionX = 0;
            this.initialElementPositionX = 0;
            this.isLocked = true;
            this.pullLimit = 100;
            this.startTime = 0;
            this.startX = 0;
            this.moveX = 0;
            this.isSwipeInProgress = false;
            this.init();
        }
        Object.defineProperty(Container.prototype, "visibleWidth", {
            get: function () {
                return this.utils.visibleWidth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "overflowCellsLimit", {
            get: function () {
                return this.utils.overflowCellsLimit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "images", {
            get: function () {
                return this.carouselProperties.images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "element", {
            get: function () {
                return this.carouselProperties.cellsElement;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "freeScroll", {
            get: function () {
                return this.carouselProperties.freeScroll;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "fullCellWidth", {
            get: function () {
                return this.carouselProperties.cellWidth + this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "numberOfVisibleCells", {
            get: function () {
                return this.utils.numberOfVisibleCells;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "transitionDuration", {
            get: function () {
                return this.carouselProperties.transitionDuration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "transitionTimingFunction", {
            get: function () {
                return this.carouselProperties.transitionTimingFunction;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "cellLength", {
            get: function () {
                if (this.images) {
                    return this.images.length;
                }
                else {
                    return this.cells.cellLength;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "cellLengthInLightDOMMode", {
            get: function () {
                if (this.images) {
                    var cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
                    if (cellLength > this.images.length) {
                        cellLength = this.images.length;
                    }
                    return cellLength;
                }
                else {
                    return this.cellLength;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "tooFewCells", {
            get: function () {
                return this.numberOfVisibleCells > this.cellLength;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "disabled", {
            get: function () {
                return this.tooFewCells;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "margin", {
            get: function () {
                return this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "isLightDOM", {
            get: function () {
                return this.carouselProperties.lightDOM || this.carouselProperties.loop;
            },
            enumerable: false,
            configurable: true
        });
        Container.prototype.updateProperties = function (carouselProperties) {
            this.carouselProperties = carouselProperties;
        };
        Container.prototype.init = function () {
            this.setWidth();
        };
        Container.prototype.handleTouchstart = function () {
            this.startX = this.utils.getStartX(event);
            this.startTime = new Date().getTime();
            this.initialElementPositionX = this.getInitialElementPositionX();
        };
        Container.prototype.handleHorizontalSwipe = function () {
            if (this.disabled) {
                return;
            }
            if (!this.isSwipeInProgress) {
                this.startX = this.utils.getStartX(event);
                this.startTime = new Date().getTime();
                this.initialElementPositionX = this.getInitialElementPositionX();
            }
            this.isSwipeInProgress = true;
            this.moveX = this.utils.getMoveX(event);
            this.move();
        };
        Container.prototype.handleTouchend = function (simpleProcessing) {
            if (simpleProcessing === void 0) { simpleProcessing = false; }
            if (this.disabled) {
                return;
            }
            /* If touchend was passed to the Slide class */
            if (simpleProcessing) {
                this.isSwipeInProgress = false;
                return;
            }
            this.isSwipeInProgress = false;
            this.finishMoving();
            this.clearInitialValues();
        };
        Container.prototype.move = function () {
            var positionX = this.getMovePositionX();
            var isPulled = this.detectPulled();
            var direction = this.getDirection();
            if (isPulled) {
                if (isPulled.edge === "left" && direction === "right" ||
                    isPulled.edge === "right" && direction === "left") {
                    positionX = this.slowdownOnPull(positionX);
                }
            }
            this.transformPositionX(positionX, 0);
            if (this.freeScroll) {
                this.initialPositionX = positionX;
            }
            if (isPulled) {
                if (isPulled.edge === 'left' && isPulled.overflowX > this.pullLimit) {
                    this.initialPositionX = 0;
                }
                if (isPulled.edge === 'right' && isPulled.overflowX > this.pullLimit) {
                    this.initialPositionX = positionX;
                }
            }
        };
        Container.prototype.getMovePositionX = function () {
            var distance = this.getDistance();
            return this.initialElementPositionX - distance;
        };
        Container.prototype.getDistance = function () {
            return this.startX - this.moveX;
        };
        /* If the container is pulled out of the left or right border */
        Container.prototype.detectPulled = function () {
            var currentPositionX = this.getCurrentPositionX();
            if (currentPositionX > 0) {
                return {
                    edge: 'left',
                    positionX: currentPositionX,
                    overflowX: Math.abs(currentPositionX)
                };
            }
            if (currentPositionX < this.getEndPosition()) {
                return {
                    edge: 'right',
                    positionX: currentPositionX,
                    overflowX: Math.abs(currentPositionX - this.getEndPosition())
                };
            }
            return undefined;
        };
        Container.prototype.slowdownOnPull = function (_positionX) {
            var distance = Math.abs(this.getDistance());
            var endPosition = this.getEndPosition();
            var isPulled = this.detectPulled();
            if (!isPulled) {
                return 0;
            }
            var decelerationRatio = 3 + isPulled.overflowX / 50;
            var positionX = 0;
            if (isPulled.edge === 'left') {
                if (this.initialElementPositionX < 0) {
                    distance = distance - Math.abs(this.initialElementPositionX);
                }
                var rubberPositionX = distance / decelerationRatio;
                positionX = rubberPositionX;
                if (this.initialElementPositionX > 0) {
                    positionX = this.initialElementPositionX + rubberPositionX;
                }
                if (positionX > this.pullLimit) {
                    positionX = this.pullLimit;
                }
            }
            if (isPulled.edge === 'right') {
                var rubberPositionX = endPosition + (((this.initialElementPositionX - distance) - endPosition) / decelerationRatio);
                var containerWidth = this.getWidth();
                positionX = rubberPositionX;
                if (this.initialElementPositionX < -(containerWidth - this.visibleWidth)) {
                    positionX = ((containerWidth - this.visibleWidth) + this.initialElementPositionX) + rubberPositionX;
                }
                if (positionX < endPosition - this.pullLimit) {
                    positionX = endPosition - this.pullLimit;
                }
            }
            return positionX;
        };
        Container.prototype.finishMoving = function () {
            var positionX = this.getMovePositionX();
            var newPositionX = 0;
            if (this.freeScroll) {
                newPositionX = this.getInertia();
            }
            /* Align container while pulling */
            newPositionX = this.getAlignedPositionOnPull(newPositionX);
            this.transformPositionX(newPositionX);
            this.setInitialPosition(positionX);
        };
        /* Returns the new position of the container with inertia */
        Container.prototype.getInertia = function () {
            var distance = this.getDistance();
            var currentTime = new Date().getTime();
            var tapLength = currentTime - this.startTime;
            var inertia = (distance / tapLength) * 100;
            return this.initialPositionX - inertia;
        };
        Container.prototype.getAlignedPositionOnPull = function (newPositionX) {
            var direction = this.getDirection();
            if (direction === 'left') {
                var endPosition = this.getEndPosition();
                if (newPositionX < endPosition) {
                    return endPosition;
                }
            }
            if (direction === 'right') {
                if (newPositionX > 0) {
                    return 0;
                }
            }
            return newPositionX;
        };
        Container.prototype.getCurrentPositionX = function () {
            var parentPosition = this.element.parentElement.getBoundingClientRect();
            var position = this.element.getBoundingClientRect();
            return position.left - parentPosition.left;
        };
        Container.prototype.getEndPosition = function () {
            if (this.isLightDOM) {
                var imagesInContainer = this.cells.imageUtils.getImages();
                return -(imagesInContainer.length * this.fullCellWidth - this.visibleWidth - this.margin);
            }
            else {
                var width = this.getWidth();
                var visibleWidth = this.element.parentElement.clientWidth;
                return visibleWidth - width;
            }
        };
        Container.prototype.transformPositionX = function (value, duration) {
            if (duration === void 0) { duration = this.transitionDuration; }
            if (value === undefined) {
                return;
            }
            this.element.style.transition = 'transform ' + duration + 'ms ' + this.transitionTimingFunction;
            this.element.style.transform = 'translateX(' + value + 'px)';
        };
        Container.prototype.getWidth = function () {
            var width = this.cellLengthInLightDOMMode * this.fullCellWidth;
            var totalImageWidth = this.cellLength * this.fullCellWidth;
            if (totalImageWidth < width) {
                width = totalImageWidth;
            }
            return this.isLightDOM ? width : totalImageWidth;
        };
        Container.prototype.setWidth = function () {
            var width = this.getWidth();
            this.element.style.width = width + "px";
        };
        Container.prototype.setInitialPosition = function (position) {
            this.initialPositionX = position;
        };
        Container.prototype.getElementPosition = function () {
            return this.element.getBoundingClientRect();
        };
        Container.prototype.getInitialElementPositionX = function () {
            var carouselElementPosition = this.utils.getCarouselElementPosition()['left'];
            return this.getElementPosition()['left'] - carouselElementPosition;
        };
        Container.prototype.clearInitialValues = function () {
            this.startX = this.moveX = 0;
        };
        Container.prototype.getDirection = function () {
            var direction = Math.sign(this.startX - this.moveX);
            if (direction === -1) {
                return 'right';
            }
            if (direction === 1) {
                return 'left';
            }
            return undefined;
        };
        return Container;
    }());

    var ImageUtils = /** @class */ (function () {
        function ImageUtils(element) {
            this.cellStack = [];
            this.element = element;
        }
        ImageUtils.prototype.getImages = function () {
            return this.cellStack.filter(this.filter);
        };
        ImageUtils.prototype.filter = function (cell) {
            return cell.img !== undefined;
        };
        return ImageUtils;
    }());
    var Cells = /** @class */ (function () {
        function Cells(carouselProperties, utils) {
            this.carouselProperties = carouselProperties;
            this.utils = utils;
            this.counter = 0;
            this.imageUtils = new ImageUtils(this.element);
            this.init(carouselProperties);
        }
        Object.defineProperty(Cells.prototype, "images", {
            get: function () {
                return this.carouselProperties.images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "cellLength", {
            get: function () {
                return this.cells ? this.cells.length : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "fullCellWidth", {
            get: function () {
                return this.carouselProperties.cellWidth + this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "cellLengthInLightDOMMode", {
            get: function () {
                if (this.images) {
                    var cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
                    if (cellLength > this.images.length) {
                        cellLength = this.images.length;
                    }
                    return cellLength;
                }
                else {
                    return this.cellLength;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "numberOfVisibleCells", {
            get: function () {
                return this.utils.numberOfVisibleCells;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "overflowCellsLimit", {
            get: function () {
                return this.utils.overflowCellsLimit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cells.prototype, "isLightDOM", {
            get: function () {
                return this.carouselProperties.lightDOM || this.carouselProperties.loop;
            },
            enumerable: false,
            configurable: true
        });
        Cells.prototype.updateProperties = function (carouselProperties) {
            this.carouselProperties = carouselProperties;
        };
        Cells.prototype.lineUp = function () {
            var cells = this.element ? this.element.children : [];
            this.imageUtils.cellStack = [];
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                var positionX = this.getCellPositionInContainer(i);
                cell.style.transform = 'translateX(' + positionX + 'px)';
                cell.style.width = this.carouselProperties.cellWidth + 'px';
                if (this.getImage(i)) {
                    this.imageUtils.cellStack.push({
                        index: i,
                        positionX: positionX,
                        img: this.getImage(i)['image']
                    });
                }
            }
            ;
        };
        Cells.prototype.ifSequenceOfCellsIsChanged = function () {
            var cells = this.element.children;
            return cells[0]['style'].transform !== 'translateX(0px)';
        };
        Cells.prototype.getCellPositionInContainer = function (cellIndexInDOMTree) {
            var positionIndex = this.getCellIndexInContainer(cellIndexInDOMTree);
            return positionIndex * this.fullCellWidth;
        };
        Cells.prototype.getCellIndexInContainer = function (cellIndexInDOMTree) {
            var positionIndex;
            if (!this.isLightDOM) {
                return cellIndexInDOMTree;
            }
            var cellLength = this.cellLengthInLightDOMMode;
            var counter = this.counter - this.overflowCellsLimit;
            if (counter > cellLength) {
                counter = counter % cellLength;
            }
            if (counter < 0) {
                return cellIndexInDOMTree;
            }
            else {
                positionIndex = cellIndexInDOMTree - counter;
                if (positionIndex < 0) {
                    positionIndex = cellLength + positionIndex;
                }
            }
            return positionIndex;
        };
        Cells.prototype.getImage = function (cellIndex) {
            if (!this.images) {
                return;
            }
            var imageIndex = this.getImageIndex(cellIndex);
            var file = this.images[imageIndex];
            if (file && !file.type) {
                file.type = 'image';
            }
            return {
                image: this.images[imageIndex],
                imageIndex: imageIndex
            };
        };
        Cells.prototype.getImageIndex = function (cellIndexInDOMTree) {
            var positionIndex = this.getCellIndexInContainer(cellIndexInDOMTree);
            var imageIndex;
            if (this.counter > this.overflowCellsLimit) {
                var cellLimitOverflow = this.counter - this.overflowCellsLimit;
                imageIndex = positionIndex + cellLimitOverflow;
                if (this.images && this.carouselProperties.loop) {
                    imageIndex = imageIndex % this.images.length;
                }
            }
            else {
                imageIndex = cellIndexInDOMTree;
            }
            return imageIndex;
        };
        Cells.prototype.setCounter = function (value) {
            this.counter = value;
        };
        Cells.prototype.init = function (carouselProperties) {
            this.element = this.carouselProperties.cellsElement;
            this.cells = this.element.children;
            this.visibleWidth = this.carouselProperties.visibleWidth || this.element.parentElement.clientWidth;
        };
        return Cells;
    }());

    var Slide = /** @class */ (function () {
        function Slide(carouselProperties, utils, cells, container) {
            this.carouselProperties = carouselProperties;
            this.utils = utils;
            this.cells = cells;
            this.container = container;
            this.slideLength = 0;
            this.isSlideInProgress = false;
            this.counter = 0;
            this._counter = 0;
            this.distance = 0;
            this.distanceAbs = 0;
            this.isNotClickOnArrow = false;
            this.initialPositionX = 0;
            this.currentPositionX = 0;
            /* The slide length has been limited by the limitSlideLength() method */
            this.isSlideLengthLimited = false;
            this.init();
        }
        Object.defineProperty(Slide.prototype, "fullCellWidth", {
            get: function () {
                return this.carouselProperties.cellWidth + this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "margin", {
            get: function () {
                return this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "minSwipeDistance", {
            get: function () {
                return this.carouselProperties.minSwipeDistance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "numberOfVisibleCells", {
            get: function () {
                return this.utils.numberOfVisibleCells;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "visibleCellsOverflowContainer", {
            get: function () {
                return this.utils.visibleCellsOverflowContainer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "fixedContainerPosition", {
            /* The position to which the container returns after each slide
             * in the light DUM tree mode.
             */
            get: function () {
                return -(this.overflowCellsLimit * this.fullCellWidth);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "overflowCellsLimit", {
            get: function () {
                return this.utils.overflowCellsLimit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "images", {
            get: function () {
                return this.carouselProperties.images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "cellLength", {
            /* Number of cell elements in the DUM tree */
            get: function () {
                if (this.isLightDOM) {
                    return this.cells.cellLengthInLightDOMMode;
                }
                else {
                    if (this.images) {
                        return this.images.length;
                    }
                    else {
                        return this.cells.cellLength;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Slide.prototype, "isLightDOM", {
            get: function () {
                return this.carouselProperties.lightDOM || this.carouselProperties.loop;
            },
            enumerable: false,
            configurable: true
        });
        Slide.prototype.updateProperties = function (carouselProperties) {
            this.carouselProperties = carouselProperties;
            this.setVisibleWidth();
        };
        Slide.prototype.init = function () {
            this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
        };
        Slide.prototype.handleTouchstart = function () {
            /* Touchstart event is not called for arrow */
            this.isNotClickOnArrow = true;
            this.isSlideLengthLimited = false;
            if (!this.isSlideInProgress) {
                this.initialPositionX = this.container.getCurrentPositionX();
            }
        };
        Slide.prototype.handleTouchend = function () {
            if (!this.isNotClickOnArrow) {
                return;
            }
            this.currentPositionX = this.container.getCurrentPositionX();
            this.distanceAbs = Math.abs(this.initialPositionX - this.currentPositionX);
            this.distance = this.initialPositionX - this.currentPositionX;
            this.direction = this.getDirection();
            this.isNotClickOnArrow = false;
            this.handleSlide();
        };
        Slide.prototype.handleTransitionend = function () {
            this.setCounter();
            this.isSlideInProgress = false;
            if (this.isLightDOM) {
                this.alignContainerFast();
            }
        };
        Slide.prototype.handleSlide = function (customSlideLength) {
            if (customSlideLength === void 0) { customSlideLength = undefined; }
            var isUsingButton = customSlideLength;
            var newPositionX;
            if (isUsingButton && this.isSlideInProgress || !this.direction) {
                return;
            }
            /* Custom slide length is used in arrows */
            if (customSlideLength) {
                this.slideLength = this.limitSlideLength(customSlideLength);
                if (!this.isSlideInProgress) {
                    this.initialPositionX = this.container.getCurrentPositionX();
                }
            }
            else {
                this.slideLength = this.getSlideLength(this.distanceAbs);
            }
            /* Store intermediate counter value */
            this._counter = this.getPreliminaryCounter();
            if (this.direction === 'left') {
                if (!customSlideLength) {
                    this.slideLength = this.limitSlideLength(this.getSlideLength(this.distanceAbs));
                }
                this._counter = this.getPreliminaryCounter();
                var isSlidesEnd = this.isSlidesEnd(this._counter);
                newPositionX = this.getPositionByIndex(this._counter);
                if (isSlidesEnd) {
                    this._counter = this.counter;
                    newPositionX = this.getPositionByIndex(this.counter);
                    this.slideLength = 0;
                }
            }
            if (this.direction === 'right') {
                if (!customSlideLength) {
                    this.slideLength = this.getSlideLength(this.distanceAbs);
                }
                if (this._counter < 0) {
                    this._counter = this.counter;
                    this.slideLength = this.counter;
                }
                newPositionX = this.getPositionByIndex(this.counter - this.slideLength);
            }
            if (this.container.getCurrentPositionX() !== newPositionX) {
                this.isSlideInProgress = true;
                this.container.transformPositionX(newPositionX);
            }
        };
        Slide.prototype.next = function (length) {
            if (length === void 0) { length = 1; }
            this.direction = 'left';
            this.handleSlide(length);
        };
        Slide.prototype.prev = function (length) {
            if (length === void 0) { length = 1; }
            this.direction = 'right';
            this.handleSlide(length);
        };
        Slide.prototype.select = function (index) {
            if (index > this.cellLength - 1) {
                return;
            }
            if (index > this.counter) {
                var length = index - this.counter;
                this.next(length);
            }
            if (index < this.counter) {
                var length = this.counter - index;
                this.prev(length);
            }
        };
        Slide.prototype.getPreliminaryCounter = function () {
            if (this.direction === 'left') {
                return this.counter + this.slideLength;
            }
            if (this.direction === 'right') {
                return this.counter - this.slideLength;
            }
            return 0;
        };
        /*
         * Limits the length of the slide during calls to the next() and prev()
         * methods if the specified position is outside the cell length
         */
        Slide.prototype.limitSlideLength = function (slideLength) {
            if (slideLength > 1) {
                for (var i = 0; i < slideLength; i++) {
                    var newCounter = this.counter + (slideLength - i);
                    if (!this.isSlidesEnd(newCounter)) {
                        slideLength = slideLength - i;
                        this.isSlideLengthLimited = i > 0;
                        break;
                    }
                }
            }
            return slideLength;
        };
        /* Offset the container to show the last cell completely */
        Slide.prototype.getPositionCorrection = function (counter) {
            var correction = 0;
            var isLastSlide = this.isLastSlide(counter);
            if (this.carouselProperties.loop || this.direction === "right") {
                return 0;
            }
            if (this.isSlideLengthLimited || isLastSlide) {
                var cellsWidth = this.cells.cellLengthInLightDOMMode * this.fullCellWidth;
                if (this.visibleWidth < cellsWidth) {
                    correction = -(this.numberOfVisibleCells * this.fullCellWidth - this.visibleWidth - this.margin);
                }
                if (correction >= -this.margin) {
                    correction = 0;
                }
            }
            return correction;
        };
        Slide.prototype.getSlideLength = function (distanceAbs) {
            var isLastSlide = this.isLastSlide(this.counter);
            /* If the last cell does not fit entirely, then the
             * length of the swipe to the left, from the extreme
             * right position, may be shorter than usual.
             */
            if (isLastSlide && this.direction === "right") {
                distanceAbs = distanceAbs + this.visibleWidth % this.fullCellWidth;
            }
            var length = Math.floor(distanceAbs / this.fullCellWidth);
            if (distanceAbs % this.fullCellWidth >= this.minSwipeDistance) {
                length++;
            }
            return length;
        };
        Slide.prototype.getDistanceAbs = function () {
            return Math.abs(this.initialPositionX - this.currentPositionX);
        };
        Slide.prototype.getDirection = function () {
            var direction = Math.sign(this.initialPositionX - this.currentPositionX);
            if (direction === -1) {
                return 'right';
            }
            if (direction === 1) {
                return 'left';
            }
            return undefined;
        };
        Slide.prototype.isSlidesEnd = function (counter) {
            var margin = this.visibleCellsOverflowContainer ? 1 : 0;
            var imageLength = this.images ? this.images.length : this.cells.cellLength;
            if (this.carouselProperties.loop) {
                return false;
            }
            else {
                return (imageLength - counter + margin) < this.numberOfVisibleCells;
            }
        };
        Slide.prototype.isLastSlide = function (counter) {
            return this.isSlidesEnd(counter + 1);
        };
        Slide.prototype.setCounter = function () {
            if (this.direction === 'left') {
                this.counter = this.counter + this.slideLength;
            }
            if (this.direction === 'right') {
                this.counter = this.counter - this.slideLength;
            }
        };
        Slide.prototype.getPositionByIndex = function (_counter) {
            var correction = this.getPositionCorrection(this.counter + this.slideLength);
            var position;
            if (correction !== 0) {
                correction = correction + this.fullCellWidth;
            }
            if (this.direction === 'right') {
                correction = 0;
            }
            if (this.isLightDOM && this.isLightDOMMode(_counter) ||
                this.isLightDOM && this.ifLeftDOMModeAtEnd(_counter)) {
                var initialPosition = this.getPositionWithoutCorrection(this.initialPositionX);
                var counterDifference = _counter - this.counter;
                position = initialPosition - ((counterDifference * this.fullCellWidth) - correction);
            }
            else {
                position = -((_counter * this.fullCellWidth) - correction);
            }
            position = this.provideSafePosition(position);
            return position;
        };
        Slide.prototype.provideSafePosition = function (position) {
            var endPosition = this.container.getEndPosition();
            if (this.direction === 'left') {
                if (position > 0) {
                    position = 0;
                }
            }
            if (this.direction === 'right') {
                if (position < endPosition) {
                    position = endPosition;
                }
            }
            return position;
        };
        Slide.prototype.getPositionWithoutCorrection = function (value) {
            var remainder = Math.round(value) % this.fullCellWidth;
            if (remainder !== 0) {
                return value - (this.fullCellWidth + remainder);
            }
            else {
                return value;
            }
        };
        Slide.prototype.isNextArrowDisabled = function () {
            return this.isLastSlide(this.counter) ||
                (!this.visibleCellsOverflowContainer && this.cellLength <= this.numberOfVisibleCells) ||
                (this.visibleCellsOverflowContainer && this.cellLength < this.numberOfVisibleCells);
        };
        Slide.prototype.isPrevArrowDisabled = function () {
            return this.counter === 0;
        };
        Slide.prototype.alignContainerFast = function () {
            if (this.isLightDOMMode(this.counter)) {
                var positionX = this.fixedContainerPosition;
                this.container.transformPositionX(positionX, 0);
                this.cells.setCounter(this.counter);
                this.cells.lineUp();
            }
            else if (this.ifLeftDOMModeToBeginning(this.counter)) {
                /* If we have already exited the light DOM mode but
                 * the cells are still out of place
                 */
                if (this.cells.ifSequenceOfCellsIsChanged()) {
                    var positionX = -(this.counter * this.fullCellWidth);
                    this.container.transformPositionX(positionX, 0);
                    this.cells.setCounter(this.counter);
                    this.cells.lineUp();
                }
            }
            else if (this.ifLeftDOMModeAtEnd(this.counter)) {
                var containerPositionX = this.container.getCurrentPositionX();
                var containerWidth = this.container.getWidth();
                this.visibleWidth;
                if (this.isLastSlide(this.counter) &&
                    containerWidth + containerPositionX >= this.visibleWidth) {
                    return;
                }
                var correction = this.getPositionCorrection(this.counter);
                if (correction !== 0) {
                    correction = correction + this.fullCellWidth;
                }
                if (this.direction === 'right') {
                    correction = 0;
                }
                var positionX = this.fixedContainerPosition + correction;
                this.container.transformPositionX(positionX, 0);
                this.cells.setCounter(this.counter);
                this.cells.lineUp();
            }
        };
        Slide.prototype.isLightDOMMode = function (counter) {
            var flag;
            var remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;
            if (!this.isLightDOM) {
                return false;
            }
            if (counter > this.overflowCellsLimit && this.direction === "left" &&
                counter <= remainderOfCells) {
                flag = true;
            }
            if (counter >= this.overflowCellsLimit && this.direction === "right" &&
                counter < remainderOfCells) {
                flag = true;
            }
            if (this.counter > this.overflowCellsLimit && this.direction === "left" &&
                this.counter <= remainderOfCells) {
                flag = true;
            }
            if (this.counter >= this.overflowCellsLimit && this.direction === "right" &&
                this.counter < remainderOfCells) {
                flag = true;
            }
            return flag;
        };
        Slide.prototype.ifLeftDOMModeAtEnd = function (counter) {
            var flag;
            var remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;
            if (counter >= remainderOfCells) {
                flag = true;
            }
            if (this.counter >= remainderOfCells) {
                flag = true;
            }
            return flag;
        };
        Slide.prototype.ifLeftDOMModeToBeginning = function (counter) {
            var flag;
            if (counter <= this.overflowCellsLimit) {
                flag = true;
            }
            if (this.counter <= this.overflowCellsLimit) {
                flag = true;
            }
            return flag;
        };
        Slide.prototype.setVisibleWidth = function () {
            this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
        };
        return Slide;
    }());

    var Utils = /** @class */ (function () {
        function Utils(carouselProperties) {
            this.carouselProperties = carouselProperties;
        }
        Object.defineProperty(Utils.prototype, "images", {
            get: function () {
                return this.carouselProperties.images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "margin", {
            get: function () {
                return this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "overflowCellsLimit", {
            get: function () {
                if (this.images && this.isImagesLessCellLimit) {
                    var overflowCellsLimit = Math.floor((this.images.length - this.numberOfVisibleCells) / 2);
                    if (overflowCellsLimit < 0) {
                        overflowCellsLimit = 0;
                    }
                    return overflowCellsLimit;
                }
                else {
                    return this.carouselProperties.overflowCellsLimit;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "isImagesLessCellLimit", {
            get: function () {
                return this.carouselProperties.overflowCellsLimit * 2 + this.numberOfVisibleCells > this.images.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "numberOfVisibleCells", {
            get: function () {
                return Math.ceil(this.visibleWidth / this.fullCellWidth);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "visibleCellsOverflowContainer", {
            get: function () {
                return (this.numberOfVisibleCells * this.fullCellWidth - this.margin) > this.visibleWidth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "fullCellWidth", {
            get: function () {
                return this.carouselProperties.cellWidth + this.carouselProperties.margin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Utils.prototype, "visibleWidth", {
            get: function () {
                return this.carouselProperties.visibleWidth || this.carouselProperties.cellsElement.parentElement.clientWidth;
            },
            enumerable: false,
            configurable: true
        });
        Utils.prototype.updateProperties = function (carouselProperties) {
            this.carouselProperties = carouselProperties;
        };
        Utils.prototype.getStartX = function (event) {
            var touches = event.touches;
            var carouselElementPosition = this.getCarouselElementPosition()['left'];
            var startX;
            if (touches) {
                startX = touches[0].clientX - carouselElementPosition;
            }
            else {
                startX = event.clientX - carouselElementPosition;
            }
            return startX;
        };
        Utils.prototype.getMoveX = function (event) {
            var touches = event.touches;
            var carouselElementPositionX = this.getCarouselElementPosition()['left'];
            if (touches) {
                return touches[0].clientX - carouselElementPositionX;
            }
            else {
                return event.clientX - carouselElementPositionX;
            }
        };
        Utils.prototype.getCarouselElementPosition = function () {
            return this.carouselProperties.hostElement.getBoundingClientRect();
        };
        return Utils;
    }());

    var CarouselComponent = /** @class */ (function () {
        function CarouselComponent(elementRef, ref) {
            var _this = this;
            this.elementRef = elementRef;
            this.ref = ref;
            this.minTimeout = 30;
            this.isVideoPlaying = false;
            this._isCounter = false;
            this._cellWidth = 200;
            this._loop = false;
            this._lightDOM = false;
            this.isMoving = false;
            this.isNgContent = false;
            this.events = new core.EventEmitter();
            this.height = 200;
            this.autoplay = false;
            this.autoplayInterval = 5000;
            this.pauseOnHover = true;
            this.dots = false;
            this.margin = 10;
            this.objectFit = 'cover';
            this.minSwipeDistance = 10;
            this.transitionDuration = 200;
            this.transitionTimingFunction = 'ease-out';
            this.counterSeparator = " / ";
            this.overflowCellsLimit = 3;
            this.listeners = 'mouse and touch';
            this.cellsToScroll = 1;
            this.freeScroll = false;
            this.arrows = true;
            this.arrowsOutside = false;
            this.arrowsTheme = 'light';
            this.hostClassCarousel = true;
            this.handleTouchstart = function (event) {
                _this.touches.addEventListeners("mousemove", "handleMousemove");
                _this.carousel.handleTouchstart(event);
                _this.isMoving = true;
            };
            this.handleHorizontalSwipe = function (event) {
                event.preventDefault();
                _this.carousel.handleHorizontalSwipe(event);
            };
            this.handleTouchend = function (event) {
                var touches = event.touches;
                _this.carousel.handleTouchend(event);
                _this.touches.removeEventListeners("mousemove", "handleMousemove");
                _this.isMoving = false;
            };
            this.handleTap = function (event) {
                var outboundEvent = {
                    name: 'click'
                };
                var nodes = Array.prototype.slice.call(_this.cellsElement.children);
                var cellElement = event.srcElement.closest(".carousel-cell");
                var i = nodes.indexOf(cellElement);
                var cellIndex = nodes.indexOf(cellElement);
                if (_this.images) {
                    //outboundEvent.fileIndex = this.carousel.getFileIndex(i);
                    //outboundEvent.file = this.carousel.getFile(cellIndex);
                }
                else {
                    outboundEvent.cellIndex = cellIndex;
                }
            };
        }
        Object.defineProperty(CarouselComponent.prototype, "isContainerLocked", {
            get: function () {
                if (this.carousel) {
                    return this.carousel.isContainerLocked;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "slideCounter", {
            get: function () {
                if (this.carousel) {
                    return this.carousel.slideCounter;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "lapCounter", {
            get: function () {
                if (this.carousel) {
                    return this.carousel.lapCounter;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "isLandscape", {
            get: function () {
                return window.innerWidth > window.innerHeight;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "isSafari", {
            get: function () {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('safari') !== -1) {
                    return !(ua.indexOf('chrome') > -1);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "counter", {
            get: function () {
                var counter;
                if (this.loop) {
                    counter = this.slideCounter % this.cellLength;
                }
                else {
                    counter = this.slideCounter;
                }
                return counter + 1 + this.counterSeparator + this.cellLength;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "cellsElement", {
            get: function () {
                return this.elementRef.nativeElement.querySelector('.carousel-cells');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "isArrows", {
            get: function () {
                return this.arrows && !this.freeScroll;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "isCounter", {
            get: function () {
                return this._isCounter && this.cellLength > 1;
            },
            set: function (value) {
                if (value) {
                    this._isCounter = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "activeDotIndex", {
            get: function () {
                return this.slideCounter % this.cellLength;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "cellLimit", {
            get: function () {
                if (this.carousel) {
                    return this.carousel.cellLimit;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "carouselWidth", {
            get: function () {
                return this.elementRef.nativeElement.clientWidth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "images", {
            get: function () {
                return this._images;
            },
            set: function (images) {
                this._images = images;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "cellWidth", {
            set: function (value) {
                if (value) {
                    this._cellWidth = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "loop", {
            get: function () {
                if (this.images) {
                    return this._loop;
                }
                else {
                    return false;
                }
            },
            set: function (value) {
                if (value) {
                    this._loop = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CarouselComponent.prototype, "lightDOM", {
            get: function () {
                if (this.images) {
                    return this._lightDOM;
                }
                else {
                    return false;
                }
            },
            set: function (value) {
                if (value) {
                    this._lightDOM = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        CarouselComponent.prototype.onWindowResize = function (event) {
            if (this.utils.visibleWidth !== this.savedCarouselWidth) {
                this.resize();
            }
        };
        CarouselComponent.prototype.onMousemove = function (event) {
            if (this.autoplay && this.pauseOnHover) {
                this.carousel.stopAutoplay();
            }
        };
        CarouselComponent.prototype.onMouseleave = function (event) {
            if (this.autoplay && this.pauseOnHover) {
                this.carousel.autoplay();
            }
        };
        CarouselComponent.prototype.ngOnInit = function () {
            this.isNgContent = this.cellsElement.children.length > 0;
            this.touches = new Touches({
                element: this.cellsElement,
                listeners: this.listeners,
                mouseListeners: {
                    "mousedown": "handleMousedown",
                    "mouseup": "handleMouseup"
                }
            });
            this.touches.on('touchstart', this.handleTouchstart);
            this.touches.on('horizontal-swipe', this.handleHorizontalSwipe);
            this.touches.on('touchend', this.handleTouchend);
            this.touches.on('mousedown', this.handleTouchstart);
            this.touches.on('mouseup', this.handleTouchend);
            this.touches.on('tap', this.handleTap);
            this.setDimensions();
        };
        CarouselComponent.prototype.ngAfterViewInit = function () {
            this.initCarousel();
            this.cellLength = this.getCellLength();
            this.dotsArr = Array(this.cellLength).fill(1);
            this.ref.detectChanges();
            this.carousel.lineUpCells();
            this.savedCarouselWidth = this.carouselWidth;
            /* Start detecting changes in the DOM tree */
            this.detectDomChanges();
        };
        CarouselComponent.prototype.ngOnChanges = function (changes) {
            if (changes.width || changes.height || changes.images) {
                this.setDimensions();
                this.initCarousel();
                this.carousel.lineUpCells();
                this.ref.detectChanges();
            }
        };
        CarouselComponent.prototype.ngOnDestroy = function () {
            this.touches.destroy();
            //this.carousel.destroy();
        };
        CarouselComponent.prototype.initCarousel = function () {
            this.carouselProperties = {
                id: this.id,
                cellsElement: this.elementRef.nativeElement.querySelector('.carousel-cells'),
                hostElement: this.elementRef.nativeElement,
                images: this.images,
                cellWidth: this.getCellWidth(),
                loop: this.loop,
                autoplayInterval: this.autoplayInterval,
                overflowCellsLimit: this.overflowCellsLimit,
                visibleWidth: this.width,
                margin: this.margin,
                minSwipeDistance: this.minSwipeDistance,
                transitionDuration: this.transitionDuration,
                transitionTimingFunction: this.transitionTimingFunction,
                videoProperties: this.videoProperties,
                eventHandler: this.events,
                freeScroll: this.freeScroll,
                lightDOM: this.lightDOM
            };
            this.utils = new Utils(this.carouselProperties);
            this.cells = new Cells(this.carouselProperties, this.utils);
            this.container = new Container(this.carouselProperties, this.utils, this.cells);
            this.slide = new Slide(this.carouselProperties, this.utils, this.cells, this.container);
            this.carousel = new Carousel(this.carouselProperties, this.utils, this.cells, this.container, this.slide);
            if (this.autoplay) {
                this.carousel.autoplay();
            }
        };
        CarouselComponent.prototype.resize = function () {
            this.landscapeMode = this.isLandscape;
            this.savedCarouselWidth = this.carouselWidth;
            this.carouselProperties.cellWidth = this.getCellWidth();
            this.cells.updateProperties(this.carouselProperties);
            this.carousel.updateProperties(this.carouselProperties);
            this.container.updateProperties(this.carouselProperties);
            this.slide.updateProperties(this.carouselProperties);
            this.utils.updateProperties(this.carouselProperties);
            this.carousel.lineUpCells();
            this.slide.select(0);
            this.ref.detectChanges();
        };
        CarouselComponent.prototype.detectDomChanges = function () {
            var _this = this;
            var observer = new MutationObserver(function (mutations) {
                _this.onDomChanges();
            });
            var config = {
                attributes: true,
                childList: true,
                characterData: true
            };
            observer.observe(this.cellsElement, config);
        };
        CarouselComponent.prototype.onDomChanges = function () {
            this.cellLength = this.getCellLength();
            this.carousel.lineUpCells();
            this.ref.detectChanges();
        };
        CarouselComponent.prototype.setDimensions = function () {
            this.hostStyleHeight = this.height + 'px';
            this.hostStyleWidth = this.width + 'px';
        };
        CarouselComponent.prototype.getImage = function (index) {
            return this.carousel.getImage(index);
        };
        CarouselComponent.prototype.handleTransitionendCellContainer = function (event) {
            if (event.target['className'] === 'carousel-cells') {
                this.carousel.handleTransitionend();
            }
        };
        CarouselComponent.prototype.getCellWidth = function () {
            var elementWidth = this.carouselWidth;
            if (this.cellsToShow) {
                var margin = this.cellsToShow > 1 ? this.margin : 0;
                var totalMargin = margin * (this.cellsToShow - 1);
                return (elementWidth - totalMargin) / this.cellsToShow;
            }
            if (this._cellWidth === '100%') {
                return elementWidth;
            }
            else {
                return this._cellWidth;
            }
        };
        CarouselComponent.prototype.next = function () {
            this.carousel.next(this.cellsToScroll);
            this.carousel.stopAutoplay();
        };
        CarouselComponent.prototype.prev = function () {
            this.carousel.prev(this.cellsToScroll);
            this.carousel.stopAutoplay();
        };
        CarouselComponent.prototype.isNextArrowDisabled = function () {
            if (this.carousel) {
                return this.carousel.isNextArrowDisabled();
            }
        };
        CarouselComponent.prototype.isPrevArrowDisabled = function () {
            if (this.carousel) {
                return this.carousel.isPrevArrowDisabled();
            }
        };
        CarouselComponent.prototype.getCellLength = function () {
            if (this.images) {
                return this.images.length;
            }
            else {
                return this.cellsElement.children.length;
            }
        };
        return CarouselComponent;
    }());
    CarouselComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'carousel, [carousel]',
                    template: "<div class=\"carousel-counter\" *ngIf=\"isCounter\">{{counter}}</div>\r\n\r\n<div class=\"carousel-container\" [class.carousel-moving]=\"isMoving\">\r\n\t<div class=\"carousel-cells\" #cells (transitionend)=\"handleTransitionendCellContainer($event)\">\r\n\t\t<ng-content></ng-content>\r\n\r\n\t\t<ng-template ngFor let-image [ngForOf]=\"images\" let-i=\"index\">\r\n\t\t\t<div class=\"carousel-cell\" \r\n\t\t\t\t[style.width]=\"getCellWidth()+'px'\"\r\n\t\t\t\t[style.border-radius]=\"borderRadius+'px'\"\r\n\t\t\t\t*ngIf=\"i < cellLimit\">\r\n\t\t\t\t<!-- Image -->\r\n\t\t\t\t<img \r\n\t\t\t\t\t*ngIf=\"getImage(i) && getImage(i)['image']\" \r\n\t\t\t\t\t[src]=\"getImage(i)['image']['path']\"\r\n\t\t\t\t\t[style.object-fit]=\"objectFit\"\r\n\t\t\t\t\tdraggable=\"false\" />\r\n\r\n\t\t\t</div>\r\n\t\t</ng-template>\r\n\t</div>\r\n\r\n\t<div class=\"carousel-dots\" *ngIf=\"dots\">\r\n\t\t<div class=\"carousel-dot\" [class.carousel-dot-active]=\"i === activeDotIndex\" *ngFor=\"let dot of dotsArr; index as i\"></div>\r\n\t</div>\r\n</div>\r\n\r\n<div class=\"carousel-arrows\" \r\n\t[class.carousel-arrows-outside]=\"arrowsOutside\" \r\n\t[class.carousel-dark-arrows]=\"arrowsTheme === 'dark'\"\r\n\t*ngIf=\"isArrows\">\r\n\t\r\n\t<div class=\"carousel-arrow carousel-arrow-prev\" [class.carousel-arrow-disabled]=\"isPrevArrowDisabled()\" (click)=\"prev()\"></div>\r\n\t<div class=\"carousel-arrow carousel-arrow-next\" [class.carousel-arrow-disabled]=\"isNextArrowDisabled()\" (click)=\"next()\"></div>\r\n</div>",
                    styles: [":host{position:relative;display:block;top:0;left:0;width:100%;height:100%;-webkit-user-select:none;user-select:none;z-index:10000;transform-origin:top left;box-sizing:border-box}:host .carousel-container{overflow:hidden;width:100%;height:100%;cursor:grab}:host .carousel-container.carousel-moving{cursor:grabbing}:host .carousel-counter{text-align:right;position:absolute;z-index:30;transition:opacity .2s;top:8px;right:24px;border-radius:13px;background-color:rgba(23,37,68,.3);font-size:11px;color:#fff;padding:5px 7px;line-height:normal}:host ::ng-deep .carousel-cells{transition:transform .2s;width:100%;height:100%;display:block;will-change:transform}:host ::ng-deep .carousel-cells .carousel-cell.swiper-prev-image{transform:translate3d(-100%,0,0)}:host ::ng-deep .carousel-cells .carousel-cell.swiper-next-image{transform:translate3d(100%,0,0)}:host ::ng-deep .carousel-cells .carousel-cell{width:100%;height:100%;position:absolute;overflow:hidden}:host ::ng-deep .carousel-cells .carousel-cell img,:host ::ng-deep .carousel-cells .carousel-cell video{width:100%;height:100%;position:relative;object-fit:contain}:host ::ng-deep .carousel-cells .carousel-cell img.swiper-hide{display:none}:host ::ng-deep .carousel-cells .carousel-cell .carousel-play{position:absolute;top:0;left:0;bottom:0;right:0;z-index:1}:host .carousel-arrow{width:40px;height:40px;background-color:#fff;background-repeat:no-repeat;background-size:31px;background-position:50%;border-radius:100px;position:absolute;top:50%;margin-top:-20px;z-index:10;cursor:pointer;box-shadow:0 0 5px rgba(0,0,0,.15)}:host .carousel-arrow-prev{left:10px;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMTUuNDEgMTYuNTlMMTAuODMgMTJsNC41OC00LjU5TDE0IDZsLTYgNiA2IDYgMS40MS0xLjQxeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)}:host .carousel-arrow-next{right:10px;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNOC41OSAxNi41OUwxMy4xNyAxMiA4LjU5IDcuNDEgMTAgNmw2IDYtNiA2LTEuNDEtMS40MXoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDBWMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=)}:host .carousel-arrows-outside .carousel-arrow-prev{left:-60px}:host .carousel-arrows-outside .carousel-arrow-next{right:-60px}:host .carousel-dark-arrows .carousel-arrow{filter:invert(1)}:host .carousel-arrow-disabled{cursor:default;opacity:.5}:host .carousel-dots{position:absolute;left:0;right:0;bottom:0;z-index:10;text-align:center}:host .carousel-dots .carousel-dot{display:inline-block;border:2px solid #fff;border-radius:100px;margin:4px;width:8px;height:8px}:host .carousel-dots .carousel-dot-active{background-color:#fff}"]
                },] }
    ];
    CarouselComponent.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.ChangeDetectorRef }
    ]; };
    CarouselComponent.propDecorators = {
        events: [{ type: core.Output }],
        id: [{ type: core.Input }],
        height: [{ type: core.Input }],
        width: [{ type: core.Input }],
        autoplay: [{ type: core.Input }],
        autoplayInterval: [{ type: core.Input }],
        pauseOnHover: [{ type: core.Input }],
        dots: [{ type: core.Input }],
        borderRadius: [{ type: core.Input }],
        margin: [{ type: core.Input }],
        objectFit: [{ type: core.Input }],
        minSwipeDistance: [{ type: core.Input }],
        transitionDuration: [{ type: core.Input }],
        transitionTimingFunction: [{ type: core.Input }],
        videoProperties: [{ type: core.Input }],
        counterSeparator: [{ type: core.Input }],
        overflowCellsLimit: [{ type: core.Input }],
        listeners: [{ type: core.Input }],
        cellsToShow: [{ type: core.Input }],
        cellsToScroll: [{ type: core.Input }],
        freeScroll: [{ type: core.Input }],
        arrows: [{ type: core.Input }],
        arrowsOutside: [{ type: core.Input }],
        arrowsTheme: [{ type: core.Input }],
        images: [{ type: core.Input }],
        cellWidth: [{ type: core.Input, args: ['cellWidth',] }],
        isCounter: [{ type: core.Input, args: ['counter',] }],
        loop: [{ type: core.Input, args: ['loop',] }],
        lightDOM: [{ type: core.Input, args: ['lightDOM',] }],
        hostClassCarousel: [{ type: core.HostBinding, args: ['class.carousel',] }],
        hostStyleHeight: [{ type: core.HostBinding, args: ['style.height',] }],
        hostStyleWidth: [{ type: core.HostBinding, args: ['style.width',] }],
        onWindowResize: [{ type: core.HostListener, args: ['window:resize', ['$event'],] }],
        onMousemove: [{ type: core.HostListener, args: ['mousemove', ['$event'],] }],
        onMouseleave: [{ type: core.HostListener, args: ['mouseleave', ['$event'],] }]
    };

    var IvyCarouselModule = /** @class */ (function () {
        function IvyCarouselModule() {
        }
        return IvyCarouselModule;
    }());
    IvyCarouselModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        CarouselComponent
                    ],
                    imports: [
                        common.CommonModule
                    ],
                    exports: [
                        CarouselComponent
                    ],
                    providers: [],
                    bootstrap: [],
                    entryComponents: [
                        CarouselComponent
                    ]
                },] }
    ];

    /*
     * Public API Surface of angular-responsive-carousel
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CarouselComponent = CarouselComponent;
    exports.IvyCarouselModule = IvyCarouselModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-responsive-carousel.umd.js.map