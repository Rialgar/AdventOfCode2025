import { readLines } from "../utils.mjs";


async function solve(file){
    const lines = await readLines(file);
    const ranges = [];
    let count = 0;

    for(let line of lines){
        if(line.length === 0){
            break;
        } else {
            ranges.push(line.split("-").map(n => parseInt(n)));
        }
    }

    const toProcess = [...ranges]
    const processed = [];

    while(toProcess.length > 0){
        let range = toProcess.shift();
        for(let other of processed){
            if(other[0] <= range[0] && range[1] <= other[1]) {
                // o0 <= r0 <= r1 <= o1
                range = false;
                break;
            } else if(range[0] < other[0] && other[0] <= range[1] && range[1] <= other[1]){
                // r0 < o0 <= r1 <= o1
                range[1] = other[0] - 1;
            } else if(other[0] <= range[0] && range[0] <= other[1] && other[1] < range[1]) {
                // o0 <= r0 <= o1 < r1
                range[0] = other[1] + 1;
            } else if(range[0] < other[0] && other[1] < range[1]) {
                // r0 < o0 <= o1 < r1
                toProcess.unshift([range[0], other[0]-1]);
                toProcess.unshift([other[1]+1, range[1]]);
                range = false;
                break;
            } else if(!(range[1] < other[0] || other[1] < range[0])) {
                console.error('missed a case', range, other);
            }
        }
        if(range){
            count += range[1] - range[0] + 1;
            processed.push(range);
        }
    }

    console.log(`Solution for ${file} is: `, count);
}


await solve("./example");
console.log("===");
await solve("./input");