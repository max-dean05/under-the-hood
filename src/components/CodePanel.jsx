export default function CodePanel({ code, activeLine }) {
    return (
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {code.map((text, i) => {
                const isActive = i === activeLine;

                return (
                    <div
                        key={i}
                        className={`flex gap-4 px-2 rounded transition-colors duration-200 ${
                            isActive ? "bg-yellow-400/20" : ""}`}
                    >
                        {/* Line number */}
                        <span className={`w-6 text-right select-none ${isActive ? "text-yellow-300" : "text-slate-500"}`}>
                            {i + 1}
                        </span>

                        {/* Actual code */}
                        <span className={`whitespace-pre ${isActive ? "text-yellow-100" : "text-slate-300"}`}>
                            {text}
                        </span>
                    </div>
                );
            }
            )}
        </div>
    )
}