import { createRecorder } from "../engine/createRecorder.js";
import { checkArray, randInt, randomSorted } from "../engine/inputs.js";

const code = [
  "def two_sum_sorted(arr, target):", // 0
  "   left, right = 0, len(arr)-1", // 1
  "   while left < right:", // 2
  "       total = arr[left] + arr[right]", // 3
  "       if total == target", // 4
  "           return [left, right]", // 5
  "       elif total < target:", // 6
  "           left += 1", // 7
  "       else:", // 8
  "           right -= 1", // 9
  "   return []", // 10
];

function highlightsFor(n, left, right, found) {
  const h = {};
  for (let i = 0; i < n; i++) {
    if (i < left || i > right) h[i] = "eliminated";
  }
  if (left < right) {
    h[left] = found ? "found" : "comparing";
    h[right] = found ? "found" : "comparing";
  }
  return h;
}

function generateSteps({ arr, target }) {
  const rec = createRecorder();
  let left = 0,
    right = arr.length - 1,
    total = null,
    checks = 0;

  const snap = (line, explain, found = false) => {
    rec.snap({
      line,
      explain,
      array: arr,
      pointers: { left, right },
      highlights: highlightsFor(arr.length, left, right, found),
      vars: { target, left, right, total: total ?? "-", checks },
    });
  };

  snap(1,`Start with one pointer at each end. Because the array is sorted, left points at the smallest number and right points at the largest.`,);

  while (left < right) {
    snap(2, `left (${left}) < right (${right}), so there are still two different numbers to try.`);

    total += arr[left] + arr[right];
    checks++;
    snap(3, `Add the two ends: ${arr[left]} + ${arr[right]} = ${total}.`);

    if (total === target) {
      snap(4, `We have found our target sum!`, true);
      snap(5, `Found the pair indices [${left}, ${right}] in ${checks} checks with constant space.`, true,);
      snap(5, `Note: This problem is quite similar to TwoSum, the key difference being that the array must be sorted. If you are tight on space for a TwoSum problem, you can opt to sort the list first and then use TwoPointer, causing the time complexity to be O(N * log(N)) and the space complexity to be O(1) (assuming you're using a good sorting algorithm).`, true);
      return rec.steps;
    } else if (total < target) {
      snap(6, `Our current sum of ${total} is less than our target ${target}, so by increasing the left index our sum will either stay the same or increase due to the array being sorted, bringing us closer to our target.`);
      left++;
      snap(7, `Increment left, since anything to the left of our new left cannot add up to the target.`);
      total = null;
    } else {
      snap(8, `Our current sum of ${total} is more than our target ${target}, so by decreasing the right index our sum will either stay the same or decrease due to the array being sorted, bringing us closer to our target.`);
      right--;
      snap(9, `Decrement right, since anything to the right of our new right cannot add up to the target.`);
      total = null;
    }
  }

  snap(10, `We have incremented through the whole array and there are no more different numbers to try. No pairs adds up to ${target}.`);
  return rec.steps;
}

export const twoPointers = {
  id: "two-pointers",
  title: "Two Pointers",
  problem: "LeetCode 167",
  code,
  defaultInput: { arr: [1, 3, 4, 6, 8, 11, 14], target: 10 },
  generateSteps,
  time: "O(N)",
  space: "O(1)",
  inputFields: [
    { name: "arr", label: "Sorted array", type: "array" },
    { name: "target", label: "Target", type: "number" },
  ],
  validateInput: ({ arr }) => checkArray(arr, { minLen: 2, sorted: true }),
  randomInput: () => {
    const arr = randomSorted(randInt(7, 9), 1, 30);
    const i = randInt(0, arr.length - 2);
    const j = randInt(i + 1, arr.length - 1);
    return { arr, target: arr[i] + arr[j] };
  },
};
