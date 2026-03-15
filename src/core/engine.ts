import type { Engine, Listener, Updater } from "./types"

export function createEngine<S>(initialValue: S): Engine<S> {
  let currentValue: S = initialValue
  const listeners = new Set<Listener>()

  function getInitialValue(): S {
    return initialValue
  }

  function getCurrentValue(): S {
    return currentValue
  }

  function notify(): void {
    for (const listener of listeners) {
      listener()
    }
  }

  function setValue(nextValue: S): void {
    if (Object.is(nextValue, currentValue)) return
    currentValue = nextValue
    notify()
  }

  function updateValue(updater: Updater<S>): void {
    const nextValue = updater(currentValue)
    if (Object.is(nextValue, currentValue)) return
    currentValue = nextValue
    notify()
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return {
    getInitialValue,
    getCurrentValue,
    setValue,
    updateValue,
    subscribe
  }
}
