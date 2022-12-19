"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const distribution_1 = __importDefault(require("./distribution"));
const windowed_spinning_array_1 = __importDefault(require("@cocacola-lover/windowed-spinning-array"));
// The elements passed must not include different margin values. If they do include margin values pass 
// these values to the constructor.
// Use smooth in slideRight/slideLeft to make animation smoother. But it should never be more than ms / n
class MySlider {
    constructor(elementArr, window, ms = 1000, margin = 0) {
        this._elementArr = new windowed_spinning_array_1.default(elementArr, window);
        this._margin = margin;
        this._ms = ms;
        this._angleDistribution = this.makeDistributionArray(window + 2, 3);
        this._sliderReference = document.createElement('div');
        this._sliderReference.style.display = 'flex';
        this.buildSlider();
    }
    unpackWindow(arr) {
        // Unpacks window from WindowedSpinningArray into an array;
        const ans = arr.getWindow();
        return [ans.before, ...ans.arr, ans.after];
    }
    buildSlider() {
        // Rotates all element and puts elements into slider
        this._sliderReference.innerHTML = '';
        const elements = this.unpackWindow(this._elementArr);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.translate = '0px';
            elements[i].style.transform = `rotateY(${this._angleDistribution[i]}deg)`;
            this._sliderReference.append(elements[i]);
        }
    }
    makeDistributionArray(n, exagerate = 1) {
        // Makes an array with nice looking angle distribution for slider;
        const ans = Array(n).fill(0);
        const distribution = (0, distribution_1.default)(n, exagerate);
        for (let i = 0; i < n; i++)
            ans[i] = distribution(i);
        return ans;
    }
    animateSlideLeft(ms) {
        const elements = this.unpackWindow(this._elementArr);
        for (let i = 1; i < elements.length; i++) {
            elements[i].style.transitionDuration = `${ms}ms`;
            elements[i].style.translate = `${-(elements[i].offsetWidth + this._margin * 2)}px`;
            elements[i].style.transform = `rotateY(${this._angleDistribution[i - 1]}deg)`;
        }
    }
    animateSlideRight(ms) {
        const elements = this.unpackWindow(this._elementArr);
        for (let i = 0; i < elements.length - 1; i++) {
            elements[i].style.transitionDuration = `${ms}ms`;
            elements[i].style.translate = `${(elements[i].offsetWidth + this._margin * 2)}px`;
            elements[i].style.transform = `rotateY(${this._angleDistribution[i + 1]}deg)`;
        }
    }
    slideRightOne(ms = this._ms, smooth = 0) {
        this.animateSlideRight(ms);
        return new Promise((resolve) => {
            setTimeout(() => {
                this._elementArr.swipeLeft();
                this.buildSlider();
                resolve();
            }, ms - smooth);
        });
    }
    slideRight(n, ms = this._ms, smooth = 50) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < n; i++)
                yield this.slideRightOne(ms / n, smooth);
        });
    }
    slideLeftOne(ms = this._ms, smooth = 0) {
        this.animateSlideLeft(ms);
        return new Promise((resolve) => {
            setTimeout(() => {
                this._elementArr.swipeRight();
                this.buildSlider();
                resolve();
            }, ms - smooth);
        });
    }
    slideLeft(n, ms = this._ms, smooth = 50) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < n; i++)
                yield this.slideLeftOne(ms / n, smooth);
        });
    }
    show() {
        return this._sliderReference;
    }
}
exports.default = MySlider;
