import { readLines } from "../utils.mjs";

async function solve (file){
    const lines = (await readLines(file)).map(l => l.split(',').map(n => parseInt(n)));
    
    let max = 0;

    for(let i = 0; i<lines.length-1; i++){
        const tileA = lines[i];
        for(let j = i+1; j<lines.length; j++){
            const tileB = lines[j];
            const area = (Math.abs(tileB[0] - tileA[0]) + 1) * (Math.abs(tileB[1] - tileA[1]) + 1);
            if(area > max){
                max = area;
            }
        }   
    }

    console.log(`Solution for ${file} is: `, max);
}

await solve('./example');
console.log('===')
await solve('./input');