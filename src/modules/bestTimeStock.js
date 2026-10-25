import { createRecorder } from "../engine/createRecorder.js";
import { checkArray, randInt } from "../engine/inputs.js";

const code = [
    "def max_profit(arr):",                              // 0
    "    min_price = arr[0]",                            // 1
    "    best = 0",                                      // 2
    "    for i in range(1, len(arr)):",                  // 3
    "        if arr[i] < min_price:",                    // 4
    "            min_price = arr[i]",                    // 5
    "        else:",                                     // 6
    "            best = max(best, arr[i] - min_price)",  // 7
    "    return best"                                    // 8
]

function generateSteps({ arr }) {
    const rec = createRecorder();
    const n = arr.length;

    // buy and sell are not in the Python. They only remember which days
    // produced best, so the last step can color that pair.
    let minPrice = null;
    let minIndex = null;
    let best = null;
    let buy = null;
    let sell = null;
    let i = null;
    let profitToday = null;
    let found = false;

    const snap = (line, explain) => {
        const highlights = {};
        const pointers = {};

        if (found) {
            highlights[buy] = "found";
            highlights[sell] = "found";
            pointers.buy = buy;
            pointers.sell = sell;
        } else {
            if (minIndex !== null) {
                highlights[minIndex] = "visited";
                pointers.min = minIndex;
            }
            if (i !== null) {
                highlights[i] = "comparing";
                pointers.i = i;
            }
        }

        rec.snap({
            line,
            explain,
            array: arr,
            pointers,
            highlights,
            vars: {
                i: i ?? "-",
                min_price: minPrice ?? "-",
                profit_today: profitToday ?? "-",
                best: best ?? "-",
            },
        });
    };

    minPrice = arr[0];
    minIndex = 0;
    best = 0;
    snap([1, 2], `Since we're at the start, day 0 (${arr[0]}) is our cheapest day.`);

    if (n === 1) {
        snap(3, `One price has no later day, so the loop never sells.`);
    } else {
        for (i = 1; i < n; i++) {
            profitToday = null;
            snap(3, `Day ${i}: the price is ${arr[i]}. The cheapest earlier price is ${minPrice} (day ${minIndex}).`);

            if (arr[i] < minPrice) {
                minPrice = arr[i];
                minIndex = i;
                snap([4, 5], `${arr[i]} is a new low, so this is now the best day to buy. Because it's less, it cannot be a sale, but it does still help us.`);
            } else {
                const previous = best;
                profitToday = arr[i] - minPrice;
                const formula = `${arr[i]} − ${minPrice} = ${profitToday}`;

                let outcome;
                if (profitToday > best) {
                    best = profitToday;
                    buy = minIndex;
                    sell = i;
                    outcome = previous === 0
                        ? `This is the first profit, best is now ${best}.`
                        : `New best: ${best} beats ${previous}.`;
                } else if (profitToday === best && best === 0) {
                    outcome = `No profit, so best stays 0.`;
                } else if (profitToday === best) {
                    outcome = `That ties best (${best}), so we keep the earlier sale.`;
                } else {
                    outcome = `That's less than best (${best}), so best stays.`;
                }

                snap([6, 7], `Try selling today: ${formula}. ${outcome}`);
            }
        }
        // Python leaves i on the last value the loop body saw. A JS for-loop
        // increments once more, past the end, so put i back.
        i = n - 1;
    }

    const pairs = (n * (n - 1)) / 2;
    if (best > 0) {
        found = true;
        snap(8, `Max profit is ${best}: buy on day ${buy} at ${arr[buy]}, sell on day ${sell} at ${arr[sell]}. Instead of checking all ${pairs} pairs, we do one pass.`);
    } else if (n === 1) {
        snap(8, `Max profit is 0, because there's no later day to sell on.`);
    } else {
        snap(8, `Max profit is 0. No price ever rose above an earlier one, so the best move is not to trade.`);
    }

    return rec.steps;
}

export const bestTimeStock = {
    id: "best-time-stock",
    title: "Buy & Sell Stock",
    problem: "LeetCode 121",
    code,
    defaultInput: { arr: [7, 2, 5, 1, 3, 6, 4, 8] },
    generateSteps,
    time: "O(n)",
    space: "O(1)",
    inputFields: [
        { name: "arr", label: "Prices", type: "array" },
    ],
    validateInput: ({ arr }) =>
        checkArray(arr) ??
        (arr.some((price) => price < 0) ? "Prices can't be negative." : null),
    randomInput: () => {
        const len = randInt(7, 10);
        const arr = Array.from({ length: len }, () => randInt(1, 20));
        // A list that never rises has no sale. Lift one later day so the demo usually has a profit.
        const buy = randInt(0, len - 2);
        const sell = randInt(buy + 1, len - 1);
        if (arr[sell] <= arr[buy]) {
            arr[buy] = randInt(1, 15);
            arr[sell] = randInt(arr[buy] + 1, 20);
        }
        return { arr };
    },
};
