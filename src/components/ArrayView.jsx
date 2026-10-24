const COLORS = {
    comparing:  "bg-yellow-400/20 border-yellow-400 text-yellow-100",
    found:      "bg-green-500/25 border-green-400 text-green-100",
    eliminated: "bg-slate-900 border-slate-800 text-slate-600",
};
const DEFAULT = "bg-slate-800 border-slate-500 text-slate-100";

export default function ArrayView({ step }) {
    const pointersAt = {};
    for (const [name, index] of Object.entries(step.pointers)) {
        if (!pointersAt[index]) pointersAt[index] = [];
        pointersAt[index].push(name);
    }

    return (
        <>
            <div className="flex gap-2">
                {step.array.map((value, i) => {
                    const role = step.highlights[i];
                    const color = COLORS[role] || DEFAULT;

                    return (
                        <div key={i} className="flex flex-col items-center w-14">

                        {/*The box*/}
                        <div className={`w-14 h-14 flex items-center justify-center border-2 border-gray-400 rounded-lg text-lg font-semibold transition-colors duration-300 ${color}`}>
                            {value}
                        </div>

                        {/* The current index */}
                        <span className="mt-1 text-xs text-slate-500">{i}</span>

                        {/* Pointer labels */}
                        <div className="h-10 flex flex-col items-center text-xs font-bold text-sky-400">
                            {(pointersAt[i] ?? []).map((name) => (
                                <span key={name}>↑ {name}</span>
                            ))}
                            </div>
                    </div>
                    )
                }
                )}
            </div>
        </>
    );
}