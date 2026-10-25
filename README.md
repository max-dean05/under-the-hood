# Under the Hood

**You memorized the solution. Now see why it works.**

Under the Hood is an interactive, step-by-step visualizer for common LeetCode problems. Pick a problem, then step through the real algorithm one line at a time: the executing line of Python is highlighted, the array, pointers, and hash map animate, and every step comes with a plain-English explanation of what is happening and why.

Live demo: https://under-the-hood-blue.vercel.app/

## Features
- Plain-English "why this works" summary plus time and space complexity for each problem
- Line-highlighted Python code synced to each step
- Live visualization of arrays, labeled pointers, and hash maps
- Variables panel that highlights what changed
- Bring your own input (validated) or generate a random one
- Step forward/back (arrow keys), play/pause (Space), and 0.5x to 4x speed

## Problems
| Problem | LeetCode # |
|---|---|
| Binary Search | 704 |
| Two Sum | 1 |
| Two Pointers (sorted pair sum) | 167 |
| Move Zeroes | 283 |
| Maximum Average Subarray | 643 |
| Best Time to Buy and Sell Stock | 121 |
| Climbing Stairs | 70 |

## How it works
Each problem is a self-contained module that runs the real algorithm once and records a snapshot at every meaningful step (active code line, explanation, array state, pointers, highlights, hash map, variables). The UI plays those snapshots back, so stepping backward is as easy as stepping forward. Adding a problem means one new module plus one line in the registry.

## Tech
React 19, Vite, Tailwind CSS 4, deployed on Vercel. Runs entirely in the browser.

## Run locally
```bash
npm install
npm run dev
```

Built at HackTX 2026.