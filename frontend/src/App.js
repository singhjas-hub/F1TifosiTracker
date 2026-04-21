import './App.css';

function App() {
  return (
    <div className="app-container">
      <header style={{ padding: '20px', borderBottom: '2px solid #e10600' }}>
        <h1>F1 2025 Tifosi Tracker</h1>
      </header>
      
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Welcome, Tifosi.</h2>
        <p>The 2025 season is loading...</p>
        {/* We will swap this out for our Login component next! */}
      </main>
    </div>
  );
}

export default App;