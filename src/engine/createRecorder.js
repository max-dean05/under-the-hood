// Shared by every algo module
// Each call to createRecorder() gives a fresh, independent list of steps.
export function createRecorder() {
    const steps = [];

    function snap({
        line,
        explain,
        array = null,
        grid = null,
        map = null,
        mapHighlights = {},
        pointers = {},
        highlights = {},
        vars = {},
    }) {
        steps.push({
            lines: Array.isArray(line) ? line : [line],
            explain,
            array: array && [...array],
            grid: grid && grid.map((row) => [...row]),
            map: map && new Map(map),
            mapHighlights: { ...mapHighlights },
            pointers: { ...pointers },
            highlights: { ...highlights },
            vars: { ...vars },
        });
    }

    return { snap, steps };
}