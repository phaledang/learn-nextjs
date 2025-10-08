import type { Metadata } from 'next'
import Counter from './components/Counter'

export const metadata: Metadata = {
  title: 'Home - My Next.js App',
  description: 'Welcome to my Next.js training application',
}

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is my first Next.js application!</p>
      <p>Built during Lab 01 of the Next.js training program.</p>
      
      <Counter />
    </main>
  )
}
