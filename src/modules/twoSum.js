import { createRecorder } from '../engine/createRecorder.js';

const code = [
    "def two_sum(arr, target):",          // 0
    "   seen = {} # value -> index",      // 1
    "   for i, x in enumerate(arr):",     // 2
    "       need = target - x",           // 3
    "       if need in seen:",            // 4
    "           return [seen[need], i]",  // 5
    "       seen[x] = i",                 // 6
    "   return []",                       // 7
];

function generateSteps({ arr, target }) {
    const rec = createRecorder();
    const seen = new Map();
    let i = null, x = null, need = null;

    const snap = (line, explain, opts = {}) => {
        const highlights = {};
        for (const idx of seen.values()) highlights[idx] = "visited";
        if (i !== null) highlights[i] = "comparing";
        if (opts.found) {
            highlights[opts.found[0]] = "found";
            highlights[opts.found[1]] = "found";
        }

        const mapHighlights = {};
        if (opts.hitKey !== undefined) mapHighlights[opts.hitKey] = "found";

        rec.snap({
            line,
            explain,
            array: arr,
            map: seen,
            mapHighlights,
            pointers: i === null ?  {} : { i },
            highlights,
            vars: { target, i, i: i ?? "-", x: x ?? "-", need: need ?? "-"},
        })
    };

    snap(1, `Create an empty hash map called "seen." It will remember every number we've passed and where it was, so we'll never need a second loop.`);

    for (i = 0; i < arr.length; i++) {
        x = arr[i];
        need = null;
        snap(2, `Move to index ${i}. The current number is x = ${x}`);

        need = target - x;
        snap(3, `For ${x} to reach the target, we need a value of ${target} - ${x} = ${need}`);
        snap(4, `Have we seen ${need}?`);
        if (seen.has(need)) {
            const j = seen.get(need);
            snap(4, `Yes, we have! We found our pair at indices [${j}, ${i}]. We get our answer in O(1) time because we use a HashMap.`, { hitKey: need })
            const pairs = (arr.length * (arr.length - 1)) / 2;
            snap(5, `One pass through the array is O(N). The reason this is fast is because rather than checking every value against every other (which could be up to ${pairs} comparisons), we look for a specific one from what we've already seen.`, { found: [j, i], hitKey: need });
            return rec.steps;
        }

        snap(4, `No, we haven't. Let's move on and remember this value.`);
        seen.set(x, i);
        snap(6, `We store our current value ${x} in seen so that if a later number needs ${x} it will be instantly available.`);
    }

    i = null; x = null; need = null;
    snap(7, `We iterated through the whole array and didn't find any numbers that added up to ${target}. Luckily, it only required one pass through our array. Return an empty array.`);
    return rec.steps;
}

export const twoSum = {
    id: "two-sum",
    title: "Two Sum",
    problem: "LeetCode 1",
    code,
    defaultInput: { arr: [3, 8, 11, 2, 7, 15], target: 9 },
    generateSteps,
    mapLabel: "seen  (value → index)",
    time: "O(N)",
    space: "O(N)",
}