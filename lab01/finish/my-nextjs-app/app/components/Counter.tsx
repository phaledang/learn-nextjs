'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      border: '2px solid #0070f3',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem',
      textAlign: 'center'
    }}>
      <h3>Interactive Counter (Client Component)</h3>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Increment
      </button>
    </div>
  )
}
