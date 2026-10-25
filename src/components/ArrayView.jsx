const COLORS = {
  comparing: "bg-yellow-400/20 border-yellow-400 text-yellow-100",
  found: "bg-green-500/25 border-green-400 text-green-100",
  eliminated: "bg-slate-900 border-slate-800 text-slate-600",
  visited: "bg-sky-500/15 border-sky-700 text-sky-200",
  window: "bg-violet-500/20 border-violet-400 text-violet-100",
  leaving: "bg-rose-500/15 border-rose-500 text-rose-200",
  source: "bg-amber-500/20 border-amber-400 text-amber-100",
};
const DEFAULT = "bg-slate-800 border-slate-500 text-slate-100";
const SLOT = 64;

export default function ArrayView({ step }) {
  const countAt = {};
  const labels = Object.entries(step.pointers)
    .filter(([, index]) => index >= 0 && index < step.array.length)
    .map(([name, index]) => {
      const row = countAt[index] ?? 0;
      countAt[index] = row + 1;
      return { name, index, row };
    });

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        {step.array.map((value, i) => {
          const role = step.highlights[i];
          const color = COLORS[role] || DEFAULT;
          const isActive = role === "comparing" || role === "found";

          return (
            <div key={i} className="flex flex-col items-center w-14">
              {/*The box*/}
              <div
                className={`w-14 h-14 flex items-center justify-center border-2 border-gray-400 rounded-lg text-lg font-semibold transition-all duration-300 ease-out motion-reduce:transition-none ${isActive ? "scale-110" : "scale-100"} ${color}`}
              >
                {value}
              </div>

              {/* The current index */}
              <span className="mt-1 text-xs text-slate-500">{i}</span>
            </div>
          );
        })}
      </div>

      {/* Pointer labels */}
      <div
        className="relative h-12 mt-1"
        style={{ width: step.array.length * SLOT - 8 }}
      >
        {labels.map(({ name, index, row }) => (
          <span
            key={name}
            className="absolute w-14 text-center text-xs font-bold text-sky-400 transition-all duration-300 ease-out motion-reduce:transition-none"
            style={{ left: index * SLOT, top: row * 16 }}
          >
            ↑ {name}
          </span>
        ))}
      </div>
    </div>
  );
}
