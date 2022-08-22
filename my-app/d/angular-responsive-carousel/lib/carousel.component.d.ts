import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { Images } from './interfaces';
import { Properties as CarouselProperties } from './interfaces';
import * as ɵngcc0 from '@angular/core';
export declare class CarouselComponent implements OnDestroy {
    private elementRef;
    private ref;
    carousel: any;
    container: any;
    utils: any;
    cells: any;
    slide: any;
    _id: string;
    _images: Images;
    touches: any;
    landscapeMode: any;
    minTimeout: number;
    isVideoPlaying: boolean;
    _isCounter: boolean;
    _width: number;
    _cellWidth: number | '100%';
    _loop: boolean;
    _lightDOM: boolean;
    isMoving: boolean;
    isNgContent: boolean;
    cellLength: number;
    dotsArr: any;
    carouselProperties: CarouselProperties;
    savedCarouselWidth: number;
    get isContainerLocked(): any;
    get slideCounter(): any;
    get lapCounter(): any;
    get isLandscape(): boolean;
    get isSafari(): any;
    get counter(): string;
    get cellsElement(): any;
    get isArrows(): boolean;
    get isCounter(): boolean;
    get activeDotIndex(): number;
    get cellLimit(): any;
    get carouselWidth(): any;
    events: EventEmitter<any>;
    id: number;
    height: number;
    width: number;
    autoplay: boolean;
    autoplayInterval: number;
    pauseOnHover: boolean;
    dots: boolean;
    borderRadius: number;
    margin: number;
    objectFit: 'contain' | 'cover' | 'none';
    minSwipeDistance: number;
    transitionDuration: number;
    transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    videoProperties: any;
    counterSeparator: string;
    overflowCellsLimit: number;
    listeners: 'auto' | 'mouse and touch';
    cellsToShow: number;
    cellsToScroll: number;
    freeScroll: boolean;
    arrows: boolean;
    arrowsOutside: boolean;
    arrowsTheme: 'light' | 'dark';
    set images(images: Images & any);
    get images(): Images & any;
    set cellWidth(value: number | '100%');
    set isCounter(value: boolean);
    set loop(value: boolean);
    get loop(): boolean;
    set lightDOM(value: boolean);
    get lightDOM(): boolean;
    hostClassCarousel: boolean;
    hostStyleHeight: string;
    hostStyleWidth: string;
    onWindowResize(event: any): void;
    onMousemove(event: MouseEvent): void;
    onMouseleave(event: MouseEvent): void;
    constructor(elementRef: ElementRef, ref: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    initCarousel(): void;
    resize(): void;
    detectDomChanges(): void;
    onDomChanges(): void;
    setDimensions(): void;
    getImage(index: number): any;
    handleTouchstart: (event: any) => void;
    handleHorizontalSwipe: (event: any) => void;
    handleTouchend: (event: any) => void;
    handleTap: (event: any) => void;
    handleTransitionendCellContainer(event: any): void;
    getCellWidth(): any;
    next(): void;
    prev(): void;
    isNextArrowDisabled(): any;
    isPrevArrowDisabled(): any;
    getCellLength(): any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CarouselComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CarouselComponent, "carousel, [carousel]", never, { "height": "height"; "autoplay": "autoplay"; "autoplayInterval": "autoplayInterval"; "pauseOnHover": "pauseOnHover"; "dots": "dots"; "margin": "margin"; "objectFit": "objectFit"; "minSwipeDistance": "minSwipeDistance"; "transitionDuration": "transitionDuration"; "transitionTimingFunction": "transitionTimingFunction"; "counterSeparator": "counterSeparator"; "overflowCellsLimit": "overflowCellsLimit"; "listeners": "listeners"; "cellsToScroll": "cellsToScroll"; "freeScroll": "freeScroll"; "arrows": "arrows"; "arrowsOutside": "arrowsOutside"; "arrowsTheme": "arrowsTheme"; "isCounter": "counter"; "images": "images"; "cellWidth": "cellWidth"; "loop": "loop"; "lightDOM": "lightDOM"; "id": "id"; "width": "width"; "borderRadius": "borderRadius"; "videoProperties": "videoProperties"; "cellsToShow": "cellsToShow"; }, { "events": "events"; }, never, ["*"]>;
}

//# sourceMappingURL=carousel.component.d.ts.map