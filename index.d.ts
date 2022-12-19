export default class MySlider {
    private _elementArr;
    private _sliderReference;
    private _angleDistribution;
    private _ms;
    private _margin;
    constructor(elementArr: HTMLDivElement[], window: number, ms?: number, margin?: number);
    private unpackWindow;
    private buildSlider;
    private makeDistributionArray;
    private animateSlideLeft;
    private animateSlideRight;
    slideRightOne(ms?: number, smooth?: number): Promise<unknown>;
    slideRight(n: number, ms?: number, smooth?: number): Promise<void>;
    slideLeftOne(ms?: number, smooth?: number): Promise<unknown>;
    slideLeft(n: number, ms?: number, smooth?: number): Promise<void>;
    show(): HTMLDivElement;
}
