import { readMap } from "../utils.mjs";

const map = await readMap("./input");

let count = 0;

for(var field of map.iterate()){
    const neighbors = map.neighbours8(field);
    if(field.data === "@" && neighbors.filter(n => n.data === "@").length < 4){
        count++;
    }
}

console.log(count);