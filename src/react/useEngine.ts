import { useSyncExternalStore } from "react"
import type { Engine } from "../core"

export function useEngine<S>(engine: Engine<S>): S {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getCurrentValue,
    engine.getInitialValue
  )
}
