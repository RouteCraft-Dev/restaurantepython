// src/components/Footer.tsx
import './Footer.css';

const Footer = () => (
  <footer className="footer-gentleman">
    <div className="footer-container">
      <div className="footer-section">
        <h4 className="footer-title">
          LA COCINA DEL <span>CAPITÁN</span>
        </h4>
        <p className="footer-subtitle">Sabores a leña y tradición de barrio.</p>
      </div>

      <div className="footer-section">
        <span className="footer-label">HORARIOS</span>
        <p className="footer-text">
          Mar - Dom: 11:30 a 15:00 <br />
          y 19:30 a 23:30
        </p>
      </div>

      <div className="footer-section">
        <span className="footer-label">UBICACIÓN</span>
        <p className="footer-text">Calle de los Fuegos 1234, AR</p>
      </div>
    </div>

    <div className="footer-bottom">
      2026 © LA COCINA DEL CAPITÁN - ARTESANOS DEL SABOR
    </div>
  </footer>
);

export default Footer;