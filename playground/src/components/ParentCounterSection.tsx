import {
  counterActions,
  textActions,
  useCount,
  useSharedText
} from "../state/sharedBindings"

function CounterValue() {
  const count = useCount()

  return (
    <div className="child">
      <h3>Child 1: Counter Value</h3>
      <p>
        Shared count: <strong>{count}</strong>
      </p>
    </div>
  )
}

function CounterControls() {
  const text = useSharedText()

  return (
    <div className="child">
      <h3>Child 2: Counter Controls</h3>
      <div className="row">
        <button type="button" onClick={counterActions.increment}>
          +1
        </button>
        <button type="button" onClick={counterActions.decrement}>
          -1
        </button>
        <button type="button" onClick={counterActions.reset}>
          Reset
        </button>
      </div>

      <label className="row" htmlFor="shared-text">
        Text:
        <input
          id="shared-text"
          value={text}
          onChange={(event) => textActions.set(event.target.value)}
        />
      </label>
    </div>
  )
}

export function ParentCounterSection() {
  return (
    <section className="card">
      <h2>Parent Section</h2>
      <div className="stack">
        <CounterValue />
        <CounterControls />
      </div>
    </section>
  )
}
