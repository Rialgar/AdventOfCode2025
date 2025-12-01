import { readLines } from "../utils.mjs";

const MODULUS = 100;

const input = await readLines('./input');

let position = 50;
let count = 0;

for (const line of input){
    if(line.length === 0){
        continue;
    }
    const num = parseInt(line.substring(1));
    const dir = line.substring(0,1);
    if( dir === "R"){
        position = (position + num) % MODULUS;
    } else if ( dir === "L" ) {
        position = (position - num) % MODULUS;
        if(position < 0){
            position += MODULUS;
        }
    } else {
        throw new Error("Unexpected direction " + dir);
    }
    if(position === 0){
        count += 1;
    }
}

console.log(count);