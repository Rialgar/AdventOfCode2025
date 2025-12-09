import { readLines } from "../utils.mjs";
import { writeFile } from "node:fs/promises";

async function solve (file){
    const lines = (await readLines(file)).map(l => l.split(',').map(n => parseInt(n)));
    
    const firstVertical = (lines[0][1] === lines[1][1]) ? 1 : 0;
    const firstHorizontal = 1-firstVertical;

    function* getVerticalsAtY(y){
        for(let i = firstVertical; i<lines.length; i+=2){
            const cornerBefore = lines[(i + lines.length - 1) % lines.length];
            const cornerA = lines[i];
            const cornerB = lines[(i+1) % lines.length];
            const cornerAfter = lines[(i+2) % lines.length];

            if(cornerA[1] === cornerB[1]){
                throw new Error("oops, looked at a horizontal line");
            }
            // find vertical line segments crossing y (y0 <= y <= y1 || y1 >= y >= y0)
            if((cornerA[1] <= y && y <= cornerB[1]) || (cornerA[1] >= y && y >= cornerB[1])){
                yield [cornerA, cornerB, cornerBefore, cornerAfter];
            }
        }
    }

    function* getHorizontalsAtX(x){
        for(let i = firstHorizontal; i<lines.length; i+=2){
            const cornerBefore = lines[(i + lines.length - 1) % lines.length];
            const cornerA = lines[i];
            const cornerB = lines[(i+1) % lines.length];
            const cornerAfter = lines[(i+2) % lines.length];

            if(cornerA[0] === cornerB[0]){
                throw new Error("oops, looked at a vertical line");
            }
            // find horizontal line segments crossing x (x0 <= x <= x1 || x1 >= x >= x0)
            if((cornerA[0] <= x && x <= cornerB[0]) || (cornerA[0] >= x && x >= cornerB[0])){
                yield [cornerA, cornerB, cornerBefore, cornerAfter];
            }
        }
    }

    // assumptions:
    // 1. corners are given clock wise
    // 2. only vertical and horizontal edges
    // 3. not self intersecting
    function isInside([x, y]){
        let min = Infinity;
        let minSegment = null;
        for(let [cornerA, cornerB] of getVerticalsAtY(y)){
            // of those, find the closest to the left of x (x0 === x1 <= x)
            if(cornerA[0] <= x && x - cornerA[0] < min){
                min = x - cornerA[0];
                minSegment = [cornerA, cornerB];
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
    let rect = {};

    for(let i = 0; i<lines.length-1; i++){
        const tileA = lines[i];
        corners: for(let j = i+1; j<lines.length; j++){
            const tileB = lines[j];

            const area = (Math.abs(tileB[0] - tileA[0]) + 1) * (Math.abs(tileB[1] - tileA[1]) + 1);
            if(area > max){
                const cornerC = [tileA[0], tileB[1]];
                const cornerD = [tileB[0], tileA[1]];
                if(isInside(cornerC) && isInside(cornerD)){
                    const left = Math.min(tileA[0], tileB[0]);
                    const top = Math.min(tileA[1], tileB[1]);
                    const right = Math.max(tileA[0], tileB[0]);
                    const bottom = Math.max(tileA[1], tileB[1]);

                    for(let corner of lines){
                        if(corner[0] > left && corner[0] < right && corner[1] > top && corner[1] < bottom){
                            continue corners;
                        }
                    }

                    // assumption: no immediately adjacent lines (verified: no line of length 1)
                    for(let segment of getHorizontalsAtX(left)){
                        if(segment[0][0] !== left && segment[1][0] !== left && top < segment[0][1] && segment[0][1] < bottom){
                            continue corners;
                        }
                    }
                    for(let segment of getHorizontalsAtX(right)){
                        if(segment[0][0] !== right && segment[1][0] !== right && top < segment[0][1] && segment[0][1] < bottom){
                            continue corners;
                        }
                    }
                    for(let segment of getVerticalsAtY(top)){
                        if(segment[0][1] !== top && segment[1][1] !== top && left < segment[0][0] && segment[0][0] < right){
                            continue corners;
                        }
                    }
                    for(let segment of getVerticalsAtY(bottom)){
                        if(segment[0][1] !== bottom && segment[1][1] !== bottom && left < segment[0][0] && segment[0][0] < right){
                            continue corners;
                        }
                    }

                    // catch some weird corner cases by checking fields offset by one inside the rectangle
                    if(isInside([left+1, top+1]) && isInside([left+1, bottom-1]) && isInside([right-1, top+1]) && isInside([right-1, bottom-1])){
                        max = area;
                        rect = {left, right, top, bottom};
                    }
                }
            }
        }
    }

    console.log(rect);
    console.log(`Solution for ${file} is: `, max);

    let height = 0;
    let width = 0;
    let p = '';
    for(let corner of lines){
        width = Math.max(width, corner[0]);
        height = Math.max(height, corner[1]);
        if(p.length === 0){
            p += 'M';            
        } else {
            p += 'L';
        }
        p +=`${corner[0]} ${corner[1]} `
    }
    height = Math.ceil(height * 1.02);
    width = Math.ceil(width * 1.02);

    let p2 = `M${rect.left} ${rect.top} L${rect.right} ${rect.top} L${rect.right} ${rect.bottom} L${rect.left} ${rect.bottom} Z`

    const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <path d="${p}Z"
            style="fill:green;" />
        <path d="${p2}"
            style="fill:red;fill-opacity:0.8" />
    </svg> `
    writeFile(`${file}.svg`, svg);
}

await solve('./example');
console.log('===')
await solve('./input');