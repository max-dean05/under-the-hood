export default function VarsPanel({ vars, prevVars }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Variables
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {Object.entries(vars).map(([name, value]) => {
                    // Checks if value was changed since last step
                    const changed = prevVars && prevVars[name] !== value;

                    return (
                        <div
                            key={name}
                            className={`rounded-md px-3 py-2 border transition-colors duration-300 
                                ${changed ? "border-sky-400 bg-sky-400/10" : "border-slate-700"}`}
                        >
                            <div className="text-xs text-slate-400 font-mono">{name}</div>
                            <div className="text-xl font-semibold font-mono">{String(value)}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}