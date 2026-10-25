import { createRecorder } from '../engine/createRecorder.js';
import { randInt } from '../engine/inputs.js';

const code = [
    "def climb_stairs(n):",                 // 0
    "   dp = [0] * (n + 1)",                // 1
    "   dp[0], dp[1] = 1, 1",               // 2
    "   for i in range(2, n + 1):",         // 3
    "       dp[i] = dp[i - 1] + dp[i - 2]", // 4
    "   return dp[n]",                      // 5
];

function naiveCalls(n) {
    if (n <= 1) return n;
    return 1 + naiveCalls(n - 1) + naiveCalls(n - 2);
}

function generateSteps({ n }) {
    const rec = createRecorder();
    const dp = new Array(n + 1).fill(null);
    let i = null;

    const snap = (line, explain, { current = null, sources = [], found = false } = {}) => {
        const highlights = {};
        dp.forEach((v, idx) => {
            if (v !== null) highlights[idx] = "visited";
        });
        sources.forEach((idx) => {
            highlights[idx] = "source";
        });
        if (current !== null) highlights[current] = found ? "found" : "comparing";

        const pointers = {};
        if (current !== null) pointers.i = current;
        if (sources.length === 2) {
            pointers["i-1"] = sources[0];
            pointers["i-2"] = sources[1];
        }

        rec.snap({
            line,
            explain,
            array: dp.map((v) => (v === null ? "?" : v)),
            pointers,
            highlights,
            vars: {
                n,
                i: i ?? "-",
                "dp[i-1]": i !== null && i >= 2 ? dp[i-1] : "-",
                "dp[i-2]": i !== null && i >= 2 ? dp[i-2] : "-",
                "dp[i]": i !== null && dp[i] !== null ? dp[i] : "-",
            },
        });
    };

    snap(1, `Make a table where dp[i] = the number of ways to reach stair i. The box numbers are the stairs. Nothing solved yet. In this visualization, a zero is put in the array if we don't know the cost to get to it, but in the visualization it is a "?".`);

    dp[0] = 1;
    dp[1] = 1;
    snap(2, `Base cases: 1 way to reach stair 0 (do nothing) and 1 way to reach stair 1 (one step). We build on this.`);

    for (i = 2; i <= n; i++) {
        snap(3, `Stair ${i}: The last move was a 1-step from stair ${i-1} or a 2-step from stair ${i-2}. Due to how our algorithm works, both must already be solved.`, { current: i, sources: [i - 1, i - 2]});

        dp[i] = dp[i - 1] + dp[i - 2];
        snap(4, `The total ways to get to stair ${i} is ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. By reusing answers, we save a TON of time.`, { current: i, sources: [i - 1, i - 2]});
    }

    i = n;
    snap(5, `There are ${dp[n]} ways to get to stair ${n}. Each stair is only solved once due to memoizing our answers. If we used regular recursion, it would take ${naiveCalls(n)} calls!`, { current: i, found: true });
    snap(5, `Note: This looks awful similar to another problem that is just presented differently: finding the numbers of the fibonacci sequence!`);
    return rec.steps;
}

export const climbingStairs = {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    problem: "LeetCode 70",
    code,
    defaultInput: { n: 8 },
    generateSteps,
    time: "O(N)",
    space: "O(N)",
    inputFields: [
        { name: "n", label: "Stairs n", type: "number" },
    ],
    validateInput: ({ n }) => 
        n < 1 || n > 12 ? "n must be between 1 and 12 so the table fits on screen." : null,
    randomInput: () => ({ n: randInt(5, 10) }),
};