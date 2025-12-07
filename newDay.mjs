import { mkdir, open, writeFile } from "fs/promises";

let day = process.argv[2];
if(!day){
    console.error('Usage: node newDay.mjs <number>');
    process.exit(1);
}

await mkdir(day);
writeFile(`${day}/input`, '');
writeFile(`${day}/example`, '');
writeFile(`${day}/${day}a.mjs`, `

async function solve (file){
    let sum = 0;

    //TODO

    console.log(\`Solution for \${file} is: \`, sum);
}

await solve('./example');
console.log('===')
await solve('./input');

`.trim());
