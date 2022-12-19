import createFunctionDistribution from "./distribution";
import WindowedSpinningArray from "@cocacola-lover/windowed-spinning-array";

// The elements passed must not include different margin values. If they do include margin values pass 
// these values to the constructor.

// Use smooth in slideRight/slideLeft to make animation smoother. But it should never be more than ms / n

export default class MySlider {

    private _elementArr : WindowedSpinningArray<HTMLDivElement>;
    private _sliderReference : HTMLDivElement;
    private _angleDistribution : number[];
    private _ms : number;
    private _margin : number;

    constructor (elementArr : HTMLDivElement[], window:number, ms: number = 1000, margin : number = 0) {

        this._elementArr = new WindowedSpinningArray(elementArr, window);

        this._margin = margin;
        this._ms = ms;
        this._angleDistribution = this.makeDistributionArray(window + 2, 3);

        this._sliderReference = document.createElement('div'); 
        this._sliderReference.style.display = 'flex';

        this.buildSlider();
    }

    private unpackWindow(arr : WindowedSpinningArray<HTMLDivElement>) {
        // Unpacks window from WindowedSpinningArray into an array;

        const ans = arr.getWindow();

        return [ans.before, ...ans.arr, ans.after];
    }

    private buildSlider () {
        // Rotates all element and puts elements into slider

        this._sliderReference.innerHTML = '';

        const elements = this.unpackWindow( this._elementArr );

        for (let i = 0; i < elements.length; i++) {

            elements[i].style.translate = '0px';
            elements[i].style.transform = `rotateY(${ this._angleDistribution[i] }deg)`;

            this._sliderReference.append(elements[i]);
        }
    }

    private makeDistributionArray(n : number, exagerate: number = 1) {
        // Makes an array with nice looking angle distribution for slider;

        const ans = Array(n).fill(0);
        const distribution = createFunctionDistribution(n, exagerate);

        for (let i = 0; i < n; i++) ans[i] = distribution(i);

        return ans;
    }

    private animateSlideLeft(ms : number) {

        const elements = this.unpackWindow( this._elementArr );

        for (let i = 1; i < elements.length; i++) {
            elements[i].style.transitionDuration = `${ms}ms`;

            elements[i].style.translate = `${ -(elements[i].offsetWidth + this._margin * 2)}px`;
            elements[i].style.transform = `rotateY(${ this._angleDistribution[i-1] }deg)`;
        }
    }

    private animateSlideRight(ms : number) {

        const elements = this.unpackWindow( this._elementArr );

        for (let i = 0; i < elements.length - 1; i++) {
            elements[i].style.transitionDuration = `${ms}ms`;

            elements[i].style.translate = `${ (elements[i].offsetWidth + this._margin * 2)}px`;
            elements[i].style.transform = `rotateY(${ this._angleDistribution[i+1] }deg)`;
        }
    }

    slideRightOne(ms : number = this._ms, smooth : number = 0) {
        this.animateSlideRight(ms);

        return new Promise((resolve : any) => {

            setTimeout( () => {
                this._elementArr.swipeLeft();

                this.buildSlider();    
                resolve();
            }, ms - smooth)

        })
    }

    async slideRight(n : number, ms : number = this._ms, smooth : number = 50) {

        for (let i = 0; i < n; i++) await this.slideRightOne(ms / n, smooth);
    }

    slideLeftOne(ms : number = this._ms, smooth : number = 0) {
        this.animateSlideLeft(ms);

        return new Promise((resolve : any) => {

            setTimeout( () => {
                this._elementArr.swipeRight();

                this.buildSlider();    
                resolve();
            }, ms - smooth)

        })
    }
    async slideLeft(n : number, ms : number = this._ms, smooth : number = 50) {

        for (let i = 0; i < n; i++) await this.slideLeftOne(ms / n, smooth);
    }

    show () {
        return this._sliderReference;
    }
}