import { useSyncExternalStore } from "react"
import type { Engine } from "../core/index.js"

/**
 * Total-state hook.
 * Subscribes to all state changes and returns full snapshot.
 */
export function useEngine<S>(engine: Engine<S>): S {
  return useSyncExternalStore(
    engine.subscribeTotal,
    engine.getTotalCurrentValue,
    engine.getInitialValue
  )
}

/**
 * Key-based hook.
 * Subscribes to one key and returns current value of that key.
 */
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

/**
 * Multi-key derived hook.
 * Subscribes to listed keys and computes derived result via selector(state).
 * 'keys' must include all fields used inside 'selector'.
 */
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