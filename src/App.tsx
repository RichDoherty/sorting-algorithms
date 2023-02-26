import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import styles from './App.module.css';

const App: Component = () => {
    const [numOfBars, setNumOfBars] = createSignal(50);
    const [speed, setSpeed] = createSignal(200);
    const [bars, setBars] = createStore([0]);

    const newBarsArray = () => {
        setBars(Array.from({length: numOfBars()}, () => Math.floor(Math.random() * 98 + 1)));
    }

    newBarsArray();

    const bubbleAnimation = (animations: string[]) => {
        let i = 0;
        let barId = 0;
        let pass = 0;
        const iid = setInterval(() => {
            if (i < animations.length) {
                const bar1 = document.getElementById("bar" + barId.toString());
                const bar2 = document.getElementById("bar" + (barId + 1).toString());
                if (bar1 && bar2 && barId < bars.length - pass - 1) {
                    if (animations[i] === "compare") {
                        bar1.style.backgroundColor = "#f6c177";
                        bar2.style.backgroundColor = "#f6c177";
                    } else if (animations[i] === "first") {
                        bar1.style.backgroundColor = "#eb6f92";
                    } else if (animations[i] === "swap") {
                        setBars(
                            produce((bars) => {
                                [bars[barId], bars[barId+1]] = [bars[barId+1], bars[barId]];
                            }),
                        )
                    } else if (animations[i] === "second") {
                        bar2.style.backgroundColor = "#eb6f92";
                    } else if (animations[i] === "reset") {
                        bar1.style.backgroundColor = "#ebbcba";
                        bar2.style.backgroundColor = "#ebbcba";
                        barId++;
                    } 
                    i++;
                } else {
                    pass++;
                    barId = 0;
                }
            } else {
                clearInterval(iid);
            }
        }, speed());
    }

    const bubbleSort = (arr: number[]) => {
        let sortedArr = Array.from(arr);
        let animations = [];
        for(let i = 0; i < sortedArr.length - 1; i++) {
            for(let j = 0; j < sortedArr.length - i - 1; j++) {
                animations.push("compare");
                if (sortedArr[j] > sortedArr[j + 1]) {
                    animations.push("first");
                    animations.push("swap");
                    [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                } else {
                    animations.push("second");
                }
                animations.push("reset");
            }
        }
        return animations;
    }

    const selectionAnimation = (animations: number[]) => {
        let i = 0;
        let barId = 1;
        let pass = 0;
        let minIndex = 0;
        const iid = setInterval(() => {
            const lastBar = document.getElementById("bar" + (numOfBars() - 1).toString());
            if (i < animations.length) {
                const minBar = document.getElementById("bar" + minIndex.toString());
                const compareBar = document.getElementById("bar" + barId.toString());
                const swapBar = document.getElementById("bar" + pass.toString());
                const prevBar = document.getElementById("bar" + (barId - 1).toString());
                if (minBar && compareBar && barId < bars.length - 1) {
                    if (lastBar) { lastBar.style.backgroundColor = "#ebbcba"; }
                    if (swapBar) { swapBar.style.backgroundColor = "#9ccfd8"; }
                    compareBar.style.backgroundColor = "#f6c177";
                    minBar.style.backgroundColor = "#31748f";
                    if (prevBar && prevBar !== minBar) { prevBar.style.backgroundColor = "#ebbcba"; }
                    if (swapBar && minIndex !== animations[i]) {
                        minBar.style.backgroundColor = "#ebbcba";
                        compareBar.style.backgroundColor = "#31748f";
                        swapBar.style.backgroundColor = "#9ccfd8";
                    }
                    minIndex = animations[i];
                    barId++;
                } else {
                    if (compareBar) { compareBar.style.backgroundColor = "#f6c177"; }
                    if (prevBar) { prevBar.style.backgroundColor = "#ebbcba"; }
                    if (minBar) { minBar.style.backgroundColor = "#ebbcba"; }
                    minIndex = animations[i];
                    setBars(
                        produce((bars) => {
                            [bars[minIndex], bars[pass]] = [bars[pass], bars[minIndex]];
                        }),
                    )
                    pass++;
                    minIndex = pass;
                    barId = 1 + pass;
                }
                i++;
            } else {
                if (lastBar) { lastBar.style.backgroundColor = "#ebbcba"; }
                clearInterval(iid);
            }
        }, speed());
    }

    const selectionSort = (arr: number[]) => {
        let sortedArr = Array.from(arr);
        let animations = [];
        let minIndex = 0;
        for(let i = 0; i < sortedArr.length - 1; i++) {
            minIndex = i;
            for (let j = i + 1; j < sortedArr.length; j++) {
                if (sortedArr[j] < sortedArr[minIndex]) {
                    minIndex = j;
                }
                animations.push(minIndex);
            }
            [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
        }
        return animations;
    }

    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <h1>Sorting Algorithms</h1>
            </header>
            <div id="visualizer" class={styles.visualizer}>
                <For each={bars}>{(bar, i) =>
                    <div
                        id={"bar" + i().toString()}
                        class={styles.bar}
                        style={`height: ${bar}%;
                        width: ${numOfBars()}%;`}
                    >
                    </div>
                }</For>
            </div>
            <div class={styles.input}>
                <label for="numOfBars">Select the number of items to sort (Between 10 and 100):</label>
                <input type="number" id="numOfBars" min="10" max="100" size="3" value={numOfBars().toString()}></input>
                <div id="buttonDiv" class={styles.buttonDiv}>
                    <button class={styles.resetButton} onClick={() => {
                        const val = parseInt((document.getElementById("numOfBars") as HTMLInputElement).value);
                        if (val < 10 || val > 100) {
                            return alert("Number must be between 10 and 100.");
                        }
                        setNumOfBars(val);
                        newBarsArray();
                    }}>Reset</button>
                   <button class={styles.sortButton} onClick={() => {
                        bubbleAnimation(bubbleSort(bars));
                    }}>Bubble Sort</button>
                   <button class={styles.sortButton} onClick={() => {
                        selectionAnimation(selectionSort(bars));
                    }}>Selection Sort</button>
                </div>
            </div>
            <div id="animationSpeedContainer" class={styles.animationSpeedContainer}>
                <input
                    type="range" 
                    id="animationSpeed" 
                    class={styles.animationSpeed} 
                    min="0" 
                    max="2000" 
                    step="100" 
                    value={speed().toString()} 
                    list="speedLabels"
                    onChange={() => {
                        const val = parseInt((document.getElementById("animationSpeed") as HTMLInputElement).value);
                        setSpeed(val);
                    }}></input>
                <datalist id="speedLabels">
                    <option value="0" label="Fast"></option>
                    <option value="2000" label="Slow"></option>
                </datalist>
            </div>
       </div>
    );
};

export default App;
