# @ysaurnofsilraev/state-manager

Lightweight custom state manager with key-based subscriptions and a React bridge.

## Features

- Minimal core API (`createEngine`)
- Key-based subscriptions (`subscribe(key, listener)`)
- Global subscription (`subscribeTotal`)
- Key and total updates (`setValue/updateValue`, `setTotalValue/updateTotalValue`)
- React integration via `useSyncExternalStore`

## Installation

```bash
npm i @ysaurnofsilraev/state-manager
