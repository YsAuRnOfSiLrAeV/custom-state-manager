import { createEngine } from "../../../src"
import { useEngineValue } from "../../../src/react"

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

export function useCount(): number {
  return useEngineValue(appEngine, "count")
}

export function useSharedText(): string {
  return useEngineValue(appEngine, "sharedText")
}

export function useFlagEnabled(): boolean {
  return useEngineValue(appEngine, "flagEnabled")
}

export const counterActions = {
  increment(): void {
    appEngine.updateValue("count", (prev) => prev + 1)
  },
  decrement(): void {
    appEngine.updateValue("count", (prev) => prev - 1)
  },
  reset(): void {
    appEngine.setValue("count", 0)
  }
}

export const textActions = {
  set(value: string): void {
    appEngine.setValue("sharedText", value)
  }
}

export const flagActions = {
  toggle(): void {
    appEngine.updateValue("flagEnabled", (prev) => !prev)
  }
}
