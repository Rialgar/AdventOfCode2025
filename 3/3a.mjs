import { readChars } from "../utils.mjs";

const splitLines = await readChars("./input");

let sum = 0;

for(let line of splitLines){
    let max = 0;
    let maxPos = 0;
    for(let i = 0; i<line.length-1; i++){
        const num = parseInt(line[i]);
        if(num > max){
            max = num;
            maxPos = i;
        }
    };
    let result = 10 * max;
    max = 0;
    for(let i = maxPos+1; i<line.length; i++){
        const num = parseInt(line[i]);
        if(num > max){
            max = num;
        }
    };
    result += max;
    sum += result;
}

console.log(sum);