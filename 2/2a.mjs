import { readLines } from "../utils.mjs";

const ranges = (await readLines("./input"))[0].split(",").map(r => r.split("-"));

let sum = 0;

for(const r of ranges){
    const min = parseInt(r[0]);
    const max = parseInt(r[1]);
    let part;
    if(r[0].length%2 === 0){
        part = parseInt(r[0].substring(0, r[0].length/2));
    } else if(r[1].length%2 === 0) {
        part = r[1].substring(0, r[1].length/2).split('');
        for(let i = 1; i < part.length; i++){
            part[i] = "0";
        }
        part = parseInt(part.join(""));
    } else {
        continue;
    }    
    let num = parseInt(`${part}${part}`);
    while(num <= max){
        if(num >= min){
            console.log(r, num);
            sum += num;
        }
        part++;
        num = parseInt(`${part}${part}`);
    }    
}

console.log(sum);