/**
 * Navbar Component
 * Purpose: Provides a centralized navigation hub for the application.
 * Features:
 * - Single Page Application Routing: Uses the setView function to toggle 
 * between functional modules without reloading the page.
 * - Dynamic User Branding: Displays the active session's username within the logout trigger.
 * - Brand Integration: Acts as a shortcut to the primary dashboard via the brand title.
 */

const Navbar = ({ user, onLogout, setView }) => {
  return (
    <nav className="f1-nav">
      <div className="nav-brand" onClick={() => setView('dashboard')} style={{cursor: 'pointer'}}>
        Tifosi Tracker
      </div>
      <div className="nav-links">
        <span onClick={() => setView('dashboard')}>Dashboard</span>
        <span onClick={() => setView('watchlist')}>My Watchlist</span>
        <span onClick={() => setView('results')}>Stats</span>
        <span onClick={() => setView('profile')} style={{marginRight: '15px'}}>Profile</span> {/* Added Profile */}
        <button onClick={onLogout} className="logout-link">Logout ({user})</button>
      </div>
    </nav>
  );
};

export default Navbar;