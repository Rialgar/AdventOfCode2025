import { readChars, readLines } from "../utils.mjs";

async function solve (file){
    const lines = await readChars(file);
    const lastLine = lines[lines.length-1];

    function getNumber(col){
        let num = '';
        for(let i = 0; i < lines.length-1; i++){
            num += lines[i][col];
        }
        return num;
    }

    let sum = 0;    
    let operands = [];
    let operator = '';

    function doProblem(){
        if(operator){
            operands.pop();
            sum += eval(operands.join(operator));            
        }
    }

    for(let i = 0; i < lines[0].length; i++){
        if(lastLine[i] !== ' '){            
            doProblem();
            operands = [];
            operator = lastLine[i];
        }
        operands.push(getNumber(i));
    }
    operands.push('')
    doProblem();

    console.log(`Solution for ${file} is: `, sum);
}

await solve('./example');
console.log('===')
await solve('./input');
