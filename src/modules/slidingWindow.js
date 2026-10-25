import { createRecorder } from "../engine/createRecorder.js";

const code = [
    "def find_max_average(arr, k):",          // 0
    "    window = sum(arr[:k])",              // 1
    "    best = window",                      // 2
    "    for i in range(k, len(arr)):",       // 3
    "        window += arr[i] - arr[i - k]",  // 4
    "        best = max(best, window)",       // 5
    "    return best / k"                     // 6
]

// Parentheses keep negative numbers readable in the explanations: -3 + -1 becomes (-3) + (-1).
function formatNum(value) {
    return value < 0 ? `(${value})` : String(value);
}

function describeAnswer(arr, k, best, bestStart) {
    const n = arr.length;
    const average = (best / k).toFixed(2);
    const where = k === 1
        ? `index ${bestStart}`
        : `indexes ${bestStart} to ${bestStart + k - 1}`;
    const slides = n - k;

    if (slides === 0) {
        const noun = k === 1 ? "1 number" : `${k} numbers`;
        return `The maximum average is ${average} (${formatNum(best)} / ${k}), from the only window. Re-summing is that same sum of ${noun}, since nothing slides.`;
    }

    if (k === 1) {
        return `The maximum average is ${average} (${formatNum(best)} / 1) at ${where}. With k = 1, re-summing is already O(n), and each slide is one add and one subtract.`;
    }

    const naiveReads = (slides + 1) * k;
    const slideReads = k + 2 * slides;
    return `The maximum average is ${average} (${formatNum(best)} / ${k}) at ${where}. Sliding uses ${slideReads} reads versus ${naiveReads}, so the work is O(n) instead of O(n*k).`;
}

function generateSteps({ arr, k }) {
    const rec = createRecorder();
    const n = arr.length;

    // windowSum is the Python variable `window`. bestStart is not in the Python:
    // the code only keeps the best sum. We remember where that window began so
    // the last step can color it. It moves only when a later sum is strictly larger.
    let windowSum = null;
    let best = null;
    let bestStart = null;
    let i = null;
    let start = 0;
    let end = k - 1;
    let leave = null;
    let enter = null;
    let found = false;

    const snap = (line, explain) => {
        const highlights = {};
        for (let idx = start; idx <= end; idx++) {
            highlights[idx] = found ? "found" : "visited";
        }
        if (!found && leave !== null) highlights[leave] = "eliminated";
        if (!found && enter !== null) highlights[enter] = "comparing";

        const pointers = { start, end };
        if (!found && leave !== null) pointers.leave = leave;
        if (!found && enter !== null) pointers.enter = enter;

        rec.snap({
            line,
            explain,
            array: arr,
            pointers,
            highlights,
            vars: {
                k,
                i: i ?? "-",
                window: windowSum ?? "-",
                best: best ?? "-",
                bestStart: bestStart ?? "-",
            },
        });
    };

    windowSum = 0;
    for (let idx = 0; idx < k; idx++) windowSum += arr[idx];
    const terms = arr.slice(0, k).map(formatNum).join(" + ");
    let opening;
    if (k === 1 && k === n) {
        opening = `k is 1, so the only window is index 0, value ${arr[0]}. Its sum is ${windowSum}, and no next cell can slide in.`;
    } else if (k === n) {
        opening = k <= 8
            ? `Indexes 0 to ${end} add up to ${windowSum} (${terms}). The window is the whole array, so nothing slides.`
            : `The first window is the whole array, indexes 0 to ${end}, sum ${windowSum}. Nothing slides, because no cell sits past the end.`;
    } else if (k === 1) {
        opening = `k is 1, so the first window is just index 0, value ${arr[0]}. Each later step adds the new cell and subtracts this one.`;
    } else if (k <= 8) {
        opening = `The first window, indexes 0 to ${end}, sums to ${windowSum} (${terms}). Later slides reuse this total instead of adding every cell.`;
    } else {
        opening = `The first window, indexes 0 to ${end}, sums to ${windowSum}. Later slides reuse this total instead of adding every cell.`;
    }
    snap(1, opening);

    best = windowSum;
    bestStart = 0;
    snap(
        2,
        `best stores the sum ${windowSum}, and we divide by k only at the return. bestStart starts at 0 and moves only when a later sum is strictly larger.`
    );

    if (k < n) {
        for (i = k; i < n; i++) {
            leave = i - k;
            enter = i;
            const leaving = arr[leave];
            const entering = arr[enter];
            const overlap = k === 2
                ? "The other cell stays"
                : `The other ${k - 1} cells stay`;

            snap(
                3,
                k === 1
                    ? `i is ${i}, so index ${leave} (value ${leaving}) leaves and index ${enter} (value ${entering}) becomes the window. The sum is still ${windowSum} until the next line.`
                    : `i is ${i}, so index ${leave} (value ${leaving}) leaves and index ${enter} (value ${entering}) enters. ${overlap}, so the sum is still ${windowSum}.`
            );

            const oldSum = windowSum;
            windowSum = oldSum + entering - leaving;
            start = leave + 1;
            end = enter;
            leave = null;
            enter = null;

            const formula = `${formatNum(oldSum)} + ${formatNum(entering)} - ${formatNum(leaving)} = ${windowSum}`;
            snap(
                4,
                k === 1
                    ? `New sum = ${formula}. With k = 1, that is just the new cell, still one add and one subtract.`
                    : `New sum = ${formula}. One add and one subtract replaces summing all ${k} cells again.`
            );

            if (windowSum > best) {
                const previous = best;
                best = windowSum;
                bestStart = start;
                snap(
                    5,
                    `${windowSum} is larger than best (${previous}), so best becomes ${windowSum} and bestStart moves to ${start}. A later tie will keep this window.`
                );
            } else if (windowSum === best) {
                snap(
                    5,
                    `${windowSum} equals best, so max keeps the earlier window. best stays ${best} and bestStart stays ${bestStart}.`
                );
            } else {
                snap(
                    5,
                    `${windowSum} is smaller than best (${best}), so this window cannot win. max keeps ${best} and bestStart stays ${bestStart}.`
                );
            }
        }
        // Python leaves i on the last value the loop body saw. A JS for-loop
        // increments once more, past the end, so put i back.
        i = n - 1;
    } else {
        snap(
            3,
            `The loop starts i at ${k}, but the array length is also ${n}. That range is empty, so the body never runs and nothing slides.`
        );
    }

    found = true;
    start = bestStart;
    end = bestStart + k - 1;
    leave = null;
    enter = null;
    snap(6, describeAnswer(arr, k, best, bestStart));
    return rec.steps;
}

export const slidingWindow = {
    id: "sliding-window",
    title: "Sliding Window",
    problem: "LeetCode 643",
    code,
    defaultInput: { arr: [2, 1, 5, 1, 3, 2, 6, 1, 4], k: 3 },
    generateSteps,
    time: "O(n)",
    space: "O(1)",
};
