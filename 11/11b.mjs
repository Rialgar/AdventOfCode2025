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
    const pending = {}
    
    async function pathsToTarget(from, to, path = []){
        if(!cache[to]){
            cache[to]={[to]: 1};
            pending[to] = {};
        }
        if(cache[to][from]){
            return cache[to][from];
        } else if (connections[from]) {
            if(!pending[to][from]){                  
                pending[to][from] = Promise.all(
                    connections[from].map(next => pathsToTarget(next, to, [...path, from]))
                ).then(a => {
                    return sumArray(a)
                });
            } else {
                console.log(from, to, path);
            }
            cache[to][from] = await pending[to][from];
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