import { readLines } from "../utils.mjs";

const ranges = (await readLines("./input"))[0].split(",").map(r => r.split("-"));

let sum = 0;

function buildNum(part, rep){
    return parseInt(new Array(rep).fill(part).join(''));
}

for(const r of ranges){
    const min = parseInt(r[0]);
    const max = parseInt(r[1]);    
    const done = new Map();

    for(let rep = r[1].length; rep > 1; rep--){
        let part = 0;
        let num = buildNum(part, rep);
        while(num <= max){
            if(num >= min && !done.get(num)){
                sum += num;
                done.set(num, true);
            }
            part++;
            num = buildNum(part, rep);
        }
    }
}

console.log(sum);