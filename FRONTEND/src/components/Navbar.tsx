// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setShowNavMenu, showNavMenu, menuRef, cartCount, onSearch, searchTerm }: any) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('gentleman-user');
  let user = null;
  if (userJson && userJson !== "undefined") {
    try { user = JSON.parse(userJson); } catch (e) { console.error(e); }
  }

  const handleLogout = () => {
    localStorage.removeItem('gentleman-user');
    navigate('/');
    window.location.reload();
  };

  const obtenerSaludoUsuario = () => {
    if (!user || !user.email) return "";
    const email = user.email;
    if (email.includes("@")) {
      const parteNombre = email.split("@")[0];
      return parteNombre.charAt(0).toUpperCase() + parteNombre.slice(1);
    }
    return email;
  };

  const nombreSaludo = obtenerSaludoUsuario();

  return (
    <nav className="top-nav">
      <div className="nav-container">
        
        {/* --- IZQUIERDA: LOGO Y MENÚ CARTA --- */}
        <div className="nav-left-section">
          <Link to="/" className="nav-logo-link">
            <h1 className="nav-logo">
              LA COCINA DEL <span>CAPITÁN</span>
            </h1>
          </Link>

          <div className="nav-dropdown-wrapper" ref={menuRef}>
            <button 
              className="nav-explore-btn"
              onClick={() => setShowNavMenu(!showNavMenu)}
            >
              CARTA ▾
            </button>

            {showNavMenu && (
              <div className="nav-mega-menu">
                <Link to="/explorar?categoria=OFERTAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🔥 OFERTAS</Link>
                <Link to="/explorar?categoria=AL_FUEGO" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🔥 AL FUEGO</Link>
                <Link to="/explorar?categoria=BURGUERS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍔 BURGERS</Link>
                <Link to="/explorar?categoria=PIZZAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍕 PIZZAS</Link>
                <Link to="/explorar?categoria=EMPANADAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🥟 EMPANADAS</Link>
                <Link to="/explorar?categoria=POSTRES" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍰 POSTRES</Link>
                <Link to="/explorar?categoria=BEBIDAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍷 BEBIDAS</Link>
                <div className="menu-divider"></div>
                <Link to="/explorar?categoria=TODOS" className="menu-category-item menu-all-item" onClick={() => setShowNavMenu(false)}>VER TODO EL MENÚ</Link>
              </div>
            )}
          </div>
        </div>

        {/* --- CENTRO: BUSCADOR --- */}
        <div className="nav-search-container">
          <input 
            type="text" 
            placeholder="Buscar sabor..." 
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="nav-search-input"
          />
        </div>

        {/* --- DERECHA: PANEL, CARRITO Y SALIR --- */}
        <div className="nav-right-section">
          {user && (
            <Link to="/admin" className="nav-admin-link">
              PANEL
            </Link>
          )}

          <Link to="/checkout" className="cart-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </Link>

          <div className="auth-btns">
            {user ? (
              <div className="user-nav-info">
                <span className="user-name">
                  HOLA, {nombreSaludo.toUpperCase()}
                </span>
                <button onClick={handleLogout} className="nav-btn btn-exit">
                  SALIR
                </button>
              </div>
            ) : (
              <Link to="/auth?mode=login" className="nav-btn btn-login">
                INGRESAR
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;