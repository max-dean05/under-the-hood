import { useState, useEffect } from "react";
import { toTexts, parseFields } from "../engine/inputs.js";

export default function InputEditor({ mod, input, onApply }) {
    const [texts, setTexts] = useState(() => toTexts(mod.inputFields, input));
    const [error, setError] = useState(null);

    // when the input changes, refresh the boxes
    useEffect(() => {
        setTexts(toTexts(mod.inputFields, input));
        setError(null);
    }, [mod, input]);

    function apply() {
        const parsed = parseFields(mod.inputFields, texts);
        if (parsed.error) return setError(parsed.error);
        const problem = mod.validateInput(parsed.value);
        if (problem) return setError(problem);
        setError(null);
        onApply(parsed.value);
    }

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); apply(); }}  // enter key applies
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3"
        >
            <div className="flex flex-wrap items-end gap-3">
                {mod.inputFields.map((f) => (
                    <label key={f.name} className={`flex flex-col gap-1 ${f.type === "array" ? "flex-1 min-w-56" : "w-32"}`}>
                        <span className="text-xs uppercase tracking-wider text-slate-400">{f.label}</span>
                        <input
                            id={`input-${f.name}`}
                            value={texts[f.name] ?? ""}
                            onChange={(e) => setTexts({ ...texts, [f.name]: e.target.value})}
                            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:border-sky-500"
                        />
                    </label>
                ))}

                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-sm font-semibold">
                        Run
                    </button>
                    <button type="button" onClick={() => onApply(mod.randomInput())}
                        className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-sm">
                        Random
                    </button>
                    <button type="button" onClick={() => onApply(mod.defaultInput)}
                        className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm text-slate-300">
                        Default
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
        </form>
    )
}