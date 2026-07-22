// src/pages/LandingPage.tsx
import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import '../Landing.css';

const LandingPage = ({ products, loading, addToCart, isMaintenance }: any) => {
  const [categoryFilter, setCategoryFilter] = useState('TODOS');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const baseProducts = products ? [...products].reverse() : [];

  const filtered = baseProducts.filter((p: any) => {
    const filtro = categoryFilter.toUpperCase();
    if (filtro === 'TODOS') return true;
    if (filtro === 'OFERTAS') return p.on_sale === true;
    
    const productCat = p.category ? p.category.toUpperCase() : (p.categoria ? p.categoria.toUpperCase() : "");
    return productCat === filtro;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="landing-wrapper" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh', padding: '120px 20px 60px' }}>
      
      {/* HERO / TÍTULO */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: '4.5rem', 
          color: '#F4F1ED', 
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '4px'
        }}>
          LA COCINA DEL <span style={{ color: '#8B0000' }}>CAPITÁN</span>
        </h1>
        <p style={{ color: '#FFCC80', fontSize: '1.2rem', letterSpacing: '3px', marginTop: '10px', textTransform: 'uppercase' }}>
          SABOR A LEÑA Y TRADICIÓN EN CADA PLATO
        </p>
      </div>

      {/* IMAGEN CIRCULAR HERO */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <div style={{
          width: '350px', 
          height: '350px',
          borderRadius: '50%',
          border: '1px solid #8D0606', 
          boxShadow: '0 15px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          backgroundColor: '#2A2A2A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800" 
            alt="Capitán Cocinando" 
            onError={(e: any) => {
              e.target.src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800";
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      </div>

      {/* CONTENEDOR ROJO PRINCIPAL */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="main-red-container" style={{ 
          backgroundColor: '#8D0606', 
          maxWidth: '1300px',
          width: '100%',
          borderRadius: '20px', 
          padding: '40px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '4px solid #A01A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* BARRA DE FILTROS SUPERIOR */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '25px', 
            width: '100%',
            maxWidth: '500px',
            marginBottom: '35px',
            borderBottom: '1px solid rgba(255,204,128,0.2)',
            paddingBottom: '20px'
          }}>
            {['TODOS', 'OFERTAS'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                style={{
                  background: categoryFilter === cat ? 'rgba(255, 204, 128, 0.15)' : 'transparent',
                  border: categoryFilter === cat ? '1px solid #FFCC80' : '1px solid transparent',
                  borderRadius: '25px',
                  padding: '8px 24px',
                  color: categoryFilter === cat ? '#FFCC80' : '#E57373',
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.1rem',
                  fontWeight: categoryFilter === cat ? 'bold' : 'normal',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  textShadow: categoryFilter === cat ? '0 0 10px rgba(255,204,128,0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRILLA DE PRODUCTOS (CONTROLADA PARA MOBILE) */}
          <div 
            className="items-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 320px))', // Máximo 320px por celda para que no se anchen
              gap: '30px',
              width: '100%',
              justifyContent: 'center' // Centra las tarjetas cuando hay solo 1 columna en celulares
            }}
          >
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#FFCC80' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.5rem' }}>AVIVANDO EL FUEGO...</p>
              </div>
            ) : displayProducts.length > 0 ? (
              displayProducts.map((p: any) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  addToCart={addToCart} 
                  isMaintenance={isMaintenance} 
                />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#FFCC80' }}>
                <h2>PRONTO MÁS DELICIAS...</h2>
              </div>
            )}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '20px', 
              marginTop: '40px', 
              paddingTop: '20px', 
              width: '100%',
              borderTop: '1px solid rgba(255,204,128,0.2)' 
            }}>
              <button 
                disabled={page === 1} 
                onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
                style={{ 
                  backgroundColor: page === 1 ? 'transparent' : '#1A1A1A', 
                  color: page === 1 ? '#666' : '#FFCC80',
                  border: '1px solid #FFCC80', 
                  padding: '10px 20px', 
                  borderRadius: '5px', 
                  cursor: page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ANTERIOR
              </button>
              <span style={{ color: '#FFCC80' }}>{page} / {totalPages}</span>
              <button 
                disabled={page >= totalPages} 
                onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
                style={{ 
                  backgroundColor: page >= totalPages ? 'transparent' : '#1A1A1A', 
                  color: page >= totalPages ? '#666' : '#FFCC80',
                  border: '1px solid #FFCC80', 
                  padding: '10px 20px', 
                  borderRadius: '5px', 
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                SIGUIENTE
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LandingPage;