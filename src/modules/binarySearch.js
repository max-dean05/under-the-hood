import { createRecorder } from "../engine/createRecorder.js";

const code = [
    "def binary_search(arr, target):",  // 0
    "    low = 0",                      // 1
    "    high = len(arr) - 1",          // 2
    "    while low <= high:",           // 3
    "        mid = (low + high)",       // 4
    "        if arr[mid] == target:",   // 5
    "            return mid",           // 6
    "        elif arr[mid] < target:",  // 7
    "            low = mid + 1",        // 8
    "        else:",                    // 9
    "            high = mid - 1",       // 10
    "    return -1"                     // 11
]

function highlightsFor(n, lo, mid, hi, found) {
    const h = {};
    for (let i = 0; i < n; i++) {
        if (i < lo || i > hi) h[i] = 'eliminated';
    }
    if (mid !== null) h[mid] = found ? 'found' : 'comparing';
    return h;
}

function generateSteps({ arr, target }) {
    const rec = createRecorder();
    let low = 0, hi = arr.length - 1, mid = null, checks = 0;

    // save a snapshot of the current state
    const snap = (line, explain, found = false) => 
        rec.snap({
            line,
            explain,
            array: arr,
            pointers: mid === null ? { low, hi } : { low, mid, hi },
            highlights: highlightsFor(arr.length, low, mid, hi, found),
            vars: { target, low, mid: mid ?? "-", hi, checks },
        })

    snap([1, 2], 'The search begins with the entire array. The low pointer is ' + 
        'at index 0 and the high pointer is at the last index. This only works if the array is sorted in ascending order.');
    
    
    while (low <= hi) {
        snap(3, `Low (${low}) is still less than or equal to high (${hi}), so we continue searching.`);

        mid = Math.floor((low + hi) / 2);
        checks++;
        snap(4, `Look at the middle of the range: index = ${mid}, value is ${arr[mid]}.`);
        if (arr[mid] === target) {
            snap(5, `Found the target at index ${mid}!`, true);
            snap(6, `Return our current index (${mid}).`, true)
            return rec.steps;
        } else if (arr[mid] < target) {
            snap(7, `The value at index ${mid} is less than the target.`);
            low = mid + 1;
            mid = null;
            snap(8, 'We will search the right half and discard the left half.');
        } else {
            snap(9, `The value at index ${mid} is greater than the target.`);
            hi = mid - 1;
            mid = null;
            snap(10, 'We will search the left half and discard the right half.');
        }

    }
    snap(11, 'The target is not in the array.');
    return rec.steps;
}

export const binarySearch = {
    id: "binary-search",
    title: "Binary Search",
    problem: "LeetCode 704",
    code,
    defaultInput: { arr: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 3 },
    generateSteps,
    time: "O(log(N))",
    space: "O(1)",
};