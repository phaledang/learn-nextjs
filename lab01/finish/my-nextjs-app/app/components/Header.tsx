export default function Header() {
  return (
    <header style={{
      backgroundColor: '#0070f3',
      color: 'white',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>My Next.js App</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
          </a>
          <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>
            About
          </a>
        </div>
      </nav>
    </header>
  )
}
