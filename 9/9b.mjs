import { readLines } from "../utils.mjs";

async function solve (file){
    const lines = (await readLines(file)).map(l => l.split(',').map(n => parseInt(n)));
    
    // assumptions:
    // 1. corners are given clock wise
    // 2. only vertical and horizontal edges
    // 3. not self intersecting
    function isInside([x, y]){
        // find vertical line segments crossing y (y0 <= y <= y1 || (y1 >= y >= y0))
        // of those, find the closest to the left of x (x0 === x1 <= x)

        // if none exists -> outside
        // if we are ON it (x0 === x1 === x) -> inside
        // if it points up (y1 < y0) -> inside
        // if it points down (y1 > y0) -> outside
    }

    let max = 0;

    for(let i = 0; i<lines.length-1; i++){
        const tileA = lines[i];
        for(let j = i+1; j<lines.length; j++){
            const tileB = lines[j];

            const cornerC = [tileA[0], tileB[1]];
            const cornerD = [tileA[1], tileB[0]];

            if(isInside(cornerC) && isInside(cornerD)){
                const area = (Math.abs(tileB[0] - tileA[0]) + 1) * (Math.abs(tileB[1] - tileA[1]) + 1);
                if(area > max){
                    max = area;
                }
            }
        }
    }

    console.log(`Solution for ${file} is: `, max);
}

await solve('./example');
console.log('===')
await solve('./input');