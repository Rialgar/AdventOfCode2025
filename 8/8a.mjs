import { distanceSq, multiplyArray, readLines } from "../utils.mjs";

function closestInSegment(segment, box){
    let minSq = Number.MAX_SAFE_INTEGER;
    let closest = null;
    for(let segBox of segment){
        if(segBox === box){
            continue;
        }
        if(box.connections.includes(segBox)){
            continue;
        }
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

    for(let i = 0; i < connectionCount; i++){
        console.log(i);
        let minSq = Number.MAX_SAFE_INTEGER;
        let segA = null;
        let boxA = null;
        let segB = null;
        let boxB = null;

        for (let segIndexOne = 0; segIndexOne < segments.length; segIndexOne++){
            for (let segIndexTwo = 0; segIndexTwo < segments.length; segIndexTwo++){
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

        boxA.connections.push(boxB);
        boxB.connections.push(boxA);

        if(segA !== segB){
            segA.push(...segB);
            segments.splice(segments.indexOf(segB), 1);
        }

    }

    console.log(`Solution for ${file} is: `, multiplyArray(segments.map(s => s.length).sort((a, b) => b-a).slice(0, 3)));
}

await solve('./example', 10);
console.log('===')
await solve('./input', 1000);