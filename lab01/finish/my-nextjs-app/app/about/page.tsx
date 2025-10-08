import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - My Next.js App',
  description: 'Learn about this Next.js training project',
}

export default function About() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>About This Project</h1>
      <p>This is a Next.js training project.</p>
      <p>
        I'm learning about:
      </p>
      <ul>
        <li>Next.js fundamentals</li>
        <li>React Server Components</li>
        <li>File-based routing</li>
        <li>Layouts and pages</li>
      </ul>
      <a href="/">Back to Home</a>
    </main>
  )
}
