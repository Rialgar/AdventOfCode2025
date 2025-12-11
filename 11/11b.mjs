import { format } from 'path';
import { readLines, sumArray } from '../utils.mjs';

async function solve (file){
    const lines = await readLines(file);
    const connections = {};
    const reverseConnections = {};
    for(let line of lines){
        const [from, targetString] = line.split(':');
        const targetList = targetString.trim().split(' ');
        connections[from] = targetList;
        for(let target of targetList){
            if(!reverseConnections[target]){
                reverseConnections[target] = [];
            }
            reverseConnections[target].push(from);
        }
    }

    const cache = {}
    
    function pathsToTarget(from, to, path = [from]){
        if(!cache[to]){
            cache[to]={[to]: 1};
        }
        if(cache[to][from] !== undefined){
            return cache[to][from];
        } else if (connections[from]) {
            cache[to][from] = sumArray(connections[from].map(next => pathsToTarget(next, to, [...path, next])));
            return cache[to][from];
        } else {
            return 0;
        }
    }

    const svrToFFT = await pathsToTarget('svr', 'fft');
    console.log("svrToFFT", svrToFFT);
    const svrToDAC = await pathsToTarget('svr', 'dac');
    console.log("svrToDAC", svrToDAC);

    const fftToDAC = await pathsToTarget('fft', 'dac');
    console.log("fftToDAC", fftToDAC);
    const dacToFFT = await pathsToTarget('dac', 'fft');
    console.log("dacToFFT", dacToFFT);

    const fftToOut = await pathsToTarget('fft', 'out');
    console.log("fftToOut", fftToOut);
    const dacToOut = await pathsToTarget('dac', 'out');
    console.log("dacToOut", dacToOut);

    console.log(`Solution for ${file} is: `, svrToFFT * fftToDAC * dacToOut);
}

await solve('./example2');
console.log('===')
await solve('./input');