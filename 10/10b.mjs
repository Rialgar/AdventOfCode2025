import { readLines } from "../utils.mjs";

class State {

    constructor(machineOrState){
        if(machineOrState instanceof State){
            this.machine = machineOrState.machine;
            this.joltage = [...machineOrState.joltage];
            this.pushed = [...machineOrState.pushed];
        } else {
            this.machine = machineOrState;
            this.joltage = new Array(this.machine.goal.length).fill(0);
            this.pushed = [];
        }
    }

    get done(){
        return this.machine.goal.every((j, i) => this.joltage[i] === j);
    }

    push(index){
        this.machine.buttons[index].forEach(j => this.joltage[j] += 1);
        this.pushed.push(index);
    }

    get isOverJolted(){
        return this.machine.goal.some((j, i) => this.joltage[i] > j);
    }
}

async function solve (file){
    const machines = (await readLines(file)).map( line => {
        const out = {goal: null, buttons:[]};
        const segments = line.split(" ");
        out.goal = segments[segments.length-1].substring(1, segments[segments.length-1].length-1).split(",").map(n => parseInt(n));
        for(let i = 1; i < segments.length-1; i++){
            out.buttons.push(segments[i].substring(1, segments[i].length-1).split(",").map(n => parseInt(n)));
        }
        out.buttons.sort((a, b) => a.length - b.length);
        return out;
    })
    let sum = 0;

    machines: for(let machine of machines){
        const states = [new State(machine)];
        while(true){
            // TODO need to follow paths with less joltage left first
            const state = states.shift();
            console.log(state.pushed, state.joltage);
            for(let index = 0; index < machine.buttons.length; index++){
                const nextState = new State(state);
                nextState.push(index);
                if(nextState.done){
                    sum += nextState.pushed.length;
                    continue machines;
                } else if(!nextState.isOverJolted) {
                    states.push(nextState);
                }                
            }
        }        
    }
    
    console.log(`Solution for ${file} is: `, sum);
}

await solve('./example');
console.log('===')
//await solve('./input');