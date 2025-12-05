import { readMap } from "../utils.mjs";

const map = await readMap("./input");

let count = 0;

let stepCount = 1

while(stepCount > 0){
    stepCount = 0;
    let removable = [];
    for(let field of map.iterate()){
        const neighbors = map.neighbours8(field);
        if(field.data === "@" && neighbors.filter(n => n.data === "@").length < 4){
            count++;
            stepCount++;
            removable.push(field);
        }
    }
    for(let rem of removable){
        map.set(rem, '.');
    }
}

console.log(count);