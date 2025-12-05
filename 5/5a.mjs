import { readLines } from "../utils.mjs";


async function solve(file){
    const lines = await readLines(file);
    const ranges = [];
    let count = 0;

    let readingRanges = true;
    for(let line of lines){
        if(readingRanges){
            if(line.length === 0){
                readingRanges = false;
            } else {
                ranges.push(line.split("-").map(n => parseInt(n)));
            }
        } else {
            const num = parseInt(line);
            for(let range of ranges){
                if(range[0] <= num && range[1] >= num){
                    count++;
                    break;
                }
            }
        }
    }
    console.log(`Solution for ${file} is: `, count);
}


await solve("./example");
console.log("===");
await solve("./input");