import { flagActions, useFlagEnabled } from "../state/sharedBindings"

export function FlagStateViewer() {
  const enabled = useFlagEnabled()

  return (
    <div className="child">
      <h3>Flag Viewer</h3>
      <p>
        enabled = <strong>{String(enabled)}</strong>
      </p>
    </div>
  )
}

export function FlagToggleControl() {
  const enabled = useFlagEnabled()

  return (
    <div className="child">
      <h3>Flag Toggle</h3>
      <button type="button" onClick={flagActions.toggle}>
        {enabled ? "Turn Off" : "Turn On"}
      </button>
    </div>
  )
}
