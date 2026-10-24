import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-500">Hello</h1>
      <h1>My Website</h1>
      <p>
        Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
      </p>
    </>
  )
}

export default App
