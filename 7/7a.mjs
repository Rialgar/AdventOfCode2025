import { readMap } from "../utils.mjs";

async function solve (file){
    const map = await readMap(file);

    const start = map.find(d => d === "S");
    let rays = [start.x];

    let count = 0;

    for (let i = 1; i < map.height; i++){
        const newRays = new Set();
        rays.forEach( x => {
            if(map.get(x, i).data === "^"){
                count++;
                newRays.add(x-1);
                newRays.add(x+1);
            } else {
                newRays.add(x);
            }
        })
        rays = newRays;
    }

    console.log(`Solution for ${file} is: `, count);
}

await solve('./example');
console.log('===')
await solve('./input');