import { readLines, sumArray } from "../utils.mjs";

async function solve (file){
    const lines = await readLines(file);
    const connections = {};
    const reverseConnections = {};
    for(let line of lines){
        const [from, targetString] = line.split(":");
        const targetList = targetString.trim().split(" ");
        connections[from] = targetList;
        for(let target of targetList){
            if(!reverseConnections[target]){
                reverseConnections[target] = [];
            }
            reverseConnections[target].push(from);
        }
    }

    const cache = {"out": 1}
    function pathsToTarget(from){
        if(cache[from]){
            return cache[from];
        } else {
            return sumArray(
                connections[from].map(pathsToTarget)
            )
        }
    }

    console.log(`Solution for ${file} is: `, pathsToTarget("you"));
}

await solve('./example');
console.log('===')
await solve('./input');