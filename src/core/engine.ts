import type { Engine, Listener, Updater } from "./types.js"

const ALL = Symbol("all")

export function createEngine<S>(initialValue: S): Engine<S> {
  let currentValue: S = {...initialValue}

  type Channel = keyof S | typeof ALL
  const listeners = new Map<Channel, Set<Listener>>()

  function getInitialValue(): S {
    return initialValue
  }

  function getCurrentValue<K extends keyof S>(key: K): S[K] {
    return currentValue[key]
  }

  function getTotalCurrentValue(): S {
    return currentValue
  }

  function getListenerSet(channel: Channel): Set<Listener> {
    let listenerSet = listeners.get(channel)
    if (!listenerSet) {
      listenerSet = new Set<Listener>()
      listeners.set(channel, listenerSet)
    }
    return listenerSet
  }

  function unsubscribe(channel: Channel, listener: Listener): void {
    const listenerSet = listeners.get(channel)
    if (!listenerSet) return
    listenerSet.delete(listener)
    if (listenerSet.size === 0) listeners.delete(channel)
  }

  function subscribeTotal(listener: Listener): () => void {
    const listenerSet = getListenerSet(ALL)
    listenerSet.add(listener)
    return () => unsubscribe(ALL, listener)
  }

  function subscribe<K extends keyof S>(key: K, listener: Listener): () => void {
    const listenerSet = getListenerSet(key)
    listenerSet.add(listener)
    return () => unsubscribe(key, listener)
  }

  function notify<K extends keyof S>(key: K): void {
    const keyListenerSet = listeners.get(key)
    if (!keyListenerSet) return
    for (const listener of keyListenerSet) {
      listener()
    }

    const totalListenerSet = listeners.get(ALL)
    if (totalListenerSet) {
      for (const listener of totalListenerSet) {
        listener()
      }
    }
  }

  function notifyAll(): void {
    for (const listenerSet of listeners.values()) {
      for (const listener of listenerSet) {
        listener()
      }
    }
  }

  function setValue<K extends keyof S>(key: K, nextValue: S[K]): void {
    if (Object.is(nextValue, currentValue[key])) return
    currentValue = { ...currentValue, [key]: nextValue }
    notify(key)
  }

  function setTotalValue(nextValue: S): void {
    if (Object.is(nextValue, currentValue)) return
    currentValue = nextValue
    notifyAll()
  }

  function updateValue<K extends keyof S>(key: K, updater: Updater<S[K]>): void {
    const prevValue = currentValue[key]
    const nextValue = updater(prevValue)
    if (Object.is(nextValue, prevValue)) return
    currentValue = { ...currentValue, [key]: nextValue }
    notify(key)
  }

  function updateTotalValue(updater: Updater<S>): void {
    const nextValue = updater(currentValue)
    if (Object.is(nextValue, currentValue)) return
    currentValue = nextValue
    notifyAll()
  }

  return {
    getInitialValue,
    getTotalCurrentValue,
    getCurrentValue,
    setTotalValue,
    setValue,
    updateTotalValue,
    updateValue,
    subscribeTotal,
    subscribe
  }
}
