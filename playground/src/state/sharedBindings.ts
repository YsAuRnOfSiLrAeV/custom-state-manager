import { createEngine } from "@ysaurnofsilraev/state-manager"
import { useEngine } from "@ysaurnofsilraev/state-manager/react"

export interface AppState {
  count: number
  sharedText: string
  flagEnabled: boolean
}

const initialState: AppState = {
  count: 0,
  sharedText: "Hello from custom engine",
  flagEnabled: false
}

export const appEngine = createEngine(initialState)

export function useSharedState(): AppState {
  return useEngine(appEngine)
}

export function useCount(): number {
  return useSharedState().count
}

export function useSharedText(): string {
  return useSharedState().sharedText
}

export function useFlagEnabled(): boolean {
  return useSharedState().flagEnabled
}

export const counterActions = {
  increment(): void {
    appEngine.updateValue((prev) => ({ ...prev, count: prev.count + 1 }))
  },
  decrement(): void {
    appEngine.updateValue((prev) => ({ ...prev, count: prev.count - 1 }))
  },
  reset(): void {
    appEngine.updateValue((prev) => ({ ...prev, count: 0 }))
  }
}

export const textActions = {
  set(value: string): void {
    appEngine.updateValue((prev) => ({ ...prev, sharedText: value }))
  }
}

export const flagActions = {
  toggle(): void {
    appEngine.updateValue((prev) => ({
      ...prev,
      flagEnabled: !prev.flagEnabled
    }))
  }
}
