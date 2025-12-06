import { readLines } from "../utils.mjs";

async function solve (file){
    const lines = (await readLines(file)).map(l => l.split(" ").filter(o => o.length > 0));

    let sum = 0;
    for(let i = 0; i < lines[0].length; i++){
        const operands = [];
        for(let j = 0; j < lines.length-1; j++){
            operands.push(lines[j][i]);            
        }
        sum += eval(operands.join(lines[lines.length-1][i]));
    }

    console.log(`Solution for ${file} is: `, sum);
}

await solve('./example');
console.log('===')
await solve('./input');
