import { useSyncExternalStore } from "react"
import type { Engine } from "../core/index.js"

export function useEngine<S>(engine: Engine<S>): S {
  return useSyncExternalStore(
    engine.subscribeTotal,
    engine.getTotalCurrentValue,
    engine.getInitialValue
  )
}

export function useEngineValue<S, K extends keyof S>(
  engine: Engine<S>,
  key: K
): S[K] {
  return useSyncExternalStore(
    (onChange) => engine.subscribe(key, onChange),
    () => engine.getCurrentValue(key),
    () => engine.getInitialValue()[key]
  )
}

export function useEngineMultipleValues<S, R, K extends keyof S>(
  engine: Engine<S>,
  keys: readonly K[],
  selector: (state: S) => R
): R {
  return useSyncExternalStore(
    (onChange) => {
      const unsubs = keys.map((k) => engine.subscribe(k, onChange))
      return () => unsubs.forEach((u) => u())
    },
    () => selector(engine.getTotalCurrentValue()),
    () => selector(engine.getInitialValue())
  )
}