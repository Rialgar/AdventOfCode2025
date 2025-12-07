import { readMap, sumArray } from "../utils.mjs";

async function solve (file){
    const map = await readMap(file);

    const start = map.find(d => d === "S");
    let rays = new Map();
    rays.set(start.x, 1);

    for (let i = 1; i < map.height; i++){
        const newRays = new Map();
        rays.forEach( (num, x) => {
            if(map.get(x, i).data === "^"){
                newRays.set(x-1, (newRays.get(x-1) ?? 0) + num);
                newRays.set(x+1, (newRays.get(x+1) ?? 0) + num);
            } else {
                newRays.set(x, (newRays.get(x) ?? 0) + num);
            }
        })
        rays = newRays;
    }

    console.log(`Solution for ${file} is: `, sumArray(rays.values()));
}

await solve('./example');
console.log('===')
await solve('./input');