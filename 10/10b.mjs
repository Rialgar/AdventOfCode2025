import { readLines, sumArray } from "../utils.mjs";

function logOverwriting(...out){    
    process.stdout.moveCursor(0, -1); // up one line
    process.stdout.clearLine(1); // from cursor to end
    console.log(...out);
}

let nextLog = 0;
function logOverwritingThrottled(...out){
    if(Date.now() > nextLog){
        logOverwriting(...out);
        nextLog = Date.now() + 33;
    }
}

let d = 0;

class State {

    constructor({goal, buttons}){
        this.goal = goal;
        this.buttons = buttons;
        this.buttonsByGoal = new Array(this.goal.length).fill(1).map(() => []);
        for(let i = 0; i < this.buttons.length; i++){
            for(let j = 0; j < this.buttons[i].length; j++){
                this.buttonsByGoal[this.buttons[i][j]].push(i);
            }
        }
    }

    reduce(goalIndex, buttonPresses){
        if(buttonPresses.length !== this.buttonsByGoal[goalIndex].length){
            throw new Error("Can not reduce like this!");
        }
        const newGoal = [...this.goal];
        for(let i = 0; i < buttonPresses.length; i++){
            const button = this.buttons[this.buttonsByGoal[goalIndex][i]];
            for(let j = 0; j < button.length; j++){
                newGoal[button[j]] -= buttonPresses[i];
            }
        }
        if(newGoal[goalIndex] !== 0 ){
            console.error(this, goalIndex, buttonPresses, newGoal);
            throw new Error("Reduce needs to change the goal to 0!");
        }
        if(newGoal.some(n => n<0)){
            return false;
        }
        const newButtons = [];
        for(let i = 0; i < this.buttons.length; i++){
            if(!this.buttonsByGoal[goalIndex].includes(i)){
                newButtons.push(this.buttons[i])
            }
        }
        return new State({
            goal: newGoal,
            buttons: newButtons
        })
    }

    get shortestButtonsByGoalIndex(){
        let minLength = this.buttons.length + 1;
        let minNumForLength = -1;
        let minIndex = -1;
        for(let i = 0; i < this.goal.length; i++){
            // skip solved goals
            if(this.goal[i] > 0){
                if(this.buttonsByGoal[i].length < minLength){
                    minLength = this.buttonsByGoal[i].length;
                    minNumForLength = this.goal[i];
                    minIndex = i;
                } else if(this.buttonsByGoal[i].length == minLength && this.goal[i] < minNumForLength){
                    minNumForLength = this.goal[i];
                    minIndex = i;
                }
            }
        }
        if(minIndex < 0){
            console.error(this);
            throw new Error("oops");
        }
        return minIndex;
    }

    solve() {
        if(this.goal.every(g => g === 0)){
            return 0;
        }
        const goalIndex = this.shortestButtonsByGoalIndex;
        const goal = this.goal[goalIndex];
        const buttons = this.buttonsByGoal[goalIndex];
        if(buttons.length === 0) {
            return false;
        } else {            
            let min = Infinity;
            const attempt = new Array(buttons.length).fill(0);
            attempt[attempt.length-1] = goal;

            function next(){
                let i = attempt.length-1;
                while(i > 0 && attempt[i] === 0){
                    i -= 1;
                }
                if(i == 0){
                    return false;
                }
                attempt[i] = 0;
                attempt[i-1] += 1;
                attempt[attempt.length - 1] = goal - sumArray(attempt);
                return true;
            }

            do {
                if(d === 0){
                    logOverwritingThrottled(goal, buttons, attempt, min);
                }
                const reduced = this.reduce(goalIndex, attempt);
                if(reduced){
                    d += 1;
                    const reducedSolution = reduced.solve();
                    d -= 1;
                    if(reducedSolution !== false){
                        const solution = reducedSolution + goal;
                        if(solution < min){
                            min = solution;
                        }
                    }
                }
            } while (next())
            if(min < Infinity){
                return min;
            }
        }
        return false;
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
        out.buttons.sort((a, b) => b.length - a.length);
        return out;
    })

    let sum = 0;

    machines.forEach((machine, index) => {
        console.log("started machine ", index);
        console.log("...");
        const state = new State(machine);
        const solution = state.solve();
        if(solution === false){
            console.error(state)
            throw new Error("could not solve this state");
        }
        logOverwriting("solved machine ", index, solution);
        sum += solution;
    });
    
    console.log(`Solution for ${file} is: `, sum);
}

await solve('./example');
console.log('===')
await solve('./input');