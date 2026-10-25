import { createRecorder } from "../engine/createRecorder.js";
import { checkArray, randInt } from "../engine/inputs.js";

const code = [
    "def move_zeroes(arr):",                                     // 0
    "   write = 0",                                              // 1
    "   for read in range(len(arr)):",                           // 2
    "       if arr[read] != 0:",                                 // 3
    "           arr[write], arr[read] = arr[read], arr[write]",  // 4
    "           write += 1",                                     // 5
    "   return arr",                                             // 6
];

function generateSteps({ arr }) {
    const rec = createRecorder();
    const a = [...arr];
    const n = a.length;

    let write = 0;
    let read = null;
    let swaps = 0;
    let done = false;

    const snap = (line, explain, pair = null) => {
        const highlights = {};
        const pointers = {};

        if (done) {
            a.forEach((v, idx) => {
                highlights[idx] = v !== 0 ? "found" : "eliminated";
            });
        } else {
            for (let idx = 0; idx < write; idx++) highlights[idx] = "visited";
            if (read !== null) {
                for (let idx = write; idx < read; idx++) highlights[idx] = "eliminated";
                highlights[read] = "comparing";
            }
            if (pair) {
                highlights[pair[0]] = "comparing";
                highlights[pair[1]] = "comparing";
            }
            pointers.write = write;
            if (read !== null) pointers.read = read;
        }

        rec.snap({
        line,
        explain,
        array: a,
        pointers,
        highlights,
        vars: {
            read: read ?? "-",
            write,
            "arr[read]": read !== null ? a[read] : "-",
            swaps,
        },
    });
    };

    snap(1, `Keep a pointer of where the next non-zero number should be.`);

    for (read = 0; read < n; read++) {
        if (a[read] === 0) {
            snap([2, 3], `The element at index ${read} is a zero, so we ignore it.`);
            continue;
        }

        if (read === write) {
            snap([2, 3], `We find a non-zero number (${a[read]}) at index ${read}. However, it's where it should be, so it stays.`);
        } else {
            snap([2, 3], `We find a non-zero number (${a[read]}) at index ${read}. We put it where the next non-zero number should be, at index ${write}`, [write, read]);
            [a[write], a[read]] = [a[read], a[write]];
            swaps++;
            snap(4, `Swap our non-zero number with the earliest zero available, swapping index ${write} with index ${read}.`, [write, read]);
        }

        write++;
        snap(5, `Move our write index up to ${write}, as everything to the left of it does not have any zeroes.`);
    }

    read = null;
    done = true;
    const zeroes = a.filter((v) => v === 0).length;
    snap(6, `${zeroes === 1 ? "The zero is" : "The zeroes are"} at the end, and our non-zero numbers kept their original order. We iterated through the array once and made ${swaps} swap${swaps === 1 ? "" : "s"} with no extra array.`);

    return rec.steps;
}

export const moveZeroes = {
    id: "move-zeroes",
    title: "Move Zeroes",
    problem: "LeetCode 283",
    code,
    defaultInput: { arr: [0, 1, 0, 3, 12, 0 , 5] },
    generateSteps,
    time: "O(N)",
    space: "O(1)",
    idea: "A write pointer marks where the next non-zero belongs. Each non-zero gets swapped forward to it, so finished numbers pile up on the left and zeros drift to the back, all in place.",
    inputFields: [
        { name: "arr", label: "Array", type: "array"},
    ],
    validateInput: ({ arr }) => checkArray(arr),
    randomInput: () => ({
        // about 40% zeroes, to ensure always something to swap
        arr: Array.from({ length: randInt(7, 10) }, () => (Math.random() < 0.4 ? 0: randInt(1, 20))),
    }),
}