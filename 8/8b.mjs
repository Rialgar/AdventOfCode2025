import { distanceSq, multiplyArray, readLines } from "../utils.mjs";

function closestInSegment(segment, box){
    let minSq = Number.MAX_SAFE_INTEGER;
    let closest = null;
    for(let segBox of segment){
        const distSq = distanceSq(segBox, box);
        if( distSq < minSq){
            minSq = distSq;
            closest = segBox;
        }
    }
    return {box: closest, distSq: minSq};
}

async function solve (file, connectionCount){
    const boxes = (await readLines(file))
        .map(line => line.split(',').map(pos => parseInt(pos)))
        .map(([x, y, z]) => ({x, y, z, connections:[]}));
    const segments = boxes.map(b => [b]);


    let boxA = null;
    let boxB = null;
    while(segments.length > 1){
        console.log(segments.length);
        let minSq = Number.MAX_SAFE_INTEGER;
        let segA = null;        
        let segB = null;        

        for (let segIndexOne = 0; segIndexOne < segments.length; segIndexOne++){
            for (let segIndexTwo = segIndexOne+1; segIndexTwo < segments.length; segIndexTwo++){
                for(let boxOne of segments[segIndexOne]){                    
                    const {box: boxTwo, distSq} = closestInSegment(segments[segIndexTwo], boxOne);
                    if(distSq < minSq){
                        minSq = distSq;
                        segA = segments[segIndexOne];
                        boxA = boxOne;
                        segB = segments[segIndexTwo];
                        boxB = boxTwo;
                    }
                }                
            }
        }

        segA.push(...segB);
        segments.splice(segments.indexOf(segB), 1);

    }

    console.log(boxA, boxB);

    console.log(`Solution for ${file} is: `, boxA.x * boxB.x);
}

await solve('./example', 10);
console.log('===')
await solve('./input', 1000);