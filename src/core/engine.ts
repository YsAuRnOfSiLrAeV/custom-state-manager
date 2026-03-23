import type { Engine, Listener, Updater } from "./types.js"

const ALL = Symbol("all")

/**
 * Creates a new engine instance.
 * The engine stores current state, supports key-based and total updates,
 * and notifies subscribers for specific keys or the whole state.
 */
export function createEngine<S>(initialValue: S): Engine<S> {
  /**
   * Current runtime state.
   */
  let currentValue: S = {...initialValue}

  /**
   * Subscription channel:
   * - a specific state key
   * - or the global ALL channel
   */
  type Channel = keyof S | typeof ALL

  /**
   * Map of channel - listeners set.
   */
  const listeners = new Map<Channel, Set<Listener>>()

  /**
   * Returns initial state snapshot.
   */
  function getInitialValue(): S {
    return initialValue
  }

  /**
   * Returns current value by key.
   */
  function getCurrentValue<K extends keyof S>(key: K): S[K] {
    return currentValue[key]
  }

  /**
   * Returns full current state.
   */
  function getTotalCurrentValue(): S {
    return currentValue
  }

  /**
   * Returns (or creates) listeners set for a channel.
   */
  function getListenerSet(channel: Channel): Set<Listener> {
    let listenerSet = listeners.get(channel)
    if (!listenerSet) {
      listenerSet = new Set<Listener>()
      listeners.set(channel, listenerSet)
    }
    return listenerSet
  }

  /**
   * Removes a listener from a channel.
   * Cleans up empty channel sets.
   */
  function unsubscribe(channel: Channel, listener: Listener): void {
    const listenerSet = listeners.get(channel)
    if (!listenerSet) return
    listenerSet.delete(listener)
    if (listenerSet.size === 0) listeners.delete(channel)
  }

  /**
   * Subscribes to all state changes.
   * Returns unsubscribe callback.
   */
  function subscribeTotal(listener: Listener): () => void {
    const listenerSet = getListenerSet(ALL)
    listenerSet.add(listener)
    return () => unsubscribe(ALL, listener)
  }

  /**
   * Subscribes to one specific key changes.
   * Returns unsubscribe callback.
   */
  function subscribe<K extends keyof S>(key: K, listener: Listener): () => void {
    const listenerSet = getListenerSet(key)
    listenerSet.add(listener)
    return () => unsubscribe(key, listener)
  }

  /**
   * Notifies listeners of one key, then notifies total listeners.
   */
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

  /**
   * Notifies every listener in every channel.
   */
  function notifyAll(): void {
    for (const listenerSet of listeners.values()) {
      for (const listener of listenerSet) {
        listener()
      }
    }
  }

  /**
   * Sets one key to a new value.
   * Skips update if value is unchanged.
   */
  function setValue<K extends keyof S>(key: K, nextValue: S[K]): void {
    if (Object.is(nextValue, currentValue[key])) return
    currentValue = { ...currentValue, [key]: nextValue }
    notify(key)
  }

  /**
   * Replaces whole state.
   * Skips update if reference is unchanged.
   */
  function setTotalValue(nextValue: S): void {
    if (Object.is(nextValue, currentValue)) return
    currentValue = nextValue
    notifyAll()
  }

  /**
   * Updates one key using updater(prev) => next.
   * Skips update if result is unchanged.
   */
  function updateValue<K extends keyof S>(key: K, updater: Updater<S[K]>): void {
    const prevValue = currentValue[key]
    const nextValue = updater(prevValue)
    if (Object.is(nextValue, prevValue)) return
    currentValue = { ...currentValue, [key]: nextValue }
    notify(key)
  }

  /**
   * Updates whole state using updater(prevState) => nextState.
   * Skips update if reference is unchanged.
   */
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
