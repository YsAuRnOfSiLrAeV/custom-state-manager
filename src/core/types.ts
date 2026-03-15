export type Primitive = string | number | boolean | null

export interface StateMap {
  [key: string]: StateEntry
}

export type StateEntry = Primitive | StateMap | StateEntry[]

export type Listener = () => void
export type Updater<S> = (prev: S) => S

export interface Engine<S> {
  getInitialValue: () => S
  getCurrentValue: () => S
  setValue: (nextValue: S) => void
  updateValue: (updater: Updater<S>) => void
  subscribe: (listener: Listener) => () => void
}
