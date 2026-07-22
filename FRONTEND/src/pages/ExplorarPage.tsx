// src/pages/ExplorarPage.tsx
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import '../ExplorarPage.css';

const ExplorarPage = ({ products, addToCart, isMaintenance, loading }: any) => {
  const location = useLocation();

  const categoryFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('categoria') || 'TODOS').toUpperCase();
  }, [location.search]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const activeCategory = selectedCategory !== null ? selectedCategory : categoryFromUrl;
  const baseProducts = products ? [...products].reverse() : [];
  
  const filtered = baseProducts.filter((p: any) => {
    if (activeCategory === 'TODOS') return true;
    if (activeCategory === 'OFERTAS') return p.on_sale === true;
    
    const productCat = p.category 
      ? p.category.toUpperCase() 
      : (p.categoria ? p.categoria.toUpperCase() : '');
      
    return productCat === activeCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className="explore-outer-wrapper">
      <div className="main-red-container">
        
        {/* SIDEBAR FILTROS */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <span className="sidebar-title">LA CARTA</span>
            <div className="filter-buttons-container">
              {[
                { id: 'TODOS', label: 'TODOS' },
                { id: 'OFERTAS', label: 'OFERTAS' },
                { id: 'AL_FUEGO', label: '🔥 AL FUEGO' },
                { id: 'BURGUERS', label: 'BURGUERS' },
                { id: 'PIZZAS', label: 'PIZZAS' },
                { id: 'EMPANADAS', label: 'EMPANADAS' },
                { id: 'POSTRES', label: 'POSTRES' },
                { id: 'BEBIDAS', label: 'BEBIDAS' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* LISTADO PRODUCTOS */}
        <div className="products-section">
          <div className="items-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#FFCC80' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.5rem' }}>AVIVANDO LAS BRASAS...</p>
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                {displayProducts.map((p: any) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    addToCart={addToCart} 
                    isMaintenance={isMaintenance} 
                  />
                ))}
              </>
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

export default ExplorarPage;