import { useState, useMemo, useEffect } from "react";
import { modules } from "./modules/registry.js";
import ArrayView from "./components/ArrayView.jsx";
import CodePanel from "./components/CodePanel.jsx";
import VarsPanel from "./components/VarsPanel.jsx";
import HashMapView from "./components/HashMapView.jsx";
import InputEditor from './components/InputEditor.jsx';

const SPEEDS = [
  { label: "0.5x", ms: 2000 },
  { label: "1x", ms: 1200 },
  { label: "2x", ms: 600 },
  { label: "4x", ms: 300 },
];

function App() {
  const [moduleId, setModuleId] = useState(modules[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [customInput, setCustomInput] = useState(null);

  const mod = modules.find((m) => m.id === moduleId);

  const input = customInput ?? mod.defaultInput;
  const steps = useMemo(() => mod.generateSteps(input), [mod, input]);
  const step = steps[stepIndex];

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  // Auto play
  useEffect(() => {
    if (!isPlaying) return;
    if (isLastStep) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((s) => s + 1), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, speed, isLastStep]);

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowRight") {
        setIsPlaying(false);
        setStepIndex((s) => Math.min(s + 1, steps.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIsPlaying(false);
        setStepIndex((s) => Math.max(s - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function switchModule(id) {
    setIsPlaying(false);
    setModuleId(id);
    setStepIndex(0);
    setCustomInput(null);
  }

  function togglePlay() {
    if (isLastStep) setStepIndex(0);
    setIsPlaying((p) => !p);
  }

  function goTo(index) {
    setIsPlaying(false);
    setStepIndex(index);
  }

  function applyInput(newInput) {
    setIsPlaying(false);
    setCustomInput(newInput);
    setStepIndex(0);
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
          {/* Module tabs */}
          <nav className="flex flex-wrap gap-2">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => switchModule(m.id)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  m.id === moduleId
                    ? "bg-sky-600 border-sky-500 text-white"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {m.title}
              </button>
            ))}
          </nav>

          {/* Header */}
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {mod.problem}
              </p>
              <h1 className="text-3xl font-bold">{mod.title}</h1>
            </div>
            <div className="flex gap-2 font-mono text-sm">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                Time {mod.time}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                Space {mod.space}
              </span>
            </div>
          </header>

          {/* Custom input field */}
          <InputEditor mod={mod} input={input} onApply={applyInput} />

          {/* Visualization */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl px-6 pt-10 pb-6 flex flex-col items-center overflow-x-auto">
            {step.array && <ArrayView step={step} />}

            {step.map && (
              <HashMapView
                map={step.map}
                highlights={step.mapHighlights}
                prevMap={stepIndex > 0 ? steps[stepIndex - 1].map : null}
                label={mod.mapLabel}
              />
            )}
          </section>

          {/* Grid of code/explanation/variables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Code panel */}
            <CodePanel code={mod.code} activeLines={step.lines} />

            {/* Right side: Explanation on top, variables below it */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 min-h-61">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  What's happening
                </h2>
                <p className="text-lg leading-relaxed">{step.explain}</p>
              </div>

              <VarsPanel
                vars={step.vars}
                prevVars={stepIndex > 0 ? steps[stepIndex - 1].vars : null}
              />
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900 border border-slate-800 rounded-xl py-4">
            <button
              onClick={() => goTo(0)}
              disabled={isFirstStep}
              className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Reset
            </button>
            <button
              onClick={() => goTo(stepIndex - 1)}
              disabled={isFirstStep}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={togglePlay}
              className="w-24 px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 font-semibold"
            >
              {isPlaying ? "Pause" : isLastStep ? "Replay" : "Play"}
            </button>

            <button
              onClick={() => goTo(stepIndex + 1)}
              disabled={isLastStep}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Next
            </button>
            <button
              onClick={() => goTo(steps.length - 1)}
              disabled={isLastStep}
              className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Last
            </button>

            <span className="font-mono text-sm text-slate-400 w-20 text-center">
              {stepIndex + 1} / {steps.length}
            </span>

            {/* Speed */}
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              {SPEEDS.map((s) => (
                <button
                  key={s.ms}
                  onClick={() => setSpeed(s.ms)}
                  className={`px-2 py-1 text-xs font-mono ${
                    speed === s.ms
                      ? "bg-slate-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
