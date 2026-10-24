import { binarySearch } from "./binarySearch.js";

const VERBOSE = process.argv.includes("-v"); // node src/modules/test.js -v  → print every step

const cases = [
  { name: "found in middle",   arr: [1, 3, 5, 7, 9, 11, 13, 15, 17], target: 13 },
  { name: "not in array",      arr: [1, 3, 5, 7, 9, 11, 13, 15, 17], target: 4 },
  { name: "first element",     arr: [1, 3, 5, 7, 9, 11, 13, 15, 17], target: 1 },
  { name: "last element",      arr: [1, 3, 5, 7, 9, 11, 13, 15, 17], target: 17 },
  { name: "smaller than all",  arr: [1, 3, 5, 7, 9], target: -5 },
  { name: "bigger than all",   arr: [1, 3, 5, 7, 9], target: 100 },
  { name: "single, found",     arr: [42], target: 42 },
  { name: "single, missing",   arr: [42], target: 7 },
  { name: "empty array",       arr: [], target: 3 },
  { name: "even length",       arr: [2, 4, 6, 8, 10, 12], target: 10 },
];

const FOUND_LINE = 5;      // "return mid"
const NOT_FOUND_LINE = 10; // "return -1"

let passed = 0;
let failed = 0;

for (const { name, arr, target } of cases) {
  const errors = [];
  const steps = binarySearch.generateSteps({ arr, target });
  const last = steps[steps.length - 1];
  const shouldFind = arr.includes(target);

  // 1. Every step is well-formed
  steps.forEach((s, i) => {
    if (!Array.isArray(s.lines) || s.lines.length === 0)
      errors.push(`step ${i}: lines is missing or empty`);
    else
      s.lines.forEach((ln) => {
        if (!Number.isInteger(ln) || ln < 0 || ln >= binarySearch.code.length)
          errors.push(`step ${i}: line ${ln} is not a valid code line`);
      });

    if (JSON.stringify(s.array) !== JSON.stringify(arr))
      errors.push(`step ${i}: array changed`);

    if (typeof s.explain !== "string" || s.explain.length === 0)
      errors.push(`step ${i}: missing explanation`);
  });

  // 2. Ends in the right place
  if (shouldFind) {
    const idx = last.pointers.mid;
    if (!last.lines.includes(FOUND_LINE))
      errors.push(`expected to end on line ${FOUND_LINE} (return mid), ended on ${last.lines}`);
    if (arr[idx] !== target)
      errors.push(`final mid=${idx} points to ${arr[idx]}, not ${target}`);
    if (last.highlights[idx] !== "found")
      errors.push(`index ${idx} not highlighted as "found"`);
  } else {
    if (!last.lines.includes(NOT_FOUND_LINE))
      errors.push(`expected to end on line ${NOT_FOUND_LINE} (return -1), ended on ${last.lines}`);
  }

  // 3. It's actually binary search: at most floor(log2(n)) + 1 checks
  const maxChecks = arr.length === 0 ? 0 : Math.floor(Math.log2(arr.length)) + 1;
  if (last.vars.checks > maxChecks)
    errors.push(`${last.vars.checks} checks, but binary search should need at most ${maxChecks}`);

  // Report
  if (errors.length === 0) {
    passed++;
    console.log(`✅ ${name}  (${steps.length} steps, ${last.vars.checks} checks)`);
  } else {
    failed++;
    console.log(`❌ ${name}`);
    errors.forEach((e) => console.log(`     - ${e}`));
  }

  if (VERBOSE) {
    steps.forEach((s, i) =>
      console.log(
        `     ${String(i).padStart(2)} | lines ${s.lines.join(",").padEnd(5)} | ${JSON.stringify(s.pointers)} | ${s.explain}`
      )
    );
    console.log();
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);