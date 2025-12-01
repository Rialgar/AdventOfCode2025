import { readLines } from "../utils.mjs";

const MODULUS = 100;

const input = await readLines('./input');

let position = 50;
let count = 0;

for (const line of input){
    if(line.length === 0){
        continue;
    }
    let wasZero = (position === 0);
    const num = parseInt(line.substring(1));
    const dir = line.substring(0,1);
    if( dir === "R"){
        position = position + num;
        while(position >= MODULUS){
            position -= MODULUS;
            count++;
        }
    } else if ( dir === "L" ) {
        position = position - num;
        while(position < 0){
            position += MODULUS;
            if(!wasZero){count++};
            wasZero = false;
        }
        if(position === 0){
            count++;
        }
    } else {
        throw new Error("Unexpected direction " + dir);
    }
}

console.log(count);