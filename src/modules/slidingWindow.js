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

function workComparison(n, k) {
    const windows = n - k + 1;
    const slides = n - k;

    if (slides === 0) {
        const noun = k === 1 ? "1 number" : `${k} numbers`;
        return `There is only one place a window of length ${k} can sit, so the loop never slides. Re-summing every window would be this same sum of ${noun}.`;
    }

    if (k === 1) {
        return `k is 1, so re-summing every window is already one read per cell, which is O(n): the work grows with the length of the array. The slide formula is also O(n). The savings show up when k is bigger than 1, because re-summing repeats k reads per window, while a slide still touches only the cell that enters and the cell that leaves.`;
    }

    const naiveReads = windows * k;
    const slideReads = k + 2 * slides;
    return `Re-summing every window touches ${k} cells, ${windows} times: ${naiveReads} cell reads. That cost grows with both the array length and the window length (O(n*k)). We read the first window once (${k} cells), then each of the ${slides} slides reads only the entering cell and the leaving cell: ${slideReads} reads in all. Each slide is a fixed amount of work (O(1)), so the whole pass grows with the array length (O(n)).`;
}

function describeAnswer(arr, k, best, bestStart, windowSum) {
    const n = arr.length;
    const average = (best / k).toFixed(2);
    const cells = arr.slice(bestStart, bestStart + k).join(", ");
    const span = k === 1
        ? `index ${bestStart} (value ${cells})`
        : `indexes ${bestStart} to ${bestStart + k - 1} (values ${cells})`;

    let where;
    if (bestStart === n - k) {
        where = `The green cells are that window, ${span}.`;
    } else if (windowSum === best) {
        where = `The green cells are the earlier window, ${span}. The last window also sums to ${best}, and we kept the earlier one. window still holds that last sum.`;
    } else {
        where = `The green cells are the winning window, ${span}. window holds the last window's sum, ${windowSum}, which did not beat best. The return uses best.`;
    }

    return `The maximum average is ${average}, because ${formatNum(best)} / ${k} = ${average}. ${where} ${workComparison(n, k)}`;
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
    const reuse = k === n
        ? " The window is already the whole array, so this sum is the only candidate and nothing will slide."
        : k === 1
            ? " Each later step replaces that cell: add the new one and subtract this one."
            : " When the window slides, the next total is built from this one, so we never add a whole window again.";
    snap(
        1,
        k === 1
            ? `k is 1, so the first window is a single cell. start and end both sit on index 0, which holds ${arr[0]}. The window sum is ${windowSum}.${reuse}`
            : `The first window is the first ${k} cells, indexes 0 to ${end}. start and end mark its edges. Add those cells once: ${terms} = ${windowSum}. This is the only full sum.${reuse}`
    );

    best = windowSum;
    bestStart = 0;
    snap(
        2,
        `This line copies the window sum into best. best is a sum, not an average. The division waits until the return. This is the only window so far, so best becomes ${windowSum} and bestStart becomes 0, the index where it begins. The Python does not store that index. We keep it so the last step can color the winning cells, and it moves only when a later window is strictly bigger.`
    );

    if (k < n) {
        for (i = k; i < n; i++) {
            leave = i - k;
            enter = i;
            const leaving = arr[leave];
            const entering = arr[enter];
            const stayed = k <= 1
                ? ""
                : k === 2
                    ? "The other cell is in both the old window and the new one, so it is already part of the sum."
                    : `The other ${k - 1} cells are in both the old window and the new one, so they are already part of the sum.`;

            snap(
                3,
                k === 1
                    ? `i moves to ${i}. This line only chooses i, so the sum is still ${windowSum}. k is 1, so the window is a single cell: index ${leave} (value ${leaving}) is about to leave, and index ${enter} (value ${entering}) is about to become the whole window. The sum changes on the next line.`
                    : `i moves to ${i}. This line only chooses i, so the window still covers indexes ${start} to ${end} and the sum is still ${windowSum}. Index ${leave} (value ${leaving}) is about to leave from the left, and index ${enter} (value ${entering}) is about to enter on the right. ${stayed} The sum changes on the next line.`
            );

            const oldSum = windowSum;
            windowSum = oldSum + entering - leaving;
            start = leave + 1;
            end = enter;
            leave = null;
            enter = null;

            const formula = `${formatNum(oldSum)} + ${formatNum(entering)} - ${formatNum(leaving)} = ${windowSum}`;
            const stayedNote = k === 2
                ? "The cell that stayed is already counted, so you do not add it again."
                : "The cells that stayed are already counted, so you do not add them again.";
            if (k === 1) {
                snap(
                    4,
                    `New sum = old + entering - leaving = ${formula}. The windows share nothing when k is 1, so the sum becomes the new cell. The code still does one addition and one subtraction, a fixed amount of work (O(1)). The window is now index ${start}.`
                );
            } else if (i === k) {
                snap(
                    4,
                    `New sum = old + entering - leaving = ${formula}. ${stayedNote} One addition and one subtraction is a fixed amount of work (O(1)), however large k is. Summing this window from scratch would add ${k} numbers again. The window is now indexes ${start} to ${end}.`
                );
            } else {
                snap(
                    4,
                    `New sum = old + entering - leaving = ${formula}. Again, one addition and one subtraction instead of adding the ${k} cells in the window again. The window is now indexes ${start} to ${end}.`
                );
            }

            if (windowSum > best) {
                const previous = best;
                best = windowSum;
                bestStart = start;
                snap(
                    5,
                    `${windowSum} is larger than best (${previous}). max picks the new sum, and bestStart moves to ${start}, where this window begins. max replaces best only when the new sum is strictly larger, so a later tie keeps this window.`
                );
            } else if (windowSum === best) {
                snap(
                    5,
                    `${windowSum} equals best. max keeps the value it already has, so best stays ${best} and bestStart stays ${bestStart}. The earlier window remains the winner.`
                );
            } else {
                snap(
                    5,
                    `${windowSum} is smaller than best (${best}). max keeps ${best}, and bestStart stays ${bestStart}.`
                );
            }
        }
        // Python leaves i on the last value the loop body saw. A JS for-loop
        // increments once more, past the end, so put i back.
        i = n - 1;
    } else {
        snap(
            3,
            `The for-loop would start i at ${k} and stop before len(arr), which is also ${n}. range(${k}, ${n}) is empty, so the body never runs and i stays "-". The window already covers the whole array, so there is no cell on the right to enter and nothing to slide.`
        );
    }

    found = true;
    start = bestStart;
    end = bestStart + k - 1;
    leave = null;
    enter = null;
    snap(6, describeAnswer(arr, k, best, bestStart, windowSum));
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
