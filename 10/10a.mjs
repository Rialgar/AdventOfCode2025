import { readLines } from "../utils.mjs";

class State {

    constructor(machineOrState){
        if(machineOrState instanceof State){
            this.machine = machineOrState.machine;
            this.lights = [...machineOrState.lights];
            this.pushed = [...machineOrState.pushed];
        } else {
            this.machine = machineOrState;
            this.lights = new Array(this.machine.goal.length).fill(false);
            this.pushed = [];
        }
    }

    get done(){
        return this.machine.goal.every((b, i) => this.lights[i] === b);
    }

    push(index){
        if(this.pushed.includes(index)){
            throw new Error("pushed a button twice!");
        }
        this.machine.buttons[index].forEach(light => this.lights[light] = !this.lights[light]);
        this.pushed.push(index);
    }

    get hasUnpushed(){
        return this.pushed.length < this.machine.buttons.length;
    }

    get unpushed() {
        const out = [];
        for(let i = 0; i < this.machine.buttons.length; i++){
            if(!this.pushed.includes(i)){
                out.push(i);
            }
        }
        return out;
    }
}

async function solve (file){
    const machines = (await readLines(file)).map( line => {
        const out = {goal: null, buttons:[]};
        const segments = line.split(" ");
        out.goal = segments[0].substring(1, segments[0].length-1).split("").map(c => c==='#');
        for(let i = 1; i < segments.length-1; i++){
            out.buttons.push(segments[i].substring(1, segments[i].length-1).split(",").map(n => parseInt(n)));
        }
        return out;
    })

    let sum = 0;

    machines: for(let machine of machines){
        const states = [new State(machine)];
        while(states[0].hasUnpushed){
            const state = states.shift();
            for(let index of state.unpushed){
                const nextState = new State(state);
                nextState.push(index);
                if(nextState.done){
                    sum += nextState.pushed.length;
                    continue machines;
                }
                states.push(nextState);
            }
        }
        throw new Error("Found no solution for machine:\n" + JSON.stringify(machine.goal, null, 2));
    }
    
    console.log(`Solution for ${file} is: `, sum);
}

await solve('./example');
console.log('===')
await solve('./input');