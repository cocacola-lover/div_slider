"use strict";
// Just some math functions to create nice looking angle distribution;
Object.defineProperty(exports, "__esModule", { value: true });
function createFunctionDistribution(n, exagerate = 1, eps = 0.01) {
    n = (n - 1) / 2;
    let a = -Math.log(eps) / n;
    let b = n + Math.log(a) / a;
    const ansFunction = (x) => {
        if (x === n)
            return 0;
        let calculation = a * Math.exp(a * (Math.abs(x - n) - b));
        if (exagerate > 0) {
            let ans = Math.pow(calculation, 1 / exagerate);
            return x > n ? 90 * ans : -90 * ans;
        }
        else {
            let ans = Math.pow(calculation, -exagerate);
            return x > n ? 90 * ans : -90 * ans;
        }
    };
    return ansFunction;
}
exports.default = createFunctionDistribution;
