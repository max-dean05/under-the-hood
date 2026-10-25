import { useState, useMemo } from 'react'
import { modules } from './modules/registry.js'
import ArrayView from './components/ArrayView.jsx'
import CodePanel from './components/CodePanel.jsx'
import VarsPanel from './components/VarsPanel.jsx'
import HashMapView from './components/HashMapView.jsx'

// Default input for now, will go inside the function once user can change input. 


function App() {
  const [moduleId, setModuleId] = useState(modules[0].id);
  const [stepIndex, setStepIndex] = useState(0);

  const mod = modules.find((m) => m.id === moduleId);

  const steps = useMemo(() => mod.generateSteps(mod.defaultInput), [mod]);
  const step = steps[stepIndex];

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  function switchModule(id) {
    setModuleId(id);
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
              <p className="text-xs uppercase tracking-wider text-slate-400">{mod.problem}</p>
              <h1 className="text-3xl font-bold">{mod.title}</h1>
            </div>
            <div className="flex gap-2 font-mono text-sm">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">Time {mod.time}</span>
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">Space {mod.space}</span>
            </div>
          </header>

          {/* Visualization */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl px-6 pt-10 pb-6 flex flex-col items-center overflow-x-auto">
            {step.array && <ArrayView step={step} />}

            {step.map && (
              <HashMapView 
                map={step.map}
                highlights={step.mapHighlights}
                prevMap={stepIndex > 0 ? steps[stepIndex-1].map : null}
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
                prevVars={stepIndex > 0 ? steps[stepIndex-1].vars : null}
              />
            </div>
          </div>

          {/* Buttons to go through explanation */}
          <div className="sticky bottom-4 z-10 flex items-center justify-center gap-4 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl py-4 shadow-lg shadow-black/40">
            <button 
              onClick={() => setStepIndex(0)}
              disabled={isFirstStep}
              className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Reset
            </button>
            <button 
              onClick={() => setStepIndex(stepIndex-1)}
              disabled={isFirstStep}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Previous
            </button>
            {/* Step counter */}
            <span className="font-mono text-sm text-slate-400 w-24 text-center">
              {stepIndex+1} / {steps.length}
            </span>
            <button 
              onClick={() => setStepIndex(stepIndex+1)}
              disabled={isLastStep}
              className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
            >
              Next
            </button>
            <button
              onClick={() => setStepIndex(steps.length-1)}
              disabled={isLastStep}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
        </div>
    </>
  )
}

export default App
