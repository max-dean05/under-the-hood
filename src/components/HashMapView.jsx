export default function HashMapView({ map, highlights = {}, prevMap = null, label = "Hash Map"}) {
    const entries = [...map.entries()];

    return (
        <div className="mt-2 w-full flex flex-col items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                {label}
            </h3>

            {entries.length === 0 ? (
                <div className="px-4 py-3 rounded-lg border border-dashed border-slate-700 text-sm text-slate-500 italic">
                    empty: nothing stored yet
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-2">
                    {entries.map(([key, value]) => {
                        const isHit = highlights[key] === "found";
                        const isNew = prevMap && !prevMap.has(key);
                        
                        const style = isHit 
                            ? "bg-green-500/25 border-green-400 text-green-100"
                            : isNew 
                            ? "bg-sky-500/20 border-sky-400 text-sky-100"
                            : "bg-slate-800 border-slate-600 text-slate-200";

                        return (
                            <div
                                key={key}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 font-mono transition-colors duration-300 ${style}`}
                            >
                                <span className="text-lg font-semibold">{key}</span>
                                <span className="text-slate-400">→</span>
                                <span className="text-sm text-slate-300">index {value}</span>
                            </div>
                        );
                    })}
                </div>
            )
            }
        </div>
    )
}