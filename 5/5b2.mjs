import { getNonOverlap, readLines } from "../utils.mjs";


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
            const nonOverlap = getNonOverlap(range, other);
            if(nonOverlap.length == 1){
                range = nonOverlap[0];
            } else {
                toProcess.unshift(...nonOverlap);
                range = false;
                break;
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