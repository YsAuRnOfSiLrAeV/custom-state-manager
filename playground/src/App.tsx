import { ParentCounterSection } from './components/ParentCounterSection'
import {
  FlagStateViewer,
  FlagToggleControl,
} from './components/UnrelatedFlagComponents'
import { useSharedText } from './state/sharedBindings'

function SharedTextPreview() {
  const text = useSharedText()

  return (
    <section className="card">
      <h2>Shared Text Preview</h2>
      <p>{text}</p>
    </section>
  )
}

function App() {
  return (
    <main className="page">
      <h1>Custom State Manager Playground</h1>

      <ParentCounterSection />
      <SharedTextPreview />

      <section className="card">
        <h2>Unrelated Components Section</h2>
        <p className="hint">
          The next two components are in different parts of the page but share
          the same boolean flag.
        </p>
      </section>

      <section className="card">
        <h2>Area A</h2>
        <FlagStateViewer />
      </section>

      <section className="card">
        <h2>Area B</h2>
        <FlagToggleControl />
      </section>
    </main>
  )
}

export default App
