export type Primitive = string | number | boolean | null

export interface StateMap {
  [key: string]: StateEntry
}

export type StateEntry = Primitive | StateMap | StateEntry[]

export type Listener = () => void
export type Updater<S> = (prev: S) => S

export interface Engine<S> {
  getInitialValue: () => S
  getTotalCurrentValue: () => S
  getCurrentValue: <K extends keyof S>(key: K) => S[K]

  setTotalValue: (nextValue: S) => void
  setValue: <K extends keyof S>(key: K, nextValue: S[K]) => void

  updateTotalValue: (updater: Updater<S>) => void
  updateValue: <K extends keyof S>(key: K, updater: Updater<S[K]>) => void

  subscribeTotal: (listener: Listener) => () => void
  subscribe: <K extends keyof S>(key: K, listener: Listener) => () => void
}

