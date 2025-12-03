import { readChars } from "../utils.mjs";

const splitLines = await readChars("./input");

const DIGITS = 12;

let sum = 0;

for(let line of splitLines){
    let result = 0;    
    let maxPos = -1;

    for(let digit = 1; digit <= DIGITS; digit++){
        result *= 10;
        let max = 0;
        for(let i = maxPos+1; i<line.length-DIGITS+digit; i++){
            const num = parseInt(line[i]);
            if(num > max){
                max = num;
                maxPos = i;
            }
        };
        result += max;
    }
    sum += result;
}

console.log(sum);