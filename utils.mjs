import fs from 'node:fs/promises';

export async function readLines(file){
    const contents = await fs.readFile(file, {encoding: 'utf8'});
    return contents.split('\n');
}

export async function readChars(file){
    return (await readLines(file)).map(line => line.split(''));
}

export async function readCharsFlat(file){
    return (await readLines(file)).map(line => line.split('')).flat();
}

export function leftPad(v, length, c = ' '){
    v = v.toString();
    while(v.length < length){
        v = c + v;
    }
    return v;
}

export function getOverlap(range, other){
    if(range[0] > overlap[1] || overlap[0] > range[1]){
        return false;
    }
    return [Math.max(range[0], other[0]), Math.min(range[1], other[1])];
}

export function getNonOverlap(range, other){
    if(other[0] <= range[0] && range[1] <= other[1]) {
        // o0 <= r0 <= r1 <= o1
        return [];
    }
    
    if(range[0] < other[0] && other[0] <= range[1] && range[1] <= other[1]){
        // r0 < o0 <= r1 <= o1
        return [[range[0], other[0] - 1]];
    }
    
    if(other[0] <= range[0] && range[0] <= other[1] && other[1] < range[1]) {
        // o0 <= r0 <= o1 < r1
        return [[other[1] + 1, range[1]]];
    }
    
    if(range[0] < other[0] && other[1] < range[1]) {
        // r0 < o0 <= o1 < r1
        return [[range[0], other[0]-1],[other[1]+1, range[1]]];
    }

    return [range];
}

export const north = {x:0, y:-1};
export const east = {x:1, y:0};
export const south = {x:0, y:1};
export const west = {x:-1, y:0};

export const cardinals = [
    north,
    east,
    south,
    west
]

export const diagonals = [
    {x:1, y:-1},
    {x:1, y:1},
    {x:-1, y:1},
    {x:-1, y:-1},    
]

export const directions = [
    {x:0, y:-1},
    {x:1, y:-1},
    {x:1, y:0},    
    {x:1, y:1},
    {x:0, y:1},
    {x:-1, y:1},
    {x:-1, y:0},
    {x:-1, y:-1},    
]

export class Map {
    data = [];
    width = 0;
    height = 0;
    fallback;
    loop = false;

    constructor(data, fallback){
        this.data = data;
        this.height = data.length;
        if(this.height > 0){
            this.width = data[0].length;
        }
        this.fallback = fallback;
    }

    /**
     * @signature `has(x, y)`
     * @param {number} x
     * @param {number} y
     * 
     * @signature `has(pos)`
     * @param {Object} pos
     * @param {number} pos.x
     * @param {number} pos.y
     * @returns boolean
     */
    has(x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;            
        }
        if(x < 0 || x >= this.width || y < 0 || y >= this.height){
            return this.loop || this.fallback;
        }
        return true;
    }

    /**
     * @signature `get(x, y)`
     * @param {number} x
     * @param {number} y
     * 
     * @signature `get(pos)`
     * @param {Object} pos
     * @param {number} pos.x
     * @param {number} pos.y
     * @returns {x: number, y: number, data: ?}
     */
    get(x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;            
        }
        if(x < 0 || x >= this.width || y < 0 || y >= this.height){
            if(this.loop){
                let rx = x % this.width;
                if(rx < 0){
                    rx += this.width;
                }
                let ry = y % this.height;
                if(ry < 0){
                    ry += this.height;
                }
                return {x, y, data: this.data[ry][rx].data};
            } else {
                return {x, y, data: this.fallback};
            }            
        } else {
            return this.data[y][x];
        }
    }

    /**
     * @signature `set(x, y, data)`
     * @param {number} x
     * @param {number} y
     * @param {*} data
     * 
     * @signature `set(pos, data)`
     * @param {Object} pos
     * @param {number} pos.x
     * @param {number} pos.y
     * @param {*} data
     * 
     * @returns {x: number, y: number, data: ?}
     */
    set(x, y, data){
        if(!data && typeof x === 'object'){
            data = y;
            y = x.y;
            x = x.x;            
        }
        if(x < 0 || x >= this.width || y < 0 || y >= this.height){
            throw new Error(`Map index out of bounds: ${x}/${this.width}; ${y}/${this.height}`);
        } else {
            this.data[y][x].data = data;
            return this.data[y][x];
        }
    }

    print( mapper = v => v , prefixMapper = () => ''){
        console.log(this.data.map((row, index) => prefixMapper(row, index) + row.map(({data}) => mapper(data)).join('')).join('\n'));
    }

    find(condition){
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(condition(this.data[y][x].data)){
                    return this.data[y][x];
                }
            }
        }
    }

    findAll(condition){
        const result = [];
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(condition(this.data[y][x].data)){
                    result.push(this.data[y][x]);
                }
            }
        }
        return result;
    }

    neighbours4(x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;            
        }        
        let out = [];
        for(let dir of cardinals){
            const location = add2D({x, y}, dir);
            if(this.has(location)){
                out.push(this.get(location));
            }
        }
        return out;
    }

    neighboursDiagonal(x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;            
        }        
        let out = [];
        for(let dir of diagonals){
            const location = add2D({x, y}, dir);
            if(this.has(location)){
                out.push(this.get(location));
            }
        }
        return out;
    }

    neighbours8(x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;            
        }
        let out = [];
        for(let dir of directions){
            const location = add2D({x, y}, dir);
            if(this.has(location)){
                out.push(this.get(location));
            }
        }
        return out;
    }

    /**
     * 
     * @param {*} center 
     * @param {*} range 
     * @param {*} distFunc can be manhattanDistance or distance. Default is manhattanDistance
     */
    * fieldsInRange(center, range, distFunc = manhattenDistance){
        for(let y = center.y - range; y <= center.y + range; y++) {
            for(let x = center.x - range; x <= center.x + range; x++) {
                if(this.has(x, y) && distFunc(center, {x, y}) <= range){
                    yield this.get(x, y);
                }
            }
        }        
    }

    * iterate(){
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                yield(this.data[y][x]);
            }
        }
    }
}

export async function readMap(file, transform = v => v){
    const data = await readChars(file);
    for(let y = 0; y < data.length; y++) {
        for(let x = 0; x < data[y].length; x++) {
            data[y][x] = {x, y, data: transform(data[y][x])};
        }
    }
    return new Map(data, transform(undefined));
}

export function initArray(size, value){
    const arr = new Array(size);
    for(let i = 0; i < size; i++){
        arr[i] = value;
    }
    return arr;
}

export function initArrayFactory(size, factory){
    const arr = new Array(size);
    for(let i = 0; i < size; i++){
        arr[i] = factory(i);
    }
    return arr;
}

export function initMap(width, height, value, fallback){
    return initMapFactory(width, height, () => value, fallback);
}

export function copyMap(map){
    return initMapFactory(map.width, map.height, (x, y) => map.get(x, y), map.fallback);
}

export function initMapFactory(width, height, factory, fallback){
    const data = [];
    for(let y = 0; y < height; y++) {
        data [y] = [];
        for(let x = 0; x < width; x++) {
            data[y][x] = {x, y, data: factory(x, y)};
        }
    }
    return new Map(data, fallback);
}

export function sumArray(arr){
    return arr.reduce((sum, next) => sum+next, 0);
}

export function multiplyArray(arr){
    return arr.reduce((product, next) => product*next, 1);
}

export function multiplyArray_BigInt(arr){
    return arr.reduce((product, next) => product*BigInt(next), BigInt(1));
}

    /**
     * @param {Array} arr
     * @param {number} i
     * @param {number} j
     * @returns {Array}
     */
export function swapArray(arr, i, j){
    if(i == j){
        return [...arr];
    }
    if(i > j){
        return swapArray(arr, j, i);
    }
    return [...arr.slice(0,i), arr[j], ...arr.slice(i+1, j), arr[i], ...arr.slice(j+1)];
}

const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,1181,1187,1193,1201,1213,1217,1223,1229,1231,1237,1249,1259,1277,1279,1283,1289,1291,1297,1301,1303,1307,1319,1321,1327,1361,1367,1373,1381,1399,1409,1423,1427,1429,1433,1439,1447,1451,1453,1459,1471,1481,1483,1487,1489,1493,1499,1511,1523,1531,1543,1549,1553,1559,1567,1571,1579,1583,1597,1601,1607,1609,1613,1619,1621,1627,1637,1657,1663,1667,1669,1693,1697,1699,1709,1721,1723,1733,1741,1747,1753,1759,1777,1783,1787,1789,1801,1811,1823,1831,1847,1861,1867,1871,1873,1877,1879,1889,1901,1907,1913,1931,1933,1949,1951,1973,1979,1987,1993,1997,1999,2003,2011,2017,2027,2029,2039,2053,2063,2069,2081,2083,2087,2089,2099,2111,2113,2129,2131,2137,2141,2143,2153,2161,2179,2203,2207,2213,2221,2237,2239,2243,2251,2267,2269,2273,2281,2287,2293,2297,2309,2311,2333,2339,2341,2347,2351,2357,2371,2377,2381,2383,2389,2393,2399,2411,2417,2423,2437,2441,2447,2459,2467,2473,2477,2503,2521,2531,2539,2543,2549,2551,2557,2579,2591,2593,2609,2617,2621,2633,2647,2657,2659,2663,2671,2677,2683,2687,2689,2693,2699,2707,2711,2713,2719,2729,2731,2741,2749,2753,2767,2777,2789,2791,2797,2801,2803,2819,2833,2837,2843,2851,2857,2861,2879,2887,2897,2903,2909,2917,2927,2939,2953,2957,2963,2969,2971,2999,3001,3011,3019,3023,3037,3041,3049,3061,3067,3079,3083,3089,3109,3119,3121,3137,3163,3167,3169,3181,3187,3191,3203,3209,3217,3221,3229,3251,3253,3257,3259,3271,3299,3301,3307,3313,3319,3323,3329,3331,3343,3347,3359,3361,3371,3373,3389,3391,3407,3413,3433,3449,3457,3461,3463,3467,3469,3491,3499,3511,3517,3527,3529,3533,3539,3541,3547,3557,3559,3571,3581,3583,3593,3607,3613,3617,3623,3631,3637,3643,3659,3671,3673,3677,3691,3697,3701,3709,3719,3727,3733,3739,3761,3767,3769,3779,3793,3797,3803,3821,3823,3833,3847,3851,3853,3863,3877,3881,3889,3907,3911,3917,3919,3923,3929,3931,3943,3947,3967,3989,4001,4003,4007,4013,4019,4021,4027,4049,4051,4057,4073,4079,4091,4093,4099,4111,4127,4129,4133,4139,4153,4157,4159,4177,4201,4211,4217,4219,4229,4231,4241,4243,4253,4259,4261,4271,4273,4283,4289,4297,4327,4337,4339,4349,4357,4363,4373,4391,4397,4409];


/**
 * returns a list of factors that if multiplied together result in the number given. Can not handle BigInt
 * @param  {number} number
 * @returns {number[]} the list of factors
 */
export function factorize(number){
    let factors = [];
    let num_left = number;
    let primeIndex = 0;
    let limit = Math.sqrt(num_left);
    while(primes[primeIndex] < limit && primeIndex < primes.length){
        const currentPrime = primes[primeIndex];
        if((num_left % currentPrime) === 0){
            num_left = num_left / currentPrime;
            limit = Math.sqrt(num_left);
            factors.push(currentPrime);
        } else {
            primeIndex += 1;
        }
    }
    if(primeIndex >= primes.length){
        console.warn(`Ran out of primes, continuing with every second number to factorize ${num_left}`);
        for(let num = primes[primes.length-1] + 2; num < limit; num += 2){
            if((num_left % num) === 0){
                num_left = num_left / num;
                limit = Math.sqrt(num_left);
                factors.push(num);
            }
        }
    }
    factors.push(num_left);
    return factors;
}

function lcd_2(a, b){
    let larger, smaller;
    if(a > b){
        larger = a;
        smaller = b;
    } else {
        larger = b;
        smaller = a;
    }
    let remainder = larger % smaller;
    while(remainder != 0){ //only one equals sign so you can use it with BigInt        
        larger = smaller;
        smaller = remainder;
        remainder = larger % smaller;
    }
    return smaller;
}

function smc_2(a, b){
    const lcd = lcd_2(a, b);
    return a / lcd * b;
}

/**
 * calculates the largest common divider of a list of numbers, works with BigInt
 * @param  {number[] | BigInt[]} numbers
 * @returns {number | BigInt} the largest common divider
 */
export function largest_common_divider(...numbers){
    if(numbers.length == 0){
        throw new Error('can not calculate lcd of nothing');
    }
    let current = numbers.shift();
    while(numbers.length > 0){
        current = lcd_2(current, numbers.shift());
    }
    return current;
}

/**
 * calculates the smallest common multiple of a list of numbers, works with BigInt
 * @param  {number[] | BigInt[]} numbers
 * @returns {number | BigInt} the smallest common multiple
 */
export function smallest_common_multiple(...numbers){
    if(numbers.length == 0){
        throw new Error('can not calculate scm of nothing');
    }
    let current = numbers.shift();
    while(numbers.length > 0){
        current = smc_2(current, numbers.shift());
    }
    return current;
}

class Bash {
    codes = '';

    of(string){
        return this.codes + string + '\x1b[0m';
    }

    bold(){ this.codes += '\x1b[1m'; return this};
    dim(){ this.codes += '\x1b[2m'; return this};
    underlined(){ this.codes += '\x1b[4m'; return this};
    blink(){ this.codes += '\x1b[5m'; return this};
    inverted(){ this.codes += '\x1b[7m'; return this};

    red(){ this.codes += '\x1b[31m'; return this};
    green(){ this.codes += '\x1b[32m'; return this};
    yellow(){ this.codes += '\x1b[33m'; return this};
    blue(){ this.codes += '\x1b[34m'; return this};
    magenta(){ this.codes += '\x1b[35m'; return this};
    cyan(){ this.codes += '\x1b[36m'; return this};

    bgRed(){ this.codes += '\x1b[41m'; return this};
    bgGreen(){ this.codes += '\x1b[42m'; return this};
    bgYellow(){ this.codes += '\x1b[43m'; return this};
    bgBlue(){ this.codes += '\x1b[44m'; return this};
    bgMagenta(){ this.codes += '\x1b[45m'; return this};
    bgCyan(){ this.codes += '\x1b[46m'; return this};
}

export function bash(){
    return new Bash();
}

export function* select(array, num){
    if(array.length < num){
        return;
    }
    if(num === 0){
        yield [];
        return;
    }
    for(let i = 0; i <= array.length - num; i++){
        for(let subArr of select(array.slice(i+1), num-1)){
            yield [array[i]].concat(subArr);
        }
    }
}

export function findIndexSorted(array, value, comparator){
    if(array.length === 0){
        return 0;
    }

    let minIndex = 0
    let maxIndex = array.length-1;

    if(comparator(value, array[0]) <= 0) { // value <= array[0]
        return 0;
    }

    if(comparator(value, array[maxIndex]) > 0) { // value > array[maxLength]
        return array.length;
    }

    while(minIndex < maxIndex){
        const checkIndex = Math.floor((minIndex + maxIndex)/2);
        if(comparator(value, array[checkIndex]) > 0){ // value > array[checkIndex]
            minIndex = checkIndex+1;
        } else {
            maxIndex = checkIndex;
        }
    }

    return maxIndex;
}

export function insert(array, value, comparator){
    const index = findIndexSorted(array, value, comparator);
    array.splice(index, 0, value);
    return array;
}

/**
 *
 * @param {{x:number, y:number}} a
 * @param {{x:number, y:number}} b
 * @returns number
 */
export function distanceSq(a, b){
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    if(a.z === undefined){    
        return dx*dx + dy*dy;
    }
    const dz = a.z - b.z;
    return dx*dx + dy*dy + dz*dz;
}

/**
 *
 * @param {{x:number, y:number}} a
 * @param {{x:number, y:number}} b
 * @returns number
 */
export function distance(a, b){
    return Math.sqrt(distanceSq(a, b));
}

/**
 *
 * @param {{x:number, y:number}} a
 * @param {{x:number, y:number}} b
 * @returns {number}
 */
export function manhattenDistance(a, b){
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 *
 * @param {Map} map
 * @param {{x: number, y: number}} start
 * @param {{x: number, y: number}} goal
 * @param {{
 *  heuristic: (field: {x:number, y:number, data:?}) => number,
 *  cost:(next: {x:number, y:number, data:?}, fields: [{x:number, y:number, data:?}]) => number,
 *  filter: (fields: [{x:number, y:number, data:?}]) => boolean,
 *  visitedKey: (fields: [{x:number, y:number, data:?}]) => string,
 *  movement_candidates: {x:number, y:number}[],
 *  error_margin: number,
 *  print: boolean
 * }} config
 */
export function a_star(map, start, goal, {
    heuristic = field => manhattenDistance(field, goal),
    cost = () => 1 ,
    filter = () => true,
    visitedKey = tiles => `${tiles[0].x}:${tiles[0].y}`,
    movement_candidates = cardinals,
    error_margin = 0,
    print = true,
}){
    let maxCost = 0;
    const visited = {};

    const paths = [
        {
            fields: [map.get(start.x, start.y)],
            cost: 0
        }
    ];

    const solutions = [];

    while(paths.length > 0){ //will reach 0 if there is no (more) paths to the goal
        const current = paths.shift();

        const currentVisKey = visitedKey(current.fields);
        if(visited[currentVisKey] !== undefined){
            if(error_margin === 0 || visited[currentVisKey] + error_margin < current.cost){
                continue;
            }
        }

        if(solutions.length > 0 && solutions[0].cost + error_margin < current.cost){
            return solutions;
        }

        if(current.cost > maxCost){
            maxCost = current.cost;
            if(print){
                console.log(maxCost);
            }
        }
        const tip = current.fields[0];

        if(tip.x === goal.x && tip.y === goal.y){
            if(error_margin === 0){
                return current;
            } else if(solutions.length > 0 && solutions[0].cost + error_margin < current.cost) {
                return solutions;
            } else {
                solutions.push(current);
                continue;
            }
        }

        for (const candidate of movement_candidates) {
            const next = map.get(tip.x + candidate.x, tip.y + candidate.y);
            const newFields = [next, ... current.fields];

            if(next.data && filter(newFields)){
                const newVisKey = visitedKey(newFields);
                if(error_margin === 0 && visited[newVisKey] !== undefined){
                    continue
                }

                const newPath = {
                    cost: current.cost + cost(next, current.fields),
                    fields : newFields
                }

                if(error_margin > 0 && visited[newVisKey] !== undefined && visited[newVisKey] + error_margin < newPath.cost){
                    continue;
                }

                newPath.fValue = newPath.cost + heuristic(next);
                insert(paths, newPath, (a, b) => a.fValue - b.fValue);
            }
        }

        if(visited[currentVisKey] === undefined){
            visited[currentVisKey] = current.cost;
        }
    }

    if(error_margin > 0){
        return solutions;
    }
}

export function add2D(a, b){
    return {x: a.x+b.x, y: a.y+b.y};
}

export function sub2D(a, b){
    return {x: a.x-b.x, y: a.y-b.y};
}

export function scale2D({x, y}, scale){
    return {x: x*scale, y: y*scale};
}

/**
 *
 * @param {{position: {x:Number, y:Number}, velocity: {x:Number, y:Number}}} line1
 * @param {{position: {x:Number, y:Number}, velocity: {x:Number, y:Number}}} line2
 * @returns {boolean | {position: {x:Number, y:Number}, t1: Number, t2:Number}}
 * false if there is no intersection, true if the line are the same, the intersect position and the times if there is one intersection.
 */
export function intersect2D({position: p1, velocity: v1}, {position: p2, velocity: v2}){    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    if((v1.x === 0 && v1.y === 0) || (v2.x === 0 && v2.y === 0)){
        throw new Error('intersect is ment for lines, not for points!')
    }

    //zeros make live hard later, check them special cases first
    if(v1.x === 0){
        if(v2.x === 0){ // both parallel to x axis            
            return dx === 0; //same line
        }
        //find where line2 intersects x=p1.x
        const t2 = -dx/v2.x;
        const t1 = (dy + t2 * v2.y) / v1.y;
        return {position: {x: p1.x, y: p1.y + t1 * v1.y}, t1, t2};
    }
    
    //line1 is not x-axis alligned
    const climb1 = v1.y / v1.x;

    if(v2.x * climb1 - v2.y === 0){ // parallel lines (without potentially dividing by 0)
        return dx * climb1 === dy; // same line
    }

    const t2 = (dy - dx * climb1) / (v2.x * climb1 - v2.y);
    const t1 = (dx + t2 * v2.x) / v1.x;

    return {position: {x: p1.x + t1 * v1.x, y: p1.y + t1 * v1.y}, t1, t2};
}

export function add3D(a, b){
    return {x: a.x+b.x, y: a.y+b.y, z: a.z+b.z};
}

export function scale3D({x, y, z}, scale){    
    if(typeof x === 'bigint' && typeof scale === 'number'){
        scale = BigInt(scale);
    }
    return {x: x*scale, y: y*scale, z: z*scale};
}

export function scaleInverse3D({x, y, z}, scale){    
    if(typeof x === 'bigint' && typeof scale === 'number'){
        scale = BigInt(scale);
    }
    if( typeof x === 'bigint' && (x % scale !== 0n || y % scale !== 0n || z % scale !== 0n) ){
        console.log(x, y, z, scale, x%scale, y%scale, z%scale);
        throw new Error("Uneven Integer Division!");
    }
    return {x: x/scale, y: y/scale, z: z/scale};
}

export function crossProduct3D(a, b){
    return {
        x: a.y*b.z - a.z*b.y,
        y: a.z*b.x - a.x*b.z,
        z: a.x*b.y - a.y*b.x
    }
}

export function dotProduct3D(a, b){
    return a.x*b.x + a.y*b.y + a.z*b.z;
}

export function vectorLengthSq3D(a){
    return dotProduct3D(a, a);
}

export function vectorLength3D(a){
    return Math.sqrt(dotProduct3D(a, a));
}
// https://math.stackexchange.com/questions/2213165/find-shortest-distance-between-lines-in-3d
export function distanceLines3D({position: p1, velocity: v1}, {position: p2, velocity: v2} ){

    //vector perpendicular to both lines, along which the distance is shortest
    const n = crossProduct3D(v1, v2);
    if(n.x === 0 && n.y === 0 && n.z === 0){
        // https://www.nagwa.com/en/explainers/939127418581/
        // lines are parallel, get distance of p2 to line 1        
        const cross = crossProduct3D(add3D(p2, scale3D(p1, -1)), v1);
        // cross has area of paralellogram with one side being p1->p2 and one being p1->p1+v1
        // that area is ALSO our distance multiplied by v1
        //    p2--.
        //   /|  /|
        //  p1--v1.
        // below is the same as vectorLength3D(cross)/vectorLength3D(v1), but only needing sqrt once
        return Math.sqrt(dotProduct3D(cross, cross)/dotProduct3D(v1, v1));
    }
    // project p2-p1 onto n, correct for length of n
    return Math.abs(dotProduct3D(n, add3D(p2, scale3D(p1, -1))) / vectorLength3D(n));
}

//https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
export function intersectLinePlane3D(l0, l, p0, n){
    if(n.x == 0 && n.y == 0 && n.z == 0){
        console.error("this is not a plane", p0, n);
        throw new Error("this is not a plane");
    }
    if(l.x == 0 && l.y == 0 && l.z == 0){
        console.error("this is not a line", l0, l);
        throw new Error("this is not a line");
    }
    
    const l_dot_n = dotProduct3D(l, n);
    const p0_l0_dot_n = dotProduct3D(add3D(p0, scale3D(l0, -1)), n);
    if(l_dot_n == 0){
        return p0_l0_dot_n == 0;
    }
    if(typeof(p0_l0_dot_n) === 'bigint' && p0_l0_dot_n % l_dot_n != 0){
        console.log(l0, l, p0, n);
        console.log(p0_l0_dot_n, l_dot_n, p0_l0_dot_n % l_dot_n);
        throw new Error("Uneven Integer Division!");
    }
    return p0_l0_dot_n / l_dot_n;
}

export const bigMath = {
    abs(x) {
      return x < 0n ? -x : x
    },
    sign(x) {
      if (x === 0n) return 0n
      return x < 0n ? -1n : 1n
    },
    pow(base, exponent) {
      return base ** exponent
    },
    min(value, ...values) {
      for (const v of values)
        if (v < value) value = v
      return value
    },
    max(value, ...values) {
      for (const v of values)
        if (v > value) value = v
      return value
    },
  }