// ----- Parsing -----

// turn the current input into text 
export function toTexts(fields, input) {
    const texts = {};
    for (const f of fields) {
        texts[f.name] = f.type === "array" ? input[f.name].join(", ") : String(input[f.name]);
    }
    return texts;
}

// turn text box into values
export function parseFields(fields, texts) {
    const value = {};
    for (const f of fields) {
        const raw = (texts[f.name] ?? "").trim();

        if (f.type === "array") {
            if (raw === "") return { error: `${f.label} can't be empty.`};
            const nums = raw.split(/[\s,]+/).filter(Boolean).map(Number);
            if (nums.some((n) => !Number.isInteger(n))) {
                return { error: `${f.label} must be whole numbers separated by commas, like 1, 3, 5.` };
            }
            value[f.name] = nums;
        } else {
            const n = Number(raw);
            if (raw === "" || !Number.isInteger(n)) {
                return { error: `${f.label} must be a whole number.` };
            }
            value[f.name] = n;
        }
    }
    return { value };
}

// ----- Validation -----

export const isSorted = (arr) => arr.every((x, i) => i === 0 || arr[i-1] <= x);

// common array checks, returns an error if something wrong or null if it's fine
export function checkArray(arr, { minLen = 1, maxLen = 12, sorted = false } = {}) {
    if (arr.length < minLen) return `Use at least ${minLen} numbers.`;
    if (arr.length > maxLen) return `Use at most ${maxLen} numbers.`;
    if (arr.some((x) => Math.abs(x) > 999)) return "Keep numbers between -999 and 999.";
    if (sorted && !isSorted(arr)) return "This algorithm requires the array to be sorted in ascending order.";
    return null;
}

// ----- Random Input Helpers -----

export const randInt = (low, hi) => low + Math.floor(Math.random() * (hi - low + 1));

// generate a `len` length array with random ints in ascending order
export function randomSorted(len, low, hi) {
    const set = new Set();
    while (set.size < len) set.add(randInt(low, hi));
    return [...set].sort((a, b) => a - b);
}