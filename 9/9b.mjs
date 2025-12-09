import { readLines } from "../utils.mjs";

async function solve (file){
    const lines = (await readLines(file)).map(l => l.split(',').map(n => parseInt(n)));
    
    const first = (lines[0][1] === lines[1][1]) ? 1 : 0

    // assumptions:
    // 1. corners are given clock wise
    // 2. only vertical and horizontal edges
    // 3. not self intersecting
    function isInside([x, y]){
        let min = Infinity;
        let minSegment = null;
        for(let i = first; i<lines.length; i+=2){
            const cornerA = lines[i];
            const cornerB = lines[(i+1) % lines.length];

            if(cornerA[1] === cornerB[1]){
                throw new Error("oops, looked at a horizontal line");
            }
            // find vertical line segments crossing y (y0 <= y <= y1 || y1 >= y >= y0)
            if((cornerA[1] <= y && y <= cornerB[1]) || (cornerA[1] >= y && y >= cornerB[1])){
                // of those, find the closest to the left of x (x0 === x1 <= x)
                if(cornerA[0] <= x && x - cornerA[0] < min){
                    min = x - cornerA[0];
                    minSegment = [cornerA, cornerB];
                }
            }
        }
        
        // if none exists -> outside
        if(minSegment === null){
            return false;
        }
        // if we are ON it (x0 === x1 === x) -> inside
        if(minSegment[0][0] === x){
            return true;
        }
        // if it points up (y1 < y0) -> inside
        if(minSegment[1][1] < minSegment[0][1]){
            return true;
        }
        // if it points down (y1 > y0) -> outside
        if(minSegment[1][1] > minSegment[0][1]){
            return false;
        }
        throw new Error("We should never get here!");
    }

    let max = 0;

    for(let i = 0; i<lines.length-1; i++){
        const tileA = lines[i];
        for(let j = i+1; j<lines.length; j++){
            const tileB = lines[j];

            const area = (Math.abs(tileB[0] - tileA[0]) + 1) * (Math.abs(tileB[1] - tileA[1]) + 1);
            if(area > max){
                const cornerC = [tileA[0], tileB[1]];
                const cornerD = [tileB[0], tileA[1]];
                if(isInside(cornerC) && isInside(cornerD)){
                    //TODO check edges of rectangle for intersections with polygon
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